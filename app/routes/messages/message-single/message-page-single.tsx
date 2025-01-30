import { MessageVideo } from "./partials/hero-video.partial";
import { MessageContent } from "./partials/content.partial";
import { InThisSeries } from "./partials/series.partial";
import { RelatedMessages } from "./partials/related-messages.partial";

export function MessageSinglePage() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-[#050A0D] to-[#5B5348] text-white pt-32">
      <MessageVideo />
      <MessageContent />
      <InThisSeries />
      <RelatedMessages />
    </div>
  );
}
