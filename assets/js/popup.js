function getWalkMeData(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getWalkMe" }, function(response) {
      if(!response || !response.success)
        return showError('Page doesn\'t contain the WalkMe.');

      callback(response.data);
    });
  });
}

function getAdditionalData(userId, callback) {
  if(!window.fixedCallback) window.fixedCallback = callback;

  var url     = 'https://s3.amazonaws.com/s3.maketutorial.com/users/' + userId + '/settings.txt';
  var script  = document.createElement('script');

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);

  document.body.appendChild(script);
}

function showError(error) {
  document.getElementById('error').innerText = error;
}

//smell?
function showDetails(details) {
  var whois = document.getElementById('whois');

  details.forEach(function (data)  {
    var elm = document.createElement('p');

    elm.innerHTML =
      '<strong>' + data.name + ': </strong>' + data.value;

    whois.appendChild(elm);
  });
}

function showAdditionalData(data) {
  var libVerRe = /[_]lib_(.*).js/;

  var version 		  = data.LibFile.match(libVerRe)[1];
  var dataFilesUrls = [];
  var languages 		= [];

  data.DataFiles.forEach(function (file) {
    dataFilesUrls.push(file.url);

    file.languages.forEach(function (language) {
      languages.push(language.displayName);
    });
  });

  var details = [
    {
      name: 'Version',
      value: version
    },
    {
      name: 'Data Files',
      value: dataFilesUrls
    },
    {
      name: 'Languages',
      value: languages
    }
  ];

  showDetails(details);
}

function showWalkMeData(data) {
  var userEnvRe = /(.*)[/](.*)/;

  var user 	  = data.src[3];
  var userId  = user;
  var env 	  = 'production';

  //idk how make it better :(
  if(userEnvRe.test(user)) {
    var res = user.match(userEnvRe);

    userId 	= res[1];
    env 	  = (res[2].length > 0) ? res[2] : env;
  }

  var details = [
    {
      name: 'Host',
      value: data.src[2]
    },
    {
      name: 'User ID',
      value: userId
    },
    {
      name: 'Environment',
      value: env
    },
    {
      name: 'Protocol',
      value: data.src[4]
    },
    {
      name: 'async',
      value: data.async
    }
  ];

  showDetails(details);

  getAdditionalData(userId, showAdditionalData);
}

//get walkme after popup load
getWalkMeData(showWalkMeData);
