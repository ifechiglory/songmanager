// This JS script creates a song database that also utilizes localFtorage to persist data.
// User can add a new song, modify an already existing song, delete a song, view songs already on the db and search for songs using the search function

let gospelSongsDB = [];
let currentEditIndex = null;

// Load songs from LocalForage on page load
localforage
  .getItem("gospelSongsDB")
  .then(function (songs) {
    gospelSongsDB = songs || [];
    renderSongs(gospelSongsDB);
  })
  .catch(function (err) {
    console.error(err);
  });

function renderSongs(songs) {
  const songsList = document.getElementById("songsList");
  songsList.innerHTML = "<h2>Song List</h2>";

  if (songs.length === 0) {
    songsList.innerHTML += "<p>No songs added yet.</p>";
    return;
  }

  songs.forEach((song, index) => {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item");
    songItem.innerHTML = `
            <p><strong>Title:</strong> ${song.title}</p>
            <p><strong>Artist:</strong> ${
              song.artist ? song.artist : "Unknown"
            }</p>
            <button onclick="viewLyrics(${index})" id="toggleBtn${index}">View Lyrics</button>
            <p class="lyrics" id="lyrics${index}">${song.lyrics}</p>
            <div class="song-actions">
            <button onclick="openEditModal(${index})">Edit</button>
            <button onclick="deleteSong(${index})">Delete</button>
            </div>
        `;
    songsList.appendChild(songItem);
  });
}

 // View Lyrics Modal
 function viewLyrics(index) {
  const lyricsModal = document.getElementById("lyricsModal");
  const lyricsContent = document.getElementById("lyricsContent");

  lyricsContent.textContent = gospelSongsDB[index].lyrics;
  lyricsModal.style.display = "flex"; 
}

function closeLyricsModal() {
  const lyricsModal = document.getElementById("lyricsModal");
  lyricsModal.style.display = "none";
}

function formatLyrics(lyrics) {
  return lyrics.split("\n").join("\n\n"); // Adds two line spacings between lyrics
}

function addSong(event) {
  event.preventDefault(); // Prevent the default form submission
  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const lyrics = document.getElementById("lyrics").value.trim();

  gospelSongsDB.push({
    title: title,
    artist: artist,
    lyrics: formatLyrics(lyrics),
  });

  localforage
    .setItem("gospelSongsDB", gospelSongsDB)
    .then(() => {
      renderSongs(gospelSongsDB);
      // Clear input fields
      document.getElementById("title").value = "";
      document.getElementById("artist").value = "";
      document.getElementById("lyrics").value = "";
    })
    .catch(function (err) {
      console.error("Error saving data to localForage:", err);
    });
  alert("Saved successfully");
}

function openEditModal(index) {
  currentEditIndex = index;
  const song = gospelSongsDB[index];
  document.getElementById("editTitle").value = song.title;
  document.getElementById("editArtist").value = song.artist;
  document.getElementById("editLyrics").value = song.lyrics.replace(
    /\n\n/g,
    "\n"
  );

  document.getElementById("editModal").style.display = "flex"; // Show modal
}

function closeModal() {
  document.getElementById("editModal").style.display = "none"; // Hide modal
}

function saveEdit() {
  const title = document.getElementById("editTitle").value.trim();
  const artist = document.getElementById("editArtist").value.trim();
  const lyrics = document.getElementById("editLyrics").value.trim();

  if (currentEditIndex !== null) {
    gospelSongsDB[currentEditIndex] = {
      title: title,
      artist: artist,
      lyrics: formatLyrics(lyrics),
    };
    localforage
      .setItem("gospelSongsDB", gospelSongsDB)
      .then(() => {
        renderSongs(gospelSongsDB);
        closeModal(); // Close the modal after saving
        alert('Song saved successfully');
      })
      .catch(function (err) {
        console.error("Error saving data to localForage:", err);
      });
  }
}

function deleteSong(index) {
  if (confirm("This action cannot be undone. Do you wish to continue?")) {
    gospelSongsDB.splice(index, 1);
    localforage
      .setItem("gospelSongsDB", gospelSongsDB)
      .then(() => {
        renderSongs(gospelSongsDB);
      })
      .catch(function (err) {
        console.error("Error saving data to localForage:", err);
      });
  }
}

// Initialize the list on page load
renderSongs(gospelSongsDB);