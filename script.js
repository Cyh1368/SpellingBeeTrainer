console.log("If you need help, the answer will be logged here. But try not to peek!")
function setVoiceID(id) {
    voiceID = id;
}
// Fetch and process the word file
var words = [];

fetch('words.txt')
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
    function checkAnswer() {
        if (currentWordIndex < words.length) {
            const word = words[currentWordIndex];
            const userAnswer = answerInput.value.toLowerCase().trim();
            if (userAnswer === word.toLowerCase()) {
                responseDiv.textContent = "'" + word + "' is correct!";
                tempIndex = currentWordIndex;
                while (tempIndex==currentWordIndex) tempIndex = getRandomCurrentWordIndex();
                currentWordIndex = tempIndex;
                // console.log("RANDOM: " + currentWordIndex);
                answerInput.value = "";
                speakCurrentWord();
            } else {
                responseDiv.textContent = "Incorrect. Try again.";
                speakCurrentWord();
            }
        }
    }

    // Event listener for the "Next" button
    const checkButton = document.getElementById("check-button");
    checkButton.addEventListener("click", checkAnswer);

    const speakButton = document.getElementById("speak-button");
    speakButton.addEventListener("click", speakCurrentWord);
    // Speak the first word when the page loads
})