import { data } from "react-router-dom";
import { fetchUserLogin } from "~/lib/.server/authentication/rock-authentication";

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
    return new Response(JSON.stringify({ userExists }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "An unknown error occurred" }, { status: 400 });
  }
};
