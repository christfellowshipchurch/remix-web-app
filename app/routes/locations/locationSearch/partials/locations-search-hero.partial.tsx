import Button from "~/primitives/button";
import Video from "~/primitives/Video";
import Icon from "~/primitives/icon";
import { CampusesReturnType } from "../loader";
import * as Form from "@radix-ui/react-form";
import { useLoaderData } from "react-router";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { useEffect, useState } from "react";
import { set } from "lodash";

type SearchProps = {
  setAddress: (address: string) => void;
  getCoordinates: () => void;
  searchCurrentLocation: () => void;
  locationActive: boolean;
  error?: string | null;
};

export const Search = ({
  setAddress,
  searchCurrentLocation,
  getCoordinates,
  locationActive,
  error,
}: SearchProps) => {
  const [serverErrors, setServerErrors] = useState(false);
  const { bgVideo } = useLoaderData<CampusesReturnType>();
  const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  useEffect(() => {
    if (error) {
      setServerErrors(true);
    }
  }, [error]);

  return (
    <div className="flex h-[70vh] w-full items-center justify-center md:h-[78vh]">
      <div className="relative flex size-full overflow-hidden">
        <Video
          src={bgVideo}
          autoPlay
          loop
          muted
          className="absolute left-0 top-0 size-full object-cover"
        />
        <div className="absolute size-full bg-[rgba(0,0,0,0.5)]" />
        <div className="absolute left-1/2 top-1/2 flex w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-6 rounded-xl bg-black/45 py-12 text-center text-white backdrop-blur lg:max-w-[900px]">
          <h1 className="text-[36px] font-bold">
            Christ Fellowship Church Locations
          </h1>
          <p className="max-w-[90vw] text-xl md:max-w-[560px]">
            Christ Fellowship is one church with many locations across South
            Florida, and online—wherever you are!
          </p>
          <Form.Root
            onSubmit={(e) => {
              e.preventDefault();
              getCoordinates();
            }}
            className="flex flex-col items-center gap-2.5"
          >
            <Form.Field name="zipcode" serverInvalid={serverErrors}>
              <Form.Control
                asChild
                className="flex w-[60vw] justify-between md:w-[440px] "
              >
                <input
                  className={`${defaultTextInputStyles} text-center text-black`}
                  placeholder="Enter zip code here"
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setServerErrors(false);
                  }}
                />
              </Form.Control>
              <Form.Message
                className="text-sm text-alert"
                match={(value) => !zipCodeRegex.test(value)}
              >
                Please enter valid a zipcode
              </Form.Message>
              {serverErrors && (
                <Form.Message className="text-sm text-alert">
                  {error}
                </Form.Message>
              )}
            </Form.Field>
            <Button type="submit" size="md">
              Find a Location
            </Button>
          </Form.Root>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className="cursor-pointer italic underline"
                onClick={() => searchCurrentLocation()}
              >
                Use my current location
              </div>
              <Icon size={16} color="white" name="locationArrow" />
            </div>
            {!locationActive && (
              <div className="text-sm italic text-alert">
                Enable Location Access & Try Again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
