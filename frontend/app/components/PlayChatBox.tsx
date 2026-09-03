"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { PlayScenario, Stage, Reply } from "@/lib/types";
import LanguageToggle from "@/app/components/LanguageToggle";

interface Message {
  id: string;
  sender: "npc" | "user";
  speakerName: string;
  text: string;
  timestamp: string;
  patternType?: string;
}

interface StoredChatState {
  currentStageIndex: number;
  messages: Message[];
  isCompleted: boolean;
  selectedPatterns: string[];
  tension?: number;
  isEarlyTerminated?: boolean;
}

interface Props {
  scenario: PlayScenario;
  onRestart?: () => void;
}

export default function PlayChatBox({ scenario, onRestart }: Props) {
  const params = useParams();
  const batchId = params.batchId as string;
  const storageKey = `nlp_chat_state_${scenario.slug}`;

  const initialTension = scenario.initialTension ?? 1;
  const maxTension = scenario.maxTension ?? 3;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [tension, setTension] = useState(initialTension);
  const [isEarlyTerminated, setIsEarlyTerminated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stages = scenario.stages || [];
  const currentStage: Stage | undefined = stages[currentStageIndex];
  const speakerName = currentStage?.speaker || "Character";

  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  // 1. Initial State Load from sessionStorage or Defaults
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed: StoredChatState = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setCurrentStageIndex(parsed.currentStageIndex ?? 0);
          setMessages(parsed.messages);
          setIsCompleted(parsed.isCompleted ?? false);
          setSelectedPatterns(parsed.selectedPatterns ?? []);
          setTension(parsed.tension ?? initialTension);
          setIsEarlyTerminated(parsed.isEarlyTerminated ?? false);
          setIsInitialized(true);
          return;
        }
      }
    } catch {
      // ignore JSON parse error, fall back to defaults
    }

    // Default initialization
    if (stages.length > 0) {
      const firstStage = stages[0];
      const initialNpcMsg: Message = {
        id: `npc-init-${firstStage._key || "0"}-${Date.now()}`,
        sender: "npc",
        speakerName: firstStage.speaker || "Character",
        text: firstStage.botPrompt,
        timestamp: getFormattedTime(),
      };
      setMessages([initialNpcMsg]);
      setCurrentStageIndex(0);
      setIsCompleted(false);
      setSelectedPatterns([]);
      setTension(initialTension);
      setIsEarlyTerminated(false);
    }
    setIsInitialized(true);
  }, [scenario.slug, storageKey, initialTension]);

  // 2. Persist state on every change once initialized
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToStore: StoredChatState = {
        currentStageIndex,
        messages,
        isCompleted,
        selectedPatterns,
        tension,
        isEarlyTerminated,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToStore));
    } catch {
      // ignore storage quota errors
    }
  }, [currentStageIndex, messages, isCompleted, selectedPatterns, tension, isEarlyTerminated, isInitialized, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
      setTension(initialTension);
      setIsEarlyTerminated(false);
      setIsTyping(false);
    }

    if (onRestart) {
      onRestart();
    }
  };

  const handleSelectReply = (reply: Reply) => {
    if (isTyping || isCompleted) return;

    const timeStr = getFormattedTime();
    const patternTitle = reply.valueType?.title;
    const effect = reply.tensionEffect ?? 0;
    const newTension = Math.max(0, Math.min(maxTension, tension + effect));
    setTension(newTension);

    // 1. Add User message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      speakerName: "You",
      text: reply.text,
      timestamp: timeStr,
      patternType: patternTitle,
    };

    let updatedPatterns = [...selectedPatterns];
    if (patternTitle) {
      updatedPatterns.push(patternTitle);
      setSelectedPatterns(updatedPatterns);
    }

    setMessages((prev) => [...prev, userMsg]);

    // 2. CHECK: Jika tensi mencapai puncak (>= maxTension), picu skenario & ending krisis author!
    if (newTension >= maxTension) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        // 1. Prioritaskan cabang spesifik dari pilihan jawaban terakhir (reply.nextStage)
        // Jika tidak ada garis cabang di jawaban ini, gunakan fallback maxTensionTargetStage skenario
        const targetStageKey = reply.nextStage || scenario.maxTensionTargetStage;
        const targetEndingStageIndex = targetStageKey
          ? stages.findIndex((s) => s._key === targetStageKey)
          : -1;

        if (targetEndingStageIndex !== -1 && targetEndingStageIndex !== currentStageIndex) {
          // Ada babak tujuan (baik dari cabang balasan ini, maupun dari maxTensionTargetStage)
          const endingStage = stages[targetEndingStageIndex];
          setCurrentStageIndex(targetEndingStageIndex);

          const crisisMsgs: Message[] = [];
          const angerDialogue =
            reply.npcReaction ||
            scenario.maxTensionDialogue ||
            "Cukup! Saya tidak bisa melanjutkan pembicaraan seperti ini lagi.";

          crisisMsgs.push({
            id: `npc-crisis-${Date.now()}`,
            sender: "npc",
            speakerName: speakerName,
            text: angerDialogue,
            timestamp: getFormattedTime(),
          });

          crisisMsgs.push({
            id: `npc-stage-ending-${Date.now()}`,
            sender: "npc",
            speakerName: endingStage.speaker || speakerName,
            text: endingStage.botPrompt,
            timestamp: getFormattedTime(),
          });

          setMessages((prev) => [...prev, ...crisisMsgs]);

          // Jika babak ending ini adalah babak akhir (tidak memiliki balasan), selesaikan obrolan
          if (!endingStage.replies || endingStage.replies.length === 0) {
            setIsCompleted(true);
            setIsEarlyTerminated(true);
          }
        } else {
          // Skenario penghentian langsung (Walkout)
          const terminationMsgs: Message[] = [];
          const angerDialogue =
            reply.npcReaction ||
            scenario.maxTensionDialogue ||
            "Cukup! Saya tidak bisa melanjutkan pembicaraan seperti ini lagi. Kita selesai di sini.";

          terminationMsgs.push({
            id: `npc-breakdown-${Date.now()}`,
            sender: "npc",
            speakerName: speakerName,
            text: angerDialogue,
            timestamp: getFormattedTime(),
          });

          terminationMsgs.push({
            id: `sys-alert-${Date.now()}`,
            sender: "npc",
            speakerName: "System",
            text: `⚠️ PERCAKAPAN TERHENTI: Tingkat tensi mencapai batas maksimal (${newTension}/${maxTension}). Emosi lawan bicara memuncak dan pembicaraan tidak dapat dilanjutkan.`,
            timestamp: getFormattedTime(),
          });

          setMessages((prev) => [...prev, ...terminationMsgs]);
          setIsCompleted(true);
          setIsEarlyTerminated(true);
        }
      }, 900);
      return;
    }

    // 3. Normal progression: Check nextStage branching from Branch Editor
    let targetStageIndex = -1;
    if (reply.nextStage) {
      targetStageIndex = stages.findIndex((s) => s._key === reply.nextStage);
    }
    const nextIndex = targetStageIndex !== -1 ? targetStageIndex : currentStageIndex + 1;

    if (nextIndex < stages.length && nextIndex >= 0) {
      setIsTyping(true);
      const nextStage = stages[nextIndex];

      setTimeout(() => {
        setIsTyping(false);
        setCurrentStageIndex(nextIndex);

        const newMsgs: Message[] = [];

        // If reply has NPC spontaneous reaction, show it before botPrompt
        if (reply.npcReaction) {
          newMsgs.push({
            id: `npc-reaction-${Date.now()}`,
            sender: "npc",
            speakerName: speakerName,
            text: reply.npcReaction,
            timestamp: getFormattedTime(),
          });
        }

        // Next stage prompt
        newMsgs.push({
          id: `npc-stage-${nextStage._key || nextIndex}-${Date.now()}`,
          sender: "npc",
          speakerName: nextStage.speaker || "Character",
          text: nextStage.botPrompt,
          timestamp: getFormattedTime(),
        });

        setMessages((prev) => [...prev, ...newMsgs]);

        // Jika nextStage adalah Babak Krisis (Walkout) atau terminal tanpa balasan:
        if (nextStage.phaseType === 'Crisis' || (!nextStage.replies || nextStage.replies.length === 0)) {
          setIsCompleted(true);
          if (nextStage.phaseType === 'Crisis' || newTension >= maxTension) {
            setIsEarlyTerminated(true);
          }
        }
      }, 900);
    } else {
      // Completed all stages normally
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setIsCompleted(true);

        const finalNpcMsg: Message = {
          id: `npc-complete-${Date.now()}`,
          sender: "npc",
          speakerName: speakerName,
          text: reply.npcReaction || "Bedankt voor uw antwoorden. Dit gesprek is nu afgerond.",
          timestamp: getFormattedTime(),
        };

        setMessages((prev) => [...prev, finalNpcMsg]);
      }, 900);
    }
  };

  const currentReplies = currentStage?.replies || [];

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
      <header className="relative z-20 w-full shrink-0 bg-[#111116]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between border-b border-[#292477]/40 px-4 py-3 sm:px-6">
          {/* Left: Avatar + Speaker Name + Online Status (replaces title) */}
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
                Online
              </span>
            </div>
          </div>

          {/* Center: Tension Meter */}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-300 ${
              tension >= maxTension
                ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : tension >= maxTension - 1
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-[#1a1a24] border-[#292477]/40'
            }`}
          >
            <span className="text-[11px] font-semibold text-[#a0a0b0]">Tension:</span>
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: maxTension }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx < tension
                      ? tension >= maxTension
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse'
                        : tension >= maxTension - 1
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'bg-emerald-400'
                      : 'bg-slate-700/60'
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-[11px] font-bold ${
                tension >= maxTension
                  ? 'text-rose-400 animate-pulse'
                  : tension >= maxTension - 1
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              {tension}/{maxTension}
            </span>
          </div>

          {/* Right: Reset + Language Switcher */}
          <div className="chat-header-lang flex items-center gap-2 sm:gap-3">
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
      </header>

      {/* ── Main Quest Objective Banner ───────────────────── */}
      {scenario.mainQuest && (
        <div className="relative z-15 w-full border-b border-[#292477]/40 bg-[#161622]/95 px-4 py-2 sm:px-6 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-3xl items-center gap-2.5 text-xs">

            <span className="font-bold uppercase tracking-wider text-[#F46B3C] shrink-0 text-[10px] sm:text-xs">
              Misi Utama:
            </span>
            <p className="truncate text-[#E9E7F5] font-medium leading-tight" title={scenario.mainQuest}>
              {scenario.mainQuest}
            </p>
          </div>
        </div>
      )}

      {/* ── Scrollable Chat Messages Area ─────────────────── */}
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 sm:px-6">
        {/* Messages List */}
        <div className="flex-1 space-y-4 overflow-y-auto py-4 sm:py-6 pr-1 scroll-smooth">
          {messages.map((msg) => {
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
                      : "rounded-tl-xs border border-[#292477]/40 bg-[#1a1a24] text-[#E9E7F5] shadow"
                  }`}
                >
                  {!isUser && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#F46B3C]">
                      {msg.speakerName}
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
              <div className="flex items-center gap-2">

                <p className={`text-sm font-semibold ${isEarlyTerminated ? 'text-rose-400' : 'text-[#a0a0b0]'}`}>
                  {isEarlyTerminated
                    ? 'Percakapan Terhenti: Tensi emosi memuncak (Walkout)!'
                    : 'Het gesprek is afgerond.'}
                </p>
              </div>
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
