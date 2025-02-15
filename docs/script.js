document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Fetching WOD Data...");

        // Load CrossFit abbreviations
        const crossfitAbbr = await loadCrossfitDict();

        // Fetch WOD data
        const response = await fetch("./data/beta_wods.json");
        if (!response.ok) throw new Error("Failed to load WOD data");

        const data = await response.json();
        console.log("WOD Data:", data);

        // Set the box name
        document.getElementById("box-name").textContent = data.name || "CrossFit Box";

        // Select a random WOD for display
        const randomIndex = Math.floor(Math.random() * data.wods.length);
        const wod = data.wods[randomIndex];

        // Format and display WOD sections
        document.querySelector(".warmup p").innerHTML = formatText(wod.warmup, crossfitAbbr);
        document.querySelector(".strength p").innerHTML = formatText(wod.strength, crossfitAbbr);
        document.querySelector(".wod p").innerHTML = formatText(wod.wod, crossfitAbbr);
        document.querySelector(".accessory p").innerHTML = formatText(wod.accessory, crossfitAbbr);

        // Set the current date
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

// Load CrossFit abbreviations from JSON file
async function loadCrossfitDict() {
    try {
        console.log("Fetching CrossFit Dictionary...");
        const response = await fetch("./data/crossfit_dict.json");
        if (!response.ok) throw new Error("Failed to load CrossFit abbreviations");

        return await response.json();
    } catch (error) {
        console.error("Error loading CrossFit abbreviations:", error);
        return {}; // Return an empty object in case of an error
    }
}

// Format WOD text with proper line breaks
function formatText(text, crossfitAbbr) {
    if (!text) return "No WOD available";

    let formattedText = text;

    // Insert a line break after "Min:" or any abbreviation ending with ":"
    // formattedText = formattedText.replace(/(\b\w+\s*\d*):/g, "$1:<br>");

    // Prevent line break after "x" in "5x5", "3x10", etc.
    // formattedText = formattedText.replace(/(\d+)x(\d+)/g, "$1x$2");

    // Prevent line break inside parentheses (e.g., (5x5) remains intact)
    // formattedText = formattedText.replace(/\((.*?)\)/g, (match) => match.replace(/(\d+)/g, "$1"));

    // Insert a line break before numbers, but only if:
    // - No <br> exists before
    // - It's not after "x"
    // - It's not inside `()`
    // - It's not at the start of a line
    formattedText = formattedText.replace(/(?<!<br>)(?<!\bx)(?<!\bx\d)(?<!\()[^\n](\d+)/g, "<br>$1");

    // Ensure no line break before a closing parenthesis or comma
    formattedText = formattedText.replace(/<br>(?=[),])/g, "");

    // Ensure no double <br> in a row
    // formattedText = formattedText.replace(/(<br>){2,}/g, "<br>");

    // Highlight numbers (e.g., weights, reps, time)
    // formattedText = formattedText.replace(/(\d+['"]?)/g, "<strong>$1</strong>");

    // Highlight CrossFit abbreviations
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, "g");
        formattedText = formattedText.replace(regex, `<span class="highlight">${abbr}</span>`);
    });

    return formattedText;
}