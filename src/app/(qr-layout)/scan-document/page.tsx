"use client";

import { useEffect, useRef } from "react";

export default function ScanDocument() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          aspectRatio: { min: 1, max: 2, ideal: 1 },
          facingMode: "environment",
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
      })
      .catch(console.log);

    return () => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        if (stream.getTracks) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative bg-black">
      <video ref={videoRef} className="h-full w-full"></video>
    </div>
  );
}
