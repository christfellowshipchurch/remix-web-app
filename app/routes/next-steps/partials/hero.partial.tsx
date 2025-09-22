import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <div className="relative bg-background-gray">
      {/* blue background */}
      <div className="absolute top-[-28%] left-0 w-full h-full bg-ocean/10 sm:hidden" />
      {/* desktop image */}
      <img
        src="https://cloudfront.christfellowship.church/GetImage.ashx?id=3063176"
        alt="Hero"
        className="hidden sm:block w-full min-h-[100vh] object-cover mt-[-5rem]"
      />
      {/* mobile image */}
      <img
        src="https://cloudfront.christfellowship.church/GetImage.ashx?id=3063951"
        alt="Hero"
        className="block sm:hidden w-full object-cover"
      />
      <div className="container mx-auto px-4 text-center absolute top-[30%] md:top-[35%] left-0 w-full h-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-6 text-navy font-serif">
          See What's Here
          <br />
          <span className="text-ocean">for You!</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          <strong>Find your next step</strong> at Christ Fellowship Church.
        </p>
      </div>
    </div>
  );
}
