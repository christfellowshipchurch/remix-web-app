import React from "react";

const CurrentSeries: React.FC = () => {
  return (
    <section className="py-16 bg-white p-8 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Light Blue Background */}
        <div className="absolute top-[338px] left-0 w-full h-full bg-blue-50 z-0"></div>
      </div>
      <div className="relative max-w-xxl mx-auto z-10">
        {/* Title Section */}
        <div className="flex items-center gap-5">
          <div className="w-6 bg-ocean h-1 mb-4" />
          <h2 className="font-bold text-ocean mb-4">current series</h2>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Timeless Truths For Truthless Times
        </h1>

        {/* Content Section */}
        <div className="pt-48 grid grid-cols-1 md:grid-cols-2 items-center bg-[url('https://cloudfront.christfellowship.church/GetImage.ashx?guid=1d311eaf-39ef-40cc-ad42-3e11b89d0051')]">
          {/* Text Section */}
          <div className="md:order-1 bg-white p-8">
            <h3 className="text-lg font-semibold text-ocean mb-2">
              Latest Message
            </h3>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What is Truth?
            </h2>
            <p className="text-gray-700 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
            <p className="font-medium text-gray-800 mb-4">
              Pastor Ryan McDermott
            </p>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200">
                Series & Resources
              </button>
              <button className="px-6 py-3 bg-ocean text-white rounded-lg font-semibold hover:bg-navy flex items-center">
                Watch Message
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentSeries;
