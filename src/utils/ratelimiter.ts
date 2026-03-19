import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiter {
  private static bucket: number;
  private static fillRate: number;
  private static tokens: number;
  private static lastFilled: number;

  // default
  constructor() {
    RateLimiter.bucket = 3; // max attempts
    RateLimiter.fillRate = 1; //one for every 15 minutes
    RateLimiter.tokens = RateLimiter.bucket; // number of tokens inside the bucket
    RateLimiter.lastFilled = Date.now();
  }

  static refill() {
    const now = Date.now();
    const per15mins = (now - RateLimiter.lastFilled) / 900000; // 15 minutes
    const newToken = this.fillRate * per15mins; // one token for every 15 mins

    this.tokens = Math.min(this.bucket, this.tokens + newToken); // max is only 3 max attempts
    this.lastFilled = now;
  }

  //   token for every req consumed: 1
  static consume(tokens: number = 1): boolean {
    RateLimiter.refill();
    // if the bucket is greater than the consumed token then allow request
    // otherwise deny
    if (RateLimiter.tokens >= tokens) {
      RateLimiter.tokens -= tokens;
      return true;
    }

    return false;
  }
}
