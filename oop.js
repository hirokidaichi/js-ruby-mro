var DISPATCH_TABLE = {};

var INHERIT_TABLE = {};
var INCLUDE_TABLE = {};
var PREPEND_TABLE = {};

var c3 = require("./c3");
var _ = require("./arrayutil");


function sendMessage(object, message, args) {
    var tables = [object._singleton_, ancestors(object._class_).map(function(classOrModule) {
        return DISPATCH_TABLE[classOrModule]
    })].flatten();

    var resolved = tables.first(function(table) {
        return !!table[message];
    });
    var method = resolved[message];
    return method(object, args);
}

function _class(className, dispatchTable) {
    DISPATCH_TABLE[className] = dispatchTable;
}

function _module(moduleName, dispatchTable) {
    DISPATCH_TABLE[moduleName] = dispatchTable;
}

function extend(className, parentName) {
    if (INHERIT_TABLE[className]) {
        throw ("multi inheritance");
    }
    INHERIT_TABLE[className] = parentName;
}

function include(className, moduleName) {
    if (INCLUDE_TABLE[className]) {
        INCLUDE_TABLE[className].unshift(moduleName);
        return;
    }
    INCLUDE_TABLE[className] = [moduleName];
}

function prepend(className, moduleName) {
    if (PREPEND_TABLE[className]) {
        PREPEND_TABLE[className].unshift(moduleName);
        return;
    }
    PREPEND_TABLE[className] = [moduleName];
}

function singleton(object, dispatchTable) {
    object._singleton_ = dispatchTable;
}

function ancestors(className) {
    var modules = c3.linearlize(PREPEND_TABLE, INCLUDE_TABLE, className);
    if (INHERIT_TABLE[className]) {
        var parentName = INHERIT_TABLE[className];
        var parentAncestors = ancestors(parentName);
        return modules.diff(parentAncestors).concat(parentAncestors);
    }
    return modules;
}



var Module = (function() {
    var initializer = function(name) {
        this.name = name;
    };
    (function() {
        this.include = function(module) {
            include(this.name, module);
            return this;
        };
        this.prepend = function(module) {
            prepend(this.name, module);
            return this;
        };
        this.new = function(obj) {
            var instance = obj || {};
            instance._class_ = this.name;
            instance.send = function(message, args) {
                return sendMessage(instance, message, args);
            };
            return instance;
        };
        this.ancestors = function() {
            return ancestors(this.name);
        }
    }).apply(initializer.prototype);
    return initializer;
})();

var Class = (function() {
    var initializer = function(name) {
        this.name = name;
    };
    initializer.prototype = Object.create(Module.prototype);
    (function() {
        this.extend = function(parentClass) {
            extend(this.name, parentClass);
            return this;
        };
    }).apply(initializer.prototype);
    return initializer;
})();



function _createModule(name) {
    return new Module(name);
}

function _createClass(name) {
    return new Class(name);
}

module.exports = {
    module: _createModule,
    class: _createClass,
    clear : function(){
        INCLUDE_TABLE = {};
        INHERIT_TABLE = {};
        PREPEND_TABLE = {};
        DISPATCH_TABLE= {};

    }
}

