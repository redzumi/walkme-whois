//ofc, we need to improve our checking in future
function getWalkMe() {
  var re = /^(http[s]?|ftp):\/\/?\/?([^:\/\s]+)[/]users[/](.*)walkme[_].*[_](.*)[.]js$/;

  for(var i = 0; i <= document.scripts.length - 1; i++) {
    var script = document.scripts[i];

    if(re.test(script.src))
      return {
        success: true,
        data: { async: script.async, src: script.src.match(re) }
      };
  }

  return { success: false };
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(!message.action) return; //TODO error?

  switch(message.action) {
    case 'getWalkMe': {
      sendResponse(getWalkMe()); //send getWalkMe result in response
      break;
    }
  }
});
