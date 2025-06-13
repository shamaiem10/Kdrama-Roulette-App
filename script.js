const btn = document.getElementById('spinButton');
const resultCard = document.getElementById('result');
const genreSelect = document.getElementById('genreSelect');
const moodSelect = document.getElementById('moodSelect');

const todayCard = document.getElementById('todaysPick');
const todayTitle = document.getElementById('todayTitle');
const todayGenre = document.getElementById('todayGenre');
const todayDescription = document.getElementById('todayDescription');
const todayTrailer = document.getElementById('todayTrailer');

const titleEl = document.getElementById('dramaTitle');
const genreEl = document.getElementById('dramaGenre');
const descEl = document.getElementById('dramaDescription');
const trailerEl = document.getElementById('dramaTrailer');

const moodModal = document.getElementById('moodModal');
const yesMoodBtn = document.getElementById('yesMoodBtn');
const noMoodBtn = document.getElementById('noMoodBtn');

let dramas = [];

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function showTodaysPick() {
  const todayKey = getTodayKey();
  const saved = localStorage.getItem('todaysDrama');

  if (saved) {
    const drama = JSON.parse(saved);
    displayTodaysDrama(drama);
  } else {
    const random = dramas[Math.floor(Math.random() * dramas.length)];
    localStorage.setItem('todaysDrama', JSON.stringify(random));
    displayTodaysDrama(random);
  }
}

function displayTodaysDrama(drama) {
  todayTitle.textContent = drama.Name;
  todayGenre.textContent = drama.Genre;
  todayDescription.textContent = drama.Synopsis;
  todayTrailer.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(drama.Name)}+trailer`;
}

fetch('kdramas.json')
  .then(response => response.json())
  .then(data => {
    dramas = data;

    showTodaysPick();

    const genreSet = new Set();
    dramas.forEach(d => {
      if (d.Genre) {
        d.Genre.split(',').forEach(g => genreSet.add(g.trim()));
      }
    });

    genreSet.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });

    // Show mood modal
    moodModal.style.display = 'flex';
  });

yesMoodBtn.addEventListener('click', () => {
  moodModal.style.display = 'none';
  moodSelect.classList.remove('hidden');
  genreSelect.classList.add('hidden');
});

noMoodBtn.addEventListener('click', () => {
  moodModal.style.display = 'none';
  genreSelect.classList.remove('hidden');
  moodSelect.classList.add('hidden');
});

btn.addEventListener('click', () => {
  let filtered = [];

  if (!moodSelect.classList.contains('hidden')) {
    const selectedMood = moodSelect.value;
    if (!selectedMood) {
      alert("Please select a mood!");
      return;
    }

    // Mood filtering rules
    const moodMap = {
      'light-funny': ['Comedy', 'Romance', 'Slice of Life'],
      'plot-twists': ['Thriller', 'Mystery', 'Psychological'],
      'heartwarming': ['Family', 'Friendship', 'Romance'],
      'sad-tearjerker': ['Melodrama', 'Tragedy', 'Slice of Life'],
      'action': ['Action', 'Crime', 'Adventure']
    };

    filtered = dramas.filter(d =>
      d.Genre &&
      moodMap[selectedMood].some(moodGenre =>
        d.Genre.toLowerCase().includes(moodGenre.toLowerCase())
      )
    );
  } else {
    const selectedGenre = genreSelect.value;
    if (!selectedGenre) {
      alert("Please select a genre first!");
      return;
    }
    filtered = dramas.filter(d => d.Genre && d.Genre.includes(selectedGenre));
  }

  if (filtered.length === 0) {
    alert("No dramas found for your choice!");
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  titleEl.textContent = random.Name;
  genreEl.textContent = random.Genre;
  descEl.textContent = random.Synopsis;
  trailerEl.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(random.Name)}+trailer`;

  resultCard.classList.remove('hidden');

  if (todayCard) {
    todayCard.remove();
  }
});
