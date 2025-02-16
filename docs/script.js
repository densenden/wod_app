document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        const crossfitDict = await loadCrossfitDict();

        const response = await fetch("./data/beta_wods.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup, crossfitDict);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength, crossfitDict);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod, crossfitDict);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory, crossfitDict);

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

async function loadCrossfitDict() {
    try {
        console.log("Fetching CrossFit Dictionary...");
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit abbreviations");

        return await response.json();
    } catch (error) {
        console.error("Error loading CrossFit abbreviations:", error);
        return {};
    }
}

function formatText(text, crossfitDict) {
    if (!text) return "No WOD available";

    let formattedText = text;

    crossfitDict.modes.forEach(mode => {
        let regex = new RegExp(`^.*${mode}.*$`, "gm");
        formattedText = formattedText.replace(regex, `<span id='mode'>$&</span>`);
    });

    formattedText = formattedText.replace(/(\d+)/g, "<span id='numbers'>$1</span>");

    crossfitDict.movements.forEach(movement => {
        let regex = new RegExp(`\b${movement}\b`, "g");
        formattedText = formattedText.replace(regex, `<span id='movement'>${movement}</span>`);
    });

    crossfitDict.units.forEach(unit => {
        let regex = new RegExp(`\b${unit}\b`, "g");
        formattedText = formattedText.replace(regex, `<span id='units'>${unit}</span>`);
    });

    Object.entries(crossfitDict.abbreviations).forEach(([abbr, full]) => {
        let regex = new RegExp(`\b${abbr}\b`, "g");
        formattedText = formattedText.replace(regex, `<span id='movement' title='${full}'>${abbr}</span>`);
    });

    return formattedText;
}

