import { CardRow } from "../components/card-row.component";
import { CardColumns } from "../components/card-columns.component";
import { FeaturedVerse } from "../components/featured-verse.component";

export const CardFeed = () => {
  return (
    <div className="w-full bg-white content-padding pb-10 md:pb-12">
      <div className="flex flex-col max-w-[544px] mx-auto">
        <FeaturedVerse />
        {/* Featured */}
        <CardRow title="Featured" cards={mockCards} />
        {/* Events */}
        <CardRow
          title="Events"
          className="!pb-12 md:!pb-20"
          cards={mockCards}
        />
        {/* This Week */}
        <CardColumns />
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
