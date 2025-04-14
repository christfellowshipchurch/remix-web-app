export function LeadershipSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Our Team</h2>
        <h3 className="text-4xl font-bold mb-12">
          Meet The Passionate Leaders Of Christ Fellowship Church.
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Leadership cards will be dynamically populated */}
          <div className="relative group">
            <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
              <img
                src="/images/leaders/todd-julie-mullins.jpg"
                alt="Todd & Julie Mullins"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h4 className="text-xl font-bold">Todd & Julie Mullins</h4>
              <p className="text-gray-600">Senior Pastors</p>
            </div>
          </div>
          {/* Additional leadership cards would follow the same pattern */}
        </div>
      </div>
    </section>
  );
}
