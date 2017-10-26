const Action = require( "../model/Action" );
const Stat = require( "../model/Stat" )

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {

		Action.findOne( { action: data.action } )
			.then( ( action ) => {
				if ( ! action ) {
					return Action.create({
						action: data.action,
					});
				}
				else {
					return action;
				}
			})
			.then( ( action ) => {
				if ( ! action )
					throw new Error( "Action not returned after creating" );
				return resolve( action );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( action ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {
					
					let stat = new Stat({
						id: sku.id,
						currency: Object.keys( sku.price )[0],
						date: new Date(),
						amount: sku.price[ Object.keys( sku.price )[0] ],
						action_id: action._id,
					});

					stat.save()
						.then( () => {
							if ( --remaining === 0 )
								return resolve();
						});

				});
			})
			.catch( ( error ) => {
				return reject( error );
			});
		
	});
};

module.exports = {
	getOrCreate: getOrCreate,
	createStat: createStat,
};