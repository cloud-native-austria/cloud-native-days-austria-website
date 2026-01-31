#!/usr/bin/env bun

/**
 * Cache Sessionize data before build
 * This script downloads speaker images and caches speaker data locally
 * to avoid runtime dependencies on Sessionize CDN
 */

import { cacheSpeakersData } from '../src/lib/sessionize';

console.log('🚀 Starting Sessionize data caching...\n');

try {
  await cacheSpeakersData();
  console.log('\n✅ Sessionize data cached successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Failed to cache Sessionize data:', error);
  process.exit(1);
}
