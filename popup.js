document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_START_DATE = "2024-01-01";
  const DEFAULT_END_DATE = "2024-12-31";

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const playButton = document.getElementById("playButton");
  const viewDatesButton = document.getElementById("viewDatesButton");

  // Load saved settings
  chrome.storage.sync.get(["startDate", "endDate"], (result) => {
    startDateInput.value = result.startDate || DEFAULT_START_DATE;
    endDateInput.value = result.endDate || DEFAULT_END_DATE;
  });

  // Save changes to start and end dates
  startDateInput.addEventListener("change", () => {
    chrome.storage.sync.set({ startDate: startDateInput.value });
  });

  endDateInput.addEventListener("change", () => {
    chrome.storage.sync.set({ endDate: endDateInput.value });
  });

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
    chrome.tabs.create({ url: chrome.runtime.getURL("dates.html") });
  });
});
