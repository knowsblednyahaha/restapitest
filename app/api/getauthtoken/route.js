import { NextResponse } from "next/server";
import { generateToken } from "@/utils/tokenUtils/getToken";

export const GET = async (request) => {
  try {
    const auth = request.headers.get("Authorization");
    const base64EncodedHeader = JSON.stringify(auth, null, 2);
    const base64Creds = base64EncodedHeader.split(" ")[1];
    const creditialsBuffer = Buffer.from(base64Creds, "base64");
    const decodedHeader = creditialsBuffer.toString("utf-8");
    const [email, password] = decodedHeader.split(":");

    const tokenResult = await generateToken(email, password);
    return NextResponse.json({ Token: tokenResult }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
