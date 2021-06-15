# Scrabble JS
## Simple webiste for scrabble cheating 
### [Open App](https://ed100miles.github.io/scrabbleJS/)

---

## What does it do?
The user enters their scrabble letters in the form and (if there's letters already on the board) can select which letter they want to play off. The app will then produce a list of words that it's possible for the user to play, along with their base score. The words can be clicked on and a definition of the word will be show. 

Once the user has chosen which word to play, they select on the board where they want to lay the first letter, enter the word they want to play, and then select if they want to play the word down or across. 

---

## How does it work?

The tricky bit is taking the users letters and the selected board letter and seeing if they match any of the valid scrabble words. A list of valid scrabble words and their definitions are available online, these have been formed into a JavaScript object that gets imported into the main script *index.js*. 

The most performant way I found for checking if a valid word is present in the input letters was to create an object with letters as the key and the value representing the number of times that letter is present. For example the object for the word *scrabble* would be {"s":1, "c":1, "r":1, "a":1, "b":2, "l":1, "e":1}. The script then iterates through each of the ~280,000 valid scrabble words building an object and seeing if the user letters object contains all the letter keys and if so, whether the value is greater than or equal to the valid word objects corresponding value. If these tests are met, the valid word is appended to the *matching words* list which is displayed on the browser once the process is complete. 

<!-- 
I initially considered using [Heap's algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm) to iterate through all possoble combinations of the input letters. But the number of combinations for n letters is n factorial, so for all eight letters there would be 40,320 combinations. Then we'd need to look at all combinations of each of the possible seven letters and each six letter selections from the different seven letter combinations and so on... The total number of permiations by my attempts at calculation ends up being 186,480 for 8 letters. Increasing to 1,854,720 if we had 9 letters.  -->