// ==========================================
// CREATOR HQ - YOUTUBER ROLL
// ==========================================

// Change this to your real Discord invite.
const DISCORD_LINK = "https://discord.gg/4f5aNDdxw";

// ==========================================
// YOUTUBER LIST
// ==========================================
//
// IMPORTANT:
// These are example/fictional names.
// Replace them with creators you want to feature
// and have permission to use.
//
// chance = rarity chance
// ==========================================

const youtubers = [

  // COMMON
  {
    name: "Pixel Cam",
    rarity: "Common",
    chance: 60,
    icon: "🎮"
  },

  {
    name: "J4xon Gaming",
    rarity: "Common",
    chance: 60,
    icon: "🕹️"
  },

  {
    name: "BlockMaster",
    rarity: "Common",
    chance: 60,
    icon: "🧱"
  },

  // RARE
  {
    name: "GameZone",
    rarity: "Rare",
    chance: 25,
    icon: "🎯"
  },

  {
    name: "The Roblox Kid",
    rarity: "Rare",
    chance: 25,
    icon: "👾"
  },

  // EPIC
  {
    name: "Gaming Legend",
    rarity: "Epic",
    chance: 10,
    icon: "🔥"
  },

  {
    name: "Creator Pro",
    rarity: "Epic",
    chance: 10,
    icon: "🎬"
  },

  // LEGENDARY
  {
    name: "YouTube Master",
    rarity: "Legendary",
    chance: 4,
    icon: "👑"
  },

  // MYTHIC
  {
    name: "Creator HQ Legend",
    rarity: "Mythic",
    chance: 1,
    icon: "💎"
  }

];


// ==========================================
// VARIABLES
// ==========================================

let rolls = Number(localStorage.getItem("creatorHQ_rolls")) || 0;

let collection =
  JSON.parse(localStorage.getItem("creatorHQ_collection")) || [];

let isRolling = false;


// ==========================================
// ELEMENTS
// ==========================================

const rollButton = document.getElementById("rollButton");

const resultName = document.getElementById("resultName");
const resultRarity = document.getElementById("resultRarity");
const resultIcon = document.getElementById("resultIcon");

const ringIcon = document.getElementById("ringIcon");

const rollMessage = document.getElementById("rollMessage");

const rollCount = document.getElementById("rollCount");
const collectionCount = document.getElementById("collectionCount");
const bestRarity = document.getElementById("bestRarity");

const collectionElement =
  document.getElementById("collection");

const popup =
  document.getElementById("popup");

const popupName =
  document.getElementById("popupName");

const popupRarity =
  document.getElementById("popupRarity");

const popupIcon =
  document.getElementById("popupIcon");

const clearButton =
  document.getElementById("clearButton");


// ==========================================
// RARITY ORDER
// ==========================================

const rarityOrder = {
  "Common": 1,
  "Rare": 2,
  "Epic": 3,
  "Legendary": 4,
  "Mythic": 5
};


// ==========================================
// WEIGHTED RANDOM ROLL
// ==========================================

function getRandomYouTuber() {

  // Add all chances together.
  const totalChance =
    youtubers.reduce(
      (total, creator) => total + creator.chance,
      0
    );

  let random =
    Math.random() * totalChance;

  for (const creator of youtubers) {

    random -= creator.chance;

    if (random <= 0) {
      return creator;
    }

  }

  return youtubers[0];
}


// ==========================================
// ROLL
// ==========================================

function roll() {

  if (isRolling) return;

  isRolling = true;

  rollButton.disabled = true;

  rollButton.textContent = "🎲 ROLLING...";

  resultName.textContent = "Rolling...";

  resultRarity.textContent = "???";

  resultIcon.textContent = "🎰";

  ringIcon.textContent = "🎲";

  rollMessage.textContent =
    "The wheel is spinning...";

  // Fast visual cycling.
  let cycles = 0;

  const animation =
    setInterval(() => {

      const randomCreator =
        youtubers[
          Math.floor(
            Math.random() * youtubers.length
          )
        ];

      resultIcon.textContent =
        randomCreator.icon;

      resultName.textContent =
        randomCreator.name;

      resultRarity.textContent =
        randomCreator.rarity;

      cycles++;

      if (cycles >= 15) {

        clearInterval(animation);

        finishRoll();

      }

    }, 100);

}


// ==========================================
// FINISH ROLL
// ==========================================

