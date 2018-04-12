function pug_attr(t,e,n,f){return!1!==e&&null!=e&&(e||"class"!==t&&"style"!==t)?!0===e?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function signupPageTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (fields, formFooterLink, resetText, submitText) {pug_html = pug_html + "\u003Csection class=\"menu signup-page\"\u003E\u003Cdiv class=\"back\"\u003E\u003Ca href=\"\u002F\"\u003E↺ в меню\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"js-signup-form-root\"\u003E\u003Cform class=\"form js-form\" novalidate=\"novalidate\"\u003E";
if (fields) {
pug_html = pug_html + "\u003Cdiv class=\"form__fields\"\u003E";
// iterate fields
;(function(){
  var $$obj = fields;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var field = $$obj[pug_index0];
pug_html = pug_html + "\u003Cinput" + (" class=\"form__fields-input\""+" required=\"required\""+pug_attr("type", `${field.type}`, true, false)+pug_attr("name", `${field.name}`, true, false)+pug_attr("placeholder", `${field.placeholder}`, true, false)) + "\u002F\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var field = $$obj[pug_index0];
pug_html = pug_html + "\u003Cinput" + (" class=\"form__fields-input\""+" required=\"required\""+pug_attr("type", `${field.type}`, true, false)+pug_attr("name", `${field.name}`, true, false)+pug_attr("placeholder", `${field.placeholder}`, true, false)) + "\u002F\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv class=\"form__controls\"\u003E\u003Cbutton class=\"form__control-bordered\" type=\"reset\"\u003E" + (pug_escape(null == (pug_interp = resetText) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003Cdiv class=\"space\"\u003E\u003C\u002Fdiv\u003E\u003Cbutton class=\"form__control-bordered\" type=\"submit\"\u003E" + (pug_escape(null == (pug_interp = submitText) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
if (formFooterLink) {
pug_html = pug_html + "\u003Ca" + (" class=\"form__footer-link\""+pug_attr("href", `${formFooterLink.href}`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = formFooterLink.title) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
}
pug_html = pug_html + "\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";}.call(this,"fields" in locals_for_with?locals_for_with.fields:typeof fields!=="undefined"?fields:undefined,"formFooterLink" in locals_for_with?locals_for_with.formFooterLink:typeof formFooterLink!=="undefined"?formFooterLink:undefined,"resetText" in locals_for_with?locals_for_with.resetText:typeof resetText!=="undefined"?resetText:undefined,"submitText" in locals_for_with?locals_for_with.submitText:typeof submitText!=="undefined"?submitText:undefined));;return pug_html;}