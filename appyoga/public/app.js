let controlAcquired = false;
let currentControlUser = '';
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
let idleTimeout = 0;
$(document).ready(function () {
  const socket = io();
  socket.emit('userConnected', user);

  function toggleKeyState(key) {
    const color = user === '1' ? 'red' : 'yellow';
    key.css('background-color', key.css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
  }

  GetUserData(user);
  $(document).on('click', '.key', function () {
    const key = $(this);
    var valueForKeyToUpdate = 0;
    if (controlAcquired && currentControlUser === user) {
      toggleKeyState(key);
      const index = key.index();
      const color = key.css('background-color');

      if (color == "rgb(255, 0, 0)" || color == "rgb(255, 255, 0)") {
        valueForKeyToUpdate = 1;
      } else {
        valueForKeyToUpdate = 0;
      }
      var correctedIndex = index + 1;
      var keyToUpdate = "key" + correctedIndex;
      $.ajax({
        method: 'POST',
        url: '/updateKeyState',
        data: JSON.stringify({ user, keyToUpdate, valueForKeyToUpdate }),
        contentType: 'application/json',
        success: function (response) {
          if (response.success) {
          }
        }
      });

    }

    setTimeout(function () {
      runAjaxRequest(user);
    }, 120000);
  });

  $('#controlBtn').click(function () {

    var controlButtonText = $('#controlBtn').text();
    var controlFlag = 1;
    if (controlButtonText == "Release Control") {
      controlFlag = 0;
    }
    if (controlFlag == 0) {
      runAjaxRequest(user)
    } else {
      $.ajax({
        method: 'POST',
        url: '/getAccessControlDetails',
        data: JSON.stringify({ user }),
        contentType: 'application/json',
        success: function (response) {
          if (response.success) {
            GetUserData(user);
          }
        }
      });
    }
  });

  socket.on('updateKeyStates', function (keyStates) {
    $('.key').each(function (index) {
      const key = $(this);
      const color = keyStates[index];
      key.css('background-color', color);
    });
  });

  socket.on('updateControlState', function (acquired, controlUser) {
    controlAcquired = acquired;
    currentControlUser = controlUser;
    if (acquired && controlUser === user) {
      $('#controlBtn').text('Release Control');
    } else {
      $('#controlBtn').text('Acquire Control');
    }
  });
});

function GetUserData(user) {
  $.ajax({
    method: 'POST',
    url: '/GetUserData',
    data: JSON.stringify({ user }),
    contentType: 'application/json',
    success: function (response) {
      if (response.success) {

        if (response.parsedResults[0].access_control) {
          controlAcquired = true;
          currentControlUser = user;
          $('#controlBtn').text('Release Control');
        } else {
          controlAcquired = false;
          currentControlUser = user;
          $('#controlBtn').text('Acquire Control');
        }

        const color = user === '1' ? 'red' : 'yellow';

        if (response.parsedResults[0].key1) {
          $('#key1').css('background-color', $('#key1').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key1').css('background-color', 'white');

        }
        if (response.parsedResults[0].key2) {
          $('#key2').css('background-color', $('#key2').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key2').css('background-color', 'white');

        }
        if (response.parsedResults[0].key3) {
          $('#key3').css('background-color', $('#key3').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key3').css('background-color', 'white');

        }
        if (response.parsedResults[0].key4) {
          $('#key4').css('background-color', $('#key4').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key4').css('background-color', 'white');

        }
        if (response.parsedResults[0].key5) {
          $('#key5').css('background-color', $('#key5').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key5').css('background-color', 'white');

        }
        if (response.parsedResults[0].key6) {
          $('#key6').css('background-color', $('#key6').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key6').css('background-color', 'white');

        }
        if (response.parsedResults[0].key7) {
          $('#key7').css('background-color', $('#key7').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key7').css('background-color', 'white');

        }
        if (response.parsedResults[0].key8) {
          $('#key8').css('background-color', $('#key8').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key8').css('background-color', 'white');

        }
        if (response.parsedResults[0].key9) {
          $('#key9').css('background-color', $('#key9').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key9').css('background-color', 'white');

        }
        if (response.parsedResults[0].key10) {
          $('#key10').css('background-color', $('#key10').css('background-color') === 'rgb(255, 255, 255)' ? color : 'white');
        } else {
          $('#key10').css('background-color', 'white');

        }

      }
    }
  });
}

function runAjaxRequest(user) {
  $.ajax({
    method: 'POST',
    url: '/updateReleaseControls',
    data: JSON.stringify({ user }),
    contentType: 'application/json',
    success: function (response) {
      if (response.success) {
        GetUserData(user);
      }
    }
  });
}
