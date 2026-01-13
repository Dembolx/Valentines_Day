// ========== INICJALIZACJA FIREBASE ==========
// Używamy wersji 8.10.0 zamiast 9.x (bez błędów import/export)
const firebaseConfig = {
  apiKey: "AIzaSyACPfixM-BKteMjBuESK3exOkM_1bzuepc",
  authDomain: "walentynki-8579b.firebaseapp.com",
  databaseURL: "https://walentynki-8579b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "walentynki-8579b",
  storageBucket: "walentynki-8579b.firebasestorage.app",
  messagingSenderId: "882392949928",
  appId: "1:882392949928:web:0749e4afe49a2b44120e9d",
  measurementId: "G-3WH5K3CZS1"
};

// Inicjalizacja Firebase - sprawdzamy czy biblioteka jest załadowana
let database = null;
try {
  // Sprawdź czy firebase jest dostępny (window.firebase dla wersji 8.x)
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("✅ Firebase zainicjalizowany!");
  } else {
    console.warn("⚠️ Firebase nie jest załadowany - używam localStorage");
  }
} catch (error) {
  console.error("❌ Błąd inicjalizacji Firebase:", error);
}

// ========== ZMIENNE GRY I KONFETTI ==========
let secretNumber = 0;
let attempts = 3;
let maxAttempts = 3;
let gameActive = false;
let animationFrameId = null;
let confettiElements = [];

// ========== FUNKCJE FIREBASE ==========
function saveChoiceToFirebase(choice) {
  // Jeśli Firebase nie jest dostępny, zapisz lokalnie
  if (!database) {
    console.log("📦 Firebase nie jest dostępny, zapisuję lokalnie");
    saveChoiceToLocalStorage(choice, new Date().toISOString());
    return;
  }

  const timestamp = new Date().toISOString();
  const choiceData = {
    choice: choice,
    timestamp: timestamp,
    userAgent: navigator.userAgent.substring(0, 120),
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    pageUrl: window.location.href
  };

  try {
    // Tworzymy unikalny wpis w bazie danych
    const choiceRef = database.ref('valentine_choices/').push();
    choiceRef.set(choiceData)
      .then(() => {
        console.log("✅ Wybór zapisany w Firebase!");
        showFirebaseSuccessToast();
      })
      .catch((error) => {
        console.error("❌ Błąd zapisu do Firebase:", error);
        saveChoiceToLocalStorage(choice, timestamp);
      });
  } catch (error) {
    console.error("❌ Błąd zapisu do Firebase:", error);
    saveChoiceToLocalStorage(choice, timestamp);
  }
}

function saveChoiceToLocalStorage(choice, timestamp) {
  const fallbackData = {
    choice: choice,
    timestamp: timestamp,
    status: 'local_storage'
  };
  
  const existingChoices = JSON.parse(localStorage.getItem('valentineChoices') || '[]');
  existingChoices.push(fallbackData);
  localStorage.setItem('valentineChoices', JSON.stringify(existingChoices));
  console.log("📦 Wybór zapisany lokalnie");
}

