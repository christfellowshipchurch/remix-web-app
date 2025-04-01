export const AdditionalInfo = ({
  type,
}: {
  type: "contact" | "resource" | "resource-list";
}) => {
  return (
    <div className="w-full pb-16">
      {type === "contact" && <EventContact />}
      {type === "resource" && <EventResource />}
      {type === "resource-list" && <EventResourceList />}
    </div>
  );
};

const EventContact = () => {
  return <div>EventContact</div>;
};

const EventResource = () => {
  return <div>EventResource</div>;
};

const EventResourceList = () => {
  return <div>InfoSectionList</div>;
};
