/*
	Image files list
*/

var fileNames = [];
var filepath = "./images/";
var fileList = [];

fileList.push("bench.jpg");
fileList.push("crawler.jpg");
fileList.push("donuts.jpg");
fileList.push("glass.jpg");
fileList.push("iceberg.jpg");
fileList.push("people.jpg");
fileList.push("sheep.jpg");
fileList.push("wood.jpg");


// fileNames = fileList.split(" ");

for (var i = 0 ; i < fileList.length ; i++ ) {
	fileNames.push( filepath + fileList[i] );
}
// console.log(fileNames);

