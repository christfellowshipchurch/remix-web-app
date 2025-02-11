import { WistiaPlayer } from "./wistia-player";

type VideoProps = {
  src?: string;
  wistiaId?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
} & ({ src: string } | { wistiaId: string });

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
