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
        <div className="w-[700px] h-[500px] p-10">
          <Video wistiaId={wistiaId} className={videoClassName} />
        </div>
      </Modal.Content>
    </Modal>
  );
}
