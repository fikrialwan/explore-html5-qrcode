import React from "react";

const ScannerQRCodeCanvas = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 overflow-hidden">
      <div className="w-72 h-72 bg-transparent relative shadow-[0_0_0_100vh_rgba(0,0,0,0.2)] rounded-lg">
        <div className="absolute top-0 w-72 h-1 bg-gradient-to-b from-white/95 to-transparent animate-qrcode-scanning" />
        <div className="absolute bg-white w-10 h-1 -top-2 -left-1" />
        <div className="absolute bg-white w-10 h-1 -top-2 -right-1" />
        <div className="absolute bg-white w-10 h-1 -bottom-2 -left-1" />
        <div className="absolute bg-white w-10 h-1 -bottom-2 -right-1" />
        <div className="absolute bg-white w-1 h-10 -top-2 -left-2" />
        <div className="absolute bg-white w-1 h-10 -bottom-2 -left-2" />
        <div className="absolute bg-white w-1 h-10 -top-2 -right-2" />
        <div className="absolute bg-white w-1 h-10 -bottom-2 -right-2" />
      </div>
    </div>
  );
};

export default ScannerQRCodeCanvas;
