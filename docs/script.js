document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // CrossFit Abkürzungen laden
        const crossfitAbbr = await loadCrossfitDict();

        // WOD-Daten laden
        const response = await fetch("./data/beta_wods.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Box-Name setzen
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Zufälliges WOD auswählen
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Inhalte formatieren und setzen
        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup, crossfitAbbr);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength, crossfitAbbr);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod, crossfitAbbr);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory, crossfitAbbr);

        // Layout anpassen
        setTimeout(adjustWodLayout, 200);

        // Datum setzen
        const dateElement = document.getElementById("date");
        const currentDate = new Date();
        dateElement.textContent = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});

// CrossFit-Abkürzungen aus JSON-Datei laden
async function loadCrossfitDict() {
    try {
        console.log("Fetching CrossFit Dictionary...");
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit abbreviations");

        return await response.json();
    } catch (error) {
        console.error("Error loading CrossFit abbreviations:", error);
        return {}; // Rückgabe eines leeren Objekts bei Fehler
    }
}

// Funktion zum Formatieren von WOD-Texten
function formatText(text, crossfitAbbr) {
    if (!text) return "Kein WOD verfügbar";

    let formattedText = text.replace(/\n/g, "<br>"); // Zeilenumbrüche in <br> umwandeln

    // Zahlen + Minuten/Sekunden hervorheben
    formattedText = formattedText.replace(/(\d+['"]?)/g, "<strong>$1</strong>");

    // Alle geladenen Abkürzungen hervorheben
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span class="highlight">${abbr}</span>`);
    });

    return formattedText;
}

// Prüfe die Anzahl der Zeilen und passe das Layout an
function adjustWodLayout() {
    const wodParagraph = document.querySelector(".wod p");
    const wodBox = document.querySelector(".wod");
    const computedStyles = window.getComputedStyle(wodParagraph);
    const lineHeight = parseFloat(computedStyles.lineHeight);
    const lines = wodParagraph.clientHeight / lineHeight;

    if (lines > 4) {
        wodParagraph.style.columnCount = 2;
        wodParagraph.style.columnGap = "20px";

        // Dynamische Schriftgrößenanpassung
        let fontSize = parseFloat(computedStyles.fontSize);
        while (wodParagraph.scrollHeight > wodBox.clientHeight && fontSize > 14) {
            fontSize -= 1;
            wodParagraph.style.fontSize = fontSize + "px";
        }
    } else {
        wodParagraph.style.columnCount = 1;
    }
}