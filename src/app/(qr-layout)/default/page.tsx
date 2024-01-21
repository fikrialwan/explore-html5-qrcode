"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function Default() {
  const router = useRouter();

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText: string) {
      html5QrcodeScanner.clear().catch();
      router.replace("/?result=" + decodedText);
    }

    html5QrcodeScanner.render(onScanSuccess, undefined);

    return () => {
      html5QrcodeScanner.clear().catch();
    };
  }, [router]);

  return (
    <div>
      <h1>Default Page</h1>
      <div id="reader" />
    </div>
  );
}
