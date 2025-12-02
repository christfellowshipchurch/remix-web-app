import { useEffect } from "react";
import { PodcastEpisode } from "../../types";

// Declare custom Wistia player element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "media-id": string;
          swatch: string;
        },
        HTMLElement
      >;
    }
  }
}

export function EpisodePlayer({ audio }: { audio: PodcastEpisode["audio"] }) {
  useEffect(() => {
    // Inject Wistia scripts
    const script1 = document.createElement("script");
    script1.src = "https://fast.wistia.com/player.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://fast.wistia.com/embed/u8piw3u92j.js";
    script2.async = true;
    script2.type = "module";

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `wistia-player[media-id='u8piw3u92j']:not(:defined) { display: block; filter: blur(5px); padding-top:100%; }`;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full h-full bg-dark-navy content-padding">
      <div className="max-w-[1150px] mx-auto">
        <wistia-player
          media-id={audio}
          swatch="false"
          style={{ width: "100%", height: "100px" }}
        />
      </div>
    </div>
  );
}
