import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectToDB();
  // Fetch all users who have verified their email
  // We only select 'name' and 'email' for privacy
  const teamMembers = await User.find({ isVerified: true })
                                .select("name email createdAt")
                                .sort({ createdAt: -1 }); // Newest members first

  return NextResponse.json(teamMembers);
}