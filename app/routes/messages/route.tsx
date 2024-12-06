import React from "react";
import MessagesHero from "./components/hero.component";
import CurrentSeries from "./components/current.component";

export default function Messages() {
  return (
    <div>
      <MessagesHero />
      <CurrentSeries />
      {/* <AllMessages /> */}
    </div>
  );
}
