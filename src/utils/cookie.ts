import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { CookieInterfaceLogin } from 'src/common/interface/cookie.interface';

@Injectable()
export class CookieHelper {
  setAuthCookies(user: CookieInterfaceLogin, token: string, res: Response) {
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
