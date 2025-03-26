document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o contador regressivo
    startCountdown();
    
    // Inicializa o FAQ
    initFAQ();
    
    // Inicializa vídeo placeholder
    initVideoPlaceholder();
    
    // Animar elementos ao rolar a página
    initScrollAnimations();

    // Suavizar a rolagem para links de âncora
    initSmoothScroll();
});

// Contador regressivo
function startCountdown() {
    // Define a data final (48 horas a partir de agora)
    const now = new Date();
    const endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    function updateCountdown() {
        const currentDate = new Date();
        const totalSeconds = Math.floor((endDate - currentDate) / 1000);
        
        if (totalSeconds <= 0) {
            // Redefine o contador para mais 48 horas quando chegar a zero
            endDate.setTime(currentDate.getTime() + 48 * 60 * 60 * 1000);
            updateCountdown();
            return;
        }
        
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
    
    // Atualiza a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Inicializar FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Esconde todas as respostas inicialmente
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            // Verifica se este item está ativo
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.display = 'none';
            });
            
            // Se o item clicado não estava ativo, abre-o
            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });
}

// Inicializar Vídeo Placeholder
function initVideoPlaceholder() {
    const videoContainer = document.querySelector('.video-container');
    
    if (videoContainer) {
        videoContainer.addEventListener('click', function() {
            const videoUrl = 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1'; // Substitua VIDEO_ID pelo ID do vídeo
            
            // Cria o iframe
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', videoUrl);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.borderRadius = '12px';
            
            // Substitui o conteúdo do contêiner pelo iframe
            videoContainer.innerHTML = '';
            videoContainer.style.paddingBottom = '56.25%'; // Proporção 16:9
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(iframe);
        });
    }
}

// Animações ao rolar
function initScrollAnimations() {
    const elements = document.querySelectorAll('.benefit-card, .problem-card, .testimonial-card, .step, .faq-item');
    
    // Função para verificar se um elemento está visível na janela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Função para adicionar a classe de animação
    function checkVisibility() {
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configura os elementos inicialmente
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Verifica visibilidade no carregamento e ao rolar
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
}

// Scroll suave para links de âncora
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return; // Ignora links vazios
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para o cabeçalho fixo, se necessário
                    behavior: 'smooth'
                });
            }
        });
    });
} 