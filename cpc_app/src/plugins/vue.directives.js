/* eslint-disable */
const int = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function() {
      if (vnode.inputLocking) {
        return;
      }

      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      var msg =
        "请输入" + binding.value.min + "-" + binding.value.max + "之间的整数。";

      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^\d]/g, "");
      newValue = newValue.replace(/^(\\-)*(\d+)$/, "$1$2");
      if (newValue) {
        const arr = newValue.split(".");
        newValue = Number(newValue) + ""; // 去掉开头多余的0
        if (Number(newValue) > binding.value.max) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue = newValue.substr(0, newValue.length - 1);
          // if (vnode.data.model != null) {
          //    if (vnode.data.model.value){
          //        newValue = vnode.data.model.value;
          //    }
          //    else {
          //        newValue = ""
          //    }
          // } else { newValue = "" };
        }
      }
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
    input.addEventListener("blur", function() {
      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      var msg =
        "请输入" + binding.value.min + "-" + binding.value.max + "之间的整数。";
      const oldValue = input.value;
      let newValue = input.value;
      if (newValue) {
        if (Number(newValue) < binding.value.min) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue = "";
        } else {
          newValue = Number(newValue).toString();
        }
      }
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });

    // el.addEventListener("keypress", function (e) {
    //    e = e || window.event;
    //    let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
    //    let re = /\d/;
    //    if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
    //        if (e.preventDefault) {
    //            e.preventDefault();
    //        } else {
    //            e.returnValue = false;
    //        }
    //    }
    // });
    // el.addEventListener("change", function (e) {
    //    e = e || window.event;
    //    var strValue = e.target.value;
    //    if (strValue == null || strValue == '') return;
    //    if (!binding.value) binding.value = {};
    //    if (!binding.value.min) binding.value.min = 0;
    //    if (!binding.value.max) binding.value.max = 1000;
    //    var msg = '请输入' + binding.value.min + '-' + binding.value.max + '之间的整数。';

    //    //检查是否包含双字节
    //    let hzregex = /[\u4e00-\u9fa5]/g;
    //    if (hzregex.test(strValue)) {
    //        e.target.value = null;
    //        vnode.context.$notify({ type: 'warning', message: msg });
    //        return;
    //    }
    //    //检查是否是整数
    //    var reg = eval('/^(0|[1-9][0-9]*)/g');
    //    var r = strValue.match(reg);
    //    if (r == null || r.length == 0) {
    //        e.target.value = e.target.value.replace(hzregex, '');
    //        vnode.context.$notify({ type: 'warning', message: msg });
    //        return;
    //    }
    //    //检查整数范围
    //    var value = parseInt(strValue);
    //    if (value < binding.value.min || value > binding.value.max) {
    //        e.target.value = null;
    //        vnode.context.$notify({ type: 'warning', message: msg });
    //        return;
    //    }

    //    e.target.value = strValue;
    // });
  }
};

