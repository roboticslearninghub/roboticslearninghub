// Placeholder JavaScript

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'courses.db');


const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
      console.log('Connected to the courses database for routes.');
    }
});

// Get all courses
router.get('/', (req, res) => {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve courses' });
            return;
        }
        res.json(rows);
    });
});

// Get a single course by ID
router.get('/:id', (req, res) => {
    const courseId = req.params.id;
     db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
        if (err) {
            console.error(err.message);
             res.status(500).json({ error: 'Failed to retrieve course' });
            return;
        }
         if (!course){
             res.status(404).json({ error: 'Course not found'});
            return;
         }
         db.all('SELECT * FROM modules WHERE courseId = ?', [courseId], (err, modules) => {
            if (err) {
                 console.error(err.message);
                 res.status(500).json({ error: 'Failed to retrieve modules for the course' });
              return;
            }
            course.modules = modules.map(module => {
                 return {...module, videos: JSON.parse(module.videos)}
              });
              course.videos = JSON.parse(course.videos);
                res.json(course);
        });
    });
});
module.exports = router;