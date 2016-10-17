
var gridViewWidth;
var wrapperWidth;
var wrapperHeight;
var thumbnailWidth;
var thumbnailHeight;

/* 
	Initialize Photo Gallery 
	Initial mode is the grid view
*/

function initGallery (el) {

	var gridView = createDiv();
	gridView.id = "grid-view";	
	gridViewWidth = el.clientWidth;


	var margins = parseInt(gridView.style.padding, 10) * 2;

	wrapperWidth = ((gridViewWidth - 38) / 2) + "px";
	wrapperHeight = (parseInt(wrapperWidth, 10) * 0.75) + "px";
	thumbnailWidth = wrapperWidth;
	thumbnailHeight = wrapperHeight;

	for (var i = 0 ; i < fileNames.length ; i++) {

		var thumbnailWrapper = createDiv();
		thumbnailWrapper.className = "thumbnail-wrapper";
		thumbnailWrapper.style.width = wrapperWidth;
		thumbnailWrapper.style.height = wrapperHeight;

		var thumbnail = createDiv();
		thumbnail.className = "thumbnail";
		thumbnail.style.width = thumbnailWidth;
		thumbnail.style.height = thumbnailHeight;

		var photo = document.createElement("img");
		photo.src = fileNames[i];
		photo.addEventListener("load", function() {
			if (this.naturalHeight > this.naturalWidth) {
				this.className = "portrait";
			}
		});

		thumbnail.appendChild(photo);
		thumbnailWrapper.appendChild(thumbnail);
		gridView.appendChild(thumbnailWrapper);
	
	}

	return gridView;
}

/*
	Update Header
	Header has two modes: 1. grid 2. detail
	1. Grid
	2. Detail has close button
*/

function updateHeader (el, view, title) {

	var header = el;

	header.id = view + "-header";
	header.innerHTML = "";	// Initialize content of Header
	header.style.top = "0px";
	
	// Create Header Title
	var headerTitle = createDiv();
	headerTitle.id = "header-title";

	if (view === "grid") {

		headerTitle.innerHTML = title;
		header.appendChild(headerTitle);
	
	} else if (view === "detail") {

		headerTitle.innerHTML = title;

		// Create Cancel Button
		var close = createDiv();
		close.className = "header-icon";
		close.id = "icon-close";
		close.innerHTML = "<img src=\"./assets/close.svg\" style=\"width:14px\"></img>";
		
		close.addEventListener("click", function(){
			showGridView(myCurrentPhoto);
		});

		header.appendChild(headerTitle);
		header.appendChild(close);

	} else {}
}

/*
	Footer functions 
	Footer has two modes: 1. grid 2. detail
*/

// Update Footer
function updateFooter(el, viewMode) {
	el.id = viewMode + "-footer";
	el.style.bottom = "0px";
}

// Initialize Footer
function createFooter(el, viewMode) {

	var footer = el;

	footer.id = viewMode + "-footer";
	footer.innerHTML = "";
	footer.style.bottom = "0px";

	if (viewMode === "grid") {

	} else {

		// Create Buttons
		footer.appendChild(createButton("footer", "+1", "+1"));
		footer.appendChild(createButton("footer", "comment", "comment"));
		footer.appendChild(createButton("footer", "add", "add"));
		footer.appendChild(createButton("footer", "share", "share"));

		var footerIcons = footer.getElementsByClassName("footer-icon");
		var margin = (footer.clientWidth - 19 - 19 - footerIcons[0].clientWidth * 4 ) / 3;

		for ( var i = 0 ; i < footerIcons.length ; i++ ) {
			footerIcons[i].style.left = ( 19 + margin * i ) + "px";
		}
	} 
}

// Create Button for Footer
function createButton(type, id, img) {
	var button = createDiv();
	button.className = type + "-icon";
	button.id = "icon-" + id;
	button.innerHTML = "<img src=\"./assets/" + id + ".svg\" style=\"width:20px\"></img>";
	return button;
}

/* 
	Magnify the photo
*/ 

function magnifyImage(el) {
	
	var thumbnail = el;
	var photo = thumbnail.firstChild;

	if (photo.classList.contains("portrait")) {
		/* Portrait Image */
		photo.style.height = window.innerHeight + "px";
		photo.style.width = (( photo.naturalWidth / photo.naturalHeight ) * window.innerHeight) + "px";

		if ( parseInt(photo.style.width, 10) > parseInt(window.innerWidth, 10)) {
			// if a resized image width is larger than window width
			photo.style.width = window.innerWidth + "px";
			photo.style.height = (( photo.naturalHeight / photo.naturalWidth ) * window.innerWidth) + "px";
		}

		thumbnail.style.height = photo.style.height;
		thumbnail.style.width = window.innerWidth + "px"; // thumbnail width stays same for better alignment
		
	} else {
		/* Landscape Image */
		thumbnail.style.width = window.innerWidth + "px";
		thumbnail.style.height = (( photo.naturalHeight / photo.naturalWidth ) * window.innerWidth) + "px";
		photo.style.width = thumbnail.style.width;
		photo.style.height = "auto";

	}

}

