import React from "react";
import { MessageVideo } from "./partials/hero-video.partial";
import { MessageContent } from "./partials/content.partial";
import { InThisSeries } from "./partials/series.partial";
import { RelatedMessages } from "./partials/related-messages.partial";

export function MessageSinglePage() {
  return (
    <div>
      <MessageVideo />
      <MessageContent />
      <InThisSeries />
      <RelatedMessages />
    </div>
  );
}
