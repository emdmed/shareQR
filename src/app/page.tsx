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

type EncryptMode = "text" | "file";

export default function Home() {
  const [toggleShareDialog, setToggleShareDialog] = useState<boolean>(false);
  const [encryptedData, setEncryptedData] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [encryptMode, setEncrypMode] = useState<EncryptMode>("text");
  const [fileContent, setFileContent] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);

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
    <div className="grid justify-items-center min-h-screen p-8">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold">
          Share encrypted data between devices via cycling QR codes
        </h1>
        <small className="opacity-80">
          The secret key wil be used to encrypt/decrypt the payload
        </small>

        <div className="grid w-full">
          <div className="my-1 w-full justify-between items-center flex">
            <div className="flex justify-end items-center py-2 gap-2">
              <span className="text-nowrap">Secret key</span>
              <Input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Add secret key"
              />
            </div>
            {!toggleShareDialog && (
              <Button
                size="sm"
                variant="link"
                onClick={() => setToggleShareDialog(true)}
              >
                Go to scan
              </Button>
            )}
            {toggleShareDialog && (
              <Button
                size="sm"
                variant="link"
                onClick={() => setToggleShareDialog(false)}
              >
                Go to generate Qr code
              </Button>
            )}
          </div>
          {!toggleShareDialog && (
            <Card className="rounded-none border-4 border-double">
              {!toggleShareDialog && !encryptedData && (
                <CardHeader>
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
                  <CardDescription className="text-secondary opacity-60">
                    Add the text/file to encrypt and generate the cycling QR codes (files below 20kb)
                  </CardDescription>
                </CardHeader>
              )}
              {!toggleShareDialog && !encryptedData && (
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
                    <div className="flex gap-2">
                      <Input
                        className="border-secondary w-2/3"
                        type="file"
                        onChange={handleFileChange}
                      />
                      {fileSize !== null && (
                        <Badge
                          variant={fileSize > 20000 ? "destructive" : "default"}
                          className="w-1/3"
                        >
                          File size: {fileSize} bytes
                        </Badge>
                      )}
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
              <CardContent>
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
