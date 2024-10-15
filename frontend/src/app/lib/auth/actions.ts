'use server';

import { AuthError } from 'next-auth';

import { signIn } from '@/app/lib/auth/auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (!(error instanceof AuthError)) {
      throw error;
    }

    switch (error.type) {
      case 'CredentialsSignin':
        return 'Invalid login credentials.';
      default:
        return 'Something went wrong during authentication.';
    }
  }
}
