"use client";

import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { useRouter } from "next/navigation";

export default function ZxingLibrary() {
  const router = useRouter();

  const hints = new Map();
  const formats = [BarcodeFormat.CODE_39];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader(hints));

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current;
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
      (result) => {
        if (result) router.replace("/?result=" + result?.getText());
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [videoRef]);

  return (
    <video ref={videoRef} className="max-h-32 w-full" />
  );
}
