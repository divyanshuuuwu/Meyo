import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await prisma.user.create({
    data: {
      name: "Divyanshu",
      email: "divyanshu@example.com",
    },
  });

  return NextResponse.json(user);
}