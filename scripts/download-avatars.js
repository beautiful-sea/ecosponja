const https = require('https');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// URLs de avatares para download
const avatarUrls = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg'
];

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Baixando ${url} para ${outputPath}`);
    
    const file = fs.createWriteStream(outputPath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
        console.log(`Download concluído: ${outputPath}`);
      });
    }).on('error', err => {
      fs.unlink(outputPath, () => {}); // Limpar o arquivo em caso de erro
      reject(err);
    });
  });
}

async function downloadAvatars() {
  try {
    await Promise.all([
      downloadFile(avatarUrls[0], path.join(assetsDir, 'avatar1.jpg')),
      downloadFile(avatarUrls[1], path.join(assetsDir, 'avatar2.jpg')),
      downloadFile(avatarUrls[2], path.join(assetsDir, 'avatar3.jpg'))
    ]);
    console.log('Todos os downloads concluídos com sucesso!');
  } catch (error) {
    console.error('Erro ao baixar avatares:', error);
  }
}

downloadAvatars(); 