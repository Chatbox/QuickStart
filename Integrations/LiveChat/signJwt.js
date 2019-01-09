let jwt = require('jsonwebtoken');
let KEY_ID = 'app_5beb7a8083bd2000225864cf';
let SECRET = 'vX5Qzs1iBzvU26LVkrtPQgc7QwDS3tWvpyrvSmiBEpaZHaGPHEWLaPyn-RQTkq1lYDDnRqStDda06V5gT6tE9Q';

let signJwt = function(userId) {
    return jwt.sign({
            scope: 'appUser',
            userId: userId
        },
        SECRET,
        {
            header: {
                alg: 'HS256',
                typ: 'JWT',
                kid: KEY_ID
            }
        });
};

console.log(signJwt("Rachel Goldberg"));

/*

cb_demo:

key id: `app_5b9a9796dc914900220e1ede`
secret: `YI8vsENDpiNLlfHRYzJyttbux3YAyM7boYbtg0PVUt48_st1HebIzJFCeZqXnx-vNAmeU9ftkePOp0cEl4AFVg`


cb_joe:

key id: `app_5ba526f98dbf4c0022ccf034`
secret: `NRh3f2RAk6m01G1zv4Jnc-QM9e64qULcvZhJvxjES36IXx_sor_cgTxvh3F35btXi3fPD5Cywsvgur7GEkLgvg`
 */