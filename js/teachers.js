import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "./rest-service.js";

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

async function createTeacherSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;

    const response = await createTeacher(name, email);
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
                deleteTeacherClicked(teacher);
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

async function updateTeacherSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;

    const response = await updateTeacher(selectedTeacherId, name, email);
    if (response.ok) {
        await updateTeacherTable();
        document.querySelector("#dialog-update-teacher").close();
    }
}

async function deleteTeacherClicked(teacher) {
    const response = await deleteTeacher(teacher.id);
    if (response.ok) {
        await updateTeacherTable();
    }
}

function sortByName() {
    // teachers.sort((teacher1, teacher2) => teacher1.name.localeCompare(teacher2.name));
    teachers.sort(function (teacher1, teacher2) {
        return teacher1.name.localeCompare(teacher2.name);
    });
}
