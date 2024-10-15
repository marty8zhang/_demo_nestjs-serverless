import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth/auth';

export default auth(async function middleware(req: NextRequest) {
  console.log('middleware req:', JSON.stringify(req));

  /*
   * Other middleware logic goes here.
   */

  return NextResponse.next();
});

export const config = {
  /*
   * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher.
   */
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
