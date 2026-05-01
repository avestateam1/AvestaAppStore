// --- متغیرهای سراسری برای اپلیکیشن اصلی ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const onboardingSection = document.getElementById('onboarding-section');
const storeSection = document.getElementById('store-section');
const categoryModal = document.getElementById('categoryModal');
const modalTitle = document.getElementById('modal-title');
const modalOptionsContainer = document.getElementById('modal-options-container');
const offlineGamesSection = document.getElementById('offline-games-section');
const onlineGamesSection = document.getElementById('online-games-section');
const settingsSection = document.getElementById('settings-section');
const gamePlayerModal = document.getElementById('game-player-modal');
const gameArea = document.getElementById('game-area');
const gameTitle = document.getElementById('game-title');
const mobileControls = document.getElementById('mobile-controls');

// متغیرهای بازی مار
let snakeInterval;
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let canvas, ctx;

// تم‌های رنگی مختلف برای تنظیمات
const themes = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // بنفش آبی
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // صورتی
    'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', // بنفش تیره
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // سبز نعنایی
    'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)'  // قرمز-آبی
];
let currentThemeIndex = 0;

// --- بررسی وضعیت بازدید قبلی ---
window.addEventListener('DOMContentLoaded', () => {
    const hasVisited = localStorage.getItem('avesta_visited');
    
    if (!hasVisited) {
        initSlider();
    } else {
        showStore();
    }
});

// --- منطق اسلایدر خوش‌آمدگویی ---
function initSlider() {
    updateSlidePosition();
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlidePosition();
        } else {
            completeOnboarding();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlidePosition();
        }
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlidePosition();
        });
    });
}

function updateSlidePosition() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active-slide', 'prev-slide');
        if (index === currentSlide) {
            slide.classList.add('active-slide');
        } else if (index < currentSlide) {
            slide.classList.add('prev-slide');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active-dot', index === currentSlide);
    });

    if (currentSlide === slides.length - 1) {
        nextBtn.innerText = "ورود به فروشگاه";
    } else {
        nextBtn.innerText = "بعدی";
    }
}

function completeOnboarding() {
    localStorage.setItem('avesta_visited', 'true');
    showStore();
}

function showStore() {
    onboardingSection.classList.remove('active');
    setTimeout(() => {
        storeSection.classList.add('active');
    }, 100);
}

// --- مدیریت منوها و مدال‌ها ---
function openMenu(type) {
    modalTitle.innerText = type === 'avesta' ? 'انتخاب سرویس' : 'نوع بازی';
    modalOptionsContainer.innerHTML = ''; 

    if (type === 'avesta') {
        createModalButton('LsMusic', 'play', true, () => launchApp('LsMusic'));
        createModalButton('VaProfile', 'clock', false, null);
        createModalButton('OpOnlineVisit', 'clock', false, null);
    } else if (type === 'game') {
        createModalButton('PC', 'desktop', true, () => openPlatformChoice());
        createModalButton('Mobile', 'mobile', true, () => openPlatformChoice());
    }

    categoryModal.classList.add('active');
}

function createModalButton(text, iconClass, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = `modal-btn ${isActive ? 'btn-active' : 'btn-disabled'}`;
    if (!isActive) btn.disabled = true;
    
    btn.innerHTML = `<span>${text}</span><i class="fas fa-${iconClass}"></i>`;
    
    if (isActive && onClick) {
        btn.onclick = () => {
            closeModal();
            onClick();
        };
    }
    
    modalOptionsContainer.appendChild(btn);
}

function closeModal() {
    categoryModal.classList.remove('active');
}

// --- مدیریت صفحات ---
function openPlatformChoice() {
    modalTitle.innerText = 'حالت بازی';
    modalOptionsContainer.innerHTML = '';

    createModalButton('آفلاین', 'wifi', true, () => {
        showPage(offlineGamesSection);
    });
    createModalButton('آنلاین', 'globe', true, () => {
        showPage(onlineGamesSection);
    });
    
    categoryModal.classList.add('active');
}

function showPage(pageElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    pageElement.classList.add('active');
}

// دکمه‌های بازگشت
document.getElementById('back-to-categories').addEventListener('click', () => {
    showPage(storeSection);
});

document.getElementById('back-to-categories-2').addEventListener('click', () => {
    showPage(storeSection);
});

document.getElementById('back-to-store').addEventListener('click', () => {
    showPage(storeSection);
});

