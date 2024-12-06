document.addEventListener("DOMContentLoaded", () => {
  const datesList = document.getElementById("datesList");
  const resetButton = document.getElementById("resetButton");

  // Load drawn dates
  chrome.storage.sync.get("drawnDates", (result) => {
    const drawnDates = result.drawnDates || [];
    drawnDates.forEach(date => {
      const li = document.createElement("li");
      li.textContent = date;
      datesList.appendChild(li);
    });
  });

  // Reset drawn dates
  resetButton.addEventListener("click", () => {
    chrome.storage.sync.set({ drawnDates: [] }, () => {
      alert("Drawn dates reset!");
      datesList.innerHTML = "";
    });
  });
});

