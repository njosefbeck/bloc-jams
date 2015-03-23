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
      { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
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

blocJams.directive('slider', function() {
  var updateSeekPercentage = function($seekBar, event) {
    var barWidth = $seekBar.width();
    var offsetX = event.pageX - $seekBar.offset().left; // get mouse x offset here

    var offsetXPercent = (offsetX / barWidth) * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}

  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
    link: function(scope, element, attributes) {

      var $seekBar = $(element);

      $seekBar.click(function(event) {
        updateSeekPercentage($(this), event);
      });

      $seekBar.find('.thumb').mousedown(function(event) {
        //var $seekBar = $(this).parent();

        $seekBar.addClass('no-animate');

        $(document).bind('mousemove.thumb', function(event) {
          updateSeekPercentage($seekBar, event);
        });

      //cleanup
      $(document).bind('mouseup.thumb', function() {
        $seekBar.removeClass('no-animate');

        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
      });

      });
   }
  };
}); 
