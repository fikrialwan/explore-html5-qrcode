"use client";

import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { useRouter } from "next/navigation";
import ScannerQRCodeCanvas from "~/components/ui/scanner-qrcode-canvas";

export default function ZxingLibrary() {
  const router = useRouter();

  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader(hints));

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          aspectRatio: { min: 1, max: 2, ideal: 1 },
          facingMode: "environment",
        },
      },
      videoRef.current,
      async (result) => {
        // if (result) console.log({result})
        // if (result) router.replace("/?result=" + result?.getText());

        if (result) {
          const height = videoRef.current?.videoHeight || 0;
          const heightCenter = height / 2;
          const resultPoints = result?.getResultPoints();
          const y = resultPoints.length
            ? resultPoints[resultPoints.length - 1].getY()
            : 0;
          if (y > heightCenter - 144 && y < heightCenter + 144) {
            router.replace("/?result=" + result?.getText());
          }
        }
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [videoRef, router]);

  return (
    <div className="h-full w-full relative">
      <video ref={videoRef} className="h-full w-full bg-black"></video>
      <ScannerQRCodeCanvas />
    </div>
  );
}
