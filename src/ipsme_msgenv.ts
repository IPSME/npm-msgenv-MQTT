
import { LOGR, l_array } from '@knev/bitlogr';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

// const mqtt = require('mqtt');
// const { BitLogr } = require ('@knev/bitlogr');

// https://www.tutorialsteacher.com/nodejs/nodejs-module-exports

//-------------------------------------------------------------------------------------------------

const LOGR_= LOGR.get_instance();
const logr_= LOGR_.create({ labels: l_array(['CONNECTIONS', 'REFLECTION']) });
const l_= logr_.l;

//-------------------------------------------------------------------------------------------------

interface MsgEnvOptions {
  channel?: string;
  prefix?: string;
  // logr?: any;           // uncomment + type if you bring BitLogr back
}

var cfg_= (function() {
    let _options: MsgEnvOptions = {};

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
            // if (_options.logr && _options.logr[ __name(l_) ] )
			//     // LOGR_.toggled= _options.logr
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

const kstr_TOPIC = 'IPSME';

class MsgEnvSingleton {
    private static _instance: MsgEnvSingleton | null = null;

    public readonly client: MqttClient;

    constructor() {
        this.client = mqtt.connect({
            protocol: 'mqtt',
            hostname: 'localhost',   // or '127.0.0.1'
            port: 1883
        });

        this.client.on('error', function (err) {
            console.error('MQTT Connection Error:', err);
        });

        this.client.on('connect', function () {
            // console.log('MQTT Connected');
        });
    }

    public static getInstance() : MsgEnvSingleton {
        if (! MsgEnvSingleton._instance) {
            MsgEnvSingleton._instance = new MsgEnvSingleton();
        }
        return MsgEnvSingleton._instance;
    }
}

// Normally you can specify an object to filter on when subscribing, but in electron that is missing
// 
function subscribe_(handler) {
	if (handler.subscription_ID !== undefined)
		return;
    logr_.log(l_.CONNECTIONS, () => [cfg_.prefix +'MsgEnv: subscribe'] );
    // handler.subscription_ID= systemPreferences.subscribeNotification(cfg_.channel, function(event, userInfo, object) {
    //     LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: onNotification: ', userInfo.msg);
    //     this(userInfo.msg);
    // }.bind(handler));    

    let instance = MsgEnvSingleton.getInstance();
    handler.subscription_ID = function (topic, message) {
        handler(message.toString());
    };
  
    instance.client.on('message', handler.subscription_ID);
    instance.client.subscribe(kstr_TOPIC);
}

// we have to use the ID, rather than the handler itself to unsubsribe
function unsubscribe_(handler) {
    logr_.log(l_.CONNECTIONS, () => [cfg_.prefix +'MsgEnv: unsubscribe'] );
    // systemPreferences.unsubscribeNotification(handler.subscription_ID);
    let instance = MsgEnvSingleton.getInstance();
    instance.client.removeListener('message', handler.subscription_ID);
    instance.client.unsubscribe(kstr_TOPIC);
    delete handler.subscription_ID;
}

// Normally a {name, object, userInfo} tuple, but in electron it is apparently not possible
// to specify the (sender) object explicitly; gets set automagically?!
function publish_(msg) {
    logr_.log(l_.REFLECTION, () => [cfg_.prefix +'MsgEnv: postNotification: ', msg] );
    // systemPreferences.postNotification(cfg_.channel, { "msg" : msg }, true);
    let instance = MsgEnvSingleton.getInstance();
    instance.client.publish(kstr_TOPIC, msg);
}

//-------------------------------------------------------------------------------------------------

export {
    cfg_ as config,
    subscribe_ as subscribe,
    unsubscribe_ as unsubscribe,
    publish_ as publish,
    logr_ as logr
}
