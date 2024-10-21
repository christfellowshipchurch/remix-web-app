import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "@remix-run/react";
import BackButton from "./components/back-button";
import AuthorTabs from "./components/author-tabs";
import { AuthorBioDesktop, AuthorBioMobile } from "./partials/author-bio";

export const AuthorPage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <section className="dark:bg-gray-900 max-w-[1000px] mx-auto grid grid-cols-3">
        {/* Content */}
        <div className="col-span-4 md:col-span-2 py-24 px-8">
          {/* Title */}
          <div className="flex flex-col items-start">
            <BackButton />
            {/* Mobile Author Bio */}
            <div className="mb-8 md:hidden">
              <AuthorBioMobile
                fullName={data?.fullName}
                profilePhoto={data?.profilePhoto}
                authorAttributes={data?.authorAttributes}
              />
            </div>
            <h1 className="hidden text-[40px] font-bold md:block">
              {data?.fullName}
            </h1>
          </div>
          {/* Tabs */}
          <AuthorTabs articles={data?.authorAttributes?.publications} />
        </div>
        {/* Desktop Bio */}
        <div className="border-l col-span-2 md:col-span-1 hidden py-24 px-8 md:block">
          <AuthorBioDesktop
            fullName={data?.fullName}
            profilePhoto={data?.profilePhoto}
            authorAttributes={data?.authorAttributes}
          />
        </div>
      </section>
    </>
  );
};
