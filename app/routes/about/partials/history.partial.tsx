import { SectionTitle } from "~/components/section-title";
import HistoryTabs from "../components/history-tabs/history-tabs.component";

export function HistorySection({
  sectionTitle = "our history.",
  title = "History of Christ <br /> Fellowship Church",
}: {
  sectionTitle?: string;
  title?: string;
}) {
  return (
    <section id="history" className="py-20 w-full bg-white relative z-30">
      <div className="content-padding">
        <div className="container max-w-screen-content mx-auto">
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-start gap-6 md:gap-0 md:mb-6">
            <SectionTitle sectionTitle={sectionTitle} className="lg:w-2/13" />
            <h3
              className="font-extrabold text-text-primary text-[28px] md:text-5xl leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
        </div>
      </div>

      <div className="w-full relative">
        {/* Gray BG */}
        <div className="hidden md:block absolute top-0 right-0 h-full w-[80%] bg-gray z-0" />
        <div className="max-w-screen-content mx-auto relative">
          <HistoryTabs />
        </div>
      </div>
    </section>
  );
}
