document.addEventListener("DOMContentLoaded", async function() {
    try {
        console.log("Fetching WOD Data...");
        const response = await fetch('./data/default_wods.json');

        if (!response.ok) {
            throw new Error('Failed to load WOD data');
        }

        const data = await response.json();
        console.log("WOD Data:", data);

        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        const wod = data.wods[Math.floor(Math.random() * data.wods.length)];

        function formatText(text) {
            return text.replace(/(\d+)/g, '<strong>$1</strong>') // Zahlen hervorheben
                       .replace(/(RM|DL|BSQ|OHS)/g, '<span class="highlight">$1</span>'); // Abkürzungen stylen
        }

        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory);

    } catch (error) {
        console.error("Error loading WOD:", error);
    }
});
