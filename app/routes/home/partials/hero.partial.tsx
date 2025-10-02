import { DesktopHeroSection } from "../components/hero/desktop-hero.component";
import { MobileHeroSection } from "../components/hero/mobile-hero.component";

export function HeroSection() {
  return (
    <>
      <div className="hidden lg:block w-full snap-start">
        <DesktopHeroSection />
      </div>
      <div className="block lg:hidden w-full snap-start">
        <MobileHeroSection />
      </div>
    </>
  );
}
