'use client';

import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { validatePassword } from '@/helpers/validation/validatePassword';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { signIn } from 'next-auth/react';
import type { User } from 'next-auth';
import { useFormik } from 'formik';
import { cn } from '@/lib/utils';

interface Props {
  user: User;
}

export default function NewPasswordDialog({ user }: Props) {
  const { setError } = useErrorContext();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
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
      const { newPassword } = values;

      formik.setSubmitting(true);

      const passwordResetResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.username}/set-new-password`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ newPassword }),
          next: { revalidate: 0 },
        }
      );

      if (!passwordResetResponse.ok) {
        const { error } = await passwordResetResponse.json();

        setError(new Error(error));

        return;
      }

      const signInResponse = await signIn('credentials', {
        redirect: false,
        username: user.username,
        password: newPassword,
      });

      if (!signInResponse?.ok) {
        const errorMessage = signInResponse?.error?.slice(7); // Remove 'Error: ' from the error message

        setError(new Error(errorMessage || 'An error occurred'));

        return;
      }

      formik.setSubmitting(false);
      router.push('/account');
    },
  });

  const isSubmitDisabled = Boolean(
    formik.errors.newPassword || !formik.values.newPassword.trim()
  );

  return (
    <div className="fixed z-[49] flex h-screen w-screen items-center justify-center bg-background/50">
      <Card className="w-full max-w-[600px]">
        <form onSubmit={formik.handleSubmit}>
          <CardHeader>
            <CardTitle>Set new password</CardTitle>

            <CardDescription>Please enter your new password</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
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
              className="w-full sm:max-w-32"
              type="submit"
              disabled={isSubmitDisabled || formik.isSubmitting}
            >
              {formik.isSubmitting ? <Loader /> : 'Save password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
