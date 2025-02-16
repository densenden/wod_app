window.formatText = function (text, crossfitAbbr) {
    if (!text) return "No WOD available";

    let formattedText = text;

    formattedText = insertLineBreaksAfterColon(formattedText);
    formattedText = preventLineBreakInMultiplications(formattedText);
    formattedText = preventLineBreakInParentheses(formattedText);
    formattedText = insertLineBreakBeforeNumbers(formattedText);
    formattedText = ensureNoBreakBeforePunctuation(formattedText);
    formattedText = removeDoubleLineBreaks(formattedText);
    formattedText = highlightNumbers(formattedText);
    formattedText = highlightCrossfitAbbreviations(formattedText, crossfitAbbr);

    return formattedText;
};

// 1. Line Break nach "Min:" oder Abkürzungen mit ":"
function insertLineBreaksAfterColon(text) {
    return text.replace(/(\b\w+\s*\d*):/g, "$1:<br>");
}

// 2. Kein Line Break in "5x5", "3x10", etc.
function preventLineBreakInMultiplications(text) {
    return text.replace(/(\d+)x(\d+)/g, "$1x$2");
}

// 3. Kein Line Break in Klammern (z. B. (5x5))
function preventLineBreakInParentheses(text) {
    return text.replace(/\((.*?)\)/g, (match) => match.replace(/(\d+)/g, "$1"));
}

// 4. Line Break vor Zahlen (mit Ausnahmen)
function insertLineBreakBeforeNumbers(text) {
    return text.replace(/(?<!<br>)(?<!\bx)(?<!\bx\d)(?<!\()[^\n](\d+)/g, "<br>$1");
}

// 5. Kein Line Break vor schließenden Klammern oder Kommas
function ensureNoBreakBeforePunctuation(text) {
    return text.replace(/<br>(?=[),])/g, "");
}

// 6. Doppelte <br> vermeiden
function removeDoubleLineBreaks(text) {
    return text.replace(/(<br>){2,}/g, "<br>");
}

// 7. Zahlen hervorheben
function highlightNumbers(text) {
    return text.replace(/(\d+['"]?)/g, "<strong>$1</strong>");
}

// 8. CrossFit-Abkürzungen hervorheben
function highlightCrossfitAbbreviations(text, crossfitAbbr) {
    Object.keys(crossfitAbbr).forEach(abbr => {
        let regex = new RegExp(`\\b${abbr}\\b`, "g");
        text = text.replace(regex, `<span class="highlight">${abbr}</span>`);
    });
    return text;
}