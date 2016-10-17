function PhotoGalleryGesture (el) {

	this.currentPhoto = el;
	myCurrentPhoto = this.currentPhoto;
	this.previousPhoto;
	this.nextPhoto;

	if (this.currentPhoto.parentNode.previousSibling) {
			this.previousPhoto = this.currentPhoto.parentNode.previousSibling.firstChild;
	}

	if (this.currentPhoto.parentNode.nextSibling) {
			this.nextPhoto = this.currentPhoto.parentNode.nextSibling.firstChild;
	}

	this.originalTransform = this.currentPhoto.style.transform;
	this.previousOriginalTransform;
	this.nextOriginalTransform;

	this.neighborIsVisible = false;

	this.vertical = new Hammer.Manager(this.currentPhoto); // Vertical Pan Gesture Recognizer
	this.horizontal = new Hammer.Manager(this.currentPhoto);; // Horizontal Pan Gesture Recognizer

	// Initialize gesture recognizers
	// Bind gesture event function
	this.vertical.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 10, touchAction: "pan-x pan-y"}));
    this.vertical.on("panstart panmove panend pancancel", Hammer.bindFn(this.moveElement, this));

    this.horizontal.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10, touchAction: "pan-x pan-y" }));
    this.horizontal.on("panstart panmove panend pancancel", Hammer.bindFn(this.moveElement, this));

    this.horizontal.get("pan").requireFailure(this.vertical.get("pan"));

}

