(function( exports ) {

    function EditForm( data ) {

        if( !data.pubsub ) throw{ message: 'module required pubsub' };
        if( !data.container ) throw{ message: 'module required container' };

        this.container = data.container;
        this.pubsub = data.pubsub;
        this.CLASS_ERROR = data.errorClass || 'error';
        this.MIN_LENGTH = data.minLengthl || 1;
        this.MAX_LENGTH = data.maxLength || 15;
        this.MIN_AGE = data.minAge || 18;
        this.MAX_AGE = data.maxAge || 50;

        let inputAge = this.container.querySelector('input[name="age"]');
        inputAge.min = this.MIN_AGE;
        inputAge.max = this.MAX_AGE;

        let that = this;

        this.pubsub.subscribe('the_storage_is_empty', function( data ) {

            let inputs = that.container.querySelectorAll('input[data-role]');

            clearValue( inputs );
        });

        this.pubsub.subscribe( 'selected_user', function( data ) {

            setInputsValue( that.container, data );
        });

        this.container.addEventListener('focus', function( event ) {

            let errorElem = this.querySelector( '.' + that.CLASS_ERROR );
            if( errorElem ) errorElem.classList.remove( that.CLASS_ERROR );

        }, true );

        this.container.addEventListener('submit', function( event ) {

            event.preventDefault();

            let inputsText = this.querySelectorAll('input[data-role="text"]'),
                checkLength = validateLength( inputsText, that.CLASS_ERROR, that.MIN_LENGTH, that.MAX_LENGTH );

            if( !checkLength ) return;

            let inputsNumber = this.querySelectorAll('input[data-role="number"]'),
                checkAge = validateAge( inputsNumber, that.CLASS_ERROR, that.MIN_AGE, that.MAX_AGE );

            if( !checkAge ) return;

            let inputs = this.querySelectorAll('input[data-role]'),
            data = {}, item;

            for( let i = 0; i < inputs.length; i++ ) {

                item = inputs[i];

                if( item.value === '' ) continue;

                data[item.name] = item.value;
            }

            clearValue( inputs );

            that.pubsub.publish('send_user_info', data );

        }, true );
    };

    function clearValue( list ) {

        for( let i = 0; i < list.length; i++ ) {

            list[i].value = '';
        }
    };

    function addErrorClass( target, errorClass ) {

        if( target ) target.classList.add( errorClass );
    };

    function validateLength ( list, errorClass, min, max ) {

        let value, is_valid;
        list.every = [].every;

        is_valid = list.every(function( item ) {

            value = item.value = item.value.trim();

            if( value.length < min ) return addErrorClass( item, errorClass );

            else

                if( value.length > max ) return addErrorClass( item, errorClass );

                else return true;
        });

        return is_valid;
    };

    function validateAge( list, errorClass, min, max ) {

        let value, is_valid;
        list.every = [].every;

        is_valid = list.every(function( item ) {

            value = item.value = item.value.trim();

            if( +value >= min && +value <= max ) return true
            else return addErrorClass( item, errorClass );
        });

        return is_valid;
    };

    function setInputsValue( parent, data ) {

        let item;

        for( key in data ) {

            item = parent.querySelectorAll('input[name="'+key+'"]')[0];

            if( item ) item.value = data[ key ];
        }
    };

    exports.EditForm = EditForm;

})( window )