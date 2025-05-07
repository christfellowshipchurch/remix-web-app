import HTMLRenderer from "~/primitives/html-renderer";
import { chanceContent } from "./a-chance.data";
import { cn } from "~/lib/utils";

export default function SplitScrollLayout() {
  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {chanceContent.map((section) => (
          <div
            key={section.title}
            className="h-screen flex flex-col items-center p-6"
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-64 object-cover rounded mb-6"
            />
            <div>
              <h2 className="text-3xl font-normal">
                <HTMLRenderer html={section.title} />
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sticky Stack */}
        <div className="w-1/2 relative">
          {chanceContent.map((section, index) => (
            <div
              key={section.title}
              className={cn(
                index === 0 ? "h-[80vh]" : "h-screen",
                "flex",
                "items-center",
                "px-6"
              )}
            >
              <div className="sticky top-1/2 -translate-y-1/2 p-6 z-10 w-full max-w-md mx-auto">
                <img
                  src={section.image}
                  alt={section.title}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Scrolling Content */}
        <div className="w-1/2">
          {chanceContent.map((section, index) => (
            <div
              key={section.title}
              className={cn(
                index === 0 ? "h-[80vh]" : "h-screen",
                "flex",
                "items-center",
                "p-12"
              )}
            >
              <div>
                <h2 className="text-3xl font-normal">
                  <HTMLRenderer html={section.title} />
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
