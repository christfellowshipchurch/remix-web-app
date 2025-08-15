export const EventsComponent = ({
  title,
  cards,
  className,
}: {
  title: string;
  cards: { image: string; title: string; description: string }[];
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col pt-4 pb-6 sm:pb-8 md:pt-8 gap-6 w-full ${className}`}
    >
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <div className="flex gap-2 w-full overflow-x-auto pb-2 sm:pb-0">
        {cards.map((card, index) => (
          <div key={index} className="flex flex-col gap-2 min-w-[162px]">
            <img
              src={card.image}
              alt={card.title}
              className="rounded-[1rem] w-full h-[112px]"
            />
            <div className="flex flex-col">
              <h3 className="font-bold">{card.title}</h3>
              <p className="text-xs -mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
