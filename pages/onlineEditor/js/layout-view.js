var pageid = RoadUI.Core.query("pageid");
var type = getLayout();
var layoutOption;
var totalLayoutData;
var layoutData = getLayoutData(pageid);
var isHasType = false;
if (layoutData && layoutData.layoutData) {
    totalLayoutData = JSON.parse(layoutData.layoutData);
    layoutOption = totalLayoutData.filter(function (item) {
        return item.type === type;
    })[0];
    layoutOption && (isHasType = true);
}
var testList = getItemMenu(pageid);
var testLayout = layoutOption ? mergeData() : [];
Vue.config.debug = true;
Vue.config.devtools = true;

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

var view=new Vue({
    el: '#app',
    components: {
        "GridLayout": GridLayout,
        "GridItem": GridItem
    },
    data: {
        layout: testLayout,
        draggable: false,
        resizable: false,
        editable: false,
        showItemList: false,
        itemList: testList,
        index: 0,
        rowheight: window.innerHeight / 101,
        eleDrag: null,
        cssLists: [],
        screenWidth: document.body.clientWidth
    },
    mounted: function () {
        var that = this;
        this.layout.forEach(function (item) {
            that.index = Math.max(that.index, +item.i);
        });
        this.index++;

        that.initLayout();

        $(window).on('resize', function () {
            that.screenWidth = document.body.clientWidth;
            var curType = getLayout();
            if(type !== curType)
            {
                type = curType;
                that.initLayout();
            }

        });
    },
    updated: function () {
        //this.importCssJs();
    },
    methods: {
        initLayout : function() {
            this.importCssJs();
            layoutOption = totalLayoutData.filter(function (item) {
                return item.type === type;
            })[0];
            testList = getItemMenu(pageid);
            testLayout = layoutOption ? mergeData() : [];
            //console.log(testList);
            //console.log(testLayout);
            this.layout = testLayout;
            this.itemList = testList;
        },

        importCssJs: function () {
            //引用js
            var self = this;
            var hasCssLists = this.layout.filter(function (item) {
                if (item.js) {
                    setTimeout(function () {
                        eval(decode(item.js));
                    }, 0);
                }
                return item.css;
            });
            //引用css
            if (hasCssLists.length) {
                hasCssLists.forEach(function (item) {
                    var style;
                    if (self.cssLists.length) {
                        var isExist = self.cssLists.some(function (itemin) {
                            return itemin === item.id;
                        });
                        if (!isExist) {
                            self.cssLists.push(item.id);
                            style = document.createElement("style");
                            style.type = "text/css";
                            style.setAttribute('class', 'custom-' + item.id);
                            style.innerHTML = item.css;
                            document.head.appendChild(style);
                        }
                    } else {
                        self.cssLists.push(item.id);
                        style = document.createElement("style");
                        style.type = "text/css";
                        style.setAttribute('class', 'custom-' + item.id);
                        style.innerHTML = item.css;
                        document.head.appendChild(style);
                    }
                });
            } else {
                self.cssLists = [];
                $('style[class^="custom-"]').remove();
            }
        },
        removeItem: function (itemindex, content) {
            console.log(content);
            if (content) {
                alert('请先移除内容！');
            } else {
                this.layout.splice(itemindex, 1);
            }
        }
    }
});
function getItemMenu(pageid) {
    var res;
    $.ajax({
        url: '../../BIDashBoard/GetPageLayoutItemList',
        type: 'get',
        data: { pageId: pageid },
        dataType: 'json',
        async: false,
        success: function (r) {
            //console.log(r);
            res = r;
        },
        error: function (r) {
            console.log(r);
        }
    });
    return res;
}
function getLayoutData(pageid) {
    var res;
    $.ajax({
        url: '../../BIDashBoard/GetPageLayout',
        type: 'post',
        data: { id: pageid },
        dataType: 'json',
        async: false,
        success: function (r) {
            //console.log(r);
            res = r;
        },
        error: function (r) {
            console.log(r);
        }
    });
    return res;
}

function deepCopy(o) {
    var n;
    var i;
    if (o instanceof Array) {
        n = [];
        for (i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else if (o instanceof Function) {
        n = new Function("return " + o.toString())();
        return n;
    } else if (o instanceof Object) {
        n = {};
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                n[i] = deepCopy(o[i]);
            }
        }
        return n;
    } else {
        return o;
    }
}

function mergeData() {
    var datas = deepCopy(layoutOption.layouts);
    datas.forEach(function (item) {
        testList.forEach(function (itemin, index) {
            if (item.itemid === itemin.id) {
                item = Object.assign(item, itemin);
                testList.splice(index, 1);
            }
        });
    });

    return datas;
}
function decode(string) {
    return string.replace(/%27/g, "'").replace(/%22/g, '"');
}
function getLayout() {
    var pageId;
    var screenWidth= window.innerWidth;
    switch (true) {
        case screenWidth <= 1920 && screenWidth >= 1366:
            pageId = 0;
            break;
        case screenWidth < 1366:
            pageId = 1;
            break;
        default:
            pageId = 0;
            break;
    }
    return pageId;
}