"use client";

import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useRouter } from "next/navigation";

export default function ZxingLibrary() {
    const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: "environment",
          height: screen.availHeight,
          width: screen.availWidth
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

  return <video ref={videoRef} className="h-full w-full" />;
}
