import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import gifshot from "gifshot";
import { Button } from "@/components/ui/button";
import useIsMobile from "@/app/hooks/useIsMobile";

const QRCodeChunk = ({ chunkedData, totalChunks }) => {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [stopInterval, setStopInterval] = useState(false);
  const [cycleDelay] = useState(300);
  const [isDownloadDouble, setIsDownloadDouble] = useState(false)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const qrRef = useRef(null);
  const isMobile = useIsMobile()

  useEffect(() => {
    if (chunkedData.length <= 1 || stopInterval) return;
    const interval = setInterval(() => {
      setCurrentChunk(prev => (prev + 1) % chunkedData.length);
    }, cycleDelay);
    return () => clearInterval(interval);
  }, [chunkedData, stopInterval, cycleDelay]);

  const handleDownloadGif = async () => {
    setIsGeneratingGif(true)
    setStopInterval(true);
    const frames = [];

    for (let i = 0; i < chunkedData.length; i++) {
      setCurrentChunk(i);
      await new Promise(resolve => setTimeout(resolve, cycleDelay + 50));
      const canvas = await html2canvas(qrRef.current);
      frames.push(canvas.toDataURL("image/png"));
    }

    gifshot.createGIF(
      {
        images: frames,
        gifWidth: 600,
        gifHeight: isDownloadDouble ? 300 : 600,
        interval: cycleDelay / 1000,
      },
      function(obj) {
        if (!obj.error) {
          const image = obj.image;
          const link = document.createElement("a");
          link.href = image;
          link.download = `encrypted_${new Date().getTime()}.gif`;
          link.click();
        } else {
          console.error("Error creating GIF:", obj.error);
        }
        setStopInterval(false);
      }
    );

    setIsGeneratingGif(false)
  };

  const QR_SIZE = isMobile ? 190 : 256

  return (
    <div className="relative">
      <span className="font-xl font-bold">
        {currentChunk + 1} / {totalChunks} QR codes
      </span>
      <div ref={isDownloadDouble ? qrRef : null} id="qr-code-container" className="flex flex-col">
        <div ref={isDownloadDouble ? null : qrRef} className="m-2 md:m-8">
          <QRCode
            bgColor="#F6F5F3"
            value={JSON.stringify(chunkedData[currentChunk])}
            size={QR_SIZE}
          />
        </div>
        <div className="m-2 md:m-8">
          <QRCode
            value={JSON.stringify(chunkedData[chunkedData.length - 1 - currentChunk])}
            size={QR_SIZE}
            bgColor="#F9F8F6"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
        <Button disabled={isGeneratingGif} onClick={handleDownloadGif}>Download GIF</Button>
        <Button onClick={() => setIsDownloadDouble(prev => !prev)} variant="ghost">{isDownloadDouble ? "Double QR GIF" : "Single QR GIF"}</Button>
      </div>
    </div>
  );
};

export default QRCodeChunk;
