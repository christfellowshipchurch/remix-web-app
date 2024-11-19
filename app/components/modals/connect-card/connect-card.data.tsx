import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { ConnectCardLoaderReturnType } from "~/routes/connect-card/types";

export const useConnectCardData = () => {
  const fetcher = useFetcher();
  const [data, setData] = useState<ConnectCardLoaderReturnType>({
    campuses: [],
    allThatApplies: [],
  });

  useEffect(() => {
    fetcher.load("/connect-card");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data as ConnectCardLoaderReturnType);
    }
  }, [fetcher.data]);

  return data;
};
