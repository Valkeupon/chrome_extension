const changeValue = document.getElementById('addValue');
const input = document.getElementById('inputValue');
const list = document.querySelector('.link .link_content');
const notifs = document.querySelector('.notifs');
const child = document.querySelector(".wrapper");

const port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage({type: "get"});
port.onMessage.addListener(function (content) {
  list.removeChild(child);
  if(content.created) {
    return notifs.innerHTML = "<div>Message envoyé</div>";
  }

  content.map((elem) => {
    const date = new Date(elem.createdAt);
    list.innerHTML += "<li><a target='_blank' href="+ elem.content +">" + elem.title + "<div class='date'>" + date.toLocaleDateString() + "<span> - "+ date.toLocaleTimeString() +"</span></div></a></li>";
  });
});

changeValue.onclick = function(element) {
  let value = input.value;
  port.postMessage({ type: "created", content: value });
};

const console = function(params) {
  if(chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ type: "log", content: params });
  }
}
