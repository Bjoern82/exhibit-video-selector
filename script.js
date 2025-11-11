// Index of the currently selected thumbnail
let selected = 0;

// Array to hold all thumbnail elements
let thumbs = [];

// Flag to track whether a video is currently playing
let playing = false;

/**
 * Initializes the gallery:
 * - Collects all thumbnails
 * - Highlights the selected one
 * - Adds click listeners to each thumbnail
 */
function initGallery() {
  thumbs = Array.from(document.querySelectorAll('.thumb'));
  highlight();

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      selected = index;
      highlight();
      playSelected();
    });
  });
}

/**
 * Highlights the currently selected thumbnail
 */
function highlight() {
  thumbs.forEach((t, i) => t.classList.toggle('active', i === selected));
}

/**
 * Plays the selected video or navigates to another page
 */
function playSelected() {
  const thumb = thumbs[selected];

  // If it's a navigation link, redirect to the target page
  if (thumb.classList.contains("nav-link")) {
    const target = thumb.getAttribute("data-href");
    if (target) {
      window.location.href = target;
    }
    return;
  }

  // Otherwise, play the associated video
  const file = thumb.getAttribute("data-video");
  const player = document.getElementById("player");
  const source = document.getElementById("source");

  if (!file) {
    console.warn("No video assigned for selection:", selected);
    return;
  }

  source.src = file;
  player.style.display = "block";
  document.querySelector(".gallery").style.display = "none";
  player.load();
  playing = true;
}

/**
 * Stops the video and returns to the gallery view
 * Triggered by ESC key, gamepad button, or video end
 */
function back() {
  const player = document.getElementById("player");
  player.pause();            // Stop playback
  player.currentTime = 0;    // Reset to beginning

  player.style.display = "none";
  document.querySelector(".gallery").style.display = "flex";
  playing = false;
}

/**
 * Keyboard navigation:
 * - Arrow keys to move selection
 * - Enter to play
 * - Escape to return
 */
window.addEventListener("keydown", (e) => {
  if (!thumbs.length) return;

  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    selected = (selected - 1 + thumbs.length) % thumbs.length;
    highlight();
  }

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    selected = (selected + 1) % thumbs.length;
    highlight();
  }

  if (e.key === "Enter") {
    playSelected();
  }

  if (e.key === "Escape") {
    back();
  }
});

/**
 * Gamepad navigation:
 * - Left/right/up/down to move selection
 * - Button 0 (A) to play
 * - Button 1 (B) to return
 */
window.addEventListener("gamepadconnected", () => {
  let lastMove = 0;

  setInterval(() => {
    const gp = navigator.getGamepads()[0];
    if (!gp || playing) return;

    const now = Date.now();
    if (now - lastMove < 300) return;

    const horizontal = gp.axes[0];
    const vertical = gp.axes[1];

    if (horizontal < -0.5 || vertical < -0.5) {
      selected = (selected - 1 + thumbs.length) % thumbs.length;
      highlight();
      lastMove = now;
    }

    if (horizontal > 0.5 || vertical > 0.5) {
      selected = (selected + 1) % thumbs.length;
      highlight();
      lastMove = now;
    }

    if (gp.buttons[0].pressed) {
      playSelected();
    }

    if (gp.buttons[1].pressed) {
      back();
    }
  }, 100);
});