function showFirebaseSuccessToast() {
  const toast = document.createElement('div');
  toast.textContent = '💝 Dziękuję za odpowiedź!';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--p1), var(--p2));
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: bold;
    animation: fadeInOut 2.5s ease;
  `;
  document.body.appendChild(toast);
  
  // Dodaj animację CSS jeśli nie istnieje
  if (!document.querySelector('#toast-animation')) {
    const style = document.createElement('style');
    style.id = 'toast-animation';
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(10px); }
        15%, 85% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 2500);
}

// ========== FUNKCJE KONFETTI (Z TWOJEGO KODU) ==========
function createOptimizedConfetti(count = 80) {
  const colors = [
    "#faa6ff", "#7353ba", "#2f195f", "#efc3f5", "#ffffff",
    "#ff6b9d", "#ff3366", "#ffeb3b", "#4ade80", "#00bcd4",
    "#ff9800", "#9c27b0", "#2196f3", "#ff5722",
  ];

  cleanupConfetti();

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const actualCount = isMobile ? Math.min(count, 40) : count;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < actualCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    const shapeType = Math.floor(Math.random() * 5);
    switch (shapeType) {
      case 0:
        confetti.classList.add("heart");
        confetti.innerHTML = "❤";
        break;
      case 1:
        confetti.classList.add("circle");
        break;
      case 2:
        confetti.classList.add("star");
        break;
      case 3:
        confetti.classList.add("rectangle");
        break;
      case 4:
        confetti.classList.add("triangle");
        break;
    }

    const startX = Math.random() * 120 - 10;
    const startY = Math.random() * 100 - 20;

    confetti.style.left = startX + "vw";
    confetti.style.top = startY + "px";
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    if (shapeType === 4) {
      confetti.style.borderBottomColor = colors[Math.floor(Math.random() * colors.length)];
    }

    const size = isMobile ? 3 + Math.random() * 8 : 5 + Math.random() * 15;

    if (shapeType !== 0 && shapeType !== 4) {
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
    } else if (shapeType === 4) {
      const triangleSize = size * 1.5;
      confetti.style.borderLeftWidth = triangleSize / 2 + "px";
      confetti.style.borderRightWidth = triangleSize / 2 + "px";
      confetti.style.borderBottomWidth = triangleSize + "px";
    }

    confetti.style.opacity = 0.6 + Math.random() * 0.4;

    const confettiData = {
      element: confetti,
      x: startX,
      y: startY,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      speedX: (Math.random() - 0.5) * 4,
      speedY: 2 + Math.random() * 4,
      sway: 0.5 + Math.random() * 2,
      swaySpeed: 0.5 + Math.random() * 2,
      startTime: Date.now(),
      duration: 2000 + Math.random() * 3000,
    };

    fragment.appendChild(confetti);
    confettiElements.push(confettiData);
  }

  document.body.appendChild(fragment);
  animateConfetti();
}

function animateConfetti() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  function animate() {
    const currentTime = Date.now();
    let allFinished = true;

    for (let i = confettiElements.length - 1; i >= 0; i--) {
      const confetti = confettiElements[i];
      if (!confetti.element.parentNode) {
        confettiElements.splice(i, 1);
        continue;
      }

      const elapsed = currentTime - confetti.startTime;
      const progress = Math.min(elapsed / confetti.duration, 1);

      if (progress < 1) {
        allFinished = false;

        const timeFactor = (progress * confetti.duration) / 1000;

        const newX = confetti.x +
          confetti.speedX * timeFactor * 50 +
          Math.sin(timeFactor * confetti.swaySpeed) * confetti.sway * 10;

        const newY = confetti.y +
          confetti.speedY * timeFactor * 50 +
          timeFactor * timeFactor * 4.9;

        const newRotation = confetti.rotation + confetti.rotationSpeed * timeFactor * 50;

        confetti.element.style.transform = `translate(${newX}vw, ${newY}px) rotate(${newRotation}deg)`;

        if (progress > 0.7) {
          confetti.element.style.opacity = confetti.element.style.opacity * (1 - (progress - 0.7) / 0.3);
        }
      } else {
        if (confetti.element.parentNode) {
          confetti.element.parentNode.removeChild(confetti.element);
        }
        confettiElements.splice(i, 1);
      }
    }

    if (confettiElements.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function cleanupConfetti() {
  confettiElements.forEach(confetti => {
    if (confetti.element && confetti.element.parentNode) {
      confetti.element.parentNode.removeChild(confetti.element);
    }
  });
  confettiElements = [];

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// ========== FUNKCJE INTERFEJSU ==========
function showLoveMessage() {
  const message = document.getElementById("loveMessage");
  if (message) {
    message.style.display = "block";
    
    // Utwórz dodatkowe konfetti dla wiadomości
    createOptimizedConfetti(80);
    
    setTimeout(() => {
      message.style.display = "none";
    }, 4000);
  }
}

function shakeElement(element) {
  if (!element) return;
  element.style.animation = "none";
  // Force reflow
  void element.offsetWidth;
  element.style.animation = "shake 0.5s ease";
}

// ========== FUNKCJE GRY ==========
function startGame() {
  secretNumber = Math.floor(Math.random() * 1000000) + 1;
  attempts = maxAttempts;
  gameActive = true;

  const modal = document.getElementById("gameModal");
  if (modal) {
    modal.style.display = "block";
    // Zastosuj animację modalSlideIn
    modal.querySelector('.modal-content').style.animation = 'modalSlideIn 0.3s ease-out';
  }
  
  const guessInput = document.getElementById("guessInput");
  if (guessInput) {
    guessInput.value = "";
    setTimeout(() => guessInput.focus(), 100);
  }
  
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.innerHTML = "";
  
  const hint = document.getElementById("hint");
  if (hint) hint.innerHTML = "";
  
  const attemptsCounter = document.getElementById("attemptsCounter");
  if (attemptsCounter) attemptsCounter.innerHTML = `Pozostałe próby: ${attempts}`;
}

function giveHint() {
  if (!gameActive) return;

  const hintDiv = document.getElementById("hint");
  if (!hintDiv) return;

  const range = 100000;
  const lowerBound = Math.max(1, secretNumber - range);
  const upperBound = Math.min(1000000, secretNumber + range);

  hintDiv.innerHTML = `<i class="fas fa-lightbulb"></i> Podpowiedź: Szukana liczba jest między ${lowerBound.toLocaleString()} a ${upperBound.toLocaleString()}`;

  if (attempts > 1) {
    attempts--;
    const attemptsCounter = document.getElementById("attemptsCounter");
    if (attemptsCounter) attemptsCounter.innerHTML = `Pozostałe próby: ${attempts}`;
  }
}

function checkGuess() {
  if (!gameActive) return;

  const guessInput = document.getElementById("guessInput");
  const feedbackDiv = document.getElementById("feedback");
  const attemptsCounter = document.getElementById("attemptsCounter");

  if (!guessInput || !feedbackDiv || !attemptsCounter) return;

  const guess = parseInt(guessInput.value);
  
  if (isNaN(guess) || guess < 1 || guess > 1000000) {
    feedbackDiv.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Wpisz liczbę z zakresu 1 - 1 000 000!</div>';
    shakeElement(guessInput);
    return;
  }

  attempts--;
  attemptsCounter.innerHTML = `Pozostałe próby: ${attempts}`;

  if (guess === secretNumber) {
    feedbackDiv.innerHTML = `<div class="success"><i class="fas fa-trophy"></i> BRAWO! Zgadłeś za ${maxAttempts - attempts} razem! Tajemnicza liczba to: ${secretNumber}</div>`;
    gameActive = false;
    
    // Konfetti dla wygranej
    createOptimizedConfetti(150);
    
    // Zapis do Firebase
    saveChoiceToFirebase(`WYGRAŁ grę! Liczba: ${secretNumber}`);

    setTimeout(() => {
      closeGame();
      showLoveMessage();
    }, 2000);
  } else if (attempts <= 0) {
    feedbackDiv.innerHTML = `<div class="error"><i class="fas fa-times-circle"></i> Niestety, wykorzystałeś wszystkie próby. Tajemnicza liczba to: ${secretNumber}</div>`;
    gameActive = false;
    setTimeout(() => closeGame(), 3000);
  } else {
    const hint = guess < secretNumber ? "za mała" : "za duża";
    feedbackDiv.innerHTML = `<div class="error"><i class="fas fa-times"></i> Nie zgadłeś! Twoja liczba jest ${hint}. Próbuj dalej!</div>`;
    shakeElement(feedbackDiv);
  }

  guessInput.value = "";
  setTimeout(() => {
    if (guessInput) guessInput.focus();
  }, 50);
}

function closeGame() {
  const modal = document.getElementById("gameModal");
  if (modal) modal.style.display = "none";
  gameActive = false;
}

// ========== FUNKCJE PRZYCISKÓW ==========
function handleYesButtonClick() {
  console.log("💖 Przycisk TAK kliknięty!");
  
  // Zapis do Firebase
  saveChoiceToFirebase('TAK! 😍❤️💖');
  
  // Mega konfetti - kilka fal
  createOptimizedConfetti(250);
  setTimeout(() => createOptimizedConfetti(200), 200);
  setTimeout(() => createOptimizedConfetti(180), 500);
  setTimeout(() => createOptimizedConfetti(150), 900);
  setTimeout(() => createOptimizedConfetti(120), 1400);
  
  // Pokaż wiadomość
  showLoveMessage();
  
  // Animacje
  const container = document.querySelector(".container");
  if (container) {
    container.style.transform = "scale(1.05)";
    setTimeout(() => { container.style.transform = "scale(1)"; }, 300);
  }
  
  const topHeart = document.querySelector(".floating-top-heart");
  if (topHeart) {
    topHeart.style.animation = "none";
    setTimeout(() => {
      topHeart.style.animation = "float 3s ease-in-out infinite, heartPulse 0.5s ease-in-out 3";
    }, 10);
  }
}

function handleNoButtonClick() {
  console.log("🎮 Przycisk NIE kliknięty!");
  
  // Zapis do Firebase
  saveChoiceToFirebase('NIE - rozpoczęto grę');
  
  // Uruchom grę
  startGame();
}

// ========== PŁYWAJĄCE SERCA W TLE ==========
function createFloatingHearts() {
  const container = document.getElementById("heartsContainer");
  if (!container) return;
  
  const heartCount = window.innerWidth < 768 ? 8 : 12;
  
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    heart.style.animationDelay = Math.random() * 10 + "s";
    heart.style.animationDuration = (10 + Math.random() * 15) + "s";
    container.appendChild(heart);
  }
}

// ========== INICJALIZACJA STRONY ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log("🎉 Strona walentynkowa załadowana!");
  
  // Podłącz przyciski
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const checkBtn = document.querySelector('.modal-btn[onclick="checkGuess()"]');
  const hintBtn = document.querySelector('.modal-btn[onclick="giveHint()"]');
  const closeBtn = document.querySelector('.modal-btn[onclick="closeGame()"]');
  const guessInput = document.getElementById("guessInput");
  
  if (yesBtn) {
    yesBtn.addEventListener("click", handleYesButtonClick);
  }
  
  if (noBtn) {
    noBtn.addEventListener("click", handleNoButtonClick);
  }
  
  // Napraw inline onclick handlers
  if (checkBtn) {
    checkBtn.onclick = checkGuess;
  }
  
  if (hintBtn) {
    hintBtn.onclick = giveHint;
  }
  
  if (closeBtn) {
    closeBtn.onclick = closeGame;
  }
  
  if (guessInput) {
    guessInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        checkGuess();
      }
    });
  }
  
  // Dodaj brakujące animacje CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heartPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
  
  // Utwórz pływające serca
  createFloatingHearts();
  
  // Dodaj trochę konfetti na start (opcjonalnie)
  setTimeout(() => {
    createOptimizedConfetti(30);
  }, 1000);
});

// ========== FUNKCJE POMOCNICZE FIREBASE (do testowania) ==========
function fetchAllChoices() {
  if (!database) {
    console.log("📦 Firebase nie jest dostępny");
    const localChoices = JSON.parse(localStorage.getItem('valentineChoices') || '[]');
    console.log("📦 Lokalne wybory:", localChoices);
    return;
  }
  
  const ref = database.ref('valentine_choices/');
  ref.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log("📊 Wszystkie zapisane wybory:", data);
      displayChoices(data);
    })
    .catch(error => {
      console.error("❌ Błąd pobierania danych:", error);
    });
}

function displayChoices(choices) {
  if (!choices) return;
  
  let html = '<h3>📈 Odpowiedzi:</h3><ul>';
  for (let key in choices) {
    const c = choices[key];
    html += `<li><strong>${c.choice}</strong> - ${new Date(c.timestamp).toLocaleString('pl-PL')}</li>`;
  }
  html += '</ul>';
  
  // Usuń istniejący panel
  const existingPanel = document.getElementById('firebaseResults');
  if (existingPanel) existingPanel.remove();
  
  const panel = document.createElement('div');
  panel.id = 'firebaseResults';
  panel.innerHTML = html;
  panel.style.cssText = 'position:fixed; top:10px; left:10px; background:white; padding:15px; border-radius:10px; z-index:9999; max-height:80vh; overflow-y:auto; box-shadow:0 0 20px rgba(0,0,0,0.2);';
  document.body.appendChild(panel);
}