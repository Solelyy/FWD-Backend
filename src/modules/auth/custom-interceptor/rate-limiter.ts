import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  TooManyRequestsException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ThrottlerStorageService } from '@nestjs/throttler';

@Injectable()
export class LoginThrottleInterceptor implements NestInterceptor {
  constructor(private throttlerService: ThrottlerStorageService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { employeeId } = request.body; // ✅ Fully validated!

    if (!employeeId) {
      return next.handle();
    }

    const key = `login:${employeeId}`;
    const ttl = 900000; // 15 minutes in ms
    const limit = 5;

    // Use ThrottlerService to check and increment
    const { totalHits } = await this.throttlerService.getOrSet(key, ttl, limit);

    if (totalHits > limit) {
      throw new TooManyRequestsException('Too many login attempts');
    }

    return next.handle().pipe(
      tap({
        next: async (response) => {
          // Clear attempts on successful login
          if (response?.data?.success) {
            await this.throttlerService.clear(key);
          }
        },
      }),
    );
  }
}
