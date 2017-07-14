(function( exports, storage ) {

    const   TIME_UPDATE_BALANCE = 120000, //ms ( 2min )
            ERORR_CONTENT = 'error: Lorem ipsum dolor sit amet,'+
                        'consectetur adipiscing elit. Curabitur'+
                        'porttitor lacus';

    let fakeServerApi = (function(){

        let pubsub;

        return {

            send:function( data ) {

                let check = this.isError();

                if( check ) {

                    pubsub.publish('new_error', check.messge );
                    return;
                }

                let result = storage.addItem( data );

                if( result.update ) pubsub.publish('update_user_data', result.data );
                else
                    if( result.add ) pubsub.publish( 'user', result.data );
            },

            init: function( data ) {

                pubsub = data;
                pubsub.subscribe('send_user_info', this.send.bind( this ) );

                let list = storage.getList();

                if( list.length > 0 ) this.updateBalance();
                else pubsub.subscribe('user_exists', this.updateBalance.bind( this ) );
            },

            updateBalance: function() {

                let that = this;

                setInterval(function() {

                    let check = that.isError();

                    if( check ) {

                        pubsub.publish('new_error', check.messge );
                        return;
                    }

                    let data = storage.updateBalance();

                    pubsub.publish( 'update_user_balance', data );

                }, TIME_UPDATE_BALANCE );
            },

            isError: (function() {

                let count = 0;

                return function() {

                    if( count >= 5 ) {

                        count = 0;
                        return {messge: ERORR_CONTENT };
                    }

                    else {

                        count++;
                        return false;
                    }
                }

            })()
        }

    })();

    exports.fakeServerApi = fakeServerApi;

})( window, storageUser );