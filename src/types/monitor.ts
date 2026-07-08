export interface Host {
  hostid: string
  hostname: string
  owner: string
  model: string
  location1: string
  location2: string
}

export interface HostStats extends Host {
  cpuUsage: number
  memUsed: number
  memFree: number
  memPercent: string
  load1: number
  netIn: number
  netOut: number
  diskUtil: number
}

export interface SummaryData {
  hosts: number
  avgCpu: number
  avgMem: number
  totalNetIn: number
  totalNetOut: number
  timestamp: number
}

export interface MetricPoint {
  ts: number
  value: number | string
}

export interface NetworkPoint {
  ts: number
  in: number
  out: number
}

export interface LocationData {
  count: number
  hosts: string[]
}

export interface ModelData {
  count: number
  hosts: string[]
}

export interface OwnerData {
  count: number
  hosts: string[]
}