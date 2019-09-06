//构成系统的各种组件
const componentsData = {
    //配置
    settings: {
        //桌面
        display: {
            id: 'display',
            name: 'Display Settings',
            description: "Responsable for managing background",
            icon: "sys_display",
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
        fileSystem:{
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
        contextMenu:{
            id: "cntxtmn",
			name: "Right Click Menu",
			description: "Responsable for create right click menu from array",
			icon: "",
			
			className: 'contextMenu',
			maxProc: 1,
        },
        windowManager:{
            id: "wndwmngr",
			name: "Window Manager",
			description: "Responsable for handle the windows",
			icon: "",
			maxProc: 1,
			contentSelector: '.content',
			relationship: {
				task: 'taskManager',
			}          

        }
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
                {window} = settings.relationship,
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
                windows=null,
                inputs=null,
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
            function backgroundChanges(e1,e2,settings) {
                //e1 主题设置的窗口  e2桌面背景

                e1.style.background = template.background(settings)
                e1.style.backgroundSize=`cover`
                if(e2){    
                    e2.style.background = template.background(settings)
                    
                    e2.style.backgroundSize=`cover`
                }
                
            }
            function _init() {

                loadconfigs();
                backgroundChanges(bgImg,e2=null, configs)
            }
            _init()
            //启动和关闭函数
            function start(e,ev) {
                ev.preventDefault()
                if(windows){return}
                let win=createNewWindow();
                if (!win) {
					return console.log("Failed to create new window!");
                }
                
                
                 win.body.innerHTML=template.window()
                 windows=win;
                 previewImg = win.dom.querySelector(`.mini-previews`);
                 previewImg.style.background=bgImg.style.background
                 imgs = windows.dom.querySelectorAll("img");
                 for (let index = 0; index < imgs.length; index++) {
                    imgs[index].addEventListener('click',applyChanges);    
                 }                              
            }
            
            function close(){
                windows=null
            }
            
            function applyChanges(){
               
                const imgsrc=this.src.substring(this.src.indexOf('background'),this.src.length).split('/')[1];
                const settings={
                    bgImage:imgsrc,
                    bgRepeat:configs.bgRepeat,
                    bgPosition:configs.bgPosition,                
               }
               
               backgroundChanges(bgImg,previewImg,settings)
               
            }
            function createNewWindow(){
                const options={
                    data:false,
                    appClass:settings.windowClass,
                    title:settings.name,
                    source:settings.constructorName,
                    icon:settings.icon
                };
                
                return components[window].register(options)
            }
            return {
                launch(e,ev) {
                    start(e,ev)
                },
                close(e){
                  close(e)
                }                          
            }
        
        },
        contextMenu(settings,shared=false){
            
            id='contextmenu_'+Date.now();
            let dom;
            function init(){
                dom=document.createElement('div')
                dom.classList.add(settings.className)
                dom.setAttribute('tabindex','-1')
                dom.style.width='200px'
                dom.textContent=''
                dom.id=id
                dom.style.zIndex=-1;
                document.body.appendChild(dom)
                dom.addEventListener('blur',blurEvent)
                dom.onclick=()=>{setTimeout(blurEvent,100)}
            }
            function blurEvent(){
                dom.classList.remove('show')
            }
            function moveContextMenu(e){
                const px = e.pageX
                py = e.pageY
                cx = dom.offsetWidth
                cy = dom.offsetHeight
                wx = document.body.clientWidth
                wy = document.body.clientHeight
                desktopdom=document.querySelector('#desktop')
                if(py>desktopdom.offsetHeight-cy){
                    
                    dom.style.top = (py-cy)+'px'
                }else{
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
            return{
                getID(){
                    return dom.id||false
                },
                create(e,list,id){
                    populateContextMenu(list,id)
                    moveContextMenu(e)
                    e.preventDefault();
                    
                }
            }
        },
        desktopManager(settings, shared = false) {
            const defaultContainer=document.querySelector(settings.container),
                {components,getPath}=shared,
                cName=settings.constructorName,
                relationship=settings.relationship,
                {datasource,window,display}=relationship,
                template={
                    tooltip(item){
                        return `ID: ${item.id}&#013Description: ${item.description}&#013;`;
                    }
                };
            
            //创建桌面图标
            function CreateDesktopIcon(item,targetContainer=defaultContainer,newWindow=true) {
                targetContainer.insertAdjacentHTML('beforeend', `<div class="de-icon no-select" data-item-id="${item.id}">
					<a title="${template.tooltip(item)}" data-click="${datasource}.execute" data-contextmenu="${cName}._createMenu" data-id="${item.id}" data-container="${targetContainer.dataset.id}" data-new="${newWindow}" data-type="icon">
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
                
            }
            function init(desktopItems) {
                for (const item of desktopItems) {
                    if (!item.ondesktop) { continue; }
                    CreateDesktopIcon(item)
                }
            }
            function createMenu(e, ev) {
                const{id,container,type}=e.dataset
                      ds=components[datasource],
                      menu=components[relationship.menu]

                      let list;
                if(type=='free'){
                    //桌面
                    
                    list=[
                        ["新建文件夹", cName, "createNew", [id, container, 'dir']],
						["新建文件", cName, "createNew", [id, container, 'html']],
						["粘贴", cName, "paste", [id, container, type]],
                        ["Terminal", "terminal", "launch", [id]],
						["个人设置", display, "launch", [id]],
                    ]
                }
               else if(type=='icon'){
                    //文件
                    list=[
                        ["打开", ds, "execute", [id]],
						["复制", relationship.clipboard, "addItems", ['fs', id, 'false']],
						["剪切", relationship.clipboard, "addItems", ['fs', id, 'true']],
						["重命名", cName, "toggleRename", [id]],
						["删除", cName, "remove", [id]],
						["属性", cName, "properties", [id]],
                    ]
                }
                if(list){
                    menu.create(ev,list,id)
                }
            }


          return {
                _init(desktopItems){
                    init(desktopItems) 
                },
                _createMenu(e,ev){
                    createMenu(e,ev)
                }
            }
        },
        fileSystem(settings, shared = false) {
            const{req,components,guid,objClone,assoc}=shared,
                relationship=settings.relationship;
            let vfs;
            req('json','vfs',d=>{
                vfs=d;
               
                init();
            },'json')
            function init(){
              let desktopItems=[],
                  startMenuItems=[];
              for (const item of vfs.child) {                 
                  if(item.ondesktop){
                    desktopItems.push(item)
                  }
                  if(item.onstartmenu){
                    startMenuItems.push(item)
                  }
              }
              if(desktopItems.length){
                
                components[relationship.desktop]._init(desktopItems)
              }
              if(startMenuItems.length){
                components[relationship.startmenu].init(startMenuItems)  
              }
            }
            return {
                init(){
                }
            }
        },
        windowManager(settings,shared=false){
            const { guid, components } = shared,
                cName = settings.constructorName,
                taskName = settings.relationship.task,   
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
									<h4 class="title"  data-after-text="${subTitle}">
										${title}
									</h4>
									<div  class="minimize" data-click="${cName}.minimize" data-id="${id}">_</div>
									<div  class="close" data-click="${cName}.close" data-id="${id}">✖</div>
									</div>
									${afterHeader}
									<div class="content" data-id="${id}">${content}</div>
									${afterContent}
								</div>`;
                  
                }
            },
            focusedZ = 3,
			normalZ = 2;
            let windows={},focusId;
            function create(options){
                const id = getNewID(),
                      dom = document.createElement("div")
                      task = components[taskName];
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
                //dragdrop(options.dom, options.header);
                windows[id] = options;
                
                document.body.append(dom);
                //customizeWindow(dom, options);
                //	task.add(options);
                //	focus(id);
                // if (shared.taskPanel) {
                // 	shared.taskPanel.addToList(options);
                // }
                return options;

            }
            function close(options){
                const id=options.dataset.id,
                      win=windows[id]
                components[win.source].close(win)
                win.dom.remove()
                delete windows[id];
            }
            
            function getNewID(){
                let newID=guid();
               
                 if(!windows['win_'+newID]){
                     
                     return newID;
                 }
                return getNewID()
            }
            return {
                register(options) {
                    return create(options)
                },
                close(options){
                  close(options)
                }
            }
        },
        startMenuManager(settings,shared=false){
            const taskbar = document.querySelector('#footer'),
                { blurable } = shared,
                cName = settings.constructorName,
                datasource = settings.relationship.datasource,
                template={
                    startMenu(itemList){
                        const icons=template.createList(itemList)
                        return `<div class="start-menu no-select">
						<div class="start-menu-title">
							<h3> Welcome Guest! </h3>
                        </div>
                        
						<div class="sub-item-list">
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
                    createList(itemList){
                        let lilist=''
                        for (const item of itemList) {
                        lilist+=`<li><div><img height="20" width="20" src="./assets/startmenu/${item.icon}.ico"></div><span>${item.name}<span></li>`
                        }
                        return lilist;
                    }
                }

            let startMenu, selected = false,lis;
             
            function init(list) {
                taskbar.insertAdjacentHTML('afterbegin',template.startMenu(list))
                startMenu = taskbar.querySelector('.start-menu')
                blurable(startMenu, blurCb);
            }
            
            function blurCb(ev) {
                 console.log(ev)
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
                toggle(){

                    startMenu.classList.toggle('show');
                    lis=startMenu.querySelectorAll('li');
                    setTimeout(()=>{
                        startMenu.querySelector('.main-item-list').classList.toggle('show')
                        
                        
                         for (let index = 0; index < lis.length; index++) {
                             lis[index].classList.toggle('show')      
                         }
                    },5)
                    
                    startMenu.focus();
                }
            }
        }
    }
}