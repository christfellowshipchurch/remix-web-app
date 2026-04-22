import { useLoaderData } from "react-router-dom";
import { EventSinglePageType } from "../types";
import { SessionRegistration } from "../components/session-registration";
import { ClickThroughRegistration } from "../components/clickthrough-registration.component";

export function RegistrationSection() {
  const { title, sessionScheduleCards, groupType } =
    useLoaderData<EventSinglePageType>();

  return (
    <section id="register" className="w-full">
      {/* Session Registration */}
      {sessionScheduleCards && sessionScheduleCards.length > 0 && (
        <SessionRegistration />
      )}

      {/* Click Through Registration — only when there are no session cards */}
      {groupType && <ClickThroughRegistration title={title} />}
    </section>
  );
}
