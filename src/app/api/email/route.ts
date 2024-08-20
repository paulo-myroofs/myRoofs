import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const data = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
      pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `MyRoofs <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
      to: data.email,
      replyTo: process.env.NEXT_PUBLIC_NODEMAILER_USER,
      subject: `Sua conta para acessar o MyRoofs como empresa é: `,
      html: `
        <p>Email: ${data.email} </p>
        <p>Senha: ${data.password} </p>
        `
    });
    return NextResponse.json({ error: null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Não foi possível enviar o email" });
  }
}
