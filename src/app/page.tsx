import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { result } = searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav className="mb-32 flex flex-row text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/default"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Default{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Default scanner UI using easy mode
          </p>
        </Link>
      </nav>
      <section>
        <h1>Result</h1>
        {result &&
          typeof result === "string" &&
          (result.includes("https://") || result.includes("http://")) && (
            <Link href={result} target="_blank" rel="noopener noreferrer">
              {result}
            </Link>
          )}
        {result &&
          (typeof result !== "string" ||
            !(result.includes("https://") || result.includes("http://"))) && (
            <span>{JSON.stringify(result)}</span>
          )}
      </section>
    </main>
  );
}
