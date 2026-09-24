"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

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



