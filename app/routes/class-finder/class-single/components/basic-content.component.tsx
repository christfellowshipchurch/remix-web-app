import { Button } from "~/primitives/button/button.primitive";

export function ClassSingleBasicContent({
  tags,
  // Name of Class
  className,
  summary,
}: {
  tags: string[];
  className: string;
  summary: string;
}) {
  return (
    <div className="w-full pb-20 md:pb-28">
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] lg:text-[52px] font-extrabold leading-tight">
            {className}
          </h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-gray-100 px-2 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* What To Expect */}
        <div className="flex flex-col gap-4 md:gap-9">
          <h2 className="font-extrabold text-lg md:text-[28px]">
            What to Expect
          </h2>
          <p className="md:text-xl">{summary}</p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-6">
            <Button intent="secondary" size="md" href="#todo">
              View Discussion Guide
            </Button>

            <Button intent="secondary" size="md" href="#todo">
              Watch Class Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
