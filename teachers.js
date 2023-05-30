"use strict";

let teachers = [];
let selectedTeacherId;

window.addEventListener("load", initStudents);

async function initStudents() {
    console.log("teachers.js is running 🎉");
    await updateTeacherTable();

    //events
    document.querySelector("#form-create-teacher").addEventListener("submit", createTeacherSubmit);
    document.querySelector("#form-update-teacher").addEventListener("submit", updateTeacherSubmit);
}

async function updateTeacherTable() {
    document.querySelector("#teachers-table tbody").innerHTML = "";
    teachers = await getTeachers();
    sortByName();

    showTeachers(teachers);
}

function createTeacherSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    createTeacher(name, email);
}

async function createTeacher(name, email) {
    const newTeacher = {
        name: name,
        email: email
    };
    console.log(newTeacher);
    const json = JSON.stringify(newTeacher);
    console.log(json);

    const response = await fetch(endpoint + "/teachers.json", { method: "POST", body: json });

    if (response.ok) {
        await updateTeacherTable();
    }
}

function showTeachers(listOfTeachers) {
    for (const teacher of listOfTeachers) {
        const html = /*html*/ `
        <tr>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>

            </td>
        </tr>
    `;
        document.querySelector("#teachers-table tbody").insertAdjacentHTML("beforeend", html);
        document
            .querySelector("#teachers-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {
                deleteTeacher(teacher.id);
            });
        document
            .querySelector("#teachers-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {
                showUpdateDialog(teacher);
            });
    }
}

function showUpdateDialog(teacher) {
    console.log(teacher);
    selectedTeacherId = teacher.id;
    const form = document.querySelector("#form-update-teacher");
    form.name.value = teacher.name;
    form.email.value = teacher.email;
    document.querySelector("#dialog-update-teacher").showModal();
}

function updateTeacherSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    console.log(name, email);
    updateTeacher(selectedTeacherId, name, email);
    document.querySelector("#dialog-update-teacher").close();
}

async function updateTeacher(id, name, email) {
    const teacher = { name, email };
    const json = JSON.stringify(teacher);
    const response = await fetch(`${endpoint}/teachers/${id}.json`, {
        method: "PUT",
        body: json
    });
    if (response.ok) {
        updateTeacherTable();
    }
}

async function deleteTeacher(id) {
    const response = await fetch(`${endpoint}/teachers/${id}.json`, { method: "DELETE" });
    if (response.ok) {
        updateTeacherTable();
    }
}

function sortByName() {
    // teachers.sort((teacher1, teacher2) => teacher1.name.localeCompare(teacher2.name));
    teachers.sort(function (teacher1, teacher2) {
        return teacher1.name.localeCompare(teacher2.name);
    });
}

async function getTeachers() {
    const response = await fetch(endpoint + "/teachers.json");
    const data = await response.json();
    console.log(data);
    return prepareData(data);
}
