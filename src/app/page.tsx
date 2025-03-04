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

type EncryptMode = "text" | "file";

export default function Home() {
  const [toggleShareDialog, setToggleShareDialog] = useState<boolean>(false);
  const [encryptedData, setEncryptedData] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [encryptMode, setEncrypMode] = useState<EncryptMode>("text");
  const [fileContent, setFileContent] = useState<string>("");

  console.log("fileContent", fileContent);

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
    <div className="grid justify-items-center min-h-screen p-8">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold">
          Share encrypted data between devices via cycling QR codes
        </h1>
        <div className="grid w-full">
          <div className="my-2">
            {!toggleShareDialog && (
              <Button onClick={() => setToggleShareDialog(true)}>
                Go to scan
              </Button>
            )}
            {toggleShareDialog && (
              <Button onClick={() => setToggleShareDialog(false)}>
                Go to generate Qr code
              </Button>
            )}
          </div>
          {!toggleShareDialog && (
            <Card className="rounded-none border-4 border-double">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <span>Encrypt</span>
                  <Button onClick={() => setEncrypMode("file")} size="sm">
                    File
                  </Button>
                  <Button onClick={() => setEncrypMode("text")} size="sm">
                    Text
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add the text to encrypt and generate a QR
                </CardDescription>
              </CardHeader>
              <CardContent>
                {encryptMode === "text" && (
                  <Textarea
                    className="border-secondary"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Secret message..."
                  />
                )}
                {encryptMode === "file" && (
                  <Input
                    className="border-secondary"
                    type="file"
                    onChange={handleFileChange}
                  />
                )}
                <div className="flex justify-end py-2 gap-2">
                  <Input
                    className="border-secondary"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Add secret key"
                  />
                  <Button
                    onClick={handleEncryptAction}
                    disabled={
                      !secretKey ||
                      (encryptMode === "text" ? !text : !fileContent)
                    }
                  >
                    Encrypt
                  </Button>
                </div>
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
          <ImportDialog setToggleShareDialog={setToggleShareDialog} />
        )}
      </main>
    </div>
  );
}