/*
	Move the element to the original position
	Initialize translate3D
*/

function backToOriginalLocation(el) {
	var translate = "translate3D(0px, 0px, 0px)";
	assignTransforms(el, translate);
}

/*
	Reduce the image size to the thumbnail
*/

function reduceImage(el) {

	var photo = el.firstChild;

	el.style.width = thumbnailWidth;
	el.style.height = thumbnailHeight;

	if (photo.classList.contains("portrait")) {
		photo.style.width = thumbnailWidth;
		photo.style.height = "auto";
	} else {
		photo.style.height = thumbnailHeight;
		photo.style.width = "auto";
	}

	el.style.zIndex = 1;
	
}

/*
	Return translate3D value of the new position
*/

function locateDetailViewPhoto(el, type) {

	var photo = el.firstChild;
	
	var coordinate = getPosition(el);
	var transformX = 0;
	var transformY = 0;

	var dest = 0;

	switch(type) {
		
		case "previous" :
			dest = - (window.innerWidth + 20);
			break;
		
		case "current" :
			dest = 0;
			break;

		case "next" :
			dest = (window.innerWidth + 20);
			break;
	}

	transformX = transformX - coordinate.x + dest;
	transformY = ((window.innerHeight - parseInt(el.style.height, 10)) / 2 ) - coordinate.y;

	var translate = "translate3D(" + transformX + "px, " + transformY +"px, 0px)";

	return translate;

}

/*
	Toggle the visibility of the element
*/

function toggleView (el) {

	if(el.style.visibility === "hidden") {
		el.style.visibility = "visible";
	} else {
		el.style.visibility = "hidden";
	}

}

/*
	Update transform of the element 
*/

function assignTransforms(el, translate) {
	if(el) {
		el.style.transform = translate;
		el.style.MozTransform = translate;
		el.style.webkitTransform = translate;
	}
}

/*
	Parse the transform3D(x,y,z) of the element
*/

function parseTranslate3D(str) {

	var valueX = 0;
	var valueY = 0;
	var valueZ = 0;

	var temp = str.slice(str.indexOf("(")+1, str.length - 1).trim();
	valueX = temp.substring(0, temp.indexOf(","));
	temp = temp.slice(temp.indexOf(",")+1);
	valueY = temp.substring(0, temp.indexOf(","));
	temp = temp.slice(temp.indexOf(",")+1);
	valueZ = temp;

	if (valueX.indexOf("px") !== -1) {
		valueX = valueX.replace("px", "").trim();
		valueX = parseInt(valueX, 10);
	}

	if (valueY.indexOf("px") !== -1) {
		valueY = valueY.replace("px", "").trim();
		valueY = parseInt(valueY, 10);
	}

	if (valueZ.indexOf("px") !== -1) {
		valueZ = valueZ.replace("px", "").trim();
		valueZ = parseInt(valueZ, 10);
	}

	return { x: valueX, y: valueY, z: valueZ };
}

/*
	Return current translate3D value in (x,y,z)
*/

function getCurrentTranslate3D(el) {

	var currentTranslate3D = el.style.transform;

	var value = parseTranslate3D(currentTranslate3D);

	return { x: value.x, y: value.y, z: value.z };

}

/*
	Convert num value to pixel
*/
	function num2pix (num) {
		return num + "px";
	}

/*
	Create a new div
*/
	function createDiv () {
		return document.createElement("div");
	}

/*
	Get coordinates of the element 
	Source - 
	https://www.kirupa.com/html5/get_element_position_using_javascript.htm
*/

function getPosition(el) {
	var xPos = 0;
	var yPos = 0;
 
	while (el) {
		if (el.tagName == "BODY") {
		// deal with browser quirks with body/window/document and page scroll
		var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
		var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
		xPos += (el.offsetLeft - xScroll + el.clientLeft);
		yPos += (el.offsetTop - yScroll + el.clientTop);
	} else {
		// for all other non-BODY elements
		xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
		yPos += (el.offsetTop - el.scrollTop + el.clientTop);
	}
	el = el.offsetParent;
	}
	return {
		x: xPos,
		y: yPos
	};
}

/*
	Remove animate classes from element
*/

function cleanClassName(el) {

	if(!el) {
		return;
	}
	
	if(el.className.indexOf("animate") !== -1) {
		el.className = el.className.replace("animate", "").trim();
	}
	if(el.className.indexOf("outAnimate") !== -1) {
		el.className = el.className.replace("outAnimate", "").trim();
	}
	if(el.className.indexOf("loadNeighborAnimate") !== -1) {
		el.className = el.className.replace("loadNeighborAnimate", "").trim();
	}
}

/* Change background color */
function toggleBackgroundColor(el){
	if(el.style.backgroundColor == "rgb(0, 0, 0)") {
		el.style.backgroundColor = "#FFFFFF";
	} else {
		el.style.backgroundColor = "#000000";
	}
}
