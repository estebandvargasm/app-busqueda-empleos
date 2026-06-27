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