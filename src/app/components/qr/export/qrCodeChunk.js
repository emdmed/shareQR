import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const QRCodeChunk = ({ chunkedData, totalChunks}) => {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [stopInterval, setStopInterval] = useState(false);
  const [cycleDelay, setCycleDelay] = useState(300)

  useEffect(() => {
    if (chunkedData.length <= 1 || stopInterval) return;

    const interval = setInterval(() => {
      setCurrentChunk(prev => (prev + 1) % chunkedData.length);
    }, cycleDelay);

    return () => clearInterval(interval);
  }, [chunkedData, stopInterval, cycleDelay]);

  return (
    <div className="relative">
      <span className="font-xl font-bold">
        {currentChunk + 1} / {totalChunks} QR codes
      </span>
      <div className="border border-white border-8 m-8">
        <QRCode
          value={JSON.stringify(chunkedData[currentChunk])}
          size={256}
        />
      </div>
    </div>
  );
};

export default QRCodeChunk;
