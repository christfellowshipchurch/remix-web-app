import parse, { attributesToProps, domToReact } from "html-react-parser";
import "./html-renderer.styles.css";

export const HTMLRenderer = ({
  html,
  className,
  stripFormattingTags = false,
}: {
  html: string;
  className?: string;
  stripFormattingTags?: boolean;
}) => {
  const options = {
    replace(domNode: {
      type: string;
      name?: string;
      children?: unknown[];
      [key: string]: unknown;
    }) {
      // Remove <b>, <strong>, <i>, <em> tags by unwrapping their children if enabled
      if (
        stripFormattingTags &&
        domNode.type === "tag" &&
        ["b", "strong", "i", "em"].includes(domNode.name)
      ) {
        return <>{domToReact(domNode.children, options)}</>;
      }

      // Custom handling for <img>
      if (domNode.attribs && domNode.name === "img") {
        const hmtlProps = attributesToProps(domNode.attribs);
        const { src } = hmtlProps;

        return (
          <div className="article-image relative my-4 h-[400px] w-full">
            <img
              src={
                !src?.toString().includes("https")
                  ? `https://rock.christfellowship.church/${src?.toString()}`
                  : src?.toString()
              }
              alt={"Article Image"}
              className="size-full"
            />
          </div>
        );
      }
    },
  };

  return <div className={`${className || ""}`}>{parse(html, options)}</div>;
};
