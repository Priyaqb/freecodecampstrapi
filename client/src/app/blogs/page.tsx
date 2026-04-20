import Link from "next/link";
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";
const API_URL = `${STRAPI_URL}/api/blog-pages`;

export const dynamic = "force-dynamic";

type BlogEntry = {
  id: number;
  documentId: string;
  slug: string | null;
  blogtitle: string | null;
  publishedAt: string | null;
  featuredimage?: {
    url: string;
    width: number;
    height: number;
    alternativeText: string | null;
  } | null;
  Banner?: {
    blogpublishingdate?: string | null;
  } | null;
};

function mediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

async function getBlogs(): Promise<BlogEntry[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
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

export default async function BlogsPage() {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <p className="text-gray-500">No blog posts published yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>
      <ul className="flex flex-wrap gap-6">
        {blogs.map((blog) => {
          const date = blog.Banner?.blogpublishingdate ?? blog.publishedAt;
          return (
            <li key={blog.documentId} className="w-[400px]">
              <Link
                href={`/blogs/${blog.slug ?? blog.documentId}`}
                className="block h-full rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all overflow-hidden"
              >
                {blog.featuredimage?.url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={mediaUrl(blog.featuredimage.url)}
                      alt={blog.featuredimage.alternativeText ?? blog.blogtitle ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {blog.blogtitle ?? "Untitled"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{formatDate(date)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
