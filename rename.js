const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('LearnHub')) {
    const newContent = content.replace(/LearnHub/g, 'HamroLearning');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        walk(file);
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.xml', '.md'].includes(ext)) {
        replaceInFile(file);
      }
    }
  });
}

walk('./src');
walk('./android/app/src/main/res/values');
replaceInFile('./capacitor.config.ts');
replaceInFile('./package.json');
