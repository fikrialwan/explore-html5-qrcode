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
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        setCameraId(devices[devices.length - 1].id);
      }
    });
  }, []);

  useEffect(() => {
    if (cameraId) {
      const html5QrCode = new Html5Qrcode("reader", true);
      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: window.innerWidth / (window.innerHeight - 120),
        },
        (decodedText: string) => {
          router.replace("/?result=" + decodedText);
        },
        (errorMessage: string) => {
          console.log({errorMessage})
        }
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
