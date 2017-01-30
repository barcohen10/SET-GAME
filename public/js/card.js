app.factory('Card', function () {
    var Card = function (shape, color, number, shading) {
        this.shape = shape;
        this.color = color;
        this.number = number;
        this.shading = shading;
        this.isFlipped = false;
        this.isSelected = false;
        this.isActivate = true;
    };
    return Card;
});