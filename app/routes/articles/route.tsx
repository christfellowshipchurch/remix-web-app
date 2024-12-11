import { DynamicHero } from "~/components/dynamic-hero";

export default function Articles() {
  return (
    <div className="flex flex-col">
      <DynamicHero
        imagePath="../app/assets/images/articles-hero-bg.jpg"
        ctas={[{ url: "#testing", text: "Call to Action" }]}
      />
      <div className="flex"></div>
    </div>
  );
}
