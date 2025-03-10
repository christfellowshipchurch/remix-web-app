import { Button } from "~/primitives/button/button.primitive";
import { PodcastEpisode } from "../../podcasts-details/loader";

export function EpisodeNotes({
  content,
  resources,
}: {
  content: PodcastEpisode["content"];
  resources: PodcastEpisode["resources"];
}) {
  return (
    <div className="w-full bg-white content-padding">
      <div className="flex flex-col gap-16 max-w-screen-content mx-auto py-16 md:py-20 md:px-12 lg:px-24">
        <div>
          <h2 className="text-[32px] font-extrabold">Episode Notes</h2>
          <div className="mt-8">
            <div
              className="prose max-w-[90vw] md:max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        <div>
          <h2 className="text-[32px] font-extrabold">Additional Resources</h2>
          <div className="flex flex-wrap gap-6 mt-2">
            {resources.map((resource, index) => (
              <Button
                key={index}
                intent="secondary"
                href={resource.url}
                size="sm"
              >
                {resource.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
