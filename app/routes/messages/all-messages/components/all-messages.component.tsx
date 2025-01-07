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

const MessageCard = () => {
  return (
    <div className="w-96 flex flex-col gap-4">
      <img
        className="w-full h-72 object-cover"
        src="https://cloudfront.christfellowship.church/GetImage.ashx?guid=1d311eaf-39ef-40cc-ad42-3e11b89d0051"
        alt="Message thumbnail"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="text-stone-500 text-base font-medium uppercase">
            Series Name
          </span>
          <span className="text-stone-500 text-base font-medium uppercase">
            Pastor
          </span>
        </div>
        <div className="h-px bg-neutral-600/20" />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-800 text-3xl font-extrabold leading-tight">
          Super Cool Event That is Happening very soon
        </h3>
        <a href="#" className="text-neutral-800 text-base font-bold underline">
          Call to Action
        </a>
      </div>
    </div>
  );
};

// TODO: Add filter buttons
export const FilterButtons = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="h-14 justify-start items-center gap-6 inline-flex">
      {tags.map((tag, index) => (
        <div
          key={`${tag.label}-${index}`}
          className={`px-6 py-3 rounded-3xl justify-center items-center gap-2 flex cursor-pointer ${
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
  );
};

export default function Messages() {
  return (
    <section className="relative py-32 p-8 min-h-screen bg-white">
      <div className="relative max-w-xxl mx-auto">
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
