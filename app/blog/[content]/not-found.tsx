import GlobalNavbar from "@/components/global/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <GlobalNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
