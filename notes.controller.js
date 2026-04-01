import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const notesPath = join(__dirname, 'db.json')


async function addNote(title) {
    const notes = await getNotes()
    const note = {
        title,
        id: Date.now().toString()
    }

    notes.push(note)

    await fs.writeFile(notesPath, JSON.stringify(notes))
    console.log(chalk.green.inverse('Note wass Added'))
}

addNote('Test')

async function getNotes() {
    const notes = await fs.readFile(notesPath, { encoding: 'utf-8'})
    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function printNotes() {
    const notes = await getNotes()
    console.log(chalk.bgBlue('Here is the list of notes:'))
    notes.forEach(note => {
        console.log(chalk.blue(note.title))
    })
}

export default {
    addNote, getNotes, printNotes
}