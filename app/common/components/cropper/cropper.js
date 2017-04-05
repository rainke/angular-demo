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