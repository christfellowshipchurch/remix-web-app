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
  description,
  data,
}: {
  description: string;
  data: ProgramDetailsData[];
}) => {
  return (
    <div className="content-padding w-full pt-20 pb-30" id="program-details">
      <div className="max-w-screen-content mx-auto w-full flex flex-col gap-8 md:gap-24 lg:gap-33">
        <div className="flex flex-col gap-8">
          <h2 className="text-dark-navy text-[24px] md:text-[52px] font-bold">
            Program Details
          </h2>
          <div className="text-neutral-default">
            <HTMLRenderer html={description} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {data.map((item, index) => (
            <ProgramDetailsContentItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgramDetailsContentItem = ({ item }: { item: ProgramDetailsData }) => {
  return (
    <div className="w-full flex-1 flex flex-col gap-[30px] py-5 pl-6 pr-10 md:px-4 lg:pl-12 lg:pr-20 border-l border-ocean text-dark-navy">
      <div className="flex items-start">
        <Icon name={item.icon} size={30} className="text-ocean" />
      </div>

      <h3 className="text-[22px] md:text-[26px] lg:text-[30px] font-bold">
        {item.title}
      </h3>
      <h4 className="font-semibold">{item.subtitle}</h4>
      <p>{item.description}</p>
    </div>
  );
};

export default ProgramDetails;
