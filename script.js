// Initialize variables
      let secretNumber = 0;
      let attempts = 1;
      let maxAttempts = 1;
      let gameActive = false;

      // Create floating hearts in background
      function createFloatingHearts() {
        const container = document.getElementById("heartsContainer");
        const heartCount = window.innerWidth < 768 ? 10 : 15;

        for (let i = 0; i < heartCount; i++) {
          const heart = document.createElement("div");
          heart.className = "floating-heart";
          heart.innerHTML = "❤️";
          heart.style.left = Math.random() * 100 + "vw";

          // Responsive font size
          const fontSize =
            window.innerWidth < 480
              ? 10 + Math.random() * 15
              : 15 + Math.random() * 20;
          heart.style.fontSize = fontSize + "px";

          heart.style.animationDelay = Math.random() * 15 + "s";
          heart.style.animationDuration = 10 + Math.random() * 15 + "s";
          container.appendChild(heart);
        }
      }

      // Start the guessing game
      function startGame() {
        secretNumber = Math.floor(Math.random() * 1000000) + 1;
        attempts = maxAttempts;
        gameActive = true;

        document.getElementById("gameModal").style.display = "block";
        document.getElementById("guessInput").value = "";
        document.getElementById("feedback").innerHTML = "";
        document.getElementById("hint").innerHTML = "";
        document.getElementById(
          "attemptsCounter"
        ).innerHTML = `Pozostałe próby: ${attempts}`;
        document.getElementById("guessInput").focus();

        console.log("Secret number (for testing):", secretNumber);
      }

      // Check user's guess
      function checkGuess() {
        if (!gameActive) return;

        const guessInput = document.getElementById("guessInput");
        const guess = parseInt(guessInput.value);
        const feedbackDiv = document.getElementById("feedback");
        const attemptsCounter = document.getElementById("attemptsCounter");

        if (isNaN(guess) || guess < 1 || guess > 1000000) {
          feedbackDiv.innerHTML =
            '<div class="error"><i class="fas fa-exclamation-triangle"></i> Wpisz liczbę z zakresu 1 - 1 000 000!</div>';
          shakeElement(guessInput);
          return;
        }

        attempts--;
        attemptsCounter.innerHTML = `Pozostałe próby: ${attempts}`;

        if (guess === secretNumber) {
          // Correct guess
          feedbackDiv.innerHTML = `<div class="success"><i class="fas fa-trophy"></i> BRAWO! Zgadłeś za ${
            maxAttempts - attempts
          } razem! Tajemnicza liczba to: ${secretNumber}</div>`;
          gameActive = false;
          createFullScreenConfetti(150);

          // Show celebration
          setTimeout(() => {
            closeGame();
            showLoveMessage();
          }, 2000);
        } else if (attempts <= 0) {
          // No more attempts
          feedbackDiv.innerHTML = `<div class="error"><i class="fas fa-times-circle"></i> Niestety, wykorzystałeś wszystkie próby. Tajemnicza liczba to: ${secretNumber}</div>`;
          gameActive = false;

          setTimeout(() => {
            closeGame();
          }, 3000);
        } else {
          // Wrong guess, give hint
          const hint = guess < secretNumber ? "za mała" : "za duża";
          feedbackDiv.innerHTML = `<div class="error"><i class="fas fa-times"></i> Nie zgadłeś! Twoja liczba jest ${hint}. Próbuj dalej!</div>`;
          shakeElement(feedbackDiv);
        }

        // Clear input
        guessInput.value = "";
        guessInput.focus();
      }

      // Give hint to the user
      function giveHint() {
        if (!gameActive) return;

        const hintDiv = document.getElementById("hint");
        const range = 100000;
        const lowerBound = Math.max(1, secretNumber - range);
        const upperBound = Math.min(1000000, secretNumber + range);

        hintDiv.innerHTML = `<i class="fas fa-lightbulb"></i> Podpowiedź: Szukana liczba jest między ${lowerBound.toLocaleString()} a ${upperBound.toLocaleString()}`;

        // Decrease attempts for using hint
        if (attempts > 1) {
          attempts--;
          document.getElementById(
            "attemptsCounter"
          ).innerHTML = `Pozostałe próby: ${attempts}`;
        }
      }

      // Close the game modal
      function closeGame() {
        document.getElementById("gameModal").style.display = "none";
        gameActive = false;
      }

      // Create full-screen scalable confetti animation
      function createFullScreenConfetti(count = 100) {
        const colors = ["#faa6ff", "#7353ba", "#2f195f", "#efc3f5", "#ffffff"];

        // Calculate responsive sizes based on viewport
        const baseSize = Math.min(window.innerWidth, window.innerHeight) / 100;

        for (let i = 0; i < count; i++) {
          const confetti = document.createElement("div");
          confetti.className = "confetti";

          // Random starting position along the top edge
          confetti.style.left = Math.random() * 100 + "vw";
          confetti.style.top = "-20px";

          // Random color
          confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];

          // Random shape
          confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

          // Responsive size calculation
          const size = baseSize * (0.5 + Math.random() * 1.5);
          confetti.style.width = size + "px";
          confetti.style.height = size + "px";

          // Random opacity
          confetti.style.opacity = 0.7 + Math.random() * 0.3;

          document.body.appendChild(confetti);

          // Animation properties
          let pos = -20;
          const speed = 3 + Math.random() * 5;
          const sway = 2 + Math.random() * 3;
          const rotationSpeed = 1 + Math.random() * 3;

          // Random animation duration for variety
          const duration = 3000 + Math.random() * 2000;

          const startTime = Date.now();

          function animateConfetti() {
            const elapsed = Date.now() - startTime;

            if (elapsed > duration) {
              confetti.remove();
              return;
            }

            // Calculate progress (0 to 1)
            const progress = elapsed / duration;

            // Vertical movement with easing
            pos = -20 + progress * (window.innerHeight + 40);
            confetti.style.top = pos + "px";

            // Horizontal sway
            const horizontalMovement =
              Math.sin(progress * Math.PI * 4) * sway * 10;
            confetti.style.left =
              parseFloat(confetti.style.left) + horizontalMovement + "px";

            // Rotation
            const rotation = progress * 360 * rotationSpeed;
            confetti.style.transform = `rotate(${rotation}deg)`;

            // Fade out at the end
            if (progress > 0.7) {
              confetti.style.opacity = 0.7 * (1 - (progress - 0.7) / 0.3);
            }

            requestAnimationFrame(animateConfetti);
          }

          requestAnimationFrame(animateConfetti);
        }
      }

      // Show love message when user accepts
      function showLoveMessage() {
        const message = document.getElementById("loveMessage");
        message.style.display = "block";

        // Create full-screen confetti
        createFullScreenConfetti(200);

        // Create floating hearts
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            createFloatingHeartAnimation();
          }, i * 100);
        }

        // Hide message after 5 seconds
        setTimeout(() => {
          message.style.display = "none";
        }, 5000);
      }

      // Create a single floating heart animation
      function createFloatingHeartAnimation() {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.style.position = "fixed";

        // Responsive heart size
        const heartSize = Math.min(window.innerWidth, window.innerHeight) / 20;
        heart.style.fontSize = heartSize + "px";

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "100vh";
        heart.style.zIndex = "3000";
        heart.style.pointerEvents = "none";
        heart.style.opacity = "0.8";
        document.body.appendChild(heart);

        const animation = heart.animate(
          [
            { transform: "translateY(0) scale(1)", opacity: 0.8 },
            { transform: "translateY(-100vh) scale(1.5)", opacity: 0 },
          ],
          {
            duration: 3000 + Math.random() * 2000,
            easing: "cubic-bezier(0.215, 0.610, 0.355, 1)",
          }
        );

        animation.onfinish = () => heart.remove();
      }

      // Shake animation for wrong input
      function shakeElement(element) {
        element.style.animation = "none";
        setTimeout(() => {
          element.style.animation = "shake 0.5s ease";
        }, 10);

        // Add shake animation to CSS
        if (!document.querySelector("#shake-style")) {
          const style = document.createElement("style");
          style.id = "shake-style";
          style.textContent = `
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
              20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
          `;
          document.head.appendChild(style);
        }
      }

      // Event listeners
      document.getElementById("yesBtn").addEventListener("click", () => {
        createFullScreenConfetti(120);
        showLoveMessage();

        // Add heartbeat effect to container
        const container = document.querySelector(".container");
        container.style.animation = "heartbeat 1s 3";

        // Play sound if available (optional)
        try {
          const audio = new Audio(
            "https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-laugh-464.mp3"
          );
          audio.volume = 0.3;
          audio.play().catch((e) => console.log("Audio play failed:", e));
        } catch (e) {
          console.log("Audio not available");
        }
      });

      document.getElementById("noBtn").addEventListener("click", () => {
        startGame();
      });

      document
        .getElementById("guessInput")
        .addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            checkGuess();
          }
        });

      // Handle window resize for responsive confetti
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Recreate floating hearts on resize
          const heartsContainer = document.getElementById("heartsContainer");
          heartsContainer.innerHTML = "";
          createFloatingHearts();
        }, 250);
      });

      // Initialize the page
      window.addEventListener("load", () => {
        createFloatingHearts();

        // Add some initial confetti for effect
        setTimeout(() => {
          createFullScreenConfetti(30);
        }, 1000);
      });

      // Prevent zoom on double tap on mobile
      let lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        function (event) {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );