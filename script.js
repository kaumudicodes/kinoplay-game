let selectedGame = "";
let selectedCategory = "";

let seconds = 120;

// ================= GAME VARIABLES =================

let gameItems = [];
let currentItem = 0;
let score = 0;

let gameTimer;
let gameTimeLeft = 120;

let gamePaused = false;


// ================= SONG SYLLABLES =================

// One random word for every song

const songWords = [
    "Na",
    "Ta",
    "Ba",
    "Ma",
    "Ra",
    "Ga"
];


// ================= SPLASH =================

setTimeout(function() {

    document.getElementById("splash").style.display = "none";

    document.getElementById("homePage").style.display = "block";

}, 3000);


// ================= SELECT GAME =================

function selectGame(box, game) {

    let boxes = document.querySelectorAll(".gameBox");

    boxes.forEach(function(item) {
        item.classList.remove("selected");
    });

    box.classList.add("selected");

    selectedGame = game;
}


// ================= NEXT =================

function goNext() {

    if (selectedGame === "") {

        alert("Please select a game");

        return;
    }

    document.getElementById("homePage").style.display = "none";


    // ================= MOVIE =================

    if (selectedGame === "movie") {

        showCategories(
            "Select Movie Category",
            [
                "Hindi Movies",
                "Telugu Movies"
            ]
        );

    }


    // ================= SONG =================

    else if (selectedGame === "song") {

        showCategories(
            "Select Song Category",
            [
                "Hindi Songs",
                "Telugu Songs"
            ]
        );

    }


    // ================= WORD / CHARACTER =================

    else {

        selectedCategory = "";

        showTimer();

    }
}


// ================= CATEGORIES =================

function showCategories(title, categories) {

    document.getElementById("categoryPage").style.display =
        "block";

    document.getElementById("categoryTitle").innerText =
        title;

    let container =
        document.getElementById("categories");

    container.innerHTML = "";

    document.getElementById("letsPlayButton").style.display =
        "none";


    categories.forEach(function(category) {

        let box =
            document.createElement("div");

        box.className =
            "categoryBox";

        box.innerText =
            category;


        box.onclick = function() {

            let allBoxes =
                document.querySelectorAll(".categoryBox");


            allBoxes.forEach(function(item) {

                item.classList.remove("selected");

            });


            box.classList.add("selected");

            selectedCategory =
                category;


            document.getElementById(
                "letsPlayButton"
            ).style.display = "block";

        };


        container.appendChild(box);

    });
}


// ================= TIMER SETUP =================

function showTimer() {

    document.getElementById("categoryPage").style.display =
        "none";

    document.getElementById("timerPage").style.display =
        "flex";


    // Default = 2 minutes

    seconds = 120;

    updateTime();
}


// ================= CHANGE TIME =================

function changeTime(amount) {

    seconds = seconds + amount;


    // Minimum = 00:00

    if (seconds < 0) {

        seconds = 0;

    }


    updateTime();
}


// ================= DISPLAY SET TIME =================

function updateTime() {

    let minutes =
        Math.floor(seconds / 60);

    let remainingSeconds =
        seconds % 60;


    let formattedMinutes =
        String(minutes).padStart(2, "0");

    let formattedSeconds =
        String(remainingSeconds).padStart(2, "0");


    document.getElementById("time").innerText =
        formattedMinutes +
        ":" +
        formattedSeconds;
}


// ================= SHOW RULES =================

function showRules() {

    document.getElementById("timerPage").style.display =
        "none";

    document.getElementById("rulesPage").style.display =
        "flex";


    let rulesContainer =
        document.querySelector(".rules");


    // Remove old song rule

    let oldSongRule =
        document.getElementById("songRule");

    if (oldSongRule) {

        oldSongRule.remove();

    }


    // ================= SONG ONLY RULE =================

    if (selectedGame === "song") {

        let songRule =
            document.createElement("div");

        songRule.className =
            "ruleBox";

        songRule.id =
            "songRule";


        songRule.innerHTML = `

            <span>4</span>

            <p>
                Hum the song using the given word.
            </p>

        `;


        rulesContainer.appendChild(songRule);

    }
}


// ================= LOAD JSON DATA =================

async function loadGameData() {

    let file = "";


    // ================= MOVIES =================

    if (selectedGame === "movie") {

        if (selectedCategory === "Hindi Movies") {

            file = "data/hindi_movies.json";

        }

        else if (selectedCategory === "Telugu Movies") {

            file = "data/telugu_movies.json";

        }

    }


    // ================= SONGS =================

    else if (selectedGame === "song") {

        if (selectedCategory === "Hindi Songs") {

            file = "data/hindi_songs.json";

        }

        else if (selectedCategory === "Telugu Songs") {

            file = "data/telugu_songs.json";

        }

    }


    // ================= WORDS =================

    else if (selectedGame === "word") {

        file = "data/words.json";

    }


    // ================= CHARACTERS =================

    else if (selectedGame === "character") {

        file = "data/characters.json";

    }


    // ================= CHECK FILE =================

    if (file === "") {

        alert("Game data not selected.");

        return false;
    }


    try {

        let response =
            await fetch(file);


        if (!response.ok) {

            throw new Error("Could not load file");

        }


        gameItems =
            await response.json();


        // Shuffle items

        gameItems.sort(function() {

            return Math.random() - 0.5;

        });


        currentItem = 0;

        score = 0;


        return true;

    }


    catch (error) {

        console.log(error);


        alert(
            "Could not load the game data. " +
            "Make sure you are using Live Server."
        );


        return false;
    }
}


