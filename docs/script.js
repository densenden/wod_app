document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Load CrossFit abbreviations and content types
        const crossfitData = await loadCrossfitDict();
        const crossfitAbbr = crossfitData.abbreviations || {};
        const movements = crossfitData.movements || [];
        const units = crossfitData.units || [];
        const modes = crossfitData.modes || [];

        // Fetch WOD data
        const response = await fetch("./data/betamode_crossfit.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Set the box name
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Select a random WOD for display
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Set the class type
        document.getElementById("class-type").textContent = wod.class || "Workout of the day.";

        // Format and display WOD sections dynamically
        const container = document.getElementById("container");
        container.innerHTML = ''; // Clear existing content

        Object.keys(wod).forEach(key => {
            if (key !== 'class') { // Exclude the 'class' key
                container.appendChild(createBox(key, wod[key], crossfitAbbr, movements, units, modes));
            }
        });

        // Add QR box
        container.appendChild(createBox('qr', '', crossfitAbbr, movements, units, modes));

        // Set the current date
        const dateElement = document.getElementById("date");
        const currentDate = new Date();
        dateElement.textContent = currentDate.toLocaleDateString("en-EN", {
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

// Format WOD text with proper highlights and line breaks
function formatText(text, crossfitAbbr, movements, units, modes) {
    if (!text) return "No WOD available";

    let formattedText = text;

    // Highlight CrossFit abbreviations with tooltips
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span class="abbreviation" data-tooltip="${crossfitAbbr[abbr]}">${abbr}</span>`);
    });

    // Highlight movements
    movements.forEach(movement => {
        const abbr = Object.keys(crossfitAbbr).find(key => crossfitAbbr[key] === movement);
        if (abbr) {
            let regex = new RegExp(`\\b${movement}\\b`, "g");
            formattedText = formattedText.replace(regex, `<span class="movement" title="${movement}">${abbr}</span>`);
        }
    });

    // Highlight units
    units.forEach(unit => {
        let regex = new RegExp(`(\\d+)\\s*(${unit})\\b`, "g");
        formattedText = formattedText.replace(regex, (match, p1, p2) => {
            return `<span class="tens">${p1}</span><span class="unit">${p2}</span>`;
        });
    });

    // Highlight modes with additional class
    modes.forEach(mode => {
        let regex = new RegExp(`\\b${mode}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span class="mode" data-tooltip="${mode}">${mode}</span>`);
    });

    // Ensure 1RM, C2B, S2OH abbreviation is not split
    formattedText = formattedText.replace(/\b1RM\b/g, '<span class="abbreviation" data-tooltip="One-Rep Max">1RM</span>');
    formattedText = formattedText.replace(/\bC2B\b/g, '<span class="abbreviation" data-tooltip="Chest To Bar">C2B</span>');
    formattedText = formattedText.replace(/\bS2OH\b/g, '<span class="abbreviation" data-tooltip="Shoulder to Overhead">S2OH</span>');

    // Highlight numbers based on specified criteria, excluding numbers in abbreviations
    formattedText = formattedText.replace(/(\d+)(?!<\/span>)(?!\s*<span class="unit">)(?!RM)/g, (match, p1) => {
        let className = "number";
        if (p1.length === 1) {
            className = "single-digit";
        } else if (p1 % 10 === 0) {
            className = "tens";
        }
        return `<span class="${className}">${match}</span>`;
    });

    // Highlight numbers within parentheses
    formattedText = formattedText.replace(/\((\d+)\)/g, (match, p1) => {
        return `(<span class="number">${p1}</span>)`;
    });

    // Insert line breaks after commas and colons
    formattedText = formattedText.replace(/,|:/g, "$&<br>");

    return formattedText;
}
const box = document.createElement("div");



function createBox(type, content, crossfitAbbr, movements, units, modes) {
    const box = document.createElement("div");
    box.className = `box type-${type}`;

    const title = document.createElement("h2");
    title.textContent = type.toUpperCase();
    box.appendChild(title);

    if (type === 'qr') {
        const qrCode = document.createElement("img");
        qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`;
        qrCode.alt = "QR Code";
        qrCode.style.width = "200px";
        qrCode.style.height = "200px";
        box.appendChild(qrCode);
    } else {
        const text = document.createElement("p");
        text.innerHTML = formatText(content, crossfitAbbr, movements, units, modes);

        box.appendChild(text);
    }

    return box;
}