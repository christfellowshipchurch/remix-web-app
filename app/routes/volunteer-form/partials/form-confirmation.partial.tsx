import React from "react";
import { Form } from "react-router-dom";
import { ResultsProgressBar } from "../components/results-progress-bar.component";
import { ResultCard } from "../components/result-card.component";
import { mockResultCards } from "../mock-data";
import { HeroNavCard } from "~/components/navbar/desktop/nav-cards.component";
import Icon from "~/primitives/icon";

export const VolunteerFormConfirmationPartial: React.FC = () => (
  <section className="w-full min-h-screen bg-gray-100">
    {/* What Happens Next */}
    <div className="bg-white pt-16 pb-8 px-4 flex flex-col items-center">
      <h2 className="heading-h2 mb-6 text-center">What Happens Next?</h2>
      <ResultsProgressBar />
      <p className="my-6 text-center max-w-2xl text-text-secondary">
        We are thrilled to have you join our team. [Persons Name and title] from
        your home [Campus] will contact you within [timeframe, e.g., 3-5
        business days] to discuss potential volunteer opportunities and next
        steps. In the meantime, you can sign up for the Journey if you haven't
        taken it yet as it is the first step for volunteering.
      </p>
      <div className="flex items-center gap-4 my-12">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Bob Ross"
          className="w-18 h-18 rounded-full mb-2 shadow-md"
        />
        <div className="flex flex-col">
          <div className="font-semibold text-3xl">Bob Ross</div>
          <div className="text-lg text-text-secondary">
            Volunteer Coordinator
          </div>
        </div>
      </div>
    </div>

    {/* Your Results */}
    <div className="bg-navy py-24 xl:px-4">
      <div className="max-w-[1280px] mx-auto">
        <h3 className="heading-h2 text-white text-center">Your Results</h3>
        <p className="text-neutral-lightest text-center mt-4 mb-12 max-w-2xl mx-auto px-4">
          Based on your answers these are 3 potential volunteer areas you could
          make an impact. [staff name] will discuss your interest and help you
          find the right fit in these or other areas.
        </p>

        <div className="flex flex-nowrap gap-10 xl:gap-12 overflow-x-auto xl:overflow-x-visible">
          {mockResultCards.map((card, idx) => (
            <ResultCard
              className={
                idx === 0 ? "ml-10 xl:ml-0" : idx === 2 ? "mr-8 xl:mr-0" : ""
              }
              key={card.title + idx}
              {...card}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Finish Button */}
    <div className="flex flex-col items-center justify-center gap-8 py-20 bg-white">
      <h2 className="heading-h2 text-center">In the Meantime</h2>
      <p className="text-center text-text-secondary max-w-2xl mx-auto">
        The journey is an essential first step to getting involved and is
        crucial for many dream team roles. If you haven't started yet, we
        encourage you to begin this process, as it will help orient you to our
        church.
      </p>
      <a
        href="/journey"
        className="bg-white p-4 rounded-lg shadow-medium hover:translate-y-[-6px] transition-all duration-300 max-w-96 border-1 border-neutral-lighter"
      >
        <img
          src="https://picsum.photos/320/280"
          alt="Start Your Journey"
          className="w-80 rounded-lg aspect-[4/3]"
        />
        <h5 className="font-medium uppercase text-text-secondary text-xs mt-2">
          the best first step
        </h5>
        <h3 className="heading-h5 text-text-primary">The Journey</h3>
        <div className="mt-3 font-semibold flex w-full justify-between text-ocean">
          <span>Save Your Spot</span>
          <Icon name="arrowRight" />
        </div>
      </a>
    </div>
  </section>
);

export default VolunteerFormConfirmationPartial;
