"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import type { PlayScenario, Stage, Reply } from "@/lib/types";

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
}

interface Props {
  scenario: PlayScenario;
  onRestart?: () => void;
}

export default function PlayChatBox({ scenario, onRestart }: Props) {
  const storageKey = `nlp_chat_state_${scenario.slug}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const batchId = params.batchId as string;
  const restartParam = searchParams.get("restart");

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stages = scenario.stages || [];
  const currentStage: Stage | undefined = stages[currentStageIndex];
  const speakerName = currentStage?.speaker || "Karakter";

  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
  };

  // 1. Restore from sessionStorage on initial load (persists across language toggles / reloads)
  useEffect(() => {
    if (restartParam === "true") {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {}
      if (stages.length > 0) {
        const firstStage = stages[0];
        const initialNpcMsg: Message = {
          id: `npc-init-${firstStage._key || "0"}-${Date.now()}`,
          sender: "npc",
          speakerName: firstStage.speaker || "Karakter",
          text: firstStage.botPrompt,
          timestamp: getFormattedTime(),
        };
        setCurrentStageIndex(0);
        setMessages([initialNpcMsg]);
        setIsCompleted(false);
        setSelectedPatterns([]);
        setIsTyping(false);
      }
      setIsInitialized(true);
      // Clean url
      router.replace(`/b/${batchId}/${scenario.slug}`);
      return;
    }

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed: StoredChatState = JSON.parse(saved);
        if (
          parsed &&
          Array.isArray(parsed.messages) &&
          parsed.messages.length > 0
        ) {
          setCurrentStageIndex(parsed.currentStageIndex || 0);
          setMessages(parsed.messages);
          setIsCompleted(!!parsed.isCompleted);
          setSelectedPatterns(parsed.selectedPatterns || []);
          setIsInitialized(true);
          return;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    // Default initialization if no saved state
    if (stages.length > 0) {
      const firstStage = stages[0];
      const initialNpcMsg: Message = {
        id: `npc-init-${firstStage._key || "0"}`,
        sender: "npc",
        speakerName: firstStage.speaker || "Karakter",
        text: firstStage.botPrompt,
        timestamp: getFormattedTime(),
      };
      setMessages([initialNpcMsg]);
    }
    setIsInitialized(true);
  }, [storageKey, stages, restartParam]);

  // 2. Persist state to sessionStorage whenever it updates
  useEffect(() => {
    if (!isInitialized || messages.length === 0) return;

    try {
      const stateToSave: StoredChatState = {
        currentStageIndex,
        messages,
        isCompleted,
        selectedPatterns,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch {
      // sessionStorage quota or security block handling
    }
  }, [
    isInitialized,
    currentStageIndex,
    messages,
    isCompleted,
    selectedPatterns,
    storageKey,
  ]);

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
        speakerName: firstStage.speaker || "Karakter",
        text: firstStage.botPrompt,
        timestamp: getFormattedTime(),
      };
      setCurrentStageIndex(0);
      setMessages([initialNpcMsg]);
      setIsCompleted(false);
      setSelectedPatterns([]);
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

    // 1. Add User message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      speakerName: "Anda",
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

    const nextIndex = currentStageIndex + 1;

    // 2. Advance to next stage or finish
    if (nextIndex < stages.length) {
      setIsTyping(true);
      const nextStage = stages[nextIndex];

      setTimeout(() => {
        setIsTyping(false);
        setCurrentStageIndex(nextIndex);

        const nextNpcMsg: Message = {
          id: `npc-stage-${nextStage._key || nextIndex}-${Date.now()}`,
          sender: "npc",
          speakerName: nextStage.speaker || "Karakter",
          text: nextStage.botPrompt,
          timestamp: getFormattedTime(),
        };

        setMessages((prev) => [...prev, nextNpcMsg]);
      }, 1100);
    } else {
      // Completed all stages
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setIsCompleted(true);

        const finalNpcMsg: Message = {
          id: `npc-complete-${Date.now()}`,
          sender: "npc",
          speakerName: speakerName,
          text: "Terima kasih telah menanggapi dengan sangat baik. Percakapan ini telah selesai.",
          timestamp: getFormattedTime(),
        };

        setMessages((prev) => [...prev, finalNpcMsg]);
      }, 1000);
    }
  };

  const currentReplies = currentStage?.replies || [];

  return (
    <div className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col bg-[#111116] text-[#e8e8ec]">
      {/* ── Background Atmospheric Light ────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,rgba(41,36,119,0.25)_0%,transparent_70%)]" />
      </div>

      {/* ── Main Chat Layout (Aligned max-w-3xl) ───────────────── */}
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* Inline Top Scenario & Profile Bar (Pas Selebar Chat Box) */}
        <div className="mb-6 flex items-center justify-between border-b border-[#292477]/30 pb-4">
          <h1 className="font-serif-editorial text-xl font-semibold tracking-wide text-[#E9E7F5] sm:text-2xl">
            {scenario.title}
          </h1>

          <div className="flex items-center gap-3">
            {/* Reset / Restart Session button */}
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleResetChat}
                className="cursor-pointer rounded-full border border-[#292477]/40 bg-[#292477]/10 px-3 py-1.5 text-xs text-[#a0a0b0] transition hover:bg-[#292477]/30 hover:text-white"
                title="Mulai Ulang Percakapan"
              >
                <span>↻ Ulangi</span>
              </button>
            )}

            {/* NPC Profile Badge */}
            <div className="flex items-center gap-3 rounded-full border border-[#292477]/40 bg-[#1a1a22]/90 px-4 py-2 shadow-sm">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#292477]/40 text-base">
                <span>👤</span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111116]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E9E7F5]">
                  {speakerName}
                </p>
                <p className="text-[10px] text-[#a0a0b0]">
                  {isTyping ? "Sedang mengetik..." : "Online"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#292477]/40 bg-[#292477]/30 text-base shadow-sm">
                    <span>👤</span>
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F46B3C]/40 bg-[#F46B3C]/20 text-xs font-bold text-[#F46B3C]">
                    <span>Anda</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#292477]/40 bg-[#292477]/30 text-base shadow-sm">
                <span>👤</span>
              </div>
              <div className="rounded-2xl rounded-tl-xs border border-[#292477]/40 bg-[#1a1a24] px-4 py-3 text-xs text-[#a0a0b0]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C] [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F46B3C] [animation-delay:0.4s]" />
                  <span className="ml-2">{speakerName} sedang merespons…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Interactive Replies from Sanity ────────────── */}
        {!isCompleted && currentReplies.length > 0 && (
          <div className="mt-6 border-t border-[#292477]/30 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#7a7a8e]">
              Pilih Tanggapan Anda:
            </p>
            <div className="flex flex-col gap-2">
              {currentReplies.map((reply, idx) => (
                <button
                  key={reply._key || idx}
                  type="button"
                  onClick={() => handleSelectReply(reply)}
                  disabled={isTyping}
                  className="group flex items-start gap-3 rounded-xl border border-[#292477]/50 bg-[#1a1a24]/80 p-3.5 text-left text-sm transition hover:border-[#F46B3C]/60 hover:bg-[#292477]/20 focus-visible:outline-2 focus-visible:outline-[#F46B3C] disabled:opacity-50"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F46B3C]/20 text-xs font-bold text-[#F46B3C] group-hover:bg-[#F46B3C] group-hover:text-white">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[#E9E7F5] group-hover:text-white">
                      {reply.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Completion UI ────────────────────────────── */}
        {isCompleted && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-[#292477]/30 pt-6 pb-4">
            <p className="text-sm text-[#a0a0b0]">Percakapan telah selesai.</p>
            <Link
              href={`/b/${batchId}/${scenario.slug}/diagnosis`}
              className="inline-flex items-center gap-2 rounded-full bg-[#F46B3C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#E0592B]"
            >
              <span>Cek Hasil Diagnosis →</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
