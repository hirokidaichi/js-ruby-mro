
var _ = require("./arrayutil");

function linearlize(prependMap, includeMap, name) {

    var parents = includeMap[name];
    var children = prependMap[name];
    var linearlizeBind = function(name) {
        return linearlize(prependMap, includeMap, name);
    };
    var ancestors = (parents) ? merge(parents.map(linearlizeBind)) : [];
    var descendant = (children) ? merge(children.map(linearlizeBind)) : [];
    return (descendant.diff(ancestors)).concat([name]).concat(ancestors);
}


function merge(list) {

    if (list.length == 0)
        return [];

    var goodHeadList = list.first(function(elem) {
        var head = elem.head();
        var theOther = list.remove(elem);
        return theOther.every(function(otherElem) {
            return (otherElem.tail().indexOf(head) < 0);
        });
    });
    if (!goodHeadList) {
        return [];
    }
    var goodHead = goodHeadList.head();

    var headRemoved = remove(list, goodHead).filter(function(l) {
        return (l.length > 0);
    });
    if (isEmpty(headRemoved))
        return [goodHead];

    return [goodHead].concat(merge(headRemoved));

}

function isEmpty(listOfList) {
    return listOfList.every(function(e) {
        return (e.length == 0)
    })
}


function remove(listOfList, target) {
    return listOfList.map(function(list) {
        return list.remove(target);
    });
}

exports.linearlize = linearlize;
