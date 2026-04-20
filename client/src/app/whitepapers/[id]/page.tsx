import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import HubSpotForm from "@/components/HubSpotForm";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";

export const dynamic = "force-dynamic";

type WhitepaperDetail = {
  id: number;
  documentId: string;
  Title: string | null;
  LeftBlockText: string | null;
  hubspotid: string | null;
  RightBlock: string | null;
  Banner?: {
    url: string;
    width: number;
    height: number;
    alternativeText: string | null;
  } | null;
};

function mediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

async function getWhitepaper(id: string): Promise<WhitepaperDetail | null> {
  try {
    const url = `${STRAPI_URL}/api/white-paper-pages/${id}?populate[Banner]=true`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

const proseDark =
  "text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-blue-600 [&_a]:underline";

export default async function WhitepaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wp = await getWhitepaper(id);

  if (!wp) return notFound();

  return (
    <div>
      {/* ── Row 1: dark navy hero ── */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: breadcrumb + title + body */}
          <div className="pt-2">
            <Link
              href="/whitepapers"
              className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-block transition-colors"
            >
              ← Back to Whitepapers
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
              Whitepaper
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {wp.Title ?? "Untitled"}
            </h1>
            {wp.LeftBlockText && (
              <div className={proseDark}>
                <ReactMarkdown>{wp.LeftBlockText}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Right: form card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Download the whitepaper
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your details to get instant access.
            </p>
            {wp.hubspotid ? (
              <div className="hubspot-form-wrapper">
                <HubSpotForm formId={wp.hubspotid} />
              </div>
            ) : (
              <p className="text-sm text-gray-400">Form not configured.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Row 2: white section — image + right block ── */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: banner image */}
          <div>
            {wp.Banner?.url ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={mediaUrl(wp.Banner.url)}
                  alt={wp.Banner.alternativeText ?? wp.Title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
          </div>

          {/* Right: right block content */}
          <div>
            {wp.RightBlock && (
              <div className={proseDark}>
                <ReactMarkdown>{wp.RightBlock}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
