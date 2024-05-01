'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import type { User } from 'next-auth';
import type { Dispatch } from 'react';

interface Props {
  users: User[];
  setUsers: Dispatch<React.SetStateAction<User[]>>;
  selectedUser: User | null;
  setSelectedUser: Dispatch<React.SetStateAction<User | null>>;
}

export default function UpdateUser({
  users,
  setUsers,
  selectedUser,
  setSelectedUser,
}: Props) {
  const { setError } = useErrorContext();
  const { data: session } = useSession();

  const unselectUser = () => {
    setTimeout(() => setSelectedUser(null), 300);
  };

  const updateUser = async () => {
    if (!selectedUser) {
      return;
    }

    const { username, banned, strictPassword } = selectedUser;

    const updateBannedStatus = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${username}/change-status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session?.jwt}`,
        },
        body: JSON.stringify({ banned }),
      }
    );

    const updatePasswordStrictness = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${username}/change-password-strictness`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session?.jwt}`,
        },
        body: JSON.stringify({ strictPassword }),
      }
    );

    const [bannedResponse, strictPasswordResponse] = await Promise.all([
      updateBannedStatus,
      updatePasswordStrictness,
    ]);

    if (!bannedResponse.ok || !strictPasswordResponse.ok) {
      setError(new Error('An error occurred'));

      return;
    }

    const updatedUsers = users.map((user) =>
      user.username === username ? selectedUser : user
    );

    setUsers(updatedUsers);
    setSelectedUser(null);
  };

  const updateBannedStatus = () => {
    if (!selectedUser) {
      return;
    }

    setSelectedUser((currentSelectedUser) => {
      if (!currentSelectedUser) {
        return null;
      }

      return {
        ...currentSelectedUser,
        banned: !currentSelectedUser.banned,
      };
    });
  };

  const updatePasswordStrictness = () => {
    if (!selectedUser) {
      return;
    }

    setSelectedUser((currentSelectedUser) => {
      if (!currentSelectedUser) {
        return null;
      }

      return {
        ...currentSelectedUser,
        strictPassword: !currentSelectedUser.strictPassword,
      };
    });
  };

  return (
    <AlertDialog open={Boolean(selectedUser)}>
      <AlertDialogContent className="text-popover-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit user details</AlertDialogTitle>

          <AlertDialogDescription className="flex gap-1">
            <span>Edit the</span>

            <span className="text-popover-foreground">
              {selectedUser?.username}
            </span>

            <span>details below</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="banned"
                checked={selectedUser?.banned}
                onClick={updateBannedStatus}
              />

              <Label htmlFor="banned">Banned</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="strictPassword"
                checked={selectedUser?.strictPassword}
                onClick={updatePasswordStrictness}
              />

              <Label htmlFor="strictPassword">Strict password</Label>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={unselectUser}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={updateUser}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
