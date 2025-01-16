import { Message } from "../loader";

export const SeriesCard = ({ data }: { data: Message }) => {
  return (
    <a href={data.attributeValues.url.value} className="min-w-[318px]">
      <img src={data.coverImage} className="w-full aspect-video" />
      <div className="flex flex-col gap-2 py-4">
        <h3 className="heading-h6">{data.title}</h3>
        <p className="text-[#AAAAAA] font-semibold">{data.summary}</p>
      </div>
    </a>
  );
};
