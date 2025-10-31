"use client";

import { useState, ChangeEvent } from "react";
import ImportDialog from "./components/qr/import/importDialog";
import ExportDialog from "./components/qr/export/exportDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { encryptString } from "@/lib/encryption/browserEncryption";
import { Badge } from "@/components/ui/badge";
import Hero from "./hero";
import { Camera, KeyRound, QrCode } from "lucide-react";
import useIsMobile from "./hooks/useIsMobile";

type EncryptMode = "text" | "file";

export default function Home() {
  const [toggleShareDialog, setToggleShareDialog] = useState<boolean>(false);
  const [encryptedData, setEncryptedData] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [encryptMode, setEncrypMode] = useState<EncryptMode>("text");
  const [fileContent, setFileContent] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const isMobile = useIsMobile()

  const handleEncryptAction = () => {
    if (encryptMode === "text") {
      setEncryptedData(encryptString(text, secretKey));
    }
    if (encryptMode === "file") {
      setEncryptedData(encryptString(fileContent, secretKey));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSize(file.size);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.onerror = (err: ProgressEvent<FileReader>) => {
        console.error("Error reading file:", err);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid justify-items-center min-h-screen px-4 py-3 md:px-8 md:py-6 ">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <Hero />

        <div className="grid w-full">
          {!encryptedData ? <div className="my-1 w-full justify-between items-center flex gap-3">
            <div className="flex justify-start items-center py-2 gap-2">
              {isMobile ? <KeyRound size={18} /> : <span className="text-nowrap">Secret key</span>}
              <Input
                className="w-full"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Add secret key"
              />
            </div>
            {!toggleShareDialog && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setToggleShareDialog(true)}
                className="inline-flex items-center gap-2"
              >
                {isMobile ? null : "Scan"}
                <Camera className="w-4 h-4 -mt-0.5" />
              </Button>
            )}
            {toggleShareDialog && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setToggleShareDialog(false)}
                className="inline-flex items-center gap-2"
              >
                Generate Qr code
                <QrCode className="w-4 h-4 -mt-0.5" />
              </Button>
            )}
          </div> : null}
          {!toggleShareDialog && (
            <Card className="rounded-none border-4 border-double p-1">
              {!toggleShareDialog && !encryptedData && (
                <CardHeader >
                  <CardTitle className="flex gap-2 items-center">
                    <span>Encrypt</span>
                    <Button
                      variant="outline"
                      onClick={() => setEncrypMode("file")}
                      size="sm"
                    >
                      File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEncrypMode("text")}
                      size="sm"
                    >
                      Text
                    </Button>
                  </CardTitle>
                  {!isMobile && <CardDescription className="">
                    Add the text/file to encrypt and generate the cycling QR codes (files below 20kb)
                  </CardDescription>}
                </CardHeader>
              )}
              {!toggleShareDialog && !encryptedData && (
                <CardContent className="p-2">
                  {encryptMode === "text" && (
                    <Textarea
                      className="border-secondary"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Secret message..."
                    />
                  )}
                  {encryptMode === "file" && (
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-2">
                      <Input
                        className="border-secondary "
                        type="file"
                        onChange={handleFileChange}
                      />
                      {fileSize ? (
                        <Badge
                          variant={fileSize > 20000 ? "destructive" : "default"}
                          className="w-full md:w-fit text-nowrap"
                        >
                          File size: {fileSize} bytes
                        </Badge>
                      ) : null}
                    </div>
                  )}
                  <div className="flex justify-end w-full">
                    <Button
                      className="w-full mt-2"
                      onClick={handleEncryptAction}
                      disabled={
                        !secretKey ||
                        fileSize > 20000 ||
                        (encryptMode === "text" ? !text : !fileContent)
                      }
                    >
                      Encrypt
                    </Button>
                  </div>
                </CardContent>
              )}
              <CardContent className="p-1">
                {!toggleShareDialog && encryptedData && (
                  <ExportDialog
                    encryptedData={encryptedData}
                    setEncryptedData={setEncryptedData}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
        {toggleShareDialog && (
          <ImportDialog
            secretKey={secretKey}
            setToggleShareDialog={setToggleShareDialog}
          />
        )}
      </main>
    </div>
  );
}
