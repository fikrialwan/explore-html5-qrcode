"use client";

import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import { read } from "fs";

export default function ZxingLibrary() {
  const router = useRouter();

  const hints = new Map();
  const formats = [BarcodeFormat.CODE_39];

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
          facingMode: "environment"
        },
      },
      videoRef.current,
      (result) => {
        // if (result) console.log({result})
        // if (result) router.replace("/?result=" + result?.getText());

        if (result) {
          const height = videoRef.current?.videoHeight || 0;
          const heightCenter = height / 2;
          const resultPoints = result?.getResultPoints();
          const y = resultPoints.length ? resultPoints[resultPoints.length - 1].getY() : 0
          if (y > height - 60 && y < height + 60) {
            toast({
              title: JSON.stringify(result?.getText()),
              description: JSON.stringify({result: result?.getResultPoints(), heigth: videoRef.current?.videoHeight, y, height})})
          }
        }
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [videoRef]);

  return (
    <div className="h-full w-full relative">
      <video ref={videoRef} className="h-full w-full" />
      <div className="w-64 h-20 border-2 border-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
