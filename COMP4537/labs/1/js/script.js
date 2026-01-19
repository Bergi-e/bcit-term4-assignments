const notes = (JSON.parse(localStorage.getItem('notes'))) || [];
const notesWrapper = document.getElementById('notes');

class Note {
    constructor(content) {
        this.content = content;
        this.id = Date.now(); // Creates a unique ID based on timestamp
    }

    // Method to create the HTML for this note (textarea + remove button)
    createDOMElement() {
        this.container = document.createElement('div');

        const elem = document.createElement('textarea');
        const removeButton = document.createElement('button');

        elem.value = this.content;
        removeButton.textContent = messages.removeButton;
        removeButton.addEventListener('click', () => this.remove());

        this.container.appendChild(removeButton);
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