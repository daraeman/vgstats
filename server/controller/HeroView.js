const Hero = require( "../model/Hero" );
const Stat = require( "../model/Stat" );
const ImageController = require( "./Image" );
const VideoController = require( "./Video" );

const heroes_list = function( arg1, arg2, arg3 ) {
	console.log( arg1 )
	console.log( arg2 )
	console.log( arg3 )
};

module.exports = {
	heroes_list: heroes_list,
};