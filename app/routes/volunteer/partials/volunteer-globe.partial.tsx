import { SectionTitle } from "~/components/section-title";
import { GlobalMap } from "../components/global-map.component";

export function VolunteerGlobe() {
  return (
    <section id="globe" className="w-full bg-white py-28">
      <div className="max-w-screen-content mx-auto">
        <SectionTitle sectionTitle="missions" />
        <h2 className="heading-h2 my-8">Volunteer Around The Globe</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* TODO: Replace with real cards */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-white border rounded-lg shadow p-6">
              Global Opportunity 1
            </div>
            <div className="bg-white border rounded-lg shadow p-6">
              Global Opportunity 2
            </div>
            <div className="bg-white border rounded-lg shadow p-6">
              Global Opportunity 3
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* TODO: Replace with interactive world map */}
            <GlobalMap />
          </div>
        </div>
      </div>
    </section>
  );
}
