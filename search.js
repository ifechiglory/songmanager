let gospelSongsDB = [];

// Load songs from LocalForage on page load
localforage
  .getItem("gospelSongsDB")
  .then(function (songs) {
    gospelSongsDB = songs || [];
  })
  .catch(function (err) {
    console.error(err);
  });

function searchSongs() {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (query === "") {
    return; // Do not show results if the input is empty
  }

  const filteredSongs = gospelSongsDB.filter((songItem) => {
    return (
      songItem.title.toLowerCase().includes(query) ||
      songItem.lyrics.toLowerCase().includes(query)
    );
  });

  if (filteredSongs.length > 0) {
    filteredSongs.forEach((songItem) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.innerHTML = `
                    <p><strong>Title:</strong> ${songItem.title}</p>
                    <p><strong>Artist:</strong> ${
                      songItem.artist ? songItem.artist : "Unknown"
                    }</p>
                    <p><strong>Lyrics</strong>
                    <pre>${songItem.lyrics}</pre>
                `;
      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = "<p>No songs found matching your search.</p>";
  }
}