// Gospel Songs Database
let gospelSongsDB = [];

// Function to format lyrics with double line spacing
function formatLyrics(lyrics) {
  return lyrics.split("\n").join("\n\n"); // Adds two line spacings between lyrics
}

// Function to render the songs list
function renderSongs() {
  const songsList = document.getElementById("songsList");
  songsList.innerHTML = "<h2>Song List</h2>";

  if (gospelSongsDB.length === 0) {
    songsList.innerHTML += "<p>No songs available.</p>";
    return;
  }

  gospelSongsDB.forEach((song, index) => {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item");

    songItem.innerHTML = `
       <p><strong>Title:</strong> ${song.title}</p>
       <p><strong>Artist:</strong> ${song.artist ? song.artist : "Unknown"}</p>
       <button onclick='toggleLyrics(${index})' id='toggleBtn${index}'>View Song</button>
       <div class='lyrics' id='lyrics${index}'>
         <p><strong>Lyrics:</strong></p>
         <pre>${song.lyrics}</pre>
       </div>
       <div class='song-actions'>
         <button onclick="openEditModal(${index})">Edit Song</button>
         <button onclick="confirmDelete(${index})">Delete Song</button>
       </div>
     `;
    songsList.appendChild(songItem);
  });
}

// Function to toggle the visibility of the lyrics
function toggleLyrics(index) {
  const lyricsDiv = document.getElementById(`lyrics${index}`);
  const toggleButton = document.getElementById(`toggleBtn${index}`);

  if (lyricsDiv.style.display === "none") {
    lyricsDiv.style.display = "block";
    toggleButton.textContent = "Hide Song";
  } else {
    lyricsDiv.style.display = "none";
    toggleButton.textContent = "View Song";
  }
}

// Function to add a new song
document.getElementById("songForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("songTitle").value;
  const artist = document.getElementById("songArtist").value;
  const lyrics = document.getElementById("songLyrics").value;

  const existingSong = gospelSongsDB.find((song) => song.title === title);
  if (existingSong) {
    alert("Song already exists. Try editing it instead.");
    return;
  }

  gospelSongsDB.push({
    title: title,
    artist: artist || null, // Set artist as ‘null’ if it’s not provided
    lyrics: formatLyrics(lyrics),
  });

  document.getElementById("songForm").reset();
  renderSongs();
});

// Function to open edit modal
function openEditModal(index) {
  editIndex = index;
  const song = gospelSongsDB[index];
  document.getElementById("editTitle").value = song.title;
  document.getElementById("editArtist").value = song.artist || "";
  document.getElementById("editLyrics").value = song.lyrics.replace(
    /\n\n/g,
    "\n"
  );

  document.getElementById("editModal").style.display = "flex";
}

// Function to edit a song
function editSong(title) {
  const song = gospelSongsDB.find((song) => song.title === title);
  if (song) {
    document.getElementById("songTitle").value = song.title;
    document.getElementById("songArtist").value = song.artist || "";
    document.getElementById("songLyrics").value = song.lyrics.replace(
      /\n\n/g,
      "\n"
    );

    deleteSong(title);
  }
}

// Function to save the edited song
function saveChanges() {
  const title = document.getElementById("editTitle").value;
  const artist = document.getElementById("editArtist").value;
  const lyrics = document.getElementById("editLyrics").value;

  // Update database songs

  gospelSongsDB[editIndex] = {
    title: title,
    artist: artist || null,
    lyrics: formatLyrics(lyrics),
  };
  closeModal();
  renderSongs();
}

// Function to close the modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Function to delete a song
function deleteSong(index) {
  gospelSongsDB.splice(index, 1);
  renderSongs();
}

// Function to confirm delete action
function confirmDelete(index) {
  const confirmDelete = window.confirm(
    "This action cannot be undone. Do you wish to continue?"
  );
  if (confirmDelete) {
    deleteSong(index);
  }
}

renderSongs();
