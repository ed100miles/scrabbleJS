import {scrabbleWords} from './scrabbleWords.js'

const board = document.querySelector('.board');
const findWordsBtn = document.querySelector('#find-words-btn');
const playWordBtn = document.querySelector('#play-word-btn');
const errorMsg = document.querySelector('#error-msg');
const wordList = document.querySelector('.word-list');
const wordListItem = document.querySelector('.word-list li');
const definitionDiv = document.querySelector('.definition-div')
let playWordInput = document.querySelector('#play-word-input');
let userLettersInput = document.querySelector('#letters-input');
let targetTile;
let scrabbleKeys = Object.keys(scrabbleWords);
let matchingWords = [];


// Generate 15*15 sqaures in board
for(let x = 0; x<15; x++ ){
    for(let y = 0; y < 15; y++){
        let square = document.createElement('span');
        square.classList.add('square');
        square.id = `coord-${x+1}-${y+1}`;
        square.textContent = `.`; //${x+1}
        board.appendChild(square);
    }
}

document.querySelector('#coord-8-8').classList.add('.selectedSquare')

function boardClick(e){
    if(targetTile !== document.querySelector(`#${e.target.id}`)){
        if(targetTile !== undefined){targetTile.classList.remove('selectedSquare')}
        targetTile = document.querySelector(`#${e.target.id}`);
        targetTile.classList.add('selectedSquare');
        // console.log(targetTile.id);
    }
}

function playWordValidation(word){
    let targetTileVals = targetTile.id.split('-');
    // console.log(typeof(targetTileVals[1]))
    if(word.length === 0){
        errorMsg.textContent = 'Choose a word to play.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    }
    else if(word.length > 15){
        errorMsg.textContent = 'To many letters.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    } 
    else if(!/^[a-zA-Z]+$/i.test(word)){
        errorMsg.textContent = 'You can only play letters.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    } 
    else if(targetTile === undefined){
        errorMsg.textContent = 'Click on the board where you want the first tile to go.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    }
    else if(document.querySelector('#down').checked && (Number(targetTileVals[1])+word.length)>16){
        errorMsg.textContent = 'That word doesn\'t fit.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    }
    else if(document.querySelector('#across').checked && (Number(targetTileVals[2])+word.length)>16){
        errorMsg.textContent = 'That word doesn\'t fit.';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    }
    else {
        return true;
    }
}

function playWord(e){
    e.preventDefault();
    let wordValidated = playWordValidation(playWordInput.value);
    if (wordValidated){
        let xCoord = Number(targetTile.id.split('-')[1]);
        let yCoord = Number(targetTile.id.split('-')[2]);
        if(document.querySelector('#down').checked){
            targetTile.classList.remove('selectedSquare');
            for(let x = 0 ; x < playWordInput.value.length; x++ ){
                targetTile.textContent = playWordInput.value[x].toUpperCase();
                targetTile.style.color = 'black';
                targetTile = document.querySelector(`#coord-${xCoord+x+1}-${yCoord}`);
                // console.log(playWordInput.value[x])
                // console.log(xCoord, yCoord+x)
            }
        } else {
            targetTile.classList.remove('selectedSquare')
            for(let x = 0 ; x < playWordInput.value.length; x++ ){
                targetTile.textContent = playWordInput.value[x].toUpperCase();
                targetTile.style.color = 'black';
                targetTile = document.querySelector(`#coord-${xCoord}-${yCoord+x+1}`);
                // console.log(playWordInput.value[x])
                // console.log(xCoord, yCoord+x)
            }
        }
        targetTile = undefined;
    }
}

function letterCount(word){
    let letterCountObj = {};
    for(let letter of word){
        if(letter in letterCountObj){
            letterCountObj[letter] += 1;
        } 
        else {
            letterCountObj[letter] = 1;
        }
    }
    return letterCountObj;
}

function matchWords(userLetters, scrabbleWord){
        let userLettersCount = letterCount(userLetters);
        let scrabbleWordLettersCount = letterCount(scrabbleWord);
        for(let letter of scrabbleWord){
            if(userLettersCount[letter] === undefined || scrabbleWordLettersCount[letter] > userLettersCount[letter]){
                return false;
        }
    }
    return true;
}

function onMatchAppend(userLetters, scrabbleWord){
    scrabbleWord = scrabbleWord.toLowerCase();
    if(matchWords(userLetters, scrabbleWord)){
        matchingWords.push(scrabbleWord)
    }
}

function getScore(matchingWords){
    let wordsWithScores = [];
    for(let word of matchingWords){
        let wordScore = 0;
        for(let letter of word){
            if(/a|e|i|o|u|l|n|s|t|r/.test(letter)){
                wordScore += 1;
            } else if(/d|g/.test(letter)){
                wordScore += 2;
            } else if(/b|c|m|p/.test(letter)){
                wordScore += 3;
            } else if(/f|h|v|w|y/.test(letter)){
                wordScore += 4;
            } else if(/k/.test(letter)){
                wordScore += 5;
            } else if(/j|x/.test(letter)){
                wordScore += 8;
            }else if(/q|z/.test(letter)){
                wordScore += 10;
            }
        }
        wordsWithScores.push([word, wordScore])
    }
    return wordsWithScores.sort((a,b) => b[1] - a[1])
}

function findWords(e){
    e.preventDefault();
    wordList.innerHTML = "";
    matchingWords = [];
    // selectedSquare adds the board letter to the users letters. 
    let userLetters = userLettersInput.value 
    if(document.querySelector('.selectedSquare') !== null &&
        document.querySelector('.selectedSquare').textContent !== '.'){
        userLetters += document.querySelector('.selectedSquare').textContent;
    };
    userLetters = userLetters.toLowerCase();
    // console.log(userLetters)
    if(!/^[a-zA-Z]+$/i.test(userLetters)){
        errorMsg.textContent = 'You can only play letters or \'_\' (underscore).';
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 3000);
        return false;
    }
    scrabbleKeys.forEach(element => onMatchAppend(userLetters, element));
    let wordsWithScores = getScore(matchingWords);
    for(let word of wordsWithScores){
        let wordForList = document.createElement('li');
        wordForList.innerHTML = `${word[0].charAt(0).toUpperCase() + word[0].slice(1)} (Scores:${word[1]})`;
        wordList.appendChild(wordForList)
    }
}

function getDefinition(e){
    let wordToDefine = e.target.innerText.split(' ')[0].toUpperCase();
    console.log(wordToDefine)
    let definition = scrabbleWords[wordToDefine];
    console.log(definition)
    definitionDiv.innerHTML = (`${wordToDefine}: ${definition}`)
}


board.addEventListener('click', boardClick)

playWordBtn.addEventListener('click', playWord);

findWordsBtn.addEventListener('click', findWords);

wordList.addEventListener('click', getDefinition)
