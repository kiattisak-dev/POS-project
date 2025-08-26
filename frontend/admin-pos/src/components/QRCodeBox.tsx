import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download } from 'lucide-react';

interface QRCodeBoxProps {
  payload: string;
  title?: string;
  onClose: () => void;
}

export const QRCodeBox: React.FC<QRCodeBoxProps> = ({
  payload,
  title = 'QR Code',
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, [payload]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <strong>Payload:</strong>
        <pre className="mt-1 text-xs break-all">{payload}</pre>
      </div>

      <button
        onClick={handleDownload}
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Download size={16} />
        <span>Download QR Code</span>
      </button>
    </div>
  );
};