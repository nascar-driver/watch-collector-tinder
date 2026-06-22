"use client";

import { GameProvider, useGame } from "@/app/state/GameProvider";
import { SetupScreen } from "@/app/components/screens/SetupScreen";
import { GameScreen } from "@/app/components/screens/GameScreen";
import { EndScreen } from "@/app/components/screens/EndScreen";

function PhaseRouter() {
  const { state } = useGame();
  switch (state.phase) {
    case "setup":
      return <SetupScreen />;
    case "playing":
      return <GameScreen />;
    case "won":
    case "lost":
      return <EndScreen />;
  }
}

export default function Home() {
  return (
    <GameProvider>
      <PhaseRouter />
    </GameProvider>
  );
}
