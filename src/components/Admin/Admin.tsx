'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardUserRowSkeleton from './DashboardUserRowSkeleton';
import UpdateUserDialog from '@/components/Admin/UpdateUser';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import AddUserPopover from '@/components/Admin/AddUser';
import DashboardUserRow from './DashboardUserRow';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';

const TABLE_HEADERS = [
  'ID',
  'Name',
  'Banned',
  'Strict password',
  'Role',
  'Created at',
  'Actions',
];

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { data: session, status } = useSession({
    required: true,
  });

  const router = useRouter();

  useLayoutEffect(() => {
    if (!session) {
      return;
    }

    const getUser = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${session.user?.username}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${session.jwt}`,
          },
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        return;
      }

      const user = await response.json();

      return user;
    };

    getUser().then(setCurrentUser);
  }, [session]);

  useEffect(() => {
    setIsLoading(true);

    if (!session || !currentUser) {
      return;
    }

    const getUsers = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${session.jwt}`,
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        return;
      }

      const users = await response.json();

      return users;
    };

    getUsers().then((currentUsers) => {
      setUsers(currentUsers);
      setIsLoading(false);
    });
  }, [session, currentUser]);

  if (status === 'loading' || !currentUser) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
        <Loader size={50} />
      </div>
    );
  }

  if (!session || status !== 'authenticated') {
    router.push('/login');

    return;
  }

  if (session && currentUser?.role !== 'ADMIN') {
    router.push('/account');

    return;
  }

  return (
    <>
      <div className="container py-14">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader className="flex flex-col gap-4 sm:flex-row justify-between">
                <div>
                  <CardTitle>Users</CardTitle>

                  <CardDescription>
                    Manage your users and view their details
                  </CardDescription>
                </div>

                <AddUserPopover setUsers={setUsers} />
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {TABLE_HEADERS.map((header, index) => {
                        const isHidden =
                          index > 1 && index < TABLE_HEADERS.length - 1;

                        return (
                          <TableHead
                            key={header}
                            className={cn('text-center', {
                              'hidden md:table-cell': isHidden,
                            })}
                          >
                            {header}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 8 }).map((_, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <DashboardUserRowSkeleton key={index} />
                        ))
                      : users.map((user) => (
                          <DashboardUserRow
                            key={user.id}
                            user={user}
                            setUsers={setUsers}
                            setSelectedUser={setSelectedUser}
                          />
                        ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter>
                <div className="text-xs text-muted-foreground flex gap-2 items-center">
                  <span className="flex gap-2 items-center">
                    {isLoading ? <Loader size={14} /> : users.length} users
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UpdateUserDialog
        users={users}
        setUsers={setUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </>
  );
}
