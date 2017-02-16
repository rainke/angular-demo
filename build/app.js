(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hepeng/learning/js/angular-demo/app/app.js":[function(require,module,exports){
var $ = require('jquery');
var angular = require('angular');

require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-block-ui');
require('angular-xeditable');
require('ui-select');
require('../public/templates');
var common = require('./common/common.module.js')
var config = require('./config');

angular.module('app', ['app.templates','ui.bootstrap', 'ui.router', 'ui.select', 'blockUI','xeditable', common.name])



.config(config)
.run(function(editableOptions){
  editableOptions.theme = 'bs3';
})
},{"../public/templates":"/Users/hepeng/learning/js/angular-demo/public/templates.js","./common/common.module.js":"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js","./config":"/Users/hepeng/learning/js/angular-demo/app/config.js","angular":"angular","angular-block-ui":"angular-block-ui","angular-ui-bootstrap":"angular-ui-bootstrap","angular-ui-router":"angular-ui-router","angular-xeditable":"angular-xeditable","jquery":"jquery","ui-select":"ui-select"}],"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js":[function(require,module,exports){
var appLayout = require('./components/layout/layout.js');
var contact = require('./components/contact/contact.js');
var home = require('./components/home/home.js');
var edit = require('./components/editable.js');
require('ngCropper/dist/ngCropper.all.js');

module.exports = angular.module('app.common', ['ngCropper'])


.component('appLayout', appLayout)
.component('contact', contact)
.component('layHome', home)
.component('edit', edit)
},{"./components/contact/contact.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js","./components/editable.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/editable.js","./components/home/home.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js","./components/layout/layout.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js","ngCropper/dist/ngCropper.all.js":"/Users/hepeng/learning/js/angular-demo/node_modules/ngCropper/dist/ngCropper.all.js"}],"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js":[function(require,module,exports){
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
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/editable.js":[function(require,module,exports){
function eidtCtrl($scope,$http) {
  var This = this;
  this.name = 'hehe';
  this.dob = new Date();
  this.opened = {};
  this.open = function(event, elementOpened) {
    event.preventDefault();
    This.opened[elementOpened] = !This.opened[elementOpened];
  }
  $scope.user = {
    state: 'Arizona'
  };

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
}


module.exports = {
  templateUrl: 'edit.html',
  controller: eidtCtrl,
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
    // console.log(res)
  })

  this.searchBook = function() {
    $http.get('v2/book/search', {params: {q: this.keyword}}).success(function(res){
      This.list = res.books;
      This.total = res.total;
    });
  }
}


