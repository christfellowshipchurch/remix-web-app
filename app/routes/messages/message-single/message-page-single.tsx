import { MessageVideo } from "./partials/hero-video.partial";
import { MessageContent } from "./partials/content.partial";
import { InThisSeries } from "./partials/series.partial";
// import { RelatedMessages } from "./partials/related-messages.partial";
import { AdditionalResources } from "~/components";

export function MessageSinglePage() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-[#050A0D] to-[#5B5348] text-white pt-32">
      <MessageVideo />
      <MessageContent />
      <div className="content-padding">
        <div className="w-full max-w-screen-content">
          <div className="mt-24">
            {/* TODO: Add additional resources from Rock */}
            <AdditionalResources
              type="button"
              resources={[
                { title: "Download Discussion Guide", url: "#testing" },
                { title: "Resource", url: "#testing" },
                { title: "Keep Talking with a Group", url: "#testing" },
                { title: "10 Ways to be good with God", url: "#testing" },
                { title: "10 Ways to be good with God", url: "#testing" },
                { title: "Resource", url: "#testing" },
              ]}
              color="white"
            />
          </div>
        </div>
      </div>
      <InThisSeries />
      {/* We will comment this out for now until we have fully defined a way to fetch the related messages */}
      {/* <RelatedMessages /> */}
    </div>
  );
}
