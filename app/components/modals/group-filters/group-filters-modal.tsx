import { useState } from "react";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { DesktopGroupFilters } from "../../../routes/group-finder/finder/components/group-filters";
import Icon from "~/primitives/icon";
import { cn } from "~/lib/utils";

interface GroupFiltersModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
}

export function GroupFiltersModal({
  ModalButton = Button,
}: GroupFiltersModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild>
        <ModalButton
          onClick={() => setOpenModal(true)}
          intent="secondary"
          className="flex items-center gap-2 border-2 px-8 w-full text-text-primary rounded-[8px]"
        >
          <Icon name="sliderAlt" className="text-navy" />
          All Filters
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <div
          className={cn(
            "flex flex-col gap-2",
            "sm:p-6 mx-6",
            "max-h-[85vh] md:max-h-[90vh]",
            "md:w-[85vw]",
            "overflow-y-scroll",
            "max-w-md",
            "pt-10"
          )}
        >
          <h2 className="heading-h5 text-navy">Filter Your Results</h2>
          <p className="text-sm text-gray-500 mb-4">
            Adjust the filters to find the groups that best fit your needs.
          </p>
          <DesktopGroupFilters />
        </div>
      </Modal.Content>
    </Modal>
  );
}
