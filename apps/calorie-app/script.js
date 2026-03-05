function calculate(){

let age = document.getElementById("age").value
let gender = document.getElementById("gender").value
let height = document.getElementById("height").value
let weight = document.getElementById("weight").value
let goalWeight = document.getElementById("goalWeight").value
let activity = document.getElementById("activity").value

weight = weight * 0.453592

let bmr

if(gender === "male"){
bmr = 10 * weight + 6.25 * height - 5 * age + 5
}else{
bmr = 10 * weight + 6.25 * height - 5 * age - 161
}

let maintenance = bmr * activity

let deficit = maintenance - 500

let protein = weight * 2.2
let fat = (maintenance * 0.25) / 9
let carbs = (maintenance - (protein*4 + fat*9)) / 4

let results = `
<h2>Results</h2>

<p><strong>Maintenance Calories:</strong> ${Math.round(maintenance)}</p>

<p><strong>Fat Loss Calories:</strong> ${Math.round(deficit)}</p>

<p><strong>Protein:</strong> ${Math.round(protein)} g</p>

<p><strong>Fat:</strong> ${Math.round(fat)} g</p>

<p><strong>Carbs:</strong> ${Math.round(carbs)} g</p>

<p><strong>Estimated Weight Loss:</strong> ~1 lb per week</p>
`

document.getElementById("results").innerHTML = results

}