// ================= START ACTUAL GAME =================

async function startGame() {

    let loaded =
        await loadGameData();


    if (!loaded) {

        return;

    }


    if (gameItems.length === 0) {

        alert("No game items found.");

        return;

    }


    // Hide rules

    document.getElementById("rulesPage").style.display =
        "none";


    // Show game

    document.getElementById("gamePage").style.display =
        "flex";


    // Reset game

    gamePaused = false;

    score = 0;

    currentItem = 0;


    // Use selected time

    gameTimeLeft =
        seconds;


    // Reset pause button

    document.getElementById("pauseButton").innerText =
        "⏸";


    // Show first item

    showItem();


    // Start overall timer

    startGameTimer();
}


// ================= SHOW ITEM =================

function showItem() {

    // If all items are used,
    // shuffle and start again

    if (currentItem >= gameItems.length) {

        currentItem = 0;


        gameItems.sort(function() {

            return Math.random() - 0.5;

        });

    }


    let item =
        gameItems[currentItem];


    // ================= SONG =================

    if (selectedGame === "song") {

        document.getElementById("gameItem").innerText =
            item;


        // Pick ONE random word

        let randomIndex =
            Math.floor(
                Math.random() * songWords.length
            );


        let randomWord =
            songWords[randomIndex];


        let songHint =
            document.getElementById("songHint");


        songHint.innerText =
            randomWord;


        songHint.style.display =
            "flex";

    }


    // ================= OTHER GAMES =================

    else {

        document.getElementById("gameItem").innerText =
            item;


        document.getElementById("songHint").style.display =
            "none";

    }
}


// ================= OVERALL GAME TIMER =================

function startGameTimer() {

    clearInterval(gameTimer);


    updateGameTimer(gameTimeLeft);


    gameTimer =
        setInterval(function() {


            // Don't decrease while paused

            if (gamePaused) {

                return;

            }


            gameTimeLeft--;


            updateGameTimer(
                gameTimeLeft
            );


            // ================= TIME FINISHED =================

            if (gameTimeLeft <= 0) {

                gameTimeLeft = 0;


                updateGameTimer(
                    gameTimeLeft
                );


                clearInterval(gameTimer);


                endGame();

            }


        }, 1000);
}


// ================= GAME TIMER DISPLAY =================

function updateGameTimer(time) {

    let minutes =
        Math.floor(time / 60);


    let remainingSeconds =
        time % 60;


    let formattedMinutes =
        String(minutes).padStart(2, "0");


    let formattedSeconds =
        String(remainingSeconds).padStart(2, "0");


    document.getElementById("gameTimer").innerText =
        formattedMinutes +
        ":" +
        formattedSeconds;
}


// ================= PAUSE / RESUME =================

function togglePause() {

    if (gameTimeLeft <= 0) {

        return;

    }


    gamePaused =
        !gamePaused;


    let button =
        document.getElementById("pauseButton");


    if (gamePaused) {

        button.innerText =
            "▶";

    }

    else {

        button.innerText =
            "⏸";

    }
}


// ================= CORRECT =================

function correctAnswer() {

    if (gamePaused) {

        return;

    }


    // Add one point

    score++;


    // Next item immediately

    nextItem();
}


// ================= INCORRECT =================

function incorrectAnswer() {

    if (gamePaused) {

        return;

    }


    // No point

    nextItem();
}


// ================= SKIP =================

function skipItem() {

    if (gamePaused) {

        return;

    }


    // No point

    nextItem();
}


// ================= NEXT ITEM =================

function nextItem() {

    currentItem++;

    showItem();
}


// ================================================= */
/* ================= GAME OVER ==================== */
/* ================================================= */

function endGame() {

    clearInterval(gameTimer);

    gamePaused = false;


    // Show final score ONLY after
    // overall timer reaches 00:00

    document.getElementById("gamePage").innerHTML = `

        <div class="gameOver">

            <h1>Game Over!</h1>

            <h2>Your Final Score</h2>

            <div class="finalScore">
                ${score}
            </div>

            <p>Correct Answers</p>


            <div class="gameOverButtons">

                <button
                    id="playAgainButton"
                    onclick="playAgain()">
                    Play Again
                </button>


                <button
                    id="homeButton"
                    onclick="goHome()">
                    Home
                </button>

            </div>

        </div>

    `;
}


// ================================================= */
/* ================= PLAY AGAIN =================== */
/* ================================================= */

function playAgain() {

    // Hide game over page

    document.getElementById("gamePage").style.display =
        "none";


    // Show timer

    document.getElementById("timerPage").style.display =
        "flex";


    // Reset timer to default 2 minutes

    seconds = 120;

    updateTime();
}


// ================================================= */
/* ================= GO HOME ====================== */
/* ================================================= */

function goHome() {

    // Stop timer

    clearInterval(gameTimer);


    // Reset variables

    gamePaused = false;

    score = 0;

    currentItem = 0;

    gameTimeLeft = 120;


    // Reset selections

    selectedGame = "";

    selectedCategory = "";


    // Hide all pages

    document.getElementById("gamePage").style.display =
        "none";

    document.getElementById("rulesPage").style.display =
        "none";

    document.getElementById("timerPage").style.display =
        "none";

    document.getElementById("categoryPage").style.display =
        "none";


    // Show home

    document.getElementById("homePage").style.display =
        "block";


    // Remove selected box

    document.querySelectorAll(".gameBox").forEach(function(box) {

        box.classList.remove("selected");

    });

}