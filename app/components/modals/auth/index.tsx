import { useState } from "react";
import LoginFlow from "./login-flow.component";
import Modal from "~/primitives/Modal";

const defaultButtonStyle =
  "mr-2 font-semibold text-neutral-dark cursor-pointer hover:text-ocean transition-colors";

export default function AuthModal({
  buttonStyle = defaultButtonStyle,
}: {
  buttonStyle?: string;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button className={buttonStyle}>Login</Modal.Button>
      <Modal.Content>
        <LoginFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
