"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useRouter } from "next/navigation";

export default function ZxingLibrary() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [size, setSize] = useState({ heigth: 0, width: 0 });

  useEffect(() => {
    setSize({ heigth: screen.availHeight, width: screen.availWidth });
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: "environment",
          height: size.heigth,
          width: size.width,
        },
      },
      videoRef.current,
      (result) => {
        if (result) router.replace("/?result=" + result?.getText());
      }
    )

    return () => {
      reader.current.reset();
    };
  }, [videoRef, size.heigth, size.width]);

  return (
    <>
      <video ref={videoRef} className="h-full w-full" />
    </>
  );
}
