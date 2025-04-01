import type { FooterColumn } from "./footer-data";
import { ConnectCardModal } from "~/components";

interface FooterColumnProps {
  column: FooterColumn;
}

export const FooterColumnComponent = ({ column }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="text-2xl text-white font-bold"
        role="heading"
        aria-level={2}
      >
        {column.title}
      </div>
      {column.links.map((link) =>
        link.url === "#connect-card" ? (
          <ConnectCardModal
            key={link.title}
            triggerStyles="text-lg font-light text-[#D0D0CE] m-0 p-0 border-0 rounded-none bg-transparent items-start justify-start min-h-0 min-w-0 hover:enabled:bg-transparent hover:cursor-pointer"
            buttonTitle={link.title}
          />
        ) : (
          <a key={link.title} className="text-lg font-light" href={link.url}>
            {link.title}
          </a>
        )
      )}
    </div>
  );
};
