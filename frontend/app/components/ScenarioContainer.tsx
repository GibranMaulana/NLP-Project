"use client";

import { useState, useEffect } from "react";
import ScenarioPrologue from "./ScenarioPrologue";
import PlayChatBox from "./PlayChatBox";
import type { PlayScenario } from "@/lib/types";

interface Props {
  scenario: PlayScenario;
}

export default function ScenarioContainer({ scenario }: Props) {
  const [showChat, setShowChat] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const chatKey = `nlp_chat_state_${scenario.slug}`;
      const searchParams = new URLSearchParams(window.location.search);
      const isRestart = searchParams.get("restart") === "true";
      if (isRestart) {
        sessionStorage.removeItem(chatKey);
        sessionStorage.removeItem(`nlp_prologue_seen_${scenario.slug}`);
        return false;
      }
      return !!sessionStorage.getItem(chatKey);
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("restart") === "true") {
        const url = new URL(window.location.href);
        url.searchParams.delete("restart");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  const handleRestart = () => {
    sessionStorage.removeItem(`nlp_prologue_seen_${scenario.slug}`);
    setShowChat(false);
  };

  if (showChat) {
    return <PlayChatBox scenario={scenario} onRestart={handleRestart} />;
  }
  
  return (
    <ScenarioPrologue 
      scenario={scenario} 
      onContinue={() => setShowChat(true)} 
    />
  );
}
