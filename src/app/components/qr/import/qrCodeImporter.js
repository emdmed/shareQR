import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { replaceObjectAtIndexImmutable } from '@/lib/helpers/arrayManipulation';

function QRCodeImporter({ setToggleShareDialog }) {
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [scanning, setScanning] = useState(false); // State for scanning feedback
  const [scanResult, setScanResult] = useState([]);
  const [currentPart, setCurrentPart] = useState(1);
  const [scannedCode, setScannedCode] = useState()
  const [error, setError] = useState('')
  const [scanStatus, setScanStatus] = useState({ scanned: [], total: [] })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 1000);

      return () => clearTimeout(timer)
    }
  }, [error])

  console.log("scanStatus", scanStatus, "scanResult", scanResult)

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
    console.log("data", data[0].rawValue)

    if (data[0].rawValue) {
      setScannedCode(data[0].rawValue)
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
    setScanning(false); // Stop scanning on error
  };

  const saveData = () => {
    const completeData = scanResult.join("")
    localStorage.setItem("patients", completeData)
    setToggleShareDialog(false)
  }

  const getPercentageScanned = () => {
    if (!scanStatus || scanStatus.scanned.length === 0) return 0
    return (100 + ((scanStatus.scanned.length - scanStatus.total) / scanStatus.total) * 100)
  }

  console.log("getPercentageScanned", getPercentageScanned())

  if (!cameraAvailable) {
    return <p>No camera found.</p>;
  }

  return (
    <div>
      <div className='flex flex-col'>
        <span className='font-bold text-lg my-2'>Progress {getPercentageScanned()}%</span>
        <small className='my-1'>The process will end when all chunks are read correctly</small>
      </div>
      <Scanner
        formats={["qr_code"]}
        onScan={handleScan}
        onError={handleError}
        facingMode="environment"
      />
      <div className='flex justify-end items-center mt-2'>
        <Button className="me-2" onClick={saveData}>Finalize</Button>
        <Button variant="destructive" onClick={() => setToggleShareDialog(false)}>Cancel</Button>
      </div>
    </div>
  );
}

export default QRCodeImporter;
