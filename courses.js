"use strict";

let courses = [];

window.addEventListener("load", initCourses);

async function initCourses() {
    console.log("courses.js is running 🎉");
    courses = await getCourses();
    console.log(courses);
    showCourses(courses);
}

async function getCourses() {
    const response = await fetch(endpoint + "/courses.json");
    const data = await response.json();
    console.log(data);
    return prepareData(data);
}

function showCourses(listOfCourses) {
    for (const course of listOfCourses) {
        const html = /*html*/ `
        <tr>
            <td>${course.name}</td>
            <td>${course.ectsPoints}</td>
            <td>${course.maxStudents}</td>
            <td>${course.startDate}</td>
            <td>${course.endDate}</td>
            <td>${course.teacher}</td>
            <td>${course.students}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </td>
        </tr>
    `;
        document.querySelector("#courses-table tbody").insertAdjacentHTML("beforeend", html);
        document
            .querySelector("#courses-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {});
        document
            .querySelector("#courses-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {});
    }
}

async function getTeacher(id) {
    const response = await fetch(`${endpoint}/teachers/${id}`);
    const data = await response.json();
    return data;
}
