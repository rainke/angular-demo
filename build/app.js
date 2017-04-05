(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hepeng/learning/js/angular-demo/app/app.js":[function(require,module,exports){
var $ = require('jquery');
var angular = require('angular');
window.Cropper = require('cropper');
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
  editableOptions.blurElem = 'ignore';
})
},{"../public/templates":"/Users/hepeng/learning/js/angular-demo/public/templates.js","./common/common.module.js":"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js","./config":"/Users/hepeng/learning/js/angular-demo/app/config.js","angular":"angular","angular-block-ui":"angular-block-ui","angular-ui-bootstrap":"angular-ui-bootstrap","angular-ui-router":"angular-ui-router","angular-xeditable":"angular-xeditable","cropper":"/Users/hepeng/learning/js/angular-demo/node_modules/cropper/dist/cropper.js","jquery":"jquery","ui-select":"ui-select"}],"/Users/hepeng/learning/js/angular-demo/app/common/common.module.js":[function(require,module,exports){
var appLayout = require('./components/layout/layout.js');
var contact = require('./components/contact/contact.js');
var home = require('./components/home/home.js');
var edit = require('./components/editable.js');
var cropper = require('./components/cropper/cropper.js');
require('ngCropper/dist/ngCropper.all.js');

module.exports = angular.module('app.common', ['ngCropper'])


.component('appLayout', appLayout)
.component('contact', contact)
.component('layHome', home)
.component('edit', edit)
.component('cropper', cropper)
},{"./components/contact/contact.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js","./components/cropper/cropper.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/cropper/cropper.js","./components/editable.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/editable.js","./components/home/home.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/home/home.js","./components/layout/layout.js":"/Users/hepeng/learning/js/angular-demo/app/common/components/layout/layout.js","ngCropper/dist/ngCropper.all.js":"/Users/hepeng/learning/js/angular-demo/node_modules/ngCropper/dist/ngCropper.all.js"}],"/Users/hepeng/learning/js/angular-demo/app/common/components/contact/contact.js":[function(require,module,exports){
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
},{}],"/Users/hepeng/learning/js/angular-demo/app/common/components/cropper/cropper.js":[function(require,module,exports){
function cropperCtrl($scope,$http) {
  $('#image>img').cropper({
    aspectRatio: 16 / 9,
    crop: function(e) {
      // Output the result data for cropping image.
      console.log(e.x);
      console.log(e.y);
      console.log(e.width);
      console.log(e.height);
      console.log(e.rotate);
      console.log(e.scaleX);
      console.log(e.scaleY);
    }
  });
}


module.exports = {
  templateUrl: 'cropper.html',
  controller: cropperCtrl,
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
  this.checkName = function(data){
    console.log(data)
    if(data!=='haha'){
      return 'wrong';
    }
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
  }).state('cropper', {
    url:'/cropper',
    template:'<cropper/>',
    title:'画画'
  })
}

module.exports = config;
},{}],"/Users/hepeng/learning/js/angular-demo/node_modules/cropper/dist/cropper.js":[function(require,module,exports){
/*!
 * Cropper v3.0.0-rc
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright (c) 2017 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2017-03-25T12:04:34.654Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (factory(global.$));
}(this, (function ($) { 'use strict';

$ = 'default' in $ ? $['default'] : $;

var DEFAULTS = {
  // Define the view mode of the cropper
  viewMode: 0, // 0, 1, 2, 3

  // Define the dragging mode of the cropper
  dragMode: 'crop', // 'crop', 'move' or 'none'

  // Define the aspect ratio of the crop box
  aspectRatio: NaN,

  // An object with the previous cropping result data
  data: null,

  // A selector for adding extra containers to preview
  preview: '',

  // Re-render the cropper when resize the window
  responsive: true,

  // Restore the cropped area after resize the window
  restore: true,

  // Check if the current image is a cross-origin image
  checkCrossOrigin: true,

  // Check the current image's Exif Orientation information
  checkOrientation: true,

  // Show the black modal
  modal: true,

  // Show the dashed lines for guiding
  guides: true,

  // Show the center indicator for guiding
  center: true,

  // Show the white modal to highlight the crop box
  highlight: true,

  // Show the grid background
  background: true,

  // Enable to crop the image automatically when initialize
  autoCrop: true,

  // Define the percentage of automatic cropping area when initializes
  autoCropArea: 0.8,

  // Enable to move the image
  movable: true,

  // Enable to rotate the image
  rotatable: true,

  // Enable to scale the image
  scalable: true,

  // Enable to zoom the image
  zoomable: true,

  // Enable to zoom the image by dragging touch
  zoomOnTouch: true,

  // Enable to zoom the image by wheeling mouse
  zoomOnWheel: true,

  // Define zoom ratio when zoom the image by wheeling mouse
  wheelZoomRatio: 0.1,

  // Enable to move the crop box
  cropBoxMovable: true,

  // Enable to resize the crop box
  cropBoxResizable: true,

  // Toggle drag mode between "crop" and "move" when click twice on the cropper
  toggleDragModeOnDblclick: true,

  // Size limitation
  minCanvasWidth: 0,
  minCanvasHeight: 0,
  minCropBoxWidth: 0,
  minCropBoxHeight: 0,
  minContainerWidth: 200,
  minContainerHeight: 100,

  // Shortcuts of events
  ready: null,
  cropstart: null,
  cropmove: null,
  cropend: null,
  crop: null,
  zoom: null
};

var TEMPLATE = '<div class="cropper-container">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-action="e"></span>' + '<span class="cropper-line line-n" data-action="n"></span>' + '<span class="cropper-line line-w" data-action="w"></span>' + '<span class="cropper-line line-s" data-action="s"></span>' + '<span class="cropper-point point-e" data-action="e"></span>' + '<span class="cropper-point point-n" data-action="n"></span>' + '<span class="cropper-point point-w" data-action="w"></span>' + '<span class="cropper-point point-s" data-action="s"></span>' + '<span class="cropper-point point-ne" data-action="ne"></span>' + '<span class="cropper-point point-nw" data-action="nw"></span>' + '<span class="cropper-point point-sw" data-action="sw"></span>' + '<span class="cropper-point point-se" data-action="se"></span>' + '</div>' + '</div>';

var REGEXP_DATA_URL_HEAD = /^data:.*,/;
var REGEXP_USERAGENT = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i;
var navigator = typeof window !== 'undefined' ? window.navigator : null;
var IS_SAFARI_OR_UIWEBVIEW = navigator && REGEXP_USERAGENT.test(navigator.userAgent);
var fromCharCode = String.fromCharCode;

function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
}

function isUndefined(n) {
  return typeof n === 'undefined';
}

function toArray(obj, offset) {
  var args = [];

  // This is necessary for IE8
  if (isNumber(offset)) {
    args.push(offset);
  }

  return args.slice.apply(obj, args);
}

// Custom proxy to avoid jQuery's guid
function proxy(fn, context) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args2[_key2] = arguments[_key2];
    }

    return fn.apply(context, args.concat(toArray(args2)));
  };
}

function objectKeys(obj) {
  var keys = [];

  $.each(obj, function (key) {
    keys.push(key);
  });

  return keys;
}

function isCrossOriginURL(url) {
  var parts = url.match(/^(https?:)\/\/([^:/?#]+):?(\d*)/i);

  return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
}

function addTimestamp(url) {
  var timestamp = 'timestamp=' + new Date().getTime();

  return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
}

function getCrossOrigin(crossOrigin) {
  return crossOrigin ? ' crossOrigin="' + crossOrigin + '"' : '';
}

function getImageSize(image, callback) {
  // Modern browsers (ignore Safari, #120 & #509)
  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
    callback(image.naturalWidth, image.naturalHeight);
    return;
  }

  // IE8: Don't use `new Image()` here (#319)
  var newImage = document.createElement('img');

  newImage.onload = function load() {
    callback(this.width, this.height);
  };

  newImage.src = image.src;
}

function getTransform(options) {
  var transforms = [];
  var translateX = options.translateX;
  var translateY = options.translateY;
  var rotate = options.rotate;
  var scaleX = options.scaleX;
  var scaleY = options.scaleY;

  if (isNumber(translateX) && translateX !== 0) {
    transforms.push('translateX(' + translateX + 'px)');
  }

  if (isNumber(translateY) && translateY !== 0) {
    transforms.push('translateY(' + translateY + 'px)');
  }

  // Rotate should come first before scale to match orientation transform
  if (isNumber(rotate) && rotate !== 0) {
    transforms.push('rotate(' + rotate + 'deg)');
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    transforms.push('scaleX(' + scaleX + ')');
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    transforms.push('scaleY(' + scaleY + ')');
  }

  return transforms.length ? transforms.join(' ') : 'none';
}

function getRotatedSizes(data, isReversed) {
  var deg = Math.abs(data.degree) % 180;
  var arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180;
  var sinArc = Math.sin(arc);
  var cosArc = Math.cos(arc);
  var width = data.width;
  var height = data.height;
  var aspectRatio = data.aspectRatio;
  var newWidth = void 0;
  var newHeight = void 0;

  if (!isReversed) {
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
  var canvas = $('<canvas>')[0];
  var context = canvas.getContext('2d');
  var dstX = 0;
  var dstY = 0;
  var dstWidth = data.naturalWidth;
  var dstHeight = data.naturalHeight;
  var rotate = data.rotate;
  var scaleX = data.scaleX;
  var scaleY = data.scaleY;
  var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
  var rotatable = isNumber(rotate) && rotate !== 0;
  var advanced = rotatable || scalable;
  var canvasWidth = dstWidth * Math.abs(scaleX || 1);
  var canvasHeight = dstHeight * Math.abs(scaleY || 1);
  var translateX = void 0;
  var translateY = void 0;
  var rotated = void 0;

  if (scalable) {
    translateX = canvasWidth / 2;
    translateY = canvasHeight / 2;
  }

  if (rotatable) {
    rotated = getRotatedSizes({
      width: canvasWidth,
      height: canvasHeight,
      degree: rotate
    });

    canvasWidth = rotated.width;
    canvasHeight = rotated.height;
    translateX = canvasWidth / 2;
    translateY = canvasHeight / 2;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (advanced) {
    dstX = -dstWidth / 2;
    dstY = -dstHeight / 2;

    context.save();
    context.translate(translateX, translateY);
  }

  // Rotate should come first before scale as in the "getTransform" function
  if (rotatable) {
    context.rotate(rotate * Math.PI / 180);
  }

  if (scalable) {
    context.scale(scaleX, scaleY);
  }

  context.drawImage(image, Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));

  if (advanced) {
    context.restore();
  }

  return canvas;
}

function getStringFromCharCode(dataView, start, length) {
  var str = '';
  var i = void 0;

  for (i = start, length += start; i < length; i++) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}

function getOrientation(arrayBuffer) {
  var dataView = new DataView(arrayBuffer);
  var length = dataView.byteLength;
  var orientation = void 0;
  var exifIDCode = void 0;
  var tiffOffset = void 0;
  var firstIFDOffset = void 0;
  var littleEndian = void 0;
  var endianness = void 0;
  var app1Start = void 0;
  var ifdStart = void 0;
  var offset = void 0;
  var i = void 0;

  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2;

    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset;
        break;
      }

      offset++;
    }
  }

  if (app1Start) {
    exifIDCode = app1Start + 4;
    tiffOffset = app1Start + 10;

    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      endianness = dataView.getUint16(tiffOffset);
      littleEndian = endianness === 0x4949;

      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
    }
  }

  if (ifdStart) {
    length = dataView.getUint16(ifdStart, littleEndian);

    for (i = 0; i < length; i++) {
      offset = ifdStart + i * 12 + 2;

      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with its default value for Safari (#120)
          if (IS_SAFARI_OR_UIWEBVIEW) {
            dataView.setUint16(offset, 1, littleEndian);
          }

          break;
        }
    }
  }

  return orientation;
}

function dataURLToArrayBuffer(dataURL) {
  var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  var binary = atob(base64);
  var length = binary.length;
  var arrayBuffer = new ArrayBuffer(length);
  var dataView = new Uint8Array(arrayBuffer);
  var i = void 0;

  for (i = 0; i < length; i++) {
    dataView[i] = binary.charCodeAt(i);
  }

  return arrayBuffer;
}

// Only available for JPEG image
function arrayBufferToDataURL(arrayBuffer) {
  var dataView = new Uint8Array(arrayBuffer);
  var length = dataView.length;
  var base64 = '';
  var i = void 0;

  for (i = 0; i < length; i++) {
    base64 += fromCharCode(dataView[i]);
  }

  return 'data:image/jpeg;base64,' + btoa(base64);
}

var render$1 = {
  render: function render() {
    var self = this;

    self.initContainer();
    self.initCanvas();
    self.initCropBox();

    self.renderCanvas();

    if (self.cropped) {
      self.renderCropBox();
    }
  },
  initContainer: function initContainer() {
    var self = this;
    var options = self.options;
    var $this = self.$element;
    var $container = self.$container;
    var $cropper = self.$cropper;
    var hidden = 'cropper-hidden';

    $cropper.addClass(hidden);
    $this.removeClass(hidden);

    $cropper.css(self.container = {
      width: Math.max($container.width(), Number(options.minContainerWidth) || 200),
      height: Math.max($container.height(), Number(options.minContainerHeight) || 100)
    });

    $this.addClass(hidden);
    $cropper.removeClass(hidden);
  },


  // Canvas (image wrapper)
  initCanvas: function initCanvas() {
    var self = this;
    var viewMode = self.options.viewMode;
    var container = self.container;
    var containerWidth = container.width;
    var containerHeight = container.height;
    var image = self.image;
    var imageNaturalWidth = image.naturalWidth;
    var imageNaturalHeight = image.naturalHeight;
    var is90Degree = Math.abs(image.rotate) === 90;
    var naturalWidth = is90Degree ? imageNaturalHeight : imageNaturalWidth;
    var naturalHeight = is90Degree ? imageNaturalWidth : imageNaturalHeight;
    var aspectRatio = naturalWidth / naturalHeight;
    var canvasWidth = containerWidth;
    var canvasHeight = containerHeight;

    if (containerHeight * aspectRatio > containerWidth) {
      if (viewMode === 3) {
        canvasWidth = containerHeight * aspectRatio;
      } else {
        canvasHeight = containerWidth / aspectRatio;
      }
    } else if (viewMode === 3) {
      canvasHeight = containerWidth / aspectRatio;
    } else {
      canvasWidth = containerHeight * aspectRatio;
    }

    var canvas = {
      naturalWidth: naturalWidth,
      naturalHeight: naturalHeight,
      aspectRatio: aspectRatio,
      width: canvasWidth,
      height: canvasHeight
    };

    canvas.oldLeft = canvas.left = (containerWidth - canvasWidth) / 2;
    canvas.oldTop = canvas.top = (containerHeight - canvasHeight) / 2;

    self.canvas = canvas;
    self.limited = viewMode === 1 || viewMode === 2;
    self.limitCanvas(true, true);
    self.initialImage = $.extend({}, image);
    self.initialCanvas = $.extend({}, canvas);
  },
  limitCanvas: function limitCanvas(isSizeLimited, isPositionLimited) {
    var self = this;
    var options = self.options;
    var viewMode = options.viewMode;
    var container = self.container;
    var containerWidth = container.width;
    var containerHeight = container.height;
    var canvas = self.canvas;
    var aspectRatio = canvas.aspectRatio;
    var cropBox = self.cropBox;
    var cropped = self.cropped && cropBox;

    if (isSizeLimited) {
      var minCanvasWidth = Number(options.minCanvasWidth) || 0;
      var minCanvasHeight = Number(options.minCanvasHeight) || 0;

      if (viewMode) {
        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, containerWidth);
          minCanvasHeight = Math.max(minCanvasHeight, containerHeight);

          if (viewMode === 3) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        } else if (minCanvasWidth) {
          minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBox.width : 0);
        } else if (minCanvasHeight) {
          minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBox.height : 0);
        } else if (cropped) {
          minCanvasWidth = cropBox.width;
          minCanvasHeight = cropBox.height;

          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          } else {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          }
        }
      }

      if (minCanvasWidth && minCanvasHeight) {
        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else {
          minCanvasWidth = minCanvasHeight * aspectRatio;
        }
      } else if (minCanvasWidth) {
        minCanvasHeight = minCanvasWidth / aspectRatio;
      } else if (minCanvasHeight) {
        minCanvasWidth = minCanvasHeight * aspectRatio;
      }

      canvas.minWidth = minCanvasWidth;
      canvas.minHeight = minCanvasHeight;
      canvas.maxWidth = Infinity;
      canvas.maxHeight = Infinity;
    }

    if (isPositionLimited) {
      if (viewMode) {
        var newCanvasLeft = containerWidth - canvas.width;
        var newCanvasTop = containerHeight - canvas.height;

        canvas.minLeft = Math.min(0, newCanvasLeft);
        canvas.minTop = Math.min(0, newCanvasTop);
        canvas.maxLeft = Math.max(0, newCanvasLeft);
        canvas.maxTop = Math.max(0, newCanvasTop);

        if (cropped && self.limited) {
          canvas.minLeft = Math.min(cropBox.left, cropBox.left + cropBox.width - canvas.width);
          canvas.minTop = Math.min(cropBox.top, cropBox.top + cropBox.height - canvas.height);
          canvas.maxLeft = cropBox.left;
          canvas.maxTop = cropBox.top;

          if (viewMode === 2) {
            if (canvas.width >= containerWidth) {
              canvas.minLeft = Math.min(0, newCanvasLeft);
              canvas.maxLeft = Math.max(0, newCanvasLeft);
            }

            if (canvas.height >= containerHeight) {
              canvas.minTop = Math.min(0, newCanvasTop);
              canvas.maxTop = Math.max(0, newCanvasTop);
            }
          }
        }
      } else {
        canvas.minLeft = -canvas.width;
        canvas.minTop = -canvas.height;
        canvas.maxLeft = containerWidth;
        canvas.maxTop = containerHeight;
      }
    }
  },
  renderCanvas: function renderCanvas(isChanged) {
    var self = this;
    var canvas = self.canvas;
    var image = self.image;
    var rotate = image.rotate;
    var naturalWidth = image.naturalWidth;
    var naturalHeight = image.naturalHeight;

    if (self.rotated) {
      self.rotated = false;

      // Computes rotated sizes with image sizes
      var rotated = getRotatedSizes({
        width: image.width,
        height: image.height,
        degree: rotate
      });
      var aspectRatio = rotated.width / rotated.height;
      var isSquareImage = image.aspectRatio === 1;

      if (isSquareImage || aspectRatio !== canvas.aspectRatio) {
        canvas.left -= (rotated.width - canvas.width) / 2;
        canvas.top -= (rotated.height - canvas.height) / 2;
        canvas.width = rotated.width;
        canvas.height = rotated.height;
        canvas.aspectRatio = aspectRatio;
        canvas.naturalWidth = naturalWidth;
        canvas.naturalHeight = naturalHeight;

        // Computes rotated sizes with natural image sizes
        if (isSquareImage && rotate % 90 || rotate % 180) {
          var rotated2 = getRotatedSizes({
            width: naturalWidth,
            height: naturalHeight,
            degree: rotate
          });

          canvas.naturalWidth = rotated2.width;
          canvas.naturalHeight = rotated2.height;
        }

        self.limitCanvas(true, false);
      }
    }

    if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
      canvas.left = canvas.oldLeft;
    }

    if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
      canvas.top = canvas.oldTop;
    }

    canvas.width = Math.min(Math.max(canvas.width, canvas.minWidth), canvas.maxWidth);
    canvas.height = Math.min(Math.max(canvas.height, canvas.minHeight), canvas.maxHeight);

    self.limitCanvas(false, true);

    canvas.oldLeft = canvas.left = Math.min(Math.max(canvas.left, canvas.minLeft), canvas.maxLeft);
    canvas.oldTop = canvas.top = Math.min(Math.max(canvas.top, canvas.minTop), canvas.maxTop);

    self.$canvas.css({
      width: canvas.width,
      height: canvas.height,
      transform: getTransform({
        translateX: canvas.left,
        translateY: canvas.top
      })
    });

    self.renderImage();

    if (self.cropped && self.limited) {
      self.limitCropBox(true, true);
    }

    if (isChanged) {
      self.output();
    }
  },
  renderImage: function renderImage(isChanged) {
    var self = this;
    var canvas = self.canvas;
    var image = self.image;
    var reversed = void 0;

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

    self.$clone.css({
      width: image.width,
      height: image.height,
      transform: getTransform($.extend({
        translateX: image.left,
        translateY: image.top
      }, image))
    });

    if (isChanged) {
      self.output();
    }
  },
  initCropBox: function initCropBox() {
    var self = this;
    var options = self.options;
    var canvas = self.canvas;
    var aspectRatio = options.aspectRatio;
    var autoCropArea = Number(options.autoCropArea) || 0.8;
    var cropBox = {
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

    self.cropBox = cropBox;
    self.limitCropBox(true, true);

    // Initialize auto crop area
    cropBox.width = Math.min(Math.max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
    cropBox.height = Math.min(Math.max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

    // The width of auto crop area must large than "minWidth", and the height too. (#164)
    cropBox.width = Math.max(cropBox.minWidth, cropBox.width * autoCropArea);
    cropBox.height = Math.max(cropBox.minHeight, cropBox.height * autoCropArea);
    cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
    cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;

    self.initialCropBox = $.extend({}, cropBox);
  },
  limitCropBox: function limitCropBox(isSizeLimited, isPositionLimited) {
    var self = this;
    var options = self.options;
    var aspectRatio = options.aspectRatio;
    var container = self.container;
    var containerWidth = container.width;
    var containerHeight = container.height;
    var canvas = self.canvas;
    var cropBox = self.cropBox;
    var limited = self.limited;

    if (isSizeLimited) {
      var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
      var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
      var maxCropBoxWidth = Math.min(containerWidth, limited ? canvas.width : containerWidth);
      var maxCropBoxHeight = Math.min(containerHeight, limited ? canvas.height : containerHeight);

      // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
      minCropBoxWidth = Math.min(minCropBoxWidth, containerWidth);
      minCropBoxHeight = Math.min(minCropBoxHeight, containerHeight);

      if (aspectRatio) {
        if (minCropBoxWidth && minCropBoxHeight) {
          if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }
        } else if (minCropBoxWidth) {
          minCropBoxHeight = minCropBoxWidth / aspectRatio;
        } else if (minCropBoxHeight) {
          minCropBoxWidth = minCropBoxHeight * aspectRatio;
        }

        if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
          maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
        } else {
          maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
        }
      }

      // The minWidth/Height must be less than maxWidth/Height
      cropBox.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
      cropBox.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
      cropBox.maxWidth = maxCropBoxWidth;
      cropBox.maxHeight = maxCropBoxHeight;
    }

    if (isPositionLimited) {
      if (limited) {
        cropBox.minLeft = Math.max(0, canvas.left);
        cropBox.minTop = Math.max(0, canvas.top);
        cropBox.maxLeft = Math.min(containerWidth, canvas.left + canvas.width) - cropBox.width;
        cropBox.maxTop = Math.min(containerHeight, canvas.top + canvas.height) - cropBox.height;
      } else {
        cropBox.minLeft = 0;
        cropBox.minTop = 0;
        cropBox.maxLeft = containerWidth - cropBox.width;
        cropBox.maxTop = containerHeight - cropBox.height;
      }
    }
  },
  renderCropBox: function renderCropBox() {
    var self = this;
    var options = self.options;
    var container = self.container;
    var containerWidth = container.width;
    var containerHeight = container.height;
    var cropBox = self.cropBox;

    if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
      cropBox.left = cropBox.oldLeft;
    }

    if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
      cropBox.top = cropBox.oldTop;
    }

    cropBox.width = Math.min(Math.max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
    cropBox.height = Math.min(Math.max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

    self.limitCropBox(false, true);

    cropBox.oldLeft = cropBox.left = Math.min(Math.max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
    cropBox.oldTop = cropBox.top = Math.min(Math.max(cropBox.top, cropBox.minTop), cropBox.maxTop);

    if (options.movable && options.cropBoxMovable) {
      // Turn to move the canvas when the crop box is equal to the container
      self.$face.data('action', cropBox.width === containerWidth && cropBox.height === containerHeight ? 'move' : 'all');
    }

    self.$cropBox.css({
      width: cropBox.width,
      height: cropBox.height,
      transform: getTransform({
        translateX: cropBox.left,
        translateY: cropBox.top
      })
    });

    if (self.cropped && self.limited) {
      self.limitCanvas(true, true);
    }

    if (!self.disabled) {
      self.output();
    }
  },
  output: function output() {
    var self = this;

    self.preview();

    if (self.completed) {
      self.trigger('crop', self.getData());
    }
  }
};

var DATA_PREVIEW = 'preview';

var preview$1 = {
  initPreview: function initPreview() {
    var self = this;
    var crossOrigin = getCrossOrigin(self.crossOrigin);
    var url = crossOrigin ? self.crossOriginUrl : self.url;
    var $clone2 = void 0;

    self.$preview = $(self.options.preview);
    self.$clone2 = $clone2 = $('<img ' + crossOrigin + ' src="' + url + '">');
    self.$viewBox.html($clone2);
    self.$preview.each(function (i, element) {
      var $this = $(element);

      // Save the original size for recover
      $this.data(DATA_PREVIEW, {
        width: $this.width(),
        height: $this.height(),
        html: $this.html()
      });

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * (Occur only when margin-top <= -height)
       */
      $this.html('<img ' + crossOrigin + ' src="' + url + '" style="' + 'display:block;width:100%;height:auto;' + 'min-width:0!important;min-height:0!important;' + 'max-width:none!important;max-height:none!important;' + 'image-orientation:0deg!important;">');
    });
  },
  resetPreview: function resetPreview() {
    this.$preview.each(function (i, element) {
      var $this = $(element);
      var data = $this.data(DATA_PREVIEW);

      $this.css({
        width: data.width,
        height: data.height
      }).html(data.html).removeData(DATA_PREVIEW);
    });
  },
  preview: function preview() {
    var self = this;
    var image = self.image;
    var canvas = self.canvas;
    var cropBox = self.cropBox;
    var cropBoxWidth = cropBox.width;
    var cropBoxHeight = cropBox.height;
    var width = image.width;
    var height = image.height;
    var left = cropBox.left - canvas.left - image.left;
    var top = cropBox.top - canvas.top - image.top;

    if (!self.cropped || self.disabled) {
      return;
    }

    self.$clone2.css({
      width: width,
      height: height,
      transform: getTransform($.extend({
        translateX: -left,
        translateY: -top
      }, image))
    });

    self.$preview.each(function (i, element) {
      var $this = $(element);
      var data = $this.data(DATA_PREVIEW);
      var originalWidth = data.width;
      var originalHeight = data.height;
      var newWidth = originalWidth;
      var newHeight = originalHeight;
      var ratio = 1;

      if (cropBoxWidth) {
        ratio = originalWidth / cropBoxWidth;
        newHeight = cropBoxHeight * ratio;
      }

      if (cropBoxHeight && newHeight > originalHeight) {
        ratio = originalHeight / cropBoxHeight;
        newWidth = cropBoxWidth * ratio;
        newHeight = originalHeight;
      }

      $this.css({
        width: newWidth,
        height: newHeight
      }).find('img').css({
        width: width * ratio,
        height: height * ratio,
        transform: getTransform($.extend({
          translateX: -left * ratio,
          translateY: -top * ratio
        }, image))
      });
    });
  }
};

// Globals
var PointerEvent = typeof window !== 'undefined' ? window.PointerEvent : null;

// Events
var EVENT_POINTER_DOWN = PointerEvent ? 'pointerdown' : 'touchstart mousedown';
var EVENT_POINTER_MOVE = PointerEvent ? 'pointermove' : 'touchmove mousemove';
var EVENT_POINTER_UP = PointerEvent ? ' pointerup pointercancel' : 'touchend touchcancel mouseup';
var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
var EVENT_DBLCLICK = 'dblclick';
var EVENT_RESIZE = 'resize';
var EVENT_CROP_START = 'cropstart';
var EVENT_CROP_MOVE = 'cropmove';
var EVENT_CROP_END = 'cropend';
var EVENT_CROP = 'crop';
var EVENT_ZOOM = 'zoom';

var events = {
  bind: function bind() {
    var self = this;
    var options = self.options;
    var $this = self.$element;
    var $cropper = self.$cropper;

    if ($.isFunction(options.cropstart)) {
      $this.on(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $this.on(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $this.on(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $this.on(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $this.on(EVENT_ZOOM, options.zoom);
    }

    $cropper.on(EVENT_POINTER_DOWN, proxy(self.cropStart, this));

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.on(EVENT_WHEEL, proxy(self.wheel, this));
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.on(EVENT_DBLCLICK, proxy(self.dblclick, this));
    }

    $(document).on(EVENT_POINTER_MOVE, self.onCropMove = proxy(self.cropMove, this)).on(EVENT_POINTER_UP, self.onCropEnd = proxy(self.cropEnd, this));

    if (options.responsive) {
      $(window).on(EVENT_RESIZE, self.onResize = proxy(self.resize, this));
    }
  },
  unbind: function unbind() {
    var self = this;
    var options = self.options;
    var $this = self.$element;
    var $cropper = self.$cropper;

    if ($.isFunction(options.cropstart)) {
      $this.off(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $this.off(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $this.off(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $this.off(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $this.off(EVENT_ZOOM, options.zoom);
    }

    $cropper.off(EVENT_POINTER_DOWN, self.cropStart);

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.off(EVENT_WHEEL, self.wheel);
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.off(EVENT_DBLCLICK, self.dblclick);
    }

    $(document).off(EVENT_POINTER_MOVE, self.onCropMove).off(EVENT_POINTER_UP, self.onCropEnd);

    if (options.responsive) {
      $(window).off(EVENT_RESIZE, self.onResize);
    }
  }
};

var REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;

function getPointer(_ref, endOnly) {
  var pageX = _ref.pageX,
      pageY = _ref.pageY;

  var end = {
    endX: pageX,
    endY: pageY
  };

  if (endOnly) {
    return end;
  }

  return $.extend({
    startX: pageX,
    startY: pageY
  }, end);
}

var handlers = {
  resize: function resize() {
    var self = this;
    var options = self.options;
    var $container = self.$container;
    var container = self.container;
    var minContainerWidth = Number(options.minContainerWidth) || 200;
    var minContainerHeight = Number(options.minContainerHeight) || 100;

    if (self.disabled || container.width === minContainerWidth || container.height === minContainerHeight) {
      return;
    }

    var ratio = $container.width() / container.width;

    // Resize when width changed or height changed
    if (ratio !== 1 || $container.height() !== container.height) {
      (function () {
        var canvasData = void 0;
        var cropBoxData = void 0;

        if (options.restore) {
          canvasData = self.getCanvasData();
          cropBoxData = self.getCropBoxData();
        }

        self.render();

        if (options.restore) {
          self.setCanvasData($.each(canvasData, function (i, n) {
            canvasData[i] = n * ratio;
          }));
          self.setCropBoxData($.each(cropBoxData, function (i, n) {
            cropBoxData[i] = n * ratio;
          }));
        }
      })();
    }
  },
  dblclick: function dblclick() {
    var self = this;

    if (self.disabled || self.options.dragMode === 'none') {
      return;
    }

    self.setDragMode(self.$dragBox.hasClass('cropper-crop') ? 'move' : 'crop');
  },
  wheel: function wheel(event) {
    var self = this;
    var e = event.originalEvent || event;
    var ratio = Number(self.options.wheelZoomRatio) || 0.1;

    if (self.disabled) {
      return;
    }

    event.preventDefault();

    // Limit wheel speed to prevent zoom too fast
    if (self.wheeling) {
      return;
    }

    self.wheeling = true;

    setTimeout(function () {
      self.wheeling = false;
    }, 50);

    var delta = 1;

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    self.zoom(-delta * ratio, event);
  },
  cropStart: function cropStart(e) {
    var self = this;

    if (self.disabled) {
      return;
    }

    var options = self.options;
    var pointers = self.pointers;
    var originalEvent = e.originalEvent;
    var action = void 0;

    if (originalEvent && originalEvent.changedTouches) {
      // Handle touch event
      $.each(originalEvent.changedTouches, function (i, touch) {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      // Handle mouse event and pointer event
      pointers[originalEvent && originalEvent.pointerId || 0] = getPointer(originalEvent || e);
    }

    if (objectKeys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
      action = 'zoom';
    } else {
      action = $(e.target).data('action');
    }

    if (!REGEXP_ACTIONS.test(action)) {
      return;
    }

    if (self.trigger('cropstart', {
      originalEvent: originalEvent,
      action: action
    }).isDefaultPrevented()) {
      return;
    }

    e.preventDefault();

    self.action = action;
    self.cropping = false;

    if (action === 'crop') {
      self.cropping = true;
      self.$dragBox.addClass('cropper-modal');
    }
  },
  cropMove: function cropMove(e) {
    var self = this;
    var action = self.action;

    if (self.disabled || !action) {
      return;
    }

    var pointers = self.pointers;
    var originalEvent = e.originalEvent;

    e.preventDefault();

    if (self.trigger('cropmove', {
      originalEvent: originalEvent,
      action: action
    }).isDefaultPrevented()) {
      return;
    }

    if (originalEvent && originalEvent.changedTouches) {
      $.each(originalEvent.changedTouches, function (i, touch) {
        $.extend(pointers[touch.identifier], getPointer(touch, true));
      });
    } else {
      $.extend(pointers[originalEvent && originalEvent.pointerId || 0], getPointer(originalEvent || e, true));
    }

    self.change(e);
  },
  cropEnd: function cropEnd(e) {
    var self = this;

    if (self.disabled) {
      return;
    }

    var action = self.action;
    var pointers = self.pointers;
    var originalEvent = e.originalEvent;

    if (originalEvent && originalEvent.changedTouches) {
      $.each(originalEvent.changedTouches, function (i, touch) {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[originalEvent && originalEvent.pointerId || 0];
    }

    if (!action) {
      return;
    }

    e.preventDefault();

    if (!objectKeys(pointers).length) {
      self.action = '';
    }

    if (self.cropping) {
      self.cropping = false;
      self.$dragBox.toggleClass('cropper-modal', self.cropped && self.options.modal);
    }

    self.trigger('cropend', {
      originalEvent: originalEvent,
      action: action
    });
  }
};

// Actions
var ACTION_EAST = 'e';
var ACTION_WEST = 'w';
var ACTION_SOUTH = 's';
var ACTION_NORTH = 'n';
var ACTION_SOUTH_EAST = 'se';
var ACTION_SOUTH_WEST = 'sw';
var ACTION_NORTH_EAST = 'ne';
var ACTION_NORTH_WEST = 'nw';

function getMaxZoomRatio(pointers) {
  var pointers2 = $.extend({}, pointers);
  var ratios = [];

  $.each(pointers, function (pointerId, pointer) {
    delete pointers2[pointerId];

    $.each(pointers2, function (pointerId2, pointer2) {
      var x1 = Math.abs(pointer.startX - pointer2.startX);
      var y1 = Math.abs(pointer.startY - pointer2.startY);
      var x2 = Math.abs(pointer.endX - pointer2.endX);
      var y2 = Math.abs(pointer.endY - pointer2.endY);
      var z1 = Math.sqrt(x1 * x1 + y1 * y1);
      var z2 = Math.sqrt(x2 * x2 + y2 * y2);
      var ratio = (z2 - z1) / z1;

      ratios.push(ratio);
    });
  });

  ratios.sort(function (a, b) {
    return Math.abs(a) < Math.abs(b);
  });

  return ratios[0];
}

var change$1 = {
  change: function change(e) {
    var self = this;
    var options = self.options;
    var pointers = self.pointers;
    var pointer = pointers[objectKeys(pointers)[0]];
    var container = self.container;
    var canvas = self.canvas;
    var cropBox = self.cropBox;
    var action = self.action;
    var aspectRatio = options.aspectRatio;
    var width = cropBox.width;
    var height = cropBox.height;
    var left = cropBox.left;
    var top = cropBox.top;
    var right = left + width;
    var bottom = top + height;
    var minLeft = 0;
    var minTop = 0;
    var maxWidth = container.width;
    var maxHeight = container.height;
    var renderable = true;
    var offset = void 0;

    // Locking aspect ratio in "free mode" by holding shift key (#259)
    if (!aspectRatio && e.shiftKey) {
      aspectRatio = width && height ? width / height : 1;
    }

    if (self.limited) {
      minLeft = cropBox.minLeft;
      minTop = cropBox.minTop;
      maxWidth = minLeft + Math.min(container.width, canvas.width, canvas.left + canvas.width);
      maxHeight = minTop + Math.min(container.height, canvas.height, canvas.top + canvas.height);
    }

    var range = {
      x: pointer.endX - pointer.startX,
      y: pointer.endY - pointer.startY
    };

    if (aspectRatio) {
      range.X = range.y * aspectRatio;
      range.Y = range.x / aspectRatio;
    }

    switch (action) {
      // Move crop box
      case 'all':
        left += range.x;
        top += range.y;
        break;

      // Resize crop box
      case ACTION_EAST:
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
          action = ACTION_WEST;
          width = 0;
        }

        break;

      case ACTION_NORTH:
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
          action = ACTION_SOUTH;
          height = 0;
        }

        break;

      case ACTION_WEST:
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
          action = ACTION_EAST;
          width = 0;
        }

        break;

      case ACTION_SOUTH:
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
          action = ACTION_NORTH;
          height = 0;
        }

        break;

      case ACTION_NORTH_EAST:
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
          action = ACTION_SOUTH_WEST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_NORTH_WEST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_SOUTH_EAST;
          height = 0;
        }

        break;

      case ACTION_NORTH_WEST:
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
          action = ACTION_SOUTH_EAST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_NORTH_EAST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_SOUTH_WEST;
          height = 0;
        }

        break;

      case ACTION_SOUTH_WEST:
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
          action = ACTION_NORTH_EAST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_SOUTH_EAST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_NORTH_WEST;
          height = 0;
        }

        break;

      case ACTION_SOUTH_EAST:
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
          action = ACTION_NORTH_WEST;
          height = 0;
          width = 0;
        } else if (width < 0) {
          action = ACTION_SOUTH_WEST;
          width = 0;
        } else if (height < 0) {
          action = ACTION_NORTH_EAST;
          height = 0;
        }

        break;

      // Move canvas
      case 'move':
        self.move(range.x, range.y);
        renderable = false;
        break;

      // Zoom canvas
      case 'zoom':
        self.zoom(getMaxZoomRatio(pointers), e.originalEvent);
        renderable = false;
        break;

      // Create crop box
      case 'crop':
        if (!range.x || !range.y) {
          renderable = false;
          break;
        }

        offset = self.$cropper.offset();
        left = pointer.startX - offset.left;
        top = pointer.startY - offset.top;
        width = cropBox.minWidth;
        height = cropBox.minHeight;

        if (range.x > 0) {
          action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
        } else if (range.x < 0) {
          left -= width;
          action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
        }

        if (range.y < 0) {
          top -= height;
        }

        // Show the crop box if is hidden
        if (!self.cropped) {
          self.$cropBox.removeClass('cropper-hidden');
          self.cropped = true;

          if (self.limited) {
            self.limitCropBox(true, true);
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
      self.action = action;
      self.renderCropBox();
    }

    // Override
    $.each(pointers, function (i, p) {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function getPointersCenter(pointers) {
  var pageX = 0;
  var pageY = 0;
  var count = 0;

  $.each(pointers, function (i, _ref) {
    var startX = _ref.startX,
        startY = _ref.startY;

    pageX += startX;
    pageY += startY;
    count += 1;
  });

  pageX /= count;
  pageY /= count;

  return {
    pageX: pageX,
    pageY: pageY
  };
}

var methods = {
  // Show the crop box manually
  crop: function crop() {
    var self = this;

    if (!self.ready || self.disabled) {
      return;
    }

    if (!self.cropped) {
      self.cropped = true;
      self.limitCropBox(true, true);

      if (self.options.modal) {
        self.$dragBox.addClass('cropper-modal');
      }

      self.$cropBox.removeClass('cropper-hidden');
    }

    self.setCropBoxData(self.initialCropBox);
  },


  // Reset the image and crop box to their initial states
  reset: function reset() {
    var self = this;

    if (!self.ready || self.disabled) {
      return;
    }

    self.image = $.extend({}, self.initialImage);
    self.canvas = $.extend({}, self.initialCanvas);
    self.cropBox = $.extend({}, self.initialCropBox);

    self.renderCanvas();

    if (self.cropped) {
      self.renderCropBox();
    }
  },


  // Clear the crop box
  clear: function clear() {
    var self = this;

    if (!self.cropped || self.disabled) {
      return;
    }

    $.extend(self.cropBox, {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    });

    self.cropped = false;
    self.renderCropBox();

    self.limitCanvas(true, true);

    // Render canvas after crop box rendered
    self.renderCanvas();

    self.$dragBox.removeClass('cropper-modal');
    self.$cropBox.addClass('cropper-hidden');
  },


  /**
   * Replace the image's src and rebuild the cropper
   *
   * @param {String} url
   * @param {Boolean} onlyColorChanged (optional)
   */
  replace: function replace(url, onlyColorChanged) {
    var self = this;

    if (!self.disabled && url) {
      if (self.isImg) {
        self.$element.attr('src', url);
      }

      if (onlyColorChanged) {
        self.url = url;
        self.$clone.attr('src', url);

        if (self.ready) {
          self.$preview.find('img').add(self.$clone2).attr('src', url);
        }
      } else {
        if (self.isImg) {
          self.replaced = true;
        }

        // Clear previous data
        self.options.data = null;
        self.load(url);
      }
    }
  },


  // Enable (unfreeze) the cropper
  enable: function enable() {
    var self = this;

    if (self.ready) {
      self.disabled = false;
      self.$cropper.removeClass('cropper-disabled');
    }
  },


  // Disable (freeze) the cropper
  disable: function disable() {
    var self = this;

    if (self.ready) {
      self.disabled = true;
      self.$cropper.addClass('cropper-disabled');
    }
  },


  // Destroy the cropper and remove the instance from the image
  destroy: function destroy() {
    var self = this;
    var $this = self.$element;

    if (self.loaded) {
      if (self.isImg && self.replaced) {
        $this.attr('src', self.originalUrl);
      }

      self.unbuild();
      $this.removeClass('cropper-hidden');
    } else if (self.isImg) {
      $this.off('load', self.start);
    } else if (self.$clone) {
      self.$clone.remove();
    }

    $this.removeData('cropper');
  },


  /**
   * Move the canvas with relative offsets
   *
   * @param {Number} offsetX
   * @param {Number} offsetY (optional)
   */
  move: function move(offsetX, offsetY) {
    var self = this;
    var canvas = self.canvas;

    self.moveTo(isUndefined(offsetX) ? offsetX : canvas.left + Number(offsetX), isUndefined(offsetY) ? offsetY : canvas.top + Number(offsetY));
  },


  /**
   * Move the canvas to an absolute point
   *
   * @param {Number} x
   * @param {Number} y (optional)
   */
  moveTo: function moveTo(x, y) {
    var self = this;
    var canvas = self.canvas;
    var changed = false;

    // If "y" is not present, its default value is "x"
    if (isUndefined(y)) {
      y = x;
    }

    x = Number(x);
    y = Number(y);

    if (self.ready && !self.disabled && self.options.movable) {
      if (isNumber(x)) {
        canvas.left = x;
        changed = true;
      }

      if (isNumber(y)) {
        canvas.top = y;
        changed = true;
      }

      if (changed) {
        self.renderCanvas(true);
      }
    }
  },


  /**
   * Zoom the canvas with a relative ratio
   *
   * @param {Number} ratio
   * @param {jQuery Event} _event (private)
   */
  zoom: function zoom(ratio, _event) {
    var self = this;
    var canvas = self.canvas;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    self.zoomTo(canvas.width * ratio / canvas.naturalWidth, _event);
  },


  /**
   * Zoom the canvas to an absolute ratio
   *
   * @param {Number} ratio
   * @param {jQuery Event} _event (private)
   */
  zoomTo: function zoomTo(ratio, _event) {
    var self = this;
    var options = self.options;
    var pointers = self.pointers;
    var canvas = self.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var naturalWidth = canvas.naturalWidth;
    var naturalHeight = canvas.naturalHeight;

    ratio = Number(ratio);

    if (ratio >= 0 && self.ready && !self.disabled && options.zoomable) {
      var newWidth = naturalWidth * ratio;
      var newHeight = naturalHeight * ratio;
      var originalEvent = void 0;

      if (_event) {
        originalEvent = _event.originalEvent;
      }

      if (self.trigger('zoom', {
        originalEvent: originalEvent,
        oldRatio: width / naturalWidth,
        ratio: newWidth / naturalWidth
      }).isDefaultPrevented()) {
        return;
      }

      if (originalEvent) {
        var offset = self.$cropper.offset();
        var center = pointers && objectKeys(pointers).length ? getPointersCenter(pointers) : {
          pageX: _event.pageX || originalEvent.pageX || 0,
          pageY: _event.pageY || originalEvent.pageY || 0
        };

        // Zoom from the triggering point of the event
        canvas.left -= (newWidth - width) * ((center.pageX - offset.left - canvas.left) / width);
        canvas.top -= (newHeight - height) * ((center.pageY - offset.top - canvas.top) / height);
      } else {
        // Zoom from the center of the canvas
        canvas.left -= (newWidth - width) / 2;
        canvas.top -= (newHeight - height) / 2;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      self.renderCanvas(true);
    }
  },


  /**
   * Rotate the canvas with a relative degree
   *
   * @param {Number} degree
   */
  rotate: function rotate(degree) {
    var self = this;

    self.rotateTo((self.image.rotate || 0) + Number(degree));
  },


  /**
   * Rotate the canvas to an absolute degree
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
   *
   * @param {Number} degree
   */
  rotateTo: function rotateTo(degree) {
    var self = this;

    degree = Number(degree);

    if (isNumber(degree) && self.ready && !self.disabled && self.options.rotatable) {
      self.image.rotate = degree % 360;
      self.rotated = true;
      self.renderCanvas(true);
    }
  },


  /**
   * Scale the image
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
   *
   * @param {Number} scaleX
   * @param {Number} scaleY (optional)
   */
  scale: function scale(scaleX, scaleY) {
    var self = this;
    var image = self.image;
    var changed = false;

    // If "scaleY" is not present, its default value is "scaleX"
    if (isUndefined(scaleY)) {
      scaleY = scaleX;
    }

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (self.ready && !self.disabled && self.options.scalable) {
      if (isNumber(scaleX)) {
        image.scaleX = scaleX;
        changed = true;
      }

      if (isNumber(scaleY)) {
        image.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        self.renderImage(true);
      }
    }
  },


  /**
   * Scale the abscissa of the image
   *
   * @param {Number} scaleX
   */
  scaleX: function scaleX(_scaleX) {
    var self = this;
    var scaleY = self.image.scaleY;

    self.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
  },


  /**
   * Scale the ordinate of the image
   *
   * @param {Number} scaleY
   */
  scaleY: function scaleY(_scaleY) {
    var self = this;
    var scaleX = self.image.scaleX;

    self.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
  },


  /**
   * Get the cropped area position and size data (base on the original image)
   *
   * @param {Boolean} isRounded (optional)
   * @return {Object} data
   */
  getData: function getData(isRounded) {
    var self = this;
    var options = self.options;
    var image = self.image;
    var canvas = self.canvas;
    var cropBox = self.cropBox;
    var ratio = void 0;
    var data = void 0;

    if (self.ready && self.cropped) {
      data = {
        x: cropBox.left - canvas.left,
        y: cropBox.top - canvas.top,
        width: cropBox.width,
        height: cropBox.height
      };

      ratio = image.width / image.naturalWidth;

      $.each(data, function (i, n) {
        n /= ratio;
        data[i] = isRounded ? Math.round(n) : n;
      });
    } else {
      data = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    if (options.rotatable) {
      data.rotate = image.rotate || 0;
    }

    if (options.scalable) {
      data.scaleX = image.scaleX || 1;
      data.scaleY = image.scaleY || 1;
    }

    return data;
  },


  /**
   * Set the cropped area position and size with new data
   *
   * @param {Object} data
   */
  setData: function setData(data) {
    var self = this;
    var options = self.options;
    var image = self.image;
    var canvas = self.canvas;
    var cropBoxData = {};
    var rotated = void 0;
    var isScaled = void 0;
    var ratio = void 0;

    if ($.isFunction(data)) {
      data = data.call(self.element);
    }

    if (self.ready && !self.disabled && $.isPlainObject(data)) {
      if (options.rotatable) {
        if (isNumber(data.rotate) && data.rotate !== image.rotate) {
          image.rotate = data.rotate;
          self.rotated = rotated = true;
        }
      }

      if (options.scalable) {
        if (isNumber(data.scaleX) && data.scaleX !== image.scaleX) {
          image.scaleX = data.scaleX;
          isScaled = true;
        }

        if (isNumber(data.scaleY) && data.scaleY !== image.scaleY) {
          image.scaleY = data.scaleY;
          isScaled = true;
        }
      }

      if (rotated) {
        self.renderCanvas();
      } else if (isScaled) {
        self.renderImage();
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

      self.setCropBoxData(cropBoxData);
    }
  },


  /**
   * Get the container size data
   *
   * @return {Object} data
   */
  getContainerData: function getContainerData() {
    return this.ready ? this.container : {};
  },


  /**
   * Get the image position and size data
   *
   * @return {Object} data
   */
  getImageData: function getImageData() {
    return this.loaded ? this.image : {};
  },


  /**
   * Get the canvas position and size data
   *
   * @return {Object} data
   */
  getCanvasData: function getCanvasData() {
    var self = this;
    var canvas = self.canvas;
    var data = {};

    if (self.ready) {
      $.each(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (i, n) {
        data[n] = canvas[n];
      });
    }

    return data;
  },


  /**
   * Set the canvas position and size with new data
   *
   * @param {Object} data
   */
  setCanvasData: function setCanvasData(data) {
    var self = this;
    var canvas = self.canvas;
    var aspectRatio = canvas.aspectRatio;

    if ($.isFunction(data)) {
      data = data.call(self.$element);
    }

    if (self.ready && !self.disabled && $.isPlainObject(data)) {
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

      self.renderCanvas(true);
    }
  },


  /**
   * Get the crop box position and size data
   *
   * @return {Object} data
   */
  getCropBoxData: function getCropBoxData() {
    var self = this;
    var cropBox = self.cropBox;

    return self.ready && self.cropped ? {
      left: cropBox.left,
      top: cropBox.top,
      width: cropBox.width,
      height: cropBox.height
    } : {};
  },


  /**
   * Set the crop box position and size with new data
   *
   * @param {Object} data
   */
  setCropBoxData: function setCropBoxData(data) {
    var self = this;
    var cropBox = self.cropBox;
    var aspectRatio = self.options.aspectRatio;
    var widthChanged = void 0;
    var heightChanged = void 0;

    if ($.isFunction(data)) {
      data = data.call(self.$element);
    }

    if (self.ready && self.cropped && !self.disabled && $.isPlainObject(data)) {
      if (isNumber(data.left)) {
        cropBox.left = data.left;
      }

      if (isNumber(data.top)) {
        cropBox.top = data.top;
      }

      if (isNumber(data.width) && data.width !== cropBox.width) {
        widthChanged = true;
        cropBox.width = data.width;
      }

      if (isNumber(data.height) && data.height !== cropBox.height) {
        heightChanged = true;
        cropBox.height = data.height;
      }

      if (aspectRatio) {
        if (widthChanged) {
          cropBox.height = cropBox.width / aspectRatio;
        } else if (heightChanged) {
          cropBox.width = cropBox.height * aspectRatio;
        }
      }

      self.renderCropBox();
    }
  },


  /**
   * Get a canvas drawn the cropped image
   *
   * @param {Object} options (optional)
   * @return {HTMLCanvasElement} canvas
   */
  getCroppedCanvas: function getCroppedCanvas(options) {
    var self = this;

    if (!self.ready || !window.HTMLCanvasElement) {
      return null;
    }

    if (!self.cropped) {
      return getSourceCanvas(self.$clone[0], self.image);
    }

    if (!$.isPlainObject(options)) {
      options = {};
    }

    var data = self.getData();
    var originalWidth = data.width;
    var originalHeight = data.height;
    var aspectRatio = originalWidth / originalHeight;
    var scaledWidth = void 0;
    var scaledHeight = void 0;
    var scaledRatio = void 0;

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

    // The canvas element will use `Math.Math.floor` on a float number, so Math.floor first
    var canvasWidth = Math.floor(scaledWidth || originalWidth);
    var canvasHeight = Math.floor(scaledHeight || originalHeight);

    var canvas = $('<canvas>')[0];
    var context = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (options.fillColor) {
      context.fillStyle = options.fillColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
    var parameters = function () {
      var source = getSourceCanvas(self.$clone[0], self.image);
      var sourceWidth = source.width;
      var sourceHeight = source.height;
      var canvasData = self.canvas;
      var params = [source];

      // Source canvas
      var srcX = data.x + canvasData.naturalWidth * (Math.abs(data.scaleX || 1) - 1) / 2;
      var srcY = data.y + canvasData.naturalHeight * (Math.abs(data.scaleY || 1) - 1) / 2;
      var srcWidth = void 0;
      var srcHeight = void 0;

      // Destination canvas
      var dstX = void 0;
      var dstY = void 0;
      var dstWidth = void 0;
      var dstHeight = void 0;

      if (srcX <= -originalWidth || srcX > sourceWidth) {
        srcX = srcWidth = dstX = dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        srcWidth = dstWidth = Math.min(sourceWidth, originalWidth + srcX);
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        srcWidth = dstWidth = Math.min(originalWidth, sourceWidth - srcX);
      }

      if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
        srcY = srcHeight = dstY = dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        srcHeight = dstHeight = Math.min(sourceHeight, originalHeight + srcY);
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        srcHeight = dstHeight = Math.min(originalHeight, sourceHeight - srcY);
      }

      // All the numerical parameters should be integer for `drawImage` (#476)
      params.push(Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight));

      // Scale destination sizes
      if (scaledRatio) {
        dstX *= scaledRatio;
        dstY *= scaledRatio;
        dstWidth *= scaledRatio;
        dstHeight *= scaledRatio;
      }

      // Avoid "IndexSizeError" in IE and Firefox
      if (dstWidth > 0 && dstHeight > 0) {
        params.push(Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
      }

      return params;
    }();

    context.drawImage.apply(context, toConsumableArray(parameters));

    return canvas;
  },


  /**
   * Change the aspect ratio of the crop box
   *
   * @param {Number} aspectRatio
   */
  setAspectRatio: function setAspectRatio(aspectRatio) {
    var self = this;
    var options = self.options;

    if (!self.disabled && !isUndefined(aspectRatio)) {
      // 0 -> NaN
      options.aspectRatio = Math.max(0, aspectRatio) || NaN;

      if (self.ready) {
        self.initCropBox();

        if (self.cropped) {
          self.renderCropBox();
        }
      }
    }
  },


  /**
   * Change the drag mode
   *
   * @param {String} mode (optional)
   */
  setDragMode: function setDragMode(mode) {
    var self = this;
    var options = self.options;
    var croppable = void 0;
    var movable = void 0;

    if (self.loaded && !self.disabled) {
      croppable = mode === 'crop';
      movable = options.movable && mode === 'move';
      mode = croppable || movable ? mode : 'none';

      self.$dragBox.data('action', mode).toggleClass('cropper-crop', croppable).toggleClass('cropper-move', movable);

      if (!options.cropBoxMovable) {
        // Sync drag mode to crop box when it is not movable(#300)
        self.$face.data('action', mode).toggleClass('cropper-crop', croppable).toggleClass('cropper-move', movable);
      }
    }
  }
};

var CLASS_HIDDEN = 'cropper-hidden';
var REGEXP_DATA_URL = /^data:/;
var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;

var Cropper = function () {
  function Cropper(element, options) {
    classCallCheck(this, Cropper);

    var self = this;

    self.$element = $(element);
    self.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
    self.loaded = false;
    self.ready = false;
    self.completed = false;
    self.rotated = false;
    self.cropped = false;
    self.disabled = false;
    self.replaced = false;
    self.limited = false;
    self.wheeling = false;
    self.isImg = false;
    self.originalUrl = '';
    self.canvas = null;
    self.cropBox = null;
    self.pointers = {};
    self.init();
  }

  createClass(Cropper, [{
    key: 'init',
    value: function init() {
      var self = this;
      var $this = self.$element;
      var url = void 0;

      if ($this.is('img')) {
        self.isImg = true;

        // Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
        self.originalUrl = url = $this.attr('src');

        // Stop when it's a blank image
        if (!url) {
          return;
        }

        // Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
        url = $this.prop('src');
      } else if ($this.is('canvas') && window.HTMLCanvasElement) {
        url = $this[0].toDataURL();
      }

      self.load(url);
    }

    // A shortcut for triggering custom events

  }, {
    key: 'trigger',
    value: function trigger(type, data) {
      var e = $.Event(type, data);

      this.$element.trigger(e);

      return e;
    }
  }, {
    key: 'load',
    value: function load(url) {
      var self = this;
      var options = self.options;
      var $this = self.$element;

      if (!url) {
        return;
      }

      self.url = url;
      self.image = {};

      if (!options.checkOrientation || !ArrayBuffer) {
        self.clone();
        return;
      }

      // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
      if (REGEXP_DATA_URL.test(url)) {
        if (REGEXP_DATA_URL_JPEG.test(url)) {
          self.read(dataURLToArrayBuffer(url));
        } else {
          self.clone();
        }
        return;
      }

      var xhr = new XMLHttpRequest();

      xhr.onerror = xhr.onabort = $.proxy(function () {
        self.clone();
      }, this);

      xhr.onload = function load() {
        self.read(this.response);
      };

      if (options.checkCrossOrigin && isCrossOriginURL(url) && $this.prop('crossOrigin')) {
        url = addTimestamp(url);
      }

      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.withCredentials = $this.prop('crossOrigin') === 'use-credentials';
      xhr.send();
    }
  }, {
    key: 'read',
    value: function read(arrayBuffer) {
      var self = this;
      var options = self.options;
      var orientation = getOrientation(arrayBuffer);
      var image = self.image;
      var rotate = 0;
      var scaleX = 1;
      var scaleY = 1;

      if (orientation > 1) {
        self.url = arrayBufferToDataURL(arrayBuffer);

        switch (orientation) {

          // flip horizontal
          case 2:
            scaleX = -1;
            break;

          // rotate left 180°
          case 3:
            rotate = -180;
            break;

          // flip vertical
          case 4:
            scaleY = -1;
            break;

          // flip vertical + rotate right 90°
          case 5:
            rotate = 90;
            scaleY = -1;
            break;

          // rotate right 90°
          case 6:
            rotate = 90;
            break;

          // flip horizontal + rotate right 90°
          case 7:
            rotate = 90;
            scaleX = -1;
            break;

          // rotate left 90°
          case 8:
            rotate = -90;
            break;
        }
      }

      if (options.rotatable) {
        image.rotate = rotate;
      }

      if (options.scalable) {
        image.scaleX = scaleX;
        image.scaleY = scaleY;
      }

      self.clone();
    }
  }, {
    key: 'clone',
    value: function clone() {
      var self = this;
      var options = self.options;
      var $this = self.$element;
      var url = self.url;
      var crossOrigin = '';
      var crossOriginUrl = void 0;

      if (options.checkCrossOrigin && isCrossOriginURL(url)) {
        crossOrigin = $this.prop('crossOrigin');

        if (crossOrigin) {
          crossOriginUrl = url;
        } else {
          crossOrigin = 'anonymous';

          // Bust cache (#148) when there is not a "crossOrigin" property
          crossOriginUrl = addTimestamp(url);
        }
      }

      self.crossOrigin = crossOrigin;
      self.crossOriginUrl = crossOriginUrl;

      var $clone = $('<img ' + getCrossOrigin(crossOrigin) + ' src="' + (crossOriginUrl || url) + '">');

      self.$clone = $clone;

      if (self.isImg) {
        if ($this[0].complete) {
          self.start();
        } else {
          $this.one('load', $.proxy(self.start, this));
        }
      } else {
        $clone.one('load', $.proxy(self.start, this)).one('error', $.proxy(self.stop, this)).addClass('cropper-hide').insertAfter($this);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var self = this;
      var $clone = self.$clone;
      var $image = self.$element;

      if (!self.isImg) {
        $clone.off('error', self.stop);
        $image = $clone;
      }

      getImageSize($image[0], function (naturalWidth, naturalHeight) {
        $.extend(self.image, {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: naturalWidth / naturalHeight
        });

        self.loaded = true;
        self.build();
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var self = this;

      self.$clone.remove();
      self.$clone = null;
    }
  }, {
    key: 'build',
    value: function build() {
      var self = this;
      var options = self.options;
      var $this = self.$element;
      var $clone = self.$clone;
      var $cropper = void 0;
      var $cropBox = void 0;
      var $face = void 0;

      if (!self.loaded) {
        return;
      }

      // Unbuild first when replace
      if (self.ready) {
        self.unbuild();
      }

      // Create cropper elements
      self.$container = $this.parent();
      self.$cropper = $cropper = $(TEMPLATE);
      self.$canvas = $cropper.find('.cropper-canvas').append($clone);
      self.$dragBox = $cropper.find('.cropper-drag-box');
      self.$cropBox = $cropBox = $cropper.find('.cropper-crop-box');
      self.$viewBox = $cropper.find('.cropper-view-box');
      self.$face = $face = $cropBox.find('.cropper-face');

      // Hide the original image
      $this.addClass(CLASS_HIDDEN).after($cropper);

      // Show the clone image if is hidden
      if (!self.isImg) {
        $clone.removeClass('cropper-hide');
      }

      self.initPreview();
      self.bind();

      options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
      options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

      self.cropped = options.autoCrop;

      if (options.autoCrop) {
        if (options.modal) {
          self.$dragBox.addClass('cropper-modal');
        }
      } else {
        $cropBox.addClass(CLASS_HIDDEN);
      }

      if (!options.guides) {
        $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
      }

      if (!options.center) {
        $cropBox.find('.cropper-center').addClass(CLASS_HIDDEN);
      }

      if (options.cropBoxMovable) {
        $face.addClass('cropper-move').data('action', 'all');
      }

      if (!options.highlight) {
        $face.addClass('cropper-invisible');
      }

      if (options.background) {
        $cropper.addClass('cropper-bg');
      }

      if (!options.cropBoxResizable) {
        $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
      }

      self.setDragMode(options.dragMode);
      self.render();
      self.ready = true;
      self.setData(options.data);

      // Trigger the ready event asynchronously to keep `data('cropper')` is defined
      self.completing = setTimeout(function () {
        if ($.isFunction(options.ready)) {
          $this.one('ready', options.ready);
        }

        self.trigger('ready');
        self.trigger('crop', self.getData());
        self.completed = true;
      }, 0);
    }
  }, {
    key: 'unbuild',
    value: function unbuild() {
      var self = this;

      if (!self.ready) {
        return;
      }

      if (!self.completed) {
        clearTimeout(self.completing);
      }

      self.ready = false;
      self.completed = false;
      self.initialImage = null;

      // Clear `initialCanvas` is necessary when replace
      self.initialCanvas = null;
      self.initialCropBox = null;
      self.container = null;
      self.canvas = null;

      // Clear `cropBox` is necessary when replace
      self.cropBox = null;
      self.unbind();

      self.resetPreview();
      self.$preview = null;

      self.$viewBox = null;
      self.$cropBox = null;
      self.$dragBox = null;
      self.$canvas = null;
      self.$container = null;

      self.$cropper.remove();
      self.$cropper = null;
    }
  }], [{
    key: 'setDefaults',
    value: function setDefaults(options) {
      $.extend(DEFAULTS, $.isPlainObject(options) && options);
    }
  }]);
  return Cropper;
}();

$.extend(Cropper.prototype, render$1);
$.extend(Cropper.prototype, preview$1);
$.extend(Cropper.prototype, events);
$.extend(Cropper.prototype, handlers);
$.extend(Cropper.prototype, change$1);
$.extend(Cropper.prototype, methods);

var NAMESPACE = 'cropper';
var OtherCropper = $.fn.cropper;

$.fn.cropper = function jQueryCropper(option) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var result = void 0;

  this.each(function (i, element) {
    var $this = $(element);
    var data = $this.data(NAMESPACE);

    if (!data) {
      if (/destroy/.test(option)) {
        return;
      }

      var options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
      $this.data(NAMESPACE, data = new Cropper(element, options));
    }

    if (typeof option === 'string') {
      var fn = data[option];

      if ($.isFunction(fn)) {
        result = fn.apply(data, args);
      }
    }
  });

  return typeof result !== 'undefined' ? result : this;
};

$.fn.cropper.Constructor = Cropper;
$.fn.cropper.setDefaults = Cropper.setDefaults;

// No conflict
$.fn.cropper.noConflict = function noConflict() {
  $.fn.cropper = OtherCropper;
  return this;
};

})));

},{"jquery":"jquery"}],"/Users/hepeng/learning/js/angular-demo/node_modules/ngCropper/dist/ngCropper.all.js":[function(require,module,exports){
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
$templateCache.put('cropper.html','<div id="image">\n  <img width=400 src="https://fengyuanchen.github.io/cropper/images/picture.jpg" alt="">\n</div>');
$templateCache.put('edit.html','<section>\n  name\uFF1A<a href="#" editable-text="vm.name" e-form="textBtnForm" onaftersave="vm.checkName($data)">{{ vm.name || \'empty\' }}</a>\n  <button class="btn btn-default" ng-click="textBtnForm.$show()" ng-hide="textBtnForm.$visible">\n    edit\n  </button>\n  <br>\n  date:\n  <a href="#" \n     editable-bsdate="vm.dob"\n     e-is-open="vm.opened.$data"\n     e-ng-click="vm.open($event,\'$data\')"\n     e-datepicker-popup="dd-MMMM-yyyy"\n   >\n    {{ (vm.dob | date:"dd/MM/yyyy") || \'empty\' }}\n  </a>\n\n  <form data-editable-form name="uiSelectForm">\n    <div editable-ui-select="user.state" \n         data-e-form="uiSelectForm" \n         data-e-name="state" \n         name="state" \n         theme="bootstrap" \n         data-e-ng-model="user.state" \n         data-e-style="min-width:300px;"\n    >\n      {{user.state}}\n      <editable-ui-select-match placeholder="State">\n          {{$select.selected}}\n      </editable-ui-select-match>\n      <editable-ui-select-choices repeat="state in states | filter: $select.search track by $index">\n        {{state}}\n      </editable-ui-select-choices>\n    </div>\n    <br/>\n    <div class="buttons">\n      <!-- button to show form -->\n      <button type="button" class="btn btn-default" ng-click="uiSelectForm.$show()" ng-show="!uiSelectForm.$visible">\n        Edit\n      </button>\n      <!-- buttons to submit / cancel form -->\n      <span ng-show="uiSelectForm.$visible">\n        <br/>\n        <button type="submit" class="btn btn-primary" ng-disabled="uiSelectForm.$waiting">\n          Save\n        </button>\n        <button type="button" class="btn btn-default" ng-disabled="uiSelectForm.$waiting" ng-click="uiSelectForm.$cancel()">\n          Cancel\n        </button>\n      </span>\n    </div>  \n  </form>\n\n</section>');
$templateCache.put('home.html','<section>\n  <div class="text-center figure">\n    <from class="form-inline">\n      <input type="" class="form-control" ng-model="vm.keyword">\n      <button class="btn btn-success {{vm.style.title}}" ng-click="vm.searchBook();">\u641C\u7D22\u56FE\u4E66</button>\n    </from>\n  </div>\n  <div>\n    <div class="row" ng-repeat="item in vm.list">\n      <div class="col-xs-2 text-center">\n        <img ng-src="{{item.image}}">\n      </div>\n      <div class="col-xs-10">\n        <h2 class="_test_12z2f_1">{{item.title}}</h2>\n        <h3>{{item.author}}</h3>\n        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.summary}}</p>\n      </div>\n      <hr>\n    </div>\n  </div>\n</section>');
$templateCache.put('index.html','<!DOCTYPE html>\n<html lang="zh-CN">\n\n<head>\n  <meta charset="UTF-8">\n  <title>GetUserMedia\u5B9E\u4F8B</title>\n</head>\n\n<body>\n  <video id="video" autoplay controls="">\n    <ideo>\n</body>\n<script type="text/javascript">\n// var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);\nnavigator.getUserMedia({\n  video: true,\n  audio: true\n}, function(localMediaStream) {\n  var video = document.getElementById(\'video\');\n  video.src = window.URL.createObjectURL(localMediaStream);\n  video.onloadedmetadata = function(e) {\n    console.log("Label: " + localMediaStream.label);\n    console.log("AudioTracks", localMediaStream.getAudioTracks());\n    console.log("VideoTracks", localMediaStream.getVideoTracks());\n  };\n}, function(e) {\n  console.log(\'Reeeejected!\', e);\n});\n</script>\n<html>\n');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);
},{}]},{},["/Users/hepeng/learning/js/angular-demo/app/app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL2NvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2NvbnRhY3QvY29udGFjdC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9jcm9wcGVyL2Nyb3BwZXIuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvZWRpdGFibGUuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvaG9tZS9ob21lLmNzcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9ob21lL2hvbWUuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC5qcyIsImFwcC9jb25maWcuanMiLCJub2RlX21vZHVsZXMvY3JvcHBlci9kaXN0L2Nyb3BwZXIuanMiLCJub2RlX21vZHVsZXMvbmdDcm9wcGVyL2Rpc3QvbmdDcm9wcGVyLmFsbC5qcyIsInB1YmxpYy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoa0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxdUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG53aW5kb3cuQ3JvcHBlciA9IHJlcXVpcmUoJ2Nyb3BwZXInKTtcbnJlcXVpcmUoJ2FuZ3VsYXItdWktYm9vdHN0cmFwJyk7XG5yZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpO1xucmVxdWlyZSgnYW5ndWxhci1ibG9jay11aScpO1xucmVxdWlyZSgnYW5ndWxhci14ZWRpdGFibGUnKTtcbnJlcXVpcmUoJ3VpLXNlbGVjdCcpO1xucmVxdWlyZSgnLi4vcHVibGljL3RlbXBsYXRlcycpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uL2NvbW1vbi5tb2R1bGUuanMnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ2FwcC50ZW1wbGF0ZXMnLCd1aS5ib290c3RyYXAnLCAndWkucm91dGVyJywgJ3VpLnNlbGVjdCcsICdibG9ja1VJJywneGVkaXRhYmxlJywgY29tbW9uLm5hbWVdKVxuXG5cblxuLmNvbmZpZyhjb25maWcpXG4ucnVuKGZ1bmN0aW9uKGVkaXRhYmxlT3B0aW9ucyl7XG4gIGVkaXRhYmxlT3B0aW9ucy50aGVtZSA9ICdiczMnO1xuICBlZGl0YWJsZU9wdGlvbnMuYmx1ckVsZW0gPSAnaWdub3JlJztcbn0pIiwidmFyIGFwcExheW91dCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmpzJyk7XG52YXIgY29udGFjdCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb250YWN0L2NvbnRhY3QuanMnKTtcbnZhciBob21lID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2hvbWUvaG9tZS5qcycpO1xudmFyIGVkaXQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZWRpdGFibGUuanMnKTtcbnZhciBjcm9wcGVyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nyb3BwZXIvY3JvcHBlci5qcycpO1xucmVxdWlyZSgnbmdDcm9wcGVyL2Rpc3QvbmdDcm9wcGVyLmFsbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuY29tbW9uJywgWyduZ0Nyb3BwZXInXSlcblxuXG4uY29tcG9uZW50KCdhcHBMYXlvdXQnLCBhcHBMYXlvdXQpXG4uY29tcG9uZW50KCdjb250YWN0JywgY29udGFjdClcbi5jb21wb25lbnQoJ2xheUhvbWUnLCBob21lKVxuLmNvbXBvbmVudCgnZWRpdCcsIGVkaXQpXG4uY29tcG9uZW50KCdjcm9wcGVyJywgY3JvcHBlcikiLCJmdW5jdGlvbiBjb250YWN0Q3RybCgkc2NvcGUsICR0aW1lb3V0LCBDcm9wcGVyKSB7XG4gIHZhciBmaWxlLCBkYXRhO1xuXG4gIC8qKlxuICAgKiBNZXRob2QgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgZmlsZSBpbnB1dCdzIHZhbHVlIGNoYW5nZXMuXG4gICAqIEJlY2F1c2Ugb2YgQW5ndWxhciBoYXMgbm90IG5nLWNoYW5nZSBmb3IgZmlsZSBpbnB1dHMgYSBoYWNrIGlzIG5lZWRlZCAtXG4gICAqIGNhbGwgYGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5zY29wZSgpLm9uRmlsZSh0aGlzLmZpbGVzWzBdKWBcbiAgICogd2hlbiBpbnB1dCdzIGV2ZW50IGlzIGZpcmVkLlxuICAgKi9cbiAgJHNjb3BlLm9uRmlsZSA9IGZ1bmN0aW9uKGJsb2IpIHtcbiAgICBDcm9wcGVyLmVuY29kZSgoZmlsZSA9IGJsb2IpKS50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICRzY29wZS5kYXRhVXJsID0gZGF0YVVybDtcbiAgICAgICR0aW1lb3V0KHNob3dDcm9wcGVyKTsgIC8vIHdhaXQgZm9yICRkaWdlc3QgdG8gc2V0IGltYWdlJ3Mgc3JjXG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyb3BwZXJzIGNvbnRhaW5lciBvYmplY3Qgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gY29udHJvbGxlcidzIHNjb3BlXG4gICAqIGZvciB1cGRhdGVzIGJ5IGRpcmVjdGl2ZSB2aWEgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cbiAgICogUGFzcyBhIGZ1bGwgcHJveHkgbmFtZSB0byB0aGUgYG5nLWNyb3BwZXItcHJveHlgIGRpcmVjdGl2ZSBhdHRyaWJ1dGUgdG9cbiAgICogZW5hYmxlIHByb3hpbmcuXG4gICAqL1xuICAkc2NvcGUuY3JvcHBlciA9IHt9O1xuICAkc2NvcGUuY3JvcHBlclByb3h5ID0gJ2Nyb3BwZXIuZmlyc3QnO1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoZXJlIGlzIGEgY3JvcHBlZCBpbWFnZSB0byBzaG93IGVuY29kZSBpdCB0byBiYXNlNjQgc3RyaW5nIGFuZFxuICAgKiB1c2UgYXMgYSBzb3VyY2UgZm9yIGFuIGltYWdlIGVsZW1lbnQuXG4gICAqL1xuICAkc2NvcGUucHJldmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghZmlsZSB8fCAhZGF0YSkgcmV0dXJuO1xuICAgIENyb3BwZXIuY3JvcChmaWxlLCBkYXRhKS50aGVuKENyb3BwZXIuZW5jb2RlKS50aGVuKGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAgICgkc2NvcGUucHJldmlldyB8fCAoJHNjb3BlLnByZXZpZXcgPSB7fSkpLmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVc2UgY3JvcHBlciBmdW5jdGlvbiBwcm94eSB0byBjYWxsIG1ldGhvZHMgb2YgdGhlIHBsdWdpbi5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vY3JvcHBlciNtZXRob2RzXG4gICAqL1xuICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbihkZWdyZWVzKSB7XG4gICAgaWYgKCEkc2NvcGUuY3JvcHBlci5maXJzdCkgcmV0dXJuO1xuICAgICRzY29wZS5jcm9wcGVyLmZpcnN0KCdjbGVhcicpO1xuICB9O1xuXG4gICRzY29wZS5zY2FsZSA9IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgQ3JvcHBlci5jcm9wKGZpbGUsIGRhdGEpXG4gICAgICAudGhlbihmdW5jdGlvbihibG9iKSB7XG4gICAgICAgIHJldHVybiBDcm9wcGVyLnNjYWxlKGJsb2IsIHt3aWR0aDogd2lkdGh9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbihDcm9wcGVyLmVuY29kZSkudGhlbihmdW5jdGlvbihkYXRhVXJsKSB7XG4gICAgICAgICgkc2NvcGUucHJldmlldyB8fCAoJHNjb3BlLnByZXZpZXcgPSB7fSkpLmRhdGFVcmwgPSBkYXRhVXJsO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IGlzIHVzZWQgdG8gcGFzcyBvcHRpb25zIHRvIGluaXRhbGl6ZSBhIGNyb3BwZXIuXG4gICAqIE1vcmUgb24gb3B0aW9ucyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vY3JvcHBlciNvcHRpb25zXG4gICAqL1xuICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICBtYXhpbWl6ZTogdHJ1ZSxcbiAgICBhc3BlY3RSYXRpbzogMiAvIDEsXG4gICAgY3JvcDogZnVuY3Rpb24oZGF0YU5ldykge1xuICAgICAgZGF0YSA9IGRhdGFOZXc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93aW5nIChpbml0aWFsaXppbmcpIGFuZCBoaWRpbmcgKGRlc3Ryb3lpbmcpIG9mIGEgY3JvcHBlciBhcmUgc3RhcnRlZCBieVxuICAgKiBldmVudHMuIFRoZSBzY29wZSBvZiB0aGUgYG5nLWNyb3BwZXJgIGRpcmVjdGl2ZSBpcyBkZXJpdmVkIGZyb20gdGhlIHNjb3BlIG9mXG4gICAqIHRoZSBjb250cm9sbGVyLiBXaGVuIGluaXRpYWxpemluZyB0aGUgYG5nLWNyb3BwZXJgIGRpcmVjdGl2ZSBhZGRzIHR3byBoYW5kbGVyc1xuICAgKiBsaXN0ZW5pbmcgdG8gZXZlbnRzIHBhc3NlZCBieSBgbmctY3JvcHBlci1zaG93YCAmIGBuZy1jcm9wcGVyLWhpZGVgIGF0dHJpYnV0ZXMuXG4gICAqIFRvIHNob3cgb3IgaGlkZSBhIGNyb3BwZXIgYCRicm9hZGNhc3RgIGEgcHJvcGVyIGV2ZW50LlxuICAgKi9cbiAgJHNjb3BlLnNob3dFdmVudCA9ICdzaG93JztcbiAgJHNjb3BlLmhpZGVFdmVudCA9ICdoaWRlJztcblxuICBmdW5jdGlvbiBzaG93Q3JvcHBlcigpIHsgJHNjb3BlLiRicm9hZGNhc3QoJHNjb3BlLnNob3dFdmVudCk7IH1cbiAgZnVuY3Rpb24gaGlkZUNyb3BwZXIoKSB7ICRzY29wZS4kYnJvYWRjYXN0KCRzY29wZS5oaWRlRXZlbnQpOyB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRlbXBsYXRlVXJsOiAndHBsL2NvbnRhY3QuaHRtbCcsXG4gIGNvbnRyb2xsZXI6IGNvbnRhY3RDdHJsLFxuICBjb250cm9sbGVyQXM6J3ZtJ1xufSIsImZ1bmN0aW9uIGNyb3BwZXJDdHJsKCRzY29wZSwkaHR0cCkge1xuICAkKCcjaW1hZ2U+aW1nJykuY3JvcHBlcih7XG4gICAgYXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICBjcm9wOiBmdW5jdGlvbihlKSB7XG4gICAgICAvLyBPdXRwdXQgdGhlIHJlc3VsdCBkYXRhIGZvciBjcm9wcGluZyBpbWFnZS5cbiAgICAgIGNvbnNvbGUubG9nKGUueCk7XG4gICAgICBjb25zb2xlLmxvZyhlLnkpO1xuICAgICAgY29uc29sZS5sb2coZS53aWR0aCk7XG4gICAgICBjb25zb2xlLmxvZyhlLmhlaWdodCk7XG4gICAgICBjb25zb2xlLmxvZyhlLnJvdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyhlLnNjYWxlWCk7XG4gICAgICBjb25zb2xlLmxvZyhlLnNjYWxlWSk7XG4gICAgfVxuICB9KTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICdjcm9wcGVyLmh0bWwnLFxuICBjb250cm9sbGVyOiBjcm9wcGVyQ3RybCxcbiAgY29udHJvbGxlckFzOid2bSdcbn0iLCJmdW5jdGlvbiBlaWR0Q3RybCgkc2NvcGUsJGh0dHApIHtcbiAgdmFyIFRoaXMgPSB0aGlzO1xuICB0aGlzLm5hbWUgPSAnaGVoZSc7XG4gIHRoaXMuZG9iID0gbmV3IERhdGUoKTtcbiAgdGhpcy5vcGVuZWQgPSB7fTtcbiAgdGhpcy5vcGVuID0gZnVuY3Rpb24oZXZlbnQsIGVsZW1lbnRPcGVuZWQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFRoaXMub3BlbmVkW2VsZW1lbnRPcGVuZWRdID0gIVRoaXMub3BlbmVkW2VsZW1lbnRPcGVuZWRdO1xuICB9XG4gIHRoaXMuY2hlY2tOYW1lID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coZGF0YSlcbiAgICBpZihkYXRhIT09J2hhaGEnKXtcbiAgICAgIHJldHVybiAnd3JvbmcnO1xuICAgIH1cbiAgfVxuICAkc2NvcGUudXNlciA9IHtcbiAgICBzdGF0ZTogJ0FyaXpvbmEnXG4gIH07XG5cbiAgJHNjb3BlLnN0YXRlcyA9IFsnQWxhYmFtYScsICdBbGFza2EnLCAnQXJpem9uYScsICdBcmthbnNhcycsICdDYWxpZm9ybmlhJywgJ0NvbG9yYWRvJywgJ0Nvbm5lY3RpY3V0JywgJ0RlbGF3YXJlJywgJ0Zsb3JpZGEnLCAnR2VvcmdpYScsICdIYXdhaWknLCAnSWRhaG8nLCAnSWxsaW5vaXMnLCAnSW5kaWFuYScsICdJb3dhJywgJ0thbnNhcycsICdLZW50dWNreScsICdMb3Vpc2lhbmEnLCAnTWFpbmUnLCAnTWFyeWxhbmQnLCAnTWFzc2FjaHVzZXR0cycsICdNaWNoaWdhbicsICdNaW5uZXNvdGEnLCAnTWlzc2lzc2lwcGknLCAnTWlzc291cmknLCAnTW9udGFuYScsICdOZWJyYXNrYScsICdOZXZhZGEnLCAnTmV3IEhhbXBzaGlyZScsICdOZXcgSmVyc2V5JywgJ05ldyBNZXhpY28nLCAnTmV3IFlvcmsnLCAnTm9ydGggRGFrb3RhJywgJ05vcnRoIENhcm9saW5hJywgJ09oaW8nLCAnT2tsYWhvbWEnLCAnT3JlZ29uJywgJ1Blbm5zeWx2YW5pYScsICdSaG9kZSBJc2xhbmQnLCAnU291dGggQ2Fyb2xpbmEnLCAnU291dGggRGFrb3RhJywgJ1Rlbm5lc3NlZScsICdUZXhhcycsICdVdGFoJywgJ1Zlcm1vbnQnLCAnVmlyZ2luaWEnLCAnV2FzaGluZ3RvbicsICdXZXN0IFZpcmdpbmlhJywgJ1dpc2NvbnNpbicsICdXeW9taW5nJ107XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRlbXBsYXRlVXJsOiAnZWRpdC5odG1sJyxcbiAgY29udHJvbGxlcjogZWlkdEN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XCJ0aXRsZVwiOlwiX3RpdGxlXzF0b3Z6XzFcIn0iLCJ2YXIgc3R5bGUgPSByZXF1aXJlKCcuL2hvbWUuY3NzJyk7XG5cbmZ1bmN0aW9uIGhvbWVDdHJsKCRzY29wZSwkaHR0cCkge1xuICB2YXIgVGhpcyA9IHRoaXM7XG4gIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgJGh0dHAuZ2V0KCd2Mi9ib29rLzY1NDg2ODMnKS5zdWNjZXNzKGZ1bmN0aW9uKHJlcyl7XG4gICAgLy8gY29uc29sZS5sb2cocmVzKVxuICB9KVxuXG4gIHRoaXMuc2VhcmNoQm9vayA9IGZ1bmN0aW9uKCkge1xuICAgICRodHRwLmdldCgndjIvYm9vay9zZWFyY2gnLCB7cGFyYW1zOiB7cTogdGhpcy5rZXl3b3JkfX0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcbiAgICAgIFRoaXMubGlzdCA9IHJlcy5ib29rcztcbiAgICAgIFRoaXMudG90YWwgPSByZXMudG90YWw7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxuICBjb250cm9sbGVyOiBob21lQ3RybCxcbiAgY29udHJvbGxlckFzOid2bSdcbn0iLCJmdW5jdGlvbiBsYXlvdXRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSkge1xuLy/lnKjov5nph4zlj6/ku6Xmm7/ku6NydW5cbiAgdGhpcy50aXRsZSA9ICdob21lJztcbiAgJHJvb3RTY29wZS50aXRsZSA9ICdob21lJztcbiAgdmFyIFRoaXMgPSB0aGlzO1xuICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZSwgdG8pIHtcbiAgICBUaGlzLnRpdGxlID0gdG8udGl0bGU7XG4gICAgJHJvb3RTY29wZS50aXRsZSA9IHRvLnRpdGxlO1xuICB9KVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0ZW1wbGF0ZVVybDogJ3RwbC9sYXlvdXQuaHRtbCcsXG4gIGNvbnRyb2xsZXI6IGxheW91dEN0cmwsXG4gIGNvbnRyb2xsZXJBczondm0nXG59IiwiZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSlcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbGF5b3V0Jywge1xuICAgIHVybDonLycsXG4gICAgdGVtcGxhdGU6JzxsYXktaG9tZS8+JyxcbiAgICB0aXRsZTon5Li76aG1JyxcbiAgfSkuc3RhdGUoJ2NvbnRhY3QnLCB7XG4gICAgdXJsOicvY29udGFjdCcsXG4gICAgdGVtcGxhdGU6Jzxjb250YWN0Lz4nLFxuICAgIHRpdGxlOifogZTns7vmiJHku6wnXG4gIH0pLnN0YXRlKCdlZGl0Jywge1xuICAgIHVybDonL2VkaXQnLFxuICAgIHRlbXBsYXRlOic8ZWRpdC8+JyxcbiAgICB0aXRsZTon6IGU57O75oiR5LusJ1xuICB9KS5zdGF0ZSgnY3JvcHBlcicsIHtcbiAgICB1cmw6Jy9jcm9wcGVyJyxcbiAgICB0ZW1wbGF0ZTonPGNyb3BwZXIvPicsXG4gICAgdGl0bGU6J+eUu+eUuydcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwiLyohXG4gKiBDcm9wcGVyIHYzLjAuMC1yY1xuICogaHR0cHM6Ly9naXRodWIuY29tL2Zlbmd5dWFuY2hlbi9jcm9wcGVyXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEZlbmd5dWFuIENoZW5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICpcbiAqIERhdGU6IDIwMTctMDMtMjVUMTI6MDQ6MzQuNjU0WlxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpIDpcbiAgKGZhY3RvcnkoZ2xvYmFsLiQpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgkKSB7ICd1c2Ugc3RyaWN0JztcblxuJCA9ICdkZWZhdWx0JyBpbiAkID8gJFsnZGVmYXVsdCddIDogJDtcblxudmFyIERFRkFVTFRTID0ge1xuICAvLyBEZWZpbmUgdGhlIHZpZXcgbW9kZSBvZiB0aGUgY3JvcHBlclxuICB2aWV3TW9kZTogMCwgLy8gMCwgMSwgMiwgM1xuXG4gIC8vIERlZmluZSB0aGUgZHJhZ2dpbmcgbW9kZSBvZiB0aGUgY3JvcHBlclxuICBkcmFnTW9kZTogJ2Nyb3AnLCAvLyAnY3JvcCcsICdtb3ZlJyBvciAnbm9uZSdcblxuICAvLyBEZWZpbmUgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgY3JvcCBib3hcbiAgYXNwZWN0UmF0aW86IE5hTixcblxuICAvLyBBbiBvYmplY3Qgd2l0aCB0aGUgcHJldmlvdXMgY3JvcHBpbmcgcmVzdWx0IGRhdGFcbiAgZGF0YTogbnVsbCxcblxuICAvLyBBIHNlbGVjdG9yIGZvciBhZGRpbmcgZXh0cmEgY29udGFpbmVycyB0byBwcmV2aWV3XG4gIHByZXZpZXc6ICcnLFxuXG4gIC8vIFJlLXJlbmRlciB0aGUgY3JvcHBlciB3aGVuIHJlc2l6ZSB0aGUgd2luZG93XG4gIHJlc3BvbnNpdmU6IHRydWUsXG5cbiAgLy8gUmVzdG9yZSB0aGUgY3JvcHBlZCBhcmVhIGFmdGVyIHJlc2l6ZSB0aGUgd2luZG93XG4gIHJlc3RvcmU6IHRydWUsXG5cbiAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgaW1hZ2UgaXMgYSBjcm9zcy1vcmlnaW4gaW1hZ2VcbiAgY2hlY2tDcm9zc09yaWdpbjogdHJ1ZSxcblxuICAvLyBDaGVjayB0aGUgY3VycmVudCBpbWFnZSdzIEV4aWYgT3JpZW50YXRpb24gaW5mb3JtYXRpb25cbiAgY2hlY2tPcmllbnRhdGlvbjogdHJ1ZSxcblxuICAvLyBTaG93IHRoZSBibGFjayBtb2RhbFxuICBtb2RhbDogdHJ1ZSxcblxuICAvLyBTaG93IHRoZSBkYXNoZWQgbGluZXMgZm9yIGd1aWRpbmdcbiAgZ3VpZGVzOiB0cnVlLFxuXG4gIC8vIFNob3cgdGhlIGNlbnRlciBpbmRpY2F0b3IgZm9yIGd1aWRpbmdcbiAgY2VudGVyOiB0cnVlLFxuXG4gIC8vIFNob3cgdGhlIHdoaXRlIG1vZGFsIHRvIGhpZ2hsaWdodCB0aGUgY3JvcCBib3hcbiAgaGlnaGxpZ2h0OiB0cnVlLFxuXG4gIC8vIFNob3cgdGhlIGdyaWQgYmFja2dyb3VuZFxuICBiYWNrZ3JvdW5kOiB0cnVlLFxuXG4gIC8vIEVuYWJsZSB0byBjcm9wIHRoZSBpbWFnZSBhdXRvbWF0aWNhbGx5IHdoZW4gaW5pdGlhbGl6ZVxuICBhdXRvQ3JvcDogdHJ1ZSxcblxuICAvLyBEZWZpbmUgdGhlIHBlcmNlbnRhZ2Ugb2YgYXV0b21hdGljIGNyb3BwaW5nIGFyZWEgd2hlbiBpbml0aWFsaXplc1xuICBhdXRvQ3JvcEFyZWE6IDAuOCxcblxuICAvLyBFbmFibGUgdG8gbW92ZSB0aGUgaW1hZ2VcbiAgbW92YWJsZTogdHJ1ZSxcblxuICAvLyBFbmFibGUgdG8gcm90YXRlIHRoZSBpbWFnZVxuICByb3RhdGFibGU6IHRydWUsXG5cbiAgLy8gRW5hYmxlIHRvIHNjYWxlIHRoZSBpbWFnZVxuICBzY2FsYWJsZTogdHJ1ZSxcblxuICAvLyBFbmFibGUgdG8gem9vbSB0aGUgaW1hZ2VcbiAgem9vbWFibGU6IHRydWUsXG5cbiAgLy8gRW5hYmxlIHRvIHpvb20gdGhlIGltYWdlIGJ5IGRyYWdnaW5nIHRvdWNoXG4gIHpvb21PblRvdWNoOiB0cnVlLFxuXG4gIC8vIEVuYWJsZSB0byB6b29tIHRoZSBpbWFnZSBieSB3aGVlbGluZyBtb3VzZVxuICB6b29tT25XaGVlbDogdHJ1ZSxcblxuICAvLyBEZWZpbmUgem9vbSByYXRpbyB3aGVuIHpvb20gdGhlIGltYWdlIGJ5IHdoZWVsaW5nIG1vdXNlXG4gIHdoZWVsWm9vbVJhdGlvOiAwLjEsXG5cbiAgLy8gRW5hYmxlIHRvIG1vdmUgdGhlIGNyb3AgYm94XG4gIGNyb3BCb3hNb3ZhYmxlOiB0cnVlLFxuXG4gIC8vIEVuYWJsZSB0byByZXNpemUgdGhlIGNyb3AgYm94XG4gIGNyb3BCb3hSZXNpemFibGU6IHRydWUsXG5cbiAgLy8gVG9nZ2xlIGRyYWcgbW9kZSBiZXR3ZWVuIFwiY3JvcFwiIGFuZCBcIm1vdmVcIiB3aGVuIGNsaWNrIHR3aWNlIG9uIHRoZSBjcm9wcGVyXG4gIHRvZ2dsZURyYWdNb2RlT25EYmxjbGljazogdHJ1ZSxcblxuICAvLyBTaXplIGxpbWl0YXRpb25cbiAgbWluQ2FudmFzV2lkdGg6IDAsXG4gIG1pbkNhbnZhc0hlaWdodDogMCxcbiAgbWluQ3JvcEJveFdpZHRoOiAwLFxuICBtaW5Dcm9wQm94SGVpZ2h0OiAwLFxuICBtaW5Db250YWluZXJXaWR0aDogMjAwLFxuICBtaW5Db250YWluZXJIZWlnaHQ6IDEwMCxcblxuICAvLyBTaG9ydGN1dHMgb2YgZXZlbnRzXG4gIHJlYWR5OiBudWxsLFxuICBjcm9wc3RhcnQ6IG51bGwsXG4gIGNyb3Btb3ZlOiBudWxsLFxuICBjcm9wZW5kOiBudWxsLFxuICBjcm9wOiBudWxsLFxuICB6b29tOiBudWxsXG59O1xuXG52YXIgVEVNUExBVEUgPSAnPGRpdiBjbGFzcz1cImNyb3BwZXItY29udGFpbmVyXCI+JyArICc8ZGl2IGNsYXNzPVwiY3JvcHBlci13cmFwLWJveFwiPicgKyAnPGRpdiBjbGFzcz1cImNyb3BwZXItY2FudmFzXCI+PC9kaXY+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJjcm9wcGVyLWRyYWctYm94XCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwiY3JvcHBlci1jcm9wLWJveFwiPicgKyAnPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXZpZXctYm94XCI+PC9zcGFuPicgKyAnPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWRhc2hlZCBkYXNoZWQtaFwiPjwvc3Bhbj4nICsgJzxzcGFuIGNsYXNzPVwiY3JvcHBlci1kYXNoZWQgZGFzaGVkLXZcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItY2VudGVyXCI+PC9zcGFuPicgKyAnPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWZhY2VcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLWVcIiBkYXRhLWFjdGlvbj1cImVcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLW5cIiBkYXRhLWFjdGlvbj1cIm5cIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLXdcIiBkYXRhLWFjdGlvbj1cIndcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLXNcIiBkYXRhLWFjdGlvbj1cInNcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtZVwiIGRhdGEtYWN0aW9uPVwiZVwiPjwvc3Bhbj4nICsgJzxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1uXCIgZGF0YS1hY3Rpb249XCJuXCI+PC9zcGFuPicgKyAnPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXdcIiBkYXRhLWFjdGlvbj1cIndcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtc1wiIGRhdGEtYWN0aW9uPVwic1wiPjwvc3Bhbj4nICsgJzxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1uZVwiIGRhdGEtYWN0aW9uPVwibmVcIj48L3NwYW4+JyArICc8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtbndcIiBkYXRhLWFjdGlvbj1cIm53XCI+PC9zcGFuPicgKyAnPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXN3XCIgZGF0YS1hY3Rpb249XCJzd1wiPjwvc3Bhbj4nICsgJzxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1zZVwiIGRhdGEtYWN0aW9uPVwic2VcIj48L3NwYW4+JyArICc8L2Rpdj4nICsgJzwvZGl2Pic7XG5cbnZhciBSRUdFWFBfREFUQV9VUkxfSEVBRCA9IC9eZGF0YTouKiwvO1xudmFyIFJFR0VYUF9VU0VSQUdFTlQgPSAvKE1hY2ludG9zaHxpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQvaTtcbnZhciBuYXZpZ2F0b3IgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdy5uYXZpZ2F0b3IgOiBudWxsO1xudmFyIElTX1NBRkFSSV9PUl9VSVdFQlZJRVcgPSBuYXZpZ2F0b3IgJiYgUkVHRVhQX1VTRVJBR0VOVC50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xudmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnbnVtYmVyJyAmJiAhaXNOYU4obik7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG4pIHtcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gdG9BcnJheShvYmosIG9mZnNldCkge1xuICB2YXIgYXJncyA9IFtdO1xuXG4gIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBJRThcbiAgaWYgKGlzTnVtYmVyKG9mZnNldCkpIHtcbiAgICBhcmdzLnB1c2gob2Zmc2V0KTtcbiAgfVxuXG4gIHJldHVybiBhcmdzLnNsaWNlLmFwcGx5KG9iaiwgYXJncyk7XG59XG5cbi8vIEN1c3RvbSBwcm94eSB0byBhdm9pZCBqUXVlcnkncyBndWlkXG5mdW5jdGlvbiBwcm94eShmbiwgY29udGV4dCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzMiA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzMltfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdCh0b0FycmF5KGFyZ3MyKSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvYmplY3RLZXlzKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuXG4gICQuZWFjaChvYmosIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBrZXlzLnB1c2goa2V5KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIGlzQ3Jvc3NPcmlnaW5VUkwodXJsKSB7XG4gIHZhciBwYXJ0cyA9IHVybC5tYXRjaCgvXihodHRwcz86KVxcL1xcLyhbXjovPyNdKyk6PyhcXGQqKS9pKTtcblxuICByZXR1cm4gcGFydHMgJiYgKHBhcnRzWzFdICE9PSBsb2NhdGlvbi5wcm90b2NvbCB8fCBwYXJ0c1syXSAhPT0gbG9jYXRpb24uaG9zdG5hbWUgfHwgcGFydHNbM10gIT09IGxvY2F0aW9uLnBvcnQpO1xufVxuXG5mdW5jdGlvbiBhZGRUaW1lc3RhbXAodXJsKSB7XG4gIHZhciB0aW1lc3RhbXAgPSAndGltZXN0YW1wPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICByZXR1cm4gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHRpbWVzdGFtcDtcbn1cblxuZnVuY3Rpb24gZ2V0Q3Jvc3NPcmlnaW4oY3Jvc3NPcmlnaW4pIHtcbiAgcmV0dXJuIGNyb3NzT3JpZ2luID8gJyBjcm9zc09yaWdpbj1cIicgKyBjcm9zc09yaWdpbiArICdcIicgOiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0SW1hZ2VTaXplKGltYWdlLCBjYWxsYmFjaykge1xuICAvLyBNb2Rlcm4gYnJvd3NlcnMgKGlnbm9yZSBTYWZhcmksICMxMjAgJiAjNTA5KVxuICBpZiAoaW1hZ2UubmF0dXJhbFdpZHRoICYmICFJU19TQUZBUklfT1JfVUlXRUJWSUVXKSB7XG4gICAgY2FsbGJhY2soaW1hZ2UubmF0dXJhbFdpZHRoLCBpbWFnZS5uYXR1cmFsSGVpZ2h0KTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJRTg6IERvbid0IHVzZSBgbmV3IEltYWdlKClgIGhlcmUgKCMzMTkpXG4gIHZhciBuZXdJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gIG5ld0ltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgY2FsbGJhY2sodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9O1xuXG4gIG5ld0ltYWdlLnNyYyA9IGltYWdlLnNyYztcbn1cblxuZnVuY3Rpb24gZ2V0VHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgdmFyIHRyYW5zZm9ybXMgPSBbXTtcbiAgdmFyIHRyYW5zbGF0ZVggPSBvcHRpb25zLnRyYW5zbGF0ZVg7XG4gIHZhciB0cmFuc2xhdGVZID0gb3B0aW9ucy50cmFuc2xhdGVZO1xuICB2YXIgcm90YXRlID0gb3B0aW9ucy5yb3RhdGU7XG4gIHZhciBzY2FsZVggPSBvcHRpb25zLnNjYWxlWDtcbiAgdmFyIHNjYWxlWSA9IG9wdGlvbnMuc2NhbGVZO1xuXG4gIGlmIChpc051bWJlcih0cmFuc2xhdGVYKSAmJiB0cmFuc2xhdGVYICE9PSAwKSB7XG4gICAgdHJhbnNmb3Jtcy5wdXNoKCd0cmFuc2xhdGVYKCcgKyB0cmFuc2xhdGVYICsgJ3B4KScpO1xuICB9XG5cbiAgaWYgKGlzTnVtYmVyKHRyYW5zbGF0ZVkpICYmIHRyYW5zbGF0ZVkgIT09IDApIHtcbiAgICB0cmFuc2Zvcm1zLnB1c2goJ3RyYW5zbGF0ZVkoJyArIHRyYW5zbGF0ZVkgKyAncHgpJyk7XG4gIH1cblxuICAvLyBSb3RhdGUgc2hvdWxkIGNvbWUgZmlyc3QgYmVmb3JlIHNjYWxlIHRvIG1hdGNoIG9yaWVudGF0aW9uIHRyYW5zZm9ybVxuICBpZiAoaXNOdW1iZXIocm90YXRlKSAmJiByb3RhdGUgIT09IDApIHtcbiAgICB0cmFuc2Zvcm1zLnB1c2goJ3JvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknKTtcbiAgfVxuXG4gIGlmIChpc051bWJlcihzY2FsZVgpICYmIHNjYWxlWCAhPT0gMSkge1xuICAgIHRyYW5zZm9ybXMucHVzaCgnc2NhbGVYKCcgKyBzY2FsZVggKyAnKScpO1xuICB9XG5cbiAgaWYgKGlzTnVtYmVyKHNjYWxlWSkgJiYgc2NhbGVZICE9PSAxKSB7XG4gICAgdHJhbnNmb3Jtcy5wdXNoKCdzY2FsZVkoJyArIHNjYWxlWSArICcpJyk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNmb3Jtcy5sZW5ndGggPyB0cmFuc2Zvcm1zLmpvaW4oJyAnKSA6ICdub25lJztcbn1cblxuZnVuY3Rpb24gZ2V0Um90YXRlZFNpemVzKGRhdGEsIGlzUmV2ZXJzZWQpIHtcbiAgdmFyIGRlZyA9IE1hdGguYWJzKGRhdGEuZGVncmVlKSAlIDE4MDtcbiAgdmFyIGFyYyA9IChkZWcgPiA5MCA/IDE4MCAtIGRlZyA6IGRlZykgKiBNYXRoLlBJIC8gMTgwO1xuICB2YXIgc2luQXJjID0gTWF0aC5zaW4oYXJjKTtcbiAgdmFyIGNvc0FyYyA9IE1hdGguY29zKGFyYyk7XG4gIHZhciB3aWR0aCA9IGRhdGEud2lkdGg7XG4gIHZhciBoZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgdmFyIGFzcGVjdFJhdGlvID0gZGF0YS5hc3BlY3RSYXRpbztcbiAgdmFyIG5ld1dpZHRoID0gdm9pZCAwO1xuICB2YXIgbmV3SGVpZ2h0ID0gdm9pZCAwO1xuXG4gIGlmICghaXNSZXZlcnNlZCkge1xuICAgIG5ld1dpZHRoID0gd2lkdGggKiBjb3NBcmMgKyBoZWlnaHQgKiBzaW5BcmM7XG4gICAgbmV3SGVpZ2h0ID0gd2lkdGggKiBzaW5BcmMgKyBoZWlnaHQgKiBjb3NBcmM7XG4gIH0gZWxzZSB7XG4gICAgbmV3V2lkdGggPSB3aWR0aCAvIChjb3NBcmMgKyBzaW5BcmMgLyBhc3BlY3RSYXRpbyk7XG4gICAgbmV3SGVpZ2h0ID0gbmV3V2lkdGggLyBhc3BlY3RSYXRpbztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IG5ld1dpZHRoLFxuICAgIGhlaWdodDogbmV3SGVpZ2h0XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUNhbnZhcyhpbWFnZSwgZGF0YSkge1xuICB2YXIgY2FudmFzID0gJCgnPGNhbnZhcz4nKVswXTtcbiAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgdmFyIGRzdFggPSAwO1xuICB2YXIgZHN0WSA9IDA7XG4gIHZhciBkc3RXaWR0aCA9IGRhdGEubmF0dXJhbFdpZHRoO1xuICB2YXIgZHN0SGVpZ2h0ID0gZGF0YS5uYXR1cmFsSGVpZ2h0O1xuICB2YXIgcm90YXRlID0gZGF0YS5yb3RhdGU7XG4gIHZhciBzY2FsZVggPSBkYXRhLnNjYWxlWDtcbiAgdmFyIHNjYWxlWSA9IGRhdGEuc2NhbGVZO1xuICB2YXIgc2NhbGFibGUgPSBpc051bWJlcihzY2FsZVgpICYmIGlzTnVtYmVyKHNjYWxlWSkgJiYgKHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDEpO1xuICB2YXIgcm90YXRhYmxlID0gaXNOdW1iZXIocm90YXRlKSAmJiByb3RhdGUgIT09IDA7XG4gIHZhciBhZHZhbmNlZCA9IHJvdGF0YWJsZSB8fCBzY2FsYWJsZTtcbiAgdmFyIGNhbnZhc1dpZHRoID0gZHN0V2lkdGggKiBNYXRoLmFicyhzY2FsZVggfHwgMSk7XG4gIHZhciBjYW52YXNIZWlnaHQgPSBkc3RIZWlnaHQgKiBNYXRoLmFicyhzY2FsZVkgfHwgMSk7XG4gIHZhciB0cmFuc2xhdGVYID0gdm9pZCAwO1xuICB2YXIgdHJhbnNsYXRlWSA9IHZvaWQgMDtcbiAgdmFyIHJvdGF0ZWQgPSB2b2lkIDA7XG5cbiAgaWYgKHNjYWxhYmxlKSB7XG4gICAgdHJhbnNsYXRlWCA9IGNhbnZhc1dpZHRoIC8gMjtcbiAgICB0cmFuc2xhdGVZID0gY2FudmFzSGVpZ2h0IC8gMjtcbiAgfVxuXG4gIGlmIChyb3RhdGFibGUpIHtcbiAgICByb3RhdGVkID0gZ2V0Um90YXRlZFNpemVzKHtcbiAgICAgIHdpZHRoOiBjYW52YXNXaWR0aCxcbiAgICAgIGhlaWdodDogY2FudmFzSGVpZ2h0LFxuICAgICAgZGVncmVlOiByb3RhdGVcbiAgICB9KTtcblxuICAgIGNhbnZhc1dpZHRoID0gcm90YXRlZC53aWR0aDtcbiAgICBjYW52YXNIZWlnaHQgPSByb3RhdGVkLmhlaWdodDtcbiAgICB0cmFuc2xhdGVYID0gY2FudmFzV2lkdGggLyAyO1xuICAgIHRyYW5zbGF0ZVkgPSBjYW52YXNIZWlnaHQgLyAyO1xuICB9XG5cbiAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG5cbiAgaWYgKGFkdmFuY2VkKSB7XG4gICAgZHN0WCA9IC1kc3RXaWR0aCAvIDI7XG4gICAgZHN0WSA9IC1kc3RIZWlnaHQgLyAyO1xuXG4gICAgY29udGV4dC5zYXZlKCk7XG4gICAgY29udGV4dC50cmFuc2xhdGUodHJhbnNsYXRlWCwgdHJhbnNsYXRlWSk7XG4gIH1cblxuICAvLyBSb3RhdGUgc2hvdWxkIGNvbWUgZmlyc3QgYmVmb3JlIHNjYWxlIGFzIGluIHRoZSBcImdldFRyYW5zZm9ybVwiIGZ1bmN0aW9uXG4gIGlmIChyb3RhdGFibGUpIHtcbiAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGUgKiBNYXRoLlBJIC8gMTgwKTtcbiAgfVxuXG4gIGlmIChzY2FsYWJsZSkge1xuICAgIGNvbnRleHQuc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xuICB9XG5cbiAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIE1hdGguZmxvb3IoZHN0WCksIE1hdGguZmxvb3IoZHN0WSksIE1hdGguZmxvb3IoZHN0V2lkdGgpLCBNYXRoLmZsb29yKGRzdEhlaWdodCkpO1xuXG4gIGlmIChhZHZhbmNlZCkge1xuICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cbiAgcmV0dXJuIGNhbnZhcztcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbUNoYXJDb2RlKGRhdGFWaWV3LCBzdGFydCwgbGVuZ3RoKSB7XG4gIHZhciBzdHIgPSAnJztcbiAgdmFyIGkgPSB2b2lkIDA7XG5cbiAgZm9yIChpID0gc3RhcnQsIGxlbmd0aCArPSBzdGFydDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgc3RyICs9IGZyb21DaGFyQ29kZShkYXRhVmlldy5nZXRVaW50OChpKSk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG5mdW5jdGlvbiBnZXRPcmllbnRhdGlvbihhcnJheUJ1ZmZlcikge1xuICB2YXIgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpO1xuICB2YXIgbGVuZ3RoID0gZGF0YVZpZXcuYnl0ZUxlbmd0aDtcbiAgdmFyIG9yaWVudGF0aW9uID0gdm9pZCAwO1xuICB2YXIgZXhpZklEQ29kZSA9IHZvaWQgMDtcbiAgdmFyIHRpZmZPZmZzZXQgPSB2b2lkIDA7XG4gIHZhciBmaXJzdElGRE9mZnNldCA9IHZvaWQgMDtcbiAgdmFyIGxpdHRsZUVuZGlhbiA9IHZvaWQgMDtcbiAgdmFyIGVuZGlhbm5lc3MgPSB2b2lkIDA7XG4gIHZhciBhcHAxU3RhcnQgPSB2b2lkIDA7XG4gIHZhciBpZmRTdGFydCA9IHZvaWQgMDtcbiAgdmFyIG9mZnNldCA9IHZvaWQgMDtcbiAgdmFyIGkgPSB2b2lkIDA7XG5cbiAgLy8gT25seSBoYW5kbGUgSlBFRyBpbWFnZSAoc3RhcnQgYnkgMHhGRkQ4KVxuICBpZiAoZGF0YVZpZXcuZ2V0VWludDgoMCkgPT09IDB4RkYgJiYgZGF0YVZpZXcuZ2V0VWludDgoMSkgPT09IDB4RDgpIHtcbiAgICBvZmZzZXQgPSAyO1xuXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGRhdGFWaWV3LmdldFVpbnQ4KG9mZnNldCkgPT09IDB4RkYgJiYgZGF0YVZpZXcuZ2V0VWludDgob2Zmc2V0ICsgMSkgPT09IDB4RTEpIHtcbiAgICAgICAgYXBwMVN0YXJ0ID0gb2Zmc2V0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgb2Zmc2V0Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGFwcDFTdGFydCkge1xuICAgIGV4aWZJRENvZGUgPSBhcHAxU3RhcnQgKyA0O1xuICAgIHRpZmZPZmZzZXQgPSBhcHAxU3RhcnQgKyAxMDtcblxuICAgIGlmIChnZXRTdHJpbmdGcm9tQ2hhckNvZGUoZGF0YVZpZXcsIGV4aWZJRENvZGUsIDQpID09PSAnRXhpZicpIHtcbiAgICAgIGVuZGlhbm5lc3MgPSBkYXRhVmlldy5nZXRVaW50MTYodGlmZk9mZnNldCk7XG4gICAgICBsaXR0bGVFbmRpYW4gPSBlbmRpYW5uZXNzID09PSAweDQ5NDk7XG5cbiAgICAgIGlmIChsaXR0bGVFbmRpYW4gfHwgZW5kaWFubmVzcyA9PT0gMHg0RDREIC8qIGJpZ0VuZGlhbiAqLykge1xuICAgICAgICAgIGlmIChkYXRhVmlldy5nZXRVaW50MTYodGlmZk9mZnNldCArIDIsIGxpdHRsZUVuZGlhbikgPT09IDB4MDAyQSkge1xuICAgICAgICAgICAgZmlyc3RJRkRPZmZzZXQgPSBkYXRhVmlldy5nZXRVaW50MzIodGlmZk9mZnNldCArIDQsIGxpdHRsZUVuZGlhbik7XG5cbiAgICAgICAgICAgIGlmIChmaXJzdElGRE9mZnNldCA+PSAweDAwMDAwMDA4KSB7XG4gICAgICAgICAgICAgIGlmZFN0YXJ0ID0gdGlmZk9mZnNldCArIGZpcnN0SUZET2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpZmRTdGFydCkge1xuICAgIGxlbmd0aCA9IGRhdGFWaWV3LmdldFVpbnQxNihpZmRTdGFydCwgbGl0dGxlRW5kaWFuKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgb2Zmc2V0ID0gaWZkU3RhcnQgKyBpICogMTIgKyAyO1xuXG4gICAgICBpZiAoZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCwgbGl0dGxlRW5kaWFuKSA9PT0gMHgwMTEyIC8qIE9yaWVudGF0aW9uICovKSB7XG4gICAgICAgICAgLy8gOCBpcyB0aGUgb2Zmc2V0IG9mIHRoZSBjdXJyZW50IHRhZydzIHZhbHVlXG4gICAgICAgICAgb2Zmc2V0ICs9IDg7XG5cbiAgICAgICAgICAvLyBHZXQgdGhlIG9yaWdpbmFsIG9yaWVudGF0aW9uIHZhbHVlXG4gICAgICAgICAgb3JpZW50YXRpb24gPSBkYXRhVmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGVFbmRpYW4pO1xuXG4gICAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIG9yaWVudGF0aW9uIHdpdGggaXRzIGRlZmF1bHQgdmFsdWUgZm9yIFNhZmFyaSAoIzEyMClcbiAgICAgICAgICBpZiAoSVNfU0FGQVJJX09SX1VJV0VCVklFVykge1xuICAgICAgICAgICAgZGF0YVZpZXcuc2V0VWludDE2KG9mZnNldCwgMSwgbGl0dGxlRW5kaWFuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcmllbnRhdGlvbjtcbn1cblxuZnVuY3Rpb24gZGF0YVVSTFRvQXJyYXlCdWZmZXIoZGF0YVVSTCkge1xuICB2YXIgYmFzZTY0ID0gZGF0YVVSTC5yZXBsYWNlKFJFR0VYUF9EQVRBX1VSTF9IRUFELCAnJyk7XG4gIHZhciBiaW5hcnkgPSBhdG9iKGJhc2U2NCk7XG4gIHZhciBsZW5ndGggPSBiaW5hcnkubGVuZ3RoO1xuICB2YXIgYXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoKTtcbiAgdmFyIGRhdGFWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuICB2YXIgaSA9IHZvaWQgMDtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBkYXRhVmlld1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5QnVmZmVyO1xufVxuXG4vLyBPbmx5IGF2YWlsYWJsZSBmb3IgSlBFRyBpbWFnZVxuZnVuY3Rpb24gYXJyYXlCdWZmZXJUb0RhdGFVUkwoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIGRhdGFWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuICB2YXIgbGVuZ3RoID0gZGF0YVZpZXcubGVuZ3RoO1xuICB2YXIgYmFzZTY0ID0gJyc7XG4gIHZhciBpID0gdm9pZCAwO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGJhc2U2NCArPSBmcm9tQ2hhckNvZGUoZGF0YVZpZXdbaV0pO1xuICB9XG5cbiAgcmV0dXJuICdkYXRhOmltYWdlL2pwZWc7YmFzZTY0LCcgKyBidG9hKGJhc2U2NCk7XG59XG5cbnZhciByZW5kZXIkMSA9IHtcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbml0Q29udGFpbmVyKCk7XG4gICAgc2VsZi5pbml0Q2FudmFzKCk7XG4gICAgc2VsZi5pbml0Q3JvcEJveCgpO1xuXG4gICAgc2VsZi5yZW5kZXJDYW52YXMoKTtcblxuICAgIGlmIChzZWxmLmNyb3BwZWQpIHtcbiAgICAgIHNlbGYucmVuZGVyQ3JvcEJveCgpO1xuICAgIH1cbiAgfSxcbiAgaW5pdENvbnRhaW5lcjogZnVuY3Rpb24gaW5pdENvbnRhaW5lcigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyICR0aGlzID0gc2VsZi4kZWxlbWVudDtcbiAgICB2YXIgJGNvbnRhaW5lciA9IHNlbGYuJGNvbnRhaW5lcjtcbiAgICB2YXIgJGNyb3BwZXIgPSBzZWxmLiRjcm9wcGVyO1xuICAgIHZhciBoaWRkZW4gPSAnY3JvcHBlci1oaWRkZW4nO1xuXG4gICAgJGNyb3BwZXIuYWRkQ2xhc3MoaGlkZGVuKTtcbiAgICAkdGhpcy5yZW1vdmVDbGFzcyhoaWRkZW4pO1xuXG4gICAgJGNyb3BwZXIuY3NzKHNlbGYuY29udGFpbmVyID0ge1xuICAgICAgd2lkdGg6IE1hdGgubWF4KCRjb250YWluZXIud2lkdGgoKSwgTnVtYmVyKG9wdGlvbnMubWluQ29udGFpbmVyV2lkdGgpIHx8IDIwMCksXG4gICAgICBoZWlnaHQ6IE1hdGgubWF4KCRjb250YWluZXIuaGVpZ2h0KCksIE51bWJlcihvcHRpb25zLm1pbkNvbnRhaW5lckhlaWdodCkgfHwgMTAwKVxuICAgIH0pO1xuXG4gICAgJHRoaXMuYWRkQ2xhc3MoaGlkZGVuKTtcbiAgICAkY3JvcHBlci5yZW1vdmVDbGFzcyhoaWRkZW4pO1xuICB9LFxuXG5cbiAgLy8gQ2FudmFzIChpbWFnZSB3cmFwcGVyKVxuICBpbml0Q2FudmFzOiBmdW5jdGlvbiBpbml0Q2FudmFzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdmlld01vZGUgPSBzZWxmLm9wdGlvbnMudmlld01vZGU7XG4gICAgdmFyIGNvbnRhaW5lciA9IHNlbGYuY29udGFpbmVyO1xuICAgIHZhciBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aDtcbiAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodDtcbiAgICB2YXIgaW1hZ2UgPSBzZWxmLmltYWdlO1xuICAgIHZhciBpbWFnZU5hdHVyYWxXaWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcbiAgICB2YXIgaW1hZ2VOYXR1cmFsSGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodDtcbiAgICB2YXIgaXM5MERlZ3JlZSA9IE1hdGguYWJzKGltYWdlLnJvdGF0ZSkgPT09IDkwO1xuICAgIHZhciBuYXR1cmFsV2lkdGggPSBpczkwRGVncmVlID8gaW1hZ2VOYXR1cmFsSGVpZ2h0IDogaW1hZ2VOYXR1cmFsV2lkdGg7XG4gICAgdmFyIG5hdHVyYWxIZWlnaHQgPSBpczkwRGVncmVlID8gaW1hZ2VOYXR1cmFsV2lkdGggOiBpbWFnZU5hdHVyYWxIZWlnaHQ7XG4gICAgdmFyIGFzcGVjdFJhdGlvID0gbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodDtcbiAgICB2YXIgY2FudmFzV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICB2YXIgY2FudmFzSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0O1xuXG4gICAgaWYgKGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvID4gY29udGFpbmVyV2lkdGgpIHtcbiAgICAgIGlmICh2aWV3TW9kZSA9PT0gMykge1xuICAgICAgICBjYW52YXNXaWR0aCA9IGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FudmFzSGVpZ2h0ID0gY29udGFpbmVyV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZpZXdNb2RlID09PSAzKSB7XG4gICAgICBjYW52YXNIZWlnaHQgPSBjb250YWluZXJXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW52YXNXaWR0aCA9IGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgIH1cblxuICAgIHZhciBjYW52YXMgPSB7XG4gICAgICBuYXR1cmFsV2lkdGg6IG5hdHVyYWxXaWR0aCxcbiAgICAgIG5hdHVyYWxIZWlnaHQ6IG5hdHVyYWxIZWlnaHQsXG4gICAgICBhc3BlY3RSYXRpbzogYXNwZWN0UmF0aW8sXG4gICAgICB3aWR0aDogY2FudmFzV2lkdGgsXG4gICAgICBoZWlnaHQ6IGNhbnZhc0hlaWdodFxuICAgIH07XG5cbiAgICBjYW52YXMub2xkTGVmdCA9IGNhbnZhcy5sZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gY2FudmFzV2lkdGgpIC8gMjtcbiAgICBjYW52YXMub2xkVG9wID0gY2FudmFzLnRvcCA9IChjb250YWluZXJIZWlnaHQgLSBjYW52YXNIZWlnaHQpIC8gMjtcblxuICAgIHNlbGYuY2FudmFzID0gY2FudmFzO1xuICAgIHNlbGYubGltaXRlZCA9IHZpZXdNb2RlID09PSAxIHx8IHZpZXdNb2RlID09PSAyO1xuICAgIHNlbGYubGltaXRDYW52YXModHJ1ZSwgdHJ1ZSk7XG4gICAgc2VsZi5pbml0aWFsSW1hZ2UgPSAkLmV4dGVuZCh7fSwgaW1hZ2UpO1xuICAgIHNlbGYuaW5pdGlhbENhbnZhcyA9ICQuZXh0ZW5kKHt9LCBjYW52YXMpO1xuICB9LFxuICBsaW1pdENhbnZhczogZnVuY3Rpb24gbGltaXRDYW52YXMoaXNTaXplTGltaXRlZCwgaXNQb3NpdGlvbkxpbWl0ZWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyIHZpZXdNb2RlID0gb3B0aW9ucy52aWV3TW9kZTtcbiAgICB2YXIgY29udGFpbmVyID0gc2VsZi5jb250YWluZXI7XG4gICAgdmFyIGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLndpZHRoO1xuICAgIHZhciBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0O1xuICAgIHZhciBjYW52YXMgPSBzZWxmLmNhbnZhcztcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBjYW52YXMuYXNwZWN0UmF0aW87XG4gICAgdmFyIGNyb3BCb3ggPSBzZWxmLmNyb3BCb3g7XG4gICAgdmFyIGNyb3BwZWQgPSBzZWxmLmNyb3BwZWQgJiYgY3JvcEJveDtcblxuICAgIGlmIChpc1NpemVMaW1pdGVkKSB7XG4gICAgICB2YXIgbWluQ2FudmFzV2lkdGggPSBOdW1iZXIob3B0aW9ucy5taW5DYW52YXNXaWR0aCkgfHwgMDtcbiAgICAgIHZhciBtaW5DYW52YXNIZWlnaHQgPSBOdW1iZXIob3B0aW9ucy5taW5DYW52YXNIZWlnaHQpIHx8IDA7XG5cbiAgICAgIGlmICh2aWV3TW9kZSkge1xuICAgICAgICBpZiAodmlld01vZGUgPiAxKSB7XG4gICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBNYXRoLm1heChtaW5DYW52YXNXaWR0aCwgY29udGFpbmVyV2lkdGgpO1xuICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IE1hdGgubWF4KG1pbkNhbnZhc0hlaWdodCwgY29udGFpbmVySGVpZ2h0KTtcblxuICAgICAgICAgIGlmICh2aWV3TW9kZSA9PT0gMykge1xuICAgICAgICAgICAgaWYgKG1pbkNhbnZhc0hlaWdodCAqIGFzcGVjdFJhdGlvID4gbWluQ2FudmFzV2lkdGgpIHtcbiAgICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG1pbkNhbnZhc1dpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1pbkNhbnZhc1dpZHRoKSB7XG4gICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBNYXRoLm1heChtaW5DYW52YXNXaWR0aCwgY3JvcHBlZCA/IGNyb3BCb3gud2lkdGggOiAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChtaW5DYW52YXNIZWlnaHQpIHtcbiAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBNYXRoLm1heChtaW5DYW52YXNIZWlnaHQsIGNyb3BwZWQgPyBjcm9wQm94LmhlaWdodCA6IDApO1xuICAgICAgICB9IGVsc2UgaWYgKGNyb3BwZWQpIHtcbiAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IGNyb3BCb3gud2lkdGg7XG4gICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gY3JvcEJveC5oZWlnaHQ7XG5cbiAgICAgICAgICBpZiAobWluQ2FudmFzSGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBtaW5DYW52YXNXaWR0aCkge1xuICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gbWluQ2FudmFzV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1pbkNhbnZhc1dpZHRoICYmIG1pbkNhbnZhc0hlaWdodCkge1xuICAgICAgICBpZiAobWluQ2FudmFzSGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBtaW5DYW52YXNXaWR0aCkge1xuICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG1pbkNhbnZhc1dpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtaW5DYW52YXNXaWR0aCkge1xuICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBtaW5DYW52YXNXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIGlmIChtaW5DYW52YXNIZWlnaHQpIHtcbiAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtaW5DYW52YXNIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgIH1cblxuICAgICAgY2FudmFzLm1pbldpZHRoID0gbWluQ2FudmFzV2lkdGg7XG4gICAgICBjYW52YXMubWluSGVpZ2h0ID0gbWluQ2FudmFzSGVpZ2h0O1xuICAgICAgY2FudmFzLm1heFdpZHRoID0gSW5maW5pdHk7XG4gICAgICBjYW52YXMubWF4SGVpZ2h0ID0gSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKGlzUG9zaXRpb25MaW1pdGVkKSB7XG4gICAgICBpZiAodmlld01vZGUpIHtcbiAgICAgICAgdmFyIG5ld0NhbnZhc0xlZnQgPSBjb250YWluZXJXaWR0aCAtIGNhbnZhcy53aWR0aDtcbiAgICAgICAgdmFyIG5ld0NhbnZhc1RvcCA9IGNvbnRhaW5lckhlaWdodCAtIGNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgY2FudmFzLm1pbkxlZnQgPSBNYXRoLm1pbigwLCBuZXdDYW52YXNMZWZ0KTtcbiAgICAgICAgY2FudmFzLm1pblRvcCA9IE1hdGgubWluKDAsIG5ld0NhbnZhc1RvcCk7XG4gICAgICAgIGNhbnZhcy5tYXhMZWZ0ID0gTWF0aC5tYXgoMCwgbmV3Q2FudmFzTGVmdCk7XG4gICAgICAgIGNhbnZhcy5tYXhUb3AgPSBNYXRoLm1heCgwLCBuZXdDYW52YXNUb3ApO1xuXG4gICAgICAgIGlmIChjcm9wcGVkICYmIHNlbGYubGltaXRlZCkge1xuICAgICAgICAgIGNhbnZhcy5taW5MZWZ0ID0gTWF0aC5taW4oY3JvcEJveC5sZWZ0LCBjcm9wQm94LmxlZnQgKyBjcm9wQm94LndpZHRoIC0gY2FudmFzLndpZHRoKTtcbiAgICAgICAgICBjYW52YXMubWluVG9wID0gTWF0aC5taW4oY3JvcEJveC50b3AsIGNyb3BCb3gudG9wICsgY3JvcEJveC5oZWlnaHQgLSBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICBjYW52YXMubWF4TGVmdCA9IGNyb3BCb3gubGVmdDtcbiAgICAgICAgICBjYW52YXMubWF4VG9wID0gY3JvcEJveC50b3A7XG5cbiAgICAgICAgICBpZiAodmlld01vZGUgPT09IDIpIHtcbiAgICAgICAgICAgIGlmIChjYW52YXMud2lkdGggPj0gY29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgY2FudmFzLm1pbkxlZnQgPSBNYXRoLm1pbigwLCBuZXdDYW52YXNMZWZ0KTtcbiAgICAgICAgICAgICAgY2FudmFzLm1heExlZnQgPSBNYXRoLm1heCgwLCBuZXdDYW52YXNMZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbnZhcy5oZWlnaHQgPj0gY29udGFpbmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGNhbnZhcy5taW5Ub3AgPSBNYXRoLm1pbigwLCBuZXdDYW52YXNUb3ApO1xuICAgICAgICAgICAgICBjYW52YXMubWF4VG9wID0gTWF0aC5tYXgoMCwgbmV3Q2FudmFzVG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbnZhcy5taW5MZWZ0ID0gLWNhbnZhcy53aWR0aDtcbiAgICAgICAgY2FudmFzLm1pblRvcCA9IC1jYW52YXMuaGVpZ2h0O1xuICAgICAgICBjYW52YXMubWF4TGVmdCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICBjYW52YXMubWF4VG9wID0gY29udGFpbmVySGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyQ2FudmFzOiBmdW5jdGlvbiByZW5kZXJDYW52YXMoaXNDaGFuZ2VkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjYW52YXMgPSBzZWxmLmNhbnZhcztcbiAgICB2YXIgaW1hZ2UgPSBzZWxmLmltYWdlO1xuICAgIHZhciByb3RhdGUgPSBpbWFnZS5yb3RhdGU7XG4gICAgdmFyIG5hdHVyYWxXaWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcbiAgICB2YXIgbmF0dXJhbEhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XG5cbiAgICBpZiAoc2VsZi5yb3RhdGVkKSB7XG4gICAgICBzZWxmLnJvdGF0ZWQgPSBmYWxzZTtcblxuICAgICAgLy8gQ29tcHV0ZXMgcm90YXRlZCBzaXplcyB3aXRoIGltYWdlIHNpemVzXG4gICAgICB2YXIgcm90YXRlZCA9IGdldFJvdGF0ZWRTaXplcyh7XG4gICAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBpbWFnZS5oZWlnaHQsXG4gICAgICAgIGRlZ3JlZTogcm90YXRlXG4gICAgICB9KTtcbiAgICAgIHZhciBhc3BlY3RSYXRpbyA9IHJvdGF0ZWQud2lkdGggLyByb3RhdGVkLmhlaWdodDtcbiAgICAgIHZhciBpc1NxdWFyZUltYWdlID0gaW1hZ2UuYXNwZWN0UmF0aW8gPT09IDE7XG5cbiAgICAgIGlmIChpc1NxdWFyZUltYWdlIHx8IGFzcGVjdFJhdGlvICE9PSBjYW52YXMuYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgY2FudmFzLmxlZnQgLT0gKHJvdGF0ZWQud2lkdGggLSBjYW52YXMud2lkdGgpIC8gMjtcbiAgICAgICAgY2FudmFzLnRvcCAtPSAocm90YXRlZC5oZWlnaHQgLSBjYW52YXMuaGVpZ2h0KSAvIDI7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHJvdGF0ZWQud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSByb3RhdGVkLmhlaWdodDtcbiAgICAgICAgY2FudmFzLmFzcGVjdFJhdGlvID0gYXNwZWN0UmF0aW87XG4gICAgICAgIGNhbnZhcy5uYXR1cmFsV2lkdGggPSBuYXR1cmFsV2lkdGg7XG4gICAgICAgIGNhbnZhcy5uYXR1cmFsSGVpZ2h0ID0gbmF0dXJhbEhlaWdodDtcblxuICAgICAgICAvLyBDb21wdXRlcyByb3RhdGVkIHNpemVzIHdpdGggbmF0dXJhbCBpbWFnZSBzaXplc1xuICAgICAgICBpZiAoaXNTcXVhcmVJbWFnZSAmJiByb3RhdGUgJSA5MCB8fCByb3RhdGUgJSAxODApIHtcbiAgICAgICAgICB2YXIgcm90YXRlZDIgPSBnZXRSb3RhdGVkU2l6ZXMoe1xuICAgICAgICAgICAgd2lkdGg6IG5hdHVyYWxXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogbmF0dXJhbEhlaWdodCxcbiAgICAgICAgICAgIGRlZ3JlZTogcm90YXRlXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYW52YXMubmF0dXJhbFdpZHRoID0gcm90YXRlZDIud2lkdGg7XG4gICAgICAgICAgY2FudmFzLm5hdHVyYWxIZWlnaHQgPSByb3RhdGVkMi5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxpbWl0Q2FudmFzKHRydWUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FudmFzLndpZHRoID4gY2FudmFzLm1heFdpZHRoIHx8IGNhbnZhcy53aWR0aCA8IGNhbnZhcy5taW5XaWR0aCkge1xuICAgICAgY2FudmFzLmxlZnQgPSBjYW52YXMub2xkTGVmdDtcbiAgICB9XG5cbiAgICBpZiAoY2FudmFzLmhlaWdodCA+IGNhbnZhcy5tYXhIZWlnaHQgfHwgY2FudmFzLmhlaWdodCA8IGNhbnZhcy5taW5IZWlnaHQpIHtcbiAgICAgIGNhbnZhcy50b3AgPSBjYW52YXMub2xkVG9wO1xuICAgIH1cblxuICAgIGNhbnZhcy53aWR0aCA9IE1hdGgubWluKE1hdGgubWF4KGNhbnZhcy53aWR0aCwgY2FudmFzLm1pbldpZHRoKSwgY2FudmFzLm1heFdpZHRoKTtcbiAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5taW4oTWF0aC5tYXgoY2FudmFzLmhlaWdodCwgY2FudmFzLm1pbkhlaWdodCksIGNhbnZhcy5tYXhIZWlnaHQpO1xuXG4gICAgc2VsZi5saW1pdENhbnZhcyhmYWxzZSwgdHJ1ZSk7XG5cbiAgICBjYW52YXMub2xkTGVmdCA9IGNhbnZhcy5sZWZ0ID0gTWF0aC5taW4oTWF0aC5tYXgoY2FudmFzLmxlZnQsIGNhbnZhcy5taW5MZWZ0KSwgY2FudmFzLm1heExlZnQpO1xuICAgIGNhbnZhcy5vbGRUb3AgPSBjYW52YXMudG9wID0gTWF0aC5taW4oTWF0aC5tYXgoY2FudmFzLnRvcCwgY2FudmFzLm1pblRvcCksIGNhbnZhcy5tYXhUb3ApO1xuXG4gICAgc2VsZi4kY2FudmFzLmNzcyh7XG4gICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgdHJhbnNmb3JtOiBnZXRUcmFuc2Zvcm0oe1xuICAgICAgICB0cmFuc2xhdGVYOiBjYW52YXMubGVmdCxcbiAgICAgICAgdHJhbnNsYXRlWTogY2FudmFzLnRvcFxuICAgICAgfSlcbiAgICB9KTtcblxuICAgIHNlbGYucmVuZGVySW1hZ2UoKTtcblxuICAgIGlmIChzZWxmLmNyb3BwZWQgJiYgc2VsZi5saW1pdGVkKSB7XG4gICAgICBzZWxmLmxpbWl0Q3JvcEJveCh0cnVlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBzZWxmLm91dHB1dCgpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVySW1hZ2U6IGZ1bmN0aW9uIHJlbmRlckltYWdlKGlzQ2hhbmdlZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIGltYWdlID0gc2VsZi5pbWFnZTtcbiAgICB2YXIgcmV2ZXJzZWQgPSB2b2lkIDA7XG5cbiAgICBpZiAoaW1hZ2Uucm90YXRlKSB7XG4gICAgICByZXZlcnNlZCA9IGdldFJvdGF0ZWRTaXplcyh7XG4gICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcbiAgICAgICAgZGVncmVlOiBpbWFnZS5yb3RhdGUsXG4gICAgICAgIGFzcGVjdFJhdGlvOiBpbWFnZS5hc3BlY3RSYXRpb1xuICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgJC5leHRlbmQoaW1hZ2UsIHJldmVyc2VkID8ge1xuICAgICAgd2lkdGg6IHJldmVyc2VkLndpZHRoLFxuICAgICAgaGVpZ2h0OiByZXZlcnNlZC5oZWlnaHQsXG4gICAgICBsZWZ0OiAoY2FudmFzLndpZHRoIC0gcmV2ZXJzZWQud2lkdGgpIC8gMixcbiAgICAgIHRvcDogKGNhbnZhcy5oZWlnaHQgLSByZXZlcnNlZC5oZWlnaHQpIC8gMlxuICAgIH0gOiB7XG4gICAgICB3aWR0aDogY2FudmFzLndpZHRoLFxuICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMFxuICAgIH0pO1xuXG4gICAgc2VsZi4kY2xvbmUuY3NzKHtcbiAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuICAgICAgdHJhbnNmb3JtOiBnZXRUcmFuc2Zvcm0oJC5leHRlbmQoe1xuICAgICAgICB0cmFuc2xhdGVYOiBpbWFnZS5sZWZ0LFxuICAgICAgICB0cmFuc2xhdGVZOiBpbWFnZS50b3BcbiAgICAgIH0sIGltYWdlKSlcbiAgICB9KTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIHNlbGYub3V0cHV0KCk7XG4gICAgfVxuICB9LFxuICBpbml0Q3JvcEJveDogZnVuY3Rpb24gaW5pdENyb3BCb3goKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgIHZhciBjYW52YXMgPSBzZWxmLmNhbnZhcztcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBvcHRpb25zLmFzcGVjdFJhdGlvO1xuICAgIHZhciBhdXRvQ3JvcEFyZWEgPSBOdW1iZXIob3B0aW9ucy5hdXRvQ3JvcEFyZWEpIHx8IDAuODtcbiAgICB2YXIgY3JvcEJveCA9IHtcbiAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHRcbiAgICB9O1xuXG4gICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICBpZiAoY2FudmFzLmhlaWdodCAqIGFzcGVjdFJhdGlvID4gY2FudmFzLndpZHRoKSB7XG4gICAgICAgIGNyb3BCb3guaGVpZ2h0ID0gY3JvcEJveC53aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JvcEJveC53aWR0aCA9IGNyb3BCb3guaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5jcm9wQm94ID0gY3JvcEJveDtcbiAgICBzZWxmLmxpbWl0Q3JvcEJveCh0cnVlLCB0cnVlKTtcblxuICAgIC8vIEluaXRpYWxpemUgYXV0byBjcm9wIGFyZWFcbiAgICBjcm9wQm94LndpZHRoID0gTWF0aC5taW4oTWF0aC5tYXgoY3JvcEJveC53aWR0aCwgY3JvcEJveC5taW5XaWR0aCksIGNyb3BCb3gubWF4V2lkdGgpO1xuICAgIGNyb3BCb3guaGVpZ2h0ID0gTWF0aC5taW4oTWF0aC5tYXgoY3JvcEJveC5oZWlnaHQsIGNyb3BCb3gubWluSGVpZ2h0KSwgY3JvcEJveC5tYXhIZWlnaHQpO1xuXG4gICAgLy8gVGhlIHdpZHRoIG9mIGF1dG8gY3JvcCBhcmVhIG11c3QgbGFyZ2UgdGhhbiBcIm1pbldpZHRoXCIsIGFuZCB0aGUgaGVpZ2h0IHRvby4gKCMxNjQpXG4gICAgY3JvcEJveC53aWR0aCA9IE1hdGgubWF4KGNyb3BCb3gubWluV2lkdGgsIGNyb3BCb3gud2lkdGggKiBhdXRvQ3JvcEFyZWEpO1xuICAgIGNyb3BCb3guaGVpZ2h0ID0gTWF0aC5tYXgoY3JvcEJveC5taW5IZWlnaHQsIGNyb3BCb3guaGVpZ2h0ICogYXV0b0Nyb3BBcmVhKTtcbiAgICBjcm9wQm94Lm9sZExlZnQgPSBjcm9wQm94LmxlZnQgPSBjYW52YXMubGVmdCArIChjYW52YXMud2lkdGggLSBjcm9wQm94LndpZHRoKSAvIDI7XG4gICAgY3JvcEJveC5vbGRUb3AgPSBjcm9wQm94LnRvcCA9IGNhbnZhcy50b3AgKyAoY2FudmFzLmhlaWdodCAtIGNyb3BCb3guaGVpZ2h0KSAvIDI7XG5cbiAgICBzZWxmLmluaXRpYWxDcm9wQm94ID0gJC5leHRlbmQoe30sIGNyb3BCb3gpO1xuICB9LFxuICBsaW1pdENyb3BCb3g6IGZ1bmN0aW9uIGxpbWl0Q3JvcEJveChpc1NpemVMaW1pdGVkLCBpc1Bvc2l0aW9uTGltaXRlZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBvcHRpb25zLmFzcGVjdFJhdGlvO1xuICAgIHZhciBjb250YWluZXIgPSBzZWxmLmNvbnRhaW5lcjtcbiAgICB2YXIgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIud2lkdGg7XG4gICAgdmFyIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQ7XG4gICAgdmFyIGNhbnZhcyA9IHNlbGYuY2FudmFzO1xuICAgIHZhciBjcm9wQm94ID0gc2VsZi5jcm9wQm94O1xuICAgIHZhciBsaW1pdGVkID0gc2VsZi5saW1pdGVkO1xuXG4gICAgaWYgKGlzU2l6ZUxpbWl0ZWQpIHtcbiAgICAgIHZhciBtaW5Dcm9wQm94V2lkdGggPSBOdW1iZXIob3B0aW9ucy5taW5Dcm9wQm94V2lkdGgpIHx8IDA7XG4gICAgICB2YXIgbWluQ3JvcEJveEhlaWdodCA9IE51bWJlcihvcHRpb25zLm1pbkNyb3BCb3hIZWlnaHQpIHx8IDA7XG4gICAgICB2YXIgbWF4Q3JvcEJveFdpZHRoID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGgsIGxpbWl0ZWQgPyBjYW52YXMud2lkdGggOiBjb250YWluZXJXaWR0aCk7XG4gICAgICB2YXIgbWF4Q3JvcEJveEhlaWdodCA9IE1hdGgubWluKGNvbnRhaW5lckhlaWdodCwgbGltaXRlZCA/IGNhbnZhcy5oZWlnaHQgOiBjb250YWluZXJIZWlnaHQpO1xuXG4gICAgICAvLyBUaGUgbWluL21heENyb3BCb3hXaWR0aC9IZWlnaHQgbXVzdCBiZSBsZXNzIHRoYW4gY29udGFpbmVyV2lkdGgvSGVpZ2h0XG4gICAgICBtaW5Dcm9wQm94V2lkdGggPSBNYXRoLm1pbihtaW5Dcm9wQm94V2lkdGgsIGNvbnRhaW5lcldpZHRoKTtcbiAgICAgIG1pbkNyb3BCb3hIZWlnaHQgPSBNYXRoLm1pbihtaW5Dcm9wQm94SGVpZ2h0LCBjb250YWluZXJIZWlnaHQpO1xuXG4gICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgaWYgKG1pbkNyb3BCb3hXaWR0aCAmJiBtaW5Dcm9wQm94SGVpZ2h0KSB7XG4gICAgICAgICAgaWYgKG1pbkNyb3BCb3hIZWlnaHQgKiBhc3BlY3RSYXRpbyA+IG1pbkNyb3BCb3hXaWR0aCkge1xuICAgICAgICAgICAgbWluQ3JvcEJveEhlaWdodCA9IG1pbkNyb3BCb3hXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtaW5Dcm9wQm94V2lkdGggPSBtaW5Dcm9wQm94SGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1pbkNyb3BCb3hXaWR0aCkge1xuICAgICAgICAgIG1pbkNyb3BCb3hIZWlnaHQgPSBtaW5Dcm9wQm94V2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmIChtaW5Dcm9wQm94SGVpZ2h0KSB7XG4gICAgICAgICAgbWluQ3JvcEJveFdpZHRoID0gbWluQ3JvcEJveEhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1heENyb3BCb3hIZWlnaHQgKiBhc3BlY3RSYXRpbyA+IG1heENyb3BCb3hXaWR0aCkge1xuICAgICAgICAgIG1heENyb3BCb3hIZWlnaHQgPSBtYXhDcm9wQm94V2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhDcm9wQm94V2lkdGggPSBtYXhDcm9wQm94SGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIG1pbldpZHRoL0hlaWdodCBtdXN0IGJlIGxlc3MgdGhhbiBtYXhXaWR0aC9IZWlnaHRcbiAgICAgIGNyb3BCb3gubWluV2lkdGggPSBNYXRoLm1pbihtaW5Dcm9wQm94V2lkdGgsIG1heENyb3BCb3hXaWR0aCk7XG4gICAgICBjcm9wQm94Lm1pbkhlaWdodCA9IE1hdGgubWluKG1pbkNyb3BCb3hIZWlnaHQsIG1heENyb3BCb3hIZWlnaHQpO1xuICAgICAgY3JvcEJveC5tYXhXaWR0aCA9IG1heENyb3BCb3hXaWR0aDtcbiAgICAgIGNyb3BCb3gubWF4SGVpZ2h0ID0gbWF4Q3JvcEJveEhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoaXNQb3NpdGlvbkxpbWl0ZWQpIHtcbiAgICAgIGlmIChsaW1pdGVkKSB7XG4gICAgICAgIGNyb3BCb3gubWluTGVmdCA9IE1hdGgubWF4KDAsIGNhbnZhcy5sZWZ0KTtcbiAgICAgICAgY3JvcEJveC5taW5Ub3AgPSBNYXRoLm1heCgwLCBjYW52YXMudG9wKTtcbiAgICAgICAgY3JvcEJveC5tYXhMZWZ0ID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGgsIGNhbnZhcy5sZWZ0ICsgY2FudmFzLndpZHRoKSAtIGNyb3BCb3gud2lkdGg7XG4gICAgICAgIGNyb3BCb3gubWF4VG9wID0gTWF0aC5taW4oY29udGFpbmVySGVpZ2h0LCBjYW52YXMudG9wICsgY2FudmFzLmhlaWdodCkgLSBjcm9wQm94LmhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNyb3BCb3gubWluTGVmdCA9IDA7XG4gICAgICAgIGNyb3BCb3gubWluVG9wID0gMDtcbiAgICAgICAgY3JvcEJveC5tYXhMZWZ0ID0gY29udGFpbmVyV2lkdGggLSBjcm9wQm94LndpZHRoO1xuICAgICAgICBjcm9wQm94Lm1heFRvcCA9IGNvbnRhaW5lckhlaWdodCAtIGNyb3BCb3guaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyQ3JvcEJveDogZnVuY3Rpb24gcmVuZGVyQ3JvcEJveCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyIGNvbnRhaW5lciA9IHNlbGYuY29udGFpbmVyO1xuICAgIHZhciBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aDtcbiAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodDtcbiAgICB2YXIgY3JvcEJveCA9IHNlbGYuY3JvcEJveDtcblxuICAgIGlmIChjcm9wQm94LndpZHRoID4gY3JvcEJveC5tYXhXaWR0aCB8fCBjcm9wQm94LndpZHRoIDwgY3JvcEJveC5taW5XaWR0aCkge1xuICAgICAgY3JvcEJveC5sZWZ0ID0gY3JvcEJveC5vbGRMZWZ0O1xuICAgIH1cblxuICAgIGlmIChjcm9wQm94LmhlaWdodCA+IGNyb3BCb3gubWF4SGVpZ2h0IHx8IGNyb3BCb3guaGVpZ2h0IDwgY3JvcEJveC5taW5IZWlnaHQpIHtcbiAgICAgIGNyb3BCb3gudG9wID0gY3JvcEJveC5vbGRUb3A7XG4gICAgfVxuXG4gICAgY3JvcEJveC53aWR0aCA9IE1hdGgubWluKE1hdGgubWF4KGNyb3BCb3gud2lkdGgsIGNyb3BCb3gubWluV2lkdGgpLCBjcm9wQm94Lm1heFdpZHRoKTtcbiAgICBjcm9wQm94LmhlaWdodCA9IE1hdGgubWluKE1hdGgubWF4KGNyb3BCb3guaGVpZ2h0LCBjcm9wQm94Lm1pbkhlaWdodCksIGNyb3BCb3gubWF4SGVpZ2h0KTtcblxuICAgIHNlbGYubGltaXRDcm9wQm94KGZhbHNlLCB0cnVlKTtcblxuICAgIGNyb3BCb3gub2xkTGVmdCA9IGNyb3BCb3gubGVmdCA9IE1hdGgubWluKE1hdGgubWF4KGNyb3BCb3gubGVmdCwgY3JvcEJveC5taW5MZWZ0KSwgY3JvcEJveC5tYXhMZWZ0KTtcbiAgICBjcm9wQm94Lm9sZFRvcCA9IGNyb3BCb3gudG9wID0gTWF0aC5taW4oTWF0aC5tYXgoY3JvcEJveC50b3AsIGNyb3BCb3gubWluVG9wKSwgY3JvcEJveC5tYXhUb3ApO1xuXG4gICAgaWYgKG9wdGlvbnMubW92YWJsZSAmJiBvcHRpb25zLmNyb3BCb3hNb3ZhYmxlKSB7XG4gICAgICAvLyBUdXJuIHRvIG1vdmUgdGhlIGNhbnZhcyB3aGVuIHRoZSBjcm9wIGJveCBpcyBlcXVhbCB0byB0aGUgY29udGFpbmVyXG4gICAgICBzZWxmLiRmYWNlLmRhdGEoJ2FjdGlvbicsIGNyb3BCb3gud2lkdGggPT09IGNvbnRhaW5lcldpZHRoICYmIGNyb3BCb3guaGVpZ2h0ID09PSBjb250YWluZXJIZWlnaHQgPyAnbW92ZScgOiAnYWxsJyk7XG4gICAgfVxuXG4gICAgc2VsZi4kY3JvcEJveC5jc3Moe1xuICAgICAgd2lkdGg6IGNyb3BCb3gud2lkdGgsXG4gICAgICBoZWlnaHQ6IGNyb3BCb3guaGVpZ2h0LFxuICAgICAgdHJhbnNmb3JtOiBnZXRUcmFuc2Zvcm0oe1xuICAgICAgICB0cmFuc2xhdGVYOiBjcm9wQm94LmxlZnQsXG4gICAgICAgIHRyYW5zbGF0ZVk6IGNyb3BCb3gudG9wXG4gICAgICB9KVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGYuY3JvcHBlZCAmJiBzZWxmLmxpbWl0ZWQpIHtcbiAgICAgIHNlbGYubGltaXRDYW52YXModHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLmRpc2FibGVkKSB7XG4gICAgICBzZWxmLm91dHB1dCgpO1xuICAgIH1cbiAgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbiBvdXRwdXQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5wcmV2aWV3KCk7XG5cbiAgICBpZiAoc2VsZi5jb21wbGV0ZWQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignY3JvcCcsIHNlbGYuZ2V0RGF0YSgpKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBEQVRBX1BSRVZJRVcgPSAncHJldmlldyc7XG5cbnZhciBwcmV2aWV3JDEgPSB7XG4gIGluaXRQcmV2aWV3OiBmdW5jdGlvbiBpbml0UHJldmlldygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNyb3NzT3JpZ2luID0gZ2V0Q3Jvc3NPcmlnaW4oc2VsZi5jcm9zc09yaWdpbik7XG4gICAgdmFyIHVybCA9IGNyb3NzT3JpZ2luID8gc2VsZi5jcm9zc09yaWdpblVybCA6IHNlbGYudXJsO1xuICAgIHZhciAkY2xvbmUyID0gdm9pZCAwO1xuXG4gICAgc2VsZi4kcHJldmlldyA9ICQoc2VsZi5vcHRpb25zLnByZXZpZXcpO1xuICAgIHNlbGYuJGNsb25lMiA9ICRjbG9uZTIgPSAkKCc8aW1nICcgKyBjcm9zc09yaWdpbiArICcgc3JjPVwiJyArIHVybCArICdcIj4nKTtcbiAgICBzZWxmLiR2aWV3Qm94Lmh0bWwoJGNsb25lMik7XG4gICAgc2VsZi4kcHJldmlldy5lYWNoKGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAvLyBTYXZlIHRoZSBvcmlnaW5hbCBzaXplIGZvciByZWNvdmVyXG4gICAgICAkdGhpcy5kYXRhKERBVEFfUFJFVklFVywge1xuICAgICAgICB3aWR0aDogJHRoaXMud2lkdGgoKSxcbiAgICAgICAgaGVpZ2h0OiAkdGhpcy5oZWlnaHQoKSxcbiAgICAgICAgaHRtbDogJHRoaXMuaHRtbCgpXG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBPdmVycmlkZSBpbWcgZWxlbWVudCBzdHlsZXNcbiAgICAgICAqIEFkZCBgZGlzcGxheTpibG9ja2AgdG8gYXZvaWQgbWFyZ2luIHRvcCBpc3N1ZVxuICAgICAgICogKE9jY3VyIG9ubHkgd2hlbiBtYXJnaW4tdG9wIDw9IC1oZWlnaHQpXG4gICAgICAgKi9cbiAgICAgICR0aGlzLmh0bWwoJzxpbWcgJyArIGNyb3NzT3JpZ2luICsgJyBzcmM9XCInICsgdXJsICsgJ1wiIHN0eWxlPVwiJyArICdkaXNwbGF5OmJsb2NrO3dpZHRoOjEwMCU7aGVpZ2h0OmF1dG87JyArICdtaW4td2lkdGg6MCFpbXBvcnRhbnQ7bWluLWhlaWdodDowIWltcG9ydGFudDsnICsgJ21heC13aWR0aDpub25lIWltcG9ydGFudDttYXgtaGVpZ2h0Om5vbmUhaW1wb3J0YW50OycgKyAnaW1hZ2Utb3JpZW50YXRpb246MGRlZyFpbXBvcnRhbnQ7XCI+Jyk7XG4gICAgfSk7XG4gIH0sXG4gIHJlc2V0UHJldmlldzogZnVuY3Rpb24gcmVzZXRQcmV2aWV3KCkge1xuICAgIHRoaXMuJHByZXZpZXcuZWFjaChmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgdmFyICR0aGlzID0gJChlbGVtZW50KTtcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YShEQVRBX1BSRVZJRVcpO1xuXG4gICAgICAkdGhpcy5jc3Moe1xuICAgICAgICB3aWR0aDogZGF0YS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkYXRhLmhlaWdodFxuICAgICAgfSkuaHRtbChkYXRhLmh0bWwpLnJlbW92ZURhdGEoREFUQV9QUkVWSUVXKTtcbiAgICB9KTtcbiAgfSxcbiAgcHJldmlldzogZnVuY3Rpb24gcHJldmlldygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGltYWdlID0gc2VsZi5pbWFnZTtcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIGNyb3BCb3ggPSBzZWxmLmNyb3BCb3g7XG4gICAgdmFyIGNyb3BCb3hXaWR0aCA9IGNyb3BCb3gud2lkdGg7XG4gICAgdmFyIGNyb3BCb3hIZWlnaHQgPSBjcm9wQm94LmhlaWdodDtcbiAgICB2YXIgd2lkdGggPSBpbWFnZS53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgIHZhciBsZWZ0ID0gY3JvcEJveC5sZWZ0IC0gY2FudmFzLmxlZnQgLSBpbWFnZS5sZWZ0O1xuICAgIHZhciB0b3AgPSBjcm9wQm94LnRvcCAtIGNhbnZhcy50b3AgLSBpbWFnZS50b3A7XG5cbiAgICBpZiAoIXNlbGYuY3JvcHBlZCB8fCBzZWxmLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi4kY2xvbmUyLmNzcyh7XG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHRyYW5zZm9ybTogZ2V0VHJhbnNmb3JtKCQuZXh0ZW5kKHtcbiAgICAgICAgdHJhbnNsYXRlWDogLWxlZnQsXG4gICAgICAgIHRyYW5zbGF0ZVk6IC10b3BcbiAgICAgIH0sIGltYWdlKSlcbiAgICB9KTtcblxuICAgIHNlbGYuJHByZXZpZXcuZWFjaChmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgdmFyICR0aGlzID0gJChlbGVtZW50KTtcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YShEQVRBX1BSRVZJRVcpO1xuICAgICAgdmFyIG9yaWdpbmFsV2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgdmFyIG9yaWdpbmFsSGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XG4gICAgICB2YXIgbmV3V2lkdGggPSBvcmlnaW5hbFdpZHRoO1xuICAgICAgdmFyIG5ld0hlaWdodCA9IG9yaWdpbmFsSGVpZ2h0O1xuICAgICAgdmFyIHJhdGlvID0gMTtcblxuICAgICAgaWYgKGNyb3BCb3hXaWR0aCkge1xuICAgICAgICByYXRpbyA9IG9yaWdpbmFsV2lkdGggLyBjcm9wQm94V2lkdGg7XG4gICAgICAgIG5ld0hlaWdodCA9IGNyb3BCb3hIZWlnaHQgKiByYXRpbztcbiAgICAgIH1cblxuICAgICAgaWYgKGNyb3BCb3hIZWlnaHQgJiYgbmV3SGVpZ2h0ID4gb3JpZ2luYWxIZWlnaHQpIHtcbiAgICAgICAgcmF0aW8gPSBvcmlnaW5hbEhlaWdodCAvIGNyb3BCb3hIZWlnaHQ7XG4gICAgICAgIG5ld1dpZHRoID0gY3JvcEJveFdpZHRoICogcmF0aW87XG4gICAgICAgIG5ld0hlaWdodCA9IG9yaWdpbmFsSGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICAkdGhpcy5jc3Moe1xuICAgICAgICB3aWR0aDogbmV3V2lkdGgsXG4gICAgICAgIGhlaWdodDogbmV3SGVpZ2h0XG4gICAgICB9KS5maW5kKCdpbWcnKS5jc3Moe1xuICAgICAgICB3aWR0aDogd2lkdGggKiByYXRpbyxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgKiByYXRpbyxcbiAgICAgICAgdHJhbnNmb3JtOiBnZXRUcmFuc2Zvcm0oJC5leHRlbmQoe1xuICAgICAgICAgIHRyYW5zbGF0ZVg6IC1sZWZ0ICogcmF0aW8sXG4gICAgICAgICAgdHJhbnNsYXRlWTogLXRvcCAqIHJhdGlvXG4gICAgICAgIH0sIGltYWdlKSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG4vLyBHbG9iYWxzXG52YXIgUG9pbnRlckV2ZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cuUG9pbnRlckV2ZW50IDogbnVsbDtcblxuLy8gRXZlbnRzXG52YXIgRVZFTlRfUE9JTlRFUl9ET1dOID0gUG9pbnRlckV2ZW50ID8gJ3BvaW50ZXJkb3duJyA6ICd0b3VjaHN0YXJ0IG1vdXNlZG93bic7XG52YXIgRVZFTlRfUE9JTlRFUl9NT1ZFID0gUG9pbnRlckV2ZW50ID8gJ3BvaW50ZXJtb3ZlJyA6ICd0b3VjaG1vdmUgbW91c2Vtb3ZlJztcbnZhciBFVkVOVF9QT0lOVEVSX1VQID0gUG9pbnRlckV2ZW50ID8gJyBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCcgOiAndG91Y2hlbmQgdG91Y2hjYW5jZWwgbW91c2V1cCc7XG52YXIgRVZFTlRfV0hFRUwgPSAnd2hlZWwgbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCc7XG52YXIgRVZFTlRfREJMQ0xJQ0sgPSAnZGJsY2xpY2snO1xudmFyIEVWRU5UX1JFU0laRSA9ICdyZXNpemUnO1xudmFyIEVWRU5UX0NST1BfU1RBUlQgPSAnY3JvcHN0YXJ0JztcbnZhciBFVkVOVF9DUk9QX01PVkUgPSAnY3JvcG1vdmUnO1xudmFyIEVWRU5UX0NST1BfRU5EID0gJ2Nyb3BlbmQnO1xudmFyIEVWRU5UX0NST1AgPSAnY3JvcCc7XG52YXIgRVZFTlRfWk9PTSA9ICd6b29tJztcblxudmFyIGV2ZW50cyA9IHtcbiAgYmluZDogZnVuY3Rpb24gYmluZCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyICR0aGlzID0gc2VsZi4kZWxlbWVudDtcbiAgICB2YXIgJGNyb3BwZXIgPSBzZWxmLiRjcm9wcGVyO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3BzdGFydCkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX0NST1BfU1RBUlQsIG9wdGlvbnMuY3JvcHN0YXJ0KTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuY3JvcG1vdmUpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9DUk9QX01PVkUsIG9wdGlvbnMuY3JvcG1vdmUpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5jcm9wZW5kKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfQ1JPUF9FTkQsIG9wdGlvbnMuY3JvcGVuZCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3ApKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9DUk9QLCBvcHRpb25zLmNyb3ApO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy56b29tKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfWk9PTSwgb3B0aW9ucy56b29tKTtcbiAgICB9XG5cbiAgICAkY3JvcHBlci5vbihFVkVOVF9QT0lOVEVSX0RPV04sIHByb3h5KHNlbGYuY3JvcFN0YXJ0LCB0aGlzKSk7XG5cbiAgICBpZiAob3B0aW9ucy56b29tYWJsZSAmJiBvcHRpb25zLnpvb21PbldoZWVsKSB7XG4gICAgICAkY3JvcHBlci5vbihFVkVOVF9XSEVFTCwgcHJveHkoc2VsZi53aGVlbCwgdGhpcykpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRvZ2dsZURyYWdNb2RlT25EYmxjbGljaykge1xuICAgICAgJGNyb3BwZXIub24oRVZFTlRfREJMQ0xJQ0ssIHByb3h5KHNlbGYuZGJsY2xpY2ssIHRoaXMpKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbihFVkVOVF9QT0lOVEVSX01PVkUsIHNlbGYub25Dcm9wTW92ZSA9IHByb3h5KHNlbGYuY3JvcE1vdmUsIHRoaXMpKS5vbihFVkVOVF9QT0lOVEVSX1VQLCBzZWxmLm9uQ3JvcEVuZCA9IHByb3h5KHNlbGYuY3JvcEVuZCwgdGhpcykpO1xuXG4gICAgaWYgKG9wdGlvbnMucmVzcG9uc2l2ZSkge1xuICAgICAgJCh3aW5kb3cpLm9uKEVWRU5UX1JFU0laRSwgc2VsZi5vblJlc2l6ZSA9IHByb3h5KHNlbGYucmVzaXplLCB0aGlzKSk7XG4gICAgfVxuICB9LFxuICB1bmJpbmQ6IGZ1bmN0aW9uIHVuYmluZCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyICR0aGlzID0gc2VsZi4kZWxlbWVudDtcbiAgICB2YXIgJGNyb3BwZXIgPSBzZWxmLiRjcm9wcGVyO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3BzdGFydCkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9DUk9QX1NUQVJULCBvcHRpb25zLmNyb3BzdGFydCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3Btb3ZlKSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX0NST1BfTU9WRSwgb3B0aW9ucy5jcm9wbW92ZSk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3BlbmQpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfQ1JPUF9FTkQsIG9wdGlvbnMuY3JvcGVuZCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmNyb3ApKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfQ1JPUCwgb3B0aW9ucy5jcm9wKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuem9vbSkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9aT09NLCBvcHRpb25zLnpvb20pO1xuICAgIH1cblxuICAgICRjcm9wcGVyLm9mZihFVkVOVF9QT0lOVEVSX0RPV04sIHNlbGYuY3JvcFN0YXJ0KTtcblxuICAgIGlmIChvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMuem9vbU9uV2hlZWwpIHtcbiAgICAgICRjcm9wcGVyLm9mZihFVkVOVF9XSEVFTCwgc2VsZi53aGVlbCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudG9nZ2xlRHJhZ01vZGVPbkRibGNsaWNrKSB7XG4gICAgICAkY3JvcHBlci5vZmYoRVZFTlRfREJMQ0xJQ0ssIHNlbGYuZGJsY2xpY2spO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9mZihFVkVOVF9QT0lOVEVSX01PVkUsIHNlbGYub25Dcm9wTW92ZSkub2ZmKEVWRU5UX1BPSU5URVJfVVAsIHNlbGYub25Dcm9wRW5kKTtcblxuICAgIGlmIChvcHRpb25zLnJlc3BvbnNpdmUpIHtcbiAgICAgICQod2luZG93KS5vZmYoRVZFTlRfUkVTSVpFLCBzZWxmLm9uUmVzaXplKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBSRUdFWFBfQUNUSU9OUyA9IC9eKGV8d3xzfG58c2V8c3d8bmV8bnd8YWxsfGNyb3B8bW92ZXx6b29tKSQvO1xuXG5mdW5jdGlvbiBnZXRQb2ludGVyKF9yZWYsIGVuZE9ubHkpIHtcbiAgdmFyIHBhZ2VYID0gX3JlZi5wYWdlWCxcbiAgICAgIHBhZ2VZID0gX3JlZi5wYWdlWTtcblxuICB2YXIgZW5kID0ge1xuICAgIGVuZFg6IHBhZ2VYLFxuICAgIGVuZFk6IHBhZ2VZXG4gIH07XG5cbiAgaWYgKGVuZE9ubHkpIHtcbiAgICByZXR1cm4gZW5kO1xuICB9XG5cbiAgcmV0dXJuICQuZXh0ZW5kKHtcbiAgICBzdGFydFg6IHBhZ2VYLFxuICAgIHN0YXJ0WTogcGFnZVlcbiAgfSwgZW5kKTtcbn1cblxudmFyIGhhbmRsZXJzID0ge1xuICByZXNpemU6IGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyICRjb250YWluZXIgPSBzZWxmLiRjb250YWluZXI7XG4gICAgdmFyIGNvbnRhaW5lciA9IHNlbGYuY29udGFpbmVyO1xuICAgIHZhciBtaW5Db250YWluZXJXaWR0aCA9IE51bWJlcihvcHRpb25zLm1pbkNvbnRhaW5lcldpZHRoKSB8fCAyMDA7XG4gICAgdmFyIG1pbkNvbnRhaW5lckhlaWdodCA9IE51bWJlcihvcHRpb25zLm1pbkNvbnRhaW5lckhlaWdodCkgfHwgMTAwO1xuXG4gICAgaWYgKHNlbGYuZGlzYWJsZWQgfHwgY29udGFpbmVyLndpZHRoID09PSBtaW5Db250YWluZXJXaWR0aCB8fCBjb250YWluZXIuaGVpZ2h0ID09PSBtaW5Db250YWluZXJIZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcmF0aW8gPSAkY29udGFpbmVyLndpZHRoKCkgLyBjb250YWluZXIud2lkdGg7XG5cbiAgICAvLyBSZXNpemUgd2hlbiB3aWR0aCBjaGFuZ2VkIG9yIGhlaWdodCBjaGFuZ2VkXG4gICAgaWYgKHJhdGlvICE9PSAxIHx8ICRjb250YWluZXIuaGVpZ2h0KCkgIT09IGNvbnRhaW5lci5oZWlnaHQpIHtcbiAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjYW52YXNEYXRhID0gdm9pZCAwO1xuICAgICAgICB2YXIgY3JvcEJveERhdGEgPSB2b2lkIDA7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVzdG9yZSkge1xuICAgICAgICAgIGNhbnZhc0RhdGEgPSBzZWxmLmdldENhbnZhc0RhdGEoKTtcbiAgICAgICAgICBjcm9wQm94RGF0YSA9IHNlbGYuZ2V0Q3JvcEJveERhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYucmVuZGVyKCk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucmVzdG9yZSkge1xuICAgICAgICAgIHNlbGYuc2V0Q2FudmFzRGF0YSgkLmVhY2goY2FudmFzRGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcbiAgICAgICAgICAgIGNhbnZhc0RhdGFbaV0gPSBuICogcmF0aW87XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHNlbGYuc2V0Q3JvcEJveERhdGEoJC5lYWNoKGNyb3BCb3hEYXRhLCBmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAgICAgY3JvcEJveERhdGFbaV0gPSBuICogcmF0aW87XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH1cbiAgfSxcbiAgZGJsY2xpY2s6IGZ1bmN0aW9uIGRibGNsaWNrKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmRpc2FibGVkIHx8IHNlbGYub3B0aW9ucy5kcmFnTW9kZSA9PT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5zZXREcmFnTW9kZShzZWxmLiRkcmFnQm94Lmhhc0NsYXNzKCdjcm9wcGVyLWNyb3AnKSA/ICdtb3ZlJyA6ICdjcm9wJyk7XG4gIH0sXG4gIHdoZWVsOiBmdW5jdGlvbiB3aGVlbChldmVudCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQ7XG4gICAgdmFyIHJhdGlvID0gTnVtYmVyKHNlbGYub3B0aW9ucy53aGVlbFpvb21SYXRpbykgfHwgMC4xO1xuXG4gICAgaWYgKHNlbGYuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gTGltaXQgd2hlZWwgc3BlZWQgdG8gcHJldmVudCB6b29tIHRvbyBmYXN0XG4gICAgaWYgKHNlbGYud2hlZWxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLndoZWVsaW5nID0gdHJ1ZTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi53aGVlbGluZyA9IGZhbHNlO1xuICAgIH0sIDUwKTtcblxuICAgIHZhciBkZWx0YSA9IDE7XG5cbiAgICBpZiAoZS5kZWx0YVkpIHtcbiAgICAgIGRlbHRhID0gZS5kZWx0YVkgPiAwID8gMSA6IC0xO1xuICAgIH0gZWxzZSBpZiAoZS53aGVlbERlbHRhKSB7XG4gICAgICBkZWx0YSA9IC1lLndoZWVsRGVsdGEgLyAxMjA7XG4gICAgfSBlbHNlIGlmIChlLmRldGFpbCkge1xuICAgICAgZGVsdGEgPSBlLmRldGFpbCA+IDAgPyAxIDogLTE7XG4gICAgfVxuXG4gICAgc2VsZi56b29tKC1kZWx0YSAqIHJhdGlvLCBldmVudCk7XG4gIH0sXG4gIGNyb3BTdGFydDogZnVuY3Rpb24gY3JvcFN0YXJ0KGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgIHZhciBwb2ludGVycyA9IHNlbGYucG9pbnRlcnM7XG4gICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgdmFyIGFjdGlvbiA9IHZvaWQgMDtcblxuICAgIGlmIChvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMpIHtcbiAgICAgIC8vIEhhbmRsZSB0b3VjaCBldmVudFxuICAgICAgJC5lYWNoKG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMsIGZ1bmN0aW9uIChpLCB0b3VjaCkge1xuICAgICAgICBwb2ludGVyc1t0b3VjaC5pZGVudGlmaWVyXSA9IGdldFBvaW50ZXIodG91Y2gpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEhhbmRsZSBtb3VzZSBldmVudCBhbmQgcG9pbnRlciBldmVudFxuICAgICAgcG9pbnRlcnNbb3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LnBvaW50ZXJJZCB8fCAwXSA9IGdldFBvaW50ZXIob3JpZ2luYWxFdmVudCB8fCBlKTtcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0S2V5cyhwb2ludGVycykubGVuZ3RoID4gMSAmJiBvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMuem9vbU9uVG91Y2gpIHtcbiAgICAgIGFjdGlvbiA9ICd6b29tJztcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uID0gJChlLnRhcmdldCkuZGF0YSgnYWN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKCFSRUdFWFBfQUNUSU9OUy50ZXN0KGFjdGlvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50cmlnZ2VyKCdjcm9wc3RhcnQnLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9KS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHNlbGYuYWN0aW9uID0gYWN0aW9uO1xuICAgIHNlbGYuY3JvcHBpbmcgPSBmYWxzZTtcblxuICAgIGlmIChhY3Rpb24gPT09ICdjcm9wJykge1xuICAgICAgc2VsZi5jcm9wcGluZyA9IHRydWU7XG4gICAgICBzZWxmLiRkcmFnQm94LmFkZENsYXNzKCdjcm9wcGVyLW1vZGFsJyk7XG4gICAgfVxuICB9LFxuICBjcm9wTW92ZTogZnVuY3Rpb24gY3JvcE1vdmUoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYWN0aW9uID0gc2VsZi5hY3Rpb247XG5cbiAgICBpZiAoc2VsZi5kaXNhYmxlZCB8fCAhYWN0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBvaW50ZXJzID0gc2VsZi5wb2ludGVycztcbiAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGUub3JpZ2luYWxFdmVudDtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChzZWxmLnRyaWdnZXIoJ2Nyb3Btb3ZlJywge1xuICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgfSkuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAkLmVhY2gob3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcywgZnVuY3Rpb24gKGksIHRvdWNoKSB7XG4gICAgICAgICQuZXh0ZW5kKHBvaW50ZXJzW3RvdWNoLmlkZW50aWZpZXJdLCBnZXRQb2ludGVyKHRvdWNoLCB0cnVlKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5leHRlbmQocG9pbnRlcnNbb3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LnBvaW50ZXJJZCB8fCAwXSwgZ2V0UG9pbnRlcihvcmlnaW5hbEV2ZW50IHx8IGUsIHRydWUpKTtcbiAgICB9XG5cbiAgICBzZWxmLmNoYW5nZShlKTtcbiAgfSxcbiAgY3JvcEVuZDogZnVuY3Rpb24gY3JvcEVuZChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWN0aW9uID0gc2VsZi5hY3Rpb247XG4gICAgdmFyIHBvaW50ZXJzID0gc2VsZi5wb2ludGVycztcbiAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGUub3JpZ2luYWxFdmVudDtcblxuICAgIGlmIChvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMpIHtcbiAgICAgICQuZWFjaChvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzLCBmdW5jdGlvbiAoaSwgdG91Y2gpIHtcbiAgICAgICAgZGVsZXRlIHBvaW50ZXJzW3RvdWNoLmlkZW50aWZpZXJdO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBwb2ludGVyc1tvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQucG9pbnRlcklkIHx8IDBdO1xuICAgIH1cblxuICAgIGlmICghYWN0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKCFvYmplY3RLZXlzKHBvaW50ZXJzKS5sZW5ndGgpIHtcbiAgICAgIHNlbGYuYWN0aW9uID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuY3JvcHBpbmcpIHtcbiAgICAgIHNlbGYuY3JvcHBpbmcgPSBmYWxzZTtcbiAgICAgIHNlbGYuJGRyYWdCb3gudG9nZ2xlQ2xhc3MoJ2Nyb3BwZXItbW9kYWwnLCBzZWxmLmNyb3BwZWQgJiYgc2VsZi5vcHRpb25zLm1vZGFsKTtcbiAgICB9XG5cbiAgICBzZWxmLnRyaWdnZXIoJ2Nyb3BlbmQnLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQWN0aW9uc1xudmFyIEFDVElPTl9FQVNUID0gJ2UnO1xudmFyIEFDVElPTl9XRVNUID0gJ3cnO1xudmFyIEFDVElPTl9TT1VUSCA9ICdzJztcbnZhciBBQ1RJT05fTk9SVEggPSAnbic7XG52YXIgQUNUSU9OX1NPVVRIX0VBU1QgPSAnc2UnO1xudmFyIEFDVElPTl9TT1VUSF9XRVNUID0gJ3N3JztcbnZhciBBQ1RJT05fTk9SVEhfRUFTVCA9ICduZSc7XG52YXIgQUNUSU9OX05PUlRIX1dFU1QgPSAnbncnO1xuXG5mdW5jdGlvbiBnZXRNYXhab29tUmF0aW8ocG9pbnRlcnMpIHtcbiAgdmFyIHBvaW50ZXJzMiA9ICQuZXh0ZW5kKHt9LCBwb2ludGVycyk7XG4gIHZhciByYXRpb3MgPSBbXTtcblxuICAkLmVhY2gocG9pbnRlcnMsIGZ1bmN0aW9uIChwb2ludGVySWQsIHBvaW50ZXIpIHtcbiAgICBkZWxldGUgcG9pbnRlcnMyW3BvaW50ZXJJZF07XG5cbiAgICAkLmVhY2gocG9pbnRlcnMyLCBmdW5jdGlvbiAocG9pbnRlcklkMiwgcG9pbnRlcjIpIHtcbiAgICAgIHZhciB4MSA9IE1hdGguYWJzKHBvaW50ZXIuc3RhcnRYIC0gcG9pbnRlcjIuc3RhcnRYKTtcbiAgICAgIHZhciB5MSA9IE1hdGguYWJzKHBvaW50ZXIuc3RhcnRZIC0gcG9pbnRlcjIuc3RhcnRZKTtcbiAgICAgIHZhciB4MiA9IE1hdGguYWJzKHBvaW50ZXIuZW5kWCAtIHBvaW50ZXIyLmVuZFgpO1xuICAgICAgdmFyIHkyID0gTWF0aC5hYnMocG9pbnRlci5lbmRZIC0gcG9pbnRlcjIuZW5kWSk7XG4gICAgICB2YXIgejEgPSBNYXRoLnNxcnQoeDEgKiB4MSArIHkxICogeTEpO1xuICAgICAgdmFyIHoyID0gTWF0aC5zcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcbiAgICAgIHZhciByYXRpbyA9ICh6MiAtIHoxKSAvIHoxO1xuXG4gICAgICByYXRpb3MucHVzaChyYXRpbyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJhdGlvcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGEpIDwgTWF0aC5hYnMoYik7XG4gIH0pO1xuXG4gIHJldHVybiByYXRpb3NbMF07XG59XG5cbnZhciBjaGFuZ2UkMSA9IHtcbiAgY2hhbmdlOiBmdW5jdGlvbiBjaGFuZ2UoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgcG9pbnRlcnMgPSBzZWxmLnBvaW50ZXJzO1xuICAgIHZhciBwb2ludGVyID0gcG9pbnRlcnNbb2JqZWN0S2V5cyhwb2ludGVycylbMF1dO1xuICAgIHZhciBjb250YWluZXIgPSBzZWxmLmNvbnRhaW5lcjtcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIGNyb3BCb3ggPSBzZWxmLmNyb3BCb3g7XG4gICAgdmFyIGFjdGlvbiA9IHNlbGYuYWN0aW9uO1xuICAgIHZhciBhc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW87XG4gICAgdmFyIHdpZHRoID0gY3JvcEJveC53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gY3JvcEJveC5oZWlnaHQ7XG4gICAgdmFyIGxlZnQgPSBjcm9wQm94LmxlZnQ7XG4gICAgdmFyIHRvcCA9IGNyb3BCb3gudG9wO1xuICAgIHZhciByaWdodCA9IGxlZnQgKyB3aWR0aDtcbiAgICB2YXIgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuICAgIHZhciBtaW5MZWZ0ID0gMDtcbiAgICB2YXIgbWluVG9wID0gMDtcbiAgICB2YXIgbWF4V2lkdGggPSBjb250YWluZXIud2lkdGg7XG4gICAgdmFyIG1heEhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQ7XG4gICAgdmFyIHJlbmRlcmFibGUgPSB0cnVlO1xuICAgIHZhciBvZmZzZXQgPSB2b2lkIDA7XG5cbiAgICAvLyBMb2NraW5nIGFzcGVjdCByYXRpbyBpbiBcImZyZWUgbW9kZVwiIGJ5IGhvbGRpbmcgc2hpZnQga2V5ICgjMjU5KVxuICAgIGlmICghYXNwZWN0UmF0aW8gJiYgZS5zaGlmdEtleSkge1xuICAgICAgYXNwZWN0UmF0aW8gPSB3aWR0aCAmJiBoZWlnaHQgPyB3aWR0aCAvIGhlaWdodCA6IDE7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYubGltaXRlZCkge1xuICAgICAgbWluTGVmdCA9IGNyb3BCb3gubWluTGVmdDtcbiAgICAgIG1pblRvcCA9IGNyb3BCb3gubWluVG9wO1xuICAgICAgbWF4V2lkdGggPSBtaW5MZWZ0ICsgTWF0aC5taW4oY29udGFpbmVyLndpZHRoLCBjYW52YXMud2lkdGgsIGNhbnZhcy5sZWZ0ICsgY2FudmFzLndpZHRoKTtcbiAgICAgIG1heEhlaWdodCA9IG1pblRvcCArIE1hdGgubWluKGNvbnRhaW5lci5oZWlnaHQsIGNhbnZhcy5oZWlnaHQsIGNhbnZhcy50b3AgKyBjYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICB4OiBwb2ludGVyLmVuZFggLSBwb2ludGVyLnN0YXJ0WCxcbiAgICAgIHk6IHBvaW50ZXIuZW5kWSAtIHBvaW50ZXIuc3RhcnRZXG4gICAgfTtcblxuICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgcmFuZ2UuWCA9IHJhbmdlLnkgKiBhc3BlY3RSYXRpbztcbiAgICAgIHJhbmdlLlkgPSByYW5nZS54IC8gYXNwZWN0UmF0aW87XG4gICAgfVxuXG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIC8vIE1vdmUgY3JvcCBib3hcbiAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBSZXNpemUgY3JvcCBib3hcbiAgICAgIGNhc2UgQUNUSU9OX0VBU1Q6XG4gICAgICAgIGlmIChyYW5nZS54ID49IDAgJiYgKHJpZ2h0ID49IG1heFdpZHRoIHx8IGFzcGVjdFJhdGlvICYmICh0b3AgPD0gbWluVG9wIHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB0b3AgLT0gcmFuZ2UuWSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX1dFU1Q7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQUNUSU9OX05PUlRIOlxuICAgICAgICBpZiAocmFuZ2UueSA8PSAwICYmICh0b3AgPD0gbWluVG9wIHx8IGFzcGVjdFJhdGlvICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgcmlnaHQgPj0gbWF4V2lkdGgpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICB0b3AgKz0gcmFuZ2UueTtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIGxlZnQgKz0gcmFuZ2UuWCAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGFjdGlvbiA9IEFDVElPTl9TT1VUSDtcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQUNUSU9OX1dFU1Q6XG4gICAgICAgIGlmIChyYW5nZS54IDw9IDAgJiYgKGxlZnQgPD0gbWluTGVmdCB8fCBhc3BlY3RSYXRpbyAmJiAodG9wIDw9IG1pblRvcCB8fCBib3R0b20gPj0gbWF4SGVpZ2h0KSkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB0b3AgKz0gcmFuZ2UuWSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX0VBU1Q7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQUNUSU9OX1NPVVRIOlxuICAgICAgICBpZiAocmFuZ2UueSA+PSAwICYmIChib3R0b20gPj0gbWF4SGVpZ2h0IHx8IGFzcGVjdFJhdGlvICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgcmlnaHQgPj0gbWF4V2lkdGgpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgbGVmdCAtPSByYW5nZS5YIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX05PUlRIO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBQ1RJT05fTk9SVEhfRUFTVDpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnkgPD0gMCAmJiAodG9wIDw9IG1pblRvcCB8fCByaWdodCA+PSBtYXhXaWR0aCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPj0gMCkge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2UueSA8PSAwICYmIHRvcCA8PSBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyYW5nZS55IDw9IDApIHtcbiAgICAgICAgICAgIGlmICh0b3AgPiBtaW5Ub3ApIHtcbiAgICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDAgJiYgaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGFjdGlvbiA9IEFDVElPTl9TT1VUSF9XRVNUO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIGFjdGlvbiA9IEFDVElPTl9OT1JUSF9XRVNUO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX1NPVVRIX0VBU1Q7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEFDVElPTl9OT1JUSF9XRVNUOlxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwICYmICh0b3AgPD0gbWluVG9wIHx8IGxlZnQgPD0gbWluTGVmdCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgbGVmdCArPSByYW5nZS5YO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54IDw9IDApIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID4gbWluTGVmdCkge1xuICAgICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPD0gMCAmJiB0b3AgPD0gbWluVG9wKSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwKSB7XG4gICAgICAgICAgICBpZiAodG9wID4gbWluVG9wKSB7XG4gICAgICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBhY3Rpb24gPSBBQ1RJT05fU09VVEhfRUFTVDtcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBhY3Rpb24gPSBBQ1RJT05fTk9SVEhfRUFTVDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGFjdGlvbiA9IEFDVElPTl9TT1VUSF9XRVNUO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBQ1RJT05fU09VVEhfV0VTVDpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPD0gMCAmJiAobGVmdCA8PSBtaW5MZWZ0IHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54IDw9IDApIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID4gbWluTGVmdCkge1xuICAgICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPj0gMCAmJiBib3R0b20gPj0gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoYm90dG9tIDwgbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBhY3Rpb24gPSBBQ1RJT05fTk9SVEhfRUFTVDtcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBhY3Rpb24gPSBBQ1RJT05fU09VVEhfRUFTVDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGFjdGlvbiA9IEFDVElPTl9OT1JUSF9XRVNUO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBQ1RJT05fU09VVEhfRUFTVDpcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPj0gMCAmJiAocmlnaHQgPj0gbWF4V2lkdGggfHwgYm90dG9tID49IG1heEhlaWdodCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA+PSAwKSB7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyYW5nZS55ID49IDAgJiYgYm90dG9tID49IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJhbmdlLnkgPj0gMCkge1xuICAgICAgICAgICAgaWYgKGJvdHRvbSA8IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICBoZWlnaHQgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpZHRoIDwgMCAmJiBoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX05PUlRIX1dFU1Q7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgYWN0aW9uID0gQUNUSU9OX1NPVVRIX1dFU1Q7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBhY3Rpb24gPSBBQ1RJT05fTk9SVEhfRUFTVDtcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIE1vdmUgY2FudmFzXG4gICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgc2VsZi5tb3ZlKHJhbmdlLngsIHJhbmdlLnkpO1xuICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBab29tIGNhbnZhc1xuICAgICAgY2FzZSAnem9vbSc6XG4gICAgICAgIHNlbGYuem9vbShnZXRNYXhab29tUmF0aW8ocG9pbnRlcnMpLCBlLm9yaWdpbmFsRXZlbnQpO1xuICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBDcmVhdGUgY3JvcCBib3hcbiAgICAgIGNhc2UgJ2Nyb3AnOlxuICAgICAgICBpZiAoIXJhbmdlLnggfHwgIXJhbmdlLnkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBvZmZzZXQgPSBzZWxmLiRjcm9wcGVyLm9mZnNldCgpO1xuICAgICAgICBsZWZ0ID0gcG9pbnRlci5zdGFydFggLSBvZmZzZXQubGVmdDtcbiAgICAgICAgdG9wID0gcG9pbnRlci5zdGFydFkgLSBvZmZzZXQudG9wO1xuICAgICAgICB3aWR0aCA9IGNyb3BCb3gubWluV2lkdGg7XG4gICAgICAgIGhlaWdodCA9IGNyb3BCb3gubWluSGVpZ2h0O1xuXG4gICAgICAgIGlmIChyYW5nZS54ID4gMCkge1xuICAgICAgICAgIGFjdGlvbiA9IHJhbmdlLnkgPiAwID8gQUNUSU9OX1NPVVRIX0VBU1QgOiBBQ1RJT05fTk9SVEhfRUFTVDtcbiAgICAgICAgfSBlbHNlIGlmIChyYW5nZS54IDwgMCkge1xuICAgICAgICAgIGxlZnQgLT0gd2lkdGg7XG4gICAgICAgICAgYWN0aW9uID0gcmFuZ2UueSA+IDAgPyBBQ1RJT05fU09VVEhfV0VTVCA6IEFDVElPTl9OT1JUSF9XRVNUO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhbmdlLnkgPCAwKSB7XG4gICAgICAgICAgdG9wIC09IGhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNob3cgdGhlIGNyb3AgYm94IGlmIGlzIGhpZGRlblxuICAgICAgICBpZiAoIXNlbGYuY3JvcHBlZCkge1xuICAgICAgICAgIHNlbGYuJGNyb3BCb3gucmVtb3ZlQ2xhc3MoJ2Nyb3BwZXItaGlkZGVuJyk7XG4gICAgICAgICAgc2VsZi5jcm9wcGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzZWxmLmxpbWl0ZWQpIHtcbiAgICAgICAgICAgIHNlbGYubGltaXRDcm9wQm94KHRydWUsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBObyBkZWZhdWx0XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlcmFibGUpIHtcbiAgICAgIGNyb3BCb3gud2lkdGggPSB3aWR0aDtcbiAgICAgIGNyb3BCb3guaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgY3JvcEJveC5sZWZ0ID0gbGVmdDtcbiAgICAgIGNyb3BCb3gudG9wID0gdG9wO1xuICAgICAgc2VsZi5hY3Rpb24gPSBhY3Rpb247XG4gICAgICBzZWxmLnJlbmRlckNyb3BCb3goKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZVxuICAgICQuZWFjaChwb2ludGVycywgZnVuY3Rpb24gKGksIHApIHtcbiAgICAgIHAuc3RhcnRYID0gcC5lbmRYO1xuICAgICAgcC5zdGFydFkgPSBwLmVuZFk7XG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cbnZhciBnZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBzZXQgPSBmdW5jdGlvbiBzZXQob2JqZWN0LCBwcm9wZXJ0eSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgc2V0KHBhcmVudCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjICYmIGRlc2Mud3JpdGFibGUpIHtcbiAgICBkZXNjLnZhbHVlID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNldHRlciA9IGRlc2Muc2V0O1xuXG4gICAgaWYgKHNldHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZXR0ZXIuY2FsbChyZWNlaXZlciwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0UG9pbnRlcnNDZW50ZXIocG9pbnRlcnMpIHtcbiAgdmFyIHBhZ2VYID0gMDtcbiAgdmFyIHBhZ2VZID0gMDtcbiAgdmFyIGNvdW50ID0gMDtcblxuICAkLmVhY2gocG9pbnRlcnMsIGZ1bmN0aW9uIChpLCBfcmVmKSB7XG4gICAgdmFyIHN0YXJ0WCA9IF9yZWYuc3RhcnRYLFxuICAgICAgICBzdGFydFkgPSBfcmVmLnN0YXJ0WTtcblxuICAgIHBhZ2VYICs9IHN0YXJ0WDtcbiAgICBwYWdlWSArPSBzdGFydFk7XG4gICAgY291bnQgKz0gMTtcbiAgfSk7XG5cbiAgcGFnZVggLz0gY291bnQ7XG4gIHBhZ2VZIC89IGNvdW50O1xuXG4gIHJldHVybiB7XG4gICAgcGFnZVg6IHBhZ2VYLFxuICAgIHBhZ2VZOiBwYWdlWVxuICB9O1xufVxuXG52YXIgbWV0aG9kcyA9IHtcbiAgLy8gU2hvdyB0aGUgY3JvcCBib3ggbWFudWFsbHlcbiAgY3JvcDogZnVuY3Rpb24gY3JvcCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYucmVhZHkgfHwgc2VsZi5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc2VsZi5jcm9wcGVkKSB7XG4gICAgICBzZWxmLmNyb3BwZWQgPSB0cnVlO1xuICAgICAgc2VsZi5saW1pdENyb3BCb3godHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMubW9kYWwpIHtcbiAgICAgICAgc2VsZi4kZHJhZ0JveC5hZGRDbGFzcygnY3JvcHBlci1tb2RhbCcpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLiRjcm9wQm94LnJlbW92ZUNsYXNzKCdjcm9wcGVyLWhpZGRlbicpO1xuICAgIH1cblxuICAgIHNlbGYuc2V0Q3JvcEJveERhdGEoc2VsZi5pbml0aWFsQ3JvcEJveCk7XG4gIH0sXG5cblxuICAvLyBSZXNldCB0aGUgaW1hZ2UgYW5kIGNyb3AgYm94IHRvIHRoZWlyIGluaXRpYWwgc3RhdGVzXG4gIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYucmVhZHkgfHwgc2VsZi5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuaW1hZ2UgPSAkLmV4dGVuZCh7fSwgc2VsZi5pbml0aWFsSW1hZ2UpO1xuICAgIHNlbGYuY2FudmFzID0gJC5leHRlbmQoe30sIHNlbGYuaW5pdGlhbENhbnZhcyk7XG4gICAgc2VsZi5jcm9wQm94ID0gJC5leHRlbmQoe30sIHNlbGYuaW5pdGlhbENyb3BCb3gpO1xuXG4gICAgc2VsZi5yZW5kZXJDYW52YXMoKTtcblxuICAgIGlmIChzZWxmLmNyb3BwZWQpIHtcbiAgICAgIHNlbGYucmVuZGVyQ3JvcEJveCgpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8vIENsZWFyIHRoZSBjcm9wIGJveFxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLmNyb3BwZWQgfHwgc2VsZi5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICQuZXh0ZW5kKHNlbGYuY3JvcEJveCwge1xuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfSk7XG5cbiAgICBzZWxmLmNyb3BwZWQgPSBmYWxzZTtcbiAgICBzZWxmLnJlbmRlckNyb3BCb3goKTtcblxuICAgIHNlbGYubGltaXRDYW52YXModHJ1ZSwgdHJ1ZSk7XG5cbiAgICAvLyBSZW5kZXIgY2FudmFzIGFmdGVyIGNyb3AgYm94IHJlbmRlcmVkXG4gICAgc2VsZi5yZW5kZXJDYW52YXMoKTtcblxuICAgIHNlbGYuJGRyYWdCb3gucmVtb3ZlQ2xhc3MoJ2Nyb3BwZXItbW9kYWwnKTtcbiAgICBzZWxmLiRjcm9wQm94LmFkZENsYXNzKCdjcm9wcGVyLWhpZGRlbicpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGltYWdlJ3Mgc3JjIGFuZCByZWJ1aWxkIHRoZSBjcm9wcGVyXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtCb29sZWFufSBvbmx5Q29sb3JDaGFuZ2VkIChvcHRpb25hbClcbiAgICovXG4gIHJlcGxhY2U6IGZ1bmN0aW9uIHJlcGxhY2UodXJsLCBvbmx5Q29sb3JDaGFuZ2VkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLmRpc2FibGVkICYmIHVybCkge1xuICAgICAgaWYgKHNlbGYuaXNJbWcpIHtcbiAgICAgICAgc2VsZi4kZWxlbWVudC5hdHRyKCdzcmMnLCB1cmwpO1xuICAgICAgfVxuXG4gICAgICBpZiAob25seUNvbG9yQ2hhbmdlZCkge1xuICAgICAgICBzZWxmLnVybCA9IHVybDtcbiAgICAgICAgc2VsZi4kY2xvbmUuYXR0cignc3JjJywgdXJsKTtcblxuICAgICAgICBpZiAoc2VsZi5yZWFkeSkge1xuICAgICAgICAgIHNlbGYuJHByZXZpZXcuZmluZCgnaW1nJykuYWRkKHNlbGYuJGNsb25lMikuYXR0cignc3JjJywgdXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGYuaXNJbWcpIHtcbiAgICAgICAgICBzZWxmLnJlcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFyIHByZXZpb3VzIGRhdGFcbiAgICAgICAgc2VsZi5vcHRpb25zLmRhdGEgPSBudWxsO1xuICAgICAgICBzZWxmLmxvYWQodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cblxuICAvLyBFbmFibGUgKHVuZnJlZXplKSB0aGUgY3JvcHBlclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5yZWFkeSkge1xuICAgICAgc2VsZi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgc2VsZi4kY3JvcHBlci5yZW1vdmVDbGFzcygnY3JvcHBlci1kaXNhYmxlZCcpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8vIERpc2FibGUgKGZyZWV6ZSkgdGhlIGNyb3BwZXJcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5yZWFkeSkge1xuICAgICAgc2VsZi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBzZWxmLiRjcm9wcGVyLmFkZENsYXNzKCdjcm9wcGVyLWRpc2FibGVkJyk7XG4gICAgfVxuICB9LFxuXG5cbiAgLy8gRGVzdHJveSB0aGUgY3JvcHBlciBhbmQgcmVtb3ZlIHRoZSBpbnN0YW5jZSBmcm9tIHRoZSBpbWFnZVxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgJHRoaXMgPSBzZWxmLiRlbGVtZW50O1xuXG4gICAgaWYgKHNlbGYubG9hZGVkKSB7XG4gICAgICBpZiAoc2VsZi5pc0ltZyAmJiBzZWxmLnJlcGxhY2VkKSB7XG4gICAgICAgICR0aGlzLmF0dHIoJ3NyYycsIHNlbGYub3JpZ2luYWxVcmwpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnVuYnVpbGQoKTtcbiAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdjcm9wcGVyLWhpZGRlbicpO1xuICAgIH0gZWxzZSBpZiAoc2VsZi5pc0ltZykge1xuICAgICAgJHRoaXMub2ZmKCdsb2FkJywgc2VsZi5zdGFydCk7XG4gICAgfSBlbHNlIGlmIChzZWxmLiRjbG9uZSkge1xuICAgICAgc2VsZi4kY2xvbmUucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgJHRoaXMucmVtb3ZlRGF0YSgnY3JvcHBlcicpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIGNhbnZhcyB3aXRoIHJlbGF0aXZlIG9mZnNldHNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFkgKG9wdGlvbmFsKVxuICAgKi9cbiAgbW92ZTogZnVuY3Rpb24gbW92ZShvZmZzZXRYLCBvZmZzZXRZKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjYW52YXMgPSBzZWxmLmNhbnZhcztcblxuICAgIHNlbGYubW92ZVRvKGlzVW5kZWZpbmVkKG9mZnNldFgpID8gb2Zmc2V0WCA6IGNhbnZhcy5sZWZ0ICsgTnVtYmVyKG9mZnNldFgpLCBpc1VuZGVmaW5lZChvZmZzZXRZKSA/IG9mZnNldFkgOiBjYW52YXMudG9wICsgTnVtYmVyKG9mZnNldFkpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBjYW52YXMgdG8gYW4gYWJzb2x1dGUgcG9pbnRcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgKG9wdGlvbmFsKVxuICAgKi9cbiAgbW92ZVRvOiBmdW5jdGlvbiBtb3ZlVG8oeCwgeSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIGNoYW5nZWQgPSBmYWxzZTtcblxuICAgIC8vIElmIFwieVwiIGlzIG5vdCBwcmVzZW50LCBpdHMgZGVmYXVsdCB2YWx1ZSBpcyBcInhcIlxuICAgIGlmIChpc1VuZGVmaW5lZCh5KSkge1xuICAgICAgeSA9IHg7XG4gICAgfVxuXG4gICAgeCA9IE51bWJlcih4KTtcbiAgICB5ID0gTnVtYmVyKHkpO1xuXG4gICAgaWYgKHNlbGYucmVhZHkgJiYgIXNlbGYuZGlzYWJsZWQgJiYgc2VsZi5vcHRpb25zLm1vdmFibGUpIHtcbiAgICAgIGlmIChpc051bWJlcih4KSkge1xuICAgICAgICBjYW52YXMubGVmdCA9IHg7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNOdW1iZXIoeSkpIHtcbiAgICAgICAgY2FudmFzLnRvcCA9IHk7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICBzZWxmLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogWm9vbSB0aGUgY2FudmFzIHdpdGggYSByZWxhdGl2ZSByYXRpb1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW9cbiAgICogQHBhcmFtIHtqUXVlcnkgRXZlbnR9IF9ldmVudCAocHJpdmF0ZSlcbiAgICovXG4gIHpvb206IGZ1bmN0aW9uIHpvb20ocmF0aW8sIF9ldmVudCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG5cbiAgICByYXRpbyA9IE51bWJlcihyYXRpbyk7XG5cbiAgICBpZiAocmF0aW8gPCAwKSB7XG4gICAgICByYXRpbyA9IDEgLyAoMSAtIHJhdGlvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmF0aW8gPSAxICsgcmF0aW87XG4gICAgfVxuXG4gICAgc2VsZi56b29tVG8oY2FudmFzLndpZHRoICogcmF0aW8gLyBjYW52YXMubmF0dXJhbFdpZHRoLCBfZXZlbnQpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFpvb20gdGhlIGNhbnZhcyB0byBhbiBhYnNvbHV0ZSByYXRpb1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW9cbiAgICogQHBhcmFtIHtqUXVlcnkgRXZlbnR9IF9ldmVudCAocHJpdmF0ZSlcbiAgICovXG4gIHpvb21UbzogZnVuY3Rpb24gem9vbVRvKHJhdGlvLCBfZXZlbnQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyIHBvaW50ZXJzID0gc2VsZi5wb2ludGVycztcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIHdpZHRoID0gY2FudmFzLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgIHZhciBuYXR1cmFsV2lkdGggPSBjYW52YXMubmF0dXJhbFdpZHRoO1xuICAgIHZhciBuYXR1cmFsSGVpZ2h0ID0gY2FudmFzLm5hdHVyYWxIZWlnaHQ7XG5cbiAgICByYXRpbyA9IE51bWJlcihyYXRpbyk7XG5cbiAgICBpZiAocmF0aW8gPj0gMCAmJiBzZWxmLnJlYWR5ICYmICFzZWxmLmRpc2FibGVkICYmIG9wdGlvbnMuem9vbWFibGUpIHtcbiAgICAgIHZhciBuZXdXaWR0aCA9IG5hdHVyYWxXaWR0aCAqIHJhdGlvO1xuICAgICAgdmFyIG5ld0hlaWdodCA9IG5hdHVyYWxIZWlnaHQgKiByYXRpbztcbiAgICAgIHZhciBvcmlnaW5hbEV2ZW50ID0gdm9pZCAwO1xuXG4gICAgICBpZiAoX2V2ZW50KSB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQgPSBfZXZlbnQub3JpZ2luYWxFdmVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYudHJpZ2dlcignem9vbScsIHtcbiAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgb2xkUmF0aW86IHdpZHRoIC8gbmF0dXJhbFdpZHRoLFxuICAgICAgICByYXRpbzogbmV3V2lkdGggLyBuYXR1cmFsV2lkdGhcbiAgICAgIH0pLmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHNlbGYuJGNyb3BwZXIub2Zmc2V0KCk7XG4gICAgICAgIHZhciBjZW50ZXIgPSBwb2ludGVycyAmJiBvYmplY3RLZXlzKHBvaW50ZXJzKS5sZW5ndGggPyBnZXRQb2ludGVyc0NlbnRlcihwb2ludGVycykgOiB7XG4gICAgICAgICAgcGFnZVg6IF9ldmVudC5wYWdlWCB8fCBvcmlnaW5hbEV2ZW50LnBhZ2VYIHx8IDAsXG4gICAgICAgICAgcGFnZVk6IF9ldmVudC5wYWdlWSB8fCBvcmlnaW5hbEV2ZW50LnBhZ2VZIHx8IDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBab29tIGZyb20gdGhlIHRyaWdnZXJpbmcgcG9pbnQgb2YgdGhlIGV2ZW50XG4gICAgICAgIGNhbnZhcy5sZWZ0IC09IChuZXdXaWR0aCAtIHdpZHRoKSAqICgoY2VudGVyLnBhZ2VYIC0gb2Zmc2V0LmxlZnQgLSBjYW52YXMubGVmdCkgLyB3aWR0aCk7XG4gICAgICAgIGNhbnZhcy50b3AgLT0gKG5ld0hlaWdodCAtIGhlaWdodCkgKiAoKGNlbnRlci5wYWdlWSAtIG9mZnNldC50b3AgLSBjYW52YXMudG9wKSAvIGhlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBab29tIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzXG4gICAgICAgIGNhbnZhcy5sZWZ0IC09IChuZXdXaWR0aCAtIHdpZHRoKSAvIDI7XG4gICAgICAgIGNhbnZhcy50b3AgLT0gKG5ld0hlaWdodCAtIGhlaWdodCkgLyAyO1xuICAgICAgfVxuXG4gICAgICBjYW52YXMud2lkdGggPSBuZXdXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgICBzZWxmLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogUm90YXRlIHRoZSBjYW52YXMgd2l0aCBhIHJlbGF0aXZlIGRlZ3JlZVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlXG4gICAqL1xuICByb3RhdGU6IGZ1bmN0aW9uIHJvdGF0ZShkZWdyZWUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJvdGF0ZVRvKChzZWxmLmltYWdlLnJvdGF0ZSB8fCAwKSArIE51bWJlcihkZWdyZWUpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSb3RhdGUgdGhlIGNhbnZhcyB0byBhbiBhYnNvbHV0ZSBkZWdyZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3RyYW5zZm9ybS1mdW5jdGlvbiNyb3RhdGUoKVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlXG4gICAqL1xuICByb3RhdGVUbzogZnVuY3Rpb24gcm90YXRlVG8oZGVncmVlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVncmVlID0gTnVtYmVyKGRlZ3JlZSk7XG5cbiAgICBpZiAoaXNOdW1iZXIoZGVncmVlKSAmJiBzZWxmLnJlYWR5ICYmICFzZWxmLmRpc2FibGVkICYmIHNlbGYub3B0aW9ucy5yb3RhdGFibGUpIHtcbiAgICAgIHNlbGYuaW1hZ2Uucm90YXRlID0gZGVncmVlICUgMzYwO1xuICAgICAgc2VsZi5yb3RhdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGYucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTY2FsZSB0aGUgaW1hZ2VcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3RyYW5zZm9ybS1mdW5jdGlvbiNzY2FsZSgpXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZVhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlWSAob3B0aW9uYWwpXG4gICAqL1xuICBzY2FsZTogZnVuY3Rpb24gc2NhbGUoc2NhbGVYLCBzY2FsZVkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGltYWdlID0gc2VsZi5pbWFnZTtcbiAgICB2YXIgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgLy8gSWYgXCJzY2FsZVlcIiBpcyBub3QgcHJlc2VudCwgaXRzIGRlZmF1bHQgdmFsdWUgaXMgXCJzY2FsZVhcIlxuICAgIGlmIChpc1VuZGVmaW5lZChzY2FsZVkpKSB7XG4gICAgICBzY2FsZVkgPSBzY2FsZVg7XG4gICAgfVxuXG4gICAgc2NhbGVYID0gTnVtYmVyKHNjYWxlWCk7XG4gICAgc2NhbGVZID0gTnVtYmVyKHNjYWxlWSk7XG5cbiAgICBpZiAoc2VsZi5yZWFkeSAmJiAhc2VsZi5kaXNhYmxlZCAmJiBzZWxmLm9wdGlvbnMuc2NhbGFibGUpIHtcbiAgICAgIGlmIChpc051bWJlcihzY2FsZVgpKSB7XG4gICAgICAgIGltYWdlLnNjYWxlWCA9IHNjYWxlWDtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc051bWJlcihzY2FsZVkpKSB7XG4gICAgICAgIGltYWdlLnNjYWxlWSA9IHNjYWxlWTtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgIHNlbGYucmVuZGVySW1hZ2UodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIFNjYWxlIHRoZSBhYnNjaXNzYSBvZiB0aGUgaW1hZ2VcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlWFxuICAgKi9cbiAgc2NhbGVYOiBmdW5jdGlvbiBzY2FsZVgoX3NjYWxlWCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc2NhbGVZID0gc2VsZi5pbWFnZS5zY2FsZVk7XG5cbiAgICBzZWxmLnNjYWxlKF9zY2FsZVgsIGlzTnVtYmVyKHNjYWxlWSkgPyBzY2FsZVkgOiAxKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTY2FsZSB0aGUgb3JkaW5hdGUgb2YgdGhlIGltYWdlXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZVlcbiAgICovXG4gIHNjYWxlWTogZnVuY3Rpb24gc2NhbGVZKF9zY2FsZVkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNjYWxlWCA9IHNlbGYuaW1hZ2Uuc2NhbGVYO1xuXG4gICAgc2VsZi5zY2FsZShpc051bWJlcihzY2FsZVgpID8gc2NhbGVYIDogMSwgX3NjYWxlWSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0IHRoZSBjcm9wcGVkIGFyZWEgcG9zaXRpb24gYW5kIHNpemUgZGF0YSAoYmFzZSBvbiB0aGUgb3JpZ2luYWwgaW1hZ2UpXG4gICAqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSb3VuZGVkIChvcHRpb25hbClcbiAgICogQHJldHVybiB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBnZXREYXRhOiBmdW5jdGlvbiBnZXREYXRhKGlzUm91bmRlZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgaW1hZ2UgPSBzZWxmLmltYWdlO1xuICAgIHZhciBjYW52YXMgPSBzZWxmLmNhbnZhcztcbiAgICB2YXIgY3JvcEJveCA9IHNlbGYuY3JvcEJveDtcbiAgICB2YXIgcmF0aW8gPSB2b2lkIDA7XG4gICAgdmFyIGRhdGEgPSB2b2lkIDA7XG5cbiAgICBpZiAoc2VsZi5yZWFkeSAmJiBzZWxmLmNyb3BwZWQpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIHg6IGNyb3BCb3gubGVmdCAtIGNhbnZhcy5sZWZ0LFxuICAgICAgICB5OiBjcm9wQm94LnRvcCAtIGNhbnZhcy50b3AsXG4gICAgICAgIHdpZHRoOiBjcm9wQm94LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNyb3BCb3guaGVpZ2h0XG4gICAgICB9O1xuXG4gICAgICByYXRpbyA9IGltYWdlLndpZHRoIC8gaW1hZ2UubmF0dXJhbFdpZHRoO1xuXG4gICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcbiAgICAgICAgbiAvPSByYXRpbztcbiAgICAgICAgZGF0YVtpXSA9IGlzUm91bmRlZCA/IE1hdGgucm91bmQobikgOiBuO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucm90YXRhYmxlKSB7XG4gICAgICBkYXRhLnJvdGF0ZSA9IGltYWdlLnJvdGF0ZSB8fCAwO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNjYWxhYmxlKSB7XG4gICAgICBkYXRhLnNjYWxlWCA9IGltYWdlLnNjYWxlWCB8fCAxO1xuICAgICAgZGF0YS5zY2FsZVkgPSBpbWFnZS5zY2FsZVkgfHwgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNyb3BwZWQgYXJlYSBwb3NpdGlvbiBhbmQgc2l6ZSB3aXRoIG5ldyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyIGltYWdlID0gc2VsZi5pbWFnZTtcbiAgICB2YXIgY2FudmFzID0gc2VsZi5jYW52YXM7XG4gICAgdmFyIGNyb3BCb3hEYXRhID0ge307XG4gICAgdmFyIHJvdGF0ZWQgPSB2b2lkIDA7XG4gICAgdmFyIGlzU2NhbGVkID0gdm9pZCAwO1xuICAgIHZhciByYXRpbyA9IHZvaWQgMDtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oZGF0YSkpIHtcbiAgICAgIGRhdGEgPSBkYXRhLmNhbGwoc2VsZi5lbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5yZWFkeSAmJiAhc2VsZi5kaXNhYmxlZCAmJiAkLmlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICAgIGlmIChvcHRpb25zLnJvdGF0YWJsZSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5yb3RhdGUpICYmIGRhdGEucm90YXRlICE9PSBpbWFnZS5yb3RhdGUpIHtcbiAgICAgICAgICBpbWFnZS5yb3RhdGUgPSBkYXRhLnJvdGF0ZTtcbiAgICAgICAgICBzZWxmLnJvdGF0ZWQgPSByb3RhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5zY2FsYWJsZSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5zY2FsZVgpICYmIGRhdGEuc2NhbGVYICE9PSBpbWFnZS5zY2FsZVgpIHtcbiAgICAgICAgICBpbWFnZS5zY2FsZVggPSBkYXRhLnNjYWxlWDtcbiAgICAgICAgICBpc1NjYWxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5zY2FsZVkpICYmIGRhdGEuc2NhbGVZICE9PSBpbWFnZS5zY2FsZVkpIHtcbiAgICAgICAgICBpbWFnZS5zY2FsZVkgPSBkYXRhLnNjYWxlWTtcbiAgICAgICAgICBpc1NjYWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJvdGF0ZWQpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJDYW52YXMoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNTY2FsZWQpIHtcbiAgICAgICAgc2VsZi5yZW5kZXJJbWFnZSgpO1xuICAgICAgfVxuXG4gICAgICByYXRpbyA9IGltYWdlLndpZHRoIC8gaW1hZ2UubmF0dXJhbFdpZHRoO1xuXG4gICAgICBpZiAoaXNOdW1iZXIoZGF0YS54KSkge1xuICAgICAgICBjcm9wQm94RGF0YS5sZWZ0ID0gZGF0YS54ICogcmF0aW8gKyBjYW52YXMubGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzTnVtYmVyKGRhdGEueSkpIHtcbiAgICAgICAgY3JvcEJveERhdGEudG9wID0gZGF0YS55ICogcmF0aW8gKyBjYW52YXMudG9wO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNOdW1iZXIoZGF0YS53aWR0aCkpIHtcbiAgICAgICAgY3JvcEJveERhdGEud2lkdGggPSBkYXRhLndpZHRoICogcmF0aW87XG4gICAgICB9XG5cbiAgICAgIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgY3JvcEJveERhdGEuaGVpZ2h0ID0gZGF0YS5oZWlnaHQgKiByYXRpbztcbiAgICAgIH1cblxuICAgICAgc2VsZi5zZXRDcm9wQm94RGF0YShjcm9wQm94RGF0YSk7XG4gICAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29udGFpbmVyIHNpemUgZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGdldENvbnRhaW5lckRhdGE6IGZ1bmN0aW9uIGdldENvbnRhaW5lckRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkgPyB0aGlzLmNvbnRhaW5lciA6IHt9O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaW1hZ2UgcG9zaXRpb24gYW5kIHNpemUgZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGdldEltYWdlRGF0YTogZnVuY3Rpb24gZ2V0SW1hZ2VEYXRhKCkge1xuICAgIHJldHVybiB0aGlzLmxvYWRlZCA/IHRoaXMuaW1hZ2UgOiB7fTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNhbnZhcyBwb3NpdGlvbiBhbmQgc2l6ZSBkYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgZ2V0Q2FudmFzRGF0YTogZnVuY3Rpb24gZ2V0Q2FudmFzRGF0YSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNhbnZhcyA9IHNlbGYuY2FudmFzO1xuICAgIHZhciBkYXRhID0ge307XG5cbiAgICBpZiAoc2VsZi5yZWFkeSkge1xuICAgICAgJC5lYWNoKFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ25hdHVyYWxXaWR0aCcsICduYXR1cmFsSGVpZ2h0J10sIGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgIGRhdGFbbl0gPSBjYW52YXNbbl07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNhbnZhcyBwb3NpdGlvbiBhbmQgc2l6ZSB3aXRoIG5ldyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBzZXRDYW52YXNEYXRhOiBmdW5jdGlvbiBzZXRDYW52YXNEYXRhKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNhbnZhcyA9IHNlbGYuY2FudmFzO1xuICAgIHZhciBhc3BlY3RSYXRpbyA9IGNhbnZhcy5hc3BlY3RSYXRpbztcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oZGF0YSkpIHtcbiAgICAgIGRhdGEgPSBkYXRhLmNhbGwoc2VsZi4kZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYucmVhZHkgJiYgIXNlbGYuZGlzYWJsZWQgJiYgJC5pc1BsYWluT2JqZWN0KGRhdGEpKSB7XG4gICAgICBpZiAoaXNOdW1iZXIoZGF0YS5sZWZ0KSkge1xuICAgICAgICBjYW52YXMubGVmdCA9IGRhdGEubGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzTnVtYmVyKGRhdGEudG9wKSkge1xuICAgICAgICBjYW52YXMudG9wID0gZGF0YS50b3A7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSkge1xuICAgICAgICBjYW52YXMud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gZGF0YS53aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICBjYW52YXMud2lkdGggPSBkYXRhLmhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0IHRoZSBjcm9wIGJveCBwb3NpdGlvbiBhbmQgc2l6ZSBkYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgZ2V0Q3JvcEJveERhdGE6IGZ1bmN0aW9uIGdldENyb3BCb3hEYXRhKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY3JvcEJveCA9IHNlbGYuY3JvcEJveDtcblxuICAgIHJldHVybiBzZWxmLnJlYWR5ICYmIHNlbGYuY3JvcHBlZCA/IHtcbiAgICAgIGxlZnQ6IGNyb3BCb3gubGVmdCxcbiAgICAgIHRvcDogY3JvcEJveC50b3AsXG4gICAgICB3aWR0aDogY3JvcEJveC53aWR0aCxcbiAgICAgIGhlaWdodDogY3JvcEJveC5oZWlnaHRcbiAgICB9IDoge307XG4gIH0sXG5cblxuICAvKipcbiAgICogU2V0IHRoZSBjcm9wIGJveCBwb3NpdGlvbiBhbmQgc2l6ZSB3aXRoIG5ldyBkYXRhXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBzZXRDcm9wQm94RGF0YTogZnVuY3Rpb24gc2V0Q3JvcEJveERhdGEoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY3JvcEJveCA9IHNlbGYuY3JvcEJveDtcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBzZWxmLm9wdGlvbnMuYXNwZWN0UmF0aW87XG4gICAgdmFyIHdpZHRoQ2hhbmdlZCA9IHZvaWQgMDtcbiAgICB2YXIgaGVpZ2h0Q2hhbmdlZCA9IHZvaWQgMDtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oZGF0YSkpIHtcbiAgICAgIGRhdGEgPSBkYXRhLmNhbGwoc2VsZi4kZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYucmVhZHkgJiYgc2VsZi5jcm9wcGVkICYmICFzZWxmLmRpc2FibGVkICYmICQuaXNQbGFpbk9iamVjdChkYXRhKSkge1xuICAgICAgaWYgKGlzTnVtYmVyKGRhdGEubGVmdCkpIHtcbiAgICAgICAgY3JvcEJveC5sZWZ0ID0gZGF0YS5sZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNOdW1iZXIoZGF0YS50b3ApKSB7XG4gICAgICAgIGNyb3BCb3gudG9wID0gZGF0YS50b3A7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSAmJiBkYXRhLndpZHRoICE9PSBjcm9wQm94LndpZHRoKSB7XG4gICAgICAgIHdpZHRoQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGNyb3BCb3gud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNOdW1iZXIoZGF0YS5oZWlnaHQpICYmIGRhdGEuaGVpZ2h0ICE9PSBjcm9wQm94LmhlaWdodCkge1xuICAgICAgICBoZWlnaHRDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgY3JvcEJveC5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgIGlmICh3aWR0aENoYW5nZWQpIHtcbiAgICAgICAgICBjcm9wQm94LmhlaWdodCA9IGNyb3BCb3gud2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgICAgY3JvcEJveC53aWR0aCA9IGNyb3BCb3guaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5yZW5kZXJDcm9wQm94KCk7XG4gICAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldCBhIGNhbnZhcyBkcmF3biB0aGUgY3JvcHBlZCBpbWFnZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXNcbiAgICovXG4gIGdldENyb3BwZWRDYW52YXM6IGZ1bmN0aW9uIGdldENyb3BwZWRDYW52YXMob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5yZWFkeSB8fCAhd2luZG93LkhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXNlbGYuY3JvcHBlZCkge1xuICAgICAgcmV0dXJuIGdldFNvdXJjZUNhbnZhcyhzZWxmLiRjbG9uZVswXSwgc2VsZi5pbWFnZSk7XG4gICAgfVxuXG4gICAgaWYgKCEkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHNlbGYuZ2V0RGF0YSgpO1xuICAgIHZhciBvcmlnaW5hbFdpZHRoID0gZGF0YS53aWR0aDtcbiAgICB2YXIgb3JpZ2luYWxIZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICB2YXIgYXNwZWN0UmF0aW8gPSBvcmlnaW5hbFdpZHRoIC8gb3JpZ2luYWxIZWlnaHQ7XG4gICAgdmFyIHNjYWxlZFdpZHRoID0gdm9pZCAwO1xuICAgIHZhciBzY2FsZWRIZWlnaHQgPSB2b2lkIDA7XG4gICAgdmFyIHNjYWxlZFJhdGlvID0gdm9pZCAwO1xuXG4gICAgaWYgKCQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgc2NhbGVkV2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgc2NhbGVkSGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG5cbiAgICAgIGlmIChzY2FsZWRXaWR0aCkge1xuICAgICAgICBzY2FsZWRIZWlnaHQgPSBzY2FsZWRXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICBzY2FsZWRSYXRpbyA9IHNjYWxlZFdpZHRoIC8gb3JpZ2luYWxXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAoc2NhbGVkSGVpZ2h0KSB7XG4gICAgICAgIHNjYWxlZFdpZHRoID0gc2NhbGVkSGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIHNjYWxlZFJhdGlvID0gc2NhbGVkSGVpZ2h0IC8gb3JpZ2luYWxIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGNhbnZhcyBlbGVtZW50IHdpbGwgdXNlIGBNYXRoLk1hdGguZmxvb3JgIG9uIGEgZmxvYXQgbnVtYmVyLCBzbyBNYXRoLmZsb29yIGZpcnN0XG4gICAgdmFyIGNhbnZhc1dpZHRoID0gTWF0aC5mbG9vcihzY2FsZWRXaWR0aCB8fCBvcmlnaW5hbFdpZHRoKTtcbiAgICB2YXIgY2FudmFzSGVpZ2h0ID0gTWF0aC5mbG9vcihzY2FsZWRIZWlnaHQgfHwgb3JpZ2luYWxIZWlnaHQpO1xuXG4gICAgdmFyIGNhbnZhcyA9ICQoJzxjYW52YXM+JylbMF07XG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG5cbiAgICBpZiAob3B0aW9ucy5maWxsQ29sb3IpIHtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsQ29sb3I7XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQuZHJhd0ltYWdlXG4gICAgdmFyIHBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc291cmNlID0gZ2V0U291cmNlQ2FudmFzKHNlbGYuJGNsb25lWzBdLCBzZWxmLmltYWdlKTtcbiAgICAgIHZhciBzb3VyY2VXaWR0aCA9IHNvdXJjZS53aWR0aDtcbiAgICAgIHZhciBzb3VyY2VIZWlnaHQgPSBzb3VyY2UuaGVpZ2h0O1xuICAgICAgdmFyIGNhbnZhc0RhdGEgPSBzZWxmLmNhbnZhcztcbiAgICAgIHZhciBwYXJhbXMgPSBbc291cmNlXTtcblxuICAgICAgLy8gU291cmNlIGNhbnZhc1xuICAgICAgdmFyIHNyY1ggPSBkYXRhLnggKyBjYW52YXNEYXRhLm5hdHVyYWxXaWR0aCAqIChNYXRoLmFicyhkYXRhLnNjYWxlWCB8fCAxKSAtIDEpIC8gMjtcbiAgICAgIHZhciBzcmNZID0gZGF0YS55ICsgY2FudmFzRGF0YS5uYXR1cmFsSGVpZ2h0ICogKE1hdGguYWJzKGRhdGEuc2NhbGVZIHx8IDEpIC0gMSkgLyAyO1xuICAgICAgdmFyIHNyY1dpZHRoID0gdm9pZCAwO1xuICAgICAgdmFyIHNyY0hlaWdodCA9IHZvaWQgMDtcblxuICAgICAgLy8gRGVzdGluYXRpb24gY2FudmFzXG4gICAgICB2YXIgZHN0WCA9IHZvaWQgMDtcbiAgICAgIHZhciBkc3RZID0gdm9pZCAwO1xuICAgICAgdmFyIGRzdFdpZHRoID0gdm9pZCAwO1xuICAgICAgdmFyIGRzdEhlaWdodCA9IHZvaWQgMDtcblxuICAgICAgaWYgKHNyY1ggPD0gLW9yaWdpbmFsV2lkdGggfHwgc3JjWCA+IHNvdXJjZVdpZHRoKSB7XG4gICAgICAgIHNyY1ggPSBzcmNXaWR0aCA9IGRzdFggPSBkc3RXaWR0aCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHNyY1ggPD0gMCkge1xuICAgICAgICBkc3RYID0gLXNyY1g7XG4gICAgICAgIHNyY1ggPSAwO1xuICAgICAgICBzcmNXaWR0aCA9IGRzdFdpZHRoID0gTWF0aC5taW4oc291cmNlV2lkdGgsIG9yaWdpbmFsV2lkdGggKyBzcmNYKTtcbiAgICAgIH0gZWxzZSBpZiAoc3JjWCA8PSBzb3VyY2VXaWR0aCkge1xuICAgICAgICBkc3RYID0gMDtcbiAgICAgICAgc3JjV2lkdGggPSBkc3RXaWR0aCA9IE1hdGgubWluKG9yaWdpbmFsV2lkdGgsIHNvdXJjZVdpZHRoIC0gc3JjWCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzcmNXaWR0aCA8PSAwIHx8IHNyY1kgPD0gLW9yaWdpbmFsSGVpZ2h0IHx8IHNyY1kgPiBzb3VyY2VIZWlnaHQpIHtcbiAgICAgICAgc3JjWSA9IHNyY0hlaWdodCA9IGRzdFkgPSBkc3RIZWlnaHQgPSAwO1xuICAgICAgfSBlbHNlIGlmIChzcmNZIDw9IDApIHtcbiAgICAgICAgZHN0WSA9IC1zcmNZO1xuICAgICAgICBzcmNZID0gMDtcbiAgICAgICAgc3JjSGVpZ2h0ID0gZHN0SGVpZ2h0ID0gTWF0aC5taW4oc291cmNlSGVpZ2h0LCBvcmlnaW5hbEhlaWdodCArIHNyY1kpO1xuICAgICAgfSBlbHNlIGlmIChzcmNZIDw9IHNvdXJjZUhlaWdodCkge1xuICAgICAgICBkc3RZID0gMDtcbiAgICAgICAgc3JjSGVpZ2h0ID0gZHN0SGVpZ2h0ID0gTWF0aC5taW4ob3JpZ2luYWxIZWlnaHQsIHNvdXJjZUhlaWdodCAtIHNyY1kpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbGwgdGhlIG51bWVyaWNhbCBwYXJhbWV0ZXJzIHNob3VsZCBiZSBpbnRlZ2VyIGZvciBgZHJhd0ltYWdlYCAoIzQ3NilcbiAgICAgIHBhcmFtcy5wdXNoKE1hdGguZmxvb3Ioc3JjWCksIE1hdGguZmxvb3Ioc3JjWSksIE1hdGguZmxvb3Ioc3JjV2lkdGgpLCBNYXRoLmZsb29yKHNyY0hlaWdodCkpO1xuXG4gICAgICAvLyBTY2FsZSBkZXN0aW5hdGlvbiBzaXplc1xuICAgICAgaWYgKHNjYWxlZFJhdGlvKSB7XG4gICAgICAgIGRzdFggKj0gc2NhbGVkUmF0aW87XG4gICAgICAgIGRzdFkgKj0gc2NhbGVkUmF0aW87XG4gICAgICAgIGRzdFdpZHRoICo9IHNjYWxlZFJhdGlvO1xuICAgICAgICBkc3RIZWlnaHQgKj0gc2NhbGVkUmF0aW87XG4gICAgICB9XG5cbiAgICAgIC8vIEF2b2lkIFwiSW5kZXhTaXplRXJyb3JcIiBpbiBJRSBhbmQgRmlyZWZveFxuICAgICAgaWYgKGRzdFdpZHRoID4gMCAmJiBkc3RIZWlnaHQgPiAwKSB7XG4gICAgICAgIHBhcmFtcy5wdXNoKE1hdGguZmxvb3IoZHN0WCksIE1hdGguZmxvb3IoZHN0WSksIE1hdGguZmxvb3IoZHN0V2lkdGgpLCBNYXRoLmZsb29yKGRzdEhlaWdodCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0oKTtcblxuICAgIGNvbnRleHQuZHJhd0ltYWdlLmFwcGx5KGNvbnRleHQsIHRvQ29uc3VtYWJsZUFycmF5KHBhcmFtZXRlcnMpKTtcblxuICAgIHJldHVybiBjYW52YXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGNyb3AgYm94XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhc3BlY3RSYXRpb1xuICAgKi9cbiAgc2V0QXNwZWN0UmF0aW86IGZ1bmN0aW9uIHNldEFzcGVjdFJhdGlvKGFzcGVjdFJhdGlvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuXG4gICAgaWYgKCFzZWxmLmRpc2FibGVkICYmICFpc1VuZGVmaW5lZChhc3BlY3RSYXRpbykpIHtcbiAgICAgIC8vIDAgLT4gTmFOXG4gICAgICBvcHRpb25zLmFzcGVjdFJhdGlvID0gTWF0aC5tYXgoMCwgYXNwZWN0UmF0aW8pIHx8IE5hTjtcblxuICAgICAgaWYgKHNlbGYucmVhZHkpIHtcbiAgICAgICAgc2VsZi5pbml0Q3JvcEJveCgpO1xuXG4gICAgICAgIGlmIChzZWxmLmNyb3BwZWQpIHtcbiAgICAgICAgICBzZWxmLnJlbmRlckNyb3BCb3goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGRyYWcgbW9kZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSAob3B0aW9uYWwpXG4gICAqL1xuICBzZXREcmFnTW9kZTogZnVuY3Rpb24gc2V0RHJhZ01vZGUobW9kZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgY3JvcHBhYmxlID0gdm9pZCAwO1xuICAgIHZhciBtb3ZhYmxlID0gdm9pZCAwO1xuXG4gICAgaWYgKHNlbGYubG9hZGVkICYmICFzZWxmLmRpc2FibGVkKSB7XG4gICAgICBjcm9wcGFibGUgPSBtb2RlID09PSAnY3JvcCc7XG4gICAgICBtb3ZhYmxlID0gb3B0aW9ucy5tb3ZhYmxlICYmIG1vZGUgPT09ICdtb3ZlJztcbiAgICAgIG1vZGUgPSBjcm9wcGFibGUgfHwgbW92YWJsZSA/IG1vZGUgOiAnbm9uZSc7XG5cbiAgICAgIHNlbGYuJGRyYWdCb3guZGF0YSgnYWN0aW9uJywgbW9kZSkudG9nZ2xlQ2xhc3MoJ2Nyb3BwZXItY3JvcCcsIGNyb3BwYWJsZSkudG9nZ2xlQ2xhc3MoJ2Nyb3BwZXItbW92ZScsIG1vdmFibGUpO1xuXG4gICAgICBpZiAoIW9wdGlvbnMuY3JvcEJveE1vdmFibGUpIHtcbiAgICAgICAgLy8gU3luYyBkcmFnIG1vZGUgdG8gY3JvcCBib3ggd2hlbiBpdCBpcyBub3QgbW92YWJsZSgjMzAwKVxuICAgICAgICBzZWxmLiRmYWNlLmRhdGEoJ2FjdGlvbicsIG1vZGUpLnRvZ2dsZUNsYXNzKCdjcm9wcGVyLWNyb3AnLCBjcm9wcGFibGUpLnRvZ2dsZUNsYXNzKCdjcm9wcGVyLW1vdmUnLCBtb3ZhYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBDTEFTU19ISURERU4gPSAnY3JvcHBlci1oaWRkZW4nO1xudmFyIFJFR0VYUF9EQVRBX1VSTCA9IC9eZGF0YTovO1xudmFyIFJFR0VYUF9EQVRBX1VSTF9KUEVHID0gL15kYXRhOmltYWdlXFwvanBlZztiYXNlNjQsLztcblxudmFyIENyb3BwZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENyb3BwZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENyb3BwZXIpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgc2VsZi5vcHRpb25zID0gJC5leHRlbmQoe30sIERFRkFVTFRTLCAkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykgJiYgb3B0aW9ucyk7XG4gICAgc2VsZi5sb2FkZWQgPSBmYWxzZTtcbiAgICBzZWxmLnJlYWR5ID0gZmFsc2U7XG4gICAgc2VsZi5jb21wbGV0ZWQgPSBmYWxzZTtcbiAgICBzZWxmLnJvdGF0ZWQgPSBmYWxzZTtcbiAgICBzZWxmLmNyb3BwZWQgPSBmYWxzZTtcbiAgICBzZWxmLmRpc2FibGVkID0gZmFsc2U7XG4gICAgc2VsZi5yZXBsYWNlZCA9IGZhbHNlO1xuICAgIHNlbGYubGltaXRlZCA9IGZhbHNlO1xuICAgIHNlbGYud2hlZWxpbmcgPSBmYWxzZTtcbiAgICBzZWxmLmlzSW1nID0gZmFsc2U7XG4gICAgc2VsZi5vcmlnaW5hbFVybCA9ICcnO1xuICAgIHNlbGYuY2FudmFzID0gbnVsbDtcbiAgICBzZWxmLmNyb3BCb3ggPSBudWxsO1xuICAgIHNlbGYucG9pbnRlcnMgPSB7fTtcbiAgICBzZWxmLmluaXQoKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKENyb3BwZXIsIFt7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgJHRoaXMgPSBzZWxmLiRlbGVtZW50O1xuICAgICAgdmFyIHVybCA9IHZvaWQgMDtcblxuICAgICAgaWYgKCR0aGlzLmlzKCdpbWcnKSkge1xuICAgICAgICBzZWxmLmlzSW1nID0gdHJ1ZTtcblxuICAgICAgICAvLyBTaG91bGQgdXNlIGAkLmZuLmF0dHJgIGhlcmUuIGUuZy46IFwiaW1nL3BpY3R1cmUuanBnXCJcbiAgICAgICAgc2VsZi5vcmlnaW5hbFVybCA9IHVybCA9ICR0aGlzLmF0dHIoJ3NyYycpO1xuXG4gICAgICAgIC8vIFN0b3Agd2hlbiBpdCdzIGEgYmxhbmsgaW1hZ2VcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTaG91bGQgdXNlIGAkLmZuLnByb3BgIGhlcmUuIGUuZy46IFwiaHR0cDovL2V4YW1wbGUuY29tL2ltZy9waWN0dXJlLmpwZ1wiXG4gICAgICAgIHVybCA9ICR0aGlzLnByb3AoJ3NyYycpO1xuICAgICAgfSBlbHNlIGlmICgkdGhpcy5pcygnY2FudmFzJykgJiYgd2luZG93LkhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHVybCA9ICR0aGlzWzBdLnRvRGF0YVVSTCgpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLmxvYWQodXJsKTtcbiAgICB9XG5cbiAgICAvLyBBIHNob3J0Y3V0IGZvciB0cmlnZ2VyaW5nIGN1c3RvbSBldmVudHNcblxuICB9LCB7XG4gICAga2V5OiAndHJpZ2dlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIodHlwZSwgZGF0YSkge1xuICAgICAgdmFyIGUgPSAkLkV2ZW50KHR5cGUsIGRhdGEpO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSk7XG5cbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2xvYWQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkKHVybCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICB2YXIgJHRoaXMgPSBzZWxmLiRlbGVtZW50O1xuXG4gICAgICBpZiAoIXVybCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudXJsID0gdXJsO1xuICAgICAgc2VsZi5pbWFnZSA9IHt9O1xuXG4gICAgICBpZiAoIW9wdGlvbnMuY2hlY2tPcmllbnRhdGlvbiB8fCAhQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgc2VsZi5jbG9uZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFhNTEh0dHBSZXF1ZXN0IGRpc2FsbG93cyB0byBvcGVuIGEgRGF0YSBVUkwgaW4gc29tZSBicm93c2VycyBsaWtlIElFMTEgYW5kIFNhZmFyaVxuICAgICAgaWYgKFJFR0VYUF9EQVRBX1VSTC50ZXN0KHVybCkpIHtcbiAgICAgICAgaWYgKFJFR0VYUF9EQVRBX1VSTF9KUEVHLnRlc3QodXJsKSkge1xuICAgICAgICAgIHNlbGYucmVhZChkYXRhVVJMVG9BcnJheUJ1ZmZlcih1cmwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmNsb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vbmVycm9yID0geGhyLm9uYWJvcnQgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5jbG9uZSgpO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiBsb2FkKCkge1xuICAgICAgICBzZWxmLnJlYWQodGhpcy5yZXNwb25zZSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAob3B0aW9ucy5jaGVja0Nyb3NzT3JpZ2luICYmIGlzQ3Jvc3NPcmlnaW5VUkwodXJsKSAmJiAkdGhpcy5wcm9wKCdjcm9zc09yaWdpbicpKSB7XG4gICAgICAgIHVybCA9IGFkZFRpbWVzdGFtcCh1cmwpO1xuICAgICAgfVxuXG4gICAgICB4aHIub3BlbignZ2V0JywgdXJsKTtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICR0aGlzLnByb3AoJ2Nyb3NzT3JpZ2luJykgPT09ICd1c2UtY3JlZGVudGlhbHMnO1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZWFkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVhZChhcnJheUJ1ZmZlcikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICB2YXIgb3JpZW50YXRpb24gPSBnZXRPcmllbnRhdGlvbihhcnJheUJ1ZmZlcik7XG4gICAgICB2YXIgaW1hZ2UgPSBzZWxmLmltYWdlO1xuICAgICAgdmFyIHJvdGF0ZSA9IDA7XG4gICAgICB2YXIgc2NhbGVYID0gMTtcbiAgICAgIHZhciBzY2FsZVkgPSAxO1xuXG4gICAgICBpZiAob3JpZW50YXRpb24gPiAxKSB7XG4gICAgICAgIHNlbGYudXJsID0gYXJyYXlCdWZmZXJUb0RhdGFVUkwoYXJyYXlCdWZmZXIpO1xuXG4gICAgICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcblxuICAgICAgICAgIC8vIGZsaXAgaG9yaXpvbnRhbFxuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHNjYWxlWCA9IC0xO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAvLyByb3RhdGUgbGVmdCAxODDCsFxuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJvdGF0ZSA9IC0xODA7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIC8vIGZsaXAgdmVydGljYWxcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBzY2FsZVkgPSAtMTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgLy8gZmxpcCB2ZXJ0aWNhbCArIHJvdGF0ZSByaWdodCA5MMKwXG4gICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcm90YXRlID0gOTA7XG4gICAgICAgICAgICBzY2FsZVkgPSAtMTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgLy8gcm90YXRlIHJpZ2h0IDkwwrBcbiAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByb3RhdGUgPSA5MDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgLy8gZmxpcCBob3Jpem9udGFsICsgcm90YXRlIHJpZ2h0IDkwwrBcbiAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICByb3RhdGUgPSA5MDtcbiAgICAgICAgICAgIHNjYWxlWCA9IC0xO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAvLyByb3RhdGUgbGVmdCA5MMKwXG4gICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcm90YXRlID0gLTkwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMucm90YXRhYmxlKSB7XG4gICAgICAgIGltYWdlLnJvdGF0ZSA9IHJvdGF0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc2NhbGFibGUpIHtcbiAgICAgICAgaW1hZ2Uuc2NhbGVYID0gc2NhbGVYO1xuICAgICAgICBpbWFnZS5zY2FsZVkgPSBzY2FsZVk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuY2xvbmUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdjbG9uZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICB2YXIgJHRoaXMgPSBzZWxmLiRlbGVtZW50O1xuICAgICAgdmFyIHVybCA9IHNlbGYudXJsO1xuICAgICAgdmFyIGNyb3NzT3JpZ2luID0gJyc7XG4gICAgICB2YXIgY3Jvc3NPcmlnaW5VcmwgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChvcHRpb25zLmNoZWNrQ3Jvc3NPcmlnaW4gJiYgaXNDcm9zc09yaWdpblVSTCh1cmwpKSB7XG4gICAgICAgIGNyb3NzT3JpZ2luID0gJHRoaXMucHJvcCgnY3Jvc3NPcmlnaW4nKTtcblxuICAgICAgICBpZiAoY3Jvc3NPcmlnaW4pIHtcbiAgICAgICAgICBjcm9zc09yaWdpblVybCA9IHVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuXG4gICAgICAgICAgLy8gQnVzdCBjYWNoZSAoIzE0OCkgd2hlbiB0aGVyZSBpcyBub3QgYSBcImNyb3NzT3JpZ2luXCIgcHJvcGVydHlcbiAgICAgICAgICBjcm9zc09yaWdpblVybCA9IGFkZFRpbWVzdGFtcCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuY3Jvc3NPcmlnaW4gPSBjcm9zc09yaWdpbjtcbiAgICAgIHNlbGYuY3Jvc3NPcmlnaW5VcmwgPSBjcm9zc09yaWdpblVybDtcblxuICAgICAgdmFyICRjbG9uZSA9ICQoJzxpbWcgJyArIGdldENyb3NzT3JpZ2luKGNyb3NzT3JpZ2luKSArICcgc3JjPVwiJyArIChjcm9zc09yaWdpblVybCB8fCB1cmwpICsgJ1wiPicpO1xuXG4gICAgICBzZWxmLiRjbG9uZSA9ICRjbG9uZTtcblxuICAgICAgaWYgKHNlbGYuaXNJbWcpIHtcbiAgICAgICAgaWYgKCR0aGlzWzBdLmNvbXBsZXRlKSB7XG4gICAgICAgICAgc2VsZi5zdGFydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR0aGlzLm9uZSgnbG9hZCcsICQucHJveHkoc2VsZi5zdGFydCwgdGhpcykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkY2xvbmUub25lKCdsb2FkJywgJC5wcm94eShzZWxmLnN0YXJ0LCB0aGlzKSkub25lKCdlcnJvcicsICQucHJveHkoc2VsZi5zdG9wLCB0aGlzKSkuYWRkQ2xhc3MoJ2Nyb3BwZXItaGlkZScpLmluc2VydEFmdGVyKCR0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzdGFydCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyICRjbG9uZSA9IHNlbGYuJGNsb25lO1xuICAgICAgdmFyICRpbWFnZSA9IHNlbGYuJGVsZW1lbnQ7XG5cbiAgICAgIGlmICghc2VsZi5pc0ltZykge1xuICAgICAgICAkY2xvbmUub2ZmKCdlcnJvcicsIHNlbGYuc3RvcCk7XG4gICAgICAgICRpbWFnZSA9ICRjbG9uZTtcbiAgICAgIH1cblxuICAgICAgZ2V0SW1hZ2VTaXplKCRpbWFnZVswXSwgZnVuY3Rpb24gKG5hdHVyYWxXaWR0aCwgbmF0dXJhbEhlaWdodCkge1xuICAgICAgICAkLmV4dGVuZChzZWxmLmltYWdlLCB7XG4gICAgICAgICAgbmF0dXJhbFdpZHRoOiBuYXR1cmFsV2lkdGgsXG4gICAgICAgICAgbmF0dXJhbEhlaWdodDogbmF0dXJhbEhlaWdodCxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIHNlbGYuYnVpbGQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0b3AnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLiRjbG9uZS5yZW1vdmUoKTtcbiAgICAgIHNlbGYuJGNsb25lID0gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdidWlsZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGJ1aWxkKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICB2YXIgJHRoaXMgPSBzZWxmLiRlbGVtZW50O1xuICAgICAgdmFyICRjbG9uZSA9IHNlbGYuJGNsb25lO1xuICAgICAgdmFyICRjcm9wcGVyID0gdm9pZCAwO1xuICAgICAgdmFyICRjcm9wQm94ID0gdm9pZCAwO1xuICAgICAgdmFyICRmYWNlID0gdm9pZCAwO1xuXG4gICAgICBpZiAoIXNlbGYubG9hZGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVW5idWlsZCBmaXJzdCB3aGVuIHJlcGxhY2VcbiAgICAgIGlmIChzZWxmLnJlYWR5KSB7XG4gICAgICAgIHNlbGYudW5idWlsZCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgY3JvcHBlciBlbGVtZW50c1xuICAgICAgc2VsZi4kY29udGFpbmVyID0gJHRoaXMucGFyZW50KCk7XG4gICAgICBzZWxmLiRjcm9wcGVyID0gJGNyb3BwZXIgPSAkKFRFTVBMQVRFKTtcbiAgICAgIHNlbGYuJGNhbnZhcyA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLWNhbnZhcycpLmFwcGVuZCgkY2xvbmUpO1xuICAgICAgc2VsZi4kZHJhZ0JveCA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLWRyYWctYm94Jyk7XG4gICAgICBzZWxmLiRjcm9wQm94ID0gJGNyb3BCb3ggPSAkY3JvcHBlci5maW5kKCcuY3JvcHBlci1jcm9wLWJveCcpO1xuICAgICAgc2VsZi4kdmlld0JveCA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLXZpZXctYm94Jyk7XG4gICAgICBzZWxmLiRmYWNlID0gJGZhY2UgPSAkY3JvcEJveC5maW5kKCcuY3JvcHBlci1mYWNlJyk7XG5cbiAgICAgIC8vIEhpZGUgdGhlIG9yaWdpbmFsIGltYWdlXG4gICAgICAkdGhpcy5hZGRDbGFzcyhDTEFTU19ISURERU4pLmFmdGVyKCRjcm9wcGVyKTtcblxuICAgICAgLy8gU2hvdyB0aGUgY2xvbmUgaW1hZ2UgaWYgaXMgaGlkZGVuXG4gICAgICBpZiAoIXNlbGYuaXNJbWcpIHtcbiAgICAgICAgJGNsb25lLnJlbW92ZUNsYXNzKCdjcm9wcGVyLWhpZGUnKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5pbml0UHJldmlldygpO1xuICAgICAgc2VsZi5iaW5kKCk7XG5cbiAgICAgIG9wdGlvbnMuYXNwZWN0UmF0aW8gPSBNYXRoLm1heCgwLCBvcHRpb25zLmFzcGVjdFJhdGlvKSB8fCBOYU47XG4gICAgICBvcHRpb25zLnZpZXdNb2RlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMywgTWF0aC5yb3VuZChvcHRpb25zLnZpZXdNb2RlKSkpIHx8IDA7XG5cbiAgICAgIHNlbGYuY3JvcHBlZCA9IG9wdGlvbnMuYXV0b0Nyb3A7XG5cbiAgICAgIGlmIChvcHRpb25zLmF1dG9Dcm9wKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm1vZGFsKSB7XG4gICAgICAgICAgc2VsZi4kZHJhZ0JveC5hZGRDbGFzcygnY3JvcHBlci1tb2RhbCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkY3JvcEJveC5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9wdGlvbnMuZ3VpZGVzKSB7XG4gICAgICAgICRjcm9wQm94LmZpbmQoJy5jcm9wcGVyLWRhc2hlZCcpLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICB9XG5cbiAgICAgIGlmICghb3B0aW9ucy5jZW50ZXIpIHtcbiAgICAgICAgJGNyb3BCb3guZmluZCgnLmNyb3BwZXItY2VudGVyJykuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY3JvcEJveE1vdmFibGUpIHtcbiAgICAgICAgJGZhY2UuYWRkQ2xhc3MoJ2Nyb3BwZXItbW92ZScpLmRhdGEoJ2FjdGlvbicsICdhbGwnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgICAkZmFjZS5hZGRDbGFzcygnY3JvcHBlci1pbnZpc2libGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZCkge1xuICAgICAgICAkY3JvcHBlci5hZGRDbGFzcygnY3JvcHBlci1iZycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9wdGlvbnMuY3JvcEJveFJlc2l6YWJsZSkge1xuICAgICAgICAkY3JvcEJveC5maW5kKCcuY3JvcHBlci1saW5lLCAuY3JvcHBlci1wb2ludCcpLmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc2V0RHJhZ01vZGUob3B0aW9ucy5kcmFnTW9kZSk7XG4gICAgICBzZWxmLnJlbmRlcigpO1xuICAgICAgc2VsZi5yZWFkeSA9IHRydWU7XG4gICAgICBzZWxmLnNldERhdGEob3B0aW9ucy5kYXRhKTtcblxuICAgICAgLy8gVHJpZ2dlciB0aGUgcmVhZHkgZXZlbnQgYXN5bmNocm9ub3VzbHkgdG8ga2VlcCBgZGF0YSgnY3JvcHBlcicpYCBpcyBkZWZpbmVkXG4gICAgICBzZWxmLmNvbXBsZXRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLnJlYWR5KSkge1xuICAgICAgICAgICR0aGlzLm9uZSgncmVhZHknLCBvcHRpb25zLnJlYWR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVhZHknKTtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdjcm9wJywgc2VsZi5nZXREYXRhKCkpO1xuICAgICAgICBzZWxmLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1bmJ1aWxkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5idWlsZCgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKCFzZWxmLnJlYWR5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzZWxmLmNvbXBsZXRlZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoc2VsZi5jb21wbGV0aW5nKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5yZWFkeSA9IGZhbHNlO1xuICAgICAgc2VsZi5jb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgIHNlbGYuaW5pdGlhbEltYWdlID0gbnVsbDtcblxuICAgICAgLy8gQ2xlYXIgYGluaXRpYWxDYW52YXNgIGlzIG5lY2Vzc2FyeSB3aGVuIHJlcGxhY2VcbiAgICAgIHNlbGYuaW5pdGlhbENhbnZhcyA9IG51bGw7XG4gICAgICBzZWxmLmluaXRpYWxDcm9wQm94ID0gbnVsbDtcbiAgICAgIHNlbGYuY29udGFpbmVyID0gbnVsbDtcbiAgICAgIHNlbGYuY2FudmFzID0gbnVsbDtcblxuICAgICAgLy8gQ2xlYXIgYGNyb3BCb3hgIGlzIG5lY2Vzc2FyeSB3aGVuIHJlcGxhY2VcbiAgICAgIHNlbGYuY3JvcEJveCA9IG51bGw7XG4gICAgICBzZWxmLnVuYmluZCgpO1xuXG4gICAgICBzZWxmLnJlc2V0UHJldmlldygpO1xuICAgICAgc2VsZi4kcHJldmlldyA9IG51bGw7XG5cbiAgICAgIHNlbGYuJHZpZXdCb3ggPSBudWxsO1xuICAgICAgc2VsZi4kY3JvcEJveCA9IG51bGw7XG4gICAgICBzZWxmLiRkcmFnQm94ID0gbnVsbDtcbiAgICAgIHNlbGYuJGNhbnZhcyA9IG51bGw7XG4gICAgICBzZWxmLiRjb250YWluZXIgPSBudWxsO1xuXG4gICAgICBzZWxmLiRjcm9wcGVyLnJlbW92ZSgpO1xuICAgICAgc2VsZi4kY3JvcHBlciA9IG51bGw7XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6ICdzZXREZWZhdWx0cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERlZmF1bHRzKG9wdGlvbnMpIHtcbiAgICAgICQuZXh0ZW5kKERFRkFVTFRTLCAkLmlzUGxhaW5PYmplY3Qob3B0aW9ucykgJiYgb3B0aW9ucyk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBDcm9wcGVyO1xufSgpO1xuXG4kLmV4dGVuZChDcm9wcGVyLnByb3RvdHlwZSwgcmVuZGVyJDEpO1xuJC5leHRlbmQoQ3JvcHBlci5wcm90b3R5cGUsIHByZXZpZXckMSk7XG4kLmV4dGVuZChDcm9wcGVyLnByb3RvdHlwZSwgZXZlbnRzKTtcbiQuZXh0ZW5kKENyb3BwZXIucHJvdG90eXBlLCBoYW5kbGVycyk7XG4kLmV4dGVuZChDcm9wcGVyLnByb3RvdHlwZSwgY2hhbmdlJDEpO1xuJC5leHRlbmQoQ3JvcHBlci5wcm90b3R5cGUsIG1ldGhvZHMpO1xuXG52YXIgTkFNRVNQQUNFID0gJ2Nyb3BwZXInO1xudmFyIE90aGVyQ3JvcHBlciA9ICQuZm4uY3JvcHBlcjtcblxuJC5mbi5jcm9wcGVyID0gZnVuY3Rpb24galF1ZXJ5Q3JvcHBlcihvcHRpb24pIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gdm9pZCAwO1xuXG4gIHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgIHZhciAkdGhpcyA9ICQoZWxlbWVudCk7XG4gICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKE5BTUVTUEFDRSk7XG5cbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGlmICgvZGVzdHJveS8udGVzdChvcHRpb24pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJHRoaXMuZGF0YSgpLCAkLmlzUGxhaW5PYmplY3Qob3B0aW9uKSAmJiBvcHRpb24pO1xuICAgICAgJHRoaXMuZGF0YShOQU1FU1BBQ0UsIGRhdGEgPSBuZXcgQ3JvcHBlcihlbGVtZW50LCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgZm4gPSBkYXRhW29wdGlvbl07XG5cbiAgICAgIGlmICgkLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGRhdGEsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnID8gcmVzdWx0IDogdGhpcztcbn07XG5cbiQuZm4uY3JvcHBlci5Db25zdHJ1Y3RvciA9IENyb3BwZXI7XG4kLmZuLmNyb3BwZXIuc2V0RGVmYXVsdHMgPSBDcm9wcGVyLnNldERlZmF1bHRzO1xuXG4vLyBObyBjb25mbGljdFxuJC5mbi5jcm9wcGVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAkLmZuLmNyb3BwZXIgPSBPdGhlckNyb3BwZXI7XG4gIHJldHVybiB0aGlzO1xufTtcblxufSkpKTtcbiIsIi8qIVxuICogQ3JvcHBlciB2MC4xMC4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmVuZ3l1YW5jaGVuL2Nyb3BwZXJcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSBGZW5neXVhbiBDaGVuIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICpcbiAqIERhdGU6IDIwMTUtMDYtMDhUMTQ6NTc6MjYuMzUzWlxuICovXG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlIC8gQ29tbW9uSlNcbiAgICBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMuXG4gICAgZmFjdG9yeShqUXVlcnkpO1xuICB9XG59KShmdW5jdGlvbiAoJCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpLFxuICAgICAgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24sXG5cbiAgICAgIC8vIENvbnN0YW50c1xuICAgICAgQ1JPUFBFUl9OQU1FU1BBQ0UgPSAnLmNyb3BwZXInLFxuICAgICAgQ1JPUFBFUl9QUkVWSUVXID0gJ3ByZXZpZXcnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG5cbiAgICAgIC8vIFJlZ0V4cHNcbiAgICAgIFJFR0VYUF9EUkFHX1RZUEVTID0gL14oZXxufHd8c3xuZXxud3xzd3xzZXxhbGx8Y3JvcHxtb3ZlfHpvb20pJC8sXG5cbiAgICAgIC8vIENsYXNzZXNcbiAgICAgIENMQVNTX01PREFMID0gJ2Nyb3BwZXItbW9kYWwnLFxuICAgICAgQ0xBU1NfSElERSA9ICdjcm9wcGVyLWhpZGUnLFxuICAgICAgQ0xBU1NfSElEREVOID0gJ2Nyb3BwZXItaGlkZGVuJyxcbiAgICAgIENMQVNTX0lOVklTSUJMRSA9ICdjcm9wcGVyLWludmlzaWJsZScsXG4gICAgICBDTEFTU19NT1ZFID0gJ2Nyb3BwZXItbW92ZScsXG4gICAgICBDTEFTU19DUk9QID0gJ2Nyb3BwZXItY3JvcCcsXG4gICAgICBDTEFTU19ESVNBQkxFRCA9ICdjcm9wcGVyLWRpc2FibGVkJyxcbiAgICAgIENMQVNTX0JHID0gJ2Nyb3BwZXItYmcnLFxuXG4gICAgICAvLyBFdmVudHNcbiAgICAgIEVWRU5UX01PVVNFX0RPV04gPSAnbW91c2Vkb3duIHRvdWNoc3RhcnQnLFxuICAgICAgRVZFTlRfTU9VU0VfTU9WRSA9ICdtb3VzZW1vdmUgdG91Y2htb3ZlJyxcbiAgICAgIEVWRU5UX01PVVNFX1VQID0gJ21vdXNldXAgbW91c2VsZWF2ZSB0b3VjaGVuZCB0b3VjaGxlYXZlIHRvdWNoY2FuY2VsJyxcbiAgICAgIEVWRU5UX1dIRUVMID0gJ3doZWVsIG1vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwnLFxuICAgICAgRVZFTlRfREJMQ0xJQ0sgPSAnZGJsY2xpY2snLFxuICAgICAgRVZFTlRfUkVTSVpFID0gJ3Jlc2l6ZScgKyBDUk9QUEVSX05BTUVTUEFDRSwgLy8gQmluZCB0byB3aW5kb3cgd2l0aCBuYW1lc3BhY2VcbiAgICAgIEVWRU5UX0JVSUxEID0gJ2J1aWxkJyArIENST1BQRVJfTkFNRVNQQUNFLFxuICAgICAgRVZFTlRfQlVJTFQgPSAnYnVpbHQnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9EUkFHX1NUQVJUID0gJ2RyYWdzdGFydCcgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX0RSQUdfTU9WRSA9ICdkcmFnbW92ZScgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX0RSQUdfRU5EID0gJ2RyYWdlbmQnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9aT09NX0lOID0gJ3pvb21pbicgKyBDUk9QUEVSX05BTUVTUEFDRSxcbiAgICAgIEVWRU5UX1pPT01fT1VUID0gJ3pvb21vdXQnICsgQ1JPUFBFUl9OQU1FU1BBQ0UsXG4gICAgICBFVkVOVF9DSEFOR0UgPSAnY2hhbmdlJyArIENST1BQRVJfTkFNRVNQQUNFLFxuXG4gICAgICAvLyBTdXBwb3J0c1xuICAgICAgU1VQUE9SVF9DQU5WQVMgPSAkLmlzRnVuY3Rpb24oJCgnPGNhbnZhcz4nKVswXS5nZXRDb250ZXh0KSxcblxuICAgICAgLy8gT3RoZXJzXG4gICAgICBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgICAgbWluID0gTWF0aC5taW4sXG4gICAgICBtYXggPSBNYXRoLm1heCxcbiAgICAgIGFicyA9IE1hdGguYWJzLFxuICAgICAgc2luID0gTWF0aC5zaW4sXG4gICAgICBjb3MgPSBNYXRoLmNvcyxcbiAgICAgIG51bSA9IHBhcnNlRmxvYXQsXG5cbiAgICAgIC8vIFByb3RvdHlwZVxuICAgICAgcHJvdG90eXBlID0ge307XG5cbiAgZnVuY3Rpb24gaXNOdW1iZXIobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ3VuZGVmaW5lZCc7XG4gIH1cblxuICBmdW5jdGlvbiB0b0FycmF5KG9iaiwgb2Zmc2V0KSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgIGlmIChpc051bWJlcihvZmZzZXQpKSB7IC8vIEl0J3MgbmVjZXNzYXJ5IGZvciBJRThcbiAgICAgIGFyZ3MucHVzaChvZmZzZXQpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmdzLnNsaWNlLmFwcGx5KG9iaiwgYXJncyk7XG4gIH1cblxuICAvLyBDdXN0b20gcHJveHkgdG8gYXZvaWQgalF1ZXJ5J3MgZ3VpZFxuICBmdW5jdGlvbiBwcm94eShmbiwgY29udGV4dCkge1xuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdCh0b0FycmF5KGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNDcm9zc09yaWdpblVSTCh1cmwpIHtcbiAgICB2YXIgcGFydHMgPSB1cmwubWF0Y2goL14oaHR0cHM/OilcXC9cXC8oW15cXDpcXC9cXD8jXSspOj8oXFxkKikvaSk7XG5cbiAgICByZXR1cm4gcGFydHMgJiYgKHBhcnRzWzFdICE9PSBsb2NhdGlvbi5wcm90b2NvbCB8fCBwYXJ0c1syXSAhPT0gbG9jYXRpb24uaG9zdG5hbWUgfHwgcGFydHNbM10gIT09IGxvY2F0aW9uLnBvcnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGltZXN0YW1wKHVybCkge1xuICAgIHZhciB0aW1lc3RhbXAgPSAndGltZXN0YW1wPScgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgcmV0dXJuICh1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgdGltZXN0YW1wKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJvdGF0ZVZhbHVlKGRlZ3JlZSkge1xuICAgIHJldHVybiBkZWdyZWUgPyAncm90YXRlKCcgKyBkZWdyZWUgKyAnZGVnKScgOiAnbm9uZSc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSb3RhdGVkU2l6ZXMoZGF0YSwgcmV2ZXJzZSkge1xuICAgIHZhciBkZWcgPSBhYnMoZGF0YS5kZWdyZWUpICUgMTgwLFxuICAgICAgICBhcmMgPSAoZGVnID4gOTAgPyAoMTgwIC0gZGVnKSA6IGRlZykgKiBNYXRoLlBJIC8gMTgwLFxuICAgICAgICBzaW5BcmMgPSBzaW4oYXJjKSxcbiAgICAgICAgY29zQXJjID0gY29zKGFyYyksXG4gICAgICAgIHdpZHRoID0gZGF0YS53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gZGF0YS5oZWlnaHQsXG4gICAgICAgIGFzcGVjdFJhdGlvID0gZGF0YS5hc3BlY3RSYXRpbyxcbiAgICAgICAgbmV3V2lkdGgsXG4gICAgICAgIG5ld0hlaWdodDtcblxuICAgIGlmICghcmV2ZXJzZSkge1xuICAgICAgbmV3V2lkdGggPSB3aWR0aCAqIGNvc0FyYyArIGhlaWdodCAqIHNpbkFyYztcbiAgICAgIG5ld0hlaWdodCA9IHdpZHRoICogc2luQXJjICsgaGVpZ2h0ICogY29zQXJjO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdXaWR0aCA9IHdpZHRoIC8gKGNvc0FyYyArIHNpbkFyYyAvIGFzcGVjdFJhdGlvKTtcbiAgICAgIG5ld0hlaWdodCA9IG5ld1dpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiBuZXdXaWR0aCxcbiAgICAgIGhlaWdodDogbmV3SGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNvdXJjZUNhbnZhcyhpbWFnZSwgZGF0YSkge1xuICAgIHZhciBjYW52YXMgPSAkKCc8Y2FudmFzPicpWzBdLFxuICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyksXG4gICAgICAgIHdpZHRoID0gZGF0YS5uYXR1cmFsV2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGRhdGEubmF0dXJhbEhlaWdodCxcbiAgICAgICAgcm90YXRlID0gZGF0YS5yb3RhdGUsXG4gICAgICAgIHJvdGF0ZWQgPSBnZXRSb3RhdGVkU2l6ZXMoe1xuICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICBkZWdyZWU6IHJvdGF0ZVxuICAgICAgICB9KTtcblxuICAgIGlmIChyb3RhdGUpIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHJvdGF0ZWQud2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gcm90YXRlZC5oZWlnaHQ7XG4gICAgICBjb250ZXh0LnNhdmUoKTtcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKHJvdGF0ZWQud2lkdGggLyAyLCByb3RhdGVkLmhlaWdodCAvIDIpO1xuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRlICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgLXdpZHRoIC8gMiwgLWhlaWdodCAvIDIsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgZnVuY3Rpb24gQ3JvcHBlcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIENyb3BwZXIuREVGQVVMVFMsICQuaXNQbGFpbk9iamVjdChvcHRpb25zKSAmJiBvcHRpb25zKTtcblxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLmJ1aWx0ID0gZmFsc2U7XG4gICAgdGhpcy5yb3RhdGVkID0gZmFsc2U7XG4gICAgdGhpcy5jcm9wcGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcbiAgICB0aGlzLmNyb3BCb3ggPSBudWxsO1xuXG4gICAgdGhpcy5sb2FkKCk7XG4gIH1cblxuICBwcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgJHRoaXMgPSB0aGlzLiRlbGVtZW50LFxuICAgICAgICBjcm9zc09yaWdpbixcbiAgICAgICAgYnVzdENhY2hlVXJsLFxuICAgICAgICBidWlsZEV2ZW50LFxuICAgICAgICAkY2xvbmU7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgaWYgKCR0aGlzLmlzKCdpbWcnKSkge1xuICAgICAgICBpZiAoISR0aGlzLmF0dHIoJ3NyYycpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsID0gJHRoaXMucHJvcCgnc3JjJyk7XG4gICAgICB9IGVsc2UgaWYgKCR0aGlzLmlzKCdjYW52YXMnKSAmJiBTVVBQT1JUX0NBTlZBUykge1xuICAgICAgICB1cmwgPSAkdGhpc1swXS50b0RhdGFVUkwoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJ1aWxkRXZlbnQgPSAkLkV2ZW50KEVWRU5UX0JVSUxEKTtcblxuICAgIGlmKCR0aGlzLm9uZShFVkVOVF9CVUlMRCwgb3B0aW9ucy5idWlsZCkudHJpZ2dlcil7XG4gICAgICAkdGhpcy5vbmUoRVZFTlRfQlVJTEQsIG9wdGlvbnMuYnVpbGQpLnRyaWdnZXIoYnVpbGRFdmVudCk7IC8vIE9ubHkgdHJpZ2dlciBvbmNlXG4gICAgfVxuXG4gICAgaWYgKGJ1aWxkRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5jaGVja0ltYWdlT3JpZ2luICYmIGlzQ3Jvc3NPcmlnaW5VUkwodXJsKSkge1xuICAgICAgY3Jvc3NPcmlnaW4gPSAnIGNyb3NzT3JpZ2luPVwiYW5vbnltb3VzXCInO1xuXG4gICAgICBpZiAoISR0aGlzLnByb3AoJ2Nyb3NzT3JpZ2luJykpIHsgLy8gT25seSB3aGVuIHRoZXJlIHdhcyBub3QgYSBcImNyb3NzT3JpZ2luXCIgcHJvcGVydHlcbiAgICAgICAgYnVzdENhY2hlVXJsID0gYWRkVGltZXN0YW1wKHVybCk7IC8vIEJ1c3QgY2FjaGUgKCMxNDgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSUU4IGNvbXBhdGliaWxpdHk6IERvbid0IHVzZSBcIiQoKS5hdHRyKClcIiB0byBzZXQgXCJzcmNcIlxuICAgIHRoaXMuJGNsb25lID0gJGNsb25lID0gJCgnPGltZycgKyAoY3Jvc3NPcmlnaW4gfHwgJycpICsgJyBzcmM9XCInICsgKGJ1c3RDYWNoZVVybCB8fCB1cmwpICsgJ1wiPicpO1xuXG4gICAgJGNsb25lLm9uZSgnbG9hZCcsICQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGltYWdlID0gJGNsb25lWzBdLFxuICAgICAgICAgIG5hdHVyYWxXaWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aCB8fCBpbWFnZS53aWR0aCxcbiAgICAgICAgICBuYXR1cmFsSGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodCB8fCBpbWFnZS5oZWlnaHQ7IC8vICRjbG9uZS53aWR0aCgpIGFuZCAkY2xvbmUuaGVpZ2h0KCkgd2lsbCByZXR1cm4gMCBpbiBJRTggKCMzMTkpXG5cbiAgICAgIHRoaXMuaW1hZ2UgPSB7XG4gICAgICAgIG5hdHVyYWxXaWR0aDogbmF0dXJhbFdpZHRoLFxuICAgICAgICBuYXR1cmFsSGVpZ2h0OiBuYXR1cmFsSGVpZ2h0LFxuICAgICAgICBhc3BlY3RSYXRpbzogbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodCxcbiAgICAgICAgcm90YXRlOiAwXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5idWlsZCgpO1xuICAgIH0sIHRoaXMpKS5vbmUoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgJGNsb25lLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gSGlkZSBhbmQgaW5zZXJ0IGludG8gdGhlIGRvY3VtZW50XG4gICAgJGNsb25lLmFkZENsYXNzKENMQVNTX0hJREUpLmluc2VydEFmdGVyKCR0aGlzKTtcbiAgfTtcblxuICBwcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgJGNsb25lID0gdGhpcy4kY2xvbmUsXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICRjcm9wcGVyLFxuICAgICAgICAkY3JvcEJveCxcbiAgICAgICAgJGZhY2U7XG5cbiAgICBpZiAoIXRoaXMucmVhZHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5idWlsdCkge1xuICAgICAgdGhpcy51bmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGNyb3BwZXIgZWxlbWVudHNcbiAgICB0aGlzLiRjcm9wcGVyID0gJGNyb3BwZXIgPSAkKENyb3BwZXIuVEVNUExBVEUpO1xuXG4gICAgLy8gSGlkZSB0aGUgb3JpZ2luYWwgaW1hZ2VcbiAgICAkdGhpcy5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuXG4gICAgLy8gU2hvdyB0aGUgY2xvbmUgaWFtZ2VcbiAgICAkY2xvbmUucmVtb3ZlQ2xhc3MoQ0xBU1NfSElERSk7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkdGhpcy5wYXJlbnQoKS5hcHBlbmQoJGNyb3BwZXIpO1xuICAgIHRoaXMuJGNhbnZhcyA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLWNhbnZhcycpLmFwcGVuZCgkY2xvbmUpO1xuICAgIHRoaXMuJGRyYWdCb3ggPSAkY3JvcHBlci5maW5kKCcuY3JvcHBlci1kcmFnLWJveCcpO1xuICAgIHRoaXMuJGNyb3BCb3ggPSAkY3JvcEJveCA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLWNyb3AtYm94Jyk7XG4gICAgdGhpcy4kdmlld0JveCA9ICRjcm9wcGVyLmZpbmQoJy5jcm9wcGVyLXZpZXctYm94Jyk7XG4gICAgdGhpcy4kZmFjZSA9ICRmYWNlID0gJGNyb3BCb3guZmluZCgnLmNyb3BwZXItZmFjZScpO1xuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmluaXRQcmV2aWV3KCk7XG5cbiAgICAvLyBGb3JtYXQgYXNwZWN0IHJhdGlvXG4gICAgb3B0aW9ucy5hc3BlY3RSYXRpbyA9IG51bShvcHRpb25zLmFzcGVjdFJhdGlvKSB8fCBOYU47IC8vIDAgLT4gTmFOXG5cbiAgICBpZiAob3B0aW9ucy5hdXRvQ3JvcCkge1xuICAgICAgdGhpcy5jcm9wcGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKG9wdGlvbnMubW9kYWwpIHtcbiAgICAgICAgdGhpcy4kZHJhZ0JveC5hZGRDbGFzcyhDTEFTU19NT0RBTCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICRjcm9wQm94LmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZCkge1xuICAgICAgJGNyb3BwZXIuYWRkQ2xhc3MoQ0xBU1NfQkcpO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICRmYWNlLmFkZENsYXNzKENMQVNTX0lOVklTSUJMRSk7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLmd1aWRlcykge1xuICAgICAgJGNyb3BCb3guZmluZCgnLmNyb3BwZXItZGFzaGVkJykuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5jcm9wQm94TW92YWJsZSkge1xuICAgICAgJGZhY2UuYWRkQ2xhc3MoQ0xBU1NfTU9WRSkuZGF0YSgnZHJhZycsICdhbGwnKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuY3JvcEJveFJlc2l6YWJsZSkge1xuICAgICAgJGNyb3BCb3guZmluZCgnLmNyb3BwZXItbGluZSwgLmNyb3BwZXItcG9pbnQnKS5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0RHJhZ01vZGUob3B0aW9ucy5kcmFnQ3JvcCA/ICdjcm9wJyA6IG9wdGlvbnMubW92YWJsZSA/ICdtb3ZlJyA6ICdub25lJyk7XG5cbiAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMuc2V0RGF0YShvcHRpb25zLmRhdGEpO1xuICAgIGlmKCR0aGlzLm9uZShFVkVOVF9CVUlMVCwgb3B0aW9ucy5idWlsdCkudHJpZ2dlcil7XG4gICAgICAkdGhpcy5vbmUoRVZFTlRfQlVJTFQsIG9wdGlvbnMuYnVpbHQpLnRyaWdnZXIoRVZFTlRfQlVJTFQpOyAvLyBPbmx5IHRyaWdnZXIgb25jZVxuICAgIH1cbiAgfTtcblxuICBwcm90b3R5cGUudW5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuYnVpbHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWx0ID0gZmFsc2U7XG4gICAgdGhpcy5pbml0aWFsSW1hZ2UgPSBudWxsO1xuICAgIHRoaXMuaW5pdGlhbENhbnZhcyA9IG51bGw7IC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHdoZW4gcmVwbGFjZVxuICAgIHRoaXMuaW5pdGlhbENyb3BCb3ggPSBudWxsO1xuICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhcyA9IG51bGw7XG4gICAgdGhpcy5jcm9wQm94ID0gbnVsbDsgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgd2hlbiByZXBsYWNlXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoKTtcblxuICAgIHRoaXMucmVzZXRQcmV2aWV3KCk7XG4gICAgdGhpcy4kcHJldmlldyA9IG51bGw7XG5cbiAgICB0aGlzLiR2aWV3Qm94ID0gbnVsbDtcbiAgICB0aGlzLiRjcm9wQm94ID0gbnVsbDtcbiAgICB0aGlzLiRkcmFnQm94ID0gbnVsbDtcbiAgICB0aGlzLiRjYW52YXMgPSBudWxsO1xuICAgIHRoaXMuJGNvbnRhaW5lciA9IG51bGw7XG5cbiAgICB0aGlzLiRjcm9wcGVyLnJlbW92ZSgpO1xuICAgIHRoaXMuJGNyb3BwZXIgPSBudWxsO1xuICB9O1xuXG4gICQuZXh0ZW5kKHByb3RvdHlwZSwge1xuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5pbml0Q29udGFpbmVyKCk7XG4gICAgICB0aGlzLmluaXRDYW52YXMoKTtcbiAgICAgIHRoaXMuaW5pdENyb3BCb3goKTtcblxuICAgICAgdGhpcy5yZW5kZXJDYW52YXMoKTtcblxuICAgICAgaWYgKHRoaXMuY3JvcHBlZCkge1xuICAgICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgICAkY29udGFpbmVyID0gdGhpcy4kY29udGFpbmVyLFxuICAgICAgICAgICRjcm9wcGVyID0gdGhpcy4kY3JvcHBlcixcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAkY3JvcHBlci5hZGRDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoQ0xBU1NfSElEREVOKTtcblxuICAgICAgJGNyb3BwZXIuY3NzKCh0aGlzLmNvbnRhaW5lciA9IHtcbiAgICAgICAgd2lkdGg6IG1heCgkY29udGFpbmVyLndpZHRoKCksIG51bShvcHRpb25zLm1pbkNvbnRhaW5lcldpZHRoKSB8fCAyMDApLFxuICAgICAgICBoZWlnaHQ6IG1heCgkY29udGFpbmVyLmhlaWdodCgpLCBudW0ob3B0aW9ucy5taW5Db250YWluZXJIZWlnaHQpIHx8IDEwMClcbiAgICAgIH0pKTtcblxuICAgICAgJHRoaXMuYWRkQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgICRjcm9wcGVyLnJlbW92ZUNsYXNzKENMQVNTX0hJRERFTik7XG4gICAgfSxcblxuICAgIC8vIGltYWdlIGJveCAod3JhcHBlcilcbiAgICBpbml0Q2FudmFzOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIud2lkdGgsXG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSBpbWFnZS5hc3BlY3RSYXRpbyxcbiAgICAgICAgICBjYW52YXMgPSB7XG4gICAgICAgICAgICBhc3BlY3RSYXRpbzogYXNwZWN0UmF0aW8sXG4gICAgICAgICAgICB3aWR0aDogY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGNvbnRhaW5lckhlaWdodFxuICAgICAgICAgIH07XG5cbiAgICAgIGlmIChjb250YWluZXJIZWlnaHQgKiBhc3BlY3RSYXRpbyA+IGNvbnRhaW5lcldpZHRoKSB7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBjb250YWluZXJXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gY29udGFpbmVySGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICB9XG5cbiAgICAgIGNhbnZhcy5vbGRMZWZ0ID0gY2FudmFzLmxlZnQgPSAoY29udGFpbmVyV2lkdGggLSBjYW52YXMud2lkdGgpIC8gMjtcbiAgICAgIGNhbnZhcy5vbGRUb3AgPSBjYW52YXMudG9wID0gKGNvbnRhaW5lckhlaWdodCAtIGNhbnZhcy5oZWlnaHQpIC8gMjtcblxuICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICB0aGlzLmxpbWl0Q2FudmFzKHRydWUsIHRydWUpO1xuICAgICAgdGhpcy5pbml0aWFsSW1hZ2UgPSAkLmV4dGVuZCh7fSwgaW1hZ2UpO1xuICAgICAgdGhpcy5pbml0aWFsQ2FudmFzID0gJC5leHRlbmQoe30sIGNhbnZhcyk7XG4gICAgfSxcblxuICAgIGxpbWl0Q2FudmFzOiBmdW5jdGlvbiAoc2l6ZSwgcG9zaXRpb24pIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0LFxuICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLndpZHRoLFxuICAgICAgICAgIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5oZWlnaHQsXG4gICAgICAgICAgY2FudmFzID0gdGhpcy5jYW52YXMsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSBjYW52YXMuYXNwZWN0UmF0aW8sXG4gICAgICAgICAgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgICBjcm9wcGVkID0gdGhpcy5jcm9wcGVkICYmIGNyb3BCb3gsXG4gICAgICAgICAgaW5pdGlhbENhbnZhcyA9IHRoaXMuaW5pdGlhbENhbnZhcyB8fCBjYW52YXMsXG4gICAgICAgICAgaW5pdGlhbENhbnZhc1dpZHRoID0gaW5pdGlhbENhbnZhcy53aWR0aCxcbiAgICAgICAgICBpbml0aWFsQ2FudmFzSGVpZ2h0ID0gaW5pdGlhbENhbnZhcy5oZWlnaHQsXG4gICAgICAgICAgbWluQ2FudmFzV2lkdGgsXG4gICAgICAgICAgbWluQ2FudmFzSGVpZ2h0O1xuXG4gICAgICBpZiAoc2l6ZSkge1xuICAgICAgICBtaW5DYW52YXNXaWR0aCA9IG51bShvcHRpb25zLm1pbkNhbnZhc1dpZHRoKSB8fCAwO1xuICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBudW0ob3B0aW9ucy5taW5DYW52YXNIZWlnaHQpIHx8IDA7XG5cbiAgICAgICAgaWYgKG1pbkNhbnZhc1dpZHRoKSB7XG4gICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBtYXgoY3JvcHBlZCA/IGNyb3BCb3gud2lkdGggOiBpbml0aWFsQ2FudmFzV2lkdGgsIG1pbkNhbnZhc1dpZHRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBtaW5DYW52YXNXaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2UgaWYgKG1pbkNhbnZhc0hlaWdodCkge1xuICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IG1heChjcm9wcGVkID8gY3JvcEJveC5oZWlnaHQgOiBpbml0aWFsQ2FudmFzSGVpZ2h0LCBtaW5DYW52YXNIZWlnaHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1pbkNhbnZhc1dpZHRoID0gbWluQ2FudmFzSGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgaWYgKGNyb3BwZWQpIHtcbiAgICAgICAgICAgIG1pbkNhbnZhc1dpZHRoID0gY3JvcEJveC53aWR0aDtcbiAgICAgICAgICAgIG1pbkNhbnZhc0hlaWdodCA9IGNyb3BCb3guaGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAobWluQ2FudmFzSGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBtaW5DYW52YXNXaWR0aCkge1xuICAgICAgICAgICAgICBtaW5DYW52YXNXaWR0aCA9IG1pbkNhbnZhc0hlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWluQ2FudmFzSGVpZ2h0ID0gbWluQ2FudmFzV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWluQ2FudmFzV2lkdGggPSBpbml0aWFsQ2FudmFzV2lkdGg7XG4gICAgICAgICAgICBtaW5DYW52YXNIZWlnaHQgPSBpbml0aWFsQ2FudmFzSGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQuZXh0ZW5kKGNhbnZhcywge1xuICAgICAgICAgIG1pbldpZHRoOiBtaW5DYW52YXNXaWR0aCxcbiAgICAgICAgICBtaW5IZWlnaHQ6IG1pbkNhbnZhc0hlaWdodCxcbiAgICAgICAgICBtYXhXaWR0aDogSW5maW5pdHksXG4gICAgICAgICAgbWF4SGVpZ2h0OiBJbmZpbml0eVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICBpZiAoY3JvcHBlZCkge1xuICAgICAgICAgICAgY2FudmFzLm1pbkxlZnQgPSBtaW4oY3JvcEJveC5sZWZ0LCAoY3JvcEJveC5sZWZ0ICsgY3JvcEJveC53aWR0aCkgLSBjYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgY2FudmFzLm1pblRvcCA9IG1pbihjcm9wQm94LnRvcCwgKGNyb3BCb3gudG9wICsgY3JvcEJveC5oZWlnaHQpIC0gY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICBjYW52YXMubWF4TGVmdCA9IGNyb3BCb3gubGVmdDtcbiAgICAgICAgICAgIGNhbnZhcy5tYXhUb3AgPSBjcm9wQm94LnRvcDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzLm1pbkxlZnQgPSBtaW4oMCwgY29udGFpbmVyV2lkdGggLSBjYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgY2FudmFzLm1pblRvcCA9IG1pbigwLCBjb250YWluZXJIZWlnaHQgLSBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNhbnZhcy5tYXhMZWZ0ID0gbWF4KDAsIGNvbnRhaW5lcldpZHRoIC0gY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgIGNhbnZhcy5tYXhUb3AgPSBtYXgoMCwgY29udGFpbmVySGVpZ2h0IC0gY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbnZhcy5taW5MZWZ0ID0gLWNhbnZhcy53aWR0aDtcbiAgICAgICAgICBjYW52YXMubWluVG9wID0gLWNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLm1heExlZnQgPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgICBjYW52YXMubWF4VG9wID0gY29udGFpbmVySGVpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlckNhbnZhczogZnVuY3Rpb24gKGNoYW5nZWQpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgICBhc3BlY3RSYXRpbyxcbiAgICAgICAgICByb3RhdGVkO1xuXG4gICAgICBpZiAodGhpcy5yb3RhdGVkKSB7XG4gICAgICAgIHRoaXMucm90YXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIENvbXB1dGVzIHJvdGF0YXRpb24gc2l6ZXMgd2l0aCBpbWFnZSBzaXplc1xuICAgICAgICByb3RhdGVkID0gZ2V0Um90YXRlZFNpemVzKHtcbiAgICAgICAgICB3aWR0aDogaW1hZ2Uud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgZGVncmVlOiBpbWFnZS5yb3RhdGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNwZWN0UmF0aW8gPSByb3RhdGVkLndpZHRoIC8gcm90YXRlZC5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvICE9PSBjYW52YXMuYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBjYW52YXMubGVmdCAtPSAocm90YXRlZC53aWR0aCAtIGNhbnZhcy53aWR0aCkgLyAyO1xuICAgICAgICAgIGNhbnZhcy50b3AgLT0gKHJvdGF0ZWQuaGVpZ2h0IC0gY2FudmFzLmhlaWdodCkgLyAyO1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJvdGF0ZWQud2lkdGg7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJvdGF0ZWQuaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5hc3BlY3RSYXRpbyA9IGFzcGVjdFJhdGlvO1xuICAgICAgICAgIHRoaXMubGltaXRDYW52YXModHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjYW52YXMud2lkdGggPiBjYW52YXMubWF4V2lkdGggfHwgY2FudmFzLndpZHRoIDwgY2FudmFzLm1pbldpZHRoKSB7XG4gICAgICAgIGNhbnZhcy5sZWZ0ID0gY2FudmFzLm9sZExlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYW52YXMuaGVpZ2h0ID4gY2FudmFzLm1heEhlaWdodCB8fCBjYW52YXMuaGVpZ2h0IDwgY2FudmFzLm1pbkhlaWdodCkge1xuICAgICAgICBjYW52YXMudG9wID0gY2FudmFzLm9sZFRvcDtcbiAgICAgIH1cblxuICAgICAgY2FudmFzLndpZHRoID0gbWluKG1heChjYW52YXMud2lkdGgsIGNhbnZhcy5taW5XaWR0aCksIGNhbnZhcy5tYXhXaWR0aCk7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gbWluKG1heChjYW52YXMuaGVpZ2h0LCBjYW52YXMubWluSGVpZ2h0KSwgY2FudmFzLm1heEhlaWdodCk7XG5cbiAgICAgIHRoaXMubGltaXRDYW52YXMoZmFsc2UsIHRydWUpO1xuXG4gICAgICBjYW52YXMub2xkTGVmdCA9IGNhbnZhcy5sZWZ0ID0gbWluKG1heChjYW52YXMubGVmdCwgY2FudmFzLm1pbkxlZnQpLCBjYW52YXMubWF4TGVmdCk7XG4gICAgICBjYW52YXMub2xkVG9wID0gY2FudmFzLnRvcCA9IG1pbihtYXgoY2FudmFzLnRvcCwgY2FudmFzLm1pblRvcCksIGNhbnZhcy5tYXhUb3ApO1xuXG4gICAgICB0aGlzLiRjYW52YXMuY3NzKHtcbiAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgICBsZWZ0OiBjYW52YXMubGVmdCxcbiAgICAgICAgdG9wOiBjYW52YXMudG9wXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZW5kZXJJbWFnZSgpO1xuXG4gICAgICBpZiAodGhpcy5jcm9wcGVkICYmIG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgIHRoaXMubGltaXRDcm9wQm94KHRydWUsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICB0aGlzLm91dHB1dCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXJJbWFnZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgICByZXZlcnNlZDtcblxuICAgICAgaWYgKGltYWdlLnJvdGF0ZSkge1xuICAgICAgICByZXZlcnNlZCA9IGdldFJvdGF0ZWRTaXplcyh7XG4gICAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHQsXG4gICAgICAgICAgZGVncmVlOiBpbWFnZS5yb3RhdGUsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IGltYWdlLmFzcGVjdFJhdGlvXG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAkLmV4dGVuZChpbWFnZSwgcmV2ZXJzZWQgPyB7XG4gICAgICAgIHdpZHRoOiByZXZlcnNlZC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXZlcnNlZC5oZWlnaHQsXG4gICAgICAgIGxlZnQ6IChjYW52YXMud2lkdGggLSByZXZlcnNlZC53aWR0aCkgLyAyLFxuICAgICAgICB0b3A6IChjYW52YXMuaGVpZ2h0IC0gcmV2ZXJzZWQuaGVpZ2h0KSAvIDJcbiAgICAgIH0gOiB7XG4gICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgICB9KTtcblxuICAgICAgdGhpcy4kY2xvbmUuY3NzKHtcbiAgICAgICAgd2lkdGg6IGltYWdlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGltYWdlLmhlaWdodCxcbiAgICAgICAgbWFyZ2luTGVmdDogaW1hZ2UubGVmdCxcbiAgICAgICAgbWFyZ2luVG9wOiBpbWFnZS50b3AsXG4gICAgICAgIHRyYW5zZm9ybTogZ2V0Um90YXRlVmFsdWUoaW1hZ2Uucm90YXRlKVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRDcm9wQm94OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBhc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW8sXG4gICAgICAgICAgYXV0b0Nyb3BBcmVhID0gbnVtKG9wdGlvbnMuYXV0b0Nyb3BBcmVhKSB8fCAwLjgsXG4gICAgICAgICAgY3JvcEJveCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHRcbiAgICAgICAgICB9O1xuXG4gICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgaWYgKGNhbnZhcy5oZWlnaHQgKiBhc3BlY3RSYXRpbyA+IGNhbnZhcy53aWR0aCkge1xuICAgICAgICAgIGNyb3BCb3guaGVpZ2h0ID0gY3JvcEJveC53aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNyb3BCb3gud2lkdGggPSBjcm9wQm94LmhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JvcEJveCA9IGNyb3BCb3g7XG4gICAgICB0aGlzLmxpbWl0Q3JvcEJveCh0cnVlLCB0cnVlKTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSBhdXRvIGNyb3AgYXJlYVxuICAgICAgY3JvcEJveC53aWR0aCA9IG1pbihtYXgoY3JvcEJveC53aWR0aCwgY3JvcEJveC5taW5XaWR0aCksIGNyb3BCb3gubWF4V2lkdGgpO1xuICAgICAgY3JvcEJveC5oZWlnaHQgPSBtaW4obWF4KGNyb3BCb3guaGVpZ2h0LCBjcm9wQm94Lm1pbkhlaWdodCksIGNyb3BCb3gubWF4SGVpZ2h0KTtcblxuICAgICAgLy8gVGhlIHdpZHRoIG9mIGF1dG8gY3JvcCBhcmVhIG11c3QgbGFyZ2UgdGhhbiBcIm1pbldpZHRoXCIsIGFuZCB0aGUgaGVpZ2h0IHRvby4gKCMxNjQpXG4gICAgICBjcm9wQm94LndpZHRoID0gbWF4KGNyb3BCb3gubWluV2lkdGgsIGNyb3BCb3gud2lkdGggKiBhdXRvQ3JvcEFyZWEpO1xuICAgICAgY3JvcEJveC5oZWlnaHQgPSBtYXgoY3JvcEJveC5taW5IZWlnaHQsIGNyb3BCb3guaGVpZ2h0ICogYXV0b0Nyb3BBcmVhKTtcbiAgICAgIGNyb3BCb3gub2xkTGVmdCA9IGNyb3BCb3gubGVmdCA9IGNhbnZhcy5sZWZ0ICsgKGNhbnZhcy53aWR0aCAtIGNyb3BCb3gud2lkdGgpIC8gMjtcbiAgICAgIGNyb3BCb3gub2xkVG9wID0gY3JvcEJveC50b3AgPSBjYW52YXMudG9wICsgKGNhbnZhcy5oZWlnaHQgLSBjcm9wQm94LmhlaWdodCkgLyAyO1xuXG4gICAgICB0aGlzLmluaXRpYWxDcm9wQm94ID0gJC5leHRlbmQoe30sIGNyb3BCb3gpO1xuICAgIH0sXG5cbiAgICBsaW1pdENyb3BCb3g6IGZ1bmN0aW9uIChzaXplLCBwb3NpdGlvbikge1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3QsXG4gICAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIud2lkdGgsXG4gICAgICAgICAgY29udGFpbmVySGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gb3B0aW9ucy5hc3BlY3RSYXRpbyxcbiAgICAgICAgICBtaW5Dcm9wQm94V2lkdGgsXG4gICAgICAgICAgbWluQ3JvcEJveEhlaWdodDtcblxuICAgICAgaWYgKHNpemUpIHtcbiAgICAgICAgbWluQ3JvcEJveFdpZHRoID0gbnVtKG9wdGlvbnMubWluQ3JvcEJveFdpZHRoKSB8fCAwO1xuICAgICAgICBtaW5Dcm9wQm94SGVpZ2h0ID0gbnVtKG9wdGlvbnMubWluQ3JvcEJveEhlaWdodCkgfHwgMDtcblxuICAgICAgICAvLyBtaW4vbWF4Q3JvcEJveFdpZHRoL0hlaWdodCBtdXN0IGxlc3MgdGhhbiBjb25hdGluZXIgd2lkdGgvaGVpZ2h0XG4gICAgICAgIGNyb3BCb3gubWluV2lkdGggPSBtaW4oY29udGFpbmVyV2lkdGgsIG1pbkNyb3BCb3hXaWR0aCk7XG4gICAgICAgIGNyb3BCb3gubWluSGVpZ2h0ID0gbWluKGNvbnRhaW5lckhlaWdodCwgbWluQ3JvcEJveEhlaWdodCk7XG4gICAgICAgIGNyb3BCb3gubWF4V2lkdGggPSBtaW4oY29udGFpbmVyV2lkdGgsIHN0cmljdCA/IGNhbnZhcy53aWR0aCA6IGNvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgY3JvcEJveC5tYXhIZWlnaHQgPSBtaW4oY29udGFpbmVySGVpZ2h0LCBzdHJpY3QgPyBjYW52YXMuaGVpZ2h0IDogY29udGFpbmVySGVpZ2h0KTtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICAvLyBjb21wYXJlIGNyb3AgYm94IHNpemUgd2l0aCBjb250YWluZXIgZmlyc3RcbiAgICAgICAgICBpZiAoY3JvcEJveC5tYXhIZWlnaHQgKiBhc3BlY3RSYXRpbyA+IGNyb3BCb3gubWF4V2lkdGgpIHtcbiAgICAgICAgICAgIGNyb3BCb3gubWluSGVpZ2h0ID0gY3JvcEJveC5taW5XaWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgY3JvcEJveC5tYXhIZWlnaHQgPSBjcm9wQm94Lm1heFdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNyb3BCb3gubWluV2lkdGggPSBjcm9wQm94Lm1pbkhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgICAgY3JvcEJveC5tYXhXaWR0aCA9IGNyb3BCb3gubWF4SGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIFwibWluV2lkdGhcIiBtdXN0IGJlIGxlc3MgdGhhbiBcIm1heFdpZHRoXCIsIGFuZCB0aGUgXCJtaW5IZWlnaHRcIiB0b28uXG4gICAgICAgIGNyb3BCb3gubWluV2lkdGggPSBtaW4oY3JvcEJveC5tYXhXaWR0aCwgY3JvcEJveC5taW5XaWR0aCk7XG4gICAgICAgIGNyb3BCb3gubWluSGVpZ2h0ID0gbWluKGNyb3BCb3gubWF4SGVpZ2h0LCBjcm9wQm94Lm1pbkhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgY3JvcEJveC5taW5MZWZ0ID0gbWF4KDAsIGNhbnZhcy5sZWZ0KTtcbiAgICAgICAgICBjcm9wQm94Lm1pblRvcCA9IG1heCgwLCBjYW52YXMudG9wKTtcbiAgICAgICAgICBjcm9wQm94Lm1heExlZnQgPSBtaW4oY29udGFpbmVyV2lkdGgsIGNhbnZhcy5sZWZ0ICsgY2FudmFzLndpZHRoKSAtIGNyb3BCb3gud2lkdGg7XG4gICAgICAgICAgY3JvcEJveC5tYXhUb3AgPSBtaW4oY29udGFpbmVySGVpZ2h0LCBjYW52YXMudG9wICsgY2FudmFzLmhlaWdodCkgLSBjcm9wQm94LmhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcm9wQm94Lm1pbkxlZnQgPSAwO1xuICAgICAgICAgIGNyb3BCb3gubWluVG9wID0gMDtcbiAgICAgICAgICBjcm9wQm94Lm1heExlZnQgPSBjb250YWluZXJXaWR0aCAtIGNyb3BCb3gud2lkdGg7XG4gICAgICAgICAgY3JvcEJveC5tYXhUb3AgPSBjb250YWluZXJIZWlnaHQgLSBjcm9wQm94LmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW5kZXJDcm9wQm94OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci53aWR0aCxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQgPSBjb250YWluZXIuaGVpZ2h0LFxuICAgICAgICAgIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3g7XG5cbiAgICAgIGlmIChjcm9wQm94LndpZHRoID4gY3JvcEJveC5tYXhXaWR0aCB8fCBjcm9wQm94LndpZHRoIDwgY3JvcEJveC5taW5XaWR0aCkge1xuICAgICAgICBjcm9wQm94LmxlZnQgPSBjcm9wQm94Lm9sZExlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjcm9wQm94LmhlaWdodCA+IGNyb3BCb3gubWF4SGVpZ2h0IHx8IGNyb3BCb3guaGVpZ2h0IDwgY3JvcEJveC5taW5IZWlnaHQpIHtcbiAgICAgICAgY3JvcEJveC50b3AgPSBjcm9wQm94Lm9sZFRvcDtcbiAgICAgIH1cblxuICAgICAgY3JvcEJveC53aWR0aCA9IG1pbihtYXgoY3JvcEJveC53aWR0aCwgY3JvcEJveC5taW5XaWR0aCksIGNyb3BCb3gubWF4V2lkdGgpO1xuICAgICAgY3JvcEJveC5oZWlnaHQgPSBtaW4obWF4KGNyb3BCb3guaGVpZ2h0LCBjcm9wQm94Lm1pbkhlaWdodCksIGNyb3BCb3gubWF4SGVpZ2h0KTtcblxuICAgICAgdGhpcy5saW1pdENyb3BCb3goZmFsc2UsIHRydWUpO1xuXG4gICAgICBjcm9wQm94Lm9sZExlZnQgPSBjcm9wQm94LmxlZnQgPSBtaW4obWF4KGNyb3BCb3gubGVmdCwgY3JvcEJveC5taW5MZWZ0KSwgY3JvcEJveC5tYXhMZWZ0KTtcbiAgICAgIGNyb3BCb3gub2xkVG9wID0gY3JvcEJveC50b3AgPSBtaW4obWF4KGNyb3BCb3gudG9wLCBjcm9wQm94Lm1pblRvcCksIGNyb3BCb3gubWF4VG9wKTtcblxuICAgICAgaWYgKG9wdGlvbnMubW92YWJsZSAmJiBvcHRpb25zLmNyb3BCb3hNb3ZhYmxlKSB7XG4gICAgICAgIC8vIFR1cm4gdG8gbW92ZSB0aGUgY2FudmFzIHdoZW4gdGhlIGNyb3AgYm94IGlzIGVxdWFsIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgdGhpcy4kZmFjZS5kYXRhKCdkcmFnJywgKGNyb3BCb3gud2lkdGggPT09IGNvbnRhaW5lcldpZHRoICYmIGNyb3BCb3guaGVpZ2h0ID09PSBjb250YWluZXJIZWlnaHQpID8gJ21vdmUnIDogJ2FsbCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRjcm9wQm94LmNzcyh7XG4gICAgICAgIHdpZHRoOiBjcm9wQm94LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNyb3BCb3guaGVpZ2h0LFxuICAgICAgICBsZWZ0OiBjcm9wQm94LmxlZnQsXG4gICAgICAgIHRvcDogY3JvcEJveC50b3BcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5jcm9wcGVkICYmIG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgIHRoaXMubGltaXRDYW52YXModHJ1ZSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLm91dHB1dCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgICR0aGlzID0gdGhpcy4kZWxlbWVudDtcblxuICAgICAgdGhpcy5wcmV2aWV3KCk7XG5cbiAgICAgIGlmIChvcHRpb25zLmNyb3ApIHtcbiAgICAgICAgb3B0aW9ucy5jcm9wLmNhbGwoJHRoaXMsIHRoaXMuZ2V0RGF0YSgpKTtcbiAgICAgIH1cblxuICAgICAgJHRoaXMudHJpZ2dlcihFVkVOVF9DSEFOR0UpO1xuICAgIH1cbiAgfSk7XG5cbiAgcHJvdG90eXBlLmluaXRQcmV2aWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB1cmwgPSB0aGlzLnVybDtcblxuICAgIHRoaXMuJHByZXZpZXcgPSAkKHRoaXMub3B0aW9ucy5wcmV2aWV3KTtcbiAgICB0aGlzLiR2aWV3Qm94Lmh0bWwoJzxpbWcgc3JjPVwiJyArIHVybCArICdcIj4nKTtcblxuICAgIC8vIE92ZXJyaWRlIGltZyBlbGVtZW50IHN0eWxlc1xuICAgIC8vIEFkZCBgZGlzcGxheTpibG9ja2AgdG8gYXZvaWQgbWFyZ2luIHRvcCBpc3N1ZSAoT2NjdXIgb25seSB3aGVuIG1hcmdpbi10b3AgPD0gLWhlaWdodClcbiAgICB0aGlzLiRwcmV2aWV3LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgJHRoaXMuZGF0YShDUk9QUEVSX1BSRVZJRVcsIHtcbiAgICAgICAgd2lkdGg6ICR0aGlzLndpZHRoKCksXG4gICAgICAgIGhlaWdodDogJHRoaXMuaGVpZ2h0KCksXG4gICAgICAgIG9yaWdpbmFsOiAkdGhpcy5odG1sKClcbiAgICAgIH0pLmh0bWwoJzxpbWcgc3JjPVwiJyArIHVybCArICdcIiBzdHlsZT1cImRpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTttaW4td2lkdGg6MCFpbXBvcnRhbnQ7bWluLWhlaWdodDowIWltcG9ydGFudDttYXgtd2lkdGg6bm9uZSFpbXBvcnRhbnQ7bWF4LWhlaWdodDpub25lIWltcG9ydGFudDtpbWFnZS1vcmllbnRhdGlvbjogMGRlZyFpbXBvcnRhbnRcIj4nKTtcbiAgICB9KTtcbiAgfTtcblxuICBwcm90b3R5cGUucmVzZXRQcmV2aWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHByZXZpZXcuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAkdGhpcy5odG1sKCR0aGlzLmRhdGEoQ1JPUFBFUl9QUkVWSUVXKS5vcmlnaW5hbCkucmVtb3ZlRGF0YShDUk9QUEVSX1BSRVZJRVcpO1xuICAgIH0pO1xuICB9O1xuXG4gIHByb3RvdHlwZS5wcmV2aWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICB3aWR0aCA9IGltYWdlLndpZHRoLFxuICAgICAgICBoZWlnaHQgPSBpbWFnZS5oZWlnaHQsXG4gICAgICAgIGxlZnQgPSBjcm9wQm94LmxlZnQgLSBjYW52YXMubGVmdCAtIGltYWdlLmxlZnQsXG4gICAgICAgIHRvcCA9IGNyb3BCb3gudG9wIC0gY2FudmFzLnRvcCAtIGltYWdlLnRvcCxcbiAgICAgICAgcm90YXRlID0gaW1hZ2Uucm90YXRlO1xuXG4gICAgaWYgKCF0aGlzLmNyb3BwZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuJHZpZXdCb3guZmluZCgnaW1nJykuY3NzKHtcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgbWFyZ2luTGVmdDogLWxlZnQsXG4gICAgICBtYXJnaW5Ub3A6IC10b3AsXG4gICAgICB0cmFuc2Zvcm06IGdldFJvdGF0ZVZhbHVlKHJvdGF0ZSlcbiAgICB9KTtcblxuICAgIHRoaXMuJHByZXZpZXcuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKENST1BQRVJfUFJFVklFVyksXG4gICAgICAgICAgcmF0aW8gPSBkYXRhLndpZHRoIC8gY3JvcEJveC53aWR0aCxcbiAgICAgICAgICBuZXdXaWR0aCA9IGRhdGEud2lkdGgsXG4gICAgICAgICAgbmV3SGVpZ2h0ID0gY3JvcEJveC5oZWlnaHQgKiByYXRpbztcblxuICAgICAgaWYgKG5ld0hlaWdodCA+IGRhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHJhdGlvID0gZGF0YS5oZWlnaHQgLyBjcm9wQm94LmhlaWdodDtcbiAgICAgICAgbmV3V2lkdGggPSBjcm9wQm94LndpZHRoICogcmF0aW87XG4gICAgICAgIG5ld0hlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICAkdGhpcy53aWR0aChuZXdXaWR0aCkuaGVpZ2h0KG5ld0hlaWdodCkuZmluZCgnaW1nJykuY3NzKHtcbiAgICAgICAgd2lkdGg6IHdpZHRoICogcmF0aW8sXG4gICAgICAgIGhlaWdodDogaGVpZ2h0ICogcmF0aW8sXG4gICAgICAgIG1hcmdpbkxlZnQ6IC1sZWZ0ICogcmF0aW8sXG4gICAgICAgIG1hcmdpblRvcDogLXRvcCAqIHJhdGlvLFxuICAgICAgICB0cmFuc2Zvcm06IGdldFJvdGF0ZVZhbHVlKHJvdGF0ZSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHByb3RvdHlwZS5hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICR0aGlzID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgJGNyb3BwZXIgPSB0aGlzLiRjcm9wcGVyO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmRyYWdzdGFydCkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX0RSQUdfU1RBUlQsIG9wdGlvbnMuZHJhZ3N0YXJ0KTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuZHJhZ21vdmUpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9EUkFHX01PVkUsIG9wdGlvbnMuZHJhZ21vdmUpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnZW5kKSkge1xuICAgICAgJHRoaXMub24oRVZFTlRfRFJBR19FTkQsIG9wdGlvbnMuZHJhZ2VuZCk7XG4gICAgfVxuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLnpvb21pbikpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX1pPT01fSU4sIG9wdGlvbnMuem9vbWluKTtcbiAgICB9XG5cbiAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMuem9vbW91dCkpIHtcbiAgICAgICR0aGlzLm9uKEVWRU5UX1pPT01fT1VULCBvcHRpb25zLnpvb21vdXQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5jaGFuZ2UpKSB7XG4gICAgICAkdGhpcy5vbihFVkVOVF9DSEFOR0UsIG9wdGlvbnMuY2hhbmdlKTtcbiAgICB9XG5cbiAgICAkY3JvcHBlci5vbihFVkVOVF9NT1VTRV9ET1dOLCAkLnByb3h5KHRoaXMuZHJhZ3N0YXJ0LCB0aGlzKSk7XG5cbiAgICBpZiAob3B0aW9ucy56b29tYWJsZSAmJiBvcHRpb25zLm1vdXNlV2hlZWxab29tKSB7XG4gICAgICAkY3JvcHBlci5vbihFVkVOVF9XSEVFTCwgJC5wcm94eSh0aGlzLndoZWVsLCB0aGlzKSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZG91YmxlQ2xpY2tUb2dnbGUpIHtcbiAgICAgICRjcm9wcGVyLm9uKEVWRU5UX0RCTENMSUNLLCAkLnByb3h5KHRoaXMuZGJsY2xpY2ssIHRoaXMpKTtcbiAgICB9XG5cbiAgICAkZG9jdW1lbnQub24oRVZFTlRfTU9VU0VfTU9WRSwgKHRoaXMuX2RyYWdtb3ZlID0gcHJveHkodGhpcy5kcmFnbW92ZSwgdGhpcykpKS5vbihFVkVOVF9NT1VTRV9VUCwgKHRoaXMuX2RyYWdlbmQgPSBwcm94eSh0aGlzLmRyYWdlbmQsIHRoaXMpKSk7XG5cbiAgICBpZiAob3B0aW9ucy5yZXNwb25zaXZlKSB7XG4gICAgICAkd2luZG93Lm9uKEVWRU5UX1JFU0laRSwgKHRoaXMuX3Jlc2l6ZSA9IHByb3h5KHRoaXMucmVzaXplLCB0aGlzKSkpO1xuICAgIH1cbiAgfTtcblxuICBwcm90b3R5cGUucmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAkdGhpcyA9IHRoaXMuJGVsZW1lbnQsXG4gICAgICAgICRjcm9wcGVyID0gdGhpcy4kY3JvcHBlcjtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnc3RhcnQpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfRFJBR19TVEFSVCwgb3B0aW9ucy5kcmFnc3RhcnQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnbW92ZSkpIHtcbiAgICAgICR0aGlzLm9mZihFVkVOVF9EUkFHX01PVkUsIG9wdGlvbnMuZHJhZ21vdmUpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5kcmFnZW5kKSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX0RSQUdfRU5ELCBvcHRpb25zLmRyYWdlbmQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy56b29taW4pKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfWk9PTV9JTiwgb3B0aW9ucy56b29taW4pO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy56b29tb3V0KSkge1xuICAgICAgJHRoaXMub2ZmKEVWRU5UX1pPT01fT1VULCBvcHRpb25zLnpvb21vdXQpO1xuICAgIH1cblxuICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5jaGFuZ2UpKSB7XG4gICAgICAkdGhpcy5vZmYoRVZFTlRfQ0hBTkdFLCBvcHRpb25zLmNoYW5nZSk7XG4gICAgfVxuXG4gICAgJGNyb3BwZXIub2ZmKEVWRU5UX01PVVNFX0RPV04sIHRoaXMuZHJhZ3N0YXJ0KTtcblxuICAgIGlmIChvcHRpb25zLnpvb21hYmxlICYmIG9wdGlvbnMubW91c2VXaGVlbFpvb20pIHtcbiAgICAgICRjcm9wcGVyLm9mZihFVkVOVF9XSEVFTCwgdGhpcy53aGVlbCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZG91YmxlQ2xpY2tUb2dnbGUpIHtcbiAgICAgICRjcm9wcGVyLm9mZihFVkVOVF9EQkxDTElDSywgdGhpcy5kYmxjbGljayk7XG4gICAgfVxuXG4gICAgJGRvY3VtZW50Lm9mZihFVkVOVF9NT1VTRV9NT1ZFLCB0aGlzLl9kcmFnbW92ZSkub2ZmKEVWRU5UX01PVVNFX1VQLCB0aGlzLl9kcmFnZW5kKTtcblxuICAgIGlmIChvcHRpb25zLnJlc3BvbnNpdmUpIHtcbiAgICAgICR3aW5kb3cub2ZmKEVWRU5UX1JFU0laRSwgdGhpcy5fcmVzaXplKTtcbiAgICB9XG4gIH07XG5cbiAgJC5leHRlbmQocHJvdG90eXBlLCB7XG4gICAgcmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lcixcbiAgICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICBjYW52YXNEYXRhLFxuICAgICAgICAgIGNyb3BCb3hEYXRhLFxuICAgICAgICAgIHJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhY29udGFpbmVyKSB7IC8vIENoZWNrIFwiY29udGFpbmVyXCIgZm9yIElFOFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJhdGlvID0gJGNvbnRhaW5lci53aWR0aCgpIC8gY29udGFpbmVyLndpZHRoO1xuXG4gICAgICBpZiAocmF0aW8gIT09IDEgfHwgJGNvbnRhaW5lci5oZWlnaHQoKSAhPT0gY29udGFpbmVyLmhlaWdodCkge1xuICAgICAgICBjYW52YXNEYXRhID0gdGhpcy5nZXRDYW52YXNEYXRhKCk7XG4gICAgICAgIGNyb3BCb3hEYXRhID0gdGhpcy5nZXRDcm9wQm94RGF0YSgpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHRoaXMuc2V0Q2FudmFzRGF0YSgkLmVhY2goY2FudmFzRGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcbiAgICAgICAgICBjYW52YXNEYXRhW2ldID0gbiAqIHJhdGlvO1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuc2V0Q3JvcEJveERhdGEoJC5lYWNoKGNyb3BCb3hEYXRhLCBmdW5jdGlvbiAoaSwgbikge1xuICAgICAgICAgIGNyb3BCb3hEYXRhW2ldID0gbiAqIHJhdGlvO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRibGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiRkcmFnQm94Lmhhc0NsYXNzKENMQVNTX0NST1ApKSB7XG4gICAgICAgIHRoaXMuc2V0RHJhZ01vZGUoJ21vdmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RHJhZ01vZGUoJ2Nyb3AnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2hlZWw6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGUgPSBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIGRlbHRhID0gMTtcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoZS5kZWx0YVkpIHtcbiAgICAgICAgZGVsdGEgPSBlLmRlbHRhWSA+IDAgPyAxIDogLTE7XG4gICAgICB9IGVsc2UgaWYgKGUud2hlZWxEZWx0YSkge1xuICAgICAgICBkZWx0YSA9IC1lLndoZWVsRGVsdGEgLyAxMjA7XG4gICAgICB9IGVsc2UgaWYgKGUuZGV0YWlsKSB7XG4gICAgICAgIGRlbHRhID0gZS5kZXRhaWwgPiAwID8gMSA6IC0xO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvb20oLWRlbHRhICogMC4xKTtcbiAgICB9LFxuXG4gICAgZHJhZ3N0YXJ0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIHRvdWNoZXMgPSBvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQudG91Y2hlcyxcbiAgICAgICAgICBlID0gZXZlbnQsXG4gICAgICAgICAgZHJhZ1R5cGUsXG4gICAgICAgICAgZHJhZ1N0YXJ0RXZlbnQsXG4gICAgICAgICAgdG91Y2hlc0xlbmd0aDtcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodG91Y2hlcykge1xuICAgICAgICB0b3VjaGVzTGVuZ3RoID0gdG91Y2hlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRvdWNoZXNMZW5ndGggPiAxKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuem9vbWFibGUgJiYgb3B0aW9ucy50b3VjaERyYWdab29tICYmIHRvdWNoZXNMZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGUgPSB0b3VjaGVzWzFdO1xuICAgICAgICAgICAgdGhpcy5zdGFydFgyID0gZS5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRZMiA9IGUucGFnZVk7XG4gICAgICAgICAgICBkcmFnVHlwZSA9ICd6b29tJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGUgPSB0b3VjaGVzWzBdO1xuICAgICAgfVxuXG4gICAgICBkcmFnVHlwZSA9IGRyYWdUeXBlIHx8ICQoZS50YXJnZXQpLmRhdGEoJ2RyYWcnKTtcblxuICAgICAgaWYgKFJFR0VYUF9EUkFHX1RZUEVTLnRlc3QoZHJhZ1R5cGUpKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgZHJhZ1N0YXJ0RXZlbnQgPSAkLkV2ZW50KEVWRU5UX0RSQUdfU1RBUlQsIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIGRyYWdUeXBlOiBkcmFnVHlwZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZHJhZ1N0YXJ0RXZlbnQpO1xuXG4gICAgICAgIGlmIChkcmFnU3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ1R5cGUgPSBkcmFnVHlwZTtcbiAgICAgICAgdGhpcy5jcm9wcGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUucGFnZVg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS5wYWdlWTtcblxuICAgICAgICBpZiAoZHJhZ1R5cGUgPT09ICdjcm9wJykge1xuICAgICAgICAgIHRoaXMuY3JvcHBpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuJGRyYWdCb3guYWRkQ2xhc3MoQ0xBU1NfTU9EQUwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRyYWdtb3ZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIHRvdWNoZXMgPSBvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQudG91Y2hlcyxcbiAgICAgICAgICBlID0gZXZlbnQsXG4gICAgICAgICAgZHJhZ1R5cGUgPSB0aGlzLmRyYWdUeXBlLFxuICAgICAgICAgIGRyYWdNb3ZlRXZlbnQsXG4gICAgICAgICAgdG91Y2hlc0xlbmd0aDtcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodG91Y2hlcykge1xuICAgICAgICB0b3VjaGVzTGVuZ3RoID0gdG91Y2hlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRvdWNoZXNMZW5ndGggPiAxKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuem9vbWFibGUgJiYgb3B0aW9ucy50b3VjaERyYWdab29tICYmIHRvdWNoZXNMZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGUgPSB0b3VjaGVzWzFdO1xuICAgICAgICAgICAgdGhpcy5lbmRYMiA9IGUucGFnZVg7XG4gICAgICAgICAgICB0aGlzLmVuZFkyID0gZS5wYWdlWTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGUgPSB0b3VjaGVzWzBdO1xuICAgICAgfVxuXG4gICAgICBpZiAoZHJhZ1R5cGUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkcmFnTW92ZUV2ZW50ID0gJC5FdmVudChFVkVOVF9EUkFHX01PVkUsIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIGRyYWdUeXBlOiBkcmFnVHlwZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZHJhZ01vdmVFdmVudCk7XG5cbiAgICAgICAgaWYgKGRyYWdNb3ZlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVuZFggPSBlLnBhZ2VYO1xuICAgICAgICB0aGlzLmVuZFkgPSBlLnBhZ2VZO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlKGUuc2hpZnRLZXkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkcmFnZW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBkcmFnVHlwZSA9IHRoaXMuZHJhZ1R5cGUsXG4gICAgICAgICAgZHJhZ0VuZEV2ZW50O1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkcmFnVHlwZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRyYWdFbmRFdmVudCA9ICQuRXZlbnQoRVZFTlRfRFJBR19FTkQsIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgIGRyYWdUeXBlOiBkcmFnVHlwZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZHJhZ0VuZEV2ZW50KTtcblxuICAgICAgICBpZiAoZHJhZ0VuZEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3JvcHBpbmcpIHtcbiAgICAgICAgICB0aGlzLmNyb3BwaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy4kZHJhZ0JveC50b2dnbGVDbGFzcyhDTEFTU19NT0RBTCwgdGhpcy5jcm9wcGVkICYmIHRoaXMub3B0aW9ucy5tb2RhbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdUeXBlID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAkLmV4dGVuZChwcm90b3R5cGUsIHtcbiAgICBjcm9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuYnVpbHQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5jcm9wcGVkKSB7XG4gICAgICAgIHRoaXMuY3JvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubGltaXRDcm9wQm94KHRydWUsIHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubW9kYWwpIHtcbiAgICAgICAgICB0aGlzLiRkcmFnQm94LmFkZENsYXNzKENMQVNTX01PREFMKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGNyb3BCb3gucmVtb3ZlQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDcm9wQm94RGF0YSh0aGlzLmluaXRpYWxDcm9wQm94KTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5idWlsdCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbWFnZSA9ICQuZXh0ZW5kKHt9LCB0aGlzLmluaXRpYWxJbWFnZSk7XG4gICAgICB0aGlzLmNhbnZhcyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmluaXRpYWxDYW52YXMpO1xuICAgICAgdGhpcy5jcm9wQm94ID0gJC5leHRlbmQoe30sIHRoaXMuaW5pdGlhbENyb3BCb3gpOyAvLyByZXF1aXJlZCBmb3Igc3RyaWN0IG1vZGVcblxuICAgICAgdGhpcy5yZW5kZXJDYW52YXMoKTtcblxuICAgICAgaWYgKHRoaXMuY3JvcHBlZCkge1xuICAgICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5jcm9wcGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkLmV4dGVuZCh0aGlzLmNyb3BCb3gsIHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jcm9wcGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcblxuICAgICAgdGhpcy5saW1pdENhbnZhcygpO1xuICAgICAgdGhpcy5yZW5kZXJDYW52YXMoKTsgLy8gUmVuZGVyIGNhbnZhcyBhZnRlciByZW5kZXIgY3JvcCBib3hcblxuICAgICAgdGhpcy4kZHJhZ0JveC5yZW1vdmVDbGFzcyhDTEFTU19NT0RBTCk7XG4gICAgICB0aGlzLiRjcm9wQm94LmFkZENsYXNzKENMQVNTX0hJRERFTik7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9IHRoaXMuJGVsZW1lbnQ7XG5cbiAgICAgIGlmICh0aGlzLnJlYWR5KSB7XG4gICAgICAgIHRoaXMudW5idWlsZCgpO1xuICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcyhDTEFTU19ISURERU4pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLiRjbG9uZSkge1xuICAgICAgICB0aGlzLiRjbG9uZS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgJHRoaXMucmVtb3ZlRGF0YSgnY3JvcHBlcicpO1xuICAgIH0sXG5cbiAgICByZXBsYWNlOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdXJsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gbnVsbDsgLy8gUmVtb3ZlIHByZXZpb3VzIGRhdGFcbiAgICAgICAgdGhpcy5sb2FkKHVybCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYnVpbHQpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLiRjcm9wcGVyLnJlbW92ZUNsYXNzKENMQVNTX0RJU0FCTEVEKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuYnVpbHQpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGNyb3BwZXIuYWRkQ2xhc3MoQ0xBU1NfRElTQUJMRUQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbiAob2Zmc2V0WCwgb2Zmc2V0WSkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY2FudmFzO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wdGlvbnMubW92YWJsZSAmJiBpc051bWJlcihvZmZzZXRYKSAmJiBpc051bWJlcihvZmZzZXRZKSkge1xuICAgICAgICBjYW52YXMubGVmdCArPSBvZmZzZXRYO1xuICAgICAgICBjYW52YXMudG9wICs9IG9mZnNldFk7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB6b29tOiBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICB6b29tRXZlbnQsXG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0O1xuXG4gICAgICBkZWx0YSA9IG51bShkZWx0YSk7XG5cbiAgICAgIGlmIChkZWx0YSAmJiB0aGlzLmJ1aWx0ICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucy56b29tYWJsZSkge1xuICAgICAgICB6b29tRXZlbnQgPSBkZWx0YSA+IDAgPyAkLkV2ZW50KEVWRU5UX1pPT01fSU4pIDogJC5FdmVudChFVkVOVF9aT09NX09VVCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcih6b29tRXZlbnQpO1xuXG4gICAgICAgIGlmICh6b29tRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkZWx0YSA9IGRlbHRhIDw9IC0xID8gMSAvICgxIC0gZGVsdGEpIDogZGVsdGEgPD0gMSA/ICgxICsgZGVsdGEpIDogZGVsdGE7XG4gICAgICAgIHdpZHRoID0gY2FudmFzLndpZHRoICogZGVsdGE7XG4gICAgICAgIGhlaWdodCA9IGNhbnZhcy5oZWlnaHQgKiBkZWx0YTtcbiAgICAgICAgY2FudmFzLmxlZnQgLT0gKHdpZHRoIC0gY2FudmFzLndpZHRoKSAvIDI7XG4gICAgICAgIGNhbnZhcy50b3AgLT0gKGhlaWdodCAtIGNhbnZhcy5oZWlnaHQpIC8gMjtcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgICB0aGlzLnNldERyYWdNb2RlKCdtb3ZlJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJvdGF0ZTogZnVuY3Rpb24gKGRlZ3JlZSkge1xuICAgICAgdmFyIGltYWdlID0gdGhpcy5pbWFnZTtcblxuICAgICAgZGVncmVlID0gbnVtKGRlZ3JlZSk7XG5cbiAgICAgIGlmIChkZWdyZWUgJiYgdGhpcy5idWlsdCAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wdGlvbnMucm90YXRhYmxlKSB7XG4gICAgICAgIGltYWdlLnJvdGF0ZSA9IChpbWFnZS5yb3RhdGUgKyBkZWdyZWUpICUgMzYwO1xuICAgICAgICB0aGlzLnJvdGF0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gKHJvdW5kZWQpIHtcbiAgICAgIHZhciBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgICByYXRpbyxcbiAgICAgICAgICBkYXRhO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiB0aGlzLmNyb3BwZWQpIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICB4OiBjcm9wQm94LmxlZnQgLSBjYW52YXMubGVmdCxcbiAgICAgICAgICB5OiBjcm9wQm94LnRvcCAtIGNhbnZhcy50b3AsXG4gICAgICAgICAgd2lkdGg6IGNyb3BCb3gud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBjcm9wQm94LmhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIHJhdGlvID0gaW1hZ2Uud2lkdGggLyBpbWFnZS5uYXR1cmFsV2lkdGg7XG5cbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpLCBuKSB7XG4gICAgICAgICAgbiA9IG4gLyByYXRpbztcbiAgICAgICAgICBkYXRhW2ldID0gcm91bmRlZCA/IE1hdGgucm91bmQobikgOiBuO1xuICAgICAgICB9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGRhdGEucm90YXRlID0gdGhpcy5yZWFkeSA/IGltYWdlLnJvdGF0ZSA6IDA7XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG5cbiAgICBzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGltYWdlID0gdGhpcy5pbWFnZSxcbiAgICAgICAgICBjYW52YXMgPSB0aGlzLmNhbnZhcyxcbiAgICAgICAgICBjcm9wQm94RGF0YSA9IHt9LFxuICAgICAgICAgIHJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiAhdGhpcy5kaXNhYmxlZCAmJiAkLmlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEucm90YXRlKSAmJiBkYXRhLnJvdGF0ZSAhPT0gaW1hZ2Uucm90YXRlICYmIHRoaXMub3B0aW9ucy5yb3RhdGFibGUpIHtcbiAgICAgICAgICBpbWFnZS5yb3RhdGUgPSBkYXRhLnJvdGF0ZTtcbiAgICAgICAgICB0aGlzLnJvdGF0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVuZGVyQ2FudmFzKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmF0aW8gPSBpbWFnZS53aWR0aCAvIGltYWdlLm5hdHVyYWxXaWR0aDtcblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS54KSkge1xuICAgICAgICAgIGNyb3BCb3hEYXRhLmxlZnQgPSBkYXRhLnggKiByYXRpbyArIGNhbnZhcy5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEueSkpIHtcbiAgICAgICAgICBjcm9wQm94RGF0YS50b3AgPSBkYXRhLnkgKiByYXRpbyArIGNhbnZhcy50b3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS53aWR0aCkpIHtcbiAgICAgICAgICBjcm9wQm94RGF0YS53aWR0aCA9IGRhdGEud2lkdGggKiByYXRpbztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgICBjcm9wQm94RGF0YS5oZWlnaHQgPSBkYXRhLmhlaWdodCAqIHJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDcm9wQm94RGF0YShjcm9wQm94RGF0YSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldENvbnRhaW5lckRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWx0ID8gdGhpcy5jb250YWluZXIgOiB7fTtcbiAgICB9LFxuXG4gICAgZ2V0SW1hZ2VEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSA/IHRoaXMuaW1hZ2UgOiB7fTtcbiAgICB9LFxuXG4gICAgZ2V0Q2FudmFzRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGRhdGE7XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0KSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgbGVmdDogY2FudmFzLmxlZnQsXG4gICAgICAgICAgdG9wOiBjYW52YXMudG9wLFxuICAgICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhIHx8IHt9O1xuICAgIH0sXG5cbiAgICBzZXRDYW52YXNEYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGFzcGVjdFJhdGlvID0gY2FudmFzLmFzcGVjdFJhdGlvO1xuXG4gICAgICBpZiAodGhpcy5idWlsdCAmJiAhdGhpcy5kaXNhYmxlZCAmJiAkLmlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEubGVmdCkpIHtcbiAgICAgICAgICBjYW52YXMubGVmdCA9IGRhdGEubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLnRvcCkpIHtcbiAgICAgICAgICBjYW52YXMudG9wID0gZGF0YS50b3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS53aWR0aCkpIHtcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBkYXRhLndpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoZGF0YS5oZWlnaHQpKSB7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGRhdGEuaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0Q3JvcEJveERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjcm9wQm94ID0gdGhpcy5jcm9wQm94LFxuICAgICAgICAgIGRhdGE7XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmIHRoaXMuY3JvcHBlZCkge1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIGxlZnQ6IGNyb3BCb3gubGVmdCxcbiAgICAgICAgICB0b3A6IGNyb3BCb3gudG9wLFxuICAgICAgICAgIHdpZHRoOiBjcm9wQm94LndpZHRoLFxuICAgICAgICAgIGhlaWdodDogY3JvcEJveC5oZWlnaHRcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGEgfHwge307XG4gICAgfSxcblxuICAgIHNldENyb3BCb3hEYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGNyb3BCb3ggPSB0aGlzLmNyb3BCb3gsXG4gICAgICAgICAgYXNwZWN0UmF0aW8gPSB0aGlzLm9wdGlvbnMuYXNwZWN0UmF0aW87XG5cbiAgICAgIGlmICh0aGlzLmJ1aWx0ICYmIHRoaXMuY3JvcHBlZCAmJiAhdGhpcy5kaXNhYmxlZCAmJiAkLmlzUGxhaW5PYmplY3QoZGF0YSkpIHtcblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5sZWZ0KSkge1xuICAgICAgICAgIGNyb3BCb3gubGVmdCA9IGRhdGEubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc051bWJlcihkYXRhLnRvcCkpIHtcbiAgICAgICAgICBjcm9wQm94LnRvcCA9IGRhdGEudG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGRhdGEud2lkdGgpKSB7XG4gICAgICAgICAgY3JvcEJveC53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOdW1iZXIoZGF0YS5oZWlnaHQpKSB7XG4gICAgICAgICAgY3JvcEJveC5oZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGlmIChpc051bWJlcihkYXRhLndpZHRoKSkge1xuICAgICAgICAgICAgY3JvcEJveC5oZWlnaHQgPSBjcm9wQm94LndpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihkYXRhLmhlaWdodCkpIHtcbiAgICAgICAgICAgIGNyb3BCb3gud2lkdGggPSBjcm9wQm94LmhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyQ3JvcEJveCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRDcm9wcGVkQ2FudmFzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgdmFyIG9yaWdpbmFsV2lkdGgsXG4gICAgICAgICAgb3JpZ2luYWxIZWlnaHQsXG4gICAgICAgICAgY2FudmFzV2lkdGgsXG4gICAgICAgICAgY2FudmFzSGVpZ2h0LFxuICAgICAgICAgIHNjYWxlZFdpZHRoLFxuICAgICAgICAgIHNjYWxlZEhlaWdodCxcbiAgICAgICAgICBzY2FsZWRSYXRpbyxcbiAgICAgICAgICBhc3BlY3RSYXRpbyxcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICBkYXRhO1xuXG4gICAgICBpZiAoIXRoaXMuYnVpbHQgfHwgIXRoaXMuY3JvcHBlZCB8fCAhU1VQUE9SVF9DQU5WQVMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG5cbiAgICAgIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICAgIG9yaWdpbmFsV2lkdGggPSBkYXRhLndpZHRoO1xuICAgICAgb3JpZ2luYWxIZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgIGFzcGVjdFJhdGlvID0gb3JpZ2luYWxXaWR0aCAvIG9yaWdpbmFsSGVpZ2h0O1xuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIHNjYWxlZFdpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgICAgc2NhbGVkSGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHNjYWxlZFdpZHRoKSB7XG4gICAgICAgICAgc2NhbGVkSGVpZ2h0ID0gc2NhbGVkV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICBzY2FsZWRSYXRpbyA9IHNjYWxlZFdpZHRoIC8gb3JpZ2luYWxXaWR0aDtcbiAgICAgICAgfSBlbHNlIGlmIChzY2FsZWRIZWlnaHQpIHtcbiAgICAgICAgICBzY2FsZWRXaWR0aCA9IHNjYWxlZEhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIHNjYWxlZFJhdGlvID0gc2NhbGVkSGVpZ2h0IC8gb3JpZ2luYWxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FudmFzV2lkdGggPSBzY2FsZWRXaWR0aCB8fCBvcmlnaW5hbFdpZHRoO1xuICAgICAgY2FudmFzSGVpZ2h0ID0gc2NhbGVkSGVpZ2h0IHx8IG9yaWdpbmFsSGVpZ2h0O1xuXG4gICAgICBjYW52YXMgPSAkKCc8Y2FudmFzPicpWzBdO1xuICAgICAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICBpZiAob3B0aW9ucy5maWxsQ29sb3IpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBvcHRpb25zLmZpbGxDb2xvcjtcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5kcmF3SW1hZ2VcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlLmFwcGx5KGNvbnRleHQsIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBnZXRTb3VyY2VDYW52YXModGhpcy4kY2xvbmVbMF0sIHRoaXMuaW1hZ2UpLFxuICAgICAgICAgICAgc291cmNlV2lkdGggPSBzb3VyY2Uud2lkdGgsXG4gICAgICAgICAgICBzb3VyY2VIZWlnaHQgPSBzb3VyY2UuaGVpZ2h0LFxuICAgICAgICAgICAgYXJncyA9IFtzb3VyY2VdLFxuICAgICAgICAgICAgc3JjWCA9IGRhdGEueCwgLy8gc291cmNlIGNhbnZhc1xuICAgICAgICAgICAgc3JjWSA9IGRhdGEueSxcbiAgICAgICAgICAgIHNyY1dpZHRoLFxuICAgICAgICAgICAgc3JjSGVpZ2h0LFxuICAgICAgICAgICAgZHN0WCwgLy8gZGVzdGluYXRpb24gY2FudmFzXG4gICAgICAgICAgICBkc3RZLFxuICAgICAgICAgICAgZHN0V2lkdGgsXG4gICAgICAgICAgICBkc3RIZWlnaHQ7XG5cbiAgICAgICAgaWYgKHNyY1ggPD0gLW9yaWdpbmFsV2lkdGggfHwgc3JjWCA+IHNvdXJjZVdpZHRoKSB7XG4gICAgICAgICAgc3JjWCA9IHNyY1dpZHRoID0gZHN0WCA9IGRzdFdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChzcmNYIDw9IDApIHtcbiAgICAgICAgICBkc3RYID0gLXNyY1g7XG4gICAgICAgICAgc3JjWCA9IDA7XG4gICAgICAgICAgc3JjV2lkdGggPSBkc3RXaWR0aCA9IG1pbihzb3VyY2VXaWR0aCwgb3JpZ2luYWxXaWR0aCArIHNyY1gpO1xuICAgICAgICB9IGVsc2UgaWYgKHNyY1ggPD0gc291cmNlV2lkdGgpIHtcbiAgICAgICAgICBkc3RYID0gMDtcbiAgICAgICAgICBzcmNXaWR0aCA9IGRzdFdpZHRoID0gbWluKG9yaWdpbmFsV2lkdGgsIHNvdXJjZVdpZHRoIC0gc3JjWCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3JjV2lkdGggPD0gMCB8fCBzcmNZIDw9IC1vcmlnaW5hbEhlaWdodCB8fCBzcmNZID4gc291cmNlSGVpZ2h0KSB7XG4gICAgICAgICAgc3JjWSA9IHNyY0hlaWdodCA9IGRzdFkgPSBkc3RIZWlnaHQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHNyY1kgPD0gMCkge1xuICAgICAgICAgIGRzdFkgPSAtc3JjWTtcbiAgICAgICAgICBzcmNZID0gMDtcbiAgICAgICAgICBzcmNIZWlnaHQgPSBkc3RIZWlnaHQgPSBtaW4oc291cmNlSGVpZ2h0LCBvcmlnaW5hbEhlaWdodCArIHNyY1kpO1xuICAgICAgICB9IGVsc2UgaWYgKHNyY1kgPD0gc291cmNlSGVpZ2h0KSB7XG4gICAgICAgICAgZHN0WSA9IDA7XG4gICAgICAgICAgc3JjSGVpZ2h0ID0gZHN0SGVpZ2h0ID0gbWluKG9yaWdpbmFsSGVpZ2h0LCBzb3VyY2VIZWlnaHQgLSBzcmNZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3MucHVzaChzcmNYLCBzcmNZLCBzcmNXaWR0aCwgc3JjSGVpZ2h0KTtcblxuICAgICAgICAvLyBTY2FsZSBkZXN0aW5hdGlvbiBzaXplc1xuICAgICAgICBpZiAoc2NhbGVkUmF0aW8pIHtcbiAgICAgICAgICBkc3RYICo9IHNjYWxlZFJhdGlvO1xuICAgICAgICAgIGRzdFkgKj0gc2NhbGVkUmF0aW87XG4gICAgICAgICAgZHN0V2lkdGggKj0gc2NhbGVkUmF0aW87XG4gICAgICAgICAgZHN0SGVpZ2h0ICo9IHNjYWxlZFJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXZvaWQgXCJJbmRleFNpemVFcnJvclwiIGluIElFIGFuZCBGaXJlZm94XG4gICAgICAgIGlmIChkc3RXaWR0aCA+IDAgJiYgZHN0SGVpZ2h0ID4gMCkge1xuICAgICAgICAgIGFyZ3MucHVzaChkc3RYLCBkc3RZLCBkc3RXaWR0aCwgZHN0SGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgfSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfSxcblxuICAgIHNldEFzcGVjdFJhdGlvOiBmdW5jdGlvbiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIWlzVW5kZWZpbmVkKGFzcGVjdFJhdGlvKSkge1xuICAgICAgICBvcHRpb25zLmFzcGVjdFJhdGlvID0gbnVtKGFzcGVjdFJhdGlvKSB8fCBOYU47IC8vIDAgLT4gTmFOXG5cbiAgICAgICAgaWYgKHRoaXMuYnVpbHQpIHtcbiAgICAgICAgICB0aGlzLmluaXRDcm9wQm94KCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5jcm9wcGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckNyb3BCb3goKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0RHJhZ01vZGU6IGZ1bmN0aW9uIChtb2RlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBjcm9wcGFibGUsXG4gICAgICAgICAgbW92YWJsZTtcblxuICAgICAgaWYgKHRoaXMucmVhZHkgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgY3JvcHBhYmxlID0gb3B0aW9ucy5kcmFnQ3JvcCAmJiBtb2RlID09PSAnY3JvcCc7XG4gICAgICAgIG1vdmFibGUgPSBvcHRpb25zLm1vdmFibGUgJiYgbW9kZSA9PT0gJ21vdmUnO1xuICAgICAgICBtb2RlID0gKGNyb3BwYWJsZSB8fCBtb3ZhYmxlKSA/IG1vZGUgOiAnbm9uZSc7XG5cbiAgICAgICAgdGhpcy4kZHJhZ0JveC5kYXRhKCdkcmFnJywgbW9kZSkudG9nZ2xlQ2xhc3MoQ0xBU1NfQ1JPUCwgY3JvcHBhYmxlKS50b2dnbGVDbGFzcyhDTEFTU19NT1ZFLCBtb3ZhYmxlKTtcblxuICAgICAgICBpZiAoIW9wdGlvbnMuY3JvcEJveE1vdmFibGUpIHtcbiAgICAgICAgICAvLyBTeW5jIGRyYWcgbW9kZSB0byBjcm9wIGJveCB3aGVuIGl0IGlzIG5vdCBtb3ZhYmxlKCMzMDApXG4gICAgICAgICAgdGhpcy4kZmFjZS5kYXRhKCdkcmFnJywgbW9kZSkudG9nZ2xlQ2xhc3MoQ0xBU1NfQ1JPUCwgY3JvcHBhYmxlKS50b2dnbGVDbGFzcyhDTEFTU19NT1ZFLCBtb3ZhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcHJvdG90eXBlLmNoYW5nZSA9IGZ1bmN0aW9uIChzaGlmdEtleSkge1xuICAgIHZhciBkcmFnVHlwZSA9IHRoaXMuZHJhZ1R5cGUsXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGNhbnZhcyA9IHRoaXMuY2FudmFzLFxuICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgY3JvcEJveCA9IHRoaXMuY3JvcEJveCxcbiAgICAgICAgd2lkdGggPSBjcm9wQm94LndpZHRoLFxuICAgICAgICBoZWlnaHQgPSBjcm9wQm94LmhlaWdodCxcbiAgICAgICAgbGVmdCA9IGNyb3BCb3gubGVmdCxcbiAgICAgICAgdG9wID0gY3JvcEJveC50b3AsXG4gICAgICAgIHJpZ2h0ID0gbGVmdCArIHdpZHRoLFxuICAgICAgICBib3R0b20gPSB0b3AgKyBoZWlnaHQsXG4gICAgICAgIG1pbkxlZnQgPSAwLFxuICAgICAgICBtaW5Ub3AgPSAwLFxuICAgICAgICBtYXhXaWR0aCA9IGNvbnRhaW5lci53aWR0aCxcbiAgICAgICAgbWF4SGVpZ2h0ID0gY29udGFpbmVyLmhlaWdodCxcbiAgICAgICAgcmVuZGVyYWJsZSA9IHRydWUsXG4gICAgICAgIGFzcGVjdFJhdGlvID0gb3B0aW9ucy5hc3BlY3RSYXRpbyxcbiAgICAgICAgcmFuZ2UgPSB7XG4gICAgICAgICAgeDogdGhpcy5lbmRYIC0gdGhpcy5zdGFydFgsXG4gICAgICAgICAgeTogdGhpcy5lbmRZIC0gdGhpcy5zdGFydFlcbiAgICAgICAgfSxcbiAgICAgICAgb2Zmc2V0O1xuXG4gICAgLy8gTG9ja2luZyBhc3BlY3QgcmF0aW8gaW4gXCJmcmVlIG1vZGVcIiBieSBob2xkaW5nIHNoaWZ0IGtleSAoIzI1OSlcbiAgICBpZiAoIWFzcGVjdFJhdGlvICYmIHNoaWZ0S2V5KSB7XG4gICAgICBhc3BlY3RSYXRpbyA9IHdpZHRoICYmIGhlaWdodCA/IHdpZHRoIC8gaGVpZ2h0IDogMTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgIG1pbkxlZnQgPSBjcm9wQm94Lm1pbkxlZnQ7XG4gICAgICBtaW5Ub3AgPSBjcm9wQm94Lm1pblRvcDtcbiAgICAgIG1heFdpZHRoID0gbWluTGVmdCArIG1pbihjb250YWluZXIud2lkdGgsIGNhbnZhcy53aWR0aCk7XG4gICAgICBtYXhIZWlnaHQgPSBtaW5Ub3AgKyBtaW4oY29udGFpbmVyLmhlaWdodCwgY2FudmFzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICByYW5nZS5YID0gcmFuZ2UueSAqIGFzcGVjdFJhdGlvO1xuICAgICAgcmFuZ2UuWSA9IHJhbmdlLnggLyBhc3BlY3RSYXRpbztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRyYWdUeXBlKSB7XG4gICAgICAvLyBNb3ZlIGNyb3BCb3hcbiAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgdG9wICs9IHJhbmdlLnk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBSZXNpemUgY3JvcEJveFxuICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGlmIChyYW5nZS54ID49IDAgJiYgKHJpZ2h0ID49IG1heFdpZHRoIHx8IGFzcGVjdFJhdGlvICYmICh0b3AgPD0gbWluVG9wIHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB0b3AgLT0gcmFuZ2UuWSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAndyc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ24nOlxuICAgICAgICBpZiAocmFuZ2UueSA8PSAwICYmICh0b3AgPD0gbWluVG9wIHx8IGFzcGVjdFJhdGlvICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgcmlnaHQgPj0gbWF4V2lkdGgpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICB0b3AgKz0gcmFuZ2UueTtcblxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIGxlZnQgKz0gcmFuZ2UuWCAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ3MnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndyc6XG4gICAgICAgIGlmIChyYW5nZS54IDw9IDAgJiYgKGxlZnQgPD0gbWluTGVmdCB8fCBhc3BlY3RSYXRpbyAmJiAodG9wIDw9IG1pblRvcCB8fCBib3R0b20gPj0gbWF4SGVpZ2h0KSkpIHtcbiAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG5cbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgICAgICB0b3AgKz0gcmFuZ2UuWSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnZSc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3MnOlxuICAgICAgICBpZiAocmFuZ2UueSA+PSAwICYmIChib3R0b20gPj0gbWF4SGVpZ2h0IHx8IGFzcGVjdFJhdGlvICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgcmlnaHQgPj0gbWF4V2lkdGgpKSkge1xuICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuXG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgbGVmdCAtPSByYW5nZS5YIC8gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbic7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICduZSc6XG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGlmIChyYW5nZS55IDw9IDAgJiYgKHRvcCA8PSBtaW5Ub3AgfHwgcmlnaHQgPj0gbWF4V2lkdGgpKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWlnaHQgLT0gcmFuZ2UueTtcbiAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54ID49IDApIHtcbiAgICAgICAgICAgIGlmIChyaWdodCA8IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgIHdpZHRoICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPD0gMCAmJiB0b3AgPD0gbWluVG9wKSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwKSB7XG4gICAgICAgICAgICBpZiAodG9wID4gbWluVG9wKSB7XG4gICAgICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzdyc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbncnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc2UnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbncnOlxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwICYmICh0b3AgPD0gbWluVG9wIHx8IGxlZnQgPD0gbWluTGVmdCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgIHRvcCArPSByYW5nZS55O1xuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgbGVmdCArPSByYW5nZS5YO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyYW5nZS54IDw9IDApIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID4gbWluTGVmdCkge1xuICAgICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgICBsZWZ0ICs9IHJhbmdlLng7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJhbmdlLnkgPD0gMCAmJiB0b3AgPD0gbWluVG9wKSB7XG4gICAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggLT0gcmFuZ2UueDtcbiAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmFuZ2UueSA8PSAwKSB7XG4gICAgICAgICAgICBpZiAodG9wID4gbWluVG9wKSB7XG4gICAgICAgICAgICAgIGhlaWdodCAtPSByYW5nZS55O1xuICAgICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0IC09IHJhbmdlLnk7XG4gICAgICAgICAgICB0b3AgKz0gcmFuZ2UueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGggPCAwICYmIGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzZSc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgICB3aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnbmUnO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgZHJhZ1R5cGUgPSAnc3cnO1xuICAgICAgICAgIGhlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc3cnOlxuICAgICAgICBpZiAoYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICBpZiAocmFuZ2UueCA8PSAwICYmIChsZWZ0IDw9IG1pbkxlZnQgfHwgYm90dG9tID49IG1heEhlaWdodCkpIHtcbiAgICAgICAgICAgIHJlbmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPD0gMCkge1xuICAgICAgICAgICAgaWYgKGxlZnQgPiBtaW5MZWZ0KSB7XG4gICAgICAgICAgICAgIHdpZHRoIC09IHJhbmdlLng7XG4gICAgICAgICAgICAgIGxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2UueSA+PSAwICYmIGJvdHRvbSA+PSBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCAtPSByYW5nZS54O1xuICAgICAgICAgICAgbGVmdCArPSByYW5nZS54O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyYW5nZS55ID49IDApIHtcbiAgICAgICAgICAgIGlmIChib3R0b20gPCBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDAgJiYgaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ25lJztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzZSc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdudyc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZSc6XG4gICAgICAgIGlmIChhc3BlY3RSYXRpbykge1xuICAgICAgICAgIGlmIChyYW5nZS54ID49IDAgJiYgKHJpZ2h0ID49IG1heFdpZHRoIHx8IGJvdHRvbSA+PSBtYXhIZWlnaHQpKSB7XG4gICAgICAgICAgICByZW5kZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJhbmdlLnggPj0gMCkge1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgd2lkdGggKz0gcmFuZ2UueDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmFuZ2UueSA+PSAwICYmIGJvdHRvbSA+PSBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCArPSByYW5nZS54O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyYW5nZS55ID49IDApIHtcbiAgICAgICAgICAgIGlmIChib3R0b20gPCBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgaGVpZ2h0ICs9IHJhbmdlLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCArPSByYW5nZS55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aWR0aCA8IDAgJiYgaGVpZ2h0IDwgMCkge1xuICAgICAgICAgIGRyYWdUeXBlID0gJ253JztcbiAgICAgICAgICBoZWlnaHQgPSAwO1xuICAgICAgICAgIHdpZHRoID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICdzdyc7XG4gICAgICAgICAgd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IDApIHtcbiAgICAgICAgICBkcmFnVHlwZSA9ICduZSc7XG4gICAgICAgICAgaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBNb3ZlIGltYWdlXG4gICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgY2FudmFzLmxlZnQgKz0gcmFuZ2UueDtcbiAgICAgICAgY2FudmFzLnRvcCArPSByYW5nZS55O1xuICAgICAgICB0aGlzLnJlbmRlckNhbnZhcyh0cnVlKTtcbiAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gU2NhbGUgaW1hZ2VcbiAgICAgIGNhc2UgJ3pvb20nOlxuICAgICAgICB0aGlzLnpvb20oZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgICAgdmFyIHoxID0gc3FydCh4MSAqIHgxICsgeTEgKiB5MSksXG4gICAgICAgICAgICAgIHoyID0gc3FydCh4MiAqIHgyICsgeTIgKiB5Mik7XG5cbiAgICAgICAgICByZXR1cm4gKHoyIC0gejEpIC8gejE7XG4gICAgICAgIH0oXG4gICAgICAgICAgYWJzKHRoaXMuc3RhcnRYIC0gdGhpcy5zdGFydFgyKSxcbiAgICAgICAgICBhYnModGhpcy5zdGFydFkgLSB0aGlzLnN0YXJ0WTIpLFxuICAgICAgICAgIGFicyh0aGlzLmVuZFggLSB0aGlzLmVuZFgyKSxcbiAgICAgICAgICBhYnModGhpcy5lbmRZIC0gdGhpcy5lbmRZMilcbiAgICAgICAgKSk7XG5cbiAgICAgICAgdGhpcy5zdGFydFgyID0gdGhpcy5lbmRYMjtcbiAgICAgICAgdGhpcy5zdGFydFkyID0gdGhpcy5lbmRZMjtcbiAgICAgICAgcmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gQ3JvcCBpbWFnZVxuICAgICAgY2FzZSAnY3JvcCc6XG4gICAgICAgIGlmIChyYW5nZS54ICYmIHJhbmdlLnkpIHtcbiAgICAgICAgICBvZmZzZXQgPSB0aGlzLiRjcm9wcGVyLm9mZnNldCgpO1xuICAgICAgICAgIGxlZnQgPSB0aGlzLnN0YXJ0WCAtIG9mZnNldC5sZWZ0O1xuICAgICAgICAgIHRvcCA9IHRoaXMuc3RhcnRZIC0gb2Zmc2V0LnRvcDtcbiAgICAgICAgICB3aWR0aCA9IGNyb3BCb3gubWluV2lkdGg7XG4gICAgICAgICAgaGVpZ2h0ID0gY3JvcEJveC5taW5IZWlnaHQ7XG5cbiAgICAgICAgICBpZiAocmFuZ2UueCA+IDApIHtcbiAgICAgICAgICAgIGlmIChyYW5nZS55ID4gMCkge1xuICAgICAgICAgICAgICBkcmFnVHlwZSA9ICdzZSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkcmFnVHlwZSA9ICduZSc7XG4gICAgICAgICAgICAgIHRvcCAtPSBoZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyYW5nZS55ID4gMCkge1xuICAgICAgICAgICAgICBkcmFnVHlwZSA9ICdzdyc7XG4gICAgICAgICAgICAgIGxlZnQgLT0gd2lkdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkcmFnVHlwZSA9ICdudyc7XG4gICAgICAgICAgICAgIGxlZnQgLT0gd2lkdGg7XG4gICAgICAgICAgICAgIHRvcCAtPSBoZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2hvdyB0aGUgY3JvcEJveCBpZiBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAoIXRoaXMuY3JvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5jcm9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuJGNyb3BCb3gucmVtb3ZlQ2xhc3MoQ0xBU1NfSElEREVOKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgLy8gTm8gZGVmYXVsdFxuICAgIH1cblxuICAgIGlmIChyZW5kZXJhYmxlKSB7XG4gICAgICBjcm9wQm94LndpZHRoID0gd2lkdGg7XG4gICAgICBjcm9wQm94LmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGNyb3BCb3gubGVmdCA9IGxlZnQ7XG4gICAgICBjcm9wQm94LnRvcCA9IHRvcDtcbiAgICAgIHRoaXMuZHJhZ1R5cGUgPSBkcmFnVHlwZTtcblxuICAgICAgdGhpcy5yZW5kZXJDcm9wQm94KCk7XG4gICAgfVxuXG4gICAgLy8gT3ZlcnJpZGVcbiAgICB0aGlzLnN0YXJ0WCA9IHRoaXMuZW5kWDtcbiAgICB0aGlzLnN0YXJ0WSA9IHRoaXMuZW5kWTtcbiAgfTtcblxuICAkLmV4dGVuZChDcm9wcGVyLnByb3RvdHlwZSwgcHJvdG90eXBlKTtcblxuICBDcm9wcGVyLkRFRkFVTFRTID0ge1xuICAgIC8vIERlZmluZXMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgY3JvcCBib3hcbiAgICAvLyBUeXBlOiBOdW1iZXJcbiAgICBhc3BlY3RSYXRpbzogTmFOLFxuXG4gICAgLy8gRGVmaW5lcyB0aGUgcGVyY2VudGFnZSBvZiBhdXRvbWF0aWMgY3JvcHBpbmcgYXJlYSB3aGVuIGluaXRpYWxpemVzXG4gICAgLy8gVHlwZTogTnVtYmVyIChNdXN0IGxhcmdlIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEpXG4gICAgYXV0b0Nyb3BBcmVhOiAwLjgsIC8vIDgwJVxuXG4gICAgLy8gT3V0cHV0cyB0aGUgY3JvcHBpbmcgcmVzdWx0cy5cbiAgICAvLyBUeXBlOiBGdW5jdGlvblxuICAgIGNyb3A6IG51bGwsXG5cbiAgICAvLyBQcmV2aW91cy9sYXRlc3QgY3JvcCBkYXRhXG4gICAgLy8gVHlwZTogT2JqZWN0XG4gICAgZGF0YTogbnVsbCxcblxuICAgIC8vIEFkZCBleHRyYSBjb250YWluZXJzIGZvciBwcmV2aWV3aW5nXG4gICAgLy8gVHlwZTogU3RyaW5nIChqUXVlcnkgc2VsZWN0b3IpXG4gICAgcHJldmlldzogJycsXG5cbiAgICAvLyBUb2dnbGVzXG4gICAgc3RyaWN0OiB0cnVlLCAvLyBzdHJpY3QgbW9kZSwgdGhlIGltYWdlIGNhbm5vdCB6b29tIG91dCBsZXNzIHRoYW4gdGhlIGNvbnRhaW5lclxuICAgIHJlc3BvbnNpdmU6IHRydWUsIC8vIFJlYnVpbGQgd2hlbiByZXNpemUgdGhlIHdpbmRvd1xuICAgIGNoZWNrSW1hZ2VPcmlnaW46IHRydWUsIC8vIENoZWNrIGlmIHRoZSB0YXJnZXQgaW1hZ2UgaXMgY3Jvc3Mgb3JpZ2luXG5cbiAgICBtb2RhbDogdHJ1ZSwgLy8gU2hvdyB0aGUgYmxhY2sgbW9kYWxcbiAgICBndWlkZXM6IHRydWUsIC8vIFNob3cgdGhlIGRhc2hlZCBsaW5lcyBmb3IgZ3VpZGluZ1xuICAgIGhpZ2hsaWdodDogdHJ1ZSwgLy8gU2hvdyB0aGUgd2hpdGUgbW9kYWwgdG8gaGlnaGxpZ2h0IHRoZSBjcm9wIGJveFxuICAgIGJhY2tncm91bmQ6IHRydWUsIC8vIFNob3cgdGhlIGdyaWQgYmFja2dyb3VuZFxuXG4gICAgYXV0b0Nyb3A6IHRydWUsIC8vIEVuYWJsZSB0byBjcm9wIHRoZSBpbWFnZSBhdXRvbWF0aWNhbGx5IHdoZW4gaW5pdGlhbGl6ZVxuICAgIGRyYWdDcm9wOiB0cnVlLCAvLyBFbmFibGUgdG8gY3JlYXRlIG5ldyBjcm9wIGJveCBieSBkcmFnZ2luZyBvdmVyIHRoZSBpbWFnZVxuICAgIG1vdmFibGU6IHRydWUsIC8vIEVuYWJsZSB0byBtb3ZlIHRoZSBpbWFnZVxuICAgIHJvdGF0YWJsZTogdHJ1ZSwgLy8gRW5hYmxlIHRvIHJvdGF0ZSB0aGUgaW1hZ2VcbiAgICB6b29tYWJsZTogdHJ1ZSwgLy8gRW5hYmxlIHRvIHpvb20gdGhlIGltYWdlXG4gICAgdG91Y2hEcmFnWm9vbTogdHJ1ZSwgLy8gRW5hYmxlIHRvIHpvb20gdGhlIGltYWdlIGJ5IHdoZWVsaW5nIG1vdXNlXG4gICAgbW91c2VXaGVlbFpvb206IHRydWUsIC8vIEVuYWJsZSB0byB6b29tIHRoZSBpbWFnZSBieSBkcmFnZ2luZyB0b3VjaFxuICAgIGNyb3BCb3hNb3ZhYmxlOiB0cnVlLCAvLyBFbmFibGUgdG8gbW92ZSB0aGUgY3JvcCBib3hcbiAgICBjcm9wQm94UmVzaXphYmxlOiB0cnVlLCAvLyBFbmFibGUgdG8gcmVzaXplIHRoZSBjcm9wIGJveFxuICAgIGRvdWJsZUNsaWNrVG9nZ2xlOiB0cnVlLCAvLyBUb2dnbGUgZHJhZyBtb2RlIGJldHdlZW4gXCJjcm9wXCIgYW5kIFwibW92ZVwiIHdoZW4gZG91YmxlIGNsaWNrIG9uIHRoZSBjcm9wcGVyXG5cbiAgICAvLyBEaW1lbnNpb25zXG4gICAgbWluQ2FudmFzV2lkdGg6IDAsXG4gICAgbWluQ2FudmFzSGVpZ2h0OiAwLFxuICAgIG1pbkNyb3BCb3hXaWR0aDogMCxcbiAgICBtaW5Dcm9wQm94SGVpZ2h0OiAwLFxuICAgIG1pbkNvbnRhaW5lcldpZHRoOiAyMDAsXG4gICAgbWluQ29udGFpbmVySGVpZ2h0OiAxMDAsXG5cbiAgICAvLyBFdmVudHNcbiAgICBidWlsZDogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICBidWlsdDogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICBkcmFnc3RhcnQ6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgZHJhZ21vdmU6IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgZHJhZ2VuZDogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICB6b29taW46IG51bGwsIC8vIEZ1bmN0aW9uXG4gICAgem9vbW91dDogbnVsbCwgLy8gRnVuY3Rpb25cbiAgICBjaGFuZ2U6IG51bGwgLy8gRnVuY3Rpb25cbiAgfTtcblxuICBDcm9wcGVyLnNldERlZmF1bHRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAkLmV4dGVuZChDcm9wcGVyLkRFRkFVTFRTLCBvcHRpb25zKTtcbiAgfTtcblxuICAvLyBVc2UgdGhlIHN0cmluZyBjb21wcmVzc29yOiBTdHJtaW4gKGh0dHBzOi8vZ2l0aHViLmNvbS9mZW5neXVhbmNoZW4vc3RybWluKVxuICBDcm9wcGVyLlRFTVBMQVRFID0gKGZ1bmN0aW9uIChzb3VyY2UsIHdvcmRzKSB7XG4gICAgd29yZHMgPSB3b3Jkcy5zcGxpdCgnLCcpO1xuICAgIHJldHVybiBzb3VyY2UucmVwbGFjZSgvXFxkKy9nLCBmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIHdvcmRzW2ldO1xuICAgIH0pO1xuICB9KSgnPDAgNj1cIjUtY29udGFpbmVyXCI+PDAgNj1cIjUtY2FudmFzXCI+PC8wPjwwIDY9XCI1LTItOVwiPjwvMD48MCA2PVwiNS1jcm9wLTlcIj48MSA2PVwiNS12aWV3LTlcIj48LzE+PDEgNj1cIjUtOCA4LWhcIj48LzE+PDEgNj1cIjUtOCA4LXZcIj48LzE+PDEgNj1cIjUtZmFjZVwiPjwvMT48MSA2PVwiNS03IDctZVwiIDMtMj1cImVcIj48LzE+PDEgNj1cIjUtNyA3LW5cIiAzLTI9XCJuXCI+PC8xPjwxIDY9XCI1LTcgNy13XCIgMy0yPVwid1wiPjwvMT48MSA2PVwiNS03IDctc1wiIDMtMj1cInNcIj48LzE+PDEgNj1cIjUtNCA0LWVcIiAzLTI9XCJlXCI+PC8xPjwxIDY9XCI1LTQgNC1uXCIgMy0yPVwiblwiPjwvMT48MSA2PVwiNS00IDQtd1wiIDMtMj1cIndcIj48LzE+PDEgNj1cIjUtNCA0LXNcIiAzLTI9XCJzXCI+PC8xPjwxIDY9XCI1LTQgNC1uZVwiIDMtMj1cIm5lXCI+PC8xPjwxIDY9XCI1LTQgNC1ud1wiIDMtMj1cIm53XCI+PC8xPjwxIDY9XCI1LTQgNC1zd1wiIDMtMj1cInN3XCI+PC8xPjwxIDY9XCI1LTQgNC1zZVwiIDMtMj1cInNlXCI+PC8xPjwvMD48LzA+JywgJ2RpdixzcGFuLGRyYWcsZGF0YSxwb2ludCxjcm9wcGVyLGNsYXNzLGxpbmUsZGFzaGVkLGJveCcpO1xuXG4gIC8qIFRlbXBsYXRlIHNvdXJjZTpcbiAgPGRpdiBjbGFzcz1cImNyb3BwZXItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImNyb3BwZXItY2FudmFzXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNyb3BwZXItZHJhZy1ib3hcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY3JvcHBlci1jcm9wLWJveFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXZpZXctYm94XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWRhc2hlZCBkYXNoZWQtaFwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1kYXNoZWQgZGFzaGVkLXZcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItZmFjZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1saW5lIGxpbmUtZVwiIGRhdGEtZHJhZz1cImVcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItbGluZSBsaW5lLW5cIiBkYXRhLWRyYWc9XCJuXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLWxpbmUgbGluZS13XCIgZGF0YS1kcmFnPVwid1wiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1saW5lIGxpbmUtc1wiIGRhdGEtZHJhZz1cInNcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtZVwiIGRhdGEtZHJhZz1cImVcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtblwiIGRhdGEtZHJhZz1cIm5cIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtd1wiIGRhdGEtZHJhZz1cIndcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtc1wiIGRhdGEtZHJhZz1cInNcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtbmVcIiBkYXRhLWRyYWc9XCJuZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY3JvcHBlci1wb2ludCBwb2ludC1ud1wiIGRhdGEtZHJhZz1cIm53XCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjcm9wcGVyLXBvaW50IHBvaW50LXN3XCIgZGF0YS1kcmFnPVwic3dcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNyb3BwZXItcG9pbnQgcG9pbnQtc2VcIiBkYXRhLWRyYWc9XCJzZVwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gICovXG5cbiAgLy8gU2F2ZSB0aGUgb3RoZXIgY3JvcHBlclxuICBDcm9wcGVyLm90aGVyID0gJC5mbi5jcm9wcGVyO1xuXG4gIC8vIFJlZ2lzdGVyIGFzIGpRdWVyeSBwbHVnaW5cbiAgJC5mbi5jcm9wcGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoJ2Nyb3BwZXInKSxcbiAgICAgICAgICBmbjtcblxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICR0aGlzLmRhdGEoJ2Nyb3BwZXInLCAoZGF0YSA9IG5ldyBDcm9wcGVyKHRoaXMsIG9wdGlvbnMpKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgJiYgJC5pc0Z1bmN0aW9uKChmbiA9IGRhdGFbb3B0aW9uc10pKSkge1xuICAgICAgICByZXN1bHQgPSBmbi5hcHBseShkYXRhLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpc1VuZGVmaW5lZChyZXN1bHQpID8gdGhpcyA6IHJlc3VsdDtcbiAgfTtcblxuICAkLmZuLmNyb3BwZXIuQ29uc3RydWN0b3IgPSBDcm9wcGVyO1xuICAkLmZuLmNyb3BwZXIuc2V0RGVmYXVsdHMgPSBDcm9wcGVyLnNldERlZmF1bHRzO1xuXG4gIC8vIE5vIGNvbmZsaWN0XG4gICQuZm4uY3JvcHBlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY3JvcHBlciA9IENyb3BwZXIub3RoZXI7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbn0pO1xuKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdDcm9wcGVyJywgWyduZyddKVxuLmRpcmVjdGl2ZSgnbmdDcm9wcGVyJywgWyckcScsICckcGFyc2UnLCBmdW5jdGlvbigkcSwgJHBhcnNlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZToge1xuICAgICAgb3B0aW9uczogJz1uZ0Nyb3BwZXJPcHRpb25zJyxcbiAgICAgIHByb3h5OiAnPW5nQ3JvcHBlclByb3h5JywgLy8gT3B0aW9uYWwuXG4gICAgICBzaG93RXZlbnQ6ICc9bmdDcm9wcGVyU2hvdycsXG4gICAgICBoaWRlRXZlbnQ6ICc9bmdDcm9wcGVySGlkZSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRzKSB7XG4gICAgICB2YXIgc2hvd24gPSBmYWxzZTtcblxuICAgICAgc2NvcGUuJG9uKHNjb3BlLnNob3dFdmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzaG93bikgcmV0dXJuO1xuICAgICAgICBzaG93biA9IHRydWU7XG5cbiAgICAgICAgcHJlcHJvY2VzcyhzY29wZS5vcHRpb25zLCBlbGVtZW50WzBdKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHNldFByb3h5KGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxlbWVudC5jcm9wcGVyKG9wdGlvbnMpO1xuICAgICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gc2V0UHJveHkoZWxlbWVudCkge1xuICAgICAgICBpZiAoIXNjb3BlLnByb3h5KSByZXR1cm47XG4gICAgICAgIHZhciBzZXR0ZXIgPSAkcGFyc2Uoc2NvcGUucHJveHkpLmFzc2lnbjtcbiAgICAgICAgc2V0dGVyKHNjb3BlLiRwYXJlbnQsIGVsZW1lbnQuY3JvcHBlci5iaW5kKGVsZW1lbnQpKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuJG9uKHNjb3BlLmhpZGVFdmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghc2hvd24pIHJldHVybjtcbiAgICAgICAgc2hvd24gPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jcm9wcGVyKCdkZXN0cm95Jyk7XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuJHdhdGNoKCdvcHRpb25zLmRpc2FibGVkJywgZnVuY3Rpb24oZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKCFzaG93bikgcmV0dXJuO1xuICAgICAgICBpZiAoZGlzYWJsZWQpIGVsZW1lbnQuY3JvcHBlcignZGlzYWJsZScpO1xuICAgICAgICBpZiAoIWRpc2FibGVkKSBlbGVtZW50LmNyb3BwZXIoJ2VuYWJsZScpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHByZXByb2Nlc3Mob3B0aW9ucywgaW1nKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIHJlc3VsdCA9ICRxLndoZW4ob3B0aW9ucyk7IC8vIE5vIGNoYW5nZXMuXG4gICAgaWYgKG9wdGlvbnMubWF4aW1pemUpIHtcbiAgICAgIHJlc3VsdCA9IG1heGltaXplU2VsZWN0aW9uKG9wdGlvbnMsIGltZyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIG9wdGlvbnMgdG8gbWFrZSBzZWxlY3Rpb24gbWF4aW11bSBmb3IgdGhlIGltYWdlLlxuICAgKiBmZW5neXVhbmNoZW4vY3JvcHBlciBjYWxjdWxhdGVzIHZhbGlkIHNlbGVjdGlvbidzIGhlaWdodCAmIHdpZHRoXG4gICAqIHdpdGggcmVzcGVjdCB0byBgYXNwZWN0UmF0aW9gLlxuICAgKi9cbiAgZnVuY3Rpb24gbWF4aW1pemVTZWxlY3Rpb24ob3B0aW9ucywgaW1nKSB7XG4gICAgcmV0dXJuIGdldFJlYWxTaXplKGltZykudGhlbihmdW5jdGlvbihzaXplKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBzaXplO1xuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyByZWFsIGltYWdlIHNpemUgKHdpdGhvdXQgY2hhbmdlcyBieSBjc3MsIGF0dHJpYnV0ZXMpLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UmVhbFNpemUoaW1nKSB7XG4gICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgc2l6ZSA9IHtoZWlnaHQ6IG51bGwsIHdpZHRoOiBudWxsfTtcbiAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgZGVmZXIucmVzb2x2ZSh7d2lkdGg6IGltYWdlLndpZHRoLCBoZWlnaHQ6IGltYWdlLmhlaWdodH0pO1xuICAgIH1cblxuICAgIGltYWdlLnNyYyA9IGltZy5zcmM7XG4gICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gIH1cbn1dKVxuLnNlcnZpY2UoJ0Nyb3BwZXInLCBbJyRxJywgZnVuY3Rpb24oJHEpIHtcblxuICB0aGlzLmVuY29kZSA9IGZ1bmN0aW9uKGJsb2IpIHtcbiAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBkZWZlci5yZXNvbHZlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcbiAgfTtcblxuICB0aGlzLmRlY29kZSA9IGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICB2YXIgbWV0YSA9IGRhdGFVcmwuc3BsaXQoJzsnKVswXTtcbiAgICB2YXIgdHlwZSA9IG1ldGEuc3BsaXQoJzonKVsxXTtcbiAgICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhVXJsLnNwbGl0KCcsJylbMV0pO1xuICAgIHZhciBhcnJheSA9IG5ldyBVaW50OEFycmF5KGJpbmFyeS5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmxvYihbYXJyYXldLCB7dHlwZTogdHlwZX0pO1xuICB9O1xuXG4gIHRoaXMuY3JvcCA9IGZ1bmN0aW9uKGZpbGUsIGRhdGEpIHtcbiAgICB2YXIgX2RlY29kZUJsb2IgPSB0aGlzLmRlY29kZTtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGUoZmlsZSkudGhlbihfY3JlYXRlSW1hZ2UpLnRoZW4oZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgIHZhciBjYW52YXMgPSBjcmVhdGVDYW52YXMoZGF0YSk7XG4gICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgZGF0YS54LCBkYXRhLnksIGRhdGEud2lkdGgsIGRhdGEuaGVpZ2h0LCAwLCAwLCBkYXRhLndpZHRoLCBkYXRhLmhlaWdodCk7XG5cbiAgICAgIHZhciBlbmNvZGVkID0gY2FudmFzLnRvRGF0YVVSTChmaWxlLnR5cGUpO1xuICAgICAgcmVtb3ZlRWxlbWVudChjYW52YXMpO1xuXG4gICAgICByZXR1cm4gX2RlY29kZUJsb2IoZW5jb2RlZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5zY2FsZSA9IGZ1bmN0aW9uKGZpbGUsIGRhdGEpIHtcbiAgICB2YXIgX2RlY29kZUJsb2IgPSB0aGlzLmRlY29kZTtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGUoZmlsZSkudGhlbihfY3JlYXRlSW1hZ2UpLnRoZW4oZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgIHZhciBoZWlnaHRPcmlnID0gaW1hZ2UuaGVpZ2h0O1xuICAgICAgdmFyIHdpZHRoT3JpZyA9IGltYWdlLndpZHRoO1xuICAgICAgdmFyIHJhdGlvLCBoZWlnaHQsIHdpZHRoO1xuXG4gICAgICBpZiAoYW5ndWxhci5pc051bWJlcihkYXRhKSkge1xuICAgICAgICByYXRpbyA9IGRhdGE7XG4gICAgICAgIGhlaWdodCA9IGhlaWdodE9yaWcgKiByYXRpbztcbiAgICAgICAgd2lkdGggPSB3aWR0aE9yaWcgKiByYXRpbztcbiAgICAgIH1cblxuICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgcmF0aW8gPSB3aWR0aE9yaWcgLyBoZWlnaHRPcmlnO1xuICAgICAgICBoZWlnaHQgPSBkYXRhLmhlaWdodDtcbiAgICAgICAgd2lkdGggPSBkYXRhLndpZHRoO1xuXG4gICAgICAgIGlmIChoZWlnaHQgJiYgIXdpZHRoKVxuICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogcmF0aW87XG4gICAgICAgIGVsc2UgaWYgKHdpZHRoICYmICFoZWlnaHQpXG4gICAgICAgICAgaGVpZ2h0ID0gd2lkdGggLyByYXRpbztcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbnZhcyA9IGNyZWF0ZUNhbnZhcyhkYXRhKTtcbiAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIHdpZHRoT3JpZywgaGVpZ2h0T3JpZywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgIHZhciBlbmNvZGVkID0gY2FudmFzLnRvRGF0YVVSTChmaWxlLnR5cGUpO1xuICAgICAgcmVtb3ZlRWxlbWVudChjYW52YXMpO1xuXG4gICAgICByZXR1cm4gX2RlY29kZUJsb2IoZW5jb2RlZCk7XG4gICAgfSk7XG4gIH07XG5cblxuICBmdW5jdGlvbiBfY3JlYXRlSW1hZ2Uoc291cmNlKSB7XG4gICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbihlKSB7IGRlZmVyLnJlc29sdmUoZS50YXJnZXQpOyB9O1xuICAgIGltYWdlLnNyYyA9IHNvdXJjZTtcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhkYXRhKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IGRhdGEud2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChlbCkge1xuICAgIGVsLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG5cbn1dKTtcblxufSkoKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAudGVtcGxhdGVzJywgW10pLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHskdGVtcGxhdGVDYWNoZS5wdXQoJ2NvbnRhY3QuaHRtbCcsJzxzZWN0aW9uPlxcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBvbmNoYW5nZT1cImFuZ3VsYXIuZWxlbWVudCh0aGlzKS5zY29wZSgpLm9uRmlsZSh0aGlzLmZpbGVzWzBdKVwiPlxcbiAgICA8YnV0dG9uIG5nLWNsaWNrPVwicHJldmlldygpXCI+U2hvdyBwcmV2aWV3PC9idXR0b24+XFxuICAgIDxidXR0b24gbmctY2xpY2s9XCJzY2FsZSgyMDApXCI+U2NhbGUgdG8gMjAwcHggd2lkdGg8L2J1dHRvbj5cXG4gICAgPGJ1dHRvbiBuZy1jbGljaz1cImNsZWFyKClcIj5DbGVhciBzZWxlY3Rpb248L2J1dHRvbj5cXG4gICAgPGxhYmVsPkRpc2FibGVkIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuZy1tb2RlbD1cIm9wdGlvbnMuZGlzYWJsZWRcIj48L2xhYmVsPlxcblxcbiAgICA8YnIgLz5cXG5cXG4gICAgPGRpdiBuZy1pZj1cImRhdGFVcmxcIiBjbGFzcz1cImltZy1jb250YWluZXJcIj5cXG4gICAgICA8aW1nIG5nLWlmPVwiZGF0YVVybFwiIG5nLXNyYz1cInt7ZGF0YVVybH19XCIgd2lkdGg9XCI4MDBcIlxcbiAgICAgICAgICAgbmctY3JvcHBlclxcbiAgICAgICAgICAgbmctY3JvcHBlci1wcm94eT1cImNyb3BwZXJQcm94eVwiXFxuICAgICAgICAgICBuZy1jcm9wcGVyLXNob3c9XCJzaG93RXZlbnRcIlxcbiAgICAgICAgICAgbmctY3JvcHBlci1oaWRlPVwiaGlkZUV2ZW50XCJcXG4gICAgICAgICAgIG5nLWNyb3BwZXItb3B0aW9ucz1cIm9wdGlvbnNcIj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XCJwcmV2aWV3LWNvbnRhaW5lclwiPlxcbiAgICAgIDxpbWcgbmctaWY9XCJwcmV2aWV3LmRhdGFVcmxcIiBuZy1zcmM9XCJ7e3ByZXZpZXcuZGF0YVVybH19XCI+XFxuICAgIDwvZGl2Plxcbjwvc2VjdGlvbj4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnY3JvcHBlci5odG1sJywnPGRpdiBpZD1cImltYWdlXCI+XFxuICA8aW1nIHdpZHRoPTQwMCBzcmM9XCJodHRwczovL2Zlbmd5dWFuY2hlbi5naXRodWIuaW8vY3JvcHBlci9pbWFnZXMvcGljdHVyZS5qcGdcIiBhbHQ9XCJcIj5cXG48L2Rpdj4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnZWRpdC5odG1sJywnPHNlY3Rpb24+XFxuICBuYW1lXFx1RkYxQTxhIGhyZWY9XCIjXCIgZWRpdGFibGUtdGV4dD1cInZtLm5hbWVcIiBlLWZvcm09XCJ0ZXh0QnRuRm9ybVwiIG9uYWZ0ZXJzYXZlPVwidm0uY2hlY2tOYW1lKCRkYXRhKVwiPnt7IHZtLm5hbWUgfHwgXFwnZW1wdHlcXCcgfX08L2E+XFxuICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCJ0ZXh0QnRuRm9ybS4kc2hvdygpXCIgbmctaGlkZT1cInRleHRCdG5Gb3JtLiR2aXNpYmxlXCI+XFxuICAgIGVkaXRcXG4gIDwvYnV0dG9uPlxcbiAgPGJyPlxcbiAgZGF0ZTpcXG4gIDxhIGhyZWY9XCIjXCIgXFxuICAgICBlZGl0YWJsZS1ic2RhdGU9XCJ2bS5kb2JcIlxcbiAgICAgZS1pcy1vcGVuPVwidm0ub3BlbmVkLiRkYXRhXCJcXG4gICAgIGUtbmctY2xpY2s9XCJ2bS5vcGVuKCRldmVudCxcXCckZGF0YVxcJylcIlxcbiAgICAgZS1kYXRlcGlja2VyLXBvcHVwPVwiZGQtTU1NTS15eXl5XCJcXG4gICA+XFxuICAgIHt7ICh2bS5kb2IgfCBkYXRlOlwiZGQvTU0veXl5eVwiKSB8fCBcXCdlbXB0eVxcJyB9fVxcbiAgPC9hPlxcblxcbiAgPGZvcm0gZGF0YS1lZGl0YWJsZS1mb3JtIG5hbWU9XCJ1aVNlbGVjdEZvcm1cIj5cXG4gICAgPGRpdiBlZGl0YWJsZS11aS1zZWxlY3Q9XCJ1c2VyLnN0YXRlXCIgXFxuICAgICAgICAgZGF0YS1lLWZvcm09XCJ1aVNlbGVjdEZvcm1cIiBcXG4gICAgICAgICBkYXRhLWUtbmFtZT1cInN0YXRlXCIgXFxuICAgICAgICAgbmFtZT1cInN0YXRlXCIgXFxuICAgICAgICAgdGhlbWU9XCJib290c3RyYXBcIiBcXG4gICAgICAgICBkYXRhLWUtbmctbW9kZWw9XCJ1c2VyLnN0YXRlXCIgXFxuICAgICAgICAgZGF0YS1lLXN0eWxlPVwibWluLXdpZHRoOjMwMHB4O1wiXFxuICAgID5cXG4gICAgICB7e3VzZXIuc3RhdGV9fVxcbiAgICAgIDxlZGl0YWJsZS11aS1zZWxlY3QtbWF0Y2ggcGxhY2Vob2xkZXI9XCJTdGF0ZVwiPlxcbiAgICAgICAgICB7eyRzZWxlY3Quc2VsZWN0ZWR9fVxcbiAgICAgIDwvZWRpdGFibGUtdWktc2VsZWN0LW1hdGNoPlxcbiAgICAgIDxlZGl0YWJsZS11aS1zZWxlY3QtY2hvaWNlcyByZXBlYXQ9XCJzdGF0ZSBpbiBzdGF0ZXMgfCBmaWx0ZXI6ICRzZWxlY3Quc2VhcmNoIHRyYWNrIGJ5ICRpbmRleFwiPlxcbiAgICAgICAge3tzdGF0ZX19XFxuICAgICAgPC9lZGl0YWJsZS11aS1zZWxlY3QtY2hvaWNlcz5cXG4gICAgPC9kaXY+XFxuICAgIDxici8+XFxuICAgIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XFxuICAgICAgPCEtLSBidXR0b24gdG8gc2hvdyBmb3JtIC0tPlxcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCJ1aVNlbGVjdEZvcm0uJHNob3coKVwiIG5nLXNob3c9XCIhdWlTZWxlY3RGb3JtLiR2aXNpYmxlXCI+XFxuICAgICAgICBFZGl0XFxuICAgICAgPC9idXR0b24+XFxuICAgICAgPCEtLSBidXR0b25zIHRvIHN1Ym1pdCAvIGNhbmNlbCBmb3JtIC0tPlxcbiAgICAgIDxzcGFuIG5nLXNob3c9XCJ1aVNlbGVjdEZvcm0uJHZpc2libGVcIj5cXG4gICAgICAgIDxici8+XFxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIG5nLWRpc2FibGVkPVwidWlTZWxlY3RGb3JtLiR3YWl0aW5nXCI+XFxuICAgICAgICAgIFNhdmVcXG4gICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBuZy1kaXNhYmxlZD1cInVpU2VsZWN0Rm9ybS4kd2FpdGluZ1wiIG5nLWNsaWNrPVwidWlTZWxlY3RGb3JtLiRjYW5jZWwoKVwiPlxcbiAgICAgICAgICBDYW5jZWxcXG4gICAgICAgIDwvYnV0dG9uPlxcbiAgICAgIDwvc3Bhbj5cXG4gICAgPC9kaXY+ICBcXG4gIDwvZm9ybT5cXG5cXG48L3NlY3Rpb24+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2hvbWUuaHRtbCcsJzxzZWN0aW9uPlxcbiAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIGZpZ3VyZVwiPlxcbiAgICA8ZnJvbSBjbGFzcz1cImZvcm0taW5saW5lXCI+XFxuICAgICAgPGlucHV0IHR5cGU9XCJcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5nLW1vZGVsPVwidm0ua2V5d29yZFwiPlxcbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3Mge3t2bS5zdHlsZS50aXRsZX19XCIgbmctY2xpY2s9XCJ2bS5zZWFyY2hCb29rKCk7XCI+XFx1NjQxQ1xcdTdEMjJcXHU1NkZFXFx1NEU2NjwvYnV0dG9uPlxcbiAgICA8L2Zyb20+XFxuICA8L2Rpdj5cXG4gIDxkaXY+XFxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBuZy1yZXBlYXQ9XCJpdGVtIGluIHZtLmxpc3RcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTIgdGV4dC1jZW50ZXJcIj5cXG4gICAgICAgIDxpbWcgbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEwXCI+XFxuICAgICAgICA8aDIgY2xhc3M9XCJfdGVzdF8xMnoyZl8xXCI+e3tpdGVtLnRpdGxlfX08L2gyPlxcbiAgICAgICAgPGgzPnt7aXRlbS5hdXRob3J9fTwvaDM+XFxuICAgICAgICA8cD4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDt7e2l0ZW0uc3VtbWFyeX19PC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxocj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG48L3NlY3Rpb24+Jyk7XG4kdGVtcGxhdGVDYWNoZS5wdXQoJ2luZGV4Lmh0bWwnLCc8IURPQ1RZUEUgaHRtbD5cXG48aHRtbCBsYW5nPVwiemgtQ05cIj5cXG5cXG48aGVhZD5cXG4gIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxcbiAgPHRpdGxlPkdldFVzZXJNZWRpYVxcdTVCOUVcXHU0RjhCPC90aXRsZT5cXG48L2hlYWQ+XFxuXFxuPGJvZHk+XFxuICA8dmlkZW8gaWQ9XCJ2aWRlb1wiIGF1dG9wbGF5IGNvbnRyb2xzPVwiXCI+XFxuICAgIDxpZGVvPlxcbjwvYm9keT5cXG48c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5cXG4vLyB2YXIgZ2V0VXNlck1lZGlhID0gKG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tc0dldFVzZXJNZWRpYSk7XFxubmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7XFxuICB2aWRlbzogdHJ1ZSxcXG4gIGF1ZGlvOiB0cnVlXFxufSwgZnVuY3Rpb24obG9jYWxNZWRpYVN0cmVhbSkge1xcbiAgdmFyIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFwndmlkZW9cXCcpO1xcbiAgdmlkZW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobG9jYWxNZWRpYVN0cmVhbSk7XFxuICB2aWRlby5vbmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24oZSkge1xcbiAgICBjb25zb2xlLmxvZyhcIkxhYmVsOiBcIiArIGxvY2FsTWVkaWFTdHJlYW0ubGFiZWwpO1xcbiAgICBjb25zb2xlLmxvZyhcIkF1ZGlvVHJhY2tzXCIsIGxvY2FsTWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSk7XFxuICAgIGNvbnNvbGUubG9nKFwiVmlkZW9UcmFja3NcIiwgbG9jYWxNZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpKTtcXG4gIH07XFxufSwgZnVuY3Rpb24oZSkge1xcbiAgY29uc29sZS5sb2coXFwnUmVlZWVqZWN0ZWQhXFwnLCBlKTtcXG59KTtcXG48L3NjcmlwdD5cXG48aHRtbD5cXG4nKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGF5b3V0Lmh0bWwnLCc8c2VjdGlvbj5cXG4gIDxoZWFkZXIgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPnt7dm0udGl0bGV9fTwvaGVhZGVyPlxcblxcbiAgPHVpLXZpZXc+PC91aS12aWV3Plxcbjwvc2VjdGlvbj4nKTt9XSk7Il19
