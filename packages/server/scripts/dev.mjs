import { spawn } from 'node:child_process'

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function run(command, args, options = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    ...options,
  })
}

function exitWithCode(code) {
  process.exit(typeof code === 'number' ? code : 1)
}

function startWatchMode() {
  const compiler = run(pnpmCommand, ['exec', 'tsc', '--watch', '--preserveWatchOutput'])
  const server = run(process.execPath, ['--watch', 'dist/main.js'])

  const shutdown = (signal) => {
    compiler.kill(signal)
    server.kill(signal)
  }

  process.on('SIGINT', () => {
    shutdown('SIGINT')
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    shutdown('SIGTERM')
    process.exit(0)
  })

  compiler.on('exit', (code) => {
    if (code && code !== 0) {
      server.kill('SIGTERM')
      exitWithCode(code)
    }
  })

  server.on('exit', (code) => {
    if (code && code !== 0 && compiler.exitCode !== null) {
      exitWithCode(code)
    }
  })
}

const initialBuild = run(pnpmCommand, ['exec', 'tsc', '--pretty', 'false'])

initialBuild.on('exit', (code) => {
  if (code && code !== 0) {
    exitWithCode(code)
  }
  startWatchMode()
})
