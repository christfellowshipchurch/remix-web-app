import React from "react";
import { Author } from "./loader";
import { useLoaderData } from "react-router-dom";
import BackButton from "./components/back-button";
import AuthorTabs from "./components/author-tabs";
import { AuthorBioDesktop, AuthorBioMobile } from "./partials/author-bio";

export const AuthorPage: React.FC = () => {
  const data = useLoaderData<Author>();

  return (
    <div className="relative">
      {/* Background container */}
      <div className="absolute inset-0 h-full w-full grid grid-cols-5">
        <div className="col-span-3" />
        <div className="col-span-2 md:bg-gray" />
      </div>
      {/* Content */}
      <section className="relative max-w-screen-xl mx-auto grid grid-cols-3">
        {/* Main content - takes up 2/3 on desktop */}
        <div className="col-span-3 md:col-span-2 md:pr-12 lg:pr-24 md:pb-12">
          <div className="flex flex-col items-start bg-gray md:bg-transparent pt-12 md:pb-12 content-padding">
            <BackButton />
            <div className="mb-8 pt-4 md:hidden">
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

          <div className="content-padding pb-12 md:pb-0">
            <AuthorTabs articles={data?.authorAttributes?.publications} />
          </div>
        </div>

        {/* Sidebar - takes up 1/3 on desktop */}
        <div className="hidden md:block md:col-span-1 py-12 px-4 md:px-0">
          <AuthorBioDesktop
            fullName={data?.fullName}
            profilePhoto={data?.profilePhoto}
            authorAttributes={data?.authorAttributes}
          />
        </div>
      </section>
    </div>
  );
};
