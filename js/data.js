/* =====================================================
   EDUPREDICT AI
   CENTRAL STUDENT DATA
===================================================== */

const studentData = {

    profile: {
        name: "Muskan Kumari",
        education: "B.Tech",
        branch: "CSE / AI & ML",
        year: "3rd Year",
        goal: "Improve Grades"
    },

    performance: {
        overall: 78,
        attendance: 86,
        consistency: 82,
        assignment: 74,
        previousSemester: 71,
        internalMarks: 81
    },

    subjects: [
        {
            name: "DBMS",
            marks: 88,
            attendance: 92,
            status: "Strong"
        },

        {
            name: "Java",
            marks: 82,
            attendance: 88,
            status: "Strong"
        },

        {
            name: "DSA",
            marks: 68,
            attendance: 78,
            status: "Improve"
        },

        {
            name: "Mathematics",
            marks: 71,
            attendance: 83,
            status: "Improve"
        },

        {
            name: "COA",
            marks: 76,
            attendance: 85,
            status: "Good"
        }
    ],

    weeklyPerformance: [
        52,
        61,
        67,
        64,
        73,
        76,
        82,
        88
    ],

    study: {
        weeklyHours: 18.5,
        consistency: 82
    },

    prediction: {
        score: 84,
        confidence: 91,
        risk: "Low"
    },

    predictionFactors: [
        {
            name: "Previous Marks",
            value: "+15%"
        },

        {
            name: "Study Hours",
            value: "+12%"
        },

        {
            name: "Consistency",
            value: "+10%"
        },

        {
            name: "Attendance",
            value: "+8%"
        },

        {
            name: "Assignment Score",
            value: "+6%"
        },

        {
            name: "Internal Marks",
            value: "+9%"
        }
    ],

    learningPlan: [
        {
            day: "Monday",
            subject: "DSA",
            time: "1.5 Hours",
            topic: "Trees and Binary Search Trees",
            task: "Practice 5 problems"
        },

        {
            day: "Tuesday",
            subject: "DBMS",
            time: "1 Hour",
            topic: "Normalization",
            task: "Revise 1NF, 2NF and 3NF"
        },

        {
            day: "Wednesday",
            subject: "Java",
            time: "1.5 Hours",
            topic: "Collections",
            task: "ArrayList, HashMap and Set"
        },

        {
            day: "Thursday",
            subject: "DSA",
            time: "1 Hour",
            topic: "Graphs",
            task: "BFS and DFS"
        },

        {
            day: "Friday",
            subject: "Mathematics",
            time: "1 Hour",
            topic: "Weak Topics",
            task: "Revision and practice"
        }
    ],

    recommendations: [
        "Increase DSA practice to 5 focused sessions per week.",
        "Maintain attendance above 85%.",
        "Keep daily study consistency above 80%.",
        "Revise weak topics before weekly assessments."
    ]
};


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveStudentData() {

    localStorage.setItem(
        "eduPredictStudentData",
        JSON.stringify(studentData)
    );

}


/* =====================================================
   LOAD STUDENT DATA
===================================================== */

function loadStudentData() {

    const savedData =
        localStorage.getItem("eduPredictStudentData");

    if (savedData) {

        try {

            return JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Unable to load student data:",
                error
            );

        }

    }

    return studentData;
}


/* =====================================================
   GET CURRENT DATA
===================================================== */

const currentStudent = loadStudentData();


/* =====================================================
   UPDATE PROFILE
===================================================== */

function updateProfile(name, education, branch, year, goal) {

    currentStudent.profile.name = name;
    currentStudent.profile.education = education;
    currentStudent.profile.branch = branch;
    currentStudent.profile.year = year;
    currentStudent.profile.goal = goal;

    localStorage.setItem(
        "eduPredictStudentData",
        JSON.stringify(currentStudent)
    );

}


/* =====================================================
   FIND SUBJECT
===================================================== */

function getSubject(subjectName) {

    return currentStudent.subjects.find(
        subject =>
            subject.name.toLowerCase() ===
            subjectName.toLowerCase()
    );

}


/* =====================================================
   GET WEAK SUBJECTS
===================================================== */

function getWeakSubjects() {

    return currentStudent.subjects.filter(
        subject => subject.marks < 75
    );

}


/* =====================================================
   GET STRONG SUBJECTS
===================================================== */

function getStrongSubjects() {

    return currentStudent.subjects.filter(
        subject => subject.marks >= 80
    );

}


/* =====================================================
   CALCULATE AVERAGE
===================================================== */

function calculateAverage() {

    const subjects = currentStudent.subjects;

    if (!subjects.length) {
        return 0;
    }

    const total = subjects.reduce(
        (sum, subject) =>
            sum + subject.marks,
        0
    );

    return Math.round(
        total / subjects.length
    );

}


/* =====================================================
   INITIAL SAVE
===================================================== */

if (
    !localStorage.getItem("eduPredictStudentData")
) {

    saveStudentData();

}