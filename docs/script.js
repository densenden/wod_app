async function loadWOD() {
    try {
        const response = await fetch('/data/default_wods.json');
        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }
        const data = await response.json();

        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

        if (!data.wods || !data.wods[dayOfYear - 1]) {
            throw new Error('Invalid WOD data structure or missing entries');
        }

        const wod = data.wods[dayOfYear - 1];

        document.getElementById("name").textContent = name + "/";
        document.getElementById("warmup").textContent = "Warm-Up: " + (wod.warmup || "No Data");
        document.getElementById("strength").textContent = "Strength: " + (wod.strength || "No Data");
        document.getElementById("wod").textContent = "WOD: " + (wod.wod || "No Data");
        document.getElementById("accessory").textContent = "Accessory: " + (wod.accessory || "No Data");

    } catch (error) {
        console.error("Error loading WOD:", error);
        document.getElementById("warmup").textContent = "Error loading WOD data";
        document.getElementById("strength").textContent = "";
        document.getElementById("wod").textContent = "";
        document.getElementById("accessory").textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", loadWOD);