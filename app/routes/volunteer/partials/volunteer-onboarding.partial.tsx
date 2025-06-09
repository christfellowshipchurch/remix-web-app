import React from "react";

export function OnboardingProcess() {
  return (
    <section className="w-full bg-ocean py-16">
      <div className="max-w-screen-content mx-auto px-5 md:px-12 lg:px-18">
        <h2 className="heading-h2 text-white mb-8">Onboarding Process</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white/10 rounded-lg p-8 text-white">
            <h3 className="heading-h3 mb-2">1st Step</h3>
            <p>Describe the first step of onboarding here.</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-lg p-8 text-white">
            <h3 className="heading-h3 mb-2">2nd Step</h3>
            <p>Describe the second step of onboarding here.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
