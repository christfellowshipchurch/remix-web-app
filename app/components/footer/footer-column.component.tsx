import type { FooterColumn } from "./footer-data";
import ConnectCardModal from "../modals/connect-card";

interface FooterColumnProps {
  column: FooterColumn;
}

export const FooterColumnComponent = ({ column }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl text-white font-bold">{column.title}</h2>
      {column.links.map((link) =>
        link.url === "#connect-card" ? (
          <ConnectCardModal
            key={link.title}
            triggerStyles="text-lg font-light text-[#D0D0CE] m-0 p-0 border-0 rounded-none bg-transparent items-start justify-start min-h-0 min-w-0 hover:enabled:bg-transparent"
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
