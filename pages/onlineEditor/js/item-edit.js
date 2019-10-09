var htmlEditor, cssEditor, jsEditor;
var data = {
	"html": "",
	"css": "",
	"js": ""
};
//init monaco
require.config({
	paths: {
		'vs': 'monaco-editor/min/vs',
		'jquery': 'js/jquery.1.8.3.min'
	},
	'vs/nls': {
		availableLanguages: {
			'*': 'zh-cn'
		}
	}
});
getData();
createEditor(data);
$('.icon-run').on('click', function() {
	GetEditorValue();
});
$(document).on('keydown', function(e) {
	if(e.ctrlKey && e.keyCode === 83) {
		GetEditorValue();
	}
	return false;
});
//拖拽宽度
var canResize1 = false;
var canResize2 = false;
var $panelLeft = $('.x-col2'),
	$panelMiddle = $('.x-col4'),
	$panelRight = $('.x-col6');
$('.m-handler').on('mousedown', function() {
	$(this).is('#mHandler1') ? canResize1 = true : canResize2 = true;
});
$(document).on('mousemove', function(e) {
	(canResize2 || canResize1) && $('#viewContainer').html('');
	var rightPanelWidth;
	if(canResize2) {
		var middlePanelWidth = e.pageX - $panelLeft.outerWidth() - 30;
		rightPanelWidth = $(window).innerWidth() - e.pageX - 36;
		(middlePanelWidth >= 130 && rightPanelWidth >= 130) && ($panelMiddle.width(middlePanelWidth), $panelRight.width(rightPanelWidth));
	}
	if(canResize1) {
		var leftPanelWidth = e.pageX - 30;
		rightPanelWidth = $(window).innerWidth() - $panelMiddle.outerWidth() - e.pageX - 36;
		(leftPanelWidth >= 288 && rightPanelWidth >= 130) && ($panelLeft.width(leftPanelWidth), $panelRight.width(rightPanelWidth));
	}
}).on('mouseup', function() {
	if(canResize1 || canResize2) {
		canResize1 = false;
		canResize2 = false;
		GetEditorValue();
	}
});

function getData() {
	var viewPath = location.search.split('path=')[1];
	$.ajax({
		url: viewPath,
		type: 'get',
		dataType: 'html',
		async: false,
		success: function(r) {
//			console.log(r);
			data = {
				"html": r.split('<body id="html">')[1].split('</body>')[0],
				"css": r.split('<style id="style" type="text/css">')[1].split('</style>')[0],
				"js": r.split('<script id="script" type="text/javascript">')[1].split('</script>')[0]
			};
		},
		error: function(r) {
			console.log(r);
		}
	});
}

function createEditor(data) {
	if(!data) {
		return;
	}
	require(['vs/editor/editor.main'], function() {
		htmlEditor = monaco.editor.create($('#htmlContainer')[0], {
			value: data.html || '',
			language: 'html',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		cssEditor = monaco.editor.create($('#cssContainer')[0], {
			value: data.css || '',
			language: 'css',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		jsEditor = monaco.editor.create($('#jsContainer')[0], {
			value: decode(data.js) || '',
			language: 'javascript',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		setTimeout(function() {
			htmlEditor.updateOptions({
				lineNumbers: "on"
			});
			cssEditor.updateOptions({
				lineNumbers: "on"
			});
			jsEditor.updateOptions({
				lineNumbers: "on"
			});
		}, 2000);
		doRun();
	});
}

function reCreateEditor() {
	$("#htmlContainer").children().remove();
	$("#cssContainer").children().remove();
	$("#jsContainer").children().remove();
	createEditor(data);
}
//获取代码
function GetEditorValue() {
	data = {
		html: htmlEditor.getValue(),
		css: cssEditor.getValue(),
		js: encode(jsEditor.getValue())
	}
	reCreateEditor();
}

function doRun() {
	var $viewContainer = $('#viewContainer');
	var iframeHtml = '<iframe id="iframeView" class="m-viewContainer" src="run.html"></iframe>';
	$viewContainer.html(iframeHtml);
	var $iframe = $('#iframeView');
	$iframe.on('load.iframe', function() {
		$iframe[0].contentWindow.load(jsEditor.getValue(), htmlEditor.getValue(), cssEditor.getValue());
		$iframe.off('load.iframe');
	});
}

function encode(string) {
	return string.replace(/\'/g, '%27').replace(/\"/g, '%22');
}

function decode(string) {
	return string.replace(/%27/g, "'").replace(/%22/g, '"');
}