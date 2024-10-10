import { WistiaPlayer } from "./wistia-player.component";

export type VideoProps = {
  src?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  wistiaId?: string;
};

const Video = ({
  src,
  autoPlay,
  muted,
  loop,
  playsInline,
  className,
  wistiaId,
}: VideoProps) => {
  return (
    <>
      {src ? (
        <video
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          className={className}
        />
      ) : (
        wistiaId && (
          <WistiaPlayer
            className={className}
            videoId={wistiaId}
            wrapper={`wistia-player-container-${wistiaId}`}
          />
        )
      )}
    </>
  );
};

export default Video;
