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
    <section id="history" className="py-20 w-full">
      <div className="content-padding">
        <div className="container max-w-screen-content mx-auto">
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-start gap-6 mb-6">
            <SectionTitle sectionTitle={sectionTitle} className="lg:w-1/6" />
            <h3
              className="font-extrabold text-text-primary text-[28px] md:text-5xl leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
        </div>
      </div>

      <div className="2xl:bg-gray w-full">
        <div className="max-w-screen-content mx-auto">
          <HistoryTabs />
        </div>
      </div>
    </section>
  );
}
