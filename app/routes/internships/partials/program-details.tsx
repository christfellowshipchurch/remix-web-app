import { icons } from "~/lib/icons";
import HTMLRenderer from "~/primitives/html-renderer";
import { Icon } from "~/primitives/icon/icon";

export type ProgramDetailsData = {
  title: string;
  subtitle: string;
  icon?: keyof typeof icons;
  /** When set, shown instead of icon (e.g. summer variant with hourglass, money, housing images). */
  imageSrc?: string;
  description: string;
};

const ProgramDetails = ({
  sectionTitle = "Program Details",
  description,
  data,
}: {
  sectionTitle?: string;
  description: string;
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
          <div className="text-neutral-default text-base md:text-lg">
            <HTMLRenderer html={description} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {data.map((item, index) => (
            <ProgramDetailsContentItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProgramDetailsContentItem = ({ item }: { item: ProgramDetailsData }) => {
  const hasImage = Boolean(item.imageSrc);

  return (
    <div className="flex flex-col gap-4 md:gap-5 p-6 bg-white rounded-xl border border-black/5">
      {hasImage && item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt=""
          className="w-12 h-12 object-contain"
          loading="lazy"
        />
      ) : item.icon ? (
        <Icon name={item.icon} size={30} className="text-ocean" />
      ) : null}

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">
          {item.title}
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-dark-navy">
          {item.subtitle}
        </h3>
      </div>
      <p className="text-[#2F2F2F] text-sm md:text-base leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};

export default ProgramDetails;
