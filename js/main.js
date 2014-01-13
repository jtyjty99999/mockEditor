var $document = $(document);

//文件另存为

$('#myModal').on('shown.bs.modal', function (e) {

	ZeroClipboard.setDefaults({
		moviePath : 'js/ZeroClipboard.swf'
	});
	//剪贴板
	var clip = new ZeroClipboard($("#copy")[0]);
	//clip.setText(222)
	//复制成功：
	clip.addEventListener("complete", function () {
		alert("复制成功！");
	});
	$document.delegate('#copy', 'click', function () {

		var text = $('#generatedUrl').val();
		clip.setText(text);

	})

})

var container = document.getElementById("jsoneditor");
var editor = new jsoneditor.JSONEditor(container);
editor.setMode('code');

var fomattedFlag = false;

$document.delegate('#formatJson', 'click', function () {

	if (fomattedFlag) {
		//已经格式化后，切换到代码方式
		editor.setMode('code');
		fomattedFlag = false;
		$(this).text('格式化')

	} else {
		var json = editor.getText();
		try {
			var jsonObj = JSON.parse(json);
		} catch (e) {
			alert('数据格式不合法');
			return
		}

		editor.set(jsonObj);
		editor.setMode('tree')
		editor.expandAll();
		fomattedFlag = true;

		$(this).text('还原');

	}

})

$document.delegate('#export', 'click', function () {

	var json = editor.get();
	var blob = new Blob([JSON.stringify(json)], {
			type : "text/plain;charset=utf-8"
		});
	saveAs(blob, "data.json");

})

$document.delegate('#clear', 'click', function () {

	editor.setMode('code');
	editor.setText('');
	$('#formatJson').text('格式化');

})

$document.delegate('#createUrl', 'click', function () {
	var data = editor.getText();

	generateUrl(data);

})

