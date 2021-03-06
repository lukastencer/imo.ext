chrome.extension.sendMessage({greeting: "hello"}, function(response) {		//	first message, to initiate permanent conneciton
});

chrome.extension.onConnect.addListener(function(port) {						//	if permanent conneciton is initiated, we would like to on each message, execute our main action
  port.onMessage.addListener(function(msg) {
	routineXHR();
  });
});


function routineXHR(){														//	our routine function, which is called always, when XHR is completed
	
	zoomPicture();
	
}

function zoomPicture(){														//	our main zoompicture function
	var container = $('.meet-card-image');										//	search for all elements with class .meet-card-image

	if (container.length != 0)
	{
		for (var i = 0, item; item = container[i]; i++)							//	loop through them
		{
		item=$(item);															//	we define our functions on Jquery object, so we convert
			if(item.find('#zoomBtn').length == 0)								//	if we have not procecssed this element before (thus it does not have zoomBtn)
			{
				var img = item.find('img');										//	get image, to get dimensions
				var link = 'https://imo.im' + img.attr('src');					//	compose link to big image
				link = link.substring(0,link.length-7);							//	remove last 7 charracters
				var zoom_imgurl = chrome.extension.getURL("images/zoom.png");	//	we need to get URL of our resource				
				
				var clickSensor = $('<a id="zoomLink" class="lightbox" href="'+link+'" style="opacity:0"><div id="zoomBtn" style="border: 0px solid rgb(255,0,0); top: '+ (img.height()-15) +'px; left:0px; position: absolute; width:'+img.width()+'px; height: 15px; background: rgb(236,244,249); text-align: center;"><img src="'+zoom_imgurl+'" alt="zoomPicBtn" style="max-width:100%; max-height:100%;"></div></a>');		//	compose element, which we are going to append
				
				clickSensor.hover(												//	hover efect over element to append
					function(){
						$(this).animate(
							{
								opacity:0.90
							}
						,300);
					},
					function(){
						$(this).animate(
							{
								opacity:0.32
							}
						,300);
					}
				);
				
				item.mouseenter(												//	hover efect over entering of profile picture region
					function(){
						$(this).find('#zoomLink').animate(
							{
								opacity:0.32
							}
						,300);
					});
				item.mouseleave(												//	hover efect over entering of profile picture region
					function(){
						$(this).find('#zoomLink').animate(
							{
								opacity:0
							}
						,300);
					}
				);			
				
				var ximageBtnClose = chrome.extension.getURL('images/closelabel.gif');	//	we need to get URL of this resource, if we want to use it in external script
				
				item.append(clickSensor);												//	and here we are appending
				$('#zoomLink').lightbox(												//	and now, we get the appended item and call it's lightbox, if we call the lightbox before appending, it won't work (at least with the version we are using, with some other version it might (and it was) working, but this version is doing rescaling right)
				{
					fitToScreen: true,
					displayDownloadLink: true,
					fileBottomNavCloseImage:ximageBtnClose				
				}
				);
			}
		}
	}
}
