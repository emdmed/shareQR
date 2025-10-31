'use client'

import { Button } from "@/components/ui/button"
import QRCodeDisplay from "./qrCodes"

const ExportDialog = ({ encryptedData, setEncryptedData }) => {
  return <div className="flex flex-col items-center justify-center mt-2">

    <QRCodeDisplay encryptedData={encryptedData} />

    <div className="flex justify-end py-0 w-full">
      <Button variant="destructive" onClick={() => setEncryptedData("")}>Close</Button>
    </div>

  </div >
}

export default ExportDialog
