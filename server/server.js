import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const DATA_DIR = join(__dirname, '../data')

function readDatFile(filename) {
  const filePath = join(DATA_DIR, filename)
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.trim().split('\n')
  const headers = lines[0].split('\t')
  const data = lines.slice(1).map(line => {
    const values = line.split('\t')
    const obj = {}
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim()
    })
    return obj
  })
  return data
}

const hostDetail = readDatFile('host_detail.dat').map(item => ({
  hostid: item.hostid,
  hostname: item.hostname,
  owner: item.owner,
  model: item.model,
  location1: item.location1,
  location2: item.location2
}))

const modDetail = readDatFile('mod_detail.dat').map(item => ({
  mod: item.mod,
  type: item.type,
  desc: item.desc,
  unit: item.unit,
  tag: item.tag
}))

const prefTsar = readDatFile('pref_tsar.dat').map(item => ({
  ts: parseInt(item.ts),
  hostid: item.hostid,
  type: item.type,
  mod: item.mod,
  value: parseFloat(item.value),
  tag: item.tag
}))

const diskTsar = readDatFile('disk_tsar.dat').map(item => ({
  ts: parseInt(item.ts),
  hostid: item.hostid,
  type: item.type,
  mod: item.mod,
  value: parseFloat(item.value),
  tag: item.tag
}))

app.get('/api/hosts', (req, res) => {
  res.json(hostDetail)
})

app.get('/api/hosts/:hostid', (req, res) => {
  const host = hostDetail.find(h => h.hostid === req.params.hostid)
  if (host) {
    res.json(host)
  } else {
    res.status(404).json({ message: 'Host not found' })
  }
})

app.get('/api/metrics/pref', (req, res) => {
  const { hostid, mod, tag, start, end } = req.query
  let data = prefTsar
  if (hostid) data = data.filter(d => d.hostid === hostid)
  if (mod) data = data.filter(d => d.mod === mod)
  if (tag) data = data.filter(d => d.tag === tag)
  if (start) data = data.filter(d => d.ts >= parseInt(start))
  if (end) data = data.filter(d => d.ts <= parseInt(end))
  res.json(data)
})

app.get('/api/metrics/disk', (req, res) => {
  const { hostid, mod, tag, start, end } = req.query
  let data = diskTsar
  if (hostid) data = data.filter(d => d.hostid === hostid)
  if (mod) data = data.filter(d => d.mod === mod)
  if (tag) data = data.filter(d => d.tag === tag)
  if (start) data = data.filter(d => d.ts >= parseInt(start))
  if (end) data = data.filter(d => d.ts <= parseInt(end))
  res.json(data)
})

app.get('/api/summary', (req, res) => {
  const latestTs = Math.max(...prefTsar.map(d => d.ts))
  const latestPref = prefTsar.filter(d => d.ts === latestTs)
  const hosts = hostDetail.length
  const cpuUsage = latestPref.filter(d => d.mod === 'cpu_usage').map(d => d.value)
  const memUsed = latestPref.filter(d => d.mod === 'mem_used').map(d => d.value)
  const netIn = latestPref.filter(d => d.mod === 'net_in').map(d => d.value)
  const netOut = latestPref.filter(d => d.mod === 'net_out').map(d => d.value)
  const avgCpu = cpuUsage.length ? (cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length).toFixed(2) : '0'
  const avgMem = memUsed.length ? (memUsed.reduce((a, b) => a + b, 0) / memUsed.length / 1024).toFixed(2) : '0'
  const totalNetIn = netIn.reduce((a, b) => a + b, 0).toFixed(2)
  const totalNetOut = netOut.reduce((a, b) => a + b, 0).toFixed(2)
  res.json({
    hosts,
    avgCpu: parseFloat(avgCpu),
    avgMem: parseFloat(avgMem),
    totalNetIn: parseFloat(totalNetIn),
    totalNetOut: parseFloat(totalNetOut),
    timestamp: latestTs
  })
})

