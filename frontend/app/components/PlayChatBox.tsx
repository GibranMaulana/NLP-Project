"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { PlayScenario, Stage, Reply } from "@/lib/types";
import LanguageToggle from "@/app/components/LanguageToggle";

export interface ChosenReplyDetail {
  stageIndex: number;
  stageTitle?: string;
  replyText: string;
  patternTitle?: string;
  systemFeedback?: string;
  tensionEffect?: number;
}

interface Message {
  id: string;
  sender: "npc" | "user" | "system";
  speakerName: string;
  text: string;
  timestamp: string;
  patternType?: string;
  feedbackType?: "insight" | "reaction";
}

interface StoredChatState {
  currentStageIndex: number;
  messages: Message[];
  isCompleted: boolean;
  selectedPatterns: string[];
  currentTension: number;
  chosenReplies?: ChosenReplyDetail[];
}

interface Props {
  scenario: PlayScenario;
  onRestart?: () => void;
}

export default function PlayChatBox({ scenario, onRestart }: Props) {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;
  const storageKey = `nlp_chat_state_${scenario.slug}`;

  const stages = scenario.stages || [];
  const maxTension = scenario.maxTension || 3;

  const loadSavedState = (): StoredChatState | null => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed: StoredChatState = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parse error
    }
    return null;
  };

  const [initialState] = useState<StoredChatState | null>(loadSavedState);

  const [currentStageIndex, setCurrentStageIndex] = useState(() => initialState?.currentStageIndex ?? 0);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialState?.messages && initialState.messages.length > 0) {
      return initialState.messages;
    }
    if (stages.length > 0) {
      const firstStage = stages[0];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      return [
        {
          id: `npc-init-${firstStage._key || "0"}-start`,
          sender: "npc",
          speakerName: firstStage.speaker || "Character",
          text: firstStage.botPrompt,
          timestamp: timeStr,
        },
      ];
    }
    return [];
  });
  const [currentTension, setCurrentTension] = useState(() => initialState?.currentTension ?? 1);
  const [chosenReplies, setChosenReplies] = useState<ChosenReplyDetail[]>(() => initialState?.chosenReplies ?? []);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => initialState?.isCompleted ?? false);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>(() => initialState?.selectedPatterns ?? []);
  const [showQuestTooltip, setShowQuestTooltip] = useState(false);

  // Skip Delay State (Persisted in sessionStorage)
  const [skipDelay, setSkipDelay] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("nlp_skip_delay") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  const toggleSkipDelay = () => {
    setSkipDelay((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem("nlp_skip_delay", String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentStage: Stage | undefined = stages[currentStageIndex];
  const speakerName = currentStage?.speaker || "Character";

  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  // 1. Persist state on every change once initialized
  useEffect(() => {
    try {
      const stateToStore: StoredChatState = {
        currentStageIndex,
        messages,
        isCompleted,
        selectedPatterns,
        currentTension,
        chosenReplies,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToStore));
    } catch {
      // ignore storage quota errors
    }
  }, [currentStageIndex, messages, isCompleted, selectedPatterns, currentTension, chosenReplies, storageKey]);

  // 2. Auto-Redirect Watcher if current stage has no reply options or completed
  useEffect(() => {
    if (isTyping) return;

    // If current stage has 0 replies (final prompt stage) or isCompleted is true, trigger auto-redirect to diagnosis
    const hasNoReplies = currentStage && (!currentStage.replies || currentStage.replies.length === 0);
    
    if (hasNoReplies || isCompleted) {
      const redirectTimer = setTimeout(() => {
        router.push(`/b/${batchId}/${scenario.slug}/diagnosis`);
      }, skipDelay ? 200 : 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isTyping, currentStage, isCompleted, batchId, scenario.slug, router, skipDelay]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(() => scrollToBottom(), 120);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleResetChat = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }

    if (stages.length > 0) {
      const firstStage = stages[0];
      const initialNpcMsg: Message = {
        id: `npc-init-${firstStage._key || "0"}-${Date.now()}`,
        sender: "npc",
        speakerName: firstStage.speaker || "Character",
        text: firstStage.botPrompt,
        timestamp: getFormattedTime(),
      };
      setCurrentStageIndex(0);
      setMessages([initialNpcMsg]);
      setIsCompleted(false);
      setSelectedPatterns([]);
      setCurrentTension(1);
      setChosenReplies([]);
      setIsTyping(false);
    }

    if (onRestart) {
      onRestart();
    }
  };

  const handleSelectReply = (reply: Reply) => {
    if (isTyping || isCompleted) return;

    console.log("Selected reply:", reply); // DEBUG
    console.log("System feedback:", reply.systemFeedback); // DEBUG

    const timeStr = getFormattedTime();
    const patternTitle = reply.valueType?.title;

    // Record user choice detail
    const choiceDetail: ChosenReplyDetail = {
      stageIndex: currentStageIndex,
      stageTitle: currentStage?.title || `Fase ${currentStageIndex + 1}`,
      replyText: reply.text,
      patternTitle: patternTitle,
      systemFeedback: reply.systemFeedback,
      tensionEffect: reply.tensionEffect,
    };
    setChosenReplies((prev) => [...prev, choiceDetail]);

    // 1. Add ONLY User message first (User bubble appears immediately)
    const userMsg: Message = {
      id: `user-${reply._key || chosenReplies.length}`,
      sender: "user",
      speakerName: "You",
      text: reply.text,
      timestamp: timeStr,
      patternType: patternTitle,
    };
    setMessages((prev) => [...prev, userMsg]);

    const updatedPatterns = [...selectedPatterns];
    if (patternTitle) {
      updatedPatterns.push(patternTitle);
      setSelectedPatterns(updatedPatterns);
    }

    // 2. Update Tension State
    let updatedTension = currentTension;
    if (typeof reply.tensionEffect === "number") {
      updatedTension = Math.max(0, Math.min(maxTension, currentTension + reply.tensionEffect));
      setCurrentTension(updatedTension);
    }

    // 3. Dynamic Branching Target
    let targetStageIndex = currentStageIndex + 1;
    if (reply.nextStage) {
      const matchedIndex = stages.findIndex(
        (s) => s._key === reply.nextStage || s.title === reply.nextStage
      );
      if (matchedIndex >= 0) {
        targetStageIndex = matchedIndex;
      }
    }

    const bubbleDelay = skipDelay ? 50 : 3300; // 3.3 detik jeda murni PER BUBBLE
    const gapPause = skipDelay ? 50 : 400; // jeda kecil antar langkah

    // Array langkah eksekusi bubble satu per satu
    const steps: Array<() => Promise<void>> = [];

    // Step 1: Reframing Reflection / System Feedback (jika ada)
    if (reply.systemFeedback) {
      steps.push(() => {
        return new Promise((resolve) => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const insightMsg: Message = {
              id: `insight-${Date.now()}`,
              sender: "system",
              speakerName: "System",
              text: reply.systemFeedback!,
              timestamp: getFormattedTime(),
              feedbackType: "insight",
            };
            setMessages((prev) => [...prev, insightMsg]);
            setTimeout(resolve, gapPause);
          }, bubbleDelay);
        });
      });
    }

    // Step 2: NPC Spontaneous Reaction / Reaksi Maya (jika ada)
    if (reply.npcReaction) {
      steps.push(() => {
        return new Promise((resolve) => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const rxMsg: Message = {
              id: `npc-react-${Date.now()}`,
              sender: "npc",
              speakerName: speakerName,
              text: reply.npcReaction!,
              timestamp: getFormattedTime(),
              feedbackType: "reaction",
            };
            setMessages((prev) => [...prev, rxMsg]);
            setTimeout(resolve, gapPause);
          }, bubbleDelay);
        });
      });
    }

    // Step 3: Pertanyaan / Pernyataan Stage Selanjutnya
    if (targetStageIndex < stages.length) {
      const nextStage = stages[targetStageIndex];
      steps.push(() => {
        return new Promise((resolve) => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentStageIndex(targetStageIndex);
            const promptMsg: Message = {
              id: `npc-stage-${nextStage._key || targetStageIndex}-${Date.now()}`,
              sender: "npc",
              speakerName: nextStage.speaker || "Character",
              text: nextStage.botPrompt,
              timestamp: getFormattedTime(),
            };
            setMessages((prev) => [...prev, promptMsg]);

            if (!nextStage.replies || nextStage.replies.length === 0) {
              setIsCompleted(true);
              setTimeout(() => {
                router.push(`/b/${batchId}/${scenario.slug}/diagnosis`);
              }, skipDelay ? 200 : 1800);
            }
            resolve();
          }, bubbleDelay);
        });
      });
    } else {
      // Step 4: Skenario Selesai
      steps.push(() => {
        return new Promise((resolve) => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setIsCompleted(true);
            const finalNpcMsg: Message = {
              id: `npc-complete-${Date.now()}`,
              sender: "npc",
              speakerName: speakerName,
              text: "Dit gesprek is nu afgerond. U wordt doorverwezen naar het diagnose resultaat...",
              timestamp: getFormattedTime(),
            };
            setMessages((prev) => [...prev, finalNpcMsg]);

            setTimeout(() => {
              router.push(`/b/${batchId}/${scenario.slug}/diagnosis`);
            }, skipDelay ? 200 : 1200);
            resolve();
          }, bubbleDelay);
        });
      });
    }

    // Jalankan setiap bubble satu per satu secara berurutan dengan jeda 3.3s
    (async () => {
      for (const step of steps) {
        await step();
      }
    })();
  };

  const currentReplies = currentStage?.replies || [];

  // Calculate Percentage % for Tension Gauge
  const tensionPercent = Math.min(100, Math.max(18, (currentTension / maxTension) * 100));
  const tensionValuePercent = Math.round((currentTension / maxTension) * 100);
  const isHappyEndingPath = currentTension <= 1;
  const isCriticalTension = currentTension >= maxTension;

  return (
    <div className="cinematic-grain cinematic-vignette relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#111116] text-[#e8e8ec]">
      {/* ── Background Atmospheric Light ────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(41,36,119,0.2)_0%,transparent_70%)]" />
      </div>

      {/* ── Fixed Header ─────────────────────────────────── */}
      <header className="relative z-20 w-full shrink-0 bg-[#111116]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between border-b border-[#292477]/40 px-4 py-2.5 sm:px-6">
          {/* Left: Avatar + Speaker Name + Phase */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#292477]/60 bg-[#292477]/30 text-sm sm:text-base shadow-sm">
              <svg className="h-4 w-4 text-[#a0a0b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-[#16161e] bg-emerald-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F46B3C] leading-none">
                {speakerName}
              </span>
              <span className="text-[10px] text-[#a0a0b0] leading-none mt-1">
                Online {currentStage?.phaseType ? `• ${currentStage.phaseType}` : ''}
              </span>
            </div>
          </div>

          {/* Right: Controls (Skip Delay Toggle + Reset + Language) */}
          <div className="chat-header-lang flex items-center gap-2 sm:gap-3">
            {/* Skip Delay / Fast Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleSkipDelay}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                skipDelay
                  ? "border-amber-500/70 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "border-[#292477]/50 bg-[#1a1a24] text-[#a0a0b0] hover:bg-[#292477]/30 hover:text-white"
              }`}
              title={skipDelay ? "Fast Mode Aktif (Tanpa Delay)" : "Klik untuk Skip Delay (Instant)"}
            >
              <span className={skipDelay ? "animate-pulse" : ""}>⚡</span>
              <span>{skipDelay ? "Fast Mode" : "Skip Delay"}</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#292477]/50 bg-[#1a1a24] px-3.5 py-1.5 text-xs font-medium text-[#a0a0b0] transition hover:bg-[#292477]/30 hover:text-white"
              title="Gesprek herstarten"
            >
              <span>↻</span>
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Language Switcher */}
            <LanguageToggle className="scale-[0.8] sm:scale-90 origin-right" />
          </div>
        </div>

        {/* ── Prominent Quest Goal Sub-header Banner ── */}
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between border-b border-[#292477]/30 bg-[#16161e]/80 px-4 py-1.5 sm:px-6 backdrop-blur-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F46B3C]/20 text-xs text-[#F46B3C]">
              🎯
            </span>
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#F46B3C] shrink-0">
              Misi Goal:
            </span>
            <span className="truncate text-xs text-[#E9E7F5] font-medium">
              {isHappyEndingPath
                ? "Redam Tension ≤ 33% untuk Mengunci Happy Ending (Konsensus Berhasil)"
                : isCriticalTension
                ? "Awas Krisis! Gunakan Reframing untuk meredam emosi lawan bicara"
                : "Tension Meningkat! Gunakan kalimat pendalaman untuk kembali ke Happy Path"}
            </span>
          </div>

          <div className="hidden sm:flex shrink-0 items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
              isHappyEndingPath
                ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-300"
                : isCriticalTension
                ? "border-rose-500/40 bg-rose-950/50 text-rose-300"
                : "border-amber-500/40 bg-amber-950/50 text-amber-300"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                isHappyEndingPath ? "bg-emerald-400 animate-pulse" : isCriticalTension ? "bg-rose-500 animate-bounce" : "bg-amber-400"
              }`} />
              <span>{isHappyEndingPath ? "Happy Ending Path ✓" : isCriticalTension ? "Krisis Eskalasi 🚨" : "Warning ⚠️"}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Scrollable Chat Area with Left Vertical Tension Bar ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 items-stretch overflow-hidden px-3 sm:px-6 py-2">
        {/* Tall Vertical Tension Bar on the Left Side of NPC Chat */}
        <div className="flex flex-col items-center justify-center pr-2 sm:pr-3 py-4 shrink-0 border-r border-[#292477]/30 mr-1 sm:mr-2">
          <span className="text-[9px] uppercase font-bold text-[#7a7a8e] tracking-widest [writing-mode:vertical-lr] rotate-180 mb-2">
            Tension Level
          </span>

          {/* Tall Vertical Liquid Bar Column */}
          <div 
            className="relative flex h-32 sm:h-40 w-3.5 sm:w-4 flex-col items-center rounded-full border border-[#292477]/80 bg-[#0d0d12] p-0.5 overflow-hidden shadow-inner cursor-pointer"
            onClick={() => setShowQuestTooltip(!showQuestTooltip)}
            title={`Tension: ${currentTension}/${maxTension}`}
          >
            {/* Ticks on background */}
            <div className="absolute inset-y-1 left-0.5 right-0.5 flex flex-col justify-between pointer-events-none opacity-40 z-10">
              <span className="w-full border-t border-[#7a7a8e]/60" />
              <span className="w-full border-t border-[#7a7a8e]/60" />
              <span className="w-full border-t border-[#7a7a8e]/60" />
              <span className="w-full border-t border-[#7a7a8e]/60" />
            </div>

            {/* Rising Fluid Level */}
            <div 
              className={`w-full rounded-full transition-all duration-700 mt-auto ${
                isCriticalTension
                  ? "bg-gradient-to-t from-rose-700 via-rose-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.9)]"
                  : currentTension >= 2
                  ? "bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  : "bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              }`}
              style={{ height: `${tensionPercent}%` }}
            />
          </div>
        </div>

        {/* Messages List Area */}
        <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto py-2 sm:py-4 pr-1 scroll-smooth">
          {messages.map((msg) => {
            if (msg.sender === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-2 chat-animate-npc">
                  <div className="flex max-w-[90%] items-start gap-2.5 rounded-xl border border-[#F46B3C]/30 bg-[#292477]/25 px-3.5 py-2.5 text-xs text-[#E9E7F5] shadow-sm backdrop-blur-xs">
                    <span className="mt-0.5 text-base shrink-0">💡</span>
                    <div className="flex-1">
                      <span className="font-semibold text-[#F46B3C] mr-1.5 uppercase tracking-wider text-[10px]">
                        Refleksi Reframing:
                      </span>
                      <span className="leading-relaxed text-[#c8c8d4]">{msg.text}</span>
                    </div>
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  isUser ? "justify-end chat-animate-user" : "justify-start chat-animate-npc"
                }`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#292477]/40 bg-[#292477]/30 text-base shadow-sm">
                    <svg className="h-4 w-4 text-[#a0a0b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )}

                <div
                  className={`relative max-w-[88%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed sm:max-w-[78%] sm:text-base ${
                    isUser
                      ? "rounded-tr-xs bg-[#F46B3C] text-white shadow-md"
                      : msg.feedbackType === "reaction"
                      ? "rounded-tl-xs border border-amber-500/40 bg-amber-950/20 text-[#fde68a] italic shadow"
                      : "rounded-tl-xs border border-[#292477]/40 bg-[#1a1a24] text-[#E9E7F5] shadow"
                  }`}
                >
                  {!isUser && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#F46B3C]">
                      {msg.speakerName} {msg.feedbackType === "reaction" ? "(Spontan)" : ""}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <span
                    className={`mt-1.5 block text-right text-[10px] ${
                      isUser ? "text-white/75" : "text-[#7a7a8e]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F46B3C]/50 bg-[#F46B3C]/20 shadow-sm">
                    <svg className="h-4 w-4 text-[#F46B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-animate-typing flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#292477]/40 bg-[#292477]/30 text-base shadow-sm">
                <svg className="h-4 w-4 text-[#a0a0b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div className="rounded-2xl rounded-tl-xs border border-[#292477]/40 bg-[#1a1a24] px-4 py-3 text-xs text-[#a0a0b0]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C] [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C] [animation-delay:0.4s]" />
                  <span className="ml-2">{speakerName} is aan het typen…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Fixed Bottom Answer Panel / Completion ────────── */}
      <footer className="relative z-20 w-full shrink-0 border-t border-[#292477]/30 bg-[#111116]/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6 sm:py-4">
          {!isCompleted && currentReplies.length > 0 && (
            <div className="chat-animate-options">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7a7a8e]">
                Kies Uw Reactie:
              </p>
              <div className="flex flex-col gap-2">
                {currentReplies.map((reply, idx) => (
                  <button
                    key={reply._key || idx}
                    type="button"
                    onClick={() => handleSelectReply(reply)}
                    disabled={isTyping}
                    className="group flex cursor-pointer items-start gap-3 rounded-xl border border-[#292477]/50 bg-[#1a1a24]/90 p-3 sm:p-3.5 text-left text-sm transition-all duration-200 hover:border-[#F46B3C]/60 hover:bg-[#292477]/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#F46B3C] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F46B3C]/20 text-xs font-bold text-[#F46B3C] transition-colors duration-200 group-hover:bg-[#F46B3C] group-hover:text-white">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-[#E9E7F5] transition-colors duration-200 group-hover:text-white">
                        {reply.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
              <p className="text-sm text-[#a0a0b0]">Gesprek afgerond. U wordt doorverwezen naar de diagnose...</p>
              <Link
                href={`/b/${batchId}/${scenario.slug}/diagnosis`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#F46B3C] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#E0592B]"
              >
                <span>Bekijk Diagnose Resultaat →</span>
              </Link>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
