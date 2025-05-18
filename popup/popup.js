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
                        "X-Api-Key":API_NINJA_KEY
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

        const moodquotes={
            happy: [
                "Happiness looks good on you — keep glowing!",
                "Life isn’t perfect, but there are perfect little moments — like this one!",
                "Laugh loud. Love big. Live fully.",
                "Enjoy the little things, because one day you’ll look back and realize they were the big things.",
                "You radiate joy — the world notices!",
                "Wishing you a day filled with even more moments that make you this happy.",
                "May this happy feeling linger with you throughout the day.",
                "Embrace this happiness and let it fuel your day!",
                "Enjoy this beautiful feeling! The world is brighter when you're smiling.",
                "So glad you're feeling good! Soak it all in.",
                "Your smile might just make someone else’s day — don’t hide it!",
                "You deserve all the happiness in the world — enjoy every moment!",
                "Happiness looks the best on you!"
            ],
            sad: [
                "Sadness flies away on the wings of time.",
                "Even the darkest night will end and the sun will rise.",
                "Healing takes time — be kind to yourself today.",
                "It’s okay to not be okay. Brighter days are ahead — just hold on.",
                "Your story isn’t over yet; this is just a tough chapter.",
                "Sadness is like a passing storm — ride it out, and you’ll find peace again.",
                "You’ve made it through 100% of your worst days — you’re stronger than you think.",
                "It’s okay to feel sad sometimes. Just remember, it’s a feeling, not a permanent state.",
                "Sadness is a part of life, but it doesn’t define you.",
                "Let yourself feel, but don't let it consume you. Better days are ahead.",
                "You are valuable, you are loved, and things will get better.",
                "This feeling is temporary. You’ve survived storms before — you’ll do it again.",
                "It’s okay to cry. It’s okay to feel. Just remember, you are not alone.",
                "Take a deep breath. You’re doing the best you can, and that’s enough.",
                "You are stronger, braver, and more loved than you realize.",
                "No rain, no flowers. Sometimes pain makes space for growth.",
                "Sometimes the bravest thing you can do is just keep going.",
                "You are enough just as you are.",
                "Think of something that makes you smile. Hold onto that feeling."
            ],
            angry: [
                "For every minute you are angry you lose sixty seconds of happiness.",
                "Breathe. It's just a bad moment, not a bad life.",
                "Anger is a feeling that makes your mouth work faster than your mind.",
                "Sometimes, walking away has nothing to do with weakness, and everything to do with strength.",
                "The less you respond to negativity, the more peaceful your life becomes.",
                "Feel it, acknowledge it, release it. Your peace matters more.",
                "Anger doesn’t solve anything. It builds nothing, but it can destroy everything.",
                "Remember your strength and how far you've come. This moment doesn't define you.",
                "Pause. Take a deep breath. Choose peace over the storm.",
                "Speak when you are angry and you will make the best speech you will ever regret.",
                "Anger is a choice. Choose wisely.",
                "You don’t have to attend every argument you’re invited to."
            ],
            bored: [
                "Sometimes being bored is just your imagination stretching its arms.",
                "Boredom always precedes a period of great creativity.",
                "The cure for boredom is curiosity. There is no cure for curiosity.",
                "Even a walk outside or a new song can turn a dull moment into a story worth telling.",
                "Use boredom as a signal—it means it’s time to try something new!",
                "You are one idea away from excitement.",
                "Boredom is just the reverse side of fascination: both depend on being outside rather than inside a situation.",
                "Go outside. Nature is never boring.",
                "Maybe boredom is just restlessness in disguise. What exciting thing could you do right now?",
                "A little boredom can inspire great creativity. What's waiting to be discovered by you?",
                "Boredom is the first step to creativity. What will you create today?",
            ],
            stressed: [
                "You don't have to control your thoughts. You just have to stop letting them control you." ,
                "Almost everything will work again if you unplug it for a few minutes... including you.",
                "Stress is not what happens to us. It's our response to what happens. And response is something we can choose.",
                "Take a deep breath. It’s just a bad day, not a bad life.",
                "Slow down. You’re doing fine. You can’t be everything you want to be before your time." ,
                "Worrying does not take away tomorrow’s troubles. It takes away today’s peace.",
                "It’s okay to not have everything figured out right now. Breathe. One step at a time.",
                "Stress is like a rocking chair. It gives you something to do but gets you nowhere.",,
                "You can’t stop the waves, but you can learn to surf.",
                "Inhale peace. Exhale stress.",
                "Tension is who you think you should be. Relaxation is who you are.",
                "Just breathe. You are strong, and you will get through this.",
                "This too shall pass. Take a moment for yourself.",
                "Sometimes, the most productive thing you can do is to relax.",
                "The greatest weapon against stress is our ability to choose one thought over another." 
            ],
            tired:[
                "The best way to recharge is to unplug.",
                "Sometimes the most productive thing you can do is relax.",
                "Rest is not idleness, and to lie sometimes on the grass under trees",
                "Rest if you must, but don’t you quit.",
                "Sometimes the most productive thing you can do is rest and let your soul catch up with your body.",
                "You’ve done enough. Take a moment to just breathe and be proud of yourself.",
                "You’re allowed to be both a masterpiece and a work in progress at the same time.",
                "Even on the hardest days, you are still moving forward. That’s something to be proud of.",
                "Don’t stop now. You’re closer than you think.",
                "You don’t have to be perfect to be amazing.",
                "One small positive thought in the morning can change your whole day.",
                "Don't count the days, make the days count. You're doing great.",
                "A little progress each day adds up to big results. Keep going, even if it's slowly.",
                "Almost there! Imagine how good it will feel to rest later.",
                "You are not a drop in the ocean. You are the entire ocean in a drop.",
                "Think of something that makes you smile. Hold onto that feeling."
            ],
            anxious:[
                "Nothing diminishes anxiety faster than action.",
                "Just when the caterpillar thought the world was over, it became a butterfly.",
                "This too shall pass. You’ve survived 100% of your worst days.",
                "You don’t have to control your thoughts. You just have to stop letting them control you.",
                "Worrying means you suffer twice.",
                "You are bigger than what’s making you anxious.",
                "Feelings are just visitors. Let them come and go.",
                "Sometimes, the most important thing in a whole day is the rest we take between two deep breaths.",
                "You are not your thoughts. You are the awareness behind them.",
                "Be gentle with yourself. You’re doing the best you can.",
                "You are stronger than your anxieties.",
                "It's okay not to be okay. What matters is that you keep going.",
                "Worry does not empty tomorrow of its sorrow, it empties today of its strength.",
                "Breathe. It's just a feeling, and feelings pass."
            ]
        };
        if (selectedActivity === "quote") {
            const quotes = moodquotes[selectedMood];
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];

            contentDisplay.innerHTML += `<p>Here's a quote for you:</p>`;
            contentDisplay.innerHTML += `<p>"${randomQuote}"</p>`;
        }
    }
});
