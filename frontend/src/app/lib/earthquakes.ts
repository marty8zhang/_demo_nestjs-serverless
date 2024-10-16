import { auth } from '@/app/lib/auth/auth';

export async function retrieveEarthquakes() {
  try {
    const url = process.env.AWS_API_GATEWAY_REST_API_BASE_URL;
    if (!url) return { error: { message: 'No earthquake API URL provided.' } };

    /*
     * TODO: Is there a better way to define (and export) the return type of
     *  `auth()` instead of doing type assertion here?
     */
    const authSession = (await auth()) as { idToken: string } | null;
    if (!authSession || !authSession.idToken)
      return { error: { message: 'No authentication token found.' } };

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authSession.idToken}`,
      },
    });
    if (!response.ok)
      return {
        error: {
          message: `The earthquake API returned the \`${response.status}\` error response.`,
        },
      };

    return await response.json();
  } catch (error: any) {
    return {
      error: {
        message: `An unexpected error occurred. Details: ${error.message ?? 'Unknown.'}`,
      },
    };
  }
}
