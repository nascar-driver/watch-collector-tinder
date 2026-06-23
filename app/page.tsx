"use client";

import { GameProvider, useGame } from "@/app/state/GameProvider";
import { SetupScreen } from "@/app/components/screens/SetupScreen";
import { GameScreen } from "@/app/components/screens/GameScreen";
import { EndScreen } from "@/app/components/screens/EndScreen";
import { Footer } from "@/app/components/brand/Footer";

function AppShell() {
  const { state } = useGame();
  // The game screen is a full-viewport, no-scroll stream view, so the footer
  // is shown only on the setup and end screens.
  switch (state.phase) {
    case "setup":
      return (
        <>
          <SetupScreen />
          <Footer />
        </>
      );
    case "playing":
      return <GameScreen />;
    case "won":
    case "lost":
      return (
        <>
          <EndScreen />
          <Footer />
        </>
      );
  }
}

export default function Home() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
