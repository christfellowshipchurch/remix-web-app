import { icons } from "~/lib/icons";
import HTMLRenderer from "~/primitives/html-renderer";
import { Icon } from "~/primitives/icon/icon";

export type ProgramDetailsData = {
  title: string;
  subtitle: string;
  icon: keyof typeof icons;
  description: string;
};

const ProgramDetails = ({
  sectionTitle = "Key Program Details",
  description,
  data,
}: {
  sectionTitle?: string;
  description?: string;
  data: ProgramDetailsData[];
}) => {
  return (
    <section
      className="content-padding w-full py-12 md:py-20 bg-[#F5F5FA]"
      id="program-details"
    >
      <div className="max-w-screen-content mx-auto w-full flex flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-dark-navy text-[24px] md:text-[40px] font-bold">
            {sectionTitle}
          </h2>
          {description && (
            <div className="text-neutral-default text-base leading-[23.2px]">
              <HTMLRenderer html={description} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {data.map((item, index) => (
            <ProgramDetailsContentItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProgramDetailsContentItem = ({ item }: { item: ProgramDetailsData }) => {
  return (
    <div className="flex flex-col gap-4 md:gap-5 p-6 bg-white rounded-xl border border-black/5">
      <div className="flex items-center justify-center size-10 bg-ocean-subdued rounded-full">
        <Icon name={item.icon} size={20} className="text-ocean" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[1.5px] text-ocean">
          {item.title}
        </p>
        <h3 className="text-xl font-bold text-dark-navy">{item.subtitle}</h3>
      </div>
      <p className="text-neutral-default text-sm">{item.description}</p>
    </div>
  );
};

export default ProgramDetails;
