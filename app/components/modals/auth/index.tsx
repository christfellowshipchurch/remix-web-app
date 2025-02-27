import { useState } from "react";
import LoginFlow from "./login-flow.component";
import Modal from "~/primitives/Modal";

export default function AuthModal() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button className="mr-2 font-semibold text-neutral-dark cursor-pointer hover:text-ocean transition-colors">
        Login
      </Modal.Button>
      <Modal.Content>
        <LoginFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
