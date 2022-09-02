
const { systemPreferences } = require('electron')

// https://www.electronjs.org/docs/latest/api/system-preferences#systempreferencessubscribenotificationevent-callback-macos
// Under the hood this API subscribes to NSDistributedNotificationCenter
// The object is the sender of the notification, and only supports NSString values for now.

// https://www.tutorialsteacher.com/nodejs/nodejs-module-exports


//-------------------------------------------------------------------------------------------------
// MsgEnv:

// Normally you can specify an object to filter on when subscribing, but in electron that is missing
// 
exports.subscribe= function(handler) {
	if (handler.subscription_ID !== undefined)
		return;
	console.log('MsgEnv: subscribe');
    handler.subscription_ID= systemPreferences.subscribeNotification(null, function(event, userInfo, object) {
        this(event);
    }.bind(handler));    
}

// we have to use the ID, rather than the handler itself to unsubsribe
exports.unsubscribe= function(handler) {
    systemPreferences.unsubscribeNotification(handler.subscription_ID);
    delete handler.subscription_ID;
}

// Normally a {name, object, userInfo} tuple, but in electron it is apparently not possible
// to specify the (sender) object explicitly; gets set automagically?!
exports.publish= function(msg) {
    systemPreferences.postNotification(msg, {}, true);
}

//-------------------------------------------------------------------------------------------------
