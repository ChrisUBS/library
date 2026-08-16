#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const mode = (process.argv[2] ?? 'all').toLowerCase();

const projects = {
  api: {
    cwd: path.join(repoRoot, 'api'),
    command: process.platform === 'win32' ? 'mvnw.cmd' : './mvnw',
    args: ['spring-boot:run'],
  },
  frontend: {
    cwd: path.join(repoRoot, 'frontend'),
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'start'],
  },
};

if (!['api', 'frontend', 'all'].includes(mode)) {
  console.error(`Modo no válido: ${mode}`);
  console.error('Usa: npm run dev -- api|frontend|all');
  process.exit(1);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      env[key] = value;
    }
  }

  return env;
}

function buildEnv(projectName) {
  const projectDir = projects[projectName].cwd;
  const localEnv = loadDotEnv(path.join(projectDir, '.env'));
  return {
    ...localEnv,
    ...process.env,
  };
}

function spawnProject(projectName) {
  const project = projects[projectName];
  const child = spawn(project.command, project.args, {
    cwd: project.cwd,
    env: buildEnv(projectName),
    stdio: 'inherit',
    shell: false,
  });

  child.on('error', (error) => {
    console.error(`[${projectName}] No se pudo iniciar: ${error.message}`);
    exitAll(1);
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    if (mode === 'all') {
      console.error(
        `[${projectName}] terminó con ${signal ? `signal ${signal}` : `exit code ${code}`}`
      );
      exitAll(typeof code === 'number' ? code : 1);
      return;
    }

    process.exit(typeof code === 'number' ? code : 1);
  });

  return child;
}

let shuttingDown = false;
const children = [];

function exitAll(code) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => process.exit(code), 500);
}

process.on('SIGINT', () => exitAll(0));
process.on('SIGTERM', () => exitAll(0));

if (mode === 'api' || mode === 'all') {
  console.log('Iniciando API...');
  children.push(spawnProject('api'));
}

if (mode === 'frontend' || mode === 'all') {
  console.log('Iniciando frontend...');
  children.push(spawnProject('frontend'));
}

