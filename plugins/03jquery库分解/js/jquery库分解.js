(function(window) {
	var XM = function(str) {
		return new XM.prototype.init(str);
	}
	XM.prototype = {
		init: function(str) {
			var Event = undefined;
			if(!str) {
				//'',underfined,null,false
				Event = this;
			} else if(str.nodeType) {
				//dom对象时
				Event = str;
			} else if(typeof str === 'string') {
				if(!(/\s/g.test(str))) {
					//没包括空格时
					switch(str.charAt(0)) {
						case '#': //id
							Event = document.getElementById(str.slice(1));
							break;
						case '.': //class
							if(document.getElementsByClassName) {
								if(document.getElementsByClassName(str.slice(1)).length === 1) {
									//class唯一
									Event = document.getElementsByClassName(str.slice(1))[0];
								} else {
									//class不唯一
								}
							} else if(document.querySelectorAll) {
								if(document.querySelectorAll(str.slice(1)).length === 1) {
									Event = document.querySelector(str.slice(1));
								} else {
									//class不唯一

								}
							} else { //遍历所有标签
								var eleArr = document.getElementsByTagName('*');
								for(var i = 0, len = eleArr.length; i < len; i++) {
									if(eleArr[i].getAttribute("class") === str.slice(1)) {
										Event = eleArr[i];
									}
								}
							}
							break;
						default: //tagName
							if(/\#|\./g.test(str)) {
								if(document.querySelectorAll(str).length === 1) {
									//tagName+选择符css元素唯一
									Event = document.querySelector(str);
								} else {
									//tagName+选择符css元素不唯一

								}
							} else {
								if(document.getElementsByTagName(str).length === 1) {
									//tagName唯一
									Event = document.getElementsByTagName(str)[0];
								} else {
									//tagName不唯一
								}
							}
							break;
					}
				} else {
					//包括空格时
					var arr = str.split(/\s/);
				}
			} else {
				//不是字符串时
			}
			this._event = Event;
			return this;
		},
		on: function(prop, fn) {
			if(this._event.addEventListener) {
				this._event.addEventListener(prop, fn);
			} else if(this._event.attachEvent) {
				this._event.attachEvent('on' + prop, fn);
			} else {
				this._event['on' + prop] = fn;
			}
		},
		off: function(prop, fn) {
			if(this._event.removeEventListener) {
				this._event.removeEventListener(prop, fn);
			} else if(this._event.detachEvent) {
				this._event.detachEvent('on' + prop, fn);
			} else {
				this._event['on' + prop] = null;
			}
		},
		html: function(html) {
			this._event.innerHTML = html;
		},
		text: function(text) {
			this._event.innerText = text;
		},
		css: function(prop, value) {
			if(arguments.length === 1 && typeof prop === 'object' && !(prop instanceof Array)) { //参数为对象时
				for(var key in prop) {
					var value = typeof prop[key] === Number || !isNaN(Number(prop[key])) ? prop[key] + 'px' : prop[key];
					this._event.style[key] = value;
				}
			}
			if(arguments.length === 2) { //参数为字符串且长度为2时
				value = typeof value === Number || !isNaN(Number(value)) ? value + 'px' : value;
				this._event.style[prop] = value;
			}
		},
		attr:function (prop,value) {
			if(arguments.length === 1 && typeof prop === 'object' && !(prop instanceof Array)) { //参数为对象时
				for(var key in prop) {
					this._event.setAttribute(key,prop[key]);
				}
			}
			if(arguments.length === 2) { //参数为字符串且长度为2时
				this._event.setAttribute(prop,value)
			}
		}
	}
	XM.prototype.init.prototype = XM.prototype;
	window.XM = window.$ = XM;
})(window);