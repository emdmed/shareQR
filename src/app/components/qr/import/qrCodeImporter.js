import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { replaceObjectAtIndexImmutable } from '@/lib/helpers/arrayManipulation';
import { decryptString } from '@/lib/encryption/browserEncryption';
import { Input } from '@/components/ui/input';

function QRCodeImporter({ setToggleShareDialog }) {
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [scanning, setScanning] = useState(false); // State for scanning feedback
  const [scanResult, setScanResult] = useState([]);
  const [currentPart, setCurrentPart] = useState(1);
  const [scannedCode, setScannedCode] = useState()
  const [error, setError] = useState('')
  const [scanStatus, setScanStatus] = useState({ scanned: [], total: [] })

  const [completeEncryptedData, setCompleteEncryptedData] = useState("")
  const [decryptedString, setDecryptedString] = useState("")
  const [secretKey, setSecretKey] = useState("")

  console.log(scanning, currentPart)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 1000);

      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (!scannedCode) return
    const scannedCodeObject = JSON.parse(scannedCode)

    if (scanResult.length === 0) {
      setScanResult(new Array(scannedCodeObject.total))
      return
    }

    if (scanResult.includes(scannedCodeObject.data)) {
      setError("Proximo qr por favor....")
    } else {
      const newScanResult = replaceObjectAtIndexImmutable(scanResult, scannedCodeObject.index, scannedCodeObject.data)
      setScanResult([...newScanResult])
      const newScanned = [...scanStatus.scanned, scannedCodeObject.index]
      setScanStatus({ ...scanStatus, scanned: newScanned, total: scannedCodeObject.total })
      setCurrentPart(prev => ++prev)
    }
  }, [scannedCode])


  useEffect(() => {
    console.log("check", scanResult.filter(value => value).length, "scanStatus.total", scanStatus.total.length)

    if (scanResult.filter(value => value).length === scanStatus.total) {
      saveData()
    }
  }, [scanResult, scanStatus])

  useEffect(() => {
    async function checkCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInput = devices.some(device => device.kind === 'videoinput');
        setCameraAvailable(videoInput);
        setScanning(videoInput);
        if (videoInput) console.log("Camera found and scanning...");
      } catch (error) {
        console.error("Camera not accessible:", error);
      }
    }
    checkCamera();
  }, []);

  const handleScan = (data) => {
    console.log("data scanned", data[0].rawValue)

    const dataScanned = JSON.parse(data[0].rawValue)
    console.log("parsed scanned ata", dataScanned, dataScanned.total)

    if (data[0].rawValue && dataScanned.total > 1) {
      setScannedCode(data[0].rawValue)
    } else {
      setCompleteEncryptedData(dataScanned.data)
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
    setScanning(false); // Stop scanning on error
  };

  const saveData = () => {
    const completeData = scanResult.join("")
    setCompleteEncryptedData(completeData)
    //setToggleShareDialog(false)
  }

  const getFileExtension = (dataUrl) => {
    const match = dataUrl.match(/^data:(.+);base64,/);
    if (match) {
      const mimeType = match[1];
      return mimeType.split('/')[1];
    }
    return 'txt';
  };

  const downloadFile = (fileContent) => {
    const extension = getFileExtension(fileContent);
    const a = document.createElement('a');
    a.href = fileContent;
    a.download = `download.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getPercentageScanned = () => {
    if (!scanStatus || scanStatus.scanned.length === 0) return 0
    return (100 + ((scanStatus.scanned.length - scanStatus.total) / scanStatus.total) * 100)
  }

  if (!cameraAvailable) {
    return <p>No camera found.</p>;
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col'>
        <span className='font-bold text-lg my-2'>Progress {getPercentageScanned()}%</span>
        <small className='my-1'>Point the camera to the QR code and keep it steady un untill the counter reaches 100%</small>
        <small className='my-1'>The process will end when all chunks are read correctly</small>
      </div>
      {!completeEncryptedData && <div className='flex flex-col justify-center items-center'>
        <div className='max-w-[400px]'>
          <Scanner
            formats={["qr_code"]}
            onScan={handleScan}
            onError={handleError}
            facingMode="environment"
          />
        </div>
        <div className='flex justify-end items-center mt-2'>
          <Button className="me-2" onClick={saveData}>Finalize</Button>
          <Button variant="destructive" onClick={() => setToggleShareDialog(false)}>Cancel</Button>
        </div>
      </div>}
      <div className='flex items-center'>
        <Input className='border-secondary my-2' type='password' value={secretKey} onChange={e => setSecretKey(e.target.value)}></Input>
        <Button onClick={() => setDecryptedString(decryptString(completeEncryptedData, secretKey))}>Decrypt</Button>
      </div>
      {decryptedString && <div className='flex'>
        <Button onClick={() => downloadFile(decryptedString)}>Download</Button>
      </div>}
      {completeEncryptedData && <div className="max-w-[400px]">
        {!decryptedString && <p className='mb-5 text-justify break-words text-white text-sm'>{completeEncryptedData}</p>}
        {decryptedString && <p>{decryptedString}</p>}
      </div>
      }
    </div>
  );
}

export default QRCodeImporter;
