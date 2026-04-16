import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();
const DB_HEALTH_TTL_MS = 5000;
const DB_HEALTH_TIMEOUT_MS = 1500;

let dbHealthCache = {
	checkedAt: 0,
	ok: false,
};

function timeoutPromise(ms) {
	return new Promise((_, reject) => {
		setTimeout(() => reject(new Error('DB health check timeout')), ms);
	});
}

export function isDatabaseConnectionError(error) {
	const message = String(error?.message || '').toLowerCase();
	return (
		error?.code === 'P1001' ||
		error?.code === 'P1002' ||
		message.includes("can't reach database server") ||
		message.includes('connection') ||
		message.includes('timeout')
	);
}

export async function checkDatabaseConnection() {
	const now = Date.now();
	if (now - dbHealthCache.checkedAt < DB_HEALTH_TTL_MS) {
		return dbHealthCache.ok;
	}

	try {
		await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutPromise(DB_HEALTH_TIMEOUT_MS)]);
		dbHealthCache = { checkedAt: now, ok: true };
		return true;
	} catch {
		dbHealthCache = { checkedAt: now, ok: false };
		return false;
	}
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
