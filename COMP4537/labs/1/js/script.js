/**  AI NOTE:
 * Gemini was used in the process of creating this code. 
 * I made sure to Guided Learning feature to go line-by-line
 * and fully understand every part of what I was making. 
 * 
 * The AI would ask questions on what I would/should do, and assisted
 * me in reaching the correct endpoint. I made sure the final result was on par
 * with what the assignment required
 * (For example, it initially ignored the 2 second updateStorage interval).
 */

// Check for index page
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');

if (isIndexPage) {
    document.title = messages.indexTitle;
    document.getElementById('mainHeading').innerText = messages.indexTitle;
    document.getElementById('linkWriter').innerText = messages.writerLink;
    document.getElementById('linkReader').innerText = messages.readerLink;
}

// For read/write pages
const notes = (JSON.parse(localStorage.getItem('notes'))) || [];
const notesWrapper = document.getElementById('notes');
const addBtn = document.getElementById('btnAdd');
const timeDisplay = document.getElementById('timeDisplay')
const isReadOnly = !window.location.pathname.includes('writer.html');

// Concatenates "updated at" or "stored at" dynamically
const timeLabel = isReadOnly ? messages.lastUpdated : messages.lastSaved;
document.getElementById('timeLabel').innerText = timeLabel;
// Sets the browser tab title dynamically
document.title = isReadOnly ? messages.readerTitle : messages.writerTitle;

const backBtn = document.getElementById('btnBack');
backBtn.innerText = messages.backButton;
backBtn.onclick = function() {
    window.location.href = 'index.html';
}

// Creates a new note, along with saving the updated localStorage values
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const newNote = new Note('');
        notes.push(newNote);
        updateStorage();
        notesWrapper.appendChild(newNote.createDOMElement());
    });
    addBtn.innerText = messages.addButton;
}

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
            // Display the remove button ONLY in writer.html
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
    notes.forEach(noteData => {
        const note = new Note(noteData.content, noteData.id, isReadOnly);
        notesWrapper.appendChild(note.createDOMElement());
    });

    // Update the storage every 2000 ms (2s)
    setInterval(updateStorage, 2000);
}

// Reused to keep note data updated after any changes
function updateStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    timeDisplay.innerText = new Date().toLocaleTimeString();
}
