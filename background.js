chrome.runtime.onInstalled.addListener(function() {
   // chrome.storage.sync.set({color: '#3aa757'}, function() {
   //   console.log("The color is green.");
   // });
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostContains: '.' },
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });


    const onMessageListener = function(message, sender, sendResponse) {
      //DEBUGGING
      if(message.type == "log"){
        console.log(message.content);
      }
      //CREATED
      if(message.type == "created"){
        alert(message.content);
        //executeScript
      }
    }
    chrome.runtime.onMessage.addListener(onMessageListener);
 });
