import { ActionFunction, json } from "@remix-run/node";
import { fetchRockData } from "~/lib/.server/fetchRockData";

export const fetchUserLogin = async (identity: string) => {
  return await fetchRockData("UserLogins", {
    $filter: `UserName eq '${identity}'`,
    $top: "1",
  });
};

export const checkUserExists = async (identity: string): Promise<boolean> => {
  const login = await fetchUserLogin(identity);

  if (Array.isArray(login) && login.length > 0) {
    return true;
  } else if (
    login &&
    typeof login === "object" &&
    Object.keys(login).length > 0
  ) {
    return true;
  }
  return false;
};

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const identity = formData.get("identity");

  try {
    const userExists = await checkUserExists(identity as string);
    return json({ userExists });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: "An unknown error occurred" }, { status: 400 });
  }
};
