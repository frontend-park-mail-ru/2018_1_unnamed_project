function pug_attr(t,e,n,f){return!1!==e&&null!=e&&(e||"class"!==t&&"style"!==t)?!0===e?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function opponentsCountMenuTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"back\"\u003E\u003Ca href=\"\u002F\"\u003E↺ в меню\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003Cp\u003EВыберите количество противников\u003C\u002Fp\u003E\u003Cdiv class=\"opponentsCounts\"\u003E";
var n = 1;
while (n < this.attrs.maxOpponentsCount) {
pug_html = pug_html + "\u003Cbutton" + (" class=\"game__opponents-count-button form__control-bordered\""+" type=\"button\""+pug_attr("value", `${n}`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = n++) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";;return pug_html;}