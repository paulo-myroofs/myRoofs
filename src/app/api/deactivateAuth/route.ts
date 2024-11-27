import { NextResponse } from "next/server";

import { initAdmin } from "@/config/firebaseAdmin";
import { deactivateUserAuthAdmin } from "@store/services/firebaseAdmin";

export async function POST(request: Request) {
  const userUid = await request.json();
  await initAdmin();
  const { error } = await deactivateUserAuthAdmin(userUid);

  return NextResponse.json({ error });
}
