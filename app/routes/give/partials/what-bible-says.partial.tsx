import { Button } from "~/primitives/button/button.primitive";

export const WhatBibleSaysAboutGiving = () => {
  return (
    <div
      className="w-full py-12 lg:pb-16 lg:pt-22 bg-white content-padding"
      id="give-what-bible-says"
    >
      <div className="flex flex-col gap-8 md:gap-12 items-center mx-auto max-w-screen-content">
        <div className="flex flex-col gap-4 lg:gap-8 items-center text-center max-w-[1000px] mx-auto">
          <h2 className="text-[32px] md:text-[36px] text-navy font-bold leading-tight">
            What the Bible Says About Giving
          </h2>
          <p className="italic leading-tight">
            “Remember this: Whoever sows sparingly will also reap sparingly, and
            whoever sows generously will also reap generously. Each of you
            should give what you have decided in your heart to give, not
            reluctantly or under compulsion, for God loves a cheerful giver. And
            God is able to bless you abundantly, so that in all things at all
            times, having all that you need, you will abound in every good
            work.”
            <br />
            <br />
            <span className="font-bold not-italic">2 Corinthians 9:6-8</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-8 xl:!gap-16 w-full py-8">
          <Card
            title="Tithing"
            description="TRUSTING GOD WITH YOUR FINANCES."
            content="Tithing is a biblical principle that means the tenth. The first tenth, which belongs to God, is Holy and set apart for Him. When we bring our tithe to God, it means that we trust and acknowledge that He’s the giver of every good thing in our lives. Tithing isn’t as much about finances as it is about faith. It’s not about what God wants from you but what He has for you.<br/><br/>In <span class='font-bold'>Malachi 3:10</span>, the Bible says we can test this promise. When we bring our first and best back to God, He promises to bless the rest of our resources so that we could be a blessing toward others.<br/><br/>Is tithing new for you? <a class='text-ocean font-bold underline' href='https://rock.gocf.org/310challenge' target='_blank'>Take the Malachi 3:10 Challenge</a> today!"
          />
          <Card
            title="Offerings"
            description="GIVING BEYOND THE TITHE."
            content={`As Pastor Todd has shared, "We're never more like Jesus than when we serve and give." In scripture, we're told that God so loved the world that He gave. Our offerings go beyond the obedience of the tithe; they are a reflection of a life marked by generosity. We believe generosity has a divine purpose connected to it, which is why we invite our church family to give beyond the tithe in one of these ways throughout the year.<br/><br/>Learn more about two special offerings we do each year: <a class='text-ocean font-bold underline' href='#todo'>Heart for the House and Christ Birthday Offering.</a>`}
          />
        </div>

        <Button href="#" size="md" className="rounded-[4px] font-normal">
          GIVE NOW
        </Button>
      </div>
    </div>
  );
};

const Card = ({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) => {
  return (
    <div className="w-full xl:min-w-[550px] flex flex-col justify-center items-center gap-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] rounded-[1rem] px-8 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h3 className="text-[28px] md:text-[32px] font-bold leading-tight">
          {title}
        </h3>
        <p className="text-lg text-[#9C9C9D] leading-tight">{description}</p>
      </div>

      <p
        className="leading-tight text-center"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
