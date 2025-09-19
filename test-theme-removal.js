/**
 * Test script to verify theme switching removal
 * This script checks if dark: classes have been properly removed/replaced
 */

const fs = require('fs');
const path = require('path');

// Files to check for remaining dark: classes
const filesToCheck = [
  'components/(portfolio)/sections/HeroSection.tsx',
  'components/(portfolio)/Footer.tsx',
  'components/ui/LoadingSpinner.tsx',
  'app/loading-test/page.tsx',
  'tailwind.config.ts'
];

console.log('🔍 Checking for remaining dark: theme classes...\n');

let totalDarkClasses = 0;
let hasIssues = false;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    hasIssues = true;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const darkMatches = content.match(/dark:/g);
  
  if (darkMatches) {
    totalDarkClasses += darkMatches.length;
    console.log(`⚠️  ${file}: Found ${darkMatches.length} dark: classes`);
    
    // Show first few occurrences
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('dark:')) {
        console.log(`   Line ${index + 1}: ${line.trim()}`);
      }
    });
    console.log('');
  } else {
    console.log(`✅ ${file}: No dark: classes found`);
  }
});

// Check Tailwind config
const tailwindPath = path.join(__dirname, 'tailwind.config.ts');
if (fs.existsSync(tailwindPath)) {
  const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
  const hasDarkMode = tailwindContent.includes('darkMode');
  
  if (hasDarkMode) {
    if (tailwindContent.includes("darkMode: 'class'")) {
      console.log('✅ Tailwind config: darkMode set to class-based (good for preventing auto theme switching)');
    } else {
      console.log('⚠️  Tailwind config: darkMode configuration found but not class-based');
    }
  } else {
    console.log('✅ Tailwind config: No darkMode configuration (default behavior disabled)');
  }
}

console.log('\n📊 Summary:');
console.log(`   Total dark: classes found: ${totalDarkClasses}`);

if (totalDarkClasses === 0 && !hasIssues) {
  console.log('🎉 Theme switching removal completed successfully!');
  console.log('   The site will now use a consistent dark theme regardless of browser preferences.');
} else {
  console.log('❌ Theme switching removal incomplete. Please check the issues above.');
}

// Test if globals.css has proper fixed theme colors
const globalsCssPath = path.join(__dirname, 'app/globals.css');
if (fs.existsSync(globalsCssPath)) {
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf8');
  
  if (globalsContent.includes(':root {')) {
    console.log('✅ globals.css: CSS custom properties are properly defined');
  } else {
    console.log('⚠️  globals.css: CSS custom properties might be missing');
  }
  
  if (globalsContent.includes('--background: #0a0a0f')) {
    console.log('✅ globals.css: Dark theme colors are properly set');
  } else {
    console.log('⚠️  globals.css: Dark theme colors might need verification');
  }
}