import { json, LoaderFunction } from "@remix-run/node";
import { fetchRockData } from "~/lib/.server/fetchRockData";

export type LoaderReturnType = {
  campuses: string[];
  allThatApplies: { guid: string; value: string }[];
};

export const loader: LoaderFunction = async () => {
  const ALL_THAT_APPLIES_ID = 389; //Rock Define Type ID
  const rockDefineTypes = await fetchRockData("DefinedValues", {
    $filter: `DefinedTypeId eq ${ALL_THAT_APPLIES_ID}`,
    $select: "Guid, Value",
  });

  const campuses = await fetchRockData("Campuses", {
    $filter: "IsActive eq true",
    $orderby: "Order",
    $select: "Name",
  });

  const formData: LoaderReturnType = {
    campuses: campuses.map((campus: { name: string }) => campus.name),
    allThatApplies: rockDefineTypes,
  };

  return json<LoaderReturnType>(formData);
};
