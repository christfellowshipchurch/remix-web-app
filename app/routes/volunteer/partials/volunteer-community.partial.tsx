import { SectionTitle } from "~/components/section-title";

export function VolunteerCommunity() {
  return (
    <section id="community" className="w-full bg-gray py-28">
      <div className="max-w-screen-content mx-auto px-5 md:px-12 lg:px-18">
        <SectionTitle sectionTitle="missions: local" />
        <h2 className="heading-h2 my-8">Volunteer In Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* TODO: Replace with real cards */}
          <div className="bg-neutral-lighter rounded-lg shadow p-6 h-48 flex items-center justify-center">
            Card 1
          </div>
          <div className="bg-neutral-lighter rounded-lg shadow p-6 h-48 flex items-center justify-center">
            Card 2
          </div>
          <div className="bg-neutral-lighter rounded-lg shadow p-6 h-48 flex items-center justify-center">
            Card 3
          </div>
        </div>
        {/* Meet The Needs In Our Region */}
        <h3 className="heading-h3 mb-4">Meet The Needs In Our Region</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <span className="text-neutral-dark mb-2 md:mb-0">
            Find opportunities near you
          </span>
          <input
            type="text"
            placeholder="Filter by location or keyword"
            className="border border-neutral-light rounded px-4 py-2 w-full md:w-80"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* TODO: Replace with real cards */}
          <div className="bg-white border rounded-lg shadow p-6 h-64 flex flex-col">
            Opportunity 1
          </div>
          <div className="bg-white border rounded-lg shadow p-6 h-64 flex flex-col">
            Opportunity 2
          </div>
          <div className="bg-white border rounded-lg shadow p-6 h-64 flex flex-col">
            Opportunity 3
          </div>
          <div className="bg-white border rounded-lg shadow p-6 h-64 flex flex-col">
            Opportunity 4
          </div>
        </div>
      </div>
    </section>
  );
}
