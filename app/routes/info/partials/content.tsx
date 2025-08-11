import { EventsComponent } from "../components/events.component";
import { ThisWeekComponent } from "../components/this-week.component";
import { VerseComponent } from "../components/verse.component";

export const Content = () => {
  return (
    <div className="w-full bg-white content-padding pb-10 md:pb-12">
      <div className="flex flex-col max-w-[544px] mx-auto">
        <VerseComponent />
        <EventsComponent title="Featured" cards={mockCards} />
        <EventsComponent
          title="Events"
          className="!pb-12 md:!pb-20"
          cards={mockCards}
        />
        <ThisWeekComponent />
      </div>
    </div>
  );
};

const mockCards = [
  {
    image: "https://picsum.photos/150/150",
    title: "Featured 1",
    description: "Description 1",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "Featured 2",
    description: "Description 2",
  },
  {
    image: "https://picsum.photos/150/150",
    title: "Featured 3",
    description: "Description 3",
  },
];
