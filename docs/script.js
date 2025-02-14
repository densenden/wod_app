async function loadWOD() {
    try {
        console.log("Fetching WOD Data...");
        const response = await fetch('./data/default_wods.json');

        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }

        const data = await response.json();
        console.log("WOD Data:", data);

        const today = new Date();
        const dayOfYear = today.getUTCDate() % data.wods.length; // Verhindert Out-of-Bounds Fehler
        console.log("Today's Index:", dayOfYear);
        console.log("Workout Object:", data.wods[dayOfYear]);

        if (!data.wods || !data.wods[dayOfYear]) {
            throw new Error('Invalid WOD data structure or missing entries');
        }

        // WOD Daten aus JSON extrahieren
        let workout = data.wods[dayOfYear];

        // Elemente in der HTML aktualisieren
        document.getElementById("warmup").textContent = "Warm-Up: " + (workout.warmup || "No Data");
        document.getElementById("strength").textContent = "Strength: " + (workout.strength || "No Data");
        document.getElementById("wod").textContent = "WOD: " + (workout.wod || "No Data");
        document.getElementById("accessory").textContent = "Accessory: " + (workout.accessory || "No Data");

    } catch (error) {
        console.error("Error loading WOD:", error);
        document.getElementById("warmup").textContent = "Error loading WOD data";
        document.getElementById("strength").textContent = "";
        document.getElementById("wod").textContent = "";
        document.getElementById("accessory").textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", loadWOD);