PhotoGalleryGesture.prototype = {
	
	moveElement: function(ev) {
		var delta;
		var percent;

		var value = parseTranslate3D(this.originalTransform); 
		var translate;

		// Set animate style
		// "animate" class only applies when the event is ended or canceled
		// Otherwise, photos will follow the user's gesture
		if ((ev.type == "panend") || (ev.type == "pancancel")) {
			if (this.previousPhoto) {
				cleanClassName(this.previousPhoto);
				this.previousPhoto.className += " animate";
			}

			if (this.nextPhoto) {
				cleanClassName(this.nextPhoto);
				this.nextPhoto.className += " animate";
			}

			this.currentPhoto.className += " animate";

		} else {
			cleanClassName(this.previousPhoto);
			cleanClassName(this.nextPhoto);
			cleanClassName(this.currentPhoto);
		}

		// Get delta from the gesture
		delta = dirProp(ev.direction, ev.deltaX, ev.deltaY);
		var ph = parseInt(this.currentPhoto.style.height, 10);
		var pw = parseInt(this.currentPhoto.style.width, 10);
		percent = (100 / dirProp(ev.direction, pw, ph)) * delta;

		if ((ev.direction & Hammer.DIRECTION_VERTICAL)) {
			// 1. Pan Vertical

			// Reduce percent to give less movement to the element (make it stay in the view)
			// Reduce actual pixel of the transform to give a mass to the element
			percent = (percent > 60) ? 60 : percent;
			percent = (percent < -60) ? -60 : percent;
			delta = ( parseInt(this.currentPhoto.style.height, 10) * percent / 100 ) * 0.8;

			// if pan down, show the hint of how to dismiss the detail view by pan down gesture
			// Change the opacity of the black background
			// Return neighbors to Grid View (they might be visible through background.)
			if (ev.direction & Hammer.DIRECTION_DOWN) {
				myDetailBackground.style.opacity = ( percent / 100 ) + 0.1;
				if (ev.type == "panstart") {
					this.returnNeighbor(this.previousPhoto);
					this.returnNeighbor(this.nextPhoto);
					this.neighborIsVisible = false;
				}
			}		

			if ((ev.type == "panend") || (ev.type == "pancancel")) {
				// if pan down with large delta (more than 40% of the image height), 
				// Dismiss the detail view & Return to the grid view
				// else return to the default location of the photo in the detail view
				if(percent > 40) {
					this.returnNeighbor(this.previousPhoto);
					this.returnNeighbor(this.nextPhoto);
					this.neighborIsVisible = false;
					myHeader.style.visibility = "visible";
					showGridView(this.currentPhoto);

				} else {
					myDetailBackground.style.opacity = 1.0;
					assignTransforms(this.currentPhoto, this.originalTransform);
				}
			} else {
				// (ev.type === panstart) || (ev.type === panmove)
				// Move the photo
				translate = "translate3D(" + value.x + "px, " + (value.y + delta) + "px, " + "0px)";
				assignTransforms(this.currentPhoto, translate);
			}

		} else if ((ev.direction & Hammer.DIRECTION_HORIZONTAL)) {
			// 2. Pan horizontal

			percent = (percent > 60) ? 60 : percent;
			percent = (percent < -60) ? -60 : percent;
			delta = ( parseInt(this.currentPhoto.style.height, 10) * percent / 100 ) * 0.8;

			myDetailBackground.style.opacity = 1.0;
			// Pan horizontally to browse photos in the photo gallery
			// if the gesture moves with a large delta,
			// Show the previous or next photo
			if (ev.type == "panstart") {
				if(!this.neighborIsVisible) {
					this.loadNeighbors();
					this.neighborIsVisible = true;
				}
			}

			if ((ev.type == "panend") || (ev.type == "pancancel")) {
				if ((percent > 40) && this.previousPhoto) {

					// Move the previous photo to the center
					// Move the current photo to the right
					// Return the next photo
					translate = locateDetailViewPhoto(this.previousPhoto, "current");
					assignTransforms(this.previousPhoto, translate);
					translate = locateDetailViewPhoto(this.currentPhoto, "next");
					assignTransforms(this.currentPhoto, translate);

					// Assign a new gesture recognizer to the new current photo
					var mc = new PhotoGalleryGesture(this.previousPhoto);
					myCurrentPhoto = this.previousPhoto;
					myGesture = mc;
					mc.neighborIsVisible = false;
					this.removeGestureEvents(); // Remove the current gesture
					var headerTitleString = this.previousPhoto.firstChild.src.substring(this.previousPhoto.firstChild.src.lastIndexOf("/")+1);
					headerTitleString = headerTitleString.substring(0, headerTitleString.lastIndexOf("."));
					updateHeader(myHeader, myViewMode, headerTitleString);
					updateFooter(myFooter, myViewMode);
				} else if ((percent < -40) && this.nextPhoto) {

					translate = locateDetailViewPhoto(this.currentPhoto, "previous");
					assignTransforms(this.currentPhoto, translate);
					translate = locateDetailViewPhoto(this.nextPhoto, "current");
					assignTransforms(this.nextPhoto, translate);

					// Assign a new gesture recognizer to the new current photo
					var mc = new PhotoGalleryGesture(this.nextPhoto);
					myCurrentPhoto = this.nextPhoto;
					myGesture = mc;
					mc.neighborIsVisible = false;
					this.removeGestureEvents(); // Remove the current gesture
					var headerTitleString = this.nextPhoto.firstChild.src.substring(this.nextPhoto.firstChild.src.lastIndexOf("/")+1);
					headerTitleString = headerTitleString.substring(0, headerTitleString.lastIndexOf("."));
					updateHeader(myHeader, myViewMode, headerTitleString);
					updateFooter(myFooter, myViewMode);
				} else {
					// Otherwise, go back to the original position
					assignTransforms(this.currentPhoto, this.originalTransform);
					assignTransforms(this.previousPhoto, this.previousOriginalTransform);
					assignTransforms(this.nextPhoto, this.nextOriginalTransform);
				}
			} else {
				// Move photos (current and neighbors, if exist) together
				translate = "translate3D(" + (value.x + delta) + "px, " + value.y + "px, " + "0px)";
				assignTransforms(this.currentPhoto, translate);
				
				if (this.previousPhoto) {
					var prev = parseTranslate3D(this.previousOriginalTransform);
					translate = "translate3D(" + (prev.x + delta) + "px, " + prev.y + "px, " + "0px)";
					assignTransforms(this.previousPhoto, translate);
				}

				if (this.nextPhoto) {
					var next = parseTranslate3D(this.nextOriginalTransform);
					translate = "translate3D(" + (next.x + delta) + "px, " + next.y + "px, " + "0px)";
					assignTransforms(this.nextPhoto, translate);
				}
			}
 
		} else {
			// error case. when ev.direction is Hammer.DIRECTION_NONE
			// go back to the original position
			myDetailBackground.style.opacity = 1.0;
			assignTransforms(this.currentPhoto, this.originalTransform);
			assignTransforms(this.previousPhoto, this.previousOriginalTransform);
			assignTransforms(this.nextPhoto, this.nextOriginalTransform);
		}

	},
	// Load neighbors of the current photo to Detail View (outside of view)
	loadNeighbors: function() {

		previousPhoto = null;
		nextPhoto = null;

		if (this.previousPhoto) {

			cleanClassName(this.previousPhoto);
			this.previousPhoto.className += " loadNeighborAnimate";

			this.previousPhoto.style.zIndex = 4;
			magnifyImage(this.previousPhoto);
			var translate = locateDetailViewPhoto(this.previousPhoto, "previous");
			assignTransforms(this.previousPhoto, translate);
			this.previousOriginalTransform = this.previousPhoto.style.transform;

		}

		if (this.nextPhoto) {

			cleanClassName(this.nextPhoto);
			this.nextPhoto.className += " loadNeighborAnimate";

			this.nextPhoto.style.zIndex = 4;
			magnifyImage(this.nextPhoto);
			var translate = locateDetailViewPhoto(this.nextPhoto, "next");
			assignTransforms(this.nextPhoto, translate);
			this.nextOriginalTransform = this.nextPhoto.style.transform;
		}
	},

	// Put the neighbor back to the grid view
	returnNeighbor: function(el) {

		if(!el) {
			return;
		}

		cleanClassName(el);
		reduceImage(el);
		backToOriginalLocation(el);
	},

	// Remove gesture recognizers
	removeGestureEvents: function(){

		// Return all neighbors or 
		// Return neighbors except a new currentPhoto
		if (myCurrentPhoto != this.previousPhoto) {
			this.returnNeighbor(this.previousPhoto);
		}
		if (myCurrentPhoto != this.nextPhoto) {
			this.returnNeighbor(this.nextPhoto);
		}
		this.vertical.destroy();
		this.horizontal.destroy();
	}

}


// get delta
function dirProp(direction, hProp, vProp) {
	return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp
}