// --- اجرای برنامه‌ها ---
function launchApp(appName) {
    alert(`در حال اجرای ${appName}...`);
}

// --- مدیریت بازی‌ها ---
function launchGame(gameType) {
    gamePlayerModal.classList.add('active');
    gameArea.innerHTML = ''; 
    mobileControls.style.display = 'none'; // مخفی کردن کنترلر موبایل پیش‌فرض

    if (gameType === 'snake') {
        gameTitle.innerText = 'Snake Classic';
        mobileControls.style.display = 'flex';
        startSnakeGame();
    } else if (gameType === 'memory') {
        gameTitle.innerText = 'Memory Match';
        startMemoryGame();
    } else if (gameType === 'tictactoe') {
        gameTitle.innerText = 'بازی دوز';
        startTicTacToe();
    } else if (gameType === 'guessnumber') {
        gameTitle.innerText = 'حدس عدد';
        startGuessNumber();
    }
}

function closeGame() {
    gamePlayerModal.classList.remove('active');
    gameArea.innerHTML = '';
    clearInterval(snakeInterval); // توقف بازی مار اگر در حال اجراست
}

// --- منطق بازی مار (Snake) ---
function startSnakeGame() {
    // ایجاد بوم نقاشی
    canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    ctx = canvas.getContext('2d');
    gameArea.appendChild(canvas);

    // ریست کردن متغیرها
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15};
    direction = 'right';
    score = 0;

    // حلقه بازی
    snakeInterval = setInterval(updateSnake, 150);
}

function updateSnake() {
    const head = {...snake[0]};

    if (direction === 'right') head.x++;
    else if (direction === 'left') head.x--;
    else if (direction === 'up') head.y--;
    else if (direction === 'down') head.y++;

    // برخورد با دیوار
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        gameOver();
        return;
    }

    // برخورد با خود
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // خوردن غذا
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    // پاک کردن صفحه
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم غذا
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * 15, food.y * 15, 14, 14);

    // رسم مار
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 15, segment.y * 15, 14, 14);
    });
    
    // نمایش امتیاز
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 5, 20);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
    // مطمئن شویم غذا روی بدن مار نیفتد
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            placeFood();
            break;
        }
    }
}

function changeDirection(newDir) {
    // جلوگیری از برگشت مستقیم
    if (newDir === 'left' && direction !== 'right') direction = 'left';
    if (newDir === 'right' && direction !== 'left') direction = 'right';
    if (newDir === 'up' && direction !== 'down') direction = 'up';
    if (newDir === 'down' && direction !== 'up') direction = 'down';
}

// پشتیبانی از کیبورد
document.addEventListener('keydown', (e) => {
    if (!gamePlayerModal.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') changeDirection('left');
    if (e.key === 'ArrowRight') changeDirection('right');
    if (e.key === 'ArrowUp') changeDirection('up');
    if (e.key === 'ArrowDown') changeDirection('down');
});

function gameOver() {
    clearInterval(snakeInterval);
    alert(`بازی تمام شد! امتیاز شما: ${score}`);
    closeGame();
}

// --- منطق بازی حافظه (Memory) ---
function startMemoryGame() {
    const icons = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍋', '🍍', '🥝'];
    let cards = [...icons, ...icons]; // دو ست از هر کارت
    cards.sort(() => Math.random() - 0.5); // بر زدن

    const grid = document.createElement('div');
    grid.className = 'memory-grid';

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    cards.forEach(icon => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.icon = icon;
        card.innerText = icon; // آیکون را ذخیره می‌کنیم اما با CSS مخفی می‌شود

        card.addEventListener('click', () => {
            if (lockBoard) return;
            if (card === firstCard) return;

            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card;
                return;
            }

            secondCard = card;
            checkForMatch();
        });

        grid.appendChild(card);
    });

    gameArea.appendChild(grid);

    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
}

// --- منطق بازی دوز (Tic Tac Toe) ---
function startTicTacToe() {
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const boardDiv = document.createElement('div');
    boardDiv.className = 'ttt-board';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(cell, i));
        boardDiv.appendChild(cell);
    }

    const statusDiv = document.createElement('div');
    statusDiv.style.color = 'white';
    statusDiv.style.marginTop = '10px';
    statusDiv.innerText = `نوبت بازیکن: ${currentPlayer}`;

    function handleCellClick(cell, index) {
        if (board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.style.color = currentPlayer === 'X' ? '#ff9966' : '#6dd5ed';

        if (checkWin()) {
            statusDiv.innerText = `بازیکن ${currentPlayer} برنده شد!`;
            gameActive = false;
        } else if (board.every(cell => cell !== '')) {
            statusDiv.innerText = 'بازی مساوی شد!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDiv.innerText = `نوبت بازیکن: ${currentPlayer}`;
        }
    }

    function checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(condition => {
            return condition.every(index => {
                return board[index] === currentPlayer;
            });
        });
    }

    gameArea.appendChild(boardDiv);
    gameArea.appendChild(statusDiv);
}

