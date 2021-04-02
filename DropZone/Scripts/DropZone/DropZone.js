(function () {
	class Span {
		constructor(displayText, classListOpts, styleOptions) {
			this.element = document.createElement('span');
			this.displayText = displayText;
			this.classListOpts = classListOpts;
			this.styleOpts = styleOptions;
			this.build();
			this.html = this.element;
			return this.html;
		}
		build() {
			let html = this.element;
			if (/<\/?[a-z][\s\S]*>/i.test(this.displayText)) {
				html.innerHTML = this.displayText;
			}
			else {
				html.innerText = this.displayText;
			}
			this.addClasses();
			this.setCss();
		}
		addClasses(classListArray) {
			if (!this.classListOpts && !classListArray) {
				return;
			}
			else if (this.classListOpts) {
				classListArray = this.classListOpts;
			}
			var classArr = (typeof classListArray === 'string')
				? classListArray.split(' ')
				: classListArray;
			classArr.forEach(x => this.element.classList.add(x));
		}
		setCss(styleOptions) {
			if (!this.styleOpts && !styleOptions) {
				return;
			}
			else if (this.styleOpts) {
				styleOptions = this.styleOpts;
			}
			let styleString = '';
			if (styleOptions instanceof Array) {
				for (var style of styleOptions) {
					styleString += `${style};`;
				}
			}
			else if (styleOptions instanceof Object) {
				for (var [key, value] of Object.entries(styleOptions)) {
					if (!isNaN(parseFloat(String(value))) && key != "z-index" && key != "opacity") {
						if (typeof value === 'string') {
							var arr = ["%", "vw", "vh", "em", "px", "ex", "ch", "rem", "lh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "deg", "s"];
							var e = arr.filter(x => String(value).indexOf(x) > -1);
							if (e.length == 0)
								value = parseFloat(value) + 'px';
						}
						else {
							value = parseFloat(String(value)) + 'px';
						}
					}
					styleString += `${key}: ${value};`;
				}
			}
			this.element.style.cssText = styleString;
		}
	}
	class Div {
		constructor(classList, styleOptions) {
			this.element = document.createElement('div');
			this.html = this.element;
			this.build(classList, styleOptions);
			return this.html;
		}
		build(classList, styleOptions) {
			let html = this;
			if (classList)
				html.addClasses(classList);
			if (styleOptions)
				html.setCss(styleOptions);
		}
		addClasses(classList) {
			var classArr = (typeof classList === 'string')
				? classList.split(' ')
				: classList;
			classArr.forEach(x => this.element.classList.add(x));
		}
		setCss(styleOptions) {
			if (!styleOptions) {
				return;
			}
			let styleString = '';
			if (styleOptions instanceof Array) {
				for (var style of styleOptions) {
					styleString += `${style};`;
				}
			}
			else if (styleOptions instanceof Object) {
				for (var [key, value] of Object.entries(styleOptions)) {
					if (!isNaN(parseFloat(value)) && key != "z-index" && key != "opacity") {
						if (typeof value === 'string') {
							var arr = ["%", "vw", "vh", "em", "px", "ex", "ch", "rem", "lh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "deg", "s"];
							var e = arr.filter(x => value.indexOf(x) > -1);
							if (e.length == 0)
								value = parseFloat(value) + 'px';
						}
						else {
							value = parseFloat(value) + 'px';
						}
					}
					styleString += `${key}: ${value};`;
				}
			}
			this.element.style.cssText = styleString;
		}
		highlight() {
			let borderSize = 0.0;
			var highlightEffect = setInterval(() => {
				if (borderSize >= 3) {
					clearInterval(highlightEffect);
					this.unhighlight();
				}
				borderSize += .5;
				this.element.style.border = `solid rgba(255,0,0,1) ${borderSize}px`;
			}, 100);
		}
		unhighlight() {
			var borderSize = 3;
			var highlightEffect = setInterval(() => {
				if (borderSize <= 0) {
					clearInterval(highlightEffect);
					this.element.style.border = "";
					if (this.element.style.length == 0) {
						this.element.removeAttribute('style');
					}
				}
				borderSize -= .5;
				this.element.style.border = `solid rgba(255,0,0,1) ${borderSize}px`;
			}, 100);
		}
		parseScripts(errorMessage) {
			if (!errorMessage) {
				errorMessage = `Couldn't process the scripts when loading the content of the the div ${this.element.className}`;
			}
			let scripts = this.element.getElementsByTagName('script');
			if (scripts.length > 0) {
				try {
					for (var script of scripts) {
						if (script.src != "") {
							if (script instanceof HTMLScriptElement) {
								var insertedjs = script.src.substring(script.src.lastIndexOf("/") + 1);
								if (!document.querySelector(`[data-js-loaded="${insertedjs}"]`)) {
									var newElem = document.createElement('script');
									newElem.src = script.src;
									newElem.dataset.jsLoaded = insertedjs;
									newElem.innerText = script.innerText;
									document.body.append(newElem);
									var tryCount = 0;
									var interval = setInterval(() => {
										try {
											eval(newElem.innerText);
											clearInterval(interval);
										}
										catch (e) {
											tryCount++;
											if (tryCount > 5) {
												clearInterval(interval);
											}
										}
									}, 500);
								}
								else {
									eval(script.innerText);
								}
							}
						}
						else {
							eval(script.innerHTML);
						}
					}
				}
				catch (e) {
					console.warn(errorMessage);
				}
			}
		}
		fadeOut(speed = "normal") {
			this.element.dataset.display = this.element.style.display;
			this.element.dataset.hasOpacity = String(this.element.style.opacity != '');
			var interval = 75;
			if (speed)
				switch (speed) {
					case 'slow':
						interval = 75;
						break;
					case 'normal':
					default:
						interval = 50;
						break;
					case 'fast':
						interval = 25;
						break;
				}
			var fadeEffect = setInterval(() => {
				if (!this.element.style.opacity) {
					this.element.style.opacity = '1';
				}
				if (parseInt(this.element.style.opacity) > 0) {
					this.element.style.opacity = String(parseFloat(this.element.style.opacity) - 0.1);
				}
				else {
					clearInterval(fadeEffect);
					this.element.style.display = 'none';
				}
			}, interval);
		}
	}
	/**The dropzone allows a file input field to be appended to via a droppable area */
	class DropZone {
		/**
		 *
		 * @param {HTMLInputElement} input -Reference to the input element to be used with this class
		 * @param {{}} settings -Settings for the dropzone
		 * defaults = {
				displayText: "Click here or drag and drop an image to upload it here",
				allowMultiple: false,
				allowedFileTypes: ['gif', 'png', 'jpeg', 'jpg'],
				clickToUpload: true,
				initClass: 'da-applied',
				imagesOnly: true,
				maxFiles: 1,
				resetOnUpload: false
			}
		 */
		constructor(input, settings) {
			if (input instanceof HTMLInputElement == false) {
				throw "Input element required.";
			}
			if (input.type != "file") {
				throw "Uploader must be a file type input field.";
			}
			/**The input field this gets applied to */
			this.inputRef = input;
			/**Settins for the dropzone */
			this.settings = settings;
			/**File container to hold all files */
			this.filesForUpload = new DataTransfer();
			/**File types allowed (docs,pdf,excel, etc.) */
			this.fileTypes = ['doc', 'docx', 'xls', 'xlsx', 'csv', 'pdf', 'pptx'];
			/**Image types allowed for upload */
			this.imageTypes = ['gif', 'png', 'jpeg', 'jpg'];
			/**Html reference for the root of the drop zone div */
			this.html = undefined;
			this.defaults = {
				displayText: "Click here or drag and drop a file to upload it here",
				allowMultiple: false,
				allowedFileTypes: ['gif', 'png', 'jpeg', 'jpg'],
				clickToUpload: true,
				initClass: 'da-applied',
				imagesOnly: true,
				maxFiles: 5,
				resetOnDrop: false
			};
			this.build();
		}
		addError(message) {
			if (!message) {
				message = "There has been an error processing this file for upload.";
			}
			let div = new Div('uploadError');
			div.innerText = message;
			this.html.querySelector('.drop-zone-inner-border').append(div);
		}
		addIcons() {
			let appendable = this.html.querySelector('.drop-zone-inner-border');
			//clear all figures from appendable area
			const iconPath = "Scripts/DropZone/icons/";
			appendable.querySelectorAll('figure').forEach(x => x.remove());
			let files = this.filesForUpload.files;
			Array.from(files).forEach(file => {
				let figure = document.createElement('figure');
				let extension = file.name.substr(file.name.lastIndexOf(".") + 1);
				var image = new Image(75, 75);
				figure.append(image);
				figure.addEventListener('contextmenu', () => {
					this.handleRightClick(file, figure);
				});
				switch (extension) {
					case "pdf":
						image.src = iconPath + "pdf-512.png";
						break;
					case 'pptx':
						image.src = iconPath + "pptx-512.png";
						break;
					case 'doc':
					case 'docx':
						image.src = iconPath + "Word-512.png";
						break;
					case 'xls':
					case 'xlsx':
					case 'csv':
						image.src = iconPath + "Excel-512.png";
						break;
					case 'txt':
						image.src = iconPath + "notepad.png";
						break;
					default:
						var fr = new FileReader();
						fr.onload = function () {
							image.src = fr.result;
						}
						fr.readAsDataURL(file)
				}
				let caption = document.createElement('figcaption');
				caption.innerText = file.name;
				figure.append(caption);
				appendable.append(figure);
			});
		}
		/**
		 * Initialize the dropzone variables and set events
		 */
		init() {
			this.setCss();
			if (this.inputRef.hasAttribute('disabled'));
			this.inputRef.removeAttribute('disabled');
			if (!this.settings) {
				this.settings = this.defaults;
			}
			for (var [key, value] of Object.entries(this.defaults)) {
				if (!this.settings[key]) {
					this.settings[key] = value;
				}
			}
			this.settings.allowMultiple = this.inputRef.hasAttribute('multiple');
			if (!this.settings.allowMultiple) {
				this.settings.resetOnDrop = true;
				this.settings.maxFiles = 1;
			}
			if (this.inputRef.hasAttribute('accept')) {
				if (this.settings.allowedFileTypes == this.defaults.allowedFileTypes) {
					this.settings.allowedFileTypes = [];//unspecified as a setting. set to the accept atribute's file types
				}
				var types = this.inputRef.accept.split(',');//remove metadata types
				this.settings.allowedFileTypes = this.settings.allowedFileTypes.concat(types.filter(extension => extension.length <= 5));
				this.settings.allowedFileTypes = [...new Set(this.settings.allowedFileTypes)];
			} else {
				if (!this.settings.imagesOnly && JSON.stringify(this.settings.allowedFileTypes) == JSON.stringify(this.imageTypes)) {
					//user allowed more than images, but didn't specify allowed file types
					this.fileTypes.forEach(x => this.settings.allowedFileTypes.push(x));
				}
			}
			this.html.classList.add(this.settings.initClass);

			window.addEventListener('drop', function (e) { e.preventDefault(); });
			window.addEventListener('dragover', function (e) { e.preventDefault(); });
			//add event handlers
			let events = ['dragenter', 'dragover', 'dragleave', 'drop'];
			let classRef = this;
			events.forEach(event => {
				this.html.addEventListener(event, function (e) {
					e.preventDefault();
					e.stopPropagation();
					switch (event) {
						case 'dragenter':
						case 'dragover':
							classRef.highlight();
							break;
						case 'dragleave':
							classRef.unhighlight();
							break;
						case 'drop':
							classRef.unhighlight();
							classRef.dropHandler(event);
							break;
					}
				});
			});
			if (this.settings.clickToUpload)
				this.clickEvents();
		}
		build() {
			this.html = new Div('drop-zone');
			let border = new Div('drop-zone-inner-border');
			this.html.append(border);
			this.init();
			let input = this.inputRef;
			input.parentElement.insertBefore(this.html, input.parentElement.children[0]);//insert dropzone before the input
			input.style.display = 'none';
			let label = input.parentElement.querySelector('label');
			if (label) {
				label.style.display = 'none';
				if (this.settings.displayText == this.defaults.displayText) {
					this.settings.displayText = `${(this.settings.clickToUpload)
						? "Click here or drag"
						: "Drag"} and drop file${(this.settings.allowMultiple)
							? "s"
							: ""} here for upload`;
				}
			}
			let displayText = new Div('displayText');
			displayText.innerText = this.settings.displayText;
			this.html.querySelector('.drop-zone-inner-border').append(displayText);
		}
		clickEvents() {
			let elem = this.html.querySelector('.drop-zone-inner-border');
			var me = this;
			elem.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				me.inputRef.click();
			});
			elem.addEventListener('contextmenu', () => {
				this.handleRightClick();
			});
			this.inputRef.addEventListener('click', function (e) {
				e.stopPropagation();
			});
			this.inputRef.addEventListener('change', () => {
				this.handleClickUpload(event);
			});
		}
		/**
		 * This makes a custom right-click menu for display when right-clicking an icon or the drop-zone area.
		 * @param {File} [file] - file reference used to remove from the file array if the user chooses to do so
		 * @param {HTMLElement} [figure] - Figure tagged element that will be removed from the DropZone if the user chooses to do so
		 */
		handleRightClick(file, figure) {
			event.preventDefault();
			event.stopPropagation();
			let menu = new Div('drop-zone-contextMenu', { left: `${event.clientX - 10}px`, top: `${event.clientY - 10}px` });
			if (file) {
				let removeItem = new Span('Remove');
				removeItem.addEventListener('click', () => {
					event.stopPropagation();
					Array.from(this.filesForUpload.files).forEach((ref, index) => {
						if (ref.name == file.name) {
							this.filesForUpload.items.remove(index);
							if (this.filesForUpload.items.length == 0) {
								this.html.style.height = '100px';
							}
						}
					});
					this.inputRef.files = this.filesForUpload.files;
					if (this.filesForUpload.length == 0) {
						this.inputRef.removeAttribute('value');
					}
					figure.remove();
					menu.remove();
				});
				menu.append(removeItem);
			}
			if (!figure) {
				figure = event.target;
			}
			let clearAll = new Span('Clear All');
			clearAll.addEventListener('click', () => {
				event.stopPropagation();
				this.filesForUpload.clearData();
				this.inputRef.files = new DataTransfer().files;
				this.inputRef.removeAttribute('value');
				figure.parentElement.querySelectorAll('figure').forEach(item => item.remove());
				this.html.style.height = '100px';
				menu.remove();
			});
			menu.append(clearAll);
			figure.parentElement.insertBefore(menu, figure.parentElement.children[0]);
			let timeout = 0;
			menu.addEventListener('mouseleave', () => {
				timeout = setTimeout(() => { //add a quarter-second delay before removing the menu from DOM
					menu.remove();
				}, 250);
			});
			menu.addEventListener('mouseEnter', () => {
				if (timeout != 0) {
					clearTimeout(timeout); //cancel closing the menu.
					timeout = 0;
				}
			});
		}
		handleClickUpload(e) {
			event.preventDefault();
			event.stopPropagation();
			let dt = e.target;
			let files = dt.files;
			this.handleFiles(files);
		}
		/**
		 * Hande the dropped file and event
		 */
		dropHandler() {
			let files = event.dataTransfer.files;
			if (!this.settings.allowMultiple)
				if (files.length > this.settings.maxFiles) {
					this.addError(`Cannot upload this many files. Only ${this.settings.maxFiles} files are allowed to be uploaded at a time.`);
					return false;
				}
			this.reset(true);
			this.inputRef.files = files;
			const e = new Event("change");
			this.inputRef.dispatchEvent(e);
		}
		fileTypeCheck(file) {
			let extension = file.name.toLowerCase().split('.');
			extension = extension[extension.length - 1];
			let allowed = true;
			if (this.settings.allowedFileTypes.indexOf(`.${extension}`) >= 0 || this.settings.allowedFileTypes.indexOf(extension) >= 0) {
				return allowed;
			} else {
				return !allowed;
			}
		}
		/**
		 * Check the filesForUpload.files array for the uploaded file.  if a file with the same name exists, remove it. Add the file to the array.
		 * @param {File} file - new file to add to the filesForUpload.files filelist.
		 */
		checkFile(file) {
			var upldFileArray = Array.from(this.filesForUpload.files);
			upldFileArray.forEach((existing, i) => {
				if (existing.name == file.name) {
					this.filesForUpload.items.remove(i);
				}
			});
			this.filesForUpload.items.add(file);
		}
		handleFiles(files) {
			this.reset(true);
			if (this.settings.allowMultiple) {
				if (files.length > this.settings.maxFiles || (this.filesForUpload.files.length + files.length > this.settings.maxFiles)) {
					this.addError(`Cannot upload this many files. Only ${this.settings.maxFiles} files are allowed to be uploaded at a time.`);
					return false;
				}
				Array.from(files).forEach(file => {
					if (this.fileTypeCheck(file)) {
						this.checkFile(file);
					} else {
						this.addError(`${file.name} is not an allowed file type. Only the following file type(s) are allowed: ${this.settings.allowedFileTypes.toString()}`);
					}
				});
			} else if (this.settings.allowMultiple == false && files.length == 1) {
				if (!this.fileTypeCheck(files[0])) {
					this.addError(`${files[i].name} is not an allowed file type. Only the following file type(s) are allowed: ${this.settings.allowedFileTypes.toString()}`);
				}
				else {
					this.checkFile(files[0]);
				}
			} else {
				this.addError('Only one file allowed to be uploaded');
				return;
			}
			this.addIcons();
			this.inputRef.files = this.filesForUpload.files;
		}
		highlight() {
			this.html.classList.add('highlight');
		}
		reset(newDrop = false) {
			if (this.filesForUpload instanceof DataTransfer == false) {
				this.filesForUpload = new DataTransfer();
			}
			let errorMessage = this.html.querySelectorAll('.uploadError');
			if (errorMessage) {
				errorMessage.forEach(x => x.remove());
			}
			this.html.style.height = '100%';
			if ((newDrop && this.settings.resetOnDrop) || !newDrop) {
				let figures = this.html.querySelectorAll('figure');
				if (figures) {
					figures.forEach(x => x.remove());
				}

				this.filesForUpload.clearData();
				this.inputRef.files = this.filesForUpload.files;
			}
		}
		setCss() {
			let style = document.querySelector('head').querySelector('#dropAreaCss');
			if (!style) {
				style = document.createElement('style');
				document.querySelector('head').append(style)
				style.id = "dropAreaCss";
				style.type = "text/css";
			} else { return; }
			let target = this.inputRef;
			var noColor = getComputedStyle(target).backgroundColor.replace(/\s+/g, '').match(/(rgba\(0,0,0,0\))|(rgb\(0,0,0\))/g);
			try {
				while (noColor) {
					target = target.parentElement;
					noColor = getComputedStyle(target).backgroundColor.replace(/\s+/g, '').match(/(rgba\(0,0,0,0\))|(rgb\(0,0,0\))/g);
				}
			} catch (e) {
				noColor = false;
			};
			var backgColor = getComputedStyle(target).backgroundColor;
			var textColor = getComputedStyle(target).color;
			if (!backgColor || noColor) {
				backgColor = "rgba(220,220,220,1)";
			}
			if (!textColor || noColor) {
				textColor = "rgba(33,33,33,1)";
			}
			let css = `.drop-zone{width:100%;height:100px; background-color:${this.whiteShift(backgColor, 10, .8)};padding:5px; min-width:200px; min-height:100px; padding:5px}
.drop-zone.highlight{background-color:${this.whiteShift(backgColor, 90, 1)};color:${this.whiteShift(textColor, -10, 1)};}
.drop-zone .drop-zone-inner-border{border:dashed ${this.whiteShift(backgColor, 30)} 2px;height:100%; display:flex;align-items:center; flex-flow:wrap; gap:15px;}
.drop-zone .drop-zone-inner-border:hover{cursor:pointer;background-color:${this.whiteShift(backgColor, 10)};color:${this.whiteShift(textColor, -10)};}
.drop-zone .drop-zone-inner-border figure{max-width:250px; word-break:break-all;padding:5px;box-shadow:0 0 5px rgba(0,0,0,.5);margin:15px;}
.drop-zone .displayText{ width:100%;color:${this.whiteShift(textColor, -10, .9)}}
.drop-zone .uploadError{color:red; width:100%;}
.drop-zone .drop-zone-contextMenu{z-index: 999999999;background-color:${this.whiteShift(backgColor, 10, 1)};color:${this.whiteShift(textColor, -10, 1)};position:fixed; border-radius:15px; padding:10px; border-color:${this.whiteShift(textColor, -90, 1)}; border:solid 1px;}
.drop-zone .drop-zone-contextMenu > span{display:block; width:100%; padding-left:10px; padding-right:10px; border-radius:5px;}
.drop-zone .drop-zone-contextMenu > span:hover{background-color:${this.whiteShift(backgColor, 45, 1)};color:${this.whiteShift(textColor, -5, 1)};cursor:pointer;}`;
			style.append(document.createTextNode(css));
		}
		unhighlight() {
			this.html.classList.remove('highlight');
		}
		whiteShift(rgbString, shiftStrength = 20, alphaOverride) {
			if (!rgbString) {
				return;
			}
			if (shiftStrength == 100) {
				return 'rgb(255,255,255)';
			}

			let [r = 0, g = 0, b = 0, a = 1] = rgbString.replace(/(rgb\()|((rgba\())|(\))|\s+/g, '').split(',').map(x => +x);
			let bgColor = toHSLA(r, g, b, a);
			var val = parseInt(bgColor[2]) + (shiftStrength * parseInt(bgColor[2]) / 100);
			bgColor[2] = val < 100 ? `${val}%` : '100%';
			let needReplace = `${rgbString.match(/(rgb\()|((rgba\())/)[0]}${bgColor.join(',')})`;
			return needReplace.replace(/rgb|rgba/g, 'hsla');
		}
	}
	function toHSLA(r, g, b, a) {
		let hslArr = [0, '0%', '0%', '0%'];
		r /= 255;
		g /= 255;
		b /= 255;
		a *= 100;
		let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
		if (delta == 0)
			h = 0;
		else if (cmax == r)
			h = ((g - b) / delta) % 6;
		else if (cmax == g)
			h = (b - r) / delta + 2;
		else
			h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		if (h < 0)
			h += 360;
		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		hslArr = [h, s + '%', l + '%', a + '%'];
		return hslArr;
	}
	window.DropZone = function (input, settings) {
		return new DropZone(input, settings);
	};
	HTMLInputElement.prototype.dropZonify = function (settings) {
		return new DropZone(this, settings);
	};
	HTMLFormElement.prototype.dropZonify = function (settings) {
		this.querySelectorAll('input[type="file"]').forEach((x) => new DropZone(x, settings));
	};
})();