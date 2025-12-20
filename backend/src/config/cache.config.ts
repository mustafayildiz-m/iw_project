import { CacheModuleOptions } from '@nestjs/cache-manager';

export const cacheConfig: CacheModuleOptions = {
  isGlobal: true,
  ttl: 300, // 5 dakika default TTL
  max: 1000, // Maximum cache item sayısı
};
