/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Fire me up!

module.exports = {
    implements: 'settings',
    inject: ['require(nconf)', 'require(fs)']
};

module.exports.factory = function(nconf, fs) {
    nconf.file({file: './serve/config/default.json'});

    /**
     * Normalize a port into a number, string, or false.
     */
    const _normalizePort = function(val) {
        const port = parseInt(val, 10);

        // named pipe
        if (isNaN(port))
            return val;

        // port number
        if (port >= 0)
            return port;

        return false;
    };

    return {
        agent: {
            file: 'ignite-web-agent-1.5.0.final',
            port: _normalizePort(nconf.get('agent-server:port')),
            SSLOptions: nconf.get('agent-server:ssl') && {
                key: fs.readFileSync(nconf.get('agent-server:key')),
                cert: fs.readFileSync(nconf.get('agent-server:cert')),
                passphrase: nconf.get('agent-server:keyPassphrase')
            }
        },
        server: {
            port: _normalizePort(nconf.get('server:port') || 80),
            SSLOptions: nconf.get('server:ssl') && {
                enable301Redirects: true,
                trustXFPHeader: true,
                port: _normalizePort(nconf.get('server:https-port') || 443),
                key: fs.readFileSync(nconf.get('server:key')),
                cert: fs.readFileSync(nconf.get('server:cert')),
                passphrase: nconf.get('server:keyPassphrase')
            }
        },
        smtp: {
            service: nconf.get('smtp:service'),
            username: nconf.get('smtp:username'),
            email: nconf.get('smtp:email'),
            password: nconf.get('smtp:password'),
            address: (username, email) => username ? '"' + username + '" <' + email + '>' : email
        },
        mongoUrl: nconf.get('mongoDB:url'),
        cookieTTL: 3600000 * 24 * 30,
        sessionSecret: 'keyboard cat',
        tokenLength: 20
    };
};
