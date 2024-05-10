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
  validatePassword,
  validateUsername,
} from '@/helpers/validation/validate';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Loader from '@/components/Loader';
import { useFormik } from 'formik';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Register() {
  const { setError } = useErrorContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validate: ({ username, password, confirmPassword }) => {
      const errors: Record<string, string> = {};

      const { valid: validUsername, rule: ruleUsername } =
        validateUsername(username);

      if (!validUsername) {
        errors.username = ruleUsername as string;
      }

      const { valid: validPassword, rule: rulePassword } =
        validatePassword(password);

      if (!validPassword) {
        errors.password = rulePassword as string;
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      return errors;
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
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
      router.push('/login');
    },
  });

  const isSubmitDisabled = Boolean(
    formik.errors.username ||
      formik.errors.password ||
      !formik.values.username.trim() ||
      !formik.values.password.trim() ||
      !formik.values.confirmPassword.trim()
  );

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((currentState) => !currentState);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-xl border ">
        <form onSubmit={formik.handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>

            <CardDescription>
              Enter your username below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                className={cn({ 'text-warning': formik.errors.username })}
                htmlFor="username"
              >
                {formik.errors.username || 'Username'}
              </Label>

              <Input
                className={cn({ 'border-warning': formik.errors.username })}
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formik.values.username}
                onChange={(event) => {
                  formik.handleChange(event);
                  formik.setFieldError('username', '');
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={cn({ 'text-warning': formik.errors.password })}
                htmlFor="password"
              >
                {formik.errors.password || 'Password'}
              </Label>

              <div className="relative">
                <Input
                  className={cn({ 'border-warning': formik.errors.password })}
                  id="password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={(event) => {
                    formik.handleChange(event);
                    formik.setFieldError('password', '');
                  }}
                />

                <button
                  className="absolute right-2 top-2 text-muted-foreground"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <EyeOff color="currentColor" />
                  ) : (
                    <Eye color="currentColor" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                className={cn({
                  'text-warning': formik.errors.confirmPassword,
                })}
                htmlFor="confirmPassword"
              >
                {formik.errors.confirmPassword || 'Confirm password'}
              </Label>

              <Input
                className={cn({
                  'border-warning': formik.errors.confirmPassword,
                })}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={(event) => {
                  formik.handleChange(event);
                  formik.setFieldError('confirmPassword', '');
                }}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitDisabled || formik.isSubmitting}
            >
              {formik.isSubmitting ? <Loader /> : 'Create account'}
            </Button>

            <Button
              className="w-full"
              variant="ghost"
              type="button"
              onClick={() => router.push('/login')}
            >
              Already have an account?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
