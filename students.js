"use strict";

let students = [];
let selectedStudentId;

window.addEventListener("load", initStudents);

async function initStudents() {
    console.log("students.js is running 🎉");
    await updateStudentTable();

    //events
    document.querySelector("#form-create-student").addEventListener("submit", createStudentSubmit);
    document.querySelector("#form-update-student").addEventListener("submit", updateStudentSubmit);
}

async function updateStudentTable() {
    document.querySelector("#students-table tbody").innerHTML = "";
    students = await getStudents();
    sortByName();

    showStudents(students);
}

function createStudentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    createStudent(name, email);
}

async function createStudent(name, email) {
    const newStudent = {
        name: name,
        email: email
    };
    console.log(newStudent);
    const json = JSON.stringify(newStudent);
    console.log(json);

    const response = await fetch(endpoint + "/students.json", { method: "POST", body: json });

    if (response.ok) {
        await updateStudentTable();
    }
}

function showStudents(listOfStudents) {
    for (const student of listOfStudents) {
        const html = /*html*/ `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>

            </td>
        </tr>
    `;
        document.querySelector("#students-table tbody").insertAdjacentHTML("beforeend", html);
        document
            .querySelector("#students-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {
                deleteStudent(student.id);
            });
        document
            .querySelector("#students-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {
                showUpdateDialog(student);
            });
    }
}

function showUpdateDialog(student) {
    console.log(student);
    selectedStudentId = student.id;
    const form = document.querySelector("#form-update-student");
    form.name.value = student.name;
    form.email.value = student.email;
    document.querySelector("#dialog-update-student").showModal();
}

function updateStudentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    console.log(name, email);
    updateStudent(selectedStudentId, name, email);
    document.querySelector("#dialog-update-student").close();
}

async function updateStudent(id, name, email) {
    const student = { name, email };
    const json = JSON.stringify(student);
    const response = await fetch(`${endpoint}/students/${id}.json`, {
        method: "PUT",
        body: json
    });
    if (response.ok) {
        updateStudentTable();
    }
}

async function deleteStudent(id) {
    const response = await fetch(`${endpoint}/students/${id}.json`, { method: "DELETE" });
    if (response.ok) {
        updateStudentTable();
    }
}

function sortByName() {
    // students.sort((student1, student2) => student1.name.localeCompare(student2.name));
    students.sort(function (student1, student2) {
        return student1.name.localeCompare(student2.name);
    });
}

async function getStudents() {
    const response = await fetch(endpoint + "/students.json");
    const data = await response.json();
    console.log(data);
    return prepareData(data);
}
