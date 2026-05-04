import {
  createOrFindSmsLoginUserId,
  hashPassword,
  parsePhoneNumberUtil,
} from "./sms-authentication";
import { AuthenticationError, RateLimitError } from "../error-types";
import redis from "../redis-config";

const SMS_ATTEMPT_LIMIT = 10;
const SMS_RATE_WINDOW_SECONDS = 3600;
import { patchRockData } from "../fetch-rock-data";
import { authenticateUser } from "./authenticate-user";
import { SmsAuthParams } from "./authentication.types";
import { fetchUserLogin } from "./rock-authentication";

export const authenticateOrRegisterWithSms = async ({
  pin,
  phoneNumber,
  userProfile,
  email,
}: SmsAuthParams) => {
  const { significantNumber } = parsePhoneNumberUtil(phoneNumber);

  if (redis) {
    const key = `sms:login_attempt:${significantNumber}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, SMS_RATE_WINDOW_SECONDS);
    }
    if (count > SMS_ATTEMPT_LIMIT) {
      throw new RateLimitError(
        "Too many login attempts. Please request a new PIN and try again.",
      );
    }
  } else {
    console.warn("⚠️ Redis unavailable — SMS login attempt rate limiting is disabled");
  }

  const userLogin = await fetchUserLogin(significantNumber);

  if (!userLogin) {
    throw new AuthenticationError("Invalid input");
  }

  if (userLogin && userLogin.personId === null) {
    const personId = await createOrFindSmsLoginUserId({
      phoneNumber,
      userProfile: userProfile || [],
      email,
    });

    await patchRockData({
      endpoint: `UserLogins/${userLogin?.id}`,
      body: {
        PersonId: personId,
      },
    });
  }

  const identity = phoneNumber;
  const password = hashPassword(pin);

  const { encryptedToken } = await authenticateUser(
    identity as string,
    password as string
  );

  // TODO: Consider calling redis.del(`sms:login_attempt:${significantNumber}`) here
  // on successful authentication so legitimate users who made typos aren't locked
  // out for the rest of the rate-limit window. This is a UX tradeoff — resetting
  // on success slightly reduces brute-force protection but is generally acceptable.

  return { encryptedToken, personId: userLogin.personId };
};
