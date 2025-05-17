document.addEventListener("DOMContentLoaded", function () {
    let selectedMood = null;
    let selectedActivity = null;

    const moodButtons = document.querySelectorAll(".mood-button");
    const activityButtons = document.querySelectorAll(".activity-btn");
    const backToMoodBtn = document.getElementById("back-to-mood");
    const backToActivityBtn = document.getElementById("back-to-activity");
    const newContentBtn = document.getElementById("new-content");

    // Screens
    const moodScreen = document.getElementById("mood-screen");
    const activityScreen = document.getElementById("activity-screen");
    const contentScreen = document.getElementById("content-screen");
    const contentDisplay = document.getElementById("content-display");

    function showScreen(screenToShow) {
        // Hide all screens
        [moodScreen, activityScreen, contentScreen].forEach(screen => screen.classList.remove("active"));
        screenToShow.classList.add("active");
    }

    // Step 1: Mood selection
    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedMood = button.dataset.mood;
            showScreen(activityScreen);
        });
    });

    // Step 2: Activity selection
    activityButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedActivity = button.dataset.activity;
            displayContent();
            showScreen(contentScreen);
        });
    });

    // Back buttons
    backToMoodBtn.addEventListener("click", () => {
        showScreen(moodScreen);
    });

    backToActivityBtn.addEventListener("click", () => {
        showScreen(activityScreen);
    });

    // New content button
    newContentBtn.addEventListener("click", () => {
    selectedMood = null;
    selectedActivity = null;
    contentDisplay.innerHTML = ""; // Optional: clear old message
    showScreen(moodScreen); // Go back to first screen
    });


    function displayContent() {
    const message = `You selected: <strong>${selectedMood}</strong> and <strong>${selectedActivity}</strong>`;
    contentDisplay.innerHTML = `<p>${message}</p>`;
    }

});
