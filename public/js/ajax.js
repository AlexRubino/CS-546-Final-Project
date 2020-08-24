(function ($) {
      var loginForm = $('#login-form'),
            newUserInput = $('#username'),
            newPassInput = $('#password');

      loginForm.submit(function (event) {
            event.preventDefault();

            var newUser = newUserInput.val();
            var newPass = newPassInput.val();
            var newContent = $('body')
            

            var requestConfig = {
                  method: 'POST',
                  url: '/login',
                  contentType: 'application/json',
                  data: JSON.stringify({
                        username: newUser,
                        password: newPass
                  })
            };

            // console.log(requestConfig);

            $.ajax(requestConfig).then(function (responseMessage) {
                  var newResponse = responseMessage.split("</head>")[1];
                  newResponse = newResponse.split("</html>")[0]
                  newContent.html(newResponse);

            })
      });
})(window.jQuery);