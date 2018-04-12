function authFormsBuilderTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (signup) {pug_html = pug_html + "\u003C!--suppress HtmlUnknownAttribute --\u003E\u003Cinput class=\"sc-form__input\" required=\"required\" type=\"email\" name=\"email\" placeholder=\"email\"\u002F\u003E\u003Cinput class=\"sc-form__input\" required=\"required\" type=\"password\" name=\"password\" placeholder=\"password\"\u002F\u003E";
if (signup) {
pug_html = pug_html + "\u003Cinput class=\"sc-form__input\" required=\"required\" type=\"password\" name=\"password_confirmation\" placeholder=\"password again\"\u002F\u003E\u003Cinput class=\"sc-form__input\" required=\"required\" type=\"text\" name=\"username\" placeholder=\"username\"\u002F\u003E";
}
pug_html = pug_html + "\u003Ctable class=\"form-buttons\"\u003E\u003Ctr\u003E";
if (!(signup)) {
pug_html = pug_html + "\u003Ctd class=\"button-container\"\u003E\u003Cdiv class=\"bordered-button\"\u003E\u003Ca class=\"js-signup-form__submit-button section-opener\" href=\"#\" data-section=\"signup\"\u003ERegister\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"space\"\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cinput class=\"js-signin-form__submit-button bordered-button\" required=\"required\" type=\"submit\" value=\"Sign in\"\u002F\u003E\u003C\u002Ftd\u003E";
}
else {
pug_html = pug_html + "\u003Ctd\u003E\u003Cinput class=\"js-signup-form__signup-button bordered-button\" required=\"required\" type=\"submit\" value=\"Register\"\u002F\u003E\u003C\u002Ftd\u003E";
}
pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E";}.call(this,"signup" in locals_for_with?locals_for_with.signup:typeof signup!=="undefined"?signup:undefined));;return pug_html;}