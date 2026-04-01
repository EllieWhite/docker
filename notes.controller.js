import chalk from 'chalk';
import Note from './models/Note.js';


const addNote = async (title, owner) =>  {
    await Note.create({ title, owner })
    console.log(chalk.green.inverse('Note wass Added'))
}

const getNotes = async () => {
    const notes = await Note.find();
    console.log(notes)
    return notes;
}

const printNotes = async () =>  {
    const notes = await getNotes()
    console.log(chalk.bgBlue('Here is the list of notes:'))
    notes.forEach(note => {
        console.log(chalk.blue(note.id, note.title))
    })
}

const removeNote = async (id, owner) => {
    const result = await Note.deleteOne({_id: id, owner})
    console.log(chalk.red.inverse('Note not found'))
     if(result.matchedCount === 0) {
            throw new Error('No note delete')
        }
    
}

const replaceNote = async (noteData, owner) => {
    const result =  await Note.updateOne({_id: noteData.id, owner}, {title: noteData.title})
        if(result.matchedCount === 0) {
            throw new Error('No note edit')
        }
}

export {
    addNote, getNotes, printNotes, removeNote, replaceNote
}