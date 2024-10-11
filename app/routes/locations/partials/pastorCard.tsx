import * as pkg from "lodash";
import { campusLinks } from "./locationsSingleData";
import { Link } from "@remix-run/react";
import Button from "~/primitives/Button";

export const PastorCard = ({ name }: { name: string }) => {
  const { find, startCase } = pkg;

  const campusLink = find(campusLinks, { name: startCase(name) });

  const pastorCardBottom = name === "cf-everywhere" ? "-100px" : "-380px";

  return (
    <>
      {/* Desktop */}
      <div className="relative h-0 w-full text-center xl:max-w-[1240px]">
        <div
          className="absolute hidden flex-col rounded-lg border border-[#cecece] bg-white md:right-8 md:w-[380px] lg:right-4 lg:flex xl:right-0"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
            bottom: pastorCardBottom,
          }}
        >
          {/* Pastors img */}
          <div className="flex w-full flex-col items-center pt-5">
            <div className="flex w-full items-center justify-center gap-4">
              <div className="h-1 w-24 border-b border-secondary_subdued" />
              <img
                src="/location-pages/pastors.png"
                alt="Campus Pastors"
                width={120}
                height={120}
                className="rounded-full"
              />
              <div className="h-1 w-24 border-b border-secondary_subdued" />
            </div>
            <h3 className="pt-3 text-2xl font-bold">Dave and Rhonda Simiele</h3>
            <p className="italic">Campus Pastors</p>
          </div>
          {name !== "cf-everywhere" && (
            <div className="border-b border-secondary_subdued py-6" />
          )}
          <div className="pb-6 pt-5">
            {/* Campus Location */}
            <div className="flex w-full flex-col items-center">
              {name !== "cf-everywhere" && (
                <>
                  <img
                    src={`/location-pages/maps/${name}.jpg`}
                    alt="Campus Map"
                    width={250}
                    height={150}
                  />
                  <div className="mt-4 flex flex-col items-center">
                    <h3 className="text-xl font-bold">Address</h3>
                    <a
                      href="#fix"
                      className="max-w-[270px] text-primary underline"
                    >
                      5343 Northlake Blvd. Palm Beach Gardens, FL 33418
                    </a>
                    <h3 className="mt-3 text-xl font-bold">Phone</h3>
                    <a
                      className="text-primary underline"
                      href="tel:561-799-7600"
                    >
                      (561) 799-7600
                    </a>
                  </div>
                </>
              )}
              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                {/* TODO: Open Share Screen on Mobile */}
                <Button intent="secondary" size="sm">
                  INVITE A FRIEND
                </Button>
                <Button intent="primary" size="sm" href="/locations">
                  MORE LOCATIONS
                </Button>
              </div>
            </div>
            {/* Social Medias */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link to="https://www.facebook.com/CFimpact">
                <img
                  src="/icons/cotton-candy-facebook.svg"
                  alt="Facebook"
                  width={32}
                  height={32}
                />
              </Link>
              <Link
                to={
                  campusLink?.instagram ||
                  "https://www.instagram.com/christfellowship.church/"
                }
              >
                <img
                  src="/icons/cotton-candy-instagram.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                />
              </Link>
              <Link to="https://www.youtube.com/user/christfellowship">
                <img
                  src="/icons/cotton-candy-youtube.svg"
                  alt="Youtube"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex w-full flex-col pb-5 pt-4 text-center lg:hidden">
        {/* Pastors Image */}
        <div className="flex w-full flex-col items-center pt-5">
          <div className="flex w-full items-center justify-center gap-4">
            <div className="h-1 w-24 border-b border-secondary_subdued" />
            <img
              src="/location-pages/pastors.png"
              alt="Campus Pastors"
              width={120}
              height={120}
              className="rounded-full"
            />
            <div className="h-1 w-24 border-b border-secondary_subdued" />
          </div>
          <h3 className="pt-3 text-2xl font-bold">Dave and Rhonda Simiele</h3>
          <p className="italic">Campus Pastors</p>
        </div>
        <div className="pb-6 pt-5">
          {/* Campus Location */}
          <div className="flex w-full flex-col items-center">
            {name !== "cf-everywhere" && (
              <>
                <img
                  src={`/location-pages/maps/${name}.jpg`}
                  alt="Campus Map"
                  width={250}
                  height={150}
                />
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-xl font-bold">Address</h3>
                  <a
                    href="#fix"
                    className="max-w-[270px] text-primary underline"
                  >
                    5343 Northlake Blvd. Palm Beach Gardens, FL 33418
                  </a>
                  <h3 className="mt-3 text-xl font-bold">Phone</h3>
                  <a href="tel:561-799-7600" className="text-primary underline">
                    (561) 799-7600
                  </a>
                </div>
              </>
            )}
            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              {/* TODO: Open Share Screen on Mobile */}
              <Button intent="secondary" size="sm">
                INVITE A FRIEND
              </Button>
              <Button intent="primary" size="sm" href="/locations">
                MORE LOCATIONS
              </Button>
            </div>
          </div>
          {/* Social Medias */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Link to="https://www.facebook.com/CFimpact">
              <img
                src="/icons/cotton-candy-facebook.svg"
                alt="Facebook"
                width={32}
                height={32}
              />
            </Link>
            <Link
              to={
                campusLink?.instagram ||
                "https://www.instagram.com/christfellowship.church/"
              }
            >
              <img
                src="/icons/cotton-candy-instagram.svg"
                alt="Instagram"
                width={32}
                height={32}
              />
            </Link>
            <Link to="https://www.youtube.com/user/christfellowship">
              <img
                src="/icons/cotton-candy-youtube.svg"
                alt="Youtube"
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
