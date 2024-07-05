'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { validatePassword } from '@/helpers/validation/validatePassword';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader';
import { useFormik } from 'formik';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';
import { useState } from 'react';

interface Props {
  user: User;
}

export default function ChangePasswordTab({ user }: Props) {
  const { setError } = useErrorContext();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validate: ({ newPassword, confirmNewPassword }) => {
      const errors: Record<string, string> = {};

      if (!newPassword.trim()) {
        errors.newPassword = 'New password is required';
      }

      if (newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
      }

      const { valid: validPassword, rule: rulePassword } =
        validatePassword(newPassword);

      if (user.strictPassword && !validPassword) {
        errors.password = rulePassword as string;
      }

      return errors;
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.username}/change-password`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(values),
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        const { error } = await response.json();

        setError(new Error(error));

        return;
      }

      formik.setSubmitting(false);
      setIsSuccessModalOpen(true);
    },
  });

  const isSubmitDisabled = Boolean(
    formik.errors.password ||
      formik.errors.newPassword ||
      !formik.values.newPassword.trim()
  );

  const closeSuccessModal = () => {
    formik.resetForm();
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <TabsContent value="password">
        <Card>
          <form onSubmit={formik.handleSubmit}>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label
                  className={cn({
                    'text-warning': formik.errors.password,
                  })}
                  htmlFor="password"
                >
                  {formik.errors.password || 'Current password'}
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={(event) => {
                    formik.handleChange(event);
                    formik.setFieldError('password', '');
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label
                  className={cn({
                    'text-warning': formik.errors.newPassword,
                  })}
                  htmlFor="newPassword"
                >
                  {formik.errors.newPassword || 'New password'}
                </Label>

                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={formik.values.newPassword}
                  onChange={(event) => {
                    formik.handleChange(event);
                    formik.setFieldError('newPassword', '');
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label
                  className={cn({
                    'text-warning': formik.errors.confirmNewPassword,
                  })}
                  htmlFor="confirmNewPassword"
                >
                  {formik.errors.confirmNewPassword || 'Confirm new password'}
                </Label>

                <Input
                  className={cn({
                    'border-warning': formik.errors.confirmNewPassword,
                  })}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  value={formik.values.confirmNewPassword}
                  onChange={(event) => {
                    formik.handleChange(event);
                    formik.setFieldError('confirmNewPassword', '');
                  }}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full sm:w-32"
                type="submit"
                disabled={isSubmitDisabled || formik.isSubmitting}
              >
                {formik.isSubmitting ? <Loader /> : 'Save password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <AlertDialog open={isSuccessModalOpen}>
        <AlertDialogContent className="text-popover-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Password changed</AlertDialogTitle>

            <AlertDialogDescription>
              Your password has been successfully changed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button type="button" onClick={closeSuccessModal}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
