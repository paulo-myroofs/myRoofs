import { NextResponse } from "next/server";

import { initAdmin } from "@/config/firebaseAdmin";
import { activateUserAuthAdmin } from "@/store/services/firebaseAdmin";

export async function POST(request: Request) {
  const userUid = await request.json();
  await initAdmin();
  const { error } = await activateUserAuthAdmin(userUid);

  return NextResponse.json({ error });
}
