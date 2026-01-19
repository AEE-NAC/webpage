// This file is minimized to prevent conflicts with app/[lang]/layout.tsx.
// Every Next.js app requires a root layout, but in a localized setup,
// the primary shell is usually provided by the dynamic [lang] segment.

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
