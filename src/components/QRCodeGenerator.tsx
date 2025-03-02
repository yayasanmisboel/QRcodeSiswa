import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator = ({ value, size = 180 }: QRCodeGeneratorProps) => {
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  useEffect(() => {
    // Update download URL when value changes
    const canvas = document.createElement('canvas');
    const svg = document.getElementById('qr-code-svg')?.outerHTML;
    
    if (svg) {
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          setDownloadUrl(canvas.toDataURL('image/png'));
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    }
  }, [value, size]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${value}.png`;
      link.href = downloadUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCode
          id="qr-code-svg"
          value={value}
          size={size}
        />
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;
