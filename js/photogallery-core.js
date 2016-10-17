
var myHeader;
var myFooter;
var myPhotoGallery;
var myDetailBackground;
var myGesture;
var myCurrentPhoto;

var myViewMode;

// Initialize the photo gallery
init();

/*
	Initialize the photo gallery
	- Load the grid view
	- Add the header
	- Add event to each photo	
*/

function init() {

	myHeader = document.getElementsByClassName("header")[0];
	myFooter = document.getElementsByClassName("footer")[0];
	myPhotoGallery = document.getElementById("photogallery");
	myDetailBackground = createDiv();
	myDetailBackground.className = "background";
	document.getElementsByTagName("body")[0].appendChild(myDetailBackground);

	/* Add Header */
	myViewMode = "grid";
	updateHeader(myHeader, myViewMode, "Image Gallery");
	
	/* Create Footer (only visible on Detail View) */
	createFooter(myFooter, "detail");
	myFooter.style.visibility = "hidden";

	/* Add Grid View */
	gridView = initGallery(myPhotoGallery);
	myPhotoGallery.appendChild(gridView);

	/* Add Event to thumbnail elements on Grid View */
	var thumbnails = document.getElementsByClassName("thumbnail");
	for (var i = 0 ; i < thumbnails.length ; i++) {

		thumbnails[i].addEventListener("click", function(){
			if (myViewMode === "grid") {

				myCurrentPhoto = this;

				if (this.className.indexOf("outAnimate") !== -1) {
					this.className = this.className.replace("outAnimate", "").trim();
				}
				this.className += " animate";

				showDetailView(this);

			} else {
				toggleView(myHeader);
				toggleView(myFooter);
				toggleBackgroundColor(myDetailBackground);
			}
		});	
	}
}

/*
	Show the Detail View by clicking the photo
	- Show the large photo
	- Update the header title
	- Show tools footer
	- Show the black background of the view
	- Add gesture recognizer to the photo
*/

function showDetailView(el) {

	var photo = el.firstChild;

	el.style.zIndex = 4;

	/* Update Header */
	myViewMode = "detail";
	var headerTitleString = photo.src.substring(photo.src.lastIndexOf("/")+1);
	headerTitleString = headerTitleString.substring(0, headerTitleString.lastIndexOf("."));
	updateHeader(myHeader, myViewMode, headerTitleString);

	/* Show Tools Footer */
	updateFooter(myFooter, myViewMode);
	myFooter.style.visibility = "visible";

	/* Show Detail View Background */
	if (myDetailBackground.className.indexOf("hidden") !== -1) {
		myDetailBackground.className = myDetailBackground.className.replace("hidden", "").trim();
	}
	myDetailBackground.style.backgroundColor = "#FFFFFF";
	myDetailBackground.style.opacity = 1.0;
	myDetailBackground.className += " visible";

	/* Center the Photo */
	/* Magnify the photo */
	magnifyImage(el);
	var translate = locateDetailViewPhoto(el, "current");
	assignTransforms(el, translate);

	/* Add Gesture Events to the Photo */
	myGesture = new PhotoGalleryGesture(el);

	/* Add Event to Detail View Background */
	myDetailBackground.addEventListener("click", function(){
		toggleView(myHeader);
		toggleView(myFooter);
		toggleBackgroundColor(myDetailBackground);
	});

}

/*
	Show the Grid View 
	- Put the photo back to the grid view
	- Update the header title
	- Hide Footer
	- Hide the black background of the view
	- Remove gesture recognizer from the photo
*/
function showGridView(el) {

	/* Remove Events from the Photo */
	myGesture.removeGestureEvents(el);

	cleanClassName(el);
	el.className += " outAnimate";
	backToOriginalLocation(el);
	reduceImage(el);
	
	if (myDetailBackground.className.indexOf("visible") !== -1) {
		myDetailBackground.className = myDetailBackground.className.replace("visible", "").trim();
	}
	myDetailBackground.className += " hidden";

	myViewMode = "grid";
	updateHeader(myHeader, myViewMode, "Image Gallery");
	myFooter.style.visibility = "hidden";
	updateFooter(myFooter, myViewMode);

}


