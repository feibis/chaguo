import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { isTruthy } from "@curiousleaf/utils"
import { generateObject } from "ai"
import { z } from "zod"
import { env } from "~/env"
import { getErrorMessage } from "~/lib/handle-error"
import { db } from "~/services/db"
import { firecrawlClient } from "~/services/firecrawl"

/**
 * Scrapes a website and returns the scraped data.
 * @param url The URL of the website to scrape.
 * @returns The scraped data.
 */
const scrapeWebsiteData = async (url: string) => {
  const data = await firecrawlClient.scrapeUrl(url, { formats: ["markdown"] })

  if (!data.success) {
    throw new Error(data.error)
  }

  return data
}

/**
 * Generates content for a tool.
 * @param url The URL of the website to scrape.
 * @returns The generated content.
 */
export const generateContent = async (url: string) => {
  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY })
  const model = google("gemini-2.0-pro-exp-02-05")
  const scrapedData = await scrapeWebsiteData(url)
  const categories = await db.category.findMany()

  try {
    const schema = z.object({
      tagline: z
        .string()
        .describe(
          "A tagline (up to 60 characters) that captures the essence of the tool. Should not include the tool name.",
        ),
      description: z
        .string()
        .describe(
          "A concise description (up to 160 characters) that highlights the main features and benefits. Should not include the tool name.",
        ),
      content: z
        .string()
        .describe(
          "A detailed and engaging longer description with key benefits (up to 1000 characters). Can be Markdown formatted, but should start with paragraph and not use headings. Highlight important points with bold text. Make sure the lists use correct Markdown syntax.",
        ),
      categories: z
        .array(z.string())
        .transform(a => a.map(name => categories.find(cat => cat.name === name)).filter(isTruthy))
        .describe(`
          Assign the tool to the categories that it belongs to.
          Try to assign the tool to multiple categories, but not more than 3.
          If a tool does not belong to any category, return an empty array.
        `),
    })

    const { object } = await generateObject({
      model,
      schema,
      system: `
        You are an expert content creator specializing in open source products.
        Your task is to generate high-quality, engaging content to display on a directory website.
        You do not use any catchphrases like "Empower", "Streamline" etc.
      `,
      prompt: `
        Provide me details for the following data:
        Title: ${scrapedData.metadata?.title}
        Description: ${scrapedData.metadata?.description}
        Content: ${scrapedData.markdown}

        Here is the list of categories to assign to the tool:
        ${categories.map(({ name }) => name).join("\n")}
      `,
      temperature: 0.3,
    })

    return object
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