module.exports = {
  templateUrl: 'home.html',
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
  }).state('edit', {
    url:'/edit',
    template:'<edit/>',
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
$templateCache.put('edit.html','<section>\n  name\uFF1A<a href="#" editable-text="vm.name" e-form="textBtnForm">{{ vm.name || \'empty\' }}</a>\n  <button class="btn btn-default" ng-click="textBtnForm.$show()" ng-hide="textBtnForm.$visible">\n    edit\n  </button>\n  <br>\n  date:\n  <a href="#" \n     editable-bsdate="vm.dob"\n     e-is-open="vm.opened.$data"\n     e-ng-click="vm.open($event,\'$data\')"\n     e-datepicker-popup="dd-MMMM-yyyy"\n   >\n    {{ (vm.dob | date:"dd/MM/yyyy") || \'empty\' }}\n  </a>\n\n  <form data-editable-form name="uiSelectForm">\n    <div editable-ui-select="user.state" \n         data-e-form="uiSelectForm" \n         data-e-name="state" \n         name="state" \n         theme="bootstrap" \n         data-e-ng-model="user.state" \n         data-e-style="min-width:300px;"\n    >\n      {{user.state}}\n      <editable-ui-select-match placeholder="State">\n          {{$select.selected}}\n      </editable-ui-select-match>\n      <editable-ui-select-choices repeat="state in states | filter: $select.search track by $index">\n        {{state}}\n      </editable-ui-select-choices>\n    </div>\n    <br/>\n    <div class="buttons">\n      <!-- button to show form -->\n      <button type="button" class="btn btn-default" ng-click="uiSelectForm.$show()" ng-show="!uiSelectForm.$visible">\n        Edit\n      </button>\n      <!-- buttons to submit / cancel form -->\n      <span ng-show="uiSelectForm.$visible">\n        <br/>\n        <button type="submit" class="btn btn-primary" ng-disabled="uiSelectForm.$waiting">\n          Save\n        </button>\n        <button type="button" class="btn btn-default" ng-disabled="uiSelectForm.$waiting" ng-click="uiSelectForm.$cancel()">\n          Cancel\n        </button>\n      </span>\n    </div>  \n  </form>\n\n</section>');
$templateCache.put('home.html','<section>\n  <div class="text-center figure">\n    <from class="form-inline">\n      <input type="" class="form-control" ng-model="vm.keyword">\n      <button class="btn btn-success {{vm.style.title}}" ng-click="vm.searchBook();">\u641C\u7D22\u56FE\u4E66</button>\n    </from>\n  </div>\n  <div>\n    <div class="row" ng-repeat="item in vm.list">\n      <div class="col-xs-2 text-center">\n        <img ng-src="{{item.image}}">\n      </div>\n      <div class="col-xs-10">\n        <h2 class="_test_12z2f_1">{{item.title}}</h2>\n        <h3>{{item.author}}</h3>\n        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.summary}}</p>\n      </div>\n      <hr>\n    </div>\n  </div>\n</section>');
$templateCache.put('index.html','<!DOCTYPE html>\n<html lang="zh-CN">\n\n<head>\n  <meta charset="UTF-8">\n  <title>GetUserMedia\u5B9E\u4F8B</title>\n</head>\n\n<body>\n  <video id="video" autoplay controls="">\n    <ideo>\n</body>\n<script type="text/javascript">\n// var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);\nnavigator.getUserMedia({\n  video: true,\n  audio: true\n}, function(localMediaStream) {\n  var video = document.getElementById(\'video\');\n  video.src = window.URL.createObjectURL(localMediaStream);\n  video.onloadedmetadata = function(e) {\n    console.log("Label: " + localMediaStream.label);\n    console.log("AudioTracks", localMediaStream.getAudioTracks());\n    console.log("VideoTracks", localMediaStream.getVideoTracks());\n  };\n}, function(e) {\n  console.log(\'Reeeejected!\', e);\n});\n</script>\n<html>\n');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);
},{}]},{},["/Users/hepeng/learning/js/angular-demo/app/app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL2NvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9lZGl0YWJsZS5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9ob21lL2hvbWUuY3NzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmpzIiwiYXBwL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9uZ0Nyb3BwZXIvZGlzdC9uZ0Nyb3BwZXIuYWxsLmpzIiwicHVibGljL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMXVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxucmVxdWlyZSgnYW5ndWxhci11aS1ib290c3RyYXAnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItdWktcm91dGVyJyk7XG5yZXF1aXJlKCdhbmd1bGFyLWJsb2NrLXVpJyk7XG5yZXF1aXJlKCdhbmd1bGFyLXhlZGl0YWJsZScpO1xucmVxdWlyZSgndWktc2VsZWN0Jyk7XG5yZXF1aXJlKCcuLi9wdWJsaWMvdGVtcGxhdGVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24vY29tbW9uLm1vZHVsZS5qcycpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnYXBwLnRlbXBsYXRlcycsJ3VpLmJvb3RzdHJhcCcsICd1aS5yb3V0ZXInLCAndWkuc2VsZWN0JywgJ2Jsb2NrVUknLCd4ZWRpdGFibGUnLCBjb21tb24ubmFtZV0pXG5cblxuXG4uY29uZmlnKGNvbmZpZylcbi5ydW4oZnVuY3Rpb24oZWRpdGFibGVPcHRpb25zKXtcbiAgZWRpdGFibGVPcHRpb25zLnRoZW1lID0gJ2JzMyc7XG59KSIsInZhciBhcHBMYXlvdXQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC5qcycpO1xudmFyIGNvbnRhY3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29udGFjdC9jb250YWN0LmpzJyk7XG52YXIgaG9tZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9ob21lL2hvbWUuanMnKTtcbnZhciBlZGl0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2VkaXRhYmxlLmpzJyk7XG5yZXF1aXJlKCduZ0Nyb3BwZXIvZGlzdC9uZ0Nyb3BwZXIuYWxsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5jb21tb24nLCBbJ25nQ3JvcHBlciddKVxuXG5cbi5jb21wb25lbnQoJ2FwcExheW91dCcsIGFwcExheW91dClcbi5jb21wb25lbnQoJ2NvbnRhY3QnLCBjb250YWN0KVxuLmNvbXBvbmVudCgnbGF5SG9tZScsIGhvbWUpXG4uY29tcG9uZW50KCdlZGl0JywgZWRpdCkiLCJmdW5jdGlvbiBjb250YWN0Q3RybCgkc2NvcGUsICR0aW1lb3V0LCBDcm9wcGVyKSB7XG4gIHZhciBmaWxlLCBkYXRhO1xuXG4gIC8qKlxuICAgKiBNZXRob2QgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgZmlsZSBpbnB1dCdzIHZhbHVlIGNoYW5nZXMuXG4gICAqIEJlY2F1c2Ugb2YgQW5ndWxhciBoYXMgbm90IG5nLWNoYW5nZSBmb3IgZmlsZSBpbnB1dHMgYSBoYWNrIGlzIG5lZWRlZCAtXG4gICAqIGNhbGwgYGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5zY29wZSgpLm9uRmlsZSh0aGlzLmZpbGVzWzBdKWBcbiAgICogd2hlbiBpbnB1dCdzIGV2ZW50IGlzIGZpcmVkLlxuICAgKi9cbiAgJHNjb3BlLm9uRmlsZSA9IGZ1bmN0aW9uKGJsb2IpIHtcbiAgICBDcm9wcGVyLmVuY29kZSgoZmlsZSA9IGJsb2IpKS50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICRzY29wZS5kYXRhVXJsID0gZGF0YVVybDtcbiAgICAgICR0aW1lb3V0KHNob3dDcm9wcGVyKTsgIC8vIHdhaXQgZm9yICRkaWdlc3QgdG8gc2V0IGltYWdlJ3Mgc3JjXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyb3BwZXJzIGNvbnRhaW5lciBvYmplY3Qgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gY29udHJvbGxlcidzIHNjb3BlXG4gICAqIGZvciB1cGRhdGVzIGJ5IGRpcmVjdGl2ZSB2aWEgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cbiAgICogUGFzcyBhIGZ1bGwgcHJveHkgbmFtZSB0byB0aGUgYG5nLWNyb3BwZXItcHJveHlgIGRpcmVjdGl2ZSBhdHRyaWJ1dGUgdG9cbiAgICogZW5hYmxlIHByb3hpbmcuXG4gICAqL1xuICAkc2NvcGUuY3JvcHBlciA9IHt9O1xuICAkc2NvcGUuY3JvcHBlclByb3h5ID0gJ2Nyb3BwZXIuZmlyc3QnO1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoZXJlIGlzIGEgY3JvcHBlZCBpbWFnZSB0byBzaG93IGVuY29kZSBpdCB0byBiYXNlNjQgc3RyaW5nIGFuZFxuICAgKiB1c2UgYXMgYSBzb3VyY2UgZm9yIGFuIGltYWdlIGVsZW1lbnQuXG4gICAqL1xuICAkc2NvcGUucHJldmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghZmlsZSB8fCAhZGF0YSkgcmV0dXJuO1xuICAgIENyb3BwZXIuY3JvcChmaWxlLCBkYXRhKS50aGVuKENyb3BwZXIuZW5jb2RlKS50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICgkc2NvcGUucHJldmlldyB8fCAoJHNjb3BlLnByZXZpZXcgPSB7fSkpLmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVc2UgY3JvcHBlciBmdW5jdGlvbiBwcm94eSB0byBjYWxsIG1ldGhvZHMgb2YgdGhlIHBsdWdpbi5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vY3JvcHBlciNtZXRob2RzXG4gICAqL1xuICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbihkZWdyZWVzKSB7XG4gICAgaWYgKCEkc2NvcGUuY3JvcHBlci5maXJzdCkgcmV0dXJuO1xuICAgICRzY29wZS5jcm9wcGVyLmZpcnN0KCdjbGVhcicpO1xuICB9O1xuXG4gICRzY29wZS5zY2FsZSA9IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgQ3JvcHBlci5jcm9wKGZpbGUsIGRhdGEpXG4gICAgICAudGhlbihmdW5jdGlvbihibG9iKSB7XG4gICAgICAgIHJldHVybiBDcm9wcGVyLnNjYWxlKGJsb2IsIHt3aWR0aDogd2lkdGh9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbihDcm9wcGVyLmVuY29kZSkudGhlbihmdW5jdGlvbihkYXRhVXJsKSB7XG4gICAgICAgICgkc2NvcGUucHJldmlldyB8fCAoJHNjb3BlLnByZXZpZXcgPSB7fSkpLmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IGlzIHVzZWQgdG8gcGFzcyBvcHRpb25zIHRvIGluaXRhbGl6ZSBhIGNyb3BwZXIuXG4gICAqIE1vcmUgb24gb3B0aW9ucyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vY3JvcHBlciNvcHRpb25zXG4gICAqL1xuICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICBtYXhpbWl6ZTogdHJ1ZSxcbiAgICBhc3BlY3RSYXRpbzogMiAvIDEsXG4gICAgY3JvcDogZnVuY3Rpb24oZGF0YU5ldykge1xuICAgICAgZGF0YSA9IGRhdGFOZXc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93aW5nIChpbml0aWFsaXppbmcpIGFuZCBoaWRpbmcgKGRlc3Ryb3lpbmcpIG9mIGEgY3JvcHBlciBhcmUgc3RhcnRlZCBieVxuICAgKiBldmVudHMuIFRoZSBzY29wZSBvZiB0aGUgYG5nLWNyb3BwZXJgIGRpcmVjdGl2ZSBpcyBkZXJpdmVkIGZyb20gdGhlIHNjb3BlIG9mXG4gICAqIHRoZSBjb250cm9sbGVyLiBXaGVuIGluaXRpYWxpemluZyB0aGUgYG5nLWNyb3BwZXJgIGRpcmVjdGl2ZSBhZGRzIHR3byBoYW5kbGVyc1xuICAgKiBsaXN0ZW5pbmcgdG8gZXZlbnRzIHBhc3NlZCBieSBgbmctY3JvcHBlci1zaG93YCAmIGBuZy1jcm9wcGVyLWhpZGVgIGF0dHJpYnV0ZXMuXG4gICAqIFRvIHNob3cgb3IgaGlkZSBhIGNyb3BwZXIgYCRicm9hZGNhc3RgIGEgcHJvcGVyIGV2ZW50LlxuICAgKi9cbiAgJHNjb3BlLnNob3dFdmVudCA9ICdzaG93JztcbiAgJHNjb3BlLmhpZGVFdmVudCA9ICdoaWRlJztcblxuICBmdW5jdGlvbiBzaG93Q3JvcHBlcigpIHsgJHNjb3BlLiRicm9hZGNhc3QoJHNjb3BlLnNob3dFdmVudCk7IH1cbiAgZnVuY3Rpb24gaGlkZUNyb3BwZXIoKSB7ICRzY29wZS4kYnJvYWRjYXN0KCRzY29wZS5oaWRlRXZlbnQpOyB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRlbXBsYXRlVXJsOiAndHBsL2NvbnRhY3QuaHRtbCcsXG4gIGNvbnRyb2xsZXI6IGNvbnRhY3RDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsImZ1bmN0aW9uIGVpZHRDdHJsKCRzY29wZSwkaHR0cCkge1xuICB2YXIgVGhpcyA9IHRoaXM7XG4gIHRoaXMubmFtZSA9ICdoZWhlJztcbiAgdGhpcy5kb2IgPSBuZXcgRGF0ZSgpO1xuICB0aGlzLm9wZW5lZCA9IHt9O1xuICB0aGlzLm9wZW4gPSBmdW5jdGlvbihldmVudCwgZWxlbWVudE9wZW5lZCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgVGhpcy5vcGVuZWRbZWxlbWVudE9wZW5lZF0gPSAhVGhpcy5vcGVuZWRbZWxlbWVudE9wZW5lZF07XG4gIH1cbiAgJHNjb3BlLnVzZXIgPSB7XG4gICAgc3RhdGU6ICdBcml6b25hJ1xuICB9O1xuXG4gICRzY29wZS5zdGF0ZXMgPSBbJ0FsYWJhbWEnLCAnQWxhc2thJywgJ0FyaXpvbmEnLCAnQXJrYW5zYXMnLCAnQ2FsaWZvcm5pYScsICdDb2xvcmFkbycsICdDb25uZWN0aWN1dCcsICdEZWxhd2FyZScsICdGbG9yaWRhJywgJ0dlb3JnaWEnLCAnSGF3YWlpJywgJ0lkYWhvJywgJ0lsbGlub2lzJywgJ0luZGlhbmEnLCAnSW93YScsICdLYW5zYXMnLCAnS2VudHVja3knLCAnTG91aXNpYW5hJywgJ01haW5lJywgJ01hcnlsYW5kJywgJ01hc3NhY2h1c2V0dHMnLCAnTWljaGlnYW4nLCAnTWlubmVzb3RhJywgJ01pc3Npc3NpcHBpJywgJ01pc3NvdXJpJywgJ01vbnRhbmEnLCAnTmVicmFza2EnLCAnTmV2YWRhJywgJ05ldyBIYW1wc2hpcmUnLCAnTmV3IEplcnNleScsICdOZXcgTWV4aWNvJywgJ05ldyBZb3JrJywgJ05vcnRoIERha290YScsICdOb3J0aCBDYXJvbGluYScsICdPaGlvJywgJ09rbGFob21hJywgJ09yZWdvbicsICdQZW5uc3lsdmFuaWEnLCAnUmhvZGUgSXNsYW5kJywgJ1NvdXRoIENhcm9saW5hJywgJ1NvdXRoIERha290YScsICdUZW5uZXNzZWUnLCAnVGV4YXMnLCAnVXRhaCcsICdWZXJtb250JywgJ1ZpcmdpbmlhJywgJ1dhc2hpbmd0b24nLCAnV2VzdCBWaXJnaW5pYScsICdXaXNjb25zaW4nLCAnV3lvbWluZyddO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0ZW1wbGF0ZVVybDogJ2VkaXQuaHRtbCcsXG4gIGNvbnRyb2xsZXI6IGVpZHRDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1widGl0bGVcIjpcIl90aXRsZV8xdG92el8xXCJ9IiwidmFyIHN0eWxlID0gcmVxdWlyZSgnLi9ob21lLmNzcycpO1xuXG5mdW5jdGlvbiBob21lQ3RybCgkc2NvcGUsJGh0dHApIHtcbiAgdmFyIFRoaXMgPSB0aGlzO1xuICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICRodHRwLmdldCgndjIvYm9vay82NTQ4NjgzJykuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuICAgIC8vIGNvbnNvbGUubG9nKHJlcylcbiAgfSlcblxuICB0aGlzLnNlYXJjaEJvb2sgPSBmdW5jdGlvbigpIHtcbiAgICAkaHR0cC5nZXQoJ3YyL2Jvb2svc2VhcmNoJywge3BhcmFtczoge3E6IHRoaXMua2V5d29yZH19KS5zdWNjZXNzKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBUaGlzLmxpc3QgPSByZXMuYm9va3M7XG4gICAgICBUaGlzLnRvdGFsID0gcmVzLnRvdGFsO1xuICAgIH0pO1xuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcbiAgY29udHJvbGxlcjogaG9tZUN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwiZnVuY3Rpb24gbGF5b3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUpIHtcbi8v5Zyo6L+Z6YeM5Y+v5Lul5pu/5LujcnVuXG4gIHRoaXMudGl0bGUgPSAnaG9tZSc7XG4gICRyb290U2NvcGUudGl0bGUgPSAnaG9tZSc7XG4gIHZhciBUaGlzID0gdGhpcztcbiAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKGUsIHRvKSB7XG4gICAgVGhpcy50aXRsZSA9IHRvLnRpdGxlO1xuICAgICRyb290U2NvcGUudGl0bGUgPSB0by50aXRsZTtcbiAgfSlcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICd0cGwvbGF5b3V0Lmh0bWwnLFxuICBjb250cm9sbGVyOiBsYXlvdXRDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsImZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xheW91dCcsIHtcbiAgICB1cmw6Jy8nLFxuICAgIHRlbXBsYXRlOic8bGF5LWhvbWUvPicsXG4gICAgdGl0bGU6J+S4u+mhtScsXG4gIH0pLnN0YXRlKCdjb250YWN0Jywge1xuICAgIHVybDonL2NvbnRhY3QnLFxuICAgIHRlbXBsYXRlOic8Y29udGFjdC8+JyxcbiAgICB0aXRsZTon6IGU57O75oiR5LusJ1xuICB9KS5zdGF0ZSgnZWRpdCcsIHtcbiAgICB1cmw6Jy9lZGl0JyxcbiAgICB0ZW1wbGF0ZTonPGVkaXQvPicsXG4gICAgdGl0bGU6J+iBlOezu+aIkeS7rCdcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwiLyohXG4gKiBDcm9wcGVyIHYwLjEwLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vY3JvcHBlclxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1IEZlbmd5dWFuIENoZW4gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKlxuICogRGF0ZTogMjAxNS0wNi0wOFQxNDo1NzoyNi4zNTNaXG4gKi9cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUgLyBDb21tb25KU1xuICAgIGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscy5cbiAgICBmYWN0b3J5KGpRdWVyeSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgJGRvY3VtZW50ID0gJChkb2N1bWVudCksXG4gICAgICBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbixcblxuICAgICAgLy8gQ29uc3RhbnRzXG4gICAgICBDUk9QUEVSX05BTUVTUEFDRSA9ICcuY3JvcHBlcicsXG4gICAgICBDUk9QUEVSX1BSRVZJRVcgPSAncHJldmlldycgKyBDUk9QUEVSX05BTUVTUEFDRSxcblxuICAgICAgLy8gUmVnRXhwc1xuICAgICAgUkVHRVhQX0RSQUdfVFlQRVMgPSAvXihlfG58d3xzfG5lfG53fHN3fHNlfGFsbHxjcm9wfG1vdmV8em9vbSkkLyxcblxuICAgICAgLy8gQ2xhc3Nlc1xuICAgICAgQ0xBU1NfTU9EQUwgPSAnY3JvcHBlci1tb2RhbCcsXG4gICAgICBDTEFTU19ISURFID0gJ2Nyb3BwZXItaGlkZScsXG4gICAgICBDTEFTU19ISURERU4gPSAnY3JvcHBlci1oaWRkZW4nLFxuICAgICAgQ0xBU1NfSU5WSVNJQkxFID0gJ2Nyb3BwZXItaW52aXNpYmxlJyxcbiAgICAgIENMQVNTX01PVkUgPSAnY3JvcHBlci1tb3ZlJyxcbiAgICAgIENMQVNTX0NST1AgPSAnY3JvcHBlci1jcm9wJyxcbiAgICAgIENMQVNTX0RJU0FCTEVEID0gJ2Nyb3BwZXItZGlzYWJsZWQnLFxuICAgICAgQ0xBU1NfQkcgPSAnY3JvcHBlci1iZycsXG5cbiAgICAgIC8vIEV2ZW50c1xuICAgICAgRVZFTlRfTU9VU0VfRE9XTiA9ICdtb3VzZWRvd24gdG91Y2hzdGFydCcsXG4gICAgICBFVkVOVF9NT1VTRV9NT1ZFID0gJ21vdXNlbW92ZSB0b3VjaG1vdmUnLFxuICAgICAgRVZFTlRfTU9VU0VfVVAgPSAnbW91c2V1cCBtb3VzZWxlYXZlIHRvdWNoZW5kIHRvdWNobGVhdmUgdG91Y2hjYW5jZWwnLFxuICAgICAgRVZFTlRfV0hFRUwgPSAnd2hlZWwgbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsXG4gICAgICBFVkVOVF9EQkxDTElDSyA9ICdkYmxjbGljaycsXG4gICAgICBFVkVOVF9SRVNJWkUgPSAncmVzaXplJyArIENST1BQRVJfTkFNRVNQQUNFLCAvLyBCaW5kIHRvIHdpbmRvdyB3aXRoIG5hbWVzcGFjZVxuICAgICAgRVZFTlRfQlVJTEQgPSAnYnVpbGQnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9CVUlMVCA9ICdidWlsdCcgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX0RSQUdfU1RBUlQgPSAnZHJhZ3N0YXJ0JyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfRFJBR19NT1ZFID0gJ2RyYWdtb3ZlJyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfRFJBR19FTkQgPSAnZHJhZ2VuZCcgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX1pPT01fSU4gPSAnem9vbWluJyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfWk9PTV9PVVQgPSAnem9vbW91dCcgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX0NIQU5HRSA9ICdjaGFuZ2UnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG5cbiAgICAgIC8vIFN1cHBvcnRzXG4gICAgICBTVVBQT1JUX0NBTlZBUyA9ICQuaXNGdW5jdGlvbigkKCc8Y2FudmFzPicpWzBdLmdldENvbnRleHQpLFxuXG4gICAgICAvLyBPdGhlcnNcbiAgICAgIHNxcnQgPSBNYXRoLnNxcnQsXG4gICAgICBtaW4gPSBNYXRoLm1pbixcbiAgICAgIG1heCA9IE1hdGgubWF4LFxuICAgICAgYWJzID0gTWF0aC5hYnMsXG4gICAgICBzaW4gPSBNYXRoLnNpbixcbiAgICAgIGNvcyA9IE1hdGguY29zLFxuICAgICAgbnVtID0gcGFyc2VGbG9hdCxcblxuICAgICAgLy8gUHJvdG90eXBlXG4gICAgICBwcm90b3R5cGUgPSB7fTtcblxuICBmdW5jdGlvbiBpc051bWJlcihuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJyAmJiAhaXNOYU4obik7XG4gIH1cblxuICBmdW5jdGlvbiBpc1VuZGVmaW5lZChuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvQXJyYXkob2JqLCBvZmZzZXQpIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgaWYgKGlzTnVtYmVyKG9mZnNldCkpIHsgLy8gSXQncyBuZWNlc3NhcnkgZm9yIElFOFxuICAgICAgYXJncy5wdXNoKG9mZnNldCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3Muc2xpY2UuYXBwbHkob2JqLCBhcmdzKTtcbiAgfVxuXG4gIC8vIEN1c3RvbSBwcm94eSB0byBhdm9pZCBqUXVlcnkncyBndWlkXG4gIGZ1bmN0aW9uIHByb3h5KGZuLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cywgMik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KHRvQXJyYXkoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpc0Nyb3NzT3JpZ2luVVJMKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHVybC5tYXRjaCgvXihodHRwcz86KVxcL1xcLyhbXlxcOlxcL1xcPyNdKyk6PyhcXGQqKS9pKTtcblxuICAgIHJldHVybiBwYXJ0cyAmJiAocGFydHNbMV0gIT09IGxvY2F0aW9uLnByb3RvY29sIHx8IHBhcnRzWzJdICE9PSBsb2NhdGlvbi5ob3N0bmFtZSB8fCBwYXJ0c1szXSAhPT0gbG9jYXRpb24ucG9ydCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUaW1lc3RhbXAodXJsKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9ICd0aW1lc3RhbXA9JyArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICByZXR1cm4gKHVybCArICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyB0aW1lc3RhbXApO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Um90YXRlVmFsdWUoZGVncmVlKSB7XG4gICAgcmV0dXJuIGRlZ3JlZSA/ICdyb3RhdGUoJyArIGRlZ3JlZSArICdkZWcpJyA6ICdub25lJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJvdGF0ZWRTaXplcyhkYXRhLCByZXZlcnNlKSB7XG4gICAgdmFyIGRlZyA9IGFicyhkYXRhLmRlZ3JlZSkgJSAxODAsXG4gICAgICAgIGFyYyA9IChkZWcgPiA5MCA/ICgxODAgLSBkZWcpIDogZGVnKSAqIE1hdGguUEkgLyAxODAsXG4gICAgICAgIHNpbkFyYyA9IHNpbihhcmMpLFxuICAgICAgICBjb3NBcmMgPSBjb3MoYXJjKSxcbiAgICAgICAgd2lkdGggPSBkYXRhLndpZHRoLFxuICAgICAgICBoZWlnaHQgPSBkYXRhLmhlaWdodCxcbiAgICAgICAgYXNwZWN0UmF0aW8gPSBkYXRhLmFzcGVjdFJhdGlvLFxuICAgICAgICBuZXdXaWR0aCxcbiAgICAgICAgbmV3SGVpZ2h0O1xuXG4gICAgaWYgKCFyZXZlcnNlKSB7XG4gICAgICBuZXdXaWR0aCA9IHdpZHRoICogY29zQXJjICsgaGVpZ2h0ICogc2luQXJjO1xuICAgICAgbmV3SGVpZ2h0ID0gd2lkdGggKiBzaW5BcmMgKyBoZWlnaHQgKiBjb3NBcmM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1dpZHRoID0gd2lkdGggLyAoY29zQXJjICsgc2luQXJjIC8gYXNwZWN0UmF0aW8pO1xuICAgICAgbmV3SGVpZ2h0ID0gbmV3V2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IG5ld1dpZHRoLFxuICAgICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U291cmNlQ2FudmFzKGltYWdlLCBkYXRhKSB7XG4gICAgdmFyIGNhbnZhcyA9ICQoJzxjYW52YXM+JylbMF0sXG4gICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSxcbiAgICAgICAgd2lkdGggPSBkYXRhLm5hdHVyYWxXaWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gZGF0YS5uYXR1cmFsSGVpZ2h0LFxuICAgICAgICByb3RhdGUgPSBkYXRhLnJvdGF0ZSxcbiAgICAgICAgcm90YXRlZCA9IGdldFJvdGF0ZWRTaXplcyh7XG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgIGRlZ3JlZTogcm90YXRlXG4gICAgICAgIH0pO1xuXG4gICAgaWYgKHJvdGF0ZSkge1xuICAgICAgY2FudmFzLndpZHRoID0gcm90YXRlZC53aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSByb3RhdGVkLmhlaWdodDtcbiAgICAgIGNvbnRleHQuc2F2ZSgpO1xuICAgICAgY29udGV4dC50cmFuc2xhdGUocm90YXRlZC53aWR0aCAvIDIsIHJvdGF0ZWQuaGVpZ2h0IC8gMik7XG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGUgKiBNYXRoLlBJIC8gMTgwKTtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAtd2lkdGggLyAyLCAtaGVpZ2h0IC8gMiwgd2lkdGgsIGhlaWdodCk7XG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBmdW5jdGlvbiBDcm9wcGVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ3JvcHBlci5ERUZBVUxUUywgJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpICYmIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuYnVpbHQgPSBmYWxzZTtcbiAgICB0aGlzLnJvdGF0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNyb3BwZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xuICAgIHRoaXMuY3JvcEJveCA9IG51bGw7XG5cbiAgICB0aGlzLmxvYWQoKTtcbiAgfVxuXG4gIHByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAkdGhpcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgIGNyb3NzT3JpZ2luLFxuICAgICAgICBidXN0Q2FjaGVVcmwsXG4gICAgICAgIGJ1aWxkRXZlbnQsXG4gICAgICAgICRjbG9uZTtcblxuICAgIGlmICghdXJsKSB7XG4gICAgICBpZiAoJHRoaXMuaXMoJ2ltZycpKSB7XG4gICAgICAgIGlmICghJHRoaXMuYXR0cignc3JjJykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1cmwgPSAkdGhpcy5wcm9wKCdzcmMnKTtcbiAgICAgIH0gZWxzZSBpZiAoJHRoaXMuaXMoJ2NhbnZhcycpICYmIFNVUFBPUlRfQ0FOVkFTKSB7XG4gICAgICAgIHVybCA9ICR0aGlzWzBdLnRvRGF0YVVSTCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYnVpbGRFdmVudCA9ICQuRXZlbnQoRVZFTlRfQlVJTEQpO1xuXG4gICAgaWYoJHRoaXMub25lKEVWRU5UX0JVSUxELCBvcHRpb25zLmJ1aWxkKS50cmlnZ2VyKXtcbiAgICAgICR0aGlzLm9uZShFVkVOVF9CVUlMRCwgb3B0aW9ucy5idWlsZCkudHJpZ2dlcihidWlsZEV2ZW50KTsgLy8gT25seSB0cmlnZ2VyIG9uY2VcbiAgICB9XG5cbiAgICBpZiAoYnVpbGRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNoZWNrSW1hZ2VPcmlnaW4gJiYgaXNDcm9zc09yaWdpblVSTCh1cmwpKSB7XG4gICAgICBjcm9zc09yaWdpbiA9ICcgY3Jvc3NPcmlnaW49XCJhbm9ueW1vdXNcIic7XG5cbiAgICAgIGlmICghJHRoaXMucHJvcCgnY3Jvc3NPcmlnaW4nKSkgeyAvLyBPbmx5IHdoZW4gdGhlcmUgd2FzIG5vdCBhIFwiY3Jvc3NPcmlnaW5cIiBwcm9wZXJ0eVxuICAgICAgICBidXN0Q2FjaGVVcmwgPSBhZGRUaW1lc3RhbXAodXJsKTsgLy8gQnVzdCBjYWNoZSAoIzE0OClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJRTggY29tcGF0aWJpbGl0eTogRG9uJ3QgdXNlIFwiJCgpLmF0dHIoKVwiIHRvIHNldCBcInNyY1wiXG4gICAgdGhpcy4kY2xvbmUgPSAkY2xvbmUgPSAkKCc8aW1nJyArIChjcm9zc09yaWdpbiB8fCAnJykgKyAnIHNyYz1cIicgKyAoYnVzdENhY2hlVXJsIHx8IHVybCkgKyAnXCI+Jyk7XG5cbiAgICAkY2xvbmUub25lKCdsb2FkJywgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1hZ2UgPSAkY2xvbmVbMF0sXG4gICAgICAgICAgbmF0dXJhbFdpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoIHx8IGltYWdlLndpZHRoLFxuICAgICAgICAgIG5hdHVyYWxIZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0IHx8IGltYWdlLmhlaWdodDsgLy8gJGNsb25lLndpZHRoKCkgYW5kICRjbG9uZS5oZWlnaHQoKSB3aWxsIHJldHVybiAwIGluIElFOCAoIzMxOSlcblxuICAgICAgdGhpcy5pbWFnZSA9IHtcbiAgICAgICAgbmF0dXJhbFdpZHRoOiBuYXR1cmFsV2lkdGgsXG4gICAgICAgIG5hdHVyYWxIZWlnaHQ6IG5hdHVyYWxIZWlnaHQsXG4gICAgICAgIGFzcGVjdFJhdGlvOiBuYXR1cmFsV2lkdGggLyBuYXR1cmFsSGVpZ2h0LFxuICAgICAgICByb3RhdGU6IDBcbiAgICAgIH07XG5cbiAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgfSwgdGhpcykpLm9uZSgnZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkY2xvbmUucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIGFuZCBpbnNlcnQgaW50byB0aGUgZG9jdW1lbnRcbiAgICAkY2xvbmUuYWRkQ2xhc3MoQ0xBU1NfSElERSkuaW5zZXJ0QWZ0ZXIoJHRoaXMpO1xuICB9O1xuXG4gIHByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAkY2xvbmUgPSB0aGlzLiRjbG9uZSxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgJGNyb3BwZXIsXG4gICAgICAgICRjcm9wQm94LFxuICAgICAgICAkZmFjZTtcblxuICAgIGlmICghdGhpcy5yZWFkeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJ1aWx0KSB7XG4gICAgICB0aGlzLnVuYnVpbGQoKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgY3JvcHBlciBlbGVtZW50c1xuICAgIHRoaXMuJGNyb3BwZXIgPSAkY3JvcHBlciA9ICQoQ3JvcHBlci5URU1QTEFURSk7XG5cbiAgICAvLyBIaWRlIHRoZSBvcmlnaW5hbCBpbWFnZVxuICAgICR0aGlzLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG5cbiAgICAvLyBTaG93IHRoZSBjbG9uZSBpYW1nZVxuICAgICRjbG9uZS5yZW1vdmVDbGFzcyhDTEFTU19ISURFKTtcblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudCgpLmFwcGVuZCgkY3JvcHBlcik7XG4gICAgdGhpcy4kY2FudmFzID0gJGNyb3BwZXIuZmluZCgnLmNyb3BwZXItY2FudmFzJykuYXBwZW5kKCRjbG9uZSk7XG4gICAgdGhpcy4kZHJhZ0JveCA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLWRyYWctYm94Jyk7XG4gICAgdGhpcy4kY3JvcEJveCA9ICRjcm9wQm94ID0gJGNyb3BwZXIuZmluZCgnLmNyb3BwZXItY3JvcC1ib3gnKTtcbiAgICB0aGlzLiR2aWV3Qm94ID0gJGNyb3BwZXIuZmluZCgnLmNyb3BwZXItdmlldy1ib3gnKTtcbiAgICB0aGlzLiRmYWNlID0gJGZhY2UgPSAkY3JvcEJveC5maW5kKCcuY3JvcHBlci1mYWNlJyk7XG5cbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICAgIHRoaXMuaW5pdFByZXZpZXcoKTtcblxuICAgIC8vIEZvcm1hdCBhc3BlY3QgcmF0aW9cbiAgICBvcHRpb25zLmFzcGVjdFJhdGlvID0gbnVtKG9wdGlvbnMuYXNwZWN0UmF0aW8pIHx8IE5hTjsgLy8gMCAtPiBOYU5cblxuICAgIGlmIChvcHRpb25zLmF1dG9Dcm9wKSB7XG4gICAgICB0aGlzLmNyb3BwZWQgPSB0cnVlO1xuXG4gICAgICBpZiAob3B0aW9ucy5tb2RhbCkge1xuICAgICAgICB0aGlzLiRkcmFnQm94LmFkZENsYXNzKENMQVNTX01PREFMKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgJGNyb3BCb3guYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICAkY3JvcHBlci5hZGRDbGFzcyhDTEFTU19CRyk7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgJGZhY2UuYWRkQ2xhc3MoQ0xBU1NfSU5WSVNJQkxFKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuZ3VpZGVzKSB7XG4gICAgICAkY3JvcEJveC5maW5kKCcuY3JvcHBlci1kYXNoZWQnKS5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNyb3BCb3hNb3ZhYmxlKSB7XG4gICAgICAkZmFjZS5hZGRDbGFzcyhDTEFTU19NT1ZFKS5kYXRhKCdkcmFnJywgJ2FsbCcpO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5jcm9wQm94UmVzaXphYmxlKSB7XG4gICAgICAkY3JvcEJveC5maW5kKCcuY3JvcHBlci1saW5lLCAuY3JvcHBlci1wb2ludCcpLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXREcmFnTW9kZShvcHRpb25zLmRyYWdDcm9wID8gJ2Nyb3AnIDogb3B0aW9ucy5tb3ZhYmxlID8gJ21vdmUnIDogJ25vbmUnKTtcblxuICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5zZXREYXRhKG9wdGlvbnMuZGF0YSk7XG4gICAgaWYoJHRoaXMub25lKEVWRU5UX0JVSUxULCBvcHRpb25zLmJ1aWx0KS50cmlnZ2VyKXtcbiAgICAgICR0aGlzLm9uZShFVkVOVF9CVUlMVCwgb3B0aW9ucy5idWlsdCkudHJpZ2dlcihFVkVOVF9CVUlMVCk7IC8vIE9ubHkgdHJpZ2dlciBvbmNlXG4gICAgfVxuICB9O1xuXG4gIHByb3RvdHlwZS51bmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5idWlsdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbHQgPSBmYWxzZTtcbiAgICB0aGlzLmluaXRpYWxJbWFnZSA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsQ2FudmFzID0gbnVsbDsgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgd2hlbiByZXBsYWNlXG4gICAgdGhpcy5pbml0aWFsQ3JvcEJveCA9IG51bGw7XG4gICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcbiAgICB0aGlzLmNyb3BCb3ggPSBudWxsOyAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB3aGVuIHJlcGxhY2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVycygpO1xuXG4gICAgdGhpcy5yZXNldFByZXZpZXcoKTtcbiAgICB0aGlzLiRwcmV2aWV3ID0gbnVsbDtcblxuICAgIHRoaXMuJHZpZXdCb3ggPSBudWxsO1xuICAgIHRoaXMuJGNyb3BCb3ggPSBudWxsO1xuICAgIHRoaXMuJGRyYWdCb3ggPSBudWxsO1xuICAgIHRoaXMuJGNhbnZhcyA9IG51bGw7XG4gICAgdGhpcy4kY29udGFpbmVyID0gbnVsbDtcblxuICAgIHRoaXMuJGNyb3BwZXIucmVtb3ZlKCk7XG4gICAgdGhpcy4kY3JvcHBlciA9IG51bGw7XG4gIH07XG5cbiAgJC5leHRlbmQocHJvdG90eXBlLCB7XG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmluaXRDb250YWluZXIoKTtcbiAgICAgIHRoaXMuaW5pdENhbnZhcygpO1xuICAgICAgdGhpcy5pbml0Q3JvcEJveCgpO1xuXG4gICAgICB0aGlzLnJlbmRlckNhbnZhcygpO1xuXG4gICAgICBpZiAodGhpcy5jcm9wcGVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0Q29udGFpbmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAgICRjb250YWluZXIgPSB0aGlzLiRjb250YWluZXIsXG4gICAgICAgICAgJGNyb3BwZXIgPSB0aGlzLiRjcm9wcGVyLFxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgICRjcm9wcGVyLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICAkdGhpcy5yZW1vdmVDbGFzcyhDTEFTU19ISURERU4pO1xuXG4gICAgICAkY3JvcHBlci5jc3MoKHRoaXMuY29udGFpbmVyID0ge1xuICAgICAgICB3aWR0aDogbWF4KCRjb250YWluZXIud2lkdGgoKSwgbnVtKG9wdGlvbnMubWluQ29udGFpbmVyV2lkdGgpIHx8IDIwMCksXG4gICAgICAgIGhlaWdodDogbWF4KCRjb250YWluZXIuaGVpZ2h0KCksIG51bShvcHRpb25zLm1pbkNvbnRhaW5lckhlaWdodCkgfHwgMTAwKVxuICAgICAgfSkpO1xuXG4gICAgICAkdGhpcy5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgJGNyb3BwZXIucmVtb3ZlQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICB9LFxuXG4gICAgLy8gaW1hZ2UgYm94ICh3cmFwcGVyKVxuICAgIGluaXRDYW52YXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aCxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0LFxuICAgICAgICAgIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IGltYWdlLmFzcGVjdFJhdGlvLFxuICAgICAgICAgIGNhbnZhcyA9IHtcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiBhc3BlY3RSYXRpbyxcbiAgICAgICAgICAgIHdpZHRoOiBjb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogY29udGFpbmVySGVpZ2h0XG4gICAgICAgICAgfTtcblxuICAgICAgaWYgKGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvID4gY29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGNvbnRhaW5lcldpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW52YXMud2lkdGggPSBjb250YWluZXJIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgIH1cblxuICAgICAgY2FudmFzLm9sZExlZnQgPSBjYW52YXMubGVmdCA9IChjb250YWluZXJXaWR0aCAtIGNhbnZhcy53aWR0aCkgLyAyO1xuICAgICAgY2FudmFzLm9sZFRvcCA9IGNhbnZhcy50b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gY2FudmFzLmhlaWdodCkgLyAyO1xuXG4gICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgIHRoaXMubGltaXRDYW52YXModHJ1ZSwgdHJ1ZSk7XG4gICAgICB0aGlzLmluaXRpYWxJbWFnZSA9ICQuZXh0ZW5kKHt9LCBpbWFnZSk7XG4gICAgICB0aGlzLmluaXRpYWxDYW52YXMgPSAkLmV4dGVuZCh7fSwgY2FudmFzKTtcbiAgICB9LFxuXG4gICAgbGltaXRDYW52YXM6IGZ1bmN0aW9uIChzaXplLCBwb3NpdGlvbikge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3QsXG4gICAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIud2lkdGgsXG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IGNhbnZhcy5hc3BlY3RSYXRpbyxcbiAgICAgICAgICBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICAgIGNyb3BwZWQgPSB0aGlzLmNyb3BwZWQgJiYgY3JvcEJveCxcbiAgICAgICAgICBpbml0aWFsQ2FudmFzID0gdGhpcy5pbml0aWFsQ2FudmFzIHx8IGNhbnZhcyxcbiAgICAgICAgICBpbml0aWFsQ2FudmFzV2lkdGggPSBpbml0aWFsQ2FudmFzLndpZHRoLFxuICAgICAgICAgIGluaXRpYWxDYW52YXNIZWlnaHQgPSBpbml0aWFsQ2FudmFzLmhlaWdodCxcbiAgICAgICAgICBtaW5DYW52YXNXaWR0aCxcbiAgICAgICAgICBtaW5DYW52YXNIZWlnaHQ7XG5cbiAgICAgIGlmIChzaXplKSB7XG4gICAgICAgIG1pbkNhbnZhc1dpZHRoID0gbnVtKG9wdGlvbnMubWluQ2FudmFzV2lkdGgpIHx8IDA7XG4gICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG51bShvcHRpb25zLm1pbkNhbnZhc0hlaWdodCkgfHwgMDtcblxuICAgICAgICBpZiAobWluQ2FudmFzV2lkdGgpIHtcbiAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IG1heChjcm9wcGVkID8gY3JvcEJveC53aWR0aCA6IGluaXRpYWxDYW52YXNXaWR0aCwgbWluQ2FudmFzV2lkdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG1pbkNhbnZhc1dpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAobWluQ2FudmFzSGVpZ2h0KSB7XG4gICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gbWF4KGNyb3BwZWQgPyBjcm9wQm94LmhlaWdodCA6IGluaXRpYWxDYW52YXNIZWlnaHQsIG1pbkNhbnZhc0hlaWdodCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICBpZiAoY3JvcHBlZCkge1xuICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBjcm9wQm94LndpZHRoO1xuICAgICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gY3JvcEJveC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbyA+IG1pbkNhbnZhc1dpZHRoKSB7XG4gICAgICAgICAgICAgIG1pbkNhbnZhc1dpZHRoID0gbWluQ2FudmFzSGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBtaW5DYW52YXNXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IGluaXRpYWxDYW52YXNXaWR0aDtcbiAgICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IGluaXRpYWxDYW52YXNIZWlnaHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJC5leHRlbmQoY2FudmFzLCB7XG4gICAgICAgICAgbWluV2lkdGg6IG1pbkNhbnZhc1dpZHRoLFxuICAgICAgICAgIG1pbkhlaWdodDogbWluQ2FudmFzSGVpZ2h0LFxuICAgICAgICAgIG1heFdpZHRoOiBJbmZpbml0eSxcbiAgICAgICAgICBtYXhIZWlnaHQ6IEluZmluaXR5XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgIGlmIChjcm9wcGVkKSB7XG4gICAgICAgICAgICBjYW52YXMubWluTGVmdCA9IG1pbihjcm9wQm94LmxlZnQsIChjcm9wQm94LmxlZnQgKyBjcm9wQm94LndpZHRoKSAtIGNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgICBjYW52YXMubWluVG9wID0gbWluKGNyb3BCb3gudG9wLCAoY3JvcEJveC50b3AgKyBjcm9wQm94LmhlaWdodCkgLSBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNhbnZhcy5tYXhMZWZ0ID0gY3JvcEJveC5sZWZ0O1xuICAgICAgICAgICAgY2FudmFzLm1heFRvcCA9IGNyb3BCb3gudG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMubWluTGVmdCA9IG1pbigwLCBjb250YWluZXJXaWR0aCAtIGNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgICBjYW52YXMubWluVG9wID0gbWluKDAsIGNvbnRhaW5lckhlaWdodCAtIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgY2FudmFzLm1heExlZnQgPSBtYXgoMCwgY29udGFpbmVyV2lkdGggLSBjYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgY2FudmFzLm1heFRvcCA9IG1heCgwLCBjb250YWluZXJIZWlnaHQgLSBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FudmFzLm1pbkxlZnQgPSAtY2FudmFzLndpZHRoO1xuICAgICAgICAgIGNhbnZhcy5taW5Ub3AgPSAtY2FudmFzLmhlaWdodDtcbiAgICAgICAgICBjYW52YXMubWF4TGVmdCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICAgIGNhbnZhcy5tYXhUb3AgPSBjb250YWluZXJIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyQ2FudmFzOiBmdW5jdGlvbiAoY2hhbmdlZCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICAgIGFzcGVjdFJhdGlvLFxuICAgICAgICAgIHJvdGF0ZWQ7XG5cbiAgICAgIGlmICh0aGlzLnJvdGF0ZWQpIHtcbiAgICAgICAgdGhpcy5yb3RhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgLy8gQ29tcHV0ZXMgcm90YXRhdGlvbiBzaXplcyB3aXRoIGltYWdlIHNpemVzXG4gICAgICAgIHJvdGF0ZWQgPSBnZXRSb3RhdGVkU2l6ZXMoe1xuICAgICAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGltYWdlLmhlaWdodCxcbiAgICAgICAgICBkZWdyZWU6IGltYWdlLnJvdGF0ZVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3BlY3RSYXRpbyA9IHJvdGF0ZWQud2lkdGggLyByb3RhdGVkLmhlaWdodDtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8gIT09IGNhbnZhcy5hc3BlY3RSYXRpbykge1xuICAgICAgICAgIGNhbnZhcy5sZWZ0IC09IChyb3RhdGVkLndpZHRoIC0gY2FudmFzLndpZHRoKSAvIDI7XG4gICAgICAgICAgY2FudmFzLnRvcCAtPSAocm90YXRlZC5oZWlnaHQgLSBjYW52YXMuaGVpZ2h0KSAvIDI7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gcm90YXRlZC53aWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcm90YXRlZC5oZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmFzcGVjdFJhdGlvID0gYXNwZWN0UmF0aW87XG4gICAgICAgICAgdGhpcy5saW1pdENhbnZhcyh0cnVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbnZhcy53aWR0aCA+IGNhbnZhcy5tYXhXaWR0aCB8fCBjYW52YXMud2lkdGggPCBjYW52YXMubWluV2lkdGgpIHtcbiAgICAgICAgY2FudmFzLmxlZnQgPSBjYW52YXMub2xkTGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbnZhcy5oZWlnaHQgPiBjYW52YXMubWF4SGVpZ2h0IHx8IGNhbnZhcy5oZWlnaHQgPCBjYW52YXMubWluSGVpZ2h0KSB7XG4gICAgICAgIGNhbnZhcy50b3AgPSBjYW52YXMub2xkVG9wO1xuICAgICAgfVxuXG4gICAgICBjYW52YXMud2lkdGggPSBtaW4obWF4KGNhbnZhcy53aWR0aCwgY2FudmFzLm1pbldpZHRoKSwgY2FudmFzLm1heFdpZHRoKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBtaW4obWF4KGNhbnZhcy5oZWlnaHQsIGNhbnZhcy5taW5IZWlnaHQpLCBjYW52YXMubWF4SGVpZ2h0KTtcblxuICAgICAgdGhpcy5saW1pdENhbnZhcyhmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgIGNhbnZhcy5vbGRMZWZ0ID0gY2FudmFzLmxlZnQgPSBtaW4obWF4KGNhbnZhcy5sZWZ0LCBjYW52YXMubWluTGVmdCksIGNhbnZhcy5tYXhMZWZ0KTtcbiAgICAgIGNhbnZhcy5vbGRUb3AgPSBjYW52YXMudG9wID0gbWluKG1heChjYW52YXMudG9wLCBjYW52YXMubWluVG9wKSwgY2FudmFzLm1heFRvcCk7XG5cbiAgICAgIHRoaXMuJGNhbnZhcy5jc3Moe1xuICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHQsXG4gICAgICAgIGxlZnQ6IGNhbnZhcy5sZWZ0LFxuICAgICAgICB0b3A6IGNhbnZhcy50b3BcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlbmRlckltYWdlKCk7XG5cbiAgICAgIGlmICh0aGlzLmNyb3BwZWQgJiYgb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgdGhpcy5saW1pdENyb3BCb3godHJ1ZSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMub3V0cHV0KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlckltYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICAgIHJldmVyc2VkO1xuXG4gICAgICBpZiAoaW1hZ2Uucm90YXRlKSB7XG4gICAgICAgIHJldmVyc2VkID0gZ2V0Um90YXRlZFNpemVzKHtcbiAgICAgICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcbiAgICAgICAgICBkZWdyZWU6IGltYWdlLnJvdGF0ZSxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogaW1hZ2UuYXNwZWN0UmF0aW9cbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgICQuZXh0ZW5kKGltYWdlLCByZXZlcnNlZCA/IHtcbiAgICAgICAgd2lkdGg6IHJldmVyc2VkLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJldmVyc2VkLmhlaWdodCxcbiAgICAgICAgbGVmdDogKGNhbnZhcy53aWR0aCAtIHJldmVyc2VkLndpZHRoKSAvIDIsXG4gICAgICAgIHRvcDogKGNhbnZhcy5oZWlnaHQgLSByZXZlcnNlZC5oZWlnaHQpIC8gMlxuICAgICAgfSA6IHtcbiAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDBcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRjbG9uZS5jc3Moe1xuICAgICAgICB3aWR0aDogaW1hZ2Uud2lkdGgsXG4gICAgICAgIGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuICAgICAgICBtYXJnaW5MZWZ0OiBpbWFnZS5sZWZ0LFxuICAgICAgICBtYXJnaW5Ub3A6IGltYWdlLnRvcCxcbiAgICAgICAgdHJhbnNmb3JtOiBnZXRSb3RhdGVWYWx1ZShpbWFnZS5yb3RhdGUpXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdENyb3BCb3g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gb3B0aW9ucy5hc3BlY3RSYXRpbyxcbiAgICAgICAgICBhdXRvQ3JvcEFyZWEgPSBudW0ob3B0aW9ucy5hdXRvQ3JvcEFyZWEpIHx8IDAuOCxcbiAgICAgICAgICBjcm9wQm94ID0ge1xuICAgICAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodFxuICAgICAgICAgIH07XG5cbiAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICBpZiAoY2FudmFzLmhlaWdodCAqIGFzcGVjdFJhdGlvID4gY2FudmFzLndpZHRoKSB7XG4gICAgICAgICAgY3JvcEJveC5oZWlnaHQgPSBjcm9wQm94LndpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3JvcEJveC53aWR0aCA9IGNyb3BCb3guaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jcm9wQm94ID0gY3JvcEJveDtcbiAgICAgIHRoaXMubGltaXRDcm9wQm94KHRydWUsIHRydWUpO1xuXG4gICAgICAvLyBJbml0aWFsaXplIGF1dG8gY3JvcCBhcmVhXG4gICAgICBjcm9wQm94LndpZHRoID0gbWluKG1heChjcm9wQm94LndpZHRoLCBjcm9wQm94Lm1pbldpZHRoKSwgY3JvcEJveC5tYXhXaWR0aCk7XG4gICAgICBjcm9wQm94LmhlaWdodCA9IG1pbihtYXgoY3JvcEJveC5oZWlnaHQsIGNyb3BCb3gubWluSGVpZ2h0KSwgY3JvcEJveC5tYXhIZWlnaHQpO1xuXG4gICAgICAvLyBUaGUgd2lkdGggb2YgYXV0byBjcm9wIGFyZWEgbXVzdCBsYXJnZSB0aGFuIFwibWluV2lkdGhcIiwgYW5kIHRoZSBoZWlnaHQgdG9vLiAoIzE2NClcbiAgICAgIGNyb3BCb3gud2lkdGggPSBtYXgoY3JvcEJveC5taW5XaWR0aCwgY3JvcEJveC53aWR0aCAqIGF1dG9Dcm9wQXJlYSk7XG4gICAgICBjcm9wQm94LmhlaWdodCA9IG1heChjcm9wQm94Lm1pbkhlaWdodCwgY3JvcEJveC5oZWlnaHQgKiBhdXRvQ3JvcEFyZWEpO1xuICAgICAgY3JvcEJveC5vbGRMZWZ0ID0gY3JvcEJveC5sZWZ0ID0gY2FudmFzLmxlZnQgKyAoY2FudmFzLndpZHRoIC0gY3JvcEJveC53aWR0aCkgLyAyO1xuICAgICAgY3JvcEJveC5vbGRUb3AgPSBjcm9wQm94LnRvcCA9IGNhbnZhcy50b3AgKyAoY2FudmFzLmhlaWdodCAtIGNyb3BCb3guaGVpZ2h0KSAvIDI7XG5cbiAgICAgIHRoaXMuaW5pdGlhbENyb3BCb3ggPSAkLmV4dGVuZCh7fSwgY3JvcEJveCk7XG4gICAgfSxcblxuICAgIGxpbWl0Q3JvcEJveDogZnVuY3Rpb24gKHNpemUsIHBvc2l0aW9uKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBzdHJpY3QgPSBvcHRpb25zLnN0cmljdCxcbiAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aCxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0LFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSBvcHRpb25zLmFzcGVjdFJhdGlvLFxuICAgICAgICAgIG1pbkNyb3BCb3hXaWR0aCxcbiAgICAgICAgICBtaW5Dcm9wQm94SGVpZ2h0O1xuXG4gICAgICBpZiAoc2l6ZSkge1xuICAgICAgICBtaW5Dcm9wQm94V2lkdGggPSBudW0ob3B0aW9ucy5taW5Dcm9wQm94V2lkdGgpIHx8IDA7XG4gICAgICAgIG1pbkNyb3BCb3hIZWlnaHQgPSBudW0ob3B0aW9ucy5taW5Dcm9wQm94SGVpZ2h0KSB8fCAwO1xuXG4gICAgICAgIC8vIG1pbi9tYXhDcm9wQm94V2lkdGgvSGVpZ2h0IG11c3QgbGVzcyB0aGFuIGNvbmF0aW5lciB3aWR0aC9oZWlnaHRcbiAgICAgICAgY3JvcEJveC5taW5XaWR0aCA9IG1pbihjb250YWluZXJXaWR0aCwgbWluQ3JvcEJveFdpZHRoKTtcbiAgICAgICAgY3JvcEJveC5taW5IZWlnaHQgPSBtaW4oY29udGFpbmVySGVpZ2h0LCBtaW5Dcm9wQm94SGVpZ2h0KTtcbiAgICAgICAgY3JvcEJveC5tYXhXaWR0aCA9IG1pbihjb250YWluZXJXaWR0aCwgc3RyaWN0ID8gY2FudmFzLndpZHRoIDogY29udGFpbmVyV2lkdGgpO1xuICAgICAgICBjcm9wQm94Lm1heEhlaWdodCA9IG1pbihjb250YWluZXJIZWlnaHQsIHN0cmljdCA/IGNhbnZhcy5oZWlnaHQgOiBjb250YWluZXJIZWlnaHQpO1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIC8vIGNvbXBhcmUgY3JvcCBib3ggc2l6ZSB3aXRoIGNvbnRhaW5lciBmaXJzdFxuICAgICAgICAgIGlmIChjcm9wQm94Lm1heEhlaWdodCAqIGFzcGVjdFJhdGlvID4gY3JvcEJveC5tYXhXaWR0aCkge1xuICAgICAgICAgICAgY3JvcEJveC5taW5IZWlnaHQgPSBjcm9wQm94Lm1pbldpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgICBjcm9wQm94Lm1heEhlaWdodCA9IGNyb3BCb3gubWF4V2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3JvcEJveC5taW5XaWR0aCA9IGNyb3BCb3gubWluSGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgICBjcm9wQm94Lm1heFdpZHRoID0gY3JvcEJveC5tYXhIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgXCJtaW5XaWR0aFwiIG11c3QgYmUgbGVzcyB0aGFuIFwibWF4V2lkdGhcIiwgYW5kIHRoZSBcIm1pbkhlaWdodFwiIHRvby5cbiAgICAgICAgY3JvcEJveC5taW5XaWR0aCA9IG1pbihjcm9wQm94Lm1heFdpZHRoLCBjcm9wQm94Lm1pbldpZHRoKTtcbiAgICAgICAgY3JvcEJveC5taW5IZWlnaHQgPSBtaW4oY3JvcEJveC5tYXhIZWlnaHQsIGNyb3BCb3gubWluSGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICBjcm9wQm94Lm1pbkxlZnQgPSBtYXgoMCwgY2FudmFzLmxlZnQpO1xuICAgICAgICAgIGNyb3BCb3gubWluVG9wID0gbWF4KDAsIGNhbnZhcy50b3ApO1xuICAgICAgICAgIGNyb3BCb3gubWF4TGVmdCA9IG1pbihjb250YWluZXJXaWR0aCwgY2FudmFzLmxlZnQgKyBjYW52YXMud2lkdGgpIC0gY3JvcEJveC53aWR0aDtcbiAgICAgICAgICBjcm9wQm94Lm1heFRvcCA9IG1pbihjb250YWluZXJIZWlnaHQsIGNhbnZhcy50b3AgKyBjYW52YXMuaGVpZ2h0KSAtIGNyb3BCb3guaGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNyb3BCb3gubWluTGVmdCA9IDA7XG4gICAgICAgICAgY3JvcEJveC5taW5Ub3AgPSAwO1xuICAgICAgICAgIGNyb3BCb3gubWF4TGVmdCA9IGNvbnRhaW5lcldpZHRoIC0gY3JvcEJveC53aWR0aDtcbiAgICAgICAgICBjcm9wQm94Lm1heFRvcCA9IGNvbnRhaW5lckhlaWdodCAtIGNyb3BCb3guaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlckNyb3BCb3g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLndpZHRoLFxuICAgICAgICAgIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQsXG4gICAgICAgICAgY3JvcEJveCA9IHRoaXMuY3JvcEJveDtcblxuICAgICAgaWYgKGNyb3BCb3gud2lkdGggPiBjcm9wQm94Lm1heFdpZHRoIHx8IGNyb3BCb3gud2lkdGggPCBjcm9wQm94Lm1pbldpZHRoKSB7XG4gICAgICAgIGNyb3BCb3gubGVmdCA9IGNyb3BCb3gub2xkTGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNyb3BCb3guaGVpZ2h0ID4gY3JvcEJveC5tYXhIZWlnaHQgfHwgY3JvcEJveC5oZWlnaHQgPCBjcm9wQm94Lm1pbkhlaWdodCkge1xuICAgICAgICBjcm9wQm94LnRvcCA9IGNyb3BCb3gub2xkVG9wO1xuICAgICAgfVxuXG4gICAgICBjcm9wQm94LndpZHRoID0gbWluKG1heChjcm9wQm94LndpZHRoLCBjcm9wQm94Lm1pbldpZHRoKSwgY3JvcEJveC5tYXhXaWR0aCk7XG4gICAgICBjcm9wQm94LmhlaWdodCA9IG1pbihtYXgoY3JvcEJveC5oZWlnaHQsIGNyb3BCb3gubWluSGVpZ2h0KSwgY3JvcEJveC5tYXhIZWlnaHQpO1xuXG4gICAgICB0aGlzLmxpbWl0Q3JvcEJveChmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgIGNyb3BCb3gub2xkTGVmdCA9IGNyb3BCb3gubGVmdCA9IG1pbihtYXgoY3JvcEJveC5sZWZ0LCBjcm9wQm94Lm1pbkxlZnQpLCBjcm9wQm94Lm1heExlZnQpO1xuICAgICAgY3JvcEJveC5vbGRUb3AgPSBjcm9wQm94LnRvcCA9IG1pbihtYXgoY3JvcEJveC50b3AsIGNyb3BCb3gubWluVG9wKSwgY3JvcEJveC5tYXhUb3ApO1xuXG4gICAgICBpZiAob3B0aW9ucy5tb3ZhYmxlICYmIG9wdGlvbnMuY3JvcEJveE1vdmFibGUpIHtcbiAgICAgICAgLy8gVHVybiB0byBtb3ZlIHRoZSBjYW52YXMgd2hlbiB0aGUgY3JvcCBib3ggaXMgZXF1YWwgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICB0aGlzLiRmYWNlLmRhdGEoJ2RyYWcnLCAoY3JvcEJveC53aWR0aCA9PT0gY29udGFpbmVyV2lkdGggJiYgY3JvcEJveC5oZWlnaHQgPT09IGNvbnRhaW5lckhlaWdodCkgPyAnbW92ZScgOiAnYWxsJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGNyb3BCb3guY3NzKHtcbiAgICAgICAgd2lkdGg6IGNyb3BCb3gud2lkdGgsXG4gICAgICAgIGhlaWdodDogY3JvcEJveC5oZWlnaHQsXG4gICAgICAgIGxlZnQ6IGNyb3BCb3gubGVmdCxcbiAgICAgICAgdG9wOiBjcm9wQm94LnRvcFxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmNyb3BwZWQgJiYgb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgdGhpcy5saW1pdENhbnZhcyh0cnVlLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMub3V0cHV0KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgJHRoaXMgPSB0aGlzLiRlbGVtZW50O1xuXG4gICAgICB0aGlzLnByZXZpZXcoKTtcblxuICAgICAgaWYgKG9wdGlvbnMuY3JvcCkge1xuICAgICAgICBvcHRpb25zLmNyb3AuY2FsbCgkdGhpcywgdGhpcy5nZXREYXRhKCkpO1xuICAgICAgfVxuXG4gICAgICAkdGhpcy50cmlnZ2VyKEVWRU5UX0NIQU5HRSk7XG4gICAgfVxuICB9KTtcblxuICBwcm90b3R5cGUuaW5pdFByZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVybCA9IHRoaXMudXJsO1xuXG4gICAgdGhpcy4kcHJldmlldyA9ICQodGhpcy5vcHRpb25zLnByZXZpZXcpO1xuICAgIHRoaXMuJHZpZXdCb3guaHRtbCgnPGltZyBzcmM9XCInICsgdXJsICsgJ1wiPicpO1xuXG4gICAgLy8gT3ZlcnJpZGUgaW1nIGVsZW1lbnQgc3R5bGVzXG4gICAgLy8gQWRkIGBkaXNwbGF5OmJsb2NrYCB0byBhdm9pZCBtYXJnaW4gdG9wIGlzc3VlIChPY2N1ciBvbmx5IHdoZW4gbWFyZ2luLXRvcCA8PSAtaGVpZ2h0KVxuICAgIHRoaXMuJHByZXZpZXcuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAkdGhpcy5kYXRhKENST1BQRVJfUFJFVklFVywge1xuICAgICAgICB3aWR0aDogJHRoaXMud2lkdGgoKSxcbiAgICAgICAgaGVpZ2h0OiAkdGhpcy5oZWlnaHQoKSxcbiAgICAgICAgb3JpZ2luYWw6ICR0aGlzLmh0bWwoKVxuICAgICAgfSkuaHRtbCgnPGltZyBzcmM9XCInICsgdXJsICsgJ1wiIHN0eWxlPVwiZGlzcGxheTpibG9jazt3aWR0aDoxMDAlO21pbi13aWR0aDowIWltcG9ydGFudDttaW4taGVpZ2h0OjAhaW1wb3J0YW50O21heC13aWR0aDpub25lIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50O2ltYWdlLW9yaWVudGF0aW9uOiAwZGVnIWltcG9ydGFudFwiPicpO1xuICAgIH0pO1xuICB9O1xuXG4gIHByb3RvdHlwZS5yZXNldFByZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kcHJldmlldy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICR0aGlzLmh0bWwoJHRoaXMuZGF0YShDUk9QUEVSX1BSRVZJRVcpLm9yaWdpbmFsKS5yZW1vdmVEYXRhKENST1BQRVJfUFJFVklFVyk7XG4gICAgfSk7XG4gIH07XG5cbiAgcHJvdG90eXBlLnByZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgIHdpZHRoID0gaW1hZ2Uud2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGltYWdlLmhlaWdodCxcbiAgICAgICAgbGVmdCA9IGNyb3BCb3gubGVmdCAtIGNhbnZhcy5sZWZ0IC0gaW1hZ2UubGVmdCxcbiAgICAgICAgdG9wID0gY3JvcEJveC50b3AgLSBjYW52YXMudG9wIC0gaW1hZ2UudG9wLFxuICAgICAgICByb3RhdGUgPSBpbWFnZS5yb3RhdGU7XG5cbiAgICBpZiAoIXRoaXMuY3JvcHBlZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4kdmlld0JveC5maW5kKCdpbWcnKS5jc3Moe1xuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBtYXJnaW5MZWZ0OiAtbGVmdCxcbiAgICAgIG1hcmdpblRvcDogLXRvcCxcbiAgICAgIHRyYW5zZm9ybTogZ2V0Um90YXRlVmFsdWUocm90YXRlKVxuICAgIH0pO1xuXG4gICAgdGhpcy4kcHJldmlldy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoQ1JPUFBFUl9QUkVWSUVXKSxcbiAgICAgICAgICByYXRpbyA9IGRhdGEud2lkdGggLyBjcm9wQm94LndpZHRoLFxuICAgICAgICAgIG5ld1dpZHRoID0gZGF0YS53aWR0aCxcbiAgICAgICAgICBuZXdIZWlnaHQgPSBjcm9wQm94LmhlaWdodCAqIHJhdGlvO1xuXG4gICAgICBpZiAobmV3SGVpZ2h0ID4gZGF0YS5oZWlnaHQpIHtcbiAgICAgICAgcmF0aW8gPSBkYXRhLmhlaWdodCAvIGNyb3BCb3guaGVpZ2h0O1xuICAgICAgICBuZXdXaWR0aCA9IGNyb3BCb3gud2lkdGggKiByYXRpbztcbiAgICAgICAgbmV3SGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgICR0aGlzLndpZHRoKG5ld1dpZHRoKS5oZWlnaHQobmV3SGVpZ2h0KS5maW5kKCdpbWcnKS5jc3Moe1xuICAgICAgICB3aWR0aDogd2lkdGggKiByYXRpbyxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgKiByYXRpbyxcbiAgICAgICAgbWFyZ2luTGVmdDogLWxlZnQgKiByYXRpbyxcbiAgICAgICAgbWFyZ2luVG9wOiAtdG9wICogcmF0aW8sXG4gICAgICAgIHRyYW5zZm9ybTogZ2V0Um90YXRlVmFsdWUocm90YXRlKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcHJvdG90eXBlLmFkZExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgJHRoaXMgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICAkY3JvcHBlciA9IHRoaXMuJGNyb3BwZXI7XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ3N0YXJ0KSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfRFJBR19TVEFSVCwgb3B0aW9ucy5kcmFnc3RhcnQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnbW92ZSkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX0RSQUdfTU9WRSwgb3B0aW9ucy5kcmFnbW92ZSk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdlbmQpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9EUkFHX0VORCwgb3B0aW9ucy5kcmFnZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuem9vbWluKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfWk9PTV9JTiwgb3B0aW9ucy56b29taW4pO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy56b29tb3V0KSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfWk9PTV9PVVQsIG9wdGlvbnMuem9vbW91dCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNoYW5nZSkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX0NIQU5HRSwgb3B0aW9ucy5jaGFuZ2UpO1xuICAgIH1cblxuICAgICRjcm9wcGVyLm9uKEVWRU5UX01PVVNFX0RPV04sICQucHJveHkodGhpcy5kcmFnc3RhcnQsIHRoaXMpKTtcblxuICAgIGlmIChvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMubW91c2VXaGVlbFpvb20pIHtcbiAgICAgICRjcm9wcGVyLm9uKEVWRU5UX1dIRUVMLCAkLnByb3h5KHRoaXMud2hlZWwsIHRoaXMpKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kb3VibGVDbGlja1RvZ2dsZSkge1xuICAgICAgJGNyb3BwZXIub24oRVZFTlRfREJMQ0xJQ0ssICQucHJveHkodGhpcy5kYmxjbGljaywgdGhpcykpO1xuICAgIH1cblxuICAgICRkb2N1bWVudC5vbihFVkVOVF9NT1VTRV9NT1ZFLCAodGhpcy5fZHJhZ21vdmUgPSBwcm94eSh0aGlzLmRyYWdtb3ZlLCB0aGlzKSkpLm9uKEVWRU5UX01PVVNFX1VQLCAodGhpcy5fZHJhZ2VuZCA9IHByb3h5KHRoaXMuZHJhZ2VuZCwgdGhpcykpKTtcblxuICAgIGlmIChvcHRpb25zLnJlc3BvbnNpdmUpIHtcbiAgICAgICR3aW5kb3cub24oRVZFTlRfUkVTSVpFLCAodGhpcy5fcmVzaXplID0gcHJveHkodGhpcy5yZXNpemUsIHRoaXMpKSk7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICR0aGlzID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgJGNyb3BwZXIgPSB0aGlzLiRjcm9wcGVyO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdzdGFydCkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9EUkFHX1NUQVJULCBvcHRpb25zLmRyYWdzdGFydCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdtb3ZlKSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX0RSQUdfTU9WRSwgb3B0aW9ucy5kcmFnbW92ZSk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdlbmQpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfRFJBR19FTkQsIG9wdGlvbnMuZHJhZ2VuZCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLnpvb21pbikpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9aT09NX0lOLCBvcHRpb25zLnpvb21pbik7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLnpvb21vdXQpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfWk9PTV9PVVQsIG9wdGlvbnMuem9vbW91dCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNoYW5nZSkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9DSEFOR0UsIG9wdGlvbnMuY2hhbmdlKTtcbiAgICB9XG5cbiAgICAkY3JvcHBlci5vZmYoRVZFTlRfTU9VU0VfRE9XTiwgdGhpcy5kcmFnc3RhcnQpO1xuXG4gICAgaWYgKG9wdGlvbnMuem9vbWFibGUgJiYgb3B0aW9ucy5tb3VzZVdoZWVsWm9vbSkge1xuICAgICAgJGNyb3BwZXIub2ZmKEVWRU5UX1dIRUVMLCB0aGlzLndoZWVsKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kb3VibGVDbGlja1RvZ2dsZSkge1xuICAgICAgJGNyb3BwZXIub2ZmKEVWRU5UX0RCTENMSUNLLCB0aGlzLmRibGNsaWNrKTtcbiAgICB9XG5cbiAgICAkZG9jdW1lbnQub2ZmKEVWRU5UX01PVVNFX01PVkUsIHRoaXMuX2RyYWdtb3ZlKS5vZmYoRVZFTlRfTU9VU0VfVVAsIHRoaXMuX2RyYWdlbmQpO1xuXG4gICAgaWYgKG9wdGlvbnMucmVzcG9uc2l2ZSkge1xuICAgICAgJHdpbmRvdy5vZmYoRVZFTlRfUkVTSVpFLCB0aGlzLl9yZXNpemUpO1xuICAgIH1cbiAgfTtcblxuICAkLmV4dGVuZChwcm90b3R5cGUsIHtcbiAgICByZXNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkY29udGFpbmVyID0gdGhpcy4kY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgIGNhbnZhc0RhdGEsXG4gICAgICAgICAgY3JvcEJveERhdGEsXG4gICAgICAgICAgcmF0aW87XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8ICFjb250YWluZXIpIHsgLy8gQ2hlY2sgXCJjb250YWluZXJcIiBmb3IgSUU4XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmF0aW8gPSAkY29udGFpbmVyLndpZHRoKCkgLyBjb250YWluZXIud2lkdGg7XG5cbiAgICAgIGlmIChyYXRpbyAhPT0gMSB8fCAkY29udGFpbmVyLmhlaWdodCgpICE9PSBjb250YWluZXIuaGVpZ2h0KSB7XG4gICAgICAgIGNhbnZhc0RhdGEgPSB0aGlzLmdldENhbnZhc0RhdGEoKTtcbiAgICAgICAgY3JvcEJveERhdGEgPSB0aGlzLmdldENyb3BCb3hEYXRhKCk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNEYXRhKCQuZWFjaChjYW52YXNEYXRhLCBmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAgIGNhbnZhc0RhdGFbaV0gPSBuICogcmF0aW87XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5zZXRDcm9wQm94RGF0YSgkLmVhY2goY3JvcEJveERhdGEsIGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgICAgY3JvcEJveERhdGFbaV0gPSBuICogcmF0aW87XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZGJsY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuJGRyYWdCb3guaGFzQ2xhc3MoQ0xBU1NfQ1JPUCkpIHtcbiAgICAgICAgdGhpcy5zZXREcmFnTW9kZSgnbW92ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREcmFnTW9kZSgnY3JvcCcpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB3aGVlbDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgZSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgZGVsdGEgPSAxO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmIChlLmRlbHRhWSkge1xuICAgICAgICBkZWx0YSA9IGUuZGVsdGFZID4gMCA/IDEgOiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoZS53aGVlbERlbHRhKSB7XG4gICAgICAgIGRlbHRhID0gLWUud2hlZWxEZWx0YSAvIDEyMDtcbiAgICAgIH0gZWxzZSBpZiAoZS5kZXRhaWwpIHtcbiAgICAgICAgZGVsdGEgPSBlLmRldGFpbCA+IDAgPyAxIDogLTE7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9vbSgtZGVsdGEgKiAwLjEpO1xuICAgIH0sXG5cbiAgICBkcmFnc3RhcnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgb3JpZ2luYWxFdmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgdG91Y2hlcyA9IG9yaWdpbmFsRXZlbnQgJiYgb3JpZ2luYWxFdmVudC50b3VjaGVzLFxuICAgICAgICAgIGUgPSBldmVudCxcbiAgICAgICAgICBkcmFnVHlwZSxcbiAgICAgICAgICBkcmFnU3RhcnRFdmVudCxcbiAgICAgICAgICB0b3VjaGVzTGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0b3VjaGVzKSB7XG4gICAgICAgIHRvdWNoZXNMZW5ndGggPSB0b3VjaGVzLmxlbmd0aDtcblxuICAgICAgICBpZiAodG91Y2hlc0xlbmd0aCA+IDEpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy56b29tYWJsZSAmJiBvcHRpb25zLnRvdWNoRHJhZ1pvb20gJiYgdG91Y2hlc0xlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgZSA9IHRvdWNoZXNbMV07XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WDIgPSBlLnBhZ2VYO1xuICAgICAgICAgICAgdGhpcy5zdGFydFkyID0gZS5wYWdlWTtcbiAgICAgICAgICAgIGRyYWdUeXBlID0gJ3pvb20nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZSA9IHRvdWNoZXNbMF07XG4gICAgICB9XG5cbiAgICAgIGRyYWdUeXBlID0gZHJhZ1R5cGUgfHwgJChlLnRhcmdldCkuZGF0YSgnZHJhZycpO1xuXG4gICAgICBpZiAoUkVHRVhQX0RSQUdfVFlQRVMudGVzdChkcmFnVHlwZSkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkcmFnU3RhcnRFdmVudCA9ICQuRXZlbnQoRVZFTlRfRFJBR19TVEFSVCwge1xuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgZHJhZ1R5cGU6IGRyYWdUeXBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihkcmFnU3RhcnRFdmVudCk7XG5cbiAgICAgICAgaWYgKGRyYWdTdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnVHlwZSA9IGRyYWdUeXBlO1xuICAgICAgICB0aGlzLmNyb3BwaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS5wYWdlWDtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLnBhZ2VZO1xuXG4gICAgICAgIGlmIChkcmFnVHlwZSA9PT0gJ2Nyb3AnKSB7XG4gICAgICAgICAgdGhpcy5jcm9wcGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy4kZHJhZ0JveC5hZGRDbGFzcyhDTEFTU19NT0RBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZHJhZ21vdmU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgb3JpZ2luYWxFdmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgdG91Y2hlcyA9IG9yaWdpbmFsRXZlbnQgJiYgb3JpZ2luYWxFdmVudC50b3VjaGVzLFxuICAgICAgICAgIGUgPSBldmVudCxcbiAgICAgICAgICBkcmFnVHlwZSA9IHRoaXMuZHJhZ1R5cGUsXG4gICAgICAgICAgZHJhZ01vdmVFdmVudCxcbiAgICAgICAgICB0b3VjaGVzTGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0b3VjaGVzKSB7XG4gICAgICAgIHRvdWNoZXNMZW5ndGggPSB0b3VjaGVzLmxlbmd0aDtcblxuICAgICAgICBpZiAodG91Y2hlc0xlbmd0aCA+IDEpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy56b29tYWJsZSAmJiBvcHRpb25zLnRvdWNoRHJhZ1pvb20gJiYgdG91Y2hlc0xlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgZSA9IHRvdWNoZXNbMV07XG4gICAgICAgICAgICB0aGlzLmVuZFgyID0gZS5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMuZW5kWTIgPSBlLnBhZ2VZO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZSA9IHRvdWNoZXNbMF07XG4gICAgICB9XG5cbiAgICAgIGlmIChkcmFnVHlwZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRyYWdNb3ZlRXZlbnQgPSAkLkV2ZW50KEVWRU5UX0RSQUdfTU9WRSwge1xuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgZHJhZ1R5cGU6IGRyYWdUeXBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihkcmFnTW92ZUV2ZW50KTtcblxuICAgICAgICBpZiAoZHJhZ01vdmVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW5kWCA9IGUucGFnZVg7XG4gICAgICAgIHRoaXMuZW5kWSA9IGUucGFnZVk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UoZS5zaGlmdEtleSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRyYWdlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGRyYWdUeXBlID0gdGhpcy5kcmFnVHlwZSxcbiAgICAgICAgICBkcmFnRW5kRXZlbnQ7XG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRyYWdUeXBlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgZHJhZ0VuZEV2ZW50ID0gJC5FdmVudChFVkVOVF9EUkFHX0VORCwge1xuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgZHJhZ1R5cGU6IGRyYWdUeXBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihkcmFnRW5kRXZlbnQpO1xuXG4gICAgICAgIGlmIChkcmFnRW5kRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jcm9wcGluZykge1xuICAgICAgICAgIHRoaXMuY3JvcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLiRkcmFnQm94LnRvZ2dsZUNsYXNzKENMQVNTX01PREFMLCB0aGlzLmNyb3BwZWQgJiYgdGhpcy5vcHRpb25zLm1vZGFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ1R5cGUgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gICQuZXh0ZW5kKHByb3RvdHlwZSwge1xuICAgIGNyb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5idWlsdCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgdGhpcy5jcm9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5saW1pdENyb3BCb3godHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5tb2RhbCkge1xuICAgICAgICAgIHRoaXMuJGRyYWdCb3guYWRkQ2xhc3MoQ0xBU1NfTU9EQUwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kY3JvcEJveC5yZW1vdmVDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENyb3BCb3hEYXRhKHRoaXMuaW5pdGlhbENyb3BCb3gpO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmJ1aWx0IHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmltYWdlID0gJC5leHRlbmQoe30sIHRoaXMuaW5pdGlhbEltYWdlKTtcbiAgICAgIHRoaXMuY2FudmFzID0gJC5leHRlbmQoe30sIHRoaXMuaW5pdGlhbENhbnZhcyk7XG4gICAgICB0aGlzLmNyb3BCb3ggPSAkLmV4dGVuZCh7fSwgdGhpcy5pbml0aWFsQ3JvcEJveCk7IC8vIHJlcXVpcmVkIGZvciBzdHJpY3QgbW9kZVxuXG4gICAgICB0aGlzLnJlbmRlckNhbnZhcygpO1xuXG4gICAgICBpZiAodGhpcy5jcm9wcGVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmNyb3BwZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICQuZXh0ZW5kKHRoaXMuY3JvcEJveCwge1xuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDBcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNyb3BwZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuXG4gICAgICB0aGlzLmxpbWl0Q2FudmFzKCk7XG4gICAgICB0aGlzLnJlbmRlckNhbnZhcygpOyAvLyBSZW5kZXIgY2FudmFzIGFmdGVyIHJlbmRlciBjcm9wIGJveFxuXG4gICAgICB0aGlzLiRkcmFnQm94LnJlbW92ZUNsYXNzKENMQVNTX01PREFMKTtcbiAgICAgIHRoaXMuJGNyb3BCb3guYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gdGhpcy4kZWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMucmVhZHkpIHtcbiAgICAgICAgdGhpcy51bmJ1aWxkKCk7XG4gICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuJGNsb25lKSB7XG4gICAgICAgIHRoaXMuJGNsb25lLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICAkdGhpcy5yZW1vdmVEYXRhKCdjcm9wcGVyJyk7XG4gICAgfSxcblxuICAgIHJlcGxhY2U6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB1cmwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEgPSBudWxsOyAvLyBSZW1vdmUgcHJldmlvdXMgZGF0YVxuICAgICAgICB0aGlzLmxvYWQodXJsKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5idWlsdCkge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGNyb3BwZXIucmVtb3ZlQ2xhc3MoQ0xBU1NfRElTQUJMRUQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5idWlsdCkge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kY3JvcHBlci5hZGRDbGFzcyhDTEFTU19ESVNBQkxFRCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZKSB7XG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5jYW52YXM7XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucy5tb3ZhYmxlICYmIGlzTnVtYmVyKG9mZnNldFgpICYmIGlzTnVtYmVyKG9mZnNldFkpKSB7XG4gICAgICAgIGNhbnZhcy5sZWZ0ICs9IG9mZnNldFg7XG4gICAgICAgIGNhbnZhcy50b3AgKz0gb2Zmc2V0WTtcbiAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHpvb206IGZ1bmN0aW9uIChkZWx0YSkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIHpvb21FdmVudCxcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ7XG5cbiAgICAgIGRlbHRhID0gbnVtKGRlbHRhKTtcblxuICAgICAgaWYgKGRlbHRhICYmIHRoaXMuYnVpbHQgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5vcHRpb25zLnpvb21hYmxlKSB7XG4gICAgICAgIHpvb21FdmVudCA9IGRlbHRhID4gMCA/ICQuRXZlbnQoRVZFTlRfWk9PTV9JTikgOiAkLkV2ZW50KEVWRU5UX1pPT01fT1VUKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHpvb21FdmVudCk7XG5cbiAgICAgICAgaWYgKHpvb21FdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbHRhID0gZGVsdGEgPD0gLTEgPyAxIC8gKDEgLSBkZWx0YSkgOiBkZWx0YSA8PSAxID8gKDEgKyBkZWx0YSkgOiBkZWx0YTtcbiAgICAgICAgd2lkdGggPSBjYW52YXMud2lkdGggKiBkZWx0YTtcbiAgICAgICAgaGVpZ2h0ID0gY2FudmFzLmhlaWdodCAqIGRlbHRhO1xuICAgICAgICBjYW52YXMubGVmdCAtPSAod2lkdGggLSBjYW52YXMud2lkdGgpIC8gMjtcbiAgICAgICAgY2FudmFzLnRvcCAtPSAoaGVpZ2h0IC0gY2FudmFzLmhlaWdodCkgLyAyO1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICAgIHRoaXMuc2V0RHJhZ01vZGUoJ21vdmUnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcm90YXRlOiBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICB2YXIgaW1hZ2UgPSB0aGlzLmltYWdlO1xuXG4gICAgICBkZWdyZWUgPSBudW0oZGVncmVlKTtcblxuICAgICAgaWYgKGRlZ3JlZSAmJiB0aGlzLmJ1aWx0ICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucy5yb3RhdGFibGUpIHtcbiAgICAgICAgaW1hZ2Uucm90YXRlID0gKGltYWdlLnJvdGF0ZSArIGRlZ3JlZSkgJSAzNjA7XG4gICAgICAgIHRoaXMucm90YXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXREYXRhOiBmdW5jdGlvbiAocm91bmRlZCkge1xuICAgICAgdmFyIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICAgIHJhdGlvLFxuICAgICAgICAgIGRhdGE7XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmIHRoaXMuY3JvcHBlZCkge1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIHg6IGNyb3BCb3gubGVmdCAtIGNhbnZhcy5sZWZ0LFxuICAgICAgICAgIHk6IGNyb3BCb3gudG9wIC0gY2FudmFzLnRvcCxcbiAgICAgICAgICB3aWR0aDogY3JvcEJveC53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGNyb3BCb3guaGVpZ2h0XG4gICAgICAgIH07XG5cbiAgICAgICAgcmF0aW8gPSBpbWFnZS53aWR0aCAvIGltYWdlLm5hdHVyYWxXaWR0aDtcblxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcbiAgICAgICAgICBuID0gbiAvIHJhdGlvO1xuICAgICAgICAgIGRhdGFbaV0gPSByb3VuZGVkID8gTWF0aC5yb3VuZChuKSA6IG47XG4gICAgICAgIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeTogMCxcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5yb3RhdGUgPSB0aGlzLnJlYWR5ID8gaW1hZ2Uucm90YXRlIDogMDtcblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcblxuICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgaW1hZ2UgPSB0aGlzLmltYWdlLFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGNyb3BCb3hEYXRhID0ge30sXG4gICAgICAgICAgcmF0aW87XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmICF0aGlzLmRpc2FibGVkICYmICQuaXNQbGFpbk9iamVjdChkYXRhKSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5yb3RhdGUpICYmIGRhdGEucm90YXRlICE9PSBpbWFnZS5yb3RhdGUgJiYgdGhpcy5vcHRpb25zLnJvdGF0YWJsZSkge1xuICAgICAgICAgIGltYWdlLnJvdGF0ZSA9IGRhdGEucm90YXRlO1xuICAgICAgICAgIHRoaXMucm90YXRlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJDYW52YXModHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByYXRpbyA9IGltYWdlLndpZHRoIC8gaW1hZ2UubmF0dXJhbFdpZHRoO1xuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLngpKSB7XG4gICAgICAgICAgY3JvcEJveERhdGEubGVmdCA9IGRhdGEueCAqIHJhdGlvICsgY2FudmFzLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS55KSkge1xuICAgICAgICAgIGNyb3BCb3hEYXRhLnRvcCA9IGRhdGEueSAqIHJhdGlvICsgY2FudmFzLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSkge1xuICAgICAgICAgIGNyb3BCb3hEYXRhLndpZHRoID0gZGF0YS53aWR0aCAqIHJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEuaGVpZ2h0KSkge1xuICAgICAgICAgIGNyb3BCb3hEYXRhLmhlaWdodCA9IGRhdGEuaGVpZ2h0ICogcmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldENyb3BCb3hEYXRhKGNyb3BCb3hEYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0Q29udGFpbmVyRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbHQgPyB0aGlzLmNvbnRhaW5lciA6IHt9O1xuICAgIH0sXG5cbiAgICBnZXRJbWFnZURhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5ID8gdGhpcy5pbWFnZSA6IHt9O1xuICAgIH0sXG5cbiAgICBnZXRDYW52YXNEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgZGF0YTtcblxuICAgICAgaWYgKHRoaXMuYnVpbHQpIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBsZWZ0OiBjYW52YXMubGVmdCxcbiAgICAgICAgICB0b3A6IGNhbnZhcy50b3AsXG4gICAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGEgfHwge307XG4gICAgfSxcblxuICAgIHNldENhbnZhc0RhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSBjYW52YXMuYXNwZWN0UmF0aW87XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmICF0aGlzLmRpc2FibGVkICYmICQuaXNQbGFpbk9iamVjdChkYXRhKSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5sZWZ0KSkge1xuICAgICAgICAgIGNhbnZhcy5sZWZ0ID0gZGF0YS5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEudG9wKSkge1xuICAgICAgICAgIGNhbnZhcy50b3AgPSBkYXRhLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSkge1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IGRhdGEud2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gZGF0YS5oZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRDcm9wQm94RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgICAgZGF0YTtcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgdGhpcy5jcm9wcGVkKSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgbGVmdDogY3JvcEJveC5sZWZ0LFxuICAgICAgICAgIHRvcDogY3JvcEJveC50b3AsXG4gICAgICAgICAgd2lkdGg6IGNyb3BCb3gud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBjcm9wQm94LmhlaWdodFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YSB8fCB7fTtcbiAgICB9LFxuXG4gICAgc2V0Q3JvcEJveERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IHRoaXMub3B0aW9ucy5hc3BlY3RSYXRpbztcblxuICAgICAgaWYgKHRoaXMuYnVpbHQgJiYgdGhpcy5jcm9wcGVkICYmICF0aGlzLmRpc2FibGVkICYmICQuaXNQbGFpbk9iamVjdChkYXRhKSkge1xuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLmxlZnQpKSB7XG4gICAgICAgICAgY3JvcEJveC5sZWZ0ID0gZGF0YS5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEudG9wKSkge1xuICAgICAgICAgIGNyb3BCb3gudG9wID0gZGF0YS50b3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS53aWR0aCkpIHtcbiAgICAgICAgICBjcm9wQm94LndpZHRoID0gZGF0YS53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgICBjcm9wQm94LmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEud2lkdGgpKSB7XG4gICAgICAgICAgICBjcm9wQm94LmhlaWdodCA9IGNyb3BCb3gud2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKGRhdGEuaGVpZ2h0KSkge1xuICAgICAgICAgICAgY3JvcEJveC53aWR0aCA9IGNyb3BCb3guaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldENyb3BwZWRDYW52YXM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICB2YXIgb3JpZ2luYWxXaWR0aCxcbiAgICAgICAgICBvcmlnaW5hbEhlaWdodCxcbiAgICAgICAgICBjYW52YXNXaWR0aCxcbiAgICAgICAgICBjYW52YXNIZWlnaHQsXG4gICAgICAgICAgc2NhbGVkV2lkdGgsXG4gICAgICAgICAgc2NhbGVkSGVpZ2h0LFxuICAgICAgICAgIHNjYWxlZFJhdGlvLFxuICAgICAgICAgIGFzcGVjdFJhdGlvLFxuICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgIGRhdGE7XG5cbiAgICAgIGlmICghdGhpcy5idWlsdCB8fCAhdGhpcy5jcm9wcGVkIHx8ICFTVVBQT1JUX0NBTlZBUykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgb3JpZ2luYWxXaWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICBvcmlnaW5hbEhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgYXNwZWN0UmF0aW8gPSBvcmlnaW5hbFdpZHRoIC8gb3JpZ2luYWxIZWlnaHQ7XG5cbiAgICAgIGlmICgkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgc2NhbGVkV2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgICBzY2FsZWRIZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblxuICAgICAgICBpZiAoc2NhbGVkV2lkdGgpIHtcbiAgICAgICAgICBzY2FsZWRIZWlnaHQgPSBzY2FsZWRXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIHNjYWxlZFJhdGlvID0gc2NhbGVkV2lkdGggLyBvcmlnaW5hbFdpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKHNjYWxlZEhlaWdodCkge1xuICAgICAgICAgIHNjYWxlZFdpZHRoID0gc2NhbGVkSGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgc2NhbGVkUmF0aW8gPSBzY2FsZWRIZWlnaHQgLyBvcmlnaW5hbEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYW52YXNXaWR0aCA9IHNjYWxlZFdpZHRoIHx8IG9yaWdpbmFsV2lkdGg7XG4gICAgICBjYW52YXNIZWlnaHQgPSBzY2FsZWRIZWlnaHQgfHwgb3JpZ2luYWxIZWlnaHQ7XG5cbiAgICAgIGNhbnZhcyA9ICQoJzxjYW52YXM+JylbMF07XG4gICAgICBjYW52YXMud2lkdGggPSBjYW52YXNXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIGlmIChvcHRpb25zLmZpbGxDb2xvcikge1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuZmlsbENvbG9yO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELmRyYXdJbWFnZVxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UuYXBwbHkoY29udGV4dCwgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGdldFNvdXJjZUNhbnZhcyh0aGlzLiRjbG9uZVswXSwgdGhpcy5pbWFnZSksXG4gICAgICAgICAgICBzb3VyY2VXaWR0aCA9IHNvdXJjZS53aWR0aCxcbiAgICAgICAgICAgIHNvdXJjZUhlaWdodCA9IHNvdXJjZS5oZWlnaHQsXG4gICAgICAgICAgICBhcmdzID0gW3NvdXJjZV0sXG4gICAgICAgICAgICBzcmNYID0gZGF0YS54LCAvLyBzb3VyY2UgY2FudmFzXG4gICAgICAgICAgICBzcmNZID0gZGF0YS55LFxuICAgICAgICAgICAgc3JjV2lkdGgsXG4gICAgICAgICAgICBzcmNIZWlnaHQsXG4gICAgICAgICAgICBkc3RYLCAvLyBkZXN0aW5hdGlvbiBjYW52YXNcbiAgICAgICAgICAgIGRzdFksXG4gICAgICAgICAgICBkc3RXaWR0aCxcbiAgICAgICAgICAgIGRzdEhlaWdodDtcblxuICAgICAgICBpZiAoc3JjWCA8PSAtb3JpZ2luYWxXaWR0aCB8fCBzcmNYID4gc291cmNlV2lkdGgpIHtcbiAgICAgICAgICBzcmNYID0gc3JjV2lkdGggPSBkc3RYID0gZHN0V2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHNyY1ggPD0gMCkge1xuICAgICAgICAgIGRzdFggPSAtc3JjWDtcbiAgICAgICAgICBzcmNYID0gMDtcbiAgICAgICAgICBzcmNXaWR0aCA9IGRzdFdpZHRoID0gbWluKHNvdXJjZVdpZHRoLCBvcmlnaW5hbFdpZHRoICsgc3JjWCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3JjWCA8PSBzb3VyY2VXaWR0aCkge1xuICAgICAgICAgIGRzdFggPSAwO1xuICAgICAgICAgIHNyY1dpZHRoID0gZHN0V2lkdGggPSBtaW4ob3JpZ2luYWxXaWR0aCwgc291cmNlV2lkdGggLSBzcmNYKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzcmNXaWR0aCA8PSAwIHx8IHNyY1kgPD0gLW9yaWdpbmFsSGVpZ2h0IHx8IHNyY1kgPiBzb3VyY2VIZWlnaHQpIHtcbiAgICAgICAgICBzcmNZID0gc3JjSGVpZ2h0ID0gZHN0WSA9IGRzdEhlaWdodCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3JjWSA8PSAwKSB7XG4gICAgICAgICAgZHN0WSA9IC1zcmNZO1xuICAgICAgICAgIHNyY1kgPSAwO1xuICAgICAgICAgIHNyY0hlaWdodCA9IGRzdEhlaWdodCA9IG1pbihzb3VyY2VIZWlnaHQsIG9yaWdpbmFsSGVpZ2h0ICsgc3JjWSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3JjWSA8PSBzb3VyY2VIZWlnaHQpIHtcbiAgICAgICAgICBkc3RZID0gMDtcbiAgICAgICAgICBzcmNIZWlnaHQgPSBkc3RIZWlnaHQgPSBtaW4ob3JpZ2luYWxIZWlnaHQsIHNvdXJjZUhlaWdodCAtIHNyY1kpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJncy5wdXNoKHNyY1gsIHNyY1ksIHNyY1dpZHRoLCBzcmNIZWlnaHQpO1xuXG4gICAgICAgIC8vIFNjYWxlIGRlc3RpbmF0aW9uIHNpemVzXG4gICAgICAgIGlmIChzY2FsZWRSYXRpbykge1xuICAgICAgICAgIGRzdFggKj0gc2NhbGVkUmF0aW87XG4gICAgICAgICAgZHN0WSAqPSBzY2FsZWRSYXRpbztcbiAgICAgICAgICBkc3RXaWR0aCAqPSBzY2FsZWRSYXRpbztcbiAgICAgICAgICBkc3RIZWlnaHQgKj0gc2NhbGVkUmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdm9pZCBcIkluZGV4U2l6ZUVycm9yXCIgaW4gSUUgYW5kIEZpcmVmb3hcbiAgICAgICAgaWYgKGRzdFdpZHRoID4gMCAmJiBkc3RIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgYXJncy5wdXNoKGRzdFgsIGRzdFksIGRzdFdpZHRoLCBkc3RIZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgICB9KS5jYWxsKHRoaXMpKTtcblxuICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9LFxuXG4gICAgc2V0QXNwZWN0UmF0aW86IGZ1bmN0aW9uIChhc3BlY3RSYXRpbykge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhaXNVbmRlZmluZWQoYXNwZWN0UmF0aW8pKSB7XG4gICAgICAgIG9wdGlvbnMuYXNwZWN0UmF0aW8gPSBudW0oYXNwZWN0UmF0aW8pIHx8IE5hTjsgLy8gMCAtPiBOYU5cblxuICAgICAgICBpZiAodGhpcy5idWlsdCkge1xuICAgICAgICAgIHRoaXMuaW5pdENyb3BCb3goKTtcblxuICAgICAgICAgIGlmICh0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXREcmFnTW9kZTogZnVuY3Rpb24gKG1vZGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNyb3BwYWJsZSxcbiAgICAgICAgICBtb3ZhYmxlO1xuXG4gICAgICBpZiAodGhpcy5yZWFkeSAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICBjcm9wcGFibGUgPSBvcHRpb25zLmRyYWdDcm9wICYmIG1vZGUgPT09ICdjcm9wJztcbiAgICAgICAgbW92YWJsZSA9IG9wdGlvbnMubW92YWJsZSAmJiBtb2RlID09PSAnbW92ZSc7XG4gICAgICAgIG1vZGUgPSAoY3JvcHBhYmxlIHx8IG1vdmFibGUpID8gbW9kZSA6ICdub25lJztcblxuICAgICAgICB0aGlzLiRkcmFnQm94LmRhdGEoJ2RyYWcnLCBtb2RlKS50b2dnbGVDbGFzcyhDTEFTU19DUk9QLCBjcm9wcGFibGUpLnRvZ2dsZUNsYXNzKENMQVNTX01PVkUsIG1vdmFibGUpO1xuXG4gICAgICAgIGlmICghb3B0aW9ucy5jcm9wQm94TW92YWJsZSkge1xuICAgICAgICAgIC8vIFN5bmMgZHJhZyBtb2RlIHRvIGNyb3AgYm94IHdoZW4gaXQgaXMgbm90IG1vdmFibGUoIzMwMClcbiAgICAgICAgICB0aGlzLiRmYWNlLmRhdGEoJ2RyYWcnLCBtb2RlKS50b2dnbGVDbGFzcyhDTEFTU19DUk9QLCBjcm9wcGFibGUpLnRvZ2dsZUNsYXNzKENMQVNTX01PVkUsIG1vdmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBwcm90b3R5cGUuY2hhbmdlID0gZnVuY3Rpb24gKHNoaWZ0S2V5KSB7XG4gICAgdmFyIGRyYWdUeXBlID0gdGhpcy5kcmFnVHlwZSxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICB3aWR0aCA9IGNyb3BCb3gud2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGNyb3BCb3guaGVpZ2h0LFxuICAgICAgICBsZWZ0ID0gY3JvcEJveC5sZWZ0LFxuICAgICAgICB0b3AgPSBjcm9wQm94LnRvcCxcbiAgICAgICAgcmlnaHQgPSBsZWZ0ICsgd2lkdGgsXG4gICAgICAgIGJvdHRvbSA9IHRvcCArIGhlaWdodCxcbiAgICAgICAgbWluTGVmdCA9IDAsXG4gICAgICAgIG1pblRvcCA9IDAsXG4gICAgICAgIG1heFdpZHRoID0gY29udGFpbmVyLndpZHRoLFxuICAgICAgICBtYXhIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0LFxuICAgICAgICByZW5kZXJhYmxlID0gdHJ1ZSxcbiAgICAgICAgYXNwZWN0UmF0aW8gPSBvcHRpb25zLmFzcGVjdFJhdGlvLFxuICAgICAgICByYW5nZSA9IHtcbiAgICAgICAgICB4OiB0aGlzLmVuZFggLSB0aGlzLnN0YXJ0WCxcbiAgICAgICAgICB5OiB0aGlzLmVuZFkgLSB0aGlzLnN0YXJ0WVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ7XG5cbiAgICAvLyBMb2NraW5nIGFzcGVjdCByYXRpbyBpbiBcImZyZWUgbW9kZVwiIGJ5IGhvbGRpbmcgc2hpZnQga2V5ICgjMjU5KVxuICAgIGlmICghYXNwZWN0UmF0aW8gJiYgc2hpZnRLZXkpIHtcbiAgICAgIGFzcGVjdFJhdGlvID0gd2lkdGggJiYgaGVpZ2h0ID8gd2lkdGggLyBoZWlnaHQgOiAxO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgICAgbWluTGVmdCA9IGNyb3BCb3gubWluTGVmdDtcbiAgICAgIG1pblRvcCA9IGNyb3BCb3gubWluVG9wO1xuICAgICAgbWF4V2lkdGggPSBtaW5MZWZ0ICsgbWluKGNvbnRhaW5lci53aWR0aCwgY2FudmFzLndpZHRoKTtcbiAgICAgIG1heEhlaWdodCA9IG1pblRvcCArIG1pbihjb250YWluZXIuaGVpZ2h0LCBjYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgIHJhbmdlLlggPSByYW5nZS55ICogYXNwZWN0UmF0aW87XG4gICAgICByYW5nZS5ZID0gcmFuZ2UueCAvIGFzcGVjdFJhdGlvO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZHJhZ1R5cGUpIHtcbiAgICAgIC8vIE1vdmUgY3JvcEJveFxuICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIFJlc2l6ZSBjcm9wQm94XG4gICAgICBjYXNlICdlJzpcbiAgICAgICAgaWYgKHJhbmdlLnggPj0gMCAmJiAocmlnaHQgPj0gbWF4V2lkdGggfHwgYXNwZWN0UmF0aW8gJiYgKHRvcCA8PSBtaW5Ub3AgfHwgYm90dG9tID49IG1heEhlaWdodCkpKSB7XG4gICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIHRvcCAtPSByYW5nZS5ZIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICd3JztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbic6XG4gICAgICAgIGlmIChyYW5nZS55IDw9IDAgJiYgKHRvcCA8PSBtaW5Ub3AgfHwgYXNwZWN0UmF0aW8gJiYgKGxlZnQgPD0gbWluTGVmdCB8fCByaWdodCA+PSBtYXhXaWR0aCkpKSB7XG4gICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgIHRvcCArPSByYW5nZS55O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgbGVmdCArPSByYW5nZS5YIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAncyc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd3JzpcbiAgICAgICAgaWYgKHJhbmdlLnggPD0gMCAmJiAobGVmdCA8PSBtaW5MZWZ0IHx8IGFzcGVjdFJhdGlvICYmICh0b3AgPD0gbWluVG9wIHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIHRvcCArPSByYW5nZS5ZIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdlJztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncyc6XG4gICAgICAgIGlmIChyYW5nZS55ID49IDAgJiYgKGJvdHRvbSA+PSBtYXhIZWlnaHQgfHwgYXNwZWN0UmF0aW8gJiYgKGxlZnQgPD0gbWluTGVmdCB8fCByaWdodCA+PSBtYXhXaWR0aCkpKSB7XG4gICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICBsZWZ0IC09IHJhbmdlLlggLyAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICduJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ25lJzpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCAmJiAodG9wIDw9IG1pblRvcCB8fCByaWdodCA+PSBtYXhXaWR0aCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPj0gMCkge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2UueSA8PSAwICYmIHRvcCA8PSBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyYW5nZS55IDw9IDApIHtcbiAgICAgICAgICAgIGlmICh0b3AgPiBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDAgJiYgaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3N3JztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdudyc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzZSc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudyc6XG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGlmIChyYW5nZS55IDw9IDAgJiYgKHRvcCA8PSBtaW5Ub3AgfHwgbGVmdCA8PSBtaW5MZWZ0KSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICBsZWZ0ICs9IHJhbmdlLlg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPD0gMCkge1xuICAgICAgICAgICAgaWYgKGxlZnQgPiBtaW5MZWZ0KSB7XG4gICAgICAgICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2UueSA8PSAwICYmIHRvcCA8PSBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyYW5nZS55IDw9IDApIHtcbiAgICAgICAgICAgIGlmICh0b3AgPiBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDAgJiYgaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3NlJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICduZSc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzdyc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdyc6XG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGlmIChyYW5nZS54IDw9IDAgJiYgKGxlZnQgPD0gbWluTGVmdCB8fCBib3R0b20gPj0gbWF4SGVpZ2h0KSkge1xuICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA8PSAwKSB7XG4gICAgICAgICAgICBpZiAobGVmdCA+IG1pbkxlZnQpIHtcbiAgICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW5nZS55ID49IDAgJiYgYm90dG9tID49IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJhbmdlLnkgPj0gMCkge1xuICAgICAgICAgICAgaWYgKGJvdHRvbSA8IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCAmJiBoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbmUnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3NlJztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ253JztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlJzpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPj0gMCAmJiAocmlnaHQgPj0gbWF4V2lkdGggfHwgYm90dG9tID49IG1heEhlaWdodCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA+PSAwKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW5nZS55ID49IDAgJiYgYm90dG9tID49IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJhbmdlLnkgPj0gMCkge1xuICAgICAgICAgICAgaWYgKGJvdHRvbSA8IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCAmJiBoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbncnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3N3JztcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ25lJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIE1vdmUgaW1hZ2VcbiAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICBjYW52YXMubGVmdCArPSByYW5nZS54O1xuICAgICAgICBjYW52YXMudG9wICs9IHJhbmdlLnk7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBTY2FsZSBpbWFnZVxuICAgICAgY2FzZSAnem9vbSc6XG4gICAgICAgIHRoaXMuem9vbShmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgICB2YXIgejEgPSBzcXJ0KHgxICogeDEgKyB5MSAqIHkxKSxcbiAgICAgICAgICAgICAgejIgPSBzcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcblxuICAgICAgICAgIHJldHVybiAoejIgLSB6MSkgLyB6MTtcbiAgICAgICAgfShcbiAgICAgICAgICBhYnModGhpcy5zdGFydFggLSB0aGlzLnN0YXJ0WDIpLFxuICAgICAgICAgIGFicyh0aGlzLnN0YXJ0WSAtIHRoaXMuc3RhcnRZMiksXG4gICAgICAgICAgYWJzKHRoaXMuZW5kWCAtIHRoaXMuZW5kWDIpLFxuICAgICAgICAgIGFicyh0aGlzLmVuZFkgLSB0aGlzLmVuZFkyKVxuICAgICAgICApKTtcblxuICAgICAgICB0aGlzLnN0YXJ0WDIgPSB0aGlzLmVuZFgyO1xuICAgICAgICB0aGlzLnN0YXJ0WTIgPSB0aGlzLmVuZFkyO1xuICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBDcm9wIGltYWdlXG4gICAgICBjYXNlICdjcm9wJzpcbiAgICAgICAgaWYgKHJhbmdlLnggJiYgcmFuZ2UueSkge1xuICAgICAgICAgIG9mZnNldCA9IHRoaXMuJGNyb3BwZXIub2Zmc2V0KCk7XG4gICAgICAgICAgbGVmdCA9IHRoaXMuc3RhcnRYIC0gb2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgdG9wID0gdGhpcy5zdGFydFkgLSBvZmZzZXQudG9wO1xuICAgICAgICAgIHdpZHRoID0gY3JvcEJveC5taW5XaWR0aDtcbiAgICAgICAgICBoZWlnaHQgPSBjcm9wQm94Lm1pbkhlaWdodDtcblxuICAgICAgICAgIGlmIChyYW5nZS54ID4gMCkge1xuICAgICAgICAgICAgaWYgKHJhbmdlLnkgPiAwKSB7XG4gICAgICAgICAgICAgIGRyYWdUeXBlID0gJ3NlJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRyYWdUeXBlID0gJ25lJztcbiAgICAgICAgICAgICAgdG9wIC09IGhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJhbmdlLnkgPiAwKSB7XG4gICAgICAgICAgICAgIGRyYWdUeXBlID0gJ3N3JztcbiAgICAgICAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRyYWdUeXBlID0gJ253JztcbiAgICAgICAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgICAgICAgICAgdG9wIC09IGhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTaG93IHRoZSBjcm9wQm94IGlmIGlzIGhpZGRlblxuICAgICAgICAgIGlmICghdGhpcy5jcm9wcGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNyb3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kY3JvcEJveC5yZW1vdmVDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBObyBkZWZhdWx0XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgIGNyb3BCb3gud2lkdGggPSB3aWR0aDtcbiAgICAgIGNyb3BCb3guaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgY3JvcEJveC5sZWZ0ID0gbGVmdDtcbiAgICAgIGNyb3BCb3gudG9wID0gdG9wO1xuICAgICAgdGhpcy5kcmFnVHlwZSA9IGRyYWdUeXBlO1xuXG4gICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZVxuICAgIHRoaXMuc3RhcnRYID0gdGhpcy5lbmRYO1xuICAgIHRoaXMuc3RhcnRZID0gdGhpcy5lbmRZO1xuICB9O1xuXG4gICQuZXh0ZW5kKENyb3BwZXIucHJvdG90eXBlLCBwcm90b3R5cGUpO1xuXG4gIENyb3BwZXIuREVGQVVMVFMgPSB7XG4gICAgLy8gRGVmaW5lcyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBjcm9wIGJveFxuICAgIC8vIFR5cGU6IE51bWJlclxuICAgIGFzcGVjdFJhdGlvOiBOYU4sXG5cbiAgICAvLyBEZWZpbmVzIHRoZSBwZXJjZW50YWdlIG9mIGF1dG9tYXRpYyBjcm9wcGluZyBhcmVhIHdoZW4gaW5pdGlhbGl6ZXNcbiAgICAvLyBUeXBlOiBOdW1iZXIgKE11c3QgbGFyZ2UgdGhhbiAwIGFuZCBsZXNzIHRoYW4gMSlcbiAgICBhdXRvQ3JvcEFyZWE6IDAuOCwgLy8gODAlXG5cbiAgICAvLyBPdXRwdXRzIHRoZSBjcm9wcGluZyByZXN1bHRzLlxuICAgIC8vIFR5cGU6IEZ1bmN0aW9uXG4gICAgY3JvcDogbnVsbCxcblxuICAgIC8vIFByZXZpb3VzL2xhdGVzdCBjcm9wIGRhdGFcbiAgICAvLyBUeXBlOiBPYmplY3RcbiAgICBkYXRhOiBudWxsLFxuXG4gICAgLy8gQWRkIGV4dHJhIGNvbnRhaW5lcnMgZm9yIHByZXZpZXdpbmdcbiAgICAvLyBUeXBlOiBTdHJpbmcgKGpRdWVyeSBzZWxlY3RvcilcbiAgICBwcmV2aWV3OiAnJyxcblxuICAgIC8vIFRvZ2dsZXNcbiAgICBzdHJpY3Q6IHRydWUsIC8vIHN0cmljdCBtb2RlLCB0aGUgaW1hZ2UgY2Fubm90IHpvb20gb3V0IGxlc3MgdGhhbiB0aGUgY29udGFpbmVyXG4gICAgcmVzcG9uc2l2ZTogdHJ1ZSwgLy8gUmVidWlsZCB3aGVuIHJlc2l6ZSB0aGUgd2luZG93XG4gICAgY2hlY2tJbWFnZU9yaWdpbjogdHJ1ZSwgLy8gQ2hlY2sgaWYgdGhlIHRhcmdldCBpbWFnZSBpcyBjcm9zcyBvcmlnaW5cblxuICAgIG1vZGFsOiB0cnVlLCAvLyBTaG93IHRoZSBibGFjayBtb2RhbFxuICAgIGd1aWRlczogdHJ1ZSwgLy8gU2hvdyB0aGUgZGFzaGVkIGxpbmVzIGZvciBndWlkaW5nXG4gICAgaGlnaGxpZ2h0OiB0cnVlLCAvLyBTaG93IHRoZSB3aGl0ZSBtb2RhbCB0byBoaWdobGlnaHQgdGhlIGNyb3AgYm94XG4gICAgYmFja2dyb3VuZDogdHJ1ZSwgLy8gU2hvdyB0aGUgZ3JpZCBiYWNrZ3JvdW5kXG5cbiAgICBhdXRvQ3JvcDogdHJ1ZSwgLy8gRW5hYmxlIHRvIGNyb3AgdGhlIGltYWdlIGF1dG9tYXRpY2FsbHkgd2hlbiBpbml0aWFsaXplXG4gICAgZHJhZ0Nyb3A6IHRydWUsIC8vIEVuYWJsZSB0byBjcmVhdGUgbmV3IGNyb3AgYm94IGJ5IGRyYWdnaW5nIG92ZXIgdGhlIGltYWdlXG4gICAgbW92YWJsZTogdHJ1ZSwgLy8gRW5hYmxlIHRvIG1vdmUgdGhlIGltYWdlXG4gICAgcm90YXRhYmxlOiB0cnVlLCAvLyBFbmFibGUgdG8gcm90YXRlIHRoZSBpbWFnZVxuICAgIHpvb21hYmxlOiB0cnVlLCAvLyBFbmFibGUgdG8gem9vbSB0aGUgaW1hZ2VcbiAgICB0b3VjaERyYWdab29tOiB0cnVlLCAvLyBFbmFibGUgdG8gem9vbSB0aGUgaW1hZ2UgYnkgd2hlZWxpbmcgbW91c2VcbiAgICBtb3VzZVdoZWVsWm9vbTogdHJ1ZSwgLy8gRW5hYmxlIHRvIHpvb20gdGhlIGltYWdlIGJ5IGRyYWdnaW5nIHRvdWNoXG4gICAgY3JvcEJveE1vdmFibGU6IHRydWUsIC8vIEVuYWJsZSB0byBtb3ZlIHRoZSBjcm9wIGJveFxuICAgIGNyb3BCb3hSZXNpemFibGU6IHRydWUsIC8vIEVuYWJsZSB0byByZXNpemUgdGhlIGNyb3AgYm94XG4gICAgZG91YmxlQ2xpY2tUb2dnbGU6IHRydWUsIC8vIFRvZ2dsZSBkcmFnIG1vZGUgYmV0d2VlbiBcImNyb3BcIiBhbmQgXCJtb3ZlXCIgd2hlbiBkb3VibGUgY2xpY2sgb24gdGhlIGNyb3BwZXJcblxuICAgIC8vIERpbWVuc2lvbnNcbiAgICBtaW5DYW52YXNXaWR0aDogMCxcbiAgICBtaW5DYW52YXNIZWlnaHQ6IDAsXG4gICAgbWluQ3JvcEJveFdpZHRoOiAwLFxuICAgIG1pbkNyb3BCb3hIZWlnaHQ6IDAsXG4gICAgbWluQ29udGFpbmVyV2lkdGg6IDIwMCxcbiAgICBtaW5Db250YWluZXJIZWlnaHQ6IDEwMCxcblxuICAgIC8vIEV2ZW50c1xuICAgIGJ1aWxkOiBudWxsLCAvLyBGdW5jdGlvblxuICAgIGJ1aWx0OiBudWxsLCAvLyBGdW5jdGlvblxuICAgIGRyYWdzdGFydDogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICBkcmFnbW92ZTogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICBkcmFnZW5kOiBudWxsLCAvLyBGdW5jdGlvblxuICAgIHpvb21pbjogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICB6b29tb3V0OiBudWxsLCAvLyBGdW5jdGlvblxuICAgIGNoYW5nZTogbnVsbCAvLyBGdW5jdGlvblxuICB9O1xuXG4gIENyb3BwZXIuc2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICQuZXh0ZW5kKENyb3BwZXIuREVGQVVMVFMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8vIFVzZSB0aGUgc3RyaW5nIGNvbXByZXNzb3I6IFN0cm1pbiAoaHR0cHM6Ly9naXRodWIuY29tL2Zlbmd5dWFuY2hlbi9zdHJtaW4pXG4gIENyb3BwZXIuVEVNUExBVEUgPSAoZnVuY3Rpb24gKHNvdXJjZSwgd29yZHMpIHtcbiAgICB3b3JkcyA9IHdvcmRzLnNwbGl0KCcsJyk7XG4gICAgcmV0dXJuIHNvdXJjZS5yZXBsYWNlKC9cXGQrL2csIGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gd29yZHNbaV07XG4gICAgfSk7XG4gIH0pKCc8MCA2PVwiNS1jb250YWluZXJcIj48MCA2PVwiNS1jYW52YXNcIj48LzA+PDAgNj1cIjUtMi05XCI+PC8wPjwwIDY9XCI1LWNyb3AtOVwiPjwxIDY9XCI1LXZpZXctOVwiPjwvMT48MSA2PVwiNS04IDgtaFwiPjwvMT48MSA2PVwiNS04IDgtdlwiPjwvMT48MSA2PVwiNS1mYWNlXCI+PC8xPjwxIDY9XCI1LTcgNy1lXCIgMy0yPVwiZVwiPjwvMT48MSA2PVwiNS03IDctblwiIDMtMj1cIm5cIj48LzE+PDEgNj1cIjUtNyA3LXdcIiAzLTI9XCJ3XCI+PC8xPjwxIDY9XCI1LTcgNy1zXCIgMy0yPVwic1wiPjwvMT48MSA2PVwiNS00IDQtZVwiIDMtMj1cImVcIj48LzE+PDEgNj1cIjUtNCA0LW5cIiAzLTI9XCJuXCI+PC8xPjwxIDY9XCI1LTQgNC13XCIgMy0yPVwid1wiPjwvMT48MSA2PVwiNS00IDQtc1wiIDMtMj1cInNcIj48LzE+PDEgNj1cIjUtNCA0LW5lXCIgMy0yPVwibmVcIj48LzE+PDEgNj1cIjUtNCA0LW53XCIgMy0yPVwibndcIj48LzE+PDEgNj1cIjUtNCA0LXN3XCIgMy0yPVwic3dcIj48LzE+PDEgNj1cIjUtNCA0LXNlXCIgMy0yPVwic2VcIj48LzE+PC8wPjwvMD4nLCAnZGl2LHNwYW4sZHJhZyxkYXRhLHBvaW50LGNyb3BwZXIsY2xhc3MsbGluZSxkYXNoZWQsYm94Jyk7XG5cbiAgLyogVGVtcGxhdGUgc291cmNlOlxuICA8ZGl2IGNsYXNzPVwiY3JvcHBlci1jb250YWluZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY3JvcHBlci1jYW52YXNcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY3JvcHBlci1kcmFnLWJveFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjcm9wcGVyLWNyb3AtYm94XCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItdmlldy1ib3hcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItZGFzaGVkIGRhc2hlZC1oXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWRhc2hlZCBkYXNoZWQtdlwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1mYWNlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWxpbmUgbGluZS1lXCIgZGF0YS1kcmFnPVwiZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1saW5lIGxpbmUtblwiIGRhdGEtZHJhZz1cIm5cIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLXdcIiBkYXRhLWRyYWc9XCJ3XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWxpbmUgbGluZS1zXCIgZGF0YS1kcmFnPVwic1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1lXCIgZGF0YS1kcmFnPVwiZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1uXCIgZGF0YS1kcmFnPVwiblwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC13XCIgZGF0YS1kcmFnPVwid1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1zXCIgZGF0YS1kcmFnPVwic1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1uZVwiIGRhdGEtZHJhZz1cIm5lXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LW53XCIgZGF0YS1kcmFnPVwibndcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtc3dcIiBkYXRhLWRyYWc9XCJzd1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1zZVwiIGRhdGEtZHJhZz1cInNlXCI+PC9zcGFuPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgKi9cblxuICAvLyBTYXZlIHRoZSBvdGhlciBjcm9wcGVyXG4gIENyb3BwZXIub3RoZXIgPSAkLmZuLmNyb3BwZXI7XG5cbiAgLy8gUmVnaXN0ZXIgYXMgalF1ZXJ5IHBsdWdpblxuICAkLmZuLmNyb3BwZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnY3JvcHBlcicpLFxuICAgICAgICAgIGZuO1xuXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgJHRoaXMuZGF0YSgnY3JvcHBlcicsIChkYXRhID0gbmV3IENyb3BwZXIodGhpcywgb3B0aW9ucykpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyAmJiAkLmlzRnVuY3Rpb24oKGZuID0gZGF0YVtvcHRpb25zXSkpKSB7XG4gICAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGRhdGEsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlzVW5kZWZpbmVkKHJlc3VsdCkgPyB0aGlzIDogcmVzdWx0O1xuICB9O1xuXG4gICQuZm4uY3JvcHBlci5Db25zdHJ1Y3RvciA9IENyb3BwZXI7XG4gICQuZm4uY3JvcHBlci5zZXREZWZhdWx0cyA9IENyb3BwZXIuc2V0RGVmYXVsdHM7XG5cbiAgLy8gTm8gY29uZmxpY3RcbiAgJC5mbi5jcm9wcGVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jcm9wcGVyID0gQ3JvcHBlci5vdGhlcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxufSk7XG4oZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCduZ0Nyb3BwZXInLCBbJ25nJ10pXG4uZGlyZWN0aXZlKCduZ0Nyb3BwZXInLCBbJyRxJywgJyRwYXJzZScsIGZ1bmN0aW9uKCRxLCAkcGFyc2UpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB7XG4gICAgICBvcHRpb25zOiAnPW5nQ3JvcHBlck9wdGlvbnMnLFxuICAgICAgcHJveHk6ICc9bmdDcm9wcGVyUHJveHknLCAvLyBPcHRpb25hbC5cbiAgICAgIHNob3dFdmVudDogJz1uZ0Nyb3BwZXJTaG93JyxcbiAgICAgIGhpZGVFdmVudDogJz1uZ0Nyb3BwZXJIaWRlJ1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHMpIHtcbiAgICAgIHZhciBzaG93biA9IGZhbHNlO1xuXG4gICAgICBzY29wZS4kb24oc2NvcGUuc2hvd0V2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHNob3duKSByZXR1cm47XG4gICAgICAgIHNob3duID0gdHJ1ZTtcblxuICAgICAgICBwcmVwcm9jZXNzKHNjb3BlLm9wdGlvbnMsIGVsZW1lbnRbMF0pXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgc2V0UHJveHkoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LmNyb3BwZXIob3B0aW9ucyk7XG4gICAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBzZXRQcm94eShlbGVtZW50KSB7XG4gICAgICAgIGlmICghc2NvcGUucHJveHkpIHJldHVybjtcbiAgICAgICAgdmFyIHNldHRlciA9ICRwYXJzZShzY29wZS5wcm94eSkuYXNzaWduO1xuICAgICAgICBzZXR0ZXIoc2NvcGUuJHBhcmVudCwgZWxlbWVudC5jcm9wcGVyLmJpbmQoZWxlbWVudCkpO1xuICAgICAgfVxuXG4gICAgICBzY29wZS4kb24oc2NvcGUuaGlkZUV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFzaG93bikgcmV0dXJuO1xuICAgICAgICBzaG93biA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNyb3BwZXIoJ2Rlc3Ryb3knKTtcbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS4kd2F0Y2goJ29wdGlvbnMuZGlzYWJsZWQnLCBmdW5jdGlvbihkaXNhYmxlZCkge1xuICAgICAgICBpZiAoIXNob3duKSByZXR1cm47XG4gICAgICAgIGlmIChkaXNhYmxlZCkgZWxlbWVudC5jcm9wcGVyKCdkaXNhYmxlJyk7XG4gICAgICAgIGlmICghZGlzYWJsZWQpIGVsZW1lbnQuY3JvcHBlcignZW5hYmxlJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcHJlcHJvY2VzcyhvcHRpb25zLCBpbWcpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgcmVzdWx0ID0gJHEud2hlbihvcHRpb25zKTsgLy8gTm8gY2hhbmdlcy5cbiAgICBpZiAob3B0aW9ucy5tYXhpbWl6ZSkge1xuICAgICAgcmVzdWx0ID0gbWF4aW1pemVTZWxlY3Rpb24ob3B0aW9ucywgaW1nKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2Ugb3B0aW9ucyB0byBtYWtlIHNlbGVjdGlvbiBtYXhpbXVtIGZvciB0aGUgaW1hZ2UuXG4gICAqIGZlbmd5dWFuY2hlbi9jcm9wcGVyIGNhbGN1bGF0ZXMgdmFsaWQgc2VsZWN0aW9uJ3MgaGVpZ2h0ICYgd2lkdGhcbiAgICogd2l0aCByZXNwZWN0IHRvIGBhc3BlY3RSYXRpb2AuXG4gICAqL1xuICBmdW5jdGlvbiBtYXhpbWl6ZVNlbGVjdGlvbihvcHRpb25zLCBpbWcpIHtcbiAgICByZXR1cm4gZ2V0UmVhbFNpemUoaW1nKS50aGVuKGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IHNpemU7XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHJlYWwgaW1hZ2Ugc2l6ZSAod2l0aG91dCBjaGFuZ2VzIGJ5IGNzcywgYXR0cmlidXRlcykuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRSZWFsU2l6ZShpbWcpIHtcbiAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgIHZhciBzaXplID0ge2hlaWdodDogbnVsbCwgd2lkdGg6IG51bGx9O1xuICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBkZWZlci5yZXNvbHZlKHt3aWR0aDogaW1hZ2Uud2lkdGgsIGhlaWdodDogaW1hZ2UuaGVpZ2h0fSk7XG4gICAgfVxuXG4gICAgaW1hZ2Uuc3JjID0gaW1nLnNyYztcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcbiAgfVxufV0pXG4uc2VydmljZSgnQ3JvcHBlcicsIFsnJHEnLCBmdW5jdGlvbigkcSkge1xuXG4gIHRoaXMuZW5jb2RlID0gZnVuY3Rpb24oYmxvYikge1xuICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGRlZmVyLnJlc29sdmUoZS50YXJnZXQucmVzdWx0KTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xuICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICB9O1xuXG4gIHRoaXMuZGVjb2RlID0gZnVuY3Rpb24oZGF0YVVybCkge1xuICAgIHZhciBtZXRhID0gZGF0YVVybC5zcGxpdCgnOycpWzBdO1xuICAgIHZhciB0eXBlID0gbWV0YS5zcGxpdCgnOicpWzFdO1xuICAgIHZhciBiaW5hcnkgPSBhdG9iKGRhdGFVcmwuc3BsaXQoJywnKVsxXSk7XG4gICAgdmFyIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5Lmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJyYXlbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCbG9iKFthcnJheV0sIHt0eXBlOiB0eXBlfSk7XG4gIH07XG5cbiAgdGhpcy5jcm9wID0gZnVuY3Rpb24oZmlsZSwgZGF0YSkge1xuICAgIHZhciBfZGVjb2RlQmxvYiA9IHRoaXMuZGVjb2RlO1xuICAgIHJldHVybiB0aGlzLmVuY29kZShmaWxlKS50aGVuKF9jcmVhdGVJbWFnZSkudGhlbihmdW5jdGlvbihpbWFnZSkge1xuICAgICAgdmFyIGNhbnZhcyA9IGNyZWF0ZUNhbnZhcyhkYXRhKTtcbiAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCBkYXRhLngsIGRhdGEueSwgZGF0YS53aWR0aCwgZGF0YS5oZWlnaHQsIDAsIDAsIGRhdGEud2lkdGgsIGRhdGEuaGVpZ2h0KTtcblxuICAgICAgdmFyIGVuY29kZWQgPSBjYW52YXMudG9EYXRhVVJMKGZpbGUudHlwZSk7XG4gICAgICByZW1vdmVFbGVtZW50KGNhbnZhcyk7XG5cbiAgICAgIHJldHVybiBfZGVjb2RlQmxvYihlbmNvZGVkKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnNjYWxlID0gZnVuY3Rpb24oZmlsZSwgZGF0YSkge1xuICAgIHZhciBfZGVjb2RlQmxvYiA9IHRoaXMuZGVjb2RlO1xuICAgIHJldHVybiB0aGlzLmVuY29kZShmaWxlKS50aGVuKF9jcmVhdGVJbWFnZSkudGhlbihmdW5jdGlvbihpbWFnZSkge1xuICAgICAgdmFyIGhlaWdodE9yaWcgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICB2YXIgd2lkdGhPcmlnID0gaW1hZ2Uud2lkdGg7XG4gICAgICB2YXIgcmF0aW8sIGhlaWdodCwgd2lkdGg7XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGRhdGEpKSB7XG4gICAgICAgIHJhdGlvID0gZGF0YTtcbiAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0T3JpZyAqIHJhdGlvO1xuICAgICAgICB3aWR0aCA9IHdpZHRoT3JpZyAqIHJhdGlvO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5ndWxhci5pc09iamVjdChkYXRhKSkge1xuICAgICAgICByYXRpbyA9IHdpZHRoT3JpZyAvIGhlaWdodE9yaWc7XG4gICAgICAgIGhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICB3aWR0aCA9IGRhdGEud2lkdGg7XG5cbiAgICAgICAgaWYgKGhlaWdodCAmJiAhd2lkdGgpXG4gICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiByYXRpbztcbiAgICAgICAgZWxzZSBpZiAod2lkdGggJiYgIWhlaWdodClcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FudmFzID0gY3JlYXRlQ2FudmFzKGRhdGEpO1xuICAgICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgd2lkdGhPcmlnLCBoZWlnaHRPcmlnLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgdmFyIGVuY29kZWQgPSBjYW52YXMudG9EYXRhVVJMKGZpbGUudHlwZSk7XG4gICAgICByZW1vdmVFbGVtZW50KGNhbnZhcyk7XG5cbiAgICAgIHJldHVybiBfZGVjb2RlQmxvYihlbmNvZGVkKTtcbiAgICB9KTtcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVJbWFnZShzb3VyY2UpIHtcbiAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHsgZGVmZXIucmVzb2x2ZShlLnRhcmdldCk7IH07XG4gICAgaW1hZ2Uuc3JjID0gc291cmNlO1xuICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2FudmFzKGRhdGEpIHtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gZGF0YS53aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIHJldHVybiBjYW52YXM7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsKSB7XG4gICAgZWwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbCk7XG4gIH1cblxufV0pO1xuXG59KSgpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC50ZW1wbGF0ZXMnLCBbXSkucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkgeyR0ZW1wbGF0ZUNhY2hlLnB1dCgnY29udGFjdC5odG1sJywnPHNlY3Rpb24+XFxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG9uY2hhbmdlPVwiYW5ndWxhci5lbGVtZW50KHRoaXMpLnNjb3BlKCkub25GaWxlKHRoaXMuZmlsZXNbMF0pXCI+XFxuICAgIDxidXR0b24gbmctY2xpY2s9XCJwcmV2aWV3KClcIj5TaG93IHByZXZpZXc8L2J1dHRvbj5cXG4gICAgPGJ1dHRvbiBuZy1jbGljaz1cInNjYWxlKDIwMClcIj5TY2FsZSB0byAyMDBweCB3aWR0aDwvYnV0dG9uPlxcbiAgICA8YnV0dG9uIG5nLWNsaWNrPVwiY2xlYXIoKVwiPkNsZWFyIHNlbGVjdGlvbjwvYnV0dG9uPlxcbiAgICA8bGFiZWw+RGlzYWJsZWQgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5nLW1vZGVsPVwib3B0aW9ucy5kaXNhYmxlZFwiPjwvbGFiZWw+XFxuXFxuICAgIDxiciAvPlxcblxcbiAgICA8ZGl2IG5nLWlmPVwiZGF0YVVybFwiIGNsYXNzPVwiaW1nLWNvbnRhaW5lclwiPlxcbiAgICAgIDxpbWcgbmctaWY9XCJkYXRhVXJsXCIgbmctc3JjPVwie3tkYXRhVXJsfX1cIiB3aWR0aD1cIjgwMFwiXFxuICAgICAgICAgICBuZy1jcm9wcGVyXFxuICAgICAgICAgICBuZy1jcm9wcGVyLXByb3h5PVwiY3JvcHBlclByb3h5XCJcXG4gICAgICAgICAgIG5nLWNyb3BwZXItc2hvdz1cInNob3dFdmVudFwiXFxuICAgICAgICAgICBuZy1jcm9wcGVyLWhpZGU9XCJoaWRlRXZlbnRcIlxcbiAgICAgICAgICAgbmctY3JvcHBlci1vcHRpb25zPVwib3B0aW9uc1wiPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cInByZXZpZXctY29udGFpbmVyXCI+XFxuICAgICAgPGltZyBuZy1pZj1cInByZXZpZXcuZGF0YVVybFwiIG5nLXNyYz1cInt7cHJldmlldy5kYXRhVXJsfX1cIj5cXG4gICAgPC9kaXY+XFxuPC9zZWN0aW9uPicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdlZGl0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gIG5hbWVcXHVGRjFBPGEgaHJlZj1cIiNcIiBlZGl0YWJsZS10ZXh0PVwidm0ubmFtZVwiIGUtZm9ybT1cInRleHRCdG5Gb3JtXCI+e3sgdm0ubmFtZSB8fCBcXCdlbXB0eVxcJyB9fTwvYT5cXG4gIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBuZy1jbGljaz1cInRleHRCdG5Gb3JtLiRzaG93KClcIiBuZy1oaWRlPVwidGV4dEJ0bkZvcm0uJHZpc2libGVcIj5cXG4gICAgZWRpdFxcbiAgPC9idXR0b24+XFxuICA8YnI+XFxuICBkYXRlOlxcbiAgPGEgaHJlZj1cIiNcIiBcXG4gICAgIGVkaXRhYmxlLWJzZGF0ZT1cInZtLmRvYlwiXFxuICAgICBlLWlzLW9wZW49XCJ2bS5vcGVuZWQuJGRhdGFcIlxcbiAgICAgZS1uZy1jbGljaz1cInZtLm9wZW4oJGV2ZW50LFxcJyRkYXRhXFwnKVwiXFxuICAgICBlLWRhdGVwaWNrZXItcG9wdXA9XCJkZC1NTU1NLXl5eXlcIlxcbiAgID5cXG4gICAge3sgKHZtLmRvYiB8IGRhdGU6XCJkZC9NTS95eXl5XCIpIHx8IFxcJ2VtcHR5XFwnIH19XFxuICA8L2E+XFxuXFxuICA8Zm9ybSBkYXRhLWVkaXRhYmxlLWZvcm0gbmFtZT1cInVpU2VsZWN0Rm9ybVwiPlxcbiAgICA8ZGl2IGVkaXRhYmxlLXVpLXNlbGVjdD1cInVzZXIuc3RhdGVcIiBcXG4gICAgICAgICBkYXRhLWUtZm9ybT1cInVpU2VsZWN0Rm9ybVwiIFxcbiAgICAgICAgIGRhdGEtZS1uYW1lPVwic3RhdGVcIiBcXG4gICAgICAgICBuYW1lPVwic3RhdGVcIiBcXG4gICAgICAgICB0aGVtZT1cImJvb3RzdHJhcFwiIFxcbiAgICAgICAgIGRhdGEtZS1uZy1tb2RlbD1cInVzZXIuc3RhdGVcIiBcXG4gICAgICAgICBkYXRhLWUtc3R5bGU9XCJtaW4td2lkdGg6MzAwcHg7XCJcXG4gICAgPlxcbiAgICAgIHt7dXNlci5zdGF0ZX19XFxuICAgICAgPGVkaXRhYmxlLXVpLXNlbGVjdC1tYXRjaCBwbGFjZWhvbGRlcj1cIlN0YXRlXCI+XFxuICAgICAgICAgIHt7JHNlbGVjdC5zZWxlY3RlZH19XFxuICAgICAgPC9lZGl0YWJsZS11aS1zZWxlY3QtbWF0Y2g+XFxuICAgICAgPGVkaXRhYmxlLXVpLXNlbGVjdC1jaG9pY2VzIHJlcGVhdD1cInN0YXRlIGluIHN0YXRlcyB8IGZpbHRlcjogJHNlbGVjdC5zZWFyY2ggdHJhY2sgYnkgJGluZGV4XCI+XFxuICAgICAgICB7e3N0YXRlfX1cXG4gICAgICA8L2VkaXRhYmxlLXVpLXNlbGVjdC1jaG9pY2VzPlxcbiAgICA8L2Rpdj5cXG4gICAgPGJyLz5cXG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cXG4gICAgICA8IS0tIGJ1dHRvbiB0byBzaG93IGZvcm0gLS0+XFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBuZy1jbGljaz1cInVpU2VsZWN0Rm9ybS4kc2hvdygpXCIgbmctc2hvdz1cIiF1aVNlbGVjdEZvcm0uJHZpc2libGVcIj5cXG4gICAgICAgIEVkaXRcXG4gICAgICA8L2J1dHRvbj5cXG4gICAgICA8IS0tIGJ1dHRvbnMgdG8gc3VibWl0IC8gY2FuY2VsIGZvcm0gLS0+XFxuICAgICAgPHNwYW4gbmctc2hvdz1cInVpU2VsZWN0Rm9ybS4kdmlzaWJsZVwiPlxcbiAgICAgICAgPGJyLz5cXG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgbmctZGlzYWJsZWQ9XCJ1aVNlbGVjdEZvcm0uJHdhaXRpbmdcIj5cXG4gICAgICAgICAgU2F2ZVxcbiAgICAgICAgPC9idXR0b24+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWRpc2FibGVkPVwidWlTZWxlY3RGb3JtLiR3YWl0aW5nXCIgbmctY2xpY2s9XCJ1aVNlbGVjdEZvcm0uJGNhbmNlbCgpXCI+XFxuICAgICAgICAgIENhbmNlbFxcbiAgICAgICAgPC9idXR0b24+XFxuICAgICAgPC9zcGFuPlxcbiAgICA8L2Rpdj4gIFxcbiAgPC9mb3JtPlxcblxcbjwvc2VjdGlvbj4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnaG9tZS5odG1sJywnPHNlY3Rpb24+XFxuICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgZmlndXJlXCI+XFxuICAgIDxmcm9tIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj5cXG4gICAgICA8aW5wdXQgdHlwZT1cIlwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmctbW9kZWw9XCJ2bS5rZXl3b3JkXCI+XFxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyB7e3ZtLnN0eWxlLnRpdGxlfX1cIiBuZy1jbGljaz1cInZtLnNlYXJjaEJvb2soKTtcIj5cXHU2NDFDXFx1N0QyMlxcdTU2RkVcXHU0RTY2PC9idXR0b24+XFxuICAgIDwvZnJvbT5cXG4gIDwvZGl2PlxcbiAgPGRpdj5cXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiIG5nLXJlcGVhdD1cIml0ZW0gaW4gdm0ubGlzdFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMiB0ZXh0LWNlbnRlclwiPlxcbiAgICAgICAgPGltZyBuZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTBcIj5cXG4gICAgICAgIDxoMiBjbGFzcz1cIl90ZXN0XzEyejJmXzFcIj57e2l0ZW0udGl0bGV9fTwvaDI+XFxuICAgICAgICA8aDM+e3tpdGVtLmF1dGhvcn19PC9oMz5cXG4gICAgICAgIDxwPiZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwO3t7aXRlbS5zdW1tYXJ5fX08L3A+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGhyPlxcbiAgICA8L2Rpdj5cXG4gIDwvZGl2Plxcbjwvc2VjdGlvbj4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnaW5kZXguaHRtbCcsJzwhRE9DVFlQRSBodG1sPlxcbjxodG1sIGxhbmc9XCJ6aC1DTlwiPlxcblxcbjxoZWFkPlxcbiAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XFxuICA8dGl0bGU+R2V0VXNlck1lZGlhXFx1NUI5RVxcdTRGOEI8L3RpdGxlPlxcbjwvaGVhZD5cXG5cXG48Ym9keT5cXG4gIDx2aWRlbyBpZD1cInZpZGVvXCIgYXV0b3BsYXkgY29udHJvbHM9XCJcIj5cXG4gICAgPGlkZW8+XFxuPC9ib2R5PlxcbjxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxcbi8vIHZhciBnZXRVc2VyTWVkaWEgPSAobmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhKTtcXG5uYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHtcXG4gIHZpZGVvOiB0cnVlLFxcbiAgYXVkaW86IHRydWVcXG59LCBmdW5jdGlvbihsb2NhbE1lZGlhU3RyZWFtKSB7XFxuICB2YXIgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXCd2aWRlb1xcJyk7XFxuICB2aWRlby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChsb2NhbE1lZGlhU3RyZWFtKTtcXG4gIHZpZGVvLm9ubG9hZGVkbWV0YWRhdGEgPSBmdW5jdGlvbihlKSB7XFxuICAgIGNvbnNvbGUubG9nKFwiTGFiZWw6IFwiICsgbG9jYWxNZWRpYVN0cmVhbS5sYWJlbCk7XFxuICAgIGNvbnNvbGUubG9nKFwiQXVkaW9UcmFja3NcIiwgbG9jYWxNZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpKTtcXG4gICAgY29uc29sZS5sb2coXCJWaWRlb1RyYWNrc1wiLCBsb2NhbE1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkpO1xcbiAgfTtcXG59LCBmdW5jdGlvbihlKSB7XFxuICBjb25zb2xlLmxvZyhcXCdSZWVlZWplY3RlZCFcXCcsIGUpO1xcbn0pO1xcbjwvc2NyaXB0PlxcbjxodG1sPlxcbicpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KCdsYXlvdXQuaHRtbCcsJzxzZWN0aW9uPlxcbiAgPGhlYWRlciBjbGFzcz1cInRleHQtY2VudGVyXCI+e3t2bS50aXRsZX19PC9oZWFkZXI+XFxuXFxuICA8dWktdmlldz48L3VpLXZpZXc+XFxuPC9zZWN0aW9uPicpO31dKTsiXX0=
