import { Button } from "~/primitives/button/button.primitive";

export const DynamicInfo = () => {
  const title = "So Good Podcast Groups";
  const description = "Listen to the Sisterhood Podcast with a group!";
  const content =
    "Join a So Good Sisterhood Podcast group to have conversations about living intentionally, leading confidently, and loving generously. Find a group that works with your schedule, and get ready to discuss your favorite episodes. Have a few friends you want to listen to the podcast with? Shownotes Plus includes detailed notes from each episode, discussion questions, key Scripture verses, and links to more resources and devotionals so you can dive deeper. Enter your email address to gain access!";
  const image = "/assets/images/podcasts/sisterhood-info.jpg";
  const ctas = [
    { title: "Find a Group", href: "#testing1" },
    { title: "Subscribe to Show Notes Plus", href: "#testing2" },
  ];

  return (
    <div className="w-full content-padding">
      <div className="max-w-screen-content mx-auto py-24">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-4 lg:gap-8 ">
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] md:text-[40px] text-text-primary font-extrabold">
                  {title}
                </h2>
                <p className="text-text-secondary font-extrabold text-lg">
                  {description}
                </p>
              </div>
              <p
                className="md:text-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              {ctas.map((cta, index) => (
                <Button
                  intent={`${index === 0 ? "primary" : "secondary"}`}
                  href={cta.href}
                  key={index}
                  className="w-full lg:w-auto"
                >
                  {cta.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="size-full lg:max-w-[590px] lg:max-h-[335px]">
            <img
              src={image}
              alt={title}
              className="size-fullobject-cover rounded-[1rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
