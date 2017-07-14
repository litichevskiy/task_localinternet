(function( exports, search ) {

    const FAKE_BALANCE = 1000;

    let storageUser = (function() {

        let pubsub, length = 0, first_user = false;

        if( !localStorage.getItem('__storage') ) {

            localStorage.setItem('__storage', JSON.stringify( [] ) );
            console.log( 'localStorage: A repository was created' );
        }

        return {

            addItem: function( data ) {

                if( !data ) return;

                if( !first_user ) {

                    first_user = true;
                    pubsub.publish('user_exists');
                }

                let storage = JSON.parse( localStorage.getItem('__storage') );

                length = storage.length;

                if( data.id === undefined ) {

                    data.id = ( length < 1 ) ? 0 : length;
                    data.balance = getBalance( FAKE_BALANCE );
                    storage.push( data );

                    localStorage.setItem('__storage', JSON.stringify( storage ) );

                    return { data: data, add: true };
                }

                else{

                    let result = search( storage, +data.id ),
                        is_identical = CheckForIdentical( result, data );

                    if( is_identical ) {

                        for( let key in data ) {

                            if( key === 'id' ) continue;

                            result[key] = data[key];
                        }

                        if( result.balance ) data.balance = result.balance;

                        localStorage.setItem('__storage', JSON.stringify( storage ) );

                        return { data: data, update: true };
                    }
                }
            },

            updateBalance: function() {

                let storage = JSON.parse( localStorage.getItem('__storage') ),
                    randomData = getBalance( length ),
                    data = search( storage, randomData );

                data.balance = getBalance( FAKE_BALANCE );

                localStorage.setItem('__storage', JSON.stringify( storage ) );

                return data;
            },

            getList: function() {

                let list = JSON.parse( localStorage.getItem('__storage') );

                length = list.length;

                return list;
            },

            deleteStorare: function() {

                let storage = JSON.parse( localStorage.getItem('__storage') );

                storage = [];
                pubsub.publish('the_storage_is_empty', storage );

                localStorage.setItem('__storage', JSON.stringify( storage ) );

            },

            init: function( data ) {

                pubsub = data;

                pubsub.subscribe( 'save_user_info', this.addItem );
                pubsub.subscribe( 'delete_storage', this.deleteStorare );
            }
        }

    })();

    function CheckForIdentical( newData, oldData ){

        let result = false;

        for( let key in newData ) {

            if( newData[key] !== oldData[key] ) {

                result = true;
                break;
            }
        }

        return result;
    };

    function getBalance( num ) {

        return Math.floor( Math.random() * num );
    };

    exports.storageUser = storageUser;

})( window, searchData );