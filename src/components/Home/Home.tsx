'use client';

import { useErrorContext } from '@/contexts/Error/ErrorContext';
import type { Image } from '@/components/ImageEditor';
import ImageEditor from '@/components/ImageEditor';
import { Button } from '@/components/ui/button';
import { ImageUp, Images } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [image, setImage] = useState<Image | null>(null);
  const { setError } = useErrorContext();

  const uploadImage = async () => {
    const uploader = document.getElementById('uploader');

    if (uploader) {
      uploader.click();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [currentImage] = event.target.files || [];

    if (!currentImage) {
      setError(new Error('No file selected'));

      return;
    }

    if (!currentImage.type.startsWith('image/')) {
      setError(new Error('Invalid file type (only images are allowed)'));

      return;
    }

    setImage({
      url: URL.createObjectURL(currentImage),
      file: currentImage,
    });
  };

  return (
    <section className="h-full p-8">
      {image ? (
        <Card className="flex flex-col gap-4 p-8">
          <Button
            className="flex h-8 w-max gap-1"
            variant="secondary"
            type="button"
            onClick={uploadImage}
          >
            <ImageUp size={16} strokeWidth={2} />
            Select new image
          </Button>

          <Input
            id="uploader"
            className="hidden"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleChange}
            hidden
          />

          <ImageEditor image={image} />
        </Card>
      ) : (
        <button
          className="absolute left-1/2 top-1/2 flex h-full max-h-[500px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-lg bg-card"
          type="button"
          onClick={uploadImage}
        >
          <Images className="text-foreground" size={96} strokeWidth={1.5} />

          <span className="text-lg font-medium text-foreground">
            Click here to select an image
          </span>

          <span className="text-sm text-foreground">
            Supported formats: jpg, png, webp
          </span>

          <Input
            id="uploader"
            className="hidden"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleChange}
            hidden
          />
        </button>
      )}
    </section>
  );
}
