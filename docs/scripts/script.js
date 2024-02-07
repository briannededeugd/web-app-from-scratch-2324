console.log("Hello world");

/**======================
 *    VARIABELEN
 *========================**/
// DIVS met info
const information = document.querySelector(".information");

const backgroundImageMapping = {
	strengths: "url('./img/strengthsbox.jpg')",
	bio: "url('./img/biobox.jpg')",
	level: "url('./img/levelbox.jpg')",
	soundtrack: "url('./img/soundtrackbox.jpg')",
	native: "url('./img/nativetobox.jpg')",
};

// Eerst cirkels/iconen
const bio = document.querySelector(".bio");
const level = document.querySelector(".level");
const soundtrack = document.querySelector(".soundtrack");
const native = document.querySelector(".native");
const strengths = document.querySelector(".strengths");

// Vervolgens bepaal ik de waardes van de graden en posities van de cirkels
const degrees = [0, 72, 144, 216, 288];
const heights = [
	"-50%, 100%",
	"-50%, 50%",
	"-50%, -50%",
	"-50%, -50%",
	"-50%, 50%",
];

// Elk element geef ik hun vaste index, dus bio begint altijd bij 0 en dus de standaard hoogte (vooraan en laag) en graden (gecentreerd)
let elementDegreesIndex = {
	strengths: 0,
	bio: 1,
	level: 2,
	soundtrack: 3,
	native: 4,
};

// Ook definieer ik dezelfde namen zoals die in de index staan
const elements = { strengths, bio, level, soundtrack, native };

// De elementen moeten roteren als de gebruiker op de knop drukt, dus het element wordt gepakt, de index van dat element wordt gepakt,
// dan wordt de index gebruikt om de hoogte en positie aan te passen
function updateElementRotation(elementKey) {
	const element = elements[elementKey];
	let index = elementDegreesIndex[elementKey];
	let nextIndex = (index + 1) % degrees.length;

	// Check of het element weer naar positie 0 gaat hierna
	if (nextIndex === 0) {
		// Tijdelijk de degree naar 0 zetten
		element.style.transition = "transform 0.5s ease-in-out";
		element.style.transform = `translate(${heights[0]}) rotateY(360deg) translateZ(100px)`;

		// Ik gebruik een timeout om de degrees weer te resetten na de transitie
		setTimeout(() => {
			// Geen transitie om het smooth te maken
			element.style.transition = "none";
			// Reset de degree naar 0
			element.style.transform = `translate(${heights[0]}) rotateY(0deg) translateZ(100px)`;
		}, 500);
	} else {
		// Normale rotation
		element.style.transition = "transform 0.5s ease-in-out";
		element.style.transform = `translate(${heights[nextIndex]}) rotateY(${degrees[nextIndex]}deg) translateZ(100px)`;
	}

	// Update de index voor de volgende rotatie
	elementDegreesIndex[elementKey] = nextIndex;

	// Update de informatie
	updateInformation(elementKey, degrees[nextIndex]);
}

function updateInformation(elementKey, currentDegree) {
	// Check of de currentDegree 0 is
	if (currentDegree === 0) {
		// Update de background-image van .information op basis van de elementKey
		const imageUrl = backgroundImageMapping[elementKey];
		if (imageUrl) {
			// Check eerst of imageUrl bestaat
			information.style.backgroundImage = imageUrl;
		}
	}
}

document.getElementById("nextButton").addEventListener("click", function () {
	console.log("let's rotate");
	// Update de rotatie voor elk element op basis vd huidige index
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