const float = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function() {
      if (vnode.inputLocking) {
        return;
      }
      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      if (!binding.value.scale) binding.value.scale = 2;
      var msg =
        "请输入" + binding.value.min + "-" + binding.value.max + "之间的数字。";

      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^\d.]/g, "");
      newValue = newValue.replace(/^\./g, "");
      newValue = newValue
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      newValue = newValue.replace(
        eval("/^(\\-)*(\\d+)\\.(\\d{0," + binding.value.scale + "}).*$/"),
        "$1$2.$3"
      );
      if (newValue) {
        const arr = newValue.split(".");
        newValue = Number(arr[0]) + (arr[1] === undefined ? "" : "." + arr[1]); // 去掉开头多余的0
        if (Number(newValue) > binding.value.max) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue =
            Number(arr[0].substr(0, arr[0].length - 1)) +
            (arr[1] === undefined ? "" : "." + arr[1]);
          // if (vnode.data.model != null && vnode.data.model.value) {
          //    if (vnode.data.model.value) {
          //        newValue = vnode.data.model.value;
          //    }
          //    else if (vnode.data.model.expression) {
          //        newValue = eval("vnode.context." + vnode.data.model.expression);
          //    }
          //    else {
          //        newValue = ""
          //    }
          // } else { newValue = "" };
        }
      }
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
    input.addEventListener("blur", function() {
      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      if (!binding.value.scale) binding.value.scale = 2;
      var msg =
        "请输入" + binding.value.min + "-" + binding.value.max + "之间的数字。";

      const oldValue = input.value;
      let newValue = input.value;
      if (newValue) {
        if (Number(newValue) < binding.value.min) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue = "";
        } else {
          newValue = Number(newValue).toString();
        }
      }
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

const labResult = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function() {
      if (vnode.inputLocking) {
        return;
      }
      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      if (!binding.value.scale) binding.value.scale = 2;
      var msg =
        "请输入" +
        binding.value.min +
        "-" +
        binding.value.max +
        "之间带" +
        binding.value.scale +
        "位小数的数字。";

      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^\d\.\<\>]/g, "");
      newValue = newValue.replace(/^\./g, "");
      newValue = newValue
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");

      let symbol = "";
      var lessCount = newValue.lastIndexOf("<");

      var greaterCount = newValue.lastIndexOf(">");

      if (greaterCount == 0 || lessCount == 0) {
        symbol = newValue.substring(0, 1);
        newValue = newValue.substring(1);
      }
      newValue = newValue.replace(
        eval("/^(\\-)*(\\d+)\\.(\\d{0," + binding.value.scale + "}).*$/"),
        "$1$2.$3"
      );

      if (newValue) {
        const arr = newValue.split(".");
        newValue = Number(arr[0]) + (arr[1] === undefined ? "" : "." + arr[1]); // 去掉开头多余的0
        if (Number(newValue) > binding.value.max) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue =
            symbol +
            Number(arr[0].substr(0, arr[0].length - 1)) +
            (arr[1] === undefined ? "" : "." + arr[1]);
          // if (vnode.data.model != null && vnode.data.model.value) {
          //    if (vnode.data.model.value) {
          //        newValue = vnode.data.model.value;
          //    }
          //    else if (vnode.data.model.expression) {
          //        newValue = eval("vnode.context." + vnode.data.model.expression);
          //    }
          //    else {
          //        newValue = ""
          //    }
          // } else { newValue = "" };
        }
      }
      newValue = symbol + newValue;
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
    input.addEventListener("blur", function() {
      if (!binding.value) binding.value = {};
      if (!binding.value.min) binding.value.min = 0;
      if (!binding.value.max) binding.value.max = 1000;
      if (!binding.value.scale) binding.value.scale = 2;
      var msg =
        "请输入" +
        binding.value.min +
        "-" +
        binding.value.max +
        "之间带" +
        binding.value.scale +
        "位小数的数字。";

      let symbol = "";
      const oldValue = input.value;
      let newValue = input.value;
      var lessCount = newValue.lastIndexOf("<");
      if (lessCount > 0) {
        vnode.context.$notify({ type: "warning", message: "存在多个<号" });
        newValue = "";
      } else if (lessCount === 0) {
        if (newValue.startsWith("<")) {
          symbol = newValue.substring(0, 1);
          newValue = newValue.substring(1);
        } else {
          vnode.context.$notify({
            type: "warning",
            message: "<号只能出现在首位"
          });
          newValue = "";
        }
      }
      var greaterCount = newValue.lastIndexOf(">");
      if (greaterCount > 0) {
        vnode.context.$notify({ type: "warning", message: "存在多个>号" });
        newValue = "";
      } else if (greaterCount === 0) {
        if (newValue.startsWith(">")) {
          symbol = newValue.substring(0, 1);
          newValue = newValue.substring(1);
        } else {
          vnode.context.$notify({
            type: "warning",
            message: ">号只能出现在首位"
          });
          newValue = "";
        }
      }
      if (newValue) {
        if (newValue < binding.value.min) {
          vnode.context.$notify({ type: "warning", message: msg });
          newValue = "";
        } else {
          newValue = symbol + Number(newValue).toString();
        }
      }
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

const char = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function(e) {
      if (!binding.value) binding.value = {};
      var msg = "请输入字母、数字、中划线或下划线！";
      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^_a-zA-Z0-9\\-]/g, "");
      if (input.maxLength && input.maxLength > 0) {
        newValue = newValue.substr(0, input.maxLength);
      }

      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
    input.addEventListener("blur", function() {
      const oldValue = input.value;
      const newValue = input.value;
      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

// Vue.directive('bp', {
//     inserted: function (el, binding, vnode) {
//         const input = vnode.elm.getElementsByTagName('input')[0]
//         input.addEventListener('compositionstart', function () {
//             vnode.inputLocking = true
//         })
//         input.addEventListener('compositionend', function () {
//             vnode.inputLocking = false
//             input.dispatchEvent(new Event('input'))
//         })
//         input.addEventListener('input', function (e) {
//             if (!binding.value) binding.value = {}
//             var msg = '请输入字母、数字、中划线或下划线！'
//             const oldValue = input.value
//             let newValue = input.value
//             newValue = newValue.replace(/[^0-9/]/g, '')
//             newValue = newValue.replace('/', '$#$').replace(/[/]/g, '').replace('$#$', '/')
//             newValue = newValue.replace(eval('/^(\\d+)[/]{1}(\\d+)$/'), '$1/$2')
//             if (newValue) {
//                 const arr = newValue.split('/')
//                 var sp = Number(arr[0])
//                 if (sp > 300) sp = Number(arr[0].substr(0, arr[0].length - 1))
//                 var dp = null
//                 if (arr.length > 1) {
//                     var dp = Number(arr[1])
//                     if (dp > 300) dp = Number(arr[1].substr(0, arr[1].length - 1))
//                     if (dp == 0) dp = ''
//                 }
//                 newValue = sp + (dp == null ? '' : '/' + dp)
//             }
//             // 判断是否需要更新，避免进入死循环
//             if (newValue !== oldValue) {
//                 input.value = newValue
//                 input.dispatchEvent(new Event('input')) // 通知v-model更新
//             }
//         })
//         input.addEventListener('blur', function () {
//             const oldValue = input.value
//             const newValue = input.value
//             // 判断是否需要更新，避免进入死循环
//             if (newValue !== oldValue) {
//                 input.value = newValue
//                 input.dispatchEvent(new Event('input')) // 通知v-model更新
//             }
//         })
//     }
// })

const phone = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function(e) {
      if (!binding.value) binding.value = {};
      var msg = "请输入正确的电话号码！";
      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^\d\\+\\-]/g, "");
      if (newValue.length > 18) {
        newValue = newValue.substr(0, 18);
      }
      if (newValue.indexOf("+") > 0) {
        newValue = newValue.replace(/[\\+]/g, "");
      }
      newValue = newValue.replace(/(\\-\\-)/g, "-");

      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
    input.addEventListener("blur", function() {
      const oldValue = input.value;
      let newValue = input.value;
      if (!binding.value) binding.value = {};
      var msg = "请输入正确的电话号码！";
      var mobile = /^((\+86)|(86))?\d{11}$/g;
      var telStandard = /^(\d{4}|\d{3})-(\d{7,8})$/g;
      var telBranch = /^(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$/g;
      if (
        !mobile.test(newValue) &&
        !telStandard.test(newValue) &&
        !telBranch.test(newValue)
      ) {
        newValue = "";
        vnode.context.$notify({ type: "warning", message: msg });
      }

      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

// Vue.directive('labtest', {
//     inserted: function (el, binding, vnode) {
//         debugger
//         const input = vnode.elm.getElementsByTagName('input')[0]
//         input.addEventListener('compositionstart', function () {
//             vnode.inputLocking = true
//         })
//         input.addEventListener('compositionend', function () {
//             vnode.inputLocking = false
//             input.dispatchEvent(new Event('input'))
//         })
//         input.addEventListener('input', function (e) {
//             debugger
//             if (!binding.value) binding.value = {}
//             const oldValue = input.value
//             let newValue = input.value
//             newValue = newValue.replace(/[^><0-9.\s]/g, '')
//             if (input.maxLength) {
//                 newValue = newValue.substr(0, input.maxLength)
//             }

//             // 判断是否需要更新，避免进入死循环
//             if (newValue !== oldValue) {
//                 input.value = newValue
//                 input.dispatchEvent(new Event('input')) // 通知v-model更新
//             }
//         })
//         input.addEventListener('blur', function () {
//             const oldValue = input.value
//             const newValue = input.value
//             // 判断是否需要更新，避免进入死循环
//             if (newValue !== oldValue) {
//                 input.value = newValue
//                 input.dispatchEvent(new Event('input')) // 通知v-model更新
//             }
//         })
//     }
// })

// 自定义指令

const noSS = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function(e) {
      if (vnode.inputLocking) return;
      if (!binding.value) binding.value = {};
      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");

      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

const phonenumber = {
  inserted: function(el, binding, vnode) {
    const input = vnode.elm.getElementsByTagName("input")[0];
    input.addEventListener("compositionstart", function() {
      vnode.inputLocking = true;
    });
    input.addEventListener("compositionend", function() {
      vnode.inputLocking = false;
      input.dispatchEvent(new Event("input"));
    });
    input.addEventListener("input", function(e) {
      if (vnode.inputLocking) return;
      if (!binding.value) binding.value = {};
      const oldValue = input.value;
      let newValue = input.value;
      newValue = newValue.replace(/[^\d\\+\\-]/g, "");
      if (newValue.length > 18) {
        newValue = newValue.substr(0, 18);
      }
      if (newValue.indexOf("+") > 0) {
        newValue = newValue.replace(/[\\+]/g, "");
      }
      newValue = newValue.replace(/(\\-\\-)/g, "-");

      // 判断是否需要更新，避免进入死循环
      if (newValue !== oldValue) {
        input.value = newValue;
        input.dispatchEvent(new Event("input")); // 通知v-model更新
      }
    });
  }
};

const directives = {
  int,
  float,
  char,
  phone,
  labResult,
  noSS,
  phonenumber
};

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key]);
    });
  }
};
