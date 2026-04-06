import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()

// extends = classes
// implements = interface
export class CustomThrottleGuard extends ThrottlerGuard {
  // only override getTracker if chnaging from ip to custom identifier
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const { employeeId } = req.body;

    return employeeId || req.ip;
  }
}
