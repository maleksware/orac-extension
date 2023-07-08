function getStats() {
    var problemsMap = {};
    var problemsetCards = document.getElementsByClassName("set-problems");
    for (let problemElement of problemsetCards) {
        for (let problemHTML of problemElement.getElementsByTagName("tr")) {
            problemName = problemHTML.getElementsByTagName("a")[0].text;
            possibleScore = problemHTML.getElementsByTagName("span")[0];

            if (possibleScore) {
                score = possibleScore.innerHTML.trim();
                tried = true;
            } else {
                score = "0";
                tried = false;
            }

            problemsMap[problemName] = [score, tried];
        }
    }

    let numSolved = 0;
    let numTried = 0;
    let numTotal = 0;

    for (var problemName in problemsMap) {
        numTotal += 1;
        if (problemsMap[problemName][1]) {
            numTried += 1;
        }
        if (problemsMap[problemName][0] == "100") {
            numSolved += 1;
        }
    }

    return [numSolved, numTried, numTotal];
}


chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Execute Script");
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getStats
    })
    .then(injectionResults => {
        var data = injectionResults[0].result;
        solvedPercent = (data[0] / data[2] * 100).toFixed(1);
        triedPercent = (data[1] / data[2] * 100).toFixed(1);
        document.getElementById("solved").innerHTML = "solved: " + data[0] + " (" + solvedPercent + "%)";
        document.getElementById("tried").innerHTML = "seen: " + data[1] + " (" + triedPercent + "%)";
        document.getElementById("available").innerHTML = "available: " + data[2];
    });
});
