//构成系统的各种组件
const componentsData = {
	//配置
	settings: {
		//桌面
		display: {
			id: 'display',
			name: '桌面设置',
			description: "Responsable for managing background",
			icon: "settings",
			launchbar: true,
			windowClass: ["desktop-settings", "window-light-blue"],
			maxProc: 1,
			//关联的组件
			relationship: {
				window: 'windowManager',
			}
		},
		desktopManager: {
			id: "dsktpmngr",
			name: "Properties",
			description: "Responsable for create, arrange icons, send data to context menu",
			icon: "fullscreen_1",
			maxProc: 20,
			container: '.desktop-container',
			launchbar: true,
			windowClass: ["file-properties", "window-light-blue"],
			relationship: {
				datasource: 'fileSystem',
				menu: 'contextMenu',
				display: 'display',
				clipboard: 'virtualClipboard',
				explorer: 'fileExplorer',
				window: 'windowManager',
			}
		},
		fileExplorer: {
			id: "flxplrr",
			name: "File Explorer",
			description: "Responsable for browsing in directories",
			windowClass: ["file-explorer", "window-light-blue"],
			windowSize: {
				minW: 200,
				minH: 200,
			},
			icon: "folder",
			taskbar: true,
			randomPosition: true,
			maxProc: 20,
			relationship: {
				desktop: 'desktopManager',
				window: 'windowManager',
				datasource: 'fileSystem'
			},
		},
		startMenuManager: {
			id: "strtmnmngr",
			name: "Start Menu",
			description: "Responsable for start menu",
			icon: "",
			label: "Start",
			placeholder: ".start-menu-button",
			maxProc: 1,
			relationship: {
				datasource: 'fileSystem'
			}
		},
		fileSystem: {
			id: "flsstm",
			name: "File System",
			description: "Responsable for file & folder crud (json data manipulation)",
			icon: "",
			maxProc: 1,
			relationship: {
				desktop: 'desktopManager',
				startmenu: 'startMenuManager',
			},
			database: './vfs.json',
		},
		contextMenu: {
			id: "cntxtmn",
			name: "Right Click Menu",
			description: "Responsable for create right click menu from array",
			icon: "",

			className: 'contextMenu',
			maxProc: 1,
		},
		windowManager: {
			id: "wndwmngr",
			name: "Window Manager",
			description: "Responsable for handle the windows",
			icon: "",
			maxProc: 1,
			contentSelector: '.content',
			relationship: {
				task: 'taskManager',
			}

		},
		virtualClipboard: {
			id: "vrtlclpbrd",
			name: "Clipboard",
			description: "Responsable for register item/items in virtual clipboard",
			icon: "",
			maxProc: 1,
		},
		taskManager: {
			id: "tskmngr",
			name: "任务管理器",
			description: "Responsable for managing the taskbar",
			icon: "taskmanager",
			launchbar: true,
			focusClass: "active",
			windowClass: ["system-manager", "window-light-blue"],
			group: ".task-win-group",
			container: ".task-win-container",
			maxProc: 1,
			relationship: {
				datasource: 'fileSystem',
				window: 'windowManager',
			}
		},
		clockManager: {
			id: "clkmngr",
			name: "System Clock",
			description: "Responsable for keep time realated parts like right side clock",
			icon: "",
			taskbar: true,
			maxProc: 1,
			showUI: true,
			placeholder: "time#clock",
		},


	},
	// `<div class="desktop-details">
	//                         <h1>背景</h1>
	//                         <div class="desktop-previews"></div>
	//                         <h3>选择图片</h3>
	//                         <div class="img-container">
	//                             <img><img/>
	//                         </div>
	//                         <button>浏览</button>                                                        
	//                     </div>`;   
	//相关函数
	methods: {
		display(settings, shared = false) {
			const { components } = shared,
				{ window } = settings.relationship,
				cName = settings.constructorName,
				bgImg = document.querySelector('.bg-img'),
				template = {
					window() {
						const s = screen,
							b = document.body,
							d = document.querySelector('.desktop-container'),
							c = configs;
						return `<div class="desktop-details">
                                    <h1>背景</h1>
                                    <div class="desktop-previews">
                                      <div class="mini-previews"></div>
                                    </div>
                                    <p>选择图片</p>
                                    <div class="img-container">
                                    
                                    <img src="assets/background/th.jpg">
                                    <img src="assets/background/th1.jpg">
                                    <img src="assets/background/th2.jpg">
                                    <img src="assets/background/th3.jpg">
                                    <img src="assets/background/th4.jpg">
                                                                        
                                    </div>
                                    <button>浏览</button>                                                        
                                </div>`;
					},
					background(configs) {
						const { bgImage, bgRepeat, bgPosition } = configs;

						if (!bgImage) return "";
						return `url("assets/background/${bgImage}") ${bgRepeat} ${bgPosition}`
					}
				}

			let configs,
				windows = null,
				inputs = null,
				previewImg,
				previewCol
			function loadconfigs() {
				configs = {
					"bgHeight": "100",
					"bgImage": "th.jpg",
					"bgOpacity": "100",
					"bgPosition": "center center",
					"bgRepeat": "no-repeat",
					"bgWidth": "100",
					"colDegree": "135",
					"colOpacity": "0",
					"endColor": "#ffffff",
					"startColor": "#0000ff"
				}
			}
			function backgroundChanges(e1, e2, settings) {
				//e1 主题设置的窗口  e2桌面背景

				e1.style.background = template.background(settings)
				e1.style.backgroundSize = `cover`
				if (e2) {
					e2.style.background = template.background(settings)

					e2.style.backgroundSize = `cover`
				}

			}
			function _init() {

				loadconfigs();
				backgroundChanges(bgImg, e2 = null, configs)
			}
			_init()
			//启动和关闭函数
			function start(e, ev) {
				ev.preventDefault()
				if (windows) { return }
				let win = createNewWindow();
				if (!win) {
					return console.log("Failed to create new window!");
				}


				win.body.innerHTML = template.window()
				windows = win;
				previewImg = win.dom.querySelector(`.mini-previews`);
				previewImg.style.background = bgImg.style.background
				imgs = windows.dom.querySelectorAll("img");
				for (let index = 0; index < imgs.length; index++) {
					imgs[index].addEventListener('click', applyChanges);
				}
			}

			function close() {
				windows = null
			}

			function applyChanges() {

				const imgsrc = this.src.substring(this.src.indexOf('background'), this.src.length).split('/')[1];
				const settings = {
					bgImage: imgsrc,
					bgRepeat: configs.bgRepeat,
					bgPosition: configs.bgPosition,
				}

				backgroundChanges(bgImg, previewImg, settings)

			}
			function createNewWindow() {
				const options = {
					data: false,
					appClass: settings.windowClass,
					title: settings.name,
					source: settings.constructorName,
					icon: settings.icon
				};

				return components[window].register(options)
			}
			return {
				launch(e, ev) {
					start(e, ev)
				},
				close(e) {
					close(e)
				}
			}

		},
		contextMenu(settings, shared = false) {

			id = 'contextmenu_' + Date.now();
			let dom;
			function init() {
				dom = document.createElement('div')
				dom.classList.add(settings.className)
				dom.setAttribute('tabindex', '-1')
				dom.style.width = '200px'
				dom.textContent = ''
				dom.id = id

				document.body.appendChild(dom)
				dom.addEventListener('blur', blurEvent)
				dom.onclick = () => { setTimeout(blurEvent, 100) }
			}
			function blurEvent() {
				dom.classList.remove('show')
			}
			function moveContextMenu(e) {
				const px = e.pageX
				py = e.pageY
				cx = dom.offsetWidth
				cy = dom.offsetHeight
				wx = document.body.clientWidth
				wy = document.body.clientHeight
				desktopdom = document.querySelector('#desktop')
				if (py > desktopdom.offsetHeight - cy) {

					dom.style.top = (py - cy) + 'px'
				} else {
					dom.style.top = py + 'px';
				}


				dom.style.left = ((px + cx > wx) ? (wx - cx > 0 ? wx - cx : 0) : px) + 'px';
				dom.classList.add('show');
				dom.focus();

			}
			function populateContextMenu(list, id) {
				let str = "";
				while (dom.firstChild) { dom.removeChild(dom.firstChild) };
				if (list) {
					const ul = document.createElement('ul');
					ul.dataset.id = id;
					for (let row of list) {
						str = `data-click="${row[1]}.${row[2]}." data-extra = "${row[3].join('/')}"`;
						if (!row[1]) {
							str += ` class="disabled"`;
						}
						ul.insertAdjacentHTML('beforeend', `<li ${str}>${row[0]}</li>`);
					}
					dom.appendChild(ul);
				}
			}

			init()
			return {
				getID() {
					return dom.id || false
				},
				create(e, list, id) {
					populateContextMenu(list, id)
					moveContextMenu(e)
					e.preventDefault();

				}
			}
		},
		desktopManager(settings, shared = false) {
			const defaultContainer = document.querySelector(settings.container),
				{ guid, components, getPath, assoc, sec2Date } = shared,
				cName = settings.constructorName,
				relationship = settings.relationship,
				{ datasource, window, display } = relationship,
				template = {
					tooltip(item) {
						return `ID: ${item.id}&#013Description: ${item.description}&#013;`;
					},
					propertiesWrapper(p) {
						let lis;
						const prop = p.map(e => template.propertiesLine(e)).join('');
						return `<div class="file-info">
						${prop}
						</div>`
					},
					propertiesLine(e) {
						const padding = "".padStart(5, "&nbsp;");
						return `<p><b>${e[0]}:</b> ${padding}</p><p>${e[1]}</p>`
					},
					properties(item) {
						const info = [
							["ID", item.id],
							["Type", item.type],
							["Open with", assoc[item.type] || "Unknown"],
							["Status", item.readonly ? "readonly" : "writeable"]
						];
						if (item.child && item.child.length) {
							info.push(["Content", `${item.child.length} file(s) or folder(s)`]);
						}
						info.push(["Created at", sec2Date(item.createtime)]);
						info.push(["Modified at", sec2Date(item.lastmodify)]);

						return template.propertiesWrapper(info);
					}
				};
			let windows = [];
			//创建桌面图标
			function CreateDesktopIcon(item, targetContainer = defaultContainer, newWindow = true) {
				let methods;
				
				if(targetContainer.dataset.itemId=="BadBmHrbSujgTAqHEJXy87BtCCzvNXL1"){
					methods=''
				}else{
					methods=item.type=='exe'?'display.launch':'fileSystem.execute';
				}
				
				targetContainer.insertAdjacentHTML('afterbegin', `<div class="de-icon no-select" data-item-id="${item.id}">
					<a title="${template.tooltip(item)}" data-click="${methods}" data-contextmenu="${cName}._createMenu" data-id="${item.id}" data-container="${targetContainer.dataset.id}" data-new="${newWindow}" data-type="icon">
						<div class="DesktopIconImgBox">
							<img src="${getPath('desktop', item.icon)}" />
						</div>
					</a>	
					<p title="${item.name}">
						<div class="de-text-box icon-text" data-id="${item.id}">
							<input class="d-none" type="text" maxlength="24" value="${item.name}" />
							<span data-click="${cName}.toggleRename">${item.name}</span>
						</div>
					</p>
				</div>`);
				const icon = targetContainer.firstChild;
				icon.querySelector("input").onblur = inputBlur;
				icon.querySelector("input").onkeyup = nameConfirm;
				//createDragable(icon);

			}
			function createDragable(e) {
				e.ondragstart = dragStart;
				e.draggable = true;
			}
			function dragStart(ev) {

				const id = ev.target.parentNode.parentNode.dataset.id;
				ev.dataTransfer.setData("Text", id);
			}
			function inputBlur(e) {
				e.preventDefault();

				toggleRename(e.target.parentNode);
			}


			function nameConfirm(e) {
				e.preventDefault();
				if (e.keyCode === 13) {

					rename(e.target);
				}
			}

			function rename(e) {
				const id = e.parentNode.dataset.id;
				if (!id) { return console.log('no id~') }
				const item = components[datasource].get(id),
					input = e.parentNode.querySelector('input'),
					span = e.parentNode.querySelector('span');
				if (!item || !input) { return console.log('no item or input') }
				item.name = input.value;
				span.textContent = item.name;
				input.blur();
				//item.lastmodify
			}
			function init(desktopItems) {
				for (const item of desktopItems) {
					if (!item.ondesktop) { continue; }
					CreateDesktopIcon(item)
				}
				createDropTarget(defaultContainer);
				shared.createDropTarget = createDropTarget;
				shared.createDragable = createDragable;
			}
			function createDropTarget(e) {
				e.ondragover = onDragOver;
				e.ondrop = onDrop;
			}
			function onDrop(ev) {
				let e = ev.target;
				ev.preventDefault();
				ev.stopPropagation();
				if (e.tagName == "IMG") {
					e = e.parentNode.parentNode;
				}
				const data = e.dataset,
					{ container, type, itemId = false, id = false } = data,
					targetId = itemId || id || false,
					sourceId = ev.dataTransfer.getData("text") || false;
				if (!targetId || !sourceId || targetId == sourceId) {
					return;
				}
				const item = components[datasource].copyItem(targetId, sourceId, true);
				if (item) {
					const sourceIcons = document.body.querySelectorAll(`.de-icon[data-item-id="${sourceId}"]`);
					if (type == "free") {
						const targetWin = document.body.querySelector(`.content[data-id="${id}"]`)
						max = sourceIcons.length;
						if (targetWin) {
							CreateDesktopIcon(item, targetWin, container == -1);
						}
					}
					for (const icon of sourceIcons) {
						icon.remove();
					}
				}
			}
			function onDragOver(ev) {
				ev.preventDefault();
			}
			function createMenu(e, ev) {
				const { id, container, type, itemId } = e.dataset,
					ds = components[datasource],
					menu = components[relationship.menu],
					clipboard = components[relationship.clipboard],
					targetID = itemId || id;

				let list;

				if (type == 'free') {
					//桌面

					list = [
						["新建文件夹", cName, "createNew", [targetID, container, 'dir']],
						["新建文件", cName, "createNew", [targetID, container, 'dir']],
						["粘贴", cName, "paste", [targetID, container, type]],					
						["个人设置", display, "launch", [targetID]],
					]

					if (clipboard.getItems().length <= 0) {
						list.splice(2, 1)
					}
					if(targetID.includes('BadBm')){
						list=[
							["复制", relationship.clipboard, "addItems", ['fs', targetID, 'false']],
							["剪切", relationship.clipboard, "addItems", ['fs', targetID, 'true']],
							["粘贴", cName, "paste", [targetID, container, type]],
							["清空回收站", datasource, "clearAll", [targetID]],
							["属性", cName, "properties", [targetID]],
						]
					}
					
				}
				else if (type == 'icon') {
					//文件

					list = [
						["打开", datasource, "execute", [targetID]],
						["复制", relationship.clipboard, "addItems", ['fs', targetID, 'false']],
						["剪切", relationship.clipboard, "addItems", ['fs', targetID, 'true']],
						["粘贴", cName, "paste", [targetID, type]],
						["重命名", cName, "toggleRename", [targetID]],
						["删除", cName, "remove", [targetID]],
						["属性", cName, "properties", [targetID]],
					]
					if (clipboard.getItems().length <= 0) {
						list.splice(3, 1)
					}
					
					if(targetID&&targetID.includes('BadBm')){
						list = [
							["打开", datasource, "execute", [targetID]],
							["清空回收站", datasource, "clearAll", [targetID]],
							["重命名", cName, "toggleRename", [targetID]],		
							["属性", cName, "properties", [targetID]],
						]

					}
					
					if(e.parentNode.parentNode.dataset.container!=-1&&e.parentNode.parentNode.dataset.itemId.includes("BadBm")){
						
					
						list = [
							["复制", relationship.clipboard, "addItems", ['fs', targetID, 'false']],
							["剪切", relationship.clipboard, "addItems", ['fs', targetID, 'true']],
							["删除", cName, "remove", [targetID]],								
							["属性", cName, "properties", [targetID]],
						]
					}
					
				}
				if (list) {
					menu.create(ev, list, targetID)
				}
			}
			function createNewWindow() {
				const options = {
					data: false,
					appClass: settings.windowClass,
					title: settings.name,
					source: settings.constructorName,
					windowSize: settings.windowSize,
					randomPosition: settings.randomPosition,
					icon: settings.icon,
				};
				return components[window].register(options);
			}
			function start(e, ev) {

				const ds = components[datasource],
					id = e.parentNode.dataset.id || null,
					item = ds.get(id),
					t = e.parentNode;
				if (!id || !item) {
					return console.log("file not exist or missing id");
				}
				if (windows.length >= settings.maxProc) {
					return console.log('Too much opened window, cannot open more!');
				}

				let win = createNewWindow();
				if (!win) {
					console.log("Failed to create new window!");
					return false;
				}
				win.body.innerHTML = template.properties(item);

				win.h4 = win.dom.querySelector('.header h4');
				win.h4.dataset["afterText"] = "- " + item.name;
				win.dom.style.top = ev.clientY - t.offsetHeight;
				win.dom.style.left = parseInt(t.parentNode.style.left, 10);
				windows.push(win);
				return win;
			}
			function close(win) {
				const len = windows.length;
				let i = 0;
				for (; i < len; i++) {
					if (windows[i].id == win.id) {
						return windows.splice(i, 1);
					}
				}
			}
			function getContainer(id) {

				const win = components[window].getWindow(id);
				if (!win) {
					return defaultContainer;
				}
				return win.body;
			}
			function paste(e) {
				const [targetId, container, targetType] = e.dataset.extra.split('/'),
					time = Math.round(+new Date() / 1000),
					icons = {
						dir: "folder",
						html: "file"
					},
					ds = components[datasource],
					clipboard = components[relationship.clipboard],
					items = clipboard.getItems();
				let containerDOM,
					newWindow;
				if (!clipboard.getItems()) {
					return console.log("Clipboard is empty");
				}
				if (targetType == "free") {
					containerDOM = getContainer(container)
					if (!containerDOM) {
						return console.log("Container not exist!");
					}
					newWindow = targetId == -1 ? true : false;

				}

				for (let [sourceType, itemId, remove] of items) {
					if (sourceType == "fs") {
						remove = remove == "true";

						const item = ds.copyItem(targetId, itemId, remove);

						if (item && targetType == "free") {

							CreateDesktopIcon(item, containerDOM, newWindow);
							if (remove) {

								deleteIcon(itemId);
							}
						}
					}
				}
				clipboard.clear()
			}
			function createNew(e) {
				const [id, container, type] = e.dataset.extra.split('/'),
					time = Math.round(+new Date() / 1000),
					icons = {
						dir: "folder",
						html: "file"
					};


				const newItem = {
					name: "新建文件夹",
					id: guid(),
					description: "This is a new folder",
					icon: icons[type],
					type: type,
					readonly: false,
					onstartmenu: false,
					ondesktop: id == -1,
					createtime: time,
					lastmodify: 1503812702,
				}

				if (components[datasource].add([newItem], id)) {
					CreateDesktopIcon(newItem, getContainer(container), true);
				}
			}
			function deleteIcon(id) {
				const icons = document.body.querySelectorAll(`.de-icon[data-item-id="${id}"]`);
				for (const icon of icons) {
					icon.remove();
				}
			}
			function remove(e) {
				const id = e.dataset.id;


				if (components[datasource].remove(id)) {
					deleteIcon(id);
				}
			}
			function toggleRename(e) {
				const childs = e.children || false;
				if (childs) {
					for (const child of childs) {
						child.classList.toggle('d-none');

						if (child.tagName == 'INPUT') {

							child.focus();
							child.select();
						}
					}
				}
			}
			function getParent(e) {

				const parent = e.parentNode,
					id = parent.dataset.id || null;
				if (!id) {
					return console.log("Id not exist on parent elem!");
				}
				return document.querySelector(`div.icon-text[data-id="${id}"]`);
			}


			return {
				_init(desktopItems) {
					init(desktopItems)
				},
				_createMenu(e, ev) {
					createMenu(e, ev)
				},
				createIcon(item, container, newWindow) {
					CreateDesktopIcon(item, container, newWindow);
				},
				properties(e, ev) {
					start(e, ev);
				},
				close(win) {
					close(win);
				},
				paste(e, ev) {
					paste(e);
				},
				remove(e) {
					remove(getParent(e));
				},
				createNew(e, ev) {
					createNew(e);
				},
				toggleRename(e) {
					toggleRename(getParent(e));
				},


			}
		},
		fileSystem(settings, shared = false) {
			const { req, components, guid, objClone, assoc } = shared,
				relationship = settings.relationship;
			let vfs,sd,recycleimg;

			if (localStorage.getItem('2323')) {

				vfs = JSON.parse(localStorage.getItem('vfs'));
				init();
			} else {
				req("json", "vfs", d => {
					vfs = d;
					init();
				}, 'json');
			}

			function init() {
				const hash = location.hash ? location.hash.substr(1) : false;
				let desktopItems = [],
					startMenuItems = [],
					item;
				for (item of vfs.child) {
					if (item.ondesktop) {
						desktopItems.push(item);
					}
					if (item.onstartmenu) {
						startMenuItems.push(item);
					}
				}

				if (desktopItems.length) {
					components[relationship.desktop]._init(desktopItems);
				}

				if (startMenuItems.length) {
					components[relationship.startmenu].init(startMenuItems);
				}
				
				let recycle=document.querySelectorAll('a')
				for (const iterator of recycle) {
					if(iterator.title.indexOf('recycle')>-1){
						recycleimg=iterator.querySelector('img');
					}
					
				}
				sd=vfs.child.filter(child=>(child.id=="BadBmHrbSujgTAqHEJXy87BtCCzvNXL1"))	
				updateRecycleIcon()

			}

			function searchInVfs(items, id) {
				let e, item;
				for (item of items) {
					if (item.id == id) {
						item.path = [];
						item.parent = [];
						return item;
					}
					if (item.child) {
						e = searchInVfs(item.child, id);
						if (e && e.id == id) {
							e.path.push(item.id);
							e.parent.push(item.name);
							return e;
						}
					}
				}
				return null;
			}

			function deleteItem(items, id) {
				
				let i, max = items.length;
				for (i = 0; i < max; i++) {
					if (items[i].id == id) {
						items.splice(i, 1);
						save();
						return true;
					}
					if (items[i].child) {
						if (deleteItem(items[i].child, id) === true) {
							return true;
						};
					}
				}
				return null;
			}

			function add(items, to) {
				let target = to == -1 ? vfs : searchInVfs(vfs.child, to);

				if (!target) {
					return false;
				}
				if (!target.child) {
					target.child = [];
				}
				target.child.push(...items);
				save();
				return true;
			}

			function save() {
				localStorage.setItem('vfs', JSON.stringify(vfs))
				return true;
			}

			function prepareItems(items, remove) {
				let i, max = items.length;
				for (i = 0; i < max; i++) {
					items[i].id = guid();
					if (!remove) {
						items[i].name = items[i].name + " copy";
					}
					if (items[i].child) {
						prepareItems(items[i].child, remove);
					}
				}
				return null;
			}

			function prepareItem(item, remove) {
				if (Array.isArray(item)) {
					return prepareItems(item, remove);
				}

				item.id = guid();
				if (!remove) {
					item.name = item.name + " copy";
				}

				if (item.child && item.child.length > 0) {
					return prepareItems(item.child, true);
				}
				return;
			}

			function copyItem(targetId, sourceId, removeItem = false) {

				const sourceItem = searchInVfs(vfs.child, sourceId);
				if (!sourceItem) { return null; }
				const itemCopy = objClone(sourceItem);
				if (targetId == -1) {
					itemCopy['ondesktop'] = true;
				}
				prepareItem(itemCopy, removeItem);
				if (!add([itemCopy], targetId)) {

					return false;
				};
				if (removeItem) {
					deleteItem(vfs.child, sourceId);
				}
				return itemCopy;
			}

			function openItem(item, e = {}, ev = {}) {
				if (!item) {
					return;
				}
				const app = components[assoc[item.type] || "-"] || false;

				if (!item) {
					return console.log("File corrupt or not exist anymore!");
				} else if (item.url && item.type == "url") {
					
					window.open(item.url, "mywindow");
				} else if (item.text && item.type == "alert") {
					alert(item.text);
				} else if (!app || !app.open) {
					return console.log("Not exist associated application!");
				}else{
					app.open(e, ev);
				}
				
			}

			function execute(e, ev) {
				let id = e.dataset.id;

				if (!id) {

					return console.log("This file not have id!");
				}
				openItem(searchInVfs(vfs.child, id), e, ev);
			}
			function updateRecycleIcon(){
				
				setInterval(()=>{
					if(sd[0].child.length){
						recycleimg.src='assets/desktop/recycle-full.ico'
					}else{
						recycleimg.src='assets/desktop/recycle.ico'
					}
				},100)
			}
			function clearAll(items,e){
			  
			  		  		
				sd[0].child.splice(0,sd[0].child.length)	
				//save();
				//更新图标
				//删除对应dom
				let contents;
				contents=document.querySelectorAll('.content')
				if(contents.length){
					let keys=Object.keys(contents)
					for (const key of keys) {
						if(contents[key].dataset.itemId==e.dataset.extra){

							while(contents[key].firstChild){								
								contents[key].removeChild(contents[key].firstChild)
							}														
						}
						
					}									
				}
				
			  
			}

			return {
				add(items, to) {
					return add(items, to);
				},
				copyItem(targetId, sourceId, removeItem = false) {
					return copyItem(targetId, sourceId, removeItem);
				},
				execute(e, ev) {
					execute(e, ev);
				},
				clearAll(e){
					clearAll(vfs.child,e)
				},
				get(id) {
					return searchInVfs(vfs.child, id);
				},
				getDatabase() {
					return vfs;
				},
				search(items, id) {
					return searchInVfs(items, id);
				},
				remove(id) {
					return deleteItem(vfs.child, id)
				},
				save() {

					return save();
				}
			}
		},
		clockManager(settings, shared = false) {
			const placeholder = document.body.querySelector(settings.placeholder) || null;
			let timerId;
			if (settings.showUI) {
				updateClock(new Date())
				if (placeholder) {
					placeholder.dataset.timezone = getTimeZone();
					timerId =  setInterval( () => {
						updateClock(new Date());
					}, 1000);
				}
			}

			function updateClock(time) {
				const clock =getFormattedTime(time);
				placeholder.textContent = clock;
				placeholder.dataset.time = clock;
				placeholder.dataset.date = getNamedDate(time);
			}

			function getTimeZone() {
				const time = new Date(),
					timeZone = Math.round(time.getTimezoneOffset() / 60);
				return timeZone > 0 ? "-" + timeZone : "+" + -timeZone;
			}
			function getNamedDate(d) {
				const days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
					months = ["1月","2月","3月","4月","5月","6月","7月","8月", "9月", "10月", "11一月", "12月"];
				return `${d.getFullYear()}年 ${months[d.getMonth()]} ${d.getDate()} (${days[d.getDay()]})`
			}
			function getFormattedTime(d) {
				return (
					(d.getHours()+"").padStart(2, "0") + ":" +
					(d.getMinutes()+"").padStart(2, "0") + ":" +
					(d.getSeconds()+"").padStart(2, "0")
				);
			}
			return {
				remove() {
					if (timerId) {
						clearInterval(timerId);
					}
				}
			}
		},
		windowManager(settings, shared = false) {
			const { guid, components } = shared,
				taskMName = settings.relationship.task,
				cName = settings.constructorName,
				template = {
					window(settings) {
						const {
							id,
							appClass = [""],
							title = "",
							subTitle = "",
							afterHeader = "",
							afterContent = "",
							content = ""
						} = settings;
						
						return `<div class="container">
                                <div class="header no-select">
                                    <h4 class="title" data-after-text="${subTitle}">
                                        ${subTitle||title}
                                    </h4>
                                    <div class="minimize" data-click="${cName}.minimize" data-id="${id}">_</div>
                                    <div class="close" data-click="${cName}.close" data-id="${id}">✖</div>
                                </div>
                                ${afterHeader}
                                <div class="content" data-id="${id}">${content}</div>
                                ${afterContent}
                            </div>`;
					}
				},
				focusedZ = 3,
				normalZ = 2;

			let windows = {}, focusedId;

			function getNewId() {
				let newId = guid();

				if (!windows['win_' + newId]) {
					return newId;
				}
				return getNewId();
			};


			function dragdrop(e1, e2 = null) {
				e1 = typeof e1 === "string" ? document.body.querySelector(e1) : e1;
				e2 = typeof e2 === "string" ? document.body.querySelector(e2 || e1) : e2;
				e2.addEventListener('mousedown', dragHandler);
				let body = document.body,
					html = document.documentElement,
					eWidth = e1.offsetWidth,
					eHeight = e1.offsetHeight,
					mWidth = Math.max(body.offsetWidth, html.offsetWidth) - eWidth,
					mHeight = Math.max(body.offsetHeight, html.offsetHeight) - eHeight,
					cX, cY, x, y, pos = e1.style.position,
					shiftX, shiftY;

				e1.style.position = 'fixed';

				function move(x, y) {
					e1.style.left = x + 'px';
					e1.style.top = y + 'px';
				}

				function mousemove(e) {
					x = e.clientX - shiftX;
					y = e.clientY - shiftY;
					cX = x > mWidth ? mWidth : x < 0 ? 0 : x;
					cY = y > mHeight ? mHeight : y < 0 ? 0 : y;
					move(cX, cY);
				}

				function mouseup(e) {
					body.removeEventListener('mousemove', mousemove);
					window.removeEventListener('mouseup', mouseup);
					body.removeEventListener('mouseup', mouseup);
					e2.addEventListener('mousedown', dragHandler);
					e1.dataset.move = "false";
					if (e1.dataset.id && e1.classList.contains('window')) {
						focus(e1.dataset.id);
					}
					//e.preventDefault();
				}

				function dragHandler(e) {
					const { width, height } = e1.style,
						{ move = "false", id = false } = e1.dataset;
					if (move == "true" || width == "100%" || height == "100%") {
						return;
					}
					if (id && e1.classList.contains('window')) {
						focus(id);
					}
					body.addEventListener('mousemove', mousemove);
			
					window.addEventListener('mouseup', mouseup);
					e1.dataset.move = "true";
					shiftX = e.clientX - e1.offsetLeft;
					shiftY = e.clientY - e1.offsetTop;
				}

			}

			function customizeWindow(dom, options) {
				const winSize = options.windowSize || {};

				let width, height;
				if (winSize.full) {

					width = "100%";
					height = "calc(100% - 34px)";
					dom.style.top = '0px';
					dom.style.left = '0px';
				} else if (options.randomPosition) {

					const body = document.body,
						{
							minW = 400,
							minH = 200,
							maxW = 800,
							maxH = 400
						} = options.windowSize || {},
						limitX = body.offsetWidth,
						limitY = body.offsetHeight - 33,
						maxX = Math.min(limitX, maxW),
						maxY = Math.min(limitY, maxH);
					width = Math.floor(Math.random() * (maxX - minW) + minW) + 'px';
					height = Math.floor(Math.random() * (maxY - minH) + minH) + 'px';
					dom.style.top = Math.random() * (limitX - width) + 'px';
					dom.style.left = Math.random() * (limitY - height) + 'px';
				}
				dom.style.width = width;
				dom.style.height = height;

			}

			function create(options) {
				
				const id = getNewId(),
					dom = document.createElement("div")
				task = components[taskMName];
				options.id = id;
				options.status = true;
				
				dom.innerHTML = template.window(options);
				dom.id = "win_" + options.id;
				dom.dataset.id = options.id;
				dom.dataset.click = cName + ".focus";
				dom.classList.add('window', ...(options.appClass || []));
				const cont = dom.querySelector(settings.contentSelector);
				options.dom = dom;
				options.header = dom.querySelector(".header");
				options.body = cont;
				dragdrop(options.dom, options.header);
				windows[id] = options;

				document.body.append(dom);
				//customizeWindow(dom, options);
				 task.add(options);
				focus(id);
				  if (shared.taskPanel) {
				      shared.taskPanel.addToList(options);
				  }
				return options;

			}

			function minimize(id) {

				const win = windows[id];
				if (!win) { return console.log('Window not found'); }
				win.status = !win.status;
				win.dom.classList.toggle('minify');
				unfocus(id);
				focusedId = null;
			}

			function close(e) {
				const id = e.dataset.id,
					win = windows[id],
					task = components[taskMName];
				if (!win) { return console.log('Window not found'); }
				if (shared.taskPanel) {
					shared.taskPanel.removeFromList(win);
				}
				
				components[win.source].close(win);
				win.dom.remove();
				task.close(windows[id]);
				delete windows[id];
			}

			function unfocus(id) {
				if (windows[id]) {
					windows[id].dom.style.zIndex = normalZ;
					components[taskMName].unfocus(windows[id]);
				}
				focusedId = null;
			}

			function focus(id = false) {
				if (!id) {
					return;
				}

				unfocus(focusedId);

				if (windows[id] && focusedId != id) {
					if (!windows[id].status) {
						minimize(id);
					}
					windows[id].dom.style.zIndex = focusedZ;
					focusedId = id;
					components[taskMName].focus(windows[id]);
				}
			}

			return {
				close(options) {
					close(options);
				},
				focus(e, ev) {
					const id = typeof e != "object" ? e : e.dataset.id;
					focus(id, status);
				},
				minimize(e, ev) {
					ev.preventDefault();
					minimize(e.dataset.id);
				},
				getWindow(id = false) {
					return !id ? windows : windows[id] || null;
				},
				register(options) {
					return create(options);
				},
				remove() {

				}
			}
		},
		startMenuManager(settings, shared = false) {
			const taskbar = document.querySelector('#footer'),
				{ blurable } = shared,
				cName = settings.constructorName,
				datasource = settings.relationship.datasource,
				template = {
					startMenu(itemList) {
						const icons = template.createList(itemList)
						return `<div class="start-menu no-select">
						<div class="start-menu-title">
							<h3> Welcome Guest! </h3>
                        </div>
                        
						<div class="sub-item-list">
							<div class="ul-before">Welcome~</div>
							<ul >${icons}${icons}${icons}</ul>
                        </div>
                        
						<div class="main-item-list">
                          <div class="block1" style="flex:3;display:flex;flex-direction:row;">
                            <div style="flex:2;background:rgb(0,120,215);"></div>
                            <div style="flex:1;border-left:2px solid black;display:flex;flex-direction:column">
                              <div style="flex:1;background:rgb(0,120,215);border-bottom:2px solid black;"></div>
                              <div style="flex:1;background:rgb(0,120,215);"></div>
                            </div>
                          </div>
                        	
                          <div class="block2" style="flex:2;display:flex;flex-direction:row;">
                            <div style="flex:1;display:flex;">
                              <div style="flex:1;display:flex;flex-direction:row">
                                <div style="flex:1;background:rgb(0,120,215);display:flex;flex-direction:column">
                                  <div style="flex:1;background:rgb(0,120,215);border-bottom:2px solid black"></div>
                                  <div style="flex:1;background:rgb(0,120,215);"></div>
                                </div>
                                <div style="border-left:2px solid black;flex:1;background:rgb(0,120,215);display:flex;flex-direction:column">
                                  <div style="flex:1;background:rgb(0,120,215);border-bottom:2px solid black"></div>
                                  <div style="flex:1;background:rgb(0,120,215);"></div>
                                </div>
                                  
                              </div>
                               
                            </div>
                            <div style="flex:1;background:rgb(0,120,215);border-left:2px solid black"></div>
                          </div> 
                          
                            
                                                   	                        
					</div>`;
					},
					createList(itemList) {
						let lilist = ''
						for (const item of itemList) {
							lilist += `<li><div><img height="20" width="20" src="./assets/startmenu/${item.icon}.ico"></div><span>${item.name}<span></li>`
						}
						return lilist;
					}
				}

			let startMenu, selected = false, lis;

			function init(list) {
				taskbar.insertAdjacentHTML('afterbegin', template.startMenu(list))
				startMenu = taskbar.querySelector('.start-menu')
				blurable(startMenu, blurCb);
			}

			function blurCb(ev) {
				
				//  startMenu.classList.remove('show');
				//  startMenu.querySelector('.main-item-list').classList.remove('show');
				//  if(lis.length){
				//     for (let index = 0; index < lis.length; index++) {
				//         lis[index].classList.remove('show')      
				//     }
				//  }

			}

			return {
				init(list) {
					init(list)
				},
				toggle() {

					startMenu.classList.toggle('show');
					lis = startMenu.querySelectorAll('li');
					setTimeout(() => {
						startMenu.querySelector('.main-item-list').classList.toggle('show')


						for (let index = 0; index < lis.length; index++) {
							lis[index].classList.toggle('show')
						}
					}, 5)

					startMenu.focus();
				}
			}
		},
		fileExplorer(settings, shared = false) {

			const { components } = shared,
				{ datasource: ds, window, desktop: icon } = settings.relationship;

			const template = {
				addressbar(item, options) {
					const { cont, itemId, newWin } = options;
					return `<div class="addressbar">								
						<span style="padding:5px" class="home">
							<img width="20" height="20" src="./assets/app/home.png">
						</span>
						<span style="padding:5px"  class="up">
							<img width="20" height="20"  src="./assets/app/up.png">
						</span>
						<nav>
							<ul></ul>
						</nav>
						</div>`;
				}
			}

			let windows = [];

			function addNavLink(win, item) {
				const label = item.parent,
					path = item.path,
					len = label.length;
				let i = 0, li;
				win.nav.innerHTML = "";
				win.nav.append(document.createElement("li"));
				if (len > 0) {
					label.reverse();
					path.reverse();

					for (; i < len; i++) {
						li = document.createElement("li");
						updateTargetData(li, path[i], win.id);
						li.textContent = label[i];
						win.nav.append(li);
					}
				}
				li = document.createElement("li");
				li.textContent = item.name;
				win.nav.append(li);
			}

			function createNewWindow(item, d) {
				const options = {
					data: d,
					appClass: settings.windowClass,
					windowSize: settings.windowSize,
					title: settings.name,
					subTitle: item.name,
					source: settings.constructorName,
					icon: item.icon,
					randomPosition: settings.randomPosition,
					afterHeader: template.addressbar(
						item, {
						cont: d.container,
						itemId: d.id,
						newWin: d.new
					}
					),
				};
				return components[window].register(options);
			}

			function updateContent(item, d, win) {
				const items = item.child || [],
					desktop = components[icon];
				for (const itm of items) {
					desktop.createIcon(itm, win.body, false);
				}
			}

			function updateTargetData(e, itemId, winId) {
				e.dataset.id = itemId;
				e.dataset.container = winId;
				e.dataset.new = false;
				e.dataset.click = `${ds}.execute`;
			}

			function open(e, ev) {

				const d = e.dataset,
					newWin = (d.new || false) === "true";
				let win;

				if (!d.container || !d.id) {
					return console.log('Cannot execute, insufficient information!');
				}
				const item = components[ds].get(d.id);
				if (!item) {
					return console.log('File or folder not exist!');
				}

				if (windows.length >= settings.maxProc && d.new) {
					return console.log('Too much opened window, cannot open more!');
				}

				if (newWin) {
					win = createNewWindow(item, d);

					if (!win) {
						return console.log("Failed to create new file explorer window!");
					}
					win.up = win.dom.querySelector('.up');
					win.home=win.dom.querySelector('.home');		
					win.nav = win.dom.querySelector('.addressbar nav ul');
					win.h4 = win.dom.querySelector('.header h4');
					win.body.dataset.type = "free";
					win.body.dataset.container = win.id;
					win.body.dataset.contextmenu = "desktopManager._createMenu";

					windows.push(win);
				} else if (d.container != "-1") {
					win = components[window].getWindow(d.container);
					if (!win) {
						return console.log("File Explorer window not exist!");
					}
					win.body.innerHTML = "";
				}
				win.h4.dataset["afterText"] = "- " + item.name;
				addNavLink(win, item);
				win.body.dataset.itemId = item.id;
				updateTargetData(win.home, item.path[0] || item.id, win.id)
				updateTargetData(win.up, item.path.slice(-1)[0] || item.id, win.id)
				updateContent(item, d, win);
			}

			function close(win) {
				const len = windows.length;
				let i = 0;
				for (; i < len; i++) {
					if (windows[i].id == win.id) {
						return windows.splice(i, 1);
					}
				}
			}

			return {
				close(win) {
					close(win);
				},
				open(e, ev) {
					open(e, ev);
				},
				remove() {

				}
			}
		},
		virtualClipboard(settings, shared = false) {
			const container = document.querySelector(settings.container),
				{ components, isEmpty } = shared;
			let clipboard = [];


			function addItems(e) {

				clipboard.push(...[e.dataset.extra.split("/")]);

				return true;
			}

			return {
				getItems() {
					return clipboard;
				},
				addItems(e, ev) {
					addItems(e);
				},
				clear() {
					clipboard = [];
				}
			}
		},
		taskManager(settings, shared = false) {
			const { guid, components, blurable,getPath } = shared,
				{ launch, window } = settings.relationship,
				container = document.body.querySelector(settings.container),
				group = container.querySelector(settings.group),
				cName = settings.constructorName,
				template = {
					taskGroupBtn(options) {
						const { id, icon, title, subTitle = "", source: group } = options;
						
						 let icon2;
						
						switch(group){
							case "fileExplorer":
								icon2='folder';
								break;
							case "display":
								icon2='settings';
								break;
							case "taskManager":
								icon2='taskmanager';
								break;
							case 'desktopManager':
								icon2='folder'
								break;
						}
						return `<figure class="btn-task btn-group" data-click="${cName}.toggle" data-id="${id}" data-group=${group} data-contextmenu="${cName}.createMenu" title="${title}">
									<img class="mini-icon" height="30" width="30" src="assets/desktop/${icon2}.ico">
									<figcaption class="btn-text  d-md-iblock">${title}</figcaption>
									<div class="d-none" data-sub-group="${group}"></div>
								</figure>`;
					},
					taskBtn(options) {
						const { id, icon, title, subTitle = "", source: group } = options
							//headerTitle = subTitle.length > 1 ? subTitle.substr(2) : title;
							headerTitle = subTitle||title;
							
							
						return `<figure class="btn-task" data-click="${window}.focus" data-id="${id}" data-group=${group} title="${title} ${subTitle}">
									<img class="mini-icon width="30" height="30" d-none d-md-iblock" src="assets/desktop/${icon}.ico">
									<figcaption class="btn-text d-md-iblock">${headerTitle}</figcaption>
									<div data-sub-group="${group}"></div>
								</figure>`;
					},
					killBtn(id, group) {
						return `<div class="close" data-click="${window}.close" data-id="${id}" data-group="${group}">✖</div>`;
						
					},
					runningTaskHeader() {
						const header = {
							name: "名称",
							id: "ID",
							action: "结束",
							cpu:'CPU',
							memory:'内存',
							disk:'磁盘'
						};
						return template.runningTasks(header);
					},
					taskLine(obj) {
						return template.runningTasks(obj);
					},
					runningTaskList(objList) {
						if (!objList) { return ""; }
						
						const header = template.runningTaskHeader();
						let body = [];
						for (const key in objList) {
							
							const id = key,
								o = objList[key];
							body.push(template.taskLine({
								//name: o.title +" "+ (o.subTitle || ""),
								name: o.subTitle||o.title,
								id: id,
								group: o.source || "",
								action: template.killBtn(id, o.source),
								cpu:"0%",
								memory:'0 MB',
								disk:"0 MB/秒",
								icon:o.icon
							}));
							

						}

						return header + body.join('');
					},
					runningTasks(d) {
						
						if (!d.action) {
							
							d.action = template.killBtn(d.id, d.group);
							
						}
						let imgslot;
						if(!d.icon){
							imgslot='';
						}else{	
							imgslot=`<img height="20" width="20" src="assets/desktop/${d.icon}.ico">`
						}
						
						
						return `
						<div class="row"  data-group="${d.group}" data-id="${d.id}">
					<div class="cell" style="flex:4;border-right: 1px solid lightgray;" data-type="name">${imgslot}<span class="left">${d.name} </span></div>
							<div class="cell" style="flex:1;border-right: 1px solid lightgray;"  data-type="id" title="${d.id}"><span class="left">${d.id.substr(0, 7)}</span></div>
							<div class="cell info" style="flex:1;border-right: 1px solid lightgray;"  data-type="id" ><span class="right">${d.cpu}</span></div>
							<div class="cell info" style="flex:1;border-right: 1px solid lightgray;"  data-type="id" ><span class="right">${d.memory}</span></div>
							<div class="cell info" style="flex:1;border-right: 1px solid lightgray;"  data-type="id" ><span class="right">${d.disk}</span></div>							
							<div class="cell" style="flex:1;border-right: 1px solid lightgray;"  data-type="action"><p class="right">${d.action}</p></div>
						</div>`;
					}
				},
				focusClass = settings.focusClass;

			let taskGroup = {}
				selectedGroup = null,
				windows = null;

			function createNewWindow() {
				const options = {
					data: false,
					appClass: settings.windowClass,
					title: settings.name,
					source: settings.constructorName,
					icon: settings.icon,
				};
				return components[window].register(options);
			}

			function getGroupTask(group, id = false) {
				let selector = `.row[data-group="${group}"]`;
				if (id) {
					selector += `[data-id="${id}"]`;
				}
				return windows.body.querySelectorAll(selector);
			}

			function addToList(options) {
				const {
						source: group,
						id = false,
						title,
						subTitle = "",
						icon
					} = options,
					
				 	doms = getGroupTask(group, id),
					taskOption = {
						group,
						id,
						name:subTitle||title,
						cpu:"0%",
						memory:'0 MB',
						disk:"0 MB/秒",
						icon:icon
					};
					
				windows.body.insertAdjacentHTML('beforeend', template.taskLine(taskOption));
			}

			function removeFromList(options) {
				const { source: group, id = false } = options,
					doms = getGroupTask(group, id);
				if (doms.length) {
					for (const dom of doms) {
						dom.remove();
					}
				}
			}

			function start(e, ev) {
				ev.preventDefault();
				if (windows) {
					return components[window].focus(windows.id);
				}

				let win = createNewWindow();
				if (!win) {
					return console.log("Failed to create new window!");
				}
				win.body.innerHTML = template.runningTaskList(components[window].getWindow());
				windows = win;
				win.addToList = addToList;
				win.removeFromList = removeFromList;
				shared.taskPanel = win
			}

			function getSubContainer(groupId) {
				return group.querySelector(`[data-sub-group="${groupId}"]`);
			}

			function create(options, type) {
				const { id, source: groupId} = options;
				if (type == "main") {
					taskGroup[groupId] = { child: {} };
					group.insertAdjacentHTML('beforeend', template.taskGroupBtn(options));
					taskGroup[groupId]['dom'] = group.lastChild;
					taskGroup[groupId]['subGroup'] = group.lastChild.querySelector(`[data-sub-group="${groupId}"]`);
					blurable(group.lastChild, blurCb);
				}

				const subContainer = getSubContainer(groupId);
				subContainer.insertAdjacentHTML('beforeend', template.taskBtn(options));
				options.btn = subContainer.lastChild;
				taskGroup[groupId]['child'][id] = options;
			}

			function blurCb(e) {
				toggle(e.target, "add");
			}

			function add(options) {
				const { id, source: groupId} = options;
				create(options, !taskGroup[groupId] ? "main" : false);
			}

			function close(options) {
				const { id, source: groupId} = options;
				if (groupId == cName) {
					shared.taskPanel = null;
					windows = null;
				}
				if (!taskGroup[groupId]) { return; }
				taskGroup[groupId]['child'][id].btn.remove();
				delete taskGroup[groupId]['child'][id];
				if (Object.keys(taskGroup[groupId].child).length == 0) {
					taskGroup[groupId].dom.remove();
					delete taskGroup[groupId];
				}
			}

			function focus(win, select = false) {
				const { id, source: groupId} = win;
				if (taskGroup[groupId] && taskGroup[groupId]['child'][id]) {
					const taskBtn = taskGroup[groupId]['child'][id];
					taskBtn.btn.classList[select ? 'add' : 'remove'](focusClass);
				}
			}

			function toggle(e, type = "toggle") {
				const {id, group} = e.dataset;
				taskGroup[group].subGroup.classList[type]('d-none');

				if (!selectedGroup) {
					selectedGroup = id;
					return;
				}
			}

			function createMenu(e, ev) {
				const { id, group = false, type = "icon" } = e.dataset,

					list = [
						["New Folder", cName, "createNew", [targetId, container, 'dir']],
						["New File", cName, "createNew", [targetId, container, 'html']],
						["Paste", cName, "paste", [targetId, container, type]],
					//	["Arrange Icon", relationship.clipboard, "addItems", ['fs', id, 'true']],
						["Terminal", cName, "remove", [targetId]],
						["Settings", cName, "toggleRename", [targetId]],
						["Properties", cName, "details", [targetId]],
					];

					if (isEmpty(clipboard.getItems())) {
						list.splice(2, 1);
					}


				if (list) {
					menu.create(ev, list, targetId );
				}
			}

			return {
				focus(win) {
					focus(win, true);
				},
				unfocus(win, select = false) {
					focus(win, false);
				},
				close(options) {
					close(options);
				},
				createMenu(e, ev) {
					createMenu(e, ev);
				},
				add(options) {
					add(options);
				},
				launch(e, ev) {
					start(e, ev);
				},
				remove() {

				},
				toggle(e, ev) {
					toggle(e);
				},
			}
		},
	}
}