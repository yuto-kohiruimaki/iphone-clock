'use server';

import { loadSessionBlockData } from 'ccusage/data-loader';

export async function getUsageData() {
  try {
    const data = await loadSessionBlockData();
    // The data might be large, so we might want to limit it or just return the recent ones.
    // For now, let's return the last 5 sessions.
    const sessions = data.slice(-5).reverse();
    return JSON.parse(JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to load usage data:', error);
    return [];
  }
}
