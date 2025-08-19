export const CardColumns = () => {
  // Group cards into sets of three
  const cardGroups = [];
  for (let i = 0; i < mockCards.length; i += 3) {
    cardGroups.push(mockCards.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col pt-4 pb-12 md:pt-8 md:pb-20 gap-6 w-full">
      <h2 className="text-2xl font-extrabold">This Week</h2>
      <div className="flex gap-4 overflow-x-auto md:overflow-x-hidden scrollbar-hide">
        {cardGroups.map((group, groupIndex) => (
          <div className="flex flex-col gap-4 min-w-[310px]" key={groupIndex}>
            {group.map((card, cardIndex) => (
              <div className="flex gap-4" key={cardIndex}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="rounded-[12px] size-16 shadow-md"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold">{card.title}</h3>
                  <p className="-mt-2 text-sm">{card.description}</p>
                  <p className="text-xs text-text-secondary">{card.date}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const mockCards = [
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 1",
    description: "Description 1",
    date: "2021-01-01",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 2",
    description: "Description 2",
    date: "2021-01-02",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 3",
    description: "Description 3",
    date: "2021-01-03",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 1",
    description: "Description 1",
    date: "2021-01-01",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 2",
    description: "Description 2",
    date: "2021-01-02",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "This Week 3",
    description: "Description 3",
    date: "2021-01-03",
  },
];
