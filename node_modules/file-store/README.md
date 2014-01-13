# file-store

Store data in a file

## Example

``` js
var FileStore = require("file-store")
    , store = FileStore("temp.txt")

store.get("key", function (err, value) {
    console.log("value at key", value)
})

store.push("array-key", "array-value", function (err) {
    console.log("pushing a value into an array")
})

store.set("key", { some: "value" }, function (err) {
    console.log("setting value at key")
})

store.remove("array-key", "array-value", function (err) {
    console.log("removing a value from an array")
})

store.delete("key", function (err) {
    console.log("deleting the value at the key")
})
```

## Installation

`npm install file-store`

## Contributors

 - Raynos

## MIT Licenced
