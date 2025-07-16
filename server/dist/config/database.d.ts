import { PrismaClient } from '@prisma/client';
declare class Database {
    private static instance;
    private static isConnected;
    static getInstance(): PrismaClient;
    static connect(): Promise<void>;
    static disconnect(): Promise<void>;
    static isHealthy(): Promise<boolean>;
    static getConnectionStatus(): boolean;
}
export { Database };
declare const _default: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library.js").DefaultArgs>;
export default _default;
//# sourceMappingURL=database.d.ts.map