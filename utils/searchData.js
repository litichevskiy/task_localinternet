(function( exports ) {

    function searchData( list, id ) {

        let result;

        list.every(function( item ) {

            if( +item.id !== id ) return true;

            else {
                result = item;
                return false;
            }
        });

        return result;
    };

    exports.searchData = searchData;

})( window );