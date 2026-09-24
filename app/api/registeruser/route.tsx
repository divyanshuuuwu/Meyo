
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    // 1. Get data from request body
    const body = await request.json();

    const { name, email, password } = body;

    // 2. Basic validation
    if (!name || !email || !password) {
      return Response.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 6. Send response
    return Response.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return Response.json(
      {
        message: "Something went wrong",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

