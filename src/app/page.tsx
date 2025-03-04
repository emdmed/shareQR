"use client";

import { useState } from "react";
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

export default function Home() {
  const [toggleShareDialog, setToggleShareDialog] = useState(false);
  const [encryptedData, setEncryptedData] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [text, setText] = useState("");

  const handleEncryptAction = () => {
    setEncryptedData(encryptString(text, secretKey));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold">
          Share encrypted data between devices via cycling QR codes
        </h1>
        <div className="grid w-full">
          <div className="my-2">
            {!toggleShareDialog && (
              <Button
                onClick={() => {
                  setToggleShareDialog(true);
                }}
              >
                Go to scan
              </Button>
            )}
            {toggleShareDialog && (
              <Button
                onClick={() => {
                  setToggleShareDialog(false);
                }}
              >
                Go to generate Qr code
              </Button>
            )}
          </div>
          {!toggleShareDialog && (
            <Card className="rounded-none border-4 border-double">
              <CardHeader>
                <CardTitle>
                  <span>Encrypt</span>
                </CardTitle>
                <CardDescription>
                  Add the text to encrypt and generate a QR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="border-secondary"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Secret message..."
                ></Textarea>
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
                    disabled={!(secretKey && text)}
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
