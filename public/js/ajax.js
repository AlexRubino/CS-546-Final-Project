(function ($) {
      var loginForm = $('#login-form'),
            newUserInput = $('#username'),
            newPassInput = $('#password');

      loginForm.submit(function (event) {
            event.preventDefault();

            var newUser = newUserInput.val();
            var newPass = newPassInput.val();
            var newContent = $('html');

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
                  // console.log(responseMessage);
                  console.log(responseMessage);
                  newContent.html(responseMessage);
            })
      });
})(window.jQuery);