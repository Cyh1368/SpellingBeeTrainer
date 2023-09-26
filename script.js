console.log("If you need help, the answer will be logged here. But try not to peek!")
function setVoiceID(id) {
    voiceID = id;
}
// Fetch and process the word file
var words = [];
var incorrectWords = [];

fetch('/wordbank/7000vocab.txt')
    .then(response => response.text())
    .then(data => {
        // Split the text into an array of words using newline as the separator
        const word = data.split('\n');
        // Remove any empty strings from the array
        words = word.filter(part => part.trim() !== '');
        for (var i=0; i<words.length; i++){
            words[i] = words[i].replace(/\r/g, '');
            words[i] = words[i].replace(/\r/g, '');
        }
        // console.log(words); // You can use this array as needed
    })
    .catch(error => console.error(error));

let voices;
let currentWordIndex;
let voiceID = 0;
function getRandomCurrentWordIndex() {
     return Math.floor(Math.random() * words.length);
}

// Add this variable to keep track of whether the panel is visible or hidden
let panelVisible = true;

// Function to toggle the incorrect words panel
function toggleIncorrectWordsPanel() {
    const wrongWordsPanel = document.getElementById("wrong-words-panel");

    // Toggle the visibility by changing the display property
    if (panelVisible) {
        wrongWordsPanel.style.display = "none";
    } else {
        wrongWordsPanel.style.display = "block"; // Or "flex", "inline-block", etc., depending on your layout
    }

    // Update the button text
    const toggleButton = document.getElementById("toggle-button");
    toggleButton.textContent = panelVisible ? "Show Incorrect Words" : "Hide Incorrect Words";

    // Update the panel visibility flag
    panelVisible = !panelVisible;
}

// Add an event listener to the toggle button
const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", toggleIncorrectWordsPanel);


const synth = window.speechSynthesis;
function setVoices() {
  return new Promise((resolve, reject) => {
  let timer;
  timer = setInterval(() => {
    if(synth.getVoices().length !== 0) {
      resolve(synth.getVoices());
      clearInterval(timer);
    }
  }, 10);
 })
}
setVoices().then(voices => {
    // console.log(voices);
    // Array to store words from words.txt (you can fetch this data from a server)
    const synth = window.speechSynthesis;

    let currentWordIndex = 0;
    const answerInput = document.getElementById("answer-input");
    const responseDiv = document.getElementById("response");

    // Function to speak the current word
    function speakCurrentWord() {
        // console.log(currentWordIndex);
        if (currentWordIndex < words.length) {
            const word = words[currentWordIndex];
            console.log(word);
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.voice = voices[voiceID];
            // console.log(utterance.voice);
            synth.speak(utterance);
        }
    }

    // Function to check the answer and provide a response
    // Modify the checkAnswer function
    function checkAnswer() {
        if (currentWordIndex < words.length) {
            const word = words[currentWordIndex];
            const userAnswer = answerInput.value.toLowerCase().trim();
            if (userAnswer === word.toLowerCase()) {
                responseDiv.textContent = "'" + word + "' is correct!";
                tempIndex = currentWordIndex;
                while (tempIndex == currentWordIndex) tempIndex = getRandomCurrentWordIndex();
                currentWordIndex = tempIndex;
                answerInput.value = "";
                
                // Update the wrong words panel
                updateWrongWordsPanel();
                speakCurrentWord();
            } else {
                responseDiv.textContent = "Incorrect. Try again.";
                // Add the incorrect word and user input to the array
                incorrectWords.push({ word, userAnswer });
                speakCurrentWord();
            }
        }
    }

    // Function to update the wrong words panel with the new child as the first item
    function updateWrongWordsPanel() {
        const wrongWordsList = document.getElementById("wrong-words-list");
        for (const item of incorrectWords) {
            const listItem = document.createElement("li");
            listItem.textContent = `You entered: "${item.userAnswer}" | Correct word: "${item.word}"`;
            
            // Insert the new child as the first item in the list
            wrongWordsList.insertBefore(listItem, wrongWordsList.firstChild);
        }
    }


    // Event listener for the "Next" button
    const checkButton = document.getElementById("check-button");
    checkButton.addEventListener("click", checkAnswer);

    const speakButton = document.getElementById("speak-button");
    speakButton.addEventListener("click", speakCurrentWord);
    // Speak the first word when the page loads
})