const config = {
    apiKey: "AIzaSyAp5Xbc_MJhPbCC9867fDEBiejU8o_wYhU",
    authDomain: "extensionchrome-a6490.firebaseapp.com",
    databaseURL: "https://extensionchrome-a6490.firebaseio.com",
    projectId: "extensionchrome-a6490",
    storageBucket: "",
    messagingSenderId: "988181996502"
};
firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

chrome.runtime.onInstalled.addListener(function() {
   // chrome.storage.sync.set(messages, function() {
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
        if(!message.content){
          sendResponse({ type: "error", content: "Aucun message" });
          return;
        }
        db.collection("messages").add({
            content: message.content
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      }

      if(message.type == "get"){
        const messages = [];
        db.collection("messages").get().then(function(elem){
          if(!elem){
            messages = null;
          }
          elem.forEach((doc) => {
            const message = doc.data();
            messages.push(message.content);
          });
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        console.log(messages);
        return sendResponse(messages);
      }

    }
    chrome.runtime.onMessage.addListener(onMessageListener);
});
