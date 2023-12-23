/*
Cache: flexslider, dt-main-roya-js, qf-share, revslider-jquery.themepunch.revolution.min, themepunchtools, jquery-lazy, dt-main, dt-language, dt-main-op-jquery, dt-plugins, jquery-blockui, sc_chat_app_popup, sc_chat_app_script, jquery-cookie, jquery-autosize, waypoints, vc_carousel_js, vc_transition_bootstrap_js, qfe_composer_front_js, thickbox
*/
/* thickbox: (http://www.artjiahua.com/qfy-includes/js/thickbox/thickbox.js) */
/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

if ( typeof tb_pathToImage != 'string' ) {
	var tb_pathToImage = thickboxL10n.loadingAnimation;
}

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
jQuery(document).ready(function(){
	tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
	
});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
	jQuery('body').on('click', domChunk, tb_click);
}

function tb_click(){
	var t = this.title || this.name || null;
	var a = this.href || this.alt;
	var g = this.rel || false;
	tb_show(t,a,g);
	this.blur();
	return false;
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

	imgLoader = new Image();// preload image
	imgLoader.src = tb_pathToImage;
	try {
		if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
			jQuery("body","html").css({height: "100%", width: "100%"});
			jQuery("html").css("overflow","hidden");
			if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
				jQuery("body").append("<iframe id='TB_HideSelect'>"+thickboxL10n.noiframes+"</iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
				jQuery("#TB_overlay").click(tb_remove);
			}
		}else{//all others
			if(document.getElementById("TB_overlay") === null){
				jQuery("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
				jQuery("#TB_overlay").click(tb_remove);
			}
		}

		if(tb_detectMacXFF()){
			jQuery("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
		}else{
			jQuery("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
		}

		if(caption===null){caption="";}
		jQuery("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' width='60' /></div>");//add loader to the page

		jQuery('#TB_load').show();//show loader

		var baseURL;
	   if(url.indexOf("?")!==-1){ //ff there is a query string involved
			baseURL = url.substr(0, url.indexOf("?"));
	   }else{
	   		baseURL = url;
	   }

	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);

		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images

			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = jQuery("a[rel="+imageGroup+"]").get();
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>"+thickboxL10n.next+"</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>"+thickboxL10n.prev+"</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = thickboxL10n.image + ' ' + (TB_Counter + 1) + ' ' + thickboxL10n.of + ' ' + (TB_TempArray.length);
						}
				}
			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){
			imgPreloader.onload = null;

			// Resizing large images - orginal by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 50;
			var y = pagesize[1] - 20;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth);
				imageWidth = x;
				if (imageHeight > y) {
					imageWidth = imageWidth * (y / imageHeight);
					imageHeight = y;
				}
			} else if (imageHeight > y) {
				imageWidth = imageWidth * (y / imageHeight);
				imageHeight = y;
				if (imageWidth > x) {
					imageHeight = imageHeight * (x / imageWidth);
					imageWidth = x;
				}
			}
			// End Resizing

			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			jQuery("#TB_window").append("<a href='' id='TB_ImageOff' title='"+thickboxL10n.close+"'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='"+thickboxL10n.close+"'><div class='tb-close-icon'></div></a></div>");

			jQuery("#TB_closeWindowButton").click(tb_remove);

			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if(jQuery(document).unbind("click",goPrev)){jQuery(document).unbind("click",goPrev);}
					jQuery("#TB_window").remove();
					jQuery("body").append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;
				}
				jQuery("#TB_prev").click(goPrev);
			}

			if (!(TB_NextHTML === "")) {
				function goNext(){
					jQuery("#TB_window").remove();
					jQuery("body").append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);
					return false;
				}
				jQuery("#TB_next").click(goNext);

			}

			jQuery(document).bind('keydown.thickbox', function(e){
				e.stopImmediatePropagation();

				if ( e.which == 27 ){ // close
					if ( ! jQuery(document).triggerHandler( 'qf_CloseOnEscape', [{ event: e, what: 'thickbox', cb: tb_remove }] ) )
						tb_remove();

				} else if ( e.which == 190 ){ // display previous image
					if(!(TB_NextHTML == "")){
						jQuery(document).unbind('thickbox');
						goNext();
					}
				} else if ( e.which == 188 ){ // display next image
					if(!(TB_PrevHTML == "")){
						jQuery(document).unbind('thickbox');
						goPrev();
					}
				}
				return false;
			});

			tb_position();
			jQuery("#TB_load").remove();
			jQuery("#TB_ImageOff").click(tb_remove);
			jQuery("#TB_window").css({'visibility':'visible'}); //for safari using css instead of show
			};

			imgPreloader.src = url;
		}else{//code to show html

			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;

			if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window
					urlNoQuery = url.split('TB_');
					jQuery("#TB_iframeContent").remove();
					if(params['modal'] != "true"){//iframe no modal
						jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='"+thickboxL10n.close+"'><div class='tb-close-icon'></div></a></div></div><iframe allowFullScreen=true allowFullScreen  frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' >"+thickboxL10n.noiframes+"</iframe>");
					}else{//iframe modal
					jQuery("#TB_overlay").unbind();
						jQuery("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'>"+thickboxL10n.noiframes+"</iframe>");
					}
			}else{// not an iframe, ajax
					if(jQuery("#TB_window").css("visibility") != "visible"){
						if(params['modal'] != "true"){//ajax no modal
						jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'><div class='tb-close-icon'></div></a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
						}else{//ajax modal
						jQuery("#TB_overlay").unbind();
						jQuery("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						jQuery("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
						jQuery("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
						jQuery("#TB_ajaxContent")[0].scrollTop = 0;
						jQuery("#TB_ajaxWindowTitle").html(caption);
					}
			}

			jQuery("#TB_closeWindowButton").click(tb_remove);

				if(url.indexOf('TB_inline') != -1){
					jQuery("#TB_ajaxContent").append(jQuery('#' + params['inlineId']).children());
					jQuery("#TB_window").bind('tb_unload', function () {
						jQuery('#' + params['inlineId']).append( jQuery("#TB_ajaxContent").children() ); // move elements back when you're finished
					});
					tb_position();
					jQuery("#TB_load").remove();
					jQuery("#TB_window").css({'visibility':'visible'});
				}else if(url.indexOf('TB_iframe') != -1){
					tb_position();
					jQuery("#TB_load").remove();
					jQuery("#TB_window").css({'visibility':'visible'});
				}else{
					jQuery("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
						tb_position();
						jQuery("#TB_load").remove();
						tb_init("#TB_ajaxContent a.thickbox");
						jQuery("#TB_window").css({'visibility':'visible'});
					});
				}

		}

		if(!params['modal']){
			jQuery(document).bind('keyup.thickbox', function(e){

				if ( e.which == 27 ){ // close
					e.stopImmediatePropagation();
					if ( ! jQuery(document).triggerHandler( 'qf_CloseOnEscape', [{ event: e, what: 'thickbox', cb: tb_remove }] ) )
						tb_remove();

					return false;
				}
			});
		}

	} catch(e) {
		//nothing here
	}
}

//helper functions below
function tb_showIframe(){
	jQuery("#TB_load").remove();
	jQuery("#TB_window").css({'visibility':'visible'});
}

function tb_remove() {
 	jQuery("#TB_imageOff").unbind("click");
	jQuery("#TB_closeWindowButton").unbind("click");
	jQuery("#TB_window").fadeOut("fast",function(){jQuery('#TB_window,#TB_overlay,#TB_HideSelect').trigger("tb_unload").unbind().remove();});
	jQuery("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		jQuery("body","html").css({height: "auto", width: "auto"});
		jQuery("html").css("overflow","");
	}
	jQuery(document).unbind('.thickbox');
	return false;
}

function tb_position() {
	
var isIE6 = typeof document.body.style.maxHeight === "undefined";
jQuery("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
	if ( ! isIE6 ) { // take away IE6
		jQuery("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
	}
}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}
;

/* qfe_composer_front_js: (http://www.artjiahua.com/qfy-content/plugins/qfy_editor/assets/js/qfy_editor_front.js) */
document.documentElement.className += ' js_active ';
document.documentElement.className += 'ontouchstart' in document.documentElement ? ' vc_mobile ' : ' vc_desktop ';
(function(){
    var prefix = ['-webkit-','-o-','-moz-','-ms-',""];
    for (var i in prefix) { if(prefix[i]+'transform' in document.documentElement.style) document.documentElement.className += " vc_transform "; }
})();


function image_lazy_event(){
	if(jQuery("[data-delay-image='1']").length>0){
		 jQuery("[data-delay-image='1']").lazy(
			        {
			        	effect:'fadeIn',
			            effectTime:400,
			            threshold: 800,
			        }
			);
	}
}
function hexToRgb(hex) {
	if(hex=="transparent") return "transparent";
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function vc_js_init(){
	//bind slidercontent
	if(!is_edit_model) {
		if (jQuery(".qfy-element.qfy-slidercontent").length > 0 && jQuery("a[href^='qfylinked_']").length > 0) {
			jQuery("a[href^='qfylinked_']:not(.loaded)").each(function () {
				jQuery(this).addClass("loaded");
				var url = jQuery(this).attr("href");
				url = url.replace("%5E", "^").replace("%5E", "^");

				if (url.indexOf("^") > -1) {
					url = url.substr(10);
					var url_tmp = url.split("^");
					var uuid = url_tmp[0];
					var type = url_tmp[1];
					var to = url_tmp[2];

					if (uuid) {
						var obj = jQuery("[qfyuuid='" + uuid + "']>.royalSlider_gallery_new");
						if (obj.length > 0) {
							if (type == "1") {
								jQuery(this).click(function (e) {
									e.preventDefault();
									e.stopPropagation();
								}).mouseenter(function (e) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								});
							} else {
								jQuery(this).click(function (e) {
									e.preventDefault();
									e.stopPropagation();
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								});
							}
						}
					}
				}
			});

		}
		//
		if (jQuery(".qfy-element.qfe_gallery").length > 0 && jQuery("a[href^='qfyrelaed_']").length > 0) {
			jQuery("a[href^='qfyrelaed_']:not(.loaded)").each(function () {
				jQuery(this).addClass("loaded");
				var url = jQuery(this).attr("href");
				url = url.replace("%5E", "^").replace("%5E", "^");
				if (url.indexOf("^") > -1) {
					url = url.substr(10);
					var url_tmp = url.split("^");
					var uuid = url_tmp[0];
					var type = url_tmp[1];
					var to = url_tmp[2];

					if (uuid) {

						if (type == "1") {

							jQuery(this).click(function (e) {
								e.preventDefault();
								e.stopPropagation();
							}).mouseenter(function (e) {
								var obj = jQuery("[qfyuuid='" + uuid + "'] .royalSlider_gallery");
								if (obj.length > 0) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").flexslider(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .swiper-container").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .swiper-container").data('swiper').slideTo(to);
								}
							});
						} else {
							jQuery(this).click(function (e) {
								e.preventDefault();
								e.stopPropagation();
								var obj = jQuery("[qfyuuid='" + uuid + "'] .royalSlider_gallery");
								if (obj.length > 0) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").flexslider(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .swiper-container").length > 0) {

									jQuery("[qfyuuid='" + uuid + "'] .swiper-container").data('swiper').slideTo(to);
								}
							});
						}
					}
				}
			});

		}
	}

	// BEGIN
	if(jQuery(".swiper-container:not(.loaded)").length>0){
		 if(typeof jQuery.fn.Swiper=="undefined"){
			 jQuery.onDemandScript("/FeiEditor/bitSite/js/swiper/swiper-4.1.0.min.js",function() {
				 jQuery('head').append('<link href="/FeiEditor/bitSite/js/swiper/swiper-4.1.0.min.css" rel="stylesheet" type="text/css" />');
				 swiper_event();
			 })
		 }else{
			 swiper_event();
		 }
	}
	image_lazy_event();

	vc_3d_photo();
	lottieReady(jQuery);
	shape_ready();

	jQuery("#shopping-cart-bitcommerce .carsize:not(.pulse1)").addClass("pulse1");

	jQuery(".srollupdown:not(.load)").each(function(){
		jQuery(this).addClass("load");
		var all = jQuery(this).attr("data-scroll-all");
		var num = jQuery(this).attr("data-scroll-num");
		var speed = jQuery(this).attr("data-scroll-speed");
		var delay = jQuery(this).attr("data-scroll-delay");
		var slideBox = jQuery(this).find("ul:first");

		var allheight = slideBox.css("height").replace("px","")*1;

		var delay = delay||1000,speed = speed||20;
		var tid = null,pause = false;
		var s = function(){		slideBox.attr("style","overflow:hidden !important;height:"+allheight+"px;");slideBox.find("li").removeClass("displaynone");tid=setInterval(slide_scroll, speed); }
		var slide_scroll = function(){
			if(pause) return;
			slideBox.scrollTop(slideBox.scrollTop()+ 2);
			var scrolltop = slideBox.scrollTop();
			if(num>1){
				var first_height = 0;
				var marginbottom =  0;
				slideBox.find("li").each(function(i){
					if(i<num){
						first_height = first_height*1 +jQuery(this).css("height").replace("px","")*1;
						marginbottom =  marginbottom*1 +jQuery(this).css("margin-bottom").replace("px","")*1;
					}
				})
			}else{
				var first_height = slideBox.find("li:eq(0)").css("height").replace("px","");
				var marginbottom =  slideBox.find("li:eq(0)").css("margin-bottom").replace("px","");
			}
			if(scrolltop>=first_height*1+marginbottom*1){
				clearInterval(tid);
				if(num>1){
					slideBox.find("li").each(function(i){
						if(i<num){
							slideBox.append(slideBox.find("li")[0]);
						}
					})
				}else{
					slideBox.append(slideBox.find("li")[0]);
				}
				slideBox.scrollTop(0);
				setTimeout(s, delay);
				}
		}
		slideBox[0].onmouseover=function(){pause=true;}
		slideBox[0].onmouseout=function(){pause=false;}
		setTimeout(s, delay);
	});
	jQuery('.qfy_datatable_event:not(.loaded)').each(function(){
		$this = jQuery(this);
		if(typeof jQuery.fn.DataTable=="undefined"){
			jQuery.onDemandScript("/FeiEditor/bitSite/js/dataTables/jquery.dataTables.js",function() {
				 qfy_dataTable_event($this);
			 })
		}else{
			qfy_dataTable_event($this);
		}
	})
	jQuery(".opentip:not(.played)").each(function(){
		var $this = jQuery(this);
		var imageurl = jQuery(this).attr("op-image");
		if(imageurl&& imageurl.indexOf("http://")>-1){
			imageurl = imageurl.replace("http://","//");
		}
		var title = jQuery(this).attr("op-title");
		var data_pop = jQuery(this).attr("op-style");
		var titlealign = jQuery(this).attr("op-titlealign");
		var stylealign = jQuery(this).attr("op-stylealign");
		var tiptitle= "";
		var download = false;
		if(imageurl){

			tiptitle +="<img style='max-width:100%;' src='"+imageurl+"'  />";
		}
		if(title){
			tiptitle +="<div style='margin-top:5px;text-align:"+titlealign+"'>"+title+"</div>";
		}
		if(stylealign){
			var data = { tipJoint:stylealign, fixed:true,style: data_pop };
		}else{
			var data = { style: data_pop };
		}
		if(imageurl){
			jQuery("<img />").attr("src", imageurl).load(function(){
				setTimeout(function(){new Opentip( $this, tiptitle, data);},1500);
			})
			$this.addClass("played");

		}else{
			new Opentip( $this, tiptitle, data);
			$this.addClass("played");
		}
	})


	if(	jQuery('.qfy-jiathis').length>0){
		if(typeof jQuery.fn.share !="function"){
			 jQuery.onDemandScript("/FeiEditor/bitSite/js/share/jquery.share.min.js",function() {
				 jQuery('head').append('<link href="/FeiEditor/bitSite/js/share/css/share.min.css" rel="stylesheet" type="text/css" />');
				 jQuery('.qfy-jiathis .share').share();
			 })
		}else{
			 jQuery('.qfy-jiathis .share').share();
		}
	}

	var video_len = jQuery('.video.preload:not(.played)').length;
	if(video_len>0){
		jQuery('.video.preload:not(.played)').each(function(){
			if(jQuery("body").width()<760 && video_len==1 ){
				jQuery(this).addClass("played").attr("src",jQuery(this).attr("data-src"));
			}else{
				jQuery(this).waypoint({
					handler: function(direction) {
						jQuery(this).addClass("played").attr("src",jQuery(this).attr("data-src"));
					},
					triggerOnce: true,
					offset: "95%",
				})
			}
		})
	}



	vc_royalSlider_gallery_init();

	if(!is_edit_model){
		accordioncontent();
	}
	if( jQuery('.qfy-accordioncontent').length>0){
		if(typeof accordioncontent_init !="function"){
			jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-accord.js",function() {
				accordioncontent_init();
			});
		}else{
			accordioncontent_init();
		}
	}


	jQuery( ".dl-qfymobile-menu:not(.loaded)" ).each(function(){
		var backCap = jQuery(this).find(".menu-back").html();
		jQuery(this).find(".children.dl-submenu").prepend("<li class='menu-item dl-back'><a href='#'><span>"+backCap+"</a></li>");
		jQuery(this).addClass("loaded").dlmenu();
	})

   if(!is_edit_model){
		jQuery( ".background-media.mediagallery:not(.loaded)" ).each(function(){
			var $this = jQuery(this);
			jQuery(this).addClass("loaded On");
			var imagebgs = jQuery(this).attr("data-imagebgs");

			var imagebgs_arr = imagebgs.split("|^|");
			var imagebgs_count = imagebgs_arr.length;
			var imagebgs_current = 0;
			var time =  jQuery(this).attr("data-time")?jQuery(this).attr("data-time"):3;
			var thishtml = $this.prop("outerHTML");
			var tmp = "";
			for(var i=0;i<imagebgs_count-1;i++){
				$this.before(thishtml);
				$this.prev().css({'opacity':'0','background-image': 'url('+imagebgs_arr[i]+')'}).removeAttr("data-imagebgs").removeClass("On");
			}
			var p =  jQuery(this).parent();
			setInterval(function(){
				if(p.attr("id")){
					imagebgs_current = p.find(".background-media.On").index('#'+p.attr("id")+'>.background-media');
				}else{
					var p_class= p.attr("class");
					var tmpclass = p_class.split(" ");
					var currclass = "";
					for(var i =0;i<tmpclass.length;i++){
						if(tmpclass[i].indexOf("qfy-row")>-1){
							currclass = tmpclass[i];
						}
					}
					if(currclass){
						imagebgs_current = p.find(".background-media.On").index('.'+currclass+' .background-media');
					}else{
						imagebgs_current = p.find(".background-media.On").index('.background-media');
					}
				}
				p.find(".background-media.On").removeClass("On").css({'opacity':'0'})
				if(imagebgs_current==imagebgs_count-1){
					p.find(".background-media:eq(0)").addClass("On").css({'opacity':'1'});
				}else{
					p.find(".background-media:eq("+(imagebgs_current+1)+")").addClass("On").css({'opacity':'1'});
				}
			},time*1000);

		})

	     if(jQuery(".qfy-comments .commentlist:hidden").length>0){
			jQuery(".qfy-comments").each(function(){

				var p = jQuery(this);
				if(p.find(".commentlist:visible").length>0) return;
				var loadhtml = "<div class='commentlist_loading' style='text-align:center;height:30px;margin:15px auto;' ><img src='/qfy-content/plugins/qfbook/templates/default/images/loader.gif' /></div>";
				p.find(".commentlist").after(loadhtml);

				var form =p.find("form#commentform");
				var comment_post_ID = form.find("#comment_post_ID").val();
				var url  = form.attr("action");

				jQuery.post(url,{action:"search",comment_post_ID:comment_post_ID,short_atts:p.attr("data-atts")},function(data){
					if(data.indexOf("success")>-1){

						var tmp = data.split('|<result>|');
						var commentlist = $(tmp).find(".commentlist");
						p.find(".commentlist").html(commentlist.html());
					}
					p.find(".commentlist").show();
					p.find(".commentlist_loading").remove();
				})

			})
		}
	}
	if(typeof qfy_canvas_animale_run=="function"){
		qfy_canvas_animale_run();
	}
	var objs = jQuery(".qfy-icons_list .qfy-icon");
	objs.each(function(){
		var obj = jQuery(this);
		var name = obj.attr("data-desc");
		var bg = obj.attr("data-bg");
		var bgstyle= "";
		if(bg ){
			bgstyle = "background:"+bg+";margin:-20px;padding:20px;";
		}
		var image = obj.attr("data-image");
		var tj = obj.attr("data-tj")=="0"?"top":"bottom";
		var ta = obj.attr("data-ta");
		var width = obj.attr("data-width");
		var align="left";
		if(ta=="1") align="right";
		else if(ta=="2") align="center";
		obj.attr("title", '');
		var text = "";
		if(name){
			text ="<div style='text-align:"+align+";'>"+base64_decode(name)+"</div>";
		}
		if(image){
			if(width){
				var title ="<div style='width:"+width+"px;text-align:center;"+bgstyle+"'><img src='"+image+"' style='max-width:100%;' /><div style='word-break: break-all;'>"+text+"</div></div>";
			}else{
				var title ="<div style='text-align:center; "+bgstyle+" '><img src='"+image+"' width='160' style='max-width:100%;' /><div style='word-break: break-all;'>"+text+"</div></div>";
			}
			var img = new Image();
	        img.onload = img.onerror =function() {
	        	var data = { tipJoint: tj,style: "dark" };
				setTimeout(function(){
						new Opentip(obj, title, data);

					},300);


	        };
	        img.src = image;

		}else if(text){
			if(width){
				var last = "<div style='width:"+width+"px;word-break: break-all;"+bgstyle+"'>"+text+"</div>";
			}else{
				var last = "<div style='word-break: break-all;"+bgstyle+"'>"+text+"</div>";
			}

			var data = { tipJoint: tj,style: "dark" };
			new Opentip(obj, last, data);

		}


	})
	jQuery(".qfyvideo").unbind().mouseenter(function(){
		 if(! jQuery(this).parent().hasClass("list_popup")){
			 jQuery(this).get(0).play();
		 }
     }).mouseleave(function(){
    	 if(! jQuery(this).parent().hasClass("list_popup")){
	    	 if(jQuery(this).get(0).currentTime>0){
	    		 jQuery(this).get(0).load();
	    	 }
    	 }
     })


	 jQuery('[data-ride="vc-carousel"]').each(function(){
				qfy_carousel_fun(jQuery(this))
		})
	jQuery(".qfy_scroll_box:not(.load)").each(function(){
		jQuery(this).addClass("load");
		var box = jQuery(this).attr("id");
		var delay = jQuery(this).attr("data-delay");
		var speed = jQuery(this).attr("data-speed");
		var h = jQuery(this).attr("data-h");
		slideLine(box,"div",delay,speed,h);
	});
	if(!is_edit_model){
		jQuery("a[href^='qfy_notice']").each(function(){
			var id = jQuery(this).attr("href");
			jQuery(this).attr("data-href",id);
			jQuery(this).removeAttr("href");
			jQuery(this).unbind().click(function(e){
				e.preventDefault();
				e.stopPropagation();

				if(jQuery("#"+id).length>0){
					notice_pre_event("#"+id+" .notice_warp","preview");
				}
			})
		});
	}else{
		jQuery("a[href^='qfy_notice']").unbind().click(function(e){
			 e.preventDefault();
			 e.stopPropagation();
			 var id = jQuery(this).attr("href");
			 if(jQuery("#"+id).length>0){
				 notice_pre_event("#"+id+" .notice_warp","preview");
			 }
		})
	}

	jQuery(".qfyanimate:not(.qfyanimated)").each(function(){
		var animaleinbegin =  jQuery(this).attr("data-animaleinbegin");
		if(!animaleinbegin) animaleinbegin = "bottom-in-view";
 		jQuery(this).waypoint({
			handler: function(direction) {
				var delay = jQuery(this).attr("data-delay");
				var duration = jQuery(this).attr("data-duration");
				if(delay===""){
					// 列使用
					if(jQuery(this).hasClass("qfy-column-inner")){
						delay = jQuery(this).index()*0.1/2;
					}
				}
				var animalename = jQuery(this).attr("data-animalename");
				if(duration){
					jQuery(this).css("animation-duration",duration+"s");
				}
				jQuery(this).css("animation-delay",delay+"s").css("animation-name",animalename).css("visibility","visible");
				jQuery(this).addClass("qfyanimated");
			},
			triggerOnce: true,
			offset: animaleinbegin,
		})
	})
	jQuery(".clippathanimate:not(.clippathanimated)").each(function(){

		jQuery(this).waypoint({
			handler: function(direction) {
				jQuery(this).addClass("clippathanimated");
			},
			offset: "bottom-in-view",
		})
	});

	if( jQuery(".auto_tab_menu").length>0){
		jQuery(".auto_tab_menu").each(function(){
			auto_tab_menu(jQuery(this));
		});
	}

	typed_event();

	prenext_event();
	// END
}
function vc_js_init2(){
	 // console.trace();
	 init_usermange_detail();
	  vc_slidersBehaviour();
	  vc_waypoints();
	  vc_teaserGrid();
	  vc_carouselBehaviour();
	  vc_plugin_flexslider();
	  resizefullpageheader();
	  bitLibLayout();
	  bit_circliful();
	  bit_counter();
	  bit_counterdown();
	  bit_newgallery();
	  qfy_jplayer_init();
	  bit_myaccountLayout();
	  bit_qfbook();
	  bit_qfbookform();
	  setTimeout(function(){  bit_reloadiframevideo();},1000);
}
var is_edit_model = false;
try{
	if( parent.jQuery("#vc-inline-frame").length==1 ){
		is_edit_model = true;
	}
}catch(e){
}
jQuery(document).ready(function($) {

  if(!is_edit_model){
	  vc_js_init();
	  vc_js_init2();
  }
  jQuery(document).click(function(e) {
	 if(jQuery("body.clicktoaddmodel").length>0){
		 var target = jQuery(e.target);
		 if(target.closest(".vc-element.vc-vc_row").length==0){
			jAlert("亲，您点在了不能插入区块的地方。请选择内容区域的一个区块。");
			return false;
		 }
	 }
  });

}); // END jQuery(document).ready
jQuery(window).resize(function() {
	 // 手机上滚动会触发这个resize
	 var body_width = jQuery("body").width();
	 if(body_width>768){
		 bitLibLayout();
	 }
	 var maxwidth = 0;
	 jQuery(".qfe_gallery .qfe_gallery_slides").find('img').each(function(){
		if(jQuery(this).width()>maxwidth){
			maxwidth = jQuery(this).width();
		}
	 })
	 if(maxwidth>body_width) {
		 vc_plugin_flexslider();
	 }
});
jQuery(window).on("debouncedresize", function() {
		jQuery(".ts-circliful-counter").each(function() {
			if ("true" == jQuery(this).attr("data-responsive")) {
				var t = jQuery(this),
					e = parseInt(jQuery(this).parent().width()),
					a = parseInt(jQuery(this).attr("data-size"));
				e != a && (t.empty(), t.circliful())
			}
		})
});
function resizefullpageheader(){
	if(jQuery(".bit-html .fullscreenpage.fullpage_layout2").length>0||jQuery(".bit-html .fullscreenpage.fullpage_layout3").length>0||jQuery(".bit-html .fullscreenpage.fullpage_layout4").length>0){
		jQuery(".bit-html .fullscreenpage #fullscreenheader").css("margin-top","-"+(jQuery(".bit-html .fullscreenpage #fullscreenheader").height()/2)+"px");
	}
}
function typed_event(){
	if(jQuery(".qfy-simple_header:not(.loaded)").length==0) return;
	if(typeof Typed!="function"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/typed.min.js",function() {
			 _typed_event();
		 })
	 }else{
		 _typed_event();
	 }
}
function prenext_event(){
	var lrmiddlelayout = jQuery(".lrmiddlelayout:first:not(.loaded)");
	 var body_width = jQuery("body").width();

	if(lrmiddlelayout.length>0 ){

		lrmiddlelayout.addClass("loaded");
		 jQuery(".lrmiddlelayout.wrap").remove();
		var pre_html = '<div class="lrmiddlelayout wrap" style="position: fixed;top:35%;left:0px;z-index:4;display:table;"><div class="prenext_inner" style="width:auto;">';
		pre_html += lrmiddlelayout.find(".pre_inner").prop("outerHTML");
		pre_html += '</div></div>';
		var next_html = '<div class="lrmiddlelayout wrap" style="position: fixed;top:35%;right:0px;z-index:4;display:table;"><div class="prenext_inner" style="width:auto;">';
		next_html += lrmiddlelayout.find(".next_inner.first").prop("outerHTML");
		next_html += '</div></div>';
		if(lrmiddlelayout.hasClass("mobileHidden") && body_width<768){

		}else if(lrmiddlelayout.hasClass("desktopHidden") && body_width>768){

		}else{
			jQuery("body").append(pre_html+next_html);
		}
	}
	if( jQuery(".lrmiddlelayout").length==0){
		jQuery(".lrmiddlelayout.wrap").remove();
	}
}
function bit_circliful(obj){

	if( "undefined" != typeof obj ){
		obj = obj.find(".ts-circliful-counter:not(.loaded)");
	}else{
		obj	= jQuery(".ts-circliful-counter:not(.loaded)");
	}
	if(obj.length==0) return;
	if(typeof jQuery.fn.circliful=="undefined"){
		jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/js/jquery.circliful.min.js",function() {
			_bit_circliful(obj);
		 })
	}else{
		_bit_circliful(obj);
	}

}
function _bit_circliful(obj){
	"undefined" != typeof jQuery.fn.waypoint && "undefined" != typeof jQuery.fn.circliful && obj.each(function() {
		jQuery(this).bind("inview", function(t, e, a, i) {
			if (e) {
				var r = jQuery(this);
				"top" == i || "bottom" == i || r.addClass("ts-circliful-visible")
			} else {
				var r = jQuery(this);
				r.removeClass("ts-circliful-visible")
			}
		})

		jQuery(this).addClass("loaded").circliful();

	});
}
function formatNumber(s,o){
	 s = s+"";
	 if(/[^0-9\.]/.test(s)) return false;
        s=s.replace(/^(\d*)$/,"$1.");
        s=s.replace(".",o);
        var re=/(\d)(\d{3},)/;
        while(re.test(s))
                s=s.replace(re,"$1,$2");
        s=s.replace(/,(\d\d)$/,".$1");
		s=s.substring(0,s.length-1);
        return s;
}
function bit_counter(obj){
	if( "undefined" != typeof obj ){
		obj = obj.find(".ts-icon-counter");
		if(obj.length==0) return false;
	}else{
		obj	= jQuery(".ts-icon-counter");
	}
	if(obj.length==0) return;
	 if(typeof jQuery.fn.countTo=="undefined"){
		 jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/js/jquery.countto.min.js",function() {
			 _bit_counter(obj);
		 })
	 }else{
		 _bit_counter(obj);
	 }
}
function bit_newgallery(obj){
	if( "undefined" != typeof obj ){
		obj = obj.find(".royalSlider_gallery");
		if(obj.length==0) return false;
	}else{
		obj	= jQuery(".royalSlider_gallery");
	}
	 if(obj.length==0) return;
	 if(typeof jQuery.fn.royalSlider=="undefined"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/jquery.royalslider.min.js",function() {
			 _bit_newgallery(obj);
		 })
	 }else{
		 _bit_newgallery(obj);
	 }
}
function fullscreenclick(obj){
	jQuery(obj).closest(".royalSlider_gallery").find(".rsFullscreenIcn").click();
}
function bit_myaccountLayout(){
	var defaultindex=getCookie("qfy_order_index");

	if(jQuery(".qfy_account.tablayout").length>0 && jQuery(".qfy_account.tablayout.ontab").length==0){
		jQuery(".qfy_account > .bitcommerce").append('<div class="bitcommerce-tabs tabbed-content bitcommerce-tabs-info" style="min-height:500px;"><ul class="tabs"></ul></div>	');

		jQuery(".qfy_account .my_account_orders_h2").each(function(i){
			var name = jQuery(this);
			var content = jQuery(this).next();
			if(content.hasClass("my_account_orders_h2")||content.hasClass("bitcommerce-tabs-info")||content.length==0){
				content_html = '<div style="min-height:400px;"></div>';
			}else{
				content_html = content.prop('outerHTML');
				content.remove();
			}
			jQuery( '.bitcommerce-tabs-info ul.tabs' ).append('<li class="description_tab active"><a href="#tab-info-'+i+'" class="no-opennew">'+name.text()+'</a></li>');
			jQuery( '.bitcommerce-tabs-info ul.tabs' ).after('<div style="word-break: break-all; display: block;" id="tab-info-'+i+'" class="panel entry-content">'+content_html+'</div>');
			name.remove();

		});
		jQuery(".qfy_account.tablayout").addClass("ontab");
		var titlesize = jQuery(".qfy_account.tablayout").attr("data-size");
		if(titlesize){
			jQuery( '.bitcommerce-tabs-info ul.tabs li a' ).css("font-size",titlesize+"px");
		}
		jQuery( '.bitcommerce_account_subscriptions').hide();
		jQuery( '.bitcommerce-tabs-info .panel' ).hide();
		jQuery( '.bitcommerce-tabs-info ul.tabs li a' ).click( function() {

			var $tab = jQuery( this ),
				$tabs_wrapper = $tab.closest( '.bitcommerce-tabs-info' );

			jQuery( 'ul.tabs li', $tabs_wrapper ).removeClass( 'active' );
			jQuery( 'div.panel', $tabs_wrapper ).hide();
			jQuery( 'div' + $tab.attr( 'href' ), $tabs_wrapper).show();
			$tab.parent().addClass( 'active' );
			var index = $tab.parent().index();
			qfy_setCookie("qfy_order_index",index);
			return false;
		});
		if(defaultindex>0){
			jQuery( '.bitcommerce-tabs-info ul.tabs li:eq('+defaultindex+') a' ).click();
		}else{
			jQuery( '.bitcommerce-tabs-info ul.tabs li:first a').click();
		}
	}

}
function bit_qfbook(){
	setTimeout(function(){
		jQuery(".QFBOOKCalendar-text-message").each(function(){
			var $this = jQuery(this);
			var id = $this.attr("id");
			var val = $this.val();
			jQuery("#QFBOOKCalendar"+id).QFBOOKCalendar(jQuery.parseJSON(val));

		})
		jQuery(".QFBOOKCalendar-search-message").each(function(){
			var $this = jQuery(this);
			var id = $this.attr("id");
			var val = $this.val();
			jQuery(".QFBOOKSearch-wrapper"+id).QFBOOKSearch(jQuery.parseJSON(val));

		})
	},500)
}
function bit_qfbookform(){
	if(jQuery('#QFBOOKSearch-check-in-input').length>0){
		jQuery('#QFBOOKSearch-check-in-input').datepicker({minDate: new Date(), onSelect:function(dateText,inst){
	       jQuery("#QFBOOKSearch-check-out-input").datepicker("option","minDate",dateText);
	    }});
	}
	if(jQuery('#QFBOOKSearch-check-out-input').length>0){
	    jQuery('#QFBOOKSearch-check-out-input').datepicker({minDate: new Date(), onSelect:function(dateText,inst){
	       jQuery("#QFBOOKSearch-check-in-input").datepicker("option","maxDate",dateText);
	    }});
	}
}
function bit_reloadiframevideo(time){
	if(jQuery("div.ts_html5_video_frame_insert").length>0){
		jQuery("div.ts_html5_video_frame_insert").each(function(){
			var $this = jQuery(this);
			var auto_play = $this.attr("data-auto-play");
			if(auto_play=="true") {
				$this = $this.changeTag("iframe");
			}else if(auto_play=="2"){
				$this.parent().mouseenter(function(){
					$this.changeTag("iframe").attr("data-auto-play","true");
				});
			}else if(auto_play=="3"){
				$this.waypoint(function () {
					$this.changeTag("iframe").attr("data-auto-play","true");
				}, {offset: '85%'});
			}else{
				$this.unbind().click(function(){
					$this.changeTag("iframe").attr("data-auto-play","true");
				})
			}
		})
	}
	if(jQuery(".ts_html5_video_frame .video-box video.visible_play").length>0){
		jQuery(".ts_html5_video_frame .video-box video.visible_play").each(function(){
			var video = jQuery(this).get(0);
			jQuery(this).waypoint(function () {
				if (video.paused === false) {
					video.pause();
				} else {
					video.play();
				}
			}, {offset: '85%'});
		});
	}
}
function qfy_jplayer_init(){
	 if( jQuery(".vc_jplayer_container:not(.played)").length==0) return;
	 if(typeof jQuery.fn.videoPlayer=="undefined"){
			 jQuery.when(
				 jQuery.getScript( "/FeiEditor/bitSite/js/jsplayer/jplayer/jquery.jplayer.min.js" ),
				 jQuery.getScript( "/FeiEditor/bitSite/js/jsplayer/jplayer/jplayer.cleanskin.js" ),
				 jQuery.Deferred(function( deferred ){
					 jQuery( deferred.resolve );
			    })
			).done(function(){
				 _qfy_jplayer_init();
			});

	 }else{
		 _qfy_jplayer_init();
	 }

}
function _qfy_jplayer_init(){
	// 音频
	jQuery(".vc_jplayer_container:not(.played)").each(function(){
		var title = jQuery.trim(jQuery(this).find(">.audio-info").html());
		var mp3 = jQuery(this).find(">.audio-info").attr("data-mp3");
		var autoplay =  jQuery(this).find(">.audio-info").attr("data-auto");
		if(autoplay!=1) autoplay=null;
		var loop =  jQuery(this).find(">.audio-info").attr("data-loop");
		if(loop==1){loop=true;}else{loop=false;};
		jQuery(this).find('>.webPlayer').videoPlayer({
				"name": title,
				"autoplay":autoplay,
				"keyEnabled":false,
				"loop":loop,
				"swfPath":"/FeiEditor/bitSite/js/jsplayer/jplayer",
				"size": {"width": "100%",},
				"media": {"mp3": mp3}
				});
		jQuery(this).addClass("played");
	})
}
function bit_counterdown(){
	 if(jQuery(".ts-countdown-parent").length==0) return;
	 if(typeof jQuery.fn.countEverest=="undefined"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/jquery.vcsc.counteverest.min.js",function() {
			 jQuery('head').append('<link href="/FeiEditor/bitSite/css/jquery.vcsc.counteverest.min.css" rel="stylesheet" type="text/css" />');
			 _bit_counterdown();
		 })
	 }else{
		 _bit_counterdown();
	 }
}

function bitLibLayout(obj){
   jQuery(".old-ie [backgroundSize='true']").css({backgroundSize: "cover"});

   if (typeof obj === 'undefined') {
		obj = jQuery(".qfe_images_lib_isotope")
   }

   obj.each(function () {
	   var current_obj = jQuery(this);
	   var curr_action = current_obj.attr("data-liblayout");
	   var filter = jQuery(this).parent().find(".isotope_image");
	   filter.each(function(){
			jQuery(this).unbind("click").bind("click",function(){
				 var f = jQuery(this).attr("data-filter");
				 var c = jQuery(this).closest(".vcgroup").attr("data-color");
				 var hc = jQuery(this).closest(".vcgroup").attr("data-hovercolor");
				 filter.removeClass("on");
				 filter.css("color",c);
				 jQuery(this).addClass("on");
				 jQuery(this).css("color",hc);
				if(curr_action=="" || curr_action=="undefined"){
					current_obj.find(">.vc-item").hide();
					current_obj.find(f).show();
				}else{

				   current_obj.isotope({
					filter: f
				   });
				}
		   }).bind("mouseover",function(){
				 var hc = jQuery(this).closest(".vcgroup").attr("data-hovercolor");
				 if( !jQuery(this).hasClass("on")){
					jQuery(this).css("color",hc);
				 }

		   }).bind("mouseout",function(){
				 var c = jQuery(this).closest(".vcgroup").attr("data-color");
				 if( !jQuery(this).hasClass("on")){
					jQuery(this).css("color",c);
				 }

		   })
	   });
   });

	if(typeof jQuery.fn.isotope!="undefined") {
		var action = obj.attr("data-liblayout");
		var columnWidth = obj.attr("data-width");

		if (obj.length == 0 || action == "" || action == "undefined") {
			return false;
		}
		obj.isotope({
			itemSelector: '.vc-item',
			layoutMode: action,
			filter: ".images,.templates"

		});

		var all_load = true;

		obj.find('img').each(function () {
			if (!jQuery(this).prop('complete')) {
				all_load = false;
			}
		});

		if (!all_load) {
			window.setTimeout(function () {
				bitLibLayout(obj);
			}, 500);
			return;
		}
		obj.isotope("reLayout");
	}
}


if ( typeof window['vc_plugin_flexslider'] !== 'function' ) {
	function vc_plugin_flexslider() {
		if (jQuery('.qfe_flexslider').length == 0) return;
		if (typeof jQuery.fn.flexslider == "undefined") {
			jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/assets/lib/flexslider/jquery.flexslider-min.js",function () {
				jQuery('head').append('<link href="/qfy-content/plugins/qfy_editor/assets/lib/flexslider/flexslider.css" rel="stylesheet" type="text/css" />');
				_vc_plugin_flexslider();
			})
		} else {
			_vc_plugin_flexslider();
		}
	}
}
function qfy_carousel_fun($carousel) {

	var is_carousel_ok = true;
	$carousel.find('img').each(function () {
		if (!jQuery(this).prop('complete')) {
			is_carousel_ok = false;
		}

	})
	if (!is_carousel_ok) {
		window.setTimeout(function () {
			qfy_carousel_fun($carousel);
		}, 500);
		return;
	}

	$carousel.carousel($carousel.data());
}


/*
 * Waypoints magic ----------------------------------------------------------
 */
if (typeof window['vc_waypoints'] !== 'function') {
	function qfe_animate_fun($this) {

		var p = jQuery($this).closest(".qfy-element");
		var delay = p.attr("css_animation_delay");
		var anitime = p.attr("data-anitime");
		var anilength = p.attr("data-anilength");
		var iteration_count = p.attr("data-ani_iteration_count");
		if (anitime && anitime > 0) {
			jQuery($this).css("animation-duration", anitime + "s");
			jQuery($this).css("-webkit-animation-duration", anitime + "s");
		}
		jQuery($this).removeClass("anlength1 anlength2");
		if (anilength && anilength != 0) {
			jQuery($this).addClass(anilength);
		}
		if (iteration_count == "-1") {
			jQuery($this).css("animation-iteration-count", "infinite");
		} else if (iteration_count > 0) {
			jQuery($this).css("animation-iteration-count", iteration_count);
		}
		if (delay) {
			//出现这里需要
			setTimeout(function () {
				jQuery($this).addClass('qsa');
			}, delay * 1000);
		} else {
			if (jQuery($this).hasClass("delay1")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 1000);
			} else if (jQuery($this).hasClass("delay0.5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 500);
			} else if (jQuery($this).hasClass("delay1.5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 1500);
			} else if (jQuery($this).hasClass("delay2")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 2000);
			} else if (jQuery($this).hasClass("delay3")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 3000);
			} else if (jQuery($this).hasClass("delay4")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 4000);
			} else if (jQuery($this).hasClass("delay5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 5000);
			} else if (jQuery($this).hasClass("delay6")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 6000);
			} else {
				jQuery($this).addClass('qsa');
			}
		}

	}

	function qfe_animate_fun_new($this, type) {

		var p = jQuery($this).closest(".qfy-element");
		var delay = p.attr("data-anidelay_" + type);
		var anitime = p.attr("data-anitime_" + type);
		var anilength = p.attr("data-anilength_" + type);
		var iteration_count = p.attr("data-ani_iteration_count_" + type);

		if (anitime && anitime > 0) {
			jQuery($this).css("animation-duration", anitime + "s");
			jQuery($this).css("-webkit-animation-duration", anitime + "s");
		}
		jQuery($this).removeClass("anlength1 anlength2");
		if (anilength && anilength != 0) {
			jQuery($this).addClass(anilength);
		}

		if (delay) {
			jQuery($this).css("animation-delay", delay + "s");
			jQuery($this).css("-webkit-animation-delay", delay + "s");
		}
		if (iteration_count == "-1") {
			jQuery($this).css("animation-iteration-count", "infinite");
		} else if (iteration_count > 0) {
			jQuery($this).css("animation-iteration-count", iteration_count);
		}

	}

	var qfy_animateEvent_start = function () {
		var el = document.createElement('div');
		var map = {
			animation: 'animationstart',
			MozAnimation: 'animationstart',
			WebkitAnimation: 'webkitAnimationStart'
		};

		for (var name in map) {
			if (el.style[name] !== undefined) {
				return map[name];
			}
		}
	}();
	var qfy_animateEvent_end = function () {
		var el = document.createElement('div');
		var map = {
			animation: 'animationend',
			MozAnimation: 'animationend',
			WebkitAnimation: 'webkitAnimationEnd'
		};

		for (var name in map) {
			if (el.style[name] !== undefined) {
				return map[name];
			}
		}
	}();

	function qfy_animate_out($this) {
		var outs = new Array("qfe_ttbout", "qfe_ttbout-1", "qfe_ttbout-2", "qfe_bttout", "qfe_bttout-1", "qfe_bttout-2", "qfe_ltrout", "qfe_ltrout-1", "qfe_ltrout-2", "qfe_rtlout", "qfe_rtlout-1", "qfe_rtlout-2", "SlideOutDown", "SlideOutLeft", "SlideOutRight", "popOut", "popOutUp", "popOutDown", "popOutLeft", "popOutRight", "fadeOut", "fadeOutUp", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "zoomOut", "zoomOutUp", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "flipOutX", "flipOutY", "hinge", "rotateOut");
		jQuery($this)[0].addEventListener(qfy_animateEvent_end, function (e) {
			if (jQuery.inArray(e.animationName, outs) > -1) {
				jQuery($this).addClass("anihide");
			}
		}, false);
	}

	function vc_waypoints() {

		if (typeof resetSectionHeight !== 'undefined') resetSectionHeight();
		if (typeof jQuery.fn.waypoint !== 'undefined') {
			jQuery('.qfe_animate_when_almost_visible:not(.qsa)').waypoint(function () {
				if (jQuery(this).hasClass("qfe_tohide")) {
					if (!is_edit_model) {
						jQuery(this).closest(".qfy-element").addClass("anihide");
					}
					jQuery(this).addClass('qsa');

				} else {
					qfe_animate_fun(this);
					if (!is_edit_model) {
						qfy_animate_out(this);
					}
				}
			}, {offset: '85%'});

		}
		jQuery("[data-ani_c]").each(function () {

			var to = jQuery(this).attr("data-ani_c_element");
			var c_fun = function ($this) {
				if (jQuery($this).attr("data-ani_c") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_c") + "_c");
				qfe_animate_fun_new($this, "c");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_c").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).click(function () {
						c_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').click(function () {
						c_fun($this);

					});
				}

			} else {
				jQuery(this).click(function () {
					c_fun($this);

				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});
		jQuery("[data-ani_h]").each(function () {
			var to = jQuery(this).attr("data-ani_h_element");
			var h_fun = function ($this) {
				if (jQuery($this).attr("data-ani_h") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_h") + "_h");
				qfe_animate_fun_new($this, "h");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_h").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).mouseenter(function () {
						h_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').mouseenter(function () {
						h_fun($this);

					});
				}
			} else {
				jQuery(this).mouseenter(function () {
					h_fun($this);

				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});

		jQuery("[data-ani_l]").each(function () {
			var to = jQuery(this).attr("data-ani_l_element");
			var h_fun = function ($this) {
				if (jQuery($this).attr("data-ani_l") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_l") + "_l");
				qfe_animate_fun_new($this, "l");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_l").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).mouseleave(function () {
						h_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').mouseleave(function (e) {
						h_fun($this);
					});
				}
			} else {
				jQuery(this).mouseleave(function (e) {
					h_fun($this);
				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});


	}
}

/*
 * Teaser grid: isotope
 * ----------------------------------------------------------
 */
if (typeof window['vc_teaserGrid'] !== 'function') {

	function vc_teaserGrid() {

		var layout_modes = {
			fitrows: 'fitRows',
			masonry: 'masonry'
		}
		if (jQuery(".list-style9").length > 0) {
			jQuery(".list-style9").each(function () {
				vc_isotope_init_load(jQuery(this).find(".vc-carousel-slideline-inner"));
			})

		}
		if (jQuery("body.compose-mode").length == 1) {
			jQuery(".vc-element .vc_ca_post_id a:not(.cate)").each(function () {
				if (!jQuery(this).hasClass("thickbox")) {
					var href = jQuery(this).attr("href");
					jQuery(this).removeAttr("href");
					var p = jQuery(this).closest(".vc_ca_post_id");
					jQuery(this).unbind("click").bind("click", function () {
						top.menuRedirect(href, p);
						return false;
					})
				}
			})

			if (top.jQuery && !top.jQuery("body").hasClass("caterole")) {
				jQuery(".content-wrapper .vc-element .vc_ca_post_id").mouseenter(function () {

					jQuery(this).css("outline", "2px dotted #5E87B0");
					if (jQuery(this).find(".vc_list_edit_button").length == 0) {
						if (jQuery(this).find(".blog-media .toEditor,#item_block .toEditor").length == 0) {
							jQuery(this).find(".blog-media,#item_block").append("<span class='toEditor' ><span class='edit e_copy' style='display:inline' onclick='toCopy(this)'>复制</span><span class='edit e_edit' style='display:inline' onclick='toVisit(this)'>打开</span><!--<span class='edit e_delete' style='display:inline' onclick='toDelete(this)'>删除</span>--></span>");
						}
						if (jQuery(this).closest(".vc-element").attr("data-model-id")) {
							var editname = "更换图片";
							if (jQuery(this).closest(".qfy-element").attr("data-post") == "attachment") {
								editname = "编辑";
							}
							jQuery(this).find(".blog-media").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_scrolllist_image_element\")' title='修改样式，格式'>设置</span>");
							jQuery(this).find(".item_img").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_advanced_image_element\")' title='修改样式，格式'>设置</span>");
							var p = jQuery(this);
							if (p.find(".post-title").length > 0 && p.find(".post-title .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_title_element\')" title="修改样式，格式"></span>';
								var title = p.find(".post-title");

								if (p.find(".post-title >a").length > 0) {
									var title = jQuery(this).find(".post-title >a");
									if (title.html() && title.html().length > 15) {
										var newtitle = title.html().substr(0, title.html().length - 6);
										title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
									}
									p.find(".post-title >a:first").append(actionstr);
								} else {
									var title = jQuery(this).find(".post-title >span:first");
									if (title.html() && title.html().length > 15) {
										var newtitle = title.html().substr(0, title.html().length - 6);
										title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
									}
									p.find(".post-title >span:first").append(actionstr);
								}
							}
							if (p.find(".post_excerpt").length > 0 && p.find(".post_excerpt .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_text_element\')" title="修改样式，格式"></span>';
								if (p.find(".post_excerpt >p").length > 0) {
									p.find(".post_excerpt >p").append(actionstr);
								} else {
									p.find(".post_excerpt").append(actionstr);
								}

							}

							if (jQuery(this).find(".title").length > 0 && jQuery(this).find(".title .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_title_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".title").append(actionstr);

							}
							if (jQuery(this).find(".details").length > 0 && jQuery(this).find(".details .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_details_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".details").append(actionstr);

							}
							if (jQuery(this).find(".subtitle").length > 0 && jQuery(this).find(".subtitle .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_subtitle_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".subtitle").append(actionstr);

							}

							if (jQuery(this).find(".post_date").length > 0 && jQuery(this).find(".post_date .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_postdate_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".post_date").append(actionstr);

							}

							if (jQuery(this).find(".price_warp").length > 0 && jQuery(this).find(".price_warp .vc_list_edit_action").length == 0) {
								var current_pid = jQuery(this).attr("data-postid");
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.bitSettingsEdit(' + current_pid + ',\'设置商品\', \'product\');" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_price_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".price_warp").append(actionstr);

							}
						}
					}
				}).mouseleave(function () {
					jQuery(this).css("outline", "0").find(".vc_list_edit_action").remove();
					jQuery(this).find(".blog-media,#item_block").find(".toEditor").remove();
					jQuery(this).find(".edittitle").remove();
					jQuery(this).find(".hidetitle").each(function () {
						var t = jQuery(this).html();
						jQuery(this).parent().html(t);
					})
				});

				if (jQuery(".product-content.single-product").length == 0) {
					jQuery(".bitcommerce-main-image,.wd_product_wrapper .product_a").mouseenter(function () {
						jQuery(this).removeAttr("href").append("<span class='toEditor' style='right:0;width:100px;'><span class='edit' style='display:inline' onclick='toEditProduct(this)'><i class='glyphicon glyphicon-edit'></i>数据</span><span style='display:inline' class='delete' onclick='toRedirectProduct(this)'><i class='glyphicon glyphicon-forward'></i>页面</span></span>");
					}).mouseleave(function () {
						jQuery(this).find(".toEditor").remove();
					});
				}
			}
			jQuery('.content-wrapper .qfy-listcatecontrols li').each(function () {
				var $li = jQuery(this);
				$li.mouseenter(function () {
					jQuery(this).css("outline", "1px dotted #5E87B0");
					if (jQuery(this).find(".toEditor").length == 0) {
						jQuery(this).append("<span class='toEditor' style='border:0;padding:0;'><span  style='display:inline;border:0;padding:0;background:transparent;' onclick='toDeleteCate(this)'><img src='//f.goodq.top/FeiEditor/bitSite/images/close_hover.png' /></span>");
					}
				}).mouseleave(function () {
					jQuery(this).css("outline", "0");
					jQuery(this).find(".toEditor").remove();
				});

			});
		}


		jQuery('.qfe_grid .teaser_grid_container:not(.qfe_carousel), .qfe_filtered_grid .teaser_grid_container:not(.qfe_carousel)').each(function () {
			var $container = jQuery(this);

			var $thumbs = $container.find('.qfe_thumbnails');
			var layout_mode = $thumbs.attr('data-layout-mode');

			// ..
			if (jQuery("body.compose-mode").length == 1) {
				var p = $container.closest(".qfy-element");
				var iscontent = $container.closest(".content-wrapper");
				// && $thumbs.closest(".vc-element").length>0
				if (self!=top && typeof top.jQuery=="function" && !top.jQuery("body").hasClass("caterole")) {
					$thumbs.find(".isotope-item").mouseenter(function () {
						if (iscontent.length == 0) return;
						jQuery(this).css("outline", "2px dotted #5E87B0");
						if (jQuery(this).find(".vc_list_edit_button").length == 0) {
							var editor_html = "<span class='toEditor' ><span class='edit e_set' style='display:inline' onclick='parent.toeditlistmore(this,event,\"vc_list_element_ui\");'>设置</span><span class='edit e_copy' style='display:inline' onclick='toCopy(this)'>复制</span><span class='edit e_edit' style='display:inline' onclick='toVisit(this)'>打开</span><!--<span class='edit e_delete' style='display:inline' onclick='toDelete(this)'>删除</span>--></span>"

							jQuery(this).append(editor_html);
							// <span class='edit' style='display:inline'
							// onclick='toEditor(this)'><i class='glyphicon
							// glyphicon-edit'></i>编辑</span>
							if ($container.closest(".vc-element").attr("data-model-id")) {
								jQuery(this).find(".post-thumb").css("position", "relative");
								var editname = "更换图片";
								if (jQuery(this).closest(".qfy-element").attr("data-post") == "attachment") {
									editname = "编辑";
								}
								jQuery(this).find(".post-thumb").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_list_image_element\")' title='修改样式，格式'>设置</span>");
								if (jQuery(this).find(".post-title").length > 0 && jQuery(this).find(".post-title .vc_list_edit_action").length == 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;" onclick="parent.toeditlistmore(this,event,\'vc_list_title_element\')" title="修改样式，格式"></span>';
									if (jQuery(this).find(".post-title >a").length > 0) {
										var title = jQuery(this).find(".post-title >a");
										if (title.html() && title.html().length > 15) {
											var newtitle = title.html().substr(0, title.html().length - 6);
											title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
										}
										jQuery(this).find(".post-title >a:first").append(actionstr);
									} else {
										var title = jQuery(this).find(".post-title >span:first");
										if (title.html() && title.html().length > 15) {
											var newtitle = title.html().substr(0, title.html().length - 6);
											title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
										}
										jQuery(this).find(".post-title >span:first").append(actionstr);

									}
									if (jQuery(this).find(".post-title i.glyphicon").length > 0) {
										jQuery(this).find(".post-title i.glyphicon").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_icon_element\')" title="修改样式，格式"></span>');
									}
								}


								if (jQuery(this).find(".post_excerpt").length > 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;" onclick="toEditor(this,event)" title="编辑内容"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_text_element\')" title="修改内容样式，格式"></span>';
									if (jQuery(this).find(".post_excerpt >p").length > 0 && jQuery(this).find(".post_excerpt .vc_list_edit_action").length == 0) {
										jQuery(this).find(".post_excerpt >p").append(actionstr);
									} else {
										jQuery(this).find(".post_excerpt").append(actionstr);
									}
								}
								if (jQuery(this).find(".subtitle").length > 0 && jQuery(this).find(".subtitle .vc_list_edit_action").length == 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;" onclick="toEditor(this,event)" title="编辑内容"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_list_subtitle_element\')" title="修改样式，格式"></span>';
									jQuery(this).find(".subtitle").append(actionstr);

								}
								if (jQuery(this).find(".price_warp").length > 0 && jQuery(this).find(".price_warp .vc_list_edit_action").length == 0) {
									var current_pid = jQuery(this).attr("data-postid");
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.bitSettingsEdit(' + current_pid + ',\'设置商品\', \'product\');" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_list_price_element\')" title="修改样式，格式"></span>';
									jQuery(this).find(".price_warp").append(actionstr);

								}
								if (jQuery(this).find(".post-comment").length > 0 && jQuery(this).find(".post-comment .vc_list_edit_action").length == 0) {
									jQuery(this).find(".post-comment").append('<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_comment_element\')" title="修改样式，格式"></span>');
								}
								if (jQuery(this).find(".vc_read_more").length > 0 && jQuery(this).find(".vc_read_more .vc_list_edit_action").length == 0) {
									jQuery(this).find(".vc_read_more").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_readmore_element\')" title="修改样式，格式"></span>');
								}
							}

						}
					}).mouseleave(function () {
						jQuery(this).css("outline", "0");
						jQuery(this).find(".toEditor,.vc_list_edit_action").remove();
						jQuery(this).find(".edittitle").remove();
						jQuery(this).find(".hidetitle").each(function () {
							var t = jQuery(this).html();
							jQuery(this).parent().html(t);
						})

					});


					if (p.find(".mypages").length > 0) {
						p.find(".mypages").mouseenter(function () {
							if (p.find(".mypages .vc_list_edit_action").length == 0) {
								p.find(".mypages").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_pagenav_element\')" title="修改样式，格式"></span>');
							}
						}).mouseleave(function () {
							p.find(".vc_list_edit_action").remove();
						});

					}

				}
				$thumbs.find("a:not(.cate)").each(function () {
					if (!jQuery(this).hasClass("thickbox")) {
						var href = jQuery(this).attr("href");
						jQuery(this).removeAttr("href");
						var p = jQuery(this).closest(".isotope-item");
						jQuery(this).unbind("click").bind("click", function () {
							top.menuRedirect(href, p);
							return false;
						})
					}
				})
			}

			$container.find('.categories_filter a:not(.link)').data('isotope', $thumbs).click(function (e) {
				e.preventDefault();
				var $thumbs = jQuery(this).data('isotope');
				jQuery(this).parent().parent().find('.active').removeClass('active');
				jQuery(this).parent().addClass('active');
				if (!$container.hasClass("noanimale")) {
					$thumbs.isotope({
						filter: jQuery(this).attr('data-filter'),
						itemSelector: '.isotope-item',
						layoutMode: 'fitRows'
					});
				} else {
					var filter = jQuery(this).data('filter');
					if (filter == "*") {
						$thumbs.find(">li").show();
					} else {
						$thumbs.find(">li").hide();
						$thumbs.find(filter).show();
					}
				}

			});
			if (!jQuery(this).hasClass("noanimale")) {
				vc_isotope_init_load($thumbs);
			}

		});
	}


}

function vc_isotope_init_load(obj) {

	if (obj.find('.post-thumb img,.item_img img').length == 0) {
		obj.isotope({
			filter: '*',
			itemSelector: '.isotope-item',
			layoutMode: obj.attr("data-layout-mode") ? obj.attr("data-layout-mode") : 'fitRows'
		});
		obj.parent().find(".isotope_loading").remove();
		return;
	}
	var all_load = true;

	obj.find('.post-thumb img,.post-thumb video,.item_img img').each(function () {
		if (!jQuery(this).prop('complete')) {
			all_load = false;
		}
	});

	if (!all_load) {
		window.setTimeout(function () {
			vc_isotope_init_load(obj);
		}, 500);
		return;
	}
	obj.isotope({
		filter: '*',
		itemSelector: '.isotope-item',
		layoutMode: obj.attr("data-layout-mode") ? obj.attr("data-layout-mode") : 'fitRows'
	},function(){
		obj.parent().find(".isotope_loading").remove();
	});

}

if (typeof window['vc_carouselBehaviour'] !== 'function') {
	function vc_carouselBehaviour() {
		jQuery(".qfe_carousel").each(function () {
			var $this = jQuery(this);
			if ($this.data('carousel_enabled') !== true && $this.is(':visible')) {
				$this.data('carousel_enabled', true);
				var carousel_width = jQuery(this).width(),
					visible_count = getColumnsCount(jQuery(this)),
					carousel_speed = 500;
				if (jQuery(this).hasClass('columns_count_1')) {
					carousel_speed = 900;
				}
				var carousele_li = jQuery(this).find('.qfe_thumbnails-fluid li');
				carousele_li.css({"margin-right": carousele_li.css("margin-left"), "margin-left": 0});

				jQuery(this).find('.qfe_wrapper:eq(0)').jCarouselLite({
					btnNext: jQuery(this).find('.next'),
					btnPrev: jQuery(this).find('.prev'),
					visible: visible_count,
					speed: carousel_speed
				})
					.width('100%');// carousel_width

				var fluid_ul = jQuery(this).find('ul.qfe_thumbnails-fluid');
				fluid_ul.width(fluid_ul.width() + 300);

				jQuery(window).resize(function () {
					var before_resize = screen_size;
					screen_size = getSizeName();
					if (before_resize != screen_size) {
						window.setTimeout('location.reload()', 20);
					}
				});
			}

		});
	}
}

if (typeof window['vc_slidersBehaviour'] !== 'function') {
	function vc_slidersBehaviour() {
		// var sliders_count = 0;
		jQuery('.qfe_gallery_slides').each(function (index) {
			var this_element = jQuery(this);
			var ss_count = 0;
			if (this_element.hasClass('qfe_slider_nivo')) {
				var sliderSpeed = 800,
					sliderTimeout = this_element.attr('data-interval') * 1000;

				if (sliderTimeout == 0) sliderTimeout = 9999999999;
				this_element.find('.nivoSlider').nivoSlider({
					effect: 'boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse', // Specify
					// sets
					// like:
					// 'fold,fade,sliceDown'
					slices: 15, // For slice animations
					boxCols: 8, // For box animations
					boxRows: 4, // For box animations
					animSpeed: sliderSpeed, // Slide transition speed
					pauseTime: sliderTimeout, // How long each slide will show
					startSlide: 0, // Set starting Slide (0 index)
					directionNav: true, // Next & Prev navigation
					directionNavHide: true, // Only show on hover
					controlNav: true, // 1,2,3... navigation
					keyboardNav: false, // Use left & right arrows
					pauseOnHover: true, // Stop animation while hovering
					manualAdvance: false, // Force manual transitions
					prevText: 'Prev', // Prev directionNav text
					nextText: 'Next' // Next directionNav text
				});
			} else if (this_element.hasClass('qfe_image_grid')) {
				var isotope = this_element.find('.qfe_image_grid_ul');
				isotope.isotope({
					// options
					itemSelector: '.isotope-item',
					layoutMode: 'fitRows'
				});
				jQuery(window).load(function () {
					isotope.isotope("reLayout");
				});
			}
		});
	}
}

function getColumnsCount(el) {
	var find = false,
		i = 1;

	while (find == false) {
		if (el.hasClass('columns_count_' + i)) {
			find = true;
			return i;
		}
		i++;
	}
}

var screen_size = getSizeName();

function getSizeName() {
	var screen_size = '',
		screen_w = jQuery(window).width();

	if (screen_w > 1170) {
		screen_size = "desktop_wide";
	} else if (screen_w > 960 && screen_w < 1169) {
		screen_size = "desktop";
	} else if (screen_w > 768 && screen_w < 959) {
		screen_size = "tablet";
	} else if (screen_w > 300 && screen_w < 767) {
		screen_size = "mobile";
	} else if (screen_w < 300) {
		screen_size = "mobile_portrait";
	}
	return screen_size;
}

function loadScript(url, $obj, callback) {
	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState) {  // IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" ||
				script.readyState == "complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
	}

	script.src = url;
	$obj.get(0).appendChild(script);
}
function qfe_prepare_tab_content(event, ui) {
	var panel = ui.panel || ui.newPanel;
	vc_carouselBehaviour();
	var $ui_panel = jQuery(panel).find('.isotope'),
		$google_maps = jQuery(panel).find('.qfe_gmaps_widget');
	if ($ui_panel.length > 0) {
		$ui_panel.isotope("reLayout");
	}

	if ($google_maps.length && !$google_maps.is('.map_ready')) {
		var $frame = $google_maps.find('iframe');
		$frame.attr('src', $frame.attr('src'));
		$google_maps.addClass('map_ready');
	}
}

jQuery(window).resize(function () {
	bitResizeImageTextInit();
});
jQuery(window).ready(function () {
	setTimeout(function () {
		bitResizeImageTextInit();
	}, 300);
});

function bitResizeImageTextInit() {

	jQuery(".bitImageControlDiv .bit-tp-caption.wf-mobile-hidden").each(function () {

		var dataorgipara = jQuery(this).attr("dataorgipara");
		if (dataorgipara) {
			var $this = this;
			var p = jQuery(this).parent().parent();
			var img = p.find(".bitImageParentDiv img");
			if (img.length > 0) {
				var imgW = img.width();
				var imgH = img.height();
			} else {
				var imgW = p.find(".bitImageParentDiv .banner-img").width();
				var imgH = p.find(".bitImageParentDiv .banner-img").height();
			}
			var download = new Image();
			download.src = img.attr("src");
			if (imgW > 760) {
				initTextposition(dataorgipara, imgW, imgH, this);
			} else {
				/*
				 * download.onload = function () {
				 * initTextposition(dataorgipara,imgW,imgH,$this); }
				 * download.onerror = function (err, msg) {
				 * initTextposition(dataorgipara,imgW,imgH,$this); }
				 */
			}
		}
	})
}

function initTextposition(dataorgipara, imgW, imgH, obj) {
	dataorgipara = dataorgipara.split("\|");
	var textOrgLeft = dataorgipara[0];
	var textOrgTop = dataorgipara[1];
	var width = dataorgipara[2];
	var s = dataorgipara[3];
	var textOrgRight = dataorgipara[4];
	var textOrgBottom = dataorgipara[5];
	if (imgW != width && imgW > 0) {

		var n = (width / imgW).toFixed(4);

		// if(s/n<10){n=s/10;}
		jQuery(obj).css("font-size", s / n).css("line-height", "auto").css("min-height", "0").css("min-width", "0");
		jQuery(obj).find("slideText").css("line-height", "auto");
		var textW = jQuery(obj).width();
		var textH = jQuery(obj).height();
		var paddingLeft = jQuery(obj).css("padding-left");
		if (paddingLeft && paddingLeft.indexOf("px")) {
			paddingLeft = paddingLeft.replace("px", "")
		}
		;
		var paddingTop = jQuery(obj).css("padding-top");
		if (paddingTop && paddingTop.indexOf("px")) {
			paddingTop = paddingTop.replace("px", "")
		}
		;
		var s = jQuery(obj).css("left");
		if (textOrgLeft != 0) {
			if (s.indexOf("px") > -1) {
				s = s.replace("px", "");
				jQuery(obj).css("left", textOrgLeft * imgW - textW / 2 - paddingLeft);
			}
		}
		if (textOrgRight == 1) {
			jQuery(obj).css("right", "0").css("left", "auto");
		}
		var s = jQuery(obj).css("top");

		if (textOrgTop != 0) {
			if (s.indexOf("px") > -1) {
				s = s.replace("px", "");
				jQuery(obj).css("top", textOrgTop * imgH - textH / 2 - paddingTop);
			}
		}
		if (textOrgBottom == 1) {
			jQuery(obj).css("bottom", "0").css("top", "auto");
		}

	} else {

		var css = jQuery(obj).attr("style");
		if (css) {
			css = css.replace(/font-size[^p]*px;/, "");
			css = css.replace(/right: 0px/, "");
			css = css.replace(/bottom: 0px/, "");
			css = css.replace(/line-height[^;]*;/, "");
			jQuery(obj).attr("style", css);
			var left = jQuery(obj).attr("dataleft");
			jQuery(obj).css("left", left + "px");
			var top = jQuery(obj).attr("datatop");
			jQuery(obj).css("top", top + "px");
		}
	}
	jQuery(obj).addClass("on").show();

}


;

/* vc_transition_bootstrap_js: (http://www.artjiahua.com/qfy-content/plugins/qfy_editor/assets/lib/vc_carousel/js/transition.js) */
+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);
;

/* vc_carousel_js: (http://www.artjiahua.com/qfy-content/plugins/qfy_editor/assets/lib/vc_carousel/js/vc_carousel.js) */
/* ========================================================================
 * VC: carousel.js v0.4.5
 * Fork Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


;(function($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
	if($(window).width()<768 &&  $(element).hasClass("vc-carousel vc-slide")){
		options.interval = 0;

	}
	if(!options.viewnum) options.viewnum=0;
    this.$element    = $(element)
    this.$indicators = this.$element.find('.vc-carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
    this._build() // new
  }

  Carousel.DEFAULTS = {
    mode: 'horizontal'
  , partial: false
  , interval: 5000
  , pause: 'hover'
  , wrap: false
  , autoHeight: true
  , perView: 1
  , hideOnEnd: false
  }
  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options&&this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      this.touch_start_position = 0;
    return this
  }
  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.vc-item.vc-active')
    if(!this.$active.length) this.$active = this.$element.find('.vc-item:first').addClass('vc-active')
    this.$items  = this.$active.parent().children()
    return this.$items.index(this.$active)
  }
  Carousel.prototype.showHideControl = function(index) {
    if(typeof index === 'undefined') var index = this.getActiveIndex()
    //this.$left_control[index===0 ? 'hide' : 'show']()
    //this.$right_control[index===this.items_count-1 ? 'hide' : 'show']()
  }
  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element && this.$element.find('.vc-next, .vc-prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
	
    var $active   = this.$element.find('.vc-item.vc-active')
    var $next     = next || $active[type]();
	
   if(type=="prev" && $next.index() == -1 && this.options.viewnum>0){	
		$next = this.$element.find('.vc-item:eq("'+(this.items_count-this.options.viewnum*1)+'")');
   }
    var isCycling = this.interval
    var direction = type == 'next' ? 'vc-left' : 'vc-right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this
    if (!$next.length) {
      if (!this.options.wrap) {
        this.returnSwipedSlide()
        return
      }
      $next = this.$element.find('.vc-item')[fallback]()
    }

    this.sliding = true
	//mobile don't move
	if($(window).width()<768 && this.$element.hasClass("vc-carousel vc-slide")){
		return;
	}

    isCycling && this.pause()
	
    var e = $.Event('slide.vc.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('vc-active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.vc-active').removeClass('vc-active')
      this.$indicators.find('.vc-partial').removeClass('vc-partial')
      this.$element.one('slid', function () {
        var index = that.getActiveIndex(),
            $nextIndicator = $(that.$indicators.children().slice(index, that.getActiveIndex() + that.options.perView))
        $nextIndicator && $nextIndicator.addClass('vc-active')
        that.options.partial && $nextIndicator && (index+1 < that.items_count ? $nextIndicator.last().next().addClass('vc-partial') : $nextIndicator.first().prev().addClass('vc-partial'))
        if(that.options.hideOnEnd) that.showHideControl(index)
      })
    }
    this.current_index = $next.index()
    if(this.current_index > this.items_count-this.options.viewnum*1) {
      this.current_index = 0;
	

    } else if(this.current_index < 0) {
      this.current_index = this.items_count -1
    }
    if(this.options.autoHeight) {
      this.current_pos_value = -1 * this._step * this.current_index
    } else {
      this.current_pos_value = -1 * $next.position()[this.animation_position]
    }
    if(this.options.partial && this.current_index >= this.items_count-1) {
      this.current_pos_value += this._step*(1-this.partial_part)
    }
    if ($.support.transition && this.$element.hasClass('vc-slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      this.$slideline_inner
        .addClass('vc-transition')
        .css(this.animation_position,  this.current_pos_value + that.pos_units)
      if(!this.options.autoHeight) this.recalculateSlidelineHeight($next.height(), true)
      this.$slideline_inner.one($.support.transition.end, function(){
        $next.addClass('vc-active')
        $active.removeClass('vc-active')
        that.$slideline_inner.removeClass([type, 'vc-transition'].join(' '))
        that.sliding = false
        that.removeSwipeAnimationSpeed()
        setTimeout(function () { that.$element.trigger('slid') }, 0)
      }).emulateTransitionEnd(this.transition_speed)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('vc-active')
      $next.addClass('vc-active')
      this.sliding = false
      this.$slideline_inner.css(this.animation_position, this.current_pos_value + that.pos_units)
    }
    isCycling && this.cycle()
	if( this.current_index==0 && this.options.viewnum>0){
		 $next.removeClass('vc-active');
		 if(type=="next"){
			this.$element.find('.vc-item:first').addClass("vc-active");
		 }
	}
    return this
  }
  Carousel.prototype.setSwipeAnimationSpeed = function() {
    this.$slideline_inner.addClass('vc-swipe-transition')
  }
  Carousel.prototype.removeSwipeAnimationSpeed = function() {
    this.$slideline_inner.removeClass('vc-swipe-transition')

  }
    /**
     * Velocity
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    Carousel.prototype.velocity =  function(time, x) {
      return {
          x: Math.abs(x / time) || 0
      }
    }
    Carousel.prototype.recalculateSlidelineHeight = function(height, animate) {
      if(animate === true) {
        this.$slideline.animate({height: height})
      } else {
        this.$slideline.height(height)
      }
    }
    /**
     * Change layout size after resizing of window.
     */
    Carousel.prototype.resizeAction = function() {
      var max_height = 0,
          new_slideline_height = 0
      if(this.options.mode === 'horizontal') {
        this.el_effect_size = this.$element.width() * ( this.options.partial ? this.partial_part : 1 )
        this.$slideline.width(this.items_count*this.el_effect_size)
      
      }

      if (this.options.autoHeight) {
        this.$items.height('auto')
        this.$items.each(function(){
          var item_height = $(this).height()
          if(item_height > max_height) max_height = item_height
        })
        this.$items.height(max_height)
      } else {
        this.recalculateSlidelineHeight(this.$active.height())
      }
      if(this.options.mode === 'vertical') {
        this._step = this.$active.height()
        new_slideline_height = this.$active.height() * this.options.perView * (this.options.partial ? (1 + 1-this.partial_part) : 1)
        this.recalculateSlidelineHeight(new_slideline_height, false)
        this.$slideline_inner.css({top: -1 * this.$active.position().top})
        this.el_effect_size = this._step
      }
    }
    Carousel.prototype.returnSwipedSlide = function() {
      var params = {}
      params[this.animation_position] = this.current_pos_value + this.pos_units
      this.$slideline_inner.animate(params)
    }
    Carousel.prototype._build = function() {
    	//mobile don't build
    	if($(window).width()<768 && this.$element.hasClass("vc-carousel vc-slide")){
    		return;
    	}
      var el                      = this.$element.get(0),
          _touch_start_position   = false,
          _touch_start_time       = 0,
          _pos_before_touch      = 0,
          _diff                   = 0,
          _moved                  = false,
          that                    = this,
          mode                    = this.options.mode
      this.getActiveIndex()

      this.el_width               = 0
      this.items_count            = this.$items.length

      this.$slideline             = this.$element.find('.vc-carousel-slideline')
      this.slideline              = this.$slideline.get(0)
      this.$slideline_inner       = this.$slideline.find('> div')
      this.slideline_inner        = this.$slideline_inner.get(0)

      this.partial_part           = 0.8
      this._slide_width           = 0
      this.swipe_velocity         = 0.7
      this.current_pos_value      = 0
      this.current_index          = 0 // TODO: default start position by options
      this.el_effect_size         = 0
      this.transition_speed       = 600
	
      this.$left_control = this.$element.find('.vc-left.vc-carousel-control')
      this.$right_control = this.$element.find('.vc-right.vc-carousel-control')

      // Enable autoHeight if partial
      if(this.options.partial) this.options.autoHeight = true
      // Add Css classes for perView > 1
      if(this.options.perView > 1) this.$element.addClass('vc-per-view-more vc-per-view-' + this.options.perView)

      if( mode === 'horizontal') {
        this.pos_units = '%'
        this._step = 100.00/this.items_count/this.options.perView
        this.animation_position = 'left'
        this.$items.width(this._step + this.pos_units)
        this.touch_direction = 'pageX'
      } else {
        this.pos_units = 'px'
        this.animation_position = 'top'
        this.touch_direction = 'pageY'
      }
      // Hide first control if this.current_index === 0
      if(this.options.hideOnEnd) this.showHideControl()
      // Add partial css class if partial
      if(this.options.partial) this.$element.addClass('vc_partial')
      // Set indicator
      if(this.$indicators.length) {
        var $active_indecators = that.$indicators.children()
                                                 .slice(this.current_index, this.current_index + this.options.perView)
                                                 .addClass('vc-active')
        this.options.partial && $active_indecators.last().next().addClass('vc_partial')
      }
      $(window).resize(this.resizeAction.bind(this)); this.resizeAction()
	 if(el.addEventListener){

          //IE 8 or lower
		  el.addEventListener("touchstart", function(e){
			_touch_start_position = parseFloat(e[that.touch_direction])
			_touch_start_time = e.timeStamp
			_pos_before_touch = that.$slideline_inner.position()[that.animation_position]
		  }.bind(this), false)
		  el.addEventListener('touchmove', function(e){
			_diff = parseFloat(e[that.touch_direction]) - _touch_start_position
			_moved = Math.abs(_diff) > 0
			if(!_moved) return true
			e.preventDefault()
			that.slideline_inner.style[that.animation_position] = (_pos_before_touch + _diff) + 'px'
		  }, false)
		  el.addEventListener('touchend', function(e){
			var time,part,velocity
			if(_moved) {
			  time= (e.timeStamp-_touch_start_time)/1000
			  part = _diff/ that.el_effect_size
			  velocity = that.velocity(time, part)
			  if((velocity.x > that.swipe_velocity && part < 0) || part <= -0.7) {
				that.setSwipeAnimationSpeed()
				that.next()
			  } else if(velocity.x > that.swipe_velocity || part >= 0.7) {
				that.setSwipeAnimationSpeed()
				that.prev()
			  } else {
				that.returnSwipedSlide()
			  }
			  _moved = false
			}
		  }, false)
	  }
      this.$element.addClass('vc-build')
		 
      return this
    }
  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('vc.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('vc.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).off('click.vc.carousel.data-api').on('click.vc.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false
    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('vc.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="vc-carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

})(window.jQuery);
;

/* waypoints: (http://www.artjiahua.com/qfy-content/plugins/qfy_editor/assets/lib/jquery-waypoints/waypoints.min.js) */
// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.2
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(this,function(n,r){var i,o,l,s,f,u,a,c,h,d,p,y,v,w,g,m;i=n(r);c=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;a={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};t.data(u,this.id);a[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||c)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(c&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete a[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;r=n.extend({},n.fn[g].defaults,r);if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=t.data(w))!=null?o:[];i.push(this.id);t.data(w,i)}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=n(t).data(w);if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;if(e==null){e={}}if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=a[i.data(u)];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke(this,"disable")},enable:function(){return d._invoke(this,"enable")},destroy:function(){return d._invoke(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t,e){t.each(function(){var t;t=l.getWaypointsByElement(this);return n.each(t,function(t,n){n[e]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(a,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=a[n(t).data(u)])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=a[n(t).data(u)];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.load(function(){return n[m]("refresh")})})}).call(this);;

/* jquery-autosize: (http://www.artjiahua.com/qfy-content/plugins/screets-chat/assets/js/jquery.autosize.min.js) */
/*!
	Autosize v1.17.1 - 2013-06-23
	Automatically adjust textarea height based on user input.
	(c) 2013 Jack Moore - http://www.jacklmoore.com/autosize
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e){var t,o={className:"autosizejs",append:"",callback:!1,resizeDelay:10},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],s=e(i).data("autosize",!0)[0];s.style.lineHeight="99px","99px"===e(s).css("lineHeight")&&n.push("lineHeight"),s.style.lineHeight="",e.fn.autosize=function(i){return i=e.extend({},o,i||{}),s.parentNode!==document.body&&e(document.body).append(s),this.each(function(){function o(){var o,a={};if(t=u,s.className=i.className,l=parseInt(h.css("maxHeight"),10),e.each(n,function(e,t){a[t]=h.css(t)}),e(s).css(a),"oninput"in u){var r=u.style.width;u.style.width="0px",o=u.offsetWidth,u.style.width=r}}function a(){var n,a,r,c;t!==u&&o(),s.value=u.value+i.append,s.style.overflowY=u.style.overflowY,a=parseInt(u.style.height,10),"getComputedStyle"in window?(c=window.getComputedStyle(u),r=u.getBoundingClientRect().width,e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,t){r-=parseInt(c[t],10)}),s.style.width=r+"px"):s.style.width=Math.max(h.width(),0)+"px",s.scrollTop=0,s.scrollTop=9e4,n=s.scrollTop,l&&n>l?(u.style.overflowY="scroll",n=l):(u.style.overflowY="hidden",d>n&&(n=d)),n+=p,a!==n&&(u.style.height=n+"px",w&&i.callback.call(u,u))}function r(){clearTimeout(c),c=setTimeout(function(){h.width()!==z&&a()},parseInt(i.resizeDelay,10))}var l,d,c,u=this,h=e(u),p=0,w=e.isFunction(i.callback),f={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},z=h.width();h.data("autosize")||(h.data("autosize",!0),("border-box"===h.css("box-sizing")||"border-box"===h.css("-moz-box-sizing")||"border-box"===h.css("-webkit-box-sizing"))&&(p=h.outerHeight()-h.height()),d=Math.max(parseInt(h.css("minHeight"),10)-p||0,h.height()),h.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word",resize:"none"===h.css("resize")||"vertical"===h.css("resize")?"none":"horizontal"}),"onpropertychange"in u?"oninput"in u?h.on("input.autosize keyup.autosize",a):h.on("propertychange.autosize",function(){"value"===event.propertyName&&a()}):h.on("input.autosize",a),i.resizeDelay!==!1&&e(window).on("resize.autosize",r),h.on("autosize.resize",a),h.on("autosize.resizeIncludeStyle",function(){t=null,a()}),h.on("autosize.destroy",function(){t=null,clearTimeout(c),e(window).off("resize",r),h.off("autosize").off(".autosize").css(f).removeData("autosize")}),a())})}})(window.jQuery||window.Zepto);;

/* jquery-cookie: (http://www.artjiahua.com/qfy-content/plugins/screets-chat/assets/js/cookie.min.js) */
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{a(jQuery)}}(function(e){var a=/\+/g;function d(g){return g}function b(g){return decodeURIComponent(g.replace(a," "))}function f(g){if(g.indexOf('"')===0){g=g.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{return c.json?JSON.parse(g):g}catch(h){}}var c=e.cookie=function(p,o,u){if(o!==undefined){u=e.extend({},c.defaults,u);if(typeof u.expires==="number"){var q=u.expires,s=u.expires=new Date();s.setDate(s.getDate()+q)}o=c.json?JSON.stringify(o):String(o);return(document.cookie=[c.raw?p:encodeURIComponent(p),"=",c.raw?o:encodeURIComponent(o),u.expires?"; expires="+u.expires.toUTCString():"",u.path?"; path="+u.path:"",u.domain?"; domain="+u.domain:"",u.secure?"; secure":""].join(""))}var g=c.raw?d:b;var r=document.cookie.split("; ");var v=p?undefined:{};for(var n=0,k=r.length;n<k;n++){var m=r[n].split("=");var h=g(m.shift());var j=g(m.join("="));if(p&&p===h){v=f(j);break}if(!p){v[h]=f(j)}}return v};c.defaults={};e.removeCookie=function(h,g){if(e.cookie(h)!==undefined){e.cookie(h,"",e.extend(g,{expires:-1}));return true}return false}}));;

/* sc_chat_app_script: (http://www.artjiahua.com/qfy-content/plugins/screets-chat/assets/js/App.min.js) */
/*
 * Screets Chat
 * Application scripts
 *
 * Copyright (c) 2013 Screets
 */
 (function(a){a(document).ready(function(){
	if(jQuery('[name="mobile_shut"]').val()==1 && jQuery("body").width()<768){
		
	}else{
		a.sc_chat.init();
		a(window).unload(function(){sc_chat.is_admin&&a.ajax({type:"POST",url:sc_chat.ajaxurl+"?mode=logout",data:"action=sc_chat_ajax_callback",async:!1})})
	}
});
a.sc_chat={data:{first_time:!0,last_log_ID:0,no_activity:0,logged_in:!1,sender:"",win_is_active:0,sc_chat_box_visible:!1,error:!1},init:function(){var c=!1;window.onfocus=function(){a.sc_chat.data.win_is_active=1};window.onblur=function(){a.sc_chat.data.win_is_active=0};!0==sc_chat.is_admin&&
(a.sc_POST("login","action=sc_chat_ajax_callback&f_chat_user_name="+sc_chat.username+"&f_chat_user_email="+sc_chat.email+"&f_chat_is_admin=true",function(b){c=!1;b.error?a.sc_chat.display_error(b.error):a.sc_chat.login(b.name,b.gravatar,!0)}),a(document).on("click",".sc-chat-users .user",function(){var b=a(this).attr("data-receiver-id"),c=a(this).attr("data-visitor-id");a.sc_chat.open_new_tab(b,c,!0);return!1}),a("ul.sc-chat-tabs").each(function(){var b,c=a(this).find("li");c.addClass("active");c.not(b).each(function(){a(a(this).attr("href")).hide()});
a(document).on("click",".sc-chat-tab-content",function(){a("ul.sc-chat-tabs li.active").removeClass("new-msg")});a(this).on("click","li a",function(e){a("ul.sc-chat-tabs li").removeClass("active new-msg");a(".sc-chat-tab-content").removeClass("active");b=a(this).parent();c=a(a(this).attr("href"));b.addClass("active");c.addClass("active");a(".sc-cnv-wrap").scrollTop(1E4);c.find(".f-chat-line").focus();e.preventDefault()});a(this).on("click","li .close",function(b){var c=a(this).prev().attr("data-receiver-id");
a("ul.sc-chat-tabs li").removeClass("active new-msg");a(".sc-chat-tab-content").removeClass("active");a(".console-tab").addClass("active");a("#Console").addClass("active");a("#Tab_"+c).remove();a("#Receiver_"+c).remove();b.preventDefault()})}),a(".sc-chat-login-btn").click(function(){var b=a(this);a.sc_chat.data.current_status=a(this).attr("data-status");"online"==a.sc_chat.data.current_status?a.sc_POST("offline","action=sc_chat_ajax_callback",function(c){a('.user[data-user-type="1"]').fadeOut(1E3);
a.sc_chat.get_online_users();b.attr("data-status","offline").html('<i class="sc-icon-offline"></i> '+sc_chat.tr_offline);a.sc_chat.data.current_status="offline";a("#Chat_console").removeClass("sc-online").addClass("sc-offline");a.sc_chat.play_sound("offline")}):"offline"==a.sc_chat.data.current_status&&a.sc_POST("online","action=sc_chat_ajax_callback",function(){a.sc_chat.get_online_users();a('.user[data-user-type="ME"]').show();b.attr("data-status","online").html('<i class="sc-icon-online"></i> '+
sc_chat.tr_online);a.sc_chat.data.current_status="online";a("#Chat_console").removeClass("sc-offline").addClass("sc-online");a.sc_chat.play_sound("online")})}),a(document).on("click",".sc-chat-refresh",function(){receiver_ID=a(this).parent().parent().parent().parent().attr("data-receiver-id");visitor_ID=a("#User_"+receiver_ID).attr("data-visitor-id");a.sc_chat.get_user_info(visitor_ID,receiver_ID)}));sc_chat.is_admin||(a("#SC_send_form_btn").click(function(){a("#SC_contact_form").submit()}),a("#SC_contact_form").submit(function(){a(".sc-chat-notification").fadeIn(100).removeClass("error success").html(sc_chat.tr_sending+
"...");a.sc_POST("send_contact_from",a(this).serialize(),function(b){a("#SC_contact_form .imageCodeClass").click();b.error?a(".sc-chat-notification").addClass("error").html(b.error):(a(".sc-chat-notification").addClass("success").html(b.message).delay(1500).fadeOut(500),a(".sc-chat-header-title").html(b.message).delay(4E3).queue(function(b){a(this).html(sc_chat.tr_offline_header);b()}),a('#SC_contact_form input[type="text"], #SC_contact_form textarea').val(""),setTimeout(a.sc_chat.hide_chatbox,2700))});return!1}),a("#SC_start_chat_btn").click(function(){a("#SC_login_form").submit()}),
a("#SC_login_form input").keydown(function(b){13==b.keyCode&&a("#SC_login_form").submit()}),a("#SC_login_form").submit(function(){if(c)return!1;a(".sc-chat-notification").removeClass("error success").fadeIn(500).html(sc_chat.tr_connecting+"...");c=!0;a.sc_POST("login",a(this).serialize(),function(b){c=!1;b.error?a.sc_chat.display_error(b.error):a.sc_chat.login(b.name,b.gravatar,!0)});return!1}),1==sc_chat.use_css_anim?setTimeout(a.sc_chat.animate_chatbox,500*sc_chat.delay):setTimeout(a.sc_chat.animate_chatbox,
1E3*sc_chat.delay));a("body").on("keydown",".f-chat-line",function(b){13!=b.keyCode||b.shiftKey||(b.preventDefault(),a(this).parent().submit(),a(this).val(""),a(this).trigger("autosize.resize"))});a(document).on("submit","#Reply_form",function(){var b=a(this).find(".f-receiver-id").val(),d=a.trim(a(this).find(".f-chat-line").val()),e=a(this).serialize(),h=a(".f-chat-line");if(0==d.length||c)return!1;c=!0;var g="t"+Math.round(1E6*Math.random()),f={ID:g,author:a.sc_chat.data.name,gravatar:a.sc_chat.data.gravatar,
receiver_ID:b,chat_line:d.replace(/</g,"&lt;").replace(/>/g,"&gt;")};h.addClass("sc-chat-sending");a.sc_chat.add_chat_line(a.extend({},f));a.sc_POST("send_chat_msg",e,function(b){c=!1;a(".f-chat-line").val("").removeClass("sc-chat-sending");a("div.chat-"+g).remove();b.error?(a.sc_chat.display_error(b.error),a("#Reply_form .f-chat-line").attr("disabled","disabled").addClass("sc-chat-error")):(f.ID=b.insert_ID,a.sc_chat.add_chat_line(a.extend({},f)))});return!1});a(document).on("click",".sc-chat-btn-logout",
function(){a.sc_chat.data.logged_in=!1;a.sc_POST("logout","action=sc_chat_ajax_callback",function(b){!0==sc_chat.is_admin?window.location.href="./":a("#Conversation").fadeOut(300,function(){a(".sc-chat-wrapper").fadeIn(300,function(){setTimeout(function(){a.sc_chat.hide_chatbox()},1E3)})})});return!1});
try{
	if(!parent.vc){if(sc_chat.is_op == true){a.sc_GET("is_user_logged_in","action=sc_chat_ajax_callback",function(b){var c=!0;sc_chat.is_admin||!0!=sc_chat.is_op||(c=!1);b.logged&&c&&a.sc_chat.login(b.user.name,b.user.email,!1)});}};
}catch(e){
	
}
(function d(){a.sc_chat.get_online_users(d)})();
(function e(){a.sc_chat.get_chat_lines(e)})()},login:function(c,b,d){a.sc_chat.data.name=c;a.sc_chat.data.gravatar=b;a.sc_chat.data.logged_in=!0;!0==sc_chat.is_admin?(a(".sc-chat-login-btn").attr("data-status","online").html('<i class="sc-icon-online"></i> '+sc_chat.tr_online),a("#Chat_console").addClass("sc-online")):(a.sc_chat.open_chatbox(),!0==d?a(".sc-chat-wrapper").fadeOut(function(){a(".sc-chat-notification").html("").hide();a("#Conversation").fadeIn();a(".f-chat-line").focus().autosize();
a(".sc-cnv-wrap").scrollTop(1E4)}):(a(".sc-chat-wrapper").hide(),"on"==a.cookie("sc_chat_chatbox_status")&&(delay=1==sc_chat.use_css_anim?500*sc_chat.delay:1E3*sc_chat.delay,setTimeout(function(){a("#Conversation").show();a(".f-chat-line").autosize();a(".sc-cnv-wrap").scrollTop(1E4)},delay),a.sc_chat.data.sc_chat_box_visible=!0)));a.sc_chat.data.first_time=!1},render:function(a,b){var d=[];switch(a){case "login_top_bar":d=['<span><img src="',b.gravatar,'" width="23" height="23" />','<span class="name">',
b.name,'</span><a href="" class="logoutButton rounded">',b.tr_logout,"</a></span>"];break;case "chat_line":d=['<div class="sc-msg-wrap chat chat-',b.ID,'" data-user-id="',b.author,'"><div class="sc-chat-time">',b.time,'</div><div class="sc-usr-avatar"><img src="',b.gravatar,'" width="38" height="38" onload="this.style.visibility=\'visible\'" />','</div><div class="sc-msg"><div class="sc-usr-name">',b.author,':</div><div class="sc-chat-line">',b.chat_line,'</div></div><div class="clearfix"></div></div>'];
break;case "user":d=['<a id="User_',b.name,'" href="#Receiver_',b.ID,'" class="user" data-receiver-id="',b.name,'" data-visitor-id="',1==b.type?b.ID:b.visitor_ID,'" data-user-type="',b.type,'"><img class="avatar" src="',b.gravatar,'" onload="this.style.visibility=\'visible\'" /> <div class="username"> <strong>',b.name,"</strong> (",b.email,")<small>",b.tagline,"</small></div></a>"];break;case "new_tab_title":d=['<li class="',b.custom_class,'" id="Tab_',b.ID,'"><a href="#Receiver_',b.ID,'" data-receiver-id="',
b.ID,'">',b.ID,'</a> <button type="button" class="close">&times;</button></li>'];break;case "new_tab_content":d=['<div id="Receiver_',b.ID,'" data-receiver-id="',b.ID,'" class="',b.custom_class,' sc-chat-tab-content"><div class="sc-chat-inner"><div id="SC_cnv_wrap" class="sc-cnv-wrap"><div class="sc-chat-user-agent">',b.user_info?b.user_info:'<a href="javascript:void(0)" class="sc-chat-refresh">Refresh</a>','</div></div><div class="sc-chat-tip"></div></div><form id="Reply_form" method="post" action="" class="sc-chat-reply"><input type="hidden" name="action" value="sc_chat_ajax_callback" /><input type="hidden" name="receiver_ID" class="f-receiver-id" value="',
b.ID,'" /><input type="hidden" name="visitor_ID" class="f-visitor-id" value="',b.visitor_ID,'" /><textarea name="chat_line" class="f-chat-line" maxlength="700" placeholder="',sc_chat.tr_write_a_reply,'"></textarea></form></div>']}return d.join("")},open_new_tab:function(c,b,d){user_type=a('.sc-chat-users a[data-visitor-id="'+b+'"]').attr("data-user-type");var e=[];e.ID=c;e.visitor_ID=b;e.custom_class="";e.user_info="1"!=user_type&&b?sc_chat.tr_loading+"...":"";if(0==a(".sc-chat-tabs li#Tab_"+c).length){if(1==
a(".sc-chat-tabs .console-tab.active").length||d)a(".sc-chat-tabs li").removeClass("active"),a(".sc-chat-tab-content").removeClass("active"),e.custom_class="active ";a(".sc-chat-tabs").append(a.sc_chat.render("new_tab_title",e));a(".sc-chat-tab-contents").append(a.sc_chat.render("new_tab_content",e));a("#Receiver_"+c+" .f-chat-line").focus()}a.sc_chat.get_user_info(b,c);return!1},get_user_info:function(c,b){a.sc_chat.data.receiver_ID=b;a.sc_GET("user_info","action=sc_chat_ajax_callback&ID="+c,function(b){"null"!=
b.device_name&&(a.sc_chat.data.user_info=b.device_name+" "+b.device_version+" - "+b.platform+", "+b.ip_address+' &nbsp; <a href="admin.php?page=sc_chat_m_chat_logs&action=edit&visitor_ID='+c+'" target="_blank">'+sc_chat.tr_chat_logs+"</a>",a.sc_chat.update_user_info())})},update_user_info:function(){a("#Receiver_"+a.sc_chat.data.receiver_ID+" .sc-chat-user-agent").html(a.sc_chat.data.user_info)},add_chat_line:function(c){if(!0==sc_chat.is_admin){c.author==sc_chat.username&&c.receiver_ID==sc_chat.username?
a.sc_chat.data.sender=sc_chat.username:c.receiver_ID==sc_chat.username?a.sc_chat.data.sender=c.author:c.author==sc_chat.username?a.sc_chat.data.sender=c.receiver_ID:"__OP__"==c.receiver_ID&&(a.sc_chat.data.sender=c.author);if(a.sc_chat.data.sender){var b=a("#User_"+a.sc_chat.data.sender).attr("data-visitor-id");a.sc_chat.open_new_tab(a.sc_chat.data.sender,b);a.sc_chat.update_user_info()}a("#Tab_"+c.author+":not(.active)").addClass("new-msg")}b=new Date;c.time&&b.setUTCHours(c.time.hours,c.time.minutes);
c.time=(10>b.getHours()?"0":"")+b.getHours()+":"+(10>b.getMinutes()?"0":"")+b.getMinutes();b=a.sc_chat.render("chat_line",c);exists=a(".sc-cnv-wrap .chat-"+c.ID);exists.length&&exists.remove();a.sc_chat.data.last_log_ID||a(".sc-cnv-wrap .sc-lead").remove();var d=!0==sc_chat.is_admin?a("#Receiver_"+a.sc_chat.data.sender+" .sc-cnv-wrap"):a(".sc-cnv-wrap");if("t"!=c.ID.toString().charAt(0)){var e=d.find(".chat-"+(+c.ID-1));e.length?e.after(b):d.append(b)}else d.append(b);a(".sc-cnv-wrap").scrollTop(1E5);
a.sc_chat.data.last_user=c.author},get_chat_lines:function(c){a.sc_chat.data.logged_in||!1!=sc_chat.is_admin?a.sc_GET("get_chat_lines",{last_log_ID:a.sc_chat.data.last_log_ID,action:"sc_chat_ajax_callback",sender:a.sc_chat.data.sender},function(b){for(var d=0;d<b.chats.length;d++)a.sc_chat.add_chat_line(b.chats[d]);b.chats.length?(a.sc_chat.data.no_activity=0,a.sc_chat.data.last_log_ID=b.chats[d-1].ID,!0==a.sc_chat.data.first_time||0!=a.sc_chat.data.win_is_active&&!0!=sc_chat.is_admin||(!0==sc_chat.is_admin?
a.sc_chat.play_sound("new_message"):"on"==a.cookie("sc_chat_chatbox_status")&&a.sc_chat.play_sound("new_message"))):a.sc_chat.data.no_activity++;b=1E3;3<a.sc_chat.data.no_activity&&(b=2E3);10<a.sc_chat.data.no_activity&&(b=5E3);20<a.sc_chat.data.no_activity&&(b=15E3);setTimeout(c,b)}):setTimeout(c,1E3)},get_online_users:function(c){a.sc_chat.data.logged_in||!1!=sc_chat.is_admin?a.sc_GET("get_online_users",{action:"sc_chat_ajax_callback"},function(b){if(!0==sc_chat.is_admin){for(var d=[],e=0;e<b.users.length;e++)b.users[e]&&
d.push(a.sc_chat.render("user",b.users[e]));e="";e=1>b.total?sc_chat.tr_no_one_online:1==b.total?sc_chat.tr_1_person_online:sc_chat.tr_x_people_online.replace("%s",b.total);d.push('<p class="count">'+e+"</p>");a("#People_list .sc-chat-users").html(d.join(""))}setTimeout(c,15E3)}):setTimeout(c,3E3)},animate_chatbox:function(){var c=a("#sc_chat_box"),b=a("#sc_chat_box .sc-chat-header"),d=c.innerHeight(),e=b.innerHeight();

if(d>0){
	a.cookie("sc_chat_height",d,{expires:1});
}else if(a.cookie("sc_chat_height")>0){
	d = a.cookie("sc_chat_height");
}

c.css("bottom","-"+d+"px");


c.css("visibility","visible");1==sc_chat.use_css_anim?
(c.css("bottom","-"+(d-e)+"px").addClass("sc-chat-animated sc-chat-bounce-in-up"),b.click(function(){a.removeCookie("sc_chat_chatbox_status");d=c.innerHeight();e=b.innerHeight();!1==a.sc_chat.data.sc_chat_box_visible?(d=c.innerHeight(),e=b.innerHeight(),c.css("bottom",0).addClass("sc-chat-css-anim"),setTimeout(function(){480<window.innerWidth&&(a("#f_chat_user_name").length?a("#f_chat_user_name, .f-chat-line").focus():a("#f_chat_user_email, .f-chat-line").focus())},500),!0==a.sc_chat.data.logged_in&&
(a("#Conversation").show(),setTimeout(function(){a(".f-chat-line").focus().autosize()},500)),a.cookie("sc_chat_chatbox_status","on",{expires:1}),a.sc_chat.data.sc_chat_box_visible=!0):(c.css("bottom","-"+(d-e)+"px"),a.cookie("sc_chat_chatbox_status","off",{expires:1}),a.sc_chat.data.sc_chat_box_visible=!1)})):(c.stop().animate({bottom:"+="+e},{duration:900,easing:"easeOutBack"}),b.click(function(){a("#Conversation").show();a.removeCookie("sc_chat_chatbox_status");d=c.innerHeight();e=b.innerHeight();
!1==a.sc_chat.data.sc_chat_box_visible?(c.stop().animate({bottom:0},{duration:200,easing:"easeOutExpo",complete:function(){480<window.innerWidth&&(a("#f_chat_user_name").length?a("#f_chat_user_name, .f-chat-line").focus():a("#f_chat_user_email, .f-chat-line").focus())}}),a.cookie("sc_chat_chatbox_status","on",{expires:1}),a.sc_chat.data.sc_chat_box_visible=!0):(a.cookie("sc_chat_chatbox_status","off",{expires:1}),c.stop().animate({bottom:"-"+(d-e)},{duration:190,easing:"easeOutExpo"}),a.cookie("sc_chat_chatbox_status",
"off",{expires:1}),a.sc_chat.data.sc_chat_box_visible=!1)}))},open_chatbox:function(){var c=a("#sc_chat_box");a("#Reply_form .f-chat-line").removeAttr("disabled").removeClass("sc-chat-error");1==sc_chat.use_css_anim?c.css("bottom",0):(c.stop().animate({bottom:0},{duration:200,easing:"easeOutExpo"}),a("#f_chat_user_name, .f-chat-line").focus())},hide_chatbox:function(){var c=a("#sc_chat_box"),b=a("#sc_chat_box .sc-chat-header");sc_chat_box_h=c.innerHeight();sc_chat_header_h=b.innerHeight();1==sc_chat.use_css_anim?
c.css("bottom","-"+(sc_chat_box_h-sc_chat_header_h)+"px"):c.stop().animate({bottom:"-"+(sc_chat_box_h-sc_chat_header_h)},{duration:190,easing:"easeOutExpo"});a.sc_chat.data.sc_chat_box_visible=!1},add_source:function(c,b){a("<source>").attr("src",b).appendTo(c)},play_sound:function(c){if("none"!=sc_chat.sound_package){var b=a("<audio />",{autoPlay:"autoplay"});a.sc_chat.add_source(b,sc_chat.plugin_url+"/assets/sounds/"+c+".mp3");a.sc_chat.add_source(b,sc_chat.plugin_url+"/assets/sounds/"+c+".ogg");
a.sc_chat.add_source(b,sc_chat.plugin_url+"/assets/sounds/"+c+".mp3");b.appendTo("body")}},display_error:function(c){var b=!0==sc_chat.is_admin?"error":"";a(".sc-chat-notification").show().html("").delay(500).html('<div class="'+b+'">'+c+"</div>")},hide_error:function(){a(".sc-chat-notification").hide()}};a.sc_POST=function(c,b,d){a.post(sc_chat.ajaxurl+"?mode="+c,b,d,"json").fail(function(b){a.sc_chat.data.error=!0;console.log(b);a.sc_chat.display_error(sc_chat.tr_connecting+"...");return!1}).done(function(){!0==
a.sc_chat.data.error&&a.sc_chat.hide_error();a.sc_chat.data.error=!1})};a.sc_GET=function(c,b,d){a.get(sc_chat.ajaxurl+"?mode="+c,b,d,"json").fail(function(b){a.sc_chat.data.error=!0;console.log(b);a.sc_chat.display_error(sc_chat.tr_connecting+"...");return!1}).done(function(){!0==a.sc_chat.data.error&&a.sc_chat.hide_error();a.sc_chat.data.error=!1})}})(window.jQuery||window.Zepto);;

/* sc_chat_app_popup: (http://www.artjiahua.com/qfy-content/plugins/screets-chat/assets/js/sc_chat_app_popup.js) */
/*
 * Screets Chat
 * Application scripts
 *
 * Copyright (c) 2013 Screets
 */

(function ($) {
	$(document).ready(function () {
		if(sc_chat_pop.mobile_shut==1 && jQuery("body").width()<768){
			//shut down
		}else{
			if (sc_chat_pop.pop_status) {
				setTimeout(function() {
					show_popup_html();
				}, sc_chat_pop.pop_delay_time*1000);
			}
		}
	});

	function show_popup_html() {
		if ($('body').hasClass('compose-mode')) {
			$('.sc_chat_qq a').click(function(){
				jAlert("编辑模式下不能启动QQ聊天，请在预览页面下测试。");
			});
			return ;
		}
		
		var html = '';
		html += '<div id=\"sc_chat_pop\" style="visibility: visible; z-index: 10001; width: 360px; height: 180px; left: 50%; top: 50%; position: fixed; margin-left: -180px; margin-top: -90px; background: #FFF; border: 1px solid;">';
		html += '	<div style="position: relative;">';
		html += '		<div style="height: 130px; position: absolute; margin-left: 180px;">';
		html += '			<div style="color: rgb(21, 81, 158); font-weight: bolder; font-size: 24px; margin-top: 22px;">';
		html += sc_chat_pop.pop_title + '</div>';
		html += '			<div style="color: rgb(34, 34, 34); margin-top: 10px; font-weight: bolder; font-size: 14px; width: 175px; overflow: hidden; max-height: 64px; word-wrap: break-word;">';
		html += sc_chat_pop.pop_msg + '</div>';
		html += '			</div>';
		html += '		<div style="height: 50px; width: 100%; background: #222; position: absolute; top:130px; ">';
		html += '			<div style="position:relative; margin-left: 80px;">';
		html += '				<a class=\"bitButton iconRight sc_chat_pop_accept\" style=\"border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; border-bottom-left-radius: 6px; box-shadow: none; border: none; padding: 6px 18px; opacity: 0.91; background-color: rgb(48, 168, 18); position: absolute;left: 0px;top: 10px;\" data-cke-pa-onmouseover=\"this.style.backgroundColor=\'rgb(48, 189, 13)\';this.style.borderColor=\'rgb(48, 189, 13)\';\" data-cke-pa-onmouseout=\"this.style.backgroundColor=\'rgb(48, 168, 18)\';this.style.borderColor=\'rgb(48, 189, 13)\';\"><span class=\"iconText\" style=\"font-family: 宋体; color: rgb(255, 255, 255); font-size: 14px;\">'+sc_chat_pop.send_btn1+'</span><b style=\"color: rgb(255, 255, 255); display: none;\"> <i class=\"glyphicon glyphicon-icon-ok\" style=\"left: 6px; top: 0px;\"> <span style=\"display: none; width: 0px;\"> ​</span> </i> </b></a>';
		html += '				<a class=\"bitButton iconRight sc_chat_pop_refuse\" style=\"border-top-left-radius: 6px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; border-bottom-left-radius: 6px; box-shadow: none; border: none; padding: 6px 18px; opacity: 0.91; background-color: rgb(48, 168, 18); position: absolute;left: 110px;top: 10px;\" data-cke-pa-onmouseover=\"this.style.backgroundColor=\'rgb(48, 189, 13)\';this.style.borderColor=\'rgb(48, 189, 13)\';\" data-cke-pa-onmouseout=\"this.style.backgroundColor=\'rgb(48, 168, 18)\';this.style.borderColor=\'rgb(48, 189, 13)\';\"><span class=\"iconText\" style=\"font-family: 宋体; color: rgb(255, 255, 255); font-size: 14px;\">'+sc_chat_pop.send_btn2+'</span><b style=\"color: rgb(255, 255, 255); display: none;\"> <i class=\"glyphicon glyphicon-icon-ok\" style=\"left: 6px; top: 0px;\"> <span style=\"display: none; width: 0px;\"> ​</span> </i> </b></a>';
		html += '			</div>';
		html += '		</div>';
		html += '		<div style="position: absolute;">';
		html += '			<img style="max-height: 130px; max-width:195px;" src="//f.goodq.top/qfy-content/plugins/screets-chat/assets/supportgirls/';
		html += sc_chat_pop.pop_logo_img + '.png">';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		$('body').append(html);
		$('#sc_chat_pop .sc_chat_pop_accept').unbind('click').click(function(){
			$('#sc_chat_pop').hide();
			if ($('#sc_chat_box').css('bottom') != '0px') {
				$('#sc_chat_box .sc-chat-header').trigger( "click" );
			}
		});
		$('#sc_chat_pop .sc_chat_pop_refuse').unbind('click').click(function(){
			$('#sc_chat_pop').hide();
		});
	}
} (window.jQuery));
;

/* jquery-blockui: (http://www.artjiahua.com/qfy-content/plugins/bitcommerce/assets/js/jquery-blockui/jquery.blockUI.min.js) */
/*!
 * jQuery blockUI plugin
 * Version 2.66.0-2013.10.09
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */(function(){"use strict";function e(e){function a(i,a){var l,h,m=i==window,g=a&&a.message!==undefined?a.message:undefined;a=e.extend({},e.blockUI.defaults,a||{});if(a.ignoreIfBlocked&&e(i).data("blockUI.isBlocked"))return;a.overlayCSS=e.extend({},e.blockUI.defaults.overlayCSS,a.overlayCSS||{});l=e.extend({},e.blockUI.defaults.css,a.css||{});a.onOverlayClick&&(a.overlayCSS.cursor="pointer");h=e.extend({},e.blockUI.defaults.themedCSS,a.themedCSS||{});g=g===undefined?a.message:g;m&&o&&f(window,{fadeOut:0});if(g&&typeof g!="string"&&(g.parentNode||g.jquery)){var y=g.jquery?g[0]:g,b={};e(i).data("blockUI.history",b);b.el=y;b.parent=y.parentNode;b.display=y.style.display;b.position=y.style.position;b.parent&&b.parent.removeChild(y)}e(i).data("blockUI.onUnblock",a.onUnblock);var w=a.baseZ,E,S,x,T;n||a.forceIframe?E=e('<iframe class="blockUI" style="z-index:'+w++ +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+a.iframeSrc+'"></iframe>'):E=e('<div class="blockUI" style="display:none"></div>');a.theme?S=e('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+w++ +';display:none"></div>'):S=e('<div class="blockUI blockOverlay" style="z-index:'+w++ +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');if(a.theme&&m){T='<div class="blockUI '+a.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(w+10)+';display:none;position:fixed">';a.title&&(T+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(a.title||"&nbsp;")+"</div>");T+='<div class="ui-widget-content ui-dialog-content"></div>';T+="</div>"}else if(a.theme){T='<div class="blockUI '+a.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(w+10)+';display:none;position:absolute">';a.title&&(T+='<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(a.title||"&nbsp;")+"</div>");T+='<div class="ui-widget-content ui-dialog-content"></div>';T+="</div>"}else m?T='<div class="blockUI '+a.blockMsgClass+' blockPage" style="z-index:'+(w+10)+';display:none;position:fixed"></div>':T='<div class="blockUI '+a.blockMsgClass+' blockElement" style="z-index:'+(w+10)+';display:none;position:absolute"></div>';x=e(T);if(g)if(a.theme){x.css(h);x.addClass("ui-widget-content")}else x.css(l);a.theme||S.css(a.overlayCSS);S.css("position",m?"fixed":"absolute");(n||a.forceIframe)&&E.css("opacity",0);var N=[E,S,x],C=m?e("body"):e(i);e.each(N,function(){this.appendTo(C)});a.theme&&a.draggable&&e.fn.draggable&&x.draggable({handle:".ui-dialog-titlebar",cancel:"li"});var k=s&&(!e.support.boxModel||e("object,embed",m?null:i).length>0);if(r||k){m&&a.allowBodyStretch&&e.support.boxModel&&e("html,body").css("height","100%");if((r||!e.support.boxModel)&&!m)var L=v(i,"borderTopWidth"),A=v(i,"borderLeftWidth"),O=L?"(0 - "+L+")":0,M=A?"(0 - "+A+")":0;e.each(N,function(e,t){var n=t[0].style;n.position="absolute";if(e<2){m?n.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:"+a.quirksmodeOffsetHack+') + "px"'):n.setExpression("height",'this.parentNode.offsetHeight + "px"');m?n.setExpression("width",'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'):n.setExpression("width",'this.parentNode.offsetWidth + "px"');M&&n.setExpression("left",M);O&&n.setExpression("top",O)}else if(a.centerY){m&&n.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');n.marginTop=0}else if(!a.centerY&&m){var r=a.css&&a.css.top?parseInt(a.css.top,10):0,i="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+r+') + "px"';n.setExpression("top",i)}})}if(g){a.theme?x.find(".ui-widget-content").append(g):x.append(g);(g.jquery||g.nodeType)&&e(g).show()}(n||a.forceIframe)&&a.showOverlay&&E.show();if(a.fadeIn){var _=a.onBlock?a.onBlock:t,D=a.showOverlay&&!g?_:t,P=g?_:t;a.showOverlay&&S._fadeIn(a.fadeIn,D);g&&x._fadeIn(a.fadeIn,P)}else{a.showOverlay&&S.show();g&&x.show();a.onBlock&&a.onBlock()}c(1,i,a);if(m){o=x[0];u=e(a.focusableElements,o);a.focusInput&&setTimeout(p,20)}else d(x[0],a.centerX,a.centerY);if(a.timeout){var H=setTimeout(function(){m?e.unblockUI(a):e(i).unblock(a)},a.timeout);e(i).data("blockUI.timeout",H)}}function f(t,n){var r,i=t==window,s=e(t),a=s.data("blockUI.history"),f=s.data("blockUI.timeout");if(f){clearTimeout(f);s.removeData("blockUI.timeout")}n=e.extend({},e.blockUI.defaults,n||{});c(0,t,n);if(n.onUnblock===null){n.onUnblock=s.data("blockUI.onUnblock");s.removeData("blockUI.onUnblock")}var h;i?h=e("body").children().filter(".blockUI").add("body > .blockUI"):h=s.find(">.blockUI");if(n.cursorReset){h.length>1&&(h[1].style.cursor=n.cursorReset);h.length>2&&(h[2].style.cursor=n.cursorReset)}i&&(o=u=null);if(n.fadeOut){r=h.length;h.stop().fadeOut(n.fadeOut,function(){--r===0&&l(h,a,n,t)})}else l(h,a,n,t)}function l(t,n,r,i){var s=e(i);if(s.data("blockUI.isBlocked"))return;t.each(function(e,t){this.parentNode&&this.parentNode.removeChild(this)});if(n&&n.el){n.el.style.display=n.display;n.el.style.position=n.position;n.parent&&n.parent.appendChild(n.el);s.removeData("blockUI.history")}s.data("blockUI.static")&&s.css("position","static");typeof r.onUnblock=="function"&&r.onUnblock(i,r);var o=e(document.body),u=o.width(),a=o[0].style.width;o.width(u-1).width(u);o[0].style.width=a}function c(t,n,r){var i=n==window,s=e(n);if(!t&&(i&&!o||!i&&!s.data("blockUI.isBlocked")))return;s.data("blockUI.isBlocked",t);if(!i||!r.bindEvents||t&&!r.showOverlay)return;var u="mousedown mouseup keydown keypress keyup touchstart touchend touchmove";t?e(document).bind(u,r,h):e(document).unbind(u,h)}function h(t){if(t.type==="keydown"&&t.keyCode&&t.keyCode==9&&o&&t.data.constrainTabKey){var n=u,r=!t.shiftKey&&t.target===n[n.length-1],i=t.shiftKey&&t.target===n[0];if(r||i){setTimeout(function(){p(i)},10);return!1}}var s=t.data,a=e(t.target);a.hasClass("blockOverlay")&&s.onOverlayClick&&s.onOverlayClick(t);return a.parents("div."+s.blockMsgClass).length>0?!0:a.parents().children().filter("div.blockUI").length===0}function p(e){if(!u)return;var t=u[e===!0?u.length-1:0];t&&t.focus()}function d(e,t,n){var r=e.parentNode,i=e.style,s=(r.offsetWidth-e.offsetWidth)/2-v(r,"borderLeftWidth"),o=(r.offsetHeight-e.offsetHeight)/2-v(r,"borderTopWidth");t&&(i.left=s>0?s+"px":"0");n&&(i.top=o>0?o+"px":"0")}function v(t,n){return parseInt(e.css(t,n),10)||0}e.fn._fadeIn=e.fn.fadeIn;var t=e.noop||function(){},n=/MSIE/.test(navigator.userAgent),r=/MSIE 6.0/.test(navigator.userAgent)&&!/MSIE 8.0/.test(navigator.userAgent),i=document.documentMode||0,s=e.isFunction(document.createElement("div").style.setExpression);e.blockUI=function(e){a(window,e)};e.unblockUI=function(e){f(window,e)};e.growlUI=function(t,n,r,i){var s=e('<div class="growlUI"></div>');t&&s.append("<h1>"+t+"</h1>");n&&s.append("<h2>"+n+"</h2>");r===undefined&&(r=3e3);var o=function(t){t=t||{};e.blockUI({message:s,fadeIn:typeof t.fadeIn!="undefined"?t.fadeIn:700,fadeOut:typeof t.fadeOut!="undefined"?t.fadeOut:1e3,timeout:typeof t.timeout!="undefined"?t.timeout:r,centerY:!1,showOverlay:!1,onUnblock:i,css:e.blockUI.defaults.growlCSS})};o();var u=s.css("opacity");s.mouseover(function(){o({fadeIn:0,timeout:3e4});var t=e(".blockMsg");t.stop();t.fadeTo(300,1)}).mouseout(function(){e(".blockMsg").fadeOut(1e3)})};e.fn.block=function(t){if(this[0]===window){e.blockUI(t);return this}var n=e.extend({},e.blockUI.defaults,t||{});this.each(function(){var t=e(this);if(n.ignoreIfBlocked&&t.data("blockUI.isBlocked"))return;t.unblock({fadeOut:0})});return this.each(function(){if(e.css(this,"position")=="static"){this.style.position="relative";e(this).data("blockUI.static",!0)}this.style.zoom=1;a(this,t)})};e.fn.unblock=function(t){if(this[0]===window){e.unblockUI(t);return this}return this.each(function(){f(this,t)})};e.blockUI.version=2.66;e.blockUI.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},cursorReset:"default",growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,focusableElements:":input:enabled:visible",onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg",ignoreIfBlocked:!1};var o=null,u=[]}typeof define=="function"&&define.amd&&define.amd.jQuery?define(["jquery"],e):e(jQuery)})();;

/* dt-plugins: (http://www.artjiahua.com/qfy-content/themes/qfy-01/js/plugins.js) */
/*jquery-parallax*/
/*scroll 用到*/
if(typeof jQuery.easing["jswing"]=="undefined"){jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return jQuery.easing[jQuery.easing.def](e,t,n,r,i)},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t+n;return-r/2*(--t*(t-2)-1)+n},easeInCubic:function(e,t,n,r,i){return r*(t/=i)*t*t+n},easeOutCubic:function(e,t,n,r,i){return r*((t=t/i-1)*t*t+1)+n},easeInOutCubic:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t+n;return r/2*((t-=2)*t*t+2)+n},easeInQuart:function(e,t,n,r,i){return r*(t/=i)*t*t*t+n},easeOutQuart:function(e,t,n,r,i){return-r*((t=t/i-1)*t*t*t-1)+n},easeInOutQuart:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t+n;return-r/2*((t-=2)*t*t*t-2)+n},easeInQuint:function(e,t,n,r,i){return r*(t/=i)*t*t*t*t+n},easeOutQuint:function(e,t,n,r,i){return r*((t=t/i-1)*t*t*t*t+1)+n},easeInOutQuint:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t*t+n;return r/2*((t-=2)*t*t*t*t+2)+n},easeInSine:function(e,t,n,r,i){return-r*Math.cos(t/i*(Math.PI/2))+r+n},easeOutSine:function(e,t,n,r,i){return r*Math.sin(t/i*(Math.PI/2))+n},easeInOutSine:function(e,t,n,r,i){return-r/2*(Math.cos(Math.PI*t/i)-1)+n},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){if(t==0)return n;if(t==i)return n+r;if((t/=i/2)<1)return r/2*Math.pow(2,10*(t-1))+n;return r/2*(-Math.pow(2,-10*--t)+2)+n},easeInCirc:function(e,t,n,r,i){return-r*(Math.sqrt(1-(t/=i)*t)-1)+n},easeOutCirc:function(e,t,n,r,i){return r*Math.sqrt(1-(t=t/i-1)*t)+n},easeInOutCirc:function(e,t,n,r,i){if((t/=i/2)<1)return-r/2*(Math.sqrt(1-t*t)-1)+n;return r/2*(Math.sqrt(1-(t-=2)*t)+1)+n},easeInElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return-(u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o))+n},easeOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return u*Math.pow(2,-10*t)*Math.sin((t*i-s)*2*Math.PI/o)+r+n},easeInOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i/2)==2)return n+r;if(!o)o=i*.3*1.5;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);if(t<1)return-.5*u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)+n;return u*Math.pow(2,-10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)*.5+r+n},easeInBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*(t/=i)*t*((s+1)*t-s)+n},easeOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*((t=t/i-1)*t*((s+1)*t+s)+1)+n},easeInOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;if((t/=i/2)<1)return r/2*t*t*(((s*=1.525)+1)*t-s)+n;return r/2*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+n},easeInBounce:function(e,t,n,r,i){return r-jQuery.easing.easeOutBounce(e,i-t,0,r,i)+n},easeOutBounce:function(e,t,n,r,i){if((t/=i)<1/2.75){return r*7.5625*t*t+n}else if(t<2/2.75){return r*(7.5625*(t-=1.5/2.75)*t+.75)+n}else if(t<2.5/2.75){return r*(7.5625*(t-=2.25/2.75)*t+.9375)+n}else{return r*(7.5625*(t-=2.625/2.75)*t+.984375)+n}},easeInOutBounce:function(e,t,n,r,i){if(t<i/2)return jQuery.easing.easeInBounce(e,t*2,0,r,i)*.5+n;return jQuery.easing.easeOutBounce(e,t*2-i,0,r,i)*.5+r*.5+n}})}

/**
 * jquery.dlmenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( $, window, undefined ) {

	// global
	var Modernizr = window.Modernizr, $body = $( 'body' );

	$.DLMenu = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.DLMenu.defaults = {
		// classes for the animation effects
		animationClasses : { animIn : 'dl-animate-in-2', animOut : 'dl-animate-out-2' }
	};

	$.DLMenu.prototype = {
		_init : function( options ) {

			// options
			this.options = $.extend( true, {}, $.DLMenu.defaults, options );
			// cache some elements and initialize some variables
			this._config();
			
			var animEndEventNames = {
					'WebkitAnimation' : 'webkitAnimationEnd',
					'OAnimation' : 'oAnimationEnd',
					'msAnimation' : 'MSAnimationEnd',
					'animation' : 'animationend'
				},
				transEndEventNames = {
					'WebkitTransition' : 'webkitTransitionEnd',
					'MozTransition' : 'transitionend',
					'OTransition' : 'oTransitionEnd',
					'msTransition' : 'MSTransitionEnd',
					'transition' : 'transitionend'
				};
			// animation end event name
			this.animEndEventName = animEndEventNames[  'animation' ] + '.dlmenu';
			// transition end event name
			this.transEndEventName = transEndEventNames[  'transition' ] + '.dlmenu',
			// support for css animations and css transitions
			this.supportAnimations = true,
			this.supportTransitions = true;

			this._initEvents();

		},
		_config : function() {
			this.open = false;
			this.$trigger = this.$el.find( '#mobile-menu' );
/* ! !changed */
			this.openCap = '<span class="wf-phone-visible">&nbsp;</span><span class="wf-phone-hidden phone-text">'+this.$el.find( '.menu-open' ).html()+"</span><span class='mobile_icon glyphicon glyphicon-icon-angle-down' ></span>";
			this.closeCap = '<span class="wf-phone-visible">&nbsp;</span><span class="wf-phone-hidden  phone-text">'+this.$el.find( '.menu-close' ).html()+"</span><span class='mobile_icon  glyphicon glyphicon-icon-angle-down' ></span>";
/* !changed: end */
			
			if($("body").hasClass("mobilefloatmenu") && this.$trigger.closest(".floatmenu,.fullfloatmenu").length>0 && this.$trigger.closest(".qfy-listcatecontrols").length==0){
				this.$menu = jQuery( '.floatwarpper ul.dl-menu' );
			}else{
				this.$menu = this.$el.find( 'ul.dl-menu' );
			}
			this.$menuitems = this.$menu.find( 'li:not(.dl-back)' );
			
		

			this.$back = this.$menu.find( 'li.dl-back' );
			this.$menuitems.each(function(){
				var $item_new = $(this),
						$submenu_new = $item_new.children( 'ul.dl-submenu' );
						 $item_new.siblings(".new-column").find("> a").remove();
					var new_col_sub = $item_new.siblings(".new-column").find("> ul.dl-submenu").unwrap();
						new_col_sub.find("> a, > .dl-back").remove();
					new_col_sub.children().unwrap().appendTo($submenu_new);
					$item_new.siblings(".new-column").remove();
					if( $item_new.find("> a").attr("href")=="#"){
						$item_new.find("> a").removeAttr("href");
					}
			});
		},
		_initEvents : function() {

			var self = this;
			self.not_close_menu = false;
			if(self.$trigger.parent().hasClass("notcloseparent")) {
				self.not_close_menu = true;
				self.$trigger.parent().find(".menu-item.dl-back").remove();
			}
			this.$trigger.unbind().on( 'click.dlmenu', function(event) {

				if( self.open ) {
					if(self.not_close_menu){
						if($(event.currentTarget).hasClass("dropCenterStyle")){
							self._closeMenu();
						}
					}else{
						self._closeMenu();
					}
				}
				else {
					self._openMenu();
					// clicking somewhere else makes the menu close

					if(self.$trigger.hasClass("leftbtnmenu")) {
						if (jQuery("body >.dl-menu-film").length == 0) {
							jQuery("body").prepend("<div class='dl-menu-film wf-mobile-visible'></div>");
						}
						jQuery("body >.dl-menu-film").off('click').on('click.dlmenu', function () {
							self._closeMenu();
						});
					}else if(self.not_close_menu) {
						//...
					}else{
						$body.off( 'click' ).on( 'click.dlmenu', function() {
							self._closeMenu() ;
						} );
					}
					
				}
				return false;

			} );
			
			this.$menuitems.on( 'click.dlmenu', function( event ) {
				if($(this).closest(".dl-menuwrapper").css("visibility")=="hidden"){
					return;
				}
				event.stopPropagation();

				var $item = $(this),$submenu = $item.children( 'ul.dl-submenu' );
				
				
				if( $submenu.length > 0 ) {
					var xx=event.pageX;
					var width = $submenu.width();
				
					var isclick = width-xx>35;

					if($item.closest("#dl-menu").find(">#mobile-menu").hasClass("firstopensub") || jQuery("#dl-menu >#mobile-menu").hasClass("firstopensub")){
						var textw = $item.find(">a>span").width()*1+$item.find(">a>span").offset().left*1;
						isclick = xx<textw;
					}
					if(!$item.find(">a").attr("href")){
						//无链接
						isclick = false;
					}
					if(isclick){
						if($item.find("a").attr("href") && $item.find("a").attr("href").indexOf("#")>-1){
							//self._closeMenu();
						}
					}else{
						//...

						if(	$(this).closest(".dl-menuwrapper").hasClass("leftbtnmenu") || 	self.not_close_menu){
							if($submenu.css("display")!="block"){
								var h  = $submenu.height();
								$submenu.show().css("height",0).animate({ height: h }, 150,function(){
									$submenu.attr("style","display:block;");
								});
								$item.addClass( 'dl-subviewopen' );
							}else{
								$submenu.animate({ height: 0 }, 150,function(){
									$submenu.hide();
								});
								
								$item.removeClass( 'dl-subviewopen' )
							}
						}else{
							$("html, body").animate({ scrollTop: self.$el.offset().top - 20 }, 150);

							var $flyin = $submenu.clone().insertAfter( self.$menu ).addClass( self.options.animationClasses.animIn ),
								onAnimationEndFn = function() {
									self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.animOut ).addClass( 'dl-subview' );
									$item.addClass( 'dl-subviewopen' ).parents( '.dl-subviewopen:first' ).removeClass( 'dl-subviewopen' ).addClass( 'dl-subview' );
									$item.addClass( 'qfy-subviewopen' );
									$flyin.remove();
								};

							self.$menu.addClass( self.options.animationClasses.animOut );


							if( self.supportAnimations ) {
								self.$menu.on( self.animEndEventName, onAnimationEndFn );
							}
							else {
								onAnimationEndFn.call();
							}
							
							
						}

					
						
						return false;
					}

				}else{

					if($item.find("a").attr("href") && $item.find("a").attr("href").indexOf("#")>-1 && !self.not_close_menu){
						self._closeMenu();
					}
					
				}
			} );

			this.$back.on( 'click.dlmenu', function( event ) {

				$("html, body").animate({ scrollTop: self.$el.offset().top - 20 }, 150);

				var $this = $( this ),
					$submenu = $this.parents( 'ul.dl-submenu:first' ),
					$item = $submenu.parent(),


					$flyin = $submenu.clone().insertAfter( self.$menu ).addClass( self.options.animationClasses.animOut );

				var onAnimationEndFn = function() {
					self.$menu.off( self.animEndEventName ).removeClass( self.options.animationClasses.animIn );
					$flyin.remove();
				};

				self.$menu.addClass( self.options.animationClasses.animIn );

				if( self.supportAnimations ) {
					self.$menu.on( self.animEndEventName, onAnimationEndFn );
				}
				else {
					onAnimationEndFn.call();
				}

				$item.removeClass( 'dl-subviewopen' ).removeClass("qfy-subviewopen");
				
				var $subview = $this.parents( '.dl-subview:first' );
				if( $subview.is( 'li' ) ) {
					$subview.addClass( 'dl-subviewopen' ).addClass("qfy-subviewopen");
				}
				$subview.removeClass( 'dl-subview' );

				return false;

			} );
			
		},
		_closeMenu : function() {
			var self = this,
				onTransitionEndFn = function() {
					self.$menu.off( self.transEndEventName );
					self._resetMenu();
				};

			this.$menu.removeClass( 'dl-menuopen' );
			this.$menu.parent().removeClass("dl-menuopen-parent");
			if($("body").hasClass("mobilefloatmenu") && this.$trigger.closest(".floatmenu,.fullfloatmenu").length>0 && this.$trigger.closest(".qfy-listcatecontrols").length==0){
				$(".mobilefloatmenu.dl-menu-open #page").removeAttr("style");
				$(".dl-menu-open .floatwarpper").removeAttr("style");
				$(".floatwarpper .dl-container").removeAttr("style");
				$("#page #dl-menu").removeAttr("style");
				$("body > #dl-menu").remove();
				var element_right = $("#mobile-menu").attr("data-right");
				if(element_right){
					$("#dl-menu").css("right",element_right+"px");
				}
				var element_top = $("#mobile-menu").attr("data-top");
				if(element_top){
					$("#dl-menu").css("top",element_top+"px");
				}
			}
			$("body").removeClass("dl-menu-open");
			this.$menu.addClass( 'dl-menu-toggle' );
			if(this.$menu.closest("section.section").length>0){
				var style = this.$menu.closest("section.section").attr("style");
				style = style.replace(/min-height:\s*\d+px;*/g,"");
				this.$menu.closest("section.section").attr("style",style);
			}
			this.$trigger.removeClass( 'dl-active' ).html(this.openCap);
			
			if( this.supportTransitions ) {
				this.$menu.on( this.transEndEventName, onTransitionEndFn );
			}
			else {
				onTransitionEndFn.call();
			}

			this.open = false;

/*
			this.$el.css({
				position : "fixed",
				top : ""
			});
*/
		},
		_openMenu : function() {

			this.$menu.parent().addClass("dl-menuopen-parent");
			this.$menu.addClass( 'dl-menuopen dl-menu-toggle' ).on( this.transEndEventName, function() {
				$( this ).removeClass( 'dl-menu-toggle' );
			} );
			if($("body").hasClass("mobilefloatmenu") && this.$trigger.closest(".floatmenu,.fullfloatmenu").length>0 && this.$menu.closest(".qfy-listcatecontrols").length==0){

				var $this = this;
				$("body").addClass("dl-menu-open");
				var width =  $('html').width();
				if($("#mobile-menu").hasClass("fullfloatmenu")){
					var w= width;
				}else{
					var w = width - 60;
				}
				
				if(!$(".floatwarpper").hasClass("leftbtnmenu")){
					$(".mobilefloatmenu.dl-menu-open #page").css('transform','translate3d(-'+w+'px, 0px, 0px)').css('-webkit-transform','translate3d(-'+w+'px,0,0)');
					$(".dl-menu-open .floatwarpper").css('transform','translate3d(-'+w+'px, 0px, 0px)').css('-webkit-transform','translate3d(-'+w+'px,0,0)');
					$(".floatwarpper").width(w).css("right","-"+w+"px");
				}
				$(".floatwarpper .dl-container").css("max-width","100%");
				var element_top = $("#mobile-menu").attr("data-top");
				var element_right = $("#mobile-menu").attr("data-right");
				if(element_top){
					$("#page #dl-menu").css("top",element_top+"px");
					$("body > #dl-menu").css("top",element_top+"px");
				}
				setTimeout(function(){
					if(!$(".floatwarpper").hasClass("leftbtnmenu")){
						$("#page #dl-menu").removeClass("dl-menu-hidden");
						var menu_html =$("#page #dl-menu").prop("outerHTML");
						$("body").prepend(menu_html);
						if(element_top){
							$("body > #dl-menu").css("top",element_top+"px");
						}
						$("#page #dl-menu").addClass("dl-menu-hidden");
						
						if($("#mobile-menu").hasClass("fullfloatmenu")){
							$("body > #dl-menu").css("right",element_right+"px");
						}else{
							$("body > #dl-menu").css("right",(1*w+8)+"px");
						}
					}
					$("body > #dl-menu").unbind().bind("click",function(e){
						 e.stopPropagation();
						$this.$trigger.click();
						return false;
					});
				
				},200)

			}
			this.$trigger.addClass( 'dl-active' ).html(this.closeCap);
			this.open = true;
			if(this.$menu.closest("section.section").length>0){
				var minheight = this.$menu.height();
				this.$menu.closest("section.section").css("min-height",minheight+"px");
			}
			if(!$(".floatwarpper").hasClass("leftbtnmenu")){
				$("html, body").animate({ scrollTop: this.$el.offset().top - 20 }, 150);
			}
		},
		// resets the menu to its original state (first level of options)
		_resetMenu : function() {
			if(!this.$menu.closest(".dl-menuwrapper").hasClass("leftbtnmenu") && !this.not_close_menu){
				this.$menu.removeClass( 'dl-subview' );
				this.$menuitems.removeClass( 'dl-subview dl-subviewopen' );
			}
		}
	};

	var logError = function( message ) {
		if ( window.console ) {
			window.console.error( message );
		}
	};

	$.fn.dlmenu = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'dlmenu' );
				if ( !instance ) {
					logError( "cannot call methods on dlmenu prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for dlmenu instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} 
		else {
			this.each(function() {	
				var instance = $.data( this, 'dlmenu' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = $.data( this, 'dlmenu', new $.DLMenu( options, this ) );
				}
			});
		}
		return this;
	};

} )( jQuery, window );
/****************************************************************************************************************************/
 /* !- Tooltip*/  
 function simple_tooltip(e,t){jQuery(e).each(function(e){jQuery("body").append("<div class='"+t+"' id='"+t+e+"'>"+jQuery(this).find("span.tooltip-c").html()+"</div>");var n=jQuery("#"+t+e);jQuery(this).removeAttr("title").mouseover(function(){n.css({opacity:1,display:"none"}).fadeIn(400)}).mousemove(function(e){var t=jQuery(window).scrollTop();var r=jQuery(window).width();var i;var s;var o=15;if(r-o*2>=n.width()+e.pageX){i=e.pageX+o}else{i=r-n.width()-o}if(t+o*2>=e.pageY-n.height()){s=t+o}else{s=e.pageY-n.height()-2.2*o}n.css({left:i,top:s})}).mouseout(function(){n.css({left:"-9999px"})})})}
 
/* !Sandbox */

/*!
 * jquery.customSelect() - v0.4.1
 * http://adam.co/lab/jquery/customselect/
 * 2013-05-13
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 */
jQuery(document).ready(function(a) {a.fn.extend({customSelect:function(c){if(typeof document.body.style.maxHeight==="undefined"){return this}var e={customClass:"customSelect",mapClass:true,mapStyle:true},c=a.extend(e,c),d=c.customClass,f=function(h,k){var g=h.find(":selected"),j=k.children(":first"),i=g.html()||"&nbsp;";j.html(i);if(g.attr("disabled")){k.addClass(b("DisabledOption"))}else{k.removeClass(b("DisabledOption"))}setTimeout(function(){k.removeClass(b("Open"));a(document).off("mouseup."+b("Open"))},60)},b=function(g){return d+g};return this.each(function(){var g=a(this),i=a("<span />").addClass(b("Inner")),h=a("<span />");g.after(h.append(i));h.addClass(d);if(c.mapClass){h.addClass(g.attr("class"))}if(c.mapStyle){h.attr("style",g.attr("style"))}g.addClass("hasCustomSelect").on("update",function(){f(g,h);var k=parseInt(g.outerWidth(),10)-(parseInt(h.outerWidth(),10)-parseInt(h.width(),10));h.css({display:"inline-block"});var j=h.outerHeight();if(g.attr("disabled")){h.addClass(b("Disabled"))}else{h.removeClass(b("Disabled"))}i.css({width:k,display:"inline-block"});g.css({"-webkit-appearance":"menulist-button",width:h.outerWidth(),position:"absolute",opacity:0,height:j,fontSize:h.css("font-size")})}).on("change",function(){h.addClass(b("Changed"));f(g,h)}).on("keyup",function(j){if(!h.hasClass(b("Open"))){g.blur();g.focus()}else{if(j.which==13||j.which==27){f(g,h)}}}).on("mousedown",function(j){h.removeClass(b("Changed"))}).on("mouseup",function(j){if(!h.hasClass(b("Open"))){if(a("."+b("Open")).not(h).length>0&&typeof InstallTrigger!=="undefined"){g.focus()}else{h.addClass(b("Open"));j.stopPropagation();a(document).one("mouseup."+b("Open"),function(k){if(k.target!=g.get(0)&&a.inArray(k.target,g.find("*").get())<0){g.blur()}else{f(g,h)}})}}}).focus(function(){h.removeClass(b("Changed")).addClass(b("Focus"))}).blur(function(){h.removeClass(b("Focus")+" "+b("Open"))}).hover(function(){h.addClass(b("Hover"))},function(){h.removeClass(b("Hover"))}).trigger("update")})}})});


/**
 * jquery.hoverdir.js v1.1.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */
;( function( $, window, undefined ) {
	
	'use strict';

	$.HoverDir = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );

	};

	// the options
	$.HoverDir.defaults = {
		speed : 300,
		easing : 'ease',
		hoverDelay : 0,
		inverse : false
	};

	$.HoverDir.prototype = {

		_init : function( options ) {
			
			// options
			this.options = $.extend( true, {}, $.HoverDir.defaults, options );
			// transition properties
			this.transitionProp = 'all ' + this.options.speed + 'ms ' + this.options.easing;
			// support for CSS transitions
			this.support = Modernizr.csstransitions;
			// load the events
			this._loadEvents();

		},
		_loadEvents : function() {

			var self = this;
			
			this.$el.on( 'mouseenter.hoverdir, mouseleave.hoverdir', function( event ) {
				
				var $el = $( this ),
					$hoverElem = $el.find( 'div.rollover-content, div.fs-entry-content' ),
					direction = self._getDir( $el, { x : event.pageX, y : event.pageY } ),
					styleCSS = self._getStyle( direction );
				
				if( event.type === 'mouseenter' ) {
					
					$hoverElem.hide().css( styleCSS.from );
					clearTimeout( self.tmhover );

					self.tmhover = setTimeout( function() {
						
						$hoverElem.show( 0, function() {
							
							var $el = $( this );
							if( self.support ) {
								$el.css( 'transition', self.transitionProp );
							}
							self._applyAnimation( $el, styleCSS.to, self.options.speed );

						} );
						
					
					}, self.options.hoverDelay );
					
				}
				else {
				
					if( self.support ) {
						$hoverElem.css( 'transition', self.transitionProp );
					}
					clearTimeout( self.tmhover );
					self._applyAnimation( $hoverElem, styleCSS.from, self.options.speed );
					
				}
					
			} );

		},
		// credits : http://stackoverflow.com/a/3647634
		_getDir : function( $el, coordinates ) {
			
			// the width and height of the current div
			var w = $el.width(),
				h = $el.height(),

				// calculate the x and y to get an angle to the center of the div from that x and y.
				// gets the x value relative to the center of the DIV and "normalize" it
				x = ( coordinates.x - $el.offset().left - ( w/2 )) * ( w > h ? ( h/w ) : 1 ),
				y = ( coordinates.y - $el.offset().top  - ( h/2 )) * ( h > w ? ( w/h ) : 1 ),
			
				// the angle and the direction from where the mouse came in/went out clockwise (TRBL=0123);
				// first calculate the angle of the point,
				// add 180 deg to get rid of the negative values
				// divide by 90 to get the quadrant
				// add 3 and do a modulo by 4  to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
				direction = Math.round( ( ( ( Math.atan2(y, x) * (180 / Math.PI) ) + 180 ) / 90 ) + 3 ) % 4;
			
			return direction;
			
		},
		_getStyle : function( direction ) {
			
			var fromStyle, toStyle,
				slideFromTop = { left : '0px', top : '-100%' },
				slideFromBottom = { left : '0px', top : '100%' },
				slideFromLeft = { left : '-100%', top : '0px' },
				slideFromRight = { left : '100%', top : '0px' },
				slideTop = { top : '0px' },
				slideLeft = { left : '0px' };
			
			switch( direction ) {
				case 0:
					// from top
					fromStyle = !this.options.inverse ? slideFromTop : slideFromBottom;
					toStyle = slideTop;
					break;
				case 1:
					// from right
					fromStyle = !this.options.inverse ? slideFromRight : slideFromLeft;
					toStyle = slideLeft;
					break;
				case 2:
					// from bottom
					fromStyle = !this.options.inverse ? slideFromBottom : slideFromTop;
					toStyle = slideTop;
					break;
				case 3:
					// from left
					fromStyle = !this.options.inverse ? slideFromLeft : slideFromRight;
					toStyle = slideLeft;
					break;
			};
			
			return { from : fromStyle, to : toStyle };
					
		},
		// apply a transition or fallback to jquery animate based on Modernizr.csstransitions support
		_applyAnimation : function( el, styleCSS, speed ) {

			$.fn.applyStyle = this.support ? $.fn.css : $.fn.animate;
			el.stop().applyStyle( styleCSS, $.extend( true, [], { duration : speed + 'ms' } ) );

		},

	};
	
	var logError = function( message ) {

		if ( window.console ) {

			window.console.error( message );
		
		}

	};
	
	$.fn.hoverdir = function( options ) {

		var instance = $.data( this, 'hoverdir' );
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				if ( !instance ) {

					logError( "cannot call methods on hoverdir prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {

					logError( "no such method '" + options + "' for hoverdir instance" );
					return;
				
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				if ( instance ) {

					instance._init();
				
				}
				else {

					instance = $.data( this, 'hoverdir', new $.HoverDir( options, this ) );
				
				}

			});
		
		}
		
		return instance;
		
	};
	
} )( jQuery, window );

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options=$.extend({},options);options.expires=-1;}var expires='';if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires='; expires='+date.toUTCString();}var path=options.path?'; path='+(options.path):'';var domain=options.domain?'; domain='+(options.domain):'';var secure=options.secure?'; secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};

/* Sandbox: end */;

/* dt-main-op-jquery: (http://www.artjiahua.com/FeiEditor/bitSite/js/opentip-jquery.min.js) */
// Opentip v2.4.6
// Copyright (c) 2009-2012
// www.opentip.org
// MIT Licensed
var Opentip,firstAdapter,i,mouseMoved,mousePosition,mousePositionObservers,position,vendors,_i,_len,_ref,__slice=[].slice,__indexOf=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1},__hasProp={}.hasOwnProperty;for(Opentip=function(){function t(e,i,o,s){var n,r,a,h,p,d,l,u,c,g,f,m,v,b,w=this;if(this.id=++t.lastId,this.debug("Creating Opentip."),t.tips.push(this),this.adapter=t.adapter,n=this.adapter.data(e,"opentips")||[],n.push(this),this.adapter.data(e,"opentips",n),this.triggerElement=this.adapter.wrap(e),this.triggerElement.length>1)throw Error("You can't call Opentip on multiple elements.");if(1>this.triggerElement.length)throw Error("Invalid element.");this.loaded=!1,this.loading=!1,this.visible=!1,this.waitingToShow=!1,this.waitingToHide=!1,this.currentPosition={left:0,top:0},this.dimensions={width:100,height:50},this.content="",this.redraw=!0,this.currentObservers={showing:!1,visible:!1,hiding:!1,hidden:!1},s=this.adapter.clone(s),typeof i=="object"?(s=i,i=o=void 0):typeof o=="object"&&(s=o,o=void 0),o!=null&&(s.title=o),i!=null&&this.setContent(i),s["extends"]==null&&(s["extends"]=s.style!=null?s.style:t.defaultStyle),h=[s],b=s;while(b["extends"]){if(d=b["extends"],b=t.styles[d],b==null)throw Error("Invalid style: "+d);h.unshift(b),b["extends"]==null&&d!=="standard"&&(b["extends"]="standard")}for(s=(f=this.adapter).extend.apply(f,[{}].concat(__slice.call(h))),s.hideTriggers=function(){var t,e,i,o;for(i=s.hideTriggers,o=[],t=0,e=i.length;e>t;t++)r=i[t],o.push(r);return o}(),s.hideTrigger&&s.hideTriggers.length===0&&s.hideTriggers.push(s.hideTrigger),m=["tipJoint","targetJoint","stem"],l=0,c=m.length;c>l;l++)p=m[l],s[p]&&typeof s[p]=="string"&&(s[p]=new t.Joint(s[p]));for(!s.ajax||s.ajax!==!0&&s.ajax||(s.ajax=this.adapter.tagName(this.triggerElement)==="A"?this.adapter.attr(this.triggerElement,"href"):!1),s.showOn==="click"&&this.adapter.tagName(this.triggerElement)==="A"&&this.adapter.observe(this.triggerElement,"click",function(t){return t.preventDefault(),t.stopPropagation(),t.stopped=!0}),s.target&&(s.fixed=!0),s.stem===!0&&(s.stem=new t.Joint(s.tipJoint)),s.target===!0?s.target=this.triggerElement:s.target&&(s.target=this.adapter.wrap(s.target)),this.currentStem=s.stem,s.delay==null&&(s.delay=s.showOn==="mouseover"?.2:0),s.targetJoint==null&&(s.targetJoint=new t.Joint(s.tipJoint).flip()),this.showTriggers=[],this.showTriggersWhenVisible=[],this.hideTriggers=[],s.showOn&&s.showOn!=="creation"&&this.showTriggers.push({element:this.triggerElement,event:s.showOn}),s.ajaxCache!=null&&(s.cache=s.ajaxCache,delete s.ajaxCache),this.options=s,this.bound={},v=["prepareToShow","prepareToHide","show","hide","reposition"],u=0,g=v.length;g>u;u++)a=v[u],this.bound[a]=function(t){return function(){return w[t].apply(w,arguments)}}(a);this.adapter.domReady(function(){return w.activate(),w.options.showOn==="creation"?w.prepareToShow():void 0})}return t.prototype.STICKS_OUT_TOP=1,t.prototype.STICKS_OUT_BOTTOM=2,t.prototype.STICKS_OUT_LEFT=1,t.prototype.STICKS_OUT_RIGHT=2,t.prototype["class"]={container:"opentip-container",opentip:"opentip",header:"ot-header",content:"ot-content",loadingIndicator:"ot-loading-indicator",close:"ot-close",goingToHide:"ot-going-to-hide",hidden:"ot-hidden",hiding:"ot-hiding",goingToShow:"ot-going-to-show",showing:"ot-showing",visible:"ot-visible",loading:"ot-loading",ajaxError:"ot-ajax-error",fixed:"ot-fixed",showEffectPrefix:"ot-show-effect-",hideEffectPrefix:"ot-hide-effect-",stylePrefix:"style-"},t.prototype._setup=function(){var t,e,i,o,s,n,r,a,h,p,d;for(this.debug("Setting up the tooltip."),this._buildContainer(),this.hideTriggers=[],h=this.options.hideTriggers,o=s=0,r=h.length;r>s;o=++s){if(e=h[o],i=null,t=this.options.hideOn instanceof Array?this.options.hideOn[o]:this.options.hideOn,typeof e=="string")switch(e){case"trigger":t=t||"mouseout",i=this.triggerElement;break;case"tip":t=t||"mouseover",i=this.container;break;case"target":t=t||"mouseover",i=this.options.target;break;case"closeButton":break;default:throw Error("Unknown hide trigger: "+e+".")}else t=t||"mouseover",i=this.adapter.wrap(e);i&&this.hideTriggers.push({element:i,event:t,original:e})}for(p=this.hideTriggers,d=[],n=0,a=p.length;a>n;n++)e=p[n],d.push(this.showTriggersWhenVisible.push({element:e.element,event:"mouseover"}));return d},t.prototype._buildContainer=function(){return this.container=this.adapter.create('<div id="opentip-'+this.id+'" class="'+this["class"].container+" "+this["class"].hidden+" "+this["class"].stylePrefix+this.options.className+'"></div>'),this.adapter.css(this.container,{position:"absolute"}),this.options.ajax&&this.adapter.addClass(this.container,this["class"].loading),this.options.fixed&&this.adapter.addClass(this.container,this["class"].fixed),this.options.showEffect&&this.adapter.addClass(this.container,""+this["class"].showEffectPrefix+this.options.showEffect),this.options.hideEffect?this.adapter.addClass(this.container,""+this["class"].hideEffectPrefix+this.options.hideEffect):void 0},t.prototype._buildElements=function(){var t,e;return this.tooltipElement=this.adapter.create('<div class="'+this["class"].opentip+'"><div class="'+this["class"].header+'"></div><div class="'+this["class"].content+'"></div></div>'),this.backgroundCanvas=this.adapter.wrap(document.createElement("canvas")),this.adapter.css(this.backgroundCanvas,{position:"absolute"}),typeof G_vmlCanvasManager!="undefined"&&G_vmlCanvasManager!==null&&G_vmlCanvasManager.initElement(this.adapter.unwrap(this.backgroundCanvas)),t=this.adapter.find(this.tooltipElement,"."+this["class"].header),this.options.title&&(e=this.adapter.create("<h1></h1>"),this.adapter.update(e,this.options.title,this.options.escapeTitle),this.adapter.append(t,e)),this.options.ajax&&!this.loaded&&this.adapter.append(this.tooltipElement,this.adapter.create('<div class="'+this["class"].loadingIndicator+'"><span>↻</span></div>')),__indexOf.call(this.options.hideTriggers,"closeButton")>=0&&(this.closeButtonElement=this.adapter.create('<a href="javascript:undefined;" class="'+this["class"].close+'"><span>Close</span></a>'),this.adapter.append(t,this.closeButtonElement)),this.adapter.append(this.container,this.backgroundCanvas),this.adapter.append(this.container,this.tooltipElement),this.adapter.append(document.body,this.container),this._newContent=!0,this.redraw=!0},t.prototype.setContent=function(t){return this.content=t,this._newContent=!0,typeof this.content=="function"?(this._contentFunction=this.content,this.content=""):this._contentFunction=null,this.visible?this._updateElementContent():void 0},t.prototype._updateElementContent=function(){var t;return(this._newContent||!this.options.cache&&this._contentFunction)&&(t=this.adapter.find(this.container,"."+this["class"].content),t!=null&&(this._contentFunction&&(this.debug("Executing content function."),this.content=this._contentFunction(this)),this.adapter.update(t,this.content,this.options.escapeContent)),this._newContent=!1),this._storeAndLockDimensions(),this.reposition()},t.prototype._storeAndLockDimensions=function(){var t;if(this.container)return t=this.dimensions,this.adapter.css(this.container,{width:"auto",left:"0px",top:"0px"}),this.dimensions=this.adapter.dimensions(this.container),this.dimensions.width+=1,this.adapter.css(this.container,{width:""+this.dimensions.width+"px",top:""+this.currentPosition.top+"px",left:""+this.currentPosition.left+"px"}),this._dimensionsEqual(this.dimensions,t)?void 0:(this.redraw=!0,this._draw())},t.prototype.activate=function(){return this._setupObservers("hidden","hiding")},t.prototype.deactivate=function(){return this.debug("Deactivating tooltip."),this.hide(),this._setupObservers("-showing","-visible","-hidden","-hiding")},t.prototype._setupObservers=function(){var t,e,i,o,s,n,r,a,h,p,d,l,u,c,g,f,m=this;for(o=arguments.length>=1?__slice.call(arguments,0):[],n=0,p=o.length;p>n;n++)if(i=o[n],e=!1,i.charAt(0)==="-"&&(e=!0,i=i.substr(1)),this.currentObservers[i]!==!e)switch(this.currentObservers[i]=!e,t=function(){var t,i,o;return t=arguments.length>=1?__slice.call(arguments,0):[],e?(i=m.adapter).stopObserving.apply(i,t):(o=m.adapter).observe.apply(o,t)},i){case"showing":for(c=this.hideTriggers,r=0,d=c.length;d>r;r++)s=c[r],t(s.element,s.event,this.bound.prepareToHide);t(document.onresize!=null?document:window,"resize",this.bound.reposition),t(window,"scroll",this.bound.reposition);break;case"visible":for(g=this.showTriggersWhenVisible,a=0,l=g.length;l>a;a++)s=g[a],t(s.element,s.event,this.bound.prepareToShow);break;case"hiding":for(f=this.showTriggers,h=0,u=f.length;u>h;h++)s=f[h],t(s.element,s.event,this.bound.prepareToShow);break;case"hidden":break;default:throw Error("Unknown state: "+i)}return null},t.prototype.prepareToShow=function(){return this._abortHiding(),this._abortShowing(),this.visible?void 0:(this.debug("Showing in "+this.options.delay+"s."),this.container==null&&this._setup(),this.options.group&&t._abortShowingGroup(this.options.group,this),this.preparingToShow=!0,this._setupObservers("-hidden","-hiding","showing"),this._followMousePosition(),this.options.fixed&&!this.options.target&&(this.initialMousePosition=mousePosition),this.reposition(),this._showTimeoutId=this.setTimeout(this.bound.show,this.options.delay||0))},t.prototype.show=function(){var e=this;return this._abortHiding(),this.visible?void 0:(this._clearTimeouts(),this._triggerElementExists()?(this.debug("Showing now."),this.container==null&&this._setup(),this.options.group&&t._hideGroup(this.options.group,this),this.visible=!0,this.preparingToShow=!1,this.tooltipElement==null&&this._buildElements(),this._updateElementContent(),!this.options.ajax||this.loaded&&this.options.cache||this._loadAjax(),this._searchAndActivateCloseButtons(),this._startEnsureTriggerElement(),this.adapter.css(this.container,{zIndex:t.lastZIndex++}),this._setupObservers("-hidden","-hiding","-showing","-visible","showing","visible"),this.options.fixed&&!this.options.target&&(this.initialMousePosition=mousePosition),this.reposition(),this.adapter.removeClass(this.container,this["class"].hiding),this.adapter.removeClass(this.container,this["class"].hidden),this.adapter.addClass(this.container,this["class"].goingToShow),this.setCss3Style(this.container,{transitionDuration:"0s"}),this.defer(function(){var t;if(e.visible&&!e.preparingToHide)return e.adapter.removeClass(e.container,e["class"].goingToShow),e.adapter.addClass(e.container,e["class"].showing),t=0,e.options.showEffect&&e.options.showEffectDuration&&(t=e.options.showEffectDuration),e.setCss3Style(e.container,{transitionDuration:""+t+"s"}),e._visibilityStateTimeoutId=e.setTimeout(function(){return e.adapter.removeClass(e.container,e["class"].showing),e.adapter.addClass(e.container,e["class"].visible)},t),e._activateFirstInput()}),this._draw()):this.deactivate())},t.prototype._abortShowing=function(){return this.preparingToShow?(this.debug("Aborting showing."),this._clearTimeouts(),this._stopFollowingMousePosition(),this.preparingToShow=!1,this._setupObservers("-showing","-visible","hiding","hidden")):void 0},t.prototype.prepareToHide=function(){return this._abortShowing(),this._abortHiding(),this.visible?(this.debug("Hiding in "+this.options.hideDelay+"s"),this.preparingToHide=!0,this._setupObservers("-showing","visible","-hidden","hiding"),this._hideTimeoutId=this.setTimeout(this.bound.hide,this.options.hideDelay)):void 0},t.prototype.hide=function(){var t=this;return this._abortShowing(),this.visible&&(this._clearTimeouts(),this.debug("Hiding!"),this.visible=!1,this.preparingToHide=!1,this._stopEnsureTriggerElement(),this._setupObservers("-showing","-visible","-hiding","-hidden","hiding","hidden"),this.options.fixed||this._stopFollowingMousePosition(),this.container)?(this.adapter.removeClass(this.container,this["class"].visible),this.adapter.removeClass(this.container,this["class"].showing),this.adapter.addClass(this.container,this["class"].goingToHide),this.setCss3Style(this.container,{transitionDuration:"0s"}),this.defer(function(){var e;return t.adapter.removeClass(t.container,t["class"].goingToHide),t.adapter.addClass(t.container,t["class"].hiding),e=0,t.options.hideEffect&&t.options.hideEffectDuration&&(e=t.options.hideEffectDuration),t.setCss3Style(t.container,{transitionDuration:""+e+"s"}),t._visibilityStateTimeoutId=t.setTimeout(function(){return t.adapter.removeClass(t.container,t["class"].hiding),t.adapter.addClass(t.container,t["class"].hidden),t.setCss3Style(t.container,{transitionDuration:"0s"}),t.options.removeElementsOnHide?(t.debug("Removing HTML elements."),t.adapter.remove(t.container),delete t.container,delete t.tooltipElement):void 0},e)})):void 0},t.prototype._abortHiding=function(){return this.preparingToHide?(this.debug("Aborting hiding."),this._clearTimeouts(),this.preparingToHide=!1,this._setupObservers("-hiding","showing","visible")):void 0},t.prototype.reposition=function(){var t,e,i,o=this;return t=this.getPosition(),t==null||(e=this.options.stem,this.options.containInViewport&&(i=this._ensureViewportContainment(t),t=i.position,e=i.stem),this._positionsEqual(t,this.currentPosition))?void 0:(this.options.stem&&!e.eql(this.currentStem)&&(this.redraw=!0),this.currentPosition=t,this.currentStem=e,this._draw(),this.adapter.css(this.container,{left:""+t.left+"px",top:""+t.top+"px"}),this.defer(function(){var t,e;return t=o.adapter.unwrap(o.container),t.style.visibility="hidden",e=t.offsetHeight,t.style.visibility="visible"}))},t.prototype.getPosition=function(t,e,i){var o,s,n,r,a,h,p,d,l;if(this.container)return t==null&&(t=this.options.tipJoint),e==null&&(e=this.options.targetJoint),r={},this.options.target?(p=this.adapter.offset(this.options.target),h=this.adapter.dimensions(this.options.target),r=p,e.right?(d=this.adapter.unwrap(this.options.target),d.getBoundingClientRect!=null?r.left=d.getBoundingClientRect().right+((l=window.pageXOffset)!=null?l:document.body.scrollLeft):r.left+=h.width):e.center&&(r.left+=Math.round(h.width/2)),e.bottom?r.top+=h.height:e.middle&&(r.top+=Math.round(h.height/2)),this.options.borderWidth&&(this.options.tipJoint.left&&(r.left+=this.options.borderWidth),this.options.tipJoint.right&&(r.left-=this.options.borderWidth),this.options.tipJoint.top?r.top+=this.options.borderWidth:this.options.tipJoint.bottom&&(r.top-=this.options.borderWidth))):r=this.initialMousePosition?{top:this.initialMousePosition.y,left:this.initialMousePosition.x}:{top:mousePosition.y,left:mousePosition.x},this.options.autoOffset&&(a=this.options.stem?this.options.stemLength:0,n=a&&this.options.fixed?2:10,o=t.middle&&!this.options.fixed?15:0,s=t.center&&!this.options.fixed?15:0,t.right?r.left-=n+o:t.left&&(r.left+=n+o),t.bottom?r.top-=n+s:t.top&&(r.top+=n+s),a&&(i==null&&(i=this.options.stem),i.right?r.left-=a:i.left&&(r.left+=a),i.bottom?r.top-=a:i.top&&(r.top+=a))),r.left+=this.options.offset[0],r.top+=this.options.offset[1],t.right?r.left-=this.dimensions.width:t.center&&(r.left-=Math.round(this.dimensions.width/2)),t.bottom?r.top-=this.dimensions.height:t.middle&&(r.top-=Math.round(this.dimensions.height/2)),r},t.prototype._ensureViewportContainment=function(e){var i,o,s,n,r,a,h,p,d,l,u,c;if(h=this.options.stem,s={position:e,stem:h},!this.visible||!e)return s;if(p=this._sticksOut(e),!p[0]&&!p[1])return s;if(l=new t.Joint(this.options.tipJoint),this.options.targetJoint&&(d=new t.Joint(this.options.targetJoint)),a=this.adapter.scrollOffset(),u=this.adapter.viewportDimensions(),c=[e.left-a[0],e.top-a[1]],i=!1,u.width>=this.dimensions.width&&p[0])switch(i=!0,p[0]){case this.STICKS_OUT_LEFT:l.setHorizontal("left"),this.options.targetJoint&&d.setHorizontal("right");break;case this.STICKS_OUT_RIGHT:l.setHorizontal("right"),this.options.targetJoint&&d.setHorizontal("left")}if(u.height>=this.dimensions.height&&p[1])switch(i=!0,p[1]){case this.STICKS_OUT_TOP:l.setVertical("top"),this.options.targetJoint&&d.setVertical("bottom");break;case this.STICKS_OUT_BOTTOM:l.setVertical("bottom"),this.options.targetJoint&&d.setVertical("top")}return i?(this.options.stem&&(h=l),e=this.getPosition(l,d,h),o=this._sticksOut(e),n=!1,r=!1,o[0]&&o[0]!==p[0]&&(n=!0,l.setHorizontal(this.options.tipJoint.horizontal),this.options.targetJoint&&d.setHorizontal(this.options.targetJoint.horizontal)),o[1]&&o[1]!==p[1]&&(r=!0,l.setVertical(this.options.tipJoint.vertical),this.options.targetJoint&&d.setVertical(this.options.targetJoint.vertical)),n&&r?s:((n||r)&&(this.options.stem&&(h=l),e=this.getPosition(l,d,h)),{position:e,stem:h})):s},t.prototype._sticksOut=function(t){var e,i,o,s;return i=this.adapter.scrollOffset(),s=this.adapter.viewportDimensions(),e=[t.left-i[0],t.top-i[1]],o=[!1,!1],0>e[0]?o[0]=this.STICKS_OUT_LEFT:e[0]+this.dimensions.width>s.width&&(o[0]=this.STICKS_OUT_RIGHT),0>e[1]?o[1]=this.STICKS_OUT_TOP:e[1]+this.dimensions.height>s.height&&(o[1]=this.STICKS_OUT_BOTTOM),o},t.prototype._draw=function(){var e,i,o,s,n,r,a,h,p,d,l,u,c,g,f,m,v,b,w,_=this;if(this.backgroundCanvas&&this.redraw){if(this.debug("Drawing background."),this.redraw=!1,this.currentStem){for(v=["top","right","bottom","left"],f=0,m=v.length;m>f;f++)u=v[f],this.adapter.removeClass(this.container,"stem-"+u);this.adapter.addClass(this.container,"stem-"+this.currentStem.horizontal),this.adapter.addClass(this.container,"stem-"+this.currentStem.vertical)}return r=[0,0],a=[0,0],__indexOf.call(this.options.hideTriggers,"closeButton")>=0&&(n=new t.Joint(((b=this.currentStem)!=null?b+"":void 0)==="top right"?"top left":"top right"),r=[this.options.closeButtonRadius+this.options.closeButtonOffset[0],this.options.closeButtonRadius+this.options.closeButtonOffset[1]],a=[this.options.closeButtonRadius-this.options.closeButtonOffset[0],this.options.closeButtonRadius-this.options.closeButtonOffset[1]]),o=this.adapter.clone(this.dimensions),s=[0,0],this.options.borderWidth&&(o.width+=this.options.borderWidth*2,o.height+=this.options.borderWidth*2,s[0]-=this.options.borderWidth,s[1]-=this.options.borderWidth),this.options.shadow&&(o.width+=this.options.shadowBlur*2,o.width+=Math.max(0,this.options.shadowOffset[0]-this.options.shadowBlur*2),o.height+=this.options.shadowBlur*2,o.height+=Math.max(0,this.options.shadowOffset[1]-this.options.shadowBlur*2),s[0]-=Math.max(0,this.options.shadowBlur-this.options.shadowOffset[0]),s[1]-=Math.max(0,this.options.shadowBlur-this.options.shadowOffset[1])),i={left:0,right:0,top:0,bottom:0},this.currentStem&&(this.currentStem.left?i.left=this.options.stemLength:this.currentStem.right&&(i.right=this.options.stemLength),this.currentStem.top?i.top=this.options.stemLength:this.currentStem.bottom&&(i.bottom=this.options.stemLength)),n&&(n.left?i.left=Math.max(i.left,a[0]):n.right&&(i.right=Math.max(i.right,a[0])),n.top?i.top=Math.max(i.top,a[1]):n.bottom&&(i.bottom=Math.max(i.bottom,a[1]))),o.width+=i.left+i.right,o.height+=i.top+i.bottom,s[0]-=i.left,s[1]-=i.top,this.currentStem&&this.options.borderWidth&&(w=this._getPathStemMeasures(this.options.stemBase,this.options.stemLength,this.options.borderWidth),g=w.stemLength,c=w.stemBase),e=this.adapter.unwrap(this.backgroundCanvas),e.width=o.width,e.height=o.height,this.adapter.css(this.backgroundCanvas,{width:""+e.width+"px",height:""+e.height+"px",left:""+s[0]+"px",top:""+s[1]+"px"}),h=e.getContext("2d"),h.setTransform(1,0,0,1,0,0),h.clearRect(0,0,e.width,e.height),h.beginPath(),h.fillStyle=this._getColor(h,this.dimensions,this.options.background,this.options.backgroundGradientHorizontal),h.lineJoin="miter",h.miterLimit=500,l=this.options.borderWidth/2,this.options.borderWidth?(h.strokeStyle=this.options.borderColor,h.lineWidth=this.options.borderWidth):(g=this.options.stemLength,c=this.options.stemBase),c==null&&(c=0),d=function(t,e,i){return i&&h.moveTo(Math.max(c,_.options.borderRadius,r[0])+1-l,-l),e?(h.lineTo(t/2-c/2,-l),h.lineTo(t/2,-g-l),h.lineTo(t/2+c/2,-l)):void 0},p=function(t,e,i){var o,s,n,a;return t?(h.lineTo(-c+l,0-l),h.lineTo(g+l,-g-l),h.lineTo(l,c-l)):e?(a=_.options.closeButtonOffset,n=r[0],i%2!==0&&(a=[a[1],a[0]],n=r[1]),o=Math.acos(a[1]/_.options.closeButtonRadius),s=Math.acos(a[0]/_.options.closeButtonRadius),h.lineTo(-n+l,-l),h.arc(l-a[0],-l+a[1],_.options.closeButtonRadius,-(Math.PI/2+o),s,!1)):(h.lineTo(-_.options.borderRadius+l,-l),h.quadraticCurveTo(l,-l,l,_.options.borderRadius-l))},h.translate(-s[0],-s[1]),h.save(),function(){var e,i,o,s,r,a,l,u,c,g,f;for(f=[],i=c=0,g=t.positions.length/2;g>=0?g>c:c>g;i=g>=0?++c:--c)r=i*2,a=i===0||i===3?0:_.dimensions.width,l=2>i?0:_.dimensions.height,u=Math.PI/2*i,o=i%2===0?_.dimensions.width:_.dimensions.height,s=new t.Joint(t.positions[r]),e=new t.Joint(t.positions[r+1]),h.save(),h.translate(a,l),h.rotate(u),d(o,s.eql(_.currentStem),i===0),h.translate(o,0),p(e.eql(_.currentStem),e.eql(n),i),f.push(h.restore());return f}(),h.closePath(),h.save(),this.options.shadow&&(h.shadowColor=this.options.shadowColor,h.shadowBlur=this.options.shadowBlur,h.shadowOffsetX=this.options.shadowOffset[0],h.shadowOffsetY=this.options.shadowOffset[1]),h.fill(),h.restore(),this.options.borderWidth&&h.stroke(),h.restore(),n?function(){var t,e,i,o,s;return i=e=_.options.closeButtonRadius*2,n+""=="top right"?(s=[_.dimensions.width-_.options.closeButtonOffset[0],_.options.closeButtonOffset[1]],t=[s[0]+l,s[1]-l]):(s=[_.options.closeButtonOffset[0],_.options.closeButtonOffset[1]],t=[s[0]-l,s[1]-l]),h.translate(t[0],t[1]),o=_.options.closeButtonCrossSize/2,h.save(),h.beginPath(),h.strokeStyle=_.options.closeButtonCrossColor,h.lineWidth=_.options.closeButtonCrossLineWidth,h.lineCap="round",h.moveTo(-o,-o),h.lineTo(o,o),h.stroke(),h.beginPath(),h.moveTo(o,-o),h.lineTo(-o,o),h.stroke(),h.restore(),_.adapter.css(_.closeButtonElement,{left:""+(s[0]-o-_.options.closeButtonLinkOverscan)+"px",top:""+(s[1]-o-_.options.closeButtonLinkOverscan)+"px",width:""+(_.options.closeButtonCrossSize+_.options.closeButtonLinkOverscan*2)+"px",height:""+(_.options.closeButtonCrossSize+_.options.closeButtonLinkOverscan*2)+"px"})}():void 0}},t.prototype._getPathStemMeasures=function(t,e,i){var o,s,n,r,a,h,p;if(r=i/2,n=Math.atan(t/2/e),o=n*2,a=r/Math.sin(o),s=2*a*Math.cos(n),p=r+e-s,0>p)throw Error("Sorry but your stemLength / stemBase ratio is strange.");return h=Math.tan(n)*p*2,{stemLength:p,stemBase:h}},t.prototype._getColor=function(t,e,i,o){var s,n,r,a,h;if(o==null&&(o=!1),typeof i=="string")return i;for(n=o?t.createLinearGradient(0,0,e.width,0):t.createLinearGradient(0,0,0,e.height),r=a=0,h=i.length;h>a;r=++a)s=i[r],n.addColorStop(s[0],s[1]);return n},t.prototype._searchAndActivateCloseButtons=function(){var t,e,i,o;for(o=this.adapter.findAll(this.container,"."+this["class"].close),e=0,i=o.length;i>e;e++)t=o[e],this.hideTriggers.push({element:this.adapter.wrap(t),event:"click"});return this.currentObservers.showing&&this._setupObservers("-showing","showing"),this.currentObservers.visible?this._setupObservers("-visible","visible"):void 0},t.prototype._activateFirstInput=function(){var t;return t=this.adapter.unwrap(this.adapter.find(this.container,"input, textarea")),t!=null?typeof t.focus=="function"?t.focus():void 0:void 0},t.prototype._followMousePosition=function(){return this.options.fixed?void 0:t._observeMousePosition(this.bound.reposition)},t.prototype._stopFollowingMousePosition=function(){return this.options.fixed?void 0:t._stopObservingMousePosition(this.bound.reposition)},t.prototype._clearShowTimeout=function(){return clearTimeout(this._showTimeoutId)},t.prototype._clearHideTimeout=function(){return clearTimeout(this._hideTimeoutId)},t.prototype._clearTimeouts=function(){return clearTimeout(this._visibilityStateTimeoutId),this._clearShowTimeout(),this._clearHideTimeout()},t.prototype._triggerElementExists=function(){var t;t=this.adapter.unwrap(this.triggerElement);while(t.parentNode){if(t.parentNode.tagName==="BODY")return!0;t=t.parentNode}return!1},t.prototype._loadAjax=function(){var t=this;if(!this.loading)return this.loaded=!1,this.loading=!0,this.adapter.addClass(this.container,this["class"].loading),this.setContent(""),this.debug("Loading content from "+this.options.ajax),this.adapter.ajax({url:this.options.ajax,method:this.options.ajaxMethod,onSuccess:function(e){return t.debug("Loading successful."),t.adapter.removeClass(t.container,t["class"].loading),t.setContent(e)},onError:function(e){var i;return i=t.options.ajaxErrorMessage,t.debug(i,e),t.setContent(i),t.adapter.addClass(t.container,t["class"].ajaxError)},onComplete:function(){return t.adapter.removeClass(t.container,t["class"].loading),t.loading=!1,t.loaded=!0,t._searchAndActivateCloseButtons(),t._activateFirstInput(),t.reposition()}})},t.prototype._ensureTriggerElement=function(){return this._triggerElementExists()?void 0:(this.deactivate(),this._stopEnsureTriggerElement())},t.prototype._ensureTriggerElementInterval=1e3,t.prototype._startEnsureTriggerElement=function(){var t=this;return this._ensureTriggerElementTimeoutId=setInterval(function(){return t._ensureTriggerElement()},this._ensureTriggerElementInterval)},t.prototype._stopEnsureTriggerElement=function(){return clearInterval(this._ensureTriggerElementTimeoutId)},t}(),vendors=["khtml","ms","o","moz","webkit"],Opentip.prototype.setCss3Style=function(t,e){var i,o,s,n,r;t=this.adapter.unwrap(t),r=[];for(i in e)__hasProp.call(e,i)&&(o=e[i],t.style[i]!=null?r.push(t.style[i]=o):r.push(function(){var e,r,a;for(a=[],e=0,r=vendors.length;r>e;e++)s=vendors[e],n=""+this.ucfirst(s)+this.ucfirst(i),t.style[n]!=null?a.push(t.style[n]=o):a.push(void 0);return a}.call(this)));return r},Opentip.prototype.defer=function(t){return setTimeout(t,0)},Opentip.prototype.setTimeout=function(t,e){return setTimeout(t,e?e*1e3:0)},Opentip.prototype.ucfirst=function(t){return t==null?"":t.charAt(0).toUpperCase()+t.slice(1)},Opentip.prototype.dasherize=function(t){return t.replace(/([A-Z])/g,function(t,e){return"-"+e.toLowerCase()})},mousePositionObservers=[],mousePosition={x:0,y:0},mouseMoved=function(t){var e,i,o,s;for(mousePosition=Opentip.adapter.mousePosition(t),s=[],i=0,o=mousePositionObservers.length;o>i;i++)e=mousePositionObservers[i],s.push(e());return s},Opentip.followMousePosition=function(){return Opentip.adapter.observe(document.body,"mousemove",mouseMoved)},Opentip._observeMousePosition=function(t){return mousePositionObservers.push(t)},Opentip._stopObservingMousePosition=function(t){var e;return mousePositionObservers=function(){var i,o,s;for(s=[],i=0,o=mousePositionObservers.length;o>i;i++)e=mousePositionObservers[i],e!==t&&s.push(e);return s}()},Opentip.Joint=function(){function t(t){t!=null&&(t instanceof Opentip.Joint&&(t+=""),this.set(t))}return t.prototype.set=function(t){return t=t.toLowerCase(),this.setHorizontal(t),this.setVertical(t),this},t.prototype.setHorizontal=function(t){var e,i,o,s,n,r,a;for(i=["left","center","right"],o=0,n=i.length;n>o;o++)e=i[o],~t.indexOf(e)&&(this.horizontal=e.toLowerCase());for(this.horizontal==null&&(this.horizontal="center"),a=[],s=0,r=i.length;r>s;s++)e=i[s],a.push(this[e]=this.horizontal===e?e:void 0);return a},t.prototype.setVertical=function(t){var e,i,o,s,n,r,a;for(i=["top","middle","bottom"],o=0,n=i.length;n>o;o++)e=i[o],~t.indexOf(e)&&(this.vertical=e.toLowerCase());for(this.vertical==null&&(this.vertical="middle"),a=[],s=0,r=i.length;r>s;s++)e=i[s],a.push(this[e]=this.vertical===e?e:void 0);return a},t.prototype.eql=function(t){return t!=null&&this.horizontal===t.horizontal&&this.vertical===t.vertical},t.prototype.flip=function(){var t,e;return e=Opentip.position[this.toString(!0)],t=(e+4)%8,this.set(Opentip.positions[t]),this},t.prototype.toString=function(t){var e,i;return t==null&&(t=!1),i=this.vertical==="middle"?"":this.vertical,e=this.horizontal==="center"?"":this.horizontal,i&&e&&(e=t?Opentip.prototype.ucfirst(e):" "+e),""+i+e},t}(),Opentip.prototype._positionsEqual=function(t,e){return t!=null&&e!=null&&t.left===e.left&&t.top===e.top},Opentip.prototype._dimensionsEqual=function(t,e){return t!=null&&e!=null&&t.width===e.width&&t.height===e.height},Opentip.prototype.debug=function(){var t;return t=arguments.length>=1?__slice.call(arguments,0):[],Opentip.debug&&(typeof console!="undefined"&&console!==null?console.debug:void 0)!=null?(t.unshift("#"+this.id+" |"),console.debug.apply(console,t)):void 0},Opentip.findElements=function(){var t,e,i,o,s,n,r,a,h,p;for(t=Opentip.adapter,h=t.findAll(document.body,"[data-ot]"),p=[],r=0,a=h.length;a>r;r++){i=h[r],n={},e=t.data(i,"ot"),(e===""||e==="true"||e==="yes")&&(e=t.attr(i,"title"),t.attr(i,"title","")),e=e||"";for(o in Opentip.styles.standard)s=t.data(i,"ot"+Opentip.prototype.ucfirst(o)),s!=null&&(s==="yes"||s==="true"||s==="on"?s=!0:(s==="no"||s==="false"||s==="off")&&(s=!1),n[o]=s);p.push(new Opentip(i,e,n))}return p},Opentip.version="2.4.6",Opentip.debug=!1,Opentip.lastId=0,Opentip.lastZIndex=100,Opentip.tips=[],Opentip._abortShowingGroup=function(t,e){var i,o,s,n,r;for(n=Opentip.tips,r=[],o=0,s=n.length;s>o;o++)i=n[o],i!==e&&i.options.group===t?r.push(i._abortShowing()):r.push(void 0);return r},Opentip._hideGroup=function(t,e){var i,o,s,n,r;for(n=Opentip.tips,r=[],o=0,s=n.length;s>o;o++)i=n[o],i!==e&&i.options.group===t?r.push(i.hide()):r.push(void 0);return r},Opentip.adapters={},Opentip.adapter=null,firstAdapter=!0,Opentip.addAdapter=function(t){return Opentip.adapters[t.name]=t,firstAdapter?(Opentip.adapter=t,t.domReady(Opentip.findElements),t.domReady(Opentip.followMousePosition),firstAdapter=!1):void 0},Opentip.positions=["top","topRight","right","bottomRight","bottom","bottomLeft","left","topLeft"],Opentip.position={},_ref=Opentip.positions,i=_i=0,_len=_ref.length;_len>_i;i=++_i)position=_ref[i],Opentip.position[position]=i;Opentip.styles={standard:{"extends":null,title:void 0,escapeTitle:!0,escapeContent:!1,className:"standard",stem:!0,delay:null,hideDelay:.1,fixed:!1,showOn:"mouseover",hideTrigger:"trigger",hideTriggers:[],hideOn:null,removeElementsOnHide:!1,offset:[0,0],containInViewport:!0,autoOffset:!0,showEffect:"appear",hideEffect:"fade",showEffectDuration:.3,hideEffectDuration:.2,stemLength:5,stemBase:8,tipJoint:"top left",target:null,targetJoint:null,cache:!0,ajax:!1,ajaxMethod:"GET",ajaxErrorMessage:"There was a problem downloading the content.",group:null,style:null,background:"#fff18f",backgroundGradientHorizontal:!1,closeButtonOffset:[5,5],closeButtonRadius:7,closeButtonCrossSize:4,closeButtonCrossColor:"#d2c35b",closeButtonCrossLineWidth:1.5,closeButtonLinkOverscan:6,borderRadius:5,borderWidth:1,borderColor:"#f2e37b",shadow:!0,shadowBlur:10,shadowOffset:[3,3],shadowColor:"rgba(0, 0, 0, 0.1)"},glass:{"extends":"standard",className:"glass",background:[[0,"rgba(252, 252, 252, 0.8)"],[.5,"rgba(255, 255, 255, 0.8)"],[.5,"rgba(250, 250, 250, 0.9)"],[1,"rgba(245, 245, 245, 0.9)"]],borderColor:"#eee",closeButtonCrossColor:"rgba(0, 0, 0, 0.2)",borderRadius:15,closeButtonRadius:10,closeButtonOffset:[8,8]},dark:{"extends":"standard",className:"dark",borderRadius:13,borderColor:"#444",closeButtonCrossColor:"rgba(240, 240, 240, 1)",shadowColor:"rgba(0, 0, 0, 0.3)",shadowOffset:[2,2],background:[[0,"rgba(30, 30, 30, 0.7)"],[.5,"rgba(30, 30, 30, 0.8)"],[.5,"rgba(10, 10, 10, 0.8)"],[1,"rgba(10, 10, 10, 0.9)"]]},alert:{"extends":"standard",className:"alert",borderRadius:1,borderColor:"#AE0D11",closeButtonCrossColor:"rgba(255, 255, 255, 1)",shadowColor:"rgba(0, 0, 0, 0.3)",shadowOffset:[2,2],background:[[0,"rgba(203, 15, 19, 0.7)"],[.5,"rgba(203, 15, 19, 0.8)"],[.5,"rgba(189, 14, 18, 0.8)"],[1,"rgba(179, 14, 17, 0.9)"]]}},Opentip.defaultStyle="standard",typeof module!="undefined"&&module!==null?module.exports=Opentip:window.Opentip=Opentip;var __slice=[].slice;(function(t){var e;return t.fn.opentip=function(t,e,i){return new Opentip(this,t,e,i)},e=function(){function e(){}return e.prototype.name="jquery",e.prototype.domReady=function(e){return t(e)},e.prototype.create=function(e){return t(e)},e.prototype.wrap=function(e){if(e=t(e),e.length>1)throw Error("Multiple elements provided.");return e},e.prototype.unwrap=function(e){return t(e)[0]
},e.prototype.tagName=function(t){return this.unwrap(t).tagName},e.prototype.attr=function(){var e,i,o;return i=arguments[0],e=arguments.length>=2?__slice.call(arguments,1):[],(o=t(i)).attr.apply(o,e)},e.prototype.data=function(){var e,i,o;return i=arguments[0],e=arguments.length>=2?__slice.call(arguments,1):[],(o=t(i)).data.apply(o,e)},e.prototype.find=function(e,i){return t(e).find(i).get(0)},e.prototype.findAll=function(e,i){return t(e).find(i)},e.prototype.update=function(e,i,o){return e=t(e),o?e.text(i):e.html(i)},e.prototype.append=function(e,i){return t(e).append(i)},e.prototype.remove=function(e){return t(e).remove()},e.prototype.addClass=function(e,i){return t(e).addClass(i)},e.prototype.removeClass=function(e,i){return t(e).removeClass(i)},e.prototype.css=function(e,i){return t(e).css(i)},e.prototype.dimensions=function(e){return{width:t(e).outerWidth(),height:t(e).outerHeight()}},e.prototype.scrollOffset=function(){return[window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop]},e.prototype.viewportDimensions=function(){return{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}},e.prototype.mousePosition=function(t){return t==null?null:{x:t.pageX,y:t.pageY}},e.prototype.offset=function(e){var i;return i=t(e).offset(),{left:i.left,top:i.top}},e.prototype.observe=function(e,i,o){return t(e).bind(i,o)},e.prototype.stopObserving=function(e,i,o){return t(e).unbind(i,o)},e.prototype.ajax=function(e){var i,o;if(e.url==null)throw Error("No url provided");return t.ajax({url:e.url,type:(i=(o=e.method)!=null?o.toUpperCase():void 0)!=null?i:"GET"}).done(function(t){return typeof e.onSuccess=="function"?e.onSuccess(t):void 0}).fail(function(t){return typeof e.onError=="function"?e.onError("Server responded with status "+t.status):void 0}).always(function(){return typeof e.onComplete=="function"?e.onComplete():void 0})},e.prototype.clone=function(e){return t.extend({},e)},e.prototype.extend=function(){var e,i;return i=arguments[0],e=arguments.length>=2?__slice.call(arguments,1):[],t.extend.apply(t,[i].concat(__slice.call(e)))},e}(),Opentip.addAdapter(new e)})(jQuery);

/* dt-language: (http://www.artjiahua.com/qfy-content/themes/qfy-01/js/language.js) */
jQuery(function(){
	 if(jQuery.datepicker){
		 jQuery.datepicker.regional['zh-CN'] = {
			 closeText: '关闭',
			 prevText: '&#x3c;上月',
			 nextText: '下月&#x3e;',
			 currentText: '今天',
			 monthNames: ['一月','二月','三月','四月','五月','六月',
				 '七月','八月','九月','十月','十一月','十二月'],
			 monthNamesShort: ['一月','二月','三月','四月','五月','六月',
				 '七月','八月','九月','十月','十一月','十二月'],
			 dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
			 dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
			 dayNamesMin: ['日','一','二','三','四','五','六'],
			 weekHeader: '周',
			 dateFormat: 'yy-mm-dd',
			 firstDay: 1,
			 isRTL: false,
			 showMonthAfterYear: true,
			 yearSuffix: '年'};

		 jQuery.datepicker.regional['zh-TW'] = {
		        clearText: '清除',
		        clearStatus: '清除已選日期',
		        closeText: '關閉',
		        closeStatus: '不改變當前選擇',
		        prevText: '<上月',
		        prevStatus: '顯示上月',
		        prevBigText: '<<',
		        prevBigStatus: '顯示上壹年',
		        nextText: '下月>',
		        nextStatus: '顯示下月',
		        nextBigText: '>>',
		        nextBigStatus: '顯示下壹年',
		        currentText: '今天',
		        currentStatus: '顯示本月',
		        monthNames: ['壹月','二月','三月','四月','五月','六月', '七月','八月','九月','十月','十壹月','十二月'],
		        monthNamesShort: ['壹','二','三','四','五','六', '七','八','九','十','十壹','十二'],
		        monthStatus: '選擇月份',
		        yearStatus: '選擇年份',
		        weekHeader: '周',
		        weekStatus: '年內周次',
		        dayNames: ['星期日','星期壹','星期二','星期三','星期四','星期五','星期六'],
		        dayNamesShort: ['周日','周壹','周二','周三','周四','周五','周六'],
		        dayNamesMin: ['日','壹','二','三','四','五','六'],
		        dayStatus: '設置 DD 為壹周起始',
		        dateStatus: '選擇 m月 d日, DD',
		        dateFormat: 'yy-mm-dd',
		        firstDay: 1,
		        initStatus: '請選擇日期',
		        isRTL: false};

		if(dtGlobals.language==""){
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional['zh-CN']);
		}else if(dtGlobals.language=="2"){
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional['zh-TW']); 
		}
	 }
	 if(jQuery.timepicker){
		jQuery.timepicker.regional['zh-CN'] = {
				currentText: '当前时间',
				closeText: '确认',
				timeOnlyTitle: '选择时间',
				timeText: '时间',
				hourText: '小时',
				minuteText: '分钟',
				secondText: '秒',
				millisecText: '毫秒',
				timezoneText: '时区',
		        isRTL: false}; 
		 jQuery.timepicker.regional['zh-TW'] = {
				currentText: '當前時間',
				closeText: '確認',
				timeOnlyTitle: '選擇時間',
				timeText: '時間',
				hourText: '小時',
				minuteText: '分鐘',
				secondText: '秒',
				millisecText: '毫秒',
				timezoneText: '時區',
		        isRTL: false}; 
		if(dtGlobals.language==""){
			jQuery.timepicker.setDefaults(jQuery.timepicker.regional['zh-CN']); 
		}else if(dtGlobals.language=="2"){
			jQuery.timepicker.setDefaults(jQuery.timepicker.regional['zh-TW']); 
		}
	 }
	
})
;

/* dt-main: (http://www.artjiahua.com/qfy-content/themes/qfy-01/js/main.js) */
//悬浮效果
(function($){$.fn.floatAd=function(l){var m={customhtml:"",close:1,closeHTML:"",speed:30,id_class:"",x:"0",y:"0"};var n=false;var l=$.extend(m,l);var o="<div id='qfy_float_ad' class='"+l.id_class+"' style='position:absolute;left:0px;top:0px;z-index:1000000;cleat:both;'>";o+=l.customhtml;if(l.close=="1"){if(l.closeHTML==""){o+="<div id='qfy_close_f_ad' class='"+l.id_class+"' style='position:absolute;width:30px;height:16px;top:-18px;right:0px;cursor:pointer;float:right;font-size:14px'>关闭</div></div>"}else{o+="<div id='qfy_close_f_ad' class='"+l.id_class+"' >"+l.closeHTML+"</div></div>"}}$('body').append(o);function qfy_ad_init(){var x=l.x,y=l.y+$(window).scrollTop();var g=true,yin=true;var h=1;var i=10;var j=$("#qfy_float_ad."+l.id_class);var k=function(){var L=0,T=$(window).scrollTop();var a=j.width();var b=j.height();var c=$(window).width();var d=$(window).height()+$(window).scrollTop();x=x+h*(g?1:-1);if(x<L){g=true;x=L}if(x>c-a-1){g=false;x=c-a-1}y=y+h*(yin?1:-1);if(y>d-b-10){yin=false;y=d-b-10}if(y<T){yin=true;y=T}var e=x;var f=y;j.css({'top':f,'left':e})};n=setInterval(k,l.speed);$('#qfy_float_ad.'+l.id_class).mouseover(function(){if(n){clearInterval(n)}});$('#qfy_float_ad.'+l.id_class).mouseout(function(){n=setInterval(k,l.speed)})}qfy_ad_init();$('#qfy_close_f_ad.'+l.id_class).click(function(){$('#qfy_float_ad.'+l.id_class+',#QFY_overlay.'+l.id_class).remove();clearInterval(n)})}})(jQuery);

function get_browser_name(){var e=window.navigator.userAgent;return-1<e.indexOf("Opera")||-1<e.indexOf("OPR/")?"Opera":-1<e.indexOf("Edge")?"Edge":-1<e.indexOf("Chrome")?"Chrome":-1<e.indexOf("Safari")?"Safari":-1<e.indexOf("Firefox")?"Firefox":-1<e.indexOf("MSIE")||-1<e.indexOf("Trident/7")?"IE":"Other"}

//背景图片自适应
//https://css-tricks.com/almanac/properties/o/object-fit/
(function($){
	function coverFillSwitch(container,img,invert){if(!container||!img){return false}var imgHeight=img.naturalHeight||img.videoHeight;var imgWidth=img.naturalWidth||img.videoWidth;var containerRatio=container.offsetWidth/container.offsetHeight;var imgRatio=imgWidth/imgHeight;var ratioComparison=false;if(imgRatio>=containerRatio){ratioComparison=true}if(invert){ratioComparison=!ratioComparison}if(ratioComparison){img.style.height="100%";img.style.width="auto"}else{img.style.height="auto";img.style.width="100%"}}function objectFitResize(){var i,img,container;var imgsCover=document.getElementsByClassName("section-background-video");for(i=0;i<imgsCover.length;i++){img=imgsCover[i];container=img.parentElement;if(container.classList.contains("background-media")){coverFillSwitch(container,img)}}}function applyStandardProperties(container,img){var containerStyle=window.getComputedStyle(container);if(containerStyle.overflow!=="hidden"){container.style.overflow="hidden"}if(containerStyle.position!=="relative"&&containerStyle.position!=="absolute"&&containerStyle.position!=="fixed"){container.style.position="relative"}img.style.position="absolute";img.style.top="50%";img.style.left="50%";img.style.transform="translate(-50%,-50%)"}function objectFitInt(){var imgs=document.getElementsByClassName("section-background-video");for(var i=0;i<imgs.length;i++){var type="cover";var img=imgs[i];var container=img.parentElement;switch(type){case"container":break;case"cover":coverFillSwitch(container,img);applyStandardProperties(container,img);break;case"contain":coverFillSwitch(container,img,true);applyStandardProperties(container,img);break;case"fill":img.style.height="100%";img.style.width="100%";applyStandardProperties(container,img);break;case"none":img.style.height="auto";img.style.width="auto";applyStandardProperties(container,img);break;case"scale-down":img.style.maxHeight="100%";img.style.maxWidth="100%";img.style.height="auto";img.style.width="auto";applyStandardProperties(container,img);break;default:break}}}var resizeTimeout;function resizeThrottler(){if(!resizeTimeout){resizeTimeout=setTimeout(function(){resizeTimeout=null;objectFitResize()},66)}}
	var $ua = get_browser_name();
	if(($ua=="Edge" || $ua=="IE") && !is_edit_model ){
		resizeThrottler();
		window.addEventListener("resize",resizeThrottler,false);
	}
})(jQuery);
window.onload = function() {
    if(!document.hasOwnProperty("ontouchstart")) {
    	 jQuery("html").addClass("no-touch");
    }
};

function resetSectionHeight() {
	var h = jQuery(window).height();
	var body_w = jQuery("body").width();
	var na = ".section.minperheight";
	var tl = ":not(.fixheight)";
	var heights = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

	if (body_w > 760) {
		for(var i=0; i<heights.length; i++){
			var L = heights[i];
			if (jQuery(na+L+tl).length > 0) {
				jQuery(na+L+tl).css("min-height", h*(L/100) + "px");
			}
		}
		jQuery(".section.fixheight").each(function() {
			var fixheight = jQuery(this).attr("data-fixheight");
			var w = jQuery(this).width();
			if (w > 0) {
				var h = w * fixheight;
				jQuery(this).height(h);
				jQuery(this).css("min-height", h + "px");
			}
		});
		jQuery(".qfy-column-inner.fixheight").each(function() {
			var fixheight = jQuery(this).attr("data-fixheight");
			var w = jQuery(this).width();
			if (w > 0) {
				var h = w * fixheight;
				if (jQuery(this).closest(".section.fixheight").length > 0) {
					h = jQuery(this).closest(".section.fixheight").height();
				}
				jQuery(this).height(h);
				jQuery(this).css("min-height", h + "px");
				jQuery(this).find(">.column_inner").css("min-height", h + "px");
			}
		})
	} else {
		for(var i=0; i<heights.length; i++){
			var L = heights[i];
			if (jQuery(na+L).length > 0) {
				jQuery(na+L).css("min-height", h/(L/100) + "px");
			}
		}
	}
}

var last_size_mobile = false;
var size_mobile = false;
function resizeDefaultObjSize(){
	if(dtGlobals.isMobile==false){
		 if(jQuery("body").width()<768){
			 size_mobile = "mobile";
			 if(!last_size_mobile) last_size_mobile ="mobile";
		 }else{
			 size_mobile = "pc";
			 if(!last_size_mobile) last_size_mobile ="pc";
		 }
		 if(size_mobile!=last_size_mobile){
			 last_size_mobile = size_mobile;
			 jQuery(".qfy-element").each(function(){
					var m_padding = jQuery(this).attr("m-padding");
					var p_padding = jQuery(this).attr("p-padding");
					if(size_mobile=="mobile"){
						if(m_padding ){
							jQuery(this).css("padding",m_padding);
						}
					}else{
						if(p_padding ){
							jQuery(this).css("padding",p_padding);
						}
					}

			 });

		 }
	}


	if(jQuery(".qfe_map_wraper iframe").length>0){
			jQuery(".qfe_map_wraper iframe").each(function(){
				var oh = jQuery(this).parent().attr("style");
				if(typeof(oh) =="undefined"){
					var width = jQuery(this).width();
					if(width>0){
						jQuery(this).parent().height((width*2/4)+"px");
					}
				}
			})
		}
		if(jQuery(".vc_bit_raw_video").length>0){
			jQuery(".vc_bit_raw_video").each(function(){
				var oh = jQuery(this).attr("style");
				if(typeof(oh) =="undefined"){
					var width = jQuery(this).width();
					if(width>0){
						jQuery(this).height((width*2/4)+"px");
					}
				}
			})
		}
		resetSectionHeight();
		column_init_align();
}
function resize_royalSlider_gallery_new(org_obj){
	jQuery(".qfy-tabcontent .royalSlider_gallery_new").each(function(){
		var obj = jQuery(this);
		setTimeout(function(){
			var h1 = obj.find(".rsOverflow").height();
			var h2 = obj.find(".rsSlide.rsActiveSlide").height();
			if(h2>0 && h1!=h2){
				obj.find(".rsOverflow").height(h2);
			}
		},200);
	})

}
function searchForm(obj){
	if(typeof(obj)=="undefined"){
		obj = jQuery('.site_tooler .searchform .submit,.search_contain .searchform .submit');
	}

	/*--search*/
	obj.unbind().on('click', function(e) {
		e.preventDefault();
		jQuery(this).siblings('input.searchsubmit').click();
		return false;
	});

}
function qfy_setCookie(c_name, value, exdays) {
	  var exdate = new Date();
	  exdate.setDate(exdate.getDate() + exdays);
	  var c_value = encodeURIComponent(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
	  document.cookie = c_name + "=" + c_value;

	}
function mobile_menu_fix(){
	if(jQuery("#dl-menu").length==0){
		return;
	}
	var top_scrTop = 0,top_scrDir = 0,top_scrUp = false,top_scrDown = false,top_isMoved = false;
	var top_threshold = jQuery("#dl-menu").offset().top + jQuery("#dl-menu").height();

	jQuery(window).on("scroll", function() {
		var top_tempCSS = {},top_tempScrTop = jQuery(window).scrollTop();

		top_scrDir = top_tempScrTop - top_scrTop;

		if (top_tempScrTop > top_threshold && top_isMoved === false) {
			top_isMoved = true;
			jQuery("#dl-menu").addClass("positionFixed");
		}
		else if (top_tempScrTop <= top_threshold && top_isMoved === true) {
			top_isMoved = false;
			jQuery("#dl-menu").removeClass("positionFixed");
		};
		top_scrTop = jQuery(window).scrollTop();

	});
}
function mobile_menu_fix_2(){
	var top_scrTop = 0,top_scrDir = 0,top_scrUp = false,top_scrDown = false,top_isMoved = false;
	var top_threshold = jQuery(".dl-menu-fixedheader").height();
	if( jQuery(".dl-menu-fixed-blank").length==0 && jQuery("#page").css("position")!="absolute"){
	jQuery(".dl-menu-fixedheader").after("<div class='dl-menu-fixed-blank' style='display:none;height:"+top_threshold+"px;'></div>");
	}

	jQuery(window).on("scroll", function() {
		var top_tempCSS = {},top_tempScrTop = jQuery(window).scrollTop();

		top_scrDir = top_tempScrTop - top_scrTop;

		if(top_scrDir>0){
			jQuery("body").removeClass("scroll-uping").addClass("scroll-downing");
		}else if(top_scrDir<0){
			jQuery("body").addClass("scroll-uping").removeClass("scroll-downing");
		}
		if (top_tempScrTop > top_threshold && top_isMoved === false) {
			top_isMoved = true;
			jQuery(".dl-menu-fixedheader").css("position","fixed");
			jQuery("body").addClass("fixedheadering");
			jQuery(".dl-menu-fixed-blank").show();
		}
		else if (top_tempScrTop <= top_threshold && top_isMoved === true) {
			top_isMoved = false;
			jQuery(".dl-menu-fixedheader").css("position","relative");
			jQuery("body").removeClass("fixedheadering");
			jQuery("body").removeClass("fixedheadering scroll-uping scroll-downing");
			jQuery(".dl-menu-fixed-blank").hide();
		};
		top_scrTop = jQuery(window).scrollTop();

	});
}
function _image_popup_flexslider(startAt){
	jQuery(".image_popup .qfe_flexslider").flexslider({
	       animation: "slide",
	       slideshow: false,
	       slideshowSpeed: 10000,
	       sliderSpeed: 800,
	       controlNav: 1,
	       directionNav: 1,
	       smoothHeight: true,
		   startAt:startAt,
		   start: function(){
			   var localvideo =  jQuery(".image_popup .flex-active-slide video.localvideo");
			   if(localvideo.length>0){
				   if(localvideo.get(0).currentTime==0){
					   jQuery(".image_popup .flex-active-slide video.localvideo").get(0).play();
				   }
			   }
			  var videoiframe =  jQuery(".image_popup .flex-active-slide iframe.media-cloud-iframe");
			  if(videoiframe.length>0 && !videoiframe.attr("src") ){
				  videoiframe.attr("src",videoiframe.attr("data-src"));
			  }
		   },
		   before: function(){
			   //var localvideo =  jQuery(".image_popup .flex-active-slide video.localvideo");
			   //if(localvideo.length>0){
					 //jQuery(".image_popup .flex-active-slide video.localvideo").get(0).stop();
			  // }
		   },
		   after: function(){
			   var localvideo =  jQuery(".image_popup .flex-active-slide video.localvideo");
			   if(localvideo.length>0){
				   if(localvideo.get(0).currentTime==0){
					   jQuery(".image_popup .flex-active-slide video.localvideo").get(0).play();
				   }
			   }
			   var videoiframe =  jQuery(".image_popup .flex-active-slide iframe.media-cloud-iframe");
			   if(videoiframe.length>0 && !videoiframe.attr("src") ){
				  videoiframe.attr("src",videoiframe.attr("data-src"));
			   }
		   },
	     });
}
function initmouseover(){

	jQuery(".mouseHover").live({
	  mouseenter: function() {
		jQuery(this).addClass("hover");

	  },
	  mouseleave: function() {
		jQuery(this).removeClass("hover");
	  }
	});
	jQuery("a.bitButton").live({
		  mouseenter: function() {
			  	var delay = jQuery(this).attr("delay");
				var str = "";
				if(delay &&delay!="0"){
					str = "all "+delay+" linear";
				}
			  	var texthovercolor=jQuery(this).attr("texthovercolor");
				if(texthovercolor){
					jQuery(this).find(".iconText").css("color",texthovercolor);
					jQuery(this).find(".iconText").css("transition",str);
				}
				var iconhovercolor=jQuery(this).attr("iconhovercolor");
				if(iconhovercolor){
					jQuery(this).find("i.glyphicon").css("color",iconhovercolor);
					jQuery(this).find("i.glyphicon").css("transition",str);
				}
				var backgroundhovercolor=jQuery(this).attr("backgroundhovercolor");
				if(backgroundhovercolor){
					jQuery(this).css("background",backgroundhovercolor);
					jQuery(this).css("transition",str);
					jQuery(this).removeAttr('onmouseover');
					jQuery(this).removeAttr('onmouseout');
				}
				var borderhovercolor=jQuery(this).attr("borderhovercolor");
				if(borderhovercolor){
					jQuery(this).css("border","1px solid "+borderhovercolor);
					jQuery(this).css("transition",str);
				}
		  },
		  mouseleave: function() {
			   jQuery(this).css("transition","");
			  	var textcolor=jQuery(this).attr("textcolor");
				if(textcolor){
					jQuery(this).find(".iconText").css("color",textcolor);
				}
				var iconcolor=jQuery(this).attr("iconcolor");
				if(iconcolor){
					jQuery(this).find("i.glyphicon").css("color",iconcolor);
				}
				var backgroundcolor=jQuery(this).attr("backgroundcolor");
				if(backgroundcolor){
					jQuery(this).css("background",backgroundcolor);
				}
				var bordercolor=jQuery(this).attr("bordercolor");
				if(bordercolor){
					jQuery(this).css("border-color",bordercolor);
				}
		  }
		});

	jQuery("a.bitIcon").live({
		  mouseenter: function() {
			  	var delay = jQuery(this).attr("delay");
				var str = "";
				if(delay &&delay!="0"){
					str = "all "+delay+" linear";
				}
			  	var texthovercolor=jQuery(this).attr("texthovercolor");
				if(texthovercolor){
					jQuery(this).find(".iconText").css("color",texthovercolor);
					jQuery(this).find(".iconText").css("transition",str);
				}
				var iconhovercolor=jQuery(this).attr("iconhovercolor");
				if(iconhovercolor){
					jQuery(this).find("i.glyphicon").css("color",iconhovercolor);
					jQuery(this).find("i.glyphicon").css("transition",str);
				}
				var backgroundhovercolor=jQuery(this).attr("backgroundhovercolor");
				if(backgroundhovercolor){
					jQuery(this).find("b").css("background",backgroundhovercolor);
					jQuery(this).find("b").css("transition",str);
					jQuery(this).find("b").removeAttr('onmouseover');
					jQuery(this).find("b").removeAttr('onmouseout');
				}
				var borderhovercolor=jQuery(this).attr("borderhovercolor");
				if(borderhovercolor){
					jQuery(this).find("b").css("border","1px solid "+borderhovercolor);
					jQuery(this).find("b").css("transition",str);
				}
		  },
		  mouseleave: function() {
			   jQuery(this).css("transition","");
			  	var textcolor=jQuery(this).attr("textcolor");
				if(textcolor){
					jQuery(this).find(".iconText").css("color",textcolor);
				}
				var iconcolor=jQuery(this).attr("iconcolor");
				if(iconcolor){
					jQuery(this).find("i.glyphicon").css("color",iconcolor);
				}
				var backgroundcolor=jQuery(this).attr("backgroundcolor");
				if(backgroundcolor){
					jQuery(this).find("b").css("background",backgroundcolor);
				}
				var bordercolor=jQuery(this).attr("bordercolor");
				if(bordercolor){
					jQuery(this).find("b").css("border-color",bordercolor);
				}
		  }
		});

	if(jQuery("a.list_popup").length>0){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/list_popup.js", function(){initQfyPopup()});
	};

	//
	jQuery("a.qfy_thickbox").live({
		  click: function(e) {
			  e.preventDefault();
			  if( top.jQuery(".qfy_gallerys").length>0){
				  return false;
			  }
			  var default_img = jQuery(this).attr("href");
			  var thumbPath = jQuery(this).attr("thumbPath");
			  if(!thumbPath) thumbPath = default_img;
			  var i = 0;
			  var qfy_imglists= Array();
			  jQuery("a.qfy_thickbox").each(function(){
				var href = jQuery(this).attr("href");
				var thumbPath = jQuery(this).attr("thumbPath");
				if(!thumbPath) 	thumbPath = href;

				if(href!=default_img && href!= undefined){
					 qfy_imglists[i] = href+"|^|"+thumbPath;
					 i++;
				}
			  })

			  top.jQuery("body").append('<div class="qfy_gallerys" style="position:fixed;top:0;left:0;width:100%;height:0;z-index:20000;"><iframe src="/FeiEditor/bitSite/gallerys?bgcolor='+encodeURIComponent(dtGlobals.gallery_bgcolor)+'&tfamily='+encodeURIComponent(dtGlobals.gallery_tfamily)+'&dfamily='+encodeURIComponent(dtGlobals.gallery_dfamily)+'&blankclose='+encodeURIComponent(dtGlobals.gallery_blankclose)+"&arrowstyle="+encodeURIComponent(dtGlobals.gallery_arrowstyle)+'&showthumbs='+dtGlobals.gallery_showthumbs+'&style='+dtGlobals.gallery_style+'&autoplay='+dtGlobals.gallery_autoplay+'&playspeed='+dtGlobals.gallery_playspeed+'&imagesize='+dtGlobals.gallery_imagesize+'&imageheight='+dtGlobals.gallery_imageheight+'&stopbutton='+dtGlobals.gallery_stopbutton+'&thumbsposition='+dtGlobals.gallery_thumbsposition+'&tsize='+dtGlobals.gallery_tsize+'&tcolor='+encodeURIComponent(dtGlobals.gallery_tcolor)+'&dsize='+dtGlobals.gallery_dsize+'&dcolor='+encodeURIComponent(dtGlobals.gallery_dcolor)+'&default_img='+default_img+'&thumbPath='+thumbPath+'&time='+Math.random()+'" width="100%" height="100%" border=0 style="border:0;" /></div>')
			  top.jQuery(".qfy_gallerys").animate({height:"100%"});
			  return false;
		  }
		});


	qfy_a_video_event();
}

//可以单独加载，有视频的时候
function qfy_a_video_event(){


	if(!jQuery("body").hasClass("compose-mode") && !is_edit_model){
		var $is_has_video = false;
		jQuery("a").each(function(){
			var href = jQuery(this).attr("href");
			if(href) href = href.toLowerCase();
			if(href && href.indexOf("/api/video-server/play.php")>-1){
				$is_has_video = true;
			}else if(href && href.indexOf("iframe.php?video_mp4_local=")>-1 && href.indexOf("size=")>-1 && href.indexOf("&auto=")>-1){
				$is_has_video = true;
			}
		})
		if($is_has_video){
			jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-video.js", function(){
				qfy_a_video_event_init();
			});
		}
	}


}

function qfy_custom_select(){
	jQuery(".qfy_custom_select").each(function(){
		var fun = jQuery(this).attr("data-fun");
		var ids = '['+jQuery(this).attr("data-ids")+']';
		var urls = jQuery(this).attr("data-urls");
		if(ids!=""){
			jQuery(this).cxSelect({
				  selects: eval(ids),
				  required: true,
				  url: eval(urls),
				});
		}
	})
}

function thebackground(qfy_bg_images,time) {
	if(screen.width<760){
		return false;
	}
	var tmp_qfy_bg_images = qfy_bg_images.split("|^^|");
	var str ="";
	var bodyColor = jQuery("body").css("background-color");
	var bodyrepeat = jQuery("body").css("background-repeat");
	var bodyattachment = jQuery("body").css("background-attachment");
	var bodyposition = jQuery("body").css("background-position");
	var bodysize = jQuery("body").css("background-size");


	for(i=0;i<tmp_qfy_bg_images.length;i++){
		var img = tmp_qfy_bg_images[i];
		if(i==0){
			str += '<div style="position: absolute;opacity: 1;height:100%;width:100%;background:url('+img+')"  class="show"></div>';
		}else{
			str += '<div style="position: absolute;opacity: 0;height:100%;width:100%;background:url('+img+')"  ></div>';
		}
	}
	jQuery("body").prepend('<div class="qfy_body_background" style="width:100%;height:100%;left: 0;;position: fixed;top: 0;z-index: -1;"> '+str+'</div>');
	jQuery("body .qfy_body_background > div").css("background-color",bodyColor).css("background-repeat",bodyrepeat).css("background-attachment",bodyattachment).css("background-position",bodyposition).css("background-size",bodysize);
	jQuery('div.qfy_body_background div').css({opacity: 0.0});
	jQuery('div.qfy_body_background div:first').css({opacity: 1.0});

	setInterval(function(){
		var current = (jQuery('div.qfy_body_background div.show')? jQuery('div.qfy_body_background div.show') : jQuery('div.qfy_body_background div:first'));
		if ( current.length == 0 ) current = jQuery('div.qfy_body_background div:first');
		var next = ((current.next().length) ? ((current.next().hasClass('show')) ? jQuery('div.qfy_body_background div:first') :current.next()) : jQuery('div.qfy_body_background div:first'));
		next.css({opacity: 0.0})
		.addClass('show')
		.animate({opacity: 1.0}, 1000);
		current.animate({opacity: 0.0}, 1000)
		.removeClass('show');
	},time*1000);


}

function vc_3d_photo(){
	if(jQuery(".qfy-360viewer").length>0) {
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-3d-photo.js", function () {
			vc_3d_photo_init();
		});
	}
}

function vc_element_init(){
	if(dtGlobals.isMobile==false && jQuery("body").width()<768){
		jQuery(".qfy-element").each(function(){
			var m_padding = jQuery(this).attr("m-padding");
			if(m_padding ){
				jQuery(this).css("padding",m_padding);
			}
		});
	}
}
function right_nav_bar(){
	if( jQuery(".right_nav_bar").length>0 ){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-right-navbar.js", function(){
			right_nav_bar_init();
		});
	}
}


function dropdownmenu_event(obj){

	 var $this = jQuery(obj);
	 var p = $this.closest(".dropdown_container");
	 if(p.find(".list-content").hasClass("active")){
		 p.find(".list-content").removeClass("active");
		 p.closest("section").removeClass("overflowauto");
		 p.closest(".qfy-column-inner").removeClass("overflowauto");
	 }else{
		 p.find(".list-content").addClass("active");
		 p.closest("section").addClass("overflowauto");
		 p.closest(".qfy-column-inner").addClass("overflowauto");
	 }

}
function column_init_align(){

	var w = jQuery("body").width();
	jQuery('.qfy-column-inner.column_middle').each(function(){

		jQuery(this).css("margin-top",0).css("margin-bottom",0);
		var section = jQuery(this).closest("section.section");
		var heigth = jQuery(this).height();
		var t1 = section.css("padding-top").replace("px","");
		var t2 = section.css("padding-bottom").replace("px","");
		var pheight = section.height();
		var padding = 0;
		if(pheight<heigth ) pheight = heigth;
		if(t1>0 || t2>0){
			if( (pheight*1-heigth) < (t1-t2)){
				if(pheight*1==heigth){
					padding = (t2*1-t1*1)/2;
				}else{
					padding = (t2*1-t1*1-heigth)/2;
				}
			}else if( (pheight*1-heigth) < (t2-t1)){
				padding = t2*1-t1*1+(heigth-pheight)/2;
			}else{
				padding = (t2*1-t1*1)/2;
			}
		}

		if(jQuery(this).siblings(".qfy-column-inner").length>0){
			if(w>760){
				jQuery(this).css("margin-top",((pheight-heigth)/2 + padding)+"px");
			}
		}else{
			jQuery(this).css("margin-top",((pheight-heigth)/2+ padding)+"px");
		}

	})
	jQuery('.qfy-column-inner.column_bottom').each(function(){
		var section = jQuery(this).closest("section.section");
		jQuery(this).css("margin-top",0).css("margin-bottom",0);
		var heigth = jQuery(this).height();
		var t1 = section.css("padding-top").replace("px","");
		var t2 = section.css("padding-bottom").replace("px","");

		var $this = this;
		if(is_edit_model){
			setTimeout(function(){
				var pheight = section.height();
				if(pheight<heigth) pheight = heigth;
				if(section.find(".qfy-column-inner").length>1){
					if(w>760){
						jQuery($this).css("margin-top",(pheight-heigth)+"px");
					}
				}else{
					jQuery($this).css("margin-top",(pheight-heigth)+"px");
				}
			},80);
		}else{
			var pheight = section.height();
			if(pheight<heigth) pheight = heigth;
			if(section.find(".qfy-column-inner").length>1){
				if(w>760){
					jQuery(this).css("margin-top",(pheight-heigth)+"px");
				}
			}else{
				jQuery(this).css("margin-top",(pheight-heigth)+"px");
			}
		}

	})

}
function vc_royalSlider_gallery_init(){
	if(  jQuery('.royalSlider_gallery_new').length==0 ){
		return;
	}

	 if(typeof jQuery.fn.royalSlider=="undefined"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/jquery.royalslider.min.js",function() {
			 _vc_royalSlider_gallery_init();
		 })
	 }else{
		 _vc_royalSlider_gallery_init();
	 }
}

function accordioncontent(){
	 jQuery('.qfy-accordioncontent:not(.changed)').each(function(){
		 jQuery(this).addClass("changed").find('.a_content').each(function(){
			 var p = jQuery(this).parent();
			 jQuery(this).find('> section').each(function(index){
				 var curr = p.find(".a_header h4:eq("+index+")");
				 var text = curr.html();
				 if(text){
					jQuery(this).before('<h4 class="panel-title" >'+text+'</h4>');
					jQuery(this).prev().find(".line").remove();
				 }

				 if(curr.find(".line").length>0){
					 var line = "<h5 class='qfydownline' style='position:relative;z-index:5;margin:0;padding:0;opacity:1;'>"+curr.find(".line").clone().prop("outerHTML")+"</h5>";
					 jQuery(this).after(line);
				 }
			 })
		 })
	 })


}
jQuery(window).load(function() {
	if(!is_edit_model){
		resizeDefaultObjSize();
	}
});
//处理锚点
var hash = window.location.hash;
_menu_link_event(hash);

function lottieReady($){
	if($(".animentor-lottie-widget").length==0){
		return;
	}
	if(typeof lottie=="undefined"){
		$.onDemandScript("/FeiEditor/bitSite/js/lottie.min.js",function() {
			_lottieReady($);
		})
	}else{
		_lottieReady($);
	}
}
function mousemove_animate_fun($){

	$(document).bind('mousemove', function (e) {
		var document_width = $(window).width();
		var document_height = $(window).height();
		var scroll = $(document).scrollTop();
		var per_x = (e.pageX / document_width).toFixed(3);
		var per_y = ((e.pageY - scroll) / document_height).toFixed(3);
		$('[data-mouse-animate="move"]').each(function () {
			var x = $(this).attr("data-mouse-x") ? $(this).attr("data-mouse-x") : 0;
			var y = $(this).attr("data-mouse-y") ? $(this).attr("data-mouse-y") : 0;
			var z = $(this).attr("data-mouse-z") ? $(this).attr("data-mouse-z") : 0;
			var x1 = $(this).attr("data-mouse-x1") ? $(this).attr("data-mouse-x1") : 0;
			var y1 = $(this).attr("data-mouse-y1") ? $(this).attr("data-mouse-y1") : 0;
			var type = $(this).attr("data-mouse-animate-type") ? $(this).attr("data-mouse-animate-type") : 0;
			var dw = $(this).attr("data-mouse-dw") == 1 ? "vw" : "px";
			if(type==0){
				var n_x = x * 1 + (x1 - x) * per_x;
				var n_y = y * 1 + (y1 - y) * per_y;
			}else{
				var n_x = x * 1 + (x1 - x) * (type == "1" ? per_x : per_y);
				var n_y = y * 1 + (y1 - y) * (type == "1" ? per_x : per_y);
			}
			$(this).css("transform", "translate3d(" + n_x + dw + ", " + n_y + dw + ", 0)");
			//.....
			if($(this).hasClass("qfy-element")){
				$(this).parents(".section").addClass("overflowauto");
			}

		})
		$('[data-mouse-animate="scale"]').each(function () {
			var x = $(this).attr("data-mouse-x") ? $(this).attr("data-mouse-x") : 0;
			var x1 = $(this).attr("data-mouse-x1") ? $(this).attr("data-mouse-x1") : 0;
			var type = $(this).attr("data-mouse-animate-type") ? $(this).attr("data-mouse-animate-type") : 0;
			if(type==0) {
				var n_x = x * 1 + (x1 - x) *(per_x>per_y?per_x:per_y);
			}else{
				var n_x = x * 1 + (x1 - x) * (type == "1" ? per_x : per_y);
			}
			$(this).css("transform", "scale("+n_x+")");
			if($(this).hasClass("qfy-element")) {
				$(this).parents(".section").addClass("overflowauto");
			}
		});
		$('[data-mouse-animate="rotate"]').each(function () {
			var x = $(this).attr("data-mouse-x") ? $(this).attr("data-mouse-x") : 0;
			var y = $(this).attr("data-mouse-y") ? $(this).attr("data-mouse-y") : 0;
			var z = $(this).attr("data-mouse-z") ? $(this).attr("data-mouse-z") : 0;
			var x1 = $(this).attr("data-mouse-x1") ? $(this).attr("data-mouse-x1") : 0;
			var y1 = $(this).attr("data-mouse-y1") ? $(this).attr("data-mouse-y1") : 0;
			var z1 = $(this).attr("data-mouse-z1") ? $(this).attr("data-mouse-z1") : 0;
			var type = $(this).attr("data-mouse-animate-type") ? $(this).attr("data-mouse-animate-type") : 0;
			if(type==0){
				var n_x = x * 1 + (x1 - x) * per_x;
				var n_y = y * 1 + (y1 - y) * per_y;
				var n_z = z * 1 + (z1 - z) * per_x;
			}else{
				var n_x = x * 1 + (x1 - x) * (type == "1" ? per_x : per_y);
				var n_y = y * 1 + (y1 - y) * (type == "1" ? per_x : per_y);
				var n_z = z * 1 + (z1 - z) * (type == "1" ? per_x : per_y);
			}
			$(this).css("transform", "rotateX(" + n_x + "deg) rotateY(" + n_z + "deg) rotateZ(" + n_y + "deg) ");
			if($(this).hasClass("qfy-element")) {
				$(this).parents(".section").addClass("overflowauto");
			}
		});
		$('[data-mouse-animate="skew"]').each(function () {
			var x = $(this).attr("data-mouse-x") ? $(this).attr("data-mouse-x") : 0;
			var y = $(this).attr("data-mouse-y") ? $(this).attr("data-mouse-y") : 0;
			var x1 = $(this).attr("data-mouse-x1") ? $(this).attr("data-mouse-x1") : 0;
			var y1 = $(this).attr("data-mouse-y1") ? $(this).attr("data-mouse-y1") : 0;
			var type = $(this).attr("data-mouse-animate-type") ? $(this).attr("data-mouse-animate-type") : 0;
			if(type==0) {
				var n_x = x * 1 + (x1 - x) * per_x;
				var n_y = y * 1 + (y1 - y) * per_y;
			}else{
				var n_x = x * 1 + (x1 - x) * (type == "1" ? per_x : per_y);
				var n_y = y * 1 + (y1 - y) * (type == "1" ? per_x : per_y);
			}
			$(this).css("transform", "skew(" + n_x + "deg, " + n_y + "deg)");
			if($(this).hasClass("qfy-element")) {
				$(this).parents(".section").addClass("overflowauto");
			}
		});
	});
}
function scroll_animate_fun($){
	var ismobile = /Mobile/.test(navigator.userAgent);
	$(document).bind('scroll', function (e) {
		var curr_p = $(this).scrollTop();
		var scollheight = $(document).height() - $(window).height();
		if ($(document).width() < 760) {
			ismobile = true;
		}
		var per_x = (curr_p / scollheight).toFixed(3);
		$('[data-scroll-animate="move"]').each(function () {
			var x = $(this).attr("data-scroll-x") ? $(this).attr("data-scroll-x") : 0;
			var y = $(this).attr("data-scroll-y") ? $(this).attr("data-scroll-y") : 0;
			var x1 = $(this).attr("data-scroll-x1") ? $(this).attr("data-scroll-x1") : 0;
			var y1 = $(this).attr("data-scroll-y1") ? $(this).attr("data-scroll-y1") : 0;
			var dw = $(this).attr("data-scroll-dw") == 1 ? "vw" : "px";
			var si = $(this).attr("data-scroll-i") ? $(this).attr("data-scroll-i") : '';
			var n_x = x * 1 + (x1 - x) * per_x;
			var n_y = y * 1 + (y1 - y) * per_x;
			if ((ismobile && (si != 1)) || (!ismobile && (si != 2))) {
				$(this).css("transform", "translate3d(" + n_x + dw + ", " + n_y + dw + ", 0)");
				if($(this).hasClass("qfy-element")) {
					$(this).parents(".section").addClass("overflowauto");
				}
			}

		})
		$('[data-scroll-animate="scale"]').each(function () {
			var x = $(this).attr("data-scroll-x") ? $(this).attr("data-scroll-x") : 0;
			var x1 = $(this).attr("data-scroll-x1") ? $(this).attr("data-scroll-x1") : 0;
			var n_x = x * 1 + (x1 - x) * per_x;
			var si = $(this).attr("data-scroll-i") ? $(this).attr("data-scroll-i") : '';
			if ((ismobile && (si != 1)) || (!ismobile && (si != 2))) {
				$(this).css("transform", "scale(" + n_x + ")");
				if($(this).hasClass("qfy-element")) {
					$(this).parents(".section").addClass("overflowauto");
				}
			}
		});
		$('[data-scroll-animate="rotate"]').each(function () {
			var x = $(this).attr("data-scroll-x") ? $(this).attr("data-scroll-x") : 0;
			var y = $(this).attr("data-scroll-y") ? $(this).attr("data-scroll-y") : 0;
			var z = $(this).attr("data-scroll-z") ? $(this).attr("data-scroll-z") : 0;
			var x1 = $(this).attr("data-scroll-x1") ? $(this).attr("data-scroll-x1") : 0;
			var y1 = $(this).attr("data-scroll-y1") ? $(this).attr("data-scroll-y1") : 0;
			var z1 = $(this).attr("data-scroll-z1") ? $(this).attr("data-scroll-z1") : 0;
			var n_x = x * 1 + (x1 - x) * per_x;
			var n_y = y * 1 + (y1 - y) * per_x;
			var n_z = z * 1 + (z1 - z) * per_x;
			var si = $(this).attr("data-scroll-i") ? $(this).attr("data-scroll-i") : '';
			if ((ismobile && (si != 1)) || (!ismobile && (si != 2))) {
				$(this).css("transform", "rotateX(" + n_x + "deg) rotateY(" + n_z + "deg) rotateZ(" + n_y + "deg) ");
				if($(this).hasClass("qfy-element")) {
					$(this).parents(".section").addClass("overflowauto");
				}
			}
		});
		$('[data-scroll-animate="skew"]').each(function () {
			var x = $(this).attr("data-scroll-x") ? $(this).attr("data-scroll-x") : 0;
			var y = $(this).attr("data-scroll-y") ? $(this).attr("data-scroll-y") : 0;
			var x1 = $(this).attr("data-scroll-x1") ? $(this).attr("data-scroll-x1") : 0;
			var y1 = $(this).attr("data-scroll-y1") ? $(this).attr("data-scroll-y1") : 0;
			var type = $(this).attr("data-scroll-animate-type") ? $(this).attr("data-scroll-animate-type") : 0;
			var n_x = x * 1 + (x1 - x) * per_x;
			var n_y = y * 1 + (y1 - y) * per_x;
			var si = $(this).attr("data-scroll-i") ? $(this).attr("data-scroll-i") : '';
			if ((ismobile && (si != 1)) || (!ismobile && (si != 2))) {
				$(this).css("transform", "skew(" + n_x + "deg, " + n_y + "deg)");
				if($(this).hasClass("qfy-element")){
					$(this).parents(".section").addClass("overflowauto");
				}
			}
		});
	});
}

function shape_ready(){
	if(jQuery(".shape_image_svg").length==0){
		return;
	}
	if(typeof anime=="undefined"){
		jQuery.onDemandScript("/FeiEditor/bitSite/js/anime.min.js",function() {
			jQuery(".shape_image_svg:not(.loaded)").each(function(){
				var shapeEl = jQuery(this).find("path")[0];
				var pos = jQuery(this).attr("data-path");
				var duration = jQuery(this).attr("data-t");
				var begin = jQuery(this).attr("data-begin");
				var end = jQuery(this).attr("data-end");
				if(pos==99){
					if(begin && end && begin.indexOf(",")>-1&& end.indexOf(",")>-1){
						shape_loop_init(shapeEl,pos,duration*1,begin,end,jQuery(this).parent().hasClass("background-shapes"));
					}
				}else{
					shape_loop_init(shapeEl,pos-1,duration*1,"","",jQuery(this).parent().hasClass("background-shapes"));
				}

				jQuery(this).addClass("loaded");
			})
		})
	}else{

		jQuery(".shape_image_svg:not(.loaded)").each(function(){
			var shapeEl = jQuery(this).find("path")[0];
			var pos = jQuery(this).attr("data-path");
			var duration = jQuery(this).attr("data-t");
			var begin = jQuery(this).attr("data-begin");
			var end = jQuery(this).attr("data-end");

			if(pos==99){
				if(begin && end && begin.indexOf(",")>-1&& end.indexOf(",")>-1){
					shape_loop_init(shapeEl,pos,duration*1,begin,end,jQuery(this).parent().hasClass("background-shapes"));
				}
			}else{
				shape_loop_init(shapeEl,pos-1,duration*1,"","",jQuery(this).parent().hasClass("background-shapes"));
			}
			jQuery(this).addClass("loaded");
		})
	}


}


jQuery(document).ready(function($) {

	if( $('[data-mouse-animate]').length>0 || is_edit_model ){
		mousemove_animate_fun($);
	}
	if( $('[data-scroll-animate]').length>0 || is_edit_model) {
		scroll_animate_fun($);
	}
	//滚动...
	if($("#phantom").css("display")=="block"){
		var floatMenuH = $("#phantom").height();
	}else{
		var floatMenuH = 0;
	}
	var urlHash = "#" + window.location.href.split("#")[1];
	if($(".one-page-row").length && $(".one-page-row div[data-anchor^='#']").length ){
		if(urlHash!= "#undefined"){
			$("html").animate({
				scrollTop: $(".one-page-row div[data-anchor='" + urlHash + "']").offset().top - floatMenuH + 1
			}, 600, function(){
				$("body").removeClass("is-scroll");
			});
		}
	}else{
		if(urlHash.indexOf("=")<0 && $(urlHash).length > 0){
			$("body").addClass("is-scroll");
			setTimeout(function(){
				$("html").animate({
					scrollTop:  $(urlHash).offset().top
				}, 600, function(){
					jQuery("#parallax-nav a[href='"+urlHash+"']").closest("li").addClass("active");
					$("body").removeClass("is-scroll");
					parallax_scroll_fun();
				});
			},500);

		}else{
			parallax_scroll_fun();
		}
	}
	//滚动...end
	//...check body
	vc_element_init();
	//侧边栏
	right_nav_bar();
	//底部菜单
	jQuery(".footerbar-menu .menu-item-has-children>a").click(function(e){
		e.stopPropagation();
		e.preventDefault();
		var submenu = jQuery(this).next(".sub-menu");
		if(submenu.css("display")=="none"){
			submenu.css("display","block");
		}else{
			submenu.css("display","none");
		}
	})
	//背景多个图片切换
	if(typeof(qfy_bg_images)!= "undefined"){
		thebackground(qfy_bg_images,qfy_bg_images_int);
	}
	//图片加载完再执行一下resize
	if(jQuery(".preloadimg:not('.loaded')").length>0){
		setTimeout(function(){
				jQuery(".preloadimg:not('.loaded')").each(function(){
					var newurl = jQuery(this).attr("org-src");
					jQuery(this).attr("src",newurl).addClass("loaded").load(function(){
						var newscrset = jQuery(this).attr("org-srcset");
						if(newscrset){
							jQuery(this).attr("srcset",newscrset);
						}
						resizeDefaultObjSize();
					});
				});
		},300);
	}

	//多级选择
	qfy_custom_select();


	if(!is_edit_model){
		$(".qfy-text a[url-flagtarget='_blank']").attr("target","_blank");
		$(".qfy-text a[url-flagtarget='']").removeAttr("target");
	}
	if(top!=self){
		  function closeOpenPanel(){
			  if(top.jQuery(".boxy-wrapper:visible").length>0){
					top.jQuery(".boxy-wrapper:visible .buttonClass1").click();
		    	}
				if(parent.jQuery("#qfbody-content>.panel:visible").length>0){
					parent.jQuery("#qfbody-content>.panel:visible .vc-close").click();
		    	}
				if(top.jQuery(".bitPopIframe:visible").length>0){
					top.jQuery(".bitPopIframe:visible .btn-default").click();
		    	}
		  }
		  var ctrlDown = false;
		  var escDown = false;
		  var ctrlKey = 17, vKey = 86, cKey = 67,escKey=27,zkey=90,ykey=89;
		  $(document).keydown(function(e){
	  			if (e.keyCode == escKey){
	  				closeOpenPanel();
	  				 top.jQuery.unblockUI();
	  			}
	  			if(e.ctrlKey && (e.keyCode== zkey|| e.keyCode== ykey)){
	  				top.restorePage();
	  			}
		  })
		  try{
			  $(top.document).keydown(function(e){
							if (e.keyCode == escKey){
								closeOpenPanel();
							}
							if(e.ctrlKey  && (e.keyCode== zkey|| e.keyCode== ykey)){
								top.restorePage();
							}
			 })
			  $(parent.document).keydown(function(e){
							if (e.keyCode == escKey){
								closeOpenPanel();
							}
			 })
		 }catch(e){}
	  }else{
		  $(document).keydown(function(e){
	  			if (e.keyCode == "27"){
	  				 jQuery.unblockUI();
	  			}
		  })


	  }
	$(".dropdown-toggle").unbind("click").bind("click",function(){
		 var obj =jQuery(this).parent().find(".dropdown-menu");
		 if(obj.css("display") == "none"){
			obj.show();
			if(obj.closest(".vc_user_lp").length>0){
				obj.closest("section").addClass("overflowauto");
			}
		 }else{
			obj.hide();
		 }
	})
	initmouseover();
	resizeDefaultObjSize();
	toolTip();
	weiBoAndWeiXinToolTip();

	/*--Set variable for floating menu*/



	/*--Detect iphone phone*/
	if(dtGlobals.isiPhone){
		$("body").addClass("is-iphone");
	};
	if(!is_edit_model){
		if($(".bitMainTopSider .vc-no-content-helper").length==0 && $(".bitMainTopSider").length>0  && $(".bitMainTopSider").height()==0){
			$(".bitMainTopSider").parent().parent().remove();
			//$(".bitMainTopSider-wrapper").css("padding-top",0);
		}
	}
	$.fn.exists = function() {
		if ($(this).length > 0) {
			return true;
		} else {
			return false;
		}
	}
	$.fn.loaded = function(callback, jointCallback, ensureCallback){
		var len	= this.length;
		if (len > 0) {
			return this.each(function() {
				var	el		= this,
					$el		= $(el),
					blank	= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

				$el.on("load.dt", function(event) {
					$(this).off("load.dt");
					if (typeof callback == "function") {
						callback.call(this);
					}
					if (--len <= 0 && (typeof jointCallback == "function")){
						jointCallback.call(this);
					}
				});

				if (!el.complete || el.complete === undefined) {
					el.src = el.src;
				} else {
					$el.trigger("load.dt")
				}
			});
		} else if (ensureCallback) {
			if (typeof jointCallback == "function") {
				jointCallback.call(this);
			}
			return this;
		}
	};
	$.fn.animateSkills = function() {
		$(".skill-value", this).each(function () {
			var $this = $(this),
				$this_data = $this.data("width");

			$this.css({
				width: $this_data + '%'
			});
		});
	};

	if(dtGlobals.isWindowsPhone){
		$("body").addClass("windows-phone");
	}

	$(".mini-nav select").change(function() {
		window.location.href = $(this).val();
	});


	dtGlobals.isHovering = false;

	mainmenu_event();
	searchForm();
	/* !-Navigation widget */
	var customTimeoutShow
	$(".custom-nav > li > a").click(function(e){
		$menuItem = $(this).parent();
		if ($menuItem.hasClass("has-children")) e.preventDefault();
			if ($(this).attr("class") != "active"){
					$(".custom-nav > li > ul").stop(true, true).slideUp(400);
					$(this).next().stop(true, true).slideDown(500);
					$(".custom-nav > li > a").removeClass("active");
					$(this).addClass('active');
			}else{
					$(this).next().stop(true, true).slideUp(500);
					$(this).removeClass("active");
			}

			$menuItem.siblings().removeClass("act");
			$menuItem.addClass("act");
	});
	$(".custom-nav > li > ul").each(function(){
		clearTimeout(customTimeoutShow);
		$this = $(this);
		$thisChildren = $this.find("li");
		if($thisChildren.hasClass("act")){
			$this.prev().addClass("active");
			$this.parent().siblings().removeClass("act");
			$this.parent().addClass("act");
			$(this).slideDown(500);
		}
	});

	var mtResizeTimeout;

	$(window).on("resize", function() {
		resizeDefaultObjSize();
		clearTimeout(mtResizeTimeout);
		mtResizeTimeout = setTimeout(function() {
			$(window).trigger( "metroresize" );
		}, 200);
		try{
			if( parent.jQuery("#mobile_iframe_preivew").length==1){
				parent.setMobileDocumentInit();
			}
		}catch(e){
		}
		if(jQuery("#header.logo-left-right #navigation ul.ab-center").length>0){
			var v1 = jQuery("#header #branding").width();
			var v2 = jQuery("#header .assistive-info").width();
			jQuery("#header #navigation #main-nav").css("text-align","center").css("left",(v2-v1)/2+"px");

		}

	});
	try{
		if( parent.jQuery("#mobile_iframe_preivew").length==1){
			setTimeout(function(){
				parent.setMobileDocumentInit();
			},1000);
		}
	}catch(e){}
	if(jQuery(".zh_tw_lang").length>0){
		StranBody(jQuery(".zh_tw_lang")[0]);
		var href = jQuery(".selected_template_a").attr("href");
		var nhref = Traditionalized(href);
		jQuery(".selected_template_a").attr("href",nhref);
	}
	//翻译简繁体
	tranlanguage(jQuery("html"));
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			$('.scroll-top').removeClass('off').addClass('on');
		}
		else {
			$('.scroll-top').removeClass('on').addClass('off');
		}
	});
	$(".scroll-top").click(function(e) {
		e.preventDefault();
		$("html").animate({ scrollTop: 0 }, "slow");
		return false;
	});



	// !- Animation "onScroll" loop
	function doAnimation() {

		if(dtGlobals.isMobile){
			$(".skills").animateSkills();
		}
		if($("html").hasClass("old-ie")){
			$(".skills").animateSkills();
		};
	};
	// !- Fire animation
	doAnimation();
	/* Skills:end */
	// Create the dropdown base 12.02.14
	$("<select />").prependTo(".mini-nav .menu-select");

	// Create default option "Select"
	$("<option />", {
		"selected"  :  "selected",
		"value"     :  "",
		"text"      :  "———"
	}).appendTo(".mini-nav .menu-select select");

	// Populate dropdown with menu items
	$('.bitcommerce-ordering-div select').each(function(){
		$(this).customSelect();
	});
	jQuery(window).load(function(){
		if(jQuery('#load').length){
			jQuery('#load').fadeOut().remove();
		}
	});

	$("#main-nav .menu-item a,.dl-menu li a").not(".dl-menu li.dl-back a[href^='#']").each(function(){
			var $_this = $(this),selector = $_this.attr("href");

		if(selector && selector.indexOf("#")>-1 && selector.indexOf("/")<0 && selector!="#"){
			//if(selector.indexOf("#")!=0){
				selector = jQuery.trim(selector);
				var tmpselecter = selector.split("#");
				selector = "#"+tmpselecter[tmpselecter.length-1];
			//}

			if(selector!="#" &&  selector.indexOf("=")<0 && $(selector).length>0){
				$(this).on('click',function(e){
					var $_this = $(this),selector = $_this.attr("href");

					//手机下菜单是#，子菜单无法点击
					var mobilemenu =$_this.closest("#dl-menu").find("#mobile-menu").length;
					if( mobilemenu>0 && $_this.parent().hasClass("has-children")){
						var $submenu = $_this.parent().find( 'ul.dl-submenu:first' );
						if($submenu.length>0){
							var xx=event.pageX;
							var width = $submenu.width();
							var isclick = width-xx>35;
							if(!isclick) return;
						}
					}

					if($("body >.dl-menuwrapper.floatmenu").length>0){
						$("#dl-menu #mobile-menu .phone-text").click();
					}

					$("body").addClass("is-scroll");


					if($("#phantom").css("display")=="block"){
						var floatMenuH = $("#phantom").height();
					}else{
						var floatMenuH = 0;
					}

					//if(selector.indexOf("#")!=0){
						var tmpselecter = selector.split("#");
						selector = "#"+tmpselecter[tmpselecter.length-1];
					//}
					$_this.closest("#dl-menu").find(".wf-phone-hidden.phone-text").click();
					var base_speed  = 600,
						speed       = base_speed;
					if(selector.indexOf("=")<0 &&  $(selector).length > 0){
						var this_offset = $_this.offset(),
							that_offset = $(selector).offset(),
							offset_diff = Math.abs(that_offset.top - this_offset.top),
							speed       = (offset_diff * base_speed) / 1000;
					}

					$(".one-page-row .menu-item a").parent("li").removeClass("act");
					if($(".one-page-row").length>0){
						$_this.parent("li").addClass("act");
					}
					if(selector == "#" && ($(".one-page-row").length > 0)){
						$("html").animate({
							scrollTop: 0
						}, speed, function(){
							$("body").removeClass("is-scroll");
							$_this.parent().siblings(".onepage").removeClass("act onepage");
						});
					}else{
						if($(".one-page-row").length && $(".one-page-row div[data-anchor^='#']").length ){
							$("html").animate({
								scrollTop: $(".one-page-row div[data-anchor='" + selector + "']").offset().top - floatMenuH + 1
							}, speed, function(){
								$("body").removeClass("is-scroll");
							});
						}else{
							if(selector.indexOf("=")<0 &&  $(selector).length > 0){
								$("html").animate({
									scrollTop:  $(selector).offset().top - floatMenuH + 1
								}, speed, function(){
									$("body").removeClass("is-scroll");

									$_this.parent().siblings(".onepage").removeClass("act onepage");
									$_this.parent().addClass("act onepage");
									_menu_link_event(selector);

								});
							}
						}
					}
					return false;
				});

			}

		}

	});
	$("ul.menu a,.tabcontent-inner>ul a").each(function(){
		var $_this = $(this),selector = $_this.attr("href");
		if(selector && selector.indexOf("#")>-1 && selector.indexOf("/")<0 && selector!="#"){

			selector = jQuery.trim(selector);
			var tmpselecter = selector.split("#");
			selector = "#"+tmpselecter[tmpselecter.length-1];
			if(selector!="#" &&  selector.indexOf("=")<0 && $(selector).length>0){
				$(this).on('click',function(e){
					$("body").addClass("is-scroll");
					if($("#phantom").css("display")=="block"){
						var floatMenuH = $("#phantom").height();
					}else{
						var floatMenuH = 0;
					}
					var base_speed  = 600,speed       = base_speed;
					var this_offset = $_this.offset(),that_offset = $(selector).offset(),offset_diff = Math.abs(that_offset.top - this_offset.top),speed       = (offset_diff * base_speed) / 1000;

					$("html").animate({
						scrollTop:  $(selector).offset().top - floatMenuH + 1
					}, speed, function(){
						$("body").removeClass("is-scroll");
						_menu_link_event(selector);
					});

				});
			}
		}
	});
	$(".logo-box a[href^='#'], #branding a[href^='#'], #branding-bottom a[href^='#']").on('click',function(e){
		$("body").addClass("is-scroll");
		if($("#phantom").css("display")=="block"){
			var floatMenuH = $("#phantom").height();
		}else{
			var floatMenuH = 0;
		}
		var $_this = $(this),
			selector 	= $_this.attr("href");

		var base_speed  = 600,
			speed       = base_speed;
		if($(selector).length > 0){
			var this_offset = $_this.offset(),
				that_offset = $(selector).offset(),
				offset_diff = Math.abs(that_offset.top - this_offset.top),
				speed       = (offset_diff * base_speed) / 1000;
		}
		if(selector == "#"){
			$("html").animate({
				scrollTop: 0
			}, speed, function(){
				$("body").removeClass("is-scroll");
			});
		}else{
			if($(".one-page-row").length && $(".one-page-row div[data-anchor^='#']").length ){
				$("html").animate({
					scrollTop: $(".one-page-row div[data-anchor='" + selector + "']").offset().top - floatMenuH + 1
				}, speed, function(){
					$("body").removeClass("is-scroll");
				});
			}else{
				if($(selector).length > 0){
					$("html").animate({
						scrollTop:  $(selector).offset().top - floatMenuH + 1
					}, speed, function(){
						$("body").removeClass("is-scroll");
					});
				}
			}
		}
		return false;
	});
	//float
	 floatmenu_create();

	 let menu_has_href = false;
	 $(".mainmenu >.menu-item > a").each(function(){
		var href =jQuery(this).attr("href");
		if(href.indexOf("#")>-1 &&href!="#" ){
			menu_has_href = true;
		}
	});
	if(menu_has_href){
	    $.onDemandScript("/qfy-content/themes/qfy-01/js/a-menu-href.js",function() {
			mainmenu_href_event();
		})
	}
	if( $(".yy_website_notice").length>0){
		var hasnotice=getCookie("yy_website_notice");
		//console.log("hasnotice="+hasnotice);
		if(hasnotice!="1"){
			var begin = $(".yy_website_notice").attr("data-begin");
			var end = $(".yy_website_notice").attr("data-end");
			var timestamp = 8*3600+Date.parse(new Date())/1000;
			if( (begin && timestamp<begin) || (end && timestamp>end)  ) {
				//pass

			}else{
				setTimeout(function(){
					$("body").addClass("is-showing-notice");
				},100);
			}
		}
		$(".yy_website_notice_close").click(function(){
			var type = $(this).attr("data-close");
			if(type==1){
				setCookie("yy_website_notice",1,1);
			}else if(type==2){
				setCookie("yy_website_notice",1,-1);
			}else{
				setCookie("yy_website_notice",1,365);

			}
			$(".yy_website_notice").remove();
			$("body").removeClass("is-showing-notice");
		})
	}

//ready end
});

function floatmenu_create(){
	var $ = jQuery;
	if(jQuery("#header.logo-left-right #navigation ul.ab-center").length>0){
		var v1 = jQuery("#header #branding").width();
		var v2 = jQuery("#header .assistive-info .top-bar-right").width();
		jQuery("#header #navigation #main-nav").css("text-align","center").css("left",(v2-v1)/2+"px");
	}
	if($("#header.newrightmenu,#header.newleftmenu").length>0){
		if($("#page.bodyheader40,#page.bodyheader0").length>0){
			$("#header").css("position","fixed").css("top","0");
			return;
		}
	};

	if (dtGlobals.isMobile && !dtGlobals.isiPad) smartMenu = false;
	if (smartMenu && $("#header").length>0 ) {
		$.onDemandScript("/qfy-content/themes/qfy-01/js/a-menu-float.js",function() {
			floatmenu_create_init();
		})
	}

}

function _menu_link_event(hash){
	$ = jQuery;
	//处理主菜单
	var ishash = false;
	if(hash.indexOf("#")==0  &&  hash!="#" && hash.indexOf("=")<0 && jQuery(hash).length>0 ){
		$(".mainmenu").each(function(){
			$(this).find("a").each(function(){
				var href = jQuery(this).attr("href");
				if(href){
					var start = href.indexOf(hash);
					if(href.substr(start)==hash && ishash==false){
						ishash = true;
						var ul =  jQuery(this).closest(".mainmenu");
						ul.find(".act").removeClass("act");
						var currli = jQuery(this).closest("li");
						 currli.addClass("act");
						 currli.parents("li").addClass("act");
					}
				}
			})
		})

	}else{
		$(".mainmenu .sub-nav .act").each(function(){
			var href = $(this).find(">a").attr("href");
			if(href.indexOf("#")>-1){
				$(this).removeClass("act");
			}
		})

	}
	//处理其他菜单
	if(hash.indexOf("#")==0  &&  hash!="#" && hash.indexOf("=")<0&& jQuery(hash).length>0 ){
		$(".widget_nav_menu ul.menu,.qfy-listmenuvertical ul.menu,.widget_nav_menuhorizontal ul.menu").each(function(){
			var ismenuhash = false;
			$(this).find("a").each(function(){
				var href = jQuery(this).attr("href");
				if(href){
					var start = href.indexOf(hash);
					if(href.substr(start)==hash && ismenuhash==false){
						ismenuhash = true;
						var ul =  jQuery(this).closest("ul.menu");
						ul.find(".current-menu-item").removeClass("current-menu-item current-menu-ancestor");
						var currli = jQuery(this).closest("li");
						 currli.addClass("current-menu-item");
						 currli.parents("li").addClass("current-menu-item");
					}
				}
			})
		})

	}else{
		$(".widget_nav_menu ul.menu,.qfy-listmenuvertical ul.menu,.widget_nav_menuhorizontal ul.menu").each(function(){
			$(this).find(">li.current-menu-item").each(function(i){
				if(i>0){
					$(this).removeClass("current-menu-item current-menu-ancestor");
					$(this).find(".current-menu-item").removeClass("current-menu-item current-menu-ancestor");
				}
			});
		})
	}

	if(hash.indexOf("#")==0  &&  hash!="#" && hash.indexOf("=")<0 && jQuery(hash).length>0 ){
		$(".tabcontent-inner>ul").each(function(){
			var ismenuhash = false;
			$(this).find("a").each(function(){
				var href = $(this).attr("href");
				if(href){
					var start = href.indexOf(hash);
					if(href.substr(start)==hash && ismenuhash==false){
						ismenuhash = true;
						var ul =  jQuery(this).closest(".tabcontent-inner");
						ul.find(".active").removeClass("active");
						$(this).addClass("active");
					}
				}
			})
		})
	}
}
function mainmenu_event(){
	$ = jQuery;
	//custom menu
	if($("body").hasClass("u-body")){
		return;
	}

	$("#mobile-menu").removeAttr("style").wrap("<div id='dl-menu' class='dl-menuwrapper wf-mobile-visible main-mobile-menu' style='display:none' />");
		if($("#mobile-menu").hasClass("dropTopStyle")){
				$("#mobile-menu").removeClass("glyphicon glyphicon-icon-align-justify").append('<span class="mobile_icon glyphicon glyphicon-icon-angle-down" ></span>');
				var menu_html = $("#dl-menu:not(.dl-qfymobile-menu)").html();
				$("#dl-menu:not(.dl-qfymobile-menu)").remove();
				$("body").prepend("<div id='dl-menu' class='dl-menuwrapper wf-mobile-visible dropTopStyle_containter' >"+menu_html+"</div>");
				menu_html = null;
				if($("#mobile-menu").hasClass("left")){
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("left");
				}else if($("#mobile-menu").hasClass("right")){
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("right");
				}else{
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("center");
				}

				var padding = $("#mobile-menu").attr("data-padding");
				if(padding){
					$("#dl-menu:not(.dl-qfymobile-menu)").css("padding-left",padding+"px").css("padding-right",padding+"px");
				}
				if($("#mobile-menu").hasClass("positionFixed")){
					mobile_menu_fix();
				}

			}else if($("#mobile-menu").hasClass("dropCenterStyle")){
				$("#mobile-menu").removeClass("glyphicon glyphicon-icon-align-justify").append('<span class="mobile_icon glyphicon glyphicon-icon-angle-down" ></span>');
				var menu_html = $("#dl-menu:not(.dl-qfymobile-menu)").html();
				$("#dl-menu:not(.dl-qfymobile-menu)").remove();
				$("#header").after("<div id='dl-menu' class='dl-menuwrapper wf-mobile-visible dropCenterStyle_containter' >"+menu_html+"</div>");
				menu_html = null;
				if($("#mobile-menu").hasClass("left")){
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("left");
				}else if($("#mobile-menu").hasClass("right")){
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("right");
				}else{
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("center");
				}
				var padding = $("#mobile-menu").attr("data-padding");
				if(padding){
					$("#dl-menu:not(.dl-qfymobile-menu)").css("padding-left",padding+"px").css("padding-right",padding+"px");
				}
				if($("#mobile-menu").hasClass("positionFixed")){
					mobile_menu_fix();
				}


			}else if($("#header").hasClass("wf-mobile-hidden")){
				var menu_html = $("#dl-menu:not(.dl-qfymobile-menu)").html();
				$("#dl-menu:not(.dl-qfymobile-menu)").remove();
				$("#header").after("<div id='dl-menu' class='dl-menuwrapper wf-mobile-visible mobiledefault_containter' style='text-align:center;margin:0px auto;' >"+menu_html+"</div>");
				if($("#mobile-menu").hasClass("positionFixed")){
					mobile_menu_fix();
				}

			}else{
				//default
				if($("#mobile-menu").hasClass("positionFixed")){
					$("#dl-menu:not(.dl-qfymobile-menu)").addClass("mobiledefault_containter");
					mobile_menu_fix();
				}

		}

	$(".underline-hover > li > a > span").not(".underline-hover > li > a > span.mega-icon").append("<i class='underline'></i>");
	$("#main-nav .menu-nav > li > a > span").append("<i class='underline'></i>");

	var $mainNav = $("#main-nav,.mini-nav");

	var	$mobileNav = $mainNav.clone();
	var	$mobileTopNav = $(".mini-nav").clone();
	var backCap = $("#mobile-menu > .menu-back").html();

	$mobileNav
		.attr("id", "")
		.attr("class", "dl-menu")
		.find(".sub-nav")
			.addClass("dl-submenu")
			.removeClass("sub-nav")
			.prepend("<li class='menu-item dl-back'><a href='#'><span>"+backCap+"</a></li>");


	$mobileNav.appendTo("#dl-menu:not(.dl-qfymobile-menu)").wrap("<div class='dl-container' />");


	$("body").removeClass("mobilefloatmenu");
	$("body >.dl-menu-film,body >.dl-menu-fixedheader").remove();
	if($("#mobile-menu").hasClass("floatmenu") ||$("#mobile-menu").hasClass("fullfloatmenu") || $("#mobile-menu").hasClass("leftbtnmenu")){
		$("body").addClass("mobilefloatmenu");
		var menu_content = $("#dl-menu:not(.dl-qfymobile-menu) .dl-container").prop("outerHTML");
		$("#dl-menu:not(.dl-qfymobile-menu) .dl-container").remove();
		$("body").prepend("<div  class='dl-menuwrapper  wf-mobile-visible floatmenu floatwarpper' >"+menu_content+"</div>");
		var menu_html = $("#dl-menu:not(.dl-qfymobile-menu) #mobile-menu").prop("outerHTML");
		$("#dl-menu:not(.dl-qfymobile-menu) #mobile-menu").remove();
		$("body #page").prepend("<div id='dl-menu' class='dl-menuwrapper wf-mobile-visible floatmenu' >"+menu_html+"</div>");

		if($("#mobile-menu").hasClass("fullfloatmenu")){
			$(".dl-menuwrapper.floatmenu").addClass("fullfloatmenu");
		}else	if($("#mobile-menu").hasClass("leftbtnmenu")){
			$("body").addClass("mobileleftbtnmenu");
			$(".dl-menuwrapper.floatmenu").addClass("leftbtnmenu").find(".dl-container").prepend( jQuery(".menu_displaynone").html() ).append( jQuery(".menu_displaynone_footer").html()  );
			if($("body >.dl-menu-film").length==0){
				$("body").prepend("<div class='dl-menu-film wf-mobile-visible'></div>");
			}
			if($("body >.dl-menu-fixedheader").length==0 && $(".leftbtnmenu #mobile-menu.displaynone").length==0){

				if($(".yy_website_notice").length>0){
					$(".yy_website_notice").after("<div class='dl-menu-fixedheader wf-mobile-visible'>"+ jQuery(".menu_displaynone_header").html()+"</div>");
				}else{
					$("body").prepend("<div class='dl-menu-fixedheader wf-mobile-visible'>"+ jQuery(".menu_displaynone_header").html()+"</div>");
				}
			}
			if(top!=self && jQuery("body").hasClass("compose-mode")){
				 jQuery("body").find(".qfyheadercontent [bitDataAction='site_widget_container'] .site_tooler").each(
						function() {
							parent.widgetHover(this,  jQuery("body"));
						})
				 jQuery("body").find(".qfyheadercontent [bitDataAction='site_fix_container']").each(function() {
					 parent.widgetFixEvent(this);
				})
			}
			jQuery("body").addClass("moble_menufixed");
			mobile_menu_fix_2();
			if ( jQuery(window).scrollTop()> jQuery(".dl-menu-fixedheader").height()) {
				jQuery(".dl-menu-fixedheader").css("position","fixed");
				jQuery("body").addClass("fixedheadering");
			}else{
				jQuery(".dl-menu-fixedheader").css("position","relative");
				jQuery("body").removeClass("fixedheadering");
			}
		}
		if($("#mobile-menu").hasClass("left")){
			$("#dl-menu:not(.dl-qfymobile-menu)").addClass("left");
			$(".floatwarpper").addClass("left");
		}else if($("#mobile-menu").hasClass("right")){
			$("#dl-menu:not(.dl-qfymobile-menu)").addClass("right");
			$(".floatwarpper").addClass("right");
		}else{
			$("#dl-menu:not(.dl-qfymobile-menu)").addClass("center");
			$(".floatwarpper").addClass("center");
		}
		var padding = $("#mobile-menu").attr("data-padding");
		if(padding){
			$(".floatwarpper").css("padding-left",padding+"px").css("padding-right",padding+"px");
		}
		var element_right = $("#mobile-menu").attr("data-right");
		if(element_right){
			$("#dl-menu:not(.dl-qfymobile-menu)").css("right",element_right+"px");
		}
		var element_top = $("#mobile-menu").attr("data-top");
		if(element_top){
			$("#dl-menu:not(.dl-qfymobile-menu)").css("top",element_top+"px");
		}

	}

	if (!$("html").hasClass("old-ie")) $( "#dl-menu:not(.dl-qfymobile-menu)" ).dlmenu();

	var timeouthidden = new Array();
	$(".qfy-sub-div.MenuAnimIn_js", $mainNav).parent().each(function(i) {
		var $this = jQuery(this);


		jQuery(this).on("mouseenter", function(e) {

			var obj = jQuery(this).find(".qfy-sub-div:first");
			if(timeouthidden[i]){
				clearTimeout(timeouthidden[i]);
			}
			var h = obj.children().height();
			var t = obj.attr("data-time");
			if(!obj.hasClass("ing") && !obj.hasClass("ed")){
				obj.stop().addClass("ing").removeClass("ending").css({"visibility":"visible","height": 0}).animate({"height": h}, t*1000,function(){
					jQuery(this).removeClass("ing").addClass("ed").css({"visibility":"visible"});
				});
			}

		}).on("mouseleave", function(e) {

			var obj = jQuery(this).find(".qfy-sub-div:first");
			if(timeouthidden[i]){
				clearTimeout(timeouthidden[i]);
			}
			timeouthidden[i] = setTimeout(function(){
				if(obj.hasClass("ending") || obj.hasClass("ing") ) return;
				obj.addClass("ending").removeClass("ed").animate({"height": 0}, 500,function(){jQuery(this).removeClass("ending ed").css({"visibility":"hidden","height": 0});});
			},300);
		});
	});

	$(".sub-nav", $mainNav).parent().each(function() {
	var $this = $(this);
	if(dtGlobals.isMobile || dtGlobals.isWindowsPhone){
		$this.find("> a").on("click tap", function(e) {
			if (!$(this).hasClass("dt-clicked")) {
				e.preventDefault();
				$mainNav.find(".dt-clicked").removeClass("dt-clicked");
				$(this).addClass("dt-clicked");
			} else {
				e.stopPropagation();
			}

		});
	};

	var menuTimeoutShow,
		menuTimeoutHide;

	if($this.hasClass("dt-mega-menu")){

		$this.on("mouseenter tap", function(e) {
			if(e.type == "tap") e.stopPropagation();
			var $ = jQuery;
			var $this = jQuery(this);
			$this.addClass("dt-hovered");

			dtGlobals.isHovering = true;


			var $_this = jQuery(this),
				$_this_h = $this.height();

			var $_this_ofs_top = $this.position().top;
				$this.find("> .sub-nav").css({
					top: $_this_ofs_top+$_this_h
				});


			if($this.hasClass("mega-auto-width")){
				var $_this = $(this),
					$_this_sub = $_this.find(" > .sub-nav > li"),
					coll_width = $("#main .wf-wrap").width()/5,
					$_this_par_width = $_this.parent().width(),
					$_this_parents_ofs = $_this.offset().left - $this.parents("#header .wf-table, .ph-wrap-inner, .logo-center #navigation, .logo-classic #navigation, .logo-classic-centered #navigation").offset().left;

				$_this.find(" > .sub-nav").css({
					left: $_this_parents_ofs,
					"marginLeft": -($_this.find(" > .sub-nav").width()/2 - $_this.width()/2)
				});
			}
			if($this.is(':first-child') && $this.hasClass("mega-auto-width")){
				$this.find(" > .sub-nav").css({
					left: $_this.offset().left - $this.parents("#header .wf-table, .ph-wrap-inner, .logo-center #navigation, .logo-classic #navigation, .logo-classic-centered #navigation").offset().left,
					"marginLeft": 0
				});
			}else if($this.is(':last-child') && $this.hasClass("mega-auto-width")){
				$this.find(" > .sub-nav").css({
					left: "auto",
					right: $this.parents("#header .wf-table, .ph-wrap-inner, .logo-center #navigation, .logo-classic #navigation, .logo-classic-centered #navigation").width() - ( $this.position().left + $this.width() ),
					"marginLeft": 0
				});
			};

			if ($("#page").width() - ($this.children("ul").offset().left - $("#page").offset().left) - $this.children("ul").width() < 0) {
				$this.children("ul").addClass("right-overflow");
			};
			if($this.position().left < ($this.children("ul").width()/2)) {
				$this.children("ul").addClass("left-overflow");
			}

			clearTimeout(menuTimeoutShow);
			clearTimeout(menuTimeoutHide);

			menuTimeoutShow = setTimeout(function() {
				if($this.hasClass("dt-hovered")){
					$this.find("ul").stop().css("visibility", "visible").animate({
						"opacity": 1
					}, 150);
				}
			}, 100);
		});

		$this.on("mouseleave", function(e) {
			var $this = $(this);
			$this.removeClass("dt-hovered");

			dtGlobals.isHovering = false;
			clearTimeout(menuTimeoutShow);
			clearTimeout(menuTimeoutHide);

			menuTimeoutHide = setTimeout(function() {
				if(!$this.hasClass("dt-hovered")){
					$this.children("ul").stop().animate({
						"opacity": 0
					}, 150, function() {
						jQuery(this).css("visibility", "hidden");

						jQuery(this).find("ul").stop().css("visibility", "hidden").animate({
							"opacity": 0
						}, 10);
					});

					setTimeout(function() {
						if(!$this.hasClass("dt-hovered")){
							$this.children("ul").removeClass("right-overflow");
							$this.children("ul").removeClass("left-overflow");
						}
					}, 400);

				}
			}, 150);

			$this.find("> a").removeClass("dt-clicked");
		});
	}else{

		$this.on("mouseenter tap", function(e) {
			if(e.type == "tap") e.stopPropagation();
			var $ = jQuery;
			var $this = jQuery(this);
			$this.addClass("dt-hovered");
			if ($("#page").width() - ($this.children("ul").offset().left - $("#page").offset().left) - $this.children("ul").width() < 0) {
			//if ($("#page").width() - ($this.children("ul").offset().left - $("#page").offset().left) - 240 < 0) {
				$this.children("ul").addClass("right-overflow");
			}
			dtGlobals.isHovering = true;
			clearTimeout(menuTimeoutShow);
			clearTimeout(menuTimeoutHide);

			if($this.find(".qfy-sub-div").length==0 && $this.closest(".qfyheaderul").length==0){
				menuTimeoutShow = setTimeout(function() {
					if($this.hasClass("dt-hovered")){
						if($this.closest("#main-nav").attr("data-sliderdown")){
							var h = $this.children('ul').height();
							$this.children('ul').stop().css({"visibility":"visible","opacity":"1","overflow":"hidden","max-height":"0"}).animate({
								"max-height": h
							}, 300,function(){
								jQuery(this).css({"overflow":"inherit"})
							});
						}else if($this.closest("#main-nav").hasClass("sub-sliderup")){
							$this.children('ul').stop().css("opacity", "1").css("visibility", "visible").css("margin-top", "0");
						}else{
							$this.children('ul').stop().css("visibility", "visible").animate({
								"opacity": 1
							}, 150);
						}


					}
				}, 100);
			}
		});

		$this.on("mouseleave", function(e) {
			var $this = jQuery(this);
			$this.removeClass("dt-hovered");

			dtGlobals.isHovering = false;
			clearTimeout(menuTimeoutShow);
			clearTimeout(menuTimeoutHide);
			if($this.find(".qfy-sub-div").length==0 && $this.closest(".qfyheaderul").length==0 ){
				menuTimeoutHide = setTimeout(function() {
					if(!$this.hasClass("dt-hovered")){

						if($this.closest("#main-nav").attr("data-sliderdown")){
							$this.children("ul").stop().removeAttr("style");
						}else if($this.closest("#main-nav").hasClass("sub-sliderup")){
							$this.children("ul").stop().removeAttr("style");
						}else{
							$this.children("ul").stop().animate({
								"opacity": 0
							}, 150, function() {
								jQuery(this).css("visibility", "hidden");
							});

						}

						setTimeout(function() {
							if(!$this.hasClass("dt-hovered")){
								$this.children("ul").removeClass("right-overflow");
							}
						}, 400);
					}
				}, 150);
			}

			$this.find("> a").removeClass("dt-clicked");
		});
	};
});

/* Main navigation: end */

}
function floatmenucontrols_mouseenter(){
	 if(typeof(parent.floatmenucontrols_mouseenter)=="function"){
			parent.floatmenucontrols_mouseenter();
	 }
}
function floatmenucontrols_mouseout(){
	 if(typeof(parent.floatmenucontrols_mouseout)=="function"){
			parent.floatmenucontrols_mouseout();
	 }
}

function base64_encode(str){var str=toUTF8(str);var base64EncodeChars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");var out,i,j,len,r,l,c;i=j=0;len=str.length;r=len%3;len=len-r;l=(len/3)<<2;if(r>0){l+=4}out=new Array(l);while(i<len){c=str.charCodeAt(i++)<<16|str.charCodeAt(i++)<<8|str.charCodeAt(i++);out[j++]=base64EncodeChars[c>>18]+base64EncodeChars[c>>12&63]+base64EncodeChars[c>>6&63]+base64EncodeChars[c&63]}if(r==1){c=str.charCodeAt(i++);out[j++]=base64EncodeChars[c>>2]+base64EncodeChars[(c&3)<<4]+"=="}else{if(r==2){c=str.charCodeAt(i++)<<8|str.charCodeAt(i++);out[j++]=base64EncodeChars[c>>10]+base64EncodeChars[c>>4&63]+base64EncodeChars[(c&15)<<2]+"="}}return out.join("")};
function base64_decode(str){var base64DecodeChars=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1];var c1,c2,c3,c4;var i,j,len,r,l,out;len=str.length;if(len%4!=0){return""}if(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/\=]/.test(str)){return""}if(str.charAt(len-2)=="="){r=1}else{if(str.charAt(len-1)=="="){r=2}else{r=0}}l=len;if(r>0){l-=4}l=(l>>2)*3+r;out=new Array(l);i=j=0;while(i<len){c1=base64DecodeChars[str.charCodeAt(i++)];if(c1==-1){break}c2=base64DecodeChars[str.charCodeAt(i++)];if(c2==-1){break}out[j++]=String.fromCharCode((c1<<2)|((c2&48)>>4));c3=base64DecodeChars[str.charCodeAt(i++)];if(c3==-1){break}out[j++]=String.fromCharCode(((c2&15)<<4)|((c3&60)>>2));c4=base64DecodeChars[str.charCodeAt(i++)];if(c4==-1){break}out[j++]=String.fromCharCode(((c3&3)<<6)|c4)}return toUTF16(out.join(""))};
function toUTF8(str){if(str.match(/^[\x00-\x7f]*$/)!=null){return str.toString()}var out,i,j,len,c,c2;out=[];len=str.length;for(i=0,j=0;i<len;i++,j++){c=str.charCodeAt(i);if(c<=127){out[j]=str.charAt(i)}else{if(c<=2047){out[j]=String.fromCharCode(192|(c>>>6),128|(c&63))}else{if(c<55296||c>57343){out[j]=String.fromCharCode(224|(c>>>12),128|((c>>>6)&63),128|(c&63))}else{if(++i<len){c2=str.charCodeAt(i);if(c<=56319&&56320<=c2&&c2<=57343){c=((c&1023)<<10|(c2&1023))+65536;if(65536<=c&&c<=1114111){out[j]=String.fromCharCode(240|((c>>>18)&63),128|((c>>>12)&63),128|((c>>>6)&63),128|(c&63))}else{out[j]="?"}}else{i--;out[j]="?"}}else{i--;out[j]="?"}}}}}return out.join("")};
function toUTF16(str){if((str.match(/^[\x00-\x7f]*$/)!=null)||(str.match(/^[\x00-\xff]*$/)==null)){return str.toString()}var out,i,j,len,c,c2,c3,c4,s;out=[];len=str.length;i=j=0;while(i<len){c=str.charCodeAt(i++);switch(c>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:out[j++]=str.charAt(i-1);break;case 12:case 13:c2=str.charCodeAt(i++);out[j++]=String.fromCharCode(((c&31)<<6)|(c2&63));break;case 14:c2=str.charCodeAt(i++);c3=str.charCodeAt(i++);out[j++]=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));break;case 15:switch(c&15){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:c2=str.charCodeAt(i++);c3=str.charCodeAt(i++);c4=str.charCodeAt(i++);s=((c&7)<<18)|((c2&63)<<12)|((c3&63)<<6)|(c4&63)-65536;if(0<=s&&s<=1048575){out[j++]=String.fromCharCode(((s>>>10)&1023)|55296,(s&1023)|56320)}else{out[j++]="?"}break;case 8:case 9:case 10:case 11:i+=4;out[j++]="?";break;case 12:case 13:i+=5;out[j++]="?";break}}}return out.join("")};


function weiBoAndWeiXinToolTip(){
	//ie8不支持
	if(jQuery("html#ie8").length==1){
		return false;
	}
	 Opentip.styles.stemsDemo = {
        stem: true,
        containInViewport: false,
        borderWidth: 2,
        borderColor: "#a7c1c5",
        background: "#EFF7F0"
      };
	 var objs = jQuery(".soc-ico .weixin");
	objs.each(function(){
		var obj = jQuery(this);
		var name = obj.attr("data-href");
		obj.attr("title", '');
		var title="<img src='/FeiEditor/public_api/getImageFromWebApi/weixin/"+name+"'  width='160'/><div>请扫二维码关注微信</div>";
		var data = { tipJoint: "bottom",style: "dark" };
		new Opentip(obj, title, data);
	})
	var objs = jQuery(".soc-ico .weibo");
	objs.each(function(){
		var obj = jQuery(this);
		var name = obj.attr("data-href");
		obj.attr("title", '');
		var title="<img src='/FeiEditor/public_api/getImageFromWebApi/weibo/"+name+"' width='160' /><div>请扫二维码关注微博</div>";
		var data = { tipJoint: "bottom",style: "dark" };
		new Opentip(obj, title, data);
	})
}
function toolTip(objs){
	//ie8不支持
	if(jQuery("html#ie8").length==1){
		return false;
	}
	 if(typeof(objs)=="undefined"){
		objs = jQuery("[data-tooltip='on']");
	 }
	 Opentip.styles.stemsDemo = {
        stem: true,
        containInViewport: false,
        borderWidth: 2,
        borderColor: "#a7c1c5",
        background: "#EFF7F0"
      };
	objs.each(function(){
		var obj = jQuery(this);
		var title = jQuery(this).attr("data-original-title");
		if(!title) title="";
		var image = jQuery(this).attr("data-original-image");
		var imagewidth = jQuery(this).attr("data-original-imagewidth");
		var imageheight = jQuery(this).attr("data-original-imageheight");
		if(image){
			if(!imagewidth)	imagewidth=150;
			if(!imageheight) imageheight=150;
			title = "<div>"+title+"</div>"+"<img src='"+image+"'  style='width:"+imagewidth+"px;height:"+imageheight+"px'/>";
		}
		var cate =  jQuery(this).attr("data-tooltip-cate");
		var data ="";
		if(cate==1){
			data = { tipJoint: "bottom"};
		}else if(cate==2){
			data = { tipJoint: "bottom",style: "alert"};
		}else if(cate==3){
			data = { tipJoint: "bottom",style: "dark" };
		}else if(cate==4){
			data = { tipJoint: "bottom",style: "glass" };
		}else if(cate==5){
			data = { tipJoint: "bottom right",style: "dark"};
		}else if(cate==6){
			data = { tipJoint: "bottom left",style: "dark" };
		}else if(cate==7){
			data = { tipJoint: "top right",style: "dark" };
		}else if(cate==8){
			data = { style: "stemsDemo", tipJoint: "bottom right", stem: "bottom right", stemLength: 10, stemBase: 30 };
		}else if(cate==9){
			data = { style: "stemsDemo", tipJoint: "bottom left", stem: "bottom left", stemLength: 10, stemBase: 30 };
		}else if(cate==10){
			data = { borderWidth: 5, stemLength: 18, stemBase: 20, style: "glass", target: true, tipJoint: "top", borderColor: "#317CC5" };
		}else if(cate==11){
			data = { borderWidth: 5, stemLength: 18, stemBase: 20, style: "glass", target: true, tipJoint: "bottom", borderColor: "#317CC5" };
		}else if(cate==12){
			data = { borderWidth: 5, stemLength: 18, stemBase: 20, style: "glass", target: true, tipJoint: "bottom left", borderColor: "#317CC5" }
		}
		if(data!=""){
			new Opentip(obj, title, data);
		}
	})
}
function toVisit(obj){
	var p  = jQuery(obj).closest(".qfy_item_post");
	var post_id = p.attr("data-postid");
	var pt = p.find('[data-title="true"]');
	var title = "";
	if(pt.length>0){
		var title =jQuery.trim(pt.text());
	}
	jConfirm("确认是否离开当前页面，访问页面【"+title+"】？",function(){
				top.$('#pageUrl').val(post_id).change();
	});

}
function toEditor(obj,e){
	if(e){
		 e.preventDefault();
		 e.stopPropagation();
	}
	parent.toEditor(obj);
}
function toCopy(obj){
	var p  = jQuery(obj).closest(".qfy_item_post");
	var id=p.closest(".vc-element").attr("data-model-id");


	var post_id = p.attr("data-postid");
	parent.bitSettingsEdit(post_id, "复制一个页面", "copyPage","COPY");
}
function toDelete(obj){
	parent.toDelete(obj);
}
function toEditProduct(obj){
	parent.toEditProduct(obj);
	return false;
}
function toRedirectProduct(obj){
	parent.toRedirectProduct(obj);
	return false;
}
function toDeleteCate(obj){
	parent.toDeleteCate(obj);
}
function pageNav(paged,aobj){
	if(aobj && jQuery(aobj).closest("#sitetop_pagehtml").length>0){
		top.pageNav(paged,aobj);
		return;
	}
	var obj =top.jQuery("#site-content-iframe");
	var url  =obj.attr("src");
	if(url.indexOf("paged")>-1){
		var tmp = url.split("&paged");
		url = tmp[0]+"&paged="+paged;
	}else{
		if(url.indexOf("?")>-1){
			url = url+"&paged="+paged;
		}else{
			url = url+"?paged="+paged;
		}
	}
	obj.attr("src",url);
}
function pageCate(page_id,cate_id){
	var obj = top.jQuery("#site-content-iframe");
	var url  =obj.attr("src");
	if(cate_id==0) cate_id="";
	if(url.indexOf("post_id")>-1){
		var tmp = url.split("&post_id");
		url = tmp[0]+"&post_id="+page_id+"&categories="+cate_id;
	}else{
		if(url.indexOf("?")>-1){
			url = url+"&post_id="+page_id+"&categories="+cate_id;
		}else{
			url = url+"?post_id="+page_id+"&categories="+cate_id;
		}
	}
	jConfirm("确认是否需要打开该分类列表页面？",function(){
		obj.attr("src",url);
	});

	return false;
}
function searchResult(p){
	var obj = top.jQuery("#site-content-iframe");
	if(obj.length>0){
		var action = jQuery(p).attr("action");
		var search = jQuery(p).find("[name='search']").val();
		var page_id = jQuery(p).find("[name='page_id']").val();
		var searchtype = jQuery(p).find("[name='searchtype']").val();
		var ep_search = jQuery(p).find("[name='ep_search']").val();
		var qfyuuid = jQuery(p).find("[name='qfyuuid']").val();
		var ep_relevancy = jQuery(p).find("[name='ep_relevancy']").val();

		var url  = obj.attr("src");
		if(url.indexOf("post_id")>-1){
			var tmp = url.split("&post_id");
			url = tmp[0]+"&post_id="+page_id+"&search="+encodeURIComponent(search)+"&searchtype="+searchtype;
		}else{
			if(url.indexOf("?")>-1){
				url = url+"&post_id="+page_id+"&search="+encodeURIComponent(search)+"&searchtype="+searchtype;
			}else{
				url = url+"?post_id="+page_id+"&search="+encodeURIComponent(search)+"&searchtype="+searchtype;
			}
		}
		if(ep_search && qfyuuid){
			url = url+"&ep_search=1&qfyuuid"+qfyuuid;
			if(ep_relevancy){
				url = url+"&ep_relevancy=1";
			}
		}
		obj.attr("src",url);
		return false;
	}
}

function toorderview(id){
	id = id.replace("#","");
	var obj = top.jQuery("#site-content-iframe");
	var page_id = top.jQuery("#pageUrl").val();
	var  url=obj.attr("src");
	if(url.indexOf("post_id")>-1){
		var tmp = url.split("&post_id");
		url = tmp[0]+"&post_id="+page_id+"&view-order="+id;
	}else{
		if(url.indexOf("?")>-1){
			url = url+"&post_id="+page_id+"&view-order="+id;
		}else{
			url = url+"?post_id="+page_id+"&view-order="+id;
		}
	}
	obj.attr("src",url);
}

function toorderpage(page_id){

	var obj = top.jQuery("#site-content-iframe");
	var  url=obj.attr("src");
	if(url.indexOf("post_id")>-1){
		var tmp = url.split("&post_id");
		url = tmp[0]+"&post_id="+page_id;
	}else{
		if(url.indexOf("?")>-1){
			url = url+"&post_id="+page_id;
		}else{
			url = url+"?post_id="+page_id;
		}
	}
	obj.attr("src",url);
}
function jConfirm(msg,yes,no,title){
	if(top!=self){
		top.jConfirm(msg,yes,no,title);
	}
}
function jAlert(msg,title){
	if(!is_edit_model){
		alert(msg);
	}else{
		top.jAlert(msg,title);
	}
}

function setCookie(cname, cvalue,exdays)		//cookies设置
{
	var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
}

function getCookie(Name)			//cookies读取
{
	var search = Name + "="
	if(document.cookie.length > 0)
	{
		offset = document.cookie.indexOf(search)
		if(offset != -1)
		{
			offset += search.length
			end = document.cookie.indexOf(";", offset)
			if(end == -1) end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		 }
	else return ""
	  }
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2])); return null;
}
function tobigimage(obj){
	var bigimage = jQuery(obj).parents(".qfy_showbox").find(".bigImage");
	var height = bigimage.find("img").height();
	var src = jQuery(obj).find("img").attr("src");
	jQuery(obj).parents(".qfy_imgList").find("img").css("border","0");
	jQuery(obj).find("img").css("border","2px solid #f63");
	src = src.replace("-150x150","");
	bigimage.find("img").attr("src",src).height(height);
}
function slideLine(box,stf,delay,speed,h){

	if(jQuery("#"+box+" div").length ==0){
		return false;
	}

	var slideBox = document.getElementById(box);
	var delay = delay||1000,speed = speed||20,h = h||20;
	var tid = null,pause = false;
	var s = function(){tid=setInterval(slide, speed);}
	var slide = function(){
	if(pause) return;
	slideBox.scrollTop += 1;
	if(slideBox.scrollTop%h == 0){
		clearInterval(tid);
		slideBox.appendChild(slideBox.getElementsByTagName(stf)[0]);
		slideBox.scrollTop = 0;
		setTimeout(s, delay);
		}
	}
	slideBox.onmouseover=function(){pause=true;}
	slideBox.onmouseout=function(){pause=false;}
	setTimeout(s, delay);
}

function vc_gallery_relat(){
	jQuery(".qfe_gallery.rela_other .vc-carousel .qfy_image_vc_item img").each(function(){
		var img = jQuery(this);
		var src = img.attr("src");
		img.css("cursor","pointer");
		src = src.replace(/-[\d]*x[\d]*/g,"");
		img.unbind("click").bind("click",function(){
			jQuery(".qfe_gallery.rela_other .slides").each(function(){
				var obj = jQuery(this);
				var index = 0;
				obj.find("img").each(function(){
					var toimg = jQuery(this);
					var tosrc = toimg.attr("src");
					tosrc = tosrc.replace(/-[\d]*x[\d]*/g,"");
					var p = toimg.closest("li");

					if(!p.hasClass("clone")){
						index++;
					}

					if(!p.hasClass("clone") && src == tosrc){
						p.siblings().removeClass("flex-active-slide");

						p.addClass("flex-active-slide");
						var width = p.width();

						p.parent().css("-webkit-transition-duration","0.6s");
						p.parent().css("transition-duration","0.6s");
						p.parent().css("-webkit-transform",'translate3d(-'+(index*width)+'px, 0px, 0px)');
						p.parent().css("transform",'translate3d(-'+(index*width)+'px, 0px, 0px)');

						return;
					}
				})
			})

		})
	});
}
function qfbookformSubmit(obj){
	if(!is_edit_model){
		var p = jQuery(obj).closest(".QFBOOKSearchsimpleformdiv");
		var url = p.attr("action");
		var t1 = p.find("[name='QFBOOKSearch-check-in-view']").val();
		var t2 = p.find("[name='QFBOOKSearch-check-out-view']").val();
		if(url.indexOf("?")>-1){
			location.href = url+"&QFBOOKSearch-check-in-view="+t1+"&QFBOOKSearch-check-out-view="+t2;
		}else{
			location.href = url+"?QFBOOKSearch-check-in-view="+t1+"&QFBOOKSearch-check-out-view="+t2;
		}

	}
}



//有侧栏的时候再加载这个函数
function parallax_scroll_fun(){
	if(jQuery("#parallax-nav").length>0){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-scroll.js",function() {
			parallax_scroll_fun_init();
		})
	}
}
function checkAdvertising(){
	var uuid=dtGlobals.id;var href="http://www.qifeiye.com?tcode=freesite&uuid="+uuid;if(dtGlobals.qfymodel){href="#"}var jAdObj=jQuery(".qfy_advertising");var style="display:block !important;opacity: 1 !important;position:fixed !important;bottom:40px !important;left:0 !important;width:116px !important;height:25px !important;line-height:24px !important;background:#23282D !important;z-index:2147483647 !important;text-align:center;color:#fff !important;font-size:12px;border-top-right-radius:3px;border-bottom-right-radius:3px;";if(!jAdObj.hasClass("band")){var content="BY 起飞页自助建站"}else{var content="起飞页提供免费流量"}if(jAdObj.length==0){var tmphtml='<a class="wf-mobile-hidden qfy_advertising" target=_blank style="'+style+'"  rel="external nofollow" href="'+href+'" >'+content+"</a>";jQuery("#page").append(tmphtml)}var opacity=jAdObj.css("opacity");if(opacity!="1"){jAdObj.attr("style",style)}if(jAdObj.css("position")!="fixed"){jAdObj.attr("style",style)}if(jAdObj.css("bottom")!="40px"){jAdObj.attr("style",style)}if(jAdObj.css("left")!="0px"){jAdObj.attr("style",style)}var bgcolor=jAdObj.css("background-color");if(bgcolor!="#000000"&&bgcolor!="rgb(0, 0, 0)"){jAdObj.attr("style",style)}var color=jAdObj.css("color");if(color!="#ffffff"&&color!="rgb(255, 255, 255)"){jAdObj.attr("style",style)}var marginLeft=jAdObj.css("margin-left");if(marginLeft!="0px"){jAdObj.attr("style",style)}var marginTop=jAdObj.css("margin-top");if(marginTop!="0px"){jAdObj.attr("style",style)}var zindex=jAdObj.css("z-index");if(zindex!="2147483647"){jAdObj.attr("style",style)}var width=jAdObj.css("width");if(width!="116px"){jAdObj.attr("style",style)}var height=jAdObj.css("height");if(height!="20px"){jAdObj.attr("style",style)}var transform=jAdObj.css("transform");if(transform!="none"){jAdObj.attr("style",style)}var visible=jAdObj.css("visibility");if(visible!="visible"){jAdObj.attr("style",style)}var display=jAdObj.css("display");if(display!="block"&&jQuery("body").width()>760){jAdObj.attr("style",style)}if(jAdObj.attr("href")!=href){jAdObj.attr("href",href)}if(jAdObj.html()!=content){jAdObj.html(content)}if(top!=self){try{if(top.window.location.host!=window.location.host){location.href="http://www.qifeiye.com"}}catch(e){location.href="http://www.qifeiye.com"}}jQuery("#footer_band").hide();
}
function clickscode(obj){
	jQuery(obj).attr('src','/api/scode.php'+'?'+Math.random());
}

function nav_pagemore(obj){
	if(jQuery(obj).hasClass("vc")){
		jAlert("编辑情况下，无法点击，请在预览情况下使用！");
		return;
	}
	if(jQuery(obj).find(".loading").length>0){
		return ;
	}
	if(jQuery(obj).hasClass("notmore")){
		return ;
	}
	var type=0;
	if(jQuery(obj).parent().hasClass("bitcommerce-pagination")){
		var p = jQuery(obj).closest(".bitcommerce").parent();
		var id = p.attr("qfyuuid");
		var luClass = "[qfyuuid='"+id+"'] ul.products>div";
		var childClass = "ul.products>div";
	}else if(jQuery(obj).closest(".qfy_images_list").length>0){
		var p = jQuery(obj).closest(".qfy_images_list");
		var id = p.attr("qfyuuid");
		var luClass = "[qfyuuid='"+id+"'] .qfe_images_list";
		var childClass = ".qfe_images_list";
		if(jQuery(luClass).find(".more.mypages").length>0){
			type = 1;
		}
	}else if(jQuery(obj).closest(".qfe_images_lib").length>0){
		var p = jQuery(obj).closest(".qfe_images_lib");
		var id = p.attr("qfyuuid");
		var luClass = "[qfyuuid='"+id+"'] .qfe_images_lib_isotope";
		var childClass = ".qfe_images_lib_isotope";
		if(jQuery(luClass).find(".more.mypages").length>0){
			type = 1;
		}
	}else if(jQuery(obj).closest(".advanced_list").length>0){
		var p = jQuery(obj).closest(".advanced_list");
		var id = p.attr("qfyuuid");
		if(p.find(".vc-carousel-slideline-inner:visible").length>0){
		    var luClass = "[qfyuuid='"+id+"'] .vc-carousel-slideline-inner ";
		    var childClass = ".vc-carousel-slideline-inner";
		}else{
			var luClass = "[qfyuuid='"+id+"'] .qfe_wrapper ";
			var childClass = ".qfe_wrapper";
		}
		type = 0;
		if(p.find(".list-style7").length>0){
			//type = 1;
		}
	}else{
		var p = jQuery(obj).closest(".qfe_teaser_grid");
		var id = p.attr("qfyuuid");
		var luClass = "[qfyuuid='"+id+"'].qfe_teaser_grid.qfe_content_element ul.qfe_thumbnails";
		var childClass = "ul.qfe_thumbnails";
	}

	if(p.find("div.qfy_list_loading").length>0){
		return ;
	}
	var list_id = p.find(".qfe_teaser_grid.qfe_content_element").attr("id");

	p.find(".qfe_teaser_grid.qfe_content_element .teaser_grid_container").addClass("noanimale");
	p.find(luClass+" li").css("transform","none").css("top","auto").css("position","relative");
	var url = jQuery(obj).attr("data-url");
	if(url.indexOf("?")>-1){
		url = url+"&isappend=1";
	}else{
		url = url+"?isappend=1";
	}
	var loadtext = jQuery(obj).attr("data-loadtext");
	var old_html = jQuery(obj).find("a").html();
	jQuery(obj).hide();
	if(typeof global_image_loading!="undefined"){

		jQuery(obj).after('<div class="qfy_list_loading"  style="margin:0 auto;text-align:center;">'+global_image_loading+'</div>');
	}else{
		jQuery(obj).after('<div class="qfy_list_loading"  style="margin:0 auto;text-align:center;"><img src="/FeiEditor/bitSite/images/spinner.gif"><span style="color:#808080;font-size:12px;position: relative; top: -3px;">&nbsp;'+loadtext+'</span></div>');

	}

	jQuery.get(url,function(data){
		if(list_id){
			var nowlistobj =jQuery(data).find("#"+list_id+" ul.qfe_thumbnails");
		}else{
			var nowlistobj =jQuery(data).find(luClass);
		}
		var pagemore = nowlistobj.closest(".qfy-element").find(".more.mypages");

		var style = nowlistobj.find(">li").attr("style");
		p.find(childClass).append(nowlistobj.html());
		if(p.hasClass("noanimale")  || p.find(".noanimale").length>0) {
			p.find(childClass).height("auto");
			p.find(childClass+">li:not(.mobile_list_inner)").attr("style",style).css("transform","none").css("top","auto").css("position","relative");
		}
		jQuery(obj).show();
		//jQuery("html").animate({ scrollTop:  jQuery(obj).offset().top - jQuery(window).height()/2 }, "fast");

		var curr_postion = p.find("div.qfy_list_loading").offset().top+100;
		var curr_height = p.height();
		p.find("div.qfy_list_loading").remove();
		if(type=="1"){
			jQuery(obj).remove();
		}

		if(pagemore.length>0){
			jQuery(obj).attr("data-url",pagemore.attr("data-url"));
			jQuery(obj).attr("style",pagemore.attr("style"));
		}else{
			jQuery(obj).remove();
			p.find(".has_no_more").show();
		}

		if(p.find(".categories_filter").length>0){
			p.find(".categories_filter a[data-filter='*']").click();
		}

		if(p.attr("data-open")=="1")
			changelistlinkfun(p);

		vc_js_init();
		tranlanguage(p);

		list_more_waypoint();

		if(!p.hasClass("noanimale") && p.find(".isotope-item").length>0 && p.find(".noanimale").length==0) {
			p.find(childClass).isotope( 'reloadItems' ).isotope();
		}

		if(p.find(".qfe_gallery_slides.qfe_flexslider").length>0){
			vc_plugin_flexslider();
		}
	})
}


function nav_pagecate_confirm(obj){
	if(jQuery(obj).find(".loading").length>0){
		return ;
	}

	var li = jQuery(obj).closest("li");
	var li_id = li.attr("data-id");
	var c = jQuery(obj).closest(".qfy-listcatecontrols");
	var type = c.attr("type");
	var id = c.attr("to_qfyuuid");
	if(!id ||!type){
		jAlert("没有找到对应的列表");
		return ;
	}

	if(jQuery(obj).closest(".dl-menuwrapper.dropCenterStyle_containter").length>0 && !li.hasClass("has-children") ){
		jQuery(obj).closest(".dl-menuwrapper.dropCenterStyle_containter").find("a.dropCenterStyle").click();
	}

	c.find(".current-cat").removeClass("current-cat current-menu-item");
	li.addClass("current-cat current-menu-item");
	if(c.attr("data-child")=="1"){
		c.find(".list-content .children").hide();
		li.parents("li,ul").show();
		if(li.hasClass("cat-parent") && li.closest(".list-content").length>0 ) li.find(">.children").show();
	}
	if(c.find(".item_a").length>0){
		c.find(".item_a").removeClass("active");
		li.find(".item_a").addClass("active");
	}
	var p = jQuery("[qfyuuid='"+id+"'].qfe_teaser_grid.qfe_content_element").parent();
	var model_id = p.attr("data-model-id");
	if(model_id && parent){
		parent.ajaxBeforeLoading(0,p);
		var model =  parent.vc.shortcodes.get(model_id);
		var params = model.get('params');
		if(type)
			params.post_type = type;
		if(type=="products"){
			var pro_old = params.pro_categories;
			params.pro_categories = li_id;
		}else if(type=="product"){
			var product_old = params.product_categories;
			params.product_categories = li_id;
		}else{
			var post_old = params.post_categories;
			params.post_categories = li_id;
		}
		if(params.parse_url)
			var parse_url_old =  params.parse_url;
		if(params.parse_search)
			var parse_search_old =  params.parse_search;
		params.parse_url ="0";
		params.parse_search ="0";

		model.save({params: params});
        parent.vc.ShortcodesBuilder.update(model);
		if(type=="products"){
			params.pro_categories = pro_old;
		}else if(type=="product"){
			params.product_categories = product_old;
		}else{
			params.post_categories = post_old;
		}
		if(parse_url_old)
			params.parse_url = parse_url_old;
		if(parse_search_old)
			params.parse_search = parse_search_old;
		model.save({params: params});
	}

}

function nav_customsearch(obj,customurl){
	if(top.jQuery("#site-html #site-body").length>0){
		top.jAlert("请在预览下查看");
		return;
	}
	if(jQuery(".qfy_custom_search").length>0){
		if(typeof nav_customsearch_click!="function"){
			jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-customsearch.js",function() {
				nav_customsearch_click(obj,customurl);
			})
		}else{
			nav_customsearch_click(obj,customurl);
		}
	}
}
function tranlanguage(htm){
	if(jQuery("body.qfy_slw_tzh").length==1){
		StranBody(htm[0]);

	}else if(jQuery("body.qfy_slw_szh").length==1){
		StranBody(htm[0],0);
	}
}
function nav_pagecate(obj,flag){
	if(jQuery(obj).find(".loading").length>0){
		return ;
	}
	var type=0;
	var li = jQuery(obj).closest("li");
	var c = jQuery(obj).closest(".qfy-listcatecontrols");
	var id = c.attr("to_qfyuuid");
	var p = jQuery("[qfyuuid='"+id+"']");
	if(p.length==0 && jQuery(obj).attr("data-bindurl")){
		location.href = jQuery(obj).attr("data-bindurl");
		return;
	}else if(flag=="direct"){
		location.href = jQuery(obj).attr("data-url");
		return;
	}

	var luClass = "[qfyuuid='"+id+"'].qfe_teaser_grid.qfe_content_element ul.qfe_thumbnails";
	var childClass = "ul.qfe_thumbnails";
	if(p.find("div.qfy_list_loading").length>0){
		return ;
	}
	if(jQuery(obj).closest(".dl-menuwrapper.dropCenterStyle_containter").length>0 && !li.hasClass("has-children")){
		jQuery(obj).closest(".dl-menuwrapper.dropCenterStyle_containter").find("a.dropCenterStyle").click();
	}
	p.find(".qfe_teaser_grid.qfe_content_element .teaser_grid_container").addClass("noanimale");
	p.find(luClass+" li").css("transform","none").css("top","auto").css("position","relative");
	var url = jQuery(obj).attr("data-url");


	c.find(".current-cat").removeClass("current-cat current-menu-item");
	li.addClass("current-cat current-menu-item");
	if(c.attr("data-child")=="1"){
		c.find(".list-content .children").hide();
		li.parents("li,ul").show();
		if(li.hasClass("cat-parent") && li.closest(".list-content").length>0) li.find(">.children").show();
	}
	if(c.find(".item_a").length>0){
		c.find(".item_a").removeClass("active");
		li.find(".item_a").addClass("active");
	}
	var image_src = "//f.goodq.top/qfy-content/plugins/qfy_form/admin/images/loading.gif";
	var w = "";
	if(p.attr("data-loading")){
		image_src = p.attr("data-loading");
		w = p.attr("data-loading-w");
	}

	var text = jQuery.trim(jQuery(obj).text());
	jQuery(obj).closest(".dl-menuwrapper").find(".phone-text").html(text);


	if(typeof global_image_loading!="undefined"){
		p.html('<div class="qfy_list_loading"  style="margin:0 auto;text-align:center;">'+global_image_loading+'</div>');
	}else{
		p.html('<div class="qfy_list_loading"  style="margin:50px auto;text-align:center;"><img style="width:'+w+'px" src="'+image_src+'"></div>');
	}
	jQuery.get(url,function(data){
		var nowlistobj =jQuery(data).find("[qfyuuid='"+id+"']");
		if(nowlistobj.length>0){
			p.replaceWith(nowlistobj);
			window.vc_js_init2();
			window.vc_js_init();
			 if(p.find(".noResult").length==0){
				 jQuery('[data-ride="vc-carousel"]').each(function(){
					qfy_carousel_fun(jQuery(this))
				 })
			 }
			 tranlanguage(p);
		}
		if(nowlistobj.attr("data-open")=="1")
			changelistlinkfun(nowlistobj);

		list_more_waypoint();

		if(typeof  nav_pagecate_callback=="function"){
			nav_pagecate_callback();
		}

	})
}

function preventDefaultFn(event) {
	event.preventDefault();
}

function qfy_notice_event(){
	if(jQuery(".qfy-element.qfy_notice .notice_warp").length > 0 || jQuery("a[href^='qfy_notice']").length > 0){
		if (typeof window['_qfy_notice_event'] !== 'function'){
			jQuery.onDemandScript("/FeiEditor/bitSite/js/notices.js").done(function() {
				_qfy_notice_event();
			})
		}else{
			_qfy_notice_event();
		}
	}
}
function changeURLArg(url,arg,arg_val){
	var pattern=arg+'=([^&]*)';
	var replaceText=arg+'='+arg_val;
	if(url.match(pattern)){
		var tmp='/('+ arg+'=)([^&]*)/gi';
		tmp=url.replace(eval(tmp),replaceText);
		return tmp;
	}else{
		if(url.match('[\?]')){
			return url+'&'+replaceText;
		}else{
			return url+'?'+replaceText;
		}
	}
	return url+'\n'+arg+'\n'+arg_val;
}
function gototab(obj){
	var p = jQuery(obj).closest(".qfy-tabcontent");
	p.find(".tabcontent-header-menu li.item button").removeClass("active");
	jQuery(obj).find("button").addClass("active");
	var index = p.find(".tabcontent-header-menu li.item").index(jQuery(obj));
	if(p.find(".royalSlider_gallery_new").attr("transitiontype")=="none"){
		if(p.find(".royalSlider_gallery_new>.vc-element").length>0){
			p.find(".royalSlider_gallery_new>.vc-element").removeClass("edittabshow").addClass("edittabhide");
			p.find(".royalSlider_gallery_new>.vc-element:eq("+index+")").removeClass("edittabhide").addClass("edittabshow");
		}else{
			p.find(".royalSlider_gallery_new>section").hide();
			p.find(".royalSlider_gallery_new>section:eq("+index+")").show().css("height","100%");
		}
	}else{
		p.find(".rsBullets .rsNavItem:eq("+index+")").click();
	}
}
function backlistbtn(obj){
	var $this = jQuery(obj).closest(".qfe_teaser_grid.qfe_content_element");
	var h = $this.find(".list_hidden_btn");
	h.siblings().show();
	if(h.siblings(".mypages").length>0){
		var mstyle =h.siblings(".mypages").attr("style");
		if(mstyle) mstyle = mstyle.replace("display: block;","");
		h.siblings(".mypages").attr("style",mstyle);
	}
	h.hide();
	vc_teaserGrid();
	if(curr_scrollbar) jQuery(window).scrollTop(curr_scrollbar);
}
var curr_scrollbar = 0;
function changelistlinkfun($this,$flag){
	$this.find("a.link_title:not(.a_file),a.link_image:not(.a_file),a.vc_read_more:not(.a_file),a.item_link,a.item_a_link,.prenext_inner a,>a").click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			curr_scrollbar =  jQuery(window).scrollTop();
			var link = jQuery(this).attr("href");
			if($flag=="again"){
				$this = jQuery(this).closest(".list_hiddencontent").closest(".qfy-element");
				if(link=="#" ||  !link) return false;
			}
			var h = $this.find(".list_hidden_btn");
			var slider = h.attr("data-slider");
			h.find(".backbtn").hide();
			h.siblings().hide();
			h.show();
			var image_src = "//f.goodq.top/qfy-content/plugins/qfy_form/admin/images/loading.gif";
			var w = "";
			if(h.closest(".qfy-element").attr("data-loading")){
				image_src = h.closest(".qfy-element").attr("data-loading");
				w = h.closest(".qfy-element").attr("data-loading-w");
			}

			h.find(".list_hiddencontent").html('<div class="qfy_list_loading"  style="margin:0 auto;padding:100px 0;text-align:center;"><img style="width:'+w+'px" src="'+image_src+'"></div>');
			var pt = h.closest(".qfy-element").offset().top;
			if(curr_scrollbar > pt){
				jQuery("html").animate({ scrollTop: pt }, "fast");
			}

			jQuery.get(link,function(data){
				var htm =jQuery(data).find(".content-wrapper").html();
				if(!htm) htm ="";
				if(slider=="1"){
					var htm_prev = "";
					var htm_next = "";
					if(jQuery(data).find(".bitMainTopSider").length>0){
						htm_prev = "<div class='bmts' style='position:relative;width:100%'>"+jQuery(data).find(".bitMainTopSider").html()+"</div>";
					}
					if(jQuery(data).find(".bitMainBottomSider").length>0){
						htm_next = "<div class='bmbs'  style='position:relative;width:100%'>"+jQuery(data).find(".bitMainBottomSider").html()+"</div>";
					}
					htm = htm_prev+htm+htm_next;
				}
				h.find(".list_hiddencontent").html(htm);
				h.find(".backbtn").show();
				 window.vc_js_init2();
				 window.vc_js_init();
				 qfy_notice_event();
				 tranlanguage(h);
				 //。。。。。
				 changelistlinkfun(jQuery(".list_hiddencontent .teaser_grid_container,.list_hiddencontent .advanced_list,.list_hiddencontent .qfy-prenext,.list_hiddencontent .mypages.pagenav"),"again");
			});

			return false;//阻止链接跳转
	 });
}
function list_more_waypoint(){
	if(jQuery(".qfe_teaser_grid .more.auto").length>0){
		jQuery(".qfe_teaser_grid .more.auto").waypoint('destroy');
		jQuery(".qfe_teaser_grid .more.auto").waypoint({
			handler: function(direction) {
					jQuery(this).click();
			},
			triggerOnce: true,
			offset: "bottom-in-view",
		})
	}
}

var qfy_template_waypoint;
jQuery(document).ready(function($) {

	if(dtGlobals.isWindowsPhone){$("body").addClass("ie-mobile")}if(!$("html").hasClass("old-ie")){dtGlobals.isPhone=false;dtGlobals.isTablet=false;dtGlobals.isDesktop=false;try{var size=top.window.getComputedStyle(top.document.body,":after").getPropertyValue("content");if(size.indexOf("phone")!=-1&&dtGlobals.isMobile){dtGlobals.isPhone=true}else if(size.indexOf("tablet")!=-1&&dtGlobals.isMobile){dtGlobals.isTablet=true}else{dtGlobals.isDesktop=true}}catch(e){}};


	jQuery(".mobile_variation_warp").closest("section").css("z-index","100");
	jQuery("#dl-menu .qfy-sub-div").remove();
	setTimeout(function(){
		jQuery(".qfy-sub-div").each(function(){
			if(jQuery(this).attr("data-full")=="1"){
				var bw = jQuery("body").width();
				var offsetleft = jQuery(this).closest("li").offset().left;
				jQuery(this).css("width","100vw").css("margin-left","-"+(offsetleft)+"px");
			}
		})
	},500);
	jQuery("#main-nav .hassubdiv").mouseenter(function(){
		jQuery(this).find(".qfy-sub-div").each(function(){
			if(jQuery(this).attr("data-full")=="1"){
				var bw = jQuery("body").width();
				var offsetleft = jQuery(this).closest("li").offset().left;
				jQuery(this).css("width","100vw").css("margin-left","-"+(offsetleft)+"px");
			}
		})
	})

	if(jQuery(".qfy-listcatecontrols[data-child='1'],.qfy-listmenuvertical[data-child='1']").length>0){
		jQuery(".qfy-listcatecontrols[data-child='1'],.qfy-listmenuvertical[data-child='1']").each(function(){
			var cur = jQuery(this).find(".list-content .current-cat");
			jQuery(this).find(".list-content .children").hide();
			cur.parents("li,ul").show();
			if(cur.hasClass("cat-parent") && cur.closest(".list-content").length>0 ) cur.find(">.children").show();
		})

	}
	if(jQuery(".qfy_template_lib .viewmoretemplate").length>0){
		jQuery(".qfy_template_lib .viewmoretemplate").waypoint({
			handler: function(direction) {
				if(jQuery(".qfy_template_lib .viewmoretemplate .viewmoretemplate_inner").length>0){
					jQuery(".qfy_template_lib .viewmoretemplate .viewmoretemplate_inner").click();
				}

			},
			triggerOnce: true,
			offset: "bottom-in-view",
		})
	}

	if(!is_edit_model){
		jQuery(".qfe_teaser_grid.qfe_content_element[data-open='1']").each(function(){
			var $this =  jQuery(this);
			changelistlinkfun($this);
		})
		qfy_notice_event();
		list_more_waypoint();
	}
	if(jQuery("body.free_public").length>0){
		checkAdvertising();
		setTimeout("checkAdvertising()",3000);
		setTimeout("checkAdvertising()",6000);
		setTimeout("checkAdvertising()",10000);
		setTimeout("checkAdvertising()",20000);
		setTimeout("checkAdvertising()",30000);
		setTimeout("checkAdvertising()",100000);
	}

	jQuery(".qfytemplateslist .qfypreloadimg").each(function(){
		var newurl = jQuery(this).attr("data-src");
		var $this = jQuery(this);
		jQuery('<img src="'+newurl+'">').load(function(){
			$this.attr("src",newurl);
		})
	})
	jQuery(".qfy_scroll_box:not(.load)").each(function(){
		jQuery(this).addClass("load");
		var box = jQuery(this).attr("id");
		var delay = jQuery(this).attr("data-delay");
		var speed = jQuery(this).attr("data-speed");
		var h = jQuery(this).attr("data-h");
		slideLine(box,"div",delay,speed,h);
	});

	vc_gallery_relat();
	//特殊处理一些网站
	if(jQuery(".re_second_user_class").length>0 && jQuery.trim(jQuery(".re_second_user_span").text())==""){
		jQuery(".re_second_user_class").hide();
	}

	if(jQuery(".addon-custom-datepicker" ).length>0 ){
		jQuery(".addon-custom-datepicker" ).datepicker({
						dateFormat: "yy-mm-dd",
						numberOfMonths: 1,
		});
	}
	if(jQuery(".addon-custom-datetimepicker" ).length>0 ){
		jQuery(".addon-custom-datetimepicker" ).datetimepicker({
					dateFormat: "yy-mm-dd",
					numberOfMonths: 1,
					showTime: true,
					constrainInput: false
		});
	}
	//模板列表
	if(jQuery(".qfytemplateslist").length>0 ){
		$.onDemandScript("/qfy-content/themes/qfy-01/js/a-template.js",function() {
			template_list_init();
		});
	}
	var current_page_id = jQuery('body').attr('data-pid');
	var current_page_key = jQuery('body').attr('data-pkey');
	if(current_page_id != '' && current_page_id != 'undefined' && current_page_key != '' && current_page_key != 'undefined'){
		var multlocal = getCookie("bit_current_currency");
	    jQuery.ajax({
	        url: '/FeiEditor/traffic/log',
	        type: 'post',
	        async: true,
			dataType: "JSON",
	        data: {
	        	st_pid: current_page_id,
	        	st_pkey: current_page_key,
				st_ip:  (!is_edit_model && dtGlobals.visit_country_enable==1)?1:0,
				st_currency:  (!is_edit_model && dtGlobals.cny_auto_ip==1 && !multlocal)?1:0,
	        },
			success: function(rlt) {
				if(rlt.redirect && rlt.redirect!=""){
					location.href = rlt.redirect;
				}else if( rlt.country && rlt.country.currency ){
					if(!multlocal ) {
						setCookie("bit_current_currency",rlt.country.currency);
						var site_url =window.location.href;
						var basetmp = site_url.split("#")[0].split("?");

						if(basetmp.length>1){
							var tmps = basetmp[1].split("&");
							var news = [];
							for(var i=0;i<tmps.length;i++){
								if( tmps[i].indexOf("bit-currency=")>-1  ){
								}else{
									news.push(tmps[i]);
								}
							}
							if(news){
								site_url = basetmp[0]+"?"+news.join("&");
							}else{
								site_url = basetmp[0]+"?";
							}
							site_url = site_url + '&bit-currency='+rlt.country.currency;
						}else{
							site_url = site_url.split("#")[0] + '?bit-currency='+rlt.country.currency;
						}

						window.location.href = site_url;
					}

				}else if(rlt.flag==0){
					jQuery.onDemandScript("/FeiEditor/bitSite/js/log.js",function() {
						var fingerprint = new Fingerprint({canvas: true}).get();
						fingerprint  = window.btoa(fingerprint);
						fingerprint  = window.btoa(fingerprint);
						jQuery.ajax({
							url: '/FeiEditor/traffic/log_r',
							type: 'post',
							async: true,
							data: {
								fprint:fingerprint
							}
						});
					})
				}
			}
	    });
	}
	setTimeout(function(){
		try{
			if(top!=self && !jQuery("body").hasClass("compose-mode")){
				if(top.jQuery('#pageUrl').length>0 && parent.jQuery("#vc-post-id").val()!=dtGlobals.curr_id){
					if(parent.jQuery("#vc-post-id").val()){
						top.jQuery('#pageUrl').val(dtGlobals.curr_id).change();
						return;
					}else if(jQuery("#vc-post-id").length==0){
						top.jAlert("页面过期，正尝试自动刷新！");
						setTimeout(function(){top.location.reload();},1000);
						return;
					}
				}
			}
		}catch(e){}
	},1000);
	position_follow_function();
	//ready end
})


function qfy_popinfo_fun(htm,timetoclose){
	jQuery(".qfy_popinfo").remove();
	if(htm){
		var msg = '<div class="qfy_popinfo" ><div class="md-content">'+htm+'</div></div>';
		jQuery("body").append(msg);
		setTimeout(function(){ jQuery(".qfy_popinfo").addClass("qfy_show"); },500);
		if(timetoclose){
			setTimeout(function(){ jQuery(".qfy_popinfo").removeClass("qfy_show"); },timetoclose*1000);
		}
	}
}
function weixin_auto_redirect(){
	//第三方补全信息页面，不要跳
	if(jQuery('.qfyuser[data-template="changeinfo"]').length>0){
		return;
	}
	jQuery.post("/admin/admin-ajax.php",{action:"weixin_auto_redirect"},function(data){
		if(data.indexOf("http")==0){
			location.href=data;
		}
	});
}
function openheaderbtn(obj){
	if(jQuery("#page,#phantom").hasClass("menuopen")){
		jQuery("#page,#phantom").removeClass("menuopen");
	}else{
		jQuery("#page,#phantom").addClass("menuopen");
	}
}
function before_quick_search(obj){
	var search =jQuery(obj).find("[name='search']").val();
	if(search==""){
		return false;
	}
}
function quick_search(obj){
	var v = jQuery(obj).val();
	var pageid = jQuery(obj).attr("data-pageid");
	var title = jQuery(obj).attr("data-title")? jQuery(obj).attr("data-title"):"搜索";
	var placeholder = jQuery(obj).attr("data-placeholder")?jQuery(obj).attr("data-placeholder"):"请输入关键词";
	var btn1 = jQuery(obj).attr("data-btn1")?jQuery(obj).attr("data-btn1"):"确认";
	var btn2 = jQuery(obj).attr("data-btn2")?jQuery(obj).attr("data-btn2"):"取消";
	var  posttype =  jQuery(obj).attr("data-posttype");
	var postcate = jQuery(obj).attr("data-postcate");
	var bw = jQuery("body").width();
	var bh = jQuery(window).height();
	var message="<div><form action='/'  onsubmit='return before_quick_search(this)'><input type='hidden'  name='searchtype' value='"+posttype+"' /><input type='hidden'  name='searchcate' value='"+postcate+"' /><input type='hidden' name='page_id' value='"+pageid+"'><div style='box-sizing: border-box;padding: 26px 24px 5px 24px;font-size: 18px;font-weight: 500;line-height: 24px;text-align: left;'>"+title+"</div>";
	if( jQuery(obj).attr("data-es")=="1"){
		message +='<input type="hidden"  name="ep_search" value="1" />';
		message +='<input type="hidden"  name="qfyuuid" value="'+ jQuery(obj).attr("data-es-uuid")+'" />';
		if( jQuery(obj).attr("data-es-relevancy")=="1"){
			message +='<input type="hidden"  name="ep_relevancy" value="1" />';
		}
	}
	message +='<div  style="height: 80px;box-sizing: border-box;padding: 0 24px;overflow-y: auto;font-size: 15px;line-height: 1.5;color: rgba(0,0,0,.7);"><input style="border-width: 1px;border-style: solid;padding: 15px;background: #f2f2f2;width: 100%;text-indent: 6px;box-sizing: border-box;margin-top: 5px;border-radius: 0;outline:0;border-color:#ececec;" placeholder="'+placeholder+'" type="search" name="search"></div>';
	message +='<div class="pop_search_btn_div" style="padding: 0 20px;text-align: right;box-sizing: border-box;"><button type="submit" style="min-width: 64px;display: inline-block;height: 36px;padding: 0 16px;text-align: center;text-decoration: none;vertical-align: middle;border-radius: 2px;background:transparent;border:0;font-size:14px;">'+btn1+'</button><button type="button" onclick="unblockUI()" style="font-size:14px;min-width: 64px;display: inline-block;height: 36px;padding: 0 16px;text-align: center;text-decoration: none;vertical-align: middle;border-radius: 2px;background:transparent;border:0;">'+btn2+'</button></div></form></div>';
	if(bw<768){
		var w = bw - 40;
		jQuery.blockUI({onOverlayClick: top.jQuery.unblockUI,css: {"cursor":"auto","top":"30%","left":"50%","margin-left":"-"+(w/2)+"px",width:w+"px",height:"180px"},message:message});
	}else{
		jQuery.blockUI({onOverlayClick: top.jQuery.unblockUI,css: {"cursor":"auto","top":"30%","left":"50%","margin-left":"-360px",width:"720px",height:"180px"},message:message});
	}
	jQuery('body').css('cursor', 'auto');
}
function unblockUI(){
	jQuery.unblockUI();
}
function beforeOnclick(e,msg){
	if(confirm(msg)){
	}else{
		 e.preventDefault();
		 e.stopPropagation();
		 return false;
	}
}
function login_button_click(id,link){
	if(self!=top && typeof parent.jAlert =="function"){
		jAlert("在编辑模式下，不允许使用该功能，请到预览模式下使用。");
		return false;
	}
	var back = location.href;
	try{if(location.href.indexOf('qfy-login.php')>0) back = document.loginform.redirect_to.value;}catch(e){back = '/';}
	location.href=(link?link:'/')+'?connect='+id+'&action=login&qfy_nocache=true&back='+escape(back);
}
function play_qfy_video(obj){
	//click
	if(typeof play_qfy_video_init !="function"){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-popvideo.js",function() {
			play_qfy_video_init(obj);
		});
	}else{
		play_qfy_video_init(obj);
	}
}
function play_local_video(obj){
	//click
	if(typeof play_local_video_init !="function"){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-popvideo.js",function() {
			play_local_video_init(obj);
		});
	}else{
		play_local_video_init(obj);
	}
}

function init_usermange_detail(){
	if(jQuery("#usermanage_container").length <= 0) return;
	if (typeof window['_init_usermange_detail'] !== 'function'){
		jQuery.onDemandScript("/FeiEditor/bitSite/js/users.js",function() {
			_init_usermange_detail();
		})
	}else{
		_init_usermange_detail();
	}
}

function qfy_secode_check(obj){
	if(typeof qfy_scode_check_init !="function"){
		jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-scode.js",function() {
			qfy_scode_check_init(obj);
		});
	}else{
		qfy_scode_check_init(obj);
	}
}

if(typeof(position_follow_function)!='function'){
	function position_follow_function(){
		//手机，编辑，自由区块不适用。添加类position-follow
		if(is_edit_model){
			return;
		}
		if( jQuery(".position-follow").length>0){
			jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-follow.js",function() {
				position_follow_init();
			});
		}
	}
}

var pop_scrollTop = 0;
function pop_stopScroll() {
	if( jQuery(window).width()>760){
		return;
	}
	pop_scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	// 使body脱离文档流
	jQuery("body").addClass('dialog-open');
	jQuery("body").css('top',-pop_scrollTop + 'px');
}
function pop_recoverScroll() {
	if( jQuery(window).width()>760){
		return;
	}
	jQuery("body").removeClass('dialog-open');
	document.body.scrollTop = document.documentElement.scrollTop = pop_scrollTop;
}
function open_menu_pop_content(){
	if( jQuery("body").hasClass("pop-content") ){
		jQuery("body").removeClass("pop-content");
	}else{
		jQuery("body").addClass("pop-content");
	}
}

function auto_tab_menu($this) {

		if(!$this.hasClass("active")){
			$this.addClass("active");
		}else{
			return;
		}
		if( !$this.attr("data-param")){
			return;
		}


		var data = JSON.parse($this.attr("data-param"));
		if(!data.scope){
			data.scope = "#"+$this.closest("section").attr("id");
		}

		if(!data.level){
			return;
		}
		if($(data.scope).length==0){
			return;
		}



		var isTakeOverByClick = false;
		var idList=[];
		var a = $(data.scope).find(data.level.join(","));

		$.each(a,function(index,value){

			idList.push(index);
			var anchor = document.createElement('a');
			anchor.setAttribute('id', data.name + index);
			$(data.location).append("<div class='w-toc "+value.localName+"' id='cl"+index+"'>"+value.innerText+"</div>");
			value.parentNode.insertBefore(anchor, value);
			$(data.location+" #cl"+index).click(function(){
				isTakeOverByClick = true;
				window.location.href="#"+data.name+index;
				$(data.location+' .w-toc style').remove();
				$(this).append("<style>"+data.location+" #cl"+index+":before{background-color: "+data.activeBackground+"}</style>");
				$(data.location+' .w-toc').css("color",""+data.color+"");
				$(this).css("color",""+data.activeColor+"");
			})
		})
		if(data.title==null || data.title==""){
			$this.find(".table-content .title").text("");
		}else{
			$this.find(".table-content .title").text(data.title);
		}
		if(data.hidetitle==1){
			$this.find(".table-content .title").hide();
		}
		$(data.location+" .w-toc").css({"padding":"5px 2px","color":""+data.color+""});
		$(data.location).append("<style>"+data.location+" .w-toc:before{content:' ';display:inline-block;height:100%;left:0;margin-top:-1px;position:absolute;width:3px;}</style>");


		for(let i=0;i<data.level.length;i++){
			$(data.scope+" ."+data.level[i]).css({"padding-left":(10*i+10)+"px","font-family":data.font,"font-size":data.size[i]+"px","margin-bottom":data.margin[i]+"px"});
		}

	    $this.find(".table-content").css({"max-width":""+data.maxWidth+"","background-color":""+data.background+"","box-shadow":"0 0 10px #ccc","overflow":"hidden"});
		$this.find(".table-content .title").attr("style",data.fontstyle);
		// $(data.location+" .table-title").click(function(){
		// 	$(data.location).toggle();
		// }),
	   var width = $this.find(".table-content").width();

	   var height = $this.find(".table-content").height();
	   var container_h = $(data.scope).offset().top*1+ $(data.scope).height();
		$(window).scroll(function () {
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			!isTakeOverByClick && $.each(idList, function (index, id) {
				var head = $(data.scope+' #'+data.name + id);
				var item = $(data.location+' #cl' + id);
				var offsetTopHead = head.offset().top;
				if (scrollTop >= offsetTopHead) {
					$(data.location+' .w-toc style').remove();
					item.append("<style>"+data.location+" #cl"+index+":before{background-color: "+data.activeBackground+"}</style>");
					$(data.location+' .w-toc').css("color",""+data.color+"");
					item.css("color",""+data.activeColor+"");
				}
			});
			isTakeOverByClick = false;




			var offsetTopHeads = $this.offset().top;
			if (scrollTop >= offsetTopHeads  ) {
				$this.find(".table-content").css({"position":"fixed","top": "0","width":width+"px"});
				$this.closest("section").addClass("sectiontopIndex");
				if(scrollTop>container_h-height){
					$this.find(".table-content").css({"position":"fixed","top": -(scrollTop-(container_h-height))+"px","width":width+"px"});
				}
			}else{
				$this.find(".table-content").css("position","initial");
				$this.closest("section").removeClass("sectiontopIndex");
			}
		});
	}


;

/* jquery-lazy: (http://www.artjiahua.com/qfy-includes/js/jquery.lazy.min.js) */
/*! jQuery & Zepto Lazy v1.7.6 - http://jquery.eisbehr.de/lazy - MIT&GPL-2.0 license - Copyright 2012-2017 Daniel 'Eisbehr' Kern */
!function(t,e){"use strict";function r(r,a,i,u,l){function f(){L=t.devicePixelRatio>1,i=c(i),a.delay>=0&&setTimeout(function(){s(!0)},a.delay),(a.delay<0||a.combined)&&(u.e=v(a.throttle,function(t){"resize"===t.type&&(w=B=-1),s(t.all)}),u.a=function(t){t=c(t),i.push.apply(i,t)},u.g=function(){return i=n(i).filter(function(){return!n(this).data(a.loadedName)})},u.f=function(t){for(var e=0;e<t.length;e++){var r=i.filter(function(){return this===t[e]});r.length&&s(!1,r)}},s(),n(a.appendScroll).on("scroll."+l+" resize."+l,u.e))}function c(t){var i=a.defaultImage,o=a.placeholder,u=a.imageBase,l=a.srcsetAttribute,f=a.loaderAttribute,c=a._f||{};t=n(t).filter(function(){var t=n(this),r=m(this);return!t.data(a.handledName)&&(t.attr(a.attribute)||t.attr(l)||t.attr(f)||c[r]!==e)}).data("plugin_"+a.name,r);for(var s=0,d=t.length;s<d;s++){var A=n(t[s]),g=m(t[s]),h=A.attr(a.imageBaseAttribute)||u;g===N&&h&&A.attr(l)&&A.attr(l,b(A.attr(l),h)),c[g]===e||A.attr(f)||A.attr(f,c[g]),g===N&&i&&!A.attr(E)?A.attr(E,i):g===N||!o||A.css(O)&&"none"!==A.css(O)||A.css(O,"url('"+o+"')")}return t}function s(t,e){if(!i.length)return void(a.autoDestroy&&r.destroy());for(var o=e||i,u=!1,l=a.imageBase||"",f=a.srcsetAttribute,c=a.handledName,s=0;s<o.length;s++)if(t||e||A(o[s])){var g=n(o[s]),h=m(o[s]),b=g.attr(a.attribute),v=g.attr(a.imageBaseAttribute)||l,p=g.attr(a.loaderAttribute);g.data(c)||a.visibleOnly&&!g.is(":visible")||!((b||g.attr(f))&&(h===N&&(v+b!==g.attr(E)||g.attr(f)!==g.attr(F))||h!==N&&v+b!==g.css(O))||p)||(u=!0,g.data(c,!0),d(g,h,v,p))}u&&(i=n(i).filter(function(){return!n(this).data(c)}))}function d(t,e,r,i){++z;var o=function(){y("onError",t),p(),o=n.noop};y("beforeLoad",t);var u=a.attribute,l=a.srcsetAttribute,f=a.sizesAttribute,c=a.retinaAttribute,s=a.removeAttribute,d=a.loadedName,A=t.attr(c);if(i){var g=function(){s&&t.removeAttr(a.loaderAttribute),t.data(d,!0),y(T,t),setTimeout(p,1),g=n.noop};t.off(I).one(I,o).one(D,g),y(i,t,function(e){e?(t.off(D),g()):(t.off(I),o())})||t.trigger(I)}else{var h=n(new Image);h.one(I,o).one(D,function(){t.hide(),e===N?t.attr(C,h.attr(C)).attr(F,h.attr(F)).attr(E,h.attr(E)):t.css(O,"url('"+h.attr(E)+"')"),t[a.effect](a.effectTime),s&&(t.removeAttr(u+" "+l+" "+c+" "+a.imageBaseAttribute),f!==C&&t.removeAttr(f)),t.data(d,!0),y(T,t),h.remove(),p()});var m=(L&&A?A:t.attr(u))||"";h.attr(C,t.attr(f)).attr(F,t.attr(l)).attr(E,m?r+m:null),h.complete&&h.trigger(D)}}function A(t){var e=t.getBoundingClientRect(),r=a.scrollDirection,n=a.threshold,i=h()+n>e.top&&-n<e.bottom,o=g()+n>e.left&&-n<e.right;return"vertical"===r?i:"horizontal"===r?o:i&&o}function g(){return w>=0?w:w=n(t).width()}function h(){return B>=0?B:B=n(t).height()}function m(t){return t.tagName.toLowerCase()}function b(t,e){if(e){var r=t.split(",");t="";for(var a=0,n=r.length;a<n;a++)t+=e+r[a].trim()+(a!==n-1?",":"")}return t}function v(t,e){var n,i=0;return function(o,u){function l(){i=+new Date,e.call(r,o)}var f=+new Date-i;n&&clearTimeout(n),f>t||!a.enableThrottle||u?l():n=setTimeout(l,t-f)}}function p(){--z,i.length||z||y("onFinishedAll")}function y(t,e,n){return!!(t=a[t])&&(t.apply(r,[].slice.call(arguments,1)),!0)}var z=0,w=-1,B=-1,L=!1,T="afterLoad",D="load",I="error",N="img",E="src",F="srcset",C="sizes",O="background-image";"event"===a.bind||o?f():n(t).on(D+"."+l,f)}function a(a,o){var u=this,l=n.extend({},u.config,o),f={},c=l.name+"-"+ ++i;return u.config=function(t,r){return r===e?l[t]:(l[t]=r,u)},u.addItems=function(t){return f.a&&f.a("string"===n.type(t)?n(t):t),u},u.getItems=function(){return f.g?f.g():{}},u.update=function(t){return f.e&&f.e({},!t),u},u.force=function(t){return f.f&&f.f("string"===n.type(t)?n(t):t),u},u.loadAll=function(){return f.e&&f.e({all:!0},!0),u},u.destroy=function(){return n(l.appendScroll).off("."+c,f.e),n(t).off("."+c),f={},e},r(u,l,a,f,c),l.chainable?a:u}var n=t.jQuery||t.Zepto,i=0,o=!1;n.fn.Lazy=n.fn.lazy=function(t){return new a(this,t)},n.Lazy=n.lazy=function(t,r,i){if(n.isFunction(r)&&(i=r,r=[]),n.isFunction(i)){t=n.isArray(t)?t:[t],r=n.isArray(r)?r:[r];for(var o=a.prototype.config,u=o._f||(o._f={}),l=0,f=t.length;l<f;l++)(o[t[l]]===e||n.isFunction(o[t[l]]))&&(o[t[l]]=i);for(var c=0,s=r.length;c<s;c++)u[r[c]]=t[0]}},a.prototype.config={name:"lazy",chainable:!0,autoDestroy:!0,bind:"load",threshold:500,visibleOnly:!1,appendScroll:t,scrollDirection:"both",imageBase:null,defaultImage:"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",placeholder:null,delay:-1,combined:!1,attribute:"data-src",srcsetAttribute:"data-srcset",sizesAttribute:"data-sizes",retinaAttribute:"data-retina",loaderAttribute:"data-loader",imageBaseAttribute:"data-imagebase",removeAttribute:!0,handledName:"handled",loadedName:"loaded",effect:"show",effectTime:0,enableThrottle:!0,throttle:250,beforeLoad:e,afterLoad:e,onError:e,onFinishedAll:e},n(t).on("load",function(){o=!0})}(window);;

/* themepunchtools: (http://www.artjiahua.com/qfy-content/plugins/revslider/rs-plugin/js/jquery.themepunch.plugins.min.js?rev=4.1.4) */


/********************************************
	-	THEMEPUNCH TOOLS Ver. 1.0     -
	 Last Update of Tools 09.10.2013
*********************************************/

/*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(t,e){"use strict";function n(){if(!i.READY){i.event.determineEventTypes();for(var t in i.gestures)i.gestures.hasOwnProperty(t)&&i.detection.register(i.gestures[t]);i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0}}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=document,i.plugins={},i.READY=!1,i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.addEventListener(n[i],e,!1);return this},off:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.removeEventListener(n[i],e,!1);return this},trigger:function(t,e){var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){for(var i=e.split(" "),r=0;i.length>r;r++)t.addEventListener(i[r],n,!1)},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){(u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which)&&(o=!0),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),h||null===r?r=c:c=r,n.call(i.detection,a.collectEventData(t,e,c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:[{identifier:1,pageX:t.pageX,pageY:t.pageY,target:t.target}]},collectEventData:function(t,e,n){var r=this.getTouchList(n,e),o=i.POINTER_TOUCH;return(n.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,n))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(r),timeStamp:(new Date).getTime(),target:n.target,touches:r,eventType:e,pointerType:o,srcEvent:n,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return Object.keys(t.pointers).sort().forEach(function(n){e.push(t.pointers[n])}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n={};return n[i.POINTER_MOUSE]=e.pointerType==e.MSPOINTER_TYPE_MOUSE||e.pointerType==i.POINTER_MOUSE,n[i.POINTER_TOUCH]=e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==i.POINTER_TOUCH,n[i.POINTER_PEN]=e.pointerType==e.MSPOINTER_TYPE_PEN||e.pointerType==i.POINTER_PEN,n[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){for(var e=[],n=[],i=0,r=t.length;r>i;i++)e.push(t[i].pageX),n.push(t[i].pageY);return{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){var n,i=["webkit","khtml","moz","ms","o",""];if(e&&t.style){for(var r=0;i.length>r;r++)for(var o in e)e.hasOwnProperty(o)&&(n=o,i[r]&&(n=i[r]+n.substring(0,1).toUpperCase()+n.substring(1)),t.style[n]=e[o]);"none"==e.userSelect&&(t.onselectstart=function(){return!1})}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);for(var e=this.current.inst.options,n=0,r=this.gestures.length;r>n;n++){var o=this.gestures[n];if(!this.stopped&&e[o.name]!==!1&&o.handler.call(o,t,this.current.inst)===!1){this.stopDetect();break}}return this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;if(e&&(t.touches.length!=e.touches.length||t.touches===e.touches)){e.touches=[];for(var n=0,r=t.touches.length;r>n;n++)e.touches.push(i.utils.extend({},t.touches[n]))}var o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),direction:i.utils.getDirection(e.center,t.center),scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures=i.gestures||{},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&i.detection.current.name!=this.name)return;i.detection.current.name=this.name,(i.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?0>t.deltaY?i.DIRECTION_UP:i.DIRECTION_DOWN:0>t.deltaX?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&i.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(2>t.touches.length))switch(n.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var r=Math.abs(1-t.scale),o=Math.abs(t.rotation);if(n.options.transform_min_scale>r&&n.options.transform_min_rotation>o)return;i.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),o>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(1>t.scale?"in":"out"),t));break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){return n.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?(t.stopDetect(),e):(n.options.prevent_default&&t.preventDefault(),t.eventType==i.EVENT_START&&n.trigger(this.name,t),e)}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},"object"==typeof module&&"object"==typeof module.exports?module.exports=i:(t.Hammer=i,"function"==typeof t.define&&t.define.amd&&t.define("hammer",[],function(){return i}))})(this),function(t,e){"use strict";t!==e&&(Hammer.event.bindDom=function(n,i,r){t(n).on(i,function(t){var n=t.originalEvent||t;n.pageX===e&&(n.pageX=t.pageX,n.pageY=t.pageY),n.target||(n.target=t.target),n.which===e&&(n.which=n.button),n.preventDefault||(n.preventDefault=t.preventDefault),n.stopPropagation||(n.stopPropagation=t.stopPropagation),r.call(this,n)})},Hammer.Instance.prototype.on=function(e,n){return t(this.element).on(e,n)},Hammer.Instance.prototype.off=function(e,n){return t(this.element).off(e,n)},Hammer.Instance.prototype.trigger=function(e,n){var i=t(this.element);return i.has(n.target).length&&(i=t(n.target)),i.trigger({type:e,gesture:n})},t.fn.hammer=function(e){return this.each(function(){var n=t(this),i=n.data("hammer");i?i&&e&&Hammer.utils.extend(i.options,e):n.data("hammer",new Hammer(this,e||{}))})})}(window.jQuery||window.Zepto);




/*!
 * VERSION: 1.11.2
 * DATE: 2013-11-20
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function(t){"use strict";var e=t.GreenSockGlobals||t;if(!e.TweenLite){var i,s,r,n,a,o=function(t){var i,s=t.split("."),r=e;for(i=0;s.length>i;i++)r[s[i]]=r=r[s[i]]||{};return r},l=o("com.greensock"),h=1e-10,_=[].slice,u=function(){},m=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e}}(),f={},p=function(i,s,r,n){this.sc=f[i]?f[i].sc:[],f[i]=this,this.gsClass=null,this.func=r;var a=[];this.check=function(l){for(var h,_,u,m,c=s.length,d=c;--c>-1;)(h=f[s[c]]||new p(s[c],[])).gsClass?(a[c]=h.gsClass,d--):l&&h.sc.push(this);if(0===d&&r)for(_=("com.greensock."+i).split("."),u=_.pop(),m=o(_.join("."))[u]=this.gsClass=r.apply(r,a),n&&(e[u]=m,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+i.split(".").join("/"),[],function(){return m}):"undefined"!=typeof module&&module.exports&&(module.exports=m)),c=0;this.sc.length>c;c++)this.sc[c].check()},this.check(!0)},c=t._gsDefine=function(t,e,i,s){return new p(t,e,i,s)},d=l._class=function(t,e,i){return e=e||function(){},c(t,[],function(){return e},i),e};c.globals=e;var v=[0,0,1,1],g=[],T=d("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?v.concat(e):v},!0),w=T.map={},P=T.register=function(t,e,i,s){for(var r,n,a,o,h=e.split(","),_=h.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=h[_],r=s?d("easing."+n,null,!0):l.easing[n]||{},a=u.length;--a>-1;)o=u[a],w[n+"."+o]=w[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(r=T.prototype,r._calcEnd=!1,r.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},i=["Linear","Quad","Cubic","Quart","Quint,Strong"],s=i.length;--s>-1;)r=i[s]+",Power"+s,P(new T(null,null,1,s),r,"easeOut",!0),P(new T(null,null,2,s),r,"easeIn"+(0===s?",easeNone":"")),P(new T(null,null,3,s),r,"easeInOut");w.linear=l.easing.Linear.easeIn,w.swing=l.easing.Quad.easeInOut;var y=d("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});r=y.prototype,r.addEventListener=function(t,e,i,s,r){r=r||0;var o,l,h=this._listeners[t],_=0;for(null==h&&(this._listeners[t]=h=[]),l=h.length;--l>-1;)o=h[l],o.c===e&&o.s===i?h.splice(l,1):0===_&&r>o.pr&&(_=l+1);h.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==n||a||n.wake()},r.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},r.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i)};var b=t.requestAnimationFrame,k=t.cancelAnimationFrame,A=Date.now||function(){return(new Date).getTime()},S=A();for(i=["ms","moz","webkit","o"],s=i.length;--s>-1&&!b;)b=t[i[s]+"RequestAnimationFrame"],k=t[i[s]+"CancelAnimationFrame"]||t[i[s]+"CancelRequestAnimationFrame"];d("Ticker",function(t,e){var i,s,r,o,l,h=this,_=A(),m=e!==!1&&b,f=function(t){S=A(),h.time=(S-_)/1e3;var e,n=h.time-l;(!i||n>0||t===!0)&&(h.frame++,l+=n+(n>=o?.004:o-n),e=!0),t!==!0&&(r=s(f)),e&&h.dispatchEvent("tick")};y.call(h),h.time=h.frame=0,h.tick=function(){f(!0)},h.sleep=function(){null!=r&&(m&&k?k(r):clearTimeout(r),s=u,r=null,h===n&&(a=!1))},h.wake=function(){null!==r&&h.sleep(),s=0===i?u:m&&b?b:function(t){return setTimeout(t,0|1e3*(l-h.time)+1)},h===n&&(a=!0),f(2)},h.fps=function(t){return arguments.length?(i=t,o=1/(i||60),l=this.time+o,h.wake(),void 0):i},h.useRAF=function(t){return arguments.length?(h.sleep(),m=t,h.fps(i),void 0):m},h.fps(t),setTimeout(function(){m&&(!r||5>h.frame)&&h.useRAF(!1)},1500)}),r=l.Ticker.prototype=new l.events.EventDispatcher,r.constructor=l.Ticker;var x=d("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,Q){a||n.wake();var i=this.vars.useFrames?G:Q;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});n=x.ticker=new l.Ticker,r=x.prototype,r._dirty=r._gc=r._initted=r._paused=!1,r._totalTime=r._time=0,r._rawPrevTime=-1,r._next=r._last=r._onUpdate=r._timeline=r.timeline=null,r._paused=!1;var C=function(){a&&A()-S>2e3&&n.wake(),setTimeout(C,2e3)};C(),r.play=function(t,e){return arguments.length&&this.seek(t,e),this.reversed(!1).paused(!1)},r.pause=function(t,e){return arguments.length&&this.seek(t,e),this.paused(!0)},r.resume=function(t,e){return arguments.length&&this.seek(t,e),this.paused(!1)},r.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},r.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},r.reverse=function(t,e){return arguments.length&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},r.render=function(){},r.invalidate=function(){return this},r.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},r._enabled=function(t,e){return a||n.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},r._kill=function(){return this._enabled(!1,!1)},r.kill=function(t,e){return this._kill(t,e),this},r._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},r._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},r.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=m(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},r.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},r.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},r.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},r.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},r.totalTime=function(t,e,i){if(a||n.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&this.render(t,e,!1)}return this},r.progress=r.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},r.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},r.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||h,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},r.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._totalTime,!0)),this):this._reversed},r.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){a||t||n.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var R=d("core.SimpleTimeline",function(t){x.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});r=R.prototype=new x,r.constructor=R,r.kill()._gc=!1,r._first=r._last=null,r._sortChildren=!1,r.add=r.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._timeline&&this._uncache(!0),this},r._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t.timeline=null,t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),this._timeline&&this._uncache(!0)),this},r.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},r.rawTime=function(){return a||n.wake(),this._totalTime};var D=d("TweenLite",function(e,i,s){if(x.call(this,i,s),this.render=D.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:D.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),l=this.vars.overwrite;if(this._overwrite=l=null==l?j[D.defaultOverwrite]:"number"==typeof l?l>>0:j[l],(o||e instanceof Array||e.push&&m(e))&&"number"!=typeof e[0])for(this._targets=a=_.call(e,0),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(_.call(n,0))):(this._siblings[r]=B(n,this,!1),1===l&&this._siblings[r].length>1&&q(n,this,null,1,this._siblings[r])):(n=a[r--]=D.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=B(e,this,!1),1===l&&this._siblings.length>1&&q(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&this.render(-this._delay,!1,!0)},!0),E=function(e){return e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},I=function(t,e){var i,s={};for(i in t)F[i]||i in e&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!N[i]||N[i]&&N[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};r=D.prototype=new x,r.constructor=D,r.kill()._gc=!1,r.ratio=0,r._firstPT=r._targets=r._overwrittenProps=r._startAt=null,r._notifyPluginsOfEnabled=!1,D.version="1.11.2",D.defaultEase=r._ease=new T(null,null,1,1),D.defaultOverwrite="auto",D.ticker=n,D.autoSleep=!0,D.selector=t.$||t.jQuery||function(e){return t.$?(D.selector=t.$,t.$(e)):t.document?t.document.getElementById("#"===e.charAt(0)?e.substr(1):e):e};var O=D._internals={isArray:m,isSelector:E},N=D._plugins={},L=D._tweenLookup={},U=0,F=O.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1},j={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},G=x._rootFramesTimeline=new R,Q=x._rootTimeline=new R;Q._startTime=n.time,G._startTime=n.frame,Q._active=G._active=!0,x._updateRoot=function(){if(Q.render((n.time-Q._startTime)*Q._timeScale,!1,!1),G.render((n.frame-G._startTime)*G._timeScale,!1,!1),!(n.frame%120)){var t,e,i;for(i in L){for(e=L[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete L[i]}if(i=Q._first,(!i||i._paused)&&D.autoSleep&&!G._first&&1===n._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||n.sleep()}}},n.addEventListener("tick",x._updateRoot);var B=function(t,e,i){var s,r,n=t._gsTweenID;if(L[n||(t._gsTweenID=n="t"+U++)]||(L[n]={target:t,tweens:[]}),e&&(s=L[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return L[n].tweens},q=function(t,e,i,s,r){var n,a,o,l;if(1===s||s>=4){for(l=r.length,n=0;l>n;n++)if((o=r[n])!==e)o._gc||o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var _,u=e._startTime+h,m=[],f=0,p=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(_=_||$(e,0,p),0===$(o,_,p)&&(m[f++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale+h>u&&((p||!o._initted)&&2e-10>=u-o._startTime||(m[f++]=o)));for(n=f;--n>-1;)o=m[n],2===s&&o._kill(i,t)&&(a=!0),(2!==s||!o._firstPT&&o._initted)&&o._enabled(!1,!1)&&(a=!0);return a},$=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*h>n-e?h:(n+=t.totalDuration()/t._timeScale/r)>e+h?0:n-e-h};r._init=function(){var t,e,i,s,r=this.vars,n=this._overwrittenProps,a=this._duration,o=r.immediateRender,l=r.ease;if(r.startAt){if(this._startAt&&this._startAt.render(-1,!0),r.startAt.overwrite=0,r.startAt.immediateRender=!0,this._startAt=D.to(this.target,0,r.startAt),o)if(this._time>0)this._startAt=null;else if(0!==a)return}else if(r.runBackwards&&0!==a)if(this._startAt)this._startAt.render(-1,!0),this._startAt=null;else{i={};for(s in r)F[s]&&"autoCSS"!==s||(i[s]=r[s]);if(i.overwrite=0,i.data="isFromStart",this._startAt=D.to(this.target,0,i),r.immediateRender){if(0===this._time)return}else this._startAt.render(-1,!0)}if(this._ease=l?l instanceof T?r.easeParams instanceof Array?l.config.apply(l,r.easeParams):l:"function"==typeof l?new T(l,r.easeParams):w[l]||D.defaultEase:D.defaultEase,this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],n?n[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,n);if(e&&D._onPluginEvent("_onInitAllProps",this),n&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),r.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=r.onUpdate,this._initted=!0},r._initProps=function(e,i,s,r){var n,a,o,l,h,_;if(null==e)return!1;this.vars.css||e.style&&e!==t&&e.nodeType&&N.css&&this.vars.autoCSS!==!1&&I(this.vars,e);for(n in this.vars){if(_=this.vars[n],F[n])_&&(_ instanceof Array||_.push&&m(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(N[n]&&(l=new N[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=h={_next:this._firstPT,t:l,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:l._priority},a=l._overwriteProps.length;--a>-1;)i[l._overwriteProps[a]]=this._firstPT;(l._priority||l._onInitAllProps)&&(o=!0),(l._onDisable||l._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=h={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},h.s=h.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),h.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-h.s||0;h&&h._next&&(h._next._prev=h)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&q(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):o},r.render=function(t,e,i){var s,r,n,a,o=this._time,l=this._duration;if(t>=l)this._totalTime=this._time=l,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===l&&(a=this._rawPrevTime,(0===t||0>a||a===h)&&a!==t&&(i=!0,a>h&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t?t:h);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===l&&this._rawPrevTime>h)&&(r="onReverseComplete",s=this._reversed),0>t?(this._active=!1,0===l&&(this._rawPrevTime>=0&&(i=!0),this._rawPrevTime=a=!e||t?t:h)):this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var _=t/l,u=this._easeType,m=this._easePower;(1===u||3===u&&_>=.5)&&(_=1-_),3===u&&(_*=2),1===m?_*=_:2===m?_*=_*_:3===m?_*=_*_*_:4===m&&(_*=_*_*_*_),this.ratio=1===u?1-_:2===u?_:.5>t/l?_/2:1-_/2}else this.ratio=this._ease.getRatio(t/l);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;this._time&&!s?this.ratio=this._ease.getRatio(this._time/l):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===l)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||g))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||i&&0===this._time&&0===o||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||g)),r&&(this._gc||(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||g),0===l&&this._rawPrevTime===h&&a!==h&&(this._rawPrevTime=0)))}},r._kill=function(t,e){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var i,s,r,n,a,o,l,h;if((m(e)||E(e))&&"number"!=typeof e[0])for(i=e.length;--i>-1;)this._kill(t,e[i])&&(o=!0);else{if(this._targets){for(i=this._targets.length;--i>-1;)if(e===this._targets[i]){a=this._propLookup[i]||{},this._overwrittenProps=this._overwrittenProps||[],s=this._overwrittenProps[i]=t?this._overwrittenProps[i]||{}:"all";break}}else{if(e!==this.target)return!1;a=this._propLookup,s=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(a){l=t||a,h=t!==s&&"all"!==s&&t!==a&&("object"!=typeof t||!t._tempKill);for(r in l)(n=a[r])&&(n.pg&&n.t._kill(l)&&(o=!0),n.pg&&0!==n.t._overwriteProps.length||(n._prev?n._prev._next=n._next:n===this._firstPT&&(this._firstPT=n._next),n._next&&(n._next._prev=n._prev),n._next=n._prev=null),delete a[r]),h&&(s[r]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return o},r.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=null,this._overwrittenProps=null,this._onUpdate=null,this._startAt=null,this._initted=this._active=this._notifyPluginsOfEnabled=!1,this._propLookup=this._targets?{}:[],this},r._enabled=function(t,e){if(a||n.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=B(s[i],this,!0);else this._siblings=B(this.target,this,!0)}return x.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?D._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new D(t,e,s)},D.delayedCall=function(t,e,i,s,r){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:r,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:D.selector(t)||t;var i,s,r,n;if((m(t)||E(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(D.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=B(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=D.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var M=d("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=M.prototype},!0);if(r=M.prototype,M.version="1.10.1",M.API=2,r._firstPT=null,r._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},r.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=0|e+(e>0?.5:-.5):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},r._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},r._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},D._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},M.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===M.API&&(N[(new t[e])._propName]=t[e]);return!0},c.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=d("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){M.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new M(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,M.activate([a]),a},i=t._gsQueue){for(s=0;i.length>s;s++)i[s]();for(r in f)f[r].func||t.console.log("GSAP encountered missing dependency: com.greensock."+r)}a=!1}})(window);
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=window.GreenSockGlobals||window,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},c=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},p=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",p("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),p("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),p("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),p=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--p>-1;)i=f?Math.random():1/u*p,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:p%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new c(1,1,null),p=u;--p>-1;)a=l[p],o=new c(a.x,a.y,o);this._prev=new c(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),window._gsDefine&&window._gsQueue.pop()();
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o={},l=a.prototype=new t("css");l.constructor=a,a.version="1.11.2",a.API=2,a.defaultTransformPerspective=0,l="px",a.suffixMap={top:l,right:l,bottom:l,left:l,width:l,height:l,fontSize:l,padding:l,margin:l,perspective:l};var h,u,_,p,f,c,d=/(?:\d|\-\d|\.\d|\-\.\d)+/g,m=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,g=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/[^\d\-\.]/g,y=/(?:\d|\-|\+|=|#|\.)*/g,T=/opacity *= *([^)]*)/,x=/opacity:([^;]*)/,w=/alpha\(opacity *=.+?\)/i,b=/^(rgb|hsl)/,P=/([A-Z])/g,S=/-([a-z])/gi,R=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,k=function(t,e){return e.toUpperCase()},C=/(?:Left|Right|Width)/i,A=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,O=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,D=/,(?=[^\)]*(?:\(|$))/gi,M=Math.PI/180,L=180/Math.PI,N={},X=document,F=X.createElement("div"),I=X.createElement("img"),E=a._internals={_specialProps:o},Y=navigator.userAgent,z=function(){var t,e=Y.indexOf("Android"),i=X.createElement("div");return _=-1!==Y.indexOf("Safari")&&-1===Y.indexOf("Chrome")&&(-1===e||Number(Y.substr(e+8,1))>3),f=_&&6>Number(Y.substr(Y.indexOf("Version/")+8,1)),p=-1!==Y.indexOf("Firefox"),/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(Y),c=parseFloat(RegExp.$1),i.innerHTML="<a style='top:1px;opacity:.55;'>a</a>",t=i.getElementsByTagName("a")[0],t?/^0.55/.test(t.style.opacity):!1}(),U=function(t){return T.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},B=function(t){window.console&&console.log(t)},j="",V="",q=function(t,e){e=e||F;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(V=3===s?"ms":i[s],j="-"+V.toLowerCase()+"-",V+t):null},W=X.defaultView?X.defaultView.getComputedStyle:function(){},Q=a.getStyle=function(t,e,i,s,r){var n;return z||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||W(t,null))?(t=i.getPropertyValue(e.replace(P,"-$1").toLowerCase()),n=t||i.length?t:i[e]):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):U(t)},Z=function(t,e,i,s,r){if("px"===s||!s)return i;if("auto"===s||!i)return 0;var n,a=C.test(e),o=t,l=F.style,h=0>i;return h&&(i=-i),"%"===s&&-1!==e.indexOf("border")?n=i/100*(a?t.clientWidth:t.clientHeight):(l.cssText="border:0 solid red;position:"+Q(t,"position")+";line-height:0;","%"!==s&&o.appendChild?l[a?"borderLeftWidth":"borderTopWidth"]=i+s:(o=t.parentNode||X.body,l[a?"width":"height"]=i+s),o.appendChild(F),n=parseFloat(F[a?"offsetWidth":"offsetHeight"]),o.removeChild(F),0!==n||r||(n=Z(t,e,i,s,!0))),h?-n:n},H=function(t,e,i){if("absolute"!==Q(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=Q(t,"margin"+s,i);return t["offset"+s]-(Z(t,e,parseFloat(r),r.replace(y,""))||0)},$=function(t,e){var i,s,r={};if(e=e||W(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(S,k)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0!==r[i]&&(r[i.replace(S,k)]=e[i]);return z||(r.opacity=U(t)),s=be(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,we&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},G=function(t,e,i,s,r){var n,a,o,l={},h=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(l[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(v,"")?n:0:H(t,a),void 0!==h[a]&&(o=new _e(h,a,h[a],o)));if(s)for(a in s)"className"!==a&&(l[a]=s[a]);return{difs:l,firstMPT:o}},K={width:["Left","Right"],height:["Top","Bottom"]},J=["marginLeft","marginRight","marginTop","marginBottom"],te=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=K[e],n=r.length;for(i=i||W(t,null);--n>-1;)s-=parseFloat(Q(t,"padding"+r[n],i,!0))||0,s-=parseFloat(Q(t,"border"+r[n]+"Width",i,!0))||0;return s},ee=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(v,"")),e.oy=parseFloat(r.replace(v,""))),s+" "+r+(i.length>2?" "+i[2]:"")},ie=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},se=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*Number(t.substr(2))+e:parseFloat(t)},re=function(t,e,i,s){var r,n,a,o,l=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(v,""))*(-1===t.indexOf("rad")?1:L)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),l>o&&o>-l&&(o=0),o},ne={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ae=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},oe=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ne[t]?ne[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(d),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=ae(r+1/3,e,i),t[1]=ae(r,e,i),t[2]=ae(r-1/3,e,i),t):(t=t.match(d)||ne.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):ne.black},le="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(l in ne)le+="|"+l+"\\b";le=RegExp(le+")","gi");var he=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(le)||[""])[0]:"",a=t.split(n).join("").match(g)||[],o=t.substr(0,t.indexOf(a[0])),l=")"===t.charAt(t.length-1)?")":"",h=-1!==t.indexOf(" ")?" ":",",u=a.length,_=u>0?a[0].replace(d,""):"";return u?r=e?function(t){var e,p,f,c;if("number"==typeof t)t+=_;else if(s&&D.test(t)){for(c=t.replace(D,"|").split("|"),f=0;c.length>f;f++)c[f]=r(c[f]);return c.join(",")}if(e=(t.match(le)||[n])[0],p=t.split(e).join("").match(g)||[],f=p.length,u>f--)for(;u>++f;)p[f]=i?p[0|(f-1)/2]:a[f];return o+p.join(h)+h+e+l+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=_;else if(s&&D.test(t)){for(n=t.replace(D,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(g)||[],p=e.length,u>p--)for(;u>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(h)+l}:function(t){return t}},ue=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var l,h=(i+"").split(" ");for(o={},l=0;4>l;l++)o[t[l]]=h[l]=h[l]||h[(l-1)/2>>0];return r.parse(e,o,n,a)}},_e=(E._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,l=1e-6;o;)e=a[o.v],o.r?e=e>0?0|e+.5:0|e-.5:l>e&&e>-l&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),pe=(E._parseToProxy=function(t,e,i,s,r,n){var a,o,l,h,u,_=s,p={},f={},c=i._transform,d=N;for(i._transform=null,N=e,s=u=i.parse(t,e,s,r),N=d,n&&(i._transform=c,_&&(_._prev=null,_._prev&&(_._prev._next=null)));s&&s!==_;){if(1>=s.type&&(o=s.p,f[o]=s.s+s.c,p[o]=s.s,n||(h=new _e(s,"s",o,h,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)l="xn"+a,o=s.p+"_"+l,f[o]=s.data[l],p[o]=s[l],n||(h=new _e(s,l,o,h,s.rxp[l]));s=s._next}return{proxy:p,end:f,firstMPT:h,pt:u}},E.CSSPropTween=function(t,e,s,r,a,o,l,h,u,_,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=l||e,t instanceof pe||n.push(this.n),this.r=h,this.type=o||0,u&&(this.pr=u,i=!0),this.b=void 0===_?s:_,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),fe=a.parseComplex=function(t,e,i,s,r,n,a,o,l,u){i=i||n||"",a=new pe(t,e,0,0,a,u?2:1,null,!1,o,i,s),s+="";var _,p,f,c,g,v,y,T,x,w,P,S,R=i.split(", ").join(",").split(" "),k=s.split(", ").join(",").split(" "),C=R.length,A=h!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(R=R.join(" ").replace(D,", ").split(" "),k=k.join(" ").replace(D,", ").split(" "),C=R.length),C!==k.length&&(R=(n||"").split(" "),C=R.length),a.plugin=l,a.setRatio=u,_=0;C>_;_++)if(c=R[_],g=k[_],T=parseFloat(c),T||0===T)a.appendXtra("",T,ie(g,T),g.replace(m,""),A&&-1!==g.indexOf("px"),!0);else if(r&&("#"===c.charAt(0)||ne[c]||b.test(c)))S=","===g.charAt(g.length-1)?"),":")",c=oe(c),g=oe(g),x=c.length+g.length>6,x&&!z&&0===g[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(k[_]).join("transparent")):(z||(x=!1),a.appendXtra(x?"rgba(":"rgb(",c[0],g[0]-c[0],",",!0,!0).appendXtra("",c[1],g[1]-c[1],",",!0).appendXtra("",c[2],g[2]-c[2],x?",":S,!0),x&&(c=4>c.length?1:c[3],a.appendXtra("",c,(4>g.length?1:g[3])-c,S,!1)));else if(v=c.match(d)){if(y=g.match(m),!y||y.length!==v.length)return a;for(f=0,p=0;v.length>p;p++)P=v[p],w=c.indexOf(P,f),a.appendXtra(c.substr(f,w-f),Number(P),ie(y[p],P),"",A&&"px"===c.substr(w+P.length,2),0===p),f=w+P.length;a["xs"+a.l]+=c.substr(f)}else a["xs"+a.l]+=a.l?" "+c:c;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,_=1;a.l>_;_++)S+=a["xs"+_]+a.data["xn"+_];a.e=S+a["xs"+_]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},ce=9;for(l=pe.prototype,l.l=l.pr=0;--ce>0;)l["xn"+ce]=0,l["xs"+ce]="";l.xs0="",l._next=l._prev=l.xfirst=l.data=l.plugin=l.setRatio=l.rxp=null,l.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new pe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var de=function(t,e){e=e||{},this.p=e.prefix?q(t)||t:t,o[t]=o[this.p]=this,this.format=e.formatter||he(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},me=E._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new de(n[s],e)},ge=function(t){if(!o[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";me(t,{parser:function(t,i,s,r,n,a,l){var h=(window.GreenSockGlobals||window).com.greensock.plugins[e];return h?(h._cssRegister(),o[s].parse(t,i,s,r,n,a,l)):(B("Error: "+e+" js file not loaded."),n)}})}};l=de.prototype,l.parseComplex=function(t,e,i,s,r,n){var a,o,l,h,u,_,p=this.keyword;if(this.multi&&(D.test(i)||D.test(e)?(o=e.replace(D,"|").split("|"),l=i.replace(D,"|").split("|")):p&&(o=[e],l=[i])),l){for(h=l.length>o.length?l.length:o.length,a=0;h>a;a++)e=o[a]=o[a]||this.dflt,i=l[a]=l[a]||this.dflt,p&&(u=e.indexOf(p),_=i.indexOf(p),u!==_&&(i=-1===_?l:o,i[a]+=" "+p));e=o.join(", "),i=l.join(", ")}return fe(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},l.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){me(t,{parser:function(t,s,r,n,a,o){var l=new pe(t,r,0,0,a,2,r,!1,i);return l.plugin=o,l.setRatio=e(t,s,n._tween,r),l},priority:i})};var ve="scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(","),ye=q("transform"),Te=j+"transform",xe=q("transformOrigin"),we=null!==q("perspective"),be=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var r,n,o,l,h,u,_,p,f,c,d,m,g,v=i?t._gsTransform||{skewY:0}:{skewY:0},y=0>v.scaleX,T=2e-5,x=1e5,w=179.99,b=w*M,P=we?parseFloat(Q(t,xe,e,!1,"0 0 0").split(" ")[2])||v.zOrigin||0:0;for(ye?r=Q(t,Te,e,!0):t.currentStyle&&(r=t.currentStyle.filter.match(A),r=r&&4===r.length?[r[0].substr(4),Number(r[2].substr(4)),Number(r[1].substr(4)),r[3].substr(4),v.x||0,v.y||0].join(","):""),n=(r||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],o=n.length;--o>-1;)l=Number(n[o]),n[o]=(h=l-(l|=0))?(0|h*x+(0>h?-.5:.5))/x+l:l;if(16===n.length){var S=n[8],R=n[9],k=n[10],C=n[12],O=n[13],D=n[14];if(v.zOrigin&&(D=-v.zOrigin,C=S*D-n[12],O=R*D-n[13],D=k*D+v.zOrigin-n[14]),!i||s||null==v.rotationX){var N,X,F,I,E,Y,z,U=n[0],B=n[1],j=n[2],V=n[3],q=n[4],W=n[5],Z=n[6],H=n[7],$=n[11],G=Math.atan2(Z,k),K=-b>G||G>b;v.rotationX=G*L,G&&(I=Math.cos(-G),E=Math.sin(-G),N=q*I+S*E,X=W*I+R*E,F=Z*I+k*E,S=q*-E+S*I,R=W*-E+R*I,k=Z*-E+k*I,$=H*-E+$*I,q=N,W=X,Z=F),G=Math.atan2(S,U),v.rotationY=G*L,G&&(Y=-b>G||G>b,I=Math.cos(-G),E=Math.sin(-G),N=U*I-S*E,X=B*I-R*E,F=j*I-k*E,R=B*E+R*I,k=j*E+k*I,$=V*E+$*I,U=N,B=X,j=F),G=Math.atan2(B,W),v.rotation=G*L,G&&(z=-b>G||G>b,I=Math.cos(-G),E=Math.sin(-G),U=U*I+q*E,X=B*I+W*E,W=B*-E+W*I,Z=j*-E+Z*I,B=X),z&&K?v.rotation=v.rotationX=0:z&&Y?v.rotation=v.rotationY=0:Y&&K&&(v.rotationY=v.rotationX=0),v.scaleX=(0|Math.sqrt(U*U+B*B)*x+.5)/x,v.scaleY=(0|Math.sqrt(W*W+R*R)*x+.5)/x,v.scaleZ=(0|Math.sqrt(Z*Z+k*k)*x+.5)/x,v.skewX=0,v.perspective=$?1/(0>$?-$:$):0,v.x=C,v.y=O,v.z=D}}else if(!(we&&!s&&n.length&&v.x===n[4]&&v.y===n[5]&&(v.rotationX||v.rotationY)||void 0!==v.x&&"none"===Q(t,"display",e))){var J=n.length>=6,te=J?n[0]:1,ee=n[1]||0,ie=n[2]||0,se=J?n[3]:1;v.x=n[4]||0,v.y=n[5]||0,u=Math.sqrt(te*te+ee*ee),_=Math.sqrt(se*se+ie*ie),p=te||ee?Math.atan2(ee,te)*L:v.rotation||0,f=ie||se?Math.atan2(ie,se)*L+p:v.skewX||0,c=u-Math.abs(v.scaleX||0),d=_-Math.abs(v.scaleY||0),Math.abs(f)>90&&270>Math.abs(f)&&(y?(u*=-1,f+=0>=p?180:-180,p+=0>=p?180:-180):(_*=-1,f+=0>=f?180:-180)),m=(p-v.rotation)%180,g=(f-v.skewX)%180,(void 0===v.skewX||c>T||-T>c||d>T||-T>d||m>-w&&w>m&&false|m*x||g>-w&&w>g&&false|g*x)&&(v.scaleX=u,v.scaleY=_,v.rotation=p,v.skewX=f),we&&(v.rotationX=v.rotationY=v.z=0,v.perspective=parseFloat(a.defaultTransformPerspective)||0,v.scaleZ=1)}v.zOrigin=P;for(o in v)T>v[o]&&v[o]>-T&&(v[o]=0);return i&&(t._gsTransform=v),v},Pe=function(t){var e,i,s=this.data,r=-s.rotation*M,n=r+s.skewX*M,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,l=(0|Math.sin(r)*s.scaleX*a)/a,h=(0|Math.sin(n)*-s.scaleY*a)/a,u=(0|Math.cos(n)*s.scaleY*a)/a,_=this.t.style,p=this.t.currentStyle;if(p){i=l,l=-h,h=-i,e=p.filter,_.filter="";var f,d,m=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,x="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+l+", M21="+h+", M22="+u,w=s.x,b=s.y;if(null!=s.ox&&(f=(s.oxp?.01*m*s.ox:s.ox)-m/2,d=(s.oyp?.01*g*s.oy:s.oy)-g/2,w+=f-(f*o+d*l),b+=d-(f*h+d*u)),v?(f=m/2,d=g/2,x+=", Dx="+(f-(f*o+d*l)+w)+", Dy="+(d-(f*h+d*u)+b)+")"):x+=", sizingMethod='auto expand')",_.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(O,x):x+" "+e,(0===t||1===t)&&1===o&&0===l&&0===h&&1===u&&(v&&-1===x.indexOf("Dx=0, Dy=0")||T.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&_.removeAttribute("filter")),!v){var P,S,R,k=8>c?1:-1;for(f=s.ieOffsetX||0,d=s.ieOffsetY||0,s.ieOffsetX=Math.round((m-((0>o?-o:o)*m+(0>l?-l:l)*g))/2+w),s.ieOffsetY=Math.round((g-((0>u?-u:u)*g+(0>h?-h:h)*m))/2+b),ce=0;4>ce;ce++)S=J[ce],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):Z(this.t,S,parseFloat(P),P.replace(y,""))||0,R=i!==s[S]?2>ce?-s.ieOffsetX:-s.ieOffsetY:2>ce?f-s.ieOffsetX:d-s.ieOffsetY,_[S]=(s[S]=Math.round(i-R*(0===ce||2===ce?1:k)))+"px"}}},Se=function(){var t,e,i,s,r,n,a,o,l,h,u,_,f,c,d,m,g,v,y,T,x,w,b,P,S,R,k=this.data,C=this.t.style,A=k.rotation*M,O=k.scaleX,D=k.scaleY,L=k.scaleZ,N=k.perspective;if(p&&(P=C.top?"top":C.bottom?"bottom":parseFloat(Q(this.t,"top",null,!1))?"bottom":"top",T=Q(this.t,P,null,!1),S=parseFloat(T)||0,R=T.substr((S+"").length)||"px",k._ffFix=!k._ffFix,C[P]=(k._ffFix?S+.05:S-.05)+R,S=1e-4,S>O&&O>-S&&(O=L=2e-5),S>D&&D>-S&&(D=L=2e-5)),A||k.skewX)v=Math.cos(A),y=Math.sin(A),t=v,r=y,k.skewX&&(A-=k.skewX*M,v=Math.cos(A),y=Math.sin(A)),e=-y,n=v;else{if(!(k.rotationY||k.rotationX||1!==L||N))return C[ye]="translate3d("+k.x+"px,"+k.y+"px,"+k.z+"px)"+(1!==O||1!==D?" scale("+O+","+D+")":""),void 0;t=n=1,e=r=0}u=1,i=s=a=o=l=h=_=f=c=0,d=N?-1/N:0,m=k.zOrigin,g=1e5,A=k.rotationY*M,A&&(v=Math.cos(A),y=Math.sin(A),l=u*-y,f=d*-y,i=t*y,a=r*y,u*=v,d*=v,t*=v,r*=v),A=k.rotationX*M,A&&(v=Math.cos(A),y=Math.sin(A),T=e*v+i*y,x=n*v+a*y,w=h*v+u*y,b=c*v+d*y,i=e*-y+i*v,a=n*-y+a*v,u=h*-y+u*v,d=c*-y+d*v,e=T,n=x,h=w,c=b),1!==L&&(i*=L,a*=L,u*=L,d*=L),1!==D&&(e*=D,n*=D,h*=D,c*=D),1!==O&&(t*=O,r*=O,l*=O,f*=O),m&&(_-=m,s=i*_,o=a*_,_=u*_+m),s=(T=(s+=k.x)-(s|=0))?(0|T*g+(0>T?-.5:.5))/g+s:s,o=(T=(o+=k.y)-(o|=0))?(0|T*g+(0>T?-.5:.5))/g+o:o,_=(T=(_+=k.z)-(_|=0))?(0|T*g+(0>T?-.5:.5))/g+_:_,C[ye]="matrix3d("+[(0|t*g)/g,(0|r*g)/g,(0|l*g)/g,(0|f*g)/g,(0|e*g)/g,(0|n*g)/g,(0|h*g)/g,(0|c*g)/g,(0|i*g)/g,(0|a*g)/g,(0|u*g)/g,(0|d*g)/g,s,o,_,N?1+-_/N:1].join(",")+")"},Re=function(){var t,e,i,s,r,n,a,o,l,h=this.data,u=this.t,_=u.style;p&&(t=_.top?"top":_.bottom?"bottom":parseFloat(Q(u,"top",null,!1))?"bottom":"top",e=Q(u,t,null,!1),i=parseFloat(e)||0,s=e.substr((i+"").length)||"px",h._ffFix=!h._ffFix,_[t]=(h._ffFix?i+.05:i-.05)+s),h.rotation||h.skewX?(r=h.rotation*M,n=r-h.skewX*M,a=1e5,o=h.scaleX*a,l=h.scaleY*a,_[ye]="matrix("+(0|Math.cos(r)*o)/a+","+(0|Math.sin(r)*o)/a+","+(0|Math.sin(n)*-l)/a+","+(0|Math.cos(n)*l)/a+","+h.x+","+h.y+")"):_[ye]="matrix("+h.scaleX+",0,0,"+h.scaleY+","+h.x+","+h.y+")"};me("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D",{parser:function(t,e,i,s,n,a,o){if(s._transform)return n;var l,h,u,_,p,f,c,d=s._transform=be(t,r,!0,o.parseTransform),m=t.style,g=1e-6,v=ve.length,y=o,T={};if("string"==typeof y.transform&&ye)u=m.cssText,m[ye]=y.transform,m.display="block",l=be(t,null,!1),m.cssText=u;else if("object"==typeof y){if(l={scaleX:se(null!=y.scaleX?y.scaleX:y.scale,d.scaleX),scaleY:se(null!=y.scaleY?y.scaleY:y.scale,d.scaleY),scaleZ:se(null!=y.scaleZ?y.scaleZ:y.scale,d.scaleZ),x:se(y.x,d.x),y:se(y.y,d.y),z:se(y.z,d.z),perspective:se(y.transformPerspective,d.perspective)},c=y.directionalRotation,null!=c)if("object"==typeof c)for(u in c)y[u]=c[u];else y.rotation=c;l.rotation=re("rotation"in y?y.rotation:"shortRotation"in y?y.shortRotation+"_short":"rotationZ"in y?y.rotationZ:d.rotation,d.rotation,"rotation",T),we&&(l.rotationX=re("rotationX"in y?y.rotationX:"shortRotationX"in y?y.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",T),l.rotationY=re("rotationY"in y?y.rotationY:"shortRotationY"in y?y.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",T)),l.skewX=null==y.skewX?d.skewX:re(y.skewX,d.skewX),l.skewY=null==y.skewY?d.skewY:re(y.skewY,d.skewY),(h=l.skewY-d.skewY)&&(l.skewX+=h,l.rotation+=h)}for(null!=y.force3D&&(d.force3D=y.force3D,f=!0),p=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,p||null==y.scale||(l.scaleZ=1);--v>-1;)i=ve[v],_=l[i]-d[i],(_>g||-g>_||null!=N[i])&&(f=!0,n=new pe(d,i,d[i],_,n),i in T&&(n.e=T[i]),n.xs0=0,n.plugin=a,s._overwriteProps.push(n.n));return _=y.transformOrigin,(_||we&&p&&d.zOrigin)&&(ye?(f=!0,i=xe,_=(_||Q(t,i,r,!1,"50% 50%"))+"",n=new pe(m,i,0,0,n,-1,"transformOrigin"),n.b=m[i],n.plugin=a,we?(u=d.zOrigin,_=_.split(" "),d.zOrigin=(_.length>2&&(0===u||"0px"!==_[2])?parseFloat(_[2]):u)||0,n.xs0=n.e=m[i]=_[0]+" "+(_[1]||"50%")+" 0px",n=new pe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=m[i]=_):ee(_+"",d)),f&&(s._transformType=p||3===this._transformType?3:2),n},prefix:!0}),me("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),me("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,l,h,u,_,p,f,c,d,m,g,v,y,T,x,w,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(d=parseFloat(t.offsetWidth),m=parseFloat(t.offsetHeight),o=e.split(" "),l=0;b.length>l;l++)this.p.indexOf("border")&&(b[l]=q(b[l])),_=u=Q(t,b[l],r,!1,"0px"),-1!==_.indexOf(" ")&&(u=_.split(" "),_=u[0],u=u[1]),p=h=o[l],f=parseFloat(_),v=_.substr((f+"").length),y="="===p.charAt(1),y?(c=parseInt(p.charAt(0)+"1",10),p=p.substr(2),c*=parseFloat(p),g=p.substr((c+"").length-(0>c?1:0))||""):(c=parseFloat(p),g=p.substr((c+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=Z(t,"borderLeft",f,v),x=Z(t,"borderTop",f,v),"%"===g?(_=100*(T/d)+"%",u=100*(x/m)+"%"):"em"===g?(w=Z(t,"borderLeft",1,"em"),_=T/w+"em",u=x/w+"em"):(_=T+"px",u=x+"px"),y&&(p=parseFloat(_)+c+g,h=parseFloat(u)+c+g)),a=fe(P,b[l],_+" "+u,p+" "+h,!1,"0px",a);return a},prefix:!0,formatter:he("0px 0px 0px 0px",!1,!0)}),me("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,l,h,u,_,p,f="background-position",d=r||W(t,null),m=this.format((d?c?d.getPropertyValue(f+"-x")+" "+d.getPropertyValue(f+"-y"):d.getPropertyValue(f):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==m.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=Q(t,"backgroundImage").replace(R,""),p&&"none"!==p)){for(o=m.split(" "),l=g.split(" "),I.setAttribute("src",p),h=2;--h>-1;)m=o[h],u=-1!==m.indexOf("%"),u!==(-1!==l[h].indexOf("%"))&&(_=0===h?t.offsetWidth-I.width:t.offsetHeight-I.height,o[h]=u?parseFloat(m)/100*_+"px":100*(parseFloat(m)/_)+"%");m=o.join(" ")}return this.parseComplex(t.style,m,g,n,a)},formatter:ee}),me("backgroundSize",{defaultValue:"0 0",formatter:ee}),me("perspective",{defaultValue:"0px",prefix:!0}),me("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),me("transformStyle",{prefix:!0}),me("backfaceVisibility",{prefix:!0}),me("userSelect",{prefix:!0}),me("margin",{parser:ue("marginTop,marginRight,marginBottom,marginLeft")}),me("padding",{parser:ue("paddingTop,paddingRight,paddingBottom,paddingLeft")}),me("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,l,h;return 9>c?(l=t.currentStyle,h=8>c?" ":",",o="rect("+l.clipTop+h+l.clipRight+h+l.clipBottom+h+l.clipLeft+")",e=this.format(e).split(",").join(h)):(o=this.format(Q(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),me("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),me("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),me("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(Q(t,"borderTopWidth",r,!1,"0px")+" "+Q(t,"borderTopStyle",r,!1,"solid")+" "+Q(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(le)||["#000"])[0]}}),me("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new pe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var ke=function(t){var e,i=this.t,s=i.filter||Q(this.data,"filter"),r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!Q(this.data,"filter")):(i.filter=s.replace(w,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("opacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(T,"opacity="+r))};me("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(Q(t,"opacity",r,!1,"1")),l=t.style,h="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),h&&1===o&&"hidden"===Q(t,"visibility",r)&&0!==e&&(o=0),z?n=new pe(l,"opacity",o,e-o,n):(n=new pe(l,"opacity",100*o,100*(e-o),n),n.xn1=h?1:0,l.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=ke),h&&(n=new pe(l,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Ce=function(t,e){e&&(t.removeProperty?t.removeProperty(e.replace(P,"-$1").toLowerCase()):t.removeAttribute(e))},Ae=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.className=0===t?this.b:this.e;for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Ce(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.className!==this.e&&(this.t.className=this.e)};me("className",{parser:function(t,e,s,n,a,o,l){var h,u,_,p,f,c=t.className,d=t.style.cssText;if(a=n._classNamePT=new pe(t,s,0,0,a,2),a.setRatio=Ae,a.pr=-11,i=!0,a.b=c,u=$(t,r),_=t._gsClassPT){for(p={},f=_.data;f;)p[f.p]=1,f=f._next;_.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:c.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.className=a.e,h=G(t,u,$(t),l,p),t.className=c,a.data=h.firstMPT,t.style.cssText=d,a=a.xfirst=n.parse(t,h.difs,a,o)),a}});var Oe=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=o.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(","),s=e.length;--s>-1;)i=e[s],o[i]&&(o[i].parse===a?r=!0:i="transformOrigin"===i?xe:o[i].p),Ce(n,i);r&&(Ce(n,ye),this.t._gsTransform&&delete this.t._gsTransform)}};for(me("clearProps",{parser:function(t,e,s,r,n){return n=new pe(t,s,0,0,n,2),n.setRatio=Oe,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),l="bezier,throwProps,physicsProps,physics2D".split(","),ce=l.length;ce--;)ge(l[ce]);l=a.prototype,l._firstPT=null,l._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,h=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=W(t,""),n=this._overwriteProps;var l,p,c,d,m,g,v,y,T,w=t.style;if(u&&""===w.zIndex&&(l=Q(t,"zIndex",r),("auto"===l||""===l)&&(w.zIndex=0)),"string"==typeof e&&(d=w.cssText,l=$(t,r),w.cssText=d+";"+e,l=G(t,l,$(t)).difs,!z&&x.test(e)&&(l.opacity=parseFloat(RegExp.$1)),e=l,w.cssText=d),this._firstPT=p=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,ye?_&&(u=!0,""===w.zIndex&&(v=Q(t,"zIndex",r),("auto"===v||""===v)&&(w.zIndex=0)),f&&(w.WebkitBackfaceVisibility=this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):w.zoom=1,c=p;c&&c._next;)c=c._next;y=new pe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=T&&we?Se:ye?Re:Pe,y.data=this._transform||be(t,r,!0),n.pop()}if(i){for(;p;){for(g=p._next,c=d;c&&c.pr>p.pr;)c=c._next;(p._prev=c?c._prev:m)?p._prev._next=p:d=p,(p._next=c)?c._prev=p:m=p,p=g}this._firstPT=d}return!0},l.parse=function(t,e,i,n){var a,l,u,_,p,f,c,d,m,g,v=t.style;for(a in e)f=e[a],l=o[a],l?i=l.parse(t,f,a,this,i,n,e):(p=Q(t,a,r)+"",m="string"==typeof f,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||m&&b.test(f)?(m||(f=oe(f),f=(f.length>3?"rgba(":"rgb(")+f.join(",")+")"),i=fe(v,a,p,f,!0,"transparent",i,0,n)):!m||-1===f.indexOf(" ")&&-1===f.indexOf(",")?(u=parseFloat(p),c=u||0===u?p.substr((u+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(u=te(t,a,r),c="px"):"left"===a||"top"===a?(u=H(t,a,r),c="px"):(u="opacity"!==a?0:1,c="")),g=m&&"="===f.charAt(1),g?(_=parseInt(f.charAt(0)+"1",10),f=f.substr(2),_*=parseFloat(f),d=f.replace(y,"")):(_=parseFloat(f),d=m?f.substr((_+"").length)||"":""),""===d&&(d=s[a]||c),f=_||0===_?(g?_+u:_)+d:e[a],c!==d&&""!==d&&(_||0===_)&&(u||0===u)&&(u=Z(t,a,u,c),"%"===d?(u/=Z(t,a,100,"%")/100,u>100&&(u=100),e.strictUnits!==!0&&(p=u+"%")):"em"===d?u/=Z(t,a,1,"em"):(_=Z(t,a,_,d),d="px"),g&&(_||0===_)&&(f=_+u+d)),g&&(_+=u),!u&&0!==u||!_&&0!==_?void 0!==v[a]&&(f||"NaN"!=f+""&&null!=f)?(i=new pe(v,a,_||u||0,0,i,-1,a,!1,0,p,f),i.xs0="none"!==f||"display"!==a&&-1===a.indexOf("Style")?f:p):B("invalid "+a+" tween value: "+e[a]):(i=new pe(v,a,u,_-u,i,0,a,h!==!1&&("px"===d||"zIndex"===a),0,p,f),i.xs0=d)):i=fe(v,a,p,f,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},l.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=e>0?0|e+.5:0|e-.5:n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},l._enableTransforms=function(t){this._transformType=t||3===this._transformType?3:2,this._transform=this._transform||be(this._target,r,!0)},l._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},l._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var De=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)De(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push($(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||De(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),l=[o],h=[],u=[],_=[],p=e._internals.reservedProps;for(t=o._targets||o.target,De(t,h,_),o.render(i,!0),De(t,u),o.render(0,!0),o._enabled(!0),r=_.length;--r>-1;)if(n=G(_[r],h[r],u[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);l.push(e.to(_[r],i,n))}return l},t.activate([a]),a},!0)}),window._gsDefine&&window._gsQueue.pop()();

// WAIT FOR IMAGES
/*
 * waitForImages 1.4
 * -----------------
 * Provides a callback when all images have loaded in your given selector.
 * http://www.alexanderdickson.com/
 *
 *
 * Copyright (c) 2011 Alex Dickson
 * Licensed under the MIT licenses.
 * See website for more info.
 *
 */

(function(e,t){
		e.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage"]};e.expr[":"].uncached=function(t){var n=document.createElement("img");n.src=t.src;return e(t).is('img[src!=""]')&&!n.complete};e.fn.waitForImages=function(t,n,r){if(e.isPlainObject(arguments[0])){n=t.each;r=t.waitForAll;t=t.finished}t=t||e.noop;n=n||e.noop;r=!!r;if(!e.isFunction(t)||!e.isFunction(n)){throw new TypeError("An invalid callback was supplied.")}return this.each(function(){var i=e(this),s=[];if(r){var o=e.waitForImages.hasImageProperties||[],u=/url\((['"]?)(.*?)\1\)/g;i.find("*").each(function(){var t=e(this);if(t.is("img:uncached")){s.push({src:t.attr("src"),element:t[0]})}e.each(o,function(e,n){var r=t.css(n);if(!r){return true}var i;while(i=u.exec(r)){s.push({src:i[2],element:t[0]})}})})}else{i.find("img:uncached").each(function(){s.push({src:this.src,element:this})})}var f=s.length,l=0;if(f==0){t.call(i[0])}e.each(s,function(r,s){var o=new Image;e(o).bind("load error",function(e){l++;n.call(s.element,l,f,e.type=="load");if(l==f){t.call(i[0]);return false}});o.src=s.src})})};
		e.fn.swipe=function(t){if(!this)return false;var n={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var r="left";var i="right";var s="up";var o="down";var u="none";var f="horizontal";var l="vertical";var c="auto";var h="start";var p="move";var d="end";var v="cancel";var m="ontouchstart"in window,g=m?"touchstart":"mousedown",y=m?"touchmove":"mousemove",b=m?"touchend":"mouseup",w="touchcancel";var E="start";if(t.allowPageScroll==undefined&&(t.swipe!=undefined||t.swipeStatus!=undefined))t.allowPageScroll=u;if(t)e.extend(n,t);return this.each(function(){function t(){var e=S();if(e<=45&&e>=0)return r;else if(e<=360&&e>=315)return r;else if(e>=135&&e<=225)return i;else if(e>45&&e<135)return o;else return s}function S(){var e=H.x-B.x;var t=B.y-H.y;var n=Math.atan2(t,e);var r=Math.round(n*180/Math.PI);if(r<0)r=360-Math.abs(r);return r}function x(){return Math.round(Math.sqrt(Math.pow(B.x-H.x,2)+Math.pow(B.y-H.y,2)))}function T(e,t){if(n.allowPageScroll==u){e.preventDefault()}else{var a=n.allowPageScroll==c;switch(t){case r:if(n.swipeLeft&&a||!a&&n.allowPageScroll!=f)e.preventDefault();break;case i:if(n.swipeRight&&a||!a&&n.allowPageScroll!=f)e.preventDefault();break;case s:if(n.swipeUp&&a||!a&&n.allowPageScroll!=l)e.preventDefault();break;case o:if(n.swipeDown&&a||!a&&n.allowPageScroll!=l)e.preventDefault();break}}}function N(e,t){if(n.swipeStatus)n.swipeStatus.call(_,e,t,direction||null,distance||0);if(t==v){if(n.click&&(P==1||!m)&&(isNaN(distance)||distance==0))n.click.call(_,e,e.target)}if(t==d){if(n.swipe){n.swipe.call(_,e,direction,distance)}switch(direction){case r:if(n.swipeLeft)n.swipeLeft.call(_,e,direction,distance);break;case i:if(n.swipeRight)n.swipeRight.call(_,e,direction,distance);break;case s:if(n.swipeUp)n.swipeUp.call(_,e,direction,distance);break;case o:if(n.swipeDown)n.swipeDown.call(_,e,direction,distance);break}}}function C(e){P=0;H.x=0;H.y=0;B.x=0;B.y=0;F.x=0;F.y=0}function L(e){e.preventDefault();distance=x();direction=t();if(n.triggerOnTouchEnd){E=d;if((P==n.fingers||!m)&&B.x!=0){if(distance>=n.threshold){N(e,E);C(e)}else{E=v;N(e,E);C(e)}}else{E=v;N(e,E);C(e)}}else if(E==p){E=v;N(e,E);C(e)}M.removeEventListener(y,A,false);M.removeEventListener(b,L,false)}function A(e){if(E==d||E==v)return;var r=m?e.touches[0]:e;B.x=r.pageX;B.y=r.pageY;direction=t();if(m){P=e.touches.length}E=p;T(e,direction);if(P==n.fingers||!m){distance=x();if(n.swipeStatus)N(e,E,direction,distance);if(!n.triggerOnTouchEnd){if(distance>=n.threshold){E=d;N(e,E);C(e)}}}else{E=v;N(e,E);C(e)}}function O(e){var t=m?e.touches[0]:e;E=h;if(m){P=e.touches.length}distance=0;direction=null;if(P==n.fingers||!m){H.x=B.x=t.pageX;H.y=B.y=t.pageY;if(n.swipeStatus)N(e,E)}else{C(e)}M.addEventListener(y,A,false);M.addEventListener(b,L,false)}var M=this;var _=e(this);var D=null;var P=0;var H={x:0,y:0};var B={x:0,y:0};var F={x:0,y:0};try{this.addEventListener(g,O,false);this.addEventListener(w,C)}catch(I){}})}
})(jQuery)
;

/* revslider-jquery.themepunch.revolution.min: (http://www.artjiahua.com/qfy-content/plugins/revslider/rs-plugin/js/jquery.themepunch.revolution.min.js?rev=4.1.4) */


/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 4.1.2 (12.12.2013)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
**************************************************************************/


(function(jQuery,undefined){

	
	////////////////////////////////////////
	// THE REVOLUTION PLUGIN STARTS HERE //
	///////////////////////////////////////

	jQuery.fn.extend({

		// OUR PLUGIN HERE :)
		revolution: function(options) {



				////////////////////////////////
				// SET DEFAULT VALUES OF ITEM //
				////////////////////////////////
				jQuery.fn.revolution.defaults = {
					delay:9000,
					startheight:500,
					startwidth:960,
					fullScreenAlignForce:"off",
					autoHeight:"off",

					hideThumbs:200,

					thumbWidth:100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
					thumbHeight:50,
					thumbAmount:3,

					navigationType:"bullet",				// bullet, thumb, none
					navigationArrows:"solo",			// nextto, solo, none
					navigation_arrows_style:'defalut',
					hideThumbsOnMobile:"off",
					hideBulletsOnMobile:"off",
					hideArrowsOnMobile:"off",
					hideThumbsUnderResoluition:0,

					navigationStyle:"round",				// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),

					navigationHAlign:"center",				// Vertical Align top,center,bottom
					navigationVAlign:"bottom",					// Horizontal Align left,center,right
					navigationHOffset:0,
					navigationVOffset:20,

					soloArrowLeftHalign:"left",
					soloArrowLeftValign:"center",
					soloArrowLeftHOffset:20,
					soloArrowLeftVOffset:0,

					soloArrowRightHalign:"right",
					soloArrowRightValign:"center",
					soloArrowRightHOffset:20,
					soloArrowRightVOffset:0,

					keyboardNavigation:"on",

					touchenabled:"on",						// Enable Swipe Function : on/off
					onHoverStop:"on",						// Stop Banner Timet at Hover on Slide on/off


					stopAtSlide:-1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
					stopAfterLoops:-1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

					hideCaptionAtLimit:0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
					hideAllCaptionAtLimit:0,				// Hide all The Captions if Width of Browser is less then this value
					hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

					shadow:0,								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
					fullWidth:"off",						// Turns On or Off the Fullwidth Image Centering in FullWidth Modus
					fullScreen:"off",
					minFullScreenHeight:0,					// The Minimum FullScreen Height
					fullScreenOffsetContainer:"",
					dottedOverlay:"none",					//twoxtwo, threexthree, twoxtwowhite, threexthreewhite

					forceFullWidth:"off"						// Force The FullWidth

				};

					options = jQuery.extend({}, jQuery.fn.revolution.defaults, options);





					return this.each(function() {

						var opt=options;

						if (opt.fullWidth!="on" && opt.fullScreen!="on") opt.autoHeight = "off";
						if (opt.fullScreen=="on") opt.autoHeight = "on";
						if (opt.fullWidth!="on" && opt.fullScreen!="on") forceFulWidth="off";

						var container=jQuery(this);
					
						if (opt.fullWidth=="on" && opt.autoHeight=="off")
							container.css({maxHeight:opt.startheight+"px"});

						if (is_mobile() && opt.hideThumbsOnMobile=="on" && opt.navigationType=="thumb")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideBulletsOnMobile=="on" && opt.navigationType=="bullet")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideBulletsOnMobile=="on" && opt.navigationType=="both")
						   opt.navigationType = "none"

						if (is_mobile() && opt.hideArrowsOnMobile=="on")
						   opt.navigationArrows = "none"

						if (opt.forceFullWidth=="on") {

							var loff = container.parent().offset().left;
							var mb = container.parent().css('marginBottom');
							var mt = container.parent().css('marginTop');
							if (mb==undefined) mb=0;
							if (mt==undefined) mt=0;

							container.parent().wrap('<div style="position:relative;width:100%;height:auto;margin-top:'+mt+';margin-bottom:'+mb+'" class="forcefullwidth_wrapper_tp_banner"></div>');
							container.closest('.forcefullwidth_wrapper_tp_banner').append('<div class="tp-fullwidth-forcer" style="width:100%;height:'+container.height()+'px"></div>');
							container.css({'backgroundColor':container.parent().css('backgroundColor'),'backgroundImage':container.parent().css('backgroundImage')});
							//container.parent().css({'position':'absolute','width':jQuery(window).width()});
							container.parent().css({'left':(0-loff)+"px",position:'absolute','width':jQuery(window).width()});
							opt.width=jQuery(window).width();
						}

						// HIDE THUMBS UNDER RESOLUTION
						try{
							if (opt.hideThumbsUnderResolution>jQuery(window).width() && opt.hideThumbsUnderResolution!=0) {
								container.parent().find('.tp-bullets.tp-thumbs').css({display:"none"});
							} else {
								container.parent().find('.tp-bullets.tp-thumbs').css({display:"block"});
							}
						} catch(e) {}

						if (!container.hasClass("revslider-initialised")) {

									container.addClass("revslider-initialised");
									if (container.attr('id')==undefined) container.attr('id',"revslider-"+Math.round(Math.random()*1000+5));

									// CHECK IF FIREFOX 13 IS ON WAY.. IT HAS A STRANGE BUG, CSS ANIMATE SHOULD NOT BE USED



									opt.firefox13 = false;
									opt.ie = !jQuery.support.opacity;
									opt.ie9 = (document.documentMode == 9);


									// CHECK THE jQUERY VERSION
									var version = jQuery.fn.jquery.split('.'),
										versionTop = parseFloat(version[0]),
										versionMinor = parseFloat(version[1]),
										versionIncrement = parseFloat(version[2] || '0');

									if (versionTop==1 && versionMinor < 7) {
										container.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:'+version+' <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>');
									}

									if (versionTop>1) opt.ie=false;


									// Delegate .transition() calls to .animate()
									// if the browser can't do CSS transitions.
									if (!jQuery.support.transition)
										jQuery.fn.transition = jQuery.fn.animate;

									// CATCH THE CONTAINER


									 // LOAD THE YOUTUBE API IF NECESSARY

									container.find('.caption').each(function() { jQuery(this).addClass('tp-caption')});

									if (is_mobile()) {
										container.find('.tp-caption').each(function() {
											if (jQuery(this).data('autoplay')==true)
												 jQuery(this).data('autoplay',false);
											// && jQuery(this).data('forcecover')!=1)
										})
									}


									var addedyt=0;
									var addedvim=0;
									var addedvid=0;
									var httpprefix = "http";

									if (location.protocol === 'https:') {
											httpprefix = "https";
									}
									container.find('.tp-caption iframe').each(function(i) {
										try {

												if (jQuery(this).attr('src').indexOf('you')>0 && addedyt==0) {
													addedyt=1;
													var s = document.createElement("script");
													s.src = httpprefix+"://www.youtube.com/player_api"; /* Load Player API*/
													var before = document.getElementsByTagName("script")[0];
													var loadit = true;
													jQuery('head').find('*').each(function(){
														if (jQuery(this).attr('src') == httpprefix+"://www.youtube.com/iframe_api")
														   loadit = false;
													});
													if (loadit)
														before.parentNode.insertBefore(s, before);
												}
											} catch(e) {}
									});



									 // LOAD THE VIMEO API
									 container.find('.tp-caption iframe').each(function(i) {
										try{
												if (jQuery(this).attr('src').indexOf('vim')>0 && addedvim==0) {
													addedvim=1;
													var f = document.createElement("script");
													f.src = httpprefix+"://a.vimeocdn.com/js/froogaloop2.min.js"; /* Load Player API*/
													var before = document.getElementsByTagName("script")[0];

													var loadit = true;
													jQuery('head').find('*').each(function(){
														if (jQuery(this).attr('src') == httpprefix+"://a.vimeocdn.com/js/froogaloop2.min.js")
														   loadit = false;
													});
													if (loadit)
														before.parentNode.insertBefore(f, before);
												}
											} catch(e) {}
									});





									// LOAD THE VIDEO.JS API IF NEEDED
									container.find('.tp-caption video').each(function(i) {
										try{
												if (jQuery(this).hasClass('video-js') && addedvid==0) {
													addedvid=1;
													var f = document.createElement("script");
													f.src = opt.videoJsPath+"video.js"; /* Load Player API*/
													var before = document.getElementsByTagName("script")[0];

													var loadit = true;
													jQuery('head').find('*').each(function(){
														if (jQuery(this).attr('src') == opt.videoJsPath+"video.js")
														   loadit = false;
													});
													if (loadit) {
														before.parentNode.insertBefore(f, before);
														jQuery('head').append('<link rel="stylesheet" type="text/css" href="'+opt.videoJsPath+'video-js.min.css" media="screen" />');
														jQuery('head').append('<script> videojs.options.flash.swf = "'+opt.videoJsPath+'video-js.swf";</script>');
													}
												}
											} catch(e) {}
									});

									// SHUFFLE MODE
									if (opt.shuffle=="on") {
										for (var u=0;u<container.find('>ul:first-child >li').length;u++) {
											var it = Math.round(Math.random()*container.find('>ul:first-child >li').length);
											container.find('>ul:first-child >li:eq('+it+')').prependTo(container.find('>ul:first-child'));
										}
									}


									// CREATE SOME DEFAULT OPTIONS FOR LATER
									opt.slots=4;
									opt.act=-1;
									opt.next=0;

									// IF START SLIDE IS SET
									if (opt.startWithSlide !=undefined) opt.next=opt.startWithSlide;
									
									// IF DEEPLINK HAS BEEN SET
									var deeplink = getUrlVars("#")[0];
									if (deeplink.length<9) {
										if (deeplink.split('slide').length>1) {
											var dslide=parseInt(deeplink.split('slide')[1],0);
											if (dslide<1) dslide=1;
											if (dslide>container.find('>ul:first >li').length) dslide=container.find('>ul:first >li').length;
											opt.next=dslide-1;
										}
									}


									opt.origcd=opt.delay;
									opt.firststart=1;

									// BASIC OFFSET POSITIONS OF THE BULLETS
									if (opt.navigationHOffset==undefined) opt.navOffsetHorizontal=0;
									if (opt.navigationVOffset==undefined) opt.navOffsetVertical=0;


									container.append('<div class="tp-loader"></div>');

									// RESET THE TIMER
									if (container.find('.tp-bannertimer').length==0) container.append('<div class="tp-bannertimer" style="visibility:hidden"></div>');
									var bt=container.find('.tp-bannertimer');
									if (bt.length>0) {
										bt.css({'width':'0%'});
									};


									// WE NEED TO ADD A BASIC CLASS FOR SETTINGS.CSS
									container.addClass("tp-simpleresponsive");
									opt.container=container;

									//if (container.height()==0) container.height(opt.startheight);

									// AMOUNT OF THE SLIDES
									opt.slideamount = container.find('>ul:first >li').length;


									// A BASIC GRID MUST BE DEFINED. IF NO DEFAULT GRID EXIST THAN WE NEED A DEFAULT VALUE, ACTUAL SIZE OF CONAINER
									if (container.height()==0) container.height(opt.startheight);
									if (opt.startwidth==undefined || opt.startwidth==0) opt.startwidth=container.width();
									if (opt.startheight==undefined || opt.startheight==0) opt.startheight=container.height();

									// OPT WIDTH && HEIGHT SHOULD BE SET
									opt.width=container.width();
									opt.height=container.height();


									// DEFAULT DEPENDECIES
									opt.bw= opt.startwidth / container.width();
									opt.bh = opt.startheight / container.height();

									// IF THE ITEM ALREADY IN A RESIZED FORM
									if (opt.width!=opt.startwidth) {

										opt.height = Math.round(opt.startheight * (opt.width/opt.startwidth));

										container.height(opt.height);

									}

									// LETS SEE IF THERE IS ANY SHADOW
									if (opt.shadow!=0) {
										container.parent().append('<div class="tp-bannershadow tp-shadow'+opt.shadow+'"></div>');
										var loff=0;
										if (opt.forceFullWidth=="on"){
											var offset = opt.container.parent().offset();
											if(offset){
												loff = 0-offset.left;
											}
										}
										container.parent().find('.tp-bannershadow').css({'width':opt.width,'left':loff});
									}


									container.find('ul').css({'display':'none'});

									var fliparent = container;

									// CHECK IF LAZY LOAD HAS BEEN ACTIVATED
									if (opt.lazyLoad=="on") {
										var fli = container.find('ul >li >img').first();
										if (fli.data('lazyload')!=undefined) fli.attr('src',fli.data('lazyload'));
										fli.data('lazydone',1);
										fliparent = fli.parent();
									}


									// IF IMAGES HAS BEEN LOADED
									fliparent.waitForImages(function() {
												// PREPARE THE SLIDES
												container.find('ul').css({'display':'block'});
												prepareSlides(container,opt);

												// CREATE BULLETS
												if (opt.slideamount >1) createBullets(container,opt);
												if (opt.slideamount >1) createThumbs(container,opt);
												if (opt.slideamount >1) createArrows(container,opt);
												if (opt.keyboardNavigation=="on") createKeyboard(container,opt);

												swipeAction(container,opt);

												if (opt.hideThumbs>0) hideThumbs(container,opt);


												container.waitForImages(function() {
													// START THE FIRST SLIDE

													container.find('.tp-loader').fadeOut(600);
													setTimeout(function() {

														swapSlide(container,opt);
														// START COUNTDOWN
														if (opt.slideamount >1) countDown(container,opt);
														container.trigger('revolution.slide.onloaded');
													},600);

												});
									});



									// IF RESIZED, NEED TO STOP ACTUAL TRANSITION AND RESIZE ACTUAL IMAGES
									jQuery(window).resize(function() {
										if (jQuery('body').find(container)!=0)
											if (opt.forceFullWidth=="on" ) {
												var offset = opt.container.closest('.forcefullwidth_wrapper_tp_banner').offset();
												if(offset){
													var loff = opt.container.closest('.forcefullwidth_wrapper_tp_banner').offset().left;
													//opt.container.parent().css({'width':jQuery(window).width()});
													opt.container.parent().css({'left':(0-loff)+"px",'width':jQuery(window).width()});
												}
											}

											if (container.outerWidth(true)!=opt.width || opt.forceFullWidth=="on") {
													
													containerResized(container,opt);
											}
									});

									// HIDE THUMBS UNDER SIZE...
									try{
										if (opt.hideThumbsUnderResoluition!=0 && opt.navigationType=="thumb") {
											if (opt.hideThumbsUnderResoluition>jQuery(window).width())
												jQuery('.tp-bullets').css({display:"none"});
											 else
											 	jQuery('.tp-bullets').css({display:"block"});
										}
									} catch(e) {}



									// CHECK IF THE CAPTION IS A "SCROLL ME TO POSITION" CAPTION IS
									//if (opt.fullScreen=="on") {
										container.find('.tp-scrollbelowslider').on('click',function() {
												var off=0;
												try{
												 	off = jQuery('body').find(opt.fullScreenOffsetContainer).height();
												 } catch(e) {}
												try{
												 	off = off - jQuery(this).data('scrolloffset');
												 } catch(e) {}

												jQuery('body,html').animate(
													{scrollTop:(container.offset().top+(container.find('>ul >li').height())-off)+"px"},{duration:400});
											});
									//}
						}

					})
				},


		// METHODE PAUSE
		revscroll: function(oy) {
					return this.each(function() {
						var container=jQuery(this);
						jQuery('body,html').animate(
							{scrollTop:(container.offset().top+(container.find('>ul >li').height())-oy)+"px"},{duration:400});
					})
				},
				
		// METHODE PAUSE
		revredraw: function(oy) {
					return this.each(function() {
						var container=jQuery(this);
						var bt = container.parent().find('.tp-bannertimer');
						var opt = bt.data('opt');
						containerResized(container,opt);

					})
				},
		revRefresh: function(obj) {
					
					if(obj.bitAction == "changePostion") {
						
						var s =jQuery(this).find("[data-slideid="+obj.slideid+"] .tp-caption[bitslidetextindex="+obj.textIndex+"]");
						s.data('x',obj.left);
						s.data('y',obj.top);
						s.attr("dataleft",obj.left);
						s.attr("datatop",obj.top);
						s.attr('dataalignhor',"left");
						s.attr('dataalignvert',"top");
						s.attr("data-x",obj.left);
						s.attr("data-y",obj.top);
						s.attr("changePostion",1);
					}
		},
		// METHODE PAUSE
		revpause: function(options) {

					return this.each(function() {
						var container=jQuery(this);
						container.data('conthover',1);
						container.data('conthover-changed',1);
						container.trigger('revolution.slide.onpause');
						var bt = container.parent().find('.tp-bannertimer');
						bt.stop();

					})


				},

		// METHODE RESUME
		revresume: function(options) {
					return this.each(function() {
						var container=jQuery(this);
						container.data('conthover',0);
						container.data('conthover-changed',1);
						container.trigger('revolution.slide.onresume');
						var bt = container.parent().find('.tp-bannertimer');
						var opt = bt.data('opt');
						var t=0;
						if(opt){
							t =((opt.delay-opt.cd)-100);
						}
						bt.animate({'width':"100%"},{duration:t,queue:false, easing:"linear"});
					})

				},

		// METHODE NEXT
		revnext: function(options) {
					return this.each(function() {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						container.parent().find('.tp-rightarrow').click();


					})

				},

		// METHODE RESUME
		revprev: function(options) {
					return this.each(function() {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						container.parent().find('.tp-leftarrow').click();
					})

				},

		// METHODE LENGTH
		revmaxslide: function(options) {
						// CATCH THE CONTAINER
						return jQuery(this).find('>ul:first-child >li').length;
				},


		// METHODE CURRENT
		revcurrentslide: function(options) {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						var bt = container.parent().find('.tp-bannertimer');
						var opt = bt.data('opt');
						return opt.act;
				},

		// METHODE CURRENT
		revlastslide: function(options) {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						var bt = container.parent().find('.tp-bannertimer');
						var opt = bt.data('opt');
						return opt.lastslide;
				},


		// METHODE JUMP TO SLIDE
		revshowslide: function(slide) {
					return this.each(function() {
						// CATCH THE CONTAINER
						var container=jQuery(this);
						container.data('showus',slide);
						container.parent().find('.tp-rightarrow').click();
					})

				}


})


		///////////////////////////
		// GET THE URL PARAMETER //
		///////////////////////////
		function getUrlVars(hashdivider)
			{
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf(hashdivider) + 1).split('_');
				for(var i = 0; i < hashes.length; i++)
				{
					hashes[i] = hashes[i].replace('%3D',"=");
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
			}

		//////////////////////////
		//	CONTAINER RESIZED	//
		/////////////////////////
		function containerResized(container,opt) {

			// HIDE THUMBS UNDER SIZE...
			try{
				if (opt.hideThumbsUnderResoluition!=0 && opt.navigationType=="thumb") {
					if (opt.hideThumbsUnderResoluition>jQuery(window).width())
						jQuery('.tp-bullets').css({display:"none"});
					 else
					 	jQuery('.tp-bullets').css({display:"block"});
				}
			} catch(e) {}


			container.find('.defaultimg').each(function(i) {
					setSize(jQuery(this),opt);
			});

			var loff=0;
			if (opt.forceFullWidth=="on")
				var offset = opt.container.parent().offset();
				if(offset){
					loff = 0-offset.left;
				}
			try{
				container.parent().find('.tp-bannershadow').css({'width':opt.width,'left':loff});
			} catch(e) {}

			var actsh = container.find('>ul >li:eq('+opt.act+') .slotholder');
			var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
			removeSlots(container,opt);
			nextsh.find('.defaultimg').css({'opacity':0});
			actsh.find('.defaultimg').css({'opacity':1});

			nextsh.find('.defaultimg').each(function() {
				var dimg = jQuery(this);
				if (dimg.data('kenburn')!=undefined)
				   dimg.data('kenburn').restart();
			});

			var nextli = container.find('>ul >li:eq('+opt.next+')');
	
			animateTheCaptions(nextli, opt,true);
			restartBannerTimer(opt,container);
			setBulPos(container,opt);

		}


		//////////////////
		// IS MOBILE ?? //
		//////////////////
		function is_mobile() {
		    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry','Android', 'webos', ,'iPod', 'iPhone', 'iPad', 'Blackberry', 'BlackBerry'];
			var ismobile=false;
		    for(i in agents) {

			    if (navigator.userAgent.split(agents[i]).length>1) {
		            ismobile = true;

		          }
		    }
		    return ismobile;
		}

		/*********************************
			-	CHECK IF BROWSER IS IE	-
		********************************/
		function isIE( version, comparison ){
		    var $div = jQuery('<div style="display:none;"/>').appendTo(jQuery('body'));
		    $div.html('<!--[if '+(comparison||'')+' IE '+(version||'')+']><a>&nbsp;</a><![endif]-->');
		    var ieTest = $div.find('a').length;
		    $div.remove();
		    return ieTest;
		}

		////////////////////////////////
		//	RESTART THE BANNER TIMER //
		//////////////////////////////
		function restartBannerTimer(opt,container) {
						opt.cd=0;

						if (opt.videoplaying !=true) {
							var bt=	container.find('.tp-bannertimer');
								if (bt.length>0) {
									bt.stop();
									bt.css({'width':'0%'});
									bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});
								}
							clearTimeout(opt.thumbtimer);

							opt.thumbtimer = setTimeout(function() {
								moveSelectedThumb(container);
								setBulPos(container,opt);
							},200);
						}
		}

		////////////////////////////////
		//	RESTART THE BANNER TIMER //
		//////////////////////////////
		function killBannerTimer(opt,container) {
						opt.cd=0;

							var bt=	container.find('.tp-bannertimer');
								if (bt.length>0) {
									bt.stop(true,true);
									bt.css({'width':'0%'});
								}
							clearTimeout(opt.thumbtimer);

		}

		function callingNewSlide(opt,container) {
						opt.cd=0;
						swapSlide(container,opt);
						// STOP TIMER AND RESCALE IT
							var bt=	container.find('.tp-bannertimer');
							if (bt.length>0) {
								bt.stop();
								bt.css({'width':'0%'});

								if (opt.videoplaying!=true) bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});
							}
		}


		////////////////////////////////
		//	-	CREATE THE BULLETS -  //
		////////////////////////////////
		function createThumbs(container,opt) {

			var cap=container.parent();

			if (opt.navigationType=="thumb" || opt.navsecond=="both") {
						cap.append('<div class="tp-bullets tp-thumbs '+opt.navigationStyle+'"><div class="tp-mask"><div class="tp-thumbcontainer"></div></div></div>');
			}
			var bullets = cap.find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
			var bup = bullets.parent();

			bup.width(opt.thumbWidth*opt.thumbAmount);
			bup.height(opt.thumbHeight);
			bup.parent().width(opt.thumbWidth*opt.thumbAmount);
			bup.parent().height(opt.thumbHeight);

			container.find('>ul:first >li').each(function(i) {
							var li= container.find(">ul:first >li:eq("+i+")");
							if (li.data('thumb') !=undefined)
								var src= li.data('thumb')
							else
								var src=li.find("img:first").attr('src');
							bullets.append('<div class="bullet thumb" style="width:'+opt.thumbWidth+'px;height:'+opt.thumbHeight+'px;"><img src="'+src+'"></div>');
							var bullet= bullets.find('.bullet:first');
				});
			//bullets.append('<div style="clear:both"></div>');
			var minwidth=10;


			// ADD THE BULLET CLICK FUNCTION HERE
			bullets.find('.bullet').each(function(i) {
				var bul = jQuery(this);

				if (i==opt.slideamount-1) bul.addClass('last');
				if (i==0) bul.addClass('first');
				bul.width(opt.thumbWidth);
				bul.height(opt.thumbHeight);

				if (minwidth<bul.outerWidth(true)) minwidth=bul.outerWidth(true);
				bul.click(function() {
					if (opt.transition==0 && bul.index() != opt.act) {
						opt.next = bul.index();
						callingNewSlide(opt,container);
					}
				});
			});


			var max=minwidth*container.find('>ul:first >li').length;

			var thumbconwidth=bullets.parent().width();
			opt.thumbWidth = minwidth;



				////////////////////////
				// SLIDE TO POSITION  //
				////////////////////////
				if (thumbconwidth<max) {
					jQuery(document).mousemove(function(e) {
						jQuery('body').data('mousex',e.pageX);
					});



					// ON MOUSE MOVE ON THE THUMBNAILS EVERYTHING SHOULD MOVE :)
					/*
					bullets.parent().mouseenter(function() {
							var $this=jQuery(this);
							$this.addClass("over");
							var offset = $this.offset();
							var x = jQuery('body').data('mousex')-offset.left;
							var thumbconwidth=$this.width();
							var minwidth=$this.find('.bullet:first').outerWidth(true);
							var max=minwidth*container.find('>ul:first >li').length;
							var diff=(max- thumbconwidth)+15;
							var steps = diff / thumbconwidth;
							x=x-30;
							//if (x<30) x=0;
							//if (x>thumbconwidth-30) x=thumbconwidth;

							//ANIMATE TO POSITION
							var pos=(0-((x)*steps));
							if (pos>0) pos =0;
							if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
							moveThumbSliderToPosition($this,pos,200);
					});

					bullets.parent().mousemove(function() {

									var $this=jQuery(this);

									//if (!$this.hasClass("over")) {
											var offset = $this.offset();
											var x = jQuery('body').data('mousex')-offset.left;
											var thumbconwidth=$this.width();
											var minwidth=$this.find('.bullet:first').outerWidth(true);
											var max=minwidth*container.find('>ul:first >li').length-1;
											var diff=(max- thumbconwidth)+15;
											var steps = diff / thumbconwidth;
											x=x-3;
											if (x<6) x=0;
											if (x+3>thumbconwidth-6) x=thumbconwidth;

											//ANIMATE TO POSITION
											var pos=(0-((x)*steps));
											if (pos>0) pos =0;
											if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
											moveThumbSliderToPosition($this,pos,0);
									//} else {
										//$this.removeClass("over");
									//}

					});

					bullets.parent().mouseleave(function() {
									var $this=jQuery(this);
									$this.removeClass("over");
									moveSelectedThumb(container);
					});*/
				}


		}


		///////////////////////////////
		//	SelectedThumbInPosition //
		//////////////////////////////
		function moveSelectedThumb(container) {

									var bullets=container.parent().find('.tp-bullets.tp-thumbs .tp-mask .tp-thumbcontainer');
									var $this=bullets.parent();
									var offset = $this.offset();
									var minwidth=$this.find('.bullet:first').outerWidth(true);

									var x = $this.find('.bullet.selected').index() * minwidth;
									var thumbconwidth=$this.width();
									var minwidth=$this.find('.bullet:first').outerWidth(true);
									var max=minwidth*container.find('>ul:first >li').length;
									var diff=(max- thumbconwidth);
									var steps = diff / thumbconwidth;

									//ANIMATE TO POSITION
									var pos=0-x;

									if (pos>0) pos =0;
									if (pos<0-max+thumbconwidth) pos=0-max+thumbconwidth;
									if (!$this.hasClass("over")) {
										moveThumbSliderToPosition($this,pos,200);
									}
		}


		////////////////////////////////////
		//	MOVE THUMB SLIDER TO POSITION //
		///////////////////////////////////
		function moveThumbSliderToPosition($this,pos,speed) {
			//$this.stop();
			//$this.find('.tp-thumbcontainer').animate({'left':pos+'px'},{duration:speed,queue:false});
			TweenLite.to($this.find('.tp-thumbcontainer'),0.2,{left:pos,ease:Power3.easeOut,overwrite:"auto"});
		}



		////////////////////////////////
		//	-	CREATE THE BULLETS -  //
		////////////////////////////////
		function createBullets(container,opt) {

			if (opt.navigationType=="bullet"  || opt.navigationType=="both") {
						container.parent().append('<div class="tp-bullets simplebullets '+opt.navigationStyle+'"></div>');
			}
			var bullets = container.parent().find('.tp-bullets');

			container.find('>ul:first >li').each(function(i) {
							var src=container.find(">ul:first >li:eq("+i+") img:first").attr('src');
							bullets.append('<div class="bullet"></div>');
							var bullet= bullets.find('.bullet:first');


				});

			// ADD THE BULLET CLICK FUNCTION HERE
			bullets.find('.bullet').each(function(i) {
				var bul = jQuery(this);
				if (i==opt.slideamount-1) bul.addClass('last');
				if (i==0) bul.addClass('first');

				bul.click(function() {
					var sameslide = false;
					if (opt.navigationArrows=="withbullet" || opt.navigationArrows=="nexttobullets") {
						if (bul.index()-1 == opt.act) sameslide=true;
					} else {
						if (bul.index() == opt.act) sameslide=true;
					}

					if (opt.transition==0 && !sameslide) {

					if (opt.navigationArrows=="withbullet" || opt.navigationArrows=="nexttobullets") {
							opt.next = bul.index()-1;
					} else {
							opt.next = bul.index();
					}

						callingNewSlide(opt,container);
					}
				});

			});

			bullets.append('<div class="tpclear"></div>');



			setBulPos(container,opt);





		}

		//////////////////////
		//	CREATE ARROWS	//
		/////////////////////
		function createArrows(container,opt) {

						var bullets = container.find('.tp-bullets');

						var hidden="";
						var arst= opt.navigationStyle;
						if (opt.navigationArrows=="none") hidden="visibility:hidden;display:none";
						opt.soloArrowStyle = "default";
						
						if (opt.navigationArrows!="none" && opt.navigationArrows!="nexttobullets") arst = opt.soloArrowStyle;
						if(opt.navigation_arrows_style=="default2"){
							arst = "default2";
						}else if(opt.navigation_arrows_style=="new1"){
							arst = "new1";
						}else if(opt.navigation_arrows_style=="new2"){
							arst = "new2";
						}
						container.parent().append('<div style="'+hidden+'" class="tp-leftarrow tparrows '+arst+'"></div>');
						container.parent().append('<div style="'+hidden+'" class="tp-rightarrow tparrows '+arst+'"></div>');

						// 	THE LEFT / RIGHT BUTTON CLICK !	 //
						container.parent().find('.tp-rightarrow').click(function() {

							if (opt.transition==0) {
									if (container.data('showus') !=undefined && container.data('showus') != -1)
										opt.next = container.data('showus')-1;
									else
										opt.next = opt.next+1;
									container.data('showus',-1);
									if (opt.next >= opt.slideamount) opt.next=0;
									if (opt.next<0) opt.next=0;

									if (opt.act !=opt.next)
										callingNewSlide(opt,container);
							}
						});

						container.parent().find('.tp-leftarrow').click(function() {
							if (opt.transition==0) {
									opt.next = opt.next-1;
									opt.leftarrowpressed=1;
									if (opt.next < 0) opt.next=opt.slideamount-1;
									callingNewSlide(opt,container);
							}
						});

						setBulPos(container,opt);

		}

		//////////////////////
		//	CREATE ARROWS	//
		/////////////////////
		function createKeyboard(container,opt) {

						/*
						// 	THE LEFT / RIGHT BUTTON CLICK !	 //
						jQuery(document).keydown(function(e){
							if (opt.transition==0 && e.keyCode == 39) {
									if (container.data('showus') !=undefined && container.data('showus') != -1)
										opt.next = container.data('showus')-1;
									else
										opt.next = opt.next+1;
									container.data('showus',-1);
									if (opt.next >= opt.slideamount) opt.next=0;
									if (opt.next<0) opt.next=0;

									if (opt.act !=opt.next)
										callingNewSlide(opt,container);
							}

							if (opt.transition==0 && e.keyCode == 37) {
									opt.next = opt.next-1;
									opt.leftarrowpressed=1;
									if (opt.next < 0) opt.next=opt.slideamount-1;
									callingNewSlide(opt,container);
							}
						});

						setBulPos(container,opt);*/

		}

		////////////////////////////
		// SET THE SWIPE FUNCTION //
		////////////////////////////
		function swipeAction(container,opt) {
			// TOUCH ENABLED SCROLL
				
				if (opt.touchenabled=="on")
						container.swipe( {data:container,
										swipeRight:function()
												{

													if (opt.transition==0) {
															opt.next = opt.next-1;
															opt.leftarrowpressed=1;
															if (opt.next < 0) opt.next=opt.slideamount-1;
															callingNewSlide(opt,container);
													}
												},
										swipeLeft:function()
												{

													if (opt.transition==0) {
															opt.next = opt.next+1;
															if (opt.next == opt.slideamount) opt.next=0;
															callingNewSlide(opt,container);
													}
												},
										  swipeUp:function(event, direction, distance, duration) {
												if (opt.transition==0) {
															opt.next = opt.next-1;
															opt.leftarrowpressed=1;
															if (opt.next < 0) opt.next=opt.slideamount-1;
															callingNewSlide(opt,container);
												}
										  },
										  swipeDown:function(event, direction, distance, duration) {
												if (opt.transition==0) {
															opt.next = opt.next+1;
															if (opt.next == opt.slideamount) opt.next=0;
															callingNewSlide(opt,container);
													}
										  },
									allowPageScroll:"auto"} );
		}




		////////////////////////////////////////////////////////////////
		// SHOW AND HIDE THE THUMBS IF MOUE GOES OUT OF THE BANNER  ///
		//////////////////////////////////////////////////////////////
		function hideThumbs(container,opt) {

			var bullets = container.parent().find('.tp-bullets');
			var ca = container.parent().find('.tparrows');

			if (bullets==null) {
				container.append('<div class=".tp-bullets"></div>');
				var bullets = container.parent().find('.tp-bullets');
			}

			if (ca==null) {
				container.append('<div class=".tparrows"></div>');
				var ca = container.parent().find('.tparrows');
			}


			//var bp = (thumbs.parent().outerHeight(true) - opt.height)/2;

			//	ADD THUMBNAIL IMAGES FOR THE BULLETS //
			container.data('hidethumbs',opt.hideThumbs);

			bullets.addClass("hidebullets");
			ca.addClass("hidearrows");

			bullets.hover(function() {
				bullets.addClass("hovered");
				clearTimeout(container.data('hidethumbs'));
				bullets.removeClass("hidebullets");
				ca.removeClass("hidearrows");
			},
			function() {

				bullets.removeClass("hovered");
				if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
					container.data('hidethumbs', setTimeout(function() {
					bullets.addClass("hidebullets");
					ca.addClass("hidearrows");
					},opt.hideThumbs));
			});


			ca.hover(function() {
				bullets.addClass("hovered");
				clearTimeout(container.data('hidethumbs'));
				bullets.removeClass("hidebullets");
				ca.removeClass("hidearrows");

			},
			function() {

				bullets.removeClass("hovered");
				});



			container.on('mouseenter', function() {
				container.addClass("hovered");
				clearTimeout(container.data('hidethumbs'));
				bullets.removeClass("hidebullets");
				ca.removeClass("hidearrows");
			});

			container.on('mouseleave', function() {
				container.removeClass("hovered");
				if (!container.hasClass("hovered") && !bullets.hasClass("hovered"))
					container.data('hidethumbs', setTimeout(function() {
							bullets.addClass("hidebullets");
							ca.addClass("hidearrows");
					},opt.hideThumbs));
			});

		}







		//////////////////////////////
		//	SET POSITION OF BULLETS	//
		//////////////////////////////
		function setBulPos(container,opt) {
			var topcont=container.parent();
			var bullets=topcont.find('.tp-bullets');

			if (opt.navigationType=="thumb") {
				bullets.find('.thumb').each(function(i) {
					var thumb = jQuery(this);

					thumb.css({'width':opt.thumbWidth * opt.bw+"px", 'height':opt.thumbHeight*opt.bh+"px"});

				})
				var bup = bullets.find('.tp-mask');

				bup.width(opt.thumbWidth*opt.thumbAmount * opt.bw);
				bup.height(opt.thumbHeight * opt.bh);
				bup.parent().width(opt.thumbWidth*opt.thumbAmount * opt.bw);
				bup.parent().height(opt.thumbHeight * opt.bh);
			}


			var tl = topcont.find('.tp-leftarrow');
			var tr = topcont.find('.tp-rightarrow');

			if (opt.navigationType=="thumb" && opt.navigationArrows=="nexttobullets") opt.navigationArrows="solo";
			// IM CASE WE HAVE NAVIGATION BULLETS TOGETHER WITH ARROWS
			if (opt.navigationArrows=="nexttobullets") {
				tl.prependTo(bullets).css({'float':'left'});
				tr.insertBefore(bullets.find('.tpclear')).css({'float':'left'});
			}
			var loff=0;
			if (opt.forceFullWidth=="on"){
					
				var offset = opt.container.parent().offset();
				if(offset){
					loff = 0-offset.left;
				}
			}

			if (opt.navigationArrows!="none" && opt.navigationArrows!="nexttobullets") {

				tl.css({'position':'absolute'});
				tr.css({'position':'absolute'});


				if (opt.soloArrowLeftValign=="center")	tl.css({'top':'50%','marginTop':(opt.soloArrowLeftVOffset-Math.round(tl.innerHeight()/2))+"px"});
				if (opt.soloArrowLeftValign=="bottom")	tl.css({'top':'auto','bottom':(0+opt.soloArrowLeftVOffset)+"px"});
				if (opt.soloArrowLeftValign=="top")	 	tl.css({'bottom':'auto','top':(0+opt.soloArrowLeftVOffset)+"px"});
				if (opt.soloArrowLeftHalign=="center")	tl.css({'left':'50%','marginLeft':(loff+opt.soloArrowLeftHOffset-Math.round(tl.innerWidth()/2))+"px"});
				if (opt.soloArrowLeftHalign=="left")	tl.css({'left':(0+opt.soloArrowLeftHOffset+loff)+"px"});
				if (opt.soloArrowLeftHalign=="right")	tl.css({'right':(0+opt.soloArrowLeftHOffset-loff)+"px"});

				if (opt.soloArrowRightValign=="center")	tr.css({'top':'50%','marginTop':(opt.soloArrowRightVOffset-Math.round(tr.innerHeight()/2))+"px"});
				if (opt.soloArrowRightValign=="bottom")	tr.css({'top':'auto','bottom':(0+opt.soloArrowRightVOffset)+"px"});
				if (opt.soloArrowRightValign=="top")	tr.css({'bottom':'auto','top':(0+opt.soloArrowRightVOffset)+"px"});
				if (opt.soloArrowRightHalign=="center")	tr.css({'left':'50%','marginLeft':(loff+opt.soloArrowRightHOffset-Math.round(tr.innerWidth()/2))+"px"});
				if (opt.soloArrowRightHalign=="left")	tr.css({'left':(0+opt.soloArrowRightHOffset+loff)+"px"});
				if (opt.soloArrowRightHalign=="right")	tr.css({'right':(0+opt.soloArrowRightHOffset-loff)+"px"});


				//if (tl.position()!=null)
					//tl.css({'top':Math.round(parseInt(tl.position().top,0))+"px"});

				//if (tr.position()!=null)
					//tr.css({'top':Math.round(parseInt(tr.position().top,0))+"px"});
			}

			if (opt.navigationArrows=="none") {
				tl.css({'visibility':'hidden'});
				tr.css({'visibility':'hidden'});
			}

			// SET THE POSITIONS OF THE BULLETS // THUMBNAILS


			if (opt.navigationVAlign=="center")	 bullets.css({'top':'50%','marginTop':(opt.navigationVOffset-Math.round(bullets.innerHeight()/2))+"px"});
			if (opt.navigationVAlign=="bottom")	 bullets.css({'bottom':(0+opt.navigationVOffset)+"px"});
			if (opt.navigationVAlign=="top")	 bullets.css({'top':(0+opt.navigationVOffset)+"px"});

			if (opt.navigationHAlign=="center")	bullets.css({'left':'50%','marginLeft':(loff+opt.navigationHOffset-Math.round(bullets.innerWidth()/2))+"px"});
			if (opt.navigationHAlign=="left")	bullets.css({'left':(0+opt.navigationHOffset+loff)+"px"});
			if (opt.navigationHAlign=="right")	bullets.css({'right':(0+opt.navigationHOffset-loff)+"px"});



		}



		//////////////////////////////////////////////////////////
		//	-	SET THE IMAGE SIZE TO FIT INTO THE CONTIANER -  //
		////////////////////////////////////////////////////////
		function setSize(img,opt) {
				
				
				opt.container.closest('.forcefullwidth_wrapper_tp_banner').find('.tp-fullwidth-forcer').css({'height':opt.container.height()});
				opt.container.closest('.rev_slider_wrapper').css({'height':opt.container.height()});


				opt.width=parseInt(opt.container.width(),0);
				opt.height=parseInt(opt.container.height(),0);


				//opt.height= opt.startheight * opt.bh;
				opt.height = Math.round(opt.startheight * (opt.width/opt.startwidth));
				if (opt.height>opt.startheight && opt.autoHeight!="on") opt.height=opt.startheight;
				
				
				
				opt.bw= (opt.width / opt.startwidth);
				opt.bh = (opt.height / opt.startheight);
				
			

				if (opt.bh>opt.bw) opt.bh=opt.bw;
				if (opt.bh<opt.bw) opt.bw = opt.bh;
				if (opt.bw<opt.bh) opt.bh = opt.bw;
				if (opt.bh>1) { opt.bw=1; opt.bh=1; }
				if (opt.bw>1) {opt.bw=1; opt.bh=1; }

				
			

				



				



				if (opt.fullScreen=="on") {
						opt.height = opt.bw * opt.startheight;
						var cow = opt.container.parent().width();
						var coh = jQuery(window).height();
						if (opt.fullScreenOffsetContainer!=undefined) {
							try{
								var offcontainers = opt.fullScreenOffsetContainer.split(",");
								jQuery.each(offcontainers,function(index,searchedcont) {
									coh = coh - jQuery(searchedcont).outerHeight(true);
									if (coh<opt.minFullScreenHeight) coh=opt.minFullScreenHeight;
								});
							} catch(e) {}
						}

						opt.container.parent().height(coh);
						opt.container.css({'height':'100%'});

						opt.height=coh;

				} else {
										opt.container.height(opt.height);
				}


				opt.slotw=Math.ceil(opt.width/opt.slots);

				if (opt.fullSreen=="on")
					opt.sloth=Math.ceil(jQuery(window).height()/opt.slots);
				else
					opt.sloth=Math.ceil(opt.height/opt.slots);

				if (opt.autoHeight=="on")
				 	opt.sloth=Math.ceil(img.height()/opt.slots);




		}




		/////////////////////////////////////////
		//	-	PREPARE THE SLIDES / SLOTS -  //
		///////////////////////////////////////
		function prepareSlides(container,opt) {

			container.find('.tp-caption').each(function() { jQuery(this).addClass(jQuery(this).data('transition')); jQuery(this).addClass('start') });

			// PREPARE THE UL CONTAINER TO HAVEING MAX HEIGHT AND HEIGHT FOR ANY SITUATION
			container.find('>ul:first').css({overflow:'hidden',width:'100%',height:'100%',maxHeight:container.parent().css('maxHeight')});
			if (opt.autoHeight=="on") {
			   container.find('>ul:first').css({overflow:'hidden',width:'100%',height:'100%',maxHeight:"none"});
			   container.css({'maxHeight':'none'});
			   container.parent().css({'maxHeight':'none'});
			 }

			container.find('>ul:first >li').each(function(j) {
				var li=jQuery(this);

				// MAKE LI OVERFLOW HIDDEN FOR FURTHER ISSUES
				li.css({'width':'100%','height':'100%','overflow':'hidden'});

				if (li.data('link')!=undefined) {
					var link = li.data('link');
					var target="_self";
					var zindex=2;
					if (li.data('slideindex')=="back") zindex=0;

					var linktoslide=li.data('linktoslide');
					if (li.data('target')!=undefined) target=li.data('target');

					if (link=="slide") {
						li.append('<div class="tp-caption sft slidelink" style="z-index:'+zindex+';" data-x="0" data-y="0" data-linktoslide="'+linktoslide+'" data-start="0"><a><div></div></a></div>');
					} else {
						linktoslide="no";
						li.append('<div class="tp-caption sft slidelink" style="z-index:'+zindex+';" data-x="0" data-y="0" data-linktoslide="'+linktoslide+'" data-start="0"><a target="'+target+'" href="'+link+'"><div></div></a></div>');
					}

				}
			});

			// RESOLVE OVERFLOW HIDDEN OF MAIN CONTAINER
			container.parent().css({'overflow':'visible'});


			container.find('>ul:first >li >img').each(function(j) {

				var img=jQuery(this);

				img.addClass('defaultimg');
				if (img.data('lazyload')!=undefined && img.data('lazydone') != 1) {

				} else {
					setSize(img,opt);
				}



				img.wrap('<div class="slotholder" style="width:100%;height:100%;"'+
						  'data-duration="'+img.data('duration')+'"'+
						  'data-zoomstart="'+img.data("zoomstart")+'"'+
						  'data-zoomend="'+img.data("zoomend")+'"'+
						  'data-rotationstart="'+img.data("rotationstart")+'"'+
						  'data-rotationend="'+img.data("rotationend")+'"'+
						  'data-ease="'+img.data("ease")+'"'+
						  'data-duration="'+img.data("duration")+'"'+
						  'data-bgpositionend="'+img.data("bgpositionend")+'"'+
						  'data-bgposition="'+img.data("bgposition")+'"'+
						  'data-duration="'+img.data("duration")+'"'+
						  'data-kenburns="'+img.data("kenburns")+'"'+
						  'data-easeme="'+img.data("ease")+'"'+
						  'data-bgfit="'+img.data("bgfit")+'"'+
						  'data-bgfitend="'+img.data("bgfitend")+'"'+
						  'data-owidth="'+img.data("owidth")+'"'+
						  'data-oheight="'+img.data("oheight")+'"'+
						  '></div>');

				if (opt.dottedOverlay!="none" && opt.dottedOverlay!=undefined)
						img.closest('.slotholder').append('<div class="tp-dottedoverlay '+opt.dottedOverlay+'"></div>');

				var src=img.attr('src');
				var ll = img.data('lazyload');
				var bgfit = img.data('bgfit');
				var bgrepeat = img.data('bgrepeat');
				var bgposition = img.data('bgposition');


				if (bgfit==undefined) bgfit="cover";
				if (bgrepeat==undefined) bgrepeat="no-repeat";
				if (bgposition==undefined) bgposition="center center"


				var pari = img.closest('.slotholder');
				img.replaceWith('<div class="tp-bgimg defaultimg" data-lazyload="'+img.data('lazyload')+'" data-bgfit="'+bgfit+'"data-bgposition="'+bgposition+'" data-bgrepeat="'+bgrepeat+'" data-lazydone="'+img.data('lazydone')+'" data-src="'+src+'" style="background-color:'+img.css("backgroundColor")+';background-repeat:'+bgrepeat+';background-image:url('+src+');background-size:'+bgfit+';background-position:'+bgposition+';width:100%;height:100%;"></div>');

				if (isIE(8)) {
					pari.find('.tp-bgimg').css({backgroundImage:"none",'background-image':'none'});
					pari.find('.tp-bgimg').append('<img class="ieeightfallbackimage defaultimg" src="'+src+'" style="width:100%">');
				}




				img.css({'opacity':0});
				img.data('li-id',j);

			});
		}





		///////////////////////
		// PREPARE THE SLIDE //
		//////////////////////
		function prepareOneSlideSlot(slotholder,opt,visible,vorh) {
				

				var sh=slotholder;
				var img = sh.find('.defaultimg')

				var scalestart = sh.data('zoomstart');
				var rotatestart = sh.data('rotationstart');

				if (img.data('currotate')!=undefined)
					rotatestart = img.data('currotate');
				if (img.data('curscale')!=undefined)
					scalestart = img.data('curscale');
				setSize(img,opt)
				var src = img.data('src');
				var bgcolor=img.css('background-color');

				var w = opt.width;
				var h = opt.height;
				if (opt.autoHeight=="on")
				  h = opt.container.height();

				var fulloff = img.data("fxof");
				if (fulloff==undefined) fulloff=0;

				fullyoff=0;

				var off=0;

				var bgfit = img.data('bgfit');
				var bgrepeat = img.data('bgrepeat');
				var bgposition = img.data('bgposition');

				if (bgfit==undefined) bgfit="cover";
				if (bgrepeat==undefined) bgrepeat="no-repeat";
				if (bgposition==undefined) bgposition="center center";



				if (sh.data('kenburns')=="on") {
				   bgfit=scalestart;
				   if (bgfit.toString().length<4)
					   bgfit = calculateKenBurnScales(bgfit,sh,opt);
				 }

			   if (isIE(8)) {
					var imgsrc=src;
			    	src="";
				}

				if (vorh == "horizontal") {

					if (!visible) var off=0-opt.slotw;

					for (var i=0;i<opt.slots;i++) {
							sh.append('<div class="slot" style="position:absolute;'+
															'top:'+(0+fullyoff)+'px;'+
															'left:'+(fulloff+i*opt.slotw)+'px;'+
															'overflow:hidden;width:'+opt.slotw+'px;'+
															'height:'+h+'px">'+
							'<div class="slotslide" style="position:absolute;'+
															'top:0px;left:'+off+'px;'+
															'width:'+opt.slotw+'px;'+
															'height:'+h+'px;overflow:hidden;">'+
							'<div style="background-color:'+bgcolor+';'+
															'position:absolute;top:0px;'+
															'left:'+(0-(i*opt.slotw))+'px;'+
															'width:'+w+'px;height:'+h+'px;'+
															'background-image:url('+src+');'+
															'background-repeat:'+bgrepeat+';'+
															'background-size:'+bgfit+';background-position:'+bgposition+';">'+
							'</div></div></div>');
							if (scalestart!=undefined && rotatestart!=undefined)
								TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
							if (isIE(8)) {
							   sh.find('.slot ').last().find('.slotslide').append('<img class="ieeightfallbackimage" src="'+imgsrc+'" style="width:100%">');
							   ieimgposition(sh,opt);

						}
					}
				} else {

					if (!visible) var off=0-opt.sloth;

					for (var i=0;i<opt.slots+2;i++) {
						sh.append('<div class="slot" style="position:absolute;'+
												 'top:'+(fullyoff+(i*opt.sloth))+'px;'+
												 'left:'+(fulloff)+'px;'+
												 'overflow:hidden;'+
												 'width:'+w+'px;'+
												 'height:'+(opt.sloth)+'px">'+

									 '<div class="slotslide" style="position:absolute;'+
														 'top:'+(off)+'px;'+
														 'left:0px;width:'+w+'px;'+
														 'height:'+opt.sloth+'px;'+
														 'overflow:hidden;">'+
									'<div style="background-color:'+bgcolor+';'+
															'position:absolute;'+
															'top:'+(0-(i*opt.sloth))+'px;'+
															'left:0px;'+
															'width:'+w+'px;height:'+h+'px;'+
															'background-image:url('+src+');'+
															'background-repeat:'+bgrepeat+';'+
															'background-size:'+bgfit+';background-position:'+bgposition+';">'+

									'</div></div></div>');
							if (scalestart!=undefined && rotatestart!=undefined)
								TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
							if (isIE(8)) {
						    	sh.find('.slot ').last().find('.slotslide').append('<img class="ieeightfallbackimage" src="'+imgsrc+'" style="width:100%">');
						    	ieimgposition(sh,opt);
							}
					}
				}




		}



		///////////////////////
		// PREPARE THE SLIDE //
		//////////////////////
		function prepareOneSlideBox(slotholder,opt,visible) {

				var sh=slotholder;
				var img = sh.find('.defaultimg');

				var scalestart = sh.data('zoomstart');
				var rotatestart = sh.data('rotationstart');

				if (img.data('currotate')!=undefined)
					rotatestart = img.data('currotate');
				if (img.data('curscale')!=undefined)
					scalestart = img.data('curscale')*100;

				setSize(img,opt)
				var src = img.data('src');
				var bgcolor=img.css('backgroundColor');

				var w = opt.width;
				var h = opt.height;
				if (opt.autoHeight=="on")
				  h = opt.container.height();

				var fulloff = img.data("fxof");
				if (fulloff==undefined) fulloff=0;

				fullyoff=0;



				var off=0;


				if (isIE(8)) {
					var imgsrc=src;
			    	src="";
				}

				// SET THE MINIMAL SIZE OF A BOX
				var basicsize = 0;
				if (opt.sloth>opt.slotw)
					basicsize=opt.sloth
				else
					basicsize=opt.slotw;


				if (!visible) {
					var off=0-basicsize;
				}

				opt.slotw = basicsize;
				opt.sloth = basicsize;
				var x=0;
				var y=0;

				var bgfit = img.data('bgfit');
				var bgrepeat = img.data('bgrepeat');
				var bgposition = img.data('bgposition');

				if (bgfit==undefined) bgfit="cover";
				if (bgrepeat==undefined) bgrepeat="no-repeat";
				if (bgposition==undefined) bgposition="center center";

				if (sh.data('kenburns')=="on") {
				   bgfit=scalestart;
				   
				   if (bgfit.toString().length<4)
					   bgfit = calculateKenBurnScales(bgfit,sh,opt);
				 }

				for (var j=0;j<opt.slots;j++) {

					y=0;
					for (var i=0;i<opt.slots;i++) 	{


						sh.append('<div class="slot" '+
								  'style="position:absolute;'+
											'top:'+(fullyoff+y)+'px;'+
											'left:'+(fulloff+x)+'px;'+
											'width:'+basicsize+'px;'+
											'height:'+basicsize+'px;'+
											'overflow:hidden;">'+

								  '<div class="slotslide" data-x="'+x+'" data-y="'+y+'" '+
								  			'style="position:absolute;'+
											'top:'+(0)+'px;'+
											'left:'+(0)+'px;'+
											'width:'+basicsize+'px;'+
											'height:'+basicsize+'px;'+
											'overflow:hidden;">'+

								  '<div style="position:absolute;'+
											'top:'+(0-y)+'px;'+
											'left:'+(0-x)+'px;'+
											'width:'+w+'px;'+
											'height:'+h+'px;'+
											'background-color:'+bgcolor+';'+
											'background-image:url('+src+');'+
											'background-repeat:'+bgrepeat+';'+
											'background-size:'+bgfit+';background-position:'+bgposition+';">'+
								  '</div></div></div>');
						y=y+basicsize;

						if (isIE(8)) {

							sh.find('.slot ').last().find('.slotslide').append('<img src="'+imgsrc+'">');
							ieimgposition(sh,opt);
						}

						if (scalestart!=undefined && rotatestart!=undefined)
								TweenLite.set(sh.find('.slot').last(),{rotationZ:rotatestart});
					}
					x=x+basicsize;
				}
		}

		/***********************************************
			-	MOVE IE8 IMAGE IN RIGHT POSITION	-
		***********************************************/

		function ieimgposition(nextsh,opt) {

			if (isIE(8)) {
					var ie8img = nextsh.find('.ieeightfallbackimage');
					if (opt.startwidth/opt.startheight <nextsh.data('owidth')/nextsh.data('oheight'))
						ie8img.css({width:"auto",height:"100%"})
					else
						ie8img.css({width:"100%",height:"auto"})



					var ie8w = ie8img.width(),
					    ie8h = ie8img.height();

					if (nextsh.data('bgposition')=="center center")
						ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", left:opt.width/2-ie8w/2+"px"});

					if (nextsh.data('bgposition')=="center top" || nextsh.data('bgposition')=="top center")
						ie8img.css({position:"absolute",top:"0px", left:opt.width/2-ie8w/2+"px"});

					if (nextsh.data('bgposition')=="center bottom" || nextsh.data('bgposition')=="bottom center")
						ie8img.css({position:"absolute",bottom:"0px", left:opt.width/2-ie8w/2+"px"});


					if (nextsh.data('bgposition')=="right top" || nextsh.data('bgposition')=="top right")
						ie8img.css({position:"absolute",top:"0px", right:"0px"});

					if (nextsh.data('bgposition')=="right bottom" || nextsh.data('bgposition')=="bottom right")
						ie8img.css({position:"absolute",bottom:"0px", right:"0px"});

					if (nextsh.data('bgposition')=="right center" || nextsh.data('bgposition')=="center right")
						ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", right:"0px"});

					if (nextsh.data('bgposition')=="left bottom" || nextsh.data('bgposition')=="bottom left")
						ie8img.css({position:"absolute",bottom:"0px", left:"0px"});

					if (nextsh.data('bgposition')=="left center" || nextsh.data('bgposition')=="center left")
						ie8img.css({position:"absolute",top:opt.height/2 - ie8h/2+"px", left:"0px"});
				}
		}




		///////////////////////
		//	REMOVE SLOTS	//
		/////////////////////
		function removeSlots(container,opt,time) {
			if (time==undefined)
				time==80

			setTimeout(function() {
				container.find('.slotholder .slot').each(function() {
					clearTimeout(jQuery(this).data('tout'));
					jQuery(this).remove();
				});
				opt.transition = 0;
			},time);
		}





		//////////////////////////////
		//                         //
		//	-	SWAP THE SLIDES -  //
		//                        //
		////////////////////////////
		function swapSlide(container,opt) {
			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}
			opt.lastslide=opt.act;
			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');

			var defimg= nextli.find('.defaultimg');

			if (defimg.data('lazyload') !=undefined && defimg.data('lazyload') !="undefined" && defimg.data('lazydone') !=1 ) {

				defimg.css({backgroundImage:'url("'+nextli.find('.defaultimg').data('lazyload')+'")'});
				defimg.data('src',nextli.find('.defaultimg').data('lazyload'));
				defimg.data('lazydone',1);
				defimg.data('orgw',0);
				nextli.data('loadeddone',1);
				container.find('.tp-loader').css({'display':'block'}).animate({opacity:1,duration:300});
				var limg = new Image();
				limg.onload = function() {
						setTimeout(function() { killBannerTimer(opt,container)},180);

							nextli.waitForImages(function() {

									defimg.data('lazydone',1);
									nextli.data('owidth',limg.width);
									nextli.data('oheight',limg.height);
									nextli.find('.slotholder').data('owidth',limg.width);
									nextli.find('.slotholder').data('oheight',limg.height);


									setTimeout(function() {restartBannerTimer(opt,container)},190);
									setSize(defimg,opt);
									setBulPos(container,opt);
									setSize(defimg,opt);
									swapSlideProgress(container,opt);
									container.find('.tp-loader').animate({opacity:0,duration:300});

									setTimeout(function() {
										container.find('.tp-loader').css({'display':'none'});

									},2200)
														});
						}
				limg.src=nextli.find('.defaultimg').data('lazyload');

			} else {
				if (nextli.data('loadeddone')==undefined) {
						var limg = new Image();
						limg.onload = function() {
									nextli.data('loadeddone',1);
									nextli.data('owidth',limg.width);
									nextli.data('oheight',limg.height);
									nextli.find('.slotholder').data('owidth',limg.width);
									nextli.find('.slotholder').data('oheight',limg.height);


									nextli.waitForImages(function() {
											setSize(defimg,opt);
											setBulPos(container,opt);
											setSize(defimg,opt);
											swapSlideProgress(container,opt);
										});
								}
						limg.src=nextli.find('.defaultimg').data('src');
				} else {
				   	swapSlideProgress(container,opt);
				 }
			}
		}

		/******************************
			-	SWAP SLIDE PROGRESS	-
		********************************/
		/*!SWAP SLIDE*/
		function swapSlideProgress(container,opt) {


	
			container.trigger('revolution.slide.onbeforeswap');

			opt.transition = 1;
			opt.videoplaying = false;
			//konsole.log("VideoPlay set to False due swapSlideProgress");

			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}

			opt.lastslide=opt.act;

			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');
		

			var actsh = actli.find('.slotholder');
			var nextsh = nextli.find('.slotholder');
			actli.css({'visibility':'visible'});
			nextli.css({'visibility':'visible'});

			if (nextsh.data('kenburns')=="on")
				stopKenBurn(container,opt);


			if (opt.ie) {
				if (comingtransition=="boxfade") comingtransition = "boxslide";
				if (comingtransition=="slotfade-vertical") comingtransition = "slotzoom-vertical";
				if (comingtransition=="slotfade-horizontal") comingtransition = "slotzoom-horizontal";
			}


			// IF DELAY HAS BEEN SET VIA THE SLIDE, WE TAKE THE NEW VALUE, OTHER WAY THE OLD ONE...
			if (nextli.data('delay')!=undefined) {
						opt.cd=0;
						opt.delay=nextli.data('delay');
			} else {
				opt.delay=opt.origcd;
			}

			// RESET POSITION AND FADES OF LI'S
			actli.css({'left':'0px','top':'0px'});
			nextli.css({'left':'0px','top':'0px'});


			// IF THERE IS AN OTHER FIRST SLIDE START HAS BEED SELECTED
			if (nextli.data('differentissplayed') =='prepared') {
				nextli.data('differentissplayed','done');
				nextli.data('transition',nextli.data('savedtransition'));
				nextli.data('slotamount',nextli.data('savedslotamount'));
				nextli.data('masterspeed',nextli.data('savedmasterspeed'));
			}


			if (nextli.data('fstransition') != undefined && nextli.data('differentissplayed') !="done") {
				nextli.data('savedtransition',nextli.data('transition'));
				nextli.data('savedslotamount',nextli.data('slotamount'));
				nextli.data('savedmasterspeed',nextli.data('masterspeed'));

				nextli.data('transition',nextli.data('fstransition'));
				nextli.data('slotamount',nextli.data('fsslotamount'));
				nextli.data('masterspeed',nextli.data('fsmasterspeed'));

				nextli.data('differentissplayed','prepared');
			}

			///////////////////////////////////////
			// TRANSITION CHOOSE - RANDOM EFFECTS//
			///////////////////////////////////////
			var nexttrans = 0;


			var transtext = nextli.data('transition').split(",");
			var curtransid = nextli.data('nexttransid');
			if (curtransid == undefined) {
			  curtransid=0;
			  nextli.data('nexttransid',curtransid);
			} else {
				curtransid=curtransid+1;
				if (curtransid==transtext.length) curtransid=0;
				nextli.data('nexttransid',curtransid);

			}



			var comingtransition = transtext[curtransid];
			if(jQuery(window).width()<768 && opt.forceFullWidth=="on"){
				comingtransition = "slideup";		
			}
			
			var specials = 0;

			/*if (opt.ffnn == undefined) opt.ffnn=0;
			comingtransition=opt.ffnn;
			opt.ffnn=opt.ffnn+1;
			if (opt.ffnn>46) opt.ffnn=0;*/


			/* Transition Name ,
			   Transition Code,
			   Transition Sub Code,
			   Max Slots,
			   MasterSpeed Delays,
			   Preparing Slots (box,slideh, slidev),
			   Call on nextsh (null = no, true/false for visibility first preparing),
			   Call on actsh (null = no, true/false for visibility first preparing),
			*/

			if (comingtransition=="slidehorizontal") {
						comingtransition = "slideleft"
					if (opt.leftarrowpressed==1)
						comingtransition = "slideright"
				}

			if (comingtransition=="slidevertical") {
						comingtransition = "slideup"
					if (opt.leftarrowpressed==1)
						comingtransition = "slidedown"
				}


			var transitionsArray = [ ['boxslide' , 0, 1, 10, 0,'box',false,null,0],
									 ['boxfade', 1, 0, 10, 0,'box',false,null,1],
									 ['slotslide-horizontal', 2, 0, 0, 200,'horizontal',true,false,2],
									 ['slotslide-vertical', 3, 0,0,200,'vertical',true,false,3],
									 ['curtain-1', 4, 3,0,0,'horizontal',true,true,4],
									 ['curtain-2', 5, 3,0,0,'horizontal',true,true,5],
									 ['curtain-3', 6, 3,25,0,'horizontal',true,true,6],
									 ['slotzoom-horizontal', 7, 0,0,400,'horizontal',true,true,7],
									 ['slotzoom-vertical', 8, 0,0,0,'vertical',true,true,8],
									 ['slotfade-horizontal', 9, 0,0,500,'horizontal',true,null,9],
									 ['slotfade-vertical', 10, 0,0 ,500,'vertical',true,null,10],
									 ['fade', 11, 0, 1 ,300,'horizontal',true,null,11],
									 ['slideleft', 12, 0,1,0,'horizontal',true,true,12],
									 ['slideup', 13, 0,1,0,'horizontal',true,true,13],
									 ['slidedown', 14, 0,1,0,'horizontal',true,true,14],
									 ['slideright', 15, 0,1,0,'horizontal',true,true,15],
									 ['papercut', 16, 0,0,600,'',null,null,16],
									 ['3dcurtain-horizontal', 17, 0,20,100,'vertical',false,true,17],
									 ['3dcurtain-vertical', 18, 0,10,100,'horizontal',false,true,18],
									 ['cubic', 19, 0,20,600,'horizontal',false,true,19],
									 ['cube',19,0,20,600,'horizontal',false,true,20],
									 ['flyin', 20, 0,4,600,'vertical',false,true,21],
									 ['turnoff', 21, 0,1,1600,'horizontal',false,true,22],
									 ['incube', 22, 0,20,600,'horizontal',false,true,23],
									 ['cubic-horizontal', 23, 0,20,500,'vertical',false,true,24],
									 ['cube-horizontal', 23, 0,20,500,'vertical',false,true,25],
									 ['incube-horizontal', 24, 0,20,500,'vertical',false,true,26],
									 ['turnoff-vertical', 25, 0,1,1600,'horizontal',false,true,27],
									 ['fadefromright', 12, 1,1,0,'horizontal',true,true,28],
									 ['fadefromleft', 15, 1,1,0,'horizontal',true,true,29],
									 ['fadefromtop', 14, 1,1,0,'horizontal',true,true,30],
									 ['fadefrombottom', 13, 1,1,0,'horizontal',true,true,31],
									 ['fadetoleftfadefromright', 12, 2,1,0,'horizontal',true,true,32],
									 ['fadetorightfadetoleft', 15, 2,1,0,'horizontal',true,true,33],
									 ['fadetobottomfadefromtop', 14, 2,1,0,'horizontal',true,true,34],
									 ['fadetotopfadefrombottom', 13, 2,1,0,'horizontal',true,true,35],
									 ['parallaxtoright', 12, 3,1,0,'horizontal',true,true,36],
									 ['parallaxtoleft', 15, 3,1,0,'horizontal',true,true,37],
									 ['parallaxtotop', 14, 3,1,0,'horizontal',true,true,38],
									 ['parallaxtobottom', 13, 3,1,0,'horizontal',true,true,39],
									 ['scaledownfromright', 12, 4,1,0,'horizontal',true,true,40],
									 ['scaledownfromleft', 15, 4,1,0,'horizontal',true,true,41],
									 ['scaledownfromtop', 14, 4,1,0,'horizontal',true,true,42],
									 ['scaledownfrombottom', 13, 4,1,0,'horizontal',true,true,43],
									 ['zoomout', 13, 5,1,0,'horizontal',true,true,44],
									 ['zoomin', 13, 6,1,0,'horizontal',true,true,45],
									 ['notransition',26,0,1,0,'horizontal',true,null,46]
								   ];


			var flatTransitions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
			var premiumTransitions = [16,17,18,19,20,21,22,23,24,25,26,27]

			var nexttrans =0;
			var specials = 1;
			var STAindex = 0;
			var indexcounter =0;
			var STA = new Array;
			

			// RANDOM TRANSITIONS
			if (comingtransition == "random") {
				comingtransition = Math.round(Math.random()*transitionsArray.length-1);
				if (comingtransition>transitionsArray.length-1) comingtransition=transitionsArray.length-1;
			}

			// RANDOM FLAT TRANSITIONS
			if (comingtransition == "random-static") {
				comingtransition = Math.round(Math.random()*flatTransitions.length-1);
				if (comingtransition>flatTransitions.length-1) comingtransition=flatTransitions.length-1;
				comingtransition = flatTransitions[comingtransition];
			}

			// RANDOM PREMIUM TRANSITIONS
			if (comingtransition == "random-premium") {
				comingtransition = Math.round(Math.random()*premiumTransitions.length-1);
				if (comingtransition>premiumTransitions.length-1) comingtransition=premiumTransitions.length-1;
				comingtransition = premiumTransitions[comingtransition];
			}

			findTransition();

			// CHECK IF WE HAVE IE8 AND THAN FALL BACK ON FLAT TRANSITIONS
			if (isIE(8) && nexttrans>15 && nexttrans<28) {
				comingtransition = Math.round(Math.random()*flatTransitions.length-1);
				if (comingtransition>flatTransitions.length-1) comingtransition=flatTransitions.length-1;
				comingtransition = flatTransitions[comingtransition];
				indexcounter =0;
				findTransition();
			}

			function findTransition() {
				// FIND THE RIGHT TRANSITION PARAMETERS HERE
				jQuery.each(transitionsArray,function(inde,trans) {
					if (trans[0] == comingtransition || trans[8] == comingtransition) {
						nexttrans = trans[1];
						specials = trans[2];
						STAindex = indexcounter;
					}
					indexcounter = indexcounter+1;
				})
			}



		    var direction=-1;
			if (opt.leftarrowpressed==1 || opt.act>opt.next) direction=1;



			opt.leftarrowpressed=0;

			if (nexttrans>26) nexttrans = 26;
			if (nexttrans<0) nexttrans = 0;


			// DEFINE THE MASTERSPEED FOR THE SLIDE //
			var masterspeed=300;
			if (nextli.data('masterspeed')!=undefined && nextli.data('masterspeed')>99 && nextli.data('masterspeed')<4001)
				masterspeed = nextli.data('masterspeed');

			// PREPARED DEFAULT SETTINGS PER TRANSITION
			STA = transitionsArray[STAindex];





			/////////////////////////////////////////////
			// SET THE BULLETS SELECTED OR UNSELECTED  //
			/////////////////////////////////////////////


			container.parent().find(".bullet").each(function() {
				var bul = jQuery(this);
				bul.removeClass("selected");

				if (opt.navigationArrows=="withbullet" || opt.navigationArrows=="nexttobullets") {
					if (bul.index()-1 == opt.next) bul.addClass('selected');

				} else {

					if (bul.index() == opt.next)  bul.addClass('selected');

				}
			});



			//////////////////////////////////////////////////////////////////
			// 		SET THE NEXT CAPTION AND REMOVE THE LAST CAPTION		//
			//////////////////////////////////////////////////////////////////

					container.find('>li').each(function() {
						var li = jQuery(this);
						if (li.index!=opt.act && li.index!=opt.next) li.css({'z-index':16});
					});

					actli.css({'z-index':18});
					nextli.css({'z-index':20});
					nextli.css({'opacity':0});


			///////////////////////////
			//	ANIMATE THE CAPTIONS //
			///////////////////////////

			if (actli.index() != nextli.index() && opt.firststart!=1) {
				removeTheCaptions(actli,opt);

			}
		
			animateTheCaptions(nextli, opt);




			/////////////////////////////////////////////
			//	SET THE ACTUAL AMOUNT OF SLIDES !!     //
			//  SET A RANDOM AMOUNT OF SLOTS          //
			///////////////////////////////////////////
						if (nextli.data('slotamount')==undefined || nextli.data('slotamount')<1) {
							opt.slots=Math.round(Math.random()*12+4);
							if (comingtransition=="boxslide")
								opt.slots=Math.round(Math.random()*6+3);
							else
							if (comingtransition=="flyin")
								opt.slots=Math.round(Math.random()*4+1);
						 } else {
							opt.slots=nextli.data('slotamount');

						}

			/////////////////////////////////////////////
			//	SET THE ACTUAL AMOUNT OF SLIDES !!     //
			//  SET A RANDOM AMOUNT OF SLOTS          //
			///////////////////////////////////////////
						if (nextli.data('rotate')==undefined)
							opt.rotate = 0
						 else
							if (nextli.data('rotate')==999)
								opt.rotate=Math.round(Math.random()*360);
							 else
							    opt.rotate=nextli.data('rotate');
						if (!jQuery.support.transition  || opt.ie || opt.ie9) opt.rotate=0;



			//////////////////////////////
			//	FIRST START 			//
			//////////////////////////////

			if (opt.firststart==1) {
					actli.css({'opacity':0});
					opt.firststart=0;
			}


			// HERE COMES THE TRANSITION ENGINE

			// ADJUST MASTERSPEED
			masterspeed = masterspeed + STA[4];

			if ((nexttrans==4 || nexttrans==5 || nexttrans==6) && opt.slots<3 ) opt.slots=3;

			// ADJUST SLOTS
			if (STA[3] != 0) opt.slots = Math.min(opt.slots,STA[3]);
			if (nexttrans==9) opt.slots = opt.width/20;
			if (nexttrans==10) opt.slots = opt.height/20;




			// PREPAREONESLIDEBOX
			if (STA[5] == "box") {
				if (STA[7] !=null) prepareOneSlideBox(actsh,opt,STA[7]);
				if (STA[6] !=null) prepareOneSlideBox(nextsh,opt,STA[6]);
			} else

			if (STA[5] == "vertical" || STA[5] == "horizontal") {
				if (STA[7] !=null) prepareOneSlideSlot(actsh,opt,STA[7],STA[5]);
				if (STA[6] !=null) prepareOneSlideSlot(nextsh,opt,STA[6],STA[5]);
			}

			// SHOW FIRST LI
			if (nexttrans<12 || nexttrans>16)  nextli.css({'opacity':1});


			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==0) {								// BOXSLIDE
						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

						var maxz = Math.ceil(opt.height/opt.sloth);
						var curz = 0;
						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							curz=curz+1;
							if (curz==maxz) curz=0;

							TweenLite.fromTo(ss,(masterspeed)/600,
												{opacity:0,top:(0-opt.sloth),left:(0-opt.slotw),rotation:opt.rotate},
												{opacity:1,transformPerspective:600,top:0,left:0,scale:1,rotation:0,delay:((j)*15 + (curz)*30)/1500, ease:Power2.easeOut,onComplete:function() {
																if (j==(opt.slots*opt.slots)-1) {
																		letItFree(container,opt,nextsh,actsh,nextli,actli)
																	}

												}});
						});
			}
			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==1) {


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

						var maxtime;

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							rand=Math.random()*masterspeed+300;
							rand2=Math.random()*500+200;

							if (rand+rand2>maxtime) maxtime = rand2+rand2;


							TweenLite.fromTo(ss,rand/1000,
										{opacity:0,transformPerspective:600,rotation:opt.rotate},
										{opacity:1, ease:Power2.easeInOut,rotation:0,delay:rand2/1000})



						});

						setTimeout(function() {
											letItFree(container,opt,nextsh,actsh,nextli,actli)
								},masterspeed+300);

			}


			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==2) {


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});

						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this);

									TweenLite.to(ss,masterspeed/1000,{left:opt.slotw, rotation:(0-opt.rotate),onComplete:function() {
															letItFree(container,opt,nextsh,actsh,nextli,actli)

									}});

						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function() {
							var ss=jQuery(this);

								TweenLite.fromTo(ss,masterspeed/1000,
												{left:0-opt.slotw, rotation:opt.rotate,transformPerspective:600},
												{left:0, rotation:0,ease:Power2.easeOut,onComplete:function() {
															letItFree(container,opt,nextsh,actsh,nextli,actli)
														}
									});

						});
			}



			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==3) {


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});

						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this);
									TweenLite.to(ss,masterspeed/1000,{top:opt.sloth,rotation:opt.rotate,transformPerspective:600,onComplete:function() {
															letItFree(container,opt,nextsh,actsh,nextli,actli)
									}});

						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function() {
							var ss=jQuery(this);

								TweenLite.fromTo(ss,masterspeed/1000,
												{top:0-opt.sloth,rotation:opt.rotate,transformPerspective:600},
												{top:0,rotation:0,ease:Power2.easeOut,onComplete:function() {
													letItFree(container,opt,nextsh,actsh,nextli,actli)
								}});

						});
			}



			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==4 || nexttrans==5) {

						//SET DEFAULT IMG UNVISIBLE




						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);



						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						var cspeed = (masterspeed)/1000;
						var ticker = cspeed;



						actsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							var del = (i*cspeed)/opt.slots;
							if (nexttrans==5) del = ((opt.slots-i-1)*cspeed)/(opt.slots)/1.5;
							TweenLite.to(ss,cspeed*3,{transformPerspective:600,top:0+opt.height,opacity:0.5,rotation:opt.rotate,ease:Power2.easeInOut,delay:del});
						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							var del = (i*cspeed)/opt.slots;
							if (nexttrans==5) del = ((opt.slots-i-1)*cspeed)/(opt.slots)/1.5;
							TweenLite.fromTo(ss,cspeed*3,
											{top:(0-opt.height),opacity:0.5,rotation:opt.rotate,transformPerspective:600},
											{top:0,opacity:1,rotation:0,ease:Power2.easeInOut,delay:del,onComplete:function() {
													if (i==opt.slots-1) {
																letItFree(container,opt,nextsh,actsh,nextli,actli)
													}
							}});

						});


			}




			/////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION I.  //
			////////////////////////////////////
			if (nexttrans==6) {


						if (opt.slots<2) opt.slots=2;

						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);

						actsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);

							if (i<opt.slots/2)
								var tempo = (i+2)*60;
							else
								var tempo = (2+opt.slots-i)*60;

							TweenLite.to(ss,(masterspeed+tempo)/1000,{top:0+opt.height,opacity:1,rotation:opt.rotate,transformPerspective:600,ease:Power2.easeInOut});


						});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);

							if (i<opt.slots/2)
								var tempo = (i+2)*60;
							else
								var tempo = (2+opt.slots-i)*60;

									TweenLite.fromTo(ss,(masterspeed+tempo)/1000,
													{top:(0-opt.height),opacity:1,rotation:opt.rotate,transformPerspective:600},
													{top:(0),opacity:1,rotation:0,ease:Power2.easeInOut,onComplete:function() {
															if (i==Math.round(opt.slots/2)) {
																letItFree(container,opt,nextsh,actsh,nextli,actli)
															}
									}});




						});
			}


			////////////////////////////////////
			// THE SLOTSZOOM - TRANSITION II. //
			////////////////////////////////////
			if (nexttrans==7) {

						masterspeed = masterspeed *2;

						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this).find('div');
							TweenLite.to(ss,masterspeed/1000,{
									left:(0-opt.slotw/2)+'px',
									top:(0-opt.height/2)+'px',
									width:(opt.slotw*2)+"px",
									height:(opt.height*2)+"px",
									opacity:0,
									rotation:opt.rotate,
									transformPerspective:600,
									ease:Power2.easeOut});

						});

						//////////////////////////////////////////////////////////////
						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
						///////////////////////////////////////////////////////////////
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this).find('div');

							TweenLite.fromTo(ss,masterspeed/1000,
										{left:0,top:0,opacity:0,transformPerspective:600},
										{left:(0-i*opt.slotw)+'px',
										 ease:Power2.easeOut,
									     top:(0)+'px',
									     width:opt.width,
									     height:opt.height,
										 opacity:1,rotation:0,
										 delay:0.1,
										 onComplete:function() {
												letItFree(container,opt,nextsh,actsh,nextli,actli)
										 }
										});
						});
			}




			////////////////////////////////////
			// THE SLOTSZOOM - TRANSITION II. //
			////////////////////////////////////
			if (nexttrans==8) {

						masterspeed = masterspeed * 3;

						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});


						// ALL OLD SLOTS SHOULD BE SLIDED TO THE RIGHT
						actsh.find('.slotslide').each(function() {
							var ss=jQuery(this).find('div');

									TweenLite.to(ss,masterspeed/1000,
												  {left:(0-opt.width/2)+'px',
												   top:(0-opt.sloth/2)+'px',
												   width:(opt.width*2)+"px",
												   height:(opt.sloth*2)+"px",
												   transformPerspective:600,
												   opacity:0,rotation:opt.rotate

													});

						});


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT //
						///////////////////////////////////////////////////////////////
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this).find('div');

									TweenLite.fromTo(ss,masterspeed/1000,
												  {left:0, top:0,opacity:0,transformPerspective:600},
												  {'left':(0)+'px',
												   'top':(0-i*opt.sloth)+'px',
												   'width':(nextsh.find('.defaultimg').data('neww'))+"px",
												   'height':(nextsh.find('.defaultimg').data('newh'))+"px",
												   opacity:1,rotation:0,
												   onComplete:function() {
															letItFree(container,opt,nextsh,actsh,nextli,actli)
													}});

						});
			}


			////////////////////////////////////////
			// THE SLOTSFADE - TRANSITION III.   //
			//////////////////////////////////////
			if (nexttrans==9 || nexttrans==10) {


						nextsh.find('.defaultimg').css({'opacity':0});

						var ssamount=0;
						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							ssamount++;
							TweenLite.fromTo(ss,masterspeed/1000,{opacity:0,transformPerspective:600,left:0,top:0},{opacity:1,ease:Power2.easeInOut,delay:(i*4)/1000});

						});

						//nextsh.find('.defaultimg').transition({'opacity':1},(masterspeed+(ssamount*4)));

						setTimeout(function() {
									letItFree(container,opt,nextsh,actsh,nextli,actli)
							},(masterspeed+(ssamount*4)));
			}


			///////////////////////////
			// SIMPLE FADE ANIMATION //
			///////////////////////////

			if (nexttrans==11 || nexttrans==26) {


						nextsh.find('.defaultimg').css({'opacity':0,'position':'relative'});

						var ssamount=0;
						if (nexttrans==26) masterspeed=0;

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						nextsh.find('.slotslide').each(function(i) {
							var ss=jQuery(this);
							TweenLite.fromTo(ss,masterspeed/1000,{opacity:0},{opacity:1,ease:Power2.easeInOut});
						});

						setTimeout(function() {
									letItFree(container,opt,nextsh,actsh,nextli,actli)
							},masterspeed+15);
			}






			if (nexttrans==12 || nexttrans==13 || nexttrans==14 || nexttrans==15) {

						//masterspeed = masterspeed * 3;


						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						nextsh.find('.defaultimg').css({'opacity':0});

					//	kill();

						var oow = opt.width;
						var ooh = opt.height;


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						var ssn=nextsh.find('.slotslide')

						if (opt.fullWidth=="on" || opt.fullSreen=="on") {
							oow=ssn.width();
							ooh=ssn.height();
						}
						var twx = 0;
						var twy = 0;

						if (nexttrans==12)
							twx = oow;
						else
						if (nexttrans==15)
							twx = 0-oow;
						else
						if (nexttrans==13)
							twy = ooh;
						else
						if (nexttrans==14)
							twy = 0-ooh;

						// SPECIALS FOR EXTENDED ANIMATIONS
						var op = 1;
						var scal = 1;
						var fromscale = 1;
						var easeitout = Power2.easeInOut;
						var easeitin = Power2.easeInOut;
						var speedy = masterspeed/1000;
						var speedy2 = speedy;

						// DEPENDING ON EXTENDED SPECIALS, DIFFERENT SCALE AND OPACITY FUNCTIONS NEED TO BE ADDED
						if (specials == 1) op = 0;
						if (specials == 2) op = 0;
						if (specials == 3) {
								easeitout = Power2.easeInOut;
								easeitin = Power1.easeInOut;
								actli.css({'position':'absolute','z-index':20});
								nextli.css({'position':'absolute','z-index':15});
								speedy = masterspeed / 1200;
						}

						if (specials==4 || specials==5)
							scal=0.6;
						if (specials==6 )
							scal=1.4;


						if (specials==5 || specials==6) {
						    fromscale=1.4;
						    op=0;
						    oow=0;
						    ooh=0;twx=0;twy=0;
						 }
						if (specials==6) fromscale=0.6;



						TweenLite.fromTo(ssn,speedy,
										{left:twx, top:twy, scale:fromscale, opacity:op,rotation:opt.rotate},
										{opacity:1,rotation:0,left:0,top:0,scale:1,ease:easeitin,onComplete:function() {
														letItFree(container,opt,nextsh,actsh,nextli,actli);
														actli.css({'position':'absolute','z-index':18});
														nextli.css({'position':'absolute','z-index':20});
												}

										});

						var ssa=actsh.find('.slotslide');

						if (specials==4 || specials==5) {
							oow = 0; ooh=0;
						}

						if (specials!=1) {
								if (nexttrans==12)
									TweenLite.to(ssa,speedy2,{'left':(0-oow)+'px',scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout});
								else
								if (nexttrans==15)
									TweenLite.to(ssa,speedy2,{'left':(oow)+'px',scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout});
								else
								if (nexttrans==13)
									TweenLite.to(ssa,speedy2,{'top':(0-ooh)+'px',scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout});
								else
								if (nexttrans==14)
									TweenLite.to(ssa,speedy2,{'top':(ooh)+'px',scale:scal,opacity:op,rotation:opt.rotate,ease:easeitout});
						}
						nextli.css({'opacity':1});

			}


			//////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVI.  //
			//////////////////////////////////////
			if (nexttrans==16) {						// PAPERCUT



					actli.css({'position':'absolute','z-index':20});
					nextli.css({'position':'absolute','z-index':15});


					// PREPARE THE CUTS
					actli.wrapInner('<div class="tp-half-one" style="position:relative; width:100%;height:100%"></div>');

					actli.find('.tp-half-one').clone(true).appendTo(actli).addClass("tp-half-two");
					actli.find('.tp-half-two').removeClass('tp-half-one');

					var oow = opt.width;
					var ooh = opt.height;
					if (opt.autoHeight=="on")
						ooh = container.height();


					actli.find('.tp-half-one .defaultimg').wrap('<div class="tp-papercut" style="width:'+oow+'px;height:'+ooh+'px;"></div>')

					actli.find('.tp-half-two .defaultimg').wrap('<div class="tp-papercut" style="width:'+oow+'px;height:'+ooh+'px;"></div>')

					actli.find('.tp-half-two .defaultimg').css({position:'absolute',top:'-50%'});

					actli.find('.tp-half-two .tp-caption').wrapAll('<div style="position:absolute;top:-50%;left:0px"></div>');

					TweenLite.set(actli.find('.tp-half-two'),
					                 {width:oow,height:ooh,overflow:'hidden',zIndex:15,position:'absolute',top:ooh/2,left:'0px',transformPerspective:600,transformOrigin:"center bottom"});

					TweenLite.set(actli.find('.tp-half-one'),
					                 {width:oow,height:ooh/2,overflow:'visible',zIndex:10,position:'absolute',top:'0px',left:'0px',transformPerspective:600,transformOrigin:"center top"});



					// ANIMATE THE CUTS
					var img=actli.find('.defaultimg');


					var ro1=Math.round(Math.random()*20-10);
					var ro2=Math.round(Math.random()*20-10);
					var ro3=Math.round(Math.random()*20-10);
					var xof = Math.random()*0.4-0.2;
					var yof = Math.random()*0.4-0.2;
					var sc1=Math.random()*1+1;
					var sc2=Math.random()*1+1;


					TweenLite.fromTo(actli.find('.tp-half-one'),masterspeed/1000,
					                 {width:oow,height:ooh/2,position:'absolute',top:'0px',left:'0px',transformPerspective:600,transformOrigin:"center top"},
					                 {scale:sc1,rotation:ro1,y:(0-ooh-ooh/4),ease:Power2.easeInOut});
					setTimeout(function() {
						TweenLite.set(actli.find('.tp-half-one'),{overflow:'hidden'});
					},50);
					TweenLite.fromTo(actli.find('.tp-half-one'),masterspeed/2000,{opacity:1,transformPerspective:600,transformOrigin:"center center"},{opacity:0,delay:masterspeed/2000});

					TweenLite.fromTo(actli.find('.tp-half-two'),masterspeed/1000,
					                 {width:oow,height:ooh,overflow:'hidden',position:'absolute',top:ooh/2,left:'0px',transformPerspective:600,transformOrigin:"center bottom"},
					                 {scale:sc2,rotation:ro2,y:ooh+ooh/4,ease:Power2.easeInOut});

					TweenLite.fromTo(actli.find('.tp-half-two'),masterspeed/2000,{opacity:1,transformPerspective:600,transformOrigin:"center center"},{opacity:0,delay:masterspeed/2000});

					if (actli.html()!=null)
						TweenLite.fromTo(nextli,(masterspeed-200)/1000,{opacity:0,scale:0.8,x:opt.width*xof, y:ooh*yof,rotation:ro3,transformPerspective:600,transformOrigin:"center center"},{rotation:0,scale:1,x:0,y:0,opacity:1,ease:Power2.easeInOut});

					nextsh.find('.defaultimg').css({'opacity':1});
					setTimeout(function() {


								// CLEAN UP BEFORE WE START
								actli.css({'position':'absolute','z-index':18});
								nextli.css({'position':'absolute','z-index':20});
								nextsh.find('.defaultimg').css({'opacity':1});
								actsh.find('.defaultimg').css({'opacity':0});
								if (actli.find('.tp-half-one').length>0)  {
									actli.find('.tp-half-one .defaultimg').unwrap();
									actli.find('.tp-half-one .slotholder').unwrap();

								}
								actli.find('.tp-half-two').remove();
								opt.transition = 0;
								opt.act = opt.next;

					},masterspeed);
					nextli.css({'opacity':1});

			}

			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVII.  //
			///////////////////////////////////////
			if (nexttrans==17) {								// 3D CURTAIN HORIZONTAL


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT


						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							TweenLite.fromTo(ss,(masterspeed)/800,
											{opacity:0,rotationY:0,scale:0.9,rotationX:-110,transformPerspective:600,transformOrigin:"center center"},
											{opacity:1,top:0,left:0,scale:1,rotation:0,rotationX:0,rotationY:0,ease:Power3.easeOut,delay:j*0.06,onComplete:function() {
													if (j==opt.slots-1) letItFree(container,opt,nextsh,actsh,nextli,actli)
											}});

						});
			}



			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XVIII.  //
			///////////////////////////////////////
			if (nexttrans==18) {								// 3D CURTAIN VERTICAL


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});


						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							TweenLite.fromTo(ss,(masterspeed)/500,
											{opacity:0,rotationY:310,scale:0.9,rotationX:10,transformPerspective:600,transformOrigin:"center center"},
											{opacity:1,top:0,left:0,scale:1,rotation:0,rotationX:0,rotationY:0,ease:Power3.easeOut,delay:j*0.06,onComplete:function() {
													if (j==opt.slots-1)
														letItFree(container,opt,nextsh,actsh,nextli,actli)
											}});

						});



			}


			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XIX.  //
			///////////////////////////////////////


			if (nexttrans==19 || nexttrans==22) {								// IN CUBE


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index');
						var chix2=actli.css('z-index');

						var rot = 90;
						var op = 1;
						if (direction==1) rot = -90;

						if (nexttrans==19) {
							var torig = "center center -"+opt.height/2;
							op=0;

						} else {
							var torig = "center center "+opt.height/2;

						}

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT

						//if (nexttrans==129) {
							TweenLite.fromTo(nextsh,masterspeed/2000,{transformPerspective:600,z:0,x:0,rotationY:0},{rotationY:1,ease:Power1.easeInOut,z:-40});
							TweenLite.fromTo(nextsh,masterspeed/2000,{transformPerspective:600,z:-40,rotationY:1},{rotationY:0,z:0,ease:Power1.easeInOut,x:0,delay:3*(masterspeed/4000)});
							TweenLite.fromTo(actsh,masterspeed/2000,{transformPerspective:600,z:0,x:0,rotationY:0},{rotationY:1,x:0,ease:Power1.easeInOut,z:-40});
							TweenLite.fromTo(actsh,masterspeed/2000,{transformPerspective:600,z:-40,x:0,rotationY:1},{rotationY:0,z:0,x:0,ease:Power1.easeInOut,delay:3*(masterspeed/4000)});
						//}

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							TweenLite.fromTo(ss,masterspeed/1000,
											{left:0,rotationY:opt.rotate,opacity:op,top:0,scale:0.8,transformPerspective:600,transformOrigin:torig,rotationX:rot},
											{left:0,rotationY:0,opacity:1,top:0,z:0, scale:1,rotationX:0, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli)
															}
											});
							TweenLite.to(ss,0.1,{opacity:1,delay:(j*50)/1000+masterspeed/3000});

						});

						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							var rot = -90;
							if (direction==1) rot = 90;

							TweenLite.fromTo(ss,masterspeed/1000,
											{opacity:1,rotationY:0,top:0,z:0,scale:1,transformPerspective:600,transformOrigin:torig, rotationX:0},
											{opacity:1,rotationY:opt.rotate,top:0, scale:0.8,rotationX:rot, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli)
															}
											});
							TweenLite.to(ss,0.1,{opacity:0,delay:(j*50)/1000+(masterspeed/1000 - (masterspeed/10000))});


						});
			}




			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==20 ) {								// FLYIN


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index');
						var chix2=actli.css('z-index');


						if (direction==1) {
						   var ofx = -opt.width
						   var rot  =70;
						   var torig = "left center -"+opt.height/2;
						} else {
							var ofx = opt.width;
							var rot = -70;
							var torig = "right center -"+opt.height/2;
						}


						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							//ss.css({overflow:'visible'});
							TweenLite.fromTo(ss,masterspeed/1500,
											{left:ofx,rotationX:40,z:-600, opacity:op,top:0,transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0, delay:(j*50)/1000,ease:Power2.easeInOut});

							TweenLite.fromTo(ss,masterspeed/1000,
											{rotationX:40,z:-600, opacity:op,top:0,scale:1,transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{rotationX:0,opacity:1,top:0,z:0, scale:1,rotationY:0, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli)
															}
											});
							TweenLite.to(ss,0.1,{opacity:1,delay:(j*50)/1000+masterspeed/2000});

						});



						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							//ss.css({overflow:'visible'});
							if (direction!=1) {
							   var ofx = -opt.width
							   var rot  =70;
							   var torig = "left center -"+opt.height/2;
							} else {
								var ofx = opt.width;
								var rot = -70;
								var torig = "right center -"+opt.height/2;
							}
							TweenLite.fromTo(ss,masterspeed/1000,
											{opacity:1,rotationX:0,top:0,z:0,scale:1,left:0, transformPerspective:600,transformOrigin:torig, rotationY:0},
											{opacity:1,rotationX:40,top:0, z:-600, left:ofx, scale:0.8,rotationY:rot, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																if (j==opt.slots-1)
																	letItFree(container,opt,nextsh,actsh,nextli,actli)																	}
											});
							TweenLite.to(ss,0.1,{opacity:0,delay:(j*50)/1000+(masterspeed/1000 - (masterspeed/10000))});


						});
			}






			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==21 || nexttrans==25) {								// TURNOFF


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index');
						var chix2=actli.css('z-index');


						if (direction==1) {
						   var ofx = -opt.width
						   var rot  =110;

						   if (nexttrans==25) {
						   	 var torig = "center top 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     var torig = "left center 0";
						     rot2 = opt.rotate;
						   }

						} else {
							var ofx = opt.width;
							var rot = -110;
							if (nexttrans==25) {
						   	 var torig = "center bottom 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     var torig = "right center 0";
						     rot2 = opt.rotate;
						   }
						}


						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);


							TweenLite.fromTo(ss,masterspeed/1500,
											{left:0,rotationX:rot2,z:0, opacity:0,top:0,scale:1,transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0,rotationX:0,top:0,z:0, scale:1,rotationY:0, delay:(j*100)/1000+masterspeed/10000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli)
															}
											});
							TweenLite.to(ss,0.3,{opacity:1,delay:(j*100)/1000+(masterspeed*0.2)/2000+masterspeed/10000});

						});



						if (direction!=1) {
						   var ofx = -opt.width
						   var rot  = 90;

						   if (nexttrans==25) {
						   	 var torig = "center top 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     var torig = "left center 0";
						     rot2 = opt.rotate;
						   }

						} else {
							var ofx = opt.width;
							var rot = -90;
							if (nexttrans==25) {
						   	 var torig = "center bottom 0"
						   	 rot2 = -rot;
						   	 rot = opt.rotate;
						   } else {
						     var torig = "right center 0";
						     rot2 = opt.rotate;
						   }
						}

						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);


							TweenLite.fromTo(ss,masterspeed/3000,
											{left:0,rotationX:0,z:0, opacity:1,top:0,scale:1,transformPerspective:600,transformOrigin:torig,rotationY:0},
											{left:0,rotationX:rot2,top:0,z:0, scale:1,rotationY:rot, delay:(j*100)/1000,ease:Power1.easeInOut});
							TweenLite.to(ss,0.2,{opacity:0,delay:(j*50)/1000+(masterspeed/3000 - (masterspeed/10000))});


						});
			}



			////////////////////////////////////////
			// THE SLOTSLIDE - TRANSITION XX.  //
			///////////////////////////////////////
			if (nexttrans==23 || nexttrans == 24) {								// cube-horizontal - inboxhorizontal


						//SET DEFAULT IMG UNVISIBLE
						nextsh.find('.defaultimg').css({'opacity':0});
						setTimeout(function() {
							actsh.find('.defaultimg').css({opacity:0});
						},100);
						var chix=nextli.css('z-index');
						var chix2=actli.css('z-index');

						var rot = -90;
						if (direction==1)
							  rot = 90;

						var op = 1;


						if (nexttrans==23) {
							var torig = "center center -"+opt.width/2;
							op=0;

						} else {
							var torig = "center center "+opt.width/2;

						}


						var opx=0;

						// ALL NEW SLOTS SHOULD BE SLIDED FROM THE LEFT TO THE RIGHT
						TweenLite.fromTo(nextsh,masterspeed/2000,{transformPerspective:600,z:0,x:0,rotationY:0},{rotationY:1,ease:Power1.easeInOut,z:-90});
						TweenLite.fromTo(nextsh,masterspeed/2000,{transformPerspective:600,z:-90,rotationY:1},{rotationY:0,z:0,ease:Power1.easeInOut,x:0,delay:3*(masterspeed/4000)});
						TweenLite.fromTo(actsh,masterspeed/2000,{transformPerspective:600,z:0,x:0,rotationY:0},{rotationY:1,x:0,ease:Power1.easeInOut,z:-90});
						TweenLite.fromTo(actsh,masterspeed/2000,{transformPerspective:600,z:-90,x:0,rotationY:1},{rotationY:0,z:0,x:0,ease:Power1.easeInOut,delay:3*(masterspeed/4000)});

						nextsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);

							TweenLite.fromTo(ss,masterspeed/1000,
											{left:opx,rotationX:opt.rotate,opacity:op,top:0,scale:1,transformPerspective:600,transformOrigin:torig,rotationY:rot},
											{left:0,rotationX:0,opacity:1,top:0,z:0, scale:1,rotationY:0, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli);

															}
											});
							TweenLite.to(ss,0.1,{opacity:1,delay:(j*50)/1000+masterspeed/3000});

						});

						rot = 90;
						if (direction==1)
							  rot = -90;




						actsh.find('.slotslide').each(function(j) {
							var ss=jQuery(this);
							TweenLite.fromTo(ss,masterspeed/1000,
											{left:0,opacity:1,rotationX:0,top:0,z:0,scale:1,transformPerspective:600,transformOrigin:torig, rotationY:0},
											{left:opx,opacity:1,rotationX:opt.rotate,top:0, scale:1,rotationY:rot, delay:(j*50)/1000,ease:Power2.easeInOut,onComplete: function() {

																	if (j==opt.slots-1)
																		letItFree(container,opt,nextsh,actsh,nextli,actli)

															}
											});
							TweenLite.to(ss,0.1,{opacity:0,delay:(j*50)/1000+(masterspeed/1000 - (masterspeed/10000))});


						});
			}


			var data={};
			data.slideIndex=opt.next+1;
			container.trigger('revolution.slide.onchange',data);
			setTimeout(function() { container.trigger('revolution.slide.onafterswap'); },masterspeed);
			container.trigger('revolution.slide.onvideostop');
		}


		/******************************
			-	STOP KEN BURN	-
		********************************/
		function stopKenBurn(container,opt) {
			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}

			opt.lastslide=opt.act;

			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');


			var actsh = actli.find('.slotholder');
			var nextsh = nextli.find('.slotholder');

			nextsh.find('.defaultimg').each(function() {
				var defimg = jQuery(this);
				if (defimg.data('kenburn')!=undefined)
					defimg.data('kenburn').restart();
				TweenLite.killTweensOf(defimg,false);
				TweenLite.set(defimg,{scale:1,rotationZ:0});

				defimg.data('bgposition',nextsh.data('bgposition'));
				defimg.data('currotate',nextsh.data('rotationstart'));
				defimg.data('curscale',nextsh.data('bgfit'));

				});
			/*actsh.find('.defaultimg').each(function() {
				var defimg = jQuery(this);
				TweenLite.killTweensOf(defimg,false);
				TweenLite.set(defimg,{scale:1,rotationZ:0});
				if (defimg.data('oldbgposition')!=undefined)
					defimg.data('bgposition',defimg.data('oldbgposition'));

				defimg.data('currotate',nextsh.data('rotationstart'));
				defimg.data('curscale',nextsh.data('zoomstart')/100);

				});*/

		}


		/******************************
			-	startKenBurn	-
		********************************/
		function startKenBurn(container,opt) {

			try{
				var actli = container.find('>ul:first-child >li:eq('+opt.act+')');
			} catch(e) {
				var actli=container.find('>ul:first-child >li:eq(1)');
			}

			opt.lastslide=opt.act;

			var nextli = container.find('>ul:first-child >li:eq('+opt.next+')');


			var actsh = actli.find('.slotholder');
			var nextsh = nextli.find('.slotholder');

			var
				bgps = nextsh.data('bgposition'),
				bgpe = nextsh.data('bgpositionend'),
				zos = nextsh.data('zoomstart')/100,
				zoe = nextsh.data('zoomend')/100,
				ros = nextsh.data('rotationstart'),
				roe = nextsh.data('rotationend'),
				bgfs = nextsh.data('bgfit'),
				bgfe = nextsh.data('bgfitend'),
				easeme = nextsh.data('easeme'),
				dur = nextsh.data('duration')/1000;

				if (bgfs==undefined) bgfs=100;
				if (bgfe==undefined) bgfe=100;

				bgfs = calculateKenBurnScales(bgfs,nextsh,opt);
				bgfe = calculateKenBurnScales(bgfe,nextsh,opt);
				bgfe = bgfs;

				if (zos==undefined) zos=1;
				if (zoe==undefined) zoe=1;
				if (ros==undefined) ros=0;
				if (roe==undefined) roe=0;

				if (zos<1) zos=1;
				if (zoe<1) zoe=1;

				nextsh.find('.defaultimg').each(function() {
					var defimg = jQuery(this);
					defimg.data(
						'kenburn',
						TweenLite.fromTo(
								defimg,
								dur,
								{
									transformPerspective:1200, 
									backgroundSize:bgfs, 
									z:0,
									backgroundPosition:bgps,
									//rotationZ:ros,
									scale:zos,
								},
								{
									yoyo:2,
									//rotationZ:roe,
									ease:easeme,
									backgroundSize:bgfe,
									backgroundPosition:bgps,
									scale:zoe,
									onUpdate:function() {
										defimg.data('bgposition',defimg.css('backgroundPosition'));
										if (!isIE(8)) defimg.data('currotate',getRotationDegrees(defimg));
										if (!isIE(8)) defimg.data('curscale',defimg.css('backgroundSize'));
									}
								}
						)
					);
			})
		}


		/***********************************************
			-	KEN BURN BACKGROUND FIT CALCULATOR	-
		***********************************************/
		function calculateKenBurnScales(proc,sloth,opt) {
			var ow = sloth.data('owidth');
			var oh = sloth.data('oheight');

			var factor = (opt.container.width() /ow);
			var nheight = oh * factor;

			var hfactor = (nheight / opt.container.height())*proc;



			return (proc+"% "+hfactor+"%");
		}


		/******************************************************
			-	CALCULATE CURRENT SCALE AND ROTATION	-
		*******************************************************/

		function getMatrix(obj) {
		    var matrix = obj.css("-webkit-transform") ||
		                 obj.css("-moz-transform")    ||
		                 obj.css("-ms-transform")     ||
		                 obj.css("-o-transform")      ||
		                 obj.css("transform");
		    return matrix;
		};

		function parseMatrix(_str) {
			    return _str.replace(/^matrix(3d)?\((.*)\)$/,'$2').split(/, /);
			}

		function getScaleDegrees(obj) {
			    var matrix = parseMatrix(getMatrix(obj)),
			        scale = 1;

			    if(matrix[0] !== 'none') {
			        var a = matrix[0],
			            b = matrix[1],
			            d = 10;
			        scale = Math.round( Math.sqrt( a*a + b*b ) * d ) / d;
			    }

			    return scale;
			};

		function getRotationDegrees(obj) {
			    var matrix = obj.css("-webkit-transform") ||
			    obj.css("-moz-transform")    ||
			    obj.css("-ms-transform")     ||
			    obj.css("-o-transform")      ||
			    obj.css("transform");
			    if(matrix !== 'none') {
			        var values = matrix.split('(')[1].split(')')[0].split(',');
			        var a = values[0];
			        var b = values[1];
			        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
			    } else { var angle = 0; }
			    return (angle < 0) ? angle +=360 : angle;
			}

		/**************************************
			-	GIVE FREE THE TRANSITIOSN	-
		**************************************/
		function letItFree(container,opt,nextsh,actsh,nextli,actli) {
					removeSlots(container,opt);
					nextsh.find('.defaultimg').css({'opacity':1});
					if (nextli.index()!=actli.index()) actsh.find('.defaultimg').css({'opacity':0});
					opt.act=opt.next;
					moveSelectedThumb(container);
					if (nextsh.data('kenburns')=="on")
						startKenBurn(container,opt);
		}


				//////////////////////////////////////////
				// CHANG THE YOUTUBE PLAYER STATE HERE //
				////////////////////////////////////////
				 function onPlayerStateChange(event) {

					 var embedCode = event.target.getVideoEmbedCode();
					 var ytcont = jQuery('#'+embedCode.split('id="')[1].split('"')[0])
					 var container = ytcont.closest('.tp-simpleresponsive');
					 var player = ytcont.parent().data('player');

					if (event.data == YT.PlayerState.PLAYING) {

						var bt = container.find('.tp-bannertimer');
						var opt = bt.data('opt');
						bt.stop();

						if (ytcont.closest('.tp-caption').data('volume')=="mute")
							  player.mute();

						opt.videoplaying=true;
						//konsole.log("VideoPlay set to True due onPlayerStateChange PLAYING");
						opt.videostartednow=1;

					} else {

						var bt = container.find('.tp-bannertimer');
						var opt = bt.data('opt');

						if (event.data!=-1) {
							if (opt.conthover==0)
								bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
							opt.videoplaying=false;
							opt.videostoppednow=1;

						}

					}
					if (event.data==0 && opt.nextslideatend==true)
						opt.container.revnext();


				  }



				 ////////////////////////
				// VIMEO ADD EVENT /////
				////////////////////////
				function addEvent(element, eventName, callback) {

							if (element.addEventListener)  element.addEventListener(eventName, callback, false);
								else
							element.attachEvent(eventName, callback, false);
				}



				/////////////////////////////////////
				// EVENT HANDLING FOR VIMEO VIDEOS //
				/////////////////////////////////////

					function vimeoready_auto(player_id,autoplay) {

						var froogaloop = $f(player_id);
						var vimcont = jQuery('#'+player_id);
						var container = vimcont.closest('.tp-simpleresponsive');


						froogaloop.addEvent('ready', function(data) {
								if(autoplay) froogaloop.api('play');

								froogaloop.addEvent('play', function(data) {
									var bt = container.find('.tp-bannertimer');
									var opt = bt.data('opt');
									bt.stop();
									opt.videoplaying=true;
									if (vimcont.closest('.tp-caption').data('volume')=="mute")
									  froogaloop.api('setVolume',"0");
									//konsole.log("VideoPlay set to True due vimeoready_auto PLAYING");
								});

								froogaloop.addEvent('finish', function(data) {
										var bt = container.find('.tp-bannertimer');
										var opt = bt.data('opt');
										if (opt.conthover==0)
											bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
										opt.videoplaying=false;
									//konsole.log("VideoPlay set to False due vimeoready_auto FINISH");
										opt.videostartednow=1;
										if (opt.nextslideatend==true)
											opt.container.revnext();

								});

								froogaloop.addEvent('pause', function(data) {
										var bt = container.find('.tp-bannertimer');
										var opt = bt.data('opt');
										if (opt.conthover==0)
											bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
										opt.videoplaying=false;
									//konsole.log("VideoPlay set to False due vimeoready_auto PAUSE");
										opt.videostoppednow=1;
								});
						});
					}


					///////////////////////////////////////
					// EVENT HANDLING FOR VIDEO JS VIDEOS //
					////////////////////////////////////////
					function html5vidready(myPlayer,player_id) {

						if (player_id==undefined) player_id = jQuery(myPlayer["b"]).attr('id');
						var player_cont = jQuery('#'+player_id);
						var container = player_cont.closest('.tp-simpleresponsive');

						myPlayer.on("play",function() {

							if (player_cont.closest('.tp-caption').data('volume')=="mute")
								  myPlayer.volume(0);
							var bt = jQuery('body').find('.tp-bannertimer');
							var opt = bt.data('opt');
							bt.stop();
							try{
								opt.videoplaying=true;
							} catch(e) {}


							//konsole.log("VideoPlay set to True due html5vidready PLAYING");
						});

						myPlayer.on("pause",function() {
							    var bt = container.find('.tp-bannertimer');
								var opt = bt.data('opt');
								if (opt.conthover==0)
									bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
								opt.videoplaying=false;
								//konsole.log("VideoPlay set to False due html5vidready pause");
								opt.videostoppednow=1;
						});

						myPlayer.on("ended",function() {
								var bt = container.find('.tp-bannertimer');
								var opt = bt.data('opt');
								if (opt.conthover==0)
									bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
								opt.videoplaying=false;
								//konsole.log("VideoPlay set to False due html5vidready pause");
								opt.videostoppednow=1;
								if (opt.nextslideatend==true)
									opt.container.revnext();
						});


						myPlayer.on('loadedmetadata', function(data) {



								var videoWidth =0;
								var videoHeight=0;

								for(var prop in this) {
										try{
											if(this[prop].hasOwnProperty('videoWidth'))
												videoWidth = this[prop].videoWidth;

											if(this[prop].hasOwnProperty('videoHeight'))
												 videoHeight = this[prop].videoHeight;
										} catch(e) {}
									}


								var mediaAspect = videoWidth/videoHeight;




								if (player_cont.data('mediaAspect') == undefined) player_cont.data('mediaAspect',mediaAspect);
								if (player_cont.closest('.tp-caption').data('forcecover')==1)
									updateHTML5Size(player_cont,container);

						});

					}
				/////////////////////////////////////
				// RESIZE HTML5VIDEO FOR FULLSCREEN//
				/////////////////////////////////////
				function updateHTML5Size(pc,container) {
						var windowW = container.width();
						var windowH = container.height();
						var mediaAspect = pc.data('mediaAspect');

						var windowAspect = windowW/windowH;
						pc.parent().find('.vjs-poster').css({width:"100%",height:"100%"});
						if (windowAspect < mediaAspect) {
							// taller
								pc
									.width(windowH*mediaAspect)
									.height(windowH);
								pc
									.css('top',0)
									.css('left',-(windowH*mediaAspect-windowW)/2)
									.css('height',windowH);
								pc.find('.vjs-tech').css('width',windowH*mediaAspect);

						} else {
							// wider
								pc
									.width(windowW)
									.height(windowW/mediaAspect);
								pc
									.css('top',-(windowW/mediaAspect-windowH)/2)
									.css('left',0)
									.css('height',windowW/mediaAspect);
								pc.find('.vjs-tech').css('width','100%');

						}

					}
					
					
	


				////////////////////////
				// SHOW THE CAPTION  //
				///////////////////////
				function animateTheCaptions(nextli, opt,recalled) {
						
						var offsetx=0;
						var offsety=0;

						nextli.find('.tp-caption').each(function(i) {
								

								offsetx = opt.width/2 - (opt.startwidth*opt.bw)/2;



								var xbw = opt.bw;
								var xbh = opt.bh;


								if (opt.fullScreen=="on")
									  offsety = opt.height/2 - (opt.startheight*opt.bh)/2;

								if (opt.autoHeight=="on")
									  offsety = opt.container.height()/2 - (opt.startheight*opt.bh)/2;;

								if (offsety<0) offsety=0;

								var nextcaption=jQuery(this);//nextli.find('.tp-caption:eq('+i+')');
								

								var handlecaption=0;

								// HIDE CAPTION IF RESOLUTION IS TOO LOW
								if (opt.width<opt.hideCaptionAtLimit && nextcaption.data('captionhidden')=="on") {
									nextcaption.addClass("tp-hidden-caption")
									handlecaption=1;
								} else {
									if (opt.width<opt.hideAllCaptionAtLimit || opt.width<opt.hideAllCaptionAtLilmit)	{
										nextcaption.addClass("tp-hidden-caption")
										handlecaption=1;
									} else {
										nextcaption.removeClass("tp-hidden-caption")
									}
								}

								if (handlecaption==0) {

									// ADD A CLICK LISTENER TO THE CAPTION
									if (nextcaption.data('linktoslide')!=undefined && !nextcaption.hasClass("hasclicklistener")) {
										nextcaption.addClass("hasclicklistener")
										nextcaption.css({'cursor':'pointer'});
										if (nextcaption.data('linktoslide')!="no") {
											nextcaption.click(function() {
												var nextcaption=jQuery(this);
												var dir = nextcaption.data('linktoslide');
												if (dir!="next" && dir!="prev") {
													opt.container.data('showus',dir);
													opt.container.parent().find('.tp-rightarrow').click();
												} else
													if (dir=="next")
														opt.container.parent().find('.tp-rightarrow').click();
												else
													if (dir=="prev")
														opt.container.parent().find('.tp-leftarrow').click();
											});
										}
									}// END OF CLICK LISTENER


									if (offsetx<0) offsetx=0;


									// YOUTUBE AND VIMEO LISTENRES INITIALISATION

									var frameID = "iframe"+Math.round(Math.random()*1000+1);

									if (nextcaption.find('iframe').length>0 || nextcaption.find('video').length>0) {

										if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true" ) {
											nextcaption.data('autoplay',true);
										}

										nextcaption.find('iframe').each(function() {
												var ifr=jQuery(this);
												

												// START YOUTUBE HANDLING
												opt.nextslideatend = nextcaption.data('nextslideatend');
												if (nextcaption.data('thumbimage')!=undefined && nextcaption.data('thumbimage').length>2 && nextcaption.data('autoplay')!=true && !recalled) {
													nextcaption.find('.tp-thumb-image').remove();
													nextcaption.append('<div class="tp-thumb-image" style="cursor:pointer; position:absolute;top:0px;left:0px;width:100%;height:100%;background-image:url('+nextcaption.data('thumbimage')+'); background-size:cover"></div>');
												}

													if (ifr.attr('src').toLowerCase().indexOf('youtube')>=0) {

														 if (!ifr.hasClass("HasListener")) {
															try {
																ifr.attr('id',frameID);

																var player;
																if (nextcaption.data('autoplay')==true)
																	player = new YT.Player(frameID, {
																		events: {
																			"onStateChange": onPlayerStateChange,
																			'onReady': function(event) {event.target.playVideo()}
																		}
																	});
																else
																	player = new YT.Player(frameID, {
																		events: {
																			"onStateChange": onPlayerStateChange
																		}
																	});
																ifr.addClass("HasListener");

																nextcaption.data('player',player);

															} catch(e) {}
													 } else {
														if (nextcaption.data('autoplay')==true) {
																var player=nextcaption.data('player');
																nextcaption.data('timerplay',setTimeout(function() {
																	if (nextcaption.data('forcerewind')=="on")
																		player.seekTo(0);
																	player.playVideo();
																},nextcaption.data('start')));
														}
													 } // END YOUTUBE HANDLING

													 // PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
															 nextcaption.find('.tp-thumb-image').click(function() {
																 TweenLite.to(jQuery(this),0.3,{opacity:0,ease:Power3.easeInOut,onComplete: function() {
																	 nextcaption.find('.tp-thumb-image').remove();
																	}
																 })
																 var player=nextcaption.data('player');
																 player.playVideo();
															 })
												} else {
													// START VIMEO HANDLING
													if (ifr.attr('src').toLowerCase().indexOf('vimeo')>=0) {

														   if (!ifr.hasClass("HasListener")) {
																ifr.addClass("HasListener");
																ifr.attr('id',frameID);
																var isrc = ifr.attr('src');
																var queryParameters = {}, queryString = isrc,
																re = /([^&=]+)=([^&]*)/g, m;
																// Creates a map with the query string parameters
																while (m = re.exec(queryString)) {
																	queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
																}

																if (queryParameters['player_id']!=undefined)
																	isrc = isrc.replace(queryParameters['player_id'],frameID);
																else
																	isrc=isrc+"&player_id="+frameID;

																try{ isrc = isrc.replace('api=0','api=1'); } catch(e) {}

																isrc=isrc+"&api=1";

																ifr.attr('src',isrc);
																var player = nextcaption.find('iframe')[0];

																$f(player).addEvent('ready', function() {vimeoready_auto(frameID,nextcaption.data('autoplay'))});

															 } else {
																	if (nextcaption.data('autoplay')==true) {

																		var ifr = nextcaption.find('iframe');
																		var id = ifr.attr('id');
																		var froogaloop = $f(id);
																		nextcaption.data('timerplay',setTimeout(function() {
																			if (nextcaption.data('forcerewind')=="on")
																				froogaloop.api("seekTo",0);
																			froogaloop.api("play");
																		},nextcaption.data('start')));
																	}
															 }// END HAS LISTENER HANDLING

															 // PLAY VIDEO IF THUMBNAIL HAS BEEN CLICKED
															 nextcaption.find('.tp-thumb-image').click(function() {
																 TweenLite.to(jQuery(this),0.3,{opacity:0,ease:Power3.easeInOut,onComplete: function() {
																	 nextcaption.find('.tp-thumb-image').remove();
																	}
																 })
																 var ifr = nextcaption.find('iframe');
																 var id = ifr.attr('id');
																 var froogaloop = $f(id);
																 froogaloop.api("play");
															 })


													}  // END OF VIMEO HANDLING
											}  // END OF CHOOSE BETWEEN YOUTUBE AND VIMEO
										}); // END OF LOOP THROUGH IFRAMES

										// START OF VIDEO JS
										if (nextcaption.find('video').length>0) {


															nextcaption.find('video').each(function(i) {
																var html5vid = jQuery(this).parent();

																if (nextcaption.data('dottedoverlay')!="none" && nextcaption.data('dottedoverlay')!=undefined)
																	if (nextcaption.find('.tp-dottedoverlay').length!=1)
																		html5vid.append('<div class="tp-dottedoverlay '+nextcaption.data('dottedoverlay')+'"></div>');

																var mediaaspect=16/9;
																if (nextcaption.data('aspectratio')=="4:3") mediaaspect=4/3;
																html5vid.data('mediaAspect',mediaaspect);



																if (html5vid.closest('.tp-caption').data('forcecover')==1) 
																	updateHTML5Size(html5vid,opt.container);



																if (html5vid.hasClass("video-js")) {
																	opt.nextslideatend = nextcaption.data('nextslideatend');
																	if (!html5vid.hasClass("HasListener")) {
																		html5vid.addClass("HasListener");
																		var videoID = "videoid_"+Math.round(Math.random()*1000+1);
																		html5vid.attr('id',videoID);

																		videojs(videoID).ready(function(){

																			html5vidready(this,videoID)

																		});

																	} else {
																		videoID = html5vid.attr('id');
																	}


																	html5vid.find('.vjs-poster').css({display:"block"});

																	if (nextcaption.data('autoplay')==true) {

																		var bt=jQuery('body').find('#'+opt.container.attr('id')).find('.tp-bannertimer');
																		setTimeout(function(){
																			bt.stop();
																			opt.videoplaying=true;
																		},200);

																		//konsole.log("VideoPlay set to True due HTML5 VIDEO 1st/2nd load AutoPlay");


																		videojs(videoID).ready(function(){
																			var myPlayer = this;
																			try {
																					if (nextcaption.data('forcerewind')=="on")
																						  myPlayer.currentTime(0);
																				} catch(e) {

																				}

																			html5vid.data('timerplay',setTimeout(function() {
																				if (nextcaption.data('forcerewind')=="on")
																				  myPlayer.currentTime(0);

																				if (html5vid.closest('.tp-caption').data('volume')=="mute")
																				  myPlayer.volume(0);

																				setTimeout(function() {
																					myPlayer.play(0);
																					html5vid.find('.vjs-poster').css({display:"none"});
																				},50);
																			},10+nextcaption.data('start')));
																		});
																	}


																	if (html5vid.data('ww') == undefined) html5vid.data('ww',html5vid.width());
																	if (html5vid.data('hh') == undefined) html5vid.data('hh',html5vid.height());

																	videojs(videoID).ready(function(){
																		if (!nextcaption.hasClass("fullscreenvideo")) {
																			var myPlayer = videojs(videoID);

																			try{
																				myPlayer.width(html5vid.data('ww')*opt.bw);
																				myPlayer.height(html5vid.data('hh')*opt.bh);
																			} catch(e) {}
																		}
																	});



																	if (html5vid.closest('.tp-caption').data('forcecover')==1) {
																		updateHTML5Size(html5vid,opt.container);
																		html5vid.addClass("fullcoveredvideo");
																	}



																 }

															});
											} // END OF VIDEO JS FUNCTIONS

											// IF AUTOPLAY IS ON, WE NEED SOME STOP FUNCTION ON
												if (nextcaption.data('autoplay')==true) {
													var bt=jQuery('body').find('#'+opt.container.attr('id')).find('.tp-bannertimer');

													setTimeout(function() {
														bt.stop();
														opt.videoplaying=true;

													},200)
													opt.videoplaying=true;

													if (nextcaption.data('autoplayonlyfirsttime') == true || nextcaption.data('autoplayonlyfirsttime')=="true" ) {
														nextcaption.data('autoplay',false);
														nextcaption.data('autoplayonlyfirsttime',false);
													}
												}
									}




										// NEW ENGINE
										//if (nextcaption.hasClass("randomrotate") && (opt.ie || opt.ie9)) nextcaption.removeClass("randomrotate").addClass("sfb");
										//	nextcaption.removeClass('noFilterClass');



										   var imw =0;
										   var imh = 0;

													if (nextcaption.find('img').length>0) {
														var im = nextcaption.find('img');
														if (im.data('ww') == undefined) im.data('ww',im.width());
														if (im.data('hh') == undefined) im.data('hh',im.height());

														var ww = im.data('ww');
														var hh = im.data('hh');

														if(nextcaption.find('.tp-resizeme').length>0){
															im.width(ww*opt.bw);
															im.height(hh*opt.bh);
															imw = im.width();
															imh = im.height();
														}
													} else {
													if (nextcaption.find('iframe').length>0 || nextcaption.find('.video-js').length>0) {

															var im = nextcaption.find('iframe');
															im.css({display:"block"});
															if (nextcaption.data('ww') == undefined) {
																nextcaption.data('ww',im.width());
															}
															if (nextcaption.data('hh') == undefined) nextcaption.data('hh',im.height());

															var ww = nextcaption.data('ww');
															var hh = nextcaption.data('hh');

															var nc =nextcaption;
																if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
																if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
																if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
																if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
																if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);

																if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
																if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
																if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
																if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);

																if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTop'),0) || 0);
																if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottom'),0) || 0);
																if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeft'),0) || 0);
																if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRight'),0) || 0);

																//if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || 0);

																var fvwidth=opt.width;
																var fvheight=opt.height;
																if (fvwidth>opt.startwidth) fvwidth=opt.startwidth;
																if (fvheight>opt.startheight) fvheight=opt.startheight;


															
																if (!nextcaption.hasClass('fullscreenvideo'))
																			nextcaption.css({

																				 'font-size': (nc.data('fsize') * opt.bw)+"px",

																				 'padding-top': (nc.data('pt') * opt.bh) + "px",
																				 'padding-bottom': (nc.data('pb') * opt.bh) + "px",
																				 'padding-left': (nc.data('pl') * opt.bw) + "px",
																				 'padding-right': (nc.data('pr') * opt.bw) + "px",

																				 'margin-top': (nc.data('mt') * opt.bh) + "px",
																				 'margin-bottom': (nc.data('mb') * opt.bh) + "px",
																				 'margin-left': (nc.data('ml') * opt.bw) + "px",
																				 'margin-right': (nc.data('mr') * opt.bw) + "px",

																				 'border-top': (nc.data('bt') * opt.bh) + "px",
																				 'border-bottom': (nc.data('bb') * opt.bh) + "px",
																				 'border-left': (nc.data('bl') * opt.bw) + "px",
																				 'border-right': (nc.data('br') * opt.bw) + "px",

																				  //'line-height': (nc.data('lh') * opt.bh) + "px",
																				 'height':(hh*opt.bh)+'px',
																				 'white-space':"nowrap"
																				});
																	else  {
																		   offsetx=0; offsety=0;
																		   nextcaption.data('x',0)
																		   nextcaption.data('y',0)

																		   var ovhh = opt.height
																		   if (opt.autoHeight=="on")
																		   		ovhh = opt.container.height()
																			nextcaption.css({

																				'width':opt.width,
																				'height':ovhh
																			});
																		}


															im.width(ww*opt.bw);
															im.height(hh*opt.bh);
															imw = im.width();
															imh = im.height();
														} else {
															
															
															nextcaption.find('.tp-resizeme, .tp-resizeme *').each(function() {
																	
																	calcCaptionResponsive(jQuery(this),opt);
															});
														
															
															if (nextcaption.hasClass("tp-resizeme")) {
																nextcaption.find('*').each(function() {
																	calcCaptionResponsive(jQuery(this),opt,"first");
																});
																calcCaptionResponsive(nextcaption,opt,"first");
																nextcaption.find('*').each(function() {
																	calcCaptionResponsive(jQuery(this),opt);
																});
																calcCaptionResponsive(nextcaption,opt);
															}

															imh=nextcaption.outerHeight(true);
															imw=nextcaption.outerWidth(true);

															// NEXTCAPTION FRONTCORNER CHANGES
															var ncch = nextcaption.outerHeight();
															var bgcol = nextcaption.css('backgroundColor');
															nextcaption.find('.frontcorner').css({
																			'borderWidth':ncch+"px",
																			'left':(0-ncch)+'px',
																			'borderRight':'0px solid transparent',
																			'borderTopColor':bgcol
															});

															nextcaption.find('.frontcornertop').css({
																			'borderWidth':ncch+"px",
																			'left':(0-ncch)+'px',
																			'borderRight':'0px solid transparent',
																			'borderBottomColor':bgcol
															});

															// NEXTCAPTION BACKCORNER CHANGES
															nextcaption.find('.backcorner').css({
																			'borderWidth':ncch+"px",
																			'right':(0-ncch)+'px',
																			'borderLeft':'0px solid transparent',
																			'borderBottomColor':bgcol
															});

															// NEXTCAPTION BACKCORNER CHANGES
															nextcaption.find('.backcornertop').css({
																			'borderWidth':ncch+"px",
																			'right':(0-ncch)+'px',
																			'borderLeft':'0px solid transparent',
																			'borderTopColor':bgcol
															});

														}


												}

											if (opt.fullScreenAlignForce == "on") {
												xbw = 1;
												xbh = 1;
												offsetx=0;
												offsety=0;
											}

											if (nextcaption.data('voffset')==undefined) nextcaption.data('voffset',0);
											if (nextcaption.data('hoffset')==undefined) nextcaption.data('hoffset',0);

											var vofs= nextcaption.data('voffset')*xbw;
											var hofs= nextcaption.data('hoffset')*xbw;

											var crw = opt.startwidth*xbw;
											var crh = opt.startheight*xbw;

											if (opt.fullScreenAlignForce == "on") {
												crw = opt.container.width();
												crh = opt.container.height();

											}

										

											// CENTER THE CAPTION HORIZONTALLY
											if (nextcaption.data('x')=="center" || nextcaption.data('xcenter')=='center') {
												nextcaption.data('xcenter','center');
												nextcaption.data('x',(crw/2 - nextcaption.outerWidth(true)/2)/xbw+  hofs);

											}

											// ALIGN LEFT THE CAPTION HORIZONTALLY
											if (nextcaption.data('x')=="left" || nextcaption.data('xleft')=='left') {
												nextcaption.data('xleft','left');
												nextcaption.data('x',(0)/xbw+hofs);

											}

											// ALIGN RIGHT THE CAPTION HORIZONTALLY
											if (nextcaption.data('x')=="right" || nextcaption.data('xright')=='right') {
												nextcaption.data('xright','right');
												nextcaption.data('x',((crw - nextcaption.outerWidth(true))+hofs)/xbw);
												//konsole.log("crw:"+crw+"  width:"+nextcaption.outerWidth(true)+"  xbw:"+xbw);
												//konsole.log("x-pos:"+nextcaption.data('x'))
											}


											// CENTER THE CAPTION VERTICALLY
											if (nextcaption.data('y')=="center" || nextcaption.data('ycenter')=='center') {
												nextcaption.data('ycenter','center');
												nextcaption.data('y',(crh/2 - nextcaption.outerHeight(true)/2)/xbh + vofs);

											}

											// ALIGN TOP THE CAPTION VERTICALLY
											if (nextcaption.data('y')=="top" || nextcaption.data('ytop')=='top') {
												nextcaption.data('ytop','top');
												nextcaption.data('y',(0)/opt.bh+vofs);

											}

											// ALIGN BOTTOM THE CAPTION VERTICALLY
											if (nextcaption.data('y')=="bottom" || nextcaption.data('ybottom')=='bottom') {
												nextcaption.data('ybottom','bottom');
												nextcaption.data('y',((crh - nextcaption.outerHeight(true))+vofs)/xbw);
											}



											// THE TRANSITIONS OF CAPTIONS
											// MDELAY AND MSPEED
											if (nextcaption.data('start') == undefined) nextcaption.data('start',1000);



											var easedata=nextcaption.data('easing');
											if (easedata==undefined) easedata="Power1.easeOut";


											var mdelay = nextcaption.data('start')/1000;
											var mspeed = nextcaption.data('speed')/1000;
											var d_x = nextcaption.data('x');
											var d_y = nextcaption.data('y');
											if(	nextcaption.attr("changePostion") == "1"){
												d_x =  nextcaption.attr('dataleft');
												d_y =  nextcaption.attr('datatop');
											}
											
											
											var calcx = (xbw*d_x+offsetx);
											
											var calcy = (opt.bh*d_y+offsety);




											if (opt.fullScreenAlignForce == "on")
												calcy = nextcaption.data('y')+offsety;

													TweenLite.killTweensOf(nextcaption,false);
													clearTimeout(nextcaption.data('reversetimer'));


													var tlop = 0,
													 	tlxx = calcx, tlyy = calcy, tlzz = 2,
													    tlsc = 1,tlro = 0,
													    sc=1,scX=1,scY= 1,
													    ro=0,roX=0,roY=0,roZ = 0,
														skwX=0, skwY = 0,
														opa = 0,
														trorig = "center,center",
														tper = 300,
														repeatV = 0,
														yoyoV = false,
													    repeatdelayV = 0;

													if (nextcaption.data('repeat')!=undefined) repeatV = nextcaption.data('repeat');
													if (nextcaption.data('yoyo')!=undefined) yoyoV = nextcaption.data('yoyo');
													if (nextcaption.data('repeatdelay')!=undefined) repeatdelayV = nextcaption.data('repeatdelay');


													if (nextcaption.hasClass("customin")) {

														var customarray = nextcaption.data('customin').split(';');
														jQuery.each(customarray,function(index,param) {

															param = param.split(":")

															var w = param[0],
																v = param[1];


															if (w=="rotationX") roX = parseInt(v,0);
															if (w=="rotationY") roY = parseInt(v,0);
															if (w=="rotationZ") roZ = parseInt(v,0);
															if (w=="scaleX")  scX = parseFloat(v);
															if (w=="scaleY")  scY = parseFloat(v);
															if (w=="opacity") opa = parseFloat(v);
															if (w=="skewX")   skwX = parseInt(v,0);
															if (w=="skewY")   skwY = parseInt(v,0);
															if (w=="x") tlxx = calcx + parseInt(v,0);
															if (w=="y") tlyy = calcy + parseInt(v,0);
															if (w=="z") tlzz = parseInt(v,0);
															if (w=="transformOrigin") trorig = v.toString();
															if (w=="transformPerspective") tper=parseInt(v,0);


														})
													}



													if (nextcaption.hasClass("randomrotate")) {

																sc = Math.random()*3+1;
																ro = Math.round(Math.random()*200-100);
																tlxx = calcx + Math.round(Math.random()*200-100);
																tlyy = calcy + Math.round(Math.random()*200-100);
													}

													if (nextcaption.hasClass('lfr') || nextcaption.hasClass('skewfromright'))
														tlxx = 15+opt.width;



													if (nextcaption.hasClass('lfl') || nextcaption.hasClass('skewfromleft'))
														tlxx = -15-imw;

													if (nextcaption.hasClass('sfl') | nextcaption.hasClass('skewfromleftshort'))
														tlxx = calcx-50;

													if (nextcaption.hasClass('sfr') | nextcaption.hasClass('skewfromrightshort'))
														tlxx = calcx+50;


													if (nextcaption.hasClass('lft'))
														tlyy = -25 - imh;


													if (nextcaption.hasClass('lfb'))
														tlyy = 25 + opt.height;

													if (nextcaption.hasClass('sft'))
														tlyy = calcy-50;

													if (nextcaption.hasClass('sfb'))
														tlyy = calcy+50;

													if (nextcaption.hasClass('skewfromright') || nextcaption.hasClass('skewfromrightshort'))
														skwX = -85

													if (nextcaption.hasClass('skewfromleft') || nextcaption.hasClass('skewfromleftshort'))
														skwX =  85

													if (get_browser().toLowerCase()=="safari") {
														roX=0;roY=0;
													}
													tlxx=Math.round(tlxx);
													tlyy=Math.round(tlyy);
													calcx=Math.round(calcx);
													calcy=Math.round(calcy);
													

													// CHANGE to TweenMax.  if Yoyo and Repeat is used. Dont forget to laod the Right Tools for it !!
													if (nextcaption.hasClass("customin")) {
												
																nextcaption.data('anim',TweenLite.fromTo(nextcaption,mspeed,
																				{ scaleX:scX,
																				  scaleY:scY,
																				  rotationX:roX,
																				  rotationY:roY,
																				  rotationZ:roZ,
																				  x:0,
																				  y:0,
																				  left:tlxx,
																				  top:tlyy,
																				  z:tlzz,
																				  opacity:opa,
																				  transformPerspective:tper,
																				  transformOrigin:trorig,
																				  visibility:'hidden'},

																				{
																				  left:calcx,
																				  top:calcy,
																				  scaleX:1,
																				  scaleY:1,
																				  rotationX:0,
																				  rotationY:0,
																				  rotationZ:0,
																				  skewX:0,
																				  skewY:0,
																				  z:0,
																				  x:0,
																				  y:0,
																				  visibility:'visible',
																				  opacity:1,
																				  delay:mdelay,
																				  ease:easedata,
																				  overwrite:"all",

																				  /*yoyo:yoyoV,
																				  repeat:repeatV,
																				  repeatDelay:repeatdelayV*/
																				}));


													} else {
														nextcaption.data('anim',TweenLite.fromTo(nextcaption,mspeed,
																				{ scale:sc,
																				  rotationX:0,
																				  rotationY:0,
																				  skewY:0,
																				  rotation:ro,
																				  left:tlxx+'px',
																				  top:tlyy+"px",
																				  opacity:0,
																				  z:0,
																				  x:0,
																				  y:0,
																				  skewX:skwX,
																				  transformPerspective:600,
																				  visibility:'visible',

																				 },

																				{ left:calcx+'px',
																				  top:calcy+"px",
																				  scale:1,
																				  skewX:0,
																				  rotation:0,
																				  z:0,
																				  visibility:'visible',
																				  opacity:1,
																				  delay:mdelay,
																				  ease:easedata,
																				  overwrite:"all",
																				  yoyo:yoyoV,
																				  repeat:repeatV,
																				  repeatDelay:repeatdelayV,


																				}));
													}





											  nextcaption.data('killall',setTimeout(function() {
												   nextcaption.css({transform:"none",'-moz-transform':'none','-webkit-transform':'none'});
											   },(mspeed*1000)+(mdelay*1000)+20))


												nextcaption.data('timer',setTimeout(function() {
													if (nextcaption.hasClass("fullscreenvideo"))
														nextcaption.css({'display':'block'});

												},nextcaption.data('start')));


												// IF THERE IS ANY EXIT ANIM DEFINED
												if (nextcaption.data('end')!=undefined)
																endMoveCaption(nextcaption,opt,nextcaption.data('end')/1000);


											}

						})

						var bt=jQuery('body').find('#'+opt.container.attr('id')).find('.tp-bannertimer');
						bt.data('opt',opt);
				}


				function get_browser(){
				    var N=navigator.appName, ua=navigator.userAgent, tem;
				    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
				    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
				    return M[0];
				    }
				function get_browser_version(){
				    var N=navigator.appName, ua=navigator.userAgent, tem;
				    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
				    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
				    return M[1];
				    }

				/////////////////////////////////////////////////////////////////
				//	-	CALCULATE THE RESPONSIVE SIZES OF THE CAPTIONS	-	  //
				/////////////////////////////////////////////////////////////////
				function calcCaptionResponsive(nc,opt,flag) {
								if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
								if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
								if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
								if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
								if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);

								if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
								if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
								if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
								if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);

								if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTopWidth'),0) || 0);
								if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottomWidth'),0) || 0);
								if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeftWidth'),0) || 0);
								if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRightWidth'),0) || 0);

								//if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || 0);
								if (nc.data('minwidth') == undefined) nc.data('minwidth',parseInt(nc.css('minWidth'),0) || 0);
								if (nc.data('minheight') == undefined) nc.data('minheight',parseInt(nc.css('minHeight'),0) || 0);
								if (nc.data('maxwidth') == undefined) nc.data('maxwidth',parseInt(nc.css('maxWidth'),0) || "none");
								if (nc.data('maxheight') == undefined) nc.data('maxheight',parseInt(nc.css('maxHeight'),0) || "none");
								
								if (nc.data('wan') == undefined) nc.data('wan',nc.css("-webkit-transition"));
								if (nc.data('moan') == undefined) nc.data('moan',nc.css("-moz-animation-transition"));
								if (nc.data('man') == undefined) nc.data('man',nc.css("-ms-animation-transition"));
								if (nc.data('ani') == undefined) nc.data('ani',nc.css("transition"));

								if(flag=="first"){
									return;
								}

							    nc.css("-webkit-transition", "none");
							    nc.css("-moz-transition", "none");
							    nc.css("-ms-transition", "none");
							    nc.css("transition", "none");


								TweenLite.set(nc,{
												 fontSize: Math.round((nc.data('fsize') * opt.bw))+"px",

												 paddingTop: Math.round((nc.data('pt') * opt.bh)) + "px",
												 paddingBottom: Math.round((nc.data('pb') * opt.bh)) + "px",
												 paddingLeft: Math.round((nc.data('pl') * opt.bw)) + "px",
												 paddingRight: Math.round((nc.data('pr') * opt.bw)) + "px",

												 marginTop: (nc.data('mt') * opt.bh) + "px",
												 marginBottom: (nc.data('mb') * opt.bh) + "px",
												 marginLeft: (nc.data('ml') * opt.bw) + "px",
												 marginRight: (nc.data('mr') * opt.bw) + "px",

												 borderTopWidth: Math.round((nc.data('bt') * opt.bh)) + "px",
												 borderBottomWidth: Math.round((nc.data('bb') * opt.bh)) + "px",
												 borderLeftWidth: Math.round((nc.data('bl') * opt.bw)) + "px",
												 borderRightWidth: Math.round((nc.data('br') * opt.bw)) + "px",

												 //lineHeight: Math.round((nc.data('lh') * opt.bh)) + "px",
												 whiteSpace:"nowrap",
												 minWidth:(nc.data('minwidth') * opt.bw) + "px",
												 minHeight:(nc.data('minheight') * opt.bh) + "px"
								});
								setTimeout(function() {
									nc.css("-webkit-transition", nc.data('wan'));
								    nc.css("-moz-transition", nc.data('moan'));
								    nc.css("-ms-transition", nc.data('man'));
								    nc.css("transition", nc.data('ani'));

								},30);

								//konsole.log(nc.data('maxwidth')+"  "+nc.data('maxheight'));
								if (nc.data('maxheight')!='none')
									nc.css({'maxHeight':(nc.data('maxheight') * opt.bh) + "px"});


								if (nc.data('maxwidth')!='none')
									nc.css({'maxWidth':(nc.data('maxwidth') * opt.bw) + "px"});
						}


				//////////////////////////
				//	REMOVE THE CAPTIONS //
				/////////////////////////
				function removeTheCaptions(actli,opt) {


						actli.find('.tp-caption').each(function(i) {
							var nextcaption=jQuery(this); //actli.find('.tp-caption:eq('+i+')');

							if (nextcaption.find('iframe').length>0) {
															// VIMEO VIDEO PAUSE
															try {
																var ifr = nextcaption.find('iframe');
																var id = ifr.attr('id');
																var froogaloop = $f(id);
																froogaloop.api("pause");
																clearTimeout(nextcaption.data('timerplay'));
															} catch(e) {}
															//YOU TUBE PAUSE
															try {
																var player=nextcaption.data('player');
																player.stopVideo();
																clearTimeout(nextcaption.data('timerplay'));
															} catch(e) {}
														}

							// IF HTML5 VIDEO IS EMBEDED
							if (nextcaption.find('video').length>0) {
											try{
												nextcaption.find('video').each(function(i) {
													var html5vid = jQuery(this).parent();
													var videoID =html5vid.attr('id');
													clearTimeout(html5vid.data('timerplay'));
													videojs(videoID).ready(function(){
														var myPlayer = this;
														myPlayer.pause();
													});
												})
											}catch(e) {}
										} // END OF VIDEO JS FUNCTIONS
							try {
									endMoveCaption(nextcaption,opt,0);
								} catch(e) {}



						});
				}

				//////////////////////////
				//	MOVE OUT THE CAPTIONS //
				/////////////////////////
				function endMoveCaption(nextcaption,opt,mdelay) {


														var mspeed=nextcaption.data('endspeed');
														if (mspeed==undefined) mspeed=nextcaption.data('speed');

														mspeed = mspeed/1000;

														var easedata=nextcaption.data('endeasing');
														if (easedata==undefined) easedata=Power1.easeInOut;



														if (nextcaption.hasClass('ltr') ||
															nextcaption.hasClass('ltl') ||
															nextcaption.hasClass('str') ||
															nextcaption.hasClass('stl') ||
															nextcaption.hasClass('ltt') ||
															nextcaption.hasClass('ltb') ||
															nextcaption.hasClass('stt') ||
															nextcaption.hasClass('stb') ||
															nextcaption.hasClass('skewtoright') ||
															nextcaption.hasClass('skewtorightshort') ||
															nextcaption.hasClass('skewtoleft') ||
															nextcaption.hasClass('skewtoleftshort'))
														{

															skwX = 0;

															if (nextcaption.hasClass('skewtoright') || nextcaption.hasClass('skewtorightshort'))
																skwX = 35

															if (nextcaption.hasClass('skewtoleft') || nextcaption.hasClass('skewtoleftshort'))
																skwX =  -35

															var xx=0;
															var yy=0;

															if (nextcaption.hasClass('ltr') || nextcaption.hasClass('skewtoright'))
																xx=opt.width+60;
															else if (nextcaption.hasClass('ltl') || nextcaption.hasClass('skewtoleft'))
																xx=0-(opt.width+60);
															else if (nextcaption.hasClass('ltt'))
																yy=0-(opt.height+60);
															else if (nextcaption.hasClass('ltb'))
																yy=opt.height+60;
															else if (nextcaption.hasClass('str') || nextcaption.hasClass('skewtorightshort')) {
																xx=50;oo=0;
															} else if (nextcaption.hasClass('stl') || nextcaption.hasClass('skewtoleftshort')) {
																xx=-50;oo=0;
															} else if (nextcaption.hasClass('stt')) {
																yy=-50;oo=0;
															} else if (nextcaption.hasClass('stb')) {
																yy=50;oo=0;
															}

															if (nextcaption.hasClass('skewtorightshort'))
																xx = xx + 220;

															if (nextcaption.hasClass('skewtoleftshort'))
																xx =  xx -220


															nextcaption.data('outanim',TweenLite.to(nextcaption,mspeed,
																		{
																		  x:xx,
																		  y:yy,
																		  scale:1,
																		  rotation:0,
																		  skewX:skwX,
																		  opacity:0,
																		  delay:mdelay,
																		  z:0,
																		  overwrite:"auto",
																		  ease:easedata,
																		  onStart:function() {
						  													if (nextcaption.data('anim') !=undefined)
																			  nextcaption.data('anim').pause();
																		  }
																		 }));

														}

														else

														if ( nextcaption.hasClass("randomrotateout")) {

															nextcaption.data('outanim',TweenLite.to(nextcaption,mspeed,
																		{ left:Math.random()*opt.width,
																		  top:Math.random()*opt.height,
																		  scale:Math.random()*2+0.3,
																		  rotation:Math.random()*360-180,
																		  z:0,
																		  opacity:0,
																		  delay:mdelay,
																		  ease:easedata,
																		  onStart:function() {
																		    if (nextcaption.data('anim') !=undefined)
																			  nextcaption.data('anim').pause();
																		  }
																	}));

														}

														else

														if (nextcaption.hasClass('fadeout')) {


	
															nextcaption.data('outanim',TweenLite.to(nextcaption,mspeed,
																		{ opacity:0,
																		  delay:mdelay,
																		  ease:easedata,
																		  onStart:function() {
																		  if (nextcaption.data('anim') !=undefined)
																			  nextcaption.data('anim').pause();
																		}}));

														}

														else

														if (nextcaption.hasClass("customout")) {
															var tlop = 0,
															 	tlxx = 0, tlyy = 0, tlzz = 2,
															    tlsc = 1,tlro = 0,
															    sc=1,scX=1,scY= 1,
															    ro=0,roX=0,roY=0,roZ = 0,
																skwX=0, skwY = 0,
																opa = 0,
																trorig = "center,center",
																tper = 300;

															var customarray = nextcaption.data('customout').split(';');
															jQuery.each(customarray,function(index,param) {
															//customarray.forEach(function(param) {
																param = param.split(":")

																var w = param[0],
																	v = param[1];


																if (w=="rotationX") roX = parseInt(v,0);
																if (w=="rotationY") roY = parseInt(v,0);
																if (w=="rotationZ") roZ = parseInt(v,0);
																if (w=="scaleX")  scX = parseFloat(v);
																if (w=="scaleY")  scY = parseFloat(v);
																if (w=="opacity") opa = parseFloat(v);
																if (w=="skewX")   skwX = parseInt(v,0);
																if (w=="skewY")   skwY = parseInt(v,0);
																if (w=="x") tlxx = parseInt(v,0);
																if (w=="y") tlyy = parseInt(v,0);
																if (w=="z") tlzz = parseInt(v);
																if (w=="transformOrigin") trorig = v;
																if (w=="transformPerspective") tper=parseInt(v,0);


															})

														
												
															nextcaption.data('outanim',TweenLite.to(nextcaption,mspeed,


																				{
																				  scaleX:scX,
																				  scaleY:scY,
																				  rotationX:roX,
																				  rotationY:roY,
																				  rotationZ:roZ,
																				  x:tlxx,
																				  y:tlyy,
																				  z:tlzz,
																				  opacity:opa,
																				  delay:mdelay,
																				  ease:easedata,
																				  overwrite:"auto",
																				  onStart:function() {

																					  if (nextcaption.data('anim') !=undefined)
																						  nextcaption.data('anim').pause();
																					  TweenLite.set(nextcaption,{
																						  transformPerspective:tper,
																						  transformOrigin:trorig,
																						  overwrite:"auto"
																					  });

																		}}));
														}

														else {
															//TweenLite.to(nextcaption,{delay:mdelay,overwrite:"auto"});
															clearTimeout(nextcaption.data('reversetimer'));
															/*nextcaption.data('reversetimer',setTimeout(function() {
																nextcaption.animate({opacity:"0"});

															},mdelay*1000));*/
														nextcaption.data('reversetimer',setTimeout(function() {

																nextcaption.data('anim').reverse()
															},mdelay*1000));														
	

														}
												}

		///////////////////////////
		//	REMOVE THE LISTENERS //
		///////////////////////////
		function removeAllListeners(container,opt) {
			container.children().each(function() {
			  try{ jQuery(this).die('click'); } catch(e) {}
			  try{ jQuery(this).die('mouseenter');} catch(e) {}
			  try{ jQuery(this).die('mouseleave');} catch(e) {}
			  try{ jQuery(this).unbind('hover');} catch(e) {}
			})
			try{ container.die('click','mouseenter','mouseleave');} catch(e) {}
			clearInterval(opt.cdint);
			container=null;



		}

		///////////////////////////
		//	-	COUNTDOWN	-	//
		/////////////////////////
		function countDown(container,opt) {
			opt.cd=0;
			opt.loop=0;
			if (opt.stopAfterLoops!=undefined && opt.stopAfterLoops>-1)
					opt.looptogo=opt.stopAfterLoops;
			else
				opt.looptogo=9999999;

			if (opt.stopAtSlide!=undefined && opt.stopAtSlide>-1)
					opt.lastslidetoshow=opt.stopAtSlide;
			else
					opt.lastslidetoshow=999;

			opt.stopLoop="off";

			if (opt.looptogo==0) opt.stopLoop="on";



			if (opt.slideamount >1 && !(opt.stopAfterLoops==0 && opt.stopAtSlide==1) ) {
					var bt=container.find('.tp-bannertimer');
					if (bt.length>0) {
						bt.css({'width':'0%'});

						if (opt.videoplaying!=true)
							bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});

					}

					bt.data('opt',opt);


					opt.cdint=setInterval(function() {

						if (jQuery('body').find(container).length==0) removeAllListeners(container,opt);
						if (container.data('conthover-changed') == 1) {
							opt.conthover=	container.data('conthover');
							container.data('conthover-changed',0);
						}

						if (opt.conthover!=1 && opt.videoplaying!=true && opt.width>opt.hideSliderAtLimit) {
							opt.cd=opt.cd+100;
						}


						if (opt.fullWidth!="on")
							if (opt.width>opt.hideSliderAtLimit)
								container.parent().removeClass("tp-hide-revslider")
							else
								container.parent().addClass("tp-hide-revslider")
						// EVENT TRIGGERING IN CASE VIDEO HAS BEEN STARTED
						if (opt.videostartednow==1) {
							container.trigger('revolution.slide.onvideoplay');
							opt.videostartednow=0;
						}

						// EVENT TRIGGERING IN CASE VIDEO HAS BEEN STOPPED
						if (opt.videostoppednow==1) {
							container.trigger('revolution.slide.onvideostop');
							opt.videostoppednow=0;
						}


						if (opt.cd>=opt.delay) {
							opt.cd=0;
							// SWAP TO NEXT BANNER
							opt.act=opt.next;
							opt.next=opt.next+1;
							if (opt.next>container.find('>ul >li').length-1) {
									opt.next=0;
									opt.looptogo=opt.looptogo-1;

									if (opt.looptogo<=0) {
											opt.stopLoop="on";

									}
								}

							// STOP TIMER IF NO LOOP NO MORE NEEDED.

							if (opt.stopLoop=="on" && opt.next==opt.lastslidetoshow-1) {
									clearInterval(opt.cdint);
									container.find('.tp-bannertimer').css({'visibility':'hidden'});
									container.trigger('revolution.slide.onstop');
							}

							// SWAP THE SLIDES
							swapSlide(container,opt);


							// Clear the Timer
							if (bt.length>0) {
								bt.css({'width':'0%'});
								if (opt.videoplaying!=true)
									bt.animate({'width':"100%"},{duration:(opt.delay-100),queue:false, easing:"linear"});
							}
						}
					},100);


					container.hover(
						function() {

							if (opt.onHoverStop=="on") {
									opt.conthover=1;
								bt.stop();
								container.trigger('revolution.slide.onpause');
								var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
								nextsh.find('.defaultimg').each(function() {
									var dimg = jQuery(this);
									if (dimg.data('kenburn')!=undefined)
									   dimg.data('kenburn').pause();
								});
							}
						},
						function() {
							if (container.data('conthover')!=1) {
								container.trigger('revolution.slide.onresume');
								opt.conthover=0;
								if (opt.onHoverStop=="on" && opt.videoplaying!=true) {
									bt.animate({'width':"100%"},{duration:((opt.delay-opt.cd)-100),queue:false, easing:"linear"});
								}
								var nextsh = container.find('>ul >li:eq('+opt.next+') .slotholder');
								nextsh.find('.defaultimg').each(function() {
									var dimg = jQuery(this);
									if (dimg.data('kenburn')!=undefined)
									   dimg.data('kenburn').play();
								});
							}
						});
			}
		}



})(jQuery);


// SOME ERROR MESSAGES IN CASE THE PLUGIN CAN NOT BE LOADED
function revslider_showDoubleJqueryError(sliderID) {
	var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
	errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
	errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
	errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
	errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
		jQuery(sliderID).show().html(errorMessage);
}

;

/* qf-share: (http://www.artjiahua.com/FeiEditor/bitSite/js/share/jquery.share.min.js) */
/**
 * Share.js
 *
 * @author  overtrue <i@overtrue.me>
 * @license MIT
 *
 * @example
 * <pre>
 * $('.share-components').share();
 *
 * // or
 *
 * $('.share-bar').share({
 *     sites: ['qzone', 'qq', 'weibo','wechat'],
 *     // ...
 * });
 * </pre>
 */
;(function($){
    /**
     * Initialize a share bar.
     *
     * @param {Object}        $options globals (optional).
     *
     * @return {Void}
     */
    $.fn.share = function ($options) {
        var $head = $(document.head);

        var $defaults = {
            url: $(this).attr("data-config-url"),
            site_url: location.origin,
            source: $(this).attr("data-config-title"),
            title: $(this).attr("data-config-title"),
            description: $(this).attr("data-config-desc")?$(this).attr("data-config-desc"):'',
            image: $(this).attr("data-config-pic")?$(this).attr("data-config-pic"):$('img:first').prop('src'),
            imageSelector: undefined,

            weiboKey: '',

            wechatQrcodeTitle: '微信扫一扫：分享',
            wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
            wechatQrcodeSize: 100,

            mobileSites: [],
            sites: ['weibo','qq','wechat','tencent','douban','qzone','linkedin','diandian','facebook','twitter','google','line'],
            disabled: [],
            initialized: false
        };

        var $globals = $.extend({}, $defaults, $options);


        var $templates = {
            qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}',
            qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&summary={{DESCRIPTION}}&pics={{IMAGE}}',
            tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
            weibo       : 'https://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}',
            wechat      : 'javascript:;',
            douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11',
            diandian    : 'http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link',
            linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin',
            facebook    : 'https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESCRIPTION}}&caption={{SUBHEAD}}&link={{URL}}&picture={{IMAGE}}',
            twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITE_URL}}',
            google      : 'https://plus.google.com/share?url={{URL}}',
            line        : 'http://line.naver.jp/R/msg/text/?{{TITLE}}%0D%0A{{URL}}',
        };

        var $ariaLabels = {
            qzone: "QQ空间",
            qq: "QQ",
            tencent: "腾讯微博",
            weibo: "微博",
            wechat: "微信",
            douban: "豆瓣",
            diandian: "点点",
            linkedin: "LinkedIn",
            facebook: "Facebook",
            twitter: "Twitter",
            google: "Google",
            line:"Line",
        };

        this.each(function() {
            if ($(this).data('initialized') || $(this).hasClass('initialized')) {
                return true;
            }

            var $data      = $.extend({}, $globals, $(this).data());


            if ($data.imageSelector) {
                $data.image = $($data.imageSelector).map(function() {
                    return $(this).prop('src');
                }).get().join('||');
            }
            var $container = $(this).addClass('share-component social-share');

            createIcons($container, $data);
            createWechat($container, $data);


            $(this).data('initialized', true).addClass('initialized');
        });

        /**
         * Create site icons
         *
         * @param {Object|String} $container
         * @param {Object}        $data
         */
        function createIcons ($container, $data) {

            var $sites = getSites($data);

            $data.mode == 'prepend' ? $sites.reverse() : $sites

            if (!$sites.length) {return;}

            $.each($sites, function (i, $name) {
                var $url  = makeUrl($name, $data);
                var $link = $data.initialized ? $container.find('.icon-'+$name) : $('<a class="social-share-icon icon-'+$name+'"></a>');

                if (!$link.length) {
                    return true;
                }
                $link.prop('aria-label', "分享到 "+$ariaLabels[$name]);

                $link.prop('href', $url);

                if ($name === 'wechat') {
                    $link.prop('tabindex', -1);
                } else {
                    $link.prop('target', '_blank');
                }

                if (!$data.initialized) {
                    $data.mode == 'prepend' ? $container.prepend($link) : $container.append($link);
                }
            });
        }

        /**
         * Create the wechat icon and QRCode.
         *
         * @param {Object|String} $container
         * @param {Object}        $data
         */
        function createWechat ($container, $data) {
            var $wechat = $container.find('a.icon-wechat');

            if (!$wechat.length) {return;}



            $wechat.append('<div class="wechat-qrcode"><h4>'+$data.wechatQrcodeTitle+'</h4><div class="qrcode"></div><div class="help">'+$data.wechatQrcodeHelper+'</div></div>');

            $wechat.find('.qrcode').qrcode({render: 'image', size: $data.wechatQrcodeSize, text: $data.url});

            /*if ($wechat.offset().top < 100) {
                $wechat.find('.wechat-qrcode').addClass('bottom');
            }*/
			var title =  $wechat.find('.qrcode').html();

			new Opentip($wechat, title, { tipJoint: "bottom", background:"#ffffff", borderColor:"#cccccc"});
			$wechat.find(".wechat-qrcode").remove();

        }

        /**
         * Get available site lists.
         *
         * @param {Array} $data
         *
         * @return {Array}
         */
        function getSites ($data) {
            if ($data['mobileSites'].length === 0 && $data['sites'].length) {
                $data['mobileSites'] = $data['sites'];
            };

            var $sites = (isMobileScreen() ? $data['mobileSites'] : ($data['sites'].length ? $data['sites']: [])).slice(0);

            var $disabled = $data['disabled'];

            if (typeof $sites == 'string') { $sites = $sites.split(/\s*,\s*/); }
            if (typeof $disabled == 'string') { $disabled = $disabled.split(/\s*,\s*/); }

            if (runningInWeChat()) {
                $disabled.push('wechat');
            }
            // Remove elements
            $disabled.length && $.each($disabled, function (i, el) {
                var removeItemIndex = $.inArray(el, $sites);
                if (removeItemIndex !== -1) {
                    $sites.splice(removeItemIndex, 1);
                }
            });

            return $sites;
        }

        /**
         * Build the url of icon.
         *
         * @param {String} $name
         * @param {Object} $data
         *
         * @return {String}
         */
        function makeUrl ($name, $data) {
            var $template = $templates[$name];
            $data['summary'] = $data['description'];

            for (var $key in $data) {
                if ($data.hasOwnProperty($key)) {
                    var $camelCaseKey = $name + $key.replace(/^[a-z]/, function($str){
                        return $str.toUpperCase();
                    });

                    var $value = encodeURIComponent($data[$camelCaseKey] === undefined ? $data[$key] : $data[$camelCaseKey]);
                    $template = $template.replace(new RegExp('{{'+$key.toUpperCase()+'}}', 'g'), $value);
                }
            }

            return $template;
        }

        /**
         * Detect wechat browser.
         *
         * @return {Boolean}
         */
        function runningInWeChat() {
            return /MicroMessenger/i.test(navigator.userAgent);
        }

        /**
         * Mobile screen width.
         *
         * @return {boolean}
         */
        function isMobileScreen () {
            return $(window).width() <= 768;
        }
    };

    // Domready after initialization
    $(function () {
        $('.share-component,.social-share').share();
    });
})(jQuery);

/* jQuery.qrcode 0.12.0 - http://larsjung.de/jquery-qrcode/ - uses //github.com/kazuhikoarase/qrcode-generator (MIT) */
!function(r){"use strict";function t(t,e,n,o){function i(r,t){return r-=o,t-=o,0>r||r>=u||0>t||t>=u?!1:a.isDark(r,t)}var a=r(n,e);a.addData(t),a.make(),o=o||0;var u=a.getModuleCount(),f=a.getModuleCount()+2*o,c=function(r,t,e,n){var o=this.isDark,i=1/f;this.isDark=function(a,u){var f=u*i,c=a*i,l=f+i,g=c+i;return o(a,u)&&(r>l||f>e||t>g||c>n)}};this.text=t,this.level=e,this.version=n,this.moduleCount=f,this.isDark=i,this.addBlank=c}function e(r,e,n,o,i){n=Math.max(1,n||1),o=Math.min(40,o||40);for(var a=n;o>=a;a+=1)try{return new t(r,e,a,i)}catch(u){}}function n(r,t,e){var n=e.size,o="bold "+e.mSize*n+"px "+e.fontname,i=w("<canvas/>")[0].getContext("2d");i.font=o;var a=i.measureText(e.label).width,u=e.mSize,f=a/n,c=(1-f)*e.mPosX,l=(1-u)*e.mPosY,g=c+f,s=l+u,h=.01;1===e.mode?r.addBlank(0,l-h,n,s+h):r.addBlank(c-h,l-h,g+h,s+h),t.fillStyle=e.fontcolor,t.font=o,t.fillText(e.label,c*n,l*n+.75*e.mSize*n)}function o(r,t,e){var n=e.size,o=e.image.naturalWidth||1,i=e.image.naturalHeight||1,a=e.mSize,u=a*o/i,f=(1-u)*e.mPosX,c=(1-a)*e.mPosY,l=f+u,g=c+a,s=.01;3===e.mode?r.addBlank(0,c-s,n,g+s):r.addBlank(f-s,c-s,l+s,g+s),t.drawImage(e.image,f*n,c*n,u*n,a*n)}function i(r,t,e){w(e.background).is("img")?t.drawImage(e.background,0,0,e.size,e.size):e.background&&(t.fillStyle=e.background,t.fillRect(e.left,e.top,e.size,e.size));var i=e.mode;1===i||2===i?n(r,t,e):(3===i||4===i)&&o(r,t,e)}function a(r,t,e,n,o,i,a,u){r.isDark(a,u)&&t.rect(n,o,i,i)}function u(r,t,e,n,o,i,a,u,f,c){a?r.moveTo(t+i,e):r.moveTo(t,e),u?(r.lineTo(n-i,e),r.arcTo(n,e,n,o,i)):r.lineTo(n,e),f?(r.lineTo(n,o-i),r.arcTo(n,o,t,o,i)):r.lineTo(n,o),c?(r.lineTo(t+i,o),r.arcTo(t,o,t,e,i)):r.lineTo(t,o),a?(r.lineTo(t,e+i),r.arcTo(t,e,n,e,i)):r.lineTo(t,e)}function f(r,t,e,n,o,i,a,u,f,c){a&&(r.moveTo(t+i,e),r.lineTo(t,e),r.lineTo(t,e+i),r.arcTo(t,e,t+i,e,i)),u&&(r.moveTo(n-i,e),r.lineTo(n,e),r.lineTo(n,e+i),r.arcTo(n,e,n-i,e,i)),f&&(r.moveTo(n-i,o),r.lineTo(n,o),r.lineTo(n,o-i),r.arcTo(n,o,n-i,o,i)),c&&(r.moveTo(t+i,o),r.lineTo(t,o),r.lineTo(t,o-i),r.arcTo(t,o,t+i,o,i))}function c(r,t,e,n,o,i,a,c){var l=r.isDark,g=n+i,s=o+i,h=e.radius*i,v=a-1,d=a+1,w=c-1,m=c+1,p=l(a,c),y=l(v,w),T=l(v,c),B=l(v,m),A=l(a,m),E=l(d,m),k=l(d,c),M=l(d,w),C=l(a,w);p?u(t,n,o,g,s,h,!T&&!C,!T&&!A,!k&&!A,!k&&!C):f(t,n,o,g,s,h,T&&C&&y,T&&A&&B,k&&A&&E,k&&C&&M)}function l(r,t,e){var n,o,i=r.moduleCount,u=e.size/i,f=a;for(p&&e.radius>0&&e.radius<=.5&&(f=c),t.beginPath(),n=0;i>n;n+=1)for(o=0;i>o;o+=1){var l=e.left+o*u,g=e.top+n*u,s=u;f(r,t,e,l,g,s,n,o)}if(w(e.fill).is("img")){t.strokeStyle="rgba(0,0,0,0.5)",t.lineWidth=2,t.stroke();var h=t.globalCompositeOperation;t.globalCompositeOperation="destination-out",t.fill(),t.globalCompositeOperation=h,t.clip(),t.drawImage(e.fill,0,0,e.size,e.size),t.restore()}else t.fillStyle=e.fill,t.fill()}function g(r,t){var n=e(t.text,t.ecLevel,t.minVersion,t.maxVersion,t.quiet);if(!n)return null;var o=w(r).data("qrcode",n),a=o[0].getContext("2d");return i(n,a,t),l(n,a,t),o}function s(r){var t=w("<canvas/>").attr("width",r.size).attr("height",r.size);return g(t,r)}function h(r){return w("<img/>").attr("src",s(r)[0].toDataURL("image/png"))}function v(r){var t=e(r.text,r.ecLevel,r.minVersion,r.maxVersion,r.quiet);if(!t)return null;var n,o,i=r.size,a=r.background,u=Math.floor,f=t.moduleCount,c=u(i/f),l=u(.5*(i-c*f)),g={position:"relative",left:0,top:0,padding:0,margin:0,width:i,height:i},s={position:"absolute",padding:0,margin:0,width:c,height:c,"background-color":r.fill},h=w("<div/>").data("qrcode",t).css(g);for(a&&h.css("background-color",a),n=0;f>n;n+=1)for(o=0;f>o;o+=1)t.isDark(n,o)&&w("<div/>").css(s).css({left:l+o*c,top:l+n*c}).appendTo(h);return h}function d(r){return m&&"canvas"===r.render?s(r):m&&"image"===r.render?h(r):v(r)}var w=jQuery,m=function(){var r=document.createElement("canvas");return Boolean(r.getContext&&r.getContext("2d"))}(),p="[object Opera]"!==Object.prototype.toString.call(window.opera),y={render:"canvas",minVersion:1,maxVersion:40,ecLevel:"L",left:0,top:0,size:200,fill:"#000",background:null,text:"no text",radius:0,quiet:0,mode:0,mSize:.1,mPosX:.5,mPosY:.5,label:"no label",fontname:"sans",fontcolor:"#000",image:null};w.fn.qrcode=function(r){var t=w.extend({},y,r);return this.each(function(){"canvas"===this.nodeName.toLowerCase()?g(this,t):w(this).append(d(t))})}}(function(){var r=function(){function r(t,e){if("undefined"==typeof t.length)throw new Error(t.length+"/"+e);var n=function(){for(var r=0;r<t.length&&0==t[r];)r+=1;for(var n=new Array(t.length-r+e),o=0;o<t.length-r;o+=1)n[o]=t[o+r];return n}(),o={};return o.getAt=function(r){return n[r]},o.getLength=function(){return n.length},o.multiply=function(t){for(var e=new Array(o.getLength()+t.getLength()-1),n=0;n<o.getLength();n+=1)for(var i=0;i<t.getLength();i+=1)e[n+i]^=a.gexp(a.glog(o.getAt(n))+a.glog(t.getAt(i)));return r(e,0)},o.mod=function(t){if(o.getLength()-t.getLength()<0)return o;for(var e=a.glog(o.getAt(0))-a.glog(t.getAt(0)),n=new Array(o.getLength()),i=0;i<o.getLength();i+=1)n[i]=o.getAt(i);for(var i=0;i<t.getLength();i+=1)n[i]^=a.gexp(a.glog(t.getAt(i))+e);return r(n,0).mod(t)},o}var t=function(t,e){var o=236,a=17,l=t,g=n[e],s=null,h=0,d=null,w=new Array,m={},p=function(r,t){h=4*l+17,s=function(r){for(var t=new Array(r),e=0;r>e;e+=1){t[e]=new Array(r);for(var n=0;r>n;n+=1)t[e][n]=null}return t}(h),y(0,0),y(h-7,0),y(0,h-7),A(),B(),k(r,t),l>=7&&E(r),null==d&&(d=D(l,g,w)),M(d,t)},y=function(r,t){for(var e=-1;7>=e;e+=1)if(!(-1>=r+e||r+e>=h))for(var n=-1;7>=n;n+=1)-1>=t+n||t+n>=h||(e>=0&&6>=e&&(0==n||6==n)||n>=0&&6>=n&&(0==e||6==e)||e>=2&&4>=e&&n>=2&&4>=n?s[r+e][t+n]=!0:s[r+e][t+n]=!1)},T=function(){for(var r=0,t=0,e=0;8>e;e+=1){p(!0,e);var n=i.getLostPoint(m);(0==e||r>n)&&(r=n,t=e)}return t},B=function(){for(var r=8;h-8>r;r+=1)null==s[r][6]&&(s[r][6]=r%2==0);for(var t=8;h-8>t;t+=1)null==s[6][t]&&(s[6][t]=t%2==0)},A=function(){for(var r=i.getPatternPosition(l),t=0;t<r.length;t+=1)for(var e=0;e<r.length;e+=1){var n=r[t],o=r[e];if(null==s[n][o])for(var a=-2;2>=a;a+=1)for(var u=-2;2>=u;u+=1)-2==a||2==a||-2==u||2==u||0==a&&0==u?s[n+a][o+u]=!0:s[n+a][o+u]=!1}},E=function(r){for(var t=i.getBCHTypeNumber(l),e=0;18>e;e+=1){var n=!r&&1==(t>>e&1);s[Math.floor(e/3)][e%3+h-8-3]=n}for(var e=0;18>e;e+=1){var n=!r&&1==(t>>e&1);s[e%3+h-8-3][Math.floor(e/3)]=n}},k=function(r,t){for(var e=g<<3|t,n=i.getBCHTypeInfo(e),o=0;15>o;o+=1){var a=!r&&1==(n>>o&1);6>o?s[o][8]=a:8>o?s[o+1][8]=a:s[h-15+o][8]=a}for(var o=0;15>o;o+=1){var a=!r&&1==(n>>o&1);8>o?s[8][h-o-1]=a:9>o?s[8][15-o-1+1]=a:s[8][15-o-1]=a}s[h-8][8]=!r},M=function(r,t){for(var e=-1,n=h-1,o=7,a=0,u=i.getMaskFunction(t),f=h-1;f>0;f-=2)for(6==f&&(f-=1);;){for(var c=0;2>c;c+=1)if(null==s[n][f-c]){var l=!1;a<r.length&&(l=1==(r[a]>>>o&1));var g=u(n,f-c);g&&(l=!l),s[n][f-c]=l,o-=1,-1==o&&(a+=1,o=7)}if(n+=e,0>n||n>=h){n-=e,e=-e;break}}},C=function(t,e){for(var n=0,o=0,a=0,u=new Array(e.length),f=new Array(e.length),c=0;c<e.length;c+=1){var l=e[c].dataCount,g=e[c].totalCount-l;o=Math.max(o,l),a=Math.max(a,g),u[c]=new Array(l);for(var s=0;s<u[c].length;s+=1)u[c][s]=255&t.getBuffer()[s+n];n+=l;var h=i.getErrorCorrectPolynomial(g),v=r(u[c],h.getLength()-1),d=v.mod(h);f[c]=new Array(h.getLength()-1);for(var s=0;s<f[c].length;s+=1){var w=s+d.getLength()-f[c].length;f[c][s]=w>=0?d.getAt(w):0}}for(var m=0,s=0;s<e.length;s+=1)m+=e[s].totalCount;for(var p=new Array(m),y=0,s=0;o>s;s+=1)for(var c=0;c<e.length;c+=1)s<u[c].length&&(p[y]=u[c][s],y+=1);for(var s=0;a>s;s+=1)for(var c=0;c<e.length;c+=1)s<f[c].length&&(p[y]=f[c][s],y+=1);return p},D=function(r,t,e){for(var n=u.getRSBlocks(r,t),c=f(),l=0;l<e.length;l+=1){var g=e[l];c.put(g.getMode(),4),c.put(g.getLength(),i.getLengthInBits(g.getMode(),r)),g.write(c)}for(var s=0,l=0;l<n.length;l+=1)s+=n[l].dataCount;if(c.getLengthInBits()>8*s)throw new Error("code length overflow. ("+c.getLengthInBits()+">"+8*s+")");for(c.getLengthInBits()+4<=8*s&&c.put(0,4);c.getLengthInBits()%8!=0;)c.putBit(!1);for(;;){if(c.getLengthInBits()>=8*s)break;if(c.put(o,8),c.getLengthInBits()>=8*s)break;c.put(a,8)}return C(c,n)};return m.addData=function(r){var t=c(r);w.push(t),d=null},m.isDark=function(r,t){if(0>r||r>=h||0>t||t>=h)throw new Error(r+","+t);return s[r][t]},m.getModuleCount=function(){return h},m.make=function(){p(!1,T())},m.createTableTag=function(r,t){r=r||2,t="undefined"==typeof t?4*r:t;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+t+"px;",e+='">',e+="<tbody>";for(var n=0;n<m.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<m.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+r+"px;",e+=" height: "+r+"px;",e+=" background-color: ",e+=m.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},m.createImgTag=function(r,t){r=r||2,t="undefined"==typeof t?4*r:t;var e=m.getModuleCount()*r+2*t,n=t,o=e-t;return v(e,e,function(t,e){if(t>=n&&o>t&&e>=n&&o>e){var i=Math.floor((t-n)/r),a=Math.floor((e-n)/r);return m.isDark(a,i)?0:1}return 1})},m};t.stringToBytes=function(r){for(var t=new Array,e=0;e<r.length;e+=1){var n=r.charCodeAt(e);t.push(255&n)}return t},t.createStringToBytes=function(r,t){var e=function(){for(var e=s(r),n=function(){var r=e.read();if(-1==r)throw new Error;return r},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n(),c=n(),l=String.fromCharCode(a<<8|u),g=f<<8|c;i[l]=g,o+=1}if(o!=t)throw new Error(o+" != "+t);return i}(),n="?".charCodeAt(0);return function(r){for(var t=new Array,o=0;o<r.length;o+=1){var i=r.charCodeAt(o);if(128>i)t.push(i);else{var a=e[r.charAt(o)];"number"==typeof a?(255&a)==a?t.push(a):(t.push(a>>>8),t.push(255&a)):t.push(n)}}return t}};var e={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},n={L:1,M:0,Q:3,H:2},o={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},i=function(){var t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,i=7973,u=21522,f={},c=function(r){for(var t=0;0!=r;)t+=1,r>>>=1;return t};return f.getBCHTypeInfo=function(r){for(var t=r<<10;c(t)-c(n)>=0;)t^=n<<c(t)-c(n);return(r<<10|t)^u},f.getBCHTypeNumber=function(r){for(var t=r<<12;c(t)-c(i)>=0;)t^=i<<c(t)-c(i);return r<<12|t},f.getPatternPosition=function(r){return t[r-1]},f.getMaskFunction=function(r){switch(r){case o.PATTERN000:return function(r,t){return(r+t)%2==0};case o.PATTERN001:return function(r,t){return r%2==0};case o.PATTERN010:return function(r,t){return t%3==0};case o.PATTERN011:return function(r,t){return(r+t)%3==0};case o.PATTERN100:return function(r,t){return(Math.floor(r/2)+Math.floor(t/3))%2==0};case o.PATTERN101:return function(r,t){return r*t%2+r*t%3==0};case o.PATTERN110:return function(r,t){return(r*t%2+r*t%3)%2==0};case o.PATTERN111:return function(r,t){return(r*t%3+(r+t)%2)%2==0};default:throw new Error("bad maskPattern:"+r)}},f.getErrorCorrectPolynomial=function(t){for(var e=r([1],0),n=0;t>n;n+=1)e=e.multiply(r([1,a.gexp(n)],0));return e},f.getLengthInBits=function(r,t){if(t>=1&&10>t)switch(r){case e.MODE_NUMBER:return 10;case e.MODE_ALPHA_NUM:return 9;case e.MODE_8BIT_BYTE:return 8;case e.MODE_KANJI:return 8;default:throw new Error("mode:"+r)}else if(27>t)switch(r){case e.MODE_NUMBER:return 12;case e.MODE_ALPHA_NUM:return 11;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 10;default:throw new Error("mode:"+r)}else{if(!(41>t))throw new Error("type:"+t);switch(r){case e.MODE_NUMBER:return 14;case e.MODE_ALPHA_NUM:return 13;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 12;default:throw new Error("mode:"+r)}}},f.getLostPoint=function(r){for(var t=r.getModuleCount(),e=0,n=0;t>n;n+=1)for(var o=0;t>o;o+=1){for(var i=0,a=r.isDark(n,o),u=-1;1>=u;u+=1)if(!(0>n+u||n+u>=t))for(var f=-1;1>=f;f+=1)0>o+f||o+f>=t||(0!=u||0!=f)&&a==r.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(var n=0;t-1>n;n+=1)for(var o=0;t-1>o;o+=1){var c=0;r.isDark(n,o)&&(c+=1),r.isDark(n+1,o)&&(c+=1),r.isDark(n,o+1)&&(c+=1),r.isDark(n+1,o+1)&&(c+=1),(0==c||4==c)&&(e+=3)}for(var n=0;t>n;n+=1)for(var o=0;t-6>o;o+=1)r.isDark(n,o)&&!r.isDark(n,o+1)&&r.isDark(n,o+2)&&r.isDark(n,o+3)&&r.isDark(n,o+4)&&!r.isDark(n,o+5)&&r.isDark(n,o+6)&&(e+=40);for(var o=0;t>o;o+=1)for(var n=0;t-6>n;n+=1)r.isDark(n,o)&&!r.isDark(n+1,o)&&r.isDark(n+2,o)&&r.isDark(n+3,o)&&r.isDark(n+4,o)&&!r.isDark(n+5,o)&&r.isDark(n+6,o)&&(e+=40);for(var l=0,o=0;t>o;o+=1)for(var n=0;t>n;n+=1)r.isDark(n,o)&&(l+=1);var g=Math.abs(100*l/t/t-50)/5;return e+=10*g},f}(),a=function(){for(var r=new Array(256),t=new Array(256),e=0;8>e;e+=1)r[e]=1<<e;for(var e=8;256>e;e+=1)r[e]=r[e-4]^r[e-5]^r[e-6]^r[e-8];for(var e=0;255>e;e+=1)t[r[e]]=e;var n={};return n.glog=function(r){if(1>r)throw new Error("glog("+r+")");return t[r]},n.gexp=function(t){for(;0>t;)t+=255;for(;t>=256;)t-=255;return r[t]},n}(),u=function(){var r=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(r,t){var e={};return e.totalCount=r,e.dataCount=t,e},e={},o=function(t,e){switch(e){case n.L:return r[4*(t-1)+0];case n.M:return r[4*(t-1)+1];case n.Q:return r[4*(t-1)+2];case n.H:return r[4*(t-1)+3];default:return void 0}};return e.getRSBlocks=function(r,e){var n=o(r,e);if("undefined"==typeof n)throw new Error("bad rs block @ typeNumber:"+r+"/errorCorrectLevel:"+e);for(var i=n.length/3,a=new Array,u=0;i>u;u+=1)for(var f=n[3*u+0],c=n[3*u+1],l=n[3*u+2],g=0;f>g;g+=1)a.push(t(c,l));return a},e}(),f=function(){var r=new Array,t=0,e={};return e.getBuffer=function(){return r},e.getAt=function(t){var e=Math.floor(t/8);return 1==(r[e]>>>7-t%8&1)},e.put=function(r,t){for(var n=0;t>n;n+=1)e.putBit(1==(r>>>t-n-1&1))},e.getLengthInBits=function(){return t},e.putBit=function(e){var n=Math.floor(t/8);r.length<=n&&r.push(0),e&&(r[n]|=128>>>t%8),t+=1},e},c=function(r){var n=e.MODE_8BIT_BYTE,o=t.stringToBytes(r),i={};return i.getMode=function(){return n},i.getLength=function(r){return o.length},i.write=function(r){for(var t=0;t<o.length;t+=1)r.put(o[t],8)},i},l=function(){var r=new Array,t={};return t.writeByte=function(t){r.push(255&t)},t.writeShort=function(r){t.writeByte(r),t.writeByte(r>>>8)},t.writeBytes=function(r,e,n){e=e||0,n=n||r.length;for(var o=0;n>o;o+=1)t.writeByte(r[o+e])},t.writeString=function(r){for(var e=0;e<r.length;e+=1)t.writeByte(r.charCodeAt(e))},t.toByteArray=function(){return r},t.toString=function(){var t="";t+="[";for(var e=0;e<r.length;e+=1)e>0&&(t+=","),t+=r[e];return t+="]"},t},g=function(){var r=0,t=0,e=0,n="",o={},i=function(r){n+=String.fromCharCode(a(63&r))},a=function(r){if(0>r);else{if(26>r)return 65+r;if(52>r)return 97+(r-26);if(62>r)return 48+(r-52);if(62==r)return 43;if(63==r)return 47}throw new Error("n:"+r)};return o.writeByte=function(n){for(r=r<<8|255&n,t+=8,e+=1;t>=6;)i(r>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(r<<6-t),r=0,t=0),e%3!=0)for(var o=3-e%3,a=0;o>a;a+=1)n+="="},o.toString=function(){return n},o},s=function(r){var t=r,e=0,n=0,o=0,i={};i.read=function(){for(;8>o;){if(e>=t.length){if(0==o)return-1;throw new Error("unexpected end of file./"+o)}var r=t.charAt(e);if(e+=1,"="==r)return o=0,-1;r.match(/^\s$/)||(n=n<<6|a(r.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i};var a=function(r){if(r>=65&&90>=r)return r-65;if(r>=97&&122>=r)return r-97+26;if(r>=48&&57>=r)return r-48+52;if(43==r)return 62;if(47==r)return 63;throw new Error("c:"+r)};return i},h=function(r,t){var e=r,n=t,o=new Array(r*t),i={};i.setPixel=function(r,t,n){o[t*e+r]=n},i.write=function(r){r.writeString("GIF87a"),r.writeShort(e),r.writeShort(n),r.writeByte(128),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(255),r.writeByte(255),r.writeByte(255),r.writeString(","),r.writeShort(0),r.writeShort(0),r.writeShort(e),r.writeShort(n),r.writeByte(0);var t=2,o=u(t);r.writeByte(t);for(var i=0;o.length-i>255;)r.writeByte(255),r.writeBytes(o,i,255),i+=255;r.writeByte(o.length-i),r.writeBytes(o,i,o.length-i),r.writeByte(0),r.writeString(";")};var a=function(r){var t=r,e=0,n=0,o={};return o.write=function(r,o){if(r>>>o!=0)throw new Error("length over");for(;e+o>=8;)t.writeByte(255&(r<<e|n)),o-=8-e,r>>>=8-e,n=0,e=0;n=r<<e|n,e+=o},o.flush=function(){e>0&&t.writeByte(n)},o},u=function(r){for(var t=1<<r,e=(1<<r)+1,n=r+1,i=f(),u=0;t>u;u+=1)i.add(String.fromCharCode(u));i.add(String.fromCharCode(t)),i.add(String.fromCharCode(e));var c=l(),g=a(c);g.write(t,n);var s=0,h=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var v=String.fromCharCode(o[s]);s+=1,i.contains(h+v)?h+=v:(g.write(i.indexOf(h),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(h+v)),h=v)}return g.write(i.indexOf(h),n),g.write(e,n),g.flush(),c.toByteArray()},f=function(){var r={},t=0,e={};return e.add=function(n){if(e.contains(n))throw new Error("dup key:"+n);r[n]=t,t+=1},e.size=function(){return t},e.indexOf=function(t){return r[t]},e.contains=function(t){return"undefined"!=typeof r[t]},e};return i},v=function(r,t,e,n){for(var o=h(r,t),i=0;t>i;i+=1)for(var a=0;r>a;a+=1)o.setPixel(a,i,e(a,i));var u=l();o.write(u);for(var f=g(),c=u.toByteArray(),s=0;s<c.length;s+=1)f.writeByte(c[s]);f.flush();var v="";return v+="<img",v+=' src="',v+="data:image/gif;base64,",v+=f,v+='"',v+=' width="',v+=r,v+='"',v+=' height="',v+=t,v+='"',n&&(v+=' alt="',v+=n,v+='"'),v+="/>"};return t}();return function(r){"function"==typeof define&&define.amd?define([],r):"object"==typeof exports&&(module.exports=r())}(function(){return r}),!function(r){r.stringToBytes=function(r){function t(r){for(var t=[],e=0;e<r.length;e++){var n=r.charCodeAt(e);128>n?t.push(n):2048>n?t.push(192|n>>6,128|63&n):55296>n||n>=57344?t.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&r.charCodeAt(e)),t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return t}return t(r)}}(r),r}());
;

/* dt-main-roya-js: (http://www.artjiahua.com/FeiEditor/bitSite/js/jquery.royalslider.min.js) */
// jQuery RoyalSlider plugin. Copyright Dmitry Semenov http://dimsemenov.com
// jquery.royalslider v9.5.7
(function(n){function v(b,f){var c,a=this,e=window.navigator,g=e.userAgent.toLowerCase();a.uid=n.rsModules.uid++;a.ns=".rs"+a.uid;var d=document.createElement("div").style,h=["webkit","Moz","ms","O"],k="",l=0,q;for(c=0;c<h.length;c++)q=h[c],!k&&q+"Transform"in d&&(k=q),q=q.toLowerCase(),window.requestAnimationFrame||(window.requestAnimationFrame=window[q+"RequestAnimationFrame"],window.cancelAnimationFrame=window[q+"CancelAnimationFrame"]||window[q+"CancelRequestAnimationFrame"]);window.requestAnimationFrame||
(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-l)),e=window.setTimeout(function(){a(c+d)},d);l=c+d;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.isIPAD=g.match(/(ipad)/);a.isIOS=a.isIPAD||g.match(/(iphone|ipod)/);c=function(a){a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||
[];return{browser:a[1]||"",version:a[2]||"0"}}(g);h={};c.browser&&(h[c.browser]=!0,h.version=c.version);h.chrome&&(h.webkit=!0);a._a=h;a.isAndroid=-1<g.indexOf("android");a.slider=n(b);a.ev=n(a);a._b=n(document);a.st=n.extend({},n.fn.royalSlider.defaults,f);a._c=a.st.transitionSpeed;a._d=0;!a.st.allowCSS3||h.webkit&&!a.st.allowCSS3OnWebkit||(c=k+(k?"T":"t"),a._e=c+"ransform"in d&&c+"ransition"in d,a._e&&(a._f=k+(k?"P":"p")+"erspective"in d));k=k.toLowerCase();a._g="-"+k+"-";a._h="vertical"===a.st.slidesOrientation?
!1:!0;a._i=a._h?"left":"top";a._j=a._h?"width":"height";a._k=-1;a._l="fade"===a.st.transitionType?!1:!0;a._l||(a.st.sliderDrag=!1,a._m=10);a._n="z-index:0; display:none; opacity:0;";a._o=0;a._p=0;a._q=0;n.each(n.rsModules,function(b,c){"uid"!==b&&c.call(a)});a.slides=[];a._r=0;(a.st.slides?n(a.st.slides):a.slider.children().detach()).each(function(){a._s(this,!0)});a.st.randomizeSlides&&a.slides.sort(function(){return.5-Math.random()});a.numSlides=a.slides.length;a._t();a.st.startSlideId?a.st.startSlideId>
a.numSlides-1&&(a.st.startSlideId=a.numSlides-1):a.st.startSlideId=0;a._o=a.staticSlideId=a.currSlideId=a._u=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._v=0;a.pointerMultitouch=!1;a.slider.addClass((a._h?"rsHor":"rsVer")+(a._l?"":" rsFade"));d='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._w=(a._h?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._x=Boolean(0<a._y);1>=a.numSlides&&(a._z=!1);a._a1=a._z&&a._l?2===a.numSlides?1:2:0;a._b1=
6>a.numSlides?a.numSlides:6;a._c1=0;a._d1=0;a.slidesJQ=[];for(c=0;c<a.numSlides;c++)a.slidesJQ.push(n('<div style="'+(a._l?"":c!==a.currSlideId?a._n:"z-index:0;")+'" class="rsSlide "></div>'));a._e1=d=n(d+"</div></div>");var m=a.ns,k=function(b,c,d,e,f){a._j1=b+c+m;a._k1=b+d+m;a._l1=b+e+m;f&&(a._m1=b+f+m)};c=e.pointerEnabled;a.pointerEnabled=c||e.msPointerEnabled;a.pointerEnabled?(a.hasTouch=!1,a._n1=.2,a.pointerMultitouch=Boolean(1<e[(c?"m":"msM")+"axTouchPoints"]),c?k("pointer","down","move","up",
"cancel"):k("MSPointer","Down","Move","Up","Cancel")):(a.isIOS?a._j1=a._k1=a._l1=a._m1="":k("mouse","down","move","up"),"ontouchstart"in window||"createTouch"in document?(a.hasTouch=!0,a._j1+=" touchstart"+m,a._k1+=" touchmove"+m,a._l1+=" touchend"+m,a._m1+=" touchcancel"+m,a._n1=.5,a.st.sliderTouch&&(a._f1=!0)):(a.hasTouch=!1,a._n1=.2));a.st.sliderDrag&&(a._f1=!0,h.msie||h.opera?a._g1=a._h1="move":h.mozilla?(a._g1="-moz-grab",a._h1="-moz-grabbing"):h.webkit&&-1!=e.platform.indexOf("Mac")&&(a._g1=
"-webkit-grab",a._h1="-webkit-grabbing"),a._i1());a.slider.html(d);a._o1=a.st.controlsInside?a._e1:a.slider;a._p1=a._e1.children(".rsContainer");a.pointerEnabled&&a._p1.css((c?"":"-ms-")+"touch-action",a._h?"pan-y":"pan-x");a._q1=n('<div class="rsPreloader"></div>');e=a._p1.children(".rsSlide");a._r1=a.slidesJQ[a.currSlideId];a._s1=0;a._e?(a._t1="transition-property",a._u1="transition-duration",a._v1="transition-timing-function",a._w1=a._x1=a._g+"transform",a._f?(h.webkit&&!h.chrome&&a.slider.addClass("rsWebkit3d"),
a._y1="translate3d(",a._z1="px, ",a._a2="px, 0px)"):(a._y1="translate(",a._z1="px, ",a._a2="px)"),a._l?a._p1[a._g+a._t1]=a._g+"transform":(h={},h[a._g+a._t1]="opacity",h[a._g+a._u1]=a.st.transitionSpeed+"ms",h[a._g+a._v1]=a.st.css3easeInOut,e.css(h))):(a._x1="left",a._w1="top");var p;n(window).on("resize"+a.ns,function(){p&&clearTimeout(p);p=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");a.updateSliderSize();a.st.keyboardNavEnabled&&a._b2();a.st.arrowsNavHideOnTouch&&
(a.hasTouch||a.pointerMultitouch)&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(e=a._o1,n('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(e),a._c2=e.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._d2=e.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&!a.hasTouch&&(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"),e.one("mousemove.arrowshover",
function(){a._c2.removeClass("rsHidden");a._d2.removeClass("rsHidden")}),e.hover(function(){a._e2||(a._c2.removeClass("rsHidden"),a._d2.removeClass("rsHidden"))},function(){a._e2||(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"))})),a.ev.on("rsOnUpdateNav",function(){a._f2()}),a._f2());if(a.hasTouch&&a.st.sliderTouch||!a.hasTouch&&a.st.sliderDrag)a._p1.on(a._j1,function(b){a._g2(b)});else a.dragSuccess=!1;var r=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._p1.click(function(b){if(!a.dragSuccess){var c=
n(b.target).attr("class");if(-1!==n.inArray(c,r)&&a.toggleVideo())return!1;if(a.st.navigateByClick&&!a._h2){if(n(b.target).closest(".rsNoDrag",a._r1).length)return!0;a._i2(b)}a.ev.trigger("rsSlideClick",b)}}).on("click.rs","a",function(b){if(a.dragSuccess)return!1;a._h2=!0;setTimeout(function(){a._h2=!1},3)});a.ev.trigger("rsAfterInit")}n.rsModules||(n.rsModules={uid:0});v.prototype={constructor:v,_i2:function(b){b=b[this._h?"pageX":"pageY"]-this._j2;b>=this._q?this.next():0>b&&this.prev()},_t:function(){var b;
b=this.st.numImagesToPreload;if(this._z=this.st.loop)2===this.numSlides?(this._z=!1,this.st.loopRewind=!0):2>this.numSlides&&(this.st.loopRewind=this._z=!1);this._z&&0<b&&(4>=this.numSlides?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._y=b},_s:function(b,f){function c(b,c){c?g.images.push(b.attr(c)):g.images.push(b.text());if(h){h=!1;g.caption="src"===c?b.attr("alt"):b.contents();g.image=g.images[0];g.videoURL=b.attr("data-rsVideo");var d=b.attr("data-rsw"),
e=b.attr("data-rsh");"undefined"!==typeof d&&!1!==d&&"undefined"!==typeof e&&!1!==e?(g.iW=parseInt(d,10),g.iH=parseInt(e,10)):a.st.imgWidth&&a.st.imgHeight&&(g.iW=a.st.imgWidth,g.iH=a.st.imgHeight)}}var a=this,e,g={},d,h=!0;b=n(b);a._k2=b;a.ev.trigger("rsBeforeParseNode",[b,g]);if(!g.stopParsing)return b=a._k2,g.id=a._r,g.contentAdded=!1,a._r++,g.images=[],g.isBig=!1,g.hasCover||(b.hasClass("rsImg")?(d=b,e=!0):(d=b.find(".rsImg"),d.length&&(e=!0)),e?(g.bigImage=d.eq(0).attr("data-rsBigImg"),
g.customClass=d.eq(0).attr("data-class"),g.customStyle=d.eq(0).attr("data-style"),
d.each(function(){var a=
n(this);a.is("a")?c(a,"href"):a.is("img")?c(a,"src"):c(a)})):b.is("img")&&(b.addClass("rsImg rsMainSlideImage"),c(b,"src"))),d=b.find(".rsCaption"),d.length&&(g.caption=d.remove()),g.content=b,a.ev.trigger("rsAfterParseNode",[b,g]),f&&a.slides.push(g),0===g.images.length&&(g.isLoaded=!0,g.isRendered=!1,g.isLoading=!1,g.images=null),g},_b2:function(){var b=this,f,c,a=function(a){37===a?b.prev():39===a&&b.next()};b._b.on("keydown"+b.ns,function(e){if(!b.st.keyboardNavEnabled)return!0;if(!(b._l2||(c=
e.keyCode,37!==c&&39!==c||f))){if(document.activeElement&&/(INPUT|SELECT|TEXTAREA)/i.test(document.activeElement.tagName))return!0;b.isFullscreen&&e.preventDefault();a(c);f=setInterval(function(){a(c)},700)}}).on("keyup"+b.ns,function(a){f&&(clearInterval(f),f=null)})},goTo:function(b,f){b!==this.currSlideId&&this._m2(b,this.st.transitionSpeed,!0,!f)},destroy:function(b){this.ev.trigger("rsBeforeDestroy");this._b.off("keydown"+this.ns+" keyup"+this.ns+" "+this._k1+" "+this._l1);this._p1.off(this._j1+
" click");this.slider.data("royalSlider",null);n.removeData(this.slider,"royalSlider");n(window).off("resize"+this.ns);this.loadingTimeout&&clearTimeout(this.loadingTimeout);b&&this.slider.remove();this.ev=this.slider=this.slides=null},_n2:function(b,f){function c(c,f,g){c.isAdded?(a(f,c),e(f,c)):(g||(g=d.slidesJQ[f]),c.holder?g=c.holder:(g=d.slidesJQ[f]=n(g),c.holder=g),c.appendOnLoaded=!1,e(f,c,g),a(f,c),d._p2(c,g,b),c.isAdded=!0)}function a(a,c){c.contentAdded||(d.setItemHtml(c,b),b||(c.contentAdded=
!0))}function e(a,b,c){d._l&&(c||(c=d.slidesJQ[a]),c.css(d._i,(a+d._d1+p)*d._w))}function g(a){if(l){if(a>q-1)return g(a-q);if(0>a)return g(q+a)}return a}var d=this,h,k,l=d._z,q=d.numSlides;if(!isNaN(f))return g(f);var m=d.currSlideId,p,r=b?Math.abs(d._o2-d.currSlideId)>=d.numSlides-1?0:1:d._y,t=Math.min(2,r),w=!1,v=!1,u;for(k=m;k<m+1+t;k++)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){w=!0;break}for(k=m-1;k>m-1-t;k--)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){v=!0;break}if(w)for(k=
m;k<m+r+1;k++)u=g(k),p=Math.floor((d._u-(m-k))/d.numSlides)*d.numSlides,(h=d.slides[u])&&c(h,u);if(v)for(k=m-1;k>m-1-r;k--)u=g(k),p=Math.floor((d._u-(m-k))/q)*q,(h=d.slides[u])&&c(h,u);if(!b)for(t=g(m-r),m=g(m+r),r=t>m?0:t,k=0;k<q;k++)t>m&&k>t-1||!(k<r||k>m)||(h=d.slides[k])&&h.holder&&(h.holder.detach(),h.isAdded=!1)},setItemHtml:function(b,f){var c=this,a=function(){if(!b.images)b.isRendered=!0,b.isLoaded=!0,b.isLoading=!1,d(!0);else if(!b.isLoading){var a,f;b.content.hasClass("rsImg")?(a=b.content,
f=!0):a=b.content.find(".rsImg:not(img)");a&&!a.is("img")&&a.each(function(){
	var srcset = "";
	var a=n(this),
		srcset=a.attr("data-srcset")?"srcset='"+a.attr("data-srcset")+"'":"",c='<img data-class="'+a.attr("data-class")+'"  '+srcset+' data-style="'+a.attr("data-style")+'" class="rsImg '+a.attr("data-class")+'" src="'+(a.is("a")?a.attr("href"):a.text())+'" style="'+a.attr("data-style")+'" />';f?b.content=n(c):a.replaceWith(c)});a=f?b.content:b.content.find("img.rsImg");k();a.eq(0).addClass("rsMainSlideImage");

b.iW&&b.iH&&(b.isLoaded||c._q2(b),d());b.isLoading=!0;if(b.isBig)n("<img />").on("load.rs error.rs",function(a){n(this).off("load.rs error.rs");e([this],!0)}).attr("src",b.image);else{b.loaded=[];b.numStartedLoad=0;a=function(a){n(this).off("load.rs error.rs");
b.loaded.push(this);b.loaded.length===b.numStartedLoad&&e(b.loaded,!1)};for(var g=0;g<b.images.length;g++){var h=n("<img />");b.numStartedLoad++;h.on("load.rs error.rs",a).attr("src",b.images[g])}}}},e=function(a,c){if(a.length){var d=a[0];if(c!==b.isBig)(d=b.holder.children())&&1<d.length&&l();else if(b.iW&&b.iH)g();else if(b.iW=d.width,b.iH=d.height,b.iW&&b.iH)g();else{var e=new Image;e.onload=function(){e.width?(b.iW=e.width,b.iH=e.height,g()):setTimeout(function(){e.width&&(b.iW=e.width,b.iH=
e.height);g()},1E3)};e.src=d.src}}else g()},g=function(){b.isLoaded=!0;b.isLoading=!1;d();l();h()},d=function(){if(!b.isAppended&&c.ev){var a=c.st.visibleNearby,d=b.id-c._o;f||b.appendOnLoaded||!c.st.fadeinLoadedSlide||0!==d&&(!(a||c._r2||c._l2)||-1!==d&&1!==d)||(a={visibility:"visible",opacity:0},a[c._g+"transition"]="opacity 400ms ease-in-out",b.content.css(a),setTimeout(function(){b.content.css("opacity",1)},16));b.holder.find(".rsPreloader").length?b.holder.append(b.content):b.holder.html(b.content);
b.isAppended=!0;b.isLoaded&&(c._q2(b),h());b.sizeReady||(b.sizeReady=!0,setTimeout(function(){c.ev.trigger("rsMaybeSizeReady",b)},100))}},h=function(){!b.loadedTriggered&&c.ev&&(b.isLoaded=b.loadedTriggered=!0,b.holder.trigger("rsAfterContentSet"),c.ev.trigger("rsAfterContentSet",b))},k=function(){c.st.usePreloader&&b.holder.html(c._q1.clone())},l=function(a){c.st.usePreloader&&(a=b.holder.find(".rsPreloader"),a.length&&a.remove())};b.isLoaded?d():f?!c._l&&b.images&&b.iW&&b.iH?a():(b.holder.isWaiting=
!0,k(),b.holder.slideId=-99):a()},_p2:function(b,f,c){this._p1.append(b.holder);b.appendOnLoaded=!1},_g2:function(b,f){var c=this,a,e="touchstart"===b.type;c._s2=e;c.ev.trigger("rsDragStart");if(n(b.target).closest(".rsNoDrag",c._r1).length)return c.dragSuccess=!1,!0;!f&&c._r2&&(c._t2=!0,c._u2());c.dragSuccess=!1;if(c._l2)e&&(c._v2=!0);else{e&&(c._v2=!1);c._w2();if(e){var g=b.originalEvent.touches;if(g&&0<g.length)a=g[0],1<g.length&&(c._v2=!0);else return}else b.preventDefault(),a=b,c.pointerEnabled&&
(a=a.originalEvent);c._l2=!0;c._b.on(c._k1,function(a){c._x2(a,f)}).on(c._l1,function(a){c._y2(a,f)});c._z2="";c._a3=!1;c._b3=a.pageX;c._c3=a.pageY;c._d3=c._v=(f?c._e3:c._h)?a.pageX:a.pageY;c._f3=0;c._g3=0;c._h3=f?c._i3:c._p;c._j3=(new Date).getTime();if(e)c._e1.on(c._m1,function(a){c._y2(a,f)})}},_k3:function(b,f){if(this._l3){var c=this._m3,a=b.pageX-this._b3,e=b.pageY-this._c3,g=this._h3+a,d=this._h3+e,h=f?this._e3:this._h,g=h?g:d,d=this._z2;this._a3=!0;this._b3=b.pageX;this._c3=b.pageY;"x"===
d&&0!==a?this._f3=0<a?1:-1:"y"===d&&0!==e&&(this._g3=0<e?1:-1);d=h?this._b3:this._c3;a=h?a:e;f?g>this._n3?g=this._h3+a*this._n1:g<this._o3&&(g=this._h3+a*this._n1):this._z||(0>=this.currSlideId&&0<d-this._d3&&(g=this._h3+a*this._n1),this.currSlideId>=this.numSlides-1&&0>d-this._d3&&(g=this._h3+a*this._n1));this._h3=g;200<c-this._j3&&(this._j3=c,this._v=d);f?this._q3(this._h3):this._l&&this._p3(this._h3)}},_x2:function(b,f){var c=this,a,e="touchmove"===b.type;if(!c._s2||e){if(e){if(c._r3)return;var g=
b.originalEvent.touches;if(g){if(1<g.length)return;a=g[0]}else return}else a=b,c.pointerEnabled&&(a=a.originalEvent);c._a3||(c._e&&(f?c._s3:c._p1).css(c._g+c._u1,"0s"),function h(){c._l2&&(c._t3=requestAnimationFrame(h),c._u3&&c._k3(c._u3,f))}());if(c._l3)b.preventDefault(),c._m3=(new Date).getTime(),c._u3=a;else if(g=f?c._e3:c._h,a=Math.abs(a.pageX-c._b3)-Math.abs(a.pageY-c._c3)-(g?-7:7),7<a){if(g)b.preventDefault(),c._z2="x";else if(e){c._v3(b);return}c._l3=!0}else if(-7>a){if(!g)b.preventDefault(),
c._z2="y";else if(e){c._v3(b);return}c._l3=!0}}},_v3:function(b,f){this._r3=!0;this._a3=this._l2=!1;this._y2(b)},_y2:function(b,f){function c(a){return 100>a?100:500<a?500:a}function a(a,b){if(e._l||f)h=(-e._u-e._d1)*e._w,k=Math.abs(e._p-h),e._c=k/b,a&&(e._c+=250),e._c=c(e._c),e._x3(h,!1)}var e=this,g,d,h,k;g=-1<b.type.indexOf("touch");if(!e._s2||g)if(e._s2=!1,e.ev.trigger("rsDragRelease"),e._u3=null,e._l2=!1,e._r3=!1,e._l3=!1,e._m3=0,cancelAnimationFrame(e._t3),e._a3&&(f?e._q3(e._h3):e._l&&e._p3(e._h3)),
e._b.off(e._k1).off(e._l1),g&&e._e1.off(e._m1),e._i1(),!e._a3&&!e._v2&&f&&e._w3){var l=n(b.target).closest(".rsNavItem");l.length&&e.goTo(l.index())}else{d=f?e._e3:e._h;if(!e._a3||"y"===e._z2&&d||"x"===e._z2&&!d)if(!f&&e._t2){e._t2=!1;if(e.st.navigateByClick){e._i2(e.pointerEnabled?b.originalEvent:b);e.dragSuccess=!0;return}e.dragSuccess=!0}else{e._t2=!1;e.dragSuccess=!1;return}else e.dragSuccess=!0;e._t2=!1;e._z2="";var q=e.st.minSlideOffset;g=g?b.originalEvent.changedTouches[0]:e.pointerEnabled?
b.originalEvent:b;var m=d?g.pageX:g.pageY,p=e._d3;g=e._v;var r=e.currSlideId,t=e.numSlides,w=d?e._f3:e._g3,v=e._z;Math.abs(m-p);g=m-g;d=(new Date).getTime()-e._j3;d=Math.abs(g)/d;if(0===w||1>=t)a(!0,d);else{if(!v&&!f)if(0>=r){if(0<w){a(!0,d);return}}else if(r>=t-1&&0>w){a(!0,d);return}if(f){h=e._i3;if(h>e._n3)h=e._n3;else if(h<e._o3)h=e._o3;else{m=d*d/.006;l=-e._i3;p=e._y3-e._z3+e._i3;0<g&&m>l?(l+=e._z3/(15/(m/d*.003)),d=d*l/m,m=l):0>g&&m>p&&(p+=e._z3/(15/(m/d*.003)),d=d*p/m,m=p);l=Math.max(Math.round(d/
.003),50);h+=m*(0>g?-1:1);if(h>e._n3){e._a4(h,l,!0,e._n3,200);return}if(h<e._o3){e._a4(h,l,!0,e._o3,200);return}}e._a4(h,l,!0)}else l=function(a){var b=Math.floor(a/e._w);a-b*e._w>q&&b++;return b},p+q<m?0>w?a(!1,d):(l=l(m-p),e._m2(e.currSlideId-l,c(Math.abs(e._p-(-e._u-e._d1+l)*e._w)/d),!1,!0,!0)):p-q>m?0<w?a(!1,d):(l=l(p-m),e._m2(e.currSlideId+l,c(Math.abs(e._p-(-e._u-e._d1-l)*e._w)/d),!1,!0,!0)):a(!1,d)}}},_p3:function(b){b=this._p=b;this._e?this._p1.css(this._x1,this._y1+(this._h?b+this._z1+0:
0+this._z1+b)+this._a2):this._p1.css(this._h?this._x1:this._w1,b)},updateSliderSize:function(b){var f,c;if(this.slider){if(this.st.autoScaleSlider){var a=this.st.autoScaleSliderWidth,e=this.st.autoScaleSliderHeight;this.st.autoScaleHeight?(f=this.slider.width(),f!=this.width&&(this.slider.css("height",e/a*f),f=this.slider.width()),c=this.slider.height()):(c=this.slider.height(),c!=this.height&&(this.slider.css("width",a/e*c),c=this.slider.height()),f=this.slider.width())}else f=this.slider.width(),
c=this.slider.height();if(b||f!=this.width||c!=this.height){this.width=f;this.height=c;this._b4=f;this._c4=c;this.ev.trigger("rsBeforeSizeSet");this.ev.trigger("rsAfterSizePropSet");this._e1.css({width:this._b4,height:this._c4});this._w=(this._h?this._b4:this._c4)+this.st.slidesSpacing;this._d4=this.st.imageScalePadding;for(f=0;f<this.slides.length;f++)b=this.slides[f],b.positionSet=!1,b&&b.images&&b.isLoaded&&(b.isRendered=!1,this._q2(b));if(this._e4)for(f=0;f<this._e4.length;f++)b=this._e4[f],b.holder.css(this._i,
(b.id+this._d1)*this._w);this._n2();this._l&&(this._e&&this._p1.css(this._g+"transition-duration","0s"),this._p3((-this._u-this._d1)*this._w));this.ev.trigger("rsOnUpdateNav")}this._j2=this._e1.offset();this._j2=this._j2[this._i]}},appendSlide:function(b,f){var c=this._s(b);if(isNaN(f)||f>this.numSlides)f=this.numSlides;this.slides.splice(f,0,c);this.slidesJQ.splice(f,0,n('<div style="'+(this._l?"position:absolute;":this._n)+'" class="rsSlide"></div>'));f<=this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",
[c,f]);this._f4(f);f===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var f=this.slides[b];f&&(f.holder&&f.holder.remove(),b<this.currSlideId&&this.currSlideId--,this.slides.splice(b,1),this.slidesJQ.splice(b,1),this.ev.trigger("rsOnRemoveSlide",[b]),this._f4(b),b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange"))},_f4:function(b){var f=this;b=f.numSlides;b=0>=f._u?0:Math.floor(f._u/b);f.numSlides=f.slides.length;0===f.numSlides?(f.currSlideId=f._d1=f._u=
0,f.currSlide=f._g4=null):f._u=b*f.numSlides+f.currSlideId;for(b=0;b<f.numSlides;b++)f.slides[b].id=b;f.currSlide=f.slides[f.currSlideId];f._r1=f.slidesJQ[f.currSlideId];f.currSlideId>=f.numSlides?f.goTo(f.numSlides-1):0>f.currSlideId&&f.goTo(0);f._t();f._l&&f._p1.css(f._g+f._u1,"0ms");f._h4&&clearTimeout(f._h4);f._h4=setTimeout(function(){f._l&&f._p3((-f._u-f._d1)*f._w);f._n2();f._l||f._r1.css({display:"block",opacity:1})},14);f.ev.trigger("rsOnUpdateNav")},_i1:function(){this._f1&&this._l&&(this._g1?
this._e1.css("cursor",this._g1):(this._e1.removeClass("grabbing-cursor"),this._e1.addClass("grab-cursor")))},_w2:function(){this._f1&&this._l&&(this._h1?this._e1.css("cursor",this._h1):(this._e1.removeClass("grab-cursor"),this._e1.addClass("grabbing-cursor")))},next:function(b){this._m2("next",this.st.transitionSpeed,!0,!b)},prev:function(b){this._m2("prev",this.st.transitionSpeed,!0,!b)},_m2:function(b,f,c,a,e){var g=this,d,h,k;g.ev.trigger("rsBeforeMove",[b,a]);k="next"===b?g.currSlideId+1:"prev"===
b?g.currSlideId-1:b=parseInt(b,10);if(!g._z){if(0>k){g._i4("left",!a);return}if(k>=g.numSlides){g._i4("right",!a);return}}g._r2&&(g._u2(!0),c=!1);h=k-g.currSlideId;k=g._o2=g.currSlideId;var l=g.currSlideId+h;a=g._u;var n;g._z?(l=g._n2(!1,l),a+=h):a=l;g._o=l;g._g4=g.slidesJQ[g.currSlideId];g._u=a;g.currSlideId=g._o;g.currSlide=g.slides[g.currSlideId];g._r1=g.slidesJQ[g.currSlideId];var l=g.st.slidesDiff,m=Boolean(0<h);h=Math.abs(h);var p=Math.floor(k/g._y),r=Math.floor((k+(m?l:-l))/g._y),p=(m?Math.max(p,
r):Math.min(p,r))*g._y+(m?g._y-1:0);p>g.numSlides-1?p=g.numSlides-1:0>p&&(p=0);k=m?p-k:k-p;k>g._y&&(k=g._y);if(h>k+l)for(g._d1+=(h-(k+l))*(m?-1:1),f*=1.4,k=0;k<g.numSlides;k++)g.slides[k].positionSet=!1;g._c=f;g._n2(!0);e||(n=!0);d=(-a-g._d1)*g._w;n?setTimeout(function(){g._j4=!1;g._x3(d,b,!1,c);g.ev.trigger("rsOnUpdateNav")},0):(g._x3(d,b,!1,c),g.ev.trigger("rsOnUpdateNav"))},_f2:function(){this.st.arrowsNav&&(1>=this.numSlides?(this._c2.css("display","none"),this._d2.css("display","none")):(this._c2.css("display",
"block"),this._d2.css("display","block"),this._z||this.st.loopRewind||(0===this.currSlideId?this._c2.addClass("rsArrowDisabled"):this._c2.removeClass("rsArrowDisabled"),this.currSlideId===this.numSlides-1?this._d2.addClass("rsArrowDisabled"):this._d2.removeClass("rsArrowDisabled"))))},_x3:function(b,f,c,a,e){function g(){var a;h&&(a=h.data("rsTimeout"))&&(h!==k&&h.css({opacity:0,display:"none",zIndex:0}),clearTimeout(a),h.data("rsTimeout",""));if(a=k.data("rsTimeout"))clearTimeout(a),k.data("rsTimeout",
"")}var d=this,h,k,l={};isNaN(d._c)&&(d._c=400);d._p=d._h3=b;d.ev.trigger("rsBeforeAnimStart");d._e?d._l?(d._c=parseInt(d._c,10),c=d._g+d._v1,l[d._g+d._u1]=d._c+"ms",l[c]=a?n.rsCSS3Easing[d.st.easeInOut]:n.rsCSS3Easing[d.st.easeOut],d._p1.css(l),a||!d.hasTouch?setTimeout(function(){d._p3(b)},5):d._p3(b)):(d._c=d.st.transitionSpeed,h=d._g4,k=d._r1,k.data("rsTimeout")&&k.css("opacity",0),g(),h&&h.data("rsTimeout",setTimeout(function(){l[d._g+d._u1]="0ms";l.zIndex=0;l.display="none";h.data("rsTimeout",
"");h.css(l);setTimeout(function(){h.css("opacity",0)},16)},d._c+60)),l.display="block",l.zIndex=d._m,l.opacity=0,l[d._g+d._u1]="0ms",l[d._g+d._v1]=n.rsCSS3Easing[d.st.easeInOut],k.css(l),k.data("rsTimeout",setTimeout(function(){k.css(d._g+d._u1,d._c+"ms");k.data("rsTimeout",setTimeout(function(){k.css("opacity",1);k.data("rsTimeout","")},20))},20))):d._l?(l[d._h?d._x1:d._w1]=b+"px",d._p1.animate(l,d._c,a?d.st.easeInOut:d.st.easeOut)):(h=d._g4,k=d._r1,k.stop(!0,!0).css({opacity:0,display:"block",
zIndex:d._m}),d._c=d.st.transitionSpeed,k.animate({opacity:1},d._c,d.st.easeInOut),g(),h&&h.data("rsTimeout",setTimeout(function(){h.stop(!0,!0).css({opacity:0,display:"none",zIndex:0})},d._c+60)));d._r2=!0;d.loadingTimeout&&clearTimeout(d.loadingTimeout);d.loadingTimeout=e?setTimeout(function(){d.loadingTimeout=null;e.call()},d._c+60):setTimeout(function(){d.loadingTimeout=null;d._k4(f)},d._c+60)},_u2:function(b){this._r2=!1;clearTimeout(this.loadingTimeout);if(this._l)if(!this._e)this._p1.stop(!0),
this._p=parseInt(this._p1.css(this._h?this._x1:this._w1),10);else{if(!b){b=this._p;var f=this._h3=this._l4();this._p1.css(this._g+this._u1,"0ms");b!==f&&this._p3(f)}}else 20<this._m?this._m=10:this._m++},_l4:function(){var b=window.getComputedStyle(this._p1.get(0),null).getPropertyValue(this._g+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g),f=0===b[0].indexOf("matrix3d");return parseInt(b[this._h?f?12:4:f?13:5],10)},_m4:function(b,f){return this._e?this._y1+(f?b+this._z1+0:0+this._z1+b)+this._a2:
b},_k4:function(b){this._l||(this._r1.css("z-index",0),this._m=10);this._r2=!1;this.staticSlideId=this.currSlideId;this._n2();this._n4=!1;this.ev.trigger("rsAfterSlideChange")},_i4:function(b,f){var c=this,a=(-c._u-c._d1)*c._w;if(0!==c.numSlides&&!c._r2)if(c.st.loopRewind)c.goTo("left"===b?c.numSlides-1:0,f);else if(c._l){c._c=200;var e=function(){c._r2=!1};c._x3(a+("left"===b?30:-30),"",!1,!0,function(){c._r2=!1;c._x3(a,"",!1,!0,e)})}},_q2:function(b,f){if(!b.isRendered){var c=b.content,a="rsMainSlideImage",
e,g=n.isFunction(this.st.imageAlignCenter)?this.st.imageAlignCenter(b):this.st.imageAlignCenter,d=n.isFunction(this.st.imageScaleMode)?this.st.imageScaleMode(b):this.st.imageScaleMode,h;b.videoURL&&(a="rsVideoContainer","fill"!==d?e=!0:(h=c,h.hasClass(a)||(h=h.find("."+a)),h.css({width:"100%",height:"100%"}),a="rsMainSlideImage"));c.hasClass(a)||(c=c.find("."+a));if(c){var k=b.iW,l=b.iH;b.isRendered=!0;if("none"!==d||g){a="fill"!==d?this._d4:0;h=this._b4-2*a;var q=this._c4-2*a,m,p,r={};"fit-if-smaller"===
d&&(k>h||l>q)&&(d="fit");if("fill"===d||"fit"===d)m=h/k,p=q/l,m="fill"==d?m>p?m:p:"fit"==d?m<p?m:p:1,k=Math.ceil(k*m,10),l=Math.ceil(l*m,10);"none"!==d&&(r.width=k,r.height=l,e&&c.find(".rsImg").css({width:"100%",height:"100%"}));g&&(r.marginLeft=Math.floor((h-k)/2)+a,r.marginTop=Math.floor((q-l)/2)+a);c.css(r).css("marginLeft","0").css("marginTop","0");c.parent().css(r);}}}}};n.rsProto=v.prototype;n.fn.royalSlider=function(b){var f=arguments;return this.each(function(){var c=n(this);if("object"!==typeof b&&b){if((c=c.data("royalSlider"))&&c[b])return c[b].apply(c,
Array.prototype.slice.call(f,1))}else c.data("royalSlider")||c.data("royalSlider",new v(c,b))})};n.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,
addActiveClass:!1,autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,usePreloader:!0,autoScaleSlider:!1,autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,slidesDiff:2};n.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};n.extend(jQuery.easing,{easeInOutSine:function(b,
f,c,a,e){return-a/2*(Math.cos(Math.PI*f/e)-1)+c},easeOutSine:function(b,f,c,a,e){return a*Math.sin(f/e*(Math.PI/2))+c},easeOutCubic:function(b,f,c,a,e){return a*((f=f/e-1)*f*f+1)+c}})})(jQuery,window);
// jquery.rs.bullets v1.0.1
(function(c){c.extend(c.rsProto,{_i5:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._j5=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span></span></div>';a._k5=b=c(b+"</div>");a._l5=b.appendTo(a.slider).children();a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(c(this).index())})}),a.ev.on("rsOnAppendSlide",function(b,c,d){d>=a.numSlides?a._k5.append('<div class="rsNavItem rsBullet"><span></span></div>'):
a._l5.eq(d).before('<div class="rsNavItem rsBullet"><span></span></div>');a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._l5.eq(c);d&&d.length&&(d.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");b=a._l5.eq(b);b.addClass("rsNavSelected");a._n5=b}))}});c.rsModules.bullets=c.rsProto._i5})(jQuery);
// jquery.rs.thumbnails v1.0.8
(function(f){f.extend(f.rsProto,{_h6:function(){var a=this;"thumbnails"===a.st.controlNavigation&&(a._i6={drag:!0,touch:!0,orientation:"horizontal",navigation:!0,arrows:!0,arrowLeft:null,arrowRight:null,spacing:4,arrowsAutoHide:!1,appendSpan:!1,transitionSpeed:600,autoCenter:!0,fitInViewport:!0,firstMargin:!0,paddingTop:0,paddingBottom:0},a.st.thumbs=f.extend({},a._i6,a.st.thumbs),a._j6=!0,!1===a.st.thumbs.firstMargin?a.st.thumbs.firstMargin=0:!0===a.st.thumbs.firstMargin&&(a.st.thumbs.firstMargin=
a.st.thumbs.spacing),a.ev.on("rsBeforeParseNode",function(a,b,c){b=f(b);c.thumbnail=b.find(".rsTmb").remove();c.thumbnail.length?c.thumbnail=f(document.createElement("div")).append(c.thumbnail).html():(c.thumbnail=b.attr("data-rsTmb"),c.thumbnail||(c.thumbnail=b.find(".rsImg").attr("data-rsTmb")),c.thumbnail=c.thumbnail?'<img src="'+c.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._k6()}),a._n5=null,a.ev.on("rsOnUpdateNav",function(){var e=f(a._l5[a.currSlideId]);e!==a._n5&&(a._n5&&
(a._n5.removeClass("rsNavSelected"),a._n5=null),a._l6&&a._m6(a.currSlideId),a._n5=e.addClass("rsNavSelected"))}),a.ev.on("rsOnAppendSlide",function(e,b,c){e="<div"+a._n6+' class="rsNavItem rsThumb">'+a._o6+b.thumbnail+"</div>";a._e&&a._s3.css(a._g+"transition-duration","0ms");c>=a.numSlides?a._s3.append(e):a._l5.eq(c).before(e);a._l5=a._s3.children();a.updateThumbsSize(!0)}),a.ev.on("rsOnRemoveSlide",function(e,b){var c=a._l5.eq(b);c&&(a._e&&a._s3.css(a._g+"transition-duration","0ms"),c.remove(),
a._l5=a._s3.children(),a.updateThumbsSize(!0))}))},_k6:function(){var a=this,e="rsThumbs",b=a.st.thumbs,c="",g,d,h=b.spacing;a._j5=!0;a._e3="vertical"===b.orientation?!1:!0;a._n6=g=h?' style="margin-'+(a._e3?"right":"bottom")+":"+h+'px;"':"";a._i3=0;a._p6=!1;a._m5=!1;a._l6=!1;a._q6=b.arrows&&b.navigation;d=a._e3?"Hor":"Ver";a.slider.addClass("rsWithThumbs rsWithThumbs"+d);c+='<div class="rsNav rsThumbs rsThumbs'+d+'"><div class="'+e+'Container">';a._o6=b.appendSpan?'<span class="thumbIco"></span>':
"";for(var k=0;k<a.numSlides;k++)d=a.slides[k],c+="<div"+g+' class="rsNavItem rsThumb">'+d.thumbnail+a._o6+"</div>";c=f(c+"</div></div>");g={};b.paddingTop&&(g[a._e3?"paddingTop":"paddingLeft"]=b.paddingTop);b.paddingBottom&&(g[a._e3?"paddingBottom":"paddingRight"]=b.paddingBottom);c.css(g);a._s3=f(c).find("."+e+"Container");a._q6&&(e+="Arrow",b.arrowLeft?a._r6=b.arrowLeft:(a._r6=f('<div class="'+e+" "+e+'Left"><div class="'+e+'Icn"></div></div>'),c.append(a._r6)),b.arrowRight?a._s6=b.arrowRight:
(a._s6=f('<div class="'+e+" "+e+'Right"><div class="'+e+'Icn"></div></div>'),c.append(a._s6)),a._r6.click(function(){var b=(Math.floor(a._i3/a._t6)+a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b>a._n3?a._n3:b)}),a._s6.click(function(){var b=(Math.floor(a._i3/a._t6)-a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b<a._o3?a._o3:b)}),b.arrowsAutoHide&&!a.hasTouch&&(a._r6.css("opacity",0),a._s6.css("opacity",0),c.one("mousemove.rsarrowshover",function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))}),
c.hover(function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))},function(){a._l6&&(a._r6.css("opacity",0),a._s6.css("opacity",0))})));a._k5=c;a._l5=a._s3.children();a.msEnabled&&a.st.thumbs.navigation&&a._s3.css("-ms-touch-action",a._e3?"pan-y":"pan-x");a.slider.append(c);a._w3=!0;a._v6=h;b.navigation&&a._e&&a._s3.css(a._g+"transition-property",a._g+"transform");a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(f(this).index())});a.ev.off("rsBeforeSizeSet.thumbs").on("rsBeforeSizeSet.thumbs",
function(){a._w6=a._e3?a._c4:a._b4;a.updateThumbsSize(!0)});a.ev.off("rsAutoHeightChange.thumbs").on("rsAutoHeightChange.thumbs",function(b,c){a.updateThumbsSize(!0,c)})},updateThumbsSize:function(a,e){var b=this,c=b._l5.first(),f={},d=b._l5.length;b._t6=(b._e3?c.outerWidth():c.outerHeight())+b._v6;b._y3=d*b._t6-b._v6;f[b._e3?"width":"height"]=b._y3+b._v6;b._z3=b._e3?b._k5.width():void 0!==e?e:b._k5.height();b._w3&&(b.isFullscreen||b.st.thumbs.fitInViewport)&&(b._e3?b._c4=b._w6-b._k5.outerHeight():
b._b4=b._w6-b._k5.outerWidth());b._z3&&(b._o3=-(b._y3-b._z3)-b.st.thumbs.firstMargin,b._n3=b.st.thumbs.firstMargin,b._u6=Math.floor(b._z3/b._t6),b._y3<b._z3?(b.st.thumbs.autoCenter?b._q3((b._z3-b._y3)/2):b._q3(b._n3),b.st.thumbs.arrows&&b._r6&&(b._r6.addClass("rsThumbsArrowDisabled"),b._s6.addClass("rsThumbsArrowDisabled")),b._l6=!1,b._m5=!1,b._k5.off(b._j1)):b.st.thumbs.navigation&&!b._l6&&(b._l6=!0,!b.hasTouch&&b.st.thumbs.drag||b.hasTouch&&b.st.thumbs.touch)&&(b._m5=!0,b._k5.on(b._j1,function(a){b._g2(a,
!0)})),b._s3.css(f),a&&e&&b._m6(b.currSlideId,!0))},setThumbsOrientation:function(a,e){this._w3&&(this.st.thumbs.orientation=a,this._k5.remove(),this.slider.removeClass("rsWithThumbsHor rsWithThumbsVer"),this._k6(),this._k5.off(this._j1),e||this.updateSliderSize(!0))},_q3:function(a){this._i3=a;this._e?this._s3.css(this._x1,this._y1+(this._e3?a+this._z1+0:0+this._z1+a)+this._a2):this._s3.css(this._e3?this._x1:this._w1,a)},_a4:function(a,e,b,c,g){var d=this;if(d._l6){e||(e=d.st.thumbs.transitionSpeed);
d._i3=a;d._x6&&clearTimeout(d._x6);d._p6&&(d._e||d._s3.stop(),b=!0);var h={};d._p6=!0;d._e?(h[d._g+"transition-duration"]=e+"ms",h[d._g+"transition-timing-function"]=b?f.rsCSS3Easing[d.st.easeOut]:f.rsCSS3Easing[d.st.easeInOut],d._s3.css(h),d._q3(a)):(h[d._e3?d._x1:d._w1]=a+"px",d._s3.animate(h,e,b?"easeOutCubic":d.st.easeInOut));c&&(d._i3=c);d._y6();d._x6=setTimeout(function(){d._p6=!1;g&&(d._a4(c,g,!0),g=null)},e)}},_y6:function(){this._q6&&(this._i3===this._n3?this._r6.addClass("rsThumbsArrowDisabled"):
this._r6.removeClass("rsThumbsArrowDisabled"),this._i3===this._o3?this._s6.addClass("rsThumbsArrowDisabled"):this._s6.removeClass("rsThumbsArrowDisabled"))},_m6:function(a,e){var b=0,c,f=a*this._t6+2*this._t6-this._v6+this._n3,d=Math.floor(this._i3/this._t6);this._l6&&(this._j6&&(e=!0,this._j6=!1),f+this._i3>this._z3?(a===this.numSlides-1&&(b=1),d=-a+this._u6-2+b,c=d*this._t6+this._z3%this._t6+this._v6-this._n3):0!==a?(a-1)*this._t6<=-this._i3+this._n3&&a-1<=this.numSlides-this._u6&&(c=(-a+1)*this._t6+
this._n3):c=this._n3,c!==this._i3&&(b=void 0===c?this._i3:c,b>this._n3?this._q3(this._n3):b<this._o3?this._q3(this._o3):void 0!==c&&(e?this._q3(c):this._a4(c))),this._y6())}});f.rsModules.thumbnails=f.rsProto._h6})(jQuery);
// jquery.rs.tabs v1.0.2
(function(e){e.extend(e.rsProto,{_f6:function(){var a=this;"tabs"===a.st.controlNavigation&&(a.ev.on("rsBeforeParseNode",function(a,d,b){d=e(d);b.thumbnail=d.find(".rsTmb").remove();b.thumbnail.length?b.thumbnail=e(document.createElement("div")).append(b.thumbnail).html():(b.thumbnail=d.attr("data-rsTmb"),b.thumbnail||(b.thumbnail=d.find(".rsImg").attr("data-rsTmb")),b.thumbnail=b.thumbnail?'<img src="'+b.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._g6()}),a.ev.on("rsOnAppendSlide",
function(c,d,b){b>=a.numSlides?a._k5.append('<div class="rsNavItem rsTab">'+d.thumbnail+"</div>"):a._l5.eq(b).before('<div class="rsNavItem rsTab">'+item.thumbnail+"</div>");a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(c,d){var b=a._l5.eq(d);b&&(b.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var c=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");c=a._l5.eq(c);c.addClass("rsNavSelected");a._n5=c}))},_g6:function(){var a=this,c;a._j5=!0;c='<div class="rsNav rsTabs">';
for(var d=0;d<a.numSlides;d++)c+='<div class="rsNavItem rsTab">'+a.slides[d].thumbnail+"</div>";c=e(c+"</div>");a._k5=c;a._l5=c.children(".rsNavItem");a.slider.append(c);a._k5.click(function(b){b=e(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())})}});e.rsModules.tabs=e.rsProto._f6})(jQuery);
// jquery.rs.fullscreen v1.0.6
var scrollTop_fullscreen=false;
(function(c){c.extend(c.rsProto,{_q5:function(){var a=this;a._r5={enabled:!1,keyboardNav:!0,buttonFS:!0,nativeFS:!1,doubleTap:!0};a.st.fullscreen=c.extend({},a._r5,a.st.fullscreen);if(a.st.fullscreen.enabled)a.ev.one("rsBeforeSizeSet",function(){a._s5()})},_s5:function(){var a=this;a._t5=!a.st.keyboardNavEnabled&&a.st.fullscreen.keyboardNav;if(a.st.fullscreen.nativeFS){var b={supportsFullScreen:!1,isFullScreen:function(){return!1},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",
prefix:""},d=["webkit","moz","o","ms","khtml"];if("undefined"!=typeof document.cancelFullScreen)b.supportsFullScreen=!0;else for(var e=0,f=d.length;e<f;e++)if(b.prefix=d[e],"undefined"!=typeof document[b.prefix+"CancelFullScreen"]){b.supportsFullScreen=!0;break}b.supportsFullScreen?(a.nativeFS=!0,b.fullScreenEventName=b.prefix+"fullscreenchange"+a.ns,b.isFullScreen=function(){switch(this.prefix){case "":return document.fullScreen;case "webkit":return document.webkitIsFullScreen;default:return document[this.prefix+
"FullScreen"]}},b.requestFullScreen=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},b.cancelFullScreen=function(a){return""===this.prefix?document.cancelFullScreen():document[this.prefix+"CancelFullScreen"]()},a._u5=b):a._u5=!1}a.st.fullscreen.buttonFS&&(a._v5=c('<div class="rsFullscreenBtn"><div class="rsFullscreenIcn"></div></div>').appendTo(a._o1).on("click.rs",function(){a.isFullscreen?a.exitFullscreen():a.enterFullscreen()}))},enterFullscreen:function(a){  if(scrollTop_fullscreen===false){scrollTop_fullscreen =  jQuery("html").scrollTop();if(scrollTop_fullscreen==0) scrollTop_fullscreen =  jQuery("body").scrollTop();};var b=
this;if(b._u5)if(a)b._u5.requestFullScreen(c("html")[0]);else{b._b.on(b._u5.fullScreenEventName,function(a){b._u5.isFullScreen()?b.enterFullscreen(!0):b.exitFullscreen(!0)});b._u5.requestFullScreen(c("html")[0]);return}if(!b._w5){b._w5=!0;b._b.on("keyup"+b.ns+"fullscreen",function(a){27===a.keyCode&&b.exitFullscreen()});b._t5&&b._b2();a=c(window);b._x5=a.scrollTop();b._y5=a.scrollLeft();b._z5=c("html").attr("style");b._a6=c("body").attr("style");b._b6=b.slider.attr("style");c("body, html").css({overflow:"hidden",
height:"100%",width:"100%",margin:"0",padding:"0"});b.slider.addClass("rsFullscreen");jQuery("body").addClass("rsBodyFullscreen");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!0,a.isMedLoaded=a.isLoaded,a.isMedLoading=a.isLoading,a.medImage=a.image,a.medIW=a.iW,a.medIH=a.iH,a.slideId=-99,a.bigImage!==a.medImage&&(a.sizeType="big"),a.isLoaded=a.isBigLoaded,a.isLoading=!1,a.image=a.bigImage,a.images[0]=a.bigImage,a.iW=a.bigIW,a.iH=a.bigIH,a.isAppended=a.contentAdded=!1,b._c6(a));b.isFullscreen=!0;b._w5=!1;
b.updateSliderSize();b.ev.trigger("rsEnterFullscreen")}},exitFullscreen:function(a){	var b=this;if(b._u5){if(!a){b._u5.cancelFullScreen(c("html")[0]);return}b._b.off(b._u5.fullScreenEventName)}if(!b._w5){b._w5=!0;b._b.off("keyup"+b.ns+"fullscreen");b._t5&&b._b.off("keydown"+b.ns);c("html").attr("style",b._z5||"");c("body").attr("style",b._a6||"");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!1,a.slideId=-99,a.isBigLoaded=a.isLoaded,a.isBigLoading=a.isLoading,a.bigImage=
a.image,a.bigIW=a.iW,a.bigIH=a.iH,a.isLoaded=a.isMedLoaded,a.isLoading=!1,a.image=a.medImage,a.images[0]=a.medImage,a.iW=a.medIW,a.iH=a.medIH,a.isAppended=a.contentAdded=!1,b._c6(a,!0),a.bigImage!==a.medImage&&(a.sizeType="med"));b.isFullscreen=!1;a=c(window);a.scrollTop(b._x5);a.scrollLeft(b._y5);b._w5=!1;b.slider.removeClass("rsFullscreen");jQuery("body").removeClass("rsBodyFullscreen");b.updateSliderSize();setTimeout(function(){b.updateSliderSize()},1);b.ev.trigger("rsExitFullscreen");if(scrollTop_fullscreen!==false){ jQuery("html,body").scrollTop(scrollTop_fullscreen);scrollTop_fullscreen=false};}},_c6:function(a,b){

var d=a.isLoaded||a.isLoading?'<img data-class="'+a.customClass+'"  data-style="'+a.customStyle+'"  class="rsImg rsMainSlideImage '+a.customClass+'" style="'+a.customStyle+'" src="'+a.image+'"/>':'<a data-class="'+a.customClass+'"  data-style="'+a.customStyle+'" class="rsImg rsMainSlideImage '+a.customClass+'" style="'+a.customStyle+'" href="'+a.image+'"></a>';

a.content.hasClass("rsImg")?a.content=c(d):a.content.find(".rsImg").eq(0).replaceWith(d);a.isLoaded||a.isLoading||!a.holder||a.holder.html(a.content)}});c.rsModules.fullscreen=c.rsProto._q5})(jQuery);
// jquery.rs.autoplay v1.0.5
(function(b){b.extend(b.rsProto,{_x4:function(){var a=this,d;a._y4={enabled:!1,stopAtAction:!0,pauseOnHover:!0,delay:2E3};!a.st.autoPlay&&a.st.autoplay&&(a.st.autoPlay=a.st.autoplay);a.st.autoPlay=b.extend({},a._y4,a.st.autoPlay);a.st.autoPlay.enabled&&(a.ev.on("rsBeforeParseNode",function(a,c,f){c=b(c);if(d=c.attr("data-rsDelay"))f.customDelay=parseInt(d,10)}),a.ev.one("rsAfterInit",function(){a._z4()}),a.ev.on("rsBeforeDestroy",function(){a.stopAutoPlay();a.slider.off("mouseenter mouseleave");b(window).off("blur"+
a.ns+" focus"+a.ns)}))},_z4:function(){var a=this;a.startAutoPlay();a.ev.on("rsAfterContentSet",function(b,e){a._l2||a._r2||!a._a5||e!==a.currSlide||a._b5()});a.ev.on("rsDragRelease",function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.ev.on("rsAfterSlideChange",function(){a._a5&&a._c5&&(a._c5=!1,a.currSlide.isLoaded&&a._b5())});a.ev.on("rsDragStart",function(){a._a5&&(a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._c5=!0,a._d5()))});a.ev.on("rsBeforeMove",function(b,e,c){a._a5&&(c&&a.st.autoPlay.stopAtAction?
a.stopAutoPlay():(a._c5=!0,a._d5()))});a._e5=!1;a.ev.on("rsVideoStop",function(){a._a5&&(a._e5=!1,a._b5())});a.ev.on("rsVideoPlay",function(){a._a5&&(a._c5=!1,a._d5(),a._e5=!0)});b(window).on("blur"+a.ns,function(){a._a5&&(a._c5=!0,a._d5())}).on("focus"+a.ns,function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.st.autoPlay.pauseOnHover&&(a._f5=!1,a.slider.hover(function(){a._a5&&(a._c5=!1,a._d5(),a._f5=!0)},function(){a._a5&&(a._f5=!1,a._b5())}))},toggleAutoPlay:function(){this._a5?this.stopAutoPlay():
this.startAutoPlay()},startAutoPlay:function(){this._a5=!0;this.currSlide.isLoaded&&this._b5()},stopAutoPlay:function(){this._e5=this._f5=this._c5=this._a5=!1;this._d5()},_b5:function(){var a=this;a._f5||a._e5||(a._g5=!0,a._h5&&clearTimeout(a._h5),a._h5=setTimeout(function(){var b;a._z||a.st.loopRewind||(b=!0,a.st.loopRewind=!0);a.next(!0);b&&(a.st.loopRewind=!1)},a.currSlide.customDelay?a.currSlide.customDelay:a.st.autoPlay.delay))},_d5:function(){this._f5||this._e5||(this._g5=!1,this._h5&&(clearTimeout(this._h5),
this._h5=null))}});b.rsModules.autoplay=b.rsProto._x4})(jQuery);
// jquery.rs.video v1.1.3
(function(f){f.extend(f.rsProto,{_z6:function(){var a=this;a._a7={autoHideArrows:!0,autoHideControlNav:!1,autoHideBlocks:!1,autoHideCaption:!1,disableCSS3inFF:!0,youTubeCode:'<iframe src="http://www.youtube.com/embed/%id%?rel=1&showinfo=0&autoplay=1&wmode=transparent" frameborder="no"></iframe>',vimeoCode:'<iframe src="http://player.vimeo.com/video/%id%?byline=0&portrait=0&autoplay=1" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'};a.st.video=f.extend({},a._a7,
a.st.video);a.ev.on("rsBeforeSizeSet",function(){a._b7&&setTimeout(function(){var b=a._r1,b=b.hasClass("rsVideoContainer")?b:b.find(".rsVideoContainer");a._c7&&a._c7.css({width:b.width(),height:b.height()})},32)});var d=a._a.mozilla;a.ev.on("rsAfterParseNode",function(b,c,e){b=f(c);if(e.videoURL){a.st.video.disableCSS3inFF&&d&&(a._e=a._f=!1);c=f('<div class="rsVideoContainer"></div>');var g=f('<div class="rsBtnCenterer"><div class="rsPlayBtn"><div class="rsPlayBtnIcon"></div></div></div>');b.hasClass("rsImg")?
e.content=c.append(b).append(g):e.content.find(".rsImg").wrap(c).after(g)}});a.ev.on("rsAfterSlideChange",function(){a.stopVideo()})},toggleVideo:function(){return this._b7?this.stopVideo():this.playVideo()},playVideo:function(){var a=this;if(!a._b7){var d=a.currSlide;if(!d.videoURL)return!1;a._d7=d;var b=a._e7=d.content,d=d.videoURL,c,e;d.match(/youtu\.be/i)||d.match(/youtube\.com/i)?(e=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,(e=d.match(e))&&11==e[7].length&&
(c=e[7]),void 0!==c&&(a._c7=a.st.video.youTubeCode.replace("%id%",c))):d.match(/vimeo\.com/i)&&(e=/(www\.)?vimeo.com\/(\d+)($|\/)/,(e=d.match(e))&&(c=e[2]),void 0!==c&&(a._c7=a.st.video.vimeoCode.replace("%id%",c)));a.videoObj=f(a._c7);a.ev.trigger("rsOnCreateVideoElement",[d]);a.videoObj.length&&(a._c7=f('<div class="rsVideoFrameHolder"><div class="rsPreloader"></div><div class="rsCloseVideoBtn"><div class="rsCloseVideoIcn"></div></div></div>'),a._c7.find(".rsPreloader").after(a.videoObj),b=b.hasClass("rsVideoContainer")?
b:b.find(".rsVideoContainer"),a._c7.css({width:b.width(),height:b.height()}).find(".rsCloseVideoBtn").off("click.rsv").on("click.rsv",function(b){a.stopVideo();b.preventDefault();b.stopPropagation();return!1}),b.append(a._c7),a.isIPAD&&b.addClass("rsIOSVideo"),a._f7(!1),setTimeout(function(){a._c7.addClass("rsVideoActive")},10),a.ev.trigger("rsVideoPlay"),a._b7=!0);return!0}return!1},stopVideo:function(){var a=this;return a._b7?(a.isIPAD&&a.slider.find(".rsCloseVideoBtn").remove(),a._f7(!0),setTimeout(function(){a.ev.trigger("rsOnDestroyVideoElement",
[a.videoObj]);var d=a._c7.find("iframe");if(d.length)try{d.attr("src","")}catch(b){}a._c7.remove();a._c7=null},16),a.ev.trigger("rsVideoStop"),a._b7=!1,!0):!1},_f7:function(a,d){var b=[],c=this.st.video;c.autoHideArrows&&(this._c2&&(b.push(this._c2,this._d2),this._e2=!a),this._v5&&b.push(this._v5));c.autoHideControlNav&&this._k5&&b.push(this._k5);c.autoHideBlocks&&this._d7.animBlocks&&b.push(this._d7.animBlocks);c.autoHideCaption&&this.globalCaption&&b.push(this.globalCaption);this.slider[a?"removeClass":
"addClass"]("rsVideoPlaying");if(b.length)for(c=0;c<b.length;c++)a?b[c].removeClass("rsHidden"):b[c].addClass("rsHidden")}});f.rsModules.video=f.rsProto._z6})(jQuery);
// jquery.rs.animated-blocks v1.0.7
(function(l){l.extend(l.rsProto,{_p4:function(){function m(){var g=a.currSlide;if(a.currSlide&&a.currSlide.isLoaded&&a._t4!==g){if(0<a._s4.length){for(b=0;b<a._s4.length;b++)clearTimeout(a._s4[b]);a._s4=[]}if(0<a._r4.length){var f;for(b=0;b<a._r4.length;b++)if(f=a._r4[b])a._e?(f.block.css(a._g+a._u1,"0s"),f.block.css(f.css)):f.block.stop(!0).css(f.css),a._t4=null,g.animBlocksDisplayed=!1;a._r4=[]}g.animBlocks&&(g.animBlocksDisplayed=!0,a._t4=g,a._u4(g.animBlocks))}}var a=this,b;a._q4={fadeEffect:!0,
moveEffect:"top",moveOffset:20,speed:400,easing:"easeOutSine",delay:200};a.st.block=l.extend({},a._q4,a.st.block);a._r4=[];a._s4=[];a.ev.on("rsAfterInit",function(){m()});a.ev.on("rsBeforeParseNode",function(a,b,d){b=l(b);d.animBlocks=b.find(".rsABlock").css("display","none");d.animBlocks.length||(b.hasClass("rsABlock")?d.animBlocks=b.css("display","none"):d.animBlocks=!1)});a.ev.on("rsAfterContentSet",function(b,f){f.id===a.slides[a.currSlideId].id&&setTimeout(function(){m()},a.st.fadeinLoadedSlide?
300:0)});a.ev.on("rsAfterSlideChange",function(){m()})},_v4:function(l,a){setTimeout(function(){l.css(a)},6)},_u4:function(m){var a=this,b,g,f,d,h,e,n;a._s4=[];m.each(function(m){b=l(this);g={};f={};d=null;var c=b.attr("data-move-offset"),c=c?parseInt(c,10):a.st.block.moveOffset;if(0<c&&((e=b.data("move-effect"))?(e=e.toLowerCase(),"none"===e?e=!1:"left"!==e&&"top"!==e&&"bottom"!==e&&"right"!==e&&(e=a.st.block.moveEffect,"none"===e&&(e=!1))):e=a.st.block.moveEffect,e&&"none"!==e)){var p;p="right"===
e||"left"===e?!0:!1;var k;n=!1;a._e?(k=0,h=a._x1):(p?isNaN(parseInt(b.css("right"),10))?h="left":(h="right",n=!0):isNaN(parseInt(b.css("bottom"),10))?h="top":(h="bottom",n=!0),h="margin-"+h,n&&(c=-c),a._e?k=parseInt(b.css(h),10):(k=b.data("rs-start-move-prop"),void 0===k&&(k=parseInt(b.css(h),10),isNaN(k)&&(k=0),b.data("rs-start-move-prop",k))));f[h]=a._m4("top"===e||"left"===e?k-c:k+c,p);g[h]=a._m4(k,p)}c=b.attr("data-fade-effect");if(!c)c=a.st.block.fadeEffect;else if("none"===c.toLowerCase()||
"false"===c.toLowerCase())c=!1;c&&(f.opacity=0,g.opacity=1);if(c||e)d={},d.hasFade=Boolean(c),Boolean(e)&&(d.moveProp=h,d.hasMove=!0),d.speed=b.data("speed"),isNaN(d.speed)&&(d.speed=a.st.block.speed),d.easing=b.data("easing"),d.easing||(d.easing=a.st.block.easing),d.css3Easing=l.rsCSS3Easing[d.easing],d.delay=b.data("delay"),isNaN(d.delay)&&(d.delay=a.st.block.delay*m);c={};a._e&&(c[a._g+a._u1]="0ms");c.moveProp=g.moveProp;c.opacity=g.opacity;c.display="none";a._r4.push({block:b,css:c});a._v4(b,
f);a._s4.push(setTimeout(function(b,d,c,e){return function(){b.css("display","block");if(c){var g={};if(a._e){var f="";c.hasMove&&(f+=c.moveProp);c.hasFade&&(c.hasMove&&(f+=", "),f+="opacity");g[a._g+a._t1]=f;g[a._g+a._u1]=c.speed+"ms";g[a._g+a._v1]=c.css3Easing;b.css(g);setTimeout(function(){b.css(d)},24)}else setTimeout(function(){b.animate(d,c.speed,c.easing)},16)}delete a._s4[e]}}(b,g,d,m),6>=d.delay?12:d.delay))})}});l.rsModules.animatedBlocks=l.rsProto._p4})(jQuery);
// jquery.rs.auto-height v1.0.3
(function(b){b.extend(b.rsProto,{_w4:function(){var a=this;if(a.st.autoHeight){var b,c,e,f=!0,d=function(d){e=a.slides[a.currSlideId];(b=e.holder)&&(c=b.height())&&void 0!==c&&c>(a.st.minAutoHeight||30)&&(a._c4=c,a._e||!d?a._e1.css("height",c):a._e1.stop(!0,!0).animate({height:c},a.st.transitionSpeed),a.ev.trigger("rsAutoHeightChange",c),f&&(a._e&&setTimeout(function(){a._e1.css(a._g+"transition","height "+a.st.transitionSpeed+"ms ease-in-out")},16),f=!1))};a.ev.on("rsMaybeSizeReady.rsAutoHeight",
function(a,b){e===b&&d()});a.ev.on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()});a.slider.addClass("rsAutoHeight");a.ev.one("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div style="clear:both; float: none;"></div>')},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)})}}});b.rsModules.autoHeight=b.rsProto._w4})(jQuery);
// jquery.rs.global-caption v1.0.1
(function(b){b.extend(b.rsProto,{_d6:function(){var a=this;a.st.globalCaption&&(a.ev.on("rsAfterInit",function(){a.globalCaption=b('<div class="rsGCaption"></div>').appendTo(a.st.globalCaptionInside?a._e1:a.slider);a.globalCaption.html(a.currSlide.caption||"")}),a.ev.on("rsBeforeAnimStart",function(){a.globalCaption.html(a.currSlide.caption||"")}))}});b.rsModules.globalCaption=b.rsProto._d6})(jQuery);
// jquery.rs.active-class v1.0.1
(function(c){c.rsProto._o4=function(){var b,a=this;if(a.st.addActiveClass)a.ev.on("rsOnUpdateNav",function(){b&&clearTimeout(b);b=setTimeout(function(){a._g4&&a._g4.removeClass("rsActiveSlide");a._r1&&a._r1.addClass("rsActiveSlide");b=null},50)})};c.rsModules.activeClass=c.rsProto._o4})(jQuery);
// jquery.rs.deeplinking v1.0.6 + jQuery hashchange plugin v1.3 Copyright (c) 2010 Ben Alman
(function(b){b.extend(b.rsProto,{_o5:function(){var a=this,h,d,f;a._p5={enabled:!1,change:!1,prefix:""};a.st.deeplinking=b.extend({},a._p5,a.st.deeplinking);if(a.st.deeplinking.enabled){var g=a.st.deeplinking.change,e=a.st.deeplinking.prefix,c="#"+e,k=function(){var a=window.location.hash;return a&&0<a.indexOf(e)&&(a=parseInt(a.substring(c.length),10),0<=a)?a-1:-1},p=k();-1!==p&&(a.st.startSlideId=p);g&&(b(window).on("hashchange"+a.ns,function(b){h||(b=k(),0>b||(b>a.numSlides-1&&(b=a.numSlides-1),
a.goTo(b)))}),a.ev.on("rsBeforeAnimStart",function(){d&&clearTimeout(d);f&&clearTimeout(f)}),a.ev.on("rsAfterSlideChange",function(){d&&clearTimeout(d);f&&clearTimeout(f);f=setTimeout(function(){h=!0;window.location.replace((""+window.location).split("#")[0]+c+(a.currSlideId+1));d=setTimeout(function(){h=!1;d=null},60)},400)}));a.ev.on("rsBeforeDestroy",function(){d=f=null;g&&b(window).off("hashchange"+a.ns)})}}});b.rsModules.deeplinking=b.rsProto._o5})(jQuery);
(function(b,a,h){function d(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}"$:nomunge";var f=document,g,e=b.event.special,c=f.documentMode,k="onhashchange"in a&&(c===h||7<c);b.fn.hashchange=function(a){return a?this.bind("hashchange",a):this.trigger("hashchange")};b.fn.hashchange.delay=50;e.hashchange=b.extend(e.hashchange,{setup:function(){if(k)return!1;b(g.start)},teardown:function(){if(k)return!1;b(g.stop)}});g=function(){function g(){var f=d(),e=q(l);f!==l?(m(l=f,e),b(a).trigger("hashchange")):
e!==l&&(location.href=location.href.replace(/#.*/,"")+e);c=setTimeout(g,b.fn.hashchange.delay)}var e={},c,l=d(),n=function(a){return a},m=n,q=n;e.start=function(){c||g()};e.stop=function(){c&&clearTimeout(c);c=h};a.attachEvent&&!a.addEventListener&&!k&&function(){var a,c;e.start=function(){a||(c=(c=b.fn.hashchange.src)&&c+d(),a=b('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){c||m(d());g()}).attr("src",c||"javascript:0").insertAfter("body")[0].contentWindow,f.onpropertychange=
function(){try{"title"===event.propertyName&&(a.document.title=f.title)}catch(b){}})};e.stop=n;q=function(){return d(a.location.href)};m=function(c,e){var d=a.document,g=b.fn.hashchange.domain;c!==e&&(d.title=f.title,d.open(),g&&d.write('<script>document.domain="'+g+'"\x3c/script>'),d.close(),a.location.hash=c)}}();return e}()})(jQuery,this);
// jquery.rs.visible-nearby v1.0.2
(function(d){d.rsProto._g7=function(){var a=this;a.st.visibleNearby&&a.st.visibleNearby.enabled&&(a._h7={enabled:!0,centerArea:.6,center:!0,breakpoint:0,breakpointCenterArea:.8,hiddenOverflow:!0,navigateByCenterClick:!1},a.st.visibleNearby=d.extend({},a._h7,a.st.visibleNearby),a.ev.one("rsAfterPropsSetup",function(){a._i7=a._e1.css("overflow","visible").wrap('<div class="rsVisibleNearbyWrap"></div>').parent();a.st.visibleNearby.hiddenOverflow||a._i7.css("overflow","visible");a._o1=a.st.controlsInside?
a._i7:a.slider}),a.ev.on("rsAfterSizePropSet",function(){var b,c=a.st.visibleNearby;b=c.breakpoint&&a.width<c.breakpoint?c.breakpointCenterArea:c.centerArea;a._h?(a._b4*=b,a._i7.css({height:a._c4,width:a._b4/b}),a._d=a._b4*(1-b)/2/b):(a._c4*=b,a._i7.css({height:a._c4/b,width:a._b4}),a._d=a._c4*(1-b)/2/b);c.navigateByCenterClick||(a._q=a._h?a._b4:a._c4);c.center&&a._e1.css("margin-"+(a._h?"left":"top"),a._d)}))};d.rsModules.visibleNearby=d.rsProto._g7})(jQuery);

function _bit_newgallery(obj){
	obj.each(function(){
		var imageScaleMode = jQuery(this).attr("imageScaleMode")?jQuery(this).attr("imageScaleMode"):"fit-if-smaller";
		var slidesOrientation = jQuery(this).attr("slidesOrientation")?jQuery(this).attr("slidesOrientation"):"horizontal";
		// var autoScaleSlider =
		// jQuery(this).attr("autoScaleSlider")==""?true:false;
		var arrowsNavAutoHide = jQuery(this).attr("arrowsNavAutoHide")=="true"?true:false;
		// var showfullscreen =
		// jQuery(this).attr("showfullscreen")=="true"?true:false;
		var g_width = jQuery(this).attr("g_width")?jQuery(this).attr("g_width"):"";
		var g_height = jQuery(this).attr("g_height")?jQuery(this).attr("g_height"):"";
		var transitionSpeed = jQuery(this).attr("transitionSpeed");
		var loop = jQuery(this).attr("g_loop")=="true"?true:false;
		var visiblenearby = jQuery(this).attr("visiblenearby")=="true"?true:false;
		var autoPlay  = jQuery(this).attr("auto_Play")=="true"?true:false;
		var arrowsNav = jQuery(this).attr("arrowsNav")=="true"?true:false;

		var controlNavigation = jQuery(this).attr("controlNavigation");
		if(controlNavigation=="thumbnails") controlNavigation="thumbnails";
		else if(controlNavigation=="none") controlNavigation="none";
		else controlNavigation = "bullets";
		var thumbnails_orientation = jQuery(this).attr("thumbnails_orientation")?jQuery(this).attr("thumbnails_orientation"):"horizontal";
		var disabledclick = jQuery(this).attr("disabledclick")=="true"?false:true;
		jQuery(this).removeClass("royalSlidering");

		jQuery(this).royalSlider({
			fullscreen: {
				enabled: true,
				nativeFS: true
			},
			controlNavigation: controlNavigation,
			slidesOrientation:slidesOrientation,
			autoScaleSlider: false,
			autoScaleSliderWidth: g_width,
			autoScaleSliderHeight: g_height,
			loop: loop,
			imageScaleMode: imageScaleMode,
			navigateByClick: disabledclick,
			sliderTouch: disabledclick,
			numImagesToPreload:2,
			arrowsNav:arrowsNav,
			arrowsNavAutoHide: arrowsNavAutoHide,
			arrowsNavHideOnTouch: typeof g_arrowsNavHideOnTouch!="undefined"?g_arrowsNavHideOnTouch:true,
			keyboardNavEnabled: true,
			fadeinLoadedSlide: true,
			globalCaption: false,
			globalCaptionInside: false,
			addActiveClass:true,
			thumbs: {
				orientation :thumbnails_orientation,
				appendSpan: true,
				firstMargin: true,
				paddingBottom: 4
			},
			visibleNearby: {
				enabled: visiblenearby,
				centerArea: 0.7,
				center: true,
				breakpoint: 650,
				breakpointCenterArea: 0.64,
				navigateByCenterClick: true
			},
			autoPlay: {
				enabled: autoPlay,
				pauseOnHover: true
			}
		});
	})

}
function _vc_royalSlider_gallery_init(){
	var w = jQuery("body").width();
	var is_image_ok =true;
	jQuery('.royalSlider_gallery_new:not(.played) img').each(function(){
		if(!jQuery(this).prop('complete')){
			is_image_ok = false;
		}

	})
	if(!is_image_ok) {
		window.setTimeout(function(){
			_vc_royalSlider_gallery_init();
		}, 500);
		return;
	}
	royalSlider_gallery_new();

}
function royalSlider_gallery_new(obj){
	if(typeof(obj)== "undefined"){
		obj = jQuery('.royalSlider_gallery_new:not(".played")');
	}
	var w = jQuery("body").width();
	obj.each(function(){

		if(w<760 && !jQuery(this).hasClass("tabroya")){
			return;
		}


		var id =  jQuery(this).parent().attr("id");

		var $this = this;
		var istolast = false;
		var count = 0;
		var transitionType  = jQuery(this).attr("transitionType");
		try{
			if(top!=self &&  parent.vc && transitionType!="none"){
				if(jQuery($this).hasClass("played") || jQuery($this).find(".rsContainer").length>0){
					if(parent.vc.ShortcodesBuilder.isAddSlider){
						istolast = true;
						parent.vc.ShortcodesBuilder.isAddSlider = false;
					}
					var slider = jQuery($this).data('royalSlider');
					if(slider)
						slider.destroy();
					jQuery($this).html("");
					var id = jQuery(this).closest(".vc-container").attr("data-model-id");
					var model =  parent.vc.shortcodes.get(id);
					var old_view = model.view;

					var models =  parent.vc.shortcodes.where({parent_id: model.get('id')});

					parent._.each(models, function(childmodel) {
						if(childmodel.view.$el){
							childmodel.view.$el.appendTo(model.view.content());
							count++;
						}
					}, this);
					model.view.updated();

				}
			}
		}catch(e){


		}
		jQuery(this).addClass("played");
		var imageScaleMode = jQuery(this).attr("imageScaleMode")?jQuery(this).attr("imageScaleMode"):"fit-if-smaller";
		var slidesOrientation = jQuery(this).attr("slidesOrientation")?jQuery(this).attr("slidesOrientation"):"horizontal";
		//var autoScaleSlider = jQuery(this).attr("autoScaleSlider")==""?true:false;
		var arrowsNavAutoHide = jQuery(this).attr("arrowsNavAutoHide")=="true"?true:false;
		//var showfullscreen = jQuery(this).attr("showfullscreen")=="true"?true:false;
		//var g_width = jQuery(this).attr("g_width")?jQuery(this).attr("g_width"):"";
		//var g_height = jQuery(this).attr("g_height")?jQuery(this).attr("g_height"):"";
		var transitionSpeed = jQuery(this).attr("transitionSpeed");
		var loop = jQuery(this).attr("g_loop")=="true"?true:false;
		var visiblenearby = jQuery(this).attr("visiblenearby")=="true"?true:false;
		var autoPlay  = jQuery(this).attr("auto_Play")=="true"?true:false;
		var arrowsNav = jQuery(this).attr("arrowsNav")=="true"?true:false;

		var controlNavigation = jQuery(this).attr("controlNavigation");
		if(controlNavigation=="thumbnails") controlNavigation="thumbnails";
		else if(controlNavigation=="none") controlNavigation="none";
		else controlNavigation = "bullets";
		var thumbnails_orientation = jQuery(this).attr("thumbnails_orientation")?jQuery(this).attr("thumbnails_orientation"):"horizontal";
		var disabledclick = jQuery(this).attr("disabledclick")=="true"?false:true;

		var transitionSpeed  = jQuery(this).attr("transitionSpeed");
		if(!transitionSpeed) transitionSpeed = 600;
		var transitionType  = jQuery(this).attr("transitionType");

		if(transitionType!="none"){

			if(!transitionType) transitionType = "move";
			if(transitionType=="fade") transitionSpeed = Math.ceil(transitionSpeed/500);

			var delay  = jQuery(this).attr("delay");
			if(!delay) delay = 3000;
			var autoHeight = true;
			if(jQuery(this).attr("data-minheight") && jQuery(this).attr("data-minheight")>0){
				jQuery(this).find("section.section").css("height",jQuery(this).attr("data-minheight")+"px");
			}
			if(jQuery(this).children().length==0) return;

			jQuery(this).royalSlider({
				fullscreen: {
					enabled: false,
					nativeFS: false
				},
				controlNavigation: controlNavigation,
				slidesOrientation:slidesOrientation,
				autoScaleSlider: false,
				autoScaleSliderWidth: 300,
				autoScaleSliderHeight: 150,
				loop: loop,
				transitionSpeed:transitionSpeed,
				transitionType:transitionType,
				imageScaleMode: imageScaleMode,
				navigateByClick: disabledclick,
				sliderTouch: disabledclick,
				numImagesToPreload:10,
				arrowsNav:arrowsNav,
				arrowsNavAutoHide: arrowsNavAutoHide,
				arrowsNavHideOnTouch: typeof g_arrowsNavHideOnTouch!="undefined"?g_arrowsNavHideOnTouch:true,
				keyboardNavEnabled: !is_edit_model?true:false,
				sliderDrag: w<760?true:false,
				fadeinLoadedSlide: true,
				globalCaption: false,
				globalCaptionInside: false,
				addActiveClass:true,
				autoHeight:autoHeight,
				thumbs: {
					orientation :thumbnails_orientation,
					appendSpan: true,
					firstMargin: true,
					paddingBottom: 4
				},
				visibleNearby: {
					enabled: visiblenearby,
					centerArea: 0.7,
					center: true,
					breakpoint: 650,
					breakpointCenterArea: 0.64,
					navigateByCenterClick: true
				},
				autoPlay: {
					enabled: autoPlay,
					pauseOnHover: true,
					delay:delay
				}
			});
			var slider = jQuery(this).data('royalSlider');

			if(istolast && count>0){
				slider.goTo(count-1);
			}
			var $this = jQuery(this);
			var p = $this.closest(".qfy-tabcontent")
			$this.find(".pretabloadimg:not('.loaded')").each(function(){
				var newurl = jQuery(this).attr("org-src");
				jQuery(this).attr("src",newurl).addClass("loaded").load(function(){
					var newscrset = jQuery(this).attr("org-srcset");
					if(newscrset){
						jQuery(this).attr("srcset",newscrset);
					}
				});
			});

				slider.ev.on('rsAfterSlideChange', function() {
					// mouse/touch drag end
					$this.find(".pretabloadimg:not('.loaded')").each(function(){
						var newurl = jQuery(this).attr("org-src");
						jQuery(this).attr("src",newurl).addClass("loaded").load(function(){
							var newscrset = jQuery(this).attr("org-srcset");
							if(newscrset){
								jQuery(this).attr("srcset",newscrset);
							}
						});
					});
					if(p.length>0){
						p.find(".tabcontent-header-menu li.item button").removeClass("active");
						var index = p.find(".rsBullets .rsNavItem.rsNavSelected").index();
						p.find(".tabcontent-header-menu li.item:eq("+index+") button").addClass("active");
						p.find(".rsActiveSlide .qsa").each(function(i){
							var $this = this;
							jQuery($this).removeClass("qsa");
							setTimeout(function(){qfe_animate_fun($this);},50);
						})
						setTimeout(function(){qfy_a_video_event();},50);
					}
				});

		}

	})


}
;

/* flexslider: (http://www.artjiahua.com/qfy-content/plugins/qfy_editor/assets/lib/flexslider/jquery.flexslider-min.js) */
/*
 * jQuery FlexSlider v2.1
 * http://www.qifeiye.com/flexslider/
 *
 * Copyright 2012 BitThemes
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: Tyler Smith (@mbmufffin)
 */
(function(d){d.flexslider=function(j,l){var a=d(j),c=d.extend({},d.flexslider.defaults,l),e=c.namespace,q="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,u=q?"touchend":"click",m="vertical"===c.direction,n=c.reverse,h=0<c.itemWidth,s="fade"===c.animation,t=""!==c.asNavFor,f={};d.data(j,"flexslider",a);f={init:function(){a.animating=!1;a.currentSlide=c.startAt;a.animatingTo=a.currentSlide;a.atEnd=0===a.currentSlide||a.currentSlide===a.last;a.containerSelector=c.selector.substr(0,
c.selector.search(" "));a.slides=d(c.selector,a);a.container=d(a.containerSelector,a);a.count=a.slides.length;a.syncExists=0<d(c.sync).length;"slide"===c.animation&&(c.animation="swing");a.prop=m?"top":"marginLeft";a.args={};a.manualPause=!1;var b=a,g;if(g=!c.video)if(g=!s)if(g=c.useCSS)a:{g=document.createElement("div");var p=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"],e;for(e in p)if(void 0!==g.style[p[e]]){a.pfx=p[e].replace("Perspective","").toLowerCase();
a.prop="-"+a.pfx+"-transform";g=!0;break a}g=!1}b.transitions=g;""!==c.controlsContainer&&(a.controlsContainer=0<d(c.controlsContainer).length&&d(c.controlsContainer));""!==c.manualControls&&(a.manualControls=0<d(c.manualControls).length&&d(c.manualControls));c.randomize&&(a.slides.sort(function(){return Math.round(Math.random())-0.5}),a.container.empty().append(a.slides));a.doMath();t&&f.asNav.setup();a.setup("init");c.controlNav&&f.controlNav.setup();c.directionNav&&f.directionNav.setup();c.keyboard&&
(1===d(a.containerSelector).length||c.multipleKeyboard)&&d(document).bind("keyup",function(b){b=b.keyCode;if(!a.animating&&(39===b||37===b))b=39===b?a.getTarget("next"):37===b?a.getTarget("prev"):!1,a.flexAnimate(b,c.pauseOnAction)});c.mousewheel&&a.bind("mousewheel",function(b,g){b.preventDefault();var d=0>g?a.getTarget("next"):a.getTarget("prev");a.flexAnimate(d,c.pauseOnAction)});c.pausePlay&&f.pausePlay.setup();c.slideshow&&(c.pauseOnHover&&a.hover(function(){!a.manualPlay&&!a.manualPause&&a.pause()},
function(){!a.manualPause&&!a.manualPlay&&a.play()}),0<c.initDelay?setTimeout(a.play,c.initDelay):a.play());q&&c.touch&&f.touch();(!s||s&&c.smoothHeight)&&d(window).bind("resize focus",f.resize);setTimeout(function(){c.start(a)},200)},asNav:{setup:function(){a.asNav=!0;a.animatingTo=Math.floor(a.currentSlide/a.move);a.currentItem=a.currentSlide;a.slides.removeClass(e+"active-slide").eq(a.currentItem).addClass(e+"active-slide");a.slides.click(function(b){b.preventDefault();b=d(this);var g=b.index();
!d(c.asNavFor).data("flexslider").animating&&!b.hasClass("active")&&(a.direction=a.currentItem<g?"next":"prev",a.flexAnimate(g,c.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){a.manualControls?f.controlNav.setupManual():f.controlNav.setupPaging()},setupPaging:function(){var b=1,g;a.controlNavScaffold=d('<ol class="'+e+"control-nav "+e+("thumbnails"===c.controlNav?"control-thumbs":"control-paging")+'"></ol>');if(1<a.pagingCount)for(var p=0;p<a.pagingCount;p++)g="thumbnails"===c.controlNav?
'<img src="'+a.slides.eq(p).attr("data-thumb")+'"/>':"<a>"+b+"</a>",a.controlNavScaffold.append("<li>"+g+"</li>"),b++;a.controlsContainer?d(a.controlsContainer).append(a.controlNavScaffold):a.append(a.controlNavScaffold);f.controlNav.set();f.controlNav.active();a.controlNavScaffold.delegate("a, img",u,function(b){b.preventDefault();b=d(this);var g=a.controlNav.index(b);b.hasClass(e+"active")||(a.direction=g>a.currentSlide?"next":"prev",a.flexAnimate(g,c.pauseOnAction))});q&&a.controlNavScaffold.delegate("a",
"click touchstart",function(a){a.preventDefault()})},setupManual:function(){a.controlNav=a.manualControls;f.controlNav.active();a.controlNav.live(u,function(b){b.preventDefault();b=d(this);var g=a.controlNav.index(b);b.hasClass(e+"active")||(g>a.currentSlide?a.direction="next":a.direction="prev",a.flexAnimate(g,c.pauseOnAction))});q&&a.controlNav.live("click touchstart",function(a){a.preventDefault()})},set:function(){a.controlNav=d("."+e+"control-nav li "+("thumbnails"===c.controlNav?"img":"a"),
a.controlsContainer?a.controlsContainer:a)},active:function(){a.controlNav.removeClass(e+"active").eq(a.animatingTo).addClass(e+"active")},update:function(b,c){1<a.pagingCount&&"add"===b?a.controlNavScaffold.append(d("<li><a>"+a.count+"</a></li>")):1===a.pagingCount?a.controlNavScaffold.find("li").remove():a.controlNav.eq(c).closest("li").remove();f.controlNav.set();1<a.pagingCount&&a.pagingCount!==a.controlNav.length?a.update(c,b):f.controlNav.active()}},directionNav:{setup:function(){var b=d('<ul class="'+
e+'direction-nav"><li><a class="'+e+'prev" href="#">'+c.prevText+'</a></li><li><a class="'+e+'next" href="#">'+c.nextText+"</a></li></ul>");a.controlsContainer?(d(a.controlsContainer).append(b),a.directionNav=d("."+e+"direction-nav li a",a.controlsContainer)):(a.append(b),a.directionNav=d("."+e+"direction-nav li a",a));f.directionNav.update();a.directionNav.bind(u,function(b){b.preventDefault();b=d(this).hasClass(e+"next")?a.getTarget("next"):a.getTarget("prev");a.flexAnimate(b,c.pauseOnAction)});
q&&a.directionNav.bind("click touchstart",function(a){a.preventDefault()})},update:function(){var b=e+"disabled";1===a.pagingCount?a.directionNav.addClass(b):c.animationLoop?a.directionNav.removeClass(b):0===a.animatingTo?a.directionNav.removeClass(b).filter("."+e+"prev").addClass(b):a.animatingTo===a.last?a.directionNav.removeClass(b).filter("."+e+"next").addClass(b):a.directionNav.removeClass(b)}},pausePlay:{setup:function(){var b=d('<div class="'+e+'pauseplay"><a></a></div>');a.controlsContainer?
(a.controlsContainer.append(b),a.pausePlay=d("."+e+"pauseplay a",a.controlsContainer)):(a.append(b),a.pausePlay=d("."+e+"pauseplay a",a));f.pausePlay.update(c.slideshow?e+"pause":e+"play");a.pausePlay.bind(u,function(b){b.preventDefault();d(this).hasClass(e+"pause")?(a.manualPause=!0,a.manualPlay=!1,a.pause()):(a.manualPause=!1,a.manualPlay=!0,a.play())});q&&a.pausePlay.bind("click touchstart",function(a){a.preventDefault()})},update:function(b){"play"===b?a.pausePlay.removeClass(e+"pause").addClass(e+
"play").text(c.playText):a.pausePlay.removeClass(e+"play").addClass(e+"pause").text(c.pauseText)}},touch:function(){function b(b){k=m?d-b.touches[0].pageY:d-b.touches[0].pageX;q=m?Math.abs(k)<Math.abs(b.touches[0].pageX-e):Math.abs(k)<Math.abs(b.touches[0].pageY-e);if(!q||500<Number(new Date)-l)b.preventDefault(),!s&&a.transitions&&(c.animationLoop||(k/=0===a.currentSlide&&0>k||a.currentSlide===a.last&&0<k?Math.abs(k)/r+2:1),a.setProps(f+k,"setTouch"))}function g(){j.removeEventListener("touchmove",
b,!1);if(a.animatingTo===a.currentSlide&&!q&&null!==k){var h=n?-k:k,m=0<h?a.getTarget("next"):a.getTarget("prev");a.canAdvance(m)&&(550>Number(new Date)-l&&50<Math.abs(h)||Math.abs(h)>r/2)?a.flexAnimate(m,c.pauseOnAction):s||a.flexAnimate(a.currentSlide,c.pauseOnAction,!0)}j.removeEventListener("touchend",g,!1);f=k=e=d=null}var d,e,f,r,k,l,q=!1;j.addEventListener("touchstart",function(k){a.animating?k.preventDefault():1===k.touches.length&&(a.pause(),r=m?a.h:a.w,l=Number(new Date),f=h&&n&&a.animatingTo===
a.last?0:h&&n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:h&&a.currentSlide===a.last?a.limit:h?(a.itemW+c.itemMargin)*a.move*a.currentSlide:n?(a.last-a.currentSlide+a.cloneOffset)*r:(a.currentSlide+a.cloneOffset)*r,d=m?k.touches[0].pageY:k.touches[0].pageX,e=m?k.touches[0].pageX:k.touches[0].pageY,j.addEventListener("touchmove",b,!1),j.addEventListener("touchend",g,!1))},!1)},resize:function(){!a.animating&&a.is(":visible")&&(h||a.doMath(),s?f.smoothHeight():h?(a.slides.width(a.computedW),
a.update(a.pagingCount),a.setProps()):m?(a.viewport.height(a.h),a.setProps(a.h,"setTotal")):(c.smoothHeight&&f.smoothHeight(),a.newSlides.width(a.computedW),a.setProps(a.computedW,"setTotal")))},smoothHeight:function(b){if(!m||s){var c=s?a:a.viewport;b?c.animate({height:a.slides.eq(a.animatingTo).height()},b):c.height(a.slides.eq(a.animatingTo).height())}},sync:function(b){var g=d(c.sync).data("flexslider"),e=a.animatingTo;switch(b){case "animate":g.flexAnimate(e,c.pauseOnAction,!1,!0);break;case "play":!g.playing&&
!g.asNav&&g.play();break;case "pause":g.pause()}}};a.flexAnimate=function(b,g,p,j,l){t&&1===a.pagingCount&&(a.direction=a.currentItem<b?"next":"prev");if(!a.animating&&(a.canAdvance(b,l)||p)&&a.is(":visible")){if(t&&j)if(p=d(c.asNavFor).data("flexslider"),a.atEnd=0===b||b===a.count-1,p.flexAnimate(b,!0,!1,!0,l),a.direction=a.currentItem<b?"next":"prev",p.direction=a.direction,Math.ceil((b+1)/a.visible)-1!==a.currentSlide&&0!==b)a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+
"active-slide"),b=Math.floor(b/a.visible);else return a.currentItem=b,a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide"),!1;a.animating=!0;a.animatingTo=b;c.before(a);g&&a.pause();a.syncExists&&!l&&f.sync("animate");c.controlNav&&f.controlNav.active();h||a.slides.removeClass(e+"active-slide").eq(b).addClass(e+"active-slide");a.atEnd=0===b||b===a.last;c.directionNav&&f.directionNav.update();b===a.last&&(c.end(a),c.animationLoop||a.pause());if(s)q?(a.slides.eq(a.currentSlide).css({opacity:0,
zIndex:1}),a.slides.eq(b).css({opacity:1,zIndex:2}),a.slides.unbind("webkitTransitionEnd transitionend"),a.slides.eq(a.currentSlide).bind("webkitTransitionEnd transitionend",function(){c.after(a)}),a.animating=!1,a.currentSlide=a.animatingTo):(a.slides.eq(a.currentSlide).fadeOut(c.animationSpeed,c.easing),a.slides.eq(b).fadeIn(c.animationSpeed,c.easing,a.wrapup));else{var r=m?a.slides.filter(":first").height():a.computedW;h?(b=c.itemWidth>a.w?2*c.itemMargin:c.itemMargin,b=(a.itemW+b)*a.move*a.animatingTo,
b=b>a.limit&&1!==a.visible?a.limit:b):b=0===a.currentSlide&&b===a.count-1&&c.animationLoop&&"next"!==a.direction?n?(a.count+a.cloneOffset)*r:0:a.currentSlide===a.last&&0===b&&c.animationLoop&&"prev"!==a.direction?n?0:(a.count+1)*r:n?(a.count-1-b+a.cloneOffset)*r:(b+a.cloneOffset)*r;a.setProps(b,"",c.animationSpeed);if(a.transitions){if(!c.animationLoop||!a.atEnd)a.animating=!1,a.currentSlide=a.animatingTo;a.container.unbind("webkitTransitionEnd transitionend");a.container.bind("webkitTransitionEnd transitionend",
function(){a.wrapup(r)})}else a.container.animate(a.args,c.animationSpeed,c.easing,function(){a.wrapup(r)})}c.smoothHeight&&f.smoothHeight(c.animationSpeed)}};a.wrapup=function(b){!s&&!h&&(0===a.currentSlide&&a.animatingTo===a.last&&c.animationLoop?a.setProps(b,"jumpEnd"):a.currentSlide===a.last&&(0===a.animatingTo&&c.animationLoop)&&a.setProps(b,"jumpStart"));a.animating=!1;a.currentSlide=a.animatingTo;c.after(a)};a.animateSlides=function(){a.animating||a.flexAnimate(a.getTarget("next"))};a.pause=
function(){clearInterval(a.animatedSlides);a.playing=!1;c.pausePlay&&f.pausePlay.update("play");a.syncExists&&f.sync("pause")};a.play=function(){a.animatedSlides=setInterval(a.animateSlides,c.slideshowSpeed);a.playing=!0;c.pausePlay&&f.pausePlay.update("pause");a.syncExists&&f.sync("play")};a.canAdvance=function(b,g){var d=t?a.pagingCount-1:a.last;return g?!0:t&&a.currentItem===a.count-1&&0===b&&"prev"===a.direction?!0:t&&0===a.currentItem&&b===a.pagingCount-1&&"next"!==a.direction?!1:b===a.currentSlide&&
!t?!1:c.animationLoop?!0:a.atEnd&&0===a.currentSlide&&b===d&&"next"!==a.direction?!1:a.atEnd&&a.currentSlide===d&&0===b&&"next"===a.direction?!1:!0};a.getTarget=function(b){a.direction=b;return"next"===b?a.currentSlide===a.last?0:a.currentSlide+1:0===a.currentSlide?a.last:a.currentSlide-1};a.setProps=function(b,g,d){var e,f=b?b:(a.itemW+c.itemMargin)*a.move*a.animatingTo;e=-1*function(){if(h)return"setTouch"===g?b:n&&a.animatingTo===a.last?0:n?a.limit-(a.itemW+c.itemMargin)*a.move*a.animatingTo:a.animatingTo===
a.last?a.limit:f;switch(g){case "setTotal":return n?(a.count-1-a.currentSlide+a.cloneOffset)*b:(a.currentSlide+a.cloneOffset)*b;case "setTouch":return b;case "jumpEnd":return n?b:a.count*b;case "jumpStart":return n?a.count*b:b;default:return b}}()+"px";a.transitions&&(e=m?"translate3d(0,"+e+",0)":"translate3d("+e+",0,0)",d=void 0!==d?d/1E3+"s":"0s",a.container.css("-"+a.pfx+"-transition-duration",d));a.args[a.prop]=e;(a.transitions||void 0===d)&&a.container.css(a.args)};a.setup=function(b){if(s)a.slides.css({width:"100%",
"float":"left",marginRight:"-100%",position:"relative"}),"init"===b&&(q?a.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+c.animationSpeed/1E3+"s ease",zIndex:1}).eq(a.currentSlide).css({opacity:1,zIndex:2}):a.slides.eq(a.currentSlide).fadeIn(c.animationSpeed,c.easing)),c.smoothHeight&&f.smoothHeight();else{var g,p;"init"===b&&(a.viewport=d('<div class="'+e+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(a).append(a.container),a.cloneCount=0,a.cloneOffset=
0,n&&(p=d.makeArray(a.slides).reverse(),a.slides=d(p),a.container.empty().append(a.slides)));c.animationLoop&&!h&&(a.cloneCount=2,a.cloneOffset=1,"init"!==b&&a.container.find(".clone").remove(),a.container.append(a.slides.first().clone().addClass("clone")).prepend(a.slides.last().clone().addClass("clone")));a.newSlides=d(c.selector,a);g=n?a.count-1-a.currentSlide+a.cloneOffset:a.currentSlide+a.cloneOffset;m&&!h?(a.container.height(200*(a.count+a.cloneCount)+"%").css("position","absolute").width("100%"),
setTimeout(function(){a.newSlides.css({display:"block"});a.doMath();a.viewport.height(a.h);a.setProps(g*a.h,"init")},"init"===b?100:0)):(a.container.width(200*(a.count+a.cloneCount)+"%"),a.setProps(g*a.computedW,"init"),setTimeout(function(){a.doMath();a.newSlides.css({width:a.computedW,"float":"left",display:"block"});c.smoothHeight&&f.smoothHeight()},"init"===b?100:0))}h||a.slides.removeClass(e+"active-slide").eq(a.currentSlide).addClass(e+"active-slide")};a.doMath=function(){var b=a.slides.first(),
d=c.itemMargin,e=c.minItems,f=c.maxItems;a.w=a.width();a.h=b.height();a.boxPadding=b.outerWidth()-b.width();h?(a.itemT=c.itemWidth+d,a.minW=e?e*a.itemT:a.w,a.maxW=f?f*a.itemT:a.w,a.itemW=a.minW>a.w?(a.w-d*e)/e:a.maxW<a.w?(a.w-d*f)/f:c.itemWidth>a.w?a.w:c.itemWidth,a.visible=Math.floor(a.w/(a.itemW+d)),a.move=0<c.move&&c.move<a.visible?c.move:a.visible,a.pagingCount=Math.ceil((a.count-a.visible)/a.move+1),a.last=a.pagingCount-1,a.limit=1===a.pagingCount?0:c.itemWidth>a.w?(a.itemW+2*d)*a.count-a.w-
d:(a.itemW+d)*a.count-a.w-d):(a.itemW=a.w,a.pagingCount=a.count,a.last=a.count-1);a.computedW=a.itemW-a.boxPadding};a.update=function(b,d){a.doMath();h||(b<a.currentSlide?a.currentSlide+=1:b<=a.currentSlide&&0!==b&&(a.currentSlide-=1),a.animatingTo=a.currentSlide);if(c.controlNav&&!a.manualControls)if("add"===d&&!h||a.pagingCount>a.controlNav.length)f.controlNav.update("add");else if("remove"===d&&!h||a.pagingCount<a.controlNav.length)h&&a.currentSlide>a.last&&(a.currentSlide-=1,a.animatingTo-=1),
f.controlNav.update("remove",a.last);c.directionNav&&f.directionNav.update()};a.addSlide=function(b,e){var f=d(b);a.count+=1;a.last=a.count-1;m&&n?void 0!==e?a.slides.eq(a.count-e).after(f):a.container.prepend(f):void 0!==e?a.slides.eq(e).before(f):a.container.append(f);a.update(e,"add");a.slides=d(c.selector+":not(.clone)",a);a.setup();c.added(a)};a.removeSlide=function(b){var e=isNaN(b)?a.slides.index(d(b)):b;a.count-=1;a.last=a.count-1;isNaN(b)?d(b,a.slides).remove():m&&n?a.slides.eq(a.last).remove():
a.slides.eq(b).remove();a.doMath();a.update(e,"remove");a.slides=d(c.selector+":not(.clone)",a);a.setup();c.removed(a)};f.init()};d.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7E3,animationSpeed:600,initDelay:0,randomize:!1,pauseOnAction:!0,pauseOnHover:!1,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",
keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:0,maxItems:0,move:0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};d.fn.flexslider=function(j){void 0===j&&(j={});if("object"===typeof j)return this.each(function(){var a=d(this),c=a.find(j.selector?j.selector:".slides > li");1===c.length?(c.fadeIn(400),
j.start&&j.start(a)):void 0==a.data("flexslider")&&new d.flexslider(this,j)});var l=d(this).data("flexslider");switch(j){case "play":l.play();break;case "pause":l.pause();break;case "next":l.flexAnimate(l.getTarget("next"),!0);break;case "prev":case "previous":l.flexAnimate(l.getTarget("prev"),!0);break;default:"number"===typeof j&&l.flexAnimate(j,!0)}}})(jQuery);

function _vc_plugin_flexslider(){

    jQuery('.qfe_flexslider:not(".played")').each(function() {

        var this_element = jQuery(this);
        this_element.addClass("played");
        var sliderSpeed = 800,
            sliderTimeout = parseInt(this_element.attr('data-interval'))*1000,
            sliderFx = this_element.attr('data-flex_fx'),
            sliderShowDirection = this_element.attr('data-direction'),
            sliderShowBottomNav = this_element.attr('data-bottom_nav'),
            minItems = this_element.attr('data-per-view'),
            itemWidth = this_element.attr('data-itemWidth'),

            slideshow = true;
        var body_width = jQuery("body").width();
        var img =null;
        var maxwidth = 0;
        this_element.find('img').each(function(){
            if(jQuery(this).width()>maxwidth){
                maxwidth = jQuery(this).width();
                img = jQuery(this);
            }
        })

        if(maxwidth>body_width) {
            this_element.parent().parent().css("max-width","100%");
            this_element.parent().parent().css("max-height","auto");
        }else{
            this_element.parent().parent().css("max-width","auto");
            this_element.parent().parent().css("max-height","auto");
        }

        if ( sliderTimeout == 0 ) slideshow = false;
        if (sliderShowDirection == 0) sliderShowDirection= false;
        if (sliderShowBottomNav == 0) sliderShowBottomNav= false;

        this_element.flexslider({
            animation: sliderFx,
            slideshow: slideshow,
            slideshowSpeed: sliderTimeout,
            sliderSpeed: sliderSpeed,
            controlNav: sliderShowBottomNav,
            directionNav: sliderShowDirection,
            smoothHeight: true,
            minItems:minItems,
            itemWidth:itemWidth,
            after: function() {
                jQuery.waypoints('refresh');
                var curr = this_element.find('.flex-active-slide');

                if(curr.find("video").length>0){
                    if(curr.find("video[muted]").length>0){
                        curr.find(".product_play.product-video").click();
                    }else{
                        curr.find("video")[0].pause();
                        curr.find("video").hide();
                        curr.find("video").siblings().show();
                    }

                }
            }
        });
    });
}
;

