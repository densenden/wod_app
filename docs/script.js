document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Load CrossFit abbreviations and content types
        const crossfitData = await loadCrossfitDict();
        const crossfitAbbr = crossfitData.abbreviations || {};
        const contentTypes = crossfitData.types || {};
        const units = crossfitData.units || {};

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

        // Format and display WOD sections dynamically
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear existing content

        Object.keys(wod).forEach(key => {
            container.appendChild(createBox(key, wod[key], crossfitAbbr, contentTypes, units));
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

// Format WOD text with proper line breaks and highlights
function formatText(text, crossfitAbbr, units) {
    if (!text) return "No WOD available";

    let formattedText = text;

    // Insert line breaks after colons
    formattedText = formattedText.replace(/(:)/g, "$1<br>");

    // Highlight CrossFit abbreviations, movements, and other terms with tooltips
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span class="highlight" data-tooltip="${crossfitAbbr[abbr]}">${abbr}</span>`);
    });

    // Highlight numbers based on specified criteria
    formattedText = formattedText.replace(/(\d+)(kg|lbs|m|sec|reps)?/g, (match, p1, p2) => {
        let className = "number";
        if (p1.length === 1) {
            className = "single-digit";
        } else if (p1 % 10 === 0) {
            className = "tens";
        }
        if (p2) {
            className += ` unit-${p2}`;
        }
        return `<span class="${className}">${match}</span>`;
    });

    return formattedText;
}

// Create a box element dynamically
function createBox(type, content, crossfitAbbr, contentTypes, units) {
    const box = document.createElement("div");
    box.className = `box type-${type}`;

    const title = document.createElement("h2");
    title.textContent = type.toUpperCase();
    box.appendChild(title);

    const text = document.createElement("p");
    text.innerHTML = formatText(content, crossfitAbbr, units);
    if (content.length > 20) {
        text.classList.add("scroll");
    }
    box.appendChild(text);

    if (contentTypes && contentTypes[type]) {
        box.classList.add(contentTypes[type]);
    }

    return box;
}