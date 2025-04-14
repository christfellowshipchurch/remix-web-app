export function ImpactSection() {
  return (
    <section className="bg-primary-900 text-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium text-primary-300 mb-4">
          our impact.
        </h2>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h3 className="text-5xl font-bold mb-6">By the Numbers</h3>
            <p className="text-lg text-gray-300">
              Over the past year at Christ Fellowship Church, our diverse
              ministries have made a significant impact on the world.
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-6xl font-bold text-primary-300 mb-4">
                108K
              </div>
              <p className="text-sm uppercase tracking-wider">
                People Impacted Through Mission Outreach
              </p>
              <img
                src="/assets/images/about/impact-1.jpg"
                alt="Mission Outreach Impact"
                className="mt-4 rounded-lg w-full"
              />
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-primary-300 mb-4">
                571K
              </div>
              <p className="text-sm uppercase tracking-wider">
                Kids Receive Hot Meals in 36 Different Countries
              </p>
              <img
                src="/assets/images/about/impact-2.jpg"
                alt="Kids Meals Impact"
                className="mt-4 rounded-lg w-full"
              />
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-primary-300 mb-4">79</div>
              <p className="text-sm uppercase tracking-wider">
                Disasters Responded To
              </p>
              <img
                src="/assets/images/about/impact-3.jpg"
                alt="Disaster Response Impact"
                className="mt-4 rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
