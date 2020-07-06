
function displayPrev(text) {
	prevDisp.textContent = text;
}

function displayCurr(text) {
	currDisp.textContent = text;
}

function addToFirst(toAdd) {
	if (equation.firstN.length === MAXCHAR) {
		// Don't add if maximum length.
		return;
	}
	// Add number and display
	equation.firstN += toAdd;
	displayCurr(equation.firstN);
}

function addToSecond(toAdd) {
// Same as addToFirst but for second number
	if (equation.secondN.length === MAXCHAR) {
		return;
	}
	equation.secondN += toAdd;
	displayCurr(equation.secondN);
}

function number() {
// Function when a number on calculator is pressed.
	// Get the number value.
	const val = this.dataset.val;
	// Change to false because not using the previous answer as first number.
	if (equation.evaluated === true) {
		equation.evaluated = false;
	}
	// Change to false because error is overwritten.
	if (equation.error === true) {
		equation.error = false;
	}
	// Add to first if no operator chosen. Add to second if operator chosen.
	if (equation.operator === "") {
		addToFirst(val);
	} else {
		addToSecond(val);
	}
}

function decimal() {
// Decimal function is almost the same as number function. Adds some new
// conditionals to check if there is already a decimal in the number.
	const val = this.dataset.val;
	if (equation.evaluated === true) {
		equation.evaluated = false;
	}
	if (equation.error === true) {
		equation.error = false;
	}
	if (equation.operator === "") {
		// New conditionals
		if (equation.firstN.indexOf('.') !== -1) {
			return;
		}
		addToFirst(val);
	} else {
		// New conditionals.
		if (equation.secondN.indexOf('.') !== -1) {
			return;
		}
		addToSecond(val);
	}
}

function operator() {
// Function called when an operator is pressed.
	// Get the operator as a string.
	const oper = this.dataset.val;
	// If evaluated is true, use previous answer as first value.
	if (equation.evaluated === true) {
		equation.firstN = equation.prevAns;
		equation.evaluated = false;
	}
	// If an operator is pressed and theres a first number, second number, and
	// an operator, then evaluate and use the answer as the first number. This
	// allows for stringing of operations like 5+10+2+3 = 20, etc.
	if (equation.secondN !== "" && equation.secondN !== "-") {
		evaluate();
		// If you get an error, then pause operation and restart the equation.
		if (equation.error === true) {
			return;
		}
		equation.firstN = equation.prevAns;
		equation.evaluated = false;
	}
	// Special conditional for the - to allow for negatives.
	if (oper === "-") {
		// Conditional for toggling negative for first value.
		if (equation.operator === "" &&
			(equation.firstN === "" || equation.firstN === "-")) {
			equation.firstN = (equation.firstN == "") ? "-" : "";
			displayCurr(equation.firstN);
			return;
		// Conditional for toggling negative for second value.
		} else if (equation.operator !== "" &&
			(equation.secondN === "" || equation.secondN === "-")) {
			equation.secondN = (equation.secondN == "") ? "-" : "";
			displayCurr(equation.secondN)
			return;
		}
	// If there is already an operator chosen, return.
	}
	if (equation.operator !== "") {
		return;
	}
	// If it gets here, it is a valid operator for the equation.
	equation.operator = oper;
 }

function clear() {
	equation.firstN = "";
	equation.secondN = "";
	equation.operator = "";
	equation.evaluated = false;
	equation.prevAns = "";
	equation.error = false;

	displayCurr("");
	displayPrev("");
}

function del() {
// Delete function
	// Conditional for determining if deleting from first or second number.
	if (equation.operator === "") {
		if (equation.firstN.length === 0) {
			return;
		}
		equation.firstN =
			equation.firstN.substring(0, equation.firstN.length-1);
		displayCurr(equation.firstN);
	} else {
		if (equation.secondN.length === 0) {
			return;
		}
		equation.secondN =
			equation.secondN.substring(0, equation.secondN.length-1);
		displayCurr(equation.secondN);
	}
}

function ans() {
// Function for using previous answer.
	// If prevAns is empty or an error, return.
	if (equation.prevAns === "" || equation.prevAns === "E: TOO LONG"
		|| equation.prevAns === "E: DIVIDE BY 0") {
		return;
	}
	// Conditional to determine if for first value or second value.
	if (equation.operator === "") {
		equation.firstN = equation.prevAns;
		displayCurr(equation.firstN);
	} else {
		equation.secondN = equation.prevAns;
		displayCurr(equation.secondN);
	}
}

function evaluate() {
// Function for evaluating.
	// Can't evaluate if no operator or not all values filled.
	if (equation.operator === "" ||
		equation.firstN === "" ||
		equation.secondN === "" ||
		equation.evaluated == true) {
 		return;
 	}
 	// Cases for different operators.
 	switch(equation.operator) {
 		case "+":
 			equation.prevAns = Number(equation.firstN)+Number(equation.secondN);
 			break;
 		case "-":
 			equation.prevAns = Number(equation.firstN)-Number(equation.secondN);
 			break;
 		case "*":
 			equation.prevAns = Number(equation.firstN)*Number(equation.secondN);
 			break;
 		case "/":
 			// Dividing by 0 gives error
 			if(equation.secondN === "0") {
 				equation.prevAns = "E: DIVIDE BY 0";
 				equation.error = true;
 			} else {
 				equation.prevAns =
 					Number(equation.firstN)/Number(equation.secondN);
 			}
 			break;
 	}
 	// Round to 3 decimal places.
 	if (equation.error === false) {
 		equation.prevAns = +equation.prevAns.toFixed(3);
 	}
 	// Error if too long.
 	if (equation.prevAns.toString().length > MAXCHAR) {
 		equation.prevAns = "E: TOO LONG";
 		equation.error = true;
 	}
 	// Reset all values after evaluating, but make evaluated = true.
 	equation.firstN = "";
 	equation.secondN = "";
	equation.operator = "";
	equation.evaluated = true;

	// Start answer animation and display
	currDisp.classList.add("new");
	setTimeout(function(){
		currDisp.classList.remove("old");
		displayCurr(equation.prevAns);
	}, 300);
 }

function clicked() {
	if (equation.error === true && this.dataset.func === "operator") {
		// Prevent any operations if error on screen.
		return;
	} else {
		displayPrev(equation.prevAns);
	}
	// Get the function from the dataset and call it.
	const func = window[this.dataset.func];
	func.apply(this);
}

function old() {
	// End answer animation
	setTimeout(function(){
		currDisp.classList.remove("new");
		currDisp.classList.add("old");
	}, 0);
}

const currDisp = document.querySelector("#current-equation");
const prevDisp = document.querySelector("#prev-equation");

const MAXCHAR = 15;

const equation = {
	firstN : "",
	secondN : "",
	operator : "",
	// evaluated is for using the answer as the first value in the next
	// equation by pressing an operator button right after receiving an answer.
	evaluated : false,
	prevAns : "",
	// error is for determining if an error is active. If active, cannot press
	// an operator; must press a number first to replace error.
	error: false,
};

currDisp.addEventListener("transitionend", old);

document.querySelectorAll(".button").forEach(
	button => button.addEventListener("click", clicked)
);