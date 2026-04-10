const { spawn } = require('child_process');
const { resolve } = require('path');
const { config: loadEnv } = require('dotenv');
const { existsSync } = require('fs');

const rootDir = resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

loadEnv({ path: resolve(rootDir, '.env.test'), override: true });

function localBin(name) {
  const candidate = resolve(rootDir, 'node_modules', '.bin', isWindows ? `${name}.CMD` : name);
  return existsSync(candidate) ? candidate : name;
}

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    // On Windows, spawning bare commands like "pnpm" (resolved via PATH / .cmd shims)
    // works more reliably through the shell.
    const useShell = options.shell ?? isWindows;
    const child = spawn(command, args, {
      cwd: rootDir,
      env: { ...process.env, ...(options.env ?? {}) },
      shell: useShell,
      stdio: 'inherit',
    });

    child.on('error', rejectRun);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolveRun();
        return;
      }

      rejectRun(
        new Error(
          signal
            ? `${command} terminated by signal ${signal}`
            : `${command} exited with code ${code}`
        )
      );
    });
  });
}

async function main() {
  let testError = null;

  await run('docker', ['compose', '-f', 'docker-compose.test.yml', 'up', '-d', '--wait']);

  try {
    await run(localBin('pnpm'), [
      '-C',
      'libs/repository',
      'exec',
      'prisma',
      'migrate',
      'deploy',
      '--schema=prisma/schema.prisma',
    ]);

    await run(localBin('nx'), [
      'run',
      'api:test',
      '--skip-nx-cache',
      '--coverage',
      '--coverageReporters=text',
      '--coverageReporters=lcov',
    ]);
  } catch (error) {
    testError = error;
  }

  try {
    await run('docker', ['compose', '-f', 'docker-compose.test.yml', 'down', '-v']);
  } catch (error) {
    if (!testError) {
      throw error;
    }

    console.error('Failed to stop the test database cleanly.');
    console.error(error.message);
  }

  if (testError) {
    throw testError;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
