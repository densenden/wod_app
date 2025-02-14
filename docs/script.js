async function loadWOD() {
    const response = await fetch('../data/default_wods.json');
    const data = await response.json();
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const wod = data.wods[dayOfYear - 1] || { warmup: "No data", strength: "No data", wod: "No data", accessory: "No data" };

    document.getElementById("warmup").textContent = "Warm-Up: " + wod.warmup;
    document.getElementById("strength").textContent = "Strength: " + wod.strength;
    document.getElementById("wod").textContent = "WOD: " + wod.wod;
    document.getElementById("accessory").textContent = "Accessory: " + wod.accessory;
}

document.addEventListener("DOMContentLoaded", loadWOD);