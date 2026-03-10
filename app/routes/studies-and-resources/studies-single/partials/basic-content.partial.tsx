import { Link } from "react-router-dom";
import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { StudyHitType } from "../../types";
import { CurriculumItem } from "../components/curriculum-item.component";

export function StudySingleBasicContent({ hit }: { hit: StudyHitType }) {
  const { title, description, audience, source, duration, format } = hit;

  return (
    <div className="w-full pb-12 lg:pb-16 xl:pb-20">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] lg:text-[52px] font-extrabold leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <StudiesTagItem icon="bible" label={format} />
            <StudiesTagItem icon="alarm" label={duration} />
            <StudiesTagItem icon="user" label={audience} />
            <StudiesTagItem icon="church" label={source} />
          </div>

          {/* Mobile Top Side */}
          <div className="md:hidden">
            <RightSide title={title} source={source} />
          </div>

          <div className="flex flex-col gap-4 mt-8 md:mt-12">
            <h2 className="text-lg font-extrabold md:hidden">About</h2>
            <HTMLRenderer
              html={description}
              className="text-text-primary md:text-lg md:font-medium "
            />
          </div>

          {/* Desktop Curriculum Section */}
          <div className="hidden md:flex flex-col gap-5.5 md:mt-12 p-4 pb-8 rounded-2xl border border-[#ECEBEF] bg-gray">
            <h3 className="text-lg font-semibold text-black leading-tight">
              Curriculum
            </h3>
            <div className="flex flex-col gap-4">
              <CurriculumItem
                title="Week 1: Getting Started"
                subtitle="Release date: June 12, 2024"
                items={[
                  {
                    type: "Video",
                    description: "Week 1: Getting Started",
                    wistiaId: "wcs977y9ac",
                  },
                ]}
              />
              <CurriculumItem
                title="Week 1: Getting Started"
                subtitle="Release date: June 12, 2024"
                items={[
                  {
                    type: "Video",
                    description: "Week 1: Getting Started",
                    wistiaId: "wcs977y9ac",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Desktop Right side */}
        <div className="hidden md:block">
          <RightSide title={title} source={source} />
        </div>
      </div>
    </div>
  );
}

const RightSide = ({ title, source }: { title: string; source: string }) => {
  return (
    <div className="w-full md:max-w-[324px] flex flex-col mt-12 rounded-2xl overflow-hidden">
      <div className="w-full flex gap-2.5 items-center px-6 py-8 bg-gray">
        <div className="size-[82px] flex items-center justify-center bg-white p-2 rounded-[12px]">
          <img
            src="/cf-logo.png" // TODO: Update to Source Image
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-fit flex flex-col gap-0.5 text-sm font-semibold text-neutral-default">
          <p>Created by:</p>
          <h3 className="font-bold text-text-primary">{source}</h3>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6 px-6 py-8 bg-dark-navy text-white">
        <Button intent="secondaryWhite" size="md" className="w-full">
          Video Preview
        </Button>
        <Button intent="secondaryWhite" size="md" className="w-full">
          Discussion Guide Preview
        </Button>
        <Button intent="primary" size="md" className="w-full">
          Start Study
        </Button>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-extrabold leading-tight">
            More Information
          </h3>
          <p className="text-neutral-lighter leading-tight">
            This curriculum is designed to help you learn more about the Bible
            and how to apply it to your life.
          </p>
          <Link
            to={"mailto:groups@christfellowship.church"}
            className="underline mt-1"
          >
            groups@christfellowship.church
          </Link>
        </div>
      </div>
    </div>
  );
};

export const StudiesTagItem = ({
  icon,
  label,
}: {
  icon?: IconName;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2 bg-[#EBEBEB] w-fit rounded-sm text-xs font-semibold px-2 py-1">
      {icon && <Icon name={icon} size={16} color="black" />}
      <span>{label}</span>
    </div>
  );
};
