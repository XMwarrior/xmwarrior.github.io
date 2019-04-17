/*颜色编码转换*/
function showHexcode(num1, num2, num3) { //rgb转16进制
	var arr = [num1, num2, num3];
	hexcode = "#";
	for(i = 0; i < arr.length; i++) {
		var c = "0123456789ABCDEF",
			b = "",
			a = arr[i] % 16;
		b = c.substr(a, 1);
		a = (arr[i] - a) / 16;
		hexcode += c.substr(a, 1) + b
	}
    //console.log(hexcode);
}
function showRGB2(A, B) { //16进制转rgba或rgb[参数限制为字符串——'#000000']
	if(A.substr(0, 1) == "#") A = A.substring(1);
	if(A.length != 6) return alert("请输入正确的十六进制颜色码！")
	A = A.toLowerCase();
	var b = new Array();
	for(i = 0; i < 3; i++) {
		b[0] = A.substr(i * 2, 2)
		b[3] = "0123456789abcdef";
		b[1] = b[0].substr(0, 1)
		b[2] = b[0].substr(1, 1)
		b[20 + i] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
	};
	var color,
		rgb = "rgb(" + b[20] + "," + b[21] + "," + b[22] + ")",
		rgba = "rgba(" + b[20] + "," + b[21] + "," + b[22] + "," + B + ")";
	B == undefined ? color = rgb : B == '' ? color = rgb : color = rgba;
	//console.log(color);
}
