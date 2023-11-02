
IPSME_MsgEnv_OS = require('../dist/ipsme_msgenv.cjs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handler_(msg)
{
    console.log(msg);

}


async function demo() {
    IPSME_MsgEnv_OS.subscribe( handler_ );
    IPSME_MsgEnv_OS.publish('BOOYAH 1');

    await sleep(2000);

    IPSME_MsgEnv_OS.unsubscribe( handler_ );
    IPSME_MsgEnv_OS.publish('BOOYAH 2.o');

    await sleep(2000);

    IPSME_MsgEnv_OS.subscribe( handler_ );
    IPSME_MsgEnv_OS.publish('BOOYAH 3.o');
}

demo();