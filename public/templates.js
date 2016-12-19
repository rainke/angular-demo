angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('contact.html','<section>\n    <input type="file" onchange="angular.element(this).scope().onFile(this.files[0])">\n    <button ng-click="preview()">Show preview</button>\n    <button ng-click="scale(200)">Scale to 200px width</button>\n    <button ng-click="clear()">Clear selection</button>\n    <label>Disabled <input type="checkbox" ng-model="options.disabled"></label>\n\n    <br />\n\n    <div ng-if="dataUrl" class="img-container">\n      <img ng-if="dataUrl" ng-src="{{dataUrl}}" width="800"\n           ng-cropper\n           ng-cropper-proxy="cropperProxy"\n           ng-cropper-show="showEvent"\n           ng-cropper-hide="hideEvent"\n           ng-cropper-options="options">\n    </div>\n\n    <div class="preview-container">\n      <img ng-if="preview.dataUrl" ng-src="{{preview.dataUrl}}">\n    </div>\n</section>');
$templateCache.put('home.html','<section>\n  <div class="text-center figure">\n    <from class="form-inline">\n      <input type="" class="form-control" ng-model="vm.keyword">\n      <button class="btn btn-success {{vm.style.title}}" ng-click="vm.searchBook();">\u641C\u7D22\u56FE\u4E66</button>\n    </from>\n  </div>\n  <div>\n    <div class="row" ng-repeat="item in vm.list">\n      <div class="col-xs-2 text-center">\n        <img ng-src="{{item.image}}">\n      </div>\n      <div class="col-xs-10">\n        <h2>{{item.title}}</h2>\n        <h3>{{item.author}}</h3>\n        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.summary}}</p>\n      </div>\n      <hr>\n    </div>\n  </div>\n</section>');
$templateCache.put('index.html','<!DOCTYPE html>\n<html lang="zh-CN">\n\n<head>\n  <meta charset="UTF-8">\n  <title>GetUserMedia\u5B9E\u4F8B</title>\n</head>\n\n<body>\n  <video id="video" autoplay controls="">\n    <ideo>\n</body>\n<script type="text/javascript">\n// var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);\nnavigator.getUserMedia({\n  video: true,\n  audio: true\n}, function(localMediaStream) {\n  var video = document.getElementById(\'video\');\n  video.src = window.URL.createObjectURL(localMediaStream);\n  video.onloadedmetadata = function(e) {\n    console.log("Label: " + localMediaStream.label);\n    console.log("AudioTracks", localMediaStream.getAudioTracks());\n    console.log("VideoTracks", localMediaStream.getVideoTracks());\n  };\n}, function(e) {\n  console.log(\'Reeeejected!\', e);\n});\n</script>\n<html>\n');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);