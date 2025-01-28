import SectionTitle from "~/components/section-title";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";
import { Icon } from "~/primitives/icon/icon";

export type Tag = {
  label: string;
  isActive: boolean;
};

export const mockTags = [
  { label: "Tag", isActive: true },
  { label: "Mens", isActive: false },
  { label: "Women", isActive: false },
  { label: "Kids & Students", isActive: false },
  { label: "Young Adults", isActive: false },
  { label: "Volunteer", isActive: false },
];

// TODO: Add filter buttons using mock for now
export const FilterButtons = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="relative w-full overflow-x-auto max-w-[90vw]">
      <div className="flex gap-6 flex-nowrap px-1 pb-4">
        {tags.map((tag, index) => (
          <div
            key={`${tag.label}-${index}`}
            className={`text-semiboldshrink-0 px-6 py-3 rounded-full justify-center items-center flex cursor-pointer whitespace-nowrap ${
              tag.isActive
                ? "border border-neutral-600 text-neutral-600"
                : "bg-gray text-neutral-500 hover:bg-neutral-200 transition-colors duration-300"
            }`}
          >
            <div className="text-xl font-semibold font-['Proxima Nova'] leading-7">
              {tag.label}
            </div>
            {tag.isActive && (
              <Icon className="text-ocean ml-2 mr-[-6px]" name="x" size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Messages() {
  return (
    <section className="relative py-32 min-h-screen bg-white content-padding">
      <div className="relative max-w-screen-content mx-auto">
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
