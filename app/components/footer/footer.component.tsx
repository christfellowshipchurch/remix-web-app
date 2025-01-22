// TODO: Add a check for #connect-card here so that it can open the modal on any page, unlike current site.

import ConnectCardModal from "../modals/connect-card";
import { ContactInfo } from "./footer-contact.partial";
import { FooterLinks } from "./footer-links.partial";
import { FooterColumnComponent } from "./footer-column.component";
import { footerColumns } from "./footer-data";

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
          <div className="flex flex-col items-center md:items-start gap-8 col-span-2 md:col-span-1 mr-4">
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

          {footerColumns.map((column) => (
            <FooterColumnComponent key={column.title} column={column} />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="flex justify-center w-full border-t py-8 text-xs md:text-base text-[#D0D0CE] border-[#417890]">
        <h4>© {year} Christ Fellowship Church. All Rights Reserved</h4>
      </div>
    </footer>
  );
};
