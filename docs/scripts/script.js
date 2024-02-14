/**========================================================================
 * ?                                ABOUT
 * @author         :  Brianne de Deugd
 * @email          :  brianne.de.deugd@hva.nl
 * @repo           :  https://github.com/briannededeugd/web-app-from-scratch-2324
 * @createdOn      :  February 5th, 2024
 * @description    :  This is my individual site for the course Web App From Scratch, Academic Year 2324, AUAS
 *========================================================================**/

console.log("Hello world");

/**============================================
 *               DATA AND API
 *=============================================**/
// Data JSON
let data = {};

async function fetchData() {
	const response = await fetch("./data.json");
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

/**============================================
 *         SOUNDTRACK SONG FUNCTIONALITY
 *=============================================**/

// Variables
let playsong = false;
const song = new Audio("./data/audios/seasons.mp3");
const durationContainer = document.querySelector("#duration");
const songButton = document.querySelector("#play-icon img");
const seekSlider = document.getElementById("seek-slider"); // song progression
const currentTimeContainer = document.getElementById("current-time");
const musicPlayer = document.querySelector("#audio-player-container");
const playButton = document.querySelector("#play-icon");

song.addEventListener("loadedmetadata", () => {
	displayDuration();
});

/**======================
 *    DISPLAYING TIME
 *========================**/

// Calculate time function to call upon when the time is called / needs to be transformed
const calculateTime = (secs) => {
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
};

// Display the duration of the song in the frontend
const displayDuration = () => {
	durationContainer.textContent = calculateTime(song.duration);
};

/**======================
 *    SLIDER INTERACTION
 *========================**/
// Make sure that the song is ready before displaying duration, otherwise wait until it is with loadedmetadata
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

// When the slider changes, the song should change with it
seekSlider.addEventListener("change", () => {
	song.currentTime = seekSlider.value;
});

// The max of the slider is equal to the max of the song
const setSliderMax = () => {
	seekSlider.max = Math.floor(song.duration);
};

/**======================
 *      SONG CHANGE ON
 * 		SLIDER CHANGE
 *========================**/

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

/**======================
 *    PLAYING AND PAUSING
 *========================**/
playButton.addEventListener("click", function () {
	if (playsong === false) {
		playSong();
	} else {
		pauseSong();
	}
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

/**============================================
 *               		API
 *=============================================**/

// API key
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

/**============================================
 *          INFORMATION BOX VARIABLES
 *=============================================**/
// Level Element
const levelDisplay = document.querySelector("#leveldisplay");
const prevLevel = document.querySelector("#prevlevel");
const nextLevel = document.querySelector("#nextlevel");

// Metadata
const username = document.querySelector("#username");
const nickname = document.querySelector("#nickname");

// Same for all elements
const information = document.querySelector(".information");
const infoHeading = document.querySelector("#infoname");
const infoText = document.querySelector("#infotext");

// Background image of box is dependent on element
const backgroundImageMapping = {
	strengths: "url('./img/strengthsbox.jpg')",
	bio: "url('./img/biobox.jpg')",
	level: "url('./img/levelbox.jpg')",
	soundtrack: "url('./img/soundtrackbox.jpg')",
	native: "url('./img/nativetobox.jpg')",
};

/**============================================
 *              ROTATION VARIABLES
 *=============================================**/

// Element icons
const bio = document.querySelector(".bio");
const level = document.querySelector(".level");
const soundtrack = document.querySelector(".soundtrack");
const native = document.querySelector(".native");
const strengths = document.querySelector(".strengths");

// Determine the values of the degrees and positions of the elements around 'my' head
const degrees = [0, 72, 144, 216, 288];
const heights = [
	"-50%, 150%",
	"-50%, 50%",
	"-50%, -100%",
	"-50%, -100%",
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

/**========================================================================
 *                           FUNCTIONS
 *========================================================================**/

/**============================================
 *          UPDATE ELEMENT ROTATIONS
 *=============================================**/
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

/**============================================
 *     UPDATE THE SHOWN INFORMATION BASED
 * 		ON ELEMENT @ THE FRONT (FORWARD)
 *=============================================**/
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

// Event listener for rotating forwards on click
document.getElementById("nextButton").addEventListener("click", function () {
	// Update rotation for each element based on the current index
	for (const elementKey in elements) {
		updateElementRotation(elementKey);
	}
});

/**============================================
 *     UPDATE THE SHOWN INFORMATION BASED
 *     ON ELEMENT @ THE FRONT (BACKWARDS)
 *=============================================**/
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

// Event listener for rotating backwards on click
document.getElementById("prevButton").addEventListener("click", function () {
	for (const elementKey in elements) {
		updateElementRotationBackward(elementKey);
	}
});
