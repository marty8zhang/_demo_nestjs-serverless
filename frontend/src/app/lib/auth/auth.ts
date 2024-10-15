import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

/*
 * Extract a partial `NextAuthConfig` here to prevent JavaScript runtime
 * compatibility issues.
 * See https://github.com/kelektiv/node.bcrypt.js/issues/1017#issuecomment-1993995468.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: any;
      request: { nextUrl: any };
    }) {
      console.log('`authorized()` auth:', auth);
      console.log('`authorized()` nextUrl:', nextUrl);

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProtectedPage = isOnDashboard; /* && is... && is... */
      if (!isLoggedIn && isOnProtectedPage) {
        return Response.redirect(
          new URL(
            `/login?callbackUrl=${encodeURIComponent(nextUrl.href)}`,
            nextUrl,
          ),
        );
      }

      /*
       * Allow access to all other pages, e.g., Homepage, by default.
       */
      return true;
    },
    /*
     * https://next-auth.js.org/configuration/callbacks#jwt-callback.
     */
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: any;
      account: any;
    }) {
      /*
       * Persist additional data to the (NextAuth.js) "token" right after login.
       */
      if (account) {
        token.idToken = user.idToken;
        token.tokenExpiry = user.tokenExpiry;
      }

      if (!token.tokenExpiry || token.tokenExpiry * 1000 < Date.now()) {
        console.log('`jwt()`: The token has expired, logging out...');
        await signOut({ redirectTo: '/login' });
      }

      console.log('`jwt()` token:', token, 'user:', user, 'account:', account);

      return token;
    },
    /*
     * https://next-auth.js.org/configuration/callbacks#session-callback.
     */
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      session.idToken = token.idToken;
      session.tokenExpiry = token.tokenExpiry;

      console.log(
        '`session()` session:',
        session,
        'token:',
        token,
        'user:',
        user,
      );

      return session;
    },
  },
  providers: [],
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Invalid login credentials.');

          return null;
        }

        const { email, password } = parsedCredentials.data;

        const cognitoClient = new CognitoIdentityProviderClient({
          region: process.env.AWS_REGION,
        });
        const params = {
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          ClientId: process.env.AWS_COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        };

        try {
          const command = new InitiateAuthCommand(params);
          const { AuthenticationResult } = await cognitoClient.send(command);
          if (!AuthenticationResult || !AuthenticationResult.IdToken) {
            return null;
          }

          const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.AWS_COGNITO_USER_POOL_ID ?? '',
            tokenUse: 'id',
            clientId: process.env.AWS_COGNITO_CLIENT_ID ?? '',
          });
          const payload = await verifier.verify(AuthenticationResult.IdToken);

          return {
            id: payload.sub,
            name: payload.preferred_username,
            email: payload.email,
            idToken: AuthenticationResult.IdToken,
            tokenExpiry: payload.exp,
          } as User;
        } catch (error) {
          console.error('Error signing in: ', error);
        }

        console.log('Invalid login credentials.');
        return null;
      },
    }),
  ],
});
