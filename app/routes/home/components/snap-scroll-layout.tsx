import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export default function SnapScrollLayout() {
  return (
    <>
      {chanceContent.map((section, index) => (
        <section
          key={section.title}
          className="flex items-center p-12 snap-center min-h-screen w-full"
          data-card-title={section.title}
          data-card-index={index}
        >
          <img src={section.image} alt={section.title} className="w-1/2" />
          <div className="w-1/2 max-w-xl ml-auto flex flex-col gap-9">
            <div className="flex flex-col">
              <h2 className="text-3xl font-normal text-pretty">
                <HTMLRenderer html={section.title} />
              </h2>
              <p className="text-gray-600 leading-relaxed text-pretty">
                {section.description}
              </p>
            </div>
            <IconButton
              className="rounded-[400px] hover:!text-ocean"
              withRotatingArrow
              iconClasses="!bg-navy"
              to={section.url}
            >
              Learn More
            </IconButton>
          </div>
        </section>
      ))}
    </>
  );
}
