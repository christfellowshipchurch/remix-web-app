import parse, {
  attributesToProps,
  domToReact,
  DOMNode,
} from "html-react-parser";
import { Link } from "react-router";
import "./html-renderer.styles.css";
import { cn } from "~/lib/utils";

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
    replace(domNode: DOMNode) {
      // Remove <b>, <strong>, <i>, <em> tags by unwrapping their children if enabled
      if (
        stripFormattingTags &&
        domNode.type === "tag" &&
        domNode.name &&
        ["b", "strong", "i", "em"].includes(domNode.name)
      ) {
        return (
          <>{domToReact((domNode.children as DOMNode[]) || [], options)}</>
        );
      }

      // Custom handling for <a> tags - convert to React Router Link
      if (domNode.type === "tag" && domNode.name === "a" && domNode.attribs) {
        const htmlProps = attributesToProps(domNode.attribs);
        const { href, className, target } = htmlProps;

        // Only convert internal links to React Router Link
        if (href && typeof href === "string" && !href.startsWith("http")) {
          return (
            <Link
              to={href}
              className={cn(className?.toString(), "!text-ocean")}
              prefetch="intent"
            >
              {domToReact((domNode.children as DOMNode[]) || [], options)}
            </Link>
          );
        }

        // External links remain as regular <a> tags
        return (
          <a
            href={href?.toString()}
            className={cn(className, "text-ocean hover:text-navy")}
            target={target?.toString()}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {domToReact((domNode.children as DOMNode[]) || [], options)}
          </a>
        );
      }

      // Custom handling for <img>
      if (domNode.type === "tag" && domNode.name === "img" && domNode.attribs) {
        const htmlProps = attributesToProps(domNode.attribs);
        const { src } = htmlProps;

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
