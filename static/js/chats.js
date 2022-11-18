$(document).ready(function () {

    $('#creator').on('click',function () {
        $.ajax({
            data: $('.create-chat-form').serialize(),
            url: '',
            method: 'GET',
            success: function (response) {
                let container = document.querySelector('.create-chat-form')
                container.insertAdjacentHTML('beforebegin', response.content);
                },
                    error: function (response) {
                }
            });
        return false;
    });
})


