"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useToast } from "~/components/ui/use-toast";

export default function Custom() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [cameraId, setCameraId] = useState<string>("");

  const handleUploadScan: ChangeEventHandler<HTMLInputElement> = (event) => {
    const html5QrCode = new Html5Qrcode("upload");
    if (!event.target.files || event.target.files?.length == 0) {
      return;
    }

    const imageFile = event.target.files[0];
    html5QrCode
      .scanFile(imageFile, true)
      .then((decodedText) => {
        router.replace("/?result=" + decodedText);
      })
      .catch((_) => {
        toast({
          variant: "destructive",
          title: "QR Code tidak bisa dibaca.",
        });
      });
  };

  const handleClickButton = () => {
    inputFileRef.current?.click();
  };

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameraId(devices[devices.length - 1].id);
        }
      })
      .catch((err: string) => {
        if (`${err}` === "NotAllowedError: Permission denied") {
          toast({
            variant: "destructive",
            title: "Please enable your permission browser",
          });
        }
      });
  }, [toast]);

  useEffect(() => {
    const isLandscape = screen.height > screen.width;
    if (cameraId) {
      const html5QrCode = new Html5Qrcode("reader", true);
      html5QrCode.start(
        cameraId,
        {
          fps: 20,
          qrbox: {
            width: isLandscape ? 100 : 290,
            height: isLandscape ? 290 : 100,
          },
          videoConstraints: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            aspectRatio: { min: 1, max: 2, ideal: 1 },
            facingMode: "environment",
          },
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
    <div className="flex flex-col gap-2">
      <h1>Custom page</h1>
      <div id="reader" className="w-full" />
      <input
        type="file"
        hidden
        ref={inputFileRef}
        accept="image/*"
        onChange={handleUploadScan}
        id="upload"
      />
      <button className="py-4" onClick={handleClickButton}>
        Upload QR Code
      </button>
    </div>
  );
}
