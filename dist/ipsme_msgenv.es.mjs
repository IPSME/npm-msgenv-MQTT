// console.log('OUT', __name({variableName}) );

function labelsToBigInt_(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
class BitLogr {
	constructor() {
		this._handler_log= handler_default_;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_(this._Bint_labels, obj);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
}

const { systemPreferences } = require('electron');

// https://www.electronjs.org/docs/latest/api/system-preferences#systempreferencessubscribenotificationevent-callback-macos
// Under the hood this API subscribes to NSDistributedNotificationCenter
// The object is the sender of the notification, and only supports NSString values for now.

// https://www.tutorialsteacher.com/nodejs/nodejs-module-exports

//-------------------------------------------------------------------------------------------------

let LOGR_= new BitLogr();

const l_ = {
	MsgEnv : 0b1 << 0,	// MsgEnv
	CXNS : 0b1 << 1,	// connections
	REFL : 0b1 << 2,	// reflection
};
LOGR_.labels= l_;

// https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const __name = obj => Object.keys(obj)[0];
// console.log('OUT', __name({variableName}) );

//-------------------------------------------------------------------------------------------------

var cfg_= (function() {
    let _options= {};

    // options= {
    // channel : 'IPSME',
    //     prefix : '',
    //     logr : ...
    // }

    return {
        get channel() {
			return (_options.channel === undefined) ? 'IPSME' : _options.channel;
        },
        get prefix() { 
			return (_options.prefix === undefined) ? '' : _options.prefix;
        },
		get options() { return _options; },
		set options(obj) {
			_options= obj;
            if (_options.logr && _options.logr[ __name(l_) ] )
			    LOGR_.toggled= _options.logr;
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

// Normally you can specify an object to filter on when subscribing, but in electron that is missing
// 
function subscribe_(handler) {
	if (handler.subscription_ID !== undefined)
		return;
    LOGR_.log(l_.CXNS, cfg_.prefix +'MsgEnv: subscribe');
    handler.subscription_ID= systemPreferences.subscribeNotification(cfg_.channel, function(event, userInfo, object) {
        LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: onNotification: ', userInfo.msg);
        this(userInfo.msg);
    }.bind(handler));    
}

// we have to use the ID, rather than the handler itself to unsubsribe
function unsubscribe_(handler) {
    LOGR_.log(l_.CXNS, cfg_.prefix +'MsgEnv: unsubscribe');
    systemPreferences.unsubscribeNotification(handler.subscription_ID);
    delete handler.subscription_ID;
}

// Normally a {name, object, userInfo} tuple, but in electron it is apparently not possible
// to specify the (sender) object explicitly; gets set automagically?!
function publish_(msg) {
    LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: postNotification: ', msg);
    systemPreferences.postNotification(cfg_.channel, { "msg" : msg }, true);
}

//-------------------------------------------------------------------------------------------------

module.exports= {
    config : cfg_,
    subscribe : subscribe_,
    unsubscribe : unsubscribe_,
    publish : publish_,
    l : l_,
};
