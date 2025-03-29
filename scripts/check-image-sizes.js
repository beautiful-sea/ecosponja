const fs = require('fs');
const path = require('path');

const imgDirectory = path.join(process.cwd(), 'public', 'img');

// Função para converter bytes em tamanho legível
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Verificar tamanho das imagens
function checkImageSizes() {
  console.log('Verificando tamanhos das imagens...\n');
  console.log('ORIGINAL vs WEBP vs AVIF\n');
  
  // Obter todos os arquivos PNG
  const pngFiles = fs.readdirSync(imgDirectory)
    .filter(file => file.toLowerCase().endsWith('.png'));
  
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let totalAvifSize = 0;
  
  // Verificar tamanho de cada arquivo e suas versões otimizadas
  for (const file of pngFiles) {
    const originalPath = path.join(imgDirectory, file);
    const webpPath = path.join(imgDirectory, file.replace('.png', '.webp'));
    const avifPath = path.join(imgDirectory, file.replace('.png', '.avif'));
    
    if (fs.existsSync(originalPath)) {
      const originalSize = fs.statSync(originalPath).size;
      totalOriginalSize += originalSize;
      
      let webpSize = 0;
      if (fs.existsSync(webpPath)) {
        webpSize = fs.statSync(webpPath).size;
        totalWebpSize += webpSize;
      }
      
      let avifSize = 0;
      if (fs.existsSync(avifPath)) {
        avifSize = fs.statSync(avifPath).size;
        totalAvifSize += avifSize;
      }
      
      console.log(`${file}:`);
      console.log(`  Original: ${formatBytes(originalSize)}`);
      console.log(`  WebP:     ${webpSize ? formatBytes(webpSize) : 'N/A'} ${webpSize ? '(' + Math.round((originalSize - webpSize) / originalSize * 100) + '% redução)' : ''}`);
      console.log(`  AVIF:     ${avifSize ? formatBytes(avifSize) : 'N/A'} ${avifSize ? '(' + Math.round((originalSize - avifSize) / originalSize * 100) + '% redução)' : ''}`);
      console.log('');
    }
  }
  
  // Verificar JPEGs
  const jpegFiles = fs.readdirSync(imgDirectory)
    .filter(file => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'));
  
  for (const file of jpegFiles) {
    const originalPath = path.join(imgDirectory, file);
    
    // Nome limpo para WebP
    let cleanName = file.replace(/Generated Image.*?\d_\d\dAM/, 'background');
    cleanName = cleanName.replace(/\(\d+\)/, '');
    cleanName = cleanName.replace(/\.jpeg$|\.jpg$/i, '').trim();
    
    const webpPath = path.join(imgDirectory, `${cleanName}.webp`);
    
    if (fs.existsSync(originalPath)) {
      const originalSize = fs.statSync(originalPath).size;
      totalOriginalSize += originalSize;
      
      let webpSize = 0;
      if (fs.existsSync(webpPath)) {
        webpSize = fs.statSync(webpPath).size;
        totalWebpSize += webpSize;
      }
      
      console.log(`${file}:`);
      console.log(`  Original: ${formatBytes(originalSize)}`);
      console.log(`  WebP:     ${webpSize ? formatBytes(webpSize) : 'N/A'} ${webpSize ? '(' + Math.round((originalSize - webpSize) / originalSize * 100) + '% redução)' : ''}`);
      console.log('');
    }
  }
  
  // Resumo total
  console.log('RESUMO TOTAL:');
  console.log(`  Tamanho original:    ${formatBytes(totalOriginalSize)}`);
  console.log(`  Tamanho WebP:        ${formatBytes(totalWebpSize)} (${Math.round((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100)}% redução)`);
  if (totalAvifSize > 0) {
    console.log(`  Tamanho AVIF:        ${formatBytes(totalAvifSize)} (${Math.round((totalOriginalSize - totalAvifSize) / totalOriginalSize * 100)}% redução)`);
  }
  console.log(`\nEconomia total:        ${formatBytes(totalOriginalSize - totalWebpSize)} usando WebP`);
  if (totalAvifSize > 0) {
    console.log(`Economia total:        ${formatBytes(totalOriginalSize - totalAvifSize)} usando AVIF`);
  }
}

// Executar a função
checkImageSizes(); 