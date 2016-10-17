# Photo Gallery
You can run a prototype here: [goo.gl/k2nCoj](http://www.dahyepark.com/photo-gallery/) (Running on mobile recommended.)

This is a quick prototyping exercise. I used HTML/CSS/JavaScript to prototype of Photo Gallery. The main concern is a smooth  transition between two views, a grid view and a detailed photo view. Also, gestures to browse photos and dismiss the detailed photo view were implemented.  

## Functions implemented
- Transition between a grid view and a detailed photo view
- Tap to show/hide options on the detailed photo view
- Swipe horizontally to see the previous/next photo on the detailed photo view
- Swipe down to dismiss the detailed photo view

## Screenshots
(iPhone 5S/iOS 10.0.2/Safari)

![Screenshots](https://github.com/danhobaklab/photo-gallery/blob/master/screenshots/screenshots.png)

## Development note
### Interaction and Transition Principles
- Two views, Grid View and Detail View, are related and show common content in different ways. The transition between two views **shows their relationship** so that users can easily imagine and understand what happens when they interact with a photo.
- **Smooth transition** not only provides delightful visual experience but also shows the user that the application is reacting to users’ input.

### Development Environment
The prototype is written with HTML, CSS, and JavaScript. It uses one external JavaScript library, Hammer.js, which is a library that can recognize touch gestures, such as tap, pan, and swipe.

### File Structure
- ./index.html (Webpage running the prototype.)
- ./style/style.css (Stylesheet of the prototype.)
- ./js/photogallery-core.js (Initialize a photo gallery and control events.)
- ./js/photogallery-ui.js (Functions to create and manipulate visual elements.)
- ./js/photogallery-gesture.js (Gesture manager. Control gestures and visual elements.)
- ./js/photogallery-filelist.js (List of image files.)
- ./js/hammer.min.js (Gesture recognizer JavaScript library downloaded from http://hammerjs.github.io/)
- ./assets/ (SVG image assets for icons on tools.)
- ./images/ (Photo files.)

### Elements Overview
- This shows alignment of all visual elements on both views, Grid View and Detail View. Having a different z-index provides clear distinction between elements and better control over related items.<br>
![zIndex](https://github.com/danhobaklab/photo-gallery/blob/master/screenshots/zIndex.png)

- The prototype loads a previous photo and a next photo of a selected photo, when it adds a gesture event recognizer to the selected photo. These photos move together when the user swipes horizontally. It gives the user a hint of existence of more photos and how to browse them. They have a same z-index.<br>
![zIndex2](https://github.com/danhobaklab/photo-gallery/blob/master/screenshots/zIndex2.png)


### More details available soon
