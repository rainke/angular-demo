angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('contact.html','<section>\n  <h1>contact us</h1>\n  <p>blabalbal</p>\n</section>');
$templateCache.put('home.html','<section>\n  <button class="btn btn-success" ui-sref="contact">\u8FDB\u5165\u8054\u7CFB</button>\n</section>');
$templateCache.put('layout.html','<section>\n  <header class="text-center">{{vm.title}}</header>\n\n  <ui-view></ui-view>\n</section>');}]);