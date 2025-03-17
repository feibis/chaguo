import { adsConfig } from "~/config/ads"
import { claimsConfig } from "~/config/claims"
import { dataTableConfig } from "~/config/data-table"
import { linksConfig } from "~/config/links"
import { metadataConfig } from "~/config/metadata"
import { searchConfig } from "~/config/search"
import { siteConfig } from "~/config/site"
import { submissionsConfig } from "~/config/submissions"

export const config = {
  site: siteConfig,
  links: linksConfig,
  metadata: metadataConfig,
  ads: adsConfig,
  submissions: submissionsConfig,
  search: searchConfig,
  claims: claimsConfig,
  dataTable: dataTableConfig,
}
