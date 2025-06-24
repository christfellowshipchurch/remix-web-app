import { useState } from "react";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { Video } from "~/primitives/video/video.primitive";

interface VideoModalProps {
  className?: string;
  videoClassName?: string;
  wistiaId: string;
  intent?: ButtonProps["intent"];
  ModalButton?: React.ComponentType<ButtonProps>;
}

export function VideoModal({
  className,
  videoClassName,
  wistiaId,
  intent = "secondary",
  ModalButton = Button,
}: VideoModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton
          intent={intent}
          onClick={() => setOpenModal(true)}
          className={cn(
            "text-white border-[#FAFAFC] rounded-none border hover:!bg-white/10",
            className
          )}
        >
          Modal Video
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <div className="text-center text-text_primary p-7 md:p-9 w-[90vw] max-w-sm md:max-w-screen lg:max-w-3xl overflow-y-scroll aspect-[9/16] md:aspect-video max-h-[85vh] md:max-h-[90vh]">
          <Video wistiaId={wistiaId} className={videoClassName} />
        </div>
      </Modal.Content>
    </Modal>
  );
}
