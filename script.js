// Sample wallpaper data - In a real application, this would come from a database
const wallpapers = [
    {
        id: 1,
        title: "Solitary Oak at Sunset",
        description: "A majestic oak tree standing alone in a golden field during the magical golden hour, with warm sunset colors painting the sky",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        downloads: 0
    },
    {
        id: 2,
        title: "Evening Meadow Serenity",
        description: "Peaceful countryside scene with a lone tree silhouetted against a soft pastel evening sky, capturing the tranquil beauty of rural landscapes",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        downloads: 0
    },
    {
        id: 3,
        title: "Coastal Grasslands",
        description: "Wild coastal grasses swaying in the breeze with a dreamy, soft-focused background creating an ethereal natural landscape",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)",
        downloads: 0
    }
];

// Global variables
let selectedWallpaper = null;
let downloadData = JSON.parse(localStorage.getItem('downloadData')) || [];

// DOM elements
const galleryGrid = document.getElementById('galleryGrid');
const emailModal = document.getElementById('emailModal');
const successModal = document.getElementById('successModal');
const previewModal = document.getElementById('previewModal');
const emailForm = document.getElementById('emailForm');
const userEmailInput = document.getElementById('userEmail');
const selectedWallpaperDiv = document.getElementById('selectedWallpaper');
const closeBtn = document.querySelector('.close');
const closeSuccessBtn = document.querySelector('.close-success');
const previewCloseBtn = document.querySelector('.preview-close');
const successCloseBtn = document.querySelector('.success-close');
const instantDownloadBtn = document.getElementById('instantDownloadBtn');
const previewDownloadBtn = document.getElementById('previewDownloadBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadWallpapers();
    setupEventListeners();
    setupSmoothScrolling();
    setupHeaderScroll();
});

