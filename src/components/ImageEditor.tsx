'use client';

import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface Image {
  url: string;
  file: File;
}

interface EditorData {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  rotate: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  zoom: number;
}

interface Props {
  image: Image | null;
}

const initialEditorData: EditorData = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  rotate: 0,
  flipHorizontal: false,
  flipVertical: false,
  zoom: 1,
};

export default function ImageEditor({ image }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [editorData, setEditorData] = useState<EditorData>(initialEditorData);

  const applyFilter = useCallback(() => {
    const {
      brightness,
      contrast,
      saturate,
      grayscale,
      rotate,
      flipHorizontal,
      flipVertical,
      zoom,
    } = editorData;

    const canvas = canvasRef.current;

    if (!canvas || !image) {
      return;
    }

    const context = canvas.getContext('2d');
    const newImage = new Image();

    newImage.src = image.url;

    newImage.onload = () => {
      if (!context) {
        return;
      }

      const { width, height } = newImage;

      const zoomedWidth = width * zoom;
      const zoomedHeight = height * zoom;
      const translateX = (width - zoomedWidth) / 2;
      const translateY = (height - zoomedHeight) / 2;

      const imageFilters = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `grayscale(${grayscale}%)`,
        `saturate(${saturate}%)`,
      ];

      const preparedFilters = imageFilters.join(' ');

      canvas.width = width;
      canvas.height = height;
      context.filter = preparedFilters;

      context.save();

      if (rotate) {
        const centerX = width / 2;
        const centerY = height / 2;

        context.translate(centerX, centerY);
        context.rotate((rotate * Math.PI) / 180);
        context.translate(-centerX, -centerY);
      }

      if (flipHorizontal) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      if (flipVertical) {
        context.translate(0, canvas.height);
        context.scale(1, -1);
      }

      context.translate(translateX, translateY);
      context.scale(zoom, zoom);
      context.drawImage(newImage, 0, 0, width, height);

      context.restore();
    };
  }, [image, editorData]);

  useEffect(() => {
    applyFilter();
  }, [image, applyFilter]);

  const updateEditorSettings = (key: string, value: number | boolean) => {
    setEditorData((currentEditorData) => ({
      ...currentEditorData,
      [key]: value,
    }));
  };

  const saveImage = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const linkElement = document.createElement('a');

      linkElement.download = image?.file.name as string;
      linkElement.href = objectUrl;
      linkElement.click();
      URL.revokeObjectURL(objectUrl);
    });
  };

  const reset = () => {
    setEditorData(initialEditorData);
  };

  const rotate = (value: number[]) => {
    updateEditorSettings('rotate', value[0]);
  };

  const brightness = (value: number[]) => {
    updateEditorSettings('brightness', value[0]);
  };

  const contrast = (value: number[]) => {
    updateEditorSettings('contrast', value[0]);
  };

  const saturate = (value: number[]) => {
    updateEditorSettings('saturate', value[0]);
  };

  const grayscale = (value: number[]) => {
    updateEditorSettings('grayscale', value[0]);
  };

  const flipHorizontal = () => {
    updateEditorSettings('flipHorizontal', !editorData.flipHorizontal);
  };

  const flipVertical = () => {
    updateEditorSettings('flipVertical', !editorData.flipVertical);
  };

  const zoomIn = () => {
    if (editorData.zoom >= 2) {
      return;
    }

    updateEditorSettings('zoom', editorData.zoom + 0.1);
  };

  const zoomOut = () => {
    if (editorData.zoom <= 0.5) {
      return;
    }

    updateEditorSettings('zoom', editorData.zoom - 0.1);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px]">
        <div className="flex flex-col gap-6">
          <canvas
            className="canvas mx-auto max-h-[400px] w-full object-contain"
            ref={canvasRef}
            id="canvas"
          />

          <div className="flex flex-col items-center">
            <div className="flex w-full flex-col gap-3 md:w-4/5">
              <div className="flex items-center gap-4">
                <Label className="w-full max-w-20" htmlFor="rotateSlider">
                  Rotate:
                </Label>

                <Slider
                  id="rotateSlider"
                  className="w-full"
                  defaultValue={[0]}
                  min={-180}
                  max={180}
                  step={1}
                  value={[editorData.rotate]}
                  onValueChange={rotate}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-full max-w-20" htmlFor="brightnessSlider">
                  Brightness:
                </Label>

                <Slider
                  id="brightnessSlider"
                  className="w-full"
                  defaultValue={[100]}
                  max={200}
                  step={1}
                  value={[editorData.brightness]}
                  onValueChange={brightness}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-full max-w-20" htmlFor="contrastSlider">
                  Contrast:
                </Label>

                <Slider
                  id="contrastSlider"
                  className="w-full"
                  defaultValue={[100]}
                  max={200}
                  step={1}
                  value={[editorData.contrast]}
                  onValueChange={contrast}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-full max-w-20" htmlFor="saturateSlider">
                  Saturate:
                </Label>

                <Slider
                  id="saturateSlider"
                  className="w-full"
                  defaultValue={[100]}
                  max={200}
                  step={1}
                  value={[editorData.saturate]}
                  onValueChange={saturate}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-full max-w-20" htmlFor="grayscaleSlider">
                  Grayscale:
                </Label>

                <Slider
                  id="grayscaleSlider"
                  className="w-full"
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  value={[editorData.grayscale]}
                  onValueChange={grayscale}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button className="p-1" type="button" onClick={reset}>
              <RotateCcw />
            </button>

            <button className="p-1" type="button" onClick={flipHorizontal}>
              <FlipHorizontal />
            </button>

            <button className="p-1" type="button" onClick={flipVertical}>
              <FlipVertical />
            </button>

            <button className="p-1" type="button" onClick={zoomIn}>
              <ZoomIn />
            </button>

            <button className="p-1" type="button" onClick={zoomOut}>
              <ZoomOut />
            </button>
          </div>

          <Button
            className="mx-auto h-8 w-1/5"
            type="button"
            onClick={() => saveImage()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
