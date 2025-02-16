document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Load CrossFit abbreviations and content types
        const crossfitData = await loadCrossfitDict();
        const crossfitAbbr = crossfitData.abbreviations || {};
        const contentTypes = crossfitData.types || {};

        // Fetch WOD data
        const response = await fetch("./data/beta_studio.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Set the box name
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Select a random WOD for display
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Randomly select 3-6 elements from the WOD, ensuring they make sense
        const wodKeys = Object.keys(wod);
        const randomWodKeys = getRandomElements(wodKeys, 3, 6);

        // Format and display WOD sections dynamically
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear existing content

        randomWodKeys.forEach(key => {
            container.appendChild(createBox(key, wod[key], crossfitAbbr, contentTypes));
        });

        // Set the current date
        const dateElement = document.getElementById("date");
        const currentDate = new Date();
        dateElement.textContent = currentDate.toLocaleDateString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});

// Load CrossFit abbreviations and content types from JSON file
async function loadCrossfitDict() {
    try {
        console.log("Fetching CrossFit Dictionary...");
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit data");

        return await response.json();
    } catch (error) {
        console.error("Error loading CrossFit data:", error);
        return {}; // Return an empty object in case of an error
    }
}

// Reset text formatting for WOD
function formatText(text, crossfitAbbr, type) {
    if (!text) return "No WOD available";

    let formattedText = text;

    // Reset all custom formatting
    formattedText = formattedText.replace(/<br>/g, "");
    formattedText = formattedText.replace(/<strong class="highlight-number">.*?<\/strong>/g, "");
    formattedText = formattedText.replace(/<span class="highlight">.*?<\/span>/g, "");

    // Insert a line break after "Min:" or any abbreviation ending with ":"
    formattedText = formattedText.replace(/(\b\w+\s*\d*):/g, "$1:<br>");

    return formattedText;
}

// Create a box element dynamically
function createBox(type, content, crossfitAbbr, contentTypes) {
    const box = document.createElement("div");
    box.className = `box type-${type}`;

    const title = document.createElement("h2");
    title.textContent = type.toUpperCase();
    box.appendChild(title);

    const text = document.createElement("p");
    text.innerHTML = formatText(content, crossfitAbbr, type);
    if (content.length > 20) {
        text.classList.add("scroll");
    }
    box.appendChild(text);

    if (contentTypes && contentTypes[type]) {
        box.classList.add(contentTypes[type]);
    }

    return box;
}

// Get random elements from an array
function getRandomElements(arr, min, max) {
    const result = [];
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = arr.sort(() => 0.5 - Math.random());
    for (let i = 0; i < count; i++) {
        result.push(shuffled[i]);
    }
    return result;
}