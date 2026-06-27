import type { JobItem } from '../types/job'

type RemotiveJob = {
  id: number
  url: string
  title: string
  company_name: string
  company_logo?: string | null
  category: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary?: string | null
  description: string
}

export function mapRemotiveJobToJobItem(job: RemotiveJob): JobItem {
  return {
    id: job.id,
    title: job.title,
    companyName: job.company_name,
    companyLogoUrl: job.company_logo ?? undefined,
    category: job.category,
    jobType: job.job_type,
    publicationDate: job.publication_date,
    candidateLocation: job.candidate_required_location,
    salary: job.salary ?? undefined,
    descriptionHtml: job.description,
    applyUrl: job.url,
  }
}