document.addEventListener("DOMContentLoaded", () => {
  const FIRST_MINI_DATE = "2014-08-21";

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const playButton = document.getElementById("playButton");
  const viewDatesButton = document.getElementById("viewDatesButton");

  const today = new Date().toISOString().split("T")[0];

  // Load saved settings
  chrome.storage.sync.get(["startDate", "endDate"], (result) => {
    startDateInput.value = result.startDate || FIRST_MINI_DATE;
    endDateInput.value = result.endDate || today;
  });

  startDateInput.setAttribute("min", FIRST_MINI_DATE);
  endDateInput.setAttribute("max", endDateInput.value);

  startDateInput.addEventListener("change", (event) => {
    endDateInput.setAttribute("min", event.target.value);
    chrome.storage.sync.set({ startDate: startDateInput.value });
  })
  endDateInput.addEventListener("change", (event) => {
    startDateInput.setAttribute("max", event.target.value);
    chrome.storage.sync.set({ endDate: endDateInput.value });
  })

  // Play random game
  playButton.addEventListener("click", () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate >= endDate) {
      alert("End date must be after start date!");
      return;
    }

    const allDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d).toISOString().split("T")[0]);
    }

    chrome.storage.sync.get(["drawnDates"], (result) => {
      const drawnDates = result.drawnDates || [];
      const availableDates = allDates.filter(date => !drawnDates.includes(date));

      if (availableDates.length === 0) {
        alert("All dates have been drawn! Resetting the pool.");
        chrome.storage.sync.set({ drawnDates: [] });
        return;
      }

      const randomDate = availableDates[Math.floor(Math.random() * availableDates.length)];
      drawnDates.push(randomDate);
      chrome.storage.sync.set({ drawnDates });

      const [year, month, day] = randomDate.split("-");
      const formattedDate = `${year}/${month}/${day}`;
      chrome.tabs.create({ url: `https://www.nytimes.com/crosswords/game/mini/${formattedDate}` });
    });
  });

  // View drawn dates
  viewDatesButton.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("config.html") });
  });
});

