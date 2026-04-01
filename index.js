require('dotenv').config();
import chalk from 'chalk'
import { dirname } from 'path';
import { fileURLToPath } from 'url'
import express from 'express';
import path from "node:path";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { addNote, getNotes, removeNote, replaceNote } from './notes.controller.js';
import { addUser, loginUser } from './users.controller.js';
import auth from './middlewares/auth.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
//const basePath = join(__dirname, 'pages')
//const server = http.createServer(async(req, res) => {
//    if(req.method === "GET") {
//        const content = await fs.readFile(join(basePath, 'index.html'))
//        res.writeHead(200, {
//            'Content-Type': 'text/html'
//        })
//       res.writeHead(404)
//        res.end(content)
//    } else if (req.method === "POST") {
//
//        const body = []
//        res.writeHead(200, {
//            'Content-type': 'text/plain; charset=utf-8'
//        })
//
//        req.on('data', data => {
//            body.push(Buffer.from(data))
//        })
//
//        req.on('end', () => {
//            const title = body.toString().split('=')[1].replaceAll('+', ' ');
//            addNote(title)
//        }) 
//        res.end('Post success')
//    }
//})

app.get('/register', async (req, res) => {
    res.render('register', {
        title: 'Express App',
        error: undefined
    })
})
app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Express App',
        error: undefined,
    })
})

app.post('/login', async (req, res) => {
    try {
        const token = await loginUser(req.body.email, req.body.password);
        res.cookie('token', token, {httpOnly: true})
        res.redirect('/')
    } catch (e) {
        res.render('login', {
        title: 'Express App',
        error: e.message
    })
    }
})
 
app.post('/register', async (req, res) => {
    try {
        await addUser(req.body.email, req.body.password);
        res.redirect('/login')
    } catch (e) {
        if (e.code === 11000) {
            res.render('register', {
            title: 'Express App',
            error: 'Email is already register'
        })
            return
        }
        res.render('register', {
            title: 'Express App',
            error: e.message
        })
    }
})
app.get('/logout', (req, res) => {
    res.cookie('token', '', {httpOnly: true})
    res.redirect('/login')
})
app.use(auth);

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        userEmail: req.user.email,
        created: false,
        error: false
    })
})

app.post('/', async (req, res) => {
    try {
       await addNote(req.body.title, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: true,
            error: false
        })
    } catch(e) {
        console.error('creation error', e)
         res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            created: false,
            error: true
        })
    }
})

app.delete('/:id', async (req, res) => {
    try{
        await removeNote(req.params.id, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: false
        })
    } catch (e) {
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: e.message
        })
    }
}) 

app.put('/:id', async (req, res) => {
    try {
        await replaceNote({id: req.params.id, title: req.body.title}, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: false
        })
    } catch (e) {
            res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: e.message
        })
    }

}) 

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING
).then(() => {

    app.listen(port, () => {
        console.log(chalk.green(`Server has been started on port ${port}`))
    })
})

//app.listen(port, () => {
//    console.log(chalk.green(`Server has been started on port ${port}`))
//})