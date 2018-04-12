function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function scoreboardPageTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (users) {pug_html = pug_html + "\u003Csection class=\"menu scoreboard-page\"\u003E\u003Cdiv class=\"back\"\u003E\u003Ca href=\"\u002F\"\u003E↺ в меню\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"js-scoreboard-root\"\u003E";
if (users) {
pug_html = pug_html + "\u003Ctable class=\"scoreboard__table\"\u003E\u003Ctbody\u003E";
// iterate users
;(function(){
  var $$obj = users;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var user = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr class=\"scoreboard__row\"\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.email) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.username) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.rank) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var user = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr class=\"scoreboard__row\"\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.email) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.username) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug_escape(null == (pug_interp = user.rank) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cdiv class=\"pagination\"\u003E\u003Ca id=\"prev\" href=\"#\"\u003E\u003C\u003C\u002Fa\u003E\u003Ca id=\"next\" href=\"#\"\u003E\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";}.call(this,"users" in locals_for_with?locals_for_with.users:typeof users!=="undefined"?users:undefined));;return pug_html;}