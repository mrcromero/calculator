
function displayPrev(text) {
	prevDisp.textContent = text;
}

function displayCurr(text) {
	currDisp.textContent = text;
}

function addToFirst(toAdd) {
	if (equation.firstN.length === MAXCHAR) {
		return;
	}
	equation.firstN += toAdd;
	displayCurr(equation.firstN);
}

function addToSecond(toAdd) {
	if (equation.secondN.length === MAXCHAR) {
		return;
	}
	equation.secondN += toAdd;
	displayCurr(equation.secondN);
}

function number() {
	const val = this.dataset.val;
	if (equation.evaluated === true) {
		equation.evaluated = false;
	}
	if (equation.operator === "") {
		addToFirst(val);
	} else {
		addToSecond(val);
	}
}

function operator() {
	const oper = this.dataset.val;
	if (equation.evaluated === true) {
		equation.firstN = equation.prevAns;
		equation.evaluated = false;
	}
	if (equation.secondN !== "" && equation.secondN !== "-") {
		evaluate();
		equation.firstN = equation.prevAns;
		equation.evaluated = false;
	}
	if (oper === "-") {
		if (equation.operator === "" &&
			(equation.firstN === "" || equation.firstN === "-")) {
			equation.firstN = (equation.firstN == "") ? "-" : "";
			displayCurr(equation.firstN);
			return;
		} else if (equation.operator !== "" &&
			(equation.secondN === "" || equation.secondN === "-")) {
			equation.secondN = (equation.secondN == "") ? "-" : "";
			displayCurr(equation.secondN)
			return;
		}
	}
	if (equation.operator !== "") {
		return;
	}
	equation.operator = oper;
 }

function clear() {
	equation.firstN = "";
	equation.secondN = "";
	equation.operator = "";
	equation.evaluated = false;
	equation.prevAns = "";

	displayCurr("");
	displayPrev("");
}

function del() {
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
	if (equation.prevAns === "") {
		return;
	}
	if (equation.operator === "") {
		equation.firstN = equation.prevAns;
		displayCurr(equation.firstN);
	} else {
		equation.secondN = equation.prevAns;
		displayCurr(equation.secondN);
	}
}

function evaluate() {
	if (equation.operator === "" ||
		equation.firstN === "" ||
		equation.secondN === "" ||
		equation.evaluated == true) {
 		return;
 	}
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
 			if(equation.secondN === "0") {
 				equation.prevAns = "E: DIVIDE BY 0";
 			} else {
 				equation.prevAns =
 					Number(equation.firstN)/Number(equation.secondN);
 			}
 			break;
 	}
 	equation.firstN = "";
 	equation.secondN = "";
	equation.operator = "";
	equation.evaluated = true;
	displayCurr(equation.prevAns);
	equation.prevAns =
		(equation.prevAns === "E: DIVIDE BY 0") ? "":equation.prevAns;
 }

function clicked() {
	displayPrev(equation.prevAns);
	const func = window[this.dataset.func];
	func.apply(this);
}

const currDisp = document.querySelector("#current-equation");
const prevDisp = document.querySelector("#prev-equation");

const MAXCHAR = 15;

const equation = {
	firstN : "",
	secondN : "",
	operator : "",
	evaluated : false,
	prevAns : "",
};

document.querySelectorAll(".button").forEach(
	button => button.addEventListener("click", clicked)
);