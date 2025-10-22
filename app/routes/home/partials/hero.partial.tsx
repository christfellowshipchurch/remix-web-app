import { DesktopHeroSection } from "../components/hero/desktop-hero.component";
import { MobileHeroSection } from "../components/hero/mobile-hero.component";

export function HeroSection() {
  return (
    <>
      <section className="hidden lg:block w-full snap-start">
        <DesktopHeroSection />
      </section>
      <section className="block lg:hidden w-full snap-start">
        <MobileHeroSection />
      </section>
    </>
  );
}
