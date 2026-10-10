import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center sm:px-8">
      <p className="text-sm text-muted">404</p>
      <h1 className="display mt-2 text-4xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="mt-4 text-muted">The link may be out of date. My projects and contact details are on the home page.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-85"
      >
        Go to the home page
      </Link>
    </div>
  );
}
