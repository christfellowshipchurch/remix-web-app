import { useState } from "react";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { GroupFilters } from "./group-filters";
import Icon from "~/primitives/icon";

interface GroupFiltersModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
}

const FiltersButton = () => {
  return (
    <Button
      intent="secondary"
      className="flex items-center gap-2 border-2 rounded-none px-8"
    >
      <Icon name="filter" />
      Filters
    </Button>
  );
};

export function GroupFiltersModal({
  ModalButton = FiltersButton,
}: GroupFiltersModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button>
        <ModalButton onClick={() => setOpenModal(true)}>Filters</ModalButton>
      </Modal.Button>
      <Modal.Content>
        <div className="flex flex-col gap-2 p-8 w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-[85vw]">
          <h2 className="heading-h5 text-navy">Filter Your Results</h2>
          <p className="text-sm text-gray-500 mb-4">
            Adjust the filters to find the groups that best fit your needs.
          </p>
          <GroupFilters />
        </div>
      </Modal.Content>
    </Modal>
  );
}
