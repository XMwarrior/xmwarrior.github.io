(function() {
    var Event = function(str) {
        return new Event.prototype.init(str);
    };
    var XM=function(dom){
        return new XM.prototype.init(dom);
    };
    Event.prototype = {
        init: function(e) {
            this._event = e ? e : window.event;
            return this;
        },
        preventDefault: function() {
            if (this._event.preventDefault) {
                this._event.preventDefault();
            } else {
                this._event.returnValue = false;
            }
        },
        stopPropagation: function() {
            if (this._event.stopPropagation) {
                this._event.stopPropagation();
            } else {
                this._event.cancelBubble = true;
            }
        }
    };
    XM.prototype = {
        init: function(dom) {
            this._event =  dom;
            return this;
        },
		addHandler:function (prop,fn) {
            if(this._event.addEventListener) {
                if(prop==='mousewheel'&& document.mozFullScreen !== undefined){
                    prop='DOMMouseScroll';
                }
                this._event.addEventListener(prop, fn);
            } else if(this._event.attachEvent) {
                this._event.attachEvent('on' + prop, fn);
            } else {
                this._event['on' + prop] = fn;
            }
        }
    };
    setEventProperty(Event.prototype, 'target', function() {
        return this._event.target || this._event.srcElement;
    });
    setEventProperty(Event.prototype, 'wheelDelta', function() {
        return (this._event.wheelDelta) ? this._event.wheelDelta / 120 : -(this._event.detail || 0) / 3;
    });
    /* 设置对象set方法
     * param {object} obj 对象
     * param {string} prop 方法名称
     * param {function} fn 回调方法
     * */
    function setEventProperty(obj, prop, fn) {
        if (typeof Object.defineProperty === "function") {
            Object.defineProperty(obj, prop, {
                get: fn
            });
        } else {
            obj.__defineGetter__(prop, fn);
        }
    }
    Event.prototype.init.prototype = Event.prototype;
    XM.prototype.init.prototype = XM.prototype;
    window.Event = Event;
    window.XM = XM;
})(window);
//Event 方法 target、preventDefault()、stopPropagation()
$('ul').on('click', function(e) {
    //console.log(Event(e).target);
    //Event(e).preventDefault();
    //Event(e).stopPropagation();
});
//XM mousewheel事件
XM(document).addHandler('mousewheel', function(e) {
  console.log(Event(e).wheelDelta);
});
$('#tabForward input').on('keydown',function (e) {
    console.log(Event(e).target.value.length);
    if($(this).val().length>=4){
        $(this).next('input').focus();
        return;
    }
    if($(this).val().length===0){
        $(this).prev('input').focus();
        return;
    }
});