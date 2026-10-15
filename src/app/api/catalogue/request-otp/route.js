import crypto from "node:crypto";
import { getDb } from "@/lib/mongodb";
import { sendCatalogueOtp } from "@/lib/mailer";
import { sendFormNotification } from "@/lib/mailer";
import { createRateLimiter, tooManySubmissions } from "@/lib/rateLimit";
import {
  createDownloadToken,
  hashOtp,
  OTP_TTL_MS,
  VERIFIED_EMAIL_COOKIE,
  verifyEmailToken,
} from "@/lib/catalogueDownload";
import { validateCatalogueDetails } from "@/lib/formValidation";
import { normalizeTracking } from "@/lib/serverTracking";

export const runtime = "nodejs";
const isRateLimited = createRateLimiter({ windowMs: 15 * 60_000, max: 5 });

export async function POST(request) {
  if (isRateLimited(request)) return tooManySubmissions();
  const body = await request.json().catch(() => null);
  const details = {
    firstName: String(body?.firstName || "").trim().slice(0, 100),
    designation: String(body?.designation || "").trim().slice(0, 120),
    department: String(body?.department || "").trim().slice(0, 120),
    companyName: String(body?.companyName || "").trim().slice(0, 160),
    productName: String(body?.productName || "").trim().slice(0, 200),
    industry: String(body?.industry || "").trim().slice(0, 120),
    country: "India",
    state: String(body?.state || "").trim().slice(0, 120),
    city: String(body?.city || "").trim().slice(0, 120),
    email: String(body?.email || "").trim().toLowerCase().slice(0, 254),
    contact: String(body?.contact || "").trim().slice(0, 20),
  };
  const productSlug = String(body?.productSlug || "product").trim().slice(0, 160);
  const validationErrors = validateCatalogueDetails(details);
  const tracking = normalizeTracking(body, request);

  if (Object.keys(validationErrors).length) {
    return Response.json({ success: false, message: "Please correct the highlighted fields.", errors: validationErrors }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const otp = String(crypto.randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  try {
    const db = await getDb();
    const verifiedEmail = verifyEmailToken(request.cookies.get(VERIFIED_EMAIL_COOKIE)?.value);

    if (verifiedEmail?.email === details.email) {
      const verifiedAt = new Date();
      await db.collection("catalogueDownloads").insertOne({
        ...details,
        productSlug,
        tracking,
        verifiedAt,
        verificationMethod: "trusted-24-hour-cookie",
      });
      try {
        await sendFormNotification({
          subject: `Verified catalogue download: ${details.productName}`,
          fields: details,
          replyTo: details.email,
          to: "info@inkarp.co.in",
          tracking,
        });
      } catch (error) {
        console.error("[catalogue/notification]", error.message);
      }
      const token = createDownloadToken({ requestId, productSlug });
      return Response.json({
        success: true,
        alreadyVerified: true,
        downloadUrl: `/api/catalogue/download?token=${encodeURIComponent(token)}`,
        message: "Email verified. Your catalogue download has started.",
      });
    }

    const collection = db.collection("catalogueDownloadOtps");
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await collection.insertOne({
      requestId, ...details, productSlug, tracking,
      otpHash: hashOtp({ otp, requestId, email: details.email }),
      attempts: 0,
      createdAt: new Date(),
      expiresAt,
    });
    await sendCatalogueOtp({ to: details.email, name: details.firstName, otp, productName: details.productName });
    return Response.json({ success: true, requestId, message: "Verification code sent to your email." });
  } catch (error) {
    console.error("[catalogue/request-otp]", error.message);
    return Response.json({ success: false, message: "We could not send the verification code. Please try again shortly." }, { status: 500 });
  }
}
