chrome.action.onClicked.addListener(() => {
  const startDate = new Date(2024, 0, 1); // Jan 1, 2024
  const endDate = new Date(2024, 11, 31); // Dec 31, 2024
  
  // Generate a random timestamp between the two dates
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTimestamp);
  
  // Format the date as YYYY/MM/DD
  const formattedDate = `${randomDate.getFullYear()}/${String(randomDate.getMonth() + 1).padStart(2, '0')}/${String(randomDate.getDate()).padStart(2, '0')}`;
  
  // Navigate to the URL
  const gameUrl = `https://www.nytimes.com/crosswords/game/mini/${formattedDate}`;
  chrome.tabs.create({ url: gameUrl });
});

