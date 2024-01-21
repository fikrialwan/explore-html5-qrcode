"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Custom() {
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [cameraId, setCameraId] = useState<string>("");

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        setCameraId(devices[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (cameraId) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        cameraId,
        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
          aspectRatio: window.innerWidth / (window.innerHeight - 120),
        },
        (decodedText: string) => {
          router.replace("/?result=" + decodedText);
        },
        undefined
      );

      return () => {
        html5QrCode.stop();
      };
    }
  }, [cameraId, router]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <h1>Custom page</h1>
      <div id="reader" className="flex-1" />
      <input type="file" hidden ref={inputFileRef} />
      <button className="py-4">Upload QR Code</button>
    </div>
  );
}
