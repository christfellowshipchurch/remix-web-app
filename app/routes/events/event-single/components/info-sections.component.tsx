export const InfoSection = ({ type }: { type: "blue" | "image" | "list" }) => {
  return (
    <div className="w-full pb-16">
      {type === "blue" && <InfoSectionBlue />}
      {type === "image" && <InfoSectionImage />}
      {type === "list" && <InfoSectionList />}
    </div>
  );
};

const InfoSectionBlue = () => {
  return <div>InfoSectionBlue</div>;
};

const InfoSectionImage = () => {
  return <div>InfoSectionImage</div>;
};

const InfoSectionList = () => {
  return <div>InfoSectionList</div>;
};
