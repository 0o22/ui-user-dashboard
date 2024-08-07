import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions, User } from 'next-auth';
import { jwtDecode } from 'jwt-decode';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  type Role = 'USER' | 'ADMIN';

  // eslint-disable-next-line no-unused-vars
  type Access = 'FULL' | 'LIMITED' | 'NONE';

  interface User {
    username: string;
    role: Role;
    access: Access;
    jwt: string;
    banned: boolean;
    strictPassword: boolean;
    createdAt: string;
    hasPassword: boolean;
  }

  // eslint-disable-next-line no-unused-vars
  interface Session {
    jwt: string;
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    updateAge: 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          jwt: user.jwt,
        };
      }

      return token;
    },
    session: ({ session, token }) => {
      const payload: User = jwtDecode(token.jwt as string);

      if (token) {
        // eslint-disable-next-line no-param-reassign
        session = {
          ...session,
          jwt: token.jwt as string,
          user: payload,
        };
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'SingIn',
      credentials: {
        username: { label: 'Username', type: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify(credentials),
              next: { revalidate: 0 },
            }
          );

          if (!response.ok) {
            const error = await response.json();

            throw new Error(error.error);
          }

          const parsedResponse = await response.json();
          const jwt = parsedResponse.token;

          return {
            id: parsedResponse.id,
            ...credentials,
            jwt,
          } as User;
        } catch (error: unknown) {
          throw new Error(error as string);
        }
      },
    }),
  ],
};
