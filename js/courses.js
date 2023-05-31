// imports from the module rest-service.js
import {
    getCourses,
    getTeachers,
    getStudents,
    createCourse,
    deleteCourse,
    updateCourse
} from "./rest-service.js";
// global variabels (global for this modules)
let courses = [];
let teachers = [];
let students = [];
let selectedCourseId;
// window on load event executes initCourses
window.addEventListener("load", initCourses);

async function initCourses() {
    console.log("courses.js is running 🎉");
    // get and save teachers and students in global variabels - used to generate the table of courses - instead of just showing the ids
    teachers = await getTeachers();
    students = await getStudents();

    updateCourseTable();

    generateTeacherOptions(teachers);
    generateStudentCheckboxes(students);

    // event listeners
    document.querySelector("#form-create-course").addEventListener("submit", createCourseSubmit);
    document.querySelector("#form-update-course").addEventListener("submit", updateCourseSubmit);
}
// updates the table view with new fetched courses
async function updateCourseTable() {
    // reset the table content (tbody) before adding new updated content
    document.querySelector("#courses-table tbody").innerHTML = "";
    // get all courses (updated) from Firebase and save in global variable
    courses = await getCourses();
    // show all courses
    showCourses(courses);
}

// show all courses by given array of courses
function showCourses(listOfCourses) {
    // loop through all courses in the given list
    for (const course of listOfCourses) {
        // find the teacher of the course by course.teacher (id)
        const teacher = teachers.find(teacher => teacher.id === course.teacher);
        // generate html - a table row with course info
        const html = /*html*/ `
        <tr>
            <td>${course.name}</td>
            <td>${course.ectsPoints}</td>
            <td>${course.maxStudents}</td>
            <td>${course.startDate}</td>
            <td>${course.endDate}</td>
            <td>${teacher ? teacher.name : "No teacher"}</td>
            <td>${course.students ? course.students.length : 0}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </td>
        </tr>
    `;
        //add generated html (table row) to the DOM (tbody)
        document.querySelector("#courses-table tbody").insertAdjacentHTML("beforeend", html);
        // add click event to the delete button
        document
            .querySelector("#courses-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {
                // when delete button clicked, call deleteCourseClicked with course as argument
                deleteCourseClicked(course);
            });
        // add click event to the update button
        document
            .querySelector("#courses-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {
                // when update button clicked, call showUpdateCourseDialog with course as argument
                showUpdateCourseDialog(course);
            });
    }
}

// show update dialog with update form
function showUpdateCourseDialog(course) {
    console.log(course);
    selectedCourseId = course.id; // store the selected course id in global variable
    const form = document.querySelector("#form-update-course"); // reference to the update form
    // set input values with data from teacher object
    form.name.value = course.name;
    form.ectsPoints.value = course.ectsPoints;
    form.maxStudents.value = course.maxStudents;
    form.startDate.value = course.startDate;
    form.endDate.value = course.endDate;
    form.teacher.value = course.teacher;

    setSelectedStudents(form, course.students); // set selected students
    document.querySelector("#dialog-update-course").showModal(); // display the modal
}

function setSelectedStudents(form, students) {
    // loop through all checkboxes in the form (create form or update form)
    form.querySelectorAll(".checkboxes input").forEach(function (input) {
        // if the list of student ids includes the value from the checkbox input
        // the checkbox inputs are generated in generateStudentCheckboxes(...)
        if (students?.includes(input.value)) {
            input.checked = true; // set checked to true
        } else {
            input.checked = false; // set checked to false
        }
    });
}

// called when you hit the delete button
async function deleteCourseClicked(course) {
    // call deleteCourse by given id - deleteCourse is imported from rest-service
    const response = await deleteCourse(course.id);
    if (response.ok) {
        // if delete ok update the table view with new course data
        await updateCourseTable();
    }
}

function generateTeacherOptions(teachers) {
    let html = "";

    for (const teacher of teachers) {
        html += /*html*/ `<option value="${teacher.id}">${teacher.name}</option>`;
    }

    document.querySelector("#course-teacher").insertAdjacentHTML("beforeend", html);
    document.querySelector("#update-course-teacher").insertAdjacentHTML("beforeend", html);
}

function generateStudentCheckboxes(students) {
    let html = "";

    for (const student of students) {
        console.log(student);
        html += /*html*/ `
            <input type="checkbox" value="${student.id}" id="${student.id}"/>
            <label for="${student.id}">${student.name}</label>
        `;
    }

    document.querySelector("#course-students").insertAdjacentHTML("beforeend", html);
    document.querySelector("#update-course-students").insertAdjacentHTML("beforeend", html);
}

async function createCourseSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const name = form.name.value;
    const ectsPoints = form.ectsPoints.value;
    const maxStudents = form.maxStudents.value;
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const teacher = form.teacher.value;
    const students = getSelectedStudents(form);

    const response = await createCourse(
        name,
        ectsPoints,
        maxStudents,
        startDate,
        endDate,
        teacher,
        students
    );

    if (response.ok) {
        await updateCourseTable();
        form.reset();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

async function updateCourseSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const name = form.name.value;
    const ectsPoints = form.ectsPoints.value;
    const maxStudents = form.maxStudents.value;
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const teacher = form.teacher.value;
    const students = getSelectedStudents(form);

    const response = await updateCourse(
        selectedCourseId,
        name,
        ectsPoints,
        maxStudents,
        startDate,
        endDate,
        teacher,
        students
    );

    if (response.ok) {
        await updateCourseTable();
        document.querySelector("#dialog-update-course").close();
    }
}

function getSelectedStudents(form) {
    const selectedStudents = [];
    form.querySelectorAll(".checkboxes input").forEach(function (input) {
        if (input.checked) {
            selectedStudents.push(input.value);
        }
    });
    return selectedStudents;
}
