import { PrismaService } from '../core/prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
    }>;
    getDatabaseHealth(): Promise<{
        status: string;
        database: string;
        tables: unknown;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
        tables?: undefined;
    }>;
    getPrismaInfo(): Promise<{
        status: string;
        prisma: {
            version: string;
            database: string;
            tables: {
                appUsers: number;
                companies: number;
                companyMembers: number;
                companyDocuments: number;
                licitacoes: number;
                licitacaoDocuments: number;
                licitacaoEvents: number;
            };
        };
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        prisma: string;
        error: any;
        timestamp: string;
    }>;
}
