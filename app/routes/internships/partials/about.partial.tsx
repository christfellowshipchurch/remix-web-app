/**
 * About the program section for internship pages.
 * Reusable with different subheading and description per page (summer, year-round, etc.).
 */

export const InternshipsAbout = ({
  isYearLong = false,
  subheading = "About the program",
  description,
}: {
  isYearLong?: boolean;
  subheading?: string;
  description: string;
}) => {
  return (
    <section className="w-full content-padding py-12 md:py-16" id="about">
      <div className="max-w-screen-content mx-auto w-full">
        <div className="flex flex-col gap-4 md:gap-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">
            {subheading}
          </p>
          <p className="text-[#2F2F2F] text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default InternshipsAbout;
