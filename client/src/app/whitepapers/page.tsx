import Link from "next/link";
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";
const API_URL = `${STRAPI_URL}/api/white-paper-pages?populate[Banner]=true`;

export const dynamic = "force-dynamic";

type WhitepaperEntry = {
  id: number;
  documentId: string;
  Title: string | null;
  Banner?: {
    url: string;
    alternativeText: string | null;
  } | null;
};

function mediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

async function getWhitepapers(): Promise<WhitepaperEntry[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function WhitepapersPage() {
  const whitepapers = await getWhitepapers();

  if (whitepapers.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Whitepapers</h1>
        <p className="text-gray-500">No whitepapers published yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Whitepapers</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {whitepapers.map((wp) => (
          <li key={wp.documentId}>
            <Link
              href={`/whitepapers/${wp.documentId}`}
              className="block h-full rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all overflow-hidden"
            >
              {wp.Banner?.url && (
                <div className="relative w-full h-48">
                  <Image
                    src={mediaUrl(wp.Banner.url)}
                    alt={wp.Banner.alternativeText ?? wp.Title ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                  {wp.Title ?? "Untitled"}
                </h2>
                <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                  Download →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
