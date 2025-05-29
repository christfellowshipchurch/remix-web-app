import { cn } from "~/lib/utils";

type VideoProps = {
  src?: string;
  wistiaId?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  fallback?: React.ReactNode;
} & ({ src: string } | { wistiaId: string });

export const Video = (props: VideoProps) => {
  return (
    <>
      {props?.wistiaId ? (
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${
            props.wistiaId
          }?fitStrategy=cover&autoplay=${props.autoPlay || false}&muted=${
            props.muted || false
          }&loop=${props.loop || false}&controls=${props.controls || true}`}
          allowFullScreen
          className={cn("size-full", props.className)}
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
