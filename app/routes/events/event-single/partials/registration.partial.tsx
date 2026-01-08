import { useLoaderData } from "react-router-dom";
import { EventSinglePageType } from "../types";
import { SessionRegistration } from "../components/session-registration";
import { ClickThroughRegistration } from "../components/clickthrough-registration.component";

export function RegistrationSection() {
  const { title, sessionScheduleCards } = useLoaderData<EventSinglePageType>();

  return (
    <>
      {/* Session Registration */}
      {sessionScheduleCards && sessionScheduleCards.length > 0 && (
        <SessionRegistration />
      )}

      {/* Click Through Registration */}
      <ClickThroughRegistration title={title} />
    </>
  );
}
