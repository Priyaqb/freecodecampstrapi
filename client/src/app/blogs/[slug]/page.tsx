import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";

function mediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

export const dynamic = "force-dynamic";

type Author = {
  id: number;
  authorname: string | null;
  authordesignation: string | null;
  authorpic?: {
    url: string;
    width: number;
    height: number;
    alternativeText: string | null;
  } | null;
};

type BlogDetail = {
  id: number;
  documentId: string;
  blogtitle: string | null;
  publishedAt: string | null;
  blogcontent: string | null;
  Banner?: {
    Title?: string | null;
    blogpublishingdate?: string | null;
    timetoread?: string | null;
    thumbnail?: Array<{
      id: number;
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
    }>;
    authors?: Author[];
  } | null;
};

async function getBlog(slug: string): Promise<BlogDetail | null> {
  try {
    const url = `${STRAPI_URL}/api/blog-pages?filters[slug][$eq]=${encodeURIComponent(slug)}`;
    console.log("Fetching:", url);
    const res = await fetch(url, { next: { revalidate: 60 } });
    console.log("Status:", res.status);
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Data length:", json.data?.length);
    return json.data?.[0] ?? null;
  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();

  const banner = blog.Banner;
  const thumbnail = banner?.thumbnail?.[0];
  const authors = banner?.authors ?? [];
  const date = banner?.blogpublishingdate ?? blog.publishedAt;

  return (
    <main className="max-w-3xl mx-auto p-8">
      {/* Back link */}
      <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-800 mb-8 inline-block">
        ← Back to Blog
      </Link>

      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
          <Image
            src={mediaUrl(thumbnail.url)}
            alt={thumbnail.alternativeText ?? blog.blogtitle ?? ""}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {banner?.Title ?? blog.blogtitle ?? "Untitled"}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{formatDate(date)}</span>
        {banner?.timetoread && (
          <>
            <span>·</span>
            <span>{banner.timetoread} read</span>
          </>
        )}
      </div>

      {/* Authors */}
      {authors.length > 0 && (
        <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-6">
          {authors.map((author) => (
            <div key={author.id} className="flex items-center gap-3">
              {author.authorpic?.url && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={mediaUrl(author.authorpic.url)}
                    alt={author.authorname ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{author.authorname}</p>
                {author.authordesignation && (
                  <p className="text-xs text-gray-500">{author.authordesignation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Content */}
      {blog.blogcontent && (
        <section className="mt-10 border-t border-gray-100 pt-8">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
            {blog.blogcontent}
          </div>
        </section>
      )}
    </main>
  );
}
