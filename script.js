let lastKeypressTime = null;
let saveNextKeypress = true;

function displayResults() {
  const results = JSON.parse(localStorage.getItem("keypressResults")) || [];
  const resultsTbody = document.getElementById("results-tbody");
  resultsTbody.innerHTML = "";

  results.forEach((result, index) => {
    const tr = document.createElement("tr");

    const positionTd = document.createElement("td");
    positionTd.innerText = index + 1;
    tr.appendChild(positionTd);

    const timeTd = document.createElement("td");
    timeTd.innerText = result.timeDifference;
    tr.appendChild(timeTd);

    const dateTd = document.createElement("td");
    dateTd.innerText = result.date;
    tr.appendChild(dateTd);

    resultsTbody.appendChild(tr);
  });
}
function checkNewRecord(timeDifference) {
  const results = JSON.parse(localStorage.getItem("keypressResults")) || [];

  if (results.length === 0) {
    showNewRecordMessage();
  } else {
    const minTime = Math.min(...results.map((result) => result.timeDifference));
    if (timeDifference < minTime) {
      showNewRecordMessage();
    }
  }
}

function showNewRecordMessage() {
  const newRecordElement = document.createElement("p");
  newRecordElement.id = "new-record";
  newRecordElement.innerText = "Nuevo record";
  newRecordElement.style.color = "red";

  const infoElement = document.getElementById("info");
  infoElement.appendChild(newRecordElement);

  setTimeout(() => {
    infoElement.removeChild(newRecordElement);
  }, 3000);
}


function saveResult(timeDifference) {
  checkNewRecord(timeDifference); // Mueve esta línea al principio de la función

  const results = JSON.parse(localStorage.getItem("keypressResults")) || [];
  const date = new Date();
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  results.push({
    timeDifference: timeDifference,
    date: formattedDate,
  });

  localStorage.setItem("keypressResults", JSON.stringify(results));
  displayResults();
}


document.addEventListener("keydown", (event) => {
  const currentTime = new Date().getTime();

  if (lastKeypressTime !== null) {
    const timeDifference = currentTime - lastKeypressTime;
    document.getElementById(
      "result"
    ).innerText = `Diferencia en milisegundos: ${timeDifference} ms`;

    if (saveNextKeypress) {
      saveResult(timeDifference);
    }
    saveNextKeypress = !saveNextKeypress;
  }

  lastKeypressTime = currentTime;
});
function clearResults() {
  localStorage.removeItem("keypressResults");
  displayResults();
}

document
  .getElementById("clear-results")
  .addEventListener("click", clearResults);

displayResults();
