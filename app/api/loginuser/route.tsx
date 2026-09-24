
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // 1. Get data from request body
    const body = await request.json();

    const { email, password } = body;

    // 2. Basic validation
    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 3. Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 4. Check if user exists
    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5. Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 6. Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    // 7. Create response
    const response = Response.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // 8. Store JWT in HTTP-only cookie
   const cookieStore = await cookies();

    cookieStore.set("token", token, {
     httpOnly: true,
     maxAge: 60 * 60 * 24 * 7,
     sameSite: "lax",
     path: "/",
        });
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

