const form = document.getElementById('fsyForm');

console.log(form);

form.addEventListener('submit',event => {
    event.preventDefault();
    console.log(event);

    const firstName = form.firstName.value;
    console.log(firstName);

    const lastName = form.lastName.value;
    console.log(lastName);
    const email = form.email.value;
    console.log(email);
});

const campuses = form.campus;
console.log(campuses[0]);