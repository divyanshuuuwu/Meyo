"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  // 1. Check required fields
  if (!name || !email || !password) {
    console.log("All fields are required");
    return;
  }

  // 2. Basic password validation
  if (password.length < 8) {
    console.log("Password must be at least 8 characters");
    return;
  }

  try {
    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log("User already exists");
      return;
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("User registered successfully");
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return;
  }

  // 6. Redirect after successful registration
  redirect("/login");
}







export async function loginUser(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  // 1. Validate fields
  if (!email || !password) {
    console.log("Email and password are required");
    return;
  }

  try {
    // 2. Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 3. Check if user exists
    if (!user) {
      console.log("Invalid email or password");
      return;
    }

    // 4. Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      console.log("Invalid email or password");
      return;
    }

    // 5. Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    // 6. Store JWT in HTTP-only cookie
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return;
  }

  // 7. Redirect after successful login
  redirect("/discover");
}

