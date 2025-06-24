import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import HTMLRenderer from "~/primitives/html-renderer";

export const DailyContent = () => {
  const { dailyDevo } = useLoaderData<LoaderReturnType>();
  const { content, scriptures } = dailyDevo;
  console.log(scriptures);

  return (
    <div className="w-full content-padding pt-16 pb-10">
      <div className="w-full max-w-[1080px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-bold">TODAY'S READING</h2>
          <HTMLRenderer html={content} className="md:text-xl" />

          <blockquote className="border-l-4 border-ocean pl-4">
            <div className="flex flex-col gap-5">
              {scriptures.map((scripture) => (
                <div
                  key={scripture.reference}
                  className="text-text-primary md:text-2xl italic font-normal"
                >
                  {scripture.text} - {scripture.reference}
                </div>
              ))}
            </div>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
