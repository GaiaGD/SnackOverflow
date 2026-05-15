import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-vercel-reval-key");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = await request.json();
    const slugField = body?.fields?.slug;
    // Contentful sends locale-keyed fields: { "en-US": "value" }
    if (slugField && typeof slugField === "object") {
      slug = Object.values(slugField)[0] as string;
    } else if (typeof slugField === "string") {
      slug = slugField;
    }
  } catch {
    // body parsing failed — fall through to full revalidation
  }

  if (slug) {
    revalidatePath(`/${slug}`);
  } else {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? "all", now: Date.now() });
}
