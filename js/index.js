

Object.freeze(new VirtualOS())
function VirtualOS() {
    
    // $(document).ready(function(){

    // })
    const fileTypeAssoc = {
        "html": "htmlViewer",
        "dir": "fileExplorer",
        "alert": "alert",
        "url": "fileSystem",
        "shell": "terminal",
        "task": "taskManager",
        "display": "desktopManager"
    };
    //函数绑定
    const shared = {
        components: {},
        closable: [],
        req: loadScript,
        assoc: fileTypeAssoc,
        // getNamedDate,
        // getFormattedTime,
        sec2Date,
        guid,
        getPath,
        // isEmpty,
        objClone,
        blurable
    }
    function sec2Date (tstamp){
		const d = new Date(tstamp*1000);
		return (
			d.getFullYear()+". "+
			(d.getMonth()+1+"").padStart(2, "0") +". "+
			(d.getDay()+1+"").padStart(2, "0") +".  "+
			getFormattedTime(d)
		);
    }
    function objClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function getFormattedTime(d) {
		return (
			(d.getHours()+"").padStart(2, "0") + ":" +
			(d.getMinutes()+"").padStart(2, "0") + ":" +
			(d.getSeconds()+"").padStart(2, "0")
		);
	}

    loadScript('script', 'configs', () => {
       // 加载完数据都删除掉 只需加载一次就好
        
        const { settings, methods } = componentsData,
            keys = Object.keys(settings),
            parma = ['component', 'options', 'shared']
        let component, options
        for (const key of keys) {
            component = methods[key] || false
            options = settings[key]
            if (!component || !options) { continue; }
            options.constructorName = key
            shared.components[key] = new (new Function(...parma, 'return component(options,shared)'))(component, options, shared)

        }
        
       removeScript('configs','script')

    })


    document.body.onclick = globalEvent
    document.body.oncontextmenu = globalEvent
    function globalEvent(ev) {
        let starbtn=document.querySelector('.startbtn'),
            startmenu=document.querySelector('.start-menu'),
            lis=startmenu.querySelectorAll('li');
        if(ev.target.parentNode!=starbtn){
           startmenu.classList.remove('show');
				startmenu.querySelector('.main-item-list').classList.remove('show');
				if(lis.length){
				    for (let index = 0; index < lis.length; index++) {
				      lis[index].classList.remove('show')      
			        }
				}
        }
        
        const e=getActionNode(ev.target,ev.type)
        
        if(!e)return;
        //阻止鼠标右键
        
        const action = e.dataset[ev.type]
       
        if (ev.type === 'contextmenu') {
            ev.preventDefault();
        }
        
           
        
        if (action.indexOf(".") > -1) {
            //创建右键菜单。。。          
            callComponent(e,action,ev)
        }

    }
    function guid(len=8){
        function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      	.toString(16)
		      	.substring(1);
		}
		return "s".repeat(len).replace(/s/g, s4);
    }
    function getActionNode(e,target){
        if(e.dataset[target])return e
        let i=0
        for(;i<3;i++){
            e=e.parentNode;
            if(e.dataset&&e.dataset[target]){
                return e;
            }
        }
        
        return null
    }
    function blurable(dom,func){
        
        dom.tabIndex = -1;
        dom.onblur = func;
    }
    function callComponent(element = null, path = null, events = null) {
        const methods = path.split('.')
       
         shared.components[methods[0]][methods[1]](element,events)
    }
    function getScriptPath(filename, filetype) {
        if (filetype === 'script') return `js/${filename}.js`
        if (filetype === 'json') return `db/${filename}.json`
        if (filetype === 'file') return `file/${filename}`
        else return false

    }
    function removeScript(name, type) {
        var e = document.querySelector(`#${name}-${type}`)
        if (e) {
            e.remove()
        } 
    }
    function getPath(type, name) {
        if (type === 'desktop') {
            return `assets/desktop/${name}.ico`;
        } else {
            return ''
        }

    }

    function loadScript(type, name, callback = false, responseType = 'text', callbackData = false) {
        const url = getScriptPath(name, type)

        httpReq = new XMLHttpRequest()
        httpReq.onreadystatechange = function (t) {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (type === 'script') {
                        var data = document.createElement(type);
                        data.innerHTML = this.response;
                        data.id = `${name}-${type}`;
                        const head = document.querySelector('head');
                        head.insertBefore(data, head.lastChild);

                    }
                    if (callback && typeof callback === 'function') {

                        callback(this.response, callbackData)
                    }
                }
            } 
        }
        httpReq.responseType = responseType
        httpReq.open('GET', url, true)
        httpReq.timeout = 3000
        httpReq.send()





    }

}

