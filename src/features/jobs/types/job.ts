export interface JobItem {
  id: number
  title: string
  companyName: string
  companyLogoUrl?: string
  category: string
  jobType: string
  publicationDate: string
  candidateLocation: string
  salary?: string
  descriptionHtml: string
  applyUrl: string
}