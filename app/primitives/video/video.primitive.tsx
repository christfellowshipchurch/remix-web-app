import { WistiaPlayer } from "./wistia-player.component";

type VideoProps = {
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  wistiaId?: string;
  className?: string;
};

export const Video = (props: VideoProps) => {
  return (
    <>
      {props?.wistiaId ? (
        <WistiaPlayer
          videoId={props?.wistiaId}
          wrapper={`wistia-player-container-${props?.wistiaId}`}
          className={props?.className}
        />
      ) : (
        <video
          src={props.src}
          autoPlay={props.autoPlay || false}
          loop={props.loop || false}
          muted={props.muted || false}
          controls={props.controls || undefined}
          className={props.className}
        />
      )}
    </>
  );
};
