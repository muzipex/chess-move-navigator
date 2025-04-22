
import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera as CameraIcon } from 'lucide-react';

const ChessCamera = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOverlayMode, setIsOverlayMode] = useState(false);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      
      if (image.dataUrl) {
        setCapturedImage(image.dataUrl);
        console.log('Image captured, ready for position detection');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const toggleOverlay = async () => {
    // In a real implementation, this would trigger the Android overlay service
    setIsOverlayMode(!isOverlayMode);
    console.log('Overlay mode toggled:', !isOverlayMode);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Chess Position Detection</h2>
        <div className="flex gap-2">
          <Button 
            onClick={takePicture}
            className="flex-1"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Capture Position
          </Button>
          <Button 
            onClick={toggleOverlay}
            variant={isOverlayMode ? "destructive" : "default"}
            className="flex-1"
          >
            {isOverlayMode ? 'Stop Overlay' : 'Start Overlay'}
          </Button>
        </div>
        {capturedImage && (
          <div className="mt-4">
            <img 
              src={capturedImage} 
              alt="Captured chess position" 
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChessCamera;
