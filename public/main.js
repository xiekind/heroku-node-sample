// <!-- BUTA-ANON -->
$(function () {
  // array of colors
  var colors = [
    '#ff0066', // pink
    '#ff00ff', // light pink
    '#990000', // dark red
    '#ff9900', // yellow fam
    '#0066ff', // blue
    '#77b300', // yellow green
    '#00b300', // green
    '#00e6e6', // light blue
    '#0066ff', // blue
    '#6600ff', // violet
    '#cc00cc', // pink
    '#ff0000' // red
  ];


  // Initialize variables
  var $window = $(window); //for the keyboard event like if enter is hit
  var $usernameInput = $('.nickName'); // Input area of user for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message in input box

  var $loginPage = $('.login.page'); // The login page

  // Prompt for setting a username
  var username; 
  var connected = false;
  var typing = false;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val();
    // if there is a non-empty message and a socket connection
    // check if the message is valid/true and if user is connected
    if (message && connected) {
      // as the user sends the message this line will clear the user input
      $inputMessage.val('');
      // calls the function addChatMessage and, 
      //pass the user's input username as the parameter the addChatMessage requires and
      // user's input message to the addChatMessage
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {
    // Don't fade the message in if user was typing'
    var $typingMessages = getTypingMessages(data); // pass the data driven from the getTypingMessage to the variable $typingMessages
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody"/>')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : ''; // check user has input a message
    if (data.username == username) { // current page ..... username
      var $messageDiv = $('<li style="margin-left:80%;margin-top:20px;font-family: Inconsolata, monospace;" />')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv);
    } else {
      // var $messageDiv = $('<li style="margin-right:80%;;font-family: Shadows Into Light Two, cursive;" />')
      var $messageDiv = $('<li style="margin-right:80%;margin-top:20px;font-family: Inconsolata, monospace;" />')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv);
    }

  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  const addMessageElement = (el) => {
    $messages.append(el);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Gets the 'X is typing' messages of a user
  const getTypingMessages = (data) => {
    return $('.typing.message').filter(function () {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % colors.length);
    return colors[index];
  }

  // Keyboard events

  $window.keydown(event => {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        username = $usernameInput.val().trim(); // set the username

        // If the username is valid
        if (username) {
          $loginPage.fadeOut(); // the login page will disappear
          $loginPage.off('click'); // remove all the event handlers of the login page
          $currentInput = $inputMessage.focus(); // focus the input on the message input

          // Tell the server your username
          socket.emit('add user', username);
        }
      }
    }
  });

  $inputMessage.on('input', () => {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
    }
  });

  // Click events

  // when the user triggered the submit button
  $("#submit").click(function () {
    username = $usernameInput.val().trim(); // set the username

    // If the username is valid
    if (username && username.length >= 4) {
      $loginPage.fadeOut(); // the login page will disappear
      $loginPage.off('click'); // remove all the event handlers of the login page
      $currentInput = $inputMessage.focus(); // focus the input on the message input

      // Tell the server your username
      socket.emit('add user', username);
    }
 
  })


  // when the user triggered the send button
  $("#send").click(function () {
    if (username) {
      sendMessage();
      socket.emit('stop typing');
      typing = false;
    }
  })
  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', () => {
    connected = true;
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

});


  // FUNCTIONAL
  // - Color
  // 
  // 
  // 
  // 
  // 