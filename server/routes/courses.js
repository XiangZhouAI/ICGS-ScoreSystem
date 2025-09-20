const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/courses/luttrellstown - Create Luttrellstown course with real data
router.post('/luttrellstown', async (req, res) => {
  try {
    const luttrrellstownData = {
      name: 'Luttrellstown Castle Golf Club',
      location: 'Clonsilla, Dublin 15, Ireland',
      holes: [
        // Front 9
        { number: 1, par: 4, strokeIndexMen: 7, strokeIndexLadies: 7, yardage: { blue: 406, white: 398, green: 374, red: 329 } },
        { number: 2, par: 5, strokeIndexMen: 11, strokeIndexLadies: 3, yardage: { blue: 550, white: 528, green: 517, red: 443 } },
        { number: 3, par: 4, strokeIndexMen: 3, strokeIndexLadies: 13, yardage: { blue: 426, white: 405, green: 391, red: 323 } },
        { number: 4, par: 3, strokeIndexMen: 15, strokeIndexLadies: 17, yardage: { blue: 228, white: 186, green: 163, red: 148 } },
        { number: 5, par: 4, strokeIndexMen: 1, strokeIndexLadies: 1, yardage: { blue: 433, white: 410, green: 391, red: 344 } },
        { number: 6, par: 3, strokeIndexMen: 9, strokeIndexLadies: 15, yardage: { blue: 202, white: 194, green: 176, red: 132 } },
        { number: 7, par: 4, strokeIndexMen: 5, strokeIndexLadies: 11, yardage: { blue: 424, white: 410, green: 394, red: 330 } },
        { number: 8, par: 5, strokeIndexMen: 17, strokeIndexLadies: 5, yardage: { blue: 508, white: 500, green: 486, red: 416 } },
        { number: 9, par: 4, strokeIndexMen: 13, strokeIndexLadies: 9, yardage: { blue: 408, white: 378, green: 362, red: 342 } },
        // Back 9
        { number: 10, par: 4, strokeIndexMen: 6, strokeIndexLadies: 2, yardage: { blue: 421, white: 398, green: 382, red: 342 } },
        { number: 11, par: 4, strokeIndexMen: 16, strokeIndexLadies: 14, yardage: { blue: 419, white: 345, green: 330, red: 265 } },
        { number: 12, par: 5, strokeIndexMen: 14, strokeIndexLadies: 10, yardage: { blue: 521, white: 514, green: 498, red: 405 } },
        { number: 13, par: 3, strokeIndexMen: 12, strokeIndexLadies: 18, yardage: { blue: 216, white: 200, green: 154, red: 141 } },
        { number: 14, par: 4, strokeIndexMen: 2, strokeIndexLadies: 12, yardage: { blue: 494, white: 458, green: 438, red: 314 } },
        { number: 15, par: 3, strokeIndexMen: 18, strokeIndexLadies: 16, yardage: { blue: 181, white: 155, green: 123, red: 112 } },
        { number: 16, par: 4, strokeIndexMen: 8, strokeIndexLadies: 8, yardage: { blue: 450, white: 396, green: 379, red: 343 } },
        { number: 17, par: 4, strokeIndexMen: 4, strokeIndexLadies: 6, yardage: { blue: 505, white: 449, green: 416, red: 357 } },
        { number: 18, par: 5, strokeIndexMen: 10, strokeIndexLadies: 4, yardage: { blue: 555, white: 488, green: 472, red: 421 } }
      ],
      totalPar: 72,
      sss: {
        men: 72,
        ladies: 74
      }
    };
    
    // Check if Luttrellstown already exists
    const existing = await Course.findOne({ name: luttrrellstownData.name });
    if (existing) {
      return res.status(400).json({ error: 'Luttrellstown Castle course already exists' });
    }
    
    const course = new Course(luttrrellstownData);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;