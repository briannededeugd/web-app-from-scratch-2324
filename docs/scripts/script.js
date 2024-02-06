console.log("Hello world");

/**======================
 *    VARIABELEN
 *========================**/
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
	// Update de transform property naar het volgende graad, ga zo door de array heen
	element.style.transform = `translate(${heights[index]}) rotateY(${degrees[index]}deg) translateZ(100px)`;
	// Update de index voor de volgende keer, mag niet hoger dan de degrees.length
	elementDegreesIndex[elementKey] = (index + 1) % degrees.length;
}

document.getElementById("nextButton").addEventListener("click", function () {
	console.log("let's rotate");
	// Update de rotatie voor elk element op basis vd huidige index
	for (const elementKey in elements) {
		updateElementRotation(elementKey);
	}
});
