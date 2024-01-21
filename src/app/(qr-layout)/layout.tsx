import Link from "next/link";

export default function QrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full max-w-5xl m-auto flex flex-col">
      <header>
        <nav className="py-6 px-4">
          <Link href="/">&lt;- Back</Link>
        </nav>
      </header>
      <main className="px-4 flex-1">{children}</main>
    </div>
  );
}