// --- منطق بازی حدس عدد (Guess Number) ---
function startGuessNumber() {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    const container = document.createElement('div');
    container.className = 'guess-game';
    container.style.textAlign = 'center';
    container.style.width = '100%';

    const title = document.createElement('h4');
    title.innerText = 'یک عدد بین ۱ تا ۱۰۰ انتخاب کن:';
    title.style.color = 'white';
    title.style.marginBottom = '10px';

    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'عدد...';

    const btn = document.createElement('button');
    btn.innerText = 'بررسی';
    btn.onclick = () => {
        const guess = parseInt(input.value);
        attempts++;
        if (isNaN(guess)) {
            msg.innerText = 'لطفاً یک عدد وارد کن!';
        } else if (guess === targetNumber) {
            msg.innerText = `تبریک! درست حدس زدی. تعداد تلاش: ${attempts}`;
            msg.style.color = '#00ff7f';
        } else if (guess < targetNumber) {
            msg.innerText = 'عدد بزرگتر است!';
            msg.style.color = '#ff9966';
        } else {
            msg.innerText = 'عدد کوچکتر است!';
            msg.style.color = '#ff9966';
        }
    };

    const msg = document.createElement('p');
    msg.className = 'guess-msg';
    msg.style.marginTop = '10px';
    msg.style.fontSize = '1.2rem';

    container.appendChild(title);
    container.appendChild(input);
    container.appendChild(btn);
    container.appendChild(msg);

    gameArea.appendChild(container);
}

// --- تنظیمات ---
function openSettings() {
    showPage(settingsSection);
}

function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.style.background = themes[currentThemeIndex];
    alert('تم رنگی تغییر کرد!');
}

function showAbout() {
    alert('Avesta App Store\nDeveloped by DeteX\nVersion 1.0.0');
}

// ==========================================
// --- بخش LsMusic Player (اگر در فایل جداگانه است) ---
// ==========================================

/* 
   توجه: اگر کدهای زیر را در همان فایل script.js بالا قرار دادید، ممکن است با متغیرهای بالا تداخل داشته باشد.
   بهتر است کدهای زیر را در یک فایل جداگانه برای پلیر استفاده کنید یا نام متغیرها را تغییر دهید.
   اما برای سادگی کار شما، اینجا کدهای پلیر را هم اضافه می‌کنم.
*/

const audioPlayer = document.getElementById('audio-player');
const grantAccessBtn = document.getElementById('grant-access-btn');
const permissionSection = document.getElementById('permission-section');
const playerSection = document.getElementById('player-section');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const coverArt = document.getElementById('cover-art');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtnMusic = document.getElementById('prev-btn'); // تغییر نام برای عدم تداخل
const nextBtnMusic = document.getElementById('next-btn'); // تغییر نام برای عدم تداخل
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeToggle = document.getElementById('volume-toggle');
const volumeModal = document.getElementById('volume-modal');

let allSongs = [];
let filteredSongs = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

