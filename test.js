var def = require("./oop");

new function() {
    def.clear();
    def.module("O");
    def.module("B");
    var c = def.class("Clazz")
        .include("O")
        .include("B");

    assertEqualArray(c.ancestors(), ["Clazz", "B", "O"], "simple include");
    def.clear();
};

new function() {
    def.clear();
    def.class("Parent");
    def.class("Child").extend("Parent");
    assertEqualArray(def.class("Child").ancestors(), ["Child", "Parent"], "simple inherit");


}

new function() {
    def.clear();
    def.module("O");
    def.module("B");
    var c = def.class("Clazz")
        .prepend("O")
        .prepend("B");

    assertEqualArray(c.ancestors(), ["B", "O", "Clazz"], "simple include");
};


new function DiamondInclude() {
    def.clear();
    def.module("O");
    def.module("B").include("O");
    def.module("A").include("O");
    var c = def.class("Clazz")
        .include("A")
        .include("B");
    assertEqualArray(c.ancestors(), ["Clazz", "B", "A", "O"], "diamond include");
}

new function DiamondPrepend() {
    def.clear();
    def.module("O");
    def.module("B").include("O");
    def.module("A").include("O");
    var c = def.class("Clazz")
        .prepend("A")
        .prepend("B");
    assertEqualArray(c.ancestors(), ["B", "A", "O", "Clazz"], "diamond prepend");
}

new function PrependAndInclude() {
    def.clear();
    def.module("O1");
    def.module("B1").include("O1");
    def.module("A1").include("O1");


    def.module("O2");
    def.module("B2").include("O2");
    def.module("A2").include("O2");
    var k = def.class("K")
        .include("A1")
        .include("B1")
        .prepend("A2")
        .prepend("B2");

    assertEqualArray(k.ancestors(), ["B2", "A2", "O2", "K", "B1", "A1", "O1"], "prepend and include");

}

new function IncludeInheritInclude() {
    def.clear();
    def.module("O1");
    def.module("B1").include("O1");
    def.module("A1").include("O1");
    def.class("P")
        .include("A1")
        .include("B1");

    def.module("O2");
    def.module("B2").include("O2");
    def.module("A2").include("O2");
    var k = def.class("K")
        .extend("P")
        .include("A2")
        .include("B2")
    assertEqualArray(k.ancestors(), ['K', 'B2', 'A2', 'O2', 'P', 'B1', 'A1', 'O1'], "include inherit include");
}

new function IncludeInheritInclude2() {
    def.clear();
    def.module("X");

    def.module("O1").include("X");
    def.class("P")
        .include("O1")

    def.module("O2").include("X");
    var k = def.class("K")
        .extend("P")
        .include("O1")
    assertEqualArray(k.ancestors(), ['K', 'P', 'O1', 'X'], "include inherit include 2");
}

new function IncludeInheritInclude3() {
    def.clear();
    def.module("O1");
    def.module("B1").include("O1");
    def.module("A1").include("O1");
    def.class("P")
        .include("A1")
        .include("B1");

    def.module("B2").include("O1");
    def.module("A2").include("O1");
    var k = def.class("K")
        .extend("P")
        .include("A2")
        .include("B2")
    assertEqualArray(k.ancestors(), ['K', 'B2', 'A2', 'P', 'B1', 'A1', 'O1'], "include inherit include 3");
}

new function IncludeInheritInclude2() {
    def.clear();
    def.module("X");

    def.module("O1").prepend("X");
    def.class("P")
        .include("O1")

    def.module("O2").prepend("X");
    var k = def.class("K")
        .extend("P")
        .include("O2")
    assertEqualArray(k.ancestors(), ['K', 'O2','P', 'X', 'O2'], "include inherit include 2");
}
function assertEqualArray(assert, expect, diag) {
    if (isEquealArray(assert, expect)) {
        console.log("ok", diag);
    } else {
        console.log("fail", diag, "\n\tassert:", assert, "\n\texpect:", expect);
    }
}

function isEquealArray(assert, expect) {
    if (assert.length != expect.length)
        return false;

    for (var i = 0, l = assert.length; i < l; i++) {
        if (assert[i] !== expect[i])
            return false;
    }
    return true;

