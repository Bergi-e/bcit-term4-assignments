const xhttp = new XMLHttpRequest();
let loadingCount = 0;

xhttp.open("GET", "http://apiz.ca/readystatechange", true);

xhttp.onreadystatechange = function () {

    if (this.readyState === 3) {
        loadingCount++;
        console.log("State updated to: LOADING");
    }

    if (this.readyState === 4 && this.status === 200) {
        console.log("----- QUIZ ANSWERS -----");
        
        console.log("1. Number of LOADING updates:", loadingCount);
        
        console.log("2. Size of response:", this.responseText.length);
        
        console.log("3. Full Server Response:", this.responseText);
    }
};

xhttp.send();