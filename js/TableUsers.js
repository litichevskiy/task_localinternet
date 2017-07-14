(function( exports, search ) {

    function TableUsers( data ) {

        if( !data.pubsub ) throw{ message: 'module required pubsub module' };
        if( !data.container ) throw{ message: 'module required container - <table></table>' };
        if( !data.headers ) throw{ message: 'module required headers table - array string' };

        this.pubsub = data.pubsub;
        this.list = data.list || [];
        this.currency = data.currency || ' $';
        this.container = data.container;
        this.tbody;
        this.headers = data.headers;
        this.is_create_table = false;

        if( data.list.length > 0 ) this.init();

        this.pubsub.subscribe('user', this.addUser.bind( this ) );
        this.pubsub.subscribe('update_user_data', this.updateRow.bind( this ) );
        this.pubsub.subscribe('update_user_balance', this.replaseBalance.bind( this ) );
    };

    let fn = TableUsers.prototype;

    fn.init = function() {

        this.is_create_table = true;

        let thead = createThead( this.headers ),
            tbody = createTbody( this.list, this.headers, this.currency );

        this.container.appendChild( thead );
        this.container.appendChild( tbody );

        this.tbody = this.container.querySelector('tbody');

        this.tbody.addEventListener('click', this.publishClick.bind( this ) );
    };

    fn.publishClick = function( event ) {

        let target = event.target,
            tr = getParentElement( target, 'TR' ),
            id = +tr.dataset.id,
            data = search( this.list, id );

        if( data ) this.pubsub.publish('selected_user', data );
    };

    fn.addUser = function( data ) {

        if( !data ) return;

        this.list.push( data );

        if( !this.is_create_table ) return this.init();

        let row = createRow( [data], this.headers, this.currency );

        this.tbody.appendChild( row );
    };

    fn.updateRow = function( data ) {

        let newRow = createRow( [data], this.headers, this.currency ),
            oldRow = this.tbody.querySelector('tr[data-id="'+data.id+'"]');

        this.tbody.replaceChild( newRow, oldRow );
    };

    fn.replaseBalance = function( data ) {

        let id = data.id,
            row = this.container.querySelector('tr[data-id="'+id+'"]'),
            cell;

        if( !row ) return;

        cell = row.querySelector('td[data-role="balance"]');
        cell.innerHTML = data.balance + this.currency;
    };

    function createRow( list, headers, currency ) {

        let length = list.length,
            fragment = document.createDocumentFragment(),
            item, tr;

        for( let i = 0; i < length; i++ ) {

            item = list[ i ];

            tr = document.createElement('tr');
            tr.dataset.id = item['id'];

            for( key in headers ) {

                td = document.createElement('td');
                td.dataset.role = key;
                td.innerHTML = ( key === 'balance' ) ? item[ key ] + currency : item[ key ];
                tr.appendChild( td );
            }

            fragment.appendChild( tr );
        }

        return fragment;
    };

    function createThead( data, parent ) {

        let thead = document.createElement('thead'),
            tr = document.createElement('tr'), th;

        for( key in data ) {

            th = document.createElement('th');
            th.innerHTML = data[ key ];

            tr.appendChild( th );
        }

        thead.appendChild( tr );

        return thead;
    };

    function createTbody( list, headers, currency ) {

        let tbody = document.createElement('tbody'),
            result = createRow( list, headers, currency );

        tbody.appendChild( result );

        return tbody;
    };

    function getParentElement( target, tagname ) {

        while( true ) {

            if( target.tagName !== tagname ) target = target.parentElement;
            else return target;
        }
    };

    exports.TableUsers = TableUsers;

})( window, searchData );