const config = require('../../config');
let pg;

try {
    pg = require('pg') || require('pg.js')
} catch (e) {
    throw new Error("Could not require pg or pg.js - please install one or the other")
}

function _query(sql, cb) {
    const client = new pg.Client({
        connectionString: config.postgresql.connection
    });

    client.connect();
    client.query(sql, (err, res) => {
        client.end();

        if(err) return cb(err, null);

        return cb(null, { rows: res.rows, res: res });
    });
}

module.exports.query = (sql) => {
    return new Promise((resolve, reject) => {
        _query(sql, (err, res) => {
            if(err) return reject(new Error(err));
            return resolve(res);
        });
    });
};