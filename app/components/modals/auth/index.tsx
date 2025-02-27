import { useState } from "react";
import LoginFlow from "./login-flow.component";
import Modal from "~/primitives/Modal";
import { Button } from "~/primitives/button/button.primitive";
import { Link } from "react-router";

export default function AuthModal() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <Link to="#login" className="font-semibold text-neutral-dark">
          Login
        </Link>
      </Modal.Button>
      <Modal.Content>
        <LoginFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
