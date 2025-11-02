import { $ } from 'bun';
import { watch } from 'fs';
import { cp, mkdir, rm } from 'fs/promises';
import path from 'path';

const isDev = process.argv.includes('--watch');

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

async function cleanDist() {
  try {
    await rm('dist', { recursive: true, force: true });
  } catch (error) {
    // Directory doesn't exist
  }
  await ensureDir('dist');
  await ensureDir('dist/icons');
}

async function copyStaticFiles() {
  console.log('📁 Copying static files...');

  // Copy manifest
  await cp('public/manifest.json', 'dist/manifest.json');

  // Copy popup HTML
  await cp('src/popup/popup.html', 'dist/popup.html');

  // Copy CSS files
  await cp('src/popup/popup.css', 'dist/popup.css');

  // Copy icons (create placeholder for now)
  // In production, you would copy actual icon files
  try {
    await cp('public/icons', 'dist/icons', { recursive: true });
  } catch (error) {
    console.log('⚠️  No icons found, creating placeholders...');
    // Icons will be created in the next step
  }
}

async function buildTypeScript() {
  console.log('🔨 Building TypeScript files...');

  const entryPoints = [
    './src/popup/popup.ts',
    './src/content/content.ts',
    './src/background/background.ts',
  ];

  const result = await Bun.build({
    entrypoints: entryPoints,
    outdir: './dist',
    target: 'browser',
    splitting: false,
    sourcemap: isDev ? 'inline' : 'none',
    minify: !isDev,
    naming: {
      entry: '[name].js',
    },
  });

  if (!result.success) {
    console.error('❌ Build failed:');
    for (const log of result.logs) {
      console.error(log);
    }
    throw new Error('Build failed');
  }

  console.log(`✅ Built ${result.outputs.length} files`);

  // Log output files
  for (const output of result.outputs) {
    const relativePath = path.relative(process.cwd(), output.path);
    console.log(`  - ${relativePath}`);
  }
}

async function createPlaceholderIcons() {
  // Check if icons directory exists and has files
  const iconsPath = 'dist/icons';
  try {
    const iconFiles = await Bun.file(`${iconsPath}/icon-16.png`).exists();
    if (iconFiles) {
      return; // Icons already exist
    }
  } catch (error) {
    // Icons don't exist, create placeholders
  }

  console.log('🎨 Creating placeholder icons...');

  // Create simple SVG icons as placeholders
  const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="SIZE" height="SIZE" viewBox="0 0 SIZE SIZE" xmlns="http://www.w3.org/2000/svg">
  <rect width="SIZE" height="SIZE" fill="#4a154b" rx="4"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="FONTSIZE" font-weight="bold">S</text>
</svg>`;

  const sizes = [
    { size: 16, fontSize: 12 },
    { size: 32, fontSize: 24 },
    { size: 48, fontSize: 36 },
    { size: 128, fontSize: 96 },
  ];

  for (const { size, fontSize } of sizes) {
    const svg = svgIcon.replace(/SIZE/g, size.toString()).replace(/FONTSIZE/g, fontSize.toString());
    await Bun.write(`${iconsPath}/icon-${size}.png`, svg);
  }

  console.log('✅ Placeholder icons created');
}

async function build() {
  const startTime = Date.now();
  console.log('🚀 Starting build...\n');

  try {
    // Clean and prepare dist directory
    await cleanDist();

    // Copy static files
    await copyStaticFiles();

    // Build TypeScript
    await buildTypeScript();

    // Create placeholder icons if needed
    await createPlaceholderIcons();

    const elapsed = Date.now() - startTime;
    console.log(`\n✨ Build completed in ${elapsed}ms`);

    if (!isDev) {
      console.log('\n📦 Extension ready to load:');
      console.log('1. Open Chrome and go to chrome://extensions');
      console.log("2. Enable 'Developer mode'");
      console.log("3. Click 'Load unpacked' and select the 'dist' folder");
    }
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run initial build
await build();

// Watch mode
if (isDev) {
  console.log('\n👀 Watching for changes...\n');

  let buildTimeout: Timer | null = null;

  const triggerRebuild = () => {
    if (buildTimeout) {
      clearTimeout(buildTimeout);
    }
    buildTimeout = setTimeout(async () => {
      console.log('\n🔄 Changes detected, rebuilding...\n');
      await build();
      console.log('\n👀 Watching for changes...\n');
    }, 100);
  };

  // Watch source files
  watch('./src', { recursive: true }, triggerRebuild);
  watch('./public', { recursive: true }, triggerRebuild);

  console.log('Press Ctrl+C to stop watching');
}
