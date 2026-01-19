const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'storyku_db'
});

db.connect((err) => {
    if (err) console.error('Error connecting to DB:', err);
    else console.log('Connected to MySQL!');
});

app.get('/', (req, res) => { res.send('Server Storyku Ready!'); });

app.get('/stories', (req, res) => {
    const sql = "SELECT * FROM stories ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
});

app.get('/stories/:id', (req, res) => {
    const sql = "SELECT * FROM stories WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({message: "Not found"});
        return res.json(result[0]);
    });
});

app.post('/add-story', upload.single('cover_image'), (req, res) => {
    const { title, author, synopsis, category, tags, status } = req.body;
    const cover_image = req.file ? req.file.filename : null;
    const sql = "INSERT INTO stories (title, author, synopsis, category, cover_image, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, author, synopsis, category, cover_image, tags, status], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Success", id: result.insertId });
    });
});

app.put('/stories/:id', upload.single('cover_image'), (req, res) => {
    const { id } = req.params;
    const { title, author, synopsis, category, tags, status } = req.body;
    let sql, values;
    if (req.file) {
        sql = "UPDATE stories SET title=?, author=?, synopsis=?, category=?, tags=?, status=?, cover_image=? WHERE id=?";
        values = [title, author, synopsis, category, tags, status, req.file.filename, id];
    } else {
        sql = "UPDATE stories SET title=?, author=?, synopsis=?, category=?, tags=?, status=? WHERE id=?";
        values = [title, author, synopsis, category, tags, status, id];
    }
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Updated" });
    });
});

app.delete('/stories/:id', (req, res) => {
    db.query("DELETE FROM stories WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Deleted" });
    });
});

app.get('/stories/:id/chapters', (req, res) => {
    const sql = "SELECT * FROM chapters WHERE story_id = ? ORDER BY last_updated DESC";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
});

app.get('/chapters/:id', (req, res) => {
    const sql = "SELECT * FROM chapters WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({message: "Not found"});
        return res.json(result[0]);
    });
});

app.post('/add-chapter', (req, res) => {
    const { story_id, chapter_title, story_chapter } = req.body;
    const sql = "INSERT INTO chapters (story_id, chapter_title, story_chapter) VALUES (?, ?, ?)";
    db.query(sql, [story_id, chapter_title, story_chapter], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Chapter added" });
    });
});

app.put('/chapters/:id', (req, res) => {
    const { id } = req.params;
    const { chapter_title, story_chapter } = req.body;
    const sql = "UPDATE chapters SET chapter_title=?, story_chapter=? WHERE id=?";
    db.query(sql, [chapter_title, story_chapter, id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Chapter updated" });
    });
});

app.delete('/chapters/:id', (req, res) => {
    db.query("DELETE FROM chapters WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Deleted" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});