(function(e){var b=function(){},b=(b=function(){b=function(a){return new b.fn(a)};b.prototype={ready:function(a){b.ready(a,this.el)}};b.ready=function(a,b){b===document&&(b=e);if(b===e||b===e.document){var c=!1,k=function(b){c||"readystatechange"===b.type&&"complete"!==e.document.readyState||(a.call(e.document),c=!0)};b.addEventListener&&(b.addEventListener("DOM-ContentLoaded",k,!1),b.addEventListener("readystatechange",k,!1),b.addEventListener("load",k,!1))}else b.onload=a};b.hideBody=function(){var a=
document.createElement("style");a.innerHTML="body * {display: none}";b.init_styles=a;document.head.appendChild(a)};b.showBody=function(){document.head.removeChild(b.init_styles)};b.fn=function(a){var b=typeof a,c;if("string"===b||"object"===b)switch(b){case "string":-1<a.indexOf("#")?(a=a.replace("#",""),c=document.getElementById(a)):-1<a.indexOf(".")&&(a=a.replace(".",""),c=document.getElementsByClassName(a));break;case "object":c=a}this.el=c;this.query=a;return this};b.extend=function(a){for(var d in a)a.hasOwnProperty(d)&&
(b.prototype[d]=a[d])};b.fn.prototype=b.prototype;b.ready(function(){var a=document.documentElement.clientWidth;b.init_client_height=document.documentElement.clientHeight;b.init_client_width=a;b.showBody()},document);b.init_styles=void 0;b.hideBody();return b}())||function(){},f=function(a,b){this.element=this;this.lastTouchX=this.endTouchX=this.startTouchX=0;this.callback=b;a.addEventListener("touchstart",this,!1);a.addEventListener("touchmove",this,!1);a.addEventListener("touchend",this,!1)};f.prototype.handleEvent=
function(a){switch(a.type){case "touchstart":this.onTouchStart(a);break;case "touchmove":this.onTouchMove(a);break;case "touchend":this.onTouchEnd(a)}};f.prototype.onTouchStart=function(a){this.lastTouchX=this.startTouchX=a.touches[0].clientX};f.prototype.onTouchMove=function(a){var b=a.touches[0].clientX-this.lastTouchX,c=this.startTouchX-this.lastTouchX;this.lastTouchX=a.touches[0].clientX;this.callback({distance:b,distanceFromOrigin:c})};f.prototype.onTouchEnd=function(){this.onDragEnd(this.startTouchX-
this.lastTouchX)};var j=function(a,b){this.callback=b;this.element=this;a.addEventListener("orientationchange",this,!1)};j.prototype.handleEvent=function(a){if("orientationchange"===a.type)this.onOrientationChange(a)};j.prototype.onOrientationChange=function(){this.callback()};b.Event={bind:function(a,d,c){switch(d){case "drag":a.addEventListener("touchmove",function(a){a.preventDefault()},!1);b.listeners[a]=new f(a,c);break;case "dragEnd":b.listeners[a].onDragEnd=c;break;case "orientationChange":b.listeners.orientationchange=
new j(a,c)}}};b.extend(b.Event);b.listeners=[];var b=b||function(){},l=b.Event;b.Fx={show:function(a){"object"===typeof a?a.style.display="block":this.el.style.display="block"},hide:function(a){"object"===typeof a?a.style.display="none":this.el.style.display="none"},dynamicType:function(){var a=function(){var a=e.innerWidth/10+e.innerHeight/40;if(null!==typeof document.body)if(105>a&&20<a)document.body.style.fontSize=a+"%";else if(105<=a)document.body.style.fontSize="105%";else if(20>=a)document.body.style.fontSize=
"20%"};l.bind(e,"orientationChange",a);l.bind(e,"resize",a);a()}};b.extend(b.Fx);var b=b||function(){},m=b.Fx,l=b.Event;b.Nav={panels:function(){var a=0,d=0,c=0,k=0,f=0,j,n,i,g,h;h=this.el;g=h.getElementsByClassName("panel");n=g[0];i=0;c=b.init_client_height;d=b.init_client_width;document.body.style.overflow="hidden";var o=function(a){a.style.width=d+"px";a.style.height=c+"px";a.style.left=a===j?2*d+80+"px":d+40+"px"},p=function(a){f+=a.distance;h.style.transitionProperty="webkit-transform";"undefined"!=
h.style.webkitTransform?h.style.webkitTransform="translate3d("+f+"px,0, 0)":h.style.left=f+"px"},q=function(a){var b=g[i];if(a<g.length&&-1<a)m.hide(b),i=a,b=g[i],b.style.width=d+"px",b.style.left=d+40+"px",m.show(b)},r=function(){c=document.documentElement.clientHeight;d=document.documentElement.clientWidth;o(g[i]);o(j);h.style.width=2*d+"px";h.style.height=c+"px";h.style.left=-1*d-40+"px"};document.body.style.overflow="hidden";j=function(a){var b=a.id,a=document.createElement("div");a.id=b;a.style.width=
d+"px";a.style.height=c+"px";h.appendChild(a);return a}({id:"blank_panel"});r();for(k=g.length;a<k;a+=1)if(m.hide(g[a]),c>g[a].style.height)g[a].style.height=c+"px";l.bind(document.body,"drag",p);l.bind(document.body,"dragEnd",function(a){var b=3*(c/4);a>b?q(i+1):a<-b&&0<i&&q(i-1);p({distance:a})});l.bind(e,"orientationChange",r);m.show(n)}};b.extend(b.Nav);e.$=b})(window);
