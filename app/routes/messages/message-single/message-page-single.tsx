import { MessageVideo } from "./partials/hero-video.partial";
import { MessageContent } from "./partials/content.partial";
import { InThisSeries } from "./partials/series.partial";
import { RelatedMessages } from "./partials/related-messages.partial";
import { AdditionalResources } from "~/components";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";

export function MessageSinglePage() {
  const { message } = useLoaderData<LoaderReturnType>();
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-[#050A0D] to-[#003045] text-white pt-32">
      <MessageVideo />
      <MessageContent />

      <div className="w-full content-padding">
        <div className="w-full max-w-screen-content">
          <div className="mt-24 pb-24 flex justify-start">
            {message.additionalResources.length > 0 && (
              <AdditionalResources
                type="button"
                resources={message.additionalResources}
                color="white"
              />
            )}
          </div>
        </div>
      </div>
      <InThisSeries />
      <RelatedMessages />
    </div>
  );
}
