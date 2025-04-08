import { Button } from "~/primitives/button/button.primitive";

export const ArticleNewsletter = () => {
  return (
    <div className="bg-[#00354D] content-padding py-12 text-white lg:py-24">
      <div className="max-w-screen-content mx-auto w-full">
        <div className="flex flex-col w-full justify-between lg:flex-row lg:gap-8 lg:justify-between">
          {/* Left */}
          <div>
            <div className="mb-4 text-3xl font-semibold">
              Subscribe to Our Newsletter
            </div>
            <div className="font-light">
              Get weekly Christ Fellowship articles, videos, and upcoming events
              straight to your inbox.
            </div>
          </div>
          {/* Right */}
          <div className="mt-8 flex flex-col lg:ml-6 lg:mt-0 lg:max-w-1/2">
            {/* Form */}
            <form className="mb-4 flex w-full flex-col justify-end gap-4 sm:flex-row">
              <input
                className="w-full max-w-96 p-3 bg-white text-base text-[#666666]"
                type="email"
                placeholder="Enter your email"
              />
              <Button
                className="w-full max-w-96 sm:w-auto rounded-none"
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
    </div>
  );
};
