import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
      <h2 className="text-lg font-semibold text-slate-950">Page not found</h2>
      <p className="mt-1 text-sm text-slate-600">The page you requested is not available.</p>
      <Link className="mt-4 inline-flex text-sm font-semibold text-blue-800" href="/">
        Return to dashboard
      </Link>
    </div>
  );
}
