console.log("Hello world");

/**============================================
 *               DATA AND API
 *=============================================**/
// Data JSON
let data = {};
const levelDisplay = document.querySelector("#leveldisplay");
const prevLevel = document.querySelector("#prevlevel");
const nextLevel = document.querySelector("#nextlevel");

async function fetchData() {
	const response = await fetch("../data.json");
	data = await response.json();
	console.log("THE DATA:", data);
}

fetchData();

function playSound(url) {
	const audio = new Audio(url);
	audio
		.play()
		.catch((error) => console.error("Error playing the sound:", error));
}

let playsong = false;
const song = new Audio("./data/audios/seasons.mp3");
const durationContainer = document.querySelector("#duration");
const songButton = document.querySelector("#play-icon img");

song.addEventListener("loadedmetadata", () => {
	displayDuration();
});

const calculateTime = (secs) => {
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
	durationContainer.textContent = calculateTime(song.duration);
};

if (song.readyState > 0) {
	displayDuration();
} else {
	song.addEventListener("loadedmetadata", () => {
		displayDuration();
	});
}

// Seek slider (song progression)
const seekSlider = document.getElementById("seek-slider");

// when the slider changes, the song should change with it
seekSlider.addEventListener("change", () => {
	song.currentTime = seekSlider.value;
});

// the max of the slider is the max of the song
const setSliderMax = () => {
	seekSlider.max = Math.floor(song.duration);
};

// readyState is a built-in JS thing that checks whether an audio is loaded/ready to be played
if (song.readyState > 0) {
	displayDuration();
	setSliderMax();
} else {
	// if not loaded yet, wait for it to be loaded
	song.addEventListener("loadedmetadata", () => {
		displayDuration();
		setSliderMax();
	});
}

const currentTimeContainer = document.getElementById("current-time");

