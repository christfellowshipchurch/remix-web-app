import { fetchRockData } from "~/lib/.server/fetchRockData";

export type ConnectCardDataType = {
  campuses: string[];
  allThatApplies: { guid: string; value: string }[];
};

export const fetchConnectCardData = async () => {
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

  const formData: ConnectCardDataType = {
    campuses: campuses.map((campus: { name: string }) => campus.name),
    allThatApplies: rockDefineTypes,
  };

  return <ConnectCardDataType>formData;
};
