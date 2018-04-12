function pug_attr(t,e,n,f){return!1!==e&&null!=e&&(e||"class"!==t&&"style"!==t)?!0===e?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function uxuiPageTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (pageId) {pug_html = pug_html + "\u003Csection" + (" class=\"uxui\""+pug_attr("id", `${pageId}`, true, false)+pug_attr("hidden", true, true, false)) + "\u003E\u003Ctable\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv class=\"menu\"\u003E\u003Cul\u003E\u003Cli class=\"menu-item\"\u003E\u003Ca href=\"#\" data-section=\"\"\u003EExample\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli class=\"menu-item\"\u003E\u003Ca href=\"#\" data-section=\"\"\u003Eof\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli class=\"menu-item\"\u003E\u003Ca href=\"#\" data-section=\"\"\u003Emenu buttons\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput class=\"sc-form__input\" required=\"required\" type=\"email\" placeholder=\"input field\"\u002F\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv class=\"bordered-button\"\u003E\u003Ca class=\"section-opener\" href=\"#\" data-section=\"meh\"\u003EButton\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cdiv class=\"img-with-text\"\u003E\u003Cimg class=\"avatar\" style=\"margin: 0 0 4px 0;\" src=\"http:\u002F\u002Fcs4.pikabu.ru\u002Fimages\u002Fbig_size_comm\u002F2014-12_2\u002F14178633063423.jpg\"\u002F\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"profile-info\"\u003E\u003Ch4\u003E\u003Ci\u003E" + (pug_escape(null == (pug_interp = 'Username: ') ? "" : pug_interp)) + "\u003C\u002Fi\u003E\u003Cb\u003E" + (pug_escape(null == (pug_interp = 'tema') ? "" : pug_interp)) + "\u003C\u002Fb\u003E\u003C\u002Fh4\u003E\u003Ch4\u003E\u003Ci\u003E" + (pug_escape(null == (pug_interp = 'Email: ') ? "" : pug_interp)) + "\u003C\u002Fi\u003E\u003Cb\u003E" + (pug_escape(null == (pug_interp = 'tema@tema.ru') ? "" : pug_interp)) + "\u003C\u002Fb\u003E\u003C\u002Fh4\u003E\u003Ch4\u003E\u003Ci\u003E" + (pug_escape(null == (pug_interp = 'Game rank: ') ? "" : pug_interp)) + "\u003C\u002Fi\u003E\u003Cb\u003E" + (pug_escape(null == (pug_interp = '30669') ? "" : pug_interp)) + "\u003C\u002Fb\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Ctable\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Ch2\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. \u003C\u002Fh2\u003E\u003Ch3\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. \u003C\u002Fh3\u003E\u003Ch4\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. \u003C\u002Fh4\u003E\u003Ch5\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit. \u003C\u002Fh5\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Ctable\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style=\"height: 5px; width: 40px; background-color: #EF476F;\"\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd style=\"height: 5px; width: 40px; background-color: #FFFCF9;\"\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd\u003E\u003Cdiv class=\"header\"\u003E\u003Cspan\u003EHEADER FONT\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fsection\u003E";}.call(this,"pageId" in locals_for_with?locals_for_with.pageId:typeof pageId!=="undefined"?pageId:undefined));;return pug_html;}