export function HistorySection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Our History
            </h2>
            <h3 className="text-4xl font-bold mb-6">
              History of Christ Fellowship Church
            </h3>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Christ Fellowship started in 1984 as a small Bible study with 40
                people in Dr. Tom and Donna Mullins' living room and has grown
                to thousands of people attending every weekend and even more
                connecting online.
              </p>
              <p className="text-lg text-gray-700">
                Christ Fellowship is a non-denominational church in South
                Florida led by Pastor Todd & Julie Mullins. The church gathers
                across multiple regional locations in Palm Beach Gardens, Port
                St. Lucie, Stuart, Boynton Beach, Okeechobee, Palm Beach, Royal
                Palm Beach, Stuart, Trinity in Palm Beach Gardens, West Boca,
                Westlake, as well as Español in Palm Beach Gardens and Royal
                Palm Beach and online through Christ Fellowship Everywhere.
              </p>
            </div>
          </div>
          <div className="relative h-96">
            <img
              src="/images/church-history.jpg"
              alt="Christ Fellowship Church History"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
