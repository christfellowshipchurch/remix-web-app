import Button from "~/primitives/button";

export const ArticleNewsletter = () => {
  return (
    <div className="mb-12 w-full bg-gradient-to-b from-newsletter_from to-newsletter_to py-12 text-white lg:py-24">
      <div className="mx-auto flex max-w-3xl flex-col justify-between px-6 lg:max-w-5xl lg:flex-row xl:max-w-7xl">
        {/* Left */}
        <div className="">
          <div className="mb-4 text-3xl font-semibold">
            Subscribe to Our Newsletter
          </div>
          <div className="max-w-lg font-light">
            Get weekly Christ Fellowship articles, videos, and upcoming events
            straight to your inbox.
          </div>
        </div>
        {/* Right */}
        <div className="mt-8 flex flex-col lg:ml-6 lg:mt-0 lg:w-1/2">
          {/* Form */}
          <form className="mb-4 flex w-full flex-col gap-4 sm:flex-row">
            <input
              className="w-full max-w-96 rounded-md p-3 text-base text-text_primary"
              type="email"
              placeholder="Enter your email"
            />
            <Button
              className="w-full max-w-96 sm:w-auto"
              intent="primary"
              href="#testing"
            >
              Subscribe
            </Button>
          </form>
          <div className="mt-4 text-sm font-light lg:mt-0">
            By clicking Sign Up you{`'`}re confirming that you agree with our{" "}
            <a href="#blank" className="underline">
              Terms and Conditions.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
