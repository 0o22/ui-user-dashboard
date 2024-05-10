import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { Check, Lock, Minus, MoreHorizontal } from 'lucide-react';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { getFormattedTime } from '@/helpers/getFormattedTime';
import { TableCell, TableRow } from '@/components/ui/table';
import { getAccessIcon } from '@/helpers/getAccessIcon';
import { capitalize } from '@/helpers/capitalize';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { Button } from '../ui/button';
import type { User } from 'next-auth';

interface Props {
  user: User;
  setUsers: Dispatch<SetStateAction<User[]>>;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
}

export default function DashboardUserRow({
  user,
  setUsers,
  setSelectedUser,
}: Props) {
  const { setError } = useErrorContext();
  const [deletingUsername, setDeletingUsername] = useState<string | null>(null);
  const { data: session } = useSession();

  const deleteUser = async (username: string) => {
    setDeletingUsername(username);

    if (!session) {
      setError(new Error('You need to be logged in to delete a user'));

      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${username}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session.jwt}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const { error } = await response.json();

      setError(new Error(error));

      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.username !== username)
    );
    setDeletingUsername(null);
  };

  const AccessIcon = getAccessIcon(user.access);

  return (
    <TableRow className="relative">
      <TableCell className="text-center font-medium">
        <span>{user.id}</span>
      </TableCell>

      <TableCell className="text-center">
        <span>{user.username}</span>
      </TableCell>

      <TableCell className="hidden md:table-cell text-center">
        <span>{capitalize(user.role)}</span>
      </TableCell>

      <TableCell className="hidden md:table-cell text-center">
        <span>
          {user.banned ? (
            <Check className="inline" size={20} />
          ) : (
            <Minus className="inline" size={20} />
          )}
        </span>
      </TableCell>

      <TableCell className="hidden md:table-cell text-center">
        <span>
          {user.strictPassword ? (
            <Check className="inline" size={20} />
          ) : (
            <Minus className="inline" size={20} />
          )}
        </span>
      </TableCell>

      <TableCell className="hidden md:table-cell text-center">
        <AccessIcon className="inline" />
      </TableCell>

      <TableCell className="hidden md:table-cell text-center">
        <span>{getFormattedTime(user.createdAt)}</span>
      </TableCell>

      <TableCell className="flex justify-center">
        {user.role === 'ADMIN' ? (
          <Lock size={20} />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-haspopup="true" size="icon">
                <MoreHorizontal className="h-4 w-4" size={20} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => deleteUser(user.username)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>

      {deletingUsername === user.username && (
        <div className="absolute inset-0 bg-card pointer-events-auto bg-opacity-50">
          <div className="w-full h-full flex items-center justify-center">
            <Loader size={28} />
          </div>
        </div>
      )}
    </TableRow>
  );
}
