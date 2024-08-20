interface SendSmsProps {
  from?: string; //
  to: string; // phone number
  text: string;
}

export async function sendBrSms({ from = "MyRoofs", to, text }: SendSmsProps) {
  return await fetch("/api/sms", {
    method: "post",
    body: JSON.stringify({
      from,
      to,
      text
    })
  }).then((data) => data.json());
}
