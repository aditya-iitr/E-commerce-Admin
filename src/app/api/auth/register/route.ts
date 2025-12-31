import { NextResponse } from "next/server";
import connectToDB from "@/lib/db"; // Use your existing DB connection helper
import User from "@/models/User";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, email, password } = await req.json();

    // 1. Check for IITR Domain
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { message: "Access Restricted: Use your email ends with- @gmail.com ." },
        { status: 403 }
      );
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 4. CHECK BEFORE UPDATING
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      //  STOP: User is already a real member. Don't touch their data.
      return NextResponse.json(
        { message: "User already exists. Please login." },
        { status: 400 }
      );
    }

    // If user doesn't exist OR exists but isn't verified yet (e.g. retry), it's safe to update.
    await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp, otpExpiry, isVerified: false },
      { upsert: true, new: true }
    );

    // 5. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"IITR Store Team" <no-reply@iitr.ac.in>',
      to: email,
      subject: "Your Team Verification Code",
      html: `<div style="font-family: sans-serif; padding: 20px;">
              <h2>Welcome to the Team, ${name}!</h2>
              <p>Your verification code is:</p>
              <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
              <p>This code expires in 10 minutes.</p>
             </div>`,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error sending OTP" }, { status: 500 });
  }
}
