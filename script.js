const equation = {
	firstN : "",
	secondN : "",
	operator : "",
	evaluated : false,
	prevAns : "",
};

function add() {
	let ans = Number(equation.firstN) + Number(equation.secondN);
	return ans;
}

function subtract() {
	let ans = Number(equation.firstN) - Number(equation.secondN);
	return ans;
}

function multiply() {
	let ans = Number(equation.firstN) * Number(equation.secondN);
	return ans;
}

function divide() {
	let second = Number(equation.secondN);
	if (second === 0) {
		return "Sorry, bub. Can't divide by 0";
	}
	let ans = Number(equation.firstN)/second;
	return ans;
}