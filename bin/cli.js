#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const os = require('os');

// Determine skills source directory (local repo or temp download)
let SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TARGET_DIR = findSkillsTargetDir();

function findSkillsTargetDir() {
  const candidates = [
    path.join(process.cwd(), '.claude', 'skills'),
    path.join(process.cwd(), '.agents', 'skills'),
    path.join(os.homedir(), '.claude', 'skills'),
    path.join(os.homedir(), '.agents', 'skills'),
    path.join(os.homedir(), '.cursor', 'skills'),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }

  return path.join(process.cwd(), '.claude', 'skills');
}

function isGitHubUrl(str) {
  return /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/.test(str);
}

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

function downloadRepo(owner, repo) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pledge-skills-'));
  const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.tar.gz`;
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;
  const outPath = path.join(tmpDir, 'repo.tar.gz');

  return new Promise((resolve, reject) => {
    // Try tarball first
    const file = fs.createWriteStream(outPath);
    https.get(tarballUrl, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          // Extract
          try {
            execSync(`tar -xzf "${outPath}" -C "${tmpDir}"`, { stdio: 'pipe' });
            const extracted = fs.readdirSync(tmpDir).find(d => d.startsWith(`${repo}-`));
            if (extracted) {
              SKILLS_DIR = path.join(tmpDir, extracted, 'skills');
              resolve(tmpDir);
            } else {
              reject(new Error('Could not find extracted repo folder'));
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        https.get(res.headers.location, (res2) => {
          if (res2.statusCode === 200) {
            res2.pipe(file);
            file.on('finish', () => {
              file.close();
              try {
                execSync(`tar -xzf "${outPath}" -C "${tmpDir}"`, { stdio: 'pipe' });
                const extracted = fs.readdirSync(tmpDir).find(d => d.startsWith(`${repo}-`));
                if (extracted) {
                  SKILLS_DIR = path.join(tmpDir, extracted, 'skills');
                  resolve(tmpDir);
                } else {
                  reject(new Error('Could not find extracted repo folder'));
                }
              } catch (e) {
                reject(e);
              }
            });
          } else {
            reject(new Error(`Failed to download: ${res2.statusCode}`));
          }
        }).on('error', reject);
      } else {
        reject(new Error(`Failed to download: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function getAvailableSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found.');
    process.exit(1);
  }
  return fs.readdirSync(SKILLS_DIR).filter(name => {
    const fullPath = path.join(SKILLS_DIR, name);
    return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'SKILL.md'));
  });
}

function installSkill(skillName) {
  const source = path.join(SKILLS_DIR, skillName);
  const target = path.join(TARGET_DIR, skillName);

  if (!fs.existsSync(source)) {
    console.error(`Skill "${skillName}" not found.`);
    console.log(`Available: ${getAvailableSkills().join(', ')}`);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true });
    console.log(`  Updated: ${skillName}`);
  } else {
    console.log(`  Installed: ${skillName}`);
  }

  copyDir(source, target);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function showHelp() {
  console.log(`
pledge-skills CLI

Usage:
  npx pledge-skills add <skill-name>           Install a specific skill (local)
  npx pledge-skills add <github-url> --skill <name>  Install from GitHub repo
  npx pledge-skills add all                      Install all skills
  npx pledge-skills list                         List available skills
  npx pledge-skills --help                       Show this help

Examples:
  npx pledge-skills add nextjs
  npx pledge-skills add react
  npx pledge-skills add typescript
  npx pledge-skills add tailwindcss
  npx pledge-skills add all

  npx pledge-skills add https://github.com/pledgeandgrow/pledge-skills --skill nextjs
  npx pledge-skills add https://github.com/pledgeandgrow/pledge-skills --skill all
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  if (command === 'list') {
    const skills = getAvailableSkills();
    console.log('Available skills:');
    for (const skill of skills) {
      const skillPath = path.join(SKILLS_DIR, skill);
      const files = fs.readdirSync(skillPath).filter(f => f.endsWith('.md')).length;
      console.log(`  - ${skill} (${files} files)`);
    }
    return;
  }

  if (command === 'add') {
    const arg = args[1];

    if (!arg) {
      console.error('Please specify a skill name, GitHub URL, or "all"');
      console.log(`Run: npx pledge-skills list`);
      process.exit(1);
    }

    // Check if second arg is a GitHub URL
    let skillArg = arg;
    let tmpDirToClean = null;

    if (isGitHubUrl(arg)) {
      const parsed = parseGitHubUrl(arg);
      if (!parsed) {
        console.error('Invalid GitHub URL');
        process.exit(1);
      }

      console.log(`Downloading ${parsed.owner}/${parsed.repo}...`);
      try {
        tmpDirToClean = await downloadRepo(parsed.owner, parsed.repo);
        console.log('Downloaded.\n');
      } catch (e) {
        console.error('Failed to download repo:', e.message);
        process.exit(1);
      }

      // Find --skill flag
      const skillFlagIndex = args.indexOf('--skill');
      if (skillFlagIndex === -1 || !args[skillFlagIndex + 1]) {
        console.error('Please specify --skill <name> when using a GitHub URL');
        process.exit(1);
      }
      skillArg = args[skillFlagIndex + 1];
    }

    // Validate skills directory exists now
    if (!fs.existsSync(SKILLS_DIR)) {
      console.error('Skills directory not found in repo.');
      process.exit(1);
    }

    if (skillArg === 'all') {
      const skills = getAvailableSkills();
      console.log(`Installing ${skills.length} skills to ${TARGET_DIR}...\n`);
      for (const skill of skills) {
        installSkill(skill);
      }
      console.log(`\nDone! ${skills.length} skills installed.`);
    } else {
      console.log(`Installing "${skillArg}" to ${TARGET_DIR}...\n`);
      installSkill(skillArg);
      console.log(`\nDone! 1 skill installed.`);
    }

    console.log(`\nSkills location: ${TARGET_DIR}`);

    // Cleanup temp directory
    if (tmpDirToClean) {
      try {
        fs.rmSync(tmpDirToClean, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }

    return;
  }

  console.error(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
