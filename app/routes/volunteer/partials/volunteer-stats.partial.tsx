import React from "react";

export function VolunteerStats() {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-content mx-auto px-5 md:px-12 lg:px-18 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col md:flex-row gap-8">
          <div className="text-center">
            <div className="text-ocean text-4xl font-extrabold">14,378</div>
            <div className="text-neutral-dark">Volunteers</div>
          </div>
          <div className="text-center">
            <div className="text-ocean text-4xl font-extrabold">108k</div>
            <div className="text-neutral-dark">Hours Served</div>
          </div>
          <div className="text-center">
            <div className="text-ocean text-4xl font-extrabold">15</div>
            <div className="text-neutral-dark">Countries</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {/* TODO: Replace with avatars or group photo */}
          <div className="w-32 h-16 bg-neutral-lighter rounded-full flex items-center justify-center">
            Avatars Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
