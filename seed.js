var STATUS;
(function (STATUS) {
    STATUS[STATUS["ACTIVE"] = 0] = "ACTIVE";
    STATUS[STATUS["COMPLETED"] = 1] = "COMPLETED";
    STATUS[STATUS["DELETED"] = 2] = "DELETED";
})(STATUS || (STATUS = {}));
var Todo = /** @class */ (function () {
    function Todo(title, status) {
        this.title = title;
        this.status = status;
    }
    return Todo;
}());
var todos = [];
