type Series = {
  attributeValues: {
    url: {
      value: string;
    };
  };
  coverImage: string;
};

export const OtherSeriesCard = ({ series }: { series: Series }) => {
  return (
    <a href={series.attributeValues.url.value} className="w-full aspect-video">
      <img src={series.coverImage} className="size-full object-cover" />
    </a>
  );
};