function finishRoll() {

  const creator =
    getRandomYouTuber();

  rolls++;

  // Add to collection if not already owned.
  const alreadyOwned =
    collection.some(
      item => item.name === creator.name
    );

  if (!alreadyOwned) {

    collection.push(creator);

  }

  // Save progress.
  localStorage.setItem(
    "creatorHQ_rolls",
    rolls
  );

  localStorage.setItem(
    "creatorHQ_collection",
    JSON.stringify(collection)
  );

  // Update screen.
  resultName.textContent =
    creator.name;

  resultRarity.textContent =
    creator.rarity;

  resultIcon.textContent =
    creator.icon;

  ringIcon.textContent =
    creator.icon;

  rollMessage.textContent =
    alreadyOwned
      ? "You already collected this creator!"
      : "🎉 New creator added to your collection!";

  updateStats();

  renderCollection();

  showPopup(creator);

  rollButton.disabled = false;

  rollButton.textContent = "🎲 ROLL";

  isRolling = false;

}


// ==========================================
// POPUP
// ==========================================

function showPopup(creator) {

  popupName.textContent =
    creator.name;

  popupRarity.textContent =
    `⭐ ${creator.rarity}`;

  popupIcon.textContent =
    creator.icon;

  popup.classList.add("show");

}


function closePopup() {

  popup.classList.remove("show");

}


// ==========================================
// STATS
// ==========================================

function updateStats() {

  rollCount.textContent =
    rolls;

  collectionCount.textContent =
    collection.length;

  if (collection.length === 0) {

    bestRarity.textContent =
      "None";

    return;

  }

  const best =
    collection.reduce(
      (currentBest, creator) => {

        if (
          rarityOrder[creator.rarity] >
          rarityOrder[currentBest.rarity]
        ) {

          return creator;

        }

        return currentBest;

      }
    );

  bestRarity.textContent =
    best.rarity;

}


// ==========================================
// COLLECTION
// ==========================================

function renderCollection() {

  if (collection.length === 0) {

    collectionElement.innerHTML = `
      <div class="empty-collection">
        🎁 Start rolling to collect YouTubers!
      </div>
    `;

    return;

  }

  // Sort highest rarity first.
  const sorted =
    [...collection].sort(
      (a, b) =>
        rarityOrder[b.rarity] -
        rarityOrder[a.rarity]
    );

  collectionElement.innerHTML =
    sorted.map(creator => `

      <div class="creator-card">

        <div class="creator-icon">
          ${creator.icon}
        </div>

        <h3>${escapeHTML(creator.name)}</h3>

        <p>⭐ ${escapeHTML(creator.rarity)}</p>

      </div>

    `).join("");

}


// ==========================================
// RESET COLLECTION
// ==========================================

function resetCollection() {

  const confirmed =
    confirm(
      "Are you sure you want to reset your collection and roll count?"
    );

  if (!confirmed) return;

  rolls = 0;

  collection = [];

  localStorage.removeItem(
    "creatorHQ_rolls"
  );

  localStorage.removeItem(
    "creatorHQ_collection"
  );

  resultName.textContent =
    "Ready?";

  resultRarity.textContent =
    "Press ROLL";

  resultIcon.textContent =
    "?";

  ringIcon.textContent =
    "🎬";

  rollMessage.textContent =
    "Try your luck!";

  updateStats();

  renderCollection();

}


// ==========================================
// DISCORD BUTTON
// ==========================================

function joinDiscord() {

  window.open(
    DISCORD_LINK,
    "_blank"
  );

}


// ==========================================
// BASIC HTML SAFETY
// ==========================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ==========================================
// BUTTON EVENTS
// ==========================================

rollButton.addEventListener(
  "click",
  roll
);

clearButton.addEventListener(
  "click",
  resetCollection
);


// Close popup if user clicks outside it.
popup.addEventListener(
  "click",
  function(event) {

    if (event.target === popup) {

      closePopup();

    }

  }
);


// ==========================================
// INITIAL LOAD
// ==========================================

updateStats();

renderCollection();
// ================================
// BACKGROUND SPACE MUSIC
// ================================

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");

let musicPlaying = false;

musicButton.addEventListener("click", () => {

    if (!musicPlaying) {

        music.play();

        musicPlaying = true;

        musicButton.textContent = "⏸ PAUSE MUSIC";
        musicStatus.textContent = "Space Music: ON";

    } else {

        music.pause();

        musicPlaying = false;

        musicButton.textContent = "▶ PLAY MUSIC";
        musicStatus.textContent = "Space Music: OFF";
    }
});
const music = document.getElementById("backgroundMusic");

document.getElementById("musicButton").addEventListener("click", () => {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
});