function handle(instance, changeObj) {
	var tpl;
	try {
		tpl = instance.getText()
			tpl = tpl.replace(/^([\r\n]*)/i, '')
			.replace(/([\r\n]*$)/i, '')
			if (/^\s*[\[\{\(]/.test(tpl)) {
				tpl = new Function('return ' + instance.getText());
				tpl = tpl()
			}
	} catch (error) {
		console.error(error.stack);
		tpl = error.toString()
	}
	var data = Mock.mock(tpl)
		editor.set(data);
	return handle
}

var sourceContainer = document.getElementById("sourceEditor");
var sourceEditor = new jsoneditor.JSONEditor(sourceContainer);
sourceEditor.setMode('code');

$document.delegate('#runJson', 'click', function () {

	handle(sourceEditor);

})

$document.delegate('#clearTpl', 'click', function () {

	if (confirm("确定要清空数据模板吗？")) {
		sourceEditor.setText('');
	}

})

$document.delegate('#savefile', 'click', function () {
	var name = $('#fileName').val() || +new Date();
	var content = sourceEditor.getText();
	fs.writeFile('./historyTpl/' + name + '.tpl', content, function (err) {
		if (err)
			throw err;
		alert('保存成功！');
	});

	/*
	var name = 'hello';
	var tpl = sourceEditor.getText();
	var blob = new Blob([tpl], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "data.json");

	 */

})

$document.delegate('#historyTpl', 'click', function () {

	var dir = process.cwd() + '\\historyTpl';

	fs.readdir(dir, function (error, files) {
		if (error) {
			console.log(error);
			window.alert(error);
			return;
		}

		$('#showHistoryTplModal').modal('show')

		var fileList = ' <ul class="list-group">' +
			'{@each list as it}' +
			'<li class="list-group-item fileList">' +
			'<span class="badge">${it.path}</span>' +
			'${it.file}' +
			'</li>' +
			'{@/each}' +
			'</ul>'

			var data = {
			list : []
		};

		for (var i = 0; i < files.length; ++i) {
			console.log(files[i])
			data.list.push({
				file : files[i],
				path : path.join(dir, files[i])
			})
		}
		var html = juicer(fileList, data);
		$('#historyFiles').html(html);

	});

});

$document.delegate('.fileList', 'dblclick', function () {

	var path = $(this).find('.badge').text();

	fs.readFile(path, 'utf-8', function (err, data) {
		if (err) {
			console.error(err);
		} else {
			$('#showHistoryTplModal').modal('hide');

			sourceEditor.setText(data);

		}

	});

});

function generateSingleData(type) {}

var fileData = {
	text1 : 'ababc',
	text2 : 'ababd'
};

//阻止默认滚动
window.ondragover = function (e) {
	e.preventDefault();
	return false
};
window.ondrop = function (e) {
	e.preventDefault();
	return false
};
//让jq事件对象支持拖拽
$.event.props.push('dataTransfer');

$('#file1,#file2').on('dragover', function () {
	$(this).addClass('hover');
	return false;
}).on('dragend dragcancel', function () {
	$(this).removeClass('hover');
	return false;
}).on('drop', function (e) {
	console.log(e)
	var files = e.dataTransfer.files,
	$this = $(this);

	$.each(files, function (index, file) {

		var reader = new FileReader();

		reader.onload = function (e) {

			if (files.length >= 2) {

				fileData['text' + (index + 1)] = e.target.result;

			} else {
				if ($this.is('#file1')) {
					fileData.text1 = e.target.result;
					// $('#fileInfo1').text(file.path);
				} else {
					fileData.text2 = e.target.result;
					//  $('#fileInfo2').text(file.path);
				}
			}

			doDiff(fileData.text1, fileData.text2);

		}

		reader.readAsText(file, 'utf8');

	});

	return false;
});

function doDiff(text1, text2) {

	var lines1 = text1.split('\n');
	var lines2 = text2.split('\n');

	var editedLines1 = [],
	editedLines2 = [];

	var linesEditProgress = getEditProgress(lines1, lines2);

	linesEditProgress.forEach(function (progressItem) {

		switch (progressItem.type) {

		case 'copy':

			editedLines1[progressItem.position1] = {
				class : "copy",
				text : progressItem.target1
			};
			editedLines2[progressItem.position2] = {
				class : "copy",
				text : progressItem.target2
			};

			break;

		case 'replace':

			editedLines1[progressItem.position1] = {
				class : "replace",
				text : progressItem.target1
			};
			editedLines2[progressItem.position2] = {
				class : "replace",
				text : progressItem.target2
			};

			break;

		case 'delete':

			editedLines1[progressItem.position1] = {
				class : "delete",
				text : progressItem.target1
			};
			editedLines2[progressItem.position2] = {
				class : editedLines2[progressItem.position2] && editedLines2[progressItem.position2].class || "copy",
				text : (editedLines2[progressItem.position2] && editedLines2[progressItem.position2].text || progressItem.target2)
				 + '<br />'
			};

			break;

		case 'insert':

			editedLines1[progressItem.position1] = {
				class : editedLines1[progressItem.position1] && editedLines1[progressItem.position1].class || "copy",
				text : (editedLines1[progressItem.position1] && editedLines1[progressItem.position1].text || progressItem.target1)
				 + '<br />'
			};

			editedLines2[progressItem.position2] = {
				class : "insert",
				text : progressItem.target2
			};

			break;
		}

	});

	showFileContent(editedLines1, editedLines2);

}

function showFileContent(file1, file2) {

	if (typeof file1 === 'string') {
		file1 = file1.split('\n');
	}
	if (typeof file2 === 'string') {
		file2 = file2.split('\n');
	}

	if (file1) {

		$('#file1').html(file1.map(mapStyledLines).join(''));

	}

	if (file2) {

		$('#file2').html(file2.map(mapStyledLines).join(''));

	}

	function mapStyledLines(editedLine) {

		if (typeof editedLine === 'object') {
			return '<li class="' + editedLine.class + '"><span>' + editedLine.text.replace(/<br ?\/?>/g, '_@@br@@_').replace(/</g, '&lt;').replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/_@@br@@_/g, '</span><br /><span class="blank">') + '</span></li>';
		} else {
			return editedLine;
		}

	}
}