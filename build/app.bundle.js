!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=800)}({800:function(e,t){$(function(){new n({})});var n=function(e){for(var t in e)this[t]=e[t];this.init()};n.prototype={backgroundScript:getBackgroundScript("DevTools"),contentScript:getContentScript("DevTools"),control:function(e){var t=this;for(var n in e)for(var r in e[n])$(document).on(r,n,function(n,r){return function(){if(!0!==e[n][r].call(t,this))return!1}}(n,r))},loadTemplates:function(e){e()},init:function(){this.loadTemplates(function(){$("form").bind("submit",function(){return!1}),this.control({"#edit-selector Button[action=select-selector]":{click:this.selectSelector}})}.bind(this))},setStateEditSitemap:function(e){this.state.currentSitemap=e,this.state.editSitemapBreadcumbsSelectors=[{id:"_root"}],this.state.currentParentSelectorId="_root"},getCurrentlyEditedSelector:function(){$("#edit-selector [name=id]").val(),$("#edit-selector [name=selector]").val(),$("#edit-selector [name=tableDataRowSelector]").val(),$("#edit-selector [name=tableHeaderRowSelector]").val(),$("#edit-selector [name=clickElementSelector]").val(),$("#edit-selector [name=type]").val(),$("#edit-selector [name=clickElementUniquenessType]").val(),$("#edit-selector [name=clickType]").val(),$("#edit-selector [name=discardInitialElements]").is(":checked"),$("#edit-selector [name=multiple]").is(":checked"),$("#edit-selector [name=downloadImage]").is(":checked"),$("#edit-selector [name=clickPopup]").is(":checked"),$("#edit-selector [name=regex]").val(),$("#edit-selector [name=delay]").val(),$("#edit-selector [name=extractAttribute]").val(),$("#edit-selector [name=parentSelectors]").val();var e=[],t=$("#edit-selector .column-header"),n=$("#edit-selector .column-name"),r=$("#edit-selector .column-extract");t.each(function(o){var c=$(t[o]).val(),i=$(n[o]).val(),l=$(r[o]).is(":checked");e.push({header:c,name:i,extract:l})})},getCurrentlyEditedSelectorSitemap:function(){var e=this.state.currentSitemap.clone(),t=e.getSelectorById(this.state.currentSelector.id),n=this.getCurrentlyEditedSelector();return e.updateSelector(t,n),e},selectSelector:function(){console.log("--------------------"),this.contentScript.selectSelector({allowedElements:"*"}).done(function(e){console.log("Controller.js result"),console.log(e)}.bind(this))}}}});