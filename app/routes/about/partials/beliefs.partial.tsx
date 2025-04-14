export function BeliefsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Our Beliefs</h2>
        <h3 className="text-4xl font-bold mb-12">
          Beliefs And Theological Positions Drawn From The Bible.
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">The Bible</h4>
            <p className="text-gray-700">
              2 Timothy 3:16-17 | 2 Peter 1:20-21 | Hebrews 4:12
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">God</h4>
            <p className="text-gray-700">
              Genesis 1:1,26-27 | Psalm 90:2 | Matthew 28:19
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">Jesus</h4>
            <p className="text-gray-700">
              Matthew 1:22-23 | Isaiah 9:6 | John 1:1-5
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
