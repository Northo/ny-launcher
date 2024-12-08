const parseUrl = (url) => {
  // Parse the URL using the built-in URL class
  const parsedUrl = new URL(url);

  // The pathname should look like: /crosswords/game/mini/YYYY/MM/DD
  // Splitting on '/' will give something like:
  // ["", "crosswords", "game", "mini", "2024", "10", "08"]
  const parts = parsedUrl.pathname.split('/');

  // Check we have at least 7 parts as expected
  if (parts.length < 7) {
    throw new Error("URL not in the expected format");
  }

  const year = parseInt(parts[4], 10);
  const month = parseInt(parts[5], 10);
  const day = parseInt(parts[6], 10);

  // Remember to adjust month index for the JS Date constructor
  return new Date(year, month - 1, day);
}

const getVisitedMinis = async () => {
  let history = await chrome.history.search({
    "text": "https://www.nytimes.com/crosswords/game/mini/"
  });
  return history.map(({url}) => parseUrl(url));
}


document.addEventListener("DOMContentLoaded", () => {
  const datesList = document.getElementById("datesList");
  
  (async () => {
    const l = await getVisitedMinis();
    console.log(l);
    l.toSorted((a,b) => a - b).forEach(date => {
      const li = document.createElement("div");
      li.textContent = date.toDateString();
      li.classList = "p-2";
      datesList.appendChild(li);
    });
  })();

});

