"use client";

import "~/utils/dbr"; // import side effects. The license, engineResourcePath, so on.
import { BarcodeReader } from "dynamsoft-javascript-barcode";
import { useCallback, useEffect } from "react";
import VideoDecode from "~/components/ui/video-decode";

export default function Dynasoft() {
  const loadBarcode = useCallback(async () => {
    try {
      await BarcodeReader.loadWasm();
    } catch (ex: any) {
      if (ex.message.indexOf("network connection error")) {
        let customMsg =
          "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        console.log(customMsg);
        alert(customMsg);
      }
      throw ex;
    }
  }, []);

  useEffect(() => {
    loadBarcode();
  }, [loadBarcode]);

  return (
    <div className="w-full h-full">
      <VideoDecode />
    </div>
  );
}
