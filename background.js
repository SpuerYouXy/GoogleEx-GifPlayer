function genericOnClick(info, tab) {   
chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendRequest(tab.id, {src:info.srcUrl}, function(response) {
	
  });
});
} 



var link = chrome.contextMenus.create({
	"title": "GifPlayer",
	"contexts":["image"],
	"onclick":genericOnClick
	});  