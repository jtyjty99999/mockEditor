var dirname = require("path").dirname
    , mkdirp = require("mkdirp")
    , fs = require("fs")
    , stat = fs.stat
    , readFile = fs.readFile
    , writeFile = fs.writeFile

module.exports = FileStore

function FileStore(uri) {
    return {
        get: get
        , set: set
        , push: push
        , remove: remove
        , delete: $delete
    }

    function get(key, callback) {
        statAndRead(uri, returnResult)

        function returnResult(err, json) {
            if (err) {
                return callback(err)
            }

            callback(null, json[key] || null)
        }
    }

    function set(key, value, callback) {
        callback = callback || thrower

        mkdirAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return callback(err)
            }

            json[key] = value

            save(uri, json, callback)
        }
    }

    function push(key, value, callback) {
        callback = callback || thrower

        mkdirAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return callback(err)
            }

            var list = json[key] || (json[key] = [])
            if (list.indexOf(value) === -1) {
                list.push(value)
            }

            save(uri, json, callback)
        }
    }

    function remove(key, value, callback) {
        callback = callback || thrower

        statAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return callback(err)
            }

            var arr = json[key]

            if (Array.isArray(arr)) {
                arr.splice(arr.indexOf(value), 1)
            }

            save(uri, json, callback)
        }
    }

    function $delete(key, callback) {
        callback = callback || thrower

        statAndRead(uri, mutateResult)

        function mutateResult(err, json) {
            if (err) {
                return callback(err)
            }

            delete json[key]

            save(uri, json, callback)
        }
    }

    function mkdirAndRead(uri, callback) {
        mkdirp(dirname(uri), getFile)

        function getFile(err) {
            if (err) {
                return callback(err)
            }

            statAndRead(uri, callback)
        }
    }

    function statAndRead(uri, callback) {
        stat(uri, readIt)

        function readIt(err) {
            if (err) {
                return callback(null, {})
            }

            readFile(uri, readResult)
        }

        function readResult(err, buffer) {
            if (err) {
                return callback(err)
            }

            callback(null, readBuffer(buffer))
        }
    }

    function readBuffer(buffer) {
        var json

        if (buffer.length) {
            json = JSON.parse(buffer.toString())
        } else {
            json = {}
        }

        return json
    }

    function save(uri, json, callback) {
        writeFile(uri, JSON.stringify(json), callback)
    }
}

function thrower(err) {
    if (err) {
        throw err
    }
}
