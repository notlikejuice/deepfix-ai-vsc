export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  public set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }
}
