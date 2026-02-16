import { SectionTitle } from "~/components/section-title";
import { ClassSearch } from "./partials/class-search.partial";
import { Button } from "~/primitives/button/button.primitive";

export function ClassFinderPage() {
  return (
    <div className="flex flex-col min-h-[100svh]">
      <div className="flex-none">
        <div className="flex flex-col items-center w-full">
          {/* Hero Section */}
          <section className="py-2 lg:pt-12 xl:pt-20 lg:h-[65vh] lg:max-h-[650px] content-padding">
            <div className="container max-w-screen-content grid items-center justify-center sm:grid-cols-2 lg:grid-cols-5 gap-16 md:gap-8 mx-auto">
              <img
                src="/assets/images/classes-hero.webp"
                alt="Mission"
                className="w-full max-w-[400px] lg:max-w-none rounded-lg lg:col-span-2 order-1 md:mt-6 lg:mt-0"
              />
              <div className="col-span-1 lg:col-span-3 order-2 pt-8">
                <SectionTitle sectionTitle="learn together" />
                <h3 className="text-[40px] md:text-5xl font-extrabold my-6">
                  Discover Classes For You
                </h3>
                <div className="text-lg text-text-secondary">
                  <p className="hidden lg:block">
                    Christ Fellowship is a church in South Florida with a
                    passion to help you know God and grow in your relationships
                    so that you can discover your purpose and impact the world.
                    We believe that church isn’t just a building you walk into,
                    but a family you can belong to—so whether you call one of
                    our many locations home or join from home, church is
                    wherever you are! Led by senior pastors Todd & Julie
                    Mullins, God has given us a vision to lead a radical
                    transformation for Jesus Christ in this region and beyond.
                    Everyone, Everyday, Everywhere.
                  </p>
                  <p className="lg:hidden">
                    Christ Fellowship is a church in South Florida with a
                    passion to help you know God and grow in your relationships
                    so that you can discover your purpose
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    intent="secondary"
                    className="hidden md:block text-base font-normal"
                    href="#search"
                  >
                    Help me to find a Class
                  </Button>
                  <Button className="text-base font-normal" href="#todo">
                    Lead a Class
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full">
        <ClassSearch />
      </div>
    </div>
  );
}
