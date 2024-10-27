const db = require('../config/db');
const {getCourseByExamYearId, getCourseByCourseId} = require('../models/courseModel');


const fetchCourseByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getCourseByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching Course data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};


const fetchCourseByCourseId = async (req, res) => {
    const course_id = req.params.course_id;

    try {
        const results = await getCourseByCourseId(course_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching Course data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    fetchCourseByExamYearId,
    fetchCourseByCourseId
}