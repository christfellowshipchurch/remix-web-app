import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";

export function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

function ModalContent({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=closed]:animate-dialogOverlayHide data-[state=open]:animate-dialogOverlayShow" />
      <Dialog.Content className="fixed sm:h-auto max-h-[90vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-2xl bg-white p-4 text-text-primary shadow data-[state=closed]:animate-dialogContentHide data-[state=open]:animate-dialogContentShow">
        <div
          className={`flex items-center ${
            title ? "justify-between" : "justify-end"
          }`}
        >
          {/* Note: Radix Requires we have a title and description, so we need to use the VisuallyHidden component  */}
          {title ? (
            <Dialog.Title className="text-3xl font-bold">{title}</Dialog.Title>
          ) : (
            <VisuallyHidden.Root>
              <Dialog.Title />
            </VisuallyHidden.Root>
          )}
          <Dialog.Close>
            <Cross2Icon width={24} height={24} color="black" />
          </Dialog.Close>
        </div>
        {description ? (
          <Dialog.Description className="mb-4 text-lg text-text_primary">
            {description}
          </Dialog.Description>
        ) : (
          <VisuallyHidden.Root>
            <Dialog.Description />
          </VisuallyHidden.Root>
        )}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
