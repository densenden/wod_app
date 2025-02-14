async function loadWOD() {
    try {
        const response = await fetch('data/default_wods.json'); // Korrigierter Pfad zur JSON-Datei
        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }
        const data = await response.json();
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const wod = data.wods[dayOfYear - 1] || { warmup: "No data", strength: "No data", wod: "No data", accessory: "No data" };

        document.getElementById("warmup").textContent = "Warm-Up: " + wod.warmup;
        document.getElementById("strength").textContent = "Strength: " + wod.strength;
        document.getElementById("wod").textContent = "WOD: " + wod.wod;
        document.getElementById("accessory").textContent = "Accessory: " + wod.accessory;
    } catch (error) {
        console.error("Error loading WOD:", error);
        document.getElementById("warmup").textContent = "Error loading WOD data";
        document.getElementById("strength").textContent = "";
        document.getElementById("wod").textContent = "";
        document.getElementById("accessory").textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", loadWOD);