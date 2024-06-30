"use client";

import { useEffect, useRef } from "react";

export default function ScanDocument() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const w = video.videoWidth * 0.8;
      const h = video.videoWidth * (5 / 8);
      canvas.width = w;
      canvas.height = h;
      canvas
        .getContext("2d")
        ?.drawImage(
          video,
          (video.videoWidth - w) / 2,
          video.videoHeight * 0.15,
          w,
          h,
          0,
          0,
          w,
          h
        );
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob as Blob);
        window.open(url);
      });
    }
  };

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
    <>
      <video
        ref={videoRef}
        className="h-screen w-screen fixed top-0 left-0 z-10"
      ></video>
      <div className="fixed w-full h-auto top-[15%] left-1/2 -translate-x-1/2 max-w-[80%] max-h-[60%] aspect-[8/5] border-white border-2 rounded-md bg-transparent shadow-scan z-20" />
      <button
        className="fixed w-full py-3 bg-black text-white bottom-0 left-0 z-50"
        onClick={handleCapture}
      >
        Capture
      </button>
    </>
  );
}
