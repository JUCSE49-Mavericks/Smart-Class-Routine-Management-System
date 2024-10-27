// controllers/classRepresentativeController.js
const { getClassRepresentativeByExamYearId } = require('../models/classRepresentativeModel');

const fetchClassRepresentativeByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getClassRepresentativeByExamYearId(exam_year_id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Class Representative not found' });
        }

        console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error fetching class representative data: ', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    fetchClassRepresentativeByExamYearId
};
