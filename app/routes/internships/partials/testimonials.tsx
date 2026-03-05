const TESTIMONIALS = [
  {
    quote:
      '"The Christ Fellowship internship has not only impacted my leadership, but has confirmed the calling on my life. Through this experience, I have grown in my confidence and my ability to take tasks and make them my own. This internship has equipped me to thrive in ministry in ways I would not have been prepared for otherwise."',
    name: "Joelene Dolak",
    ministry: "Students Ministry",
  },
  {
    quote:
      '"The internship gave me real-time, hands-on training in ministry. It allowed ministry to become more than just a sight from a distance, but a tangible, personal experience! Through my willingness to be flexible and learn, I was able to be in proximity to high capacity leaders who would call me up into the woman of God I was created to be and challenge me to be a better leader!"',
    name: "Lacey Nease",
    ministry: "Foster Care & Kids Ministry",
  },
  {
    quote:
      '"The CF Internship taught me not only how to do ministry, but what excellence in ministry truly looks like. I learned both the technical side of production and the pastoral heart behind it, through the incredible leadership training and hands-on opportunities within the intern program."',
    name: "Julz Bracco",
    ministry: "Production Ministry",
  },
];

const TESTIMONIAL_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23e5e7eb' width='80' height='80' rx='8'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='10' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EIntern%3C/text%3E%3C/svg%3E";

const InternshipsTestimonials = () => {
  return (
    <section className="content-padding w-full py-16 md:py-24" id="testimonies">
      <div className="max-w-screen-content mx-auto w-full">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[2px] text-ocean">
              Intern Testimonials
            </p>
            <h2 className="mt-2 text-[32px] lg:text-[44px] font-bold text-dark-navy">
              Hear From Our Interns
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="shadow-lg flex flex-col justify-between gap-6 p-6 bg-white rounded-xl border border-black/5 shrink-0"
              >
                <h3 className="text-sm md:text-base text-neutral-dark leading-relaxed">
                  {item.quote}
                </h3>

                <div className="flex items-center gap-4 border-t border-neutral-lightest pt-2">
                  <img
                    src={TESTIMONIAL_PLACEHOLDER}
                    alt=""
                    className="size-12 rounded-[#17509800] object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-dark-navy">{item.name}</p>
                    <p className="text-sm text-[#888888]">{item.ministry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternshipsTestimonials;
