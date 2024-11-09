const assert = require('assert');
const sinon = require('sinon');
const fs = require('fs/promises');
const path = require('path');
const CourseDataFetcher = require('../controllers/syllabusFilterController.js'); // Update path as necessary
const pool = require('../config/db.js'); // Update path as necessary

/**
 * Unit tests for the CourseDataFetcher class.
 */
describe('CourseDataFetcher', () => {
  let courseDataFetcher;
  let queryStub;
  let testData; // Store the JSON data here after reading

  /**
   * Reads and parses test data from a JSON file.
   * @async
   * @function readTestData
   * @returns {Promise<Object>} Parsed test data.
   */
  const readTestData = async () => {
    const filePath = path.resolve(__dirname, '../testCases/syllabusFilter.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  };

  /**
   * Sets up test data and stubs the pool.query function before each test.
   * @async
   * @function beforeEach
   */
  beforeEach(async () => {
    // Load test data from JSON file
    testData = await readTestData();

    // Stub the pool.query function to mock database calls
    queryStub = sinon.stub(pool, 'query');
    courseDataFetcher = new CourseDataFetcher(pool);
  });

  /**
   * Restores stubbed functions after each test.
   * @function afterEach
   */
  afterEach(() => {
    // Restore the stubbed functions
    sinon.restore();
  });

  /**
   * Tests the successful fetching of course data.
   * Ensures that all related data such as department, session, and exam year are returned as expected.
   * @function
   */
  it('should fetch course data successfully', async () => {
    // Mocking the database queries with the test data
    queryStub.onFirstCall().yields(null, testData.department); // Department data
    queryStub.onSecondCall().yields(null, testData.session); // Session data
    queryStub.onThirdCall().yields(null, testData.examYear); // Exam Year data
    queryStub.onCall(3).yields(null, testData.course); // Course data
    queryStub.onCall(4).yields(null, testData.chapters); // Chapters data
    queryStub.onCall(5).yields(null, testData.objectives); // Objectives data
    queryStub.onCall(6).yields(null, testData.prerequisites); // Prerequisites data
    queryStub.onCall(7).yields(null, testData.recommended_books); // Recommended books data
    queryStub.onCall(8).yields(null, testData.student_learning_outcomes); // Learning outcomes

    // Call the fetchCourseData method
    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Data Structures', (err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, {
        course_id: 4,
        course_code: 'CSE 101',
        course_title: 'Data Structures',
        course_type: undefined,
        contact_hour: undefined,
        rationale: undefined,
        chapters: ['Introduction'],
        objectives: ['Understand Algorithms'],
        prerequisites: ['Basic Programming'],
        recommended_books: [{ Book_title: 'Data Structures by Knuth' }],
        student_learning_outcomes: ['Problem Solving'],
      });
    });
  });

  /**
   * Tests error handling when the specified department is not found.
   * @function
   */
  it('should return error if department not found', async () => {
    queryStub.yields(null, []); // No department found

    await courseDataFetcher.fetchCourseData('Nonexistent Department', '2019-2020', '2024', 'Data Structures', (err, data) => {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.message, 'Department not found');
      assert.strictEqual(data, null);
    });
  });

  /**
   * Tests error handling when the specified session is not found.
   * @function
   */
  it('should return error if session not found', async () => {
    queryStub.onFirstCall().yields(null, testData.department); // Department data
    queryStub.onSecondCall().yields(null, []); // No session found

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Data Structures', (err, data) => {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.message, 'Session not found');
      assert.strictEqual(data, null);
    });
  });

  /**
   * Tests error handling when the specified exam year is not found.
   * @function
   */
  it('should return error if exam year not found', async () => {
    queryStub.onFirstCall().yields(null, testData.department); // Department data
    queryStub.onSecondCall().yields(null, testData.session); // Session data
    queryStub.onThirdCall().yields(null, []); // No exam year found

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Data Structures', (err, data) => {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.message, 'Exam year not found');
      assert.strictEqual(data, null);
    });
  });

  /**
   * Tests error handling when the specified course is not found.
   * @function
   */
  it('should return error if course not found', async () => {
    queryStub.onFirstCall().yields(null, testData.department); // Department data
    queryStub.onSecondCall().yields(null, testData.session); // Session data
    queryStub.onThirdCall().yields(null, testData.examYear); // Exam year data
    queryStub.onCall(3).yields(null, []); // No course found

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Nonexistent Course', (err, data) => {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.message, 'Course not found');
      assert.strictEqual(data, null);
    });
  });

  /**
   * Tests error handling when fetching additional data (such as chapters) fails.
   * Simulates a failure during the data fetch process.
   * @function
   */
  it('should return error if additional data fetch fails', async () => {
    queryStub.onFirstCall().yields(null, testData.department); // Department data
    queryStub.onSecondCall().yields(null, testData.session); // Session data
    queryStub.onThirdCall().yields(null, testData.examYear); // Exam year data
    queryStub.onCall(3).yields(null, [{ course_id: 4 }]);
    queryStub.onCall(4).yields(new Error('Failed to fetch chapters')); // Simulate failure

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Data Structures', (err, data) => {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.message, 'Failed to fetch chapters');
      assert.strictEqual(data, null);
    });
  });


  /**
   * Tests error handling multiple chapters and objectives.
   * @function
   */

  it('should handle multiple chapters and objectives', async () => {
    queryStub.onFirstCall().yields(null, testData.department);
    queryStub.onSecondCall().yields(null, testData.session);
    queryStub.onThirdCall().yields(null, testData.examYear);
    queryStub.onCall(3).yields(null, testData.multiChapterCourse);
    queryStub.onCall(4).yields(null, testData.chapters);
    queryStub.onCall(5).yields(null, testData.objectives);

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Algorithms', (err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, {
        course_id: 5,
        course_code: 'CSE 102',
        course_title: 'Algorithms',
        course_type: 'Theory',
        contact_hour: 3,
        rationale: 'Foundational algorithms',
        chapters: ['Sorting', 'Searching', 'Graphs'],
        objectives: ['Design algorithms', 'Analyze complexity'],
        prerequisites: ['Data Structures'],
        recommended_books: [
          { Book_title: 'Introduction to Algorithms by Cormen' },
          { Book_title: 'Algorithms by Sedgewick' }
        ],
        student_learning_outcomes: ['Advanced Problem Solving', 'Efficiency in Coding']
      });
    });
  });



  it('should return empty response for optional fields', async () => {
    queryStub.onFirstCall().yields(null, testData.department);
    queryStub.onSecondCall().yields(null, testData.session);
    queryStub.onThirdCall().yields(null, testData.examYear);
    queryStub.onCall(3).yields(null, testData.emptyFieldsCourse);

    await courseDataFetcher.fetchCourseData('Computer Science & Engineering', '2019-2020', '2024', 'Operating Systems', (err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, {
        course_id: 6,
        course_code: 'CSE 201',
        course_title: 'Operating Systems',
        course_type: 'Theory',
        contact_hour: 3,
        rationale: "Fundamental Knowledge on Linux",
        chapters: ["Forking"],
        objectives: ["Analyze complexity"],
        prerequisites: [],
        recommended_books: [],
        student_learning_outcomes: ["Efficiency in Linux"]

      });
    });
  });
});
