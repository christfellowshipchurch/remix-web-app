import { Link } from "react-router";
import { MessageType } from "~/routes/messages/types";

export const SeriesCard = ({
  message,
  headingClass,
  pClass,
}: {
  message: MessageType;
  headingClass?: string;
  pClass?: string;
}) => {
  const hoverClasses =
    "group-hover:translate-y-[-6px] transition-all duration-300";

  return (
    <Link
      to={`/messages/${message.url}`}
      prefetch="intent"
      className="min-w-[318px] max-w-[350px] group"
    >
      <img
        src={message.coverImage}
        className={`w-full aspect-video rounded-lg ${hoverClasses}`}
      />
      <div
        className={`flex flex-col gap-1 md:gap-2 py-4 bg-transparent ${hoverClasses}`}
      >
        <h3 className={`heading-h6 ${headingClass}`}>{message.title}</h3>
        <p className={`text-[#AAAAAA] font-semibold ${pClass}`}>
          {message.summary}
        </p>
      </div>
    </Link>
  );
};
