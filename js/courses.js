import {
    getCourses,
    getTeachers,
    getStudents,
    createCourse,
    deleteCourse
} from "./rest-service.js";

let courses = [];
let teachers = [];
let students = [];

window.addEventListener("load", initCourses);

async function initCourses() {
    console.log("courses.js is running 🎉");

    teachers = await getTeachers();
    students = await getStudents();
    updateCourseTable();

    generateTeacherOptions(teachers);
    generateStudentCheckboxes(students);

    // event listeners
    document.querySelector("#form-create-course").addEventListener("submit", createCourseSubmit);
}

async function updateCourseTable() {
    document.querySelector("#courses-table tbody").innerHTML = "";
    courses = await getCourses();
    showCourses(courses);
}

function showCourses(listOfCourses) {
    for (const course of listOfCourses) {
        const teacher = teachers.find(teacher => teacher.id === course.teacher);

        const html = /*html*/ `
        <tr>
            <td>${course.name}</td>
            <td>${course.ectsPoints}</td>
            <td>${course.maxStudents}</td>
            <td>${course.startDate}</td>
            <td>${course.endDate}</td>
            <td>${teacher ? teacher.name : "No teacher"}</td>
            <td>${course.students.length}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </td>
        </tr>
    `;
        document.querySelector("#courses-table tbody").insertAdjacentHTML("beforeend", html);
        document
            .querySelector("#courses-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {
                deleteCourseClicked(course);
            });
        document
            .querySelector("#courses-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {});
    }
}

async function deleteCourseClicked(course) {
    const response = await deleteCourse(course.id);
    if (response.ok) {
        await updateCourseTable();
    }
}

function generateTeacherOptions(teachers) {
    let html;

    for (const teacher of teachers) {
        html += /*html*/ `<option value="${teacher.id}">${teacher.name}</option>`;
    }

    document.querySelector("#course-teacher").insertAdjacentHTML("beforeend", html);
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
