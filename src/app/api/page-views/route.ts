import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug, postId } = await req.json();
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "direct";

    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || "unknown";

    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoResponse.json();
    const region = geo
      ? `${geo.city}, ${geo.region}, ${geo.country_name}`
      : "unknown";

    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";

    const userId = crypto.createHash("sha256").update(ip).digest("hex");

    if (!slug) {
      return NextResponse.json({ error: "Missing Slug" }, { status: 405 });
    }

    const existingView = await prisma.pageView.findFirst({
      where: {
        postSlug: slug,
        userId,
      },
    });

    if (!existingView) {
      await prisma.pageView.create({
        data: {
          postSlug: slug,
          userId,
          browser,
          referrer,
          region,
          timezone,
          postId,
        },
      });
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          viewCount: { increment: 1 },
        },
      });
    }

    const totalViews = await prisma.pageView.count({
      where: {
        postSlug: slug,
      },
    });

    return NextResponse.json({ pageViews: totalViews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
