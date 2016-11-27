var app = angular.module('time', []);

var body = $('body');

app.controller('timeController', function($scope) {
  var t = new Date();
  var h = t.getHours();
  var m = t.getMinutes();

  var mo = t.getMonth();
  var day = t.getDay();

  var month = function() {
    var block = '';
    switch (mo) {
      case 0:
        block += 'January';
        break;
      case 1:
        block += 'Feburary';
        break;
      case 2:
        block += 'March ';
        break;
      case 3:
        block += 'April';
        break;
      case 4:
        block += 'May';
        break;
      case 5:
        block += 'June';
        break;
      case 6:
        block += 'July';
        break;
      case 7:
        block += 'August';
        break;
      case 8:
        block += 'September';
        break;
      case 9:
        block += 'October';
        break;
      case 10:
        block += 'November';
        break;
      case 11:
        block += 'December';
        break;
    }
    if (mo < 10) {
      mo = '0' + mo;
    }
    switch (day) {
      // th
      case 1: case 4: case 5:
      case 6: case 7: case 8:
      case 9: case 10: case 11:
      case 12: case 13: case 14:
      case 16: case 17: case 18:
      case 19: case 20: case 24:
      case 24: case 25: case 26:
      case 27: case 28: case 29:
      case 30:
        day = day + 'th'; break;
      case 2: // nd
        day = day + 'nd'; break;
      case 3: case 23: // rd
        day = day + 'rd'; break;
      case 21: case 22: // st
        day = day + 'st'; break;
    }
    return mo + ' ' + block + ' ' + day;
  }
  set = function() {
    if (h > 12) {
      while (h > 12) {
        switch (h) {
          case 13:
            h = '1';
            break;
          case 14:
            h = '2';
            break;
          case 15:
            h = '3';
            break;
          case 16:
            h = '4';
            break;
          case 17:
            h = '5';
            break;
          case 18:
            h = '6';
            break;
          case 19:
            h = '7';
            break;
          case 20:
            h = '8';
            break;
          case 21:
            h = '9';
            break;
          case 22:
            h = '10';
            break;
          case 23:
            h = '11';
            break;
          case 24:
            h = '12';
            break;
        }
      }
    }
    if (m < 10) {
      m = '0' + m;
    }
    return (h + ':' + m + (' AM' ? ' PM' : ''));
  }
  $scope.time = set();
  $scope.month = month();
})