export function VolunteerFeaturedEvent() {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-screen-content mx-auto px-5 md:px-12 lg:px-18">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-neutral-lighter rounded-lg shadow p-6">
            <h3 className="heading-h3 mb-2">Featured Event</h3>
            <div className="font-bold mb-1">Dream Team Kickoff</div>
            <p>Event details and description go here.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* TODO: Replace with event image */}
            <div className="w-full h-48 bg-ocean/10 rounded-lg flex items-center justify-center">
              Event Image Placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
