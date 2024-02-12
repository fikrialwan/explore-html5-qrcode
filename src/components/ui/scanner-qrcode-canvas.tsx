import React from "react";

const ScannerQRCodeCanvas = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-row z-10">
      <div className="bg-black/20 flex-1 h-full" />
      <div className="h-full flex flex-col">
        <div className="bg-black/20 flex-1 w-full" />
        <div className="w-72 h-72 bg-transparent relative">
          <div className="absolute top-0 w-72 h-1 bg-gradient-to-b from-white/95 to-transparent animate-qrcode-scanning" />
          <div className="absolute bg-white w-10 h-1 -top-1 left-0" />
          <div className="absolute bg-white w-10 h-1 -top-1 right-0" />
          <div className="absolute bg-white w-10 h-1 -bottom-1 left-0" />
          <div className="absolute bg-white w-10 h-1 -bottom-1 right-0" />
          <div className="absolute bg-white w-1 h-10 -top-1 -left-1" />
          <div className="absolute bg-white w-1 h-10 -bottom-1 -left-1" />
          <div className="absolute bg-white w-1 h-10 -top-1 -right-1" />
          <div className="absolute bg-white w-1 h-10 -bottom-1 -right-1" />
        </div>
        <div className="bg-black/20 flex-1 w-full" />
      </div>
      <div className="bg-black/20 flex-1 h-full" />
    </div>
  );
};

export default ScannerQRCodeCanvas;
