import Icon from "~/primitives/icon";

type Hit = {
  title: string;
  type: "Event" | "Article" | "Message" | "Page" | "Person" | "Podcast";
};

export function HitComponent({ hit }: { hit: Hit }) {
  const getIconName = () => {
    switch (hit.type) {
      case "Article":
        return "file";
      case "Event":
        return "calendarAlt";
      case "Page":
        return "windowAlt";
      case "Message":
        return "moviePlay";
      case "Person":
        return "user";
      case "Podcast":
        return "microphone";
      default:
        return "file"; // Fallback icon
    }
  };

  const iconName = getIconName();

  return (
    <div className="flex gap-2">
      <Icon name={iconName} size={24} />
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{hit.title}</h3>
        <p className="text-[10px] text-[#666666] font-medium">{hit.type}</p>
      </div>
    </div>
  );
}
