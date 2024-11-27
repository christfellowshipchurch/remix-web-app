import { useState } from "react";
// import { useAuth } from "providers/AuthProvider"
import LoginFlow from "./login-flow.component";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";

export default function AuthModal() {
  const [openModal, setOpenModal] = useState(false);
  // const { user } = useAuth()

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <Button intent={"secondary"}>Login/Sign Up</Button>
      </Modal.Button>
      {/* {user ? <a href="/protected">My Profile</a> : <Modal.Button className="mr-2">Sign Up</Modal.Button>} */}
      <Modal.Content>
        <LoginFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
