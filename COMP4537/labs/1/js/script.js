/** AI NOTE:
 * Gemini was used in the process of creating this code. 
 * I made sure to Guided Learning feature to go line-by-line
 * and fully understand every part of what I was making. 
 * * The AI would ask questions on what I would/should do, and assisted
 * me in reaching the correct endpoint. I made sure the final result was on par
 * with what the assignment required
 * (For example, it initially ignored the 2 second updateStorage interval).
 */

/**
 * Question answers:
 * * Q1: Yes. localStorage is shared within the browser itself which is why 
 * Reader can show the results of Writer and update the changes. 
 * * Q2: No. localStorage is unique for each browser.
 */

// Check page state
const isIndexPage = window.location.pathname.includes('index') || window.location.pathname.endsWith('/');
const isReadOnly = !window.location.pathname.includes('writer');

if (isIndexPage) {
    document.title = messages.indexTitle;
    document.getElementById('mainHeading').innerText = messages.indexTitle;
    document.getElementById('linkWriter').innerText = messages.writerLink;
    document.getElementById('linkReader').innerText = messages.readerLink;
}

// Handle elements within reader & writer
const notes = []; // Initialize as an empty const array to track note objects
const notesWrapper = document.getElementById('notes');
const addBtn = document.getElementById('btnAdd');
const timeDisplay = document.getElementById('timeDisplay')

// Concatenates "updated at" or "stored at" dynamically
if (!isIndexPage) {
    const timeLabel = isReadOnly ? messages.lastUpdated : messages.lastSaved;
    document.getElementById('timeLabel').innerText = timeLabel;
    // Sets the browser tab title dynamically
    document.title = isReadOnly ? messages.readerTitle : messages.writerTitle;
}

const backBtn = document.getElementById('btnBack');
if (backBtn) {
    backBtn.innerText = messages.backButton;
    backBtn.onclick = function() {
        window.location.href = 'index'; // Points to index for reliable hosting
    }
}

// Using class to encapsulate the data along with the behaviours into one blueprint
class Note {
    constructor(content, id, isReadOnly) {
        this.content = content;
        this.id = id || Date.now(); // Creates a unique ID based on timestamp
        this.isReadOnly = isReadOnly;
    }

    // Method to create the HTML for this note (textarea + remove button)
    createDOMElement() {
        this.container = document.createElement('div');
        const elem = document.createElement('textarea');

        elem.readOnly = this.isReadOnly
        elem.value = this.content;
        elem.addEventListener('input', () => {
            this.content = elem.value;
            updateStorage();
        });
        this.container.appendChild(elem);

        if (!this.isReadOnly) {
            // Display the remove button ONLY in writer
            const removeBtn = document.createElement('button');
            removeBtn.textContent = messages.removeButton;
            removeBtn.addEventListener('click', () => this.remove());
            this.container.appendChild(removeBtn);
        }
        return this.container;
    }
    
    // Method to remove itself from the list
    remove() {
        // Remove from DOM
        this.container.remove();

        const index = notes.findIndex(note => note.id === this.id);

        if (index !== -1) {
            notes.splice(index, 1);
            updateStorage();
        }
    }
}

// Generate each note stored within the noteData
if (!isIndexPage) {
    const rawData = JSON.parse(localStorage.getItem('notes')) || [];
    
    // Updating every 2 seconds isn't completely necessary outside of this assignment (it's redundant and inefficient)
    if (isReadOnly) {
        // Reader: Fetch new data from other tabs every 2 seconds
        displayNotes(); 
        setInterval(displayNotes, 2000);
    } else {
        // Writer: Load existing notes into the tracked 'notes' array once
        rawData.forEach(data => {
            const note = new Note(data.content, data.id, false);
            notes.push(note);
            notesWrapper.appendChild(note.createDOMElement());
        });
        // Writer: Save current typing progress every 2 seconds
        setInterval(updateStorage, 2000); 
    }
}

function displayNotes() {
    // Clear the current list so we don't just keep adding to the bottom
    if (!notesWrapper) return;
    notesWrapper.innerHTML = ''; 
    
    const latestNotes = JSON.parse(localStorage.getItem('notes')) || [];
    
    latestNotes.forEach(noteData => {
        const note = new Note(noteData.content, noteData.id, true);
        notesWrapper.appendChild(note.createDOMElement());
    });
    
    // Update the "Updated at" time
    updateTime();
}

// Reused to keep note data updated after any changes
function updateStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    updateTime();
}

// Creates a new note, along with saving the updated localStorage values
if (addBtn) {
    addBtn.innerText = messages.addButton;
    addBtn.addEventListener('click', () => {
        const newNote = new Note('');
        notes.push(newNote);
        updateStorage();
        notesWrapper.appendChild(newNote.createDOMElement());
    });
}

function updateTime() {
    if (timeDisplay) {
        timeDisplay.innerText = new Date().toLocaleTimeString();
    }
}