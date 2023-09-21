let searchbar = document.querySelector("form")
let wordInput = document.getElementById("word-input")
let searchButton = document.getElementById("search-button")
let main = document.querySelector("main")
let TARGET_WORD;
let linked_words;

const api_website = "https://api.dictionaryapi.dev/api/v2/entries/en/"

searchbar.addEventListener("submit", function(e){
e.preventDefault()
TARGET_WORD = wordInput.value
main.innerHTML = ""
try {

	fetch(api_website + TARGET_WORD)
  .then(response =>response.json())
  .then(data => {
    
    
    let wordInfo = document.createElement("div")
    wordInfo.classList = "word-info"
    let wordInfoLeft = document.createElement("div")
    let wordDisplay = document.createElement("h1")
    wordDisplay.textContent = TARGET_WORD.toLowerCase()
    wordInfoLeft.appendChild(wordDisplay)

    let phoneticDisplay = document.createElement("div")
    let phonetic;
    let audio;
    for (let arr of data[0].phonetics){
      if (arr.text) phonetic = arr.text
      if (arr.audio) audio = arr.audio
    }
    phoneticDisplay.textContent = phonetic
    wordInfoLeft.appendChild(phoneticDisplay)
    wordInfo.appendChild(wordInfoLeft)
    

    // give a pronouncation feature only is audio file is avialable
    if (audio){
    let pronounceButton = document.createElement("button")
    pronounceButton.classList= "pronounce-button"

    pronounceButton.innerHTML= "<i class='fas fa-volume-up'></i>"
    pronounceButton.addEventListener("click", function(){
      let pronouncation  = new Audio(audio)

      pronouncation.play()
    })
    wordInfo.appendChild(pronounceButton)
    }
    main.appendChild(wordInfo)

    let meanings = data[0].meanings
    
    for (let meaning of meanings ){
      let meaningDisplay = document.createElement("div")
      meaningDisplay.classList = "meaning"

      // part of speech
      let partOfSpeech = document.createElement("caption")
      partOfSpeech.innerHTML = meaning.partOfSpeech 
      meaningDisplay.appendChild(partOfSpeech)
      
      
      //definitions
      let definitions = meaning.definitions
      for (let def of definitions){
        let definitionDisplay = document.createElement('div')
        definitionDisplay.classList.add("definition")

        //definition sentence
        let definitionSentence = def.definition
        let definitionSentenceDisplay = document.createElement('div')
        definitionSentenceDisplay.classList.add("definition-sentence")
        definitionSentenceDisplay.innerHTML = definitionSentence
        definitionDisplay.appendChild(definitionSentenceDisplay)

        
        meaningDisplay.appendChild(definitionDisplay)
        

        /// example
        let example = def.example
        if (example) {
          let exampleDisplay = document.createElement('div')
          exampleDisplay.classList.add("example")
          exampleDisplay.innerHTML  = example
          definitionDisplay.appendChild(exampleDisplay)

        }
      }
      main.appendChild(meaningDisplay)

      // synonyms
      let synonymsDisplay = document.createElement("div")
      synonymsDisplay.classList = "synonym-display"
      let synonymsText = document.createElement("span")
      let synonyms = meaning.synonyms
      if (synonyms.length!=0) synonymsText.textContent = "Synonyms "
      synonymsDisplay.appendChild(synonymsText)
      for (let synonym of synonyms){
        let synonymWord = document.createElement('span')
        synonymWord.innerText = synonym
        synonymWord.classList = "synonym"
        synonymsDisplay.appendChild(synonymWord)
      }
      meaningDisplay.appendChild(synonymsDisplay)


      //antonyms
      let antonymsDisplay = document.createElement("div")
      antonymsDisplay.classList = "antonym-display"
      let antonymsText = document.createElement("span")
      let antonyms = meaning.antonyms
      if (antonyms.length!=0) antonymsText.textContent = "Antonyms: "
      antonymsDisplay.appendChild(antonymsText)
      for (let antonym of antonyms){
        let antonymWord = document.createElement('span')
        antonymWord.innerText = antonym
        antonymWord.classList = "antonym"
        antonymsDisplay.appendChild(antonymWord)
      }
      meaningDisplay.appendChild(antonymsDisplay)




    }
    


linked_words = main.querySelectorAll(".synonym, .antonym") 
linked_words.forEach(bindEventListener)
function bindEventListener(word){
  word.addEventListener("click", function(){
    wordInput.value = word.textContent
    console.log(wordInput.value)
    searchButton.click()

  })
}
  })
} catch (error) {
	console.error(error);
  console.log(error.message)
}
})



// // Detect the user's preferred theme


let toggleButton = document.getElementById("toggle-button")
let toggleIcon = toggleButton.querySelector("i")

function detectColorScheme() {
  var theme = "light"; // Default to light

  // Check if a theme is set in local storage
  if (localStorage.getItem("theme")) {
      if (localStorage.getItem("theme") == "dark") {
          theme = "dark";
      }
  } else if (!window.matchMedia) {
      // MatchMedia method not supported
      return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // OS theme setting detected as dark
      theme = "dark";
  }

  // Set the document with a data-theme attribute for dark theme
  if (theme == "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
  }
}
detectColorScheme()