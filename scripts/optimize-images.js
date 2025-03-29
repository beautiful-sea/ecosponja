const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDirectory = path.join(process.cwd(), 'public', 'img');
const outputDirectory = path.join(process.cwd(), 'public', 'img');

// Criar diretório testimonials se não existir
const testimonialsDir = path.join(outputDirectory, 'testimonials');
if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir, { recursive: true });
}

// Otimizar imagens PNG e JPEG para WebP
async function optimizeImages() {
  console.log('Iniciando otimização de imagens...');
  
  try {
    // Lista de arquivos principais a serem otimizados
    const mainImages = [
      'esponjaetexto.png',
      'esponja1.png',
      'bacterias.png',
      'comparativo_durabilidade.png',
      'logo.png'
    ];

    // Criar avatares para testemunhos (em WebP)
    await Promise.all([
      sharp(path.join(__dirname, '../assets/avatar1.jpg'))
        .resize(96, 96)
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user1.webp')),
      
      sharp(path.join(__dirname, '../assets/avatar2.jpg'))
        .resize(96, 96)
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user2.webp')),
      
      sharp(path.join(__dirname, '../assets/avatar3.jpg'))
        .resize(96, 96)
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user3.webp'))
    ]).catch(err => {
      console.log('Aviso: Não foi possível criar avatares. Certifique-se de que a pasta assets existe com as imagens necessárias.');
      console.log('Criando avatares vazios como fallback...');
      
      // Criar avatares de fallback com cores sólidas
      return Promise.all([
        sharp({
          create: {
            width: 96,
            height: 96,
            channels: 4,
            background: { r: 100, g: 150, b: 200, alpha: 1 }
          }
        })
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user1.webp')),
        
        sharp({
          create: {
            width: 96,
            height: 96,
            channels: 4,
            background: { r: 150, g: 100, b: 200, alpha: 1 }
          }
        })
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user2.webp')),
        
        sharp({
          create: {
            width: 96,
            height: 96,
            channels: 4,
            background: { r: 200, g: 100, b: 150, alpha: 1 }
          }
        })
        .webp({ quality: 80 })
        .toFile(path.join(testimonialsDir, 'user3.webp'))
      ]);
    });

    // Processar as imagens principais
    for (const file of mainImages) {
      const inputPath = path.join(imgDirectory, file);
      
      if (!fs.existsSync(inputPath)) {
        console.log(`Aviso: Arquivo ${file} não encontrado`);
        continue;
      }
      
      console.log(`Otimizando: ${file}`);
      
      const webpOutputPath = path.join(outputDirectory, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      const avifOutputPath = path.join(outputDirectory, file.replace(/\.(png|jpg|jpeg)$/i, '.avif'));
      
      // Converter para WebP (melhor suporte nos navegadores)
      await sharp(inputPath)
        .webp({ quality: 80, nearLossless: true })
        .toFile(webpOutputPath);
      
      // Converter para AVIF (melhor compressão, suporte em navegadores mais recentes)
      try {
        await sharp(inputPath)
          .avif({ quality: 65 })
          .toFile(avifOutputPath);
      } catch (avifError) {
        console.log(`Aviso: Não foi possível converter ${file} para AVIF. Continuando apenas com WebP.`);
      }
    }

    // Processar imagens JPEG (geradas)
    const jpegFiles = fs.readdirSync(imgDirectory)
      .filter(file => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'));
    
    for (const file of jpegFiles) {
      const inputPath = path.join(imgDirectory, file);
      console.log(`Otimizando JPEG: ${file}`);
      
      // Nome mais limpo para o arquivo WebP
      let cleanName = file.replace(/Generated Image.*?\d_\d\dAM/, 'background');
      cleanName = cleanName.replace(/\(\d+\)/, '');
      cleanName = cleanName.replace(/\.jpeg$|\.jpg$/i, '').trim();
      
      const webpOutputPath = path.join(outputDirectory, `${cleanName}.webp`);
      
      // Converter para WebP
      await sharp(inputPath)
        .webp({ quality: 75 })
        .toFile(webpOutputPath);
    }

    console.log('Otimização de imagens concluída com sucesso!');
    console.log('Não esqueça de atualizar as referências de imagem no código para usar os formatos .webp');
  } catch (error) {
    console.error('Erro durante a otimização de imagens:', error);
  }
}

// Executar a função principal
optimizeImages(); 