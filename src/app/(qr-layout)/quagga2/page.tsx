"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useRouter } from "next/navigation";

export default function Quagga2() {
  const router = useRouter();
  const scannerRef = useRef<HTMLDivElement>(null);
  const [cameraId, setCameraId] = useState<string>();

  const errorCheck = (result: QuaggaJSResultObject) => {
    const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
    // if Quagga is at least 75% certain that it read correctly, then accept the code.
    if ((err || 0) < 0.25) {
      // router.replace("/?result=" + result?.getText());
    }
  };

  function getMedian(arr: (number | undefined)[]) {
    const newArr = [...arr]; // copy the array before sorting, otherwise it mutates the array passed in, which is generally undesireable
    newArr.sort((a, b) => (a || 0) - (b || 0));
    const half = Math.floor(newArr.length / 2);
    if (newArr.length % 2 === 1) {
      return newArr[half];
    }
    return ((newArr[half - 1] || 0) + (newArr[half] || 0)) / 2;
  }

  function getMedianOfCodeErrors(
    decodedCodes: {
      error?: number | undefined;
      code: number;
      start: number;
      end: number;
    }[]
  ) {
    const errors = decodedCodes.flatMap((x) => x.error);
    const medianOfErrors = getMedian(errors);
    return medianOfErrors;
  }

  const handleProcessed = (result: QuaggaJSResultObject) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = "24px Arial";
    drawingCtx.fillStyle = "green";

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width") || "0"),
          parseInt(drawingCanvas.getAttribute("height") || "0")
        );
        result.boxes
          .filter((box) => box !== result.box)
          .forEach((box) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: "purple",
              lineWidth: 2,
            });
          });
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "blue",
          lineWidth: 2,
        });
      }
      if (result.codeResult && result.codeResult.code) {
        drawingCtx.font = "24px Arial";
        drawingCtx.fillText(result.codeResult.code, 10, 20);
      }
    }
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
          decoder: { readers: ["code_39_vin_reader", "code_39_reader", "code_128_reader"] },
          locate: true,
        },
        async (err) => {
          Quagga.onProcessed(handleProcessed);

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
      Quagga.offProcessed(handleProcessed);
    };
  }, [cameraId, scannerRef, errorCheck]);

  return (
    <div ref={scannerRef} className="w-full h-full relative">
      <canvas
        className="drawingBuffer absolute border-2 border-green-500"
        width="290"
        height="100"
      />
    </div>
  );
}
