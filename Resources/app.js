// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


var MapModule = require('ti.map');
var mapBool = false;
var sites = null,
	indexes = [];
//Set Default Font	
var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;



/**
	 * Access the FileSystem Object to read in the information from a flat file (lib/userData/data.js)
	 * DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Filesystem
	 */
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "sites/sites.json"); 
	
	/**
	 * Populate the users variable from the file this call returns an array
	 */
//populate sites array with data from sites.json
sites = JSON.parse(file.read().text).sites;
//function to sort the array
var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};
   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}
//sort the array by name	
sites.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
//create the window
var win1 = Titanium.UI.createWindow({  
    title:'Puerto Galera Dive Sites',
    backgroundColor:'black'
});

//create a tab
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Dive Sites',
    window:win1
});

//create the table data
var tbl_data = [];
for (var i=0; i < sites.length; i++) {
  var row = Ti.UI.createTableViewRow({
  	classname: 'sitesList',
  	rowIndex: i,
  	height: 80,
  	hasDetail: true
  });
  var diveSiteNameLabel = Ti.UI.createLabel({
    font:{fontFamily:'Arial', fontSize:defaultFontSize+6, fontWeight:'bold'},
    text:sites[i].name,
    left:6,
    top: 6,
    width:200, height: 30
  });
  
  var maxDepthLabel = Ti.UI.createLabel({
    font:{fontFamily:'Arial', fontSize:defaultFontSize},
    text:sites[i].maxDepth,
    left:6,
    top: 40,
    width:200, height: 30
  });
  row.add(diveSiteNameLabel);
  row.add(maxDepthLabel);
  tbl_data.push(row);
};

var table = Ti.UI.createTableView();
table.setData(tbl_data);

table.addEventListener('click', function(e){
	var siteDetails = Titanium.UI.createWindow({  
    title:sites[e.index].name,
    
});
var heightFor16_9 = Math.floor(Ti.Platform.displayCaps.platformWidth/1.78/Ti.Platform.displayCaps.logicalDensityFactor);


var youTubeUrl = 'http://www.youtube.com/embed/' + sites[e.index].youtube + '?autoplay=1&autohide=1&cc_load_policy=0&color=white&controls=0&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0';

var webView = Ti.UI.createWebView({
	backgroundImage: sites[e.index].photo,
	top: 0,
	backgroundColor: 'transparent',
	height:heightFor16_9,
	url:youTubeUrl,
    enableZoomControls: false,
    scalesPageToFit: false,
    scrollsToTop: false,
    showScrollbars: false
});
var imageView = Ti.UI.createImageView({
	image: sites[e.index].photo,
	top: 0,	
	height:heightFor16_9,
});

var mapView = MapModule.createView({
	region:{latitude:sites[e.index].latitude, longitude:sites[e.index].longitude, latitudeDelta:0.005, longitudeDelta:0.005},
	top: 0,
	mapType: 2,
	height: heightFor16_9,
	visible: false
});

var blueRibbonAnnotation = MapModule.createAnnotation({
	title: "Blue Ribbon Dive Resort",
	latitude: 13.522601,
	longitude: 120.971819,
	dragable: false
	
});

var siteAnnotation = MapModule.createAnnotation({
	title: sites[e.index].name,
	latitude: sites[e.index].latitude,
	longitude: sites[e.index].longitude,
	dragable: false
	
});

mapView.addAnnotation(blueRibbonAnnotation);
mapView.addAnnotation(siteAnnotation);

var maxDepthLabel = Ti.UI.createLabel({
	text: 'Max Depth = ' + sites[e.index].maxDepth + '\n' + 'Time from Blue Ribbon = ' + sites[e.index].travelTime,
	font: {fontSize:defaultFontSize+4, fontWeight:'bold'},
	top: heightFor16_9 + 55,
	left: 10
});

var distanceLabel = Ti.UI.createLabel({
	text: 'Time from Blue Ribbon = ' + sites[e.index].travelTime,
	font: {fontSize:defaultFontSize+4, fontWeight:'bold'},
	top: heightFor16_9 + 55,
	right: 10
});

var siteDescription = Ti.UI.createTextArea({
	value: sites[e.index].siteDescription,
	font: {fontSize:defaultFontSize},
	top: heightFor16_9 + 110,
	left: 10,
	right: 10,
	bottom: 10,
	editable:false,
	borderWidth: 0,
  	borderColor: '#bbb'
});

var button = Ti.UI.createButton({
	backgroundImage: 'map.png',
	title:'Map',
	top: heightFor16_9 + 5,
	left: 10,
	width: 200,
	height: 50
	
});

var movieButton = Ti.UI.createButton({
	backgroundImage: 'YouTube-logo-full_color.png',
	top: heightFor16_9 + 5,
	right: 10,
	width: 200,
	height: 50
	
});
var url = 'http://www.youtube.com/watch?v=' + sites[e.index].youtube;

movieButton.addEventListener('click',function(e){
	Ti.Platform.openURL(url);
});

button.addEventListener('click',function(e)
{

   if (mapBool) {
   	imageView.show();
   	mapView.hide();
   	mapBool = false;
   	
   }
   else {
   	imageView.hide();
   	mapBool = true;
   	mapView.show();  	
   };
   
});
siteDetails.add(mapView);
//siteDetails.add(webView);
siteDetails.add(imageView);
siteDetails.add(movieButton);
siteDetails.add(maxDepthLabel);
//siteDetails.add(distanceLabel);
siteDetails.add(siteDescription);
siteDetails.add(button);

siteDetails.open();
});

Ti.Gesture.addEventListener('orientationchange',function(e) {
	// get current device orientation from
	// Titanium.Gesture.orientation
	// get orientation from event object
	// from e.orientation
	// Ti.Gesture.orientation should match e.orientation
	// but iOS and Android will report different values
	// two helper methods return a Boolean
	//e.source.isPortrait()
	//if (e.source.isLandscape()) {
	//	webView.height = Ti.Platform.displayCaps.platformHeight/logicalDensityFactor;
		//webView.width = Ti.Platform.displayCaps.platformWidth/logicalDensityFactor;
		//maxDepthLabel.hide();
		//distanceLabel.hide();
		//siteDescription.hide();
		//distanceLabel.hide();
		//webView.reload();
//	};
//	if (e.source.isPortrait()) {
//		webView.height = Ti.Platform.displayCaps.platformWidth/logicalDensityFactor/1.78;
//		webView.width = Ti.Platform.displayCaps.platformWidth/logicalDensityFactor;
//		maxDepthLabel.show();
//		distanceLabel.show();
//		siteDescription.show();
//		distanceLabel.show();
//		webView.reload();
		
//	};
});



win1.add(table);
win1.open();
