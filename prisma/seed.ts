import { PrismaClient, ToolStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seeding...")

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@dirstarter.com",
      emailVerified: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log("Created admin user")

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Frontend", slug: "frontend", label: "Frontend Development" },
      { name: "Backend", slug: "backend", label: "Backend Development" },
      { name: "DevOps", slug: "devops", label: "DevOps & Deployment" },
      { name: "Design Tools", slug: "design-tools", label: "Design & UI/UX" },
      { name: "Productivity", slug: "productivity", label: "Productivity Tools" },
      { name: "Testing", slug: "testing", label: "Testing & QA" },
      { name: "Learning", slug: "learning", label: "Learning Resources" },
      { name: "AI Tools", slug: "ai-tools", label: "AI & Machine Learning" },
    ],
  })

  console.log("Created categories")

  // Create tags
  const tags = await prisma.tag.createMany({
    data: [
      { name: "React", slug: "react" },
      { name: "Vue", slug: "vue" },
      { name: "Angular", slug: "angular" },
      { name: "Svelte", slug: "svelte" },
      { name: "Node.js", slug: "nodejs" },
      { name: "Python", slug: "python" },
      { name: "TypeScript", slug: "typescript" },
      { name: "JavaScript", slug: "javascript" },
      { name: "CSS", slug: "css" },
      { name: "HTML", slug: "html" },
      { name: "Rust", slug: "rust" },
      { name: "Go", slug: "go" },
      { name: "AWS", slug: "aws" },
      { name: "Docker", slug: "docker" },
      { name: "Kubernetes", slug: "kubernetes" },
      { name: "CI/CD", slug: "ci-cd" },
      { name: "Free", slug: "free" },
      { name: "Paid", slug: "paid" },
      { name: "Open Source", slug: "open-source" },
      { name: "AI", slug: "ai" },
    ],
  })

  console.log("Created tags")

  // Create tools
  const toolsData = [
    {
      name: "VS Code",
      slug: "vscode",
      websiteUrl: "https://code.visualstudio.com",
      tagline: "Free source-code editor made by Microsoft",
      description:
        "Visual Studio Code is a lightweight but powerful source code editor with support for many programming languages through extensions.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://code.visualstudio.com/favicon.ico",
      screenshotUrl: "https://code.visualstudio.com/opengraphimg/opengraph-home.png",
      categories: ["frontend"],
      tags: ["typescript", "javascript", "free", "open-source"],
    },
    {
      name: "Next.js",
      slug: "nextjs",
      websiteUrl: "https://nextjs.org",
      tagline: "The React Framework for Production",
      description:
        "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://nextjs.org/favicon.ico",
      screenshotUrl: "https://nextjs.org/static/twitter-cards/home.jpg",
      categories: ["frontend"],
      tags: ["typescript", "javascript", "free", "open-source"],
    },
    {
      name: "Docker",
      slug: "docker",
      websiteUrl: "https://www.docker.com",
      tagline: "Accelerate how you build, share and run modern applications",
      description:
        "Docker is an open platform for developing, shipping, and running applications in containers.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl:
        "https://www.docker.com/wp-content/uploads/2023/04/cropped-Docker-favicon-32x32.png",
      screenshotUrl:
        "https://www.docker.com/wp-content/uploads/2023/08/desktop-4.30-macOS-dark.png.webp",
      categories: ["devops"],
      tags: ["docker", "free", "open-source"],
    },
    {
      name: "Figma",
      slug: "figma",
      websiteUrl: "https://www.figma.com",
      tagline: "Design, prototype, and collaborate all in the browser",
      description:
        "Figma is a vector graphics editor and prototyping tool, primarily web-based with additional offline features through desktop applications.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://static.figma.com/app/icon/1/favicon.png",
      screenshotUrl:
        "https://cdn.sanity.io/images/599r6htc/localized/11279bf56dcf1fd86177fe2d4d8bf5be1760a3a5-2310x1286.png?w=1060&q=75&fit=max&auto=format",
      categories: ["design-tools"],
      tags: ["free", "paid"],
    },
    {
      name: "Node.js",
      slug: "nodejs",
      websiteUrl: "https://nodejs.org",
      tagline: "JavaScript runtime built on Chrome's V8 JavaScript engine",
      description:
        "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://nodejs.org/static/images/favicons/favicon.ico",
      screenshotUrl: "https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg",
      categories: ["backend"],
      tags: ["nodejs", "javascript", "free", "open-source"],
    },
    {
      name: "GitHub Copilot",
      slug: "github-copilot",
      websiteUrl: "https://github.com/features/copilot",
      tagline: "Your AI pair programmer",
      description:
        "GitHub Copilot uses the OpenAI Codex to suggest code and entire functions in real-time, right from your editor.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://github.githubassets.com/favicons/favicon.svg",
      screenshotUrl:
        "https://github.githubassets.com/images/modules/site/copilot/copilot-hub-hero.jpg",
      categories: ["productivity", "ai-tools"],
      tags: ["paid", "ai"],
    },
    {
      name: "Jest",
      slug: "jest",
      websiteUrl: "https://jestjs.io",
      tagline: "Delightful JavaScript Testing",
      description:
        "Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase.",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://jestjs.io/img/favicon/favicon.ico",
      screenshotUrl: "https://jestjs.io/img/opengraph.png",
      categories: ["testing"],
      tags: ["typescript", "javascript", "free", "open-source"],
    },
    {
      name: "AWS",
      slug: "aws",
      websiteUrl: "https://aws.amazon.com",
      tagline: "The most comprehensive and broadly adopted cloud platform",
      description:
        "Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services.",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico",
      screenshotUrl: "https://a0.awsstatic.com/libra-css/images/site/touch-icon-ipad-144-smile.png",
      categories: ["devops"],
      tags: ["aws", "paid"],
    },
    {
      name: "MDN Web Docs",
      slug: "mdn-web-docs",
      websiteUrl: "https://developer.mozilla.org",
      tagline: "Resources for developers, by developers",
      description:
        "MDN Web Docs is an open-source, collaborative project documenting Web platform technologies.",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://developer.mozilla.org/favicon-48x48.png",
      screenshotUrl: "https://developer.mozilla.org/mdn-social-share.png",
      categories: ["learning"],
      tags: ["javascript", "css", "html", "free", "open-source"],
    },
    {
      name: "ChatGPT",
      slug: "chatgpt",
      websiteUrl: "https://chat.openai.com",
      tagline: "Optimizing language models for dialogue",
      description:
        "ChatGPT is a large language model developed by OpenAI that can generate human-like text based on the context and prompt it's given.",
      isFeatured: true,
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://cdn.oaistatic.com/assets/favicon-miwirzcw.ico",
      screenshotUrl: "https://openai.com/content/images/2022/11/ChatGPT.jpg",
      categories: ["ai-tools", "productivity"],
      tags: ["free", "paid", "ai"],
    },
    {
      name: "Tailwind CSS",
      slug: "tailwind-css",
      websiteUrl: "https://tailwindcss.com",
      tagline: "A utility-first CSS framework for rapid UI development",
      description:
        "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://tailwindcss.com/favicons/apple-touch-icon.png",
      screenshotUrl: "https://tailwindcss.com/_next/static/media/social-card-large.a6e71726.jpg",
      categories: ["frontend"],
      tags: ["css", "free", "open-source"],
    },
    {
      name: "React",
      slug: "react",
      websiteUrl: "https://react.dev",
      tagline: "The library for web and native user interfaces",
      description:
        "React is a JavaScript library for building user interfaces, particularly single-page applications.",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      faviconUrl: "https://react.dev/favicon.ico",
      screenshotUrl: "https://react.dev/images/og-home.png",
      categories: ["frontend"],
      tags: ["react", "javascript", "free", "open-source"],
    },
  ]

  // Create tools with their relationships
  for (const { categories, tags, ...toolData } of toolsData) {
    await prisma.tool.create({
      data: {
        ...toolData,
        categories: { connect: categories.map(slug => ({ slug })) },
        tags: { connect: tags.map(slug => ({ slug })) },
        owner: { connect: { id: admin.id } },
      },
    })
  }

  console.log("Created tools")
  console.log("Seeding completed!")
}

main()
  .catch(e => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
