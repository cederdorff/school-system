"use strict";

const endpoint = "https://race-school-system-default-rtdb.firebaseio.com/";
let teachers = [];

window.addEventListener("load", initApp);

async function initApp() {
    console.log("app.js is running 🎉");
    await updateTeacherTable();

    //events
    document.querySelector("#form-create-teacher").addEventListener("submit", createTeacherSubmit);
}

async function updateTeacherTable() {
    document.querySelector("#teachers-table tbody").innerHTML = "";
    teachers = await getTeachers();
    console.log(teachers);
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

    const response = await fetch(endpoint + "teachers.json", { method: "POST", body: json });

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
        </tr>
    `;
        document.querySelector("#teachers-table tbody").insertAdjacentHTML("beforeend", html);
    }
}

function sortByName() {
    // teachers.sort((teacher1, teacher2) => teacher1.name.localeCompare(teacher2.name));

    teachers.sort(function (teacher1, teacher2) {
        return teacher1.name.localeCompare(teacher2.name);
    });
}

async function getTeachers() {
    const response = await fetch(endpoint + "teachers.json");
    const data = await response.json();
    console.log(data);
    return prepareData(data);
}

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
