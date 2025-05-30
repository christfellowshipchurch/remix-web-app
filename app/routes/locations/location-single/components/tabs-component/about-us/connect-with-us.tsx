import { Link } from "react-router";
import { SetAReminderModal } from "~/components";
import { Button } from "~/primitives/button/button.primitive";

export const ConnectWithUs = ({
  campusName,
  campusInstagram,
}: {
  campusName: string;
  campusInstagram: string;
}) => {
  return (
    <div className="w-full bg-dark-navy py-28 content-padding flex justify-center">
      <div className="w-full flex flex-col gap-16 max-w-screen-content mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:gap-12 xl:gap-0 justify-between w-full">
          <img
            className="size-full max-w-[500px] xl:max-w-[640px] object-cover aspect-square"
            src="/assets/images/locations/connect.webp"
          />

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center gap-4 text-white">
            <h2 className="font-extrabold text-[40px] lg:text-[52px]">
              Connect With Us
            </h2>
            <p className="lg:text-xl lg:max-w-[520px] text-pretty">
              Follow us on social media to stay in the know with what goes on
              here at this campus.
            </p>
            <Link to={campusInstagram} target="_blank">
              <Button className="w-fit rounded-[8px]">
                {campusName} on Instagram
              </Button>{" "}
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center md:items-start justify-between lg:items-center w-full bg-white p-8 lg:p-12 rounded-[1rem] gap-6 lg:gap-0">
          <div className="flex flex-col  gap-4 lg:gap-6">
            <h2 className="font-extrabold text-2xl lg:text-[2rem]">
              Looking forward to seeing you this weekend!{" "}
            </h2>
            <p className="lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
            </p>
          </div>

          <SetAReminderModal ModalButton={ModalButton} />
        </div>
      </div>
    </div>
  );
};

const ModalButton = () => {
  return (
    <Button className="w-fit rounded-[8px] px-16 lg:w-[155px] lg:px-0 lg:h-[48px] lg:text-base lg:font-normal">
      Set a Reminder
    </Button>
  );
};
