document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Lade CrossFit Abkürzungen
        const crossfitDict = await loadCrossfitDict();

        // Lade WOD Daten
        const response = await fetch("./data/beta_wods.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Setze den Box-Namen
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Zufällige WOD auswählen
        if (!data.wods || !data.wods.length) {
            throw new Error("No WODs found in data");
        }

        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Inhalte der Boxen setzen
        setWODContent(".warmup p", wod.warmup, crossfitDict);
        setWODContent(".strength p", wod.strength, crossfitDict);
        setWODContent(".wod p", wod.wod, crossfitDict);
        setWODContent(".accessory p", wod.accessory, crossfitDict);

        // Setze das aktuelle Datum
        const dateElement = document.getElementById("date");
        if (dateElement) {
            const currentDate = new Date();
            dateElement.textContent = currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        } else {
            console.warn("Date element not found!");
        }

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});

async function loadCrossfitDict() {
    try {
        console.log("Fetching CrossFit Dictionary...");
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit abbreviations");

        const jsonData = await response.json();
        
        // Sicherstellen, dass alle relevanten Keys vorhanden sind
        return {
            modes: jsonData.modes || [],
            movements: jsonData.movements || [],
            units: jsonData.units || [],
            abbreviations: jsonData.abbreviations || {}
        };
        
    } catch (error) {
        console.error("Error loading CrossFit abbreviations:", error);
        return { modes: [], movements: [], units: [], abbreviations: {} };
    }
}

// Setze den Textinhalt korrekt
function setWODContent(selector, text, crossfitDict) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = text ? formatText(text, crossfitDict) : "No WOD available";
    }
}

function formatText(text, crossfitDict) {
    if (!text) return "No WOD available";

    let formattedText = text;

    if (crossfitDict.modes.length > 0) {
        crossfitDict.modes.forEach(mode => {
            let regex = new RegExp(`^.*${mode}.*$`, "gm");
            formattedText = formattedText.replace(regex, `<span id='mode'>$&</span>`);
        });
    }

    formattedText = formattedText.replace(/(\d+)/g, "<span id='numbers'>$1</span>");

    if (crossfitDict.movements.length > 0) {
        crossfitDict.movements.forEach(movement => {
            let regex = new RegExp(`\b${movement}\b`, "g");
            formattedText = formattedText.replace(regex, `<span id='movement'>${movement}</span>`);
        });
    }

    if (crossfitDict.units.length > 0) {
        crossfitDict.units.forEach(unit => {
            let regex = new RegExp(`\b${unit}\b`, "g");
            formattedText = formattedText.replace(regex, `<span id='units'>${unit}</span>`);
        });
    }

    if (Object.keys(crossfitDict.abbreviations).length > 0) {
        Object.entries(crossfitDict.abbreviations).forEach(([abbr, full]) => {
            let regex = new RegExp(`\b${abbr}\b`, "g");
            formattedText = formattedText.replace(regex, `<span id='movement' title='${full}'>${abbr}</span>`);
        });
    }

    return formattedText;
}
