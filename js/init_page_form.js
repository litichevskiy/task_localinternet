(function() {

    let pubsub = new PubSub;

    storageUser.init( pubsub );

    let tableUsers = new TableUsers({
        container: document.querySelector('.table_users'),
        pubsub: pubsub,
        currency: ' $',
        headers:{

            first_name: 'Фамилия',
            last_name: 'Имя',
            patronymic: 'Отчество',
            age: 'Возраст',
            balance: 'Баланс'
        },

        list: storageUser.getList()
    });

    fakeServerApi.init( pubsub );

    let editForm = new EditForm({
        container: document.querySelector('.form_edit_user_info'),
        pubsub: pubsub,
        errorClass: 'error',
        minLengthl: 1,
        maxLength: 15,
        minAge: 18,
        maxAge: 50
    });

    let listErrors = new ListErrors({
        pubsub: pubsub,
        container: document.querySelector('.list_errors')
    });

    let del = document.querySelector('[data-role="clear_table"]');

    del.addEventListener('click', function( event ) {

        event.preventDefault();

        pubsub.publish('delete_storage');
    }, true );

})();