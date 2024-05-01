'use client';

import {
  type FormEvent,
  useState,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import type { User } from 'next-auth';
import { Plus } from 'lucide-react';

type CreatingUserData = Pick<User, 'username' | 'strictPassword'>;

const initialUserData: CreatingUserData = {
  username: '',
  strictPassword: true,
};

interface Props {
  setUsers: Dispatch<SetStateAction<User[]>>;
}

export default function AddUser({ setUsers }: Props) {
  const { setError } = useErrorContext();
  const { width } = useWindowSize();
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState<CreatingUserData>(initialUserData);
  const { data: session } = useSession();

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsCreatingUser(true);

    if (!session) {
      setError(new Error('You need to be logged in to delete a user'));

      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(newUser),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const { error } = await response.json();

      setError(new Error(error));
      setIsCreatingUser(false);

      return;
    }

    const data = await response.json();

    setUsers((currentUsers) => [...currentUsers, data.user]);
    setIsCreatingUser(false);
    setIsUserPopoverOpen(false);
    setNewUser(initialUserData);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const current = event.target.value;

    if (!/^[a-z0-9]+$/i.test(current) && current !== '') {
      return;
    }

    setNewUser((currentCreatingUser) => ({
      ...currentCreatingUser,
      username: event.target.value,
    }));
  };

  const handleStrictPasswordChange = () => {
    setNewUser((currentCreatingUser) => ({
      ...currentCreatingUser,
      strictPassword: !currentCreatingUser.strictPassword,
    }));
  };

  return (
    <Popover open={isUserPopoverOpen} onOpenChange={setIsUserPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-max flex gap-1 font-medium h-8"
          variant="default"
          type="button"
        >
          <Plus size={16} strokeWidth={2} />
          Add user
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="max-w-80 w-full"
        align={width < 640 ? 'start' : 'end'}
      >
        <form className="grid gap-4" onSubmit={createUser}>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create new user</h4>

            <p className="text-sm text-muted-foreground">
              Create a new user with the following details
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="addUserUsername">Username</Label>

                <Input
                  id="addUserUsername"
                  className="h-8"
                  placeholder="e.g. johndoe"
                  value={newUser.username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="addUserStrictPassword">Strict password</Label>

                <Switch
                  id="addUserStrictPassword"
                  checked={newUser.strictPassword}
                  onClick={handleStrictPasswordChange}
                />
              </div>
            </div>

            <div>
              <Button
                className="w-full h-8"
                variant="secondary"
                type="submit"
                disabled={!newUser.username || isCreatingUser}
              >
                {isCreatingUser ? <Loader size={20} /> : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
