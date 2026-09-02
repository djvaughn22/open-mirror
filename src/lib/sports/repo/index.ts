// Which repository this deployment uses.
//
// Postgres when a connection string exists, files otherwise. Nothing above this
// file branches on it: the engine calls SportsRepository and stays ignorant.

import { fileRepository } from "./fileRepo.ts";
import { postgresRepository } from "./postgresRepo.ts";
import type { SportsRepository } from "./types.ts";

export type { SportsRepository } from "./types.ts";
export { fileRepository } from "./fileRepo.ts";

/** The connection string, if this deployment has one. Never logged. */
export function databaseUrl(): string | undefined {
  const url = process.env.SPORTS_DATABASE_URL ?? process.env.DATABASE_URL;
  return url && url.trim().length > 0 ? url.trim() : undefined;
}

let cached: SportsRepository | undefined;

export function sportsRepository(): SportsRepository {
  if (cached) return cached;
  const url = databaseUrl();
  cached = url ? postgresRepository(url) : fileRepository;
  return cached;
}

/** Tests and the CLI inject their own store. */
export function setSportsRepository(repo: SportsRepository | undefined): void {
  cached = repo;
}
