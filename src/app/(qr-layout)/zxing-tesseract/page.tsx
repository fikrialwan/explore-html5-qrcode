"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { createWorker, createScheduler } from "tesseract.js";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import ScannerCanvas from "~/components/ui/scanner-canvas";

export default function ZxingTesseract() {
  const router = useRouter();
  const scheduler = createScheduler();

  const hints = new Map();
  const formats = [BarcodeFormat.CODE_39];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader(hints));

  const initialWorker = useCallback(async () => {
    const worker = await createWorker("eng");
    scheduler.addWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    initialWorker();
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
      (result) => {
        // if (result) console.log({result})
        // if (result) router.replace("/?result=" + result?.getText());

        if (result) {
          if (videoRef.current) {
            scheduler.addJob("recognize", videoRef.current).then(({ data }) =>
              toast({
                title: JSON.stringify(result?.getText()),
                description: JSON.stringify({ data }),
              })
            );
          }
          
          const height = videoRef.current?.videoHeight || 0;
          const heightCenter = height / 2;
          const resultPoints = result?.getResultPoints();
          const y = resultPoints.length
            ? resultPoints[resultPoints.length - 1].getY()
            : 0;
          if (y > heightCenter - 60 && y < heightCenter + 60) {
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
      <ScannerCanvas />
    </div>
  );
}
