'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Loader from '@/components/Loader';
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Login() {
  const { setError } = useErrorContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const response = await signIn('credentials', {
        redirect: false,
        ...values,
      });

      if (!response?.ok) {
        const errorMessage = response?.error?.slice(7); // Remove 'Error: ' from the error message

        setError(new Error(errorMessage || 'An error occurred'));

        return;
      }

      formik.setSubmitting(false);
      router.push('/account');
    },
  });

  const isSubmitDisabled = Boolean(
    formik.errors.username ||
      formik.errors.password ||
      !formik.values.username.trim()
  );

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((currentState) => !currentState);

  return (
    <section className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-xl border">
        <form onSubmit={formik.handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login to your account</CardTitle>

            <CardDescription>
              Enter your username and password to login to your account.
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
                onChange={formik.handleChange}
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
                  onChange={formik.handleChange}
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitDisabled || formik.isSubmitting}
            >
              {formik.isSubmitting ? <Loader /> : 'Login'}
            </Button>

            <span className="text-center text-sm">
              Don&apos;t have an account?
            </span>

            <Button
              className="w-full"
              variant="secondary"
              type="button"
              onClick={() => router.push('/register')}
            >
              Create an account
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
