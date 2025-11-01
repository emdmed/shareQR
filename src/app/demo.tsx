import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { RotateCw } from "lucide-react"

const Demo = () => {

  const [isImage, setIsImage] = useState(false)


  return <div className="flex flex-col py-20">
    <div className="flex items-center flex-col md:flex-row">
      {isImage ? <div className="flex flex-col justify-center">
        <span className="text-lg font-bold">Scan me!</span>
        <span>Secret key: <span className="font-bold">test</span></span>
        <Image
          src="/images/qrcode_image.gif"
          alt="Logo"
          width={300}
          height={300}
          className="m-6"
        />
      </div> : <div className="flex flex-col">
        <span className="text-lg font-bold">Scan me!</span>
        <span>Secret key: <span className="font-bold">test</span></span>
        <Image
          src="/images/qrcode_text.gif"
          alt="Logo"
          width={300}
          height={300}
          className="m-6"
        />
      </div>}

      <div className="flex flex-col">
        <ol>
          <li>
            <span className="font-bold">1_</span> Open this page in your mobile phone
          </li>
          <li><span className="font-bold">2_</span> Press the camera button to scan</li>
          <li><span className="font-bold">3_</span> Scan the rq code</li>
          <li><span className="font-bold">4_</span> When the scan reaches 100%, add the secret key</li>
        </ol>
        <div className="my-4">
          <Button variant="outline" onClick={() => setIsImage(prev => !prev)}>{isImage ? "Image" : "Text"} <RotateCw /></Button>
        </div>
      </div>
    </div>


  </div>

}

export default Demo
