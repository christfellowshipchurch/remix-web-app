import { useLoaderData } from "react-router-dom";
import { EventSinglePageType, SessionRegistrationCardType } from "../types";
import Icon from "~/primitives/icon";
import { Button } from "~/primitives/button/button.primitive";

export function SessionRegistration() {
  const { title, sessionScheduleCards } = useLoaderData<EventSinglePageType>();
  return (
    <section
      className="w-full py-8 md:py-16 content-padding bg-gray"
      id="register"
    >
      <div className="w-full flex flex-col gap-4 mx-auto text-center max-w-xl">
        <h2 className="heading-h3 text-center">Get Tickets for {title}</h2>
        <p className="text-gray-500">
          Choose your location and get your tickets for this {title} event
          {sessionScheduleCards &&
            sessionScheduleCards.length > 0 &&
            ` on ${sessionScheduleCards[0].date}`}
          .
        </p>
        <h3 className="font-bold text-black text-lg mt-10">
          Choose your experience
        </h3>
        <p className="text-gray-500">
          Select your location for {title}. Each location offers the same great
          experience with Earl McLean and Pastor Todd Mullins.
        </p>
      </div>
      <div className="w-full max-w-screen-content gap-4 mx-auto text-center mt-8 flex justify-center flex-wrap">
        {sessionScheduleCards &&
          sessionScheduleCards.length > 0 &&
          sessionScheduleCards.map((card) => (
            <SessionRegistrationCard key={card.title} card={card} />
          ))}
      </div>
      <p className="text-gray-500 text-xs text-center mt-8">
        By clicking “Get Tickets,” you will be redirected to our secure
        ticketing partner to complete your registration.{" "}
      </p>
    </section>
  );
}

const SessionRegistrationCard = ({
  card,
}: {
  card: SessionRegistrationCardType;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col text-left w-[248px] h-[374px] relative">
      {/* Location Section */}
      <div className="flex flex-2 gap-4 items-start">
        <div className="bg-navy-subdued rounded-lg p-3 flex-shrink-0">
          <Icon name={card.icon} color="currentColor" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-semibold">{card.title}</h4>
          <p className="text-gray-500 text-sm leading-tight mt-1">
            {card.description}
          </p>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="flex flex-col flex-3 gap-3">
        {/* Date */}
        <div className="flex items-center gap-3">
          <Icon
            name="calendarAlt"
            size={20}
            className="flex-shrink-0 text-ocean"
          />
          <p className="text-sm text-gray-500">{card.date}</p>
        </div>

        {/* Party Time */}
        {card.partyTime && (
          <div className="flex items-center gap-3">
            <Icon
              name="timeFive"
              size={20}
              className="flex-shrink-0 text-ocean"
            />
            <p className="text-sm text-gray-500">Party at {card.partyTime}.</p>
          </div>
        )}

        {/* Program Time */}
        {card.programTime && (
          <div className="flex items-center gap-3">
            <Icon
              name="timeFive"
              size={20}
              className="flex-shrink-0 text-ocean"
            />
            <p className="text-sm text-gray-500">
              Program starts at {card.programTime}
            </p>
          </div>
        )}

        {/* Additional Info */}
        {card.additionalInfo && (
          <div className="flex items-center gap-3">
            <Icon
              name="foodMenu"
              size={20}
              className="flex-shrink-0 text-ocean"
            />
            <p className="text-sm text-gray-500">{card.additionalInfo}</p>
          </div>
        )}
      </div>

      {/* Get Tickets Button */}
      <div className="mt-auto absolute bottom-0 left-0 w-full px-4 pb-4">
        <Button intent="primary" href={card.url} size="md" className="w-full">
          Get Tickets
        </Button>
      </div>
    </div>
  );
};
