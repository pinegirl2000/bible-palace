// ============================================
// Redis Client — Railway Redis 연결
// 캐싱으로 성경 조회 속도 극대화
// ============================================
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 5) return null; // 5회 초과 시 재시도 중단
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// ─── 캐시 헬퍼 함수들 ───

/**
 * 캐시에서 데이터 조회, 없으면 fetcher 실행 후 캐시 저장
 * @param key - 캐시 키
 * @param fetcher - DB 조회 함수
 * @param ttl - 캐시 유효시간 (초), 기본 1시간
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  try {
    const hit = await redis.get(key);
    if (hit) {
      return JSON.parse(hit) as T;
    }
  } catch {
    // Redis 연결 실패 시 DB에서 직접 조회
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch {
    // 캐시 저장 실패는 무시
  }

  return data;
}

/**
 * 특정 패턴의 캐시 삭제
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // 무시
  }
}
