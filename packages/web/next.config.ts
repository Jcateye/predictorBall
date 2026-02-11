import type { NextConfig } from 'next'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repositoryName = process.env.GITHUB_REPOSITORY?.replace(/.*\//, '') ?? ''
const basePath = isGitHubActions && repositoryName ? `/${repositoryName}` : ''

const nextConfig: NextConfig = {
  transpilePackages: ['@predictor-ball/shared'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath,
  trailingSlash: true,
}

export default nextConfig
