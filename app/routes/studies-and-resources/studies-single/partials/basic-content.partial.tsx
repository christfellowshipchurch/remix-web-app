import { Button } from "~/primitives/button/button.primitive";
import { StudyHitType } from "../../types";
import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";

export function StudySingleBasicContent({ hit }: { hit: StudyHitType }) {
  const { title, topic, summary, duration, format } = hit;

  return (
    <div className="w-full pb-12 lg:pb-16 xl:pb-20">
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] lg:text-[52px] font-extrabold leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {/* <TagItem icon="tag" label={topic} />
            <TagItem icon="location" label={format} /> */}
          </div>
        </div>

        <p className="md:text-xl">{summary}</p>
      </div>
    </div>
  );
}

const TagItem = ({ icon, label }: { icon: IconName; label: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="size-4" />
      <span className="text-sm">{label}</span>
    </div>
  );
};
