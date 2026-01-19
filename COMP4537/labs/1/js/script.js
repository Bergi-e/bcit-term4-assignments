const notes = (JSON.parse(localStorage.getItem('notes'))) || [];
const notesWrapper = document.getElementById('notes');
const addBtn = document.getElementById('btnAdd');

// Creates a new note, along with saving the updated localStorage values
addBtn.addEventListener('click', () => {
    const newNote = new Note('');
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    notesWrapper.appendChild(newNote.createDOMElement());
});


class Note {
    constructor(content) {
        this.content = content;
        this.id = Date.now(); // Creates a unique ID based on timestamp
    }

    // Method to create the HTML for this note (textarea + remove button)
    createDOMElement() {
        this.container = document.createElement('div');

        const elem = document.createElement('textarea');
        const removeBtn = document.createElement('button');

        elem.value = this.content;
        removeBtn.textContent = messages.removeButton;
        removeBtn.addEventListener('click', () => this.remove());

        this.container.appendChild(removeBtn);
        this.container.appendChild(elem);
        return this.container;
    }
    
    // Method to remove itself
    remove() {
        // Remove from DOM
        this.container.remove();
        // Trigger a save to update localStorage
        const notes = JSON.parse(localStorage.getItem('notes'));
        const filteredNotes = notes.filter(note => note.id !== this.id);
        localStorage.setItem('notes', JSON.stringify(filteredNotes));
        
    }
}