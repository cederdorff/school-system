// ENPOINT URL
const endpoint = "https://race-school-system-default-rtdb.firebaseio.com";

// ========== COURSES ========== //

async function getCourses() {
    const response = await fetch(endpoint + "/courses.json");
    const data = await response.json();
    return prepareData(data);
}

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

async function deleteCourse(id) {
    return await fetch(`${endpoint}/courses/${id}.json`, { method: "DELETE" });
}

// ========== TEACHERS ========== //

async function getTeachers() {
    const response = await fetch(endpoint + "/teachers.json");
    const data = await response.json();
    return prepareData(data);
}

async function createTeacher(name, email) {
    const newTeacher = {
        name: name,
        email: email
    };
    const json = JSON.stringify(newTeacher);
    return await fetch(endpoint + "/teachers.json", { method: "POST", body: json });
}

async function updateTeacher(id, name, email) {
    const teacher = { name, email };
    const json = JSON.stringify(teacher);
    return await fetch(`${endpoint}/teachers/${id}.json`, {
        method: "PUT",
        body: json
    });
}

async function deleteTeacher(id) {
    return await fetch(`${endpoint}/teachers/${id}.json`, { method: "DELETE" });
}

// ========== STUDENTS ========== //
async function getStudents() {
    const response = await fetch(endpoint + "/students.json");
    const data = await response.json();
    return prepareData(data);
}

async function createStudent(name, email) {
    const newStudent = {
        name: name,
        email: email
    };
    const json = JSON.stringify(newStudent);
    return fetch(endpoint + "/students.json", { method: "POST", body: json });
}

async function updateStudent(id, name, email) {
    const student = { name, email };
    const json = JSON.stringify(student);
    return await fetch(`${endpoint}/students/${id}.json`, {
        method: "PUT",
        body: json
    });
}

async function deleteStudent(id) {
    return await fetch(`${endpoint}/students/${id}.json`, { method: "DELETE" });
}

// ========== HELPER FUNCTIONS ========== //
// convert object of objects til an array of objects
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
