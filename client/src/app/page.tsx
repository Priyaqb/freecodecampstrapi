const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";
const API_URL = `${STRAPI_URL}/api/home-page`;

export const dynamic = "force-dynamic";

type HomePageData = {
  data: {
    id?: number;
    documentId?: string;
    attributes?: {
      Title: string | null;
      Description: string | null;
    };
    Title?: string | null;
    Description?: string | null;
  } | null;
};

async function getHomePage(): Promise<HomePageData | null> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomeRoute() {
  const payload = await getHomePage();
  const data = payload?.data ?? null;

  const Title =
    data?.attributes?.Title ?? data?.Title ?? null;
  const Description =
    data?.attributes?.Description ?? data?.Description ?? null;

  if (!Title && !Description) {
    return (
      <main className="p-6">
        <p className="text-gray-600">
          No home page content yet. In Strapi admin go to Content Manager → Home
          Page, add a Title and Description, then click Publish.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6">
      {Title && <h1 className="text-2xl font-semibold">{Title}</h1>}
      {Description && (
        <p className="mt-4 text-gray-600 whitespace-pre-wrap">{Description}</p>
      )}
    </main>
  );
}
