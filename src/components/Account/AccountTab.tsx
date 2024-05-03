'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getFormattedDate } from '@/helpers/getFormattedDate';
import { TabsContent } from '@/components/ui/tabs';
import { capitalize } from '@/helpers/capitalize';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from 'next-auth';

export default function AccountTab({ user }: { user: User }) {
  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Review your account details here.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} disabled />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={capitalize(user.role)} disabled />
          </div>

          <div className="space-y-1">
            <Label htmlFor="since">Registration date</Label>
            <Input
              id="since"
              value={getFormattedDate(user.createdAt)}
              disabled
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
