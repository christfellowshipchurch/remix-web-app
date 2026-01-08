import { forwardRef } from "react";
import { SetAReminderModal } from "~/components";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { ButtonProps } from "~/primitives/button/button.primitive";
import { Video } from "~/primitives/video/video.primitive";

export const WhatToExpect = ({
  setReminderVideo,
  isOnline,
}: {
  setReminderVideo: string | null | undefined;
  isOnline?: boolean;
}) => {
  return (
    <div className="w-full rounded-t-[24px] md:rounded-none bg-gray pt-36 md:pt-40 pb-20 lg:pb-28 content-padding flex justify-center">
      <div className="w-ful flex flex-col lg:flex-row gap-12 xl:gap-20 items-center justify-center max-w-screen-content mx-auto">
        {/* Left Side */}
        {!isOnline && setReminderVideo && (
          <div className="flex-1 w-full lg:flex-auto lg:w-5/7 xl:w-4/7">
            <Video wistiaId={setReminderVideo} className="w-full h-[414px] aspect-73/41 rounded-[1rem]" />
          </div>
        )}

        {/* Right Side */}
        <div
          className={cn(
            "flex flex-1 w-full flex-col gap-6",
            "lg:flex-auto",
            !isOnline && setReminderVideo && "lg:w-3/7 lg:max-w-[616px] xl:w-3/7",
            (isOnline || !setReminderVideo) && "lg:w-full lg:max-w-[964px] lg:items-center",
          )}
        >
          <h2 className="font-extrabold text-[24px] md:text-[36px] lg:text-[48px] xl:text-[52px]">
            What to Expect
          </h2>
          <div
            className={cn(
              "flex flex-col gap-6",
              isOnline && "lg:flex-row lg:gap-16"
            )}
          >
            <div className={cn("flex flex-col gap-6", isOnline && "lg:flex-1")}>
              <ExpectItem
                title="Come As You Are, Seriously!"
              description="Comfortable clothes are the norm—no need to dress up to check out a service."
              />
              <ExpectItem
                title="Messages That Speak to Real Life (in about 1 hour)"
                description="Engaging and inspiring, Bible-based messages that connect with everyday challenges and questions."
              />
            </div>

            <div className={cn("flex flex-col gap-6", isOnline && "lg:flex-1")}>
              <ExpectItem
                title="Friendly Faces and Helpful People"
                description="We’re here to help you feel comfortable from the moment you arrive."
              />
              <ExpectItem
                title="Kids Have Fun Too! "
                description="Safe and engaging programs are available for newborns through 5th grade (adjust the age ranges based on each campus) during the service."
              />
            </div>
          </div>

          {/* Button */}
          <div className={cn("flex", isOnline && "mt-4 lg:t-8")}>
            <SetAReminderModal
              ModalButton={ModalButton}
              className={`${
                isOnline
                  ? "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy rounded-lg"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        intent="primary"
        className={cn(
          "font-normal text-base !rounded-lg !bg-ocean !text-white hover:!bg-navy",
          className
        )}
        {...props}
      >
        {children ?? "Set a Reminder"}
      </Button>
    );
  }
);

ModalButton.displayName = "ModalButton";

const ExpectItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};
