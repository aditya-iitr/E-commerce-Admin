import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    console.log("------------------------------------------------");
    console.log("🔍 LOGIN ATTEMPT FOR:", email);

    // 1. Find User
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ ERROR: User not found in database.");
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    console.log("✅ User found in DB");

    // 2. Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ ERROR: Password does not match hash.");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    console.log("✅ Password match");

    // 3. Check Verification
    console.log("User Verified Status:", user.isVerified);
    if (!user.isVerified) {
      console.log("❌ ERROR: User is not verified.");
      return NextResponse.json({ message: "Please verify your email first" }, { status: 403 });
    }

    // --- Success ---
    console.log("✅ LOGIN SUCCESSFUL. Generating Token...");
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}