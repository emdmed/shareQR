import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeChunk = ({ data, index, totalChunks }) => {
    return (
        <div>
            <span className="font-xl font-bold">{index + 1} / {totalChunks} QR codes</span>
            <div className='border border-white border-8 m-8'>
                <QRCode  value={data} size={256} />
            </div>
        </div>
    );
}

export default QRCodeChunk;
