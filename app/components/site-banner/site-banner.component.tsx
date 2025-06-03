import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";
import { Icon } from "~/primitives/icon/icon";

export const SiteBanner = ({
  content,
  onClose,
}: {
  content: string;
  onClose: () => void;
}) => {
  return (
    <div className="bg-ocean content-padding flex items-center justify-center w-full sticky top-0 z-999">
      <div className="text-white text-center py-2 flex justify-between items-center w-full">
        <HTMLRenderer html={content || ""} className="w-full" />

        <div className="ml-auto cursor-pointer" onClick={onClose}>
          <Icon name="x" size={32} />
        </div>
      </div>
    </div>
  );
};
