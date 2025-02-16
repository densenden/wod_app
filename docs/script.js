document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Load CrossFit abbreviations
        const crossfitData = await loadCrossfitDict();
        console.log("CrossFit Dictionary Loaded:", crossfitData);

        // Fetch WOD data
        const response = await fetch("./data/beta_wods.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Set the box name
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Select a random WOD for display
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Format and display WOD sections
        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup, crossfitData);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength, crossfitData);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod, crossfitData);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory, crossfitData);

        // Set the current date
        document.getElementById("date").textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});

// Load CrossFit dictionary from JSON file
async function loadCrossfitDict() {
    try {
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit dictionary");
        return await response.json();
    } catch (error) {
        console.error("Error loading CrossFit dictionary:", error);
        return {};
    }
}

// Format WOD text with proper styles
function formatText(text, crossfitData) {
    if (!text) return "No WOD available";

    let formattedText = text;

    // Mark numbers
    formattedText = formattedText.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span id="numbers">$1</span>');

    // Mark modes
    crossfitData.modes.forEach(mode => {
        let regex = new RegExp(`\\b${mode}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span id="mode">${mode}</span><br>`);
    });

    // Mark movements
    crossfitData.movements.forEach(movement => {
        let regex = new RegExp(`\\b${movement}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span id="movement" title="${movement}">${movement}</span><br>`);
    });

    // Mark units
    crossfitData.units.forEach(unit => {
        let regex = new RegExp(`(\d+)${unit}`, "g");
        formattedText = formattedText.replace(regex, `<span id="numbers">$1</span><span id="units">${unit}</span><br>`);
    });

    // Insert a line break after ":" if not inside parentheses
    formattedText = formattedText.replace(/:\s*(?![^()]*\))/g, ':<br>');

    // Remove duplicate line breaks
    formattedText = formattedText.replace(/(<br>\s*){2,}/g, '<br>');

    return formattedText;
}
function applyScrollingEffect() {
    document.querySelectorAll(".box p").forEach(p => {
        p.classList.remove("scrolling-text"); // Reset
        p.style.animation = "none";

        const overflow = p.scrollHeight - p.clientHeight;

        if (overflow > 0) {
            const scrollAmount = overflow + 20; // Extra Puffer
            p.style.setProperty("--scroll-distance", `-${scrollAmount}px`);

            setTimeout(() => {
                p.classList.add("scrolling-text");
            }, 100); // Kleiner Delay für sauberen Reset
        }
    });
}

// Warte auf das Laden des Inhalts
document.addEventListener("DOMContentLoaded", () => {
    applyScrollingEffect();
});