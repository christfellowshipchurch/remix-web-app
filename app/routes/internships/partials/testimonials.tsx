import InternshipTabs from "../components/internship-tabs";

const InternshipsTestimonials = () => {
  return (
    <div className="content-padding w-full py-24">
      <div className="max-w-screen-content mx-auto w-full flex flex-col gap-10 md:gap-20 lg:gap-30">
        <h2 className="font-medium text-[2rem] md:font-semibold md:text-[52px]">
          Hear From Our Interns
        </h2>

        <InternshipTabs
          tabs={[
            {
              value: "all",
              label: "All",
              subtitle: "All",
              content: (
                <InternshipTabContent
                  title="“My time working at Christ Fellowship changed the course of my career and helped me in my relationship with God.”"
                  description="Taylor M., 28 years old"
                  image="/assets/images/internships/testimonial-1.jpg"
                />
              ),
            },
            {
              value: "summer",
              label: "Summer",
              subtitle: "Summer",
              content: (
                <InternshipTabContent
                  title="“My time working at Christ Fellowship changed the course of my career and helped me in my relationship with God.”"
                  description="Taylor M., 28 years old"
                  image="/assets/images/internships/testimonial-1.jpg"
                />
              ),
            },
            {
              value: "semester",
              label: "Semester",
              subtitle: "Semester",
              content: (
                <InternshipTabContent
                  title="“My time working at Christ Fellowship changed the course of my career and helped me in my relationship with God.”"
                  description="Taylor M., 28 years old"
                  image="/assets/images/internships/testimonial-1.jpg"
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

const InternshipTabContent = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="flex flex-col gap-12 pt-10 md:pt-0 md:px-6 lg:pl-10 lg:pr-[30px]">
      <h3 className="text-2xl">{title}</h3>

      <div className="flex items-center gap-7">
        <img src={image} alt={title} className="size-12 rounded-[1rem]" />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InternshipsTestimonials;
