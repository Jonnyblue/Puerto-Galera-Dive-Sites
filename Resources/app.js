// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');




var sites = null,
	indexes = [];
//Set Default Font	
var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;




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
  	height: 80
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



win1.add(table);

win1.open();
