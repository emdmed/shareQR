import { useEffect, useState } from 'react';
import QRCodeChunk from './qrCodeChunk';
import { chunkData } from './chunkData';
import { Button } from '@/components/ui/button';

const chukedDataToObject = (chunkedData) => {
  return chunkedData.map((element, index) => {
    return { data: element, index, total: chunkedData.length }
  })
}

const QRCodeDisplay = ({ encryptedData }) => {
  const chunkedData = chukedDataToObject(chunkData(encryptedData));
  const [currentChunk, setCurrentChunk] = useState(0);
  const [stopInterval, setStopInterval] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chunkedData.length === 1) return
      if (currentChunk === chunkedData.length - 1) setCurrentChunk(0)
      if (currentChunk < chunkedData.length - 1) setCurrentChunk(prev => ++prev)
    }, 2000);

    if (stopInterval) clearTimeout(timer)

    return () => clearInterval(timer)
  }, [chunkedData, currentChunk])

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <QRCodeChunk
        data={JSON.stringify(chunkedData[currentChunk])}
        index={currentChunk}
        totalChunks={chunkedData.length}
      />
      <div className='flex justify-between'>
        <Button className="w-full mx-1" onClick={() => setStopInterval(prev => !prev)}>{stopInterval ? "Start" : "Stop"}</Button>
        {stopInterval && <>
          <Button
            className="mx-1"
            onClick={() => setCurrentChunk((prev) => Math.max(prev - 1, 0))}
            disabled={currentChunk === 0}
          >
            Previous
          </Button>
          <Button
            className="mx-1"
            onClick={() => setCurrentChunk((prev) => Math.min(prev + 1, chunkedData.length - 1))}
            disabled={currentChunk === chunkedData.length - 1}
          >
            Next
          </Button>
        </>}
      </div>
    </div>
  );
}

export default QRCodeDisplay