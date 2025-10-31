import { QrCode } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-start space-y-4 py-12 md:py-16">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
          Share encrypted data between devices via cycling QR codes
        </h1>
        <QrCode size={100} />
      </div>
      <p className="text-muted-foreground  md:text-lg max-w-4xl text-start">
        The secret key will be used to encrypt and decrypt the payload, ensuring secure data transfer without internet connection.
      </p>
    </div>
  );
};

export default Hero;
