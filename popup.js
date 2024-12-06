document.addEventListener("DOMContentLoaded", () => {
  // Default values for the date inputs
  const DEFAULT_START_DATE = "2022-01-01";
  const DEFAULT_END_DATE = "2024-12-31";

  // Get references to DOM elements
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const playButton = document.getElementById("playButton");

  // Load saved start and end dates from storage
  chrome.storage.sync.get(["startDate", "endDate"], (result) => {
    startDateInput.value = result.startDate || DEFAULT_START_DATE;
    endDateInput.value = result.endDate || DEFAULT_END_DATE;
  });

  // Save new start and end dates when the user changes them
  startDateInput.addEventListener("change", () => {
    chrome.storage.sync.set({ startDate: startDateInput.value });
  });
  endDateInput.addEventListener("change", () => {
    chrome.storage.sync.set({ endDate: endDateInput.value });
  });

  // Generate a random game URL when the button is clicked
  playButton.addEventListener("click", () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Ensure valid date range
    if (startDate >= endDate) {
      alert("End date must be after start date!");
      return;
    }

    // Generate a random date between the range
    const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTimestamp);

    // Format the date as YYYY/MM/DD
    const formattedDate = `${randomDate.getFullYear()}/${String(randomDate.getMonth() + 1).padStart(2, "0")}/${String(randomDate.getDate()).padStart(2, "0")}`;

    // Open the game URL in a new tab
    const gameUrl = `https://www.nytimes.com/crosswords/game/mini/${formattedDate}`;
    chrome.tabs.create({ url: gameUrl });
  });
});

