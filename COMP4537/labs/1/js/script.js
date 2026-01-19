const notes = (JSON.parse(localStorage.getItem('notes'))) || [];
const notesWrapper = document.getElementById('notes');
const addBtn = document.getElementById('btnAdd');

// Creates a new note, along with saving the updated localStorage values
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const newNote = new Note('');
        notes.push(newNote);
        localStorage.setItem('notes', JSON.stringify(notes));
        notesWrapper.appendChild(newNote.createDOMElement());
    });
}


class Note {
    constructor(content, id) {
        this.content = content;
        this.id = id || Date.now(); // Creates a unique ID based on timestamp
    }

    // Method to create the HTML for this note (textarea + remove button)
    createDOMElement() {
        this.container = document.createElement('div');

        const elem = document.createElement('textarea');
        elem.value = this.content;
        elem.addEventListener('input', () => {
            this.content = elem.value;
            localStorage.setItem('notes', JSON.stringify(notes));
        });
        this.container.appendChild(elem);

        // addBtn is essentially a read/write page clause
        if (addBtn) {

            // Display the remove button ONLY in writer.html
            const removeBtn = document.createElement('button');
            removeBtn.textContent = messages.removeButton;
            removeBtn.addEventListener('click', () => this.remove());
            this.container.appendChild(removeBtn);
        } else {
            elem.readOnly = true;
        }
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

notes.forEach(noteData => {
    const note = new Note(noteData.content, noteData.id);
    notesWrapper.appendChild(note.createDOMElement());

});