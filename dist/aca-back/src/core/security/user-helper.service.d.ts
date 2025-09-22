import { PrismaService } from '../prisma/prisma.service';
export declare class UserHelper {
    private prisma;
    constructor(prisma: PrismaService);
    internalUserId(authUserId: string): Promise<string>;
}