// when the user changes the slider input, the time changes
seekSlider.addEventListener("input", () => {
	currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

// upon change, the currentTime changes as well
seekSlider.addEventListener("change", () => {
	song.currentTime = seekSlider.value;
	if (song.currentTime === seekSlider.max) {
		songButton.src = "url(./img/startoverbutton.png)";
	}
});

// and its text also
song.addEventListener("timeupdate", () => {
	seekSlider.value = Math.floor(song.currentTime);
	currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

// Play the song
function playSong() {
	playsong = true;
	song.play();
	songButton.src = "./img/pausebutton.png";
}

function pauseSong() {
	playsong = false;
	song.pause();
	songButton.src = "./img/playbutton.png";
}

// API
const apiKey = "UGvJe4oBAcXQXhqsH80aSe7CwPk4r1cwKTrtP8Ai";

// Navigation sound effect
const navID = 106125;
const navURL = `https://freesound.org/apiv2/sounds/${navID}/?token=${apiKey}`;

// Shifting elements sound effect
const elementsID = 391250;
const elementsURL = `https://freesound.org/apiv2/sounds/${elementsID}/?token=${apiKey}`;

// Navigation sound effect
const likeID = 1234;
const likeURL = `https://freesound.org/apiv2/sounds/${likeID}/?token=${apiKey}`;

/**======================
 *    VARIABLES
 *========================**/
// Soundtrack ++ Music
const musicPlayer = document.querySelector("#audio-player-container");
const playButton = document.querySelector("#play-icon");

playButton.addEventListener("click", function () {
	if (playsong === false) {
		playSong();
	} else {
		pauseSong();
	}
});

// Username
const username = document.querySelector("#username");

// Nickname
const nickname = document.querySelector("#nickname");

// DIV with information
const information = document.querySelector(".information");

// Div background image
const backgroundImageMapping = {
	strengths: "url('./img/strengthsbox.jpg')",
	bio: "url('./img/biobox.jpg')",
	level: "url('./img/levelbox.jpg')",
	soundtrack: "url('./img/soundtrackbox.jpg')",
	native: "url('./img/nativetobox.jpg')",
};

// Div title
const infoHeading = document.querySelector("#infoname");

// Div body
const infoText = document.querySelector("#infotext");

// First circles/icons
const bio = document.querySelector(".bio");
const level = document.querySelector(".level");
const soundtrack = document.querySelector(".soundtrack");
const native = document.querySelector(".native");
const strengths = document.querySelector(".strengths");

// Then I determine the values of the degrees and positions of the circles
const degrees = [0, 72, 144, 216, 288];
const heights = [
	"-50%, 100%",
	"-50%, 50%",
	"-50%, -50%",
	"-50%, -50%",
	"-50%, 50%",
];

// I assign each element its fixed index, so bio always starts at 0 and thus the default height (front and low) and degrees (centered)
let elementDegreesIndex = {
	strengths: 0,
	bio: 1,
	level: 2,
	soundtrack: 3,
	native: 4,
};

// I also define the same names as those in the index
const elements = { strengths, bio, level, soundtrack, native };

// The elements need to rotate when the user clicks the button, so the element is selected, the index of that element is taken,
// then the index is used to adjust the height and position
function updateElementRotation(elementKey) {
	const element = elements[elementKey];
	let index = elementDegreesIndex[elementKey];
	let nextIndex = (index + 1) % degrees.length;

	// Check if the element goes back to position 0 after this
	if (nextIndex === 0) {
		// Temporarily set the degree to 0
		element.style.transition = "transform 0.5s ease-in-out";
		element.style.transform = `translate(${heights[0]}) rotateY(360deg) translateZ(100px)`;

		// I use a timeout to reset the degrees after the transition
		setTimeout(() => {
			// No transition to make it smooth
			element.style.transition = "none";
			// Reset the degree to 0
			element.style.transform = `translate(${heights[0]}) rotateY(0deg) translateZ(100px)`;
		}, 500);
	} else {
		// Normal rotation
		element.style.transition = "transform 0.5s ease-in-out";
		element.style.transform = `translate(${heights[nextIndex]}) rotateY(${degrees[nextIndex]}deg) translateZ(100px)`;
	}

	// Update the index for the next rotation
	elementDegreesIndex[elementKey] = nextIndex;

	// Update the information
	updateInformation(elementKey, degrees[nextIndex]);
}

function updateInformation(elementKey, currentDegree) {
	// Check if the currentDegree is 0
	if (currentDegree === 0) {
		// Update the background-image of .information based on the elementKey
		const category = data[elementKey];
		infoHeading.textContent = elementKey.toUpperCase();
		if (Array.isArray(category)) {
			if (elementKey === "native") {
				let fullHtml = ""; // Initialize an empty string to accumulate the HTML content
				category.forEach((livingInfo) => {
					for (const [key, value] of Object.entries(livingInfo)) {
						fullHtml += `${key}: ${value}<br />`; // Append each key-value pair with a line break
					}
				});
				infoText.innerHTML = fullHtml; // Set the innerHTML to include line breaks
			} else if (elementKey === "strengths") {
				// Start with an empty unordered list
				let listHtml = '<ul class="strength-bullet">';
				// Loop through each strength and add it as a list item
				category.forEach(function (strength) {
					listHtml += `<li>${strength}</li>`;
				});
				// Close the unordered list
				listHtml += "</ul>";
				// Set the innerHTML of infoText to the newly created list
				infoText.innerHTML = listHtml;
			}
		} else {
			infoText.textContent = category;
		}

		const imageUrl = backgroundImageMapping[elementKey];
		if (imageUrl) {
			// First check if imageUrl exists
			information.style.backgroundImage = imageUrl;
		}

		if (elementKey === "soundtrack") {
			musicPlayer.style.display = "block";
		} else {
			musicPlayer.style.display = "none";
		}

		if (elementKey === "level") {
			levelDisplay.style.display = "flex";
			prevLevel.textContent = category;
			nextLevel.textContent = `${category + 1}`;
			infoText.textContent = `Brianne is very close to level ${
				category + 1
			}! Her date of upgrade is February 24th. Keep your eye on her status to catch the upgrade live!`;
		} else {
			levelDisplay.style.display = "none";
		}

		fetch(elementsURL)
			.then((response) => response.json())
			.then((data) => {
				if (data && data.previews) {
					// Use the preview URL to play the sound
					playSound(data.previews["preview-hq-mp3"]);
				}
			})
			.catch((error) => console.error("Error fetching sound data:", error));
	}
}

document.getElementById("nextButton").addEventListener("click", function () {
	// Update rotation for each element based on the current index
	for (const elementKey in elements) {
		updateElementRotation(elementKey);
	}
});

function updateElementRotationBackward(elementKey) {
	const element = elements[elementKey];
	let index = elementDegreesIndex[elementKey];
	let prevIndex = (index - 1 + degrees.length) % degrees.length;

	// Determine the actual degrees the element should rotate to
	let targetDegree = degrees[prevIndex];

	// Handle the special case when going from 0 to the last element (e.g., 288 degrees)
	if (index === 0 && prevIndex === degrees.length - 1) {
		// Rotate the element to -72 degrees to make it seem like it continues from 360 to 288 degrees
		targetDegree = -72;
	}

	element.style.transition = "transform 0.5s ease-in-out";
	element.style.transform = `translate(${heights[prevIndex]}) rotateY(${targetDegree}deg) translateZ(100px)`;

	// Reset the rotation from -72 to 288 degrees without transition to make it seamless
	if (targetDegree === -72) {
		setTimeout(() => {
			element.style.transition = "none";
			element.style.transform = `translate(${heights[prevIndex]}) rotateY(${degrees[prevIndex]}deg) translateZ(100px)`;
		}, 500); // This should match the duration of your transition
	}

	elementDegreesIndex[elementKey] = prevIndex;

	// Update the information for reverse direction
	updateInformation(elementKey, degrees[prevIndex]);
}

document.getElementById("prevButton").addEventListener("click", function () {
	for (const elementKey in elements) {
		updateElementRotationBackward(elementKey);
	}
});
