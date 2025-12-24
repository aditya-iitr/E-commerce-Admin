import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Verify User & Clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Create Session Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Verified successfully" });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}