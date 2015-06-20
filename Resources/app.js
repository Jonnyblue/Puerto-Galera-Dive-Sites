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
var detailViewModule = require('detailViewModule');



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

var tabGroup = Titanium.UI.createTabGroup();




//create the window
var win1 = Titanium.UI.createWindow({  
    title:'Puerto Galera Dive Sites',
    backgroundColor:'black'
});


//create the table data
var tbl_data = [];
for (var i=0; i < sites.length; i++) {
  var row = Ti.UI.createTableViewRow({
  	classname: 'sitesList',
  	rowIndex: i,
  	height: 80,
  	hasDetail: true,
  	rightImage: 'KS_nav_ui.png'
  });
  var diveSiteNameLabel = Ti.UI.createLabel({
    font:{fontFamily:'Arial', fontSize:defaultFontSize+6, fontWeight:'bold'},
    text:sites[i].name,
    left:135,
    top: 6,
    width:200, height: 30
  });
  
  var smallImageFile = sites[i].photo.slice(0, 13) + "s_" + sites[i].photo.slice(13);    // insert _s into the fileName for a small file
  
  var diveSiteImage = Ti.UI.createImageView({
  	left:6,
    top: 5,
    image: smallImageFile,
    width: 125,
    height: 70
  });
  
  
  var maxDepthLabel = Ti.UI.createLabel({
    font:{fontFamily:'Arial', fontSize:defaultFontSize},
    text:sites[i].maxDepth,
    left:135,
    top: 40,
    width:200, height: 30
  });
  row.add(diveSiteImage);
  row.add(diveSiteNameLabel);
  row.add(maxDepthLabel);
  tbl_data.push(row);
};

var table = Ti.UI.createTableView();
table.setData(tbl_data);

table.addEventListener('click', function(e){
	var detailView = detailViewModule.detailView(e);
	detailView.open();
});

win1.add(table);
var tab1 = Titanium.UI.createTab({
    title:'Dive Sites',
    window:win1

});




var win2 = Titanium.UI.createWindow({

    title:'Map',

    backgroundColor:'#fff'

});

var win3 = Titanium.UI.createWindow({

    title:'Web',

    backgroundColor:'#fff'

});

var homePageView = Ti.UI.createWebView({
	url: 'http://www.blueribbondivers.com'	
});

win3.add(homePageView);
var tab3 = Titanium.UI.createTab({
    title:'Web',
    window:win3

});

var mapPage = MapModule.createView({
	region:{latitude:'13.522601', longitude:'120.971819', latitudeDelta:0.01, longitudeDelta:0.01},
	mapType: 2
});

win2.add(mapPage);

var diveSitesMapArray = [];
for (var i=0; i < sites.length; i++) {
  var mapPageAnnotation = MapModule.createAnnotation({
  	longitude: sites[i].longitude,
  	latitude: sites[i].latitude,
  	title: sites[i].name,
  	dragable: false
  });
  diveSitesMapArray.push(mapPageAnnotation); 
};
var blueRibbonAnnotation = MapModule.createAnnotation({
	title: "Blue Ribbon Dive Resort",
	latitude: 13.522601,
	longitude: 120.971819,
	dragable: false	,
	pincolor: 0x0ff
});
  diveSitesMapArray.push(blueRibbonAnnotation);
	mapPage.addAnnotations(diveSitesMapArray); 	
var tab2 = Titanium.UI.createTab({

    title:'Map',

    window:win2

});

tabGroup.addTab(tab1);

tabGroup.addTab(tab2);

tabGroup.addTab(tab3);

tabGroup.open();
