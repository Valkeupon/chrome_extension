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

const httpGet = function(url) {
  const xmlHttp = new XMLHttpRequest();
  const theUrl = 'https://getmeta.info/json?url='+ url;
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        //GET
        if (message.type == "get") {
          db.collection("messages").limit(3).orderBy("createdAt", "desc").get().then(function(elem) {
            let messages = [];
            if(!elem) {
              messages = null;
              return;
            }
            elem.forEach((doc) => {
              const message = doc.data();
              messages.push(message);
            });

            messages.sort(function(a, b) {
              if (a.createdAt < b.createdAt) {
                return -1;
              }
              if (a.createdAt > b.createdAt) {
                return 1;
              }
              return 0;
            });

            port.postMessage(messages);
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
        }
        //CREATED
        if(message.type == "created") {
          if(!message.content){
            sendResponse({ type: "error", content: "Aucun message" });
            return;
          }

          let infos = httpGet(message.content);
          if(!infos) {
            return;
          }

          infos = JSON.parse(infos);
          db.collection("messages").add({
              title: infos.title,
              content: message.content,
              createdAt: new Date().getTime()
          })
          .then(function(doc) {
             port.postMessage({ created: true });
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
        }
    });
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

    const onMessageListener = function(message, sendResponse) {
      //DEBUGGING
      if(message.type == "log"){
        console.log(message.content);
      }
    };
    chrome.runtime.onMessage.addListener(onMessageListener);
});
