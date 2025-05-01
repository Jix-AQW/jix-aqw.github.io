document.addEventListener('DOMContentLoaded', () => {
    fetch('games.json')
      .then(response => response.json())
      .then(data => {
        const main = document.getElementById('main-content');
        const featuredGames = data.games.filter(game => game.featured);
  
        const carouselHTML = `
          <div class="carousel-container">
            <div class="carousel-inner">
              ${featuredGames.map((game, index) => `
                <div class="carousel-item" style="background-image: url('${game.cover}')">
                  <div class="carousel-media-box">
                    ${game.trailer_url ? `
                      <iframe class="carousel-media" 
                        src="${game.trailer_url.replace('watch?v=', 'embed/')}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; encrypted-media; gyroscope" 
                        allowfullscreen>
                      </iframe>
                    ` : `<img class="carousel-media" src="${game.cover}" alt="${game.title}">`}
                  </div>
                  <div class="featured-content">
                    <h1 class="featured-title">${game.title}</h1>
                    <div class="featured-year">${game.year}</div>
                    <p>${game.description}</p>
                    <a href="${game.play_url}" class="play-button">
                      <span class="material-icons">play_arrow</span> Play Now
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="carousel-controls"></div>
          </div>`;
  
        main.innerHTML = carouselHTML;
  
        const items = document.querySelectorAll('.carousel-item');
        const controls = document.querySelector('.carousel-controls');
        let currentIndex = 0;
        let autoRotateInterval;
  
        featuredGames.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
          dot.addEventListener('click', () => {
            clearInterval(autoRotateInterval);
            slideTo(index);
            startAutoRotate();
          });
          controls.appendChild(dot);
        });
  
        const inner = document.querySelector('.carousel-inner');
  
        const slideTo = (index) => {
          currentIndex = (index + items.length) % items.length;
          inner.style.transform = `translateX(-${currentIndex * 100}%)`;
          document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
          });
        };
  
        const startAutoRotate = () => {
          autoRotateInterval = setInterval(() => {
            slideTo(currentIndex + 1);
          }, 6000);
        };
  
        startAutoRotate();
  
        const gamesHTML = `
          <div class="games-grid">
            <h2 class="grid-title">All Games</h2>
            <div class="games-container">
              ${data.games.map(game => `
                <div class="game-card">
                  <a href="${game.play_url}" class="game-cover-link" aria-label="Play ${game.title}">
                    <img src="${game.cover}" alt="${game.title}" class="game-cover">
                    <div class="game-cover-overlay"></div>
                  </a>
                  <div class="game-info">
                    <div class="game-title">${game.title}</div>
                    <div class="game-year">${game.year}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>`;
  
        main.innerHTML += gamesHTML;
  
        let touchStartX = 0;
        let touchEndX = 0;
  
        document.querySelector('.carousel-container').addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
        });
  
        document.querySelector('.carousel-container').addEventListener('touchend', e => {
          touchEndX = e.changedTouches[0].screenX;
          if (touchStartX - touchEndX > 50) slideTo(currentIndex + 1);
          if (touchEndX - touchStartX > 50) slideTo(currentIndex - 1);
        });
      });
  });
  