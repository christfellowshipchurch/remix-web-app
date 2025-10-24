import { DesktopHeroSection } from "../components/hero/desktop-hero.component";
import { MobileHeroSection } from "../components/hero/mobile-hero.component";

export function HeroSection() {
  return (
    <>
      <DesktopHeroSection />
      <MobileHeroSection />
    </>
  );
}
