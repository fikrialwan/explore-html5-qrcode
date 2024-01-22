"use client";

import { useRouter } from "next/navigation";
import { QrReader } from "react-qr-reader";

export default function OtherLibrary() {
  const router = useRouter();
  return (
    <div>
      <QrReader
        onResult={(result) => {
          if (result) {
            router.replace("/?result=" + result?.getText());
          }

        //   if (error) {
        //     console.log({ error });
        //   }
        }}
        constraints={{ facingMode: "environment" }}
        className="w-full h-full"
      />
    </div>
  );
}
