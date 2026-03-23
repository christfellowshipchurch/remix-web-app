import twilio from "twilio";

type TwilioClient = ReturnType<typeof twilio>;

let client: TwilioClient | null = null;

function getClient(): TwilioClient {
  if (client) {
    return client;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Missing required Twilio environment variables.");
  }
  client = twilio(accountSid, authToken);
  return client;
}

export function sendSms({ body, to }: { body: string; to: string }) {
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    throw new Error("Missing TWILIO_FROM_NUMBER environment variable.");
  }
  return getClient().messages.create({
    body,
    from: fromNumber,
    to,
  });
}
