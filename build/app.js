(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hepeng/learning/js/angular-demo/app/app.js":[function(require,module,exports){
var $ = require('jquery');
var angular = require('angular');

require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-block-ui');
require('../public/templates');
var common = require('./common/common.module.js')
var config = require('./config');

angular.module('app', ['ui.bootstrap', 'ui.router', 'blockUI', common.name])



.config(config)
},{"../public/templates":"/Users/hepeng/learning/js/angular-demo/public/templates.js","./common/common.module.js":"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js","./config":"/Users/hepeng/learning/js/angular-demo/app/config.js","angular":"angular","angular-block-ui":"angular-block-ui","angular-ui-bootstrap":"angular-ui-bootstrap","angular-ui-router":"angular-ui-router","jquery":"jquery"}],"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js":[function(require,module,exports){
var appLayout = require('./components/layout/layout.js');
var contact = require('./components/contact/contact.js');
var home = require('./components/home/home.js');
require('ngCropper/dist/ngCropper.all.js');

module.exports = angular.module('app.common', ['ngCropper'])


.component('appLayout', appLayout)
.component('contact', contact)
.component('layHome', home)
},{"./components/contact/contact.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js","./components/home/home.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js","./components/layout/layout.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js","ngCropper/dist/ngCropper.all.js":"/Users/hepeng/learning/js/angular-demo/node_modules/ngCropper/dist/ngCropper.all.js"}],"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js":[function(require,module,exports){
function contactCtrl($scope, $timeout, Cropper) {
  var file, data;

  /**
   * Method is called every time file input's value changes.
   * Because of Angular has not ng-change for file inputs a hack is needed -
   * call `angular.element(this).scope().onFile(this.files[0])`
   * when input's event is fired.
   */
  $scope.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      $scope.dataUrl = dataUrl;
      $timeout(showCropper);  // wait for $digest to set image's src
    });
  };

  /**
   * Croppers container object should be created in controller's scope
   * for updates by directive via prototypal inheritance.
   * Pass a full proxy name to the `ng-cropper-proxy` directive attribute to
   * enable proxing.
   */
  $scope.cropper = {};
  $scope.cropperProxy = 'cropper.first';

  /**
   * When there is a cropped image to show encode it to base64 string and
   * use as a source for an image element.
   */
  $scope.preview = function() {
    if (!file || !data) return;
    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
    });
  };

  /**
   * Use cropper function proxy to call methods of the plugin.
   * See https://github.com/fengyuanchen/cropper#methods
   */
  $scope.clear = function(degrees) {
    if (!$scope.cropper.first) return;
    $scope.cropper.first('clear');
  };

  $scope.scale = function(width) {
    Cropper.crop(file, data)
      .then(function(blob) {
        return Cropper.scale(blob, {width: width});
      })
      .then(Cropper.encode).then(function(dataUrl) {
        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
      });
  }

  /**
   * Object is used to pass options to initalize a cropper.
   * More on options - https://github.com/fengyuanchen/cropper#options
   */
  $scope.options = {
    maximize: true,
    aspectRatio: 2 / 1,
    crop: function(dataNew) {
      data = dataNew;
    }
  };

  /**
   * Showing (initializing) and hiding (destroying) of a cropper are started by
   * events. The scope of the `ng-cropper` directive is derived from the scope of
   * the controller. When initializing the `ng-cropper` directive adds two handlers
   * listening to events passed by `ng-cropper-show` & `ng-cropper-hide` attributes.
   * To show or hide a cropper `$broadcast` a proper event.
   */
  $scope.showEvent = 'show';
  $scope.hideEvent = 'hide';

  function showCropper() { $scope.$broadcast($scope.showEvent); }
  function hideCropper() { $scope.$broadcast($scope.hideEvent); }
}


module.exports = {
  templateUrl: 'tpl/contact.html',
  controller: contactCtrl,
  controllerAs:'vm'
}
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.css":[function(require,module,exports){
module.exports = {"title":"_title_1tovz_1"}
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js":[function(require,module,exports){
var style = require('./home.css');

function homeCtrl($scope,$http) {
  var This = this;
  this.style = style;
  $http.get('v2/book/6548683').success(function(res){
    console.log(res)
  })

  this.searchBook = function() {
    $http.get('v2/book/search', {params: {q: this.keyword}}).success(function(res){
      This.list = res.books;
      This.total = res.total;
    });
  }
}


