const http = require('http');

const fetchItems = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8000,
            path: '/items/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject('Error parsing JSON: ' + error.message);
                }
            });
        });

        req.on('error', (error) => {
            reject('Error connecting to Django API: ' + error.message);
        });

        req.end();
    });
};

module.exports = { fetchItems };
