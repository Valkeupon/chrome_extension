let changeValue = document.getElementById('addValue');
let input = document.getElementById('inputValue');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

const console = function(params) {
  if(chrome && chrome.runtime) {
    chrome.runtime.sendMessage(params);
  }
}

changeValue.onclick = function(element) {
    let value = input.value;
    console(value); 
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.executeScript(
    //       tabs[0].id,
    //       {code: changeValue.setAttribute('value', ""); });
    // });
  };
