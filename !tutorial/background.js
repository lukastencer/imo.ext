var tabID = null;	// store ID of tab for persistent connection
var port = null;	// port which stores persistent connection

chrome.tabs.onUpdated.addListener(checkForValidUrl);		//	each time there is a change in a tab, check for valid URL and respectively show extensions icon
chrome.extension.onRequest.addListener(onRequest); 			//	we show our icon, when connection is initiated

function checkForValidUrl(tabId, changeInfo, tab) {			//	check for valid orl of given tab
  
  if (tab.url.indexOf('//imo.im') > -1) {

    chrome.pageAction.show(tabId);	
  }
};

function onRequest(request, sender, sendResponse) {			//	first time showing icon of our extension

  chrome.pageAction.show(sender.tab.id);

};

chrome.webRequest.onCompleted.addListener(					//	we are catching xmlhttprequests, to know, when to fire actions in contenscript
  function(details) {
		if(details.type === 'xmlhttprequest'){
			if(port != null)port.postMessage(details);
		}
    return true;
  },
  {urls: ["<all_urls>"]},
["responseHeaders"]);


chrome.extension.onMessage.addListener(						//	here we response on first message send by tab with imo.im open, also we initiate here our permanent connection
  function(request, sender, sendResponse) {
	if(tabID == null)
	{
		tabID=sender.tab.id;
		port = chrome.tabs.connect(tabID,{name: "knockknock"});  
	}
		
//	if(request.command == 'close'){
//		tabID=null;
//	}
	
});

