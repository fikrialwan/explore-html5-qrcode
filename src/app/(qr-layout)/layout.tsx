import Link from "next/link";

export default function QrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full max-w-5xl m-auto">
      <nav className="py-6">
        <Link href="/">&lt;- Back</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
