import { ForbiddenException } from '@nestjs/common';

type Membership = { role?: string };
type RequestWithMembership = { membership?: Membership };

export function requireOwner(req: RequestWithMembership) {
  const role = req.membership?.role;
  if (role !== 'owner') throw new ForbiddenException('Owner role required');
}

export function requireAdminOrOwner(req: RequestWithMembership) {
  const role = req?.membership?.role;
  if (role !== 'owner' && role !== 'admin')
    throw new ForbiddenException('Admin or Owner required');
}