// Load wallpapers into the gallery
function loadWallpapers() {
    galleryGrid.innerHTML = '';
    
    wallpapers.forEach(wallpaper => {
        const wallpaperElement = createWallpaperElement(wallpaper);
        galleryGrid.appendChild(wallpaperElement);
    });
    
    // Add animation delay to each item
    const items = galleryGrid.querySelectorAll('.wallpaper-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
}

// Create wallpaper element
function createWallpaperElement(wallpaper) {
    const wallpaperDiv = document.createElement('div');
    wallpaperDiv.className = 'wallpaper-item';
    wallpaperDiv.innerHTML = `
        <div class="wallpaper-preview" style="background: ${wallpaper.gradient};"></div>
        <div class="wallpaper-info">
            <h3>${wallpaper.title}</h3>
            <p>${wallpaper.description}</p>
            <div class="wallpaper-meta">
                <span class="resolution">${wallpaper.resolution}</span>
                <span class="category">${wallpaper.category}</span>
            </div>
            <div class="wallpaper-actions">
                <button class="preview-btn" onclick="openPreviewModal(${wallpaper.id})">
                    <i class="fas fa-eye"></i>
                    Preview
                </button>
                <button class="download-btn" onclick="openEmailModal(${wallpaper.id})">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
        </div>
    `;
    
    return wallpaperDiv;
}

// Open preview modal
function openPreviewModal(wallpaperId) {
    selectedWallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (selectedWallpaper) {
        // Set wallpaper background for all device previews
        document.getElementById('desktopScreen').style.background = selectedWallpaper.gradient;
        document.getElementById('laptopScreen').style.background = selectedWallpaper.gradient;
        document.getElementById('mobileScreen').style.background = selectedWallpaper.gradient;
        
        previewModal.style.display = 'block';
        
        // Reset to desktop view
        document.querySelectorAll('.device-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.device-frame').forEach(frame => frame.classList.remove('active'));
        document.querySelector('[data-device="desktop"]').classList.add('active');
        document.getElementById('desktopFrame').classList.add('active');
    }
}

// Close preview modal
function closePreviewModal() {
    previewModal.style.display = 'none';
    selectedWallpaper = null;
}

// Open email modal
function openEmailModal(wallpaperId) {
    selectedWallpaper = wallpapers.find(w => w.id === wallpaperId);
    
    if (selectedWallpaper) {
        selectedWallpaperDiv.innerHTML = `
            <div class="wallpaper-preview-small" style="background: ${selectedWallpaper.gradient};"></div>
            <div class="wallpaper-details">
                <h4>${selectedWallpaper.title}</h4>
                <p>${selectedWallpaper.resolution} • ${selectedWallpaper.category}</p>
            </div>
        `;
        
        emailModal.style.display = 'block';
        userEmailInput.focus();
    }
}

// Close email modal
function closeEmailModal() {
    emailModal.style.display = 'none';
    userEmailInput.value = '';
    selectedWallpaper = null;
}

// Handle email form submission
function handleEmailSubmission(event) {
    event.preventDefault();
    
    const email = userEmailInput.value.trim();
    
    if (!email || !selectedWallpaper) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate sending email (in real app, this would be an API call)
    const downloadRecord = {
        id: Date.now(),
        email: email,
        wallpaperId: selectedWallpaper.id,
        wallpaperTitle: selectedWallpaper.title,
        timestamp: new Date().toISOString(),
        downloadLink: generateDownloadLink(selectedWallpaper.id)
    };
    
    // Store download data
    downloadData.push(downloadRecord);
    localStorage.setItem('downloadData', JSON.stringify(downloadData));
    
    // Update download count
    selectedWallpaper.downloads++;
    
    // Simulate email sending delay
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeEmailModal();
        showSuccessModal(email, downloadLink);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Generate download link
function generateDownloadLink(wallpaperId) {
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    return `${baseUrl}download.html?id=${wallpaperId}&token=${btoa(Date.now().toString())}`;
}

// Show success modal
function showSuccessModal(email, downloadLink) {
    userEmailDisplay.textContent = email;
    
    // Set up instant download
    instantDownloadBtn.onclick = () => {
        triggerDownload(downloadLink);
    };
    
    successModal.style.display = 'block';
}

// Close success modal
function closeSuccessModal() {
    successModal.style.display = 'none';
}

// Trigger download
function triggerDownload(downloadLink) {
    if (selectedWallpaper) {
        // Mark as downloaded
        selectedWallpaper.downloads++;
        
        // Update download data
        const downloadEntry = downloadData.find(entry => 
            entry.wallpaperId === selectedWallpaper.id && !entry.downloaded
        );
        if (downloadEntry) {
            downloadEntry.downloaded = true;
            downloadEntry.downloadedAt = new Date().toISOString();
            localStorage.setItem('downloadData', JSON.stringify(downloadData));
        }
        
        // Open download link
        window.open(downloadLink, '_blank');
    }
}

// Switch device preview
function switchDevicePreview(device) {
    // Remove active class from all tabs and frames
    document.querySelectorAll('.device-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.device-frame').forEach(frame => frame.classList.remove('active'));
    
    // Add active class to selected tab and frame
    document.querySelector(`[data-device="${device}"]`).classList.add('active');
    document.getElementById(`${device}Frame`).classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Email form submission
    emailForm.addEventListener('submit', handleEmailSubmission);
    
    // Modal close buttons
    closeBtn.addEventListener('click', closeEmailModal);
    closeSuccessBtn.addEventListener('click', closeSuccessModal);
    previewCloseBtn.addEventListener('click', closePreviewModal);
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === emailModal) {
            closeEmailModal();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
        if (event.target === previewModal) {
            closePreviewModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEmailModal();
            closeSuccessModal();
            closePreviewModal();
        }
    });
    
    // Device preview tabs
    document.querySelectorAll('.device-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const device = tab.getAttribute('data-device');
            switchDevicePreview(device);
        });
    });
    
    // Preview download button
    previewDownloadBtn.addEventListener('click', () => {
        if (selectedWallpaper) {
            closePreviewModal();
            openEmailModal(selectedWallpaper.id);
        }
    });
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup header scroll effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.wallpaper-item, .section-title, .about-content');
    animateElements.forEach(el => observer.observe(el));
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.openEmailModal = openEmailModal;
window.downloadData = downloadData;
window.wallpapers = wallpapers;