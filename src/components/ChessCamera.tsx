
import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ChessCamera = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      
      if (image.dataUrl) {
        setCapturedImage(image.dataUrl);
        // Here we would add chess position detection logic
        console.log('Image captured, ready for position detection');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Chess Position Detection</h2>
        <Button 
          onClick={takePicture}
          className="w-full"
        >
          Capture Chess Position
        </Button>
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
