// imports from the module rest-service.js
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "./rest-service.js";
// global variabels (global for this modules)
let teachers = [];
let selectedTeacherId;
// window on load event executes initTeachers
window.addEventListener("load", initTeachers);

async function initTeachers() {
    console.log("teachers.js is running 🎉");
    await updateTeacherTable();

    // event listeners for form submit
    document.querySelector("#form-create-teacher").addEventListener("submit", createTeacherSubmit);
    document.querySelector("#form-update-teacher").addEventListener("submit", updateTeacherSubmit);
}

// updates the table view with new fetched teachers
async function updateTeacherTable() {
    // reset the table content (tbody) before adding new updated content
    document.querySelector("#teachers-table tbody").innerHTML = "";
    // get all teachers (updated) from Firebase and save in global variable
    teachers = await getTeachers();
    // sort by name
    sortByName();
    // show all teachers
    showTeachers(teachers);
}

// submit event for create form (new teacher)
async function createTeacherSubmit(event) {
    event.preventDefault(); // prevent the page from refresh
    const form = event.target; // reference to the form
    const name = form.name.value; // get name from form
    const email = form.email.value; // get email from form
    // call createTeacher from rest-service. createTeacher returns a "response promise"
    const response = await createTeacher(name, email);
    // if response.ok, update the view
    if (response.ok) {
        await updateTeacherTable(); // update table with teacher
    }
}

// show teachers by given list of teachers
// generate table rows and add to the DOM (the tbody)
function showTeachers(listOfTeachers) {
    // loop through all teachers in the given list
    for (const teacher of listOfTeachers) {
        // generate html - a table row with teacher name and mail
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
        //add generated html (table row) to the DOM (tbody)
        document.querySelector("#teachers-table tbody").insertAdjacentHTML("beforeend", html);
        // add click event to the delete button
        document
            .querySelector("#teachers-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function () {
                // when delete button clicked, call deleteTeacherClicked with teacher as argument
                deleteTeacherClicked(teacher);
            });
        // add click event to the update button
        document
            .querySelector("#teachers-table tbody tr:last-child .btn-update")
            .addEventListener("click", function () {
                // when update button clicked, call showUpdateDialog with teacher as argument
                showUpdateDialog(teacher);
            });
    }
}

// show update dialog with update form
function showUpdateDialog(teacher) {
    console.log(teacher);
    selectedTeacherId = teacher.id; // store the selected teacher's id in global variable
    const form = document.querySelector("#form-update-teacher"); // reference to the update form
    form.name.value = teacher.name; // set input values with data from teacher object
    form.email.value = teacher.email;
    document.querySelector("#dialog-update-teacher").showModal(); // display the modal
}

// update teacher form submit - executed when you hit submit/update in the update form
async function updateTeacherSubmit(event) {
    event.preventDefault(); // prevent the page from refresh
    const form = event.target; // reference to the form
    const name = form.name.value; // get name from form
    const email = form.email.value; // get email from form
    // call updateTeacher with id of selected teacher and name and email to update
    const response = await updateTeacher(selectedTeacherId, name, email);
    // if response.ok, update the view
    if (response.ok) {
        await updateTeacherTable(); // update table with teacher
        document.querySelector("#dialog-update-teacher").close(); // close modal
    }
}

// deleteTeacherClicked - called when you hit delete
async function deleteTeacherClicked(teacher) {
    // call deleteTeacher in rest-service with id of teacher you want to delete
    const response = await deleteTeacher(teacher.id);
    // if response.ok, update the view
    if (response.ok) {
        await updateTeacherTable(); // update table with teacher
    }
}

// sorts teacher array by name
function sortByName() {
    // teachers.sort((teacher1, teacher2) => teacher1.name.localeCompare(teacher2.name));
    teachers.sort(function (teacher1, teacher2) {
        return teacher1.name.localeCompare(teacher2.name);
    });
}
