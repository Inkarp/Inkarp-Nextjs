import { getDb } from "@/lib/mongodb";
import { sendFormNotification } from "@/lib/mailer";
import { createRateLimiter, tooManySubmissions } from "@/lib/rateLimit";
import {
  createDownloadToken,
  createVerifiedEmailToken,
  hashOtp,
  otpMatches,
  VERIFIED_EMAIL_COOKIE,
  VERIFIED_EMAIL_TTL_MS,
} from "@/lib/catalogueDownload";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const isRateLimited = createRateLimiter({ windowMs: 15 * 60_000, max: 12 });

export async function POST(request) {
  if (isRateLimited(request)) return tooManySubmissions();
  const body = await request.json().catch(() => null);
  const requestId = String(body?.requestId || "");
  const otp = String(body?.otp || "").replace(/\D/g, "").slice(0, 6);
  if (!requestId || otp.length !== 6) {
    return Response.json({ success: false, message: "Enter the 6-digit verification code." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection("catalogueDownloadOtps");
    const record = await collection.findOne({ requestId });
    if (!record || record.expiresAt <= new Date() || record.verifiedAt) {
      return Response.json({ success: false, message: "This code has expired. Request a new code." }, { status: 400 });
    }
    if ((record.attempts || 0) >= 5) {
      return Response.json({ success: false, message: "Too many incorrect attempts. Request a new code." }, { status: 429 });
    }

    const candidate = hashOtp({ otp, requestId, email: record.email });
    if (!otpMatches(record.otpHash, candidate)) {
      await collection.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      return Response.json({ success: false, message: "Incorrect code. Please check your email and try again." }, { status: 400 });
    }

    const verifiedAt = new Date();
    const verification = await collection.updateOne(
      { _id: record._id, verifiedAt: { $exists: false } },
      { $set: { verifiedAt } }
    );
    if (!verification.modifiedCount) {
      return Response.json({ success: false, message: "This code has already been used. Request a new code." }, { status: 409 });
    }
    await db.collection("catalogueDownloads").insertOne({
      firstName: record.firstName,
      designation: record.designation,
      department: record.department,
      companyName: record.companyName,
      productName: record.productName,
      industry: record.industry,
      country: record.country,
      state: record.state,
      city: record.city,
      email: record.email,
      contact: record.contact,
      tracking: record.tracking,
      productSlug: record.productSlug,
      verifiedAt,
    });

    try {
      await sendFormNotification({
        subject: `Verified catalogue download: ${record.productName}`,
        fields: {
          firstName: record.firstName,
          designation: record.designation,
          department: record.department,
          companyName: record.companyName,
          productName: record.productName,
          industry: record.industry,
          country: record.country,
          state: record.state,
          city: record.city,
          email: record.email,
          contact: record.contact,
        },
        replyTo: record.email,
        to: "info@inkarp.co.in",
        tracking: record.tracking,
      });
    } catch (error) {
      console.error("[catalogue/notification]", error.message);
    }

    const token = createDownloadToken({ requestId, productSlug: record.productSlug });
    const response = NextResponse.json({
      success: true,
      downloadUrl: `/api/catalogue/download?token=${encodeURIComponent(token)}`,
      verifiedForHours: 24,
    });
    response.cookies.set({
      name: VERIFIED_EMAIL_COOKIE,
      value: createVerifiedEmailToken(record.email),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(VERIFIED_EMAIL_TTL_MS / 1000),
    });
    return response;
  } catch (error) {
    console.error("[catalogue/verify-otp]", error.message);
    return Response.json({ success: false, message: "Verification is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
