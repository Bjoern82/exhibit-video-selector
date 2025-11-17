// ==========================
// µ-Museum Videoterminal V1 – Vollbild-Version
// Fullscreen Video Terminal V1 – µ-Museum
// ==========================

// Index des aktuell ausgewählten Thumbnails
// Index of the currently selected thumbnail
let selected = 0;

// Array zum Speichern aller Thumbnail-Elemente
// Array to store all thumbnail elements
let thumbs = [];

// Flag, ob gerade ein Video abgespielt wird
// Flag indicating whether a video is currently playing
let playing = false;

// Mapping-Tabelle für Gamepad-Tasten (NES-Layout)
// Mapping table for gamepad buttons (NES layout)
const buttonMap = {
  play: 1,    // A-Taste → Video starten / A button → play video
  back: 0,    // B-Taste → zurück zur Galerie / B button → back to gallery
  pause: 8,   // Select-Taste → Pause/Play / Select button → pause/play
  start: 9    // Start-Taste → Kiosk-Modus beenden / Start button → exit kiosk mode
};

// Initialisiert die Galerie beim Laden der Seite
// Initializes the gallery when the page loads
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

  // Sicherheits-Reset: Galerie einblenden, Video ausblenden
  // Safety reset: show gallery, hide video
  document.querySelector(".gallery").classList.remove("hidden");
  const player = document.getElementById("player");
  player.style.display = "none";
  playing = false;
}

// Hebt das aktuell ausgewählte Thumbnail hervor
// Highlights the currently selected thumbnail
function highlight() {
  thumbs.forEach((t, i) => t.classList.toggle('active', i === selected));
}

// Spielt das ausgewählte Video ab oder navigiert zu einer anderen Seite
// Plays the selected video or navigates to another page
function playSelected() {
  const thumb = thumbs[selected];
  const file = thumb.getAttribute("data-video");
  const linkTarget = thumb.getAttribute("data-href");
  const player = document.getElementById("player");

  // Navigation zu anderer Seite
  // Navigate to another page
  if (linkTarget) {
    window.location.href = linkTarget;
    return;
  }

  // Kein Video zugewiesen → Warnung
  // No video assigned → warning
  if (!file) {
    console.warn("Kein gültiges Video für Auswahl:", selected);
    return;
  }

  // Video starten (Vollbild)
  // Start video (fullscreen)
  player.src = file;
  document.querySelector(".gallery").classList.add("hidden");
  player.style.display = "block";
  player.play();
  playing = true;
}

// Stoppt das Video und kehrt zur Galerie zurück
// Stops the video and returns to the gallery
function back() {
  const player = document.getElementById("player");
  player.pause();
  player.currentTime = 0;
  player.style.display = "none";
  document.querySelector(".gallery").classList.remove("hidden");
  playing = false;
}

// Tastatur-Navigation
// Keyboard navigation
window.addEventListener("keydown", (e) => {
  if (!thumbs.length) return;

  // Links/Oben → vorheriges Thumbnail
  // Left/Up → previous thumbnail
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    selected = (selected - 1 + thumbs.length) % thumbs.length;
    highlight();
  }

  // Rechts/Unten → nächstes Thumbnail
  // Right/Down → next thumbnail
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    selected = (selected + 1) % thumbs.length;
    highlight();
  }

  // Enter → Video abspielen
  // Enter → play video
  if (e.key === "Enter") {
    playSelected();
  }

  // Escape → zurück zur Galerie
  // Escape → back to gallery
  if (e.key === "Escape") {
    back();
  }
});

// Gamepad-Navigation
// Gamepad navigation
window.addEventListener("gamepadconnected", () => {
  let lastMove = 0; // Zeitstempel für Eingabe-Dämpfung / timestamp for input throttling

  setInterval(() => {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    // Exit-Kiosk-Modus: Kombination Start + A + B
    // Exit kiosk mode: combination Start + A + B
    if (
      gp.buttons[buttonMap.start]?.pressed &&
      gp.buttons[buttonMap.play]?.pressed &&
      gp.buttons[buttonMap.back]?.pressed
    ) {
      console.log("Exit Kiosk Mode triggered");
      window.close();
    }

    // Wenn Video läuft: Back und Pause
    // If video is playing: allow back and pause
    if (playing) {
      if (gp.buttons[buttonMap.back]?.pressed) back();
      if (gp.buttons[buttonMap.pause]?.pressed) {
        const player = document.getElementById("player");
        player.paused ? player.play() : player.pause();
      }
      return;
    }

    // Galerie-Navigation mit Dämpfung (300ms)
    // Gallery navigation with 300ms input delay
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

    // Play-Taste → Video starten
    // Play button → start video
    if (gp.buttons[buttonMap.play]?.pressed) playSelected();

    // Back-Taste → zurück zur Galerie (nur wenn kein Video läuft)
    // Back button → return to gallery (only if no video is playing)
    if (!playing && gp.buttons[buttonMap.back]?.pressed) back();
  }, 100); // Abfrage alle 100ms / poll every 100ms
});
