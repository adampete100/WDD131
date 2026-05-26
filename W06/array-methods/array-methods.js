// JavaScript arrays
let names = ["Roger", "Tony", "Robin", "Rebecca"];
console.log(names);
console.log(names[0]);
console.log(names[1]);
console.log(names[2]);
console.log(names[3]);

let ages = [8, 6, 2, 12];

let mixArray = ["Roger", 8, "Tony", 6, "Robin", 2, "Rebecca", 12];

console.log(ages);


// JavaScript objects
let studentName = "Bob";
let studentClass = "WDD131";

let student = {
    name : "Bob",
    class : "WDD131",
    grade : "A",
    age : 27
};

console.log(student);
console.log(student.class);


// Array methods

names.forEach((name) => {
   // this code executes for each item in the array 
   console.log(name);
});

// Map method returns a new array with values returned from the function
let newNameArray = names.map((name) => {
    return name + " Petersen";
});
console.log(newNameArray);

// Filter function returns a new array with filtered values
let filteredNames = names.filter((name) => {
    // Filter returns boolean. True keep, false don't keep
    return name[0] === "R";
});
console.log(filteredNames);

let reducedNames = names.reduce((accumulator, name) => {
    // accumulator is the value returned from the previous iteration
    return accumulator + " " + name;
}, "Names:"); // Initial value for the accumulator
console.log(reducedNames);

let indexOfNames = names.indexOf((name) => {
    return name === "Robin";
});
console.log(indexOfNames);