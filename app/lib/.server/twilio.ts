import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Missing required Twilio environment variables.");
}

const client = twilio(accountSid, authToken);

export function sendSms({ body, to }: { body: string; to: string }) {
  return client.messages.create({
    body,
    from: fromNumber,
    to,
  });
}
