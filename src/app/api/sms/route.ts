/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vonage } from "@vonage/server-sdk";
import { NextResponse } from "next/server";

const vonage = new Vonage({
  apiKey: process.env.NEXT_PUBLIC_VONAGE_API_KEY,
  apiSecret: process.env.NEXT_PUBLIC_VONAGE_API_SECRET
} as any);

export async function POST(request: Request) {
  const { to, from, text } = await request.json();

  return await vonage.sms
    .send({ to: "55" + to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
      return NextResponse.json({ error: null });
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
      return NextResponse.json({ error: err });
    });
}
