import { Button } from "~/primitives/button/button.primitive";

export const ArticleNewsletter = () => {
  return (
    <div className="bg-navy content-padding py-12 text-white lg:py-24">
      <div className="max-w-screen-content mx-auto w-full">
        <div className="flex flex-col gap-6 lg:gap-20 xl:gap-36 w-full lg:flex-row lg:justify-between">
          {/* Left / Top*/}
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="text-3xl font-semibold">
              Subscribe to Our Newsletter
            </div>
            <div className="font-light">
              Get weekly Christ Fellowship articles, videos, and upcoming events
              straight to your inbox.
            </div>
          </div>
          {/* Right / Bottom */}
          <div className="flex flex-col gap-4 lg:max-w-1/2">
            {/* Form */}
            <form className="flex w-full flex-col xl:justify-end gap-4 xl:flex-row">
              <input
                className="w-full xl:max-w-96 p-3 bg-white text-base text-text-secondary rounded-lg xl:rounded-none"
                type="email"
                placeholder="Enter your email"
              />
              <Button
                className="w-full xl:max-w-96 xl:w-auto rounded-lg xl:rounded-none font-normal xl:text-xl"
                intent="primary"
                href="#testing"
              >
                Subscribe
              </Button>
            </form>
            <div className="text-sm font-light">
              By clicking Sign Up you{`'`}re confirming that you agree with our{" "}
              <a href="#blank" className="underline">
                Terms and Conditions.
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
