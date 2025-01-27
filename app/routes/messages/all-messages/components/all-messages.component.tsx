import SectionTitle from "~/components/section-title";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";

export type Tag = {
  label: string;
  isActive: boolean;
};

export const mockTags = [
  { label: "Recent", isActive: true },
  { label: "Topic or Tag", isActive: false },
  { label: "Topic or Tag", isActive: false },
  { label: "Topic or Tag", isActive: false },
  { label: "Topic or Tag", isActive: false },
];

// TODO: Add filter buttons using mock for now
export const FilterButtons = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="relative w-full">
      <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 flex-nowrap px-1 pb-4">
          {tags.map((tag, index) => (
            <div
              key={`${tag.label}-${index}`}
              className={`shrink-0 px-6 py-3 rounded-3xl justify-center items-center flex cursor-pointer whitespace-nowrap ${
                tag.isActive
                  ? "border border-neutral-600 text-neutral-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <div className="text-xl font-semibold font-['Proxima Nova'] leading-7">
                {tag.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Messages() {
  return (
    <section className="relative py-32 p-8 min-h-screen bg-white">
      <div className="relative max-w-6xl mx-auto">
        <SectionTitle
          className="mb8"
          sectionTitle="all messages."
          title="Christ Fellowship Church Messages"
        />
        {/* Filter Buttons - just placeholder ones for now */}
        <div className="mt-10 mb-12">
          <FilterButtons tags={mockTags} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <ContentCard
              key={`message-card-${index}`}
              image="https://cloudfront.christfellowship.church/GetImage.ashx?guid=1d311eaf-39ef-40cc-ad42-3e11b89d0051"
              title="Message Title"
              subheadings={[
                { title: "Series Name" },
                { icon: "user", title: "Pastor Name" },
              ]}
              cta={{
                title: "Learn More",
                href: "#",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
