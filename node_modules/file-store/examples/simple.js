var FileStore = require("..")
    , store = FileStore("temp.txt")

flow([function (next) {
    store.delete("foo", next)
}, function (next) {
    store.delete("bar", next)
}, function (next) {
    store.get("foo", next)
}, function (doc, next) {
    console.log("null", doc)
    store.set("foo", {
        bar: "bar"
    }, next)
}, function (next) {
    store.push("bar", "1", next)
}, function (next) {
    store.push("bar", "2", next)
}, function (next) {
    store.remove("bar", "1", next)
}, function (next) {
    store.get("bar", next)
}, function (list, next) {
    console.log("[2]", list)
    store.get("foo", next)
}, function (item) {
    console.log("{ bar: 'bar' }", item)
}])

function flow(list) {
    list.shift()(next)

    function next(err) {
        if (err) {
            throw err
        }

        var args = [].slice.call(arguments, 1)
        args.push(next)
        list.shift().apply(null, args)
    }
}


