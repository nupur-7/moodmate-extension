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


    async function displayContent() {
        const message = `You selected: <strong>${selectedMood}</strong> and <strong>${selectedActivity}</strong>`;
        contentDisplay.innerHTML = `<p>${message}</p>`;

        if(selectedActivity=="joke")
        {
            //fetch a random joke from the API
            try{
                // https://icanhazdadjoke.com/ this api can also be used 
                const response=await fetch("https://official-joke-api.appspot.com/random_joke",{
                    headers:{
                        "Accept":"application/json"
                    }
                });
                const joke=await response.json();
                const jokesetup=joke.setup;
                const jokePunchline=joke.punchline;
                contentDisplay.innerHTML += `<p>${jokesetup}</p>`;
                contentDisplay.innerHTML += `<p>${jokePunchline}</p>`;
                // contentDisplay.innerHTML += `<p>${joke}</p>`; for icanhazdadjoke. api
            }
            catch(error){
                console.error("Error fetching joke:", error);
                contentDisplay.innerHTML += `<p>Oops! Couldn't fetch a joke right now.</p>`;
            }
        }

        if(selectedActivity=="fact"){
            //fetch a random fact from the API
            try{
                const response=await fetch("https://api.api-ninjas.com/v1/facts",{
                    headers:{
                        "Accept":"application/json",
                        "X-Api-Key":Api_Ninja_key
                    }
                });
                const factdata=await response.json();
                const factText=factdata[0].fact;
                contentDisplay.innerHTML += `<p>Did you know?</p>`;
                contentDisplay.innerHTML += `<p>${factText}</p>`;
            }
            catch(error){
                console.error("Error fetching fact:", error);
                contentDisplay.innerHTML += `<p>Oops! Couldn't fetch a fact right now.</p>`;
            }
        }
    }
});
