// BACKLOG PLACEHOLDER — WatchedNotWatched daily social channel.
//
// NOT wired to the daily engine yet (deliberate). The first market test will
// use manual launch posts until the public product promise and a working
// destination page are confirmed. When that day comes: copy this config into
// the watched-not-watched repo, write a content adapter (e.g. "Tonight's
// Pick" from the Top 22/222 board), design the card, and wire the standard
// routes. Everything else is already built.

import type { DailySocialBrandConfig } from "../dailySocialCore";

export const WATCHED_NOT_WATCHED_BRAND: DailySocialBrandConfig = {
  brand: "watchednotwatched",
  siteName: "WatchedNotWatched.com",
  siteUrl: "https://watchednotwatched.com",
  markerPrefix: "Tonight's Pick", // provisional — confirm with DJ at launch
  hashtags: ["#WatchedNotWatched", "#MovieNight", "#WhatToWatch"],
  startDate: "2099-01-01", // sentinel: not launched
  version: 0,
};
