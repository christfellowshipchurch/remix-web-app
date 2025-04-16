import React from "react";
import { cn } from "~/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";

interface Belief {
  title: string;
  verses: string;
  description: string;
}

const beliefsData: Belief[] = [
  {
    title: "The Bible",
    verses:
      "2 Timothy 3:16-17 | 2 Peter 1:20-21 | Proverbs 30:5 Romans 16:25-26 | John 8:31-32 | Hebrews 4:12",
    description:
      "The Bible is God's Word given to us. It was written by human authors under the supernatural guidance of the Holy Spirit. Because it was inspired by God, it is without error and can be trusted as the ultimate source of truth. From Genesis to Revelation, it has one message: that God loves us and wants a relationship with us.",
  },
  {
    title: "God",
    verses:
      "Genesis 1:1,26-27 | Psalm 90:2 | Psalm 145:8-9 | Matthew 28:19 | 1 Peter 1:3-5 | 2 Corinthians 13:14",
    description:
      "God loves us so much that He sent His Son Jesus to do for us what we couldn't do for ourselves. Jesus, fully human and fully God, lived a sinless life and offered Himself as the perfect sacrifice for our sins by dying on the Cross. He rose from the dead after three days to demonstrate His power over sin and death and will return again.",
  },
  {
    title: "Jesus",
    verses:
      "Matthew 1:18-23 | Isaiah 9:6 | John 1:1-5, 14:10-14 | Hebrews 4:14-15 | 1 Corinthians 15:3-4 | Acts 1:9-11",
    description:
      "God loves us so much that He sent His Son Jesus to do for us what we couldn't do for ourselves. Jesus, fully human and fully God, lived a sinless life and offered Himself as the perfect sacrifice for our sins by dying on the Cross. He rose from the dead after three days to demonstrate His power over sin and death and will return again.",
  },
  {
    title: "Holy Spirit",
    verses:
      "John 14:16-17, 16:7-13 | Acts 1:8 | 1 Corinthians 3:16 | Ephesians 1:13-14, 5:18 | 2 Corinthians 3:17 | 1 Corinthians 12:1-31",
    description:
      "The Holy Spirit, also fully God, makes us aware of our need for Jesus and lives in every Christian from the moment of salvation. He guides us into truth, comforts us, and convicts us when we get off course. He empowers us with spiritual gifts, all of which are in operation today. We are to be filled daily with the Holy Spirit.",
  },
  {
    title: "Salvation",
    verses:
      "Romans 6:23 | Ephesians 2:8-9 | Isaiah 64:6 | John 1:12, 14:6 | Titus 3:5-6 | Romans 3:23 | 5:1, 10:9-10",
    description:
      "Salvation is God's gift to us. The only way we can receive it is by accepting Jesus and the sacrifice He made on the cross as a payment for our sins. There's nothing we can do to earn it or deserve it. We simply receive it through faith. We demonstrate our salvation by following Jesus and repenting, or turning away, from our sin.",
  },
  {
    title: "Eternal Life",
    verses:
      "John 3:16 | 1 John 2:25, 5:11-13 | Romans 6:23 | Matthew 25:31-46 | Revelation 20:15, 21:1-4",
    description:
      "We were made to live forever with God, and we can experience eternal life when we accept His free gift of salvation. But the opposite is also true: not choosing to follow Jesus means being apart from Him forever. Heaven and Hell are real places, and our choices in this life decide where we spend eternity.",
  },
  {
    title: "The Church",
    verses:
      "John 17:11, 20-23 | Romans 12:4-5 | Ephesians 1:22-23 | Ephesians 2:19-22, Hebrews 10:24-25 | Colossians 1:17-20",
    description:
      "The Church is all believers in Jesus joining together to share His love and message with the world. It is not a building we walk into but a family we belong to. It is the body of Christ in the world today, doing what Jesus would do if He were physically here. Jesus is the leader of the Church, and the Church is the hope of the world.",
  },
  {
    title: "Baptism",
    verses:
      "Matthew 3:13-17 | Mark 1:9 | Matthew 28:19-20 | Romans 6:4 | Colossians 2:12 | 2 Corinthians 5:17",
    description:
      "Jesus was baptized and instructed all of His followers to get baptized. When we do this, we obey His teachings and follow His example. Baptism is a public declaration of our faith in Christ, an outward symbol of an inward commitment that we've made in our hearts. Baptism doesn't save you; only belief in Jesus and what He did on the Cross does that.",
  },
  {
    title: "Communion",
    verses:
      "Matthew 26:26-28 | Mark 14:22-26 | Luke 22:14-20 | 1 Corinthians 11:26-29 | Acts 2:42",
    description:
      "Jesus instructed His followers to celebrate communion. Communion is a time to remember the sacrifice He made for us on the Cross. The bread and the juice remind us that His body was broken for us and His blood was given to forgive our sins. Communion is a time of celebration, but it should also be a time of confession and reflection on our relationship with God.",
  },
];

export function BeliefsCarousel() {
  return (
    <div className="z-30">
      <img
        src="/assets/images/about/beliefs.webp"
        alt="Beliefs"
        className="w-full"
      />
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative mb-12"
        >
          <CarouselContent>
            {beliefsData.map((belief, index) => (
              <CarouselItem
                key={belief.title}
                className={cn(
                  "pl-0",
                  "basis-[100%]",
                  "md:basis-[50%]",
                  "lg:basis-[33.333%]"
                )}
              >
                <div
                  className={cn(
                    "px-6 py-12 bg-gray h-full",
                    index !== beliefsData.length - 1 &&
                      "border-r border-neutral-lighter"
                  )}
                >
                  <h4 className="text-3xl text-text-primary font-extrabold mb-4">
                    {belief.title}
                  </h4>
                  <p className="text-lg text-dark-navy">{belief.verses}</p>
                  {belief.description && (
                    <p className="text-text-primary mt-4">
                      {belief.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex px-6 items-center justify-between h-18 w-full bg-navy">
            <CarouselDots
              activeClassName="bg-white"
              inactiveClassName="bg-white opacity-50"
            />
            <div className="relative flex mr-6">
              <CarouselPrevious
                className="cursor-pointer hover:bg-white/20 border-white disabled:border-neutral-light"
                fill="white"
                disabledFill="#AAAAAA"
              />
              <CarouselNext
                className="-left-2 cursor-pointer hover:bg-white/20 border-white disabled:border-neutral-light"
                fill="white"
                disabledFill="#AAAAAA"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
