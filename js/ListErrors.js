(function( exports ) {

    function ListErrors( data ) {

        if( !data.pubsub ) throw{ message: 'module required pubsub' };
        if( !data.container ) throw{ message: 'module required container <ul></ul>' };

        this.container = data.container;
        this.pubsub = data.pubsub;
        this.storage = [];

        let that = this;

        this.pubsub.subscribe('new_error', this.addError.bind( this ) );
        this.container.addEventListener('click', function( event ) {

            let target = event.target;

            if( target.dataset.role === 'close' ) that.removeError( target );

        }, true );
    };

    let fn = ListErrors.prototype;

    fn.addError = function( data ) {

        this.storage.push( data );

        let item = createItemList( data );

        this.container.appendChild( item );
    };

    fn.removeError = function( target ) {

        let li = getParentElement( target, 'LI' ),
            id = li.dataset.id;
            index = this.storage.indexOf( id );

        if( index < 0 ) throw{message:''};

        this.storage.splice( index, 1 );

        this.container.removeChild( li );
    };

    function getParentElement( target, tagname ) {

        while( true ) {

            if( target.tagName !== tagname ) target = target.parentElement;
            else return target;
        }
    };

    function createItemList( content ) {

        let li = document.createElement('li'),
            div = document.createElement('div'),
            span = document.createElement('span');

        span.innerHTML = '&times;';
        span.dataset.role = 'close';
        li.innerHTML = content;
        li.dataset.id = content;

        div.appendChild( span );
        li.appendChild( div );

        return li;
    };

    exports.ListErrors = ListErrors;

})( window );