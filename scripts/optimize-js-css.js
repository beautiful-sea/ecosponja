const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');

// Diretórios para JavaScript e CSS
const jsDirectory = path.join(process.cwd(), 'public');
const cssDirectory = path.join(process.cwd(), 'src', 'app');

// Função para otimizar JavaScript
async function optimizeJavaScript() {
  console.log('Iniciando otimização de JavaScript...');
  
  try {
    // Lista de arquivos JS a otimizar
    const jsFiles = fs.readdirSync(jsDirectory)
      .filter(file => file.endsWith('.js') && !file.endsWith('.min.js'));
    
    for (const file of jsFiles) {
      const filePath = path.join(jsDirectory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Minificar o código
      const result = UglifyJS.minify(content, {
        compress: {
          drop_console: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2,
        },
        mangle: true
      });
      
      if (result.error) {
        console.error(`Erro ao minificar ${file}:`, result.error);
        continue;
      }
      
      // Salvar versão minificada
      const minFilePath = path.join(jsDirectory, file.replace('.js', '.min.js'));
      fs.writeFileSync(minFilePath, result.code, 'utf8');
      
      // Obter estatísticas
      const originalSize = fs.statSync(filePath).size;
      const minifiedSize = result.code.length;
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      
      console.log(`${file}: ${formatSize(originalSize)} → ${formatSize(minifiedSize)} (${reduction}% redução)`);
    }
  } catch (error) {
    console.error('Erro durante a otimização de JavaScript:', error);
  }
}

// Função para otimizar CSS
async function optimizeCSS() {
  console.log('\nIniciando otimização de CSS...');
  
  try {
    // Buscar arquivos CSS recursivamente
    findFiles(cssDirectory, '.css').forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Minificar o CSS
      const minified = new CleanCSS({
        level: {
          1: {
            all: true,
          },
          2: {
            all: true,
            removeUnusedAtRules: true,
            restructureRules: true,
          }
        }
      }).minify(content);
      
      // Salvar versão minificada com extensão .min.css
      const minFilePath = filePath.replace('.css', '.min.css');
      fs.writeFileSync(minFilePath, minified.styles, 'utf8');
      
      // Estatísticas
      const originalSize = content.length;
      const minifiedSize = minified.styles.length;
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      
      console.log(`${path.basename(filePath)}: ${formatSize(originalSize)} → ${formatSize(minifiedSize)} (${reduction}% redução)`);
    });
  } catch (error) {
    console.error('Erro durante a otimização de CSS:', error);
  }
}

// Função para formatar tamanho em bytes
function formatSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

// Função para encontrar arquivos recursivamente
function findFiles(directory, extension) {
  let results = [];
  
  if (!fs.existsSync(directory)) {
    return results;
  }
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Função principal
async function main() {
  try {
    console.log('Verificando dependências...');
    
    // Verificar se as dependências estão instaladas
    try {
      require('uglify-js');
      require('clean-css');
    } catch (error) {
      console.log('Instalando dependências necessárias...');
      console.log('Execute: npm install uglify-js clean-css --save-dev');
      process.exit(1);
    }
    
    // Executar otimizações
    await optimizeJavaScript();
    await optimizeCSS();
    
    console.log('\nOtimização concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante o processo de otimização:', error);
  }
}

// Executar função principal
main(); 