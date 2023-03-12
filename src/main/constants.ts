import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
const path = require('path')

export const isDev = is.dev
export const dbPath = path.join(app.getPath('userData'), 'app.db')
export const dbUrl = isDev ? process.env.DATABASE_URL! : 'file:' + dbPath

// Hacky, but putting this here because otherwise at query time the Prisma client
// gives an error "Environment variable not found: DATABASE_URL" despite us passing
// the dbUrl into the prisma client constructor in datasources.db.url
process.env.DATABASE_URL = dbUrl

// This needs to be updated every time you create a migration!
export const latestMigration = '20230310040636_add_brand_in_card'
export const platformToExecutables: any = {
  win32: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-windows.exe',
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node'
  },
  linux: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x',
    queryEngine: 'node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node'
  },
  darwin: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin',
    queryEngine: 'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node'
  },
  darwinArm64: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin-arm64',
    queryEngine: 'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node'
  }
}
const extraResourcesPath = app.getAppPath().replace('app.asar', '') // impacted by extraResources setting in electron-builder.yml

function getPlatformName(): string {
  const isDarwin = process.platform === 'darwin'
  if (isDarwin && process.arch === 'arm64') {
    return process.platform + 'Arm64'
  }

  return process.platform
}

const platformName = getPlatformName()

export const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
)
export const qePath = path.join(extraResourcesPath, platformToExecutables[platformName].queryEngine)

export interface Migration {
  id: string
  checksum: string
  finished_at: string
  migration_name: string
  logs: string
  rolled_back_at: string
  started_at: string
  applied_steps_count: string
}
