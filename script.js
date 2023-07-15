var fileInput1 = document.getElementById('file-input1');
var fileInput2 = document.getElementById('file-input2');
var fileLabel1 = document.getElementById('file-label1');
var fileLabel2 = document.getElementById('file-label2');
var file1 = null;
var file2 = null;

function updateButtonLabel(input) {
  if (input.id === 'file-input1') {
    fileLabel1.textContent = `♻ ${input.files[0].name}`
    console.log(input.files[0].name)
  } else if (input.id === 'file-input2') {
    fileLabel2.textContent = `♻ ${input.files[0].name}`
  }

}

fileInput1.addEventListener('change', function(event) {
  file1 = event.target.files[0];
  compareFiles();
});

fileInput2.addEventListener('change', function(event) {
  file2 = event.target.files[0];
  compareFiles();
});


function compareFiles() {
  if (file1 && file2) {
    var reader1 = new FileReader();
    var reader2 = new FileReader();

    reader1.onload = function(event) {
      var fileContent1 = event.target.result;
      var fileName1 = file1.name;

      reader2.onload = function(event) {
        var fileContent2 = event.target.result;
        var fileName2 = file2.name;

        var mergedData = mergeJSON(fileContent1, fileContent2);
        displayTable('result', mergedData, fileName1, fileName2);
      };

      reader2.readAsText(file2, 'UTF-8');
    };

    reader1.readAsText(file1, 'UTF-8');
  }
}

function mergeJSON(fileContent1, fileContent2) {
  var obj1 = JSON.parse(fileContent1);
  var obj2 = JSON.parse(fileContent2);

  var mergedObj = {};

  var keys1 = Object.keys(obj1);
  for (var i = 0; i < keys1.length; i++) {
    var key = keys1[i];
    mergedObj[key] = { key: key, value1: obj1[key], value2: '' };
  }

  var keys2 = Object.keys(obj2);
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (!mergedObj.hasOwnProperty(key)) {
      mergedObj[key] = { key: key, value1: '', value2: obj2[key] };
    } else {
      mergedObj[key].value2 = obj2[key];
    }
  }

  return mergedObj;
}

function displayTable(tableId, mergedData, fileName1, fileName2) {
  var table = document.getElementById(tableId);
  table.innerHTML = '';

  var headers = ['Key', fileName1, fileName2];
  var headerRow = table.createTHead();
  for (var i = 0; i < headers.length; i++) {
    var headerCell = document.createElement('th');
    headerCell.textContent = headers[i];
    headerRow.appendChild(headerCell);
  }

  for (var key in mergedData) {
    var rowData = mergedData[key];

    var dataRow = table.insertRow();
    var keyCell = document.createElement('th');
    keyCell.textContent = rowData.key;
    dataRow.appendChild(keyCell);

    var value1Cell = document.createElement('td');
    value1Cell.textContent = rowData.value1;
    dataRow.appendChild(value1Cell);

    var value2Cell = document.createElement('td');
    value2Cell.textContent = rowData.value2;
    dataRow.appendChild(value2Cell);

    if (rowData.value1 !== rowData.value2) {
      value1Cell.classList.add('highlight');
      value2Cell.classList.add('highlight');
    }
  }
}
