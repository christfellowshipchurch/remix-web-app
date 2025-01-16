// TODO: Add a check for #connect-card here so that it can open the modal on any page, unlike current site.

import ConnectCardModal from "../modals/connect-card";
import { ContactInfo } from "./footer-contact.partial";
import { FooterLinks } from "./footer-links.partial";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center w-full bg-navy">
      <div className="flex flex-col tems-center w-full max-w-screen-content px-5 md:px-10">
        <div className="relative w-full">
          <div className="absolute w-full h-4 bg-ocean -top-2" />
        </div>
        {/* Contact Info */}
        <ContactInfo />

        {/* Info Section */}
        <div className="w-full border-t border-[#417890] justify-between py-14 text-lg text-[#D0D0CE] grid grid-cols-2 md:grid-cols-5 gap-y-14 md:gap-y-8">
          <div className="flex flex-col items-center md:items-start gap-8 col-span-2 md:col-span-1">
            <img
              src="../app/assets/light-logo.png"
              alt="Christ Fellowship"
              width={158}
              height={55}
            />
            <div className="flex flex-col gap-3">
              <FooterLinks />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-white">Resources</h2>
            <a className="text-lg font-light" href="/locations/cf-everywhere">
              Church Online
            </a>
            <a
              className="text-lg font-light"
              href="https://www.youtube.com/playlist?list=PLUQ7jSnRB_efXMDq9Lka6stS02awWoaz4"
            >
              Past Messages
            </a>
            <a className="text-lg font-light" href="/give">
              Give Online
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-white font-bold">Connect</h2>
            <ConnectCardModal
              triggerStyles="text-lg font-light text-[#D0D0CE] m-0 p-0 border-0 rounded-none bg-transparent items-start justify-start min-h-0 min-w-0 hover:enabled:bg-transparent "
              buttonTitle="Connect Card"
            />
            <a
              className="text-lg font-light"
              href="https://rock.gocf.org/RequestPrayer"
            >
              Request Prayer
            </a>
            <a
              className="text-lg font-light"
              href="https://church.us11.list-manage.com/subscribe?u=76848e191018191e2e2d01d77&id=3265404466"
            >
              Subscribe to Updates
            </a>
            <a className="text-lg font-light" href="/contactus">
              Contact Us
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-white font-bold">About</h2>
            <a className="text-lg font-light" href="/about">
              Our Leadership
            </a>
            <a className="text-lg font-light" href="/career-opportunities">
              Career Opportunities
            </a>
            <a className="text-lg font-light" href="/privacy-policy">
              Privacy Policy
            </a>
            <a className="text-lg font-light" href="/terms-of-use">
              Terms of Use
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-white font-bold">More</h2>
            <a
              className="text-lg font-light"
              href="https://www.christfellowshipconference.com/"
            >
              CF Conference
            </a>
            <a className="text-lg font-light" href="https://www.cfseu.com/">
              Get Your Degree
            </a>
            <a
              className="text-lg font-light"
              href="https://cf-church.square.site/home"
            >
              Shop Online
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="flex justify-center w-full border-t py-8 text-xs md:text-base text-[#D0D0CE] border-[#417890]">
        <h4>© {year} Christ Fellowship Church. All Rights Reserved</h4>
      </div>
    </footer>
  );
};
