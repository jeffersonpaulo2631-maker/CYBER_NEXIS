document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '🌙 Dark Mode';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '20px';
    toggleBtn.style.right = '20px';
    toggleBtn.style.padding = '10px';
    toggleBtn.style.background = '#007bff';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.cursor = 'pointer';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    // Carrossel Automático
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 4000);

    // Busca Dinâmica
    const searchInput = document.getElementById('searchInput');
    const newsCards = document.querySelectorAll('.news-card');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        newsCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });
});