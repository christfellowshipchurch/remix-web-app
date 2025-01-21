import { useState } from "react";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { GroupFilters } from "./group-filters";

interface GroupFiltersModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
}

export function GroupFiltersModal({
  ModalButton = Button,
}: GroupFiltersModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>Filters</ModalButton>
      </Modal.Button>
      <Modal.Content>
        <GroupFilters />
      </Modal.Content>
    </Modal>
  );
}
