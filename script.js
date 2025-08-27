// Smooth scroll function for the Add Review button
function scrollToDownloads() {
    const downloadsSection = document.getElementById('downloads');
    
    if (downloadsSection) {
        downloadsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add smooth scrolling behavior to all internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add some interactive effects
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle animation effect
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // You can add additional functionality here later
            console.log('Download button clicked:', this.classList.contains('app-store') ? 'App Store' : 'Google Play');
        });
    });
    
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards for animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
