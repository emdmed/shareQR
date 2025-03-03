'use client'

import { Card, CardContent } from "@/components/ui/card"
import QRCodeImporter from "./qrCodeImporter"
import { useState } from "react"

const ImportDialog = ({ setToggleShareDialog }) => {

    const [setScanData] = useState()

    return <div>
        <Card className="">
            <CardContent>
                <QRCodeImporter setToggleShareDialog={setToggleShareDialog} setScanData={setScanData} />
            </CardContent>
        </Card>
    </div>
}

export default ImportDialog