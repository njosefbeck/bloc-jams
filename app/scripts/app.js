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
      { name: 'Blue', length: '4:26' },
      { name: 'Green', length: '3:14' },
      { name: 'Red', length: '5:01' },
      { name: 'Pink', length: '3:21' },
      { name: 'Magenta', length: '2:15' }
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

blocJams.controller('Landing.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {
  
  ConsoleLogger.log();

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

blocJams.controller('Collection.controller', ['$scope', function($scope) {
  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }

}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
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
    SongPlayer.play();
  };

  $scope.pauseSong = function(song) {
    playingSong = null;
  };

}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);

blocJams.service('SongPlayer', function() {
  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,

    play: function() {
      this.playing = true;
    },
    pause: function() {
      this.playing = false;
    },
    setSong: function(album, song) {
      this.currentAlbum = album;
      this.currentSong = song;
    }
  };
});

blocJams.service('ConsoleLogger', function() {
  return {
    log: function() {
      console.log("Hello World!");
    }

  }
});
