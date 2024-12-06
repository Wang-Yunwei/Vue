/* eslint-disable */
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function () {
        callback(WebViewJavascriptBridge);
      },
      false
    );
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "https://__bridge_loaded__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }
}

//初始化
setupWebViewJavascriptBridge(function (bridge) {
  try {
    bridge.init(function (message, callback) {
      callback(null);
    });
  } catch (e) { }
});

export default {
  //js调APP方法 （参数分别为:app提供的方法名  传给app的数据  回调）
  callhandler: function (method, params, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(method, params, callback);
    });
  },

  // APP调js方法 （参数分别为:js提供的方法名  回调）
  registerHandler(method, callback) {
    setupWebViewJavascriptBridge(bridge => {
      bridge.registerHandler(method, (data, responseCallback) => {
        callback(data, responseCallback);
      });
    });
  },

  call: function (method, params) {
    const that = this;
    return new Promise(function (resolve, reject) {
      try {
        that.callhandler(method, params, data => {
          console.log(`android method ${method} is invoked.`);
          console.log(`response data: ${JSON.stringify(data)}`);
          resolve(data);
        });
      } catch (e) {
        reject(new Error(e));
      }
    });
  },

  playSound: function (content, repeat) {
    return this.call("playSound", {
      content: content,
      repeat: repeat
    });
  },

  playSoundOnce: function (content) {
    return this.playSound(content, 1);
  },

  scan: function (types) {
    return this.call("scanner", { type: types });
  },

  exit: function () {
    return this.call("finishPager", {});
  },

  onBack: function (callback) {
    this.registerHandler("onReturnGesture", callback);
  },

  startGPS: function () {
    this.call("startGPS");
  },

  onLocation: function (callback) {
    return this.registerHandler("onLocation", callback);
  },

  stopGPS: function () {
    this.call("stopGPS");
  },

  isLocationEnable: function () {
    return this.call("isLocationEnable");
  },

  openLink: function (url) {
    return this.call("openLink", {
      url: url,
      toolbarVisible: false,
      interceptBack: false
    });
  },

  startVoiceInput: function () {
    this.call("startVoiceInput");
  },

  onVoiceInputEnd: function (callback) {
    return this.registerHandler("onVoiceInputEnd", callback);
  },

  // 隐藏键盘
  hideKeyboard: function () {
    this.call("hideKeyboard");
  },

  onKeyboardHide: function (callback) {
    return this.registerHandler("onKeyboardHide", callback);
  },

  takePhoto: function (params = {}) {
    console.log('takePhoto')
    return this.call('takePhoto', params)
  },

  takePhotoCallback: function (callback) {
    console.log('注册takePhotoCallback')
    return this.registerHandler('takePhotoCallback', callback)
  }
};
