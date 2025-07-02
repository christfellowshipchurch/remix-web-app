import { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { ConnectCardLoaderReturnType } from "./types";

export const loader: LoaderFunction = async () => {
  // All That Applies Checkboxes
  const ALL_THAT_APPLIES_ID = 389; //Rock Define Type ID
  const rockDefineTypes = await fetchRockData({
    endpoint: "DefinedValues",
    queryParams: {
      $filter: `DefinedTypeId eq ${ALL_THAT_APPLIES_ID}`,
      $select: "Guid, Value",
    },
  });

  // Campuses
  const campuses = await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: "IsActive eq true",
      $orderby: "Order",
      $select: "Name, Guid",
    },
  });

  const data: ConnectCardLoaderReturnType = {
    campuses: campuses,
    allThatApplies: rockDefineTypes,
  };

  return <ConnectCardLoaderReturnType>data;
};