app.get('/api/hosts/stats', (req, res) => {
  const latestTs = Math.max(...prefTsar.map(d => d.ts))
  const stats = hostDetail.map(host => {
    const hostPref = prefTsar.filter(d => d.ts === latestTs && d.hostid === host.hostid)
    const hostDisk = diskTsar.filter(d => d.ts === latestTs && d.hostid === host.hostid)
    const cpuUsage = hostPref.find(d => d.mod === 'cpu_usage')?.value || 0
    const memUsed = hostPref.find(d => d.mod === 'mem_used')?.value || 0
    const memFree = hostPref.find(d => d.mod === 'mem_free')?.value || 0
    const load1 = hostPref.find(d => d.mod === 'load1')?.value || 0
    const netIn = hostPref.find(d => d.mod === 'net_in')?.value || 0
    const netOut = hostPref.find(d => d.mod === 'net_out')?.value || 0
    const diskUtil = hostDisk.find(d => d.tag === 'disk_util_percent')?.value || 0
    return {
      ...host,
      cpuUsage,
      memUsed: memUsed / 1024,
      memFree: memFree / 1024,
      memPercent: memUsed + memFree > 0 ? ((memUsed / (memUsed + memFree)) * 100).toFixed(1) : '0',
      load1,
      netIn,
      netOut,
      diskUtil
    }
  })
  res.json(stats)
})

app.get('/api/trends/cpu', (req, res) => {
  const { hostid } = req.query
  const cpuData = prefTsar.filter(d => d.mod === 'cpu_usage')
  if (hostid) {
    const hostData = cpuData.filter(d => d.hostid === hostid)
    res.json(hostData)
  } else {
    const tsValues = [...new Set(cpuData.map(d => d.ts))].sort()
    const avgTrends = tsValues.map(ts => {
      const values = cpuData.filter(d => d.ts === ts).map(d => d.value)
      return {
        ts,
        value: values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0'
      }
    })
    res.json(avgTrends)
  }
})

app.get('/api/trends/memory', (req, res) => {
  const { hostid } = req.query
  const memData = prefTsar.filter(d => d.mod === 'mem_used')
  if (hostid) {
    const hostData = memData.filter(d => d.hostid === hostid)
    res.json(hostData)
  } else {
    const tsValues = [...new Set(memData.map(d => d.ts))].sort()
    const avgTrends = tsValues.map(ts => {
      const values = memData.filter(d => d.ts === ts).map(d => d.value)
      return {
        ts,
        value: values.length ? (values.reduce((a, b) => a + b, 0) / values.length / 1024).toFixed(2) : '0'
      }
    })
    res.json(avgTrends)
  }
})

app.get('/api/trends/network', (req, res) => {
  const { hostid } = req.query
  const netInData = prefTsar.filter(d => d.mod === 'net_in')
  const netOutData = prefTsar.filter(d => d.mod === 'net_out')
  const tsValues = [...new Set(netInData.map(d => d.ts))].sort()
  let trends
  if (hostid) {
    trends = tsValues.map(ts => ({
      ts,
      in: netInData.find(d => d.ts === ts && d.hostid === hostid)?.value || 0,
      out: netOutData.find(d => d.ts === ts && d.hostid === hostid)?.value || 0
    }))
  } else {
    trends = tsValues.map(ts => ({
      ts,
      in: netInData.filter(d => d.ts === ts).reduce((sum, d) => sum + d.value, 0),
      out: netOutData.filter(d => d.ts === ts).reduce((sum, d) => sum + d.value, 0)
    }))
  }
  res.json(trends)
})

app.get('/api/locations', (req, res) => {
  const locations = {}
  hostDetail.forEach(host => {
    if (!locations[host.location1]) {
      locations[host.location1] = { count: 0, hosts: [] }
    }
    locations[host.location1].count++
    locations[host.location1].hosts.push(host.hostid)
  })
  res.json(locations)
})

app.get('/api/models', (req, res) => {
  const models = {}
  hostDetail.forEach(host => {
    if (!models[host.model]) {
      models[host.model] = { count: 0, hosts: [] }
    }
    models[host.model].count++
    models[host.model].hosts.push(host.hostid)
  })
  res.json(models)
})

app.get('/api/owners', (req, res) => {
  const owners = {}
  hostDetail.forEach(host => {
    if (!owners[host.owner]) {
      owners[host.owner] = { count: 0, hosts: [] }
    }
    owners[host.owner].count++
    owners[host.owner].hosts.push(host.hostid)
  })
  res.json(owners)
})

app.listen(port, () => {
  console.log(`Data Center Monitor Server running on http://localhost:${port}`)
})