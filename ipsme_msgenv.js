const { systemPreferences } = require('electron')

// https://www.electronjs.org/docs/latest/api/system-preferences#systempreferencessubscribenotificationevent-callback-macos
// Under the hood this API subscribes to NSDistributedNotificationCenter
// The object is the sender of the notification, and only supports NSString values for now.

// we have to use the ID, rather than the handler itself to unsubsribe
var global_subscription_ID= null;
var global_subscription_handler= null;

// https://www.tutorialsteacher.com/nodejs/nodejs-module-exports

// Normally you can specify an object to filter on when subscribing, but in electron that is missing
// 
exports.subscribe= function(handler) {
    global_subscription_handler= handler;
    global_subscription_ID= systemPreferences.subscribeNotification(null, (event, userInfo, object) => {
        if (global_subscription_handler !== null)
            global_subscription_handler(event);
    });    
}

exports.unsubscribe= function(handler) {
    systemPreferences.unsubscribeNotification(global_subscription_ID);
    global_subscription_handler= null;
}

// Normally a {name, object, userInfo} tuple, but in electron it is apparently not possible
// to specify the (sender) object explicitly; gets set automagically?!
exports.publish= function(str_msg) {
    systemPreferences.postNotification(str_msg, {}, true);
}
