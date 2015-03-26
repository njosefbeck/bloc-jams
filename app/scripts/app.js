//require("./landing");
//require("./collection");
//require("./album");
//require("./profile");

// Example album
var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',

  songs: [
      { name: 'Blue', length: '163.38', audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: '105.66', audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: '270.14', audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: '154.81', audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: '375.92', audioUrl: '/music/placeholders/magenta' }
  ]
};

// Another Example album
var albumMarconi = {
  name: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: '/images/album-placeholder2.png',

  songs: [
      { name: 'Hello, Operator?', length: '1:01' },
      { name: 'Ring, ring, ring', length: '5:01' },
      { name: 'Fits in your pocket', length: '3:21' },
      { name: 'Wrong phone number', length: '2:15' }
  ]
};

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    views: {
      "mainView": {
        templateUrl: '/templates/landing.html',
        controller: 'Landing.controller'
      },
      "searchBar": {
        templateUrl: '/templates/search_bar.html',
        controller: 'SearchBar.controller'
      }
    }
  });

  $stateProvider.state('song', {
    url: '/song',
    controller: 'Song.controller',
    templateUrl: '/templates/song.html'
  });

  $stateProvider.state('collection', {
    url: '/collection',
    views: {
      "mainView": {
        templateUrl: "/templates/collection.html",
        controller: "Collection.controller"
      },
      "playerBar": {
        templateUrl: "/templates/player_bar.html"
      }
    }
  });

  $stateProvider.state('album', {
    url: '/album',
    views: {
      "mainView": { 
        templateUrl: "/templates/album.html",
        controller: "Album.controller" 
      },
      "playerBar": { 
        templateUrl: "/templates/player_bar.html"
      }
    }
  });

}]);

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  
  //ConsoleLogger.log();

  $scope.headerText = "Bloc Jams";

  $scope.albumURLs = [
    '/images/album-placeholders/album-1.jpg',
    '/images/album-placeholders/album-2.jpg',
    '/images/album-placeholders/album-3.jpg',
    '/images/album-placeholders/album-4.jpg',
    '/images/album-placeholders/album-5.jpg',
    '/images/album-placeholders/album-6.jpg',
    '/images/album-placeholders/album-7.jpg',
    '/images/album-placeholders/album-8.jpg',
    '/images/album-placeholders/album-9.jpg',
  ];

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
    };

  $scope.headerTextClicked = function() {
    console.log("Header was clicked");
    shuffle($scope.albumURLs);
  };

  $scope.subText = "Turn the music up!";

  $scope.subTextClicked = function() {
    $scope.subText += '!';
  };

}]);

blocJams.controller('Collection.controller', ['$scope', 'ConsoleLogger', 'SongPlayer', function($scope, ConsoleLogger, SongPlayer) {

  //ConsoleLogger.log();

  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }

  $scope.playAlbum = function(album) {
    SongPlayer.setSong(album, album.songs[0]);
  }

}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
  
  //ConsoleLogger.log();

  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;

  $scope.onHoverSong = function(song) {
    hoveredSong = song;
  };

  $scope.offHoverSong = function(song) {
    hoveredSong = null;
  };

  $scope.getSongState = function(song) {
    if (song === SongPlayer.currentSong && SongPlayer.playing) {
      return 'playing';
    }
    else if (song === hoveredSong) {
      return 'hovered';
    }
    return 'default';
  };

  $scope.playSong = function(song) {
    SongPlayer.setSong($scope.album, song);
  };

  $scope.pauseSong = function(song) {
    playingSong = null;
  };

}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);

blocJams.controller('SearchBar.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {
  $scope.consoleLogger = ConsoleLogger;

  $scope.searchBar = {};
  $scope.searchBar.searchInput = "Test";
}]);

blocJams.service('SongPlayer', function() {
  
  var currentSoundFile = null;

  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  }

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,

    play: function() {
      this.playing = true;
      currentSoundFile.play();
    },
    pause: function() {
      this.playing = false;
      currentSoundFile.pause();
    },
    next: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;
      if (currentTrackIndex >= this.currentAlbum.songs.length) {
        currentTrackIndex = 0;
      }
      var song = this.currentSong = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
    },
    previous: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = this.currentAlbum.songs.length - 1;
      }
      var song = this.currentSong = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
    },
    setSong: function(album, song) {
      if (currentSoundFile) {
        currentSoundFile.stop();
      }
      this.currentAlbum = album;
      this.currentSong = song;

      currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: ["mp3"],
        preload: true
      });

      this.play();
    }
  };
});

blocJams.service('ConsoleLogger', function() {
  return {
    log: function() {
      var input = element(by.binding('searchBar.searchInput'));
      console.log(input);
    }

  }
});

blocJams.directive('slider', ['$document', function($document) {
 
  //Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
  var calculateSliderPercentFromMouseEvent = function($slider, event) {
    var offsetX = event.pageX - $slider.offset().left; // Distance from left
    var sliderWidth = $slider.width(); // Width of slider
    var offsetXPercent = (offsetX / sliderWidth);
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
  }

  var numberFromValue = function(value, defaultValue) {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'undefined') {
      return defaultValue;
    }

    if (typeof value === 'string') {
      return Number(value);
    }
  }

  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
    scope: {}, // Creates a scope that exists only in this directive.
    link: function(scope, element, attributes) { 
      // These values represent the progress into the song/volume bar, and its max value.
      // For now, we're supplying arbitrary initial and max values.
      scope.value = 0;
      scope.max = 100;
 
      var $seekBar = $(element);

      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0);
      });

      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });
 
      var percentString = function () {
        var value = scope.value || 0;
        var max = scope.max || 100;
        percent = value / max * 100;
        return percent + "%";
      }

      scope.fillStyle = function() {
        return {width: percentString()};
      }

      scope.thumbStyle = function() {
        return {left: percentString()};
      }

      scope.onClickSlider = function(event) {
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.value = percent * scope.max;
      }

      scope.trackThumb = function() {
        $document.bind('mousemove.thumb', function(event){
          var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
          scope.$apply(function(){
            scope.value = percent * scope.max;
          });
        });

        //cleanup
        $document.bind('mouseup.thumb', function(){
          $document.unbind('mousemove.thumb');
          $document.unbind('mouseup.thumb');
        })
      }
      
    }
  };
}]);
