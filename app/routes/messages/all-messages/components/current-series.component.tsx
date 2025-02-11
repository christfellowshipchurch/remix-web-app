import React from "react";
import SectionTitle from "~/components/section-title";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

const CurrentSeries: React.FC = () => {
  return (
    <section className="relative py-32 min-h-screen bg-white content-padding">
      {/* Light Blue Background - Bottom Half */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[#F3F5FA]" />

      {/* Content Container */}
      <div className="relative max-w-screen-content mx-auto">
        {/* Title Section */}
        <SectionTitle
          className="mb-8"
          sectionTitle="current series."
          title="Timeless Truths For Truthless Times"
        />

        {/* Content Section */}
        <div className="relative w-full aspect-video">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://cloudfront.christfellowship.church/GetImage.ashx?guid=1d311eaf-39ef-40cc-ad42-3e11b89d0051')",
            }}
          />

          {/* Text Section */}
          <div className="absolute bottom-0 left-0 w-full md:w-[45%] bg-white px-10 py-16 space-y-4">
            <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
            <h2 className="text-[40px] font-bold text-text-primary">
              What is Truth?
            </h2>
            <p className="font-bold">Pastor Ryan McDermott</p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>

            {/* Buttons */}
            <div className="flex pt-10 space-x-4">
              <Button intent="secondary">Series & Resources</Button>
              <Button intent="primary" className="flex items-center gap-2">
                Watch Message
                <Icon name="arrowRight" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentSeries;
