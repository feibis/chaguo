import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { db } from "~/services/db"

export const StatsCard = async () => {
  const stats = await db.$transaction([db.tool.count(), db.category.count()])

  const statsLabels = {
    0: "Tools",
    1: "Categories",
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} hover={false} focus={false}>
          <CardHeader direction="column">
            <CardDescription>{statsLabels[index as keyof typeof statsLabels]}</CardDescription>
            <H2 className="tabular-nums">{stat.toLocaleString()}</H2>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
