"use client";

import { useRouter } from "next/navigation";
import { QrReader } from "react-qr-reader";

export default function OtherLibrary() {
  const router = useRouter();
  return (
    <div className="h-full">
      <QrReader
        onResult={(result) => {
          if (result) {
            router.replace("/?result=" + result?.getText());
          }
        }}
        constraints={{ facingMode: "environment" }}
        className="w-full h-full"
        containerStyle={{innerHeight: '100%', outerHeight: '100%'}}
      />
    </div>
  );
}
