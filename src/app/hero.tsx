import { QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import useIsMobile from "./hooks/useIsMobile";

const Hero = () => {
  const isMobile = useIsMobile();
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      // Hide the icon
      setIsVisible(false);

      // After a short delay, rotate (while hidden) and show again
      setTimeout(() => {
        setRotation(prev => (prev + 90) % 360);
        setIsVisible(true);
      }, 150); // Adjust this delay for flicker duration

    }, 800); // Flicker every 2 seconds (adjust as needed)

    return () => clearInterval(flickerInterval);
  }, []);

  if (isMobile) {
    return (
      <div className="flex text-center py-6">
        <h1 className="text-xl font-bold tracking-tight max-w-4xl">
          Share encrypted data between devices via cycling QR codes
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start space-y-4 py-12 md:py-16">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
          Share encrypted data with QR codes
        </h1>
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-in-out'
          }}
        >
          <QrCode size={100} />
        </div>
      </div>
      <p className="text-muted-foreground md:text-lg max-w-4xl text-start">
        The secret key will be used to encrypt and decrypt the payload, ensuring secure data transfer without internet connection.
      </p>
    </div>
  );
};

export default Hero;
