import Video from "~/primitives/video";

const whatToExpectVideos = {
  palmBeachGardens: "beicrozg21",
  portStLucie: "o6a8iuvvdu",
  royalPalmBeach: "u93xzcwt29",
  boyntonBeach: "7wyyrqlswt",
  stuart: "8tqzbalj93",
  okeechobee: "tvib7cnu9b",
  belleGlade: "tn3c9wnvqj",
  veroBeach: "5cv4gg1zty",
  westlake: "wnrnvrukyc",
  trinity: "w6w5d4sra8",
  cfe: "ue0vgo44c1",
};

type VideoKeys = keyof typeof whatToExpectVideos;

export const WhatToExpectModal = ({ name }: { name: VideoKeys }) => {
  const wistiaId = whatToExpectVideos[name];
  return (
    <div className="w-[600px] pt-5 px-1 pb-2">
      <Video wistiaId={wistiaId} />
    </div>
  );
};
