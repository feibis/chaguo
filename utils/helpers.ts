import wretch from "wretch"
import { z } from "zod"

/**
 * Checks if an email is a disposable email by checking if the domain is in the disposable domains list
 * @param email
 * @returns
 */
export const isDisposableEmail = async (email: string) => {
  const disposableJsonURL =
    "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json"

  const disposableDomains = await wretch(disposableJsonURL).get().json<string[]>()
  const domain = email.split("@")[1]

  return disposableDomains.includes(domain)
}

/**
 * Returns an object with the default values for the given schema
 * @param schema - The schema to get the defaults for
 * @returns An object with the default values for the given schema
 */
export const getDefaults = <Schema extends z.AnyZodObject>(schema: Schema) => {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
      return [key, undefined]
    }),
  )
}
