// ENPOINT URL
const endpoint = "https://race-school-system-default-rtdb.firebaseio.com";

// ========== COURSES ========== //

// get all courses from Firebase Rest Endpoint
async function getCourses() {
    const response = await fetch(endpoint + "/courses.json");
    const data = await response.json();
    return prepareData(data); // Only for Firebase! prepareData is used to transform object of objects to array of objects
}

// create a new course
async function createCourse(name, ectsPoints, maxStudents, startDate, endDate, teacher, students) {
    const newCourse = {
        name,
        ectsPoints,
        maxStudents,
        startDate,
        endDate,
        teacher,
        students
    };
    const json = JSON.stringify(newCourse);
    return await fetch(endpoint + "/courses.json", { method: "POST", body: json });
}

// update a course by given id prop and name, ectsPoints, maxStudents, startDate, endDate, teacher, & students
async function updateCourse(
    id,
    name,
    ectsPoints,
    maxStudents,
    startDate,
    endDate,
    teacher,
    students
) {
    const course = { name, ectsPoints, maxStudents, startDate, endDate, teacher, students };
    const json = JSON.stringify(course);
    return await fetch(`${endpoint}/courses/${id}.json`, {
        method: "PUT",
        body: json
    });
}

// delete a course by given id
async function deleteCourse(id) {
    return await fetch(`${endpoint}/courses/${id}.json`, { method: "DELETE" });
}

// ========== TEACHERS ========== //

// get all teachers from Firebase Rest Endpoint
async function getTeachers() {
    const response = await fetch(endpoint + "/teachers.json");
    const data = await response.json();
    return prepareData(data); // Only for Firebase! prepareData is used to transform object of objects to array of objects
}

// create teacher by given name and email
async function createTeacher(name, email) {
    const newTeacher = {
        name: name,
        email: email
    };
    const json = JSON.stringify(newTeacher);
    return await fetch(endpoint + "/teachers.json", { method: "POST", body: json });
}

// update teacher by given id, name and email
async function updateTeacher(id, name, email) {
    const teacher = { name, email };
    const json = JSON.stringify(teacher);
    return await fetch(`${endpoint}/teachers/${id}.json`, {
        method: "PUT",
        body: json
    });
}

// delete a teacher by given id
async function deleteTeacher(id) {
    return await fetch(`${endpoint}/teachers/${id}.json`, { method: "DELETE" });
}

// ========== STUDENTS ========== //
// get all students from Firebase Rest Endpoint
async function getStudents() {
    const response = await fetch(endpoint + "/students.json");
    const data = await response.json();
    return prepareData(data); // Only for Firebase! prepareData is used to transform object of objects to array of objects
}

// create student by name and email
async function createStudent(name, email) {
    const newStudent = {
        name: name,
        email: email
    };
    const json = JSON.stringify(newStudent);
    return fetch(endpoint + "/students.json", { method: "POST", body: json });
}

// update student by given id, name and email
async function updateStudent(id, name, email) {
    const student = { name, email };
    const json = JSON.stringify(student);
    return await fetch(`${endpoint}/students/${id}.json`, {
        method: "PUT",
        body: json
    });
}

// delete student by given id
async function deleteStudent(id) {
    return await fetch(`${endpoint}/students/${id}.json`, { method: "DELETE" });
}

// ========== HELPER FUNCTIONS ========== //
// convert object of objects til an array of objects
// THIS IS ONLY FOR FIREBASE: Firebase returns a big object og objects
function prepareData(dataObject) {
    const array = []; // define empty array
    // loop through every key in dataObject
    // the value of every key is an object
    for (const key in dataObject) {
        const object = dataObject[key]; // define object
        object.id = key; // add the key in the prop id
        array.push(object); // add the object to array
    }
    return array; // return array back to "the caller"
}

// export function (references) needed in others modules
// all exported function cam be imported in other modules
export {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
};
