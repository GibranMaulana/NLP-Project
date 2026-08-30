"use client";

import { useState, useEffect } from "react";
import ScenarioPrologue from "./ScenarioPrologue";
import PlayChatBox from "./PlayChatBox";
import type { PlayScenario } from "@/lib/types";

interface Props {
  scenario: PlayScenario;
}

export default function ScenarioContainer({ scenario }: Props) {
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    const chatKey = `nlp_chat_state_${scenario.slug}`;
    const prologueKey = `nlp_prologue_seen_${scenario.slug}`;
    const searchParams = new URLSearchParams(window.location.search);
    const isRestart = searchParams.get("restart") === "true";
    
    if (isRestart) {
      sessionStorage.removeItem(chatKey);
      sessionStorage.removeItem(prologueKey);
      setShowChat(false);
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("restart");
      window.history.replaceState({}, "", url.toString());
    } else {
      const hasSession = sessionStorage.getItem(chatKey);
      if (hasSession) {
        setShowChat(true);
      }
    }
  }, [scenario.slug]);

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
