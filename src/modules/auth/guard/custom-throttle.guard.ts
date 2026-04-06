import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

export class CustomThrottleGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getReq = context.switchToHttp().getRequest();
    const { employeeId } = getReq.body;

    // attached the new identifier
    if (employeeId) {
      getReq.throttleIdentifier = employeeId;
    }

    return super.canActivate(context);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.throttleIdentifier || req.ip;
  }
}
