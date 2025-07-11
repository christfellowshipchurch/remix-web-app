import parse, { attributesToProps } from "html-react-parser";
import "./html-renderer.styles.css";

export const HTMLRenderer = ({
  html,
  className,
}: {
  html: string;
  className?: string;
}) => {
  const options = {
    replace(domNode: any) {
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
