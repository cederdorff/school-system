import { getStudents, createStudent, updateStudent, deleteStudent } from "./rest-service.js";

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

async function createStudentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;

    const response = await createStudent(name, email);

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
                deleteStudentClicked(student);
            });
        document
            .querySelector("#students-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {
                showUpdateDialog(student);
            });
    }
}

async function deleteStudentClicked(student) {
    const response = await deleteStudent(student.id);
    if (response.ok) {
        await updateStudentTable();
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

async function updateStudentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;

    const response = await updateStudent(selectedStudentId, name, email);

    if (response.ok) {
        await updateStudentTable();
        document.querySelector("#dialog-update-student").close();
    }
}

function sortByName() {
    // students.sort((student1, student2) => student1.name.localeCompare(student2.name));
    students.sort(function (student1, student2) {
        return student1.name.localeCompare(student2.name);
    });
}
