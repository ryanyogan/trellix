import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://gusc1-stable-primate-30213.upstash.io",
  token: process.env.UPSTASH_TOKEN!,
});
