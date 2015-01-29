$(document).ready(function() {
  $('.hero-content h3').click(function() {
    var subText = $(this).text();
    $(this).text(subText + "!");
  });

  $('.selling-points .point').hover(function() {
    console.log('Hover action triggered.');
    $(this).animate({'margin-top': '10px'});
  });
});
