// This JS script creates a song database that also utilizes localStorage to persist data. 
// User can add a new song, modify an already existing song, delete a song and view songs already on the db

 // Gospel Songs Database (will load from localStorage if available)
 let gospelSongsDB = JSON.parse(localStorage.getItem("gospelSongsDB")) || [];
 let editIndex = null; // For tracking the index of the song being edited

 // Function to format lyrics with double line spacing
 function formatLyrics(lyrics) {
   return lyrics.split('\n').join('\n\n'); // Adds two line spacings between lyrics
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
       <p><strong>Artist:</strong> ${song.artist ? song.artist : 'Unknown'}</p>
       <button onclick="toggleLyrics(${index})" id="toggleBtn${index}">View Song</button>
       <div class="lyrics" id="lyrics${index}">
         <p><strong>Lyrics:</strong></p>
         <pre>${song.lyrics}</pre>
       </div>
       <div class="song-actions">
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

 // Function to save the updated songsDB to localStorage
 function saveToLocalStorage() {
   localStorage.setItem("gospelSongsDB", JSON.stringify(gospelSongsDB));
 }

 // Function to add a new song
 document.getElementById("songForm").addEventListener("submit", function(event) {
   event.preventDefault();

   const title = document.getElementById("songTitle").value;
   const artist = document.getElementById("songArtist").value;
   const lyrics = document.getElementById("songLyrics").value;

   const existingSong = gospelSongsDB.find(song => song.title === title);
   if (existingSong) {
     alert("Song already exists. Try editing it instead.");
     return;
   }

   gospelSongsDB.push({
     title: title,
     artist: artist || null, // Set artist as 'null' if it's not provided
     lyrics: formatLyrics(lyrics),
   });

   document.getElementById("songForm").reset();
   saveToLocalStorage(); // Save updated data to local storage
   renderSongs();
 });

 // Function to open the edit modal
 function openEditModal(index) {
   editIndex = index;
   const song = gospelSongsDB[index];
   document.getElementById("editTitle").value = song.title;
   document.getElementById("editArtist").value = song.artist || '';
   document.getElementById("editLyrics").value = song.lyrics.replace(/\n\n/g, '\n');

   // Show the modal
   document.getElementById("editModal").style.display = "flex";
 }

 // Function to save the edited song
 function saveChanges() {
   const title = document.getElementById("editTitle").value;
   const artist = document.getElementById("editArtist").value;
   const lyrics = document.getElementById("editLyrics").value;

   gospelSongsDB[editIndex] = {
     title: title,
     artist: artist || null,
     lyrics: formatLyrics(lyrics),
   };

   saveToLocalStorage(); // Save updated data to local storage
   closeModal();
   renderSongs();
 }

 // Function to close the edit modal
 function closeModal() {
   document.getElementById("editModal").style.display = "none";
 }

 // Function to confirm deletion of a song
 function confirmDelete(index) {
   const confirmDelete = window.confirm("This action cannot be undone. Continue?");
   if (confirmDelete) {
     gospelSongsDB.splice(index, 1);
     saveToLocalStorage(); // Save updated data to local storage
     renderSongs();
   }
 }

 // Initialize the list on page load
 renderSongs();