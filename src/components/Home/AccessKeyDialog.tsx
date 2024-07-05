import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, Dispatch, SetStateAction, type MouseEvent } from 'react';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  hasAccess: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setHasAccess: Dispatch<SetStateAction<boolean>>;
}

export default function AccessKeyDialog({
  isOpen,
  setIsOpen,
  setHasAccess,
}: Props) {
  const { setError } = useErrorContext();
  const [accessKey, setAccessKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const verifyAccessKey = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!session) {
      return;
    }

    event.preventDefault();

    setIsSubmitting(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/verify-access-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({ key: accessKey }),
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      setError(new Error('Invalid access key, try again'));
      setIsSubmitting(false);

      return;
    }

    setIsSubmitting(false);
    setHasAccess(true);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter your access key</AlertDialogTitle>

          <AlertDialogDescription>
            Please enter the access key to access this feature
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          className="h-12"
          id="accessKey"
          name="accessKey"
          type="text"
          placeholder="Enter your access key"
          value={accessKey}
          onChange={(event) => setAccessKey(event.target.value)}
        />

        <AlertDialogFooter>
          <Button
            className="w-full"
            type="button"
            disabled={isSubmitting || !accessKey}
            onClick={verifyAccessKey}
          >
            {isSubmitting ? <Loader /> : 'Submit'}
          </Button>
        </AlertDialogFooter>

        <button
          className="absolute right-2 top-2 p-2"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          <X />
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
