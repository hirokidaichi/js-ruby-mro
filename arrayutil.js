
Array.prototype.first = function(predicate) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (predicate(this[i]))
            return this[i];
    }
}

Array.prototype.remove = function(elem) {
    return this.filter(function(e) {
        return !(e === elem)
    });
}

Array.prototype.head = function() {
    return this[0];
}

Array.prototype.tail = function() {
    return this.slice(1);
}


Array.prototype.flatten = function() {
    return Array.prototype.concat.apply([], this);
}

Array.prototype.diff = function(array) {
    return this.filter(function(e){
        return (array.indexOf(e) < 0 );
    });
}

//console.log(["A","B","C"].diff(["D","B"]));
