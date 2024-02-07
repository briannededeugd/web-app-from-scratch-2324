console.log("Hello world");

/**======================
 *    VARIABLES
 *========================**/

// Data JSON
const data = [
	{
		name: "Brianne",
		nickname: "@bri",
		level: 20,
		bio: "Brianne is a third-year Communication & Multimedia Design student. She gains happiness from animals, the color green and pretty environments. Avoid insects, rush hour and long queues to keep her happy!",
		strengths: ["Cool", "Calm", "Collected"],
		native: [
			{ BORN: "Alkmaar" },
			{ LIVING: "Almere" },
			{ "OFTEN FOUND IN": "Amsterdam" },
		],
		soundtrack: "../audios/dadadadada",
		favorite_game: [
			"The Sims",
			"Minecraft",
			"Super Mario Bros",
			"Killer Sudoku",
		],
	},
	{
		name: "Elaine",
		nickname: "@elaine",
		age: 22,
		bio: "Brianne is a third-year Communication & Multimedia Design student. She gains happiness from animals, the color green and pretty environments. Avoid insects, rush hour and long queues to keep her happy!",
		strengths: ["Cool", "Calm", "Collected"],
		native: [
			{ BORN: "Alkmaar" },
			{ LIVING: "Almere" },
			{ "OFTEN FOUND IN": "Amsterdam" },
		],
		soundtrack: "../audios/dadadadada",
		favorite_game: [
			"The Sims",
			"Minecraft",
			"Super Mario Bros",
			"Killer Sudoku",
		],
	},
];
console.log("THE DATA:", data);

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
		const imageUrl = backgroundImageMapping[elementKey];
		if (imageUrl) {
			// First check if imageUrl exists
			information.style.backgroundImage = imageUrl;
		}
	}
}

document.getElementById("nextButton").addEventListener("click", function () {
	console.log("let's rotate");
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
	console.log("rotating back");
	for (const elementKey in elements) {
		updateElementRotationBackward(elementKey);
	}
});
