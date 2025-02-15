document.addEventListener("DOMContentLoaded", async function() {
    try {
        console.log("Fetching WOD Data...");
        const response = await fetch('./data/beta_wods.json');

        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }

        const data = await response.json();
        console.log("WOD Data:", data);

        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Zufälliges WOD auswählen bei jedem Reload
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Laden der CrossFit-Abkürzungen aus der JSON-Datei
let crossfitAbbr = {};

// Fetch JSON Datei mit den CrossFit Abkürzungen
fetch("./data/crossfit_dict.json")
    .then(response => response.json())
    .then(data => {
        crossfitAbbr = data;
    })
    .catch(error => console.error("Fehler beim Laden der CrossFit-Abkürzungen:", error));

// Funktion zum Formatieren von WOD-Texten
function formatText(text) {
    if (!text) return "Kein WOD verfügbar";

    let formattedText = text.replace(/\n/g, '<br>') // Zeilenumbrüche in <br> umwandeln
                            .replace(/(\d+)/g, '<strong>$1</strong>'); // Zahlen hervorheben

    // Alle Abkürzungen aus der JSON-Datei hervorheben
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, 'g');
        formattedText = formattedText.replace(regex, `<span class="highlight">${abbr}</span>`);
    });

    return formattedText;
}

        // Inhalte korrekt setzen
        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory);

        // Prüfe die Anzahl der Zeilen und passe das Layout an
        function adjustWodLayout() {
            const wodParagraph = document.querySelector(".wod p");
            const wodBox = document.querySelector(".wod");
            const computedStyles = window.getComputedStyle(wodParagraph);
            const lineHeight = parseFloat(computedStyles.lineHeight);
            const lines = wodParagraph.clientHeight / lineHeight;

            if (lines > 4) {
                wodParagraph.style.columnCount = 3; // Zweispaltiger Text, wenn mehr als 4 Zeilen
                wodParagraph.style.columnGap = "20px"; // Abstand zwischen Spalten

                // Wenn der Text zu lang ist, reduziere die Schriftgröße
                let fontSize = parseFloat(computedStyles.fontSize);
                while (wodParagraph.scrollHeight > wodBox.clientHeight && fontSize > 14) {
                    fontSize -= 1;
                    wodParagraph.style.fontSize = fontSize + "px";
                }
            } else {
                wodParagraph.style.columnCount = 1; // Normal einspaltig, wenn <= 4 Zeilen
            }
        }

        // Warte, bis das Layout gerendert ist, bevor es angepasst wird
        setTimeout(adjustWodLayout, 200);

        // Get current date and display it in the header
        const dateElement = document.getElementById('date');
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
});

dateElement.textContent = formattedDate;

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});