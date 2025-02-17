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
            const response = await fetch("./data/beta_studio.json");
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
            let regex = new RegExp(`\\b${movement}\\b`, "g");
            formattedText = formattedText.replace(regex, `<span class="movement">${movement}</span>`);
        });

        // Highlight units
        units.forEach(unit => {
            let regex = new RegExp(`\\b${unit}\\b`, "g");
            formattedText = formattedText.replace(regex, `<span class="unit">${unit}</span>`);
        });

        // Highlight modes
        modes.forEach(mode => {
            let regex = new RegExp(`\\b${mode}\\b`, "g");
            formattedText = formattedText.replace(regex, `<span class="mode">${mode}</span>`);
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

        // Insert line breaks after commas and colons
        formattedText = formattedText.replace(/,|:/g, "$&<br>");

        return formattedText;
    }

    // Create a box element dynamically
    function createBox(type, content, crossfitAbbr, movements, units, modes) {
        const box = document.createElement("div");
        box.className = `box type-${type}`;

        const title = document.createElement("h2");
        title.textContent = type.toUpperCase();
        box.appendChild(title);

        const text = document.createElement("p");
        text.innerHTML = formatText(content, crossfitAbbr, movements, units, modes);
        if (content.length > 20) {
            text.classList.add("scroll");
        }
        box.appendChild(text);

        return box;
    }