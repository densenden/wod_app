async function loadWOD() {
    try {
        console.log("Fetching WOD Data...");
        const response = await fetch('./data/default_wods.json');

        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }

        const data = await response.json();
        console.log("WOD Data:", data);

        // Setze den Namen der Box aus JSON
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Zufälliges WOD auswählen
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        console.log("Random WOD Index:", randomIndex);

        const wod = data.wods[randomIndex];

        document.getElementById("warmup").innerHTML = "<h2>WARM-UP</h2><p>" + (wod.warmup || "No Data").replace(/\n/g, '<br>') + "</p>";
        document.getElementById("strength").innerHTML = "<h2>STRENGTH</h2><p>" + (wod.strength || "No Data").replace(/\n/g, '<br>') + "</p>";
        document.getElementById("wod").innerHTML = "<h2>WOD</h2><p>" + (wod.wod || "No Data").replace(/\n/g, '<br>') + "</p>";
        document.getElementById("accessory").innerHTML = "<h2>ACCESSORY</h2><p>" + (wod.accessory || "No Data").replace(/\n/g, '<br>') + "</p>";

    } catch (error) {
        console.error("Error loading WOD:", error);
        document.getElementById("warmup").innerHTML = "<h2>WARM-UP</h2><p>Error loading WOD data</p>";
        document.getElementById("strength").innerHTML = "";
        document.getElementById("wod").innerHTML = "";
        document.getElementById("accessory").innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", loadWOD);