import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";

export const dynamic = "force-dynamic";

type Author = {
  id: number;
  authorname: string | null;
  authordesignation: string | null;
  authorpic?: {
    url: string;
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

function mediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

async function getBlog(slug: string): Promise<BlogDetail | null> {
  try {
    const url = `${STRAPI_URL}/api/blog-pages?filters[slug][$eq]=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] ?? null;
  } catch {
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
      <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-800 mb-8 inline-block">
        ← Back to Blog
      </Link>

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

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {banner?.Title ?? blog.blogtitle ?? "Untitled"}
      </h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{formatDate(date)}</span>
        {banner?.timetoread && (
          <>
            <span>·</span>
            <span>{banner.timetoread} read</span>
          </>
        )}
      </div>

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

      {blog.blogcontent && (
        <section className="mt-10 border-t border-gray-100 pt-8">
          <div className="text-gray-800 leading-relaxed text-base [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto">
            <ReactMarkdown>{blog.blogcontent}</ReactMarkdown>
          </div>
        </section>
      )}
    </main>
  );
}
