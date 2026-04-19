import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { partition } from 'rxjs';
import { CookieData } from 'src/common/interface/cookie.interface';

/*
@Injectable()
export class CookieHelper {
  setAuthCookies(user: CookieData, token: string, res: Response) {
    //attached to requests
    res.cookie('session_token', token, {
      httpOnly: true, //unreadable to frontend
      secure: false, //if local/dev
      maxAge: 24 * 60 * 60 * 1000, //alive 24hrs
      path: '/',
      sameSite: 'lax',
    });

    res.cookie('user', JSON.stringify(user), {
      httpOnly: false, //readable
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('session_token');
    res.clearCookie('user');
  }
}

*/

@Injectable()
export class CookieHelper {
  setAuthCookies(user: CookieData, token: string, res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS required in production
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('session_token', token, cookieOptions);

    res.cookie('user', JSON.stringify(user), {
      ...cookieOptions,
      httpOnly: false, // frontend can read user info
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('session_token', { path: '/' });
    res.clearCookie('user', { path: '/' });
  }
}

/*
@Injectable()
export class CookieHelper {
  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      path: '/',
    };
  }

  setAuthCookies(user: CookieData, token: string, res: Response) {
    const cookieOptions = this.getCookieOptions();

    // AUTH TOKEN COOKIE (important one)
    res.cookie('session_token', token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // USER COOKIE (frontend readable)
    res.cookie('user', JSON.stringify(user), {
      ...cookieOptions,
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  clearAuthCookies(res: Response) {
    const cookieOptions = this.getCookieOptions();

    // MUST MATCH setCookie options EXACTLY (except maxAge)
    res.clearCookie('session_token', cookieOptions);

    res.clearCookie('user', {
      ...cookieOptions,
      httpOnly: false,
    });
  }
}
  */