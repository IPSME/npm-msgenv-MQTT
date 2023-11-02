# npm-msgenv-MQTT
This library contains the wrapper code for sending messages to a Windows messaging environment (ME). For this implementation, MQTT is used as ME,.

> ### IPSME- Idempotent Publish/Subscribe Messaging Environment
> https://dl.acm.org/doi/abs/10.1145/3458307.3460966

#### Subscribing
```
IPSME_MsgEnv_OS = require('@ipsme/msgenv-mqtt');

function ipsme_handler_(msg)
{
    console.log(msg);

}

IPSME_MsgEnv_OS.subscribe( ipsme_handler_ );
```

It is by design that a participant receives the messages it has published itself. If this is not desirable, each message can contain a "referer" (sic) identifier and a clause added in the `ipsme_handler_` to drop those messages containing the participant's own referer id.

#### Publishing
```
IPSME_MsgEnv_OS.publish('...');
```

## Discussion

...