// ===== DOM 요소 선택 =====
const bgmToggle = document.getElementById('bgmToggle');
const bgm = document.getElementById('bgm');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// ===== 배경음악 토글 =====
let isPlaying = false;

bgmToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgm.pause();
        bgmToggle.classList.remove('playing');
        isPlaying = false;
    } else {
        bgm.play().catch(err => {
            console.log('음악 재생 실패:', err);
        });
        bgmToggle.classList.add('playing');
        isPlaying = true;
    }
});

// ===== 햄버거 메뉴 =====
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// 사이드바 링크 클릭 시 메뉴 닫기
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeSidebar();
    });
});

// ESC 키로 사이드바 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        }
        if (lightbox.classList.contains('active')) {
            closeLightbox();
        }
    }
});

// ===== 갤러리 라이트박스 =====
const galleryImages = document.querySelectorAll('.gallery-item img, .nsfw-img');
let currentImageIndex = 0;
let allImages = [];

// 모든 갤러리 이미지 수집
galleryImages.forEach((img, index) => {
    allImages.push(img.src);
    img.addEventListener('click', () => {
        openLightbox(index);
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = allImages[currentImageIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex];
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

// 라이트박스 배경 클릭 시 닫기
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// 키보드 방향키로 이미지 탐색
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// ===== 스크롤 애니메이션 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 애니메이션 대상 요소 설정
const animateElements = document.querySelectorAll('.section');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ===== 헤더 스크롤 효과 =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(13, 13, 13, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(13, 13, 13, 0.95)';
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== 부드러운 스크롤 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 성격 통계 바 애니메이션 =====
const statBars = document.querySelectorAll('.stat-fill');
const statsSection = document.querySelector('.personality-stats');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== 이미지 레이지 로딩 에러 처리 =====
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', function() {
        console.log('이미지 로드 실패:', this.src);
        this.style.display = 'none';
    });
});

// ===== 모바일 터치 스와이프 (라이트박스) =====
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 왼쪽으로 스와이프 (다음 이미지)
            showNextImage();
        } else {
            // 오른쪽으로 스와이프 (이전 이미지)
            showPrevImage();
        }
    }
}

// ===== 페이지 로드 완료 =====
window.addEventListener('load', () => {
    console.log('강한결 캐릭터 사이트 로드 완료');
    
    // 모든 이미지 로드 확인
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    console.log('모든 이미지 로드 완료');
                }
            });
        }
    });
});

// ===== 디버그 정보 (개발용) =====
console.log('🥊 강한결 캐릭터 프로필 사이트');
console.log('총 이미지 수:', allImages.length);
console.log('현재 화면 크기:', window.innerWidth + 'x' + window.innerHeight);

// ===== 반응형 디버그 =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('화면 크기 변경:', window.innerWidth + 'x' + window.innerHeight);
        
        // 모바일에서 사이드바가 열려있으면 닫기
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    }, 250);
});
