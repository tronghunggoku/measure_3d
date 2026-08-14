function createScript(src,bool) {
    let script = document.createElement('script');
    script.src = src;
	if(bool){
		script.type = 'text/babel';
	}
    // 保证JS顺序执行！
    script.async = false
    document.body.appendChild(script);
}

function createLink(url) {
    const link = document.createElement('link');
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
};

createScript("plugins/vue.js") // vue
createScript("tour.js") // kr

createScript("plugins/utils/EventDispatcher.js")
createScript("plugins/utils/krpanoAddEvent.js")
createScript("plugins/utils/krpanoAPI.js")
createScript("plugins/utils/cursor-arrow.js")

createLink("plugins/element-ui/index.css") // element-ui
createScript("plugins/element-ui/index.js")

createLink("plugins/jy-ui/index.css") // JongYan
createScript("plugins/jy-ui/index.umd.js")

createScript("plugins/main.js") // 实例
