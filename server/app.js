// Placeholder JavaScript

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const coursesRoutes = require('./routes/courses');
const path = require('path');


const app = express();
const port = 3000;


const db = new sqlite3.Database(path.join(__dirname, 'database', 'courses.db'), (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }
    console.log('Connected to the courses database.');
    //Initialize the database
     db.run(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            overview TEXT,
            thumbnail TEXT,
            documentation TEXT,
            videos TEXT
        )
    `);
       db.run(`
        CREATE TABLE IF NOT EXISTS modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            courseId INTEGER,
            name TEXT,
           content TEXT,
            videos TEXT,
            FOREIGN KEY (courseId) REFERENCES courses(id)
        )
    `);
    //create initial data
      db.get('SELECT COUNT(*) AS count FROM courses', (err, row) => {
        if (row.count === 0) {
        const initialCourses = [
          {
            title: "Introduction to Robotics",
             description: "A beginner-friendly course to get started with the fundamentals of robotics.",
              overview: "This course provides an introduction to the basic concepts and components of robotics. Students will learn about robot mechanics, sensors, and actuators, and will develop foundational skills for further study in the field.",
               thumbnail: "robotics-intro.jpg",
               documentation: "<p><strong>Welcome to the Introduction to Robotics course!</strong> This module will introduce you to the core concepts and terminology.</p> <img src='../img/placeholder-image.jpg' alt='Robotics Intro Image'>",
                videos: JSON.stringify([])
          },
           {
            title: "Advanced Robotics Programming",
             description: "Dive deep into advanced programming techniques for complex robotic systems.",
                overview: "This advanced course delves into complex programming techniques for robotics. Students will explore advanced algorithms and software design principles for creating sophisticated robotic applications.",
               thumbnail: "robotics-programming.jpg",
                documentation: "<p><strong>Welcome to Advanced Robotics Programming!</strong> In this module, you will be exploring advanced algorithms.</p>",
                  videos: JSON.stringify([])
          },
           {
            title: "Robotics Vision",
            description: "Learn about computer vision and its applications in robotics",
                overview: "Explore the principles of computer vision and how it applies to robotics. This course will cover visual data processing, feature detection, and object recognition.",
               thumbnail: "robotics-vision.jpg",
                 documentation: "<p><strong>Welcome to Robotics Vision!</strong> You'll learn about computer vision and how it empowers robots.</p>",
               videos: JSON.stringify([])
           }
        ];
        initialCourses.forEach(course => {
            const { title, description, overview, thumbnail, documentation, videos } = course;
              db.run('INSERT INTO courses (title, description, overview, thumbnail, documentation, videos) VALUES (?, ?, ?, ?, ?, ?)', [title, description, overview, thumbnail, documentation, videos]);
        });
             const initialModules = [
              {
                courseId: 1,
                name: "Introduction",
                  content: "<p>Welcome to the course! This is a general introduction.</p>",
                 videos: JSON.stringify([])
              },
               {
                courseId: 1,
                name: "Robot Anatomy",
                 content: "<p>Let's explore the different parts of a robot.</p>",
                 videos: JSON.stringify([])
              },
                {
                courseId: 2,
                name: "Advanced Algorithm",
                 content: "<p>This module covers advanced algorithms.</p>",
                    videos: JSON.stringify([])
              },
                {
                courseId: 2,
                name: "Software Design",
                content: "<p>Learn about the software design principles.</p>",
                  videos: JSON.stringify([])
              },
                {
                courseId: 3,
                name: "Visual Data Processing",
                content:"<p>This module introduces visual data processing.</p>",
                   videos: JSON.stringify([])
              },
                 {
                courseId: 3,
                name: "Object Recognition",
                 content:"<p>Learn how robots recognize objects.</p>",
                 videos: JSON.stringify([])
              }
         ];
              initialModules.forEach(module => {
           const { courseId, name, content, videos } = module;
            db.run('INSERT INTO modules (courseId, name, content, videos) VALUES (?, ?, ?, ?)', [courseId, name, content, videos]);
       });
        }
        });
});

app.use(express.json());
app.use('/api/courses', coursesRoutes);
// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));
// Handle requests for individual course pages
app.get('/courses/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/courses/course1.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});