import { data } from "@remix-run/node";
import { fetchUserLogin } from "~/lib/.server/authentication/rockAuthentication";

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

export const userExists = async (identity: string) => {
  try {
    const userExists = await checkUserExists(identity as string);
    return { userExists };
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "An unknown error occurred" }, { status: 400 });
  }
};
