"use strict";

const button = document.querySelector("button");
button.addEventListener("click", () => exportTableToCSV("sample.csv"));

// csv
function downloadCSV(csv, filename) {
	let csvFile = new Blob([csv], { type: "text/csv" });
	let downloadLink = document.createElement("a");
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL(csvFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}
function exportTableToCSV(filename) {
	let csv = [];
	let rows = document.querySelectorAll("table tr");
	for (let i = 0; i < rows.length; i++) {
		let row = [];
		let cols = rows[i].querySelectorAll("td, th");
		for (let j = 0; j < cols.length; j++) row.push(cols[j].innerText);
		csv.push(row.join(";"));
	}
	downloadCSV(csv.join("\n"), filename);
}

// xml
function addElements(thVal, td1Val, td2Val, td3Val, td4Val) {
	const tbody = document.querySelector("#tbody");
	const tr = document.createElement("tr");
	const th = document.createElement("th");
	const td1 = document.createElement("td");
	const td2 = document.createElement("td");
	const td3 = document.createElement("td");
	const td4 = document.createElement("td");
	th.textContent = thVal;
	td1.textContent = td1Val;
	td2.textContent = td2Val;
	td3.textContent = td3Val;
	td4.textContent = td4Val;
	td4.classList.add("text-break");
	tr.append(th);
	tr.append(td1);
	tr.append(td2);
	tr.append(td3);
	tr.append(td4);
	tbody.append(tr);
}
async function readXml() {
	const res = await axios.get("/xml/sample.xml", {
		headers: {
			Accept: "application/xml",
		},
	});
	const body = document.body;
	const ul = document.querySelector("#ul");
	const parser = new DOMParser();
	const xmlDOM = parser
		.parseFromString(res.data, "application/xml")
		.querySelectorAll("*");
	console.log(xmlDOM);
	let count = 1;
	for (let element of xmlDOM) {
		element.querySelectorAll("*").forEach((n) => n.remove());
		if (element.textContent.trim()) {
			addElements(
				count,
				element.tagName,
				"tag",
				element.tagName,
				element.textContent.trim()
			);
			count++;
		}
		element.getAttributeNames().forEach((attribute) => {
			addElements(
				count,
				element.tagName,
				"attribute",
				attribute,
				element.getAttribute(attribute)
			);
			count++;
		});
	}
}
readXml();
