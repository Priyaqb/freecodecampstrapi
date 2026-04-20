import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-8 h-14 flex items-center gap-8">
        <Link href="/" className="font-semibold text-gray-900 text-sm">
          Home
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/blogs"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/whitepapers"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Whitepapers
          </Link>
        </nav>
      </div>
    </header>
  );
}
