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




  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <QRCodeChunk
        chunkedData={chunkedData}
        totalChunks={chunkedData.length}
      />
      <div className='flex justify-between'>
       {/*  <Button className="w-full mx-1" onClick={() => setStopInterval(prev => !prev)}>{stopInterval ? "Start" : "Stop"}</Button> */}
        {/* {stopInterval && <>
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
        </>} */}
      </div>
    </div>
  );
}

export default QRCodeDisplay