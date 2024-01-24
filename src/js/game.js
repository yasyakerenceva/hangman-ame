import { WORLD, KEYBOARD_LETTERS } from "./consts";

const gameElement = document.getElementById("game");
const logoElement = document.getElementById("logo");

let triesLeft;
let winCount;

const createPlaceholderHTML = () => {
	const word = sessionStorage.getItem("word");
	const placeholdersArray = Array.from("_".repeat(word.length));

	const placeholderHTML = placeholdersArray.reduce(
		(acc, curr, index) =>
			acc + `<h2 id="letter_${index}" class="letter">${curr}</h2>`,
		""
	);

	return `<div id="placeholders" class="placeholders-wrapper">${placeholderHTML}</div>`;
};

const createKeyboard = () => {
	const keyboardElement = document.createElement("div");
	keyboardElement.classList.add("keyboard");
	keyboardElement.id = "keyboard";

	const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
		return (
			acc +
			`<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`
		);
	}, "");

	keyboardElement.innerHTML = keyboardHTML;

	return keyboardElement;
};

const createHangmanImg = () => {
	const imageElement = document.createElement("img");
	imageElement.src = "images/hg-0.png";
	imageElement.alt = "hangman image";
	imageElement.classList.add("hangman-img");
	imageElement.id = "hangman-img";

	return imageElement;
};

const checkLetter = (letter) => {
	const word = sessionStorage.getItem("word");
	const inputLetter = letter.toLowerCase();

	if (!word.includes(inputLetter)) {
		const triesCounter = document.getElementById("tries-left");
		triesLeft -= 1;
		triesCounter.innerText = triesLeft;

		const hangmanImg = document.getElementById("hangman-img");
		hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
		if (triesLeft === 0) {
			stopGame("lose");
		}
	} else {
		const wordArray = Array.from(word);

		wordArray.forEach((currentLetter, index) => {
			if (currentLetter === inputLetter) {
				winCount += 1;
				if (winCount === word.length) {
					stopGame("win");
					return;
				}
				document.getElementById(`letter_${index}`).innerText =
					inputLetter.toUpperCase();
			}
		});
	}
};

const stopGame = (status) => {
	document.getElementById("placeholders").remove();
	document.getElementById("tries").remove();
	document.getElementById("keyboard").remove();
	document.getElementById("quit").remove();

	const word = sessionStorage.getItem("word");

	switch (status) {
		case "win":
			document.getElementById("hangman-img").src = "images/hg-win.png";
			document.getElementById("game").innerHTML +=
				'<h2 class="result-header win">You win!</h2>';
			break;
		case "lose":
			document.getElementById("game").innerHTML +=
				'<h2 class="result-header lose">You lost :(</h2>';
			break;
		case "quit":
			document.getElementById("hangman-img").remove();
			logoElement.classList.remove("logo-sm");
			break;
		default:
	}

	document.getElementById(
		"game"
	).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`;

	document.getElementById("play-again").onclick = startGame;
};

export const startGame = () => {
	triesLeft = 10;
	winCount = 0;

	logoElement.classList.add("logo-sm");
	const randomIndex = Math.floor(Math.random() * WORLD.length);
	const wordToGuess = WORLD[randomIndex];

	sessionStorage.setItem("word", wordToGuess);

	gameElement.innerHTML = createPlaceholderHTML();

	gameElement.innerHTML +=
		'<p id="tries" class="mt-3">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>';

	const keyboardElement = createKeyboard();
	keyboardElement.addEventListener("click", (e) => {
		if (e.target.tagName.toLowerCase() === "button") {
			e.target.disabled = true;
			checkLetter(e.target.id);
		}
	});
	gameElement.appendChild(keyboardElement);

	const hangmanImg = createHangmanImg();
	gameElement.prepend(hangmanImg);

	gameElement.insertAdjacentHTML(
		"beforeend",
		'<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>'
	);

	document.getElementById("quit").onclick = () => {
		const isSure = confirm(
			"Are you sure you want to quit and lose progress?"
		);
		if (isSure) {
			stopGame("quit");
		}
	};
};
