import { useLoaderData } from "react-router";
import { Button } from "~/primitives/button/button.primitive";
import { LoaderReturnType } from "../loader";
import Icon from "~/primitives/icon";
const PastorCard = () => {
  return (
    <>
      <DesktopPastorCard />
      <MobilePastorCard />
    </>
  );
};

const DesktopPastorCard = () => {
  const {
    street1,
    street2,
    city,
    state,
    postalCode,
    mapLink,
    campusMapImage,
    phoneNumber,
    url,
  } = useLoaderData<LoaderReturnType>();
  const pastorCardBottom = url === "cf-everywhere" ? "-100px" : "-380px";
  const isEspanol = url.includes("iglesia");
  const online = url === "cf-everywhere";

  return (
    <div className="relative h-0 w-full text-center xl:max-w-[1240px]">
      <div
        className="absolute hidden flex-col rounded-lg border border-[#cecece] bg-white md:right-8 md:w-[380px] lg:right-4 lg:flex xl:right-0"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
          bottom: pastorCardBottom,
        }}
      >
        <PastorsImage />
        {url !== "cf-everywhere" && (
          <div className="border-b border-secondary_subdued py-6" />
        )}
        <div className="pb-6 pt-5">
          {/* Campus Location */}
          <div className="flex w-full flex-col items-center">
            {url !== "cf-everywhere" && (
              <>
                <a target="_blank" href={mapLink}>
                  <img
                    src={campusMapImage}
                    alt="Campus Map"
                    width={250}
                    height={150}
                  />
                </a>
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-xl font-bold">
                    {isEspanol ? "Dirección" : "Address"}
                  </h3>
                  <a
                    target="_blank"
                    href={mapLink}
                    className="max-w-[270px] text-ocean underline"
                  >
                    {street1} {street2}
                    <br />
                    {city}, {state} {postalCode}
                  </a>
                  <h3 className="mt-3 text-xl font-bold">
                    {isEspanol ? "Teléfono" : "Phone"}
                  </h3>
                  <a href="tel:561-799-7600" className="text-ocean underline">
                    {phoneNumber}
                  </a>
                </div>
              </>
            )}
            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              {/* TODO: Open DESKTOP Share Popup - Designed? */}
              <Button
                intent="secondary"
                href={
                  online ? "mailto:online@christfellowship.church" : undefined
                }
                size="sm"
                className="font-bold"
              >
                {isEspanol
                  ? "INVITA A UN AMIGO"
                  : online
                  ? "CONTACT US"
                  : "INVITE A FRIEND"}
              </Button>
              <Button
                intent="primary"
                size="sm"
                href="/locations"
                className="font-bold"
              >
                {isEspanol ? "OTRAS UBICACIONES" : "MORE LOCATIONS"}
              </Button>
            </div>
          </div>
          <LocationSocialMedias />
        </div>
      </div>
    </div>
  );
};

const MobilePastorCard = () => {
  const {
    street1,
    street2,
    city,
    state,
    postalCode,
    mapLink,
    campusMapImage,
    name,
    phoneNumber,
    url,
  } = useLoaderData<LoaderReturnType>();
  const isEspanol = url.includes("iglesia");
  const online = url === "cf-everywhere";
  const shareMessage = {
    title: `${name} - Christ Fellowship Church`,
    faceBook: `Check out this Christ Fellowship Church location!`,
    twitter: `${name} - Christ Fellowship Church`,
    email: {
      subject: `${name} - Christ Fellowship Church`,
      body: `I thought you might be interested in attending this Christ Fellowship Church location: ${url} \n\n`,
    },
    sms: `I thought you might be interested in this attending this Christ Fellowship Church location: ${url}`,
  };

  return (
    <div className="flex w-full flex-col pb-5 pt-4 text-center lg:hidden">
      <PastorsImage />
      <div className="pb-6 pt-5">
        {/* Campus Location */}
        <div className="flex w-full flex-col items-center">
          {url !== "cf-everywhere" && (
            <>
              <a target="_blank" href={mapLink}>
                <img
                  src={campusMapImage}
                  alt="Campus Map"
                  width={250}
                  height={150}
                />
              </a>
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-xl font-bold">
                  {isEspanol ? "Dirección" : "Address"}
                </h3>
                <a
                  target="_blank"
                  href={mapLink}
                  className="max-w-[270px] text-ocean underline"
                >
                  {street1} {street2}
                  <br />
                  {city}, {state} {postalCode}
                </a>
                <h3 className="mt-3 text-xl font-bold">
                  {isEspanol ? "Teléfono" : "Phone"}
                </h3>
                <a href="tel:561-799-7600" className="text-ocean underline">
                  {phoneNumber}
                </a>
              </div>
            </>
          )}
          {/* Buttons */}
          <div className="mt-4 flex gap-3">
            <Button
              intent="secondary"
              href={
                online ? "mailto:online@christfellowship.church" : undefined
              }
              onClick={
                !online
                  ? () => {
                      try {
                        navigator
                          .share(shareMessage)
                          .then(() => console.log("Successful share"))
                          .catch((error) =>
                            console.log("Error sharing: ", error)
                          );
                      } catch (e) {
                        console.log("Error sharing", e);
                      }
                    }
                  : undefined
              }
              size="sm"
              className="font-bold"
            >
              {isEspanol
                ? "INVITA A UN AMIGO"
                : online
                ? "CONTACT US"
                : "INVITE A FRIEND"}
            </Button>
            <Button
              className="font-bold"
              intent="primary"
              size="sm"
              href="/locations"
            >
              {isEspanol ? "OTRAS UBICACIONES" : "MORE LOCATIONS"}
            </Button>
          </div>
        </div>
        <LocationSocialMedias />
      </div>
    </div>
  );
};

const ImageBorder = () => (
  <div className="h-1 w-24 border-b border-neutral-300" />
);

const PastorsImage = () => {
  const { campusPastors } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex w-full flex-col items-center pt-5">
      <div className="flex w-full items-center justify-center gap-4">
        <ImageBorder />
        <img
          src={campusPastors?.image}
          alt="Campus Pastors"
          width={120}
          height={120}
          className="rounded-full"
        />
        <ImageBorder />
      </div>
      <h3 className="pt-3 text-2xl font-bold">{campusPastors?.name}</h3>
      <p className="italic">Campus Pastors</p>
    </div>
  );
};

const LocationSocialMedias = () => {
  const { campusInstagram, youtube, facebook } =
    useLoaderData<LoaderReturnType>();

  return (
    <div className="mt-8 lg:mt-10 flex items-center justify-center gap-2">
      <a target="_blank" href={facebook}>
        <Icon name="facebook" size={32} color="#6BCABA" />
      </a>
      <a target="_blank" href={campusInstagram}>
        <Icon name="instagram" size={34} color="#6BCABA" />
      </a>
      <a target="_blank" href={youtube}>
        <Icon name="youtube" size={38} color="#6BCABA" />
      </a>
    </div>
  );
};

export default PastorCard;
