"use server"

import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"
import { redis } from "~/services/redis"
import { tryCatch } from "~/utils/helpers"

const limiters = redis
  ? {
      submission: new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(3, "24 h"), // 3 attempts per day
      }),
      report: new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 attempts per hour
      }),
      newsletter: new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(3, "24 h"), // 3 attempts per day
      }),
      claim: new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 attempts per hour
      }),
    }
  : null

/**
 * Get the IP address of the client
 * @returns IP address
 */
export const getIP = async () => {
  const FALLBACK_IP_ADDRESS = "0.0.0.0"
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS
  }

  return headersList.get("x-real-ip") ?? FALLBACK_IP_ADDRESS
}

/**
 * Check if the user is rate limited
 * @param id - The identifier to check
 * @param action - The action to check
 * @returns True if the user is rate limited, false otherwise
 */
export const isRateLimited = async (id: string, action: keyof NonNullable<typeof limiters>) => {
  if (!limiters) return false

  const { data, error } = await tryCatch(limiters[action].limit(id))

  if (error) {
    console.error("Rate limiter error:", error)
    return false // Fail open to prevent blocking legitimate users
  }

  return !data.success
}
