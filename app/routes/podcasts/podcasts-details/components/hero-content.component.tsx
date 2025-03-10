import { Icon } from "~/primitives/icon/icon";

export const HeroContent = ({
  title,
  description,
  coverImage,
}: {
  title: string;
  description: string;
  coverImage: string;
}) => {
  return (
    <div className="flex px-6 md:px-16 pt-16 pb-6 md:pb-16 md:pt-24">
      <div className="flex flex-col-reverse md:flex-row md:items-center lg:items-start mx-auto justify-between w-full max-w-[1438px]">
        <div className="flex flex-col justify-center lg:w-2/5 xl:w-1/2 mt-4 md:mt-24 mr-10 mb-6 md:mb-0">
          {title && (
            <h1
              className="mb-2 md:mb-4 max-w-2xl font-extrabold text-2xl text-pretty md:text-4xl leading-tight tracking-tight text-white  md:leading-tight lg:text-6xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {description && (
            <p
              className="mb-6 max-w-2xl font-medium text-white md:text-xl lg:mb-8"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <div className="flex items-center gap-4">
            <div className="bg-ocean rounded-full p-2 flex items-center justify-center size-15">
              <Icon name="play" color="white" size={36} className="pl-1" />
            </div>
            <p className="text-white text-lg font-semibold">START LISTENING</p>
          </div>
        </div>

        <img
          className="rounded-[1rem] h-[230px] md:h-full w-full object-cover md:max-w-[250px] lg:min-w-[570px] xl:min-w-[600px] "
          src={coverImage}
          alt={title || "Cover"}
        />
      </div>
    </div>
  );
};
