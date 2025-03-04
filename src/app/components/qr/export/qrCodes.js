import QRCodeChunk from './qrCodeChunk';
import { chunkData } from './chunkData';

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
      </div>
    </div>
  );
}

export default QRCodeDisplay