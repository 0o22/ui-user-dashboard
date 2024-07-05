'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import AccessKeyDialog from '@/components/Home/AccessKeyDialog';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import type { Image } from '@/components/ImageEditor';
import ImageEditor from '@/components/ImageEditor';
import { Button } from '@/components/ui/button';
import { ImageUp, Images } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import Loader from '@/components/Loader';

export default function Home() {
  const [image, setImage] = useState<Image | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useErrorContext();
  const { data: session, status } = useSession();

  const getAccessStatus = useCallback(async () => {
    if (!session) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${session.user?.username}/check-access`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session.jwt}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      setHasAccess(false);

      return;
    }

    setHasAccess(true);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    setIsLoading(true);
    getAccessStatus();
    setIsLoading(false);
  }, [session, getAccessStatus]);

  const uploadImage = async () => {
    const uploader = document.getElementById('uploader');

    if (uploader) {
      uploader.click();
    }
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-primary">
        <Loader size={50} />
      </div>
    );
  }

  return (
    <>
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

            <ImageEditor
              hasAccess={hasAccess}
              image={image}
              setIsDialogOpen={setIsDialogOpen}
            />
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

      {!isLoading && (
        <AccessKeyDialog
          isOpen={isDialogOpen}
          hasAccess={hasAccess}
          setIsOpen={setIsDialogOpen}
          setHasAccess={setHasAccess}
        />
      )}
    </>
  );
}
