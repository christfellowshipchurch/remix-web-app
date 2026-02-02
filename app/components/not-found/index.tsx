export const NotFound = () => {
  const links = [
    { title: "Visit our homepage.", link: "/" },
    {
      title: "Find a Christ Fellowship location near you.",
      link: "/locations",
    },
    { title: "Sign up for a Group.", link: "/group-finder" },
    { title: "Sign up for a Class.", link: "/class-finder" },
    {
      title: "Discover more about our Ministries.",
      link: "/ministries",
    },
    { title: "Learn more about Christ Fellowship.", link: "/about" },
    { title: "Get connected.", link: "/next-steps" },
    { title: "Give online.", link: "/give" },
    { title: "See upcoming events.", link: "/events" },
  ];
  return (
    <div className="pb-24 text-center w-full">
      <img
        alt="Error Image"
        className="w-full mx-auto max-w-[750px] my-10"
        src="/assets/images/error.png"
      />

      <div className="mx-auto max-w-[1100px] px-4 md:px-8 lg:px-0">
        <h1 className="text-[32px] lg:text-[40px] font-extrabold">
          Hmm. We can’t seem to find that page.
        </h1>
        <p className="mb-8 text-lg">
          Let’s see if we can help you find what you’re looking for!
        </p>
      </div>

      <div className="w-fit max-w-[360px] mx-auto flex flex-col items-start text-start px-4 md:px-8 lg:px-0">
        <h4 className="text-lg font-bold">
          Here are some of our most visited pages
        </h4>
        <ul className="mt-2 pl-4">
          {links.map((link, index) => (
            <li className="list-disc text-ocean" key={index}>
              <a className="text-ocean hover:text-navy" href={link?.link}>
                {link?.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