module.exports = {
  templateUrl: 'tpl/home.html',
  controller: homeCtrl,
  controllerAs:'vm'
}
},{"./home.css":"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.css"}],"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js":[function(require,module,exports){
function layoutCtrl($scope, $rootScope) {
//在这里可以替代run
  this.title = 'home';
  $rootScope.title = 'home';
  var This = this;
  $scope.$on('$stateChangeSuccess', function(e, to) {
    This.title = to.title;
    $rootScope.title = to.title;
  })
}


module.exports = {
  templateUrl: 'tpl/layout.html',
  controller: layoutCtrl,
  controllerAs:'vm'
}
},{}],"/Users/hepeng/learning/js/angular-demo/app/config.js":[function(require,module,exports){
function config($stateProvider, $locationProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('layout', {
    url:'/',
    template:'<lay-home/>',
    title:'主页',
  }).state('contact', {
    url:'/contact',
    template:'<contact/>',
    title:'联系我们'
  })
}

module.exports = config;
},{}],"/Users/hepeng/learning/js/angular-demo/node_modules/ngCropper/dist/ngCropper.all.js":[function(require,module,exports){
/*!
 * Cropper v0.10.0
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright (c) 2014-2015 Fengyuan Chen and other contributors
 * Released under the MIT license
 *
 * Date: 2015-06-08T14:57:26.353Z
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var $window = $(window),
      $document = $(document),
      location = window.location,

      // Constants
      CROPPER_NAMESPACE = '.cropper',
      CROPPER_PREVIEW = 'preview' + CROPPER_NAMESPACE,

      // RegExps
      REGEXP_DRAG_TYPES = /^(e|n|w|s|ne|nw|sw|se|all|crop|move|zoom)$/,

      // Classes
      CLASS_MODAL = 'cropper-modal',
      CLASS_HIDE = 'cropper-hide',
      CLASS_HIDDEN = 'cropper-hidden',
      CLASS_INVISIBLE = 'cropper-invisible',
      CLASS_MOVE = 'cropper-move',
      CLASS_CROP = 'cropper-crop',
      CLASS_DISABLED = 'cropper-disabled',
      CLASS_BG = 'cropper-bg',

      // Events
      EVENT_MOUSE_DOWN = 'mousedown touchstart',
      EVENT_MOUSE_MOVE = 'mousemove touchmove',
      EVENT_MOUSE_UP = 'mouseup mouseleave touchend touchleave touchcancel',
      EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll',
      EVENT_DBLCLICK = 'dblclick',
      EVENT_RESIZE = 'resize' + CROPPER_NAMESPACE, // Bind to window with namespace
      EVENT_BUILD = 'build' + CROPPER_NAMESPACE,
      EVENT_BUILT = 'built' + CROPPER_NAMESPACE,
      EVENT_DRAG_START = 'dragstart' + CROPPER_NAMESPACE,
      EVENT_DRAG_MOVE = 'dragmove' + CROPPER_NAMESPACE,
      EVENT_DRAG_END = 'dragend' + CROPPER_NAMESPACE,
      EVENT_ZOOM_IN = 'zoomin' + CROPPER_NAMESPACE,
      EVENT_ZOOM_OUT = 'zoomout' + CROPPER_NAMESPACE,
      EVENT_CHANGE = 'change' + CROPPER_NAMESPACE,

      // Supports
      SUPPORT_CANVAS = $.isFunction($('<canvas>')[0].getContext),

      // Others
      sqrt = Math.sqrt,
      min = Math.min,
      max = Math.max,
      abs = Math.abs,
      sin = Math.sin,
      cos = Math.cos,
      num = parseFloat,

      // Prototype
      prototype = {};

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  function isUndefined(n) {
    return typeof n === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    if (isNumber(offset)) { // It's necessary for IE8
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  // Custom proxy to avoid jQuery's guid
  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function isCrossOriginURL(url) {
    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

    return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
  }

  function addTimestamp(url) {
    var timestamp = 'timestamp=' + (new Date()).getTime();

    return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
  }

  function getRotateValue(degree) {
    return degree ? 'rotate(' + degree + 'deg)' : 'none';
  }

  function getRotatedSizes(data, reverse) {
    var deg = abs(data.degree) % 180,
        arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180,
        sinArc = sin(arc),
        cosArc = cos(arc),
        width = data.width,
        height = data.height,
        aspectRatio = data.aspectRatio,
        newWidth,
        newHeight;

    if (!reverse) {
      newWidth = width * cosArc + height * sinArc;
      newHeight = width * sinArc + height * cosArc;
    } else {
      newWidth = width / (cosArc + sinArc / aspectRatio);
      newHeight = newWidth / aspectRatio;
    }

    return {
      width: newWidth,
      height: newHeight
    };
  }

  function getSourceCanvas(image, data) {
    var canvas = $('<canvas>')[0],
        context = canvas.getContext('2d'),
        width = data.naturalWidth,
        height = data.naturalHeight,
        rotate = data.rotate,
        rotated = getRotatedSizes({
          width: width,
          height: height,
          degree: rotate
        });

    if (rotate) {
      canvas.width = rotated.width;
      canvas.height = rotated.height;
      context.save();
      context.translate(rotated.width / 2, rotated.height / 2);
      context.rotate(rotate * Math.PI / 180);
      context.drawImage(image, -width / 2, -height / 2, width, height);
      context.restore();
    } else {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
    }

    return canvas;
  }

  function Cropper(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Cropper.DEFAULTS, $.isPlainObject(options) && options);

    this.ready = false;
    this.built = false;
    this.rotated = false;
    this.cropped = false;
    this.disabled = false;
    this.canvas = null;
    this.cropBox = null;

    this.load();
  }

  prototype.load = function (url) {
    var options = this.options,
        $this = this.$element,
        crossOrigin,
        bustCacheUrl,
        buildEvent,
        $clone;

    if (!url) {
      if ($this.is('img')) {
        if (!$this.attr('src')) {
          return;
        }

        url = $this.prop('src');
      } else if ($this.is('canvas') && SUPPORT_CANVAS) {
        url = $this[0].toDataURL();
      }
    }

    if (!url) {
      return;
    }

    buildEvent = $.Event(EVENT_BUILD);

    if($this.one(EVENT_BUILD, options.build).trigger){
      $this.one(EVENT_BUILD, options.build).trigger(buildEvent); // Only trigger once
    }

    if (buildEvent.isDefaultPrevented()) {
      return;
    }

    if (options.checkImageOrigin && isCrossOriginURL(url)) {
      crossOrigin = ' crossOrigin="anonymous"';

      if (!$this.prop('crossOrigin')) { // Only when there was not a "crossOrigin" property
        bustCacheUrl = addTimestamp(url); // Bust cache (#148)
      }
    }

    // IE8 compatibility: Don't use "$().attr()" to set "src"
    this.$clone = $clone = $('<img' + (crossOrigin || '') + ' src="' + (bustCacheUrl || url) + '">');

    $clone.one('load', $.proxy(function () {
      var image = $clone[0],
          naturalWidth = image.naturalWidth || image.width,
          naturalHeight = image.naturalHeight || image.height; // $clone.width() and $clone.height() will return 0 in IE8 (#319)

      this.image = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
        rotate: 0
      };

      this.url = url;
      this.ready = true;
      this.build();
    }, this)).one('error', function () {
      $clone.remove();
    });

    // Hide and insert into the document
    $clone.addClass(CLASS_HIDE).insertAfter($this);
  };

  prototype.build = function () {
    var $this = this.$element,
        $clone = this.$clone,
        options = this.options,
        $cropper,
        $cropBox,
        $face;

    if (!this.ready) {
      return;
    }

    if (this.built) {
      this.unbuild();
    }

    // Create cropper elements
    this.$cropper = $cropper = $(Cropper.TEMPLATE);

    // Hide the original image
    $this.addClass(CLASS_HIDDEN);

    // Show the clone iamge
    $clone.removeClass(CLASS_HIDE);

    this.$container = $this.parent().append($cropper);
    this.$canvas = $cropper.find('.cropper-canvas').append($clone);
    this.$dragBox = $cropper.find('.cropper-drag-box');
    this.$cropBox = $cropBox = $cropper.find('.cropper-crop-box');
    this.$viewBox = $cropper.find('.cropper-view-box');
    this.$face = $face = $cropBox.find('.cropper-face');

    this.addListeners();
    this.initPreview();

    // Format aspect ratio
    options.aspectRatio = num(options.aspectRatio) || NaN; // 0 -> NaN

    if (options.autoCrop) {
      this.cropped = true;

      if (options.modal) {
        this.$dragBox.addClass(CLASS_MODAL);
      }
    } else {
      $cropBox.addClass(CLASS_HIDDEN);
    }

    if (options.background) {
      $cropper.addClass(CLASS_BG);
    }

    if (!options.highlight) {
      $face.addClass(CLASS_INVISIBLE);
    }

    if (!options.guides) {
      $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
    }

    if (options.cropBoxMovable) {
      $face.addClass(CLASS_MOVE).data('drag', 'all');
    }

    if (!options.cropBoxResizable) {
      $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
    }

    this.setDragMode(options.dragCrop ? 'crop' : options.movable ? 'move' : 'none');

    this.built = true;
    this.render();
    this.setData(options.data);
    if($this.one(EVENT_BUILT, options.built).trigger){
      $this.one(EVENT_BUILT, options.built).trigger(EVENT_BUILT); // Only trigger once
    }
  };

  prototype.unbuild = function () {
    if (!this.built) {
      return;
    }

    this.built = false;
    this.initialImage = null;
    this.initialCanvas = null; // This is necessary when replace
    this.initialCropBox = null;
    this.container = null;
    this.canvas = null;
    this.cropBox = null; // This is necessary when replace
    this.removeListeners();

    this.resetPreview();
    this.$preview = null;

    this.$viewBox = null;
    this.$cropBox = null;
    this.$dragBox = null;
    this.$canvas = null;
    this.$container = null;

    this.$cropper.remove();
    this.$cropper = null;
  };

  $.extend(prototype, {
    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();

      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    initContainer: function () {
      var $this = this.$element,
          $container = this.$container,
          $cropper = this.$cropper,
          options = this.options;

      $cropper.addClass(CLASS_HIDDEN);
      $this.removeClass(CLASS_HIDDEN);

      $cropper.css((this.container = {
        width: max($container.width(), num(options.minContainerWidth) || 200),
        height: max($container.height(), num(options.minContainerHeight) || 100)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    // image box (wrapper)
    initCanvas: function () {
      var container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          image = this.image,
          aspectRatio = image.aspectRatio,
          canvas = {
            aspectRatio: aspectRatio,
            width: containerWidth,
            height: containerHeight
          };

      if (containerHeight * aspectRatio > containerWidth) {
        canvas.height = containerWidth / aspectRatio;
      } else {
        canvas.width = containerHeight * aspectRatio;
      }

      canvas.oldLeft = canvas.left = (containerWidth - canvas.width) / 2;
      canvas.oldTop = canvas.top = (containerHeight - canvas.height) / 2;

      this.canvas = canvas;
      this.limitCanvas(true, true);
      this.initialImage = $.extend({}, image);
      this.initialCanvas = $.extend({}, canvas);
    },

    limitCanvas: function (size, position) {
      var options = this.options,
          strict = options.strict,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          canvas = this.canvas,
          aspectRatio = canvas.aspectRatio,
          cropBox = this.cropBox,
          cropped = this.cropped && cropBox,
          initialCanvas = this.initialCanvas || canvas,
          initialCanvasWidth = initialCanvas.width,
          initialCanvasHeight = initialCanvas.height,
          minCanvasWidth,
          minCanvasHeight;

      if (size) {
        minCanvasWidth = num(options.minCanvasWidth) || 0;
        minCanvasHeight = num(options.minCanvasHeight) || 0;

        if (minCanvasWidth) {
          if (strict) {
            minCanvasWidth = max(cropped ? cropBox.width : initialCanvasWidth, minCanvasWidth);
          }

          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else if (minCanvasHeight) {
          if (strict) {
            minCanvasHeight = max(cropped ? cropBox.height : initialCanvasHeight, minCanvasHeight);
          }

          minCanvasWidth = minCanvasHeight * aspectRatio;
        } else if (strict) {
          if (cropped) {
            minCanvasWidth = cropBox.width;
            minCanvasHeight = cropBox.height;

            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          } else {
            minCanvasWidth = initialCanvasWidth;
            minCanvasHeight = initialCanvasHeight;
          }
        }

        $.extend(canvas, {
          minWidth: minCanvasWidth,
          minHeight: minCanvasHeight,
          maxWidth: Infinity,
          maxHeight: Infinity
        });
      }

      if (position) {
        if (strict) {
          if (cropped) {
            canvas.minLeft = min(cropBox.left, (cropBox.left + cropBox.width) - canvas.width);
            canvas.minTop = min(cropBox.top, (cropBox.top + cropBox.height) - canvas.height);
            canvas.maxLeft = cropBox.left;
            canvas.maxTop = cropBox.top;
          } else {
            canvas.minLeft = min(0, containerWidth - canvas.width);
            canvas.minTop = min(0, containerHeight - canvas.height);
            canvas.maxLeft = max(0, containerWidth - canvas.width);
            canvas.maxTop = max(0, containerHeight - canvas.height);
          }
        } else {
          canvas.minLeft = -canvas.width;
          canvas.minTop = -canvas.height;
          canvas.maxLeft = containerWidth;
          canvas.maxTop = containerHeight;
        }
      }
    },

    renderCanvas: function (changed) {
      var options = this.options,
          canvas = this.canvas,
          image = this.image,
          aspectRatio,
          rotated;

      if (this.rotated) {
        this.rotated = false;

        // Computes rotatation sizes with image sizes
        rotated = getRotatedSizes({
          width: image.width,
          height: image.height,
          degree: image.rotate
        });

        aspectRatio = rotated.width / rotated.height;

        if (aspectRatio !== canvas.aspectRatio) {
          canvas.left -= (rotated.width - canvas.width) / 2;
          canvas.top -= (rotated.height - canvas.height) / 2;
          canvas.width = rotated.width;
          canvas.height = rotated.height;
          canvas.aspectRatio = aspectRatio;
          this.limitCanvas(true, false);
        }
      }

      if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
        canvas.left = canvas.oldLeft;
      }

      if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
        canvas.top = canvas.oldTop;
      }

      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

      this.limitCanvas(false, true);

      canvas.oldLeft = canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
      canvas.oldTop = canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

      this.$canvas.css({
        width: canvas.width,
        height: canvas.height,
        left: canvas.left,
        top: canvas.top
      });

      this.renderImage();

      if (this.cropped && options.strict) {
        this.limitCropBox(true, true);
      }

      if (changed) {
        this.output();
      }
    },

    renderImage: function () {
      var canvas = this.canvas,
          image = this.image,
          reversed;

      if (image.rotate) {
        reversed = getRotatedSizes({
          width: canvas.width,
          height: canvas.height,
          degree: image.rotate,
          aspectRatio: image.aspectRatio
        }, true);
      }

      $.extend(image, reversed ? {
        width: reversed.width,
        height: reversed.height,
        left: (canvas.width - reversed.width) / 2,
        top: (canvas.height - reversed.height) / 2
      } : {
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0
      });

      this.$clone.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getRotateValue(image.rotate)
      });
    },

    initCropBox: function () {
      var options = this.options,
          canvas = this.canvas,
          aspectRatio = options.aspectRatio,
          autoCropArea = num(options.autoCropArea) || 0.8,
          cropBox = {
            width: canvas.width,
            height: canvas.height
          };

      if (aspectRatio) {
        if (canvas.height * aspectRatio > canvas.width) {
          cropBox.height = cropBox.width / aspectRatio;
        } else {
          cropBox.width = cropBox.height * aspectRatio;
        }
      }

      this.cropBox = cropBox;
      this.limitCropBox(true, true);

      // Initialize auto crop area
      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      // The width of auto crop area must large than "minWidth", and the height too. (#164)
      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
      cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
      cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;

      this.initialCropBox = $.extend({}, cropBox);
    },

    limitCropBox: function (size, position) {
      var options = this.options,
          strict = options.strict,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          canvas = this.canvas,
          cropBox = this.cropBox,
          aspectRatio = options.aspectRatio,
          minCropBoxWidth,
          minCropBoxHeight;

      if (size) {
        minCropBoxWidth = num(options.minCropBoxWidth) || 0;
        minCropBoxHeight = num(options.minCropBoxHeight) || 0;

        // min/maxCropBoxWidth/Height must less than conatiner width/height
        cropBox.minWidth = min(containerWidth, minCropBoxWidth);
        cropBox.minHeight = min(containerHeight, minCropBoxHeight);
        cropBox.maxWidth = min(containerWidth, strict ? canvas.width : containerWidth);
        cropBox.maxHeight = min(containerHeight, strict ? canvas.height : containerHeight);

        if (aspectRatio) {
          // compare crop box size with container first
          if (cropBox.maxHeight * aspectRatio > cropBox.maxWidth) {
            cropBox.minHeight = cropBox.minWidth / aspectRatio;
            cropBox.maxHeight = cropBox.maxWidth / aspectRatio;
          } else {
            cropBox.minWidth = cropBox.minHeight * aspectRatio;
            cropBox.maxWidth = cropBox.maxHeight * aspectRatio;
          }
        }

        // The "minWidth" must be less than "maxWidth", and the "minHeight" too.
        cropBox.minWidth = min(cropBox.maxWidth, cropBox.minWidth);
        cropBox.minHeight = min(cropBox.maxHeight, cropBox.minHeight);
      }

      if (position) {
        if (strict) {
          cropBox.minLeft = max(0, canvas.left);
          cropBox.minTop = max(0, canvas.top);
          cropBox.maxLeft = min(containerWidth, canvas.left + canvas.width) - cropBox.width;
          cropBox.maxTop = min(containerHeight, canvas.top + canvas.height) - cropBox.height;
        } else {
          cropBox.minLeft = 0;
          cropBox.minTop = 0;
          cropBox.maxLeft = containerWidth - cropBox.width;
          cropBox.maxTop = containerHeight - cropBox.height;
        }
      }
    },

    renderCropBox: function () {
      var options = this.options,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          cropBox = this.cropBox;

      if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
        cropBox.left = cropBox.oldLeft;
      }

      if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
        cropBox.top = cropBox.oldTop;
      }

      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      this.limitCropBox(false, true);

      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
      cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

      if (options.movable && options.cropBoxMovable) {
        // Turn to move the canvas when the crop box is equal to the container
        this.$face.data('drag', (cropBox.width === containerWidth && cropBox.height === containerHeight) ? 'move' : 'all');
      }

      this.$cropBox.css({
        width: cropBox.width,
        height: cropBox.height,
        left: cropBox.left,
        top: cropBox.top
      });

      if (this.cropped && options.strict) {
        this.limitCanvas(true, true);
      }

      if (!this.disabled) {
        this.output();
      }
    },

    output: function () {
      var options = this.options,
          $this = this.$element;

      this.preview();

      if (options.crop) {
        options.crop.call($this, this.getData());
      }

      $this.trigger(EVENT_CHANGE);
    }
  });

  prototype.initPreview = function () {
    var url = this.url;

    this.$preview = $(this.options.preview);
    this.$viewBox.html('<img src="' + url + '">');

    // Override img element styles
    // Add `display:block` to avoid margin top issue (Occur only when margin-top <= -height)
    this.$preview.each(function () {
      var $this = $(this);

      $this.data(CROPPER_PREVIEW, {
        width: $this.width(),
        height: $this.height(),
        original: $this.html()
      }).html('<img src="' + url + '" style="display:block;width:100%;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation: 0deg!important">');
    });
  };

  prototype.resetPreview = function () {
    this.$preview.each(function () {
      var $this = $(this);

      $this.html($this.data(CROPPER_PREVIEW).original).removeData(CROPPER_PREVIEW);
    });
  };

  prototype.preview = function () {
    var image = this.image,
        canvas = this.canvas,
        cropBox = this.cropBox,
        width = image.width,
        height = image.height,
        left = cropBox.left - canvas.left - image.left,
        top = cropBox.top - canvas.top - image.top,
        rotate = image.rotate;

    if (!this.cropped || this.disabled) {
      return;
    }

    this.$viewBox.find('img').css({
      width: width,
      height: height,
      marginLeft: -left,
      marginTop: -top,
      transform: getRotateValue(rotate)
    });

    this.$preview.each(function () {
      var $this = $(this),
          data = $this.data(CROPPER_PREVIEW),
          ratio = data.width / cropBox.width,
          newWidth = data.width,
          newHeight = cropBox.height * ratio;

      if (newHeight > data.height) {
        ratio = data.height / cropBox.height;
        newWidth = cropBox.width * ratio;
        newHeight = data.height;
      }

      $this.width(newWidth).height(newHeight).find('img').css({
        width: width * ratio,
        height: height * ratio,
        marginLeft: -left * ratio,
        marginTop: -top * ratio,
        transform: getRotateValue(rotate)
      });
    });
  };

  prototype.addListeners = function () {
    var options = this.options,
        $this = this.$element,
        $cropper = this.$cropper;

    if ($.isFunction(options.dragstart)) {
      $this.on(EVENT_DRAG_START, options.dragstart);
    }

    if ($.isFunction(options.dragmove)) {
      $this.on(EVENT_DRAG_MOVE, options.dragmove);
    }

    if ($.isFunction(options.dragend)) {
      $this.on(EVENT_DRAG_END, options.dragend);
    }

    if ($.isFunction(options.zoomin)) {
      $this.on(EVENT_ZOOM_IN, options.zoomin);
    }

    if ($.isFunction(options.zoomout)) {
      $this.on(EVENT_ZOOM_OUT, options.zoomout);
    }

    if ($.isFunction(options.change)) {
      $this.on(EVENT_CHANGE, options.change);
    }

    $cropper.on(EVENT_MOUSE_DOWN, $.proxy(this.dragstart, this));

    if (options.zoomable && options.mouseWheelZoom) {
      $cropper.on(EVENT_WHEEL, $.proxy(this.wheel, this));
    }

    if (options.doubleClickToggle) {
      $cropper.on(EVENT_DBLCLICK, $.proxy(this.dblclick, this));
    }

    $document.on(EVENT_MOUSE_MOVE, (this._dragmove = proxy(this.dragmove, this))).on(EVENT_MOUSE_UP, (this._dragend = proxy(this.dragend, this)));

    if (options.responsive) {
      $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
    }
  };

  prototype.removeListeners = function () {
    var options = this.options,
        $this = this.$element,
        $cropper = this.$cropper;

    if ($.isFunction(options.dragstart)) {
      $this.off(EVENT_DRAG_START, options.dragstart);
    }

    if ($.isFunction(options.dragmove)) {
      $this.off(EVENT_DRAG_MOVE, options.dragmove);
    }

    if ($.isFunction(options.dragend)) {
      $this.off(EVENT_DRAG_END, options.dragend);
    }

    if ($.isFunction(options.zoomin)) {
      $this.off(EVENT_ZOOM_IN, options.zoomin);
    }

    if ($.isFunction(options.zoomout)) {
      $this.off(EVENT_ZOOM_OUT, options.zoomout);
    }

    if ($.isFunction(options.change)) {
      $this.off(EVENT_CHANGE, options.change);
    }

    $cropper.off(EVENT_MOUSE_DOWN, this.dragstart);

    if (options.zoomable && options.mouseWheelZoom) {
      $cropper.off(EVENT_WHEEL, this.wheel);
    }

    if (options.doubleClickToggle) {
      $cropper.off(EVENT_DBLCLICK, this.dblclick);
    }

    $document.off(EVENT_MOUSE_MOVE, this._dragmove).off(EVENT_MOUSE_UP, this._dragend);

    if (options.responsive) {
      $window.off(EVENT_RESIZE, this._resize);
    }
  };

  $.extend(prototype, {
    resize: function () {
      var $container = this.$container,
          container = this.container,
          canvasData,
          cropBoxData,
          ratio;

      if (this.disabled || !container) { // Check "container" for IE8
        return;
      }

      ratio = $container.width() / container.width;

      if (ratio !== 1 || $container.height() !== container.height) {
        canvasData = this.getCanvasData();
        cropBoxData = this.getCropBoxData();

        this.render();
        this.setCanvasData($.each(canvasData, function (i, n) {
          canvasData[i] = n * ratio;
        }));
        this.setCropBoxData($.each(cropBoxData, function (i, n) {
          cropBoxData[i] = n * ratio;
        }));
      }
    },

    dblclick: function () {
      if (this.disabled) {
        return;
      }

      if (this.$dragBox.hasClass(CLASS_CROP)) {
        this.setDragMode('move');
      } else {
        this.setDragMode('crop');
      }
    },

    wheel: function (event) {
      var e = event.originalEvent,
          delta = 1;

      if (this.disabled) {
        return;
      }

      event.preventDefault();

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * 0.1);
    },

    dragstart: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
          dragType,
          dragStartEvent,
          touchesLength;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            e = touches[1];
            this.startX2 = e.pageX;
            this.startY2 = e.pageY;
            dragType = 'zoom';
          } else {
            return;
          }
        }

        e = touches[0];
      }

      dragType = dragType || $(e.target).data('drag');

      if (REGEXP_DRAG_TYPES.test(dragType)) {
        event.preventDefault();

        dragStartEvent = $.Event(EVENT_DRAG_START, {
          originalEvent: originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragStartEvent);

        if (dragStartEvent.isDefaultPrevented()) {
          return;
        }

        this.dragType = dragType;
        this.cropping = false;
        this.startX = e.pageX;
        this.startY = e.pageY;

        if (dragType === 'crop') {
          this.cropping = true;
          this.$dragBox.addClass(CLASS_MODAL);
        }
      }
    },

    dragmove: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
          dragType = this.dragType,
          dragMoveEvent,
          touchesLength;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            e = touches[1];
            this.endX2 = e.pageX;
            this.endY2 = e.pageY;
          } else {
            return;
          }
        }

        e = touches[0];
      }

      if (dragType) {
        event.preventDefault();

        dragMoveEvent = $.Event(EVENT_DRAG_MOVE, {
          originalEvent: originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragMoveEvent);

        if (dragMoveEvent.isDefaultPrevented()) {
          return;
        }

        this.endX = e.pageX;
        this.endY = e.pageY;

        this.change(e.shiftKey);
      }
    },

    dragend: function (event) {
      var dragType = this.dragType,
          dragEndEvent;

      if (this.disabled) {
        return;
      }

      if (dragType) {
        event.preventDefault();

        dragEndEvent = $.Event(EVENT_DRAG_END, {
          originalEvent: event.originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragEndEvent);

        if (dragEndEvent.isDefaultPrevented()) {
          return;
        }

        if (this.cropping) {
          this.cropping = false;
          this.$dragBox.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
        }

        this.dragType = '';
      }
    }
  });

  $.extend(prototype, {
    crop: function () {
      if (!this.built || this.disabled) {
        return;
      }

      if (!this.cropped) {
        this.cropped = true;
        this.limitCropBox(true, true);

        if (this.options.modal) {
          this.$dragBox.addClass(CLASS_MODAL);
        }

        this.$cropBox.removeClass(CLASS_HIDDEN);
      }

      this.setCropBoxData(this.initialCropBox);
    },

    reset: function () {
      if (!this.built || this.disabled) {
        return;
      }

      this.image = $.extend({}, this.initialImage);
      this.canvas = $.extend({}, this.initialCanvas);
      this.cropBox = $.extend({}, this.initialCropBox); // required for strict mode

      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    clear: function () {
      if (!this.cropped || this.disabled) {
        return;
      }

      $.extend(this.cropBox, {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      });

      this.cropped = false;
      this.renderCropBox();

      this.limitCanvas();
      this.renderCanvas(); // Render canvas after render crop box

      this.$dragBox.removeClass(CLASS_MODAL);
      this.$cropBox.addClass(CLASS_HIDDEN);
    },

    destroy: function () {
      var $this = this.$element;

      if (this.ready) {
        this.unbuild();
        $this.removeClass(CLASS_HIDDEN);
      } else if (this.$clone) {
        this.$clone.remove();
      }

      $this.removeData('cropper');
    },

    replace: function (url) {
      if (!this.disabled && url) {
        this.options.data = null; // Remove previous data
        this.load(url);
      }
    },

    enable: function () {
      if (this.built) {
        this.disabled = false;
        this.$cropper.removeClass(CLASS_DISABLED);
      }
    },

    disable: function () {
      if (this.built) {
        this.disabled = true;
        this.$cropper.addClass(CLASS_DISABLED);
      }
    },

    move: function (offsetX, offsetY) {
      var canvas = this.canvas;

      if (this.built && !this.disabled && this.options.movable && isNumber(offsetX) && isNumber(offsetY)) {
        canvas.left += offsetX;
        canvas.top += offsetY;
        this.renderCanvas(true);
      }
    },

    zoom: function (delta) {
      var canvas = this.canvas,
          zoomEvent,
          width,
          height;

      delta = num(delta);

      if (delta && this.built && !this.disabled && this.options.zoomable) {
        zoomEvent = delta > 0 ? $.Event(EVENT_ZOOM_IN) : $.Event(EVENT_ZOOM_OUT);
        this.$element.trigger(zoomEvent);

        if (zoomEvent.isDefaultPrevented()) {
          return;
        }

        delta = delta <= -1 ? 1 / (1 - delta) : delta <= 1 ? (1 + delta) : delta;
        width = canvas.width * delta;
        height = canvas.height * delta;
        canvas.left -= (width - canvas.width) / 2;
        canvas.top -= (height - canvas.height) / 2;
        canvas.width = width;
        canvas.height = height;
        this.renderCanvas(true);
        this.setDragMode('move');
      }
    },

    rotate: function (degree) {
      var image = this.image;

      degree = num(degree);

      if (degree && this.built && !this.disabled && this.options.rotatable) {
        image.rotate = (image.rotate + degree) % 360;
        this.rotated = true;
        this.renderCanvas(true);
      }
    },

    getData: function (rounded) {
      var cropBox = this.cropBox,
          canvas = this.canvas,
          image = this.image,
          ratio,
          data;

      if (this.built && this.cropped) {
        data = {
          x: cropBox.left - canvas.left,
          y: cropBox.top - canvas.top,
          width: cropBox.width,
          height: cropBox.height
        };

        ratio = image.width / image.naturalWidth;

        $.each(data, function (i, n) {
          n = n / ratio;
          data[i] = rounded ? Math.round(n) : n;
        });

      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      data.rotate = this.ready ? image.rotate : 0;

      return data;
    },

    setData: function (data) {
      var image = this.image,
          canvas = this.canvas,
          cropBoxData = {},
          ratio;

      if (this.built && !this.disabled && $.isPlainObject(data)) {
        if (isNumber(data.rotate) && data.rotate !== image.rotate && this.options.rotatable) {
          image.rotate = data.rotate;
          this.rotated = true;
          this.renderCanvas(true);
        }

        ratio = image.width / image.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvas.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvas.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }
    },

    getContainerData: function () {
      return this.built ? this.container : {};
    },

    getImageData: function () {
      return this.ready ? this.image : {};
    },

    getCanvasData: function () {
      var canvas = this.canvas,
          data;

      if (this.built) {
        data = {
          left: canvas.left,
          top: canvas.top,
          width: canvas.width,
          height: canvas.height
        };
      }

      return data || {};
    },

    setCanvasData: function (data) {
      var canvas = this.canvas,
          aspectRatio = canvas.aspectRatio;

      if (this.built && !this.disabled && $.isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvas.left = data.left;
        }

        if (isNumber(data.top)) {
          canvas.top = data.top;
        }

        if (isNumber(data.width)) {
          canvas.width = data.width;
          canvas.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvas.height = data.height;
          canvas.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }
    },

    getCropBoxData: function () {
      var cropBox = this.cropBox,
          data;

      if (this.built && this.cropped) {
        data = {
          left: cropBox.left,
          top: cropBox.top,
          width: cropBox.width,
          height: cropBox.height
        };
      }

      return data || {};
    },

    setCropBoxData: function (data) {
      var cropBox = this.cropBox,
          aspectRatio = this.options.aspectRatio;

      if (this.built && this.cropped && !this.disabled && $.isPlainObject(data)) {

        if (isNumber(data.left)) {
          cropBox.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBox.top = data.top;
        }

        if (isNumber(data.width)) {
          cropBox.width = data.width;
        }

        if (isNumber(data.height)) {
          cropBox.height = data.height;
        }

        if (aspectRatio) {
          if (isNumber(data.width)) {
            cropBox.height = cropBox.width / aspectRatio;
          } else if (isNumber(data.height)) {
            cropBox.width = cropBox.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }
    },

    getCroppedCanvas: function (options) {
      var originalWidth,
          originalHeight,
          canvasWidth,
          canvasHeight,
          scaledWidth,
          scaledHeight,
          scaledRatio,
          aspectRatio,
          canvas,
          context,
          data;

      if (!this.built || !this.cropped || !SUPPORT_CANVAS) {
        return;
      }

      if (!$.isPlainObject(options)) {
        options = {};
      }

      data = this.getData();
      originalWidth = data.width;
      originalHeight = data.height;
      aspectRatio = originalWidth / originalHeight;

      if ($.isPlainObject(options)) {
        scaledWidth = options.width;
        scaledHeight = options.height;

        if (scaledWidth) {
          scaledHeight = scaledWidth / aspectRatio;
          scaledRatio = scaledWidth / originalWidth;
        } else if (scaledHeight) {
          scaledWidth = scaledHeight * aspectRatio;
          scaledRatio = scaledHeight / originalHeight;
        }
      }

      canvasWidth = scaledWidth || originalWidth;
      canvasHeight = scaledHeight || originalHeight;

      canvas = $('<canvas>')[0];
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context = canvas.getContext('2d');

      if (options.fillColor) {
        context.fillStyle = options.fillColor;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
      context.drawImage.apply(context, (function () {
        var source = getSourceCanvas(this.$clone[0], this.image),
            sourceWidth = source.width,
            sourceHeight = source.height,
            args = [source],
            srcX = data.x, // source canvas
            srcY = data.y,
            srcWidth,
            srcHeight,
            dstX, // destination canvas
            dstY,
            dstWidth,
            dstHeight;

        if (srcX <= -originalWidth || srcX > sourceWidth) {
          srcX = srcWidth = dstX = dstWidth = 0;
        } else if (srcX <= 0) {
          dstX = -srcX;
          srcX = 0;
          srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
        } else if (srcX <= sourceWidth) {
          dstX = 0;
          srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
        }

        if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
          srcY = srcHeight = dstY = dstHeight = 0;
        } else if (srcY <= 0) {
          dstY = -srcY;
          srcY = 0;
          srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
        } else if (srcY <= sourceHeight) {
          dstY = 0;
          srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
        }

        args.push(srcX, srcY, srcWidth, srcHeight);

        // Scale destination sizes
        if (scaledRatio) {
          dstX *= scaledRatio;
          dstY *= scaledRatio;
          dstWidth *= scaledRatio;
          dstHeight *= scaledRatio;
        }

        // Avoid "IndexSizeError" in IE and Firefox
        if (dstWidth > 0 && dstHeight > 0) {
          args.push(dstX, dstY, dstWidth, dstHeight);
        }

        return args;
      }).call(this));

      return canvas;
    },

    setAspectRatio: function (aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {
        options.aspectRatio = num(aspectRatio) || NaN; // 0 -> NaN

        if (this.built) {
          this.initCropBox();

          if (this.cropped) {
            this.renderCropBox();
          }
        }
      }
    },

    setDragMode: function (mode) {
      var options = this.options,
          croppable,
          movable;

      if (this.ready && !this.disabled) {
        croppable = options.dragCrop && mode === 'crop';
        movable = options.movable && mode === 'move';
        mode = (croppable || movable) ? mode : 'none';

        this.$dragBox.data('drag', mode).toggleClass(CLASS_CROP, croppable).toggleClass(CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {
          // Sync drag mode to crop box when it is not movable(#300)
          this.$face.data('drag', mode).toggleClass(CLASS_CROP, croppable).toggleClass(CLASS_MOVE, movable);
        }
      }
    }
  });

  prototype.change = function (shiftKey) {
    var dragType = this.dragType,
        options = this.options,
        canvas = this.canvas,
        container = this.container,
        cropBox = this.cropBox,
        width = cropBox.width,
        height = cropBox.height,
        left = cropBox.left,
        top = cropBox.top,
        right = left + width,
        bottom = top + height,
        minLeft = 0,
        minTop = 0,
        maxWidth = container.width,
        maxHeight = container.height,
        renderable = true,
        aspectRatio = options.aspectRatio,
        range = {
          x: this.endX - this.startX,
          y: this.endY - this.startY
        },
        offset;

    // Locking aspect ratio in "free mode" by holding shift key (#259)
    if (!aspectRatio && shiftKey) {
      aspectRatio = width && height ? width / height : 1;
    }

    if (options.strict) {
      minLeft = cropBox.minLeft;
      minTop = cropBox.minTop;
      maxWidth = minLeft + min(container.width, canvas.width);
      maxHeight = minTop + min(container.height, canvas.height);
    }

    if (aspectRatio) {
      range.X = range.y * aspectRatio;
      range.Y = range.x / aspectRatio;
    }

    switch (dragType) {
      // Move cropBox
      case 'all':
        left += range.x;
        top += range.y;
        break;

      // Resize cropBox
      case 'e':
        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top -= range.Y / 2;
        }

        if (width < 0) {
          dragType = 'w';
          width = 0;
        }

        break;

      case 'n':
        if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height -= range.y;
        top += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left += range.X / 2;
        }

        if (height < 0) {
          dragType = 's';
          height = 0;
        }

        break;

      case 'w':
        if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width -= range.x;
        left += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top += range.Y / 2;
        }

        if (width < 0) {
          dragType = 'e';
          width = 0;
        }

        break;

      case 's':
        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left -= range.X / 2;
        }

        if (height < 0) {
          dragType = 'n';
          height = 0;
        }

        break;

      case 'ne':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y <= 0 && top <= minTop) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y <= 0) {
            if (top > minTop) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'sw';
          height = 0;
          width = 0;
        } else if (width < 0) {
          dragType = 'nw';
          width = 0;
        } else if (height < 0) {
          dragType = 'se';
          height = 0;
        }

        break;

      case 'nw':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
          left += range.X;
        } else {
          if (range.x <= 0) {
            if (left > minLeft) {
              width -= range.x;
              left += range.x;
            } else if (range.y <= 0 && top <= minTop) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y <= 0) {
            if (top > minTop) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'se';
          height = 0;
          width = 0;
        } else if (width < 0) {
          dragType = 'ne';
          width = 0;
        } else if (height < 0) {
          dragType = 'sw';
          height = 0;
        }

        break;

      case 'sw':
        if (aspectRatio) {
          if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x <= 0) {
            if (left > minLeft) {
              width -= range.x;
              left += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'ne';
          height = 0;
          width = 0;
        } else if (width < 0) {
          dragType = 'se';
          width = 0;
        } else if (height < 0) {
          dragType = 'nw';
          height = 0;
        }

        break;

      case 'se':
        if (aspectRatio) {
          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          dragType = 'nw';
          height = 0;
          width = 0;
        } else if (width < 0) {
          dragType = 'sw';
          width = 0;
        } else if (height < 0) {
          dragType = 'ne';
          height = 0;
        }

        break;

      // Move image
      case 'move':
        canvas.left += range.x;
        canvas.top += range.y;
        this.renderCanvas(true);
        renderable = false;
        break;

      // Scale image
      case 'zoom':
        this.zoom(function (x1, y1, x2, y2) {
          var z1 = sqrt(x1 * x1 + y1 * y1),
              z2 = sqrt(x2 * x2 + y2 * y2);

          return (z2 - z1) / z1;
        }(
          abs(this.startX - this.startX2),
          abs(this.startY - this.startY2),
          abs(this.endX - this.endX2),
          abs(this.endY - this.endY2)
        ));

        this.startX2 = this.endX2;
        this.startY2 = this.endY2;
        renderable = false;
        break;

      // Crop image
      case 'crop':
        if (range.x && range.y) {
          offset = this.$cropper.offset();
          left = this.startX - offset.left;
          top = this.startY - offset.top;
          width = cropBox.minWidth;
          height = cropBox.minHeight;

          if (range.x > 0) {
            if (range.y > 0) {
              dragType = 'se';
            } else {
              dragType = 'ne';
              top -= height;
            }
          } else {
            if (range.y > 0) {
              dragType = 'sw';
              left -= width;
            } else {
              dragType = 'nw';
              left -= width;
              top -= height;
            }
          }

          // Show the cropBox if is hidden
          if (!this.cropped) {
            this.cropped = true;
            this.$cropBox.removeClass(CLASS_HIDDEN);
          }
        }

        break;

      // No default
    }

    if (renderable) {
      cropBox.width = width;
      cropBox.height = height;
      cropBox.left = left;
      cropBox.top = top;
      this.dragType = dragType;

      this.renderCropBox();
    }

    // Override
    this.startX = this.endX;
    this.startY = this.endY;
  };

  $.extend(Cropper.prototype, prototype);

  Cropper.DEFAULTS = {
    // Defines the aspect ratio of the crop box
    // Type: Number
    aspectRatio: NaN,

    // Defines the percentage of automatic cropping area when initializes
    // Type: Number (Must large than 0 and less than 1)
    autoCropArea: 0.8, // 80%

    // Outputs the cropping results.
    // Type: Function
    crop: null,

    // Previous/latest crop data
    // Type: Object
    data: null,

    // Add extra containers for previewing
    // Type: String (jQuery selector)
    preview: '',

    // Toggles
    strict: true, // strict mode, the image cannot zoom out less than the container
    responsive: true, // Rebuild when resize the window
    checkImageOrigin: true, // Check if the target image is cross origin

    modal: true, // Show the black modal
    guides: true, // Show the dashed lines for guiding
    highlight: true, // Show the white modal to highlight the crop box
    background: true, // Show the grid background

    autoCrop: true, // Enable to crop the image automatically when initialize
    dragCrop: true, // Enable to create new crop box by dragging over the image
    movable: true, // Enable to move the image
    rotatable: true, // Enable to rotate the image
    zoomable: true, // Enable to zoom the image
    touchDragZoom: true, // Enable to zoom the image by wheeling mouse
    mouseWheelZoom: true, // Enable to zoom the image by dragging touch
    cropBoxMovable: true, // Enable to move the crop box
    cropBoxResizable: true, // Enable to resize the crop box
    doubleClickToggle: true, // Toggle drag mode between "crop" and "move" when double click on the cropper

    // Dimensions
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,

    // Events
    build: null, // Function
    built: null, // Function
    dragstart: null, // Function
    dragmove: null, // Function
    dragend: null, // Function
    zoomin: null, // Function
    zoomout: null, // Function
    change: null // Function
  };

  Cropper.setDefaults = function (options) {
    $.extend(Cropper.DEFAULTS, options);
  };

  // Use the string compressor: Strmin (https://github.com/fengyuanchen/strmin)
  Cropper.TEMPLATE = (function (source, words) {
    words = words.split(',');
    return source.replace(/\d+/g, function (i) {
      return words[i];
    });
  })('<0 6="5-container"><0 6="5-canvas"></0><0 6="5-2-9"></0><0 6="5-crop-9"><1 6="5-view-9"></1><1 6="5-8 8-h"></1><1 6="5-8 8-v"></1><1 6="5-face"></1><1 6="5-7 7-e" 3-2="e"></1><1 6="5-7 7-n" 3-2="n"></1><1 6="5-7 7-w" 3-2="w"></1><1 6="5-7 7-s" 3-2="s"></1><1 6="5-4 4-e" 3-2="e"></1><1 6="5-4 4-n" 3-2="n"></1><1 6="5-4 4-w" 3-2="w"></1><1 6="5-4 4-s" 3-2="s"></1><1 6="5-4 4-ne" 3-2="ne"></1><1 6="5-4 4-nw" 3-2="nw"></1><1 6="5-4 4-sw" 3-2="sw"></1><1 6="5-4 4-se" 3-2="se"></1></0></0>', 'div,span,drag,data,point,cropper,class,line,dashed,box');

  /* Template source:
  <div class="cropper-container">
    <div class="cropper-canvas"></div>
    <div class="cropper-drag-box"></div>
    <div class="cropper-crop-box">
      <span class="cropper-view-box"></span>
      <span class="cropper-dashed dashed-h"></span>
      <span class="cropper-dashed dashed-v"></span>
      <span class="cropper-face"></span>
      <span class="cropper-line line-e" data-drag="e"></span>
      <span class="cropper-line line-n" data-drag="n"></span>
      <span class="cropper-line line-w" data-drag="w"></span>
      <span class="cropper-line line-s" data-drag="s"></span>
      <span class="cropper-point point-e" data-drag="e"></span>
      <span class="cropper-point point-n" data-drag="n"></span>
      <span class="cropper-point point-w" data-drag="w"></span>
      <span class="cropper-point point-s" data-drag="s"></span>
      <span class="cropper-point point-ne" data-drag="ne"></span>
      <span class="cropper-point point-nw" data-drag="nw"></span>
      <span class="cropper-point point-sw" data-drag="sw"></span>
      <span class="cropper-point point-se" data-drag="se"></span>
    </div>
  </div>
  */

  // Save the other cropper
  Cropper.other = $.fn.cropper;

  // Register as jQuery plugin
  $.fn.cropper = function (options) {
    var args = toArray(arguments, 1),
        result;

    this.each(function () {
      var $this = $(this),
          data = $this.data('cropper'),
          fn;

      if (!data) {
        $this.data('cropper', (data = new Cropper(this, options)));
      }

      if (typeof options === 'string' && $.isFunction((fn = data[options]))) {
        result = fn.apply(data, args);
      }
    });

    return isUndefined(result) ? this : result;
  };

  $.fn.cropper.Constructor = Cropper;
  $.fn.cropper.setDefaults = Cropper.setDefaults;

  // No conflict
  $.fn.cropper.noConflict = function () {
    $.fn.cropper = Cropper.other;
    return this;
  };

});
(function() {
'use strict';

angular.module('ngCropper', ['ng'])
.directive('ngCropper', ['$q', '$parse', function($q, $parse) {
  return {
    restrict: 'A',
    scope: {
      options: '=ngCropperOptions',
      proxy: '=ngCropperProxy', // Optional.
      showEvent: '=ngCropperShow',
      hideEvent: '=ngCropperHide'
    },
    link: function(scope, element, atts) {
      var shown = false;

      scope.$on(scope.showEvent, function() {
        if (shown) return;
        shown = true;

        preprocess(scope.options, element[0])
          .then(function(options) {
            setProxy(element);
            element.cropper(options);
          })
      });

      function setProxy(element) {
        if (!scope.proxy) return;
        var setter = $parse(scope.proxy).assign;
        setter(scope.$parent, element.cropper.bind(element));
      }

      scope.$on(scope.hideEvent, function() {
        if (!shown) return;
        shown = false;
        element.cropper('destroy');
      });

      scope.$watch('options.disabled', function(disabled) {
        if (!shown) return;
        if (disabled) element.cropper('disable');
        if (!disabled) element.cropper('enable');
      });
    }
  };

  function preprocess(options, img) {
    options = options || {};
    var result = $q.when(options); // No changes.
    if (options.maximize) {
      result = maximizeSelection(options, img);
    }
    return result;
  }

  /**
   * Change options to make selection maximum for the image.
   * fengyuanchen/cropper calculates valid selection's height & width
   * with respect to `aspectRatio`.
   */
  function maximizeSelection(options, img) {
    return getRealSize(img).then(function(size) {
      options.data = size;
      return options;
    });
  }

  /**
   * Returns real image size (without changes by css, attributes).
   */
  function getRealSize(img) {
    var defer = $q.defer();
    var size = {height: null, width: null};
    var image = new Image();

    image.onload = function() {
      defer.resolve({width: image.width, height: image.height});
    }

    image.src = img.src;
    return defer.promise;
  }
}])
.service('Cropper', ['$q', function($q) {

  this.encode = function(blob) {
    var defer = $q.defer();
    var reader = new FileReader();
    reader.onload = function(e) {
      defer.resolve(e.target.result);
    };
    reader.readAsDataURL(blob);
    return defer.promise;
  };

  this.decode = function(dataUrl) {
    var meta = dataUrl.split(';')[0];
    var type = meta.split(':')[1];
    var binary = atob(dataUrl.split(',')[1]);
    var array = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], {type: type});
  };

  this.crop = function(file, data) {
    var _decodeBlob = this.decode;
    return this.encode(file).then(_createImage).then(function(image) {
      var canvas = createCanvas(data);
      var context = canvas.getContext('2d');

      context.drawImage(image, data.x, data.y, data.width, data.height, 0, 0, data.width, data.height);

      var encoded = canvas.toDataURL(file.type);
      removeElement(canvas);

      return _decodeBlob(encoded);
    });
  };

  this.scale = function(file, data) {
    var _decodeBlob = this.decode;
    return this.encode(file).then(_createImage).then(function(image) {
      var heightOrig = image.height;
      var widthOrig = image.width;
      var ratio, height, width;

      if (angular.isNumber(data)) {
        ratio = data;
        height = heightOrig * ratio;
        width = widthOrig * ratio;
      }

      if (angular.isObject(data)) {
        ratio = widthOrig / heightOrig;
        height = data.height;
        width = data.width;

        if (height && !width)
          width = height * ratio;
        else if (width && !height)
          height = width / ratio;
      }

      var canvas = createCanvas(data);
      var context = canvas.getContext('2d');

      canvas.height = height;
      canvas.width = width;

      context.drawImage(image, 0, 0, widthOrig, heightOrig, 0, 0, width, height);

      var encoded = canvas.toDataURL(file.type);
      removeElement(canvas);

      return _decodeBlob(encoded);
    });
  };


  function _createImage(source) {
    var defer = $q.defer();
    var image = new Image();
    image.onload = function(e) { defer.resolve(e.target); };
    image.src = source;
    return defer.promise;
  }

  function createCanvas(data) {
    var canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    return canvas;
  }

  function removeElement(el) {
    el.parentElement.removeChild(el);
  }

}]);

})();

},{"jquery":"jquery"}],"/Users/hepeng/learning/js/angular-demo/public/templates.js":[function(require,module,exports){
angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('contact.html','<section>\n    <input type="file" onchange="angular.element(this).scope().onFile(this.files[0])">\n    <button ng-click="preview()">Show preview</button>\n    <button ng-click="scale(200)">Scale to 200px width</button>\n    <button ng-click="clear()">Clear selection</button>\n    <label>Disabled <input type="checkbox" ng-model="options.disabled"></label>\n\n    <br />\n\n    <div ng-if="dataUrl" class="img-container">\n      <img ng-if="dataUrl" ng-src="{{dataUrl}}" width="800"\n           ng-cropper\n           ng-cropper-proxy="cropperProxy"\n           ng-cropper-show="showEvent"\n           ng-cropper-hide="hideEvent"\n           ng-cropper-options="options">\n    </div>\n\n    <div class="preview-container">\n      <img ng-if="preview.dataUrl" ng-src="{{preview.dataUrl}}">\n    </div>\n</section>');
$templateCache.put('home.html','<section>\n  <div class="text-center figure">\n    <from class="form-inline">\n      <input type="" class="form-control" ng-model="vm.keyword">\n      <button class="btn btn-success {{vm.style.title}}" ng-click="vm.searchBook();">\u641C\u7D22\u56FE\u4E66</button>\n    </from>\n  </div>\n  <div>\n    <div class="row" ng-repeat="item in vm.list">\n      <div class="col-xs-2 text-center">\n        <img ng-src="{{item.image}}">\n      </div>\n      <div class="col-xs-10">\n        <h2>{{item.title}}</h2>\n        <h3>{{item.author}}</h3>\n        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.summary}}</p>\n      </div>\n      <hr>\n    </div>\n  </div>\n</section>');
$templateCache.put('index.html','<!DOCTYPE html>\n<html lang="zh-CN">\n\n<head>\n  <meta charset="UTF-8">\n  <title>GetUserMedia\u5B9E\u4F8B</title>\n</head>\n\n<body>\n  <video id="video" autoplay controls="">\n    <ideo>\n</body>\n<script type="text/javascript">\n// var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);\nnavigator.getUserMedia({\n  video: true,\n  audio: true\n}, function(localMediaStream) {\n  var video = document.getElementById(\'video\');\n  video.src = window.URL.createObjectURL(localMediaStream);\n  video.onloadedmetadata = function(e) {\n    console.log("Label: " + localMediaStream.label);\n    console.log("AudioTracks", localMediaStream.getAudioTracks());\n    console.log("VideoTracks", localMediaStream.getVideoTracks());\n  };\n}, function(e) {\n  console.log(\'Reeeejected!\', e);\n});\n</script>\n<html>\n');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);
},{}]},{},["/Users/hepeng/learning/js/angular-demo/app/app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL2NvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9ob21lL2hvbWUuY3NzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmpzIiwiYXBwL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9uZ0Nyb3BwZXIvZGlzdC9uZ0Nyb3BwZXIuYWxsLmpzIiwicHVibGljL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxdUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxucmVxdWlyZSgnYW5ndWxhci11aS1ib290c3RyYXAnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItdWktcm91dGVyJyk7XG5yZXF1aXJlKCdhbmd1bGFyLWJsb2NrLXVpJyk7XG5yZXF1aXJlKCcuLi9wdWJsaWMvdGVtcGxhdGVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24vY29tbW9uLm1vZHVsZS5qcycpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkuYm9vdHN0cmFwJywgJ3VpLnJvdXRlcicsICdibG9ja1VJJywgY29tbW9uLm5hbWVdKVxuXG5cblxuLmNvbmZpZyhjb25maWcpIiwidmFyIGFwcExheW91dCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmpzJyk7XG52YXIgY29udGFjdCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb250YWN0L2NvbnRhY3QuanMnKTtcbnZhciBob21lID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2hvbWUvaG9tZS5qcycpO1xucmVxdWlyZSgnbmdDcm9wcGVyL2Rpc3QvbmdDcm9wcGVyLmFsbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuY29tbW9uJywgWyduZ0Nyb3BwZXInXSlcblxuXG4uY29tcG9uZW50KCdhcHBMYXlvdXQnLCBhcHBMYXlvdXQpXG4uY29tcG9uZW50KCdjb250YWN0JywgY29udGFjdClcbi5jb21wb25lbnQoJ2xheUhvbWUnLCBob21lKSIsImZ1bmN0aW9uIGNvbnRhY3RDdHJsKCRzY29wZSwgJHRpbWVvdXQsIENyb3BwZXIpIHtcbiAgdmFyIGZpbGUsIGRhdGE7XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBpcyBjYWxsZWQgZXZlcnkgdGltZSBmaWxlIGlucHV0J3MgdmFsdWUgY2hhbmdlcy5cbiAgICogQmVjYXVzZSBvZiBBbmd1bGFyIGhhcyBub3QgbmctY2hhbmdlIGZvciBmaWxlIGlucHV0cyBhIGhhY2sgaXMgbmVlZGVkIC1cbiAgICogY2FsbCBgYW5ndWxhci5lbGVtZW50KHRoaXMpLnNjb3BlKCkub25GaWxlKHRoaXMuZmlsZXNbMF0pYFxuICAgKiB3aGVuIGlucHV0J3MgZXZlbnQgaXMgZmlyZWQuXG4gICAqL1xuICAkc2NvcGUub25GaWxlID0gZnVuY3Rpb24oYmxvYikge1xuICAgIENyb3BwZXIuZW5jb2RlKChmaWxlID0gYmxvYikpLnRoZW4oZnVuY3Rpb24oZGF0YVVybCkge1xuICAgICAgJHNjb3BlLmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgICAgJHRpbWVvdXQoc2hvd0Nyb3BwZXIpOyAgLy8gd2FpdCBmb3IgJGRpZ2VzdCB0byBzZXQgaW1hZ2UncyBzcmNcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JvcHBlcnMgY29udGFpbmVyIG9iamVjdCBzaG91bGQgYmUgY3JlYXRlZCBpbiBjb250cm9sbGVyJ3Mgc2NvcGVcbiAgICogZm9yIHVwZGF0ZXMgYnkgZGlyZWN0aXZlIHZpYSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLlxuICAgKiBQYXNzIGEgZnVsbCBwcm94eSBuYW1lIHRvIHRoZSBgbmctY3JvcHBlci1wcm94eWAgZGlyZWN0aXZlIGF0dHJpYnV0ZSB0b1xuICAgKiBlbmFibGUgcHJveGluZy5cbiAgICovXG4gICRzY29wZS5jcm9wcGVyID0ge307XG4gICRzY29wZS5jcm9wcGVyUHJveHkgPSAnY3JvcHBlci5maXJzdCc7XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlcmUgaXMgYSBjcm9wcGVkIGltYWdlIHRvIHNob3cgZW5jb2RlIGl0IHRvIGJhc2U2NCBzdHJpbmcgYW5kXG4gICAqIHVzZSBhcyBhIHNvdXJjZSBmb3IgYW4gaW1hZ2UgZWxlbWVudC5cbiAgICovXG4gICRzY29wZS5wcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFmaWxlIHx8ICFkYXRhKSByZXR1cm47XG4gICAgQ3JvcHBlci5jcm9wKGZpbGUsIGRhdGEpLnRoZW4oQ3JvcHBlci5lbmNvZGUpLnRoZW4oZnVuY3Rpb24oZGF0YVVybCkge1xuICAgICAgKCRzY29wZS5wcmV2aWV3IHx8ICgkc2NvcGUucHJldmlldyA9IHt9KSkuZGF0YVVybCA9IGRhdGFVcmw7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVzZSBjcm9wcGVyIGZ1bmN0aW9uIHByb3h5IHRvIGNhbGwgbWV0aG9kcyBvZiB0aGUgcGx1Z2luLlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Zlbmd5dWFuY2hlbi9jcm9wcGVyI21ldGhvZHNcbiAgICovXG4gICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcbiAgICBpZiAoISRzY29wZS5jcm9wcGVyLmZpcnN0KSByZXR1cm47XG4gICAgJHNjb3BlLmNyb3BwZXIuZmlyc3QoJ2NsZWFyJyk7XG4gIH07XG5cbiAgJHNjb3BlLnNjYWxlID0gZnVuY3Rpb24od2lkdGgpIHtcbiAgICBDcm9wcGVyLmNyb3AoZmlsZSwgZGF0YSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgcmV0dXJuIENyb3BwZXIuc2NhbGUoYmxvYiwge3dpZHRoOiB3aWR0aH0pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKENyb3BwZXIuZW5jb2RlKS50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICAgKCRzY29wZS5wcmV2aWV3IHx8ICgkc2NvcGUucHJldmlldyA9IHt9KSkuZGF0YVVybCA9IGRhdGFVcmw7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYmplY3QgaXMgdXNlZCB0byBwYXNzIG9wdGlvbnMgdG8gaW5pdGFsaXplIGEgY3JvcHBlci5cbiAgICogTW9yZSBvbiBvcHRpb25zIC0gaHR0cHM6Ly9naXRodWIuY29tL2Zlbmd5dWFuY2hlbi9jcm9wcGVyI29wdGlvbnNcbiAgICovXG4gICRzY29wZS5vcHRpb25zID0ge1xuICAgIG1heGltaXplOiB0cnVlLFxuICAgIGFzcGVjdFJhdGlvOiAyIC8gMSxcbiAgICBjcm9wOiBmdW5jdGlvbihkYXRhTmV3KSB7XG4gICAgICBkYXRhID0gZGF0YU5ldztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3dpbmcgKGluaXRpYWxpemluZykgYW5kIGhpZGluZyAoZGVzdHJveWluZykgb2YgYSBjcm9wcGVyIGFyZSBzdGFydGVkIGJ5XG4gICAqIGV2ZW50cy4gVGhlIHNjb3BlIG9mIHRoZSBgbmctY3JvcHBlcmAgZGlyZWN0aXZlIGlzIGRlcml2ZWQgZnJvbSB0aGUgc2NvcGUgb2ZcbiAgICogdGhlIGNvbnRyb2xsZXIuIFdoZW4gaW5pdGlhbGl6aW5nIHRoZSBgbmctY3JvcHBlcmAgZGlyZWN0aXZlIGFkZHMgdHdvIGhhbmRsZXJzXG4gICAqIGxpc3RlbmluZyB0byBldmVudHMgcGFzc2VkIGJ5IGBuZy1jcm9wcGVyLXNob3dgICYgYG5nLWNyb3BwZXItaGlkZWAgYXR0cmlidXRlcy5cbiAgICogVG8gc2hvdyBvciBoaWRlIGEgY3JvcHBlciBgJGJyb2FkY2FzdGAgYSBwcm9wZXIgZXZlbnQuXG4gICAqL1xuICAkc2NvcGUuc2hvd0V2ZW50ID0gJ3Nob3cnO1xuICAkc2NvcGUuaGlkZUV2ZW50ID0gJ2hpZGUnO1xuXG4gIGZ1bmN0aW9uIHNob3dDcm9wcGVyKCkgeyAkc2NvcGUuJGJyb2FkY2FzdCgkc2NvcGUuc2hvd0V2ZW50KTsgfVxuICBmdW5jdGlvbiBoaWRlQ3JvcHBlcigpIHsgJHNjb3BlLiRicm9hZGNhc3QoJHNjb3BlLmhpZGVFdmVudCk7IH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvY29udGFjdC5odG1sJyxcbiAgY29udHJvbGxlcjogY29udGFjdEN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XCJ0aXRsZVwiOlwiX3RpdGxlXzF0b3Z6XzFcIn0iLCJ2YXIgc3R5bGUgPSByZXF1aXJlKCcuL2hvbWUuY3NzJyk7XG5cbmZ1bmN0aW9uIGhvbWVDdHJsKCRzY29wZSwkaHR0cCkge1xuICB2YXIgVGhpcyA9IHRoaXM7XG4gIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgJGh0dHAuZ2V0KCd2Mi9ib29rLzY1NDg2ODMnKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcyl7XG4gICAgY29uc29sZS5sb2cocmVzKVxuICB9KVxuXG4gIHRoaXMuc2VhcmNoQm9vayA9IGZ1bmN0aW9uKCkge1xuICAgICRodHRwLmdldCgndjIvYm9vay9zZWFyY2gnLCB7cGFyYW1zOiB7cTogdGhpcy5rZXl3b3JkfX0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcbiAgICAgIFRoaXMubGlzdCA9IHJlcy5ib29rcztcbiAgICAgIFRoaXMudG90YWwgPSByZXMudG90YWw7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvaG9tZS5odG1sJyxcbiAgY29udHJvbGxlcjogaG9tZUN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwiZnVuY3Rpb24gbGF5b3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUpIHtcbi8v5Zyo6L+Z6YeM5Y+v5Lul5pu/5LujcnVuXG4gIHRoaXMudGl0bGUgPSAnaG9tZSc7XG4gICRyb290U2NvcGUudGl0bGUgPSAnaG9tZSc7XG4gIHZhciBUaGlzID0gdGhpcztcbiAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKGUsIHRvKSB7XG4gICAgVGhpcy50aXRsZSA9IHRvLnRpdGxlO1xuICAgICRyb290U2NvcGUudGl0bGUgPSB0by50aXRsZTtcbiAgfSlcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvbGF5b3V0Lmh0bWwnLFxuICBjb250cm9sbGVyOiBsYXlvdXRDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsImZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xheW91dCcsIHtcbiAgICB1cmw6Jy8nLFxuICAgIHRlbXBsYXRlOic8bGF5LWhvbWUvPicsXG4gICAgdGl0bGU6J+S4u+mhtScsXG4gIH0pLnN0YXRlKCdjb250YWN0Jywge1xuICAgIHVybDonL2NvbnRhY3QnLFxuICAgIHRlbXBsYXRlOic8Y29udGFjdC8+JyxcbiAgICB0aXRsZTon6IGU57O75oiR5LusJ1xuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCIvKiFcbiAqIENyb3BwZXIgdjAuMTAuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2Zlbmd5dWFuY2hlbi9jcm9wcGVyXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUgRmVuZ3l1YW4gQ2hlbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqXG4gKiBEYXRlOiAyMDE1LTA2LTA4VDE0OjU3OjI2LjM1M1pcbiAqL1xuXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZSAvIENvbW1vbkpTXG4gICAgZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzLlxuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufSkoZnVuY3Rpb24gKCQpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KSxcbiAgICAgIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLFxuXG4gICAgICAvLyBDb25zdGFudHNcbiAgICAgIENST1BQRVJfTkFNRVNQQUNFID0gJy5jcm9wcGVyJyxcbiAgICAgIENST1BQRVJfUFJFVklFVyA9ICdwcmV2aWV3JyArIENST1BQRVJfTkFNRVNQQUNFLFxuXG4gICAgICAvLyBSZWdFeHBzXG4gICAgICBSRUdFWFBfRFJBR19UWVBFUyA9IC9eKGV8bnx3fHN8bmV8bnd8c3d8c2V8YWxsfGNyb3B8bW92ZXx6b29tKSQvLFxuXG4gICAgICAvLyBDbGFzc2VzXG4gICAgICBDTEFTU19NT0RBTCA9ICdjcm9wcGVyLW1vZGFsJyxcbiAgICAgIENMQVNTX0hJREUgPSAnY3JvcHBlci1oaWRlJyxcbiAgICAgIENMQVNTX0hJRERFTiA9ICdjcm9wcGVyLWhpZGRlbicsXG4gICAgICBDTEFTU19JTlZJU0lCTEUgPSAnY3JvcHBlci1pbnZpc2libGUnLFxuICAgICAgQ0xBU1NfTU9WRSA9ICdjcm9wcGVyLW1vdmUnLFxuICAgICAgQ0xBU1NfQ1JPUCA9ICdjcm9wcGVyLWNyb3AnLFxuICAgICAgQ0xBU1NfRElTQUJMRUQgPSAnY3JvcHBlci1kaXNhYmxlZCcsXG4gICAgICBDTEFTU19CRyA9ICdjcm9wcGVyLWJnJyxcblxuICAgICAgLy8gRXZlbnRzXG4gICAgICBFVkVOVF9NT1VTRV9ET1dOID0gJ21vdXNlZG93biB0b3VjaHN0YXJ0JyxcbiAgICAgIEVWRU5UX01PVVNFX01PVkUgPSAnbW91c2Vtb3ZlIHRvdWNobW92ZScsXG4gICAgICBFVkVOVF9NT1VTRV9VUCA9ICdtb3VzZXVwIG1vdXNlbGVhdmUgdG91Y2hlbmQgdG91Y2hsZWF2ZSB0b3VjaGNhbmNlbCcsXG4gICAgICBFVkVOVF9XSEVFTCA9ICd3aGVlbCBtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsJyxcbiAgICAgIEVWRU5UX0RCTENMSUNLID0gJ2RibGNsaWNrJyxcbiAgICAgIEVWRU5UX1JFU0laRSA9ICdyZXNpemUnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsIC8vIEJpbmQgdG8gd2luZG93IHdpdGggbmFtZXNwYWNlXG4gICAgICBFVkVOVF9CVUlMRCA9ICdidWlsZCcgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX0JVSUxUID0gJ2J1aWx0JyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfRFJBR19TVEFSVCA9ICdkcmFnc3RhcnQnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9EUkFHX01PVkUgPSAnZHJhZ21vdmUnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9EUkFHX0VORCA9ICdkcmFnZW5kJyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfWk9PTV9JTiA9ICd6b29taW4nICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9aT09NX09VVCA9ICd6b29tb3V0JyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfQ0hBTkdFID0gJ2NoYW5nZScgKyBDUk9QUEVSX05BTUVTUEFDRSxcblxuICAgICAgLy8gU3VwcG9ydHNcbiAgICAgIFNVUFBPUlRfQ0FOVkFTID0gJC5pc0Z1bmN0aW9uKCQoJzxjYW52YXM+JylbMF0uZ2V0Q29udGV4dCksXG5cbiAgICAgIC8vIE90aGVyc1xuICAgICAgc3FydCA9IE1hdGguc3FydCxcbiAgICAgIG1pbiA9IE1hdGgubWluLFxuICAgICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgICBhYnMgPSBNYXRoLmFicyxcbiAgICAgIHNpbiA9IE1hdGguc2luLFxuICAgICAgY29zID0gTWF0aC5jb3MsXG4gICAgICBudW0gPSBwYXJzZUZsb2F0LFxuXG4gICAgICAvLyBQcm90b3R5cGVcbiAgICAgIHByb3RvdHlwZSA9IHt9O1xuXG4gIGZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09ICdudW1iZXInICYmICFpc05hTihuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9BcnJheShvYmosIG9mZnNldCkge1xuICAgIHZhciBhcmdzID0gW107XG5cbiAgICBpZiAoaXNOdW1iZXIob2Zmc2V0KSkgeyAvLyBJdCdzIG5lY2Vzc2FyeSBmb3IgSUU4XG4gICAgICBhcmdzLnB1c2gob2Zmc2V0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJncy5zbGljZS5hcHBseShvYmosIGFyZ3MpO1xuICB9XG5cbiAgLy8gQ3VzdG9tIHByb3h5IHRvIGF2b2lkIGpRdWVyeSdzIGd1aWRcbiAgZnVuY3Rpb24gcHJveHkoZm4sIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzLCAyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQodG9BcnJheShhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ3Jvc3NPcmlnaW5VUkwodXJsKSB7XG4gICAgdmFyIHBhcnRzID0gdXJsLm1hdGNoKC9eKGh0dHBzPzopXFwvXFwvKFteXFw6XFwvXFw/I10rKTo/KFxcZCopL2kpO1xuXG4gICAgcmV0dXJuIHBhcnRzICYmIChwYXJ0c1sxXSAhPT0gbG9jYXRpb24ucHJvdG9jb2wgfHwgcGFydHNbMl0gIT09IGxvY2F0aW9uLmhvc3RuYW1lIHx8IHBhcnRzWzNdICE9PSBsb2NhdGlvbi5wb3J0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRpbWVzdGFtcCh1cmwpIHtcbiAgICB2YXIgdGltZXN0YW1wID0gJ3RpbWVzdGFtcD0nICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgIHJldHVybiAodXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHRpbWVzdGFtcCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSb3RhdGVWYWx1ZShkZWdyZWUpIHtcbiAgICByZXR1cm4gZGVncmVlID8gJ3JvdGF0ZSgnICsgZGVncmVlICsgJ2RlZyknIDogJ25vbmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Um90YXRlZFNpemVzKGRhdGEsIHJldmVyc2UpIHtcbiAgICB2YXIgZGVnID0gYWJzKGRhdGEuZGVncmVlKSAlIDE4MCxcbiAgICAgICAgYXJjID0gKGRlZyA+IDkwID8gKDE4MCAtIGRlZykgOiBkZWcpICogTWF0aC5QSSAvIDE4MCxcbiAgICAgICAgc2luQXJjID0gc2luKGFyYyksXG4gICAgICAgIGNvc0FyYyA9IGNvcyhhcmMpLFxuICAgICAgICB3aWR0aCA9IGRhdGEud2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGRhdGEuaGVpZ2h0LFxuICAgICAgICBhc3BlY3RSYXRpbyA9IGRhdGEuYXNwZWN0UmF0aW8sXG4gICAgICAgIG5ld1dpZHRoLFxuICAgICAgICBuZXdIZWlnaHQ7XG5cbiAgICBpZiAoIXJldmVyc2UpIHtcbiAgICAgIG5ld1dpZHRoID0gd2lkdGggKiBjb3NBcmMgKyBoZWlnaHQgKiBzaW5BcmM7XG4gICAgICBuZXdIZWlnaHQgPSB3aWR0aCAqIHNpbkFyYyArIGhlaWdodCAqIGNvc0FyYztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3V2lkdGggPSB3aWR0aCAvIChjb3NBcmMgKyBzaW5BcmMgLyBhc3BlY3RSYXRpbyk7XG4gICAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogbmV3V2lkdGgsXG4gICAgICBoZWlnaHQ6IG5ld0hlaWdodFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTb3VyY2VDYW52YXMoaW1hZ2UsIGRhdGEpIHtcbiAgICB2YXIgY2FudmFzID0gJCgnPGNhbnZhcz4nKVswXSxcbiAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLFxuICAgICAgICB3aWR0aCA9IGRhdGEubmF0dXJhbFdpZHRoLFxuICAgICAgICBoZWlnaHQgPSBkYXRhLm5hdHVyYWxIZWlnaHQsXG4gICAgICAgIHJvdGF0ZSA9IGRhdGEucm90YXRlLFxuICAgICAgICByb3RhdGVkID0gZ2V0Um90YXRlZFNpemVzKHtcbiAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgZGVncmVlOiByb3RhdGVcbiAgICAgICAgfSk7XG5cbiAgICBpZiAocm90YXRlKSB7XG4gICAgICBjYW52YXMud2lkdGggPSByb3RhdGVkLndpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHJvdGF0ZWQuaGVpZ2h0O1xuICAgICAgY29udGV4dC5zYXZlKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShyb3RhdGVkLndpZHRoIC8gMiwgcm90YXRlZC5oZWlnaHQgLyAyKTtcbiAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0ZSAqIE1hdGguUEkgLyAxODApO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIC13aWR0aCAvIDIsIC1oZWlnaHQgLyAyLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGZ1bmN0aW9uIENyb3BwZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDcm9wcGVyLkRFRkFVTFRTLCAkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykgJiYgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5idWlsdCA9IGZhbHNlO1xuICAgIHRoaXMucm90YXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3JvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNhbnZhcyA9IG51bGw7XG4gICAgdGhpcy5jcm9wQm94ID0gbnVsbDtcblxuICAgIHRoaXMubG9hZCgpO1xuICB9XG5cbiAgcHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICR0aGlzID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgY3Jvc3NPcmlnaW4sXG4gICAgICAgIGJ1c3RDYWNoZVVybCxcbiAgICAgICAgYnVpbGRFdmVudCxcbiAgICAgICAgJGNsb25lO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIGlmICgkdGhpcy5pcygnaW1nJykpIHtcbiAgICAgICAgaWYgKCEkdGhpcy5hdHRyKCdzcmMnKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybCA9ICR0aGlzLnByb3AoJ3NyYycpO1xuICAgICAgfSBlbHNlIGlmICgkdGhpcy5pcygnY2FudmFzJykgJiYgU1VQUE9SVF9DQU5WQVMpIHtcbiAgICAgICAgdXJsID0gJHRoaXNbMF0udG9EYXRhVVJMKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBidWlsZEV2ZW50ID0gJC5FdmVudChFVkVOVF9CVUlMRCk7XG5cbiAgICBpZigkdGhpcy5vbmUoRVZFTlRfQlVJTEQsIG9wdGlvbnMuYnVpbGQpLnRyaWdnZXIpe1xuICAgICAgJHRoaXMub25lKEVWRU5UX0JVSUxELCBvcHRpb25zLmJ1aWxkKS50cmlnZ2VyKGJ1aWxkRXZlbnQpOyAvLyBPbmx5IHRyaWdnZXIgb25jZVxuICAgIH1cblxuICAgIGlmIChidWlsZEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuY2hlY2tJbWFnZU9yaWdpbiAmJiBpc0Nyb3NzT3JpZ2luVVJMKHVybCkpIHtcbiAgICAgIGNyb3NzT3JpZ2luID0gJyBjcm9zc09yaWdpbj1cImFub255bW91c1wiJztcblxuICAgICAgaWYgKCEkdGhpcy5wcm9wKCdjcm9zc09yaWdpbicpKSB7IC8vIE9ubHkgd2hlbiB0aGVyZSB3YXMgbm90IGEgXCJjcm9zc09yaWdpblwiIHByb3BlcnR5XG4gICAgICAgIGJ1c3RDYWNoZVVybCA9IGFkZFRpbWVzdGFtcCh1cmwpOyAvLyBCdXN0IGNhY2hlICgjMTQ4KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElFOCBjb21wYXRpYmlsaXR5OiBEb24ndCB1c2UgXCIkKCkuYXR0cigpXCIgdG8gc2V0IFwic3JjXCJcbiAgICB0aGlzLiRjbG9uZSA9ICRjbG9uZSA9ICQoJzxpbWcnICsgKGNyb3NzT3JpZ2luIHx8ICcnKSArICcgc3JjPVwiJyArIChidXN0Q2FjaGVVcmwgfHwgdXJsKSArICdcIj4nKTtcblxuICAgICRjbG9uZS5vbmUoJ2xvYWQnLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbWFnZSA9ICRjbG9uZVswXSxcbiAgICAgICAgICBuYXR1cmFsV2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGggfHwgaW1hZ2Uud2lkdGgsXG4gICAgICAgICAgbmF0dXJhbEhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQgfHwgaW1hZ2UuaGVpZ2h0OyAvLyAkY2xvbmUud2lkdGgoKSBhbmQgJGNsb25lLmhlaWdodCgpIHdpbGwgcmV0dXJuIDAgaW4gSUU4ICgjMzE5KVxuXG4gICAgICB0aGlzLmltYWdlID0ge1xuICAgICAgICBuYXR1cmFsV2lkdGg6IG5hdHVyYWxXaWR0aCxcbiAgICAgICAgbmF0dXJhbEhlaWdodDogbmF0dXJhbEhlaWdodCxcbiAgICAgICAgYXNwZWN0UmF0aW86IG5hdHVyYWxXaWR0aCAvIG5hdHVyYWxIZWlnaHQsXG4gICAgICAgIHJvdGF0ZTogMFxuICAgICAgfTtcblxuICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICB9LCB0aGlzKSkub25lKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRjbG9uZS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIC8vIEhpZGUgYW5kIGluc2VydCBpbnRvIHRoZSBkb2N1bWVudFxuICAgICRjbG9uZS5hZGRDbGFzcyhDTEFTU19ISURFKS5pbnNlcnRBZnRlcigkdGhpcyk7XG4gIH07XG5cbiAgcHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICRjbG9uZSA9IHRoaXMuJGNsb25lLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAkY3JvcHBlcixcbiAgICAgICAgJGNyb3BCb3gsXG4gICAgICAgICRmYWNlO1xuXG4gICAgaWYgKCF0aGlzLnJlYWR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYnVpbHQpIHtcbiAgICAgIHRoaXMudW5idWlsZCgpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBjcm9wcGVyIGVsZW1lbnRzXG4gICAgdGhpcy4kY3JvcHBlciA9ICRjcm9wcGVyID0gJChDcm9wcGVyLlRFTVBMQVRFKTtcblxuICAgIC8vIEhpZGUgdGhlIG9yaWdpbmFsIGltYWdlXG4gICAgJHRoaXMuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcblxuICAgIC8vIFNob3cgdGhlIGNsb25lIGlhbWdlXG4gICAgJGNsb25lLnJlbW92ZUNsYXNzKENMQVNTX0hJREUpO1xuXG4gICAgdGhpcy4kY29udGFpbmVyID0gJHRoaXMucGFyZW50KCkuYXBwZW5kKCRjcm9wcGVyKTtcbiAgICB0aGlzLiRjYW52YXMgPSAkY3JvcHBlci5maW5kKCcuY3JvcHBlci1jYW52YXMnKS5hcHBlbmQoJGNsb25lKTtcbiAgICB0aGlzLiRkcmFnQm94ID0gJGNyb3BwZXIuZmluZCgnLmNyb3BwZXItZHJhZy1ib3gnKTtcbiAgICB0aGlzLiRjcm9wQm94ID0gJGNyb3BCb3ggPSAkY3JvcHBlci5maW5kKCcuY3JvcHBlci1jcm9wLWJveCcpO1xuICAgIHRoaXMuJHZpZXdCb3ggPSAkY3JvcHBlci5maW5kKCcuY3JvcHBlci12aWV3LWJveCcpO1xuICAgIHRoaXMuJGZhY2UgPSAkZmFjZSA9ICRjcm9wQm94LmZpbmQoJy5jcm9wcGVyLWZhY2UnKTtcblxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5pbml0UHJldmlldygpO1xuXG4gICAgLy8gRm9ybWF0IGFzcGVjdCByYXRpb1xuICAgIG9wdGlvbnMuYXNwZWN0UmF0aW8gPSBudW0ob3B0aW9ucy5hc3BlY3RSYXRpbykgfHwgTmFOOyAvLyAwIC0+IE5hTlxuXG4gICAgaWYgKG9wdGlvbnMuYXV0b0Nyb3ApIHtcbiAgICAgIHRoaXMuY3JvcHBlZCA9IHRydWU7XG5cbiAgICAgIGlmIChvcHRpb25zLm1vZGFsKSB7XG4gICAgICAgIHRoaXMuJGRyYWdCb3guYWRkQ2xhc3MoQ0xBU1NfTU9EQUwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkY3JvcEJveC5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmJhY2tncm91bmQpIHtcbiAgICAgICRjcm9wcGVyLmFkZENsYXNzKENMQVNTX0JHKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAkZmFjZS5hZGRDbGFzcyhDTEFTU19JTlZJU0lCTEUpO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5ndWlkZXMpIHtcbiAgICAgICRjcm9wQm94LmZpbmQoJy5jcm9wcGVyLWRhc2hlZCcpLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuY3JvcEJveE1vdmFibGUpIHtcbiAgICAgICRmYWNlLmFkZENsYXNzKENMQVNTX01PVkUpLmRhdGEoJ2RyYWcnLCAnYWxsJyk7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLmNyb3BCb3hSZXNpemFibGUpIHtcbiAgICAgICRjcm9wQm94LmZpbmQoJy5jcm9wcGVyLWxpbmUsIC5jcm9wcGVyLXBvaW50JykuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldERyYWdNb2RlKG9wdGlvbnMuZHJhZ0Nyb3AgPyAnY3JvcCcgOiBvcHRpb25zLm1vdmFibGUgPyAnbW92ZScgOiAnbm9uZScpO1xuXG4gICAgdGhpcy5idWlsdCA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLnNldERhdGEob3B0aW9ucy5kYXRhKTtcbiAgICBpZigkdGhpcy5vbmUoRVZFTlRfQlVJTFQsIG9wdGlvbnMuYnVpbHQpLnRyaWdnZXIpe1xuICAgICAgJHRoaXMub25lKEVWRU5UX0JVSUxULCBvcHRpb25zLmJ1aWx0KS50cmlnZ2VyKEVWRU5UX0JVSUxUKTsgLy8gT25seSB0cmlnZ2VyIG9uY2VcbiAgICB9XG4gIH07XG5cbiAgcHJvdG90eXBlLnVuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmJ1aWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5idWlsdCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdGlhbEltYWdlID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxDYW52YXMgPSBudWxsOyAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB3aGVuIHJlcGxhY2VcbiAgICB0aGlzLmluaXRpYWxDcm9wQm94ID0gbnVsbDtcbiAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xuICAgIHRoaXMuY3JvcEJveCA9IG51bGw7IC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHdoZW4gcmVwbGFjZVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCk7XG5cbiAgICB0aGlzLnJlc2V0UHJldmlldygpO1xuICAgIHRoaXMuJHByZXZpZXcgPSBudWxsO1xuXG4gICAgdGhpcy4kdmlld0JveCA9IG51bGw7XG4gICAgdGhpcy4kY3JvcEJveCA9IG51bGw7XG4gICAgdGhpcy4kZHJhZ0JveCA9IG51bGw7XG4gICAgdGhpcy4kY2FudmFzID0gbnVsbDtcbiAgICB0aGlzLiRjb250YWluZXIgPSBudWxsO1xuXG4gICAgdGhpcy4kY3JvcHBlci5yZW1vdmUoKTtcbiAgICB0aGlzLiRjcm9wcGVyID0gbnVsbDtcbiAgfTtcblxuICAkLmV4dGVuZChwcm90b3R5cGUsIHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaW5pdENvbnRhaW5lcigpO1xuICAgICAgdGhpcy5pbml0Q2FudmFzKCk7XG4gICAgICB0aGlzLmluaXRDcm9wQm94KCk7XG5cbiAgICAgIHRoaXMucmVuZGVyQ2FudmFzKCk7XG5cbiAgICAgIGlmICh0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGluaXRDb250YWluZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICAgJGNvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lcixcbiAgICAgICAgICAkY3JvcHBlciA9IHRoaXMuJGNyb3BwZXIsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgJGNyb3BwZXIuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgICR0aGlzLnJlbW92ZUNsYXNzKENMQVNTX0hJRERFTik7XG5cbiAgICAgICRjcm9wcGVyLmNzcygodGhpcy5jb250YWluZXIgPSB7XG4gICAgICAgIHdpZHRoOiBtYXgoJGNvbnRhaW5lci53aWR0aCgpLCBudW0ob3B0aW9ucy5taW5Db250YWluZXJXaWR0aCkgfHwgMjAwKSxcbiAgICAgICAgaGVpZ2h0OiBtYXgoJGNvbnRhaW5lci5oZWlnaHQoKSwgbnVtKG9wdGlvbnMubWluQ29udGFpbmVySGVpZ2h0KSB8fCAxMDApXG4gICAgICB9KSk7XG5cbiAgICAgICR0aGlzLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICAkY3JvcHBlci5yZW1vdmVDbGFzcyhDTEFTU19ISURERU4pO1xuICAgIH0sXG5cbiAgICAvLyBpbWFnZSBib3ggKHdyYXBwZXIpXG4gICAgaW5pdENhbnZhczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLndpZHRoLFxuICAgICAgICAgIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQsXG4gICAgICAgICAgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gaW1hZ2UuYXNwZWN0UmF0aW8sXG4gICAgICAgICAgY2FudmFzID0ge1xuICAgICAgICAgICAgYXNwZWN0UmF0aW86IGFzcGVjdFJhdGlvLFxuICAgICAgICAgICAgd2lkdGg6IGNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBjb250YWluZXJIZWlnaHRcbiAgICAgICAgICB9O1xuXG4gICAgICBpZiAoY29udGFpbmVySGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBjb250YWluZXJXaWR0aCkge1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY29udGFpbmVyV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgfVxuXG4gICAgICBjYW52YXMub2xkTGVmdCA9IGNhbnZhcy5sZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gY2FudmFzLndpZHRoKSAvIDI7XG4gICAgICBjYW52YXMub2xkVG9wID0gY2FudmFzLnRvcCA9IChjb250YWluZXJIZWlnaHQgLSBjYW52YXMuaGVpZ2h0KSAvIDI7XG5cbiAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgdGhpcy5saW1pdENhbnZhcyh0cnVlLCB0cnVlKTtcbiAgICAgIHRoaXMuaW5pdGlhbEltYWdlID0gJC5leHRlbmQoe30sIGltYWdlKTtcbiAgICAgIHRoaXMuaW5pdGlhbENhbnZhcyA9ICQuZXh0ZW5kKHt9LCBjYW52YXMpO1xuICAgIH0sXG5cbiAgICBsaW1pdENhbnZhczogZnVuY3Rpb24gKHNpemUsIHBvc2l0aW9uKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBzdHJpY3QgPSBvcHRpb25zLnN0cmljdCxcbiAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aCxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0LFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gY2FudmFzLmFzcGVjdFJhdGlvLFxuICAgICAgICAgIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgICAgY3JvcHBlZCA9IHRoaXMuY3JvcHBlZCAmJiBjcm9wQm94LFxuICAgICAgICAgIGluaXRpYWxDYW52YXMgPSB0aGlzLmluaXRpYWxDYW52YXMgfHwgY2FudmFzLFxuICAgICAgICAgIGluaXRpYWxDYW52YXNXaWR0aCA9IGluaXRpYWxDYW52YXMud2lkdGgsXG4gICAgICAgICAgaW5pdGlhbENhbnZhc0hlaWdodCA9IGluaXRpYWxDYW52YXMuaGVpZ2h0LFxuICAgICAgICAgIG1pbkNhbnZhc1dpZHRoLFxuICAgICAgICAgIG1pbkNhbnZhc0hlaWdodDtcblxuICAgICAgaWYgKHNpemUpIHtcbiAgICAgICAgbWluQ2FudmFzV2lkdGggPSBudW0ob3B0aW9ucy5taW5DYW52YXNXaWR0aCkgfHwgMDtcbiAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gbnVtKG9wdGlvbnMubWluQ2FudmFzSGVpZ2h0KSB8fCAwO1xuXG4gICAgICAgIGlmIChtaW5DYW52YXNXaWR0aCkge1xuICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIG1pbkNhbnZhc1dpZHRoID0gbWF4KGNyb3BwZWQgPyBjcm9wQm94LndpZHRoIDogaW5pdGlhbENhbnZhc1dpZHRoLCBtaW5DYW52YXNXaWR0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gbWluQ2FudmFzV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmIChtaW5DYW52YXNIZWlnaHQpIHtcbiAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBtYXgoY3JvcHBlZCA/IGNyb3BCb3guaGVpZ2h0IDogaW5pdGlhbENhbnZhc0hlaWdodCwgbWluQ2FudmFzSGVpZ2h0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IG1pbkNhbnZhc0hlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCkge1xuICAgICAgICAgIGlmIChjcm9wcGVkKSB7XG4gICAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IGNyb3BCb3gud2lkdGg7XG4gICAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBjcm9wQm94LmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKG1pbkNhbnZhc0hlaWdodCAqIGFzcGVjdFJhdGlvID4gbWluQ2FudmFzV2lkdGgpIHtcbiAgICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG1pbkNhbnZhc1dpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1pbkNhbnZhc1dpZHRoID0gaW5pdGlhbENhbnZhc1dpZHRoO1xuICAgICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gaW5pdGlhbENhbnZhc0hlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkLmV4dGVuZChjYW52YXMsIHtcbiAgICAgICAgICBtaW5XaWR0aDogbWluQ2FudmFzV2lkdGgsXG4gICAgICAgICAgbWluSGVpZ2h0OiBtaW5DYW52YXNIZWlnaHQsXG4gICAgICAgICAgbWF4V2lkdGg6IEluZmluaXR5LFxuICAgICAgICAgIG1heEhlaWdodDogSW5maW5pdHlcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgaWYgKGNyb3BwZWQpIHtcbiAgICAgICAgICAgIGNhbnZhcy5taW5MZWZ0ID0gbWluKGNyb3BCb3gubGVmdCwgKGNyb3BCb3gubGVmdCArIGNyb3BCb3gud2lkdGgpIC0gY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgIGNhbnZhcy5taW5Ub3AgPSBtaW4oY3JvcEJveC50b3AsIChjcm9wQm94LnRvcCArIGNyb3BCb3guaGVpZ2h0KSAtIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgY2FudmFzLm1heExlZnQgPSBjcm9wQm94LmxlZnQ7XG4gICAgICAgICAgICBjYW52YXMubWF4VG9wID0gY3JvcEJveC50b3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcy5taW5MZWZ0ID0gbWluKDAsIGNvbnRhaW5lcldpZHRoIC0gY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgIGNhbnZhcy5taW5Ub3AgPSBtaW4oMCwgY29udGFpbmVySGVpZ2h0IC0gY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICBjYW52YXMubWF4TGVmdCA9IG1heCgwLCBjb250YWluZXJXaWR0aCAtIGNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgICBjYW52YXMubWF4VG9wID0gbWF4KDAsIGNvbnRhaW5lckhlaWdodCAtIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYW52YXMubWluTGVmdCA9IC1jYW52YXMud2lkdGg7XG4gICAgICAgICAgY2FudmFzLm1pblRvcCA9IC1jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5tYXhMZWZ0ID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgICAgY2FudmFzLm1heFRvcCA9IGNvbnRhaW5lckhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXJDYW52YXM6IGZ1bmN0aW9uIChjaGFuZ2VkKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgYXNwZWN0UmF0aW8sXG4gICAgICAgICAgcm90YXRlZDtcblxuICAgICAgaWYgKHRoaXMucm90YXRlZCkge1xuICAgICAgICB0aGlzLnJvdGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICAvLyBDb21wdXRlcyByb3RhdGF0aW9uIHNpemVzIHdpdGggaW1hZ2Ugc2l6ZXNcbiAgICAgICAgcm90YXRlZCA9IGdldFJvdGF0ZWRTaXplcyh7XG4gICAgICAgICAgd2lkdGg6IGltYWdlLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuICAgICAgICAgIGRlZ3JlZTogaW1hZ2Uucm90YXRlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzcGVjdFJhdGlvID0gcm90YXRlZC53aWR0aCAvIHJvdGF0ZWQuaGVpZ2h0O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbyAhPT0gY2FudmFzLmFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgY2FudmFzLmxlZnQgLT0gKHJvdGF0ZWQud2lkdGggLSBjYW52YXMud2lkdGgpIC8gMjtcbiAgICAgICAgICBjYW52YXMudG9wIC09IChyb3RhdGVkLmhlaWdodCAtIGNhbnZhcy5oZWlnaHQpIC8gMjtcbiAgICAgICAgICBjYW52YXMud2lkdGggPSByb3RhdGVkLndpZHRoO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByb3RhdGVkLmhlaWdodDtcbiAgICAgICAgICBjYW52YXMuYXNwZWN0UmF0aW8gPSBhc3BlY3RSYXRpbztcbiAgICAgICAgICB0aGlzLmxpbWl0Q2FudmFzKHRydWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FudmFzLndpZHRoID4gY2FudmFzLm1heFdpZHRoIHx8IGNhbnZhcy53aWR0aCA8IGNhbnZhcy5taW5XaWR0aCkge1xuICAgICAgICBjYW52YXMubGVmdCA9IGNhbnZhcy5vbGRMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FudmFzLmhlaWdodCA+IGNhbnZhcy5tYXhIZWlnaHQgfHwgY2FudmFzLmhlaWdodCA8IGNhbnZhcy5taW5IZWlnaHQpIHtcbiAgICAgICAgY2FudmFzLnRvcCA9IGNhbnZhcy5vbGRUb3A7XG4gICAgICB9XG5cbiAgICAgIGNhbnZhcy53aWR0aCA9IG1pbihtYXgoY2FudmFzLndpZHRoLCBjYW52YXMubWluV2lkdGgpLCBjYW52YXMubWF4V2lkdGgpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IG1pbihtYXgoY2FudmFzLmhlaWdodCwgY2FudmFzLm1pbkhlaWdodCksIGNhbnZhcy5tYXhIZWlnaHQpO1xuXG4gICAgICB0aGlzLmxpbWl0Q2FudmFzKGZhbHNlLCB0cnVlKTtcblxuICAgICAgY2FudmFzLm9sZExlZnQgPSBjYW52YXMubGVmdCA9IG1pbihtYXgoY2FudmFzLmxlZnQsIGNhbnZhcy5taW5MZWZ0KSwgY2FudmFzLm1heExlZnQpO1xuICAgICAgY2FudmFzLm9sZFRvcCA9IGNhbnZhcy50b3AgPSBtaW4obWF4KGNhbnZhcy50b3AsIGNhbnZhcy5taW5Ub3ApLCBjYW52YXMubWF4VG9wKTtcblxuICAgICAgdGhpcy4kY2FudmFzLmNzcyh7XG4gICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcbiAgICAgICAgbGVmdDogY2FudmFzLmxlZnQsXG4gICAgICAgIHRvcDogY2FudmFzLnRvcFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVuZGVySW1hZ2UoKTtcblxuICAgICAgaWYgKHRoaXMuY3JvcHBlZCAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICB0aGlzLmxpbWl0Q3JvcEJveCh0cnVlLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5vdXRwdXQoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVySW1hZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgcmV2ZXJzZWQ7XG5cbiAgICAgIGlmIChpbWFnZS5yb3RhdGUpIHtcbiAgICAgICAgcmV2ZXJzZWQgPSBnZXRSb3RhdGVkU2l6ZXMoe1xuICAgICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgICAgIGRlZ3JlZTogaW1hZ2Uucm90YXRlLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiBpbWFnZS5hc3BlY3RSYXRpb1xuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQoaW1hZ2UsIHJldmVyc2VkID8ge1xuICAgICAgICB3aWR0aDogcmV2ZXJzZWQud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmV2ZXJzZWQuaGVpZ2h0LFxuICAgICAgICBsZWZ0OiAoY2FudmFzLndpZHRoIC0gcmV2ZXJzZWQud2lkdGgpIC8gMixcbiAgICAgICAgdG9wOiAoY2FudmFzLmhlaWdodCAtIHJldmVyc2VkLmhlaWdodCkgLyAyXG4gICAgICB9IDoge1xuICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHQsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJGNsb25lLmNzcyh7XG4gICAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBpbWFnZS5oZWlnaHQsXG4gICAgICAgIG1hcmdpbkxlZnQ6IGltYWdlLmxlZnQsXG4gICAgICAgIG1hcmdpblRvcDogaW1hZ2UudG9wLFxuICAgICAgICB0cmFuc2Zvcm06IGdldFJvdGF0ZVZhbHVlKGltYWdlLnJvdGF0ZSlcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0Q3JvcEJveDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSBvcHRpb25zLmFzcGVjdFJhdGlvLFxuICAgICAgICAgIGF1dG9Dcm9wQXJlYSA9IG51bShvcHRpb25zLmF1dG9Dcm9wQXJlYSkgfHwgMC44LFxuICAgICAgICAgIGNyb3BCb3ggPSB7XG4gICAgICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0XG4gICAgICAgICAgfTtcblxuICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgIGlmIChjYW52YXMuaGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBjYW52YXMud2lkdGgpIHtcbiAgICAgICAgICBjcm9wQm94LmhlaWdodCA9IGNyb3BCb3gud2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcm9wQm94LndpZHRoID0gY3JvcEJveC5oZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNyb3BCb3ggPSBjcm9wQm94O1xuICAgICAgdGhpcy5saW1pdENyb3BCb3godHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgIC8vIEluaXRpYWxpemUgYXV0byBjcm9wIGFyZWFcbiAgICAgIGNyb3BCb3gud2lkdGggPSBtaW4obWF4KGNyb3BCb3gud2lkdGgsIGNyb3BCb3gubWluV2lkdGgpLCBjcm9wQm94Lm1heFdpZHRoKTtcbiAgICAgIGNyb3BCb3guaGVpZ2h0ID0gbWluKG1heChjcm9wQm94LmhlaWdodCwgY3JvcEJveC5taW5IZWlnaHQpLCBjcm9wQm94Lm1heEhlaWdodCk7XG5cbiAgICAgIC8vIFRoZSB3aWR0aCBvZiBhdXRvIGNyb3AgYXJlYSBtdXN0IGxhcmdlIHRoYW4gXCJtaW5XaWR0aFwiLCBhbmQgdGhlIGhlaWdodCB0b28uICgjMTY0KVxuICAgICAgY3JvcEJveC53aWR0aCA9IG1heChjcm9wQm94Lm1pbldpZHRoLCBjcm9wQm94LndpZHRoICogYXV0b0Nyb3BBcmVhKTtcbiAgICAgIGNyb3BCb3guaGVpZ2h0ID0gbWF4KGNyb3BCb3gubWluSGVpZ2h0LCBjcm9wQm94LmhlaWdodCAqIGF1dG9Dcm9wQXJlYSk7XG4gICAgICBjcm9wQm94Lm9sZExlZnQgPSBjcm9wQm94LmxlZnQgPSBjYW52YXMubGVmdCArIChjYW52YXMud2lkdGggLSBjcm9wQm94LndpZHRoKSAvIDI7XG4gICAgICBjcm9wQm94Lm9sZFRvcCA9IGNyb3BCb3gudG9wID0gY2FudmFzLnRvcCArIChjYW52YXMuaGVpZ2h0IC0gY3JvcEJveC5oZWlnaHQpIC8gMjtcblxuICAgICAgdGhpcy5pbml0aWFsQ3JvcEJveCA9ICQuZXh0ZW5kKHt9LCBjcm9wQm94KTtcbiAgICB9LFxuXG4gICAgbGltaXRDcm9wQm94OiBmdW5jdGlvbiAoc2l6ZSwgcG9zaXRpb24pIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0LFxuICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLndpZHRoLFxuICAgICAgICAgIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW8sXG4gICAgICAgICAgbWluQ3JvcEJveFdpZHRoLFxuICAgICAgICAgIG1pbkNyb3BCb3hIZWlnaHQ7XG5cbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIG1pbkNyb3BCb3hXaWR0aCA9IG51bShvcHRpb25zLm1pbkNyb3BCb3hXaWR0aCkgfHwgMDtcbiAgICAgICAgbWluQ3JvcEJveEhlaWdodCA9IG51bShvcHRpb25zLm1pbkNyb3BCb3hIZWlnaHQpIHx8IDA7XG5cbiAgICAgICAgLy8gbWluL21heENyb3BCb3hXaWR0aC9IZWlnaHQgbXVzdCBsZXNzIHRoYW4gY29uYXRpbmVyIHdpZHRoL2hlaWdodFxuICAgICAgICBjcm9wQm94Lm1pbldpZHRoID0gbWluKGNvbnRhaW5lcldpZHRoLCBtaW5Dcm9wQm94V2lkdGgpO1xuICAgICAgICBjcm9wQm94Lm1pbkhlaWdodCA9IG1pbihjb250YWluZXJIZWlnaHQsIG1pbkNyb3BCb3hIZWlnaHQpO1xuICAgICAgICBjcm9wQm94Lm1heFdpZHRoID0gbWluKGNvbnRhaW5lcldpZHRoLCBzdHJpY3QgPyBjYW52YXMud2lkdGggOiBjb250YWluZXJXaWR0aCk7XG4gICAgICAgIGNyb3BCb3gubWF4SGVpZ2h0ID0gbWluKGNvbnRhaW5lckhlaWdodCwgc3RyaWN0ID8gY2FudmFzLmhlaWdodCA6IGNvbnRhaW5lckhlaWdodCk7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgLy8gY29tcGFyZSBjcm9wIGJveCBzaXplIHdpdGggY29udGFpbmVyIGZpcnN0XG4gICAgICAgICAgaWYgKGNyb3BCb3gubWF4SGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBjcm9wQm94Lm1heFdpZHRoKSB7XG4gICAgICAgICAgICBjcm9wQm94Lm1pbkhlaWdodCA9IGNyb3BCb3gubWluV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICAgIGNyb3BCb3gubWF4SGVpZ2h0ID0gY3JvcEJveC5tYXhXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjcm9wQm94Lm1pbldpZHRoID0gY3JvcEJveC5taW5IZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICAgIGNyb3BCb3gubWF4V2lkdGggPSBjcm9wQm94Lm1heEhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBcIm1pbldpZHRoXCIgbXVzdCBiZSBsZXNzIHRoYW4gXCJtYXhXaWR0aFwiLCBhbmQgdGhlIFwibWluSGVpZ2h0XCIgdG9vLlxuICAgICAgICBjcm9wQm94Lm1pbldpZHRoID0gbWluKGNyb3BCb3gubWF4V2lkdGgsIGNyb3BCb3gubWluV2lkdGgpO1xuICAgICAgICBjcm9wQm94Lm1pbkhlaWdodCA9IG1pbihjcm9wQm94Lm1heEhlaWdodCwgY3JvcEJveC5taW5IZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgIGNyb3BCb3gubWluTGVmdCA9IG1heCgwLCBjYW52YXMubGVmdCk7XG4gICAgICAgICAgY3JvcEJveC5taW5Ub3AgPSBtYXgoMCwgY2FudmFzLnRvcCk7XG4gICAgICAgICAgY3JvcEJveC5tYXhMZWZ0ID0gbWluKGNvbnRhaW5lcldpZHRoLCBjYW52YXMubGVmdCArIGNhbnZhcy53aWR0aCkgLSBjcm9wQm94LndpZHRoO1xuICAgICAgICAgIGNyb3BCb3gubWF4VG9wID0gbWluKGNvbnRhaW5lckhlaWdodCwgY2FudmFzLnRvcCArIGNhbnZhcy5oZWlnaHQpIC0gY3JvcEJveC5oZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3JvcEJveC5taW5MZWZ0ID0gMDtcbiAgICAgICAgICBjcm9wQm94Lm1pblRvcCA9IDA7XG4gICAgICAgICAgY3JvcEJveC5tYXhMZWZ0ID0gY29udGFpbmVyV2lkdGggLSBjcm9wQm94LndpZHRoO1xuICAgICAgICAgIGNyb3BCb3gubWF4VG9wID0gY29udGFpbmVySGVpZ2h0IC0gY3JvcEJveC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyQ3JvcEJveDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIud2lkdGgsXG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCxcbiAgICAgICAgICBjcm9wQm94ID0gdGhpcy5jcm9wQm94O1xuXG4gICAgICBpZiAoY3JvcEJveC53aWR0aCA+IGNyb3BCb3gubWF4V2lkdGggfHwgY3JvcEJveC53aWR0aCA8IGNyb3BCb3gubWluV2lkdGgpIHtcbiAgICAgICAgY3JvcEJveC5sZWZ0ID0gY3JvcEJveC5vbGRMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoY3JvcEJveC5oZWlnaHQgPiBjcm9wQm94Lm1heEhlaWdodCB8fCBjcm9wQm94LmhlaWdodCA8IGNyb3BCb3gubWluSGVpZ2h0KSB7XG4gICAgICAgIGNyb3BCb3gudG9wID0gY3JvcEJveC5vbGRUb3A7XG4gICAgICB9XG5cbiAgICAgIGNyb3BCb3gud2lkdGggPSBtaW4obWF4KGNyb3BCb3gud2lkdGgsIGNyb3BCb3gubWluV2lkdGgpLCBjcm9wQm94Lm1heFdpZHRoKTtcbiAgICAgIGNyb3BCb3guaGVpZ2h0ID0gbWluKG1heChjcm9wQm94LmhlaWdodCwgY3JvcEJveC5taW5IZWlnaHQpLCBjcm9wQm94Lm1heEhlaWdodCk7XG5cbiAgICAgIHRoaXMubGltaXRDcm9wQm94KGZhbHNlLCB0cnVlKTtcblxuICAgICAgY3JvcEJveC5vbGRMZWZ0ID0gY3JvcEJveC5sZWZ0ID0gbWluKG1heChjcm9wQm94LmxlZnQsIGNyb3BCb3gubWluTGVmdCksIGNyb3BCb3gubWF4TGVmdCk7XG4gICAgICBjcm9wQm94Lm9sZFRvcCA9IGNyb3BCb3gudG9wID0gbWluKG1heChjcm9wQm94LnRvcCwgY3JvcEJveC5taW5Ub3ApLCBjcm9wQm94Lm1heFRvcCk7XG5cbiAgICAgIGlmIChvcHRpb25zLm1vdmFibGUgJiYgb3B0aW9ucy5jcm9wQm94TW92YWJsZSkge1xuICAgICAgICAvLyBUdXJuIHRvIG1vdmUgdGhlIGNhbnZhcyB3aGVuIHRoZSBjcm9wIGJveCBpcyBlcXVhbCB0byB0aGUgY29udGFpbmVyXG4gICAgICAgIHRoaXMuJGZhY2UuZGF0YSgnZHJhZycsIChjcm9wQm94LndpZHRoID09PSBjb250YWluZXJXaWR0aCAmJiBjcm9wQm94LmhlaWdodCA9PT0gY29udGFpbmVySGVpZ2h0KSA/ICdtb3ZlJyA6ICdhbGwnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy4kY3JvcEJveC5jc3Moe1xuICAgICAgICB3aWR0aDogY3JvcEJveC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjcm9wQm94LmhlaWdodCxcbiAgICAgICAgbGVmdDogY3JvcEJveC5sZWZ0LFxuICAgICAgICB0b3A6IGNyb3BCb3gudG9wXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuY3JvcHBlZCAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICB0aGlzLmxpbWl0Q2FudmFzKHRydWUsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5vdXRwdXQoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAkdGhpcyA9IHRoaXMuJGVsZW1lbnQ7XG5cbiAgICAgIHRoaXMucHJldmlldygpO1xuXG4gICAgICBpZiAob3B0aW9ucy5jcm9wKSB7XG4gICAgICAgIG9wdGlvbnMuY3JvcC5jYWxsKCR0aGlzLCB0aGlzLmdldERhdGEoKSk7XG4gICAgICB9XG5cbiAgICAgICR0aGlzLnRyaWdnZXIoRVZFTlRfQ0hBTkdFKTtcbiAgICB9XG4gIH0pO1xuXG4gIHByb3RvdHlwZS5pbml0UHJldmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXJsID0gdGhpcy51cmw7XG5cbiAgICB0aGlzLiRwcmV2aWV3ID0gJCh0aGlzLm9wdGlvbnMucHJldmlldyk7XG4gICAgdGhpcy4kdmlld0JveC5odG1sKCc8aW1nIHNyYz1cIicgKyB1cmwgKyAnXCI+Jyk7XG5cbiAgICAvLyBPdmVycmlkZSBpbWcgZWxlbWVudCBzdHlsZXNcbiAgICAvLyBBZGQgYGRpc3BsYXk6YmxvY2tgIHRvIGF2b2lkIG1hcmdpbiB0b3AgaXNzdWUgKE9jY3VyIG9ubHkgd2hlbiBtYXJnaW4tdG9wIDw9IC1oZWlnaHQpXG4gICAgdGhpcy4kcHJldmlldy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICR0aGlzLmRhdGEoQ1JPUFBFUl9QUkVWSUVXLCB7XG4gICAgICAgIHdpZHRoOiAkdGhpcy53aWR0aCgpLFxuICAgICAgICBoZWlnaHQ6ICR0aGlzLmhlaWdodCgpLFxuICAgICAgICBvcmlnaW5hbDogJHRoaXMuaHRtbCgpXG4gICAgICB9KS5odG1sKCc8aW1nIHNyYz1cIicgKyB1cmwgKyAnXCIgc3R5bGU9XCJkaXNwbGF5OmJsb2NrO3dpZHRoOjEwMCU7bWluLXdpZHRoOjAhaW1wb3J0YW50O21pbi1oZWlnaHQ6MCFpbXBvcnRhbnQ7bWF4LXdpZHRoOm5vbmUhaW1wb3J0YW50O21heC1oZWlnaHQ6bm9uZSFpbXBvcnRhbnQ7aW1hZ2Utb3JpZW50YXRpb246IDBkZWchaW1wb3J0YW50XCI+Jyk7XG4gICAgfSk7XG4gIH07XG5cbiAgcHJvdG90eXBlLnJlc2V0UHJldmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRwcmV2aWV3LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgJHRoaXMuaHRtbCgkdGhpcy5kYXRhKENST1BQRVJfUFJFVklFVykub3JpZ2luYWwpLnJlbW92ZURhdGEoQ1JPUFBFUl9QUkVWSUVXKTtcbiAgICB9KTtcbiAgfTtcblxuICBwcm90b3R5cGUucHJldmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgd2lkdGggPSBpbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0LFxuICAgICAgICBsZWZ0ID0gY3JvcEJveC5sZWZ0IC0gY2FudmFzLmxlZnQgLSBpbWFnZS5sZWZ0LFxuICAgICAgICB0b3AgPSBjcm9wQm94LnRvcCAtIGNhbnZhcy50b3AgLSBpbWFnZS50b3AsXG4gICAgICAgIHJvdGF0ZSA9IGltYWdlLnJvdGF0ZTtcblxuICAgIGlmICghdGhpcy5jcm9wcGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiR2aWV3Qm94LmZpbmQoJ2ltZycpLmNzcyh7XG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIG1hcmdpbkxlZnQ6IC1sZWZ0LFxuICAgICAgbWFyZ2luVG9wOiAtdG9wLFxuICAgICAgdHJhbnNmb3JtOiBnZXRSb3RhdGVWYWx1ZShyb3RhdGUpXG4gICAgfSk7XG5cbiAgICB0aGlzLiRwcmV2aWV3LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YShDUk9QUEVSX1BSRVZJRVcpLFxuICAgICAgICAgIHJhdGlvID0gZGF0YS53aWR0aCAvIGNyb3BCb3gud2lkdGgsXG4gICAgICAgICAgbmV3V2lkdGggPSBkYXRhLndpZHRoLFxuICAgICAgICAgIG5ld0hlaWdodCA9IGNyb3BCb3guaGVpZ2h0ICogcmF0aW87XG5cbiAgICAgIGlmIChuZXdIZWlnaHQgPiBkYXRhLmhlaWdodCkge1xuICAgICAgICByYXRpbyA9IGRhdGEuaGVpZ2h0IC8gY3JvcEJveC5oZWlnaHQ7XG4gICAgICAgIG5ld1dpZHRoID0gY3JvcEJveC53aWR0aCAqIHJhdGlvO1xuICAgICAgICBuZXdIZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgJHRoaXMud2lkdGgobmV3V2lkdGgpLmhlaWdodChuZXdIZWlnaHQpLmZpbmQoJ2ltZycpLmNzcyh7XG4gICAgICAgIHdpZHRoOiB3aWR0aCAqIHJhdGlvLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCAqIHJhdGlvLFxuICAgICAgICBtYXJnaW5MZWZ0OiAtbGVmdCAqIHJhdGlvLFxuICAgICAgICBtYXJnaW5Ub3A6IC10b3AgKiByYXRpbyxcbiAgICAgICAgdHJhbnNmb3JtOiBnZXRSb3RhdGVWYWx1ZShyb3RhdGUpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBwcm90b3R5cGUuYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAkdGhpcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICRjcm9wcGVyID0gdGhpcy4kY3JvcHBlcjtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnc3RhcnQpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9EUkFHX1NUQVJULCBvcHRpb25zLmRyYWdzdGFydCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdtb3ZlKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfRFJBR19NT1ZFLCBvcHRpb25zLmRyYWdtb3ZlKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ2VuZCkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX0RSQUdfRU5ELCBvcHRpb25zLmRyYWdlbmQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy56b29taW4pKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9aT09NX0lOLCBvcHRpb25zLnpvb21pbik7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLnpvb21vdXQpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9aT09NX09VVCwgb3B0aW9ucy56b29tb3V0KTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuY2hhbmdlKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfQ0hBTkdFLCBvcHRpb25zLmNoYW5nZSk7XG4gICAgfVxuXG4gICAgJGNyb3BwZXIub24oRVZFTlRfTU9VU0VfRE9XTiwgJC5wcm94eSh0aGlzLmRyYWdzdGFydCwgdGhpcykpO1xuXG4gICAgaWYgKG9wdGlvbnMuem9vbWFibGUgJiYgb3B0aW9ucy5tb3VzZVdoZWVsWm9vbSkge1xuICAgICAgJGNyb3BwZXIub24oRVZFTlRfV0hFRUwsICQucHJveHkodGhpcy53aGVlbCwgdGhpcykpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRvdWJsZUNsaWNrVG9nZ2xlKSB7XG4gICAgICAkY3JvcHBlci5vbihFVkVOVF9EQkxDTElDSywgJC5wcm94eSh0aGlzLmRibGNsaWNrLCB0aGlzKSk7XG4gICAgfVxuXG4gICAgJGRvY3VtZW50Lm9uKEVWRU5UX01PVVNFX01PVkUsICh0aGlzLl9kcmFnbW92ZSA9IHByb3h5KHRoaXMuZHJhZ21vdmUsIHRoaXMpKSkub24oRVZFTlRfTU9VU0VfVVAsICh0aGlzLl9kcmFnZW5kID0gcHJveHkodGhpcy5kcmFnZW5kLCB0aGlzKSkpO1xuXG4gICAgaWYgKG9wdGlvbnMucmVzcG9uc2l2ZSkge1xuICAgICAgJHdpbmRvdy5vbihFVkVOVF9SRVNJWkUsICh0aGlzLl9yZXNpemUgPSBwcm94eSh0aGlzLnJlc2l6ZSwgdGhpcykpKTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdG90eXBlLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgJHRoaXMgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAkY3JvcHBlciA9IHRoaXMuJGNyb3BwZXI7XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ3N0YXJ0KSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX0RSQUdfU1RBUlQsIG9wdGlvbnMuZHJhZ3N0YXJ0KTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ21vdmUpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfRFJBR19NT1ZFLCBvcHRpb25zLmRyYWdtb3ZlKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ2VuZCkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9EUkFHX0VORCwgb3B0aW9ucy5kcmFnZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuem9vbWluKSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX1pPT01fSU4sIG9wdGlvbnMuem9vbWluKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuem9vbW91dCkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9aT09NX09VVCwgb3B0aW9ucy56b29tb3V0KTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuY2hhbmdlKSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX0NIQU5HRSwgb3B0aW9ucy5jaGFuZ2UpO1xuICAgIH1cblxuICAgICRjcm9wcGVyLm9mZihFVkVOVF9NT1VTRV9ET1dOLCB0aGlzLmRyYWdzdGFydCk7XG5cbiAgICBpZiAob3B0aW9ucy56b29tYWJsZSAmJiBvcHRpb25zLm1vdXNlV2hlZWxab29tKSB7XG4gICAgICAkY3JvcHBlci5vZmYoRVZFTlRfV0hFRUwsIHRoaXMud2hlZWwpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRvdWJsZUNsaWNrVG9nZ2xlKSB7XG4gICAgICAkY3JvcHBlci5vZmYoRVZFTlRfREJMQ0xJQ0ssIHRoaXMuZGJsY2xpY2spO1xuICAgIH1cblxuICAgICRkb2N1bWVudC5vZmYoRVZFTlRfTU9VU0VfTU9WRSwgdGhpcy5fZHJhZ21vdmUpLm9mZihFVkVOVF9NT1VTRV9VUCwgdGhpcy5fZHJhZ2VuZCk7XG5cbiAgICBpZiAob3B0aW9ucy5yZXNwb25zaXZlKSB7XG4gICAgICAkd2luZG93Lm9mZihFVkVOVF9SRVNJWkUsIHRoaXMuX3Jlc2l6ZSk7XG4gICAgfVxuICB9O1xuXG4gICQuZXh0ZW5kKHByb3RvdHlwZSwge1xuICAgIHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRjb250YWluZXIgPSB0aGlzLiRjb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgY2FudmFzRGF0YSxcbiAgICAgICAgICBjcm9wQm94RGF0YSxcbiAgICAgICAgICByYXRpbztcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIWNvbnRhaW5lcikgeyAvLyBDaGVjayBcImNvbnRhaW5lclwiIGZvciBJRThcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByYXRpbyA9ICRjb250YWluZXIud2lkdGgoKSAvIGNvbnRhaW5lci53aWR0aDtcblxuICAgICAgaWYgKHJhdGlvICE9PSAxIHx8ICRjb250YWluZXIuaGVpZ2h0KCkgIT09IGNvbnRhaW5lci5oZWlnaHQpIHtcbiAgICAgICAgY2FudmFzRGF0YSA9IHRoaXMuZ2V0Q2FudmFzRGF0YSgpO1xuICAgICAgICBjcm9wQm94RGF0YSA9IHRoaXMuZ2V0Q3JvcEJveERhdGEoKTtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB0aGlzLnNldENhbnZhc0RhdGEoJC5lYWNoKGNhbnZhc0RhdGEsIGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgICAgY2FudmFzRGF0YVtpXSA9IG4gKiByYXRpbztcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnNldENyb3BCb3hEYXRhKCQuZWFjaChjcm9wQm94RGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcbiAgICAgICAgICBjcm9wQm94RGF0YVtpXSA9IG4gKiByYXRpbztcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkYmxjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy4kZHJhZ0JveC5oYXNDbGFzcyhDTEFTU19DUk9QKSkge1xuICAgICAgICB0aGlzLnNldERyYWdNb2RlKCdtb3ZlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERyYWdNb2RlKCdjcm9wJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdoZWVsOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBlID0gZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICBkZWx0YSA9IDE7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKGUuZGVsdGFZKSB7XG4gICAgICAgIGRlbHRhID0gZS5kZWx0YVkgPiAwID8gMSA6IC0xO1xuICAgICAgfSBlbHNlIGlmIChlLndoZWVsRGVsdGEpIHtcbiAgICAgICAgZGVsdGEgPSAtZS53aGVlbERlbHRhIC8gMTIwO1xuICAgICAgfSBlbHNlIGlmIChlLmRldGFpbCkge1xuICAgICAgICBkZWx0YSA9IGUuZGV0YWlsID4gMCA/IDEgOiAtMTtcbiAgICAgIH1cblxuICAgICAgdGhpcy56b29tKC1kZWx0YSAqIDAuMSk7XG4gICAgfSxcblxuICAgIGRyYWdzdGFydDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICB0b3VjaGVzID0gb3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LnRvdWNoZXMsXG4gICAgICAgICAgZSA9IGV2ZW50LFxuICAgICAgICAgIGRyYWdUeXBlLFxuICAgICAgICAgIGRyYWdTdGFydEV2ZW50LFxuICAgICAgICAgIHRvdWNoZXNMZW5ndGg7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvdWNoZXMpIHtcbiAgICAgICAgdG91Y2hlc0xlbmd0aCA9IHRvdWNoZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0b3VjaGVzTGVuZ3RoID4gMSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMudG91Y2hEcmFnWm9vbSAmJiB0b3VjaGVzTGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBlID0gdG91Y2hlc1sxXTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRYMiA9IGUucGFnZVg7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WTIgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgZHJhZ1R5cGUgPSAnem9vbSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlID0gdG91Y2hlc1swXTtcbiAgICAgIH1cblxuICAgICAgZHJhZ1R5cGUgPSBkcmFnVHlwZSB8fCAkKGUudGFyZ2V0KS5kYXRhKCdkcmFnJyk7XG5cbiAgICAgIGlmIChSRUdFWFBfRFJBR19UWVBFUy50ZXN0KGRyYWdUeXBlKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRyYWdTdGFydEV2ZW50ID0gJC5FdmVudChFVkVOVF9EUkFHX1NUQVJULCB7XG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgICBkcmFnVHlwZTogZHJhZ1R5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGRyYWdTdGFydEV2ZW50KTtcblxuICAgICAgICBpZiAoZHJhZ1N0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdUeXBlID0gZHJhZ1R5cGU7XG4gICAgICAgIHRoaXMuY3JvcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGFydFggPSBlLnBhZ2VYO1xuICAgICAgICB0aGlzLnN0YXJ0WSA9IGUucGFnZVk7XG5cbiAgICAgICAgaWYgKGRyYWdUeXBlID09PSAnY3JvcCcpIHtcbiAgICAgICAgICB0aGlzLmNyb3BwaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLiRkcmFnQm94LmFkZENsYXNzKENMQVNTX01PREFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBkcmFnbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICB0b3VjaGVzID0gb3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LnRvdWNoZXMsXG4gICAgICAgICAgZSA9IGV2ZW50LFxuICAgICAgICAgIGRyYWdUeXBlID0gdGhpcy5kcmFnVHlwZSxcbiAgICAgICAgICBkcmFnTW92ZUV2ZW50LFxuICAgICAgICAgIHRvdWNoZXNMZW5ndGg7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvdWNoZXMpIHtcbiAgICAgICAgdG91Y2hlc0xlbmd0aCA9IHRvdWNoZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0b3VjaGVzTGVuZ3RoID4gMSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMudG91Y2hEcmFnWm9vbSAmJiB0b3VjaGVzTGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBlID0gdG91Y2hlc1sxXTtcbiAgICAgICAgICAgIHRoaXMuZW5kWDIgPSBlLnBhZ2VYO1xuICAgICAgICAgICAgdGhpcy5lbmRZMiA9IGUucGFnZVk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlID0gdG91Y2hlc1swXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRyYWdUeXBlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgZHJhZ01vdmVFdmVudCA9ICQuRXZlbnQoRVZFTlRfRFJBR19NT1ZFLCB7XG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgICBkcmFnVHlwZTogZHJhZ1R5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGRyYWdNb3ZlRXZlbnQpO1xuXG4gICAgICAgIGlmIChkcmFnTW92ZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbmRYID0gZS5wYWdlWDtcbiAgICAgICAgdGhpcy5lbmRZID0gZS5wYWdlWTtcblxuICAgICAgICB0aGlzLmNoYW5nZShlLnNoaWZ0S2V5KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZHJhZ2VuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgZHJhZ1R5cGUgPSB0aGlzLmRyYWdUeXBlLFxuICAgICAgICAgIGRyYWdFbmRFdmVudDtcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZHJhZ1R5cGUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkcmFnRW5kRXZlbnQgPSAkLkV2ZW50KEVWRU5UX0RSQUdfRU5ELCB7XG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICBkcmFnVHlwZTogZHJhZ1R5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGRyYWdFbmRFdmVudCk7XG5cbiAgICAgICAgaWYgKGRyYWdFbmRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNyb3BwaW5nKSB7XG4gICAgICAgICAgdGhpcy5jcm9wcGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuJGRyYWdCb3gudG9nZ2xlQ2xhc3MoQ0xBU1NfTU9EQUwsIHRoaXMuY3JvcHBlZCAmJiB0aGlzLm9wdGlvbnMubW9kYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnVHlwZSA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgJC5leHRlbmQocHJvdG90eXBlLCB7XG4gICAgY3JvcDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmJ1aWx0IHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuY3JvcHBlZCkge1xuICAgICAgICB0aGlzLmNyb3BwZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxpbWl0Q3JvcEJveCh0cnVlLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1vZGFsKSB7XG4gICAgICAgICAgdGhpcy4kZHJhZ0JveC5hZGRDbGFzcyhDTEFTU19NT0RBTCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRjcm9wQm94LnJlbW92ZUNsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q3JvcEJveERhdGEodGhpcy5pbml0aWFsQ3JvcEJveCk7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuYnVpbHQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW1hZ2UgPSAkLmV4dGVuZCh7fSwgdGhpcy5pbml0aWFsSW1hZ2UpO1xuICAgICAgdGhpcy5jYW52YXMgPSAkLmV4dGVuZCh7fSwgdGhpcy5pbml0aWFsQ2FudmFzKTtcbiAgICAgIHRoaXMuY3JvcEJveCA9ICQuZXh0ZW5kKHt9LCB0aGlzLmluaXRpYWxDcm9wQm94KTsgLy8gcmVxdWlyZWQgZm9yIHN0cmljdCBtb2RlXG5cbiAgICAgIHRoaXMucmVuZGVyQ2FudmFzKCk7XG5cbiAgICAgIGlmICh0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuY3JvcHBlZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJC5leHRlbmQodGhpcy5jcm9wQm94LCB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY3JvcHBlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG5cbiAgICAgIHRoaXMubGltaXRDYW52YXMoKTtcbiAgICAgIHRoaXMucmVuZGVyQ2FudmFzKCk7IC8vIFJlbmRlciBjYW52YXMgYWZ0ZXIgcmVuZGVyIGNyb3AgYm94XG5cbiAgICAgIHRoaXMuJGRyYWdCb3gucmVtb3ZlQ2xhc3MoQ0xBU1NfTU9EQUwpO1xuICAgICAgdGhpcy4kY3JvcEJveC5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSB0aGlzLiRlbGVtZW50O1xuXG4gICAgICBpZiAodGhpcy5yZWFkeSkge1xuICAgICAgICB0aGlzLnVuYnVpbGQoKTtcbiAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy4kY2xvbmUpIHtcbiAgICAgICAgdGhpcy4kY2xvbmUucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgICR0aGlzLnJlbW92ZURhdGEoJ2Nyb3BwZXInKTtcbiAgICB9LFxuXG4gICAgcmVwbGFjZTogZnVuY3Rpb24gKHVybCkge1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHVybCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IG51bGw7IC8vIFJlbW92ZSBwcmV2aW91cyBkYXRhXG4gICAgICAgIHRoaXMubG9hZCh1cmwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmJ1aWx0KSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kY3JvcHBlci5yZW1vdmVDbGFzcyhDTEFTU19ESVNBQkxFRCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmJ1aWx0KSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRjcm9wcGVyLmFkZENsYXNzKENMQVNTX0RJU0FCTEVEKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24gKG9mZnNldFgsIG9mZnNldFkpIHtcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhcztcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5vcHRpb25zLm1vdmFibGUgJiYgaXNOdW1iZXIob2Zmc2V0WCkgJiYgaXNOdW1iZXIob2Zmc2V0WSkpIHtcbiAgICAgICAgY2FudmFzLmxlZnQgKz0gb2Zmc2V0WDtcbiAgICAgICAgY2FudmFzLnRvcCArPSBvZmZzZXRZO1xuICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgem9vbTogZnVuY3Rpb24gKGRlbHRhKSB7XG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgem9vbUV2ZW50LFxuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodDtcblxuICAgICAgZGVsdGEgPSBudW0oZGVsdGEpO1xuXG4gICAgICBpZiAoZGVsdGEgJiYgdGhpcy5idWlsdCAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wdGlvbnMuem9vbWFibGUpIHtcbiAgICAgICAgem9vbUV2ZW50ID0gZGVsdGEgPiAwID8gJC5FdmVudChFVkVOVF9aT09NX0lOKSA6ICQuRXZlbnQoRVZFTlRfWk9PTV9PVVQpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoem9vbUV2ZW50KTtcblxuICAgICAgICBpZiAoem9vbUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsdGEgPSBkZWx0YSA8PSAtMSA/IDEgLyAoMSAtIGRlbHRhKSA6IGRlbHRhIDw9IDEgPyAoMSArIGRlbHRhKSA6IGRlbHRhO1xuICAgICAgICB3aWR0aCA9IGNhbnZhcy53aWR0aCAqIGRlbHRhO1xuICAgICAgICBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0ICogZGVsdGE7XG4gICAgICAgIGNhbnZhcy5sZWZ0IC09ICh3aWR0aCAtIGNhbnZhcy53aWR0aCkgLyAyO1xuICAgICAgICBjYW52YXMudG9wIC09IChoZWlnaHQgLSBjYW52YXMuaGVpZ2h0KSAvIDI7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgICAgdGhpcy5zZXREcmFnTW9kZSgnbW92ZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByb3RhdGU6IGZ1bmN0aW9uIChkZWdyZWUpIHtcbiAgICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2U7XG5cbiAgICAgIGRlZ3JlZSA9IG51bShkZWdyZWUpO1xuXG4gICAgICBpZiAoZGVncmVlICYmIHRoaXMuYnVpbHQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5vcHRpb25zLnJvdGF0YWJsZSkge1xuICAgICAgICBpbWFnZS5yb3RhdGUgPSAoaW1hZ2Uucm90YXRlICsgZGVncmVlKSAlIDM2MDtcbiAgICAgICAgdGhpcy5yb3RhdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldERhdGE6IGZ1bmN0aW9uIChyb3VuZGVkKSB7XG4gICAgICB2YXIgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgcmF0aW8sXG4gICAgICAgICAgZGF0YTtcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgdGhpcy5jcm9wcGVkKSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgeDogY3JvcEJveC5sZWZ0IC0gY2FudmFzLmxlZnQsXG4gICAgICAgICAgeTogY3JvcEJveC50b3AgLSBjYW52YXMudG9wLFxuICAgICAgICAgIHdpZHRoOiBjcm9wQm94LndpZHRoLFxuICAgICAgICAgIGhlaWdodDogY3JvcEJveC5oZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICByYXRpbyA9IGltYWdlLndpZHRoIC8gaW1hZ2UubmF0dXJhbFdpZHRoO1xuXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAgIG4gPSBuIC8gcmF0aW87XG4gICAgICAgICAgZGF0YVtpXSA9IHJvdW5kZWQgPyBNYXRoLnJvdW5kKG4pIDogbjtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwLFxuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBkYXRhLnJvdGF0ZSA9IHRoaXMucmVhZHkgPyBpbWFnZS5yb3RhdGUgOiAwO1xuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuXG4gICAgc2V0RGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgY3JvcEJveERhdGEgPSB7fSxcbiAgICAgICAgICByYXRpbztcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgJC5pc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLnJvdGF0ZSkgJiYgZGF0YS5yb3RhdGUgIT09IGltYWdlLnJvdGF0ZSAmJiB0aGlzLm9wdGlvbnMucm90YXRhYmxlKSB7XG4gICAgICAgICAgaW1hZ2Uucm90YXRlID0gZGF0YS5yb3RhdGU7XG4gICAgICAgICAgdGhpcy5yb3RhdGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJhdGlvID0gaW1hZ2Uud2lkdGggLyBpbWFnZS5uYXR1cmFsV2lkdGg7XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEueCkpIHtcbiAgICAgICAgICBjcm9wQm94RGF0YS5sZWZ0ID0gZGF0YS54ICogcmF0aW8gKyBjYW52YXMubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLnkpKSB7XG4gICAgICAgICAgY3JvcEJveERhdGEudG9wID0gZGF0YS55ICogcmF0aW8gKyBjYW52YXMudG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEud2lkdGgpKSB7XG4gICAgICAgICAgY3JvcEJveERhdGEud2lkdGggPSBkYXRhLndpZHRoICogcmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5oZWlnaHQpKSB7XG4gICAgICAgICAgY3JvcEJveERhdGEuaGVpZ2h0ID0gZGF0YS5oZWlnaHQgKiByYXRpbztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q3JvcEJveERhdGEoY3JvcEJveERhdGEpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRDb250YWluZXJEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsdCA/IHRoaXMuY29udGFpbmVyIDoge307XG4gICAgfSxcblxuICAgIGdldEltYWdlRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkgPyB0aGlzLmltYWdlIDoge307XG4gICAgfSxcblxuICAgIGdldENhbnZhc0RhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBkYXRhO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCkge1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIGxlZnQ6IGNhbnZhcy5sZWZ0LFxuICAgICAgICAgIHRvcDogY2FudmFzLnRvcCxcbiAgICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YSB8fCB7fTtcbiAgICB9LFxuXG4gICAgc2V0Q2FudmFzRGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IGNhbnZhcy5hc3BlY3RSYXRpbztcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgJC5pc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLmxlZnQpKSB7XG4gICAgICAgICAgY2FudmFzLmxlZnQgPSBkYXRhLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS50b3ApKSB7XG4gICAgICAgICAgY2FudmFzLnRvcCA9IGRhdGEudG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEud2lkdGgpKSB7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gZGF0YS53aWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZGF0YS53aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKGRhdGEuaGVpZ2h0KSkge1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBkYXRhLmhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldENyb3BCb3hEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgICBkYXRhO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiB0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBsZWZ0OiBjcm9wQm94LmxlZnQsXG4gICAgICAgICAgdG9wOiBjcm9wQm94LnRvcCxcbiAgICAgICAgICB3aWR0aDogY3JvcEJveC53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGNyb3BCb3guaGVpZ2h0XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhIHx8IHt9O1xuICAgIH0sXG5cbiAgICBzZXRDcm9wQm94RGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gdGhpcy5vcHRpb25zLmFzcGVjdFJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiB0aGlzLmNyb3BwZWQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgJC5pc1BsYWluT2JqZWN0KGRhdGEpKSB7XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEubGVmdCkpIHtcbiAgICAgICAgICBjcm9wQm94LmxlZnQgPSBkYXRhLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS50b3ApKSB7XG4gICAgICAgICAgY3JvcEJveC50b3AgPSBkYXRhLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSkge1xuICAgICAgICAgIGNyb3BCb3gud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEuaGVpZ2h0KSkge1xuICAgICAgICAgIGNyb3BCb3guaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS53aWR0aCkpIHtcbiAgICAgICAgICAgIGNyb3BCb3guaGVpZ2h0ID0gY3JvcEJveC53aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoZGF0YS5oZWlnaHQpKSB7XG4gICAgICAgICAgICBjcm9wQm94LndpZHRoID0gY3JvcEJveC5oZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0Q3JvcHBlZENhbnZhczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIHZhciBvcmlnaW5hbFdpZHRoLFxuICAgICAgICAgIG9yaWdpbmFsSGVpZ2h0LFxuICAgICAgICAgIGNhbnZhc1dpZHRoLFxuICAgICAgICAgIGNhbnZhc0hlaWdodCxcbiAgICAgICAgICBzY2FsZWRXaWR0aCxcbiAgICAgICAgICBzY2FsZWRIZWlnaHQsXG4gICAgICAgICAgc2NhbGVkUmF0aW8sXG4gICAgICAgICAgYXNwZWN0UmF0aW8sXG4gICAgICAgICAgY2FudmFzLFxuICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgZGF0YTtcblxuICAgICAgaWYgKCF0aGlzLmJ1aWx0IHx8ICF0aGlzLmNyb3BwZWQgfHwgIVNVUFBPUlRfQ0FOVkFTKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG4gICAgICBvcmlnaW5hbFdpZHRoID0gZGF0YS53aWR0aDtcbiAgICAgIG9yaWdpbmFsSGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICBhc3BlY3RSYXRpbyA9IG9yaWdpbmFsV2lkdGggLyBvcmlnaW5hbEhlaWdodDtcblxuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgICBzY2FsZWRXaWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgICAgIHNjYWxlZEhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXG4gICAgICAgIGlmIChzY2FsZWRXaWR0aCkge1xuICAgICAgICAgIHNjYWxlZEhlaWdodCA9IHNjYWxlZFdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgc2NhbGVkUmF0aW8gPSBzY2FsZWRXaWR0aCAvIG9yaWdpbmFsV2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAoc2NhbGVkSGVpZ2h0KSB7XG4gICAgICAgICAgc2NhbGVkV2lkdGggPSBzY2FsZWRIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICBzY2FsZWRSYXRpbyA9IHNjYWxlZEhlaWdodCAvIG9yaWdpbmFsSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbnZhc1dpZHRoID0gc2NhbGVkV2lkdGggfHwgb3JpZ2luYWxXaWR0aDtcbiAgICAgIGNhbnZhc0hlaWdodCA9IHNjYWxlZEhlaWdodCB8fCBvcmlnaW5hbEhlaWdodDtcblxuICAgICAgY2FudmFzID0gJCgnPGNhbnZhcz4nKVswXTtcbiAgICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodDtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgaWYgKG9wdGlvbnMuZmlsbENvbG9yKSB7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsQ29sb3I7XG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQuZHJhd0ltYWdlXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZS5hcHBseShjb250ZXh0LCAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlID0gZ2V0U291cmNlQ2FudmFzKHRoaXMuJGNsb25lWzBdLCB0aGlzLmltYWdlKSxcbiAgICAgICAgICAgIHNvdXJjZVdpZHRoID0gc291cmNlLndpZHRoLFxuICAgICAgICAgICAgc291cmNlSGVpZ2h0ID0gc291cmNlLmhlaWdodCxcbiAgICAgICAgICAgIGFyZ3MgPSBbc291cmNlXSxcbiAgICAgICAgICAgIHNyY1ggPSBkYXRhLngsIC8vIHNvdXJjZSBjYW52YXNcbiAgICAgICAgICAgIHNyY1kgPSBkYXRhLnksXG4gICAgICAgICAgICBzcmNXaWR0aCxcbiAgICAgICAgICAgIHNyY0hlaWdodCxcbiAgICAgICAgICAgIGRzdFgsIC8vIGRlc3RpbmF0aW9uIGNhbnZhc1xuICAgICAgICAgICAgZHN0WSxcbiAgICAgICAgICAgIGRzdFdpZHRoLFxuICAgICAgICAgICAgZHN0SGVpZ2h0O1xuXG4gICAgICAgIGlmIChzcmNYIDw9IC1vcmlnaW5hbFdpZHRoIHx8IHNyY1ggPiBzb3VyY2VXaWR0aCkge1xuICAgICAgICAgIHNyY1ggPSBzcmNXaWR0aCA9IGRzdFggPSBkc3RXaWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3JjWCA8PSAwKSB7XG4gICAgICAgICAgZHN0WCA9IC1zcmNYO1xuICAgICAgICAgIHNyY1ggPSAwO1xuICAgICAgICAgIHNyY1dpZHRoID0gZHN0V2lkdGggPSBtaW4oc291cmNlV2lkdGgsIG9yaWdpbmFsV2lkdGggKyBzcmNYKTtcbiAgICAgICAgfSBlbHNlIGlmIChzcmNYIDw9IHNvdXJjZVdpZHRoKSB7XG4gICAgICAgICAgZHN0WCA9IDA7XG4gICAgICAgICAgc3JjV2lkdGggPSBkc3RXaWR0aCA9IG1pbihvcmlnaW5hbFdpZHRoLCBzb3VyY2VXaWR0aCAtIHNyY1gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNyY1dpZHRoIDw9IDAgfHwgc3JjWSA8PSAtb3JpZ2luYWxIZWlnaHQgfHwgc3JjWSA+IHNvdXJjZUhlaWdodCkge1xuICAgICAgICAgIHNyY1kgPSBzcmNIZWlnaHQgPSBkc3RZID0gZHN0SGVpZ2h0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChzcmNZIDw9IDApIHtcbiAgICAgICAgICBkc3RZID0gLXNyY1k7XG4gICAgICAgICAgc3JjWSA9IDA7XG4gICAgICAgICAgc3JjSGVpZ2h0ID0gZHN0SGVpZ2h0ID0gbWluKHNvdXJjZUhlaWdodCwgb3JpZ2luYWxIZWlnaHQgKyBzcmNZKTtcbiAgICAgICAgfSBlbHNlIGlmIChzcmNZIDw9IHNvdXJjZUhlaWdodCkge1xuICAgICAgICAgIGRzdFkgPSAwO1xuICAgICAgICAgIHNyY0hlaWdodCA9IGRzdEhlaWdodCA9IG1pbihvcmlnaW5hbEhlaWdodCwgc291cmNlSGVpZ2h0IC0gc3JjWSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzLnB1c2goc3JjWCwgc3JjWSwgc3JjV2lkdGgsIHNyY0hlaWdodCk7XG5cbiAgICAgICAgLy8gU2NhbGUgZGVzdGluYXRpb24gc2l6ZXNcbiAgICAgICAgaWYgKHNjYWxlZFJhdGlvKSB7XG4gICAgICAgICAgZHN0WCAqPSBzY2FsZWRSYXRpbztcbiAgICAgICAgICBkc3RZICo9IHNjYWxlZFJhdGlvO1xuICAgICAgICAgIGRzdFdpZHRoICo9IHNjYWxlZFJhdGlvO1xuICAgICAgICAgIGRzdEhlaWdodCAqPSBzY2FsZWRSYXRpbztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF2b2lkIFwiSW5kZXhTaXplRXJyb3JcIiBpbiBJRSBhbmQgRmlyZWZveFxuICAgICAgICBpZiAoZHN0V2lkdGggPiAwICYmIGRzdEhlaWdodCA+IDApIHtcbiAgICAgICAgICBhcmdzLnB1c2goZHN0WCwgZHN0WSwgZHN0V2lkdGgsIGRzdEhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJncztcbiAgICAgIH0pLmNhbGwodGhpcykpO1xuXG4gICAgICByZXR1cm4gY2FudmFzO1xuICAgIH0sXG5cbiAgICBzZXRBc3BlY3RSYXRpbzogZnVuY3Rpb24gKGFzcGVjdFJhdGlvKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICFpc1VuZGVmaW5lZChhc3BlY3RSYXRpbykpIHtcbiAgICAgICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IG51bShhc3BlY3RSYXRpbykgfHwgTmFOOyAvLyAwIC0+IE5hTlxuXG4gICAgICAgIGlmICh0aGlzLmJ1aWx0KSB7XG4gICAgICAgICAgdGhpcy5pbml0Q3JvcEJveCgpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuY3JvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNldERyYWdNb2RlOiBmdW5jdGlvbiAobW9kZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgY3JvcHBhYmxlLFxuICAgICAgICAgIG1vdmFibGU7XG5cbiAgICAgIGlmICh0aGlzLnJlYWR5ICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIGNyb3BwYWJsZSA9IG9wdGlvbnMuZHJhZ0Nyb3AgJiYgbW9kZSA9PT0gJ2Nyb3AnO1xuICAgICAgICBtb3ZhYmxlID0gb3B0aW9ucy5tb3ZhYmxlICYmIG1vZGUgPT09ICdtb3ZlJztcbiAgICAgICAgbW9kZSA9IChjcm9wcGFibGUgfHwgbW92YWJsZSkgPyBtb2RlIDogJ25vbmUnO1xuXG4gICAgICAgIHRoaXMuJGRyYWdCb3guZGF0YSgnZHJhZycsIG1vZGUpLnRvZ2dsZUNsYXNzKENMQVNTX0NST1AsIGNyb3BwYWJsZSkudG9nZ2xlQ2xhc3MoQ0xBU1NfTU9WRSwgbW92YWJsZSk7XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmNyb3BCb3hNb3ZhYmxlKSB7XG4gICAgICAgICAgLy8gU3luYyBkcmFnIG1vZGUgdG8gY3JvcCBib3ggd2hlbiBpdCBpcyBub3QgbW92YWJsZSgjMzAwKVxuICAgICAgICAgIHRoaXMuJGZhY2UuZGF0YSgnZHJhZycsIG1vZGUpLnRvZ2dsZUNsYXNzKENMQVNTX0NST1AsIGNyb3BwYWJsZSkudG9nZ2xlQ2xhc3MoQ0xBU1NfTU9WRSwgbW92YWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbiAoc2hpZnRLZXkpIHtcbiAgICB2YXIgZHJhZ1R5cGUgPSB0aGlzLmRyYWdUeXBlLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgIHdpZHRoID0gY3JvcEJveC53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gY3JvcEJveC5oZWlnaHQsXG4gICAgICAgIGxlZnQgPSBjcm9wQm94LmxlZnQsXG4gICAgICAgIHRvcCA9IGNyb3BCb3gudG9wLFxuICAgICAgICByaWdodCA9IGxlZnQgKyB3aWR0aCxcbiAgICAgICAgYm90dG9tID0gdG9wICsgaGVpZ2h0LFxuICAgICAgICBtaW5MZWZ0ID0gMCxcbiAgICAgICAgbWluVG9wID0gMCxcbiAgICAgICAgbWF4V2lkdGggPSBjb250YWluZXIud2lkdGgsXG4gICAgICAgIG1heEhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQsXG4gICAgICAgIHJlbmRlcmFibGUgPSB0cnVlLFxuICAgICAgICBhc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW8sXG4gICAgICAgIHJhbmdlID0ge1xuICAgICAgICAgIHg6IHRoaXMuZW5kWCAtIHRoaXMuc3RhcnRYLFxuICAgICAgICAgIHk6IHRoaXMuZW5kWSAtIHRoaXMuc3RhcnRZXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDtcblxuICAgIC8vIExvY2tpbmcgYXNwZWN0IHJhdGlvIGluIFwiZnJlZSBtb2RlXCIgYnkgaG9sZGluZyBzaGlmdCBrZXkgKCMyNTkpXG4gICAgaWYgKCFhc3BlY3RSYXRpbyAmJiBzaGlmdEtleSkge1xuICAgICAgYXNwZWN0UmF0aW8gPSB3aWR0aCAmJiBoZWlnaHQgPyB3aWR0aCAvIGhlaWdodCA6IDE7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBtaW5MZWZ0ID0gY3JvcEJveC5taW5MZWZ0O1xuICAgICAgbWluVG9wID0gY3JvcEJveC5taW5Ub3A7XG4gICAgICBtYXhXaWR0aCA9IG1pbkxlZnQgKyBtaW4oY29udGFpbmVyLndpZHRoLCBjYW52YXMud2lkdGgpO1xuICAgICAgbWF4SGVpZ2h0ID0gbWluVG9wICsgbWluKGNvbnRhaW5lci5oZWlnaHQsIGNhbnZhcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgcmFuZ2UuWCA9IHJhbmdlLnkgKiBhc3BlY3RSYXRpbztcbiAgICAgIHJhbmdlLlkgPSByYW5nZS54IC8gYXNwZWN0UmF0aW87XG4gICAgfVxuXG4gICAgc3dpdGNoIChkcmFnVHlwZSkge1xuICAgICAgLy8gTW92ZSBjcm9wQm94XG4gICAgICBjYXNlICdhbGwnOlxuICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gUmVzaXplIGNyb3BCb3hcbiAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBpZiAocmFuZ2UueCA+PSAwICYmIChyaWdodCA+PSBtYXhXaWR0aCB8fCBhc3BlY3RSYXRpbyAmJiAodG9wIDw9IG1pblRvcCB8fCBib3R0b20gPj0gbWF4SGVpZ2h0KSkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgdG9wIC09IHJhbmdlLlkgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3cnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICduJzpcbiAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCAmJiAodG9wIDw9IG1pblRvcCB8fCBhc3BlY3RSYXRpbyAmJiAobGVmdCA8PSBtaW5MZWZ0IHx8IHJpZ2h0ID49IG1heFdpZHRoKSkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgdG9wICs9IHJhbmdlLnk7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICBsZWZ0ICs9IHJhbmdlLlggLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBpZiAocmFuZ2UueCA8PSAwICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgYXNwZWN0UmF0aW8gJiYgKHRvcCA8PSBtaW5Ub3AgfHwgYm90dG9tID49IG1heEhlaWdodCkpKSB7XG4gICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgbGVmdCArPSByYW5nZS54O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgdG9wICs9IHJhbmdlLlkgLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ2UnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzJzpcbiAgICAgICAgaWYgKHJhbmdlLnkgPj0gMCAmJiAoYm90dG9tID49IG1heEhlaWdodCB8fCBhc3BlY3RSYXRpbyAmJiAobGVmdCA8PSBtaW5MZWZ0IHx8IHJpZ2h0ID49IG1heFdpZHRoKSkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIGxlZnQgLT0gcmFuZ2UuWCAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ24nO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbmUnOlxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwICYmICh0b3AgPD0gbWluVG9wIHx8IHJpZ2h0ID49IG1heFdpZHRoKSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA+PSAwKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW5nZS55IDw9IDAgJiYgdG9wIDw9IG1pblRvcCkge1xuICAgICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCkge1xuICAgICAgICAgICAgaWYgKHRvcCA+IG1pblRvcCkge1xuICAgICAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCAmJiBoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc3cnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ253JztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3NlJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ253JzpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCAmJiAodG9wIDw9IG1pblRvcCB8fCBsZWZ0IDw9IG1pbkxlZnQpKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIGxlZnQgKz0gcmFuZ2UuWDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA8PSAwKSB7XG4gICAgICAgICAgICBpZiAobGVmdCA+IG1pbkxlZnQpIHtcbiAgICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW5nZS55IDw9IDAgJiYgdG9wIDw9IG1pblRvcCkge1xuICAgICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCkge1xuICAgICAgICAgICAgaWYgKHRvcCA+IG1pblRvcCkge1xuICAgICAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCAmJiBoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc2UnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ25lJztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3N3JztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N3JzpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPD0gMCAmJiAobGVmdCA8PSBtaW5MZWZ0IHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54IDw9IDApIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID4gbWluTGVmdCkge1xuICAgICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPj0gMCAmJiBib3R0b20gPj0gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoYm90dG9tIDwgbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICduZSc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc2UnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbncnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2UnOlxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA+PSAwICYmIChyaWdodCA+PSBtYXhXaWR0aCB8fCBib3R0b20gPj0gbWF4SGVpZ2h0KSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54ID49IDApIHtcbiAgICAgICAgICAgIGlmIChyaWdodCA8IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPj0gMCAmJiBib3R0b20gPj0gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoYm90dG9tIDwgbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdudyc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc3cnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbmUnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgLy8gTW92ZSBpbWFnZVxuICAgICAgY2FzZSAnbW92ZSc6XG4gICAgICAgIGNhbnZhcy5sZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgIGNhbnZhcy50b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIFNjYWxlIGltYWdlXG4gICAgICBjYXNlICd6b29tJzpcbiAgICAgICAgdGhpcy56b29tKGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICAgIHZhciB6MSA9IHNxcnQoeDEgKiB4MSArIHkxICogeTEpLFxuICAgICAgICAgICAgICB6MiA9IHNxcnQoeDIgKiB4MiArIHkyICogeTIpO1xuXG4gICAgICAgICAgcmV0dXJuICh6MiAtIHoxKSAvIHoxO1xuICAgICAgICB9KFxuICAgICAgICAgIGFicyh0aGlzLnN0YXJ0WCAtIHRoaXMuc3RhcnRYMiksXG4gICAgICAgICAgYWJzKHRoaXMuc3RhcnRZIC0gdGhpcy5zdGFydFkyKSxcbiAgICAgICAgICBhYnModGhpcy5lbmRYIC0gdGhpcy5lbmRYMiksXG4gICAgICAgICAgYWJzKHRoaXMuZW5kWSAtIHRoaXMuZW5kWTIpXG4gICAgICAgICkpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRYMiA9IHRoaXMuZW5kWDI7XG4gICAgICAgIHRoaXMuc3RhcnRZMiA9IHRoaXMuZW5kWTI7XG4gICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIENyb3AgaW1hZ2VcbiAgICAgIGNhc2UgJ2Nyb3AnOlxuICAgICAgICBpZiAocmFuZ2UueCAmJiByYW5nZS55KSB7XG4gICAgICAgICAgb2Zmc2V0ID0gdGhpcy4kY3JvcHBlci5vZmZzZXQoKTtcbiAgICAgICAgICBsZWZ0ID0gdGhpcy5zdGFydFggLSBvZmZzZXQubGVmdDtcbiAgICAgICAgICB0b3AgPSB0aGlzLnN0YXJ0WSAtIG9mZnNldC50b3A7XG4gICAgICAgICAgd2lkdGggPSBjcm9wQm94Lm1pbldpZHRoO1xuICAgICAgICAgIGhlaWdodCA9IGNyb3BCb3gubWluSGVpZ2h0O1xuXG4gICAgICAgICAgaWYgKHJhbmdlLnggPiAwKSB7XG4gICAgICAgICAgICBpZiAocmFuZ2UueSA+IDApIHtcbiAgICAgICAgICAgICAgZHJhZ1R5cGUgPSAnc2UnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZHJhZ1R5cGUgPSAnbmUnO1xuICAgICAgICAgICAgICB0b3AgLT0gaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmFuZ2UueSA+IDApIHtcbiAgICAgICAgICAgICAgZHJhZ1R5cGUgPSAnc3cnO1xuICAgICAgICAgICAgICBsZWZ0IC09IHdpZHRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZHJhZ1R5cGUgPSAnbncnO1xuICAgICAgICAgICAgICBsZWZ0IC09IHdpZHRoO1xuICAgICAgICAgICAgICB0b3AgLT0gaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNob3cgdGhlIGNyb3BCb3ggaWYgaXMgaGlkZGVuXG4gICAgICAgICAgaWYgKCF0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLiRjcm9wQm94LnJlbW92ZUNsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIE5vIGRlZmF1bHRcbiAgICB9XG5cbiAgICBpZiAocmVuZGVyYWJsZSkge1xuICAgICAgY3JvcEJveC53aWR0aCA9IHdpZHRoO1xuICAgICAgY3JvcEJveC5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBjcm9wQm94LmxlZnQgPSBsZWZ0O1xuICAgICAgY3JvcEJveC50b3AgPSB0b3A7XG4gICAgICB0aGlzLmRyYWdUeXBlID0gZHJhZ1R5cGU7XG5cbiAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuICAgIH1cblxuICAgIC8vIE92ZXJyaWRlXG4gICAgdGhpcy5zdGFydFggPSB0aGlzLmVuZFg7XG4gICAgdGhpcy5zdGFydFkgPSB0aGlzLmVuZFk7XG4gIH07XG5cbiAgJC5leHRlbmQoQ3JvcHBlci5wcm90b3R5cGUsIHByb3RvdHlwZSk7XG5cbiAgQ3JvcHBlci5ERUZBVUxUUyA9IHtcbiAgICAvLyBEZWZpbmVzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGNyb3AgYm94XG4gICAgLy8gVHlwZTogTnVtYmVyXG4gICAgYXNwZWN0UmF0aW86IE5hTixcblxuICAgIC8vIERlZmluZXMgdGhlIHBlcmNlbnRhZ2Ugb2YgYXV0b21hdGljIGNyb3BwaW5nIGFyZWEgd2hlbiBpbml0aWFsaXplc1xuICAgIC8vIFR5cGU6IE51bWJlciAoTXVzdCBsYXJnZSB0aGFuIDAgYW5kIGxlc3MgdGhhbiAxKVxuICAgIGF1dG9Dcm9wQXJlYTogMC44LCAvLyA4MCVcblxuICAgIC8vIE91dHB1dHMgdGhlIGNyb3BwaW5nIHJlc3VsdHMuXG4gICAgLy8gVHlwZTogRnVuY3Rpb25cbiAgICBjcm9wOiBudWxsLFxuXG4gICAgLy8gUHJldmlvdXMvbGF0ZXN0IGNyb3AgZGF0YVxuICAgIC8vIFR5cGU6IE9iamVjdFxuICAgIGRhdGE6IG51bGwsXG5cbiAgICAvLyBBZGQgZXh0cmEgY29udGFpbmVycyBmb3IgcHJldmlld2luZ1xuICAgIC8vIFR5cGU6IFN0cmluZyAoalF1ZXJ5IHNlbGVjdG9yKVxuICAgIHByZXZpZXc6ICcnLFxuXG4gICAgLy8gVG9nZ2xlc1xuICAgIHN0cmljdDogdHJ1ZSwgLy8gc3RyaWN0IG1vZGUsIHRoZSBpbWFnZSBjYW5ub3Qgem9vbSBvdXQgbGVzcyB0aGFuIHRoZSBjb250YWluZXJcbiAgICByZXNwb25zaXZlOiB0cnVlLCAvLyBSZWJ1aWxkIHdoZW4gcmVzaXplIHRoZSB3aW5kb3dcbiAgICBjaGVja0ltYWdlT3JpZ2luOiB0cnVlLCAvLyBDaGVjayBpZiB0aGUgdGFyZ2V0IGltYWdlIGlzIGNyb3NzIG9yaWdpblxuXG4gICAgbW9kYWw6IHRydWUsIC8vIFNob3cgdGhlIGJsYWNrIG1vZGFsXG4gICAgZ3VpZGVzOiB0cnVlLCAvLyBTaG93IHRoZSBkYXNoZWQgbGluZXMgZm9yIGd1aWRpbmdcbiAgICBoaWdobGlnaHQ6IHRydWUsIC8vIFNob3cgdGhlIHdoaXRlIG1vZGFsIHRvIGhpZ2hsaWdodCB0aGUgY3JvcCBib3hcbiAgICBiYWNrZ3JvdW5kOiB0cnVlLCAvLyBTaG93IHRoZSBncmlkIGJhY2tncm91bmRcblxuICAgIGF1dG9Dcm9wOiB0cnVlLCAvLyBFbmFibGUgdG8gY3JvcCB0aGUgaW1hZ2UgYXV0b21hdGljYWxseSB3aGVuIGluaXRpYWxpemVcbiAgICBkcmFnQ3JvcDogdHJ1ZSwgLy8gRW5hYmxlIHRvIGNyZWF0ZSBuZXcgY3JvcCBib3ggYnkgZHJhZ2dpbmcgb3ZlciB0aGUgaW1hZ2VcbiAgICBtb3ZhYmxlOiB0cnVlLCAvLyBFbmFibGUgdG8gbW92ZSB0aGUgaW1hZ2VcbiAgICByb3RhdGFibGU6IHRydWUsIC8vIEVuYWJsZSB0byByb3RhdGUgdGhlIGltYWdlXG4gICAgem9vbWFibGU6IHRydWUsIC8vIEVuYWJsZSB0byB6b29tIHRoZSBpbWFnZVxuICAgIHRvdWNoRHJhZ1pvb206IHRydWUsIC8vIEVuYWJsZSB0byB6b29tIHRoZSBpbWFnZSBieSB3aGVlbGluZyBtb3VzZVxuICAgIG1vdXNlV2hlZWxab29tOiB0cnVlLCAvLyBFbmFibGUgdG8gem9vbSB0aGUgaW1hZ2UgYnkgZHJhZ2dpbmcgdG91Y2hcbiAgICBjcm9wQm94TW92YWJsZTogdHJ1ZSwgLy8gRW5hYmxlIHRvIG1vdmUgdGhlIGNyb3AgYm94XG4gICAgY3JvcEJveFJlc2l6YWJsZTogdHJ1ZSwgLy8gRW5hYmxlIHRvIHJlc2l6ZSB0aGUgY3JvcCBib3hcbiAgICBkb3VibGVDbGlja1RvZ2dsZTogdHJ1ZSwgLy8gVG9nZ2xlIGRyYWcgbW9kZSBiZXR3ZWVuIFwiY3JvcFwiIGFuZCBcIm1vdmVcIiB3aGVuIGRvdWJsZSBjbGljayBvbiB0aGUgY3JvcHBlclxuXG4gICAgLy8gRGltZW5zaW9uc1xuICAgIG1pbkNhbnZhc1dpZHRoOiAwLFxuICAgIG1pbkNhbnZhc0hlaWdodDogMCxcbiAgICBtaW5Dcm9wQm94V2lkdGg6IDAsXG4gICAgbWluQ3JvcEJveEhlaWdodDogMCxcbiAgICBtaW5Db250YWluZXJXaWR0aDogMjAwLFxuICAgIG1pbkNvbnRhaW5lckhlaWdodDogMTAwLFxuXG4gICAgLy8gRXZlbnRzXG4gICAgYnVpbGQ6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgYnVpbHQ6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgZHJhZ3N0YXJ0OiBudWxsLCAvLyBGdW5jdGlvblxuICAgIGRyYWdtb3ZlOiBudWxsLCAvLyBGdW5jdGlvblxuICAgIGRyYWdlbmQ6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgem9vbWluOiBudWxsLCAvLyBGdW5jdGlvblxuICAgIHpvb21vdXQ6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgY2hhbmdlOiBudWxsIC8vIEZ1bmN0aW9uXG4gIH07XG5cbiAgQ3JvcHBlci5zZXREZWZhdWx0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgJC5leHRlbmQoQ3JvcHBlci5ERUZBVUxUUywgb3B0aW9ucyk7XG4gIH07XG5cbiAgLy8gVXNlIHRoZSBzdHJpbmcgY29tcHJlc3NvcjogU3RybWluIChodHRwczovL2dpdGh1Yi5jb20vZmVuZ3l1YW5jaGVuL3N0cm1pbilcbiAgQ3JvcHBlci5URU1QTEFURSA9IChmdW5jdGlvbiAoc291cmNlLCB3b3Jkcykge1xuICAgIHdvcmRzID0gd29yZHMuc3BsaXQoJywnKTtcbiAgICByZXR1cm4gc291cmNlLnJlcGxhY2UoL1xcZCsvZywgZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiB3b3Jkc1tpXTtcbiAgICB9KTtcbiAgfSkoJzwwIDY9XCI1LWNvbnRhaW5lclwiPjwwIDY9XCI1LWNhbnZhc1wiPjwvMD48MCA2PVwiNS0yLTlcIj48LzA+PDAgNj1cIjUtY3JvcC05XCI+PDEgNj1cIjUtdmlldy05XCI+PC8xPjwxIDY9XCI1LTggOC1oXCI+PC8xPjwxIDY9XCI1LTggOC12XCI+PC8xPjwxIDY9XCI1LWZhY2VcIj48LzE+PDEgNj1cIjUtNyA3LWVcIiAzLTI9XCJlXCI+PC8xPjwxIDY9XCI1LTcgNy1uXCIgMy0yPVwiblwiPjwvMT48MSA2PVwiNS03IDctd1wiIDMtMj1cIndcIj48LzE+PDEgNj1cIjUtNyA3LXNcIiAzLTI9XCJzXCI+PC8xPjwxIDY9XCI1LTQgNC1lXCIgMy0yPVwiZVwiPjwvMT48MSA2PVwiNS00IDQtblwiIDMtMj1cIm5cIj48LzE+PDEgNj1cIjUtNCA0LXdcIiAzLTI9XCJ3XCI+PC8xPjwxIDY9XCI1LTQgNC1zXCIgMy0yPVwic1wiPjwvMT48MSA2PVwiNS00IDQtbmVcIiAzLTI9XCJuZVwiPjwvMT48MSA2PVwiNS00IDQtbndcIiAzLTI9XCJud1wiPjwvMT48MSA2PVwiNS00IDQtc3dcIiAzLTI9XCJzd1wiPjwvMT48MSA2PVwiNS00IDQtc2VcIiAzLTI9XCJzZVwiPjwvMT48LzA+PC8wPicsICdkaXYsc3BhbixkcmFnLGRhdGEscG9pbnQsY3JvcHBlcixjbGFzcyxsaW5lLGRhc2hlZCxib3gnKTtcblxuICAvKiBUZW1wbGF0ZSBzb3VyY2U6XG4gIDxkaXYgY2xhc3M9XCJjcm9wcGVyLWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3M9XCJjcm9wcGVyLWNhbnZhc1wiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjcm9wcGVyLWRyYWctYm94XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNyb3BwZXItY3JvcC1ib3hcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci12aWV3LWJveFwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1kYXNoZWQgZGFzaGVkLWhcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItZGFzaGVkIGRhc2hlZC12XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWZhY2VcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLWVcIiBkYXRhLWRyYWc9XCJlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWxpbmUgbGluZS1uXCIgZGF0YS1kcmFnPVwiblwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1saW5lIGxpbmUtd1wiIGRhdGEtZHJhZz1cIndcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLXNcIiBkYXRhLWRyYWc9XCJzXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LWVcIiBkYXRhLWRyYWc9XCJlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LW5cIiBkYXRhLWRyYWc9XCJuXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXdcIiBkYXRhLWRyYWc9XCJ3XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXNcIiBkYXRhLWRyYWc9XCJzXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LW5lXCIgZGF0YS1kcmFnPVwibmVcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtbndcIiBkYXRhLWRyYWc9XCJud1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1zd1wiIGRhdGEtZHJhZz1cInN3XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXNlXCIgZGF0YS1kcmFnPVwic2VcIj48L3NwYW4+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICAqL1xuXG4gIC8vIFNhdmUgdGhlIG90aGVyIGNyb3BwZXJcbiAgQ3JvcHBlci5vdGhlciA9ICQuZm4uY3JvcHBlcjtcblxuICAvLyBSZWdpc3RlciBhcyBqUXVlcnkgcGx1Z2luXG4gICQuZm4uY3JvcHBlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cywgMSksXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKCdjcm9wcGVyJyksXG4gICAgICAgICAgZm47XG5cbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAkdGhpcy5kYXRhKCdjcm9wcGVyJywgKGRhdGEgPSBuZXcgQ3JvcHBlcih0aGlzLCBvcHRpb25zKSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICYmICQuaXNGdW5jdGlvbigoZm4gPSBkYXRhW29wdGlvbnNdKSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZm4uYXBwbHkoZGF0YSwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXNVbmRlZmluZWQocmVzdWx0KSA/IHRoaXMgOiByZXN1bHQ7XG4gIH07XG5cbiAgJC5mbi5jcm9wcGVyLkNvbnN0cnVjdG9yID0gQ3JvcHBlcjtcbiAgJC5mbi5jcm9wcGVyLnNldERlZmF1bHRzID0gQ3JvcHBlci5zZXREZWZhdWx0cztcblxuICAvLyBObyBjb25mbGljdFxuICAkLmZuLmNyb3BwZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNyb3BwZXIgPSBDcm9wcGVyLm90aGVyO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG59KTtcbihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ25nQ3JvcHBlcicsIFsnbmcnXSlcbi5kaXJlY3RpdmUoJ25nQ3JvcHBlcicsIFsnJHEnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHEsICRwYXJzZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHtcbiAgICAgIG9wdGlvbnM6ICc9bmdDcm9wcGVyT3B0aW9ucycsXG4gICAgICBwcm94eTogJz1uZ0Nyb3BwZXJQcm94eScsIC8vIE9wdGlvbmFsLlxuICAgICAgc2hvd0V2ZW50OiAnPW5nQ3JvcHBlclNob3cnLFxuICAgICAgaGlkZUV2ZW50OiAnPW5nQ3JvcHBlckhpZGUnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cykge1xuICAgICAgdmFyIHNob3duID0gZmFsc2U7XG5cbiAgICAgIHNjb3BlLiRvbihzY29wZS5zaG93RXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc2hvd24pIHJldHVybjtcbiAgICAgICAgc2hvd24gPSB0cnVlO1xuXG4gICAgICAgIHByZXByb2Nlc3Moc2NvcGUub3B0aW9ucywgZWxlbWVudFswXSlcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBzZXRQcm94eShlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQuY3JvcHBlcihvcHRpb25zKTtcbiAgICAgICAgICB9KVxuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHNldFByb3h5KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFzY29wZS5wcm94eSkgcmV0dXJuO1xuICAgICAgICB2YXIgc2V0dGVyID0gJHBhcnNlKHNjb3BlLnByb3h5KS5hc3NpZ247XG4gICAgICAgIHNldHRlcihzY29wZS4kcGFyZW50LCBlbGVtZW50LmNyb3BwZXIuYmluZChlbGVtZW50KSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLiRvbihzY29wZS5oaWRlRXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXNob3duKSByZXR1cm47XG4gICAgICAgIHNob3duID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY3JvcHBlcignZGVzdHJveScpO1xuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLiR3YXRjaCgnb3B0aW9ucy5kaXNhYmxlZCcsIGZ1bmN0aW9uKGRpc2FibGVkKSB7XG4gICAgICAgIGlmICghc2hvd24pIHJldHVybjtcbiAgICAgICAgaWYgKGRpc2FibGVkKSBlbGVtZW50LmNyb3BwZXIoJ2Rpc2FibGUnKTtcbiAgICAgICAgaWYgKCFkaXNhYmxlZCkgZWxlbWVudC5jcm9wcGVyKCdlbmFibGUnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBwcmVwcm9jZXNzKG9wdGlvbnMsIGltZykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciByZXN1bHQgPSAkcS53aGVuKG9wdGlvbnMpOyAvLyBObyBjaGFuZ2VzLlxuICAgIGlmIChvcHRpb25zLm1heGltaXplKSB7XG4gICAgICByZXN1bHQgPSBtYXhpbWl6ZVNlbGVjdGlvbihvcHRpb25zLCBpbWcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSBvcHRpb25zIHRvIG1ha2Ugc2VsZWN0aW9uIG1heGltdW0gZm9yIHRoZSBpbWFnZS5cbiAgICogZmVuZ3l1YW5jaGVuL2Nyb3BwZXIgY2FsY3VsYXRlcyB2YWxpZCBzZWxlY3Rpb24ncyBoZWlnaHQgJiB3aWR0aFxuICAgKiB3aXRoIHJlc3BlY3QgdG8gYGFzcGVjdFJhdGlvYC5cbiAgICovXG4gIGZ1bmN0aW9uIG1heGltaXplU2VsZWN0aW9uKG9wdGlvbnMsIGltZykge1xuICAgIHJldHVybiBnZXRSZWFsU2l6ZShpbWcpLnRoZW4oZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgb3B0aW9ucy5kYXRhID0gc2l6ZTtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcmVhbCBpbWFnZSBzaXplICh3aXRob3V0IGNoYW5nZXMgYnkgY3NzLCBhdHRyaWJ1dGVzKS5cbiAgICovXG4gIGZ1bmN0aW9uIGdldFJlYWxTaXplKGltZykge1xuICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIHNpemUgPSB7aGVpZ2h0OiBudWxsLCB3aWR0aDogbnVsbH07XG4gICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG5cbiAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGRlZmVyLnJlc29sdmUoe3dpZHRoOiBpbWFnZS53aWR0aCwgaGVpZ2h0OiBpbWFnZS5oZWlnaHR9KTtcbiAgICB9XG5cbiAgICBpbWFnZS5zcmMgPSBpbWcuc3JjO1xuICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICB9XG59XSlcbi5zZXJ2aWNlKCdDcm9wcGVyJywgWyckcScsIGZ1bmN0aW9uKCRxKSB7XG5cbiAgdGhpcy5lbmNvZGUgPSBmdW5jdGlvbihibG9iKSB7XG4gICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgZGVmZXIucmVzb2x2ZShlLnRhcmdldC5yZXN1bHQpO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XG4gICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gIH07XG5cbiAgdGhpcy5kZWNvZGUgPSBmdW5jdGlvbihkYXRhVXJsKSB7XG4gICAgdmFyIG1ldGEgPSBkYXRhVXJsLnNwbGl0KCc7JylbMF07XG4gICAgdmFyIHR5cGUgPSBtZXRhLnNwbGl0KCc6JylbMV07XG4gICAgdmFyIGJpbmFyeSA9IGF0b2IoZGF0YVVybC5zcGxpdCgnLCcpWzFdKTtcbiAgICB2YXIgYXJyYXkgPSBuZXcgVWludDhBcnJheShiaW5hcnkubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJsb2IoW2FycmF5XSwge3R5cGU6IHR5cGV9KTtcbiAgfTtcblxuICB0aGlzLmNyb3AgPSBmdW5jdGlvbihmaWxlLCBkYXRhKSB7XG4gICAgdmFyIF9kZWNvZGVCbG9iID0gdGhpcy5kZWNvZGU7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2RlKGZpbGUpLnRoZW4oX2NyZWF0ZUltYWdlKS50aGVuKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICB2YXIgY2FudmFzID0gY3JlYXRlQ2FudmFzKGRhdGEpO1xuICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIGRhdGEueCwgZGF0YS55LCBkYXRhLndpZHRoLCBkYXRhLmhlaWdodCwgMCwgMCwgZGF0YS53aWR0aCwgZGF0YS5oZWlnaHQpO1xuXG4gICAgICB2YXIgZW5jb2RlZCA9IGNhbnZhcy50b0RhdGFVUkwoZmlsZS50eXBlKTtcbiAgICAgIHJlbW92ZUVsZW1lbnQoY2FudmFzKTtcblxuICAgICAgcmV0dXJuIF9kZWNvZGVCbG9iKGVuY29kZWQpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuc2NhbGUgPSBmdW5jdGlvbihmaWxlLCBkYXRhKSB7XG4gICAgdmFyIF9kZWNvZGVCbG9iID0gdGhpcy5kZWNvZGU7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2RlKGZpbGUpLnRoZW4oX2NyZWF0ZUltYWdlKS50aGVuKGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICB2YXIgaGVpZ2h0T3JpZyA9IGltYWdlLmhlaWdodDtcbiAgICAgIHZhciB3aWR0aE9yaWcgPSBpbWFnZS53aWR0aDtcbiAgICAgIHZhciByYXRpbywgaGVpZ2h0LCB3aWR0aDtcblxuICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoZGF0YSkpIHtcbiAgICAgICAgcmF0aW8gPSBkYXRhO1xuICAgICAgICBoZWlnaHQgPSBoZWlnaHRPcmlnICogcmF0aW87XG4gICAgICAgIHdpZHRoID0gd2lkdGhPcmlnICogcmF0aW87XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIHJhdGlvID0gd2lkdGhPcmlnIC8gaGVpZ2h0T3JpZztcbiAgICAgICAgaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgIHdpZHRoID0gZGF0YS53aWR0aDtcblxuICAgICAgICBpZiAoaGVpZ2h0ICYmICF3aWR0aClcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIHJhdGlvO1xuICAgICAgICBlbHNlIGlmICh3aWR0aCAmJiAhaGVpZ2h0KVxuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gcmF0aW87XG4gICAgICB9XG5cbiAgICAgIHZhciBjYW52YXMgPSBjcmVhdGVDYW52YXMoZGF0YSk7XG4gICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG5cbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB3aWR0aE9yaWcsIGhlaWdodE9yaWcsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICB2YXIgZW5jb2RlZCA9IGNhbnZhcy50b0RhdGFVUkwoZmlsZS50eXBlKTtcbiAgICAgIHJlbW92ZUVsZW1lbnQoY2FudmFzKTtcblxuICAgICAgcmV0dXJuIF9kZWNvZGVCbG9iKGVuY29kZWQpO1xuICAgIH0pO1xuICB9O1xuXG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUltYWdlKHNvdXJjZSkge1xuICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oZSkgeyBkZWZlci5yZXNvbHZlKGUudGFyZ2V0KTsgfTtcbiAgICBpbWFnZS5zcmMgPSBzb3VyY2U7XG4gICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVDYW52YXMoZGF0YSkge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSBkYXRhLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoZWwpIHtcbiAgICBlbC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG59XSk7XG5cbn0pKCk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwLnRlbXBsYXRlcycsIFtdKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KCdjb250YWN0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgb25jaGFuZ2U9XCJhbmd1bGFyLmVsZW1lbnQodGhpcykuc2NvcGUoKS5vbkZpbGUodGhpcy5maWxlc1swXSlcIj5cXG4gICAgPGJ1dHRvbiBuZy1jbGljaz1cInByZXZpZXcoKVwiPlNob3cgcHJldmlldzwvYnV0dG9uPlxcbiAgICA8YnV0dG9uIG5nLWNsaWNrPVwic2NhbGUoMjAwKVwiPlNjYWxlIHRvIDIwMHB4IHdpZHRoPC9idXR0b24+XFxuICAgIDxidXR0b24gbmctY2xpY2s9XCJjbGVhcigpXCI+Q2xlYXIgc2VsZWN0aW9uPC9idXR0b24+XFxuICAgIDxsYWJlbD5EaXNhYmxlZCA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmctbW9kZWw9XCJvcHRpb25zLmRpc2FibGVkXCI+PC9sYWJlbD5cXG5cXG4gICAgPGJyIC8+XFxuXFxuICAgIDxkaXYgbmctaWY9XCJkYXRhVXJsXCIgY2xhc3M9XCJpbWctY29udGFpbmVyXCI+XFxuICAgICAgPGltZyBuZy1pZj1cImRhdGFVcmxcIiBuZy1zcmM9XCJ7e2RhdGFVcmx9fVwiIHdpZHRoPVwiODAwXCJcXG4gICAgICAgICAgIG5nLWNyb3BwZXJcXG4gICAgICAgICAgIG5nLWNyb3BwZXItcHJveHk9XCJjcm9wcGVyUHJveHlcIlxcbiAgICAgICAgICAgbmctY3JvcHBlci1zaG93PVwic2hvd0V2ZW50XCJcXG4gICAgICAgICAgIG5nLWNyb3BwZXItaGlkZT1cImhpZGVFdmVudFwiXFxuICAgICAgICAgICBuZy1jcm9wcGVyLW9wdGlvbnM9XCJvcHRpb25zXCI+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVwicHJldmlldy1jb250YWluZXJcIj5cXG4gICAgICA8aW1nIG5nLWlmPVwicHJldmlldy5kYXRhVXJsXCIgbmctc3JjPVwie3twcmV2aWV3LmRhdGFVcmx9fVwiPlxcbiAgICA8L2Rpdj5cXG48L3NlY3Rpb24+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2hvbWUuaHRtbCcsJzxzZWN0aW9uPlxcbiAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIGZpZ3VyZVwiPlxcbiAgICA8ZnJvbSBjbGFzcz1cImZvcm0taW5saW5lXCI+XFxuICAgICAgPGlucHV0IHR5cGU9XCJcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5nLW1vZGVsPVwidm0ua2V5d29yZFwiPlxcbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3Mge3t2bS5zdHlsZS50aXRsZX19XCIgbmctY2xpY2s9XCJ2bS5zZWFyY2hCb29rKCk7XCI+XFx1NjQxQ1xcdTdEMjJcXHU1NkZFXFx1NEU2NjwvYnV0dG9uPlxcbiAgICA8L2Zyb20+XFxuICA8L2Rpdj5cXG4gIDxkaXY+XFxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBuZy1yZXBlYXQ9XCJpdGVtIGluIHZtLmxpc3RcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTIgdGV4dC1jZW50ZXJcIj5cXG4gICAgICAgIDxpbWcgbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEwXCI+XFxuICAgICAgICA8aDI+e3tpdGVtLnRpdGxlfX08L2gyPlxcbiAgICAgICAgPGgzPnt7aXRlbS5hdXRob3J9fTwvaDM+XFxuICAgICAgICA8cD4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDt7e2l0ZW0uc3VtbWFyeX19PC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxocj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG48L3NlY3Rpb24+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2luZGV4Lmh0bWwnLCc8IURPQ1RZUEUgaHRtbD5cXG48aHRtbCBsYW5nPVwiemgtQ05cIj5cXG5cXG48aGVhZD5cXG4gIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxcbiAgPHRpdGxlPkdldFVzZXJNZWRpYVxcdTVCOUVcXHU0RjhCPC90aXRsZT5cXG48L2hlYWQ+XFxuXFxuPGJvZHk+XFxuICA8dmlkZW8gaWQ9XCJ2aWRlb1wiIGF1dG9wbGF5IGNvbnRyb2xzPVwiXCI+XFxuICAgIDxpZGVvPlxcbjwvYm9keT5cXG48c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5cXG4vLyB2YXIgZ2V0VXNlck1lZGlhID0gKG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYSk7XFxubmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7XFxuICB2aWRlbzogdHJ1ZSxcXG4gIGF1ZGlvOiB0cnVlXFxufSwgZnVuY3Rpb24obG9jYWxNZWRpYVN0cmVhbSkge1xcbiAgdmFyIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFwndmlkZW9cXCcpO1xcbiAgdmlkZW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobG9jYWxNZWRpYVN0cmVhbSk7XFxuICB2aWRlby5vbmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24oZSkge1xcbiAgICBjb25zb2xlLmxvZyhcIkxhYmVsOiBcIiArIGxvY2FsTWVkaWFTdHJlYW0ubGFiZWwpO1xcbiAgICBjb25zb2xlLmxvZyhcIkF1ZGlvVHJhY2tzXCIsIGxvY2FsTWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSk7XFxuICAgIGNvbnNvbGUubG9nKFwiVmlkZW9UcmFja3NcIiwgbG9jYWxNZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpKTtcXG4gIH07XFxufSwgZnVuY3Rpb24oZSkge1xcbiAgY29uc29sZS5sb2coXFwnUmVlZWVqZWN0ZWQhXFwnLCBlKTtcXG59KTtcXG48L3NjcmlwdD5cXG48aHRtbD5cXG4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGF5b3V0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gIDxoZWFkZXIgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPnt7dm0udGl0bGV9fTwvaGVhZGVyPlxcblxcbiAgPHVpLXZpZXc+PC91aS12aWV3Plxcbjwvc2VjdGlvbj4nKTt9XSk7Il19
