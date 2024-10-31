// controllers/assignedCourseTeacherController.js
const {
    updateAssignedCourseTeacher,
    addAssignedCourseTeacherObject,
    getAssignedCourseTeachersByExamYearId,
    getCoursesByExamYearId,
    uploadCSVAssignedCourseTeacherModel
} = require('../models/assignedCourseTeacherModel');

const handleUpdateAssignedCourseTeacher = async (req, res) => {
    const { assigned_course_teacher_id, teacher_id } = req.body;

    try {
        const result = await updateAssignedCourseTeacher(assigned_course_teacher_id, teacher_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error handling course-teacher assignment:', error);
        res.status(500).json({ error: 'Database error while assigning course to teacher' });
    }
};


// Controller function to handle assigning or updating course-teacher relationship
const insertAssignedCourseTeacherObject = async (req, res) => {
    // console.log('ola');
    const { course_id , exam_year_id} = req.body;
    try {
        const result = await addAssignedCourseTeacherObject(course_id, exam_year_id);
        res.status(200).json({ message: 'Assigned course-teacher successfully', result });
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Failed to assign or update course-teacher' });
    }
};

// Function to get assigned course teachers by exam_year_id
const getAssignedCourseTeachers = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;

    try {
        const results = await getAssignedCourseTeachersByExamYearId(exam_year_id);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
};


const fetchCoursesByExamYearId = async (req, res) => {
    const exam_year_id = req.params.exam_year_id;
    // console.log(exam_year_id);
    try {
        const results = await getCoursesByExamYearId(exam_year_id);
        // console.log(results);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
};



// Example function to handle CSV data processing
const processCSVData = async (csvData) => {
    // console.log('Hello hello');
    // console.log(csvData);
    const promises = csvData.map((row) => {
        const { course_id, teacher_id } = row; // Adjust based on your CSV structure
        return uploadCSVAssignedCourseTeacherModel(course_id, teacher_id);
    });

    try {
        const results = await Promise.all(promises);
        return { message: 'All records processed successfully', results };
    } catch (error) {
        console.error('Error processing records:', error);
        throw new Error('Error processing records');
    }
};


// Example upload function without multer (if you are handling raw CSV input)
const uploadCSVAssignedCourseTeacher = (req, res) => {
    const csvData = req.body.csvData; // Assume this is an array of objects representing CSV rows
    // console.log('hello');
    // console.log(csvData);
    processCSVData(csvData)
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};


module.exports = {
    handleUpdateAssignedCourseTeacher,
    insertAssignedCourseTeacherObject,
    getAssignedCourseTeachers,
    fetchCoursesByExamYearId,
    uploadCSVAssignedCourseTeacher
};
