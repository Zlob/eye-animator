define(function(){

   var Eyebrow = function (parent, options) {
       this.parent = parent;

       this.options = {
           width                   : 80,
           height                  : 5,
           position                : 0.5, //from 0 (very  top) to 1 (near eye)
           color                   : '#000000',
           borderColor             : '#000000',
           borderSize              : 0,
           //eyebrow angle, from -30 to 30
           rotate                  : 0
       };

       this._setOptions(options);

       this._render();
   };

    Eyebrow.prototype._setOptions = function (options) {
        // Replace default optinos
        this.options.width = options.width || this.options.width;
        this.options.height = options.height || this.options.height;
        this.options.color = options.color || this.options.color;
        this.options.borderColor = options.borderColor || this.options.borderColor;
        this.options.borderSize = options.borderSize || this.options.borderSize;
        this._setRotate(options.rotate || this.options.rotate);
    };

    Eyebrow.prototype._setRotate = function (param) {
        if(param < -25){
            param = -25;
        } else if(param > 25){
            param = 25;
        }
        this.options.rotate = param;
    };

    Eyebrow.prototype._render = function () {
        this.eyelidNode = this._createEyebrowNode();
        return this;
    };

    Eyebrow.prototype._createEyebrowNode = function () {
        var eyebrowNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var eyebrowPathNode = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        eyebrowPathNode.setAttribute('name', 'eyebrow');
        eyebrowNode.appendChild(eyebrowPathNode);

        this._setNodeAttributes(eyebrowNode);
        this.parent.append(eyebrowNode);

        return eyebrowNode;
    };

    Eyebrow.prototype._setNodeAttributes = function (eyelidNode) {
        var eyelidPath = eyelidNode.querySelector("[name=eyebrow]");


        eyelidPath.setAttribute("width", this.options.width);
        eyelidPath.setAttribute("height", this.options.height);
        var x = 90 - this.options.width / 2;
        eyelidPath.setAttribute("x", x);
        var y = this._getY(this.options.height, this.options.borderSize, this.options.position);
        eyelidPath.setAttribute("y", y);
        eyelidPath.setAttribute("stroke", this.options.borderColor);
        eyelidPath.setAttribute("stroke-width", this.options.borderSize);
        eyelidPath.setAttribute("fill", this.options.color);
        eyelidPath.setAttribute("transform", "rotate(" + this.options.rotate + ", 90, 90)");
        return eyelidPath;
    };

    Eyebrow.prototype._getY = function (h, borderSize, position)  {
        return (90 - 50 - h - borderSize) * position;
    };

   return Eyebrow;
});