if (grantAccessBtn) {
    window.addEventListener('DOMContentLoaded', () => {
        const hasAccess = localStorage.getItem('ls_music_access_granted');
        
        if (hasAccess === 'true') {
            showPlayer();
            loadLibrary();
        } else {
            permissionSection.classList.add('active');
        }
    });

    grantAccessBtn.addEventListener('click', async () => {
        try {
            const items = await window.showOpenFilePicker({
                types: [{
                    description: 'Audio Files',
                    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] },
                }],
                multiple: true
            });

            let loadedSongs = [];
            
            for (const fileHandle of items) {
                const file = await fileHandle.getFile();
                loadedSongs.push({
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    url: URL.createObjectURL(file),
                    artist: "ناشناس",
                    file: file
                });
            }

            if (loadedSongs.length > 0) {
                allSongs = loadedSongs;
                localStorage.setItem('ls_music_access_granted', 'true');
                localStorage.setItem('ls_songs_count', loadedSongs.length.toString());
                
                showPlayer();
                organizeArtists();
                switchTab('player');
                playSong();
            } else {
                alert("هیچ فایل صوتی انتخاب نشد.");
            }

        } catch (err) {
            console.error(err);
            alert("دسترسی رد شد یا مرورگر شما از این قابلیت پشتیبانی نمی‌کند.");
        }
    });

    function showPlayer() {
        permissionSection.classList.remove('active');
        setTimeout(() => {
            playerSection.classList.add('active');
        }, 100);
    }

    function organizeArtists() {
        const artistsMap = {};
        
        allSongs.forEach(song => {
            const artist = song.artist || "ناشناس";
            if (!artistsMap[artist]) {
                artistsMap[artist] = [];
            }
            artistsMap[artist].push(song);
        });

        renderArtistsList(artistsMap);
    }

    function renderArtistsList(artistsMap) {
        const container = document.getElementById('artists-list');
        if(!container) return;
        container.innerHTML = '';

        Object.keys(artistsMap).sort().forEach(artistNameKey => {
            const card = document.createElement('div');
            card.className = 'artist-card';
            card.innerHTML = `
                <div class="artist-avatar"><i class="fas fa-user"></i></div>
                <div class="artist-name">${artistNameKey}</div>
            `;
            
            card.addEventListener('click', () => {
                filteredSongs = artistsMap[artistNameKey];
                currentSongIndex = 0;
                loadSong(filteredSongs[currentSongIndex]);
                switchTab('player');
                playSong();
            });
            
            container.appendChild(card);
        });
    }

    function switchTab(tabName) {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        if (tabName === 'player') {
            tabs[0].classList.add('active');
            document.getElementById('tab-player').classList.add('active');
            filteredSongs = allSongs;
            updatePlaylistActiveState();
        } else {
            tabs[1].classList.add('active');
            document.getElementById('tab-artists').classList.add('active');
        }
    }

    function loadSong(song) {
        songTitle.innerText = song.title;
        artistName.innerText = song.artist;
        audioPlayer.src = song.url;
        updatePlaylistActiveState();
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        coverArt.classList.add('playing');
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        coverArt.classList.remove('playing');
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) pauseSong();
            else playSong();
        });
    }

    function nextSong() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * filteredSongs.length);
        } else {
            currentSongIndex++;
            if (currentSongIndex >= filteredSongs.length) currentSongIndex = 0;
        }
        loadSong(filteredSongs[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) currentSongIndex = filteredSongs.length - 1;
        loadSong(filteredSongs[currentSongIndex]);
        playSong();
    }

    if (nextBtnMusic) nextBtnMusic.addEventListener('click', nextSong);
    if (prevBtnMusic) prevBtnMusic.addEventListener('click', prevSong);

    audioPlayer.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent || 0;
        
        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        
        currentTimeEl.innerText = formatTime(currentTime);
        durationEl.innerText = formatTime(duration);
    });

    progressBar.addEventListener('input', () => {
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (progressBar.value / 100) * duration;
    });

    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    function updatePlaylistActiveState() {
        const recentList = document.getElementById('recent-list');
        if(!recentList) return;
        recentList.innerHTML = '';
        
        const songsToShow = filteredSongs.slice(0, 5);
        
        songsToShow.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === currentSongIndex ? 'active-song' : ''}`;
            li.innerHTML = `<i class="fas fa-music"></i> <span>${song.title}</span>`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(filteredSongs[currentSongIndex]);
                playSong();
            });
            recentList.appendChild(li);
        });
    }

    if (volumeToggle) {
        volumeToggle.addEventListener('click', () => {
            volumeModal.classList.toggle('active');
        });
    }

    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value;
            if(audioPlayer.volume === 0) volumeToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            else if(audioPlayer.volume < 0.5) volumeToggle.innerHTML = '<i class="fas fa-volume-down"></i>';
            else volumeToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target !== volumeToggle && e.target !== volumeModal) {
            volumeModal.classList.remove('active');
        }
    });

    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            isShuffle = !isShuffle;
            this.style.color = isShuffle ? '#00ff7f' : 'white';
        });
    }

    if (repeatBtn) {
        repeatBtn.addEventListener('click', function() {
            isRepeat = !isRepeat;
            this.style.color = isRepeat ? '#00ff7f' : 'white';
        });
    }

    function loadLibrary() {
        // کتابخانه از قبل لود شده است
    }
}
