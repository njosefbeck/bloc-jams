if (document.URL.match(/\/collection.html/)) {
  // Wait until the HTML is fully processed.
  $(document).ready(function() {
    console.log("collection.js");
  });
}