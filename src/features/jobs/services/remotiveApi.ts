/**
 * Cliente HTTP para la API pública de Remotive (remote jobs).
 * fetchJobs() obtiene los empleos remotos y los mapea al modelo JobItem.
 */
import axios from 'axios'
import type { JobItem } from '../types/job'
import { mapRemotiveJobToJobItem } from './remotiveMapper'

const REMOTIVE_BASE_URL = 'https://remotive.com/api'

type RemotiveJobsResponse = {
  jobs: any[]
}

export async function fetchJobs(): Promise<JobItem[]> {
  const response = await axios.get<RemotiveJobsResponse>(
    `${REMOTIVE_BASE_URL}/remote-jobs`,
  )

  const { jobs } = response.data

  return jobs.map(mapRemotiveJobToJobItem)
}

type RemotiveCategory = { id: number; name: string; slug: string }

type RemotiveCategoriesResponse = {
  jobs: RemotiveCategory[]
}

export async function fetchCategories(): Promise<string[]> {
  const response = await axios.get<RemotiveCategoriesResponse>(
    `${REMOTIVE_BASE_URL}/remote-jobs/categories`,
  )

  return response.data.jobs.map((cat) => cat.name).sort()
}