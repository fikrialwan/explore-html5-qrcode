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
      () => {}
    );

    return () => {
      reader.current.reset();
    };
  }, [videoRef]);

  const handleCapture = async () => {
    if (videoRef.current) {
      const height = videoRef.current?.videoHeight || 0;
      const heightCenter = height / 2;
      const width = videoRef.current?.videoWidth || 0;
      const widthCenter = width / 2;

      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;

      c.getContext("2d")?.drawImage(
        videoRef.current,
        widthCenter - 144,
        heightCenter - 144,
        288,
        288,
        0,
        0,
        288,
        288
      );

      const imgObj = new Image();
      imgObj.src = c.toDataURL("image/png");
      imgObj.setAttribute("crossOrigin", "");
      const codeReader = new BrowserMultiFormatReader(hints);
      const result = await codeReader.decodeFromImage(imgObj);
      router.replace("/?result=" + result?.getText());
    }
  };

  return (
    <div className="h-full w-full relative">
      <video ref={videoRef} className="h-full w-full bg-black"></video>
      <ScannerQRCodeCanvas />
      <button
        className="bg-blue-500 py-2 px-4 rounded-2xl z-30 fixed left-1/2 -translate-x-1/2 bottom-1/4"
        onClick={handleCapture}
      >
        Capture
      </button>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
        width={500}
        height={500}
      />
    </div>
  );
}
