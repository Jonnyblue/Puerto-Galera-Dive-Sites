//Dive Site Detail View

exports.detailView = function (e)
{

	var siteDetails = Titanium.UI.createWindow({  
    	title:sites[e.index].name,
    });
	var heightFor16_9 = Math.floor(Ti.Platform.displayCaps.platformWidth/1.78/Ti.Platform.displayCaps.logicalDensityFactor);

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
		dragable: false,
		pincolor: 0x0ff
	
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
//event Listener for the movieButton
		movieButton.addEventListener('click',function(e){
		Ti.Platform.openURL(url);
	});
//button to switch map and image
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
//adds all views to the siteDetails View
	siteDetails.add(mapView);
	siteDetails.add(imageView);
	siteDetails.add(movieButton);
	siteDetails.add(maxDepthLabel);
	siteDetails.add(siteDescription);
	siteDetails.add(button);

	return siteDetails;
};
