// Index of the currently selected thumbnail
// Index des aktuell ausgewählten Thumbnails
let selected = 0;

// Array to hold all thumbnail elements
// Array zum Speichern aller Thumbnail-Elemente
let thumbs = [];

// Flag to track whether a video is currently playing
// Flag, ob gerade ein Video abgespielt wird
let playing = false;

// Mapping table for gamepad buttons
// Mapping-Tabelle für Gamepad-Tasten
const buttonMap = {
  play: 1,    // A
  back: 0,    // B
  pause: 8,   // Select
  start: 9    // Start
};

/**
 * Initializes the gallery
 * Initialisiert die Galerie
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
 * Hebt das aktuell ausgewählte Thumbnail hervor
 */
function highlight() {
  thumbs.forEach((t, i) => t.classList.toggle('active', i === selected));
}

/**
 * Plays the selected video or navigates to another page
 * Spielt das ausgewählte Video ab oder navigiert zu einer anderen Seite
 */
function playSelected() {
  const thumb = thumbs[selected];

  if (thumb.classList.contains("nav-link")) {
    const target = thumb.getAttribute("data-href");
    if (target) {
      window.location.href = target;
    }
    return;
  }

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
  player.play();
  playing = true;
}

/**
 * Stops the video and returns to the gallery view
 * Stoppt das Video und kehrt zur Galerie zurück
 */
function back() {
  const player = document.getElementById("player");
  player.pause();
  player.currentTime = 0;

  player.style.display = "none";
  document.querySelector(".gallery").style.display = "flex";
  playing = false;
}

/**
 * Keyboard navigation
 * Tastatur-Navigation
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
 * Gamepad navigation
 * Gamepad-Navigation
 */
window.addEventListener("gamepadconnected", () => {
  let lastMove = 0;

  setInterval(() => {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    // Debug output: show pressed buttons in console
    // Debug-Ausgabe: zeigt gedrückte Buttons in der Konsole
    gp.buttons.forEach((btn, i) => {
      if (btn.pressed) {
        console.log("Button pressed:", i);
      }
    });

    // Exit Kiosk Mode: Start + A + B
    if (
      gp.buttons[buttonMap.start]?.pressed &&  // Start
      gp.buttons[buttonMap.play]?.pressed &&   // A
      gp.buttons[buttonMap.back]?.pressed      // B
    ) {
      console.log("Exit Kiosk Mode triggered");
      window.close(); // oder eigene exitKioskMode()-Funktion
    }

    // If video is playing: allow back and pause
    if (playing) {
      if (gp.buttons[buttonMap.back]?.pressed) {
        back();
      }
      if (gp.buttons[buttonMap.pause]?.pressed) {
        const player = document.getElementById("player");
        if (player.paused) {
          player.play();
        } else {
          player.pause();
        }
      }
      return;
    }

    // Navigation in gallery
    const now = Date.now();
    if (now - lastMove >= 300) {
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
    }

    // Play
    if (gp.buttons[buttonMap.play]?.pressed) {
      playSelected();
    }

    // Back
    if (gp.buttons[buttonMap.back]?.pressed) {
      back();
    }

  }, 100);
});
