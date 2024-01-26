"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useRouter } from "next/navigation";

export default function Quagga2() {
  const router = useRouter();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [cameraId, setCameraId] = useState<string>();

  const errorCheck = (result: QuaggaJSResultObject) => {
    router.replace("/?result=" + result.codeResult.code);
  };
  
  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log("Cameras Detected: ", cameras);
      return cameras;
    };
    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then((cameras) => setCameraId(cameras[cameras.length - 1].deviceId))
      .then(() => Quagga.CameraAccess.disableTorch()) // disable torch at start, in case it was enabled before and we hot-reloaded
      .catch((err) => console.log(err));
    return () => {
      disableCamera();
    };
  }, []);

  useLayoutEffect(() => {
    let ignoreStart = false;
    const init = async () => {
      if (!scannerRef.current) return;
      // wait for one tick to see if we get unmounted before we can possibly even begin cleanup
      await new Promise((resolve) => setTimeout(resolve, 1));
      if (ignoreStart) {
        return;
      }
      // begin scanner initialization
      await Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              aspectRatio: { min: 1, max: 2, ideal: 1 },
              ...(cameraId && { deviceId: cameraId }),
              ...(!cameraId && { facingMode: "environment" }),
            },
            target: scannerRef.current,
            willReadFrequently: true,
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
            willReadFrequently: true,
          },
          decoder: { readers: ["code_39_vin_reader"] },
          locate: true,
        },
        async (err) => {
          if (err) {
            return console.error("Error starting Quagga:", err);
          }
          if (scannerRef && scannerRef.current) {
            await Quagga.start();
          }
        }
      );
      Quagga.onDetected(errorCheck);
    };
    init();
    // cleanup by turning off the camera and any listeners
    return () => {
      ignoreStart = true;
      Quagga.stop();
      Quagga.offDetected(errorCheck);
      Quagga.offProcessed(() => {});
    };
  }, [cameraId, scannerRef, errorCheck]);

  return (
    <div ref={scannerRef} className="w-full h-full relative" />
  );
}
