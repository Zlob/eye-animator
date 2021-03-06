;(function() {
var helper, eyeball, topEyelid, bottomEyelid, eyebrow, eye, eyesPair, eyes;
helper = function () {
  var Obj = {
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    chooseOption: function (oldOptions, newOptions, optionName) {
      if (newOptions[optionName] != undefined) {
        return newOptions[optionName];
      } else {
        return oldOptions[optionName];
      }
    },
    getOptionDiff: function (oldOption, newOption, duration) {
      var diff = 0;
      if (this.isNumeric(oldOption)) {
        diff = (newOption - oldOption) / duration;
      }
      return diff;
    },
    getOptionsDiff: function (oldOptions, newOptions, duration) {
      var diff = {};
      for (var key in newOptions) {
        diff[key] = this.getOptionDiff(oldOptions[key], newOptions[key], duration);
      }
      return diff;
    },
    getCalculatedOption: function (oldOption, newOption) {
      if (this.isNumeric(oldOption) && this.isNumeric(newOption)) {
        return oldOption + newOption;
      } else {
        return oldOption;
      }
    }
  };
  return Obj;
}();
eyeball = function (Helper) {
  var Eyeball = function (parent, options) {
    this.parent = parent;
    this.options = {
      size: 12,
      shift: 20,
      rotate: 3.14  //from 0 to 2*PI
    };
    this._setOptions(options);
    this._render();
  };
  Eyeball.prototype._setOptions = function (newOptions) {
    this.options.size = Helper.chooseOption(this.options, newOptions, 'size');
    this.options.shift = Helper.chooseOption(this.options, newOptions, 'shift');
    this.options.rotate = Helper.chooseOption(this.options, newOptions, 'rotate');
  };
  Eyeball.prototype._render = function () {
    this.eyeballNode = this._createEyeballNode();
    return this;
  };
  Eyeball.prototype.change = function (options) {
    var self = this;
    self._setOptions(options);
    self._setNodeAttributes(this.eyeballNode);
  };
  Eyeball.prototype._createEyeballNode = function () {
    var eyeballNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pathNode.setAttribute('name', 'eyeball');
    eyeballNode.appendChild(pathNode);
    this._setNodeAttributes(eyeballNode);
    this.parent.append(eyeballNode);
    return eyeballNode;
  };
  Eyeball.prototype._setNodeAttributes = function (eyeballNode) {
    var eyeballPath = eyeballNode.querySelector('[name=eyeball]');
    eyeballPath.setAttribute('fill', '#000000');
    eyeballPath.setAttribute('stroke', '#000000');
    eyeballPath.setAttribute('stroke-width', 5);
    eyeballPath.setAttribute('stroke-linejoin', null);
    eyeballPath.setAttribute('stroke-linecap', null);
    eyeballPath.setAttribute('cx', this._getEyeballXCoordinate());
    eyeballPath.setAttribute('cy', this._getEyeballYCoordinate());
    eyeballPath.setAttribute('r', this.options['size']);
    return eyeballPath;
  };
  Eyeball.prototype.trackByCoordinate = function (x1, y1) {
    var eyeCenter = this.parent.getCoordinates();
    var angle = Math.atan2(y1 - eyeCenter.y, x1 - eyeCenter.x);
    this.change({ rotate: angle });
  };
  Eyeball.prototype._getEyeballXCoordinate = function () {
    return 90 + this.options['shift'] * Math.cos(this.options['rotate']);
  };
  Eyeball.prototype._getEyeballYCoordinate = function () {
    return 90 + this.options['shift'] * Math.sin(this.options['rotate']);
  };
  Eyeball.prototype.changeByDiff = function (diff) {
    var newOptions = {};
    for (var key in diff) {
      newOptions[key] = Helper.getCalculatedOption(this.options[key], diff[key]);
    }
    return newOptions;
  };
  return Eyeball;
}(helper);
topEyelid = function (Helper) {
  var TopEyelid = function (parent, type, options) {
    this.parent = parent;
    this.type = type;
    this.options = {
      size: 0,
      //from 0 when open to 1 when closed
      color: 'white',
      borderColor: '#000000',
      borderSize: 5,
      bottomArcRadius: 0,
      //from 0 (straight line) to 1 (circle)
      bottomArcRadiusSweep: 0,
      //from 0 to 0.5 (if top arc of circle) or from 0.5 to 1 (if bottom arc of circle)
      rotate: 0,
      //eyelid angle, from -30 to 30
      eyelashesStyle: 'none'  //'none' (without eyelashes) or 'loise' (with eyelashes)
    };
    this._setOptions(options);
    this._render();
  };
  TopEyelid.prototype.change = function (options) {
    var self = this;
    self._setOptions(options);
    self._setNodeAttributes(self.eyelidNode);
  };
  TopEyelid.prototype._setOptions = function (newOptions) {
    // Replace default options
    this.options.color = Helper.chooseOption(this.options, newOptions, 'color');
    this.options.borderColor = Helper.chooseOption(this.options, newOptions, 'borderColor');
    this.options.borderSize = Helper.chooseOption(this.options, newOptions, 'borderSize');
    this.options.eyelashesStyle = Helper.chooseOption(this.options, newOptions, 'eyelashesStyle');
    this.options.bottomArcRadiusSweep = Helper.chooseOption(this.options, newOptions, 'bottomArcRadiusSweep');
    this._setRotate(Helper.chooseOption(this.options, newOptions, 'rotate'));
    this._setBottomArcRadius(Helper.chooseOption(this.options, newOptions, 'bottomArcRadius'));
    this._setSize(Helper.chooseOption(this.options, newOptions, 'size'));
  };
  TopEyelid.prototype._render = function () {
    this.eyelidNode = this._createEyelidNode();
    return this;
  };
  TopEyelid.prototype._setBottomArcRadius = function (param) {
    this.options.bottomArcRadius = this._normolizeParam(param);
  };
  TopEyelid.prototype._setRotate = function (param) {
    if (param < -30) {
      param = -30;
    } else if (param > 30) {
      param = 30;
    }
    this.options.rotate = param;
  };
  TopEyelid.prototype._setSize = function (param) {
    this.options.size = this._normolizeParam(param);
  };
  TopEyelid.prototype._normolizeParam = function (param) {
    if (param >= 1) {
      param = 0.999;
    }
    if (param < 0) {
      param = 0;
    }
    return param;
  };
  TopEyelid.prototype._createEyelidNode = function () {
    var eyelidNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var eyelidPathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    eyelidPathNode.setAttribute('name', 'top-eyelid');
    eyelidNode.appendChild(eyelidPathNode);
    var eyelashesPathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    eyelashesPathNode.setAttribute('name', 'top-eyelashes');
    eyelidNode.appendChild(eyelashesPathNode);
    this._setNodeAttributes(eyelidNode);
    this.parent.append(eyelidNode);
    return eyelidNode;
  };
  TopEyelid.prototype._setNodeAttributes = function (eyelidNode) {
    var eyelidPath = eyelidNode.querySelector('[name=top-eyelid]');
    eyelidPath.setAttribute('fill', this.options.color);
    eyelidPath.setAttribute('stroke', this.options.borderColor);
    eyelidPath.setAttribute('stroke-width', this.options.borderSize);
    var rotate = this.parent.options.type == 'left' ? this.options.rotate : -this.options.rotate;
    eyelidPath.setAttribute('transform', 'rotate(' + rotate + ', 90, 90)');
    var d = this._createPath();
    eyelidPath.setAttribute('d', d);
    return eyelidPath;
  };
  TopEyelid.prototype._createPath = function () {
    var angle = Math.PI / 2 - Math.PI * this.options.size;
    var startPointX = 90 - Math.cos(angle) * 50;
    var startPointY = 90 - Math.sin(angle) * 50;
    var endPointX = 90 + 90 - startPointX;
    var endPointY = startPointY;
    var d = '';
    //left start point
    d = d + 'M' + startPointX + ',' + startPointY;
    d = this._createTopArc(d, endPointX, endPointY);
    d = this._createBottomArc(d, startPointX, startPointY);
    if (this.options.eyelashesStyle == 'loise') {
      if (this.type == 'right') {
        d += this._createEyelashes(endPointX, endPointY, this.type);
      } else {
        d += this._createEyelashes(startPointX, startPointY, this.type);
      }
    }
    d = d + 'z';
    //close path
    return d;
  };
  TopEyelid.prototype._createTopArc = function (d, endPointX, endPointY) {
    var largeArcFlag = this.options.size > 0.5 ? 1 : 0;
    //top arc
    d = d + ' A50,50 0 ' + largeArcFlag + ' 1 ';
    //right end point
    d = d + endPointX + ',' + endPointY;
    return d;
  };
  TopEyelid.prototype._createBottomArc = function (d, endPointX, endPointY) {
    if (this.options.bottomArcRadius != 0) {
      //bottom arc
      var arcRadius = 50 / this.options.bottomArcRadius;
      d = d + ' A' + arcRadius + ',' + arcRadius + ' 0 0 ' + this._getRadiusSweep();
      //back to start point
      d = d + ' ' + endPointX + ',' + endPointY;
    } else {
      //bottom line
      d = d + ' L' + endPointX + ',' + endPointY;
    }
    return d;
  };
  TopEyelid.prototype._createEyelashes = function (x, y, position) {
    var d = this._createFirstEyelash(x, y, position);
    d += this._createSecondEyelash(x, y, position);
    return d;
  };
  TopEyelid.prototype._createFirstEyelash = function (x, y, position) {
    var eyeLashCenterX = position == 'right' ? x + 10 : x - 10;
    var eyeLashCenterY = y;
    var eyeLashEndX = position == 'right' ? x + 15 : x - 15;
    var eyeLashEndY = y - 15;
    return this._createEyelash(x, y, eyeLashCenterX, eyeLashCenterY, eyeLashEndX, eyeLashEndY);
  };
  TopEyelid.prototype._createSecondEyelash = function (x, y, position) {
    var eyeLashCenterX = position == 'right' ? x + 25 : x - 25;
    var eyeLashCenterY = y;
    var eyeLashEndX = position == 'right' ? x + 25 : x - 25;
    var eyeLashEndY = y - 10;
    return this._createEyelash(x, y, eyeLashCenterX, eyeLashCenterY, eyeLashEndX, eyeLashEndY);
  };
  TopEyelid.prototype._createEyelash = function (startX, startY, centerX, centerY, endX, endY) {
    var d = ' M ' + startX + ',' + startY;
    d += ' Q' + centerX + ',' + centerY + ' ' + endX + ',' + endY + ' ';
    //way back
    d += ' Q' + centerX + ',' + centerY + ' ' + startX + ',' + startY + ' ';
    return d;
  };
  TopEyelid.prototype._getRadiusSweep = function () {
    if (this.options.bottomArcRadiusSweep <= 0.5) {
      return 0;
    } else {
      return 1;
    }
  };
  TopEyelid.prototype.changeByDiff = function (diff) {
    var newOptions = {};
    for (var key in diff) {
      newOptions[key] = Helper.getCalculatedOption(this.options[key], diff[key]);
    }
    return newOptions;
  };
  return TopEyelid;
}(helper);
bottomEyelid = function (Helper) {
  var BottomEyelid = function (parent, options) {
    this.parent = parent;
    this.options = {
      size: 0,
      //from 0 when open to 1 when closed
      color: 'white',
      borderColor: '#000000',
      borderSize: 5,
      topArcRadius: 0,
      //from 0 (straight line) to 1 (circle)
      topArcRadiusSweep: 0,
      //0 (if bottom arc of circle) or 1 (if top arc of circle)
      rotate: 0  //eyelid angle, from -30 to 30
    };
    this._setOptions(options);
    this._render();
  };
  BottomEyelid.prototype.change = function (options) {
    var self = this;
    self._setOptions(options);
    self._setNodeAttributes(self.eyelidNode);
  };
  BottomEyelid.prototype._setOptions = function (newOptions) {
    // Replace default options
    this.options.color = Helper.chooseOption(this.options, newOptions, 'color');
    this.options.borderColor = Helper.chooseOption(this.options, newOptions, 'borderColor');
    this.options.borderSize = Helper.chooseOption(this.options, newOptions, 'borderSize');
    this.options.topArcRadiusSweep = Helper.chooseOption(this.options, newOptions, 'topArcRadiusSweep');
    this._setRotate(Helper.chooseOption(this.options, newOptions, 'rotate'));
    this._setTopArcRadius(Helper.chooseOption(this.options, newOptions, 'topArcRadius'));
    this._setSize(Helper.chooseOption(this.options, newOptions, 'size'));
  };
  BottomEyelid.prototype._render = function () {
    this.eyelidNode = this._createEyelidNode();
    return this;
  };
  BottomEyelid.prototype._setTopArcRadius = function (param) {
    this.options.topArcRadius = this._normolizeParam(param);
  };
  BottomEyelid.prototype._setRotate = function (param) {
    if (param < -30) {
      param = -30;
    } else if (param > 30) {
      param = 30;
    }
    this.options.rotate = param;
  };
  BottomEyelid.prototype._setSize = function (param) {
    this.options.size = this._normolizeParam(param);
  };
  BottomEyelid.prototype._normolizeParam = function (param) {
    if (param >= 1) {
      param = 0.999;
    }
    if (param < 0) {
      param = 0;
    }
    return param;
  };
  BottomEyelid.prototype._createEyelidNode = function () {
    var eyelidNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathNode.setAttribute('name', 'bottom-eyelid');
    eyelidNode.appendChild(pathNode);
    this._setNodeAttributes(eyelidNode);
    this.parent.append(eyelidNode);
    return eyelidNode;
  };
  BottomEyelid.prototype._setNodeAttributes = function (eyelidNode) {
    var eyelidPath = eyelidNode.querySelector('[name=bottom-eyelid]');
    eyelidPath.setAttribute('fill', this.options.color);
    eyelidPath.setAttribute('stroke', this.options.borderColor);
    eyelidPath.setAttribute('stroke-width', this.options.borderSize);
    var rotate = this.parent.options.type == 'left' ? this.options.rotate : -this.options.rotate;
    eyelidPath.setAttribute('transform', 'rotate(' + rotate + ', 90, 90)');
    var d = this._createPath();
    eyelidPath.setAttribute('d', d);
    return eyelidPath;
  };
  BottomEyelid.prototype._createPath = function () {
    var angle = Math.PI / 2 - Math.PI * this.options.size;
    var startPointX = 90 - Math.cos(angle) * 50;
    var startPointY = 90 + Math.sin(angle) * 50;
    var endPointX = 90 + 90 - startPointX;
    var endPointY = startPointY;
    var d = '';
    //left start point
    d = d + 'M' + startPointX + ',' + startPointY;
    d = this._createTopArc(d, endPointX, endPointY);
    d = this._createBottomArc(d, startPointX, startPointY);
    d = d + 'z';
    //close path
    return d;
  };
  BottomEyelid.prototype._createTopArc = function (d, endPointX, endPointY) {
    if (this.options.topArcRadius != 0) {
      //bottom arc
      var arcRadius = 50 / this.options.topArcRadius;
      d = d + ' A' + arcRadius + ',' + arcRadius + ' 0 0 ' + this._getRadiusSweep();
      //back to start point
      d = d + endPointX + ',' + endPointY;
    } else {
      //bottom line
      d = d + ' L' + endPointX + ',' + endPointY;
    }
    return d;
  };
  BottomEyelid.prototype._createBottomArc = function (d, endPointX, endPointY) {
    var largeArcFlag = this.options.size > 0.5 ? 1 : 0;
    //top arc
    d = d + ' A50,50 0 ' + largeArcFlag + ' 1 ';
    //right end point
    d = d + endPointX + ',' + endPointY;
    return d;
  };
  BottomEyelid.prototype._getRadiusSweep = function () {
    if (this.options.topArcRadiusSweep <= 0.5) {
      return 0;
    } else {
      return 1;
    }
  };
  BottomEyelid.prototype.changeByDiff = function (diff) {
    var newOptions = {};
    for (var key in diff) {
      newOptions[key] = Helper.getCalculatedOption(this.options[key], diff[key]);
    }
    return newOptions;
  };
  return BottomEyelid;
}(helper);
eyebrow = function (Helper) {
  var Eyebrow = function (parent, options) {
    this.parent = parent;
    this.options = {
      width: 80,
      height: 5,
      position: 0.5,
      //from 0 (very top) to 1 (near eye)
      color: '#000000',
      borderColor: '#000000',
      borderSize: 0,
      rotate: 0  //eyebrow angle, from -30 to 30
    };
    this._setOptions(options);
    this._render();
  };
  Eyebrow.prototype._setOptions = function (newOptions) {
    // Replace default options
    this.options.width = Helper.chooseOption(this.options, newOptions, 'width');
    this.options.height = Helper.chooseOption(this.options, newOptions, 'height');
    this.options.color = Helper.chooseOption(this.options, newOptions, 'color');
    this.options.borderColor = Helper.chooseOption(this.options, newOptions, 'borderColor');
    this.options.borderSize = Helper.chooseOption(this.options, newOptions, 'borderSize');
    this.options.position = Helper.chooseOption(this.options, newOptions, 'position');
    this._setRotate(Helper.chooseOption(this.options, newOptions, 'rotate'));
  };
  Eyebrow.prototype._setRotate = function (param) {
    if (param < -25) {
      param = -25;
    } else if (param > 25) {
      param = 25;
    }
    this.options.rotate = param;
  };
  Eyebrow.prototype._render = function () {
    this.eyebrowNode = this._createEyebrowNode();
    return this;
  };
  Eyebrow.prototype.change = function (options) {
    var self = this;
    self._setOptions(options);
    self._setNodeAttributes(self.eyebrowNode);
  };
  Eyebrow.prototype._createEyebrowNode = function () {
    var eyebrowNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var eyebrowPathNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    eyebrowPathNode.setAttribute('name', 'eyebrow');
    eyebrowNode.appendChild(eyebrowPathNode);
    this._setNodeAttributes(eyebrowNode);
    this.parent.append(eyebrowNode);
    return eyebrowNode;
  };
  Eyebrow.prototype._setNodeAttributes = function (eyelidNode) {
    var eyebrowPath = eyelidNode.querySelector('[name=eyebrow]');
    eyebrowPath.setAttribute('width', this.options.width);
    eyebrowPath.setAttribute('height', this.options.height);
    var x = 90 - this.options.width / 2;
    eyebrowPath.setAttribute('x', x);
    var y = this._getY(this.options.height, this.options.borderSize, this.options.position);
    eyebrowPath.setAttribute('y', y);
    eyebrowPath.setAttribute('stroke', this.options.borderColor);
    eyebrowPath.setAttribute('stroke-width', this.options.borderSize);
    eyebrowPath.setAttribute('fill', this.options.color);
    var rotate = this.parent.options.type == 'left' ? this.options.rotate : -this.options.rotate;
    eyebrowPath.setAttribute('transform', 'rotate(' + rotate + ', 90, 90)');
    return eyebrowPath;
  };
  Eyebrow.prototype._getY = function (h, borderSize, position) {
    return (90 - 50 - h - borderSize) * position;
  };
  Eyebrow.prototype.changeByDiff = function (diff) {
    var newOptions = {};
    for (var key in diff) {
      newOptions[key] = Helper.getCalculatedOption(this.options[key], diff[key]);
    }
    return newOptions;
  };
  return Eyebrow;
}(helper);
eye = function (Eyeball, TopEyelid, BottomEyelid, Eyebrow, Helper) {
  var SVG_HTML_TEMPLATE = [
    '<svg name="svg-node" width="50" height="50" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">',
    ' <g>',
    '  <circle name="eye" cx="90" cy="90" r="50" />',
    ' </g>',
    '</svg>'
  ].join('');
  var Eye = function (selector, options) {
    this.selector = selector;
    this._element = document.querySelector(selector);
    if (!this._element) {
      throw new Error('Not valid image selector');
    }
    // Default options
    this.options = {
      x: 0,
      y: 0,
      size: 50,
      color: '#FFFFFF',
      borderColor: '#000000',
      borderSize: 5,
      type: 'left',
      //left or right
      //eyeball options
      eyeball: {
        size: 12,
        shift: 20,
        rotate: 3.14  //from 0 to 2*PI
      },
      //top eyelid options
      topEyelid: {
        size: 0,
        //from 0 when open to 1 when closed
        color: 'white',
        borderColor: '#000000',
        borderSize: 5,
        bottomArcRadius: 0,
        //from 0 (straight line) to 1 (circle)
        bottomArcRadiusSweep: 0,
        //0 (if top arc of circle) or 1 (if bottom arc of circle)
        rotate: 0,
        //eyelid angle, from -30 to 30
        eyelashesStyle: 'none'  //'none' (without eyelashes) or 'loise' (with eyelashes)
      },
      //bottom eyelid options
      bottomEyelid: {
        size: 0,
        //from 0 when open to 1 when closed
        color: 'white',
        borderColor: '#000000',
        borderSize: 5,
        topArcRadius: 0,
        //from 0 (straight line) to 1 (circle)
        topArcRadiusSweep: 0,
        //0 (if bottom arc of circle) or 1 (if top arc of circle)
        rotate: 0  //eyelid angle, from -30 to 30
      },
      eyebrow: {
        width: 80,
        height: 5,
        position: 0.5,
        //from 0 (very top) to 1 (near eye)
        color: '#000000',
        borderColor: '#000000',
        borderSize: 0,
        rotate: 0  //eyebrow angle, from -30 to 30
      }
    };
    this.animationIntervalId = null;
    this._setOptions(options);
    this._render();
  };
  Eye.prototype._setOptions = function (options) {
    // Replace default options
    for (var key in options) {
      this.options[key] = options[key];
    }
  };
  Eye.prototype.moveToPosition = function () {
    this.move(this.options['x'], this.options['y']);
  };
  // Relative to parent image
  Eye.prototype.move = function (x, y) {
    var parentPosition = this._element.getBoundingClientRect();
    this._handlerNode.style.position = 'absolute';
    this._handlerNode.style.left = parentPosition['left'] + (x + pageXOffset) + 'px';
    this._handlerNode.style.top = parentPosition['top'] + (y + pageYOffset) + 'px';
  };
  //append node
  Eye.prototype.append = function (node) {
    this._handlerNode.querySelector('[name=svg-node]').appendChild(node);
  };
  Eye.prototype.change = function (options) {
    for (var key in options) {
      if (key == 'eyeball') {
        this.eyeball.change(options[key]);
      } else if (key == 'topEyelid') {
        this.topEyelid.change(options[key]);
      } else if (key == 'bottomEyelid') {
        this.bottomEyelid.change(options[key]);
      } else if (key == 'eyebrow') {
        this.eyebrow.change(options[key]);
      } else {
        if (this.options[key] !== undefined) {
          this.options[key] = options[key];
        }
      }
    }
    this._setNodeAttributes(this._eyeNode);
    this.moveToPosition();
  };
  Eye.prototype.changeByDiff = function (diff) {
    var newOptions = {};
    for (var key in diff) {
      if (typeof diff[key] === 'object') {
        newOptions[key] = this[key].changeByDiff(diff[key]);
      } else {
        newOptions[key] = Helper.getCalculatedOption(this.options[key], diff[key]);
      }
    }
    this.change(newOptions);
  };
  Eye.prototype.animate = function (options, duration) {
    var period = 10;
    //ms between changes;
    var diff = this._getOptionsDiff(options, duration / period);
    return this._startAnimation(diff, duration, period);
  };
  Eye.prototype.stopAnimation = function () {
    var self = this;
    clearInterval(self.animationIntervalId);
  };
  Eye.prototype._getOptionsDiff = function (options, duration) {
    var diff = {};
    for (var key in options) {
      if (typeof options[key] === 'object') {
        diff[key] = Helper.getOptionsDiff(this[key].options, options[key], duration);
      } else {
        diff[key] = Helper.getOptionDiff(this.options[key], options[key], duration);
      }
    }
    return diff;
  };
  Eye.prototype._startAnimation = function (diff, duration, period) {
    var self = this;
    var counter = 0;
    if (self.animationIntervalId) {
      this.stopAnimation();
    }
    var promise = new Promise(function (resolve, reject) {
      var internalAnimationIntervalId = setInterval(function () {
        counter += period;
        self.changeByDiff(diff);
        if (counter >= duration) {
          if (self.animationIntervalId == internalAnimationIntervalId) {
            self.stopAnimation();
            resolve();
          }
        }
      }, period);
      self.animationIntervalId = internalAnimationIntervalId;
    });
    return promise;
  };
  Eye.prototype.getCoordinates = function () {
    var self = this;
    var nodePosition = self._eyeNode.getBoundingClientRect();
    var x = nodePosition.left + nodePosition.width / 2;
    var y = nodePosition.top + nodePosition.height / 2;
    return {
      x: x,
      y: y
    };
  };
  Eye.prototype._render = function () {
    this._handlerNode = this._createHandlerNode(this.options['size']);
    this._eyeNode = this._createEyeNode();
    this.eyeball = new Eyeball(this, this.options.eyeball);
    this.topEyelid = new TopEyelid(this, this.options.type, this.options.topEyelid);
    this.bottomEyelid = new BottomEyelid(this, this.options.bottomEyelid);
    this.eyebrow = new Eyebrow(this, this.options.eyebrow);
    document.body.appendChild(this._handlerNode);
    this.move(this.options.x, this.options.y);
    //Set visible AFTER change position
    this._handlerNode.style.display = 'block';
  };
  Eye.prototype._createHandlerNode = function (size) {
    var _handlerNode = document.createElement('object');
    _handlerNode.style.display = 'none';
    _handlerNode.style.position = 'absolute';
    _handlerNode.setAttribute('width', size);
    _handlerNode.setAttribute('height', size);
    return _handlerNode;
  };
  Eye.prototype._createEyeNode = function () {
    var eyeNode = document.createElement('object');
    eyeNode.style.position = 'absolute';
    eyeNode.innerHTML = SVG_HTML_TEMPLATE;
    this._setNodeAttributes(eyeNode);
    this._handlerNode.appendChild(eyeNode);
    return eyeNode;
  };
  Eye.prototype._setNodeAttributes = function (eyeNode) {
    var svgNode = eyeNode.querySelector('[name=svg-node]');
    svgNode.setAttribute('width', this.options['size']);
    svgNode.setAttribute('height', this.options['size']);
    var eyePath = eyeNode.querySelector('[name=eye]');
    eyePath.setAttribute('fill', this.options['color']);
    eyePath.setAttribute('stroke', this.options['borderColor']);
    eyePath.setAttribute('stroke-width', this.options['borderSize']);
    return eyeNode;
  };
  return Eye;
}(eyeball, topEyelid, bottomEyelid, eyebrow, helper);
eyesPair = function (Eye) {
  var EyesPair = function (selector, options, center, distance) {
    this.leftEye = this._getEye(selector, options, center, distance, 'left');
    this.rightEye = this._getEye(selector, options, center, distance, 'right');
  };
  EyesPair.prototype._getEye = function (selector, options, center, distance, type) {
    var eyeOptions = JSON.parse(JSON.stringify(options));
    eyeOptions.type = type;
    if (type == 'left') {
      eyeOptions.x = center.x - distance / 2;
      eyeOptions.y = center.y;
    } else if (type == 'right') {
      eyeOptions.x = center.x + distance / 2;
      eyeOptions.y = center.y;
    }
    return new Eye(selector, eyeOptions);
  };
  EyesPair.prototype.getLeftEye = function () {
    return this.leftEye;
  };
  EyesPair.prototype.getRightEye = function () {
    return this.rightEye;
  };
  EyesPair.prototype.getEye = function (type) {
    if (type == 'left') {
      return this.getLeftEye();
    } else {
      return this.getRightEye();
    }
  };
  EyesPair.prototype.moveToPosition = function () {
    this.leftEye.moveToPosition();
    this.rightEye.moveToPosition();
  };
  EyesPair.prototype.animate = function (options, duration) {
    return {
      leftEyeAnimation: this.leftEye.animate(options, duration),
      rightEyeAnimation: this.rightEye.animate(options, duration)
    };
  };
  EyesPair.prototype.stopAnimation = function () {
    this.leftEye.stopAnimation();
    this.rightEye.stopAnimation();
  };
  EyesPair.prototype.emote = function (type, duration) {
    duration = duration || 1000;
    if (type == 'angry') {
      var options = {
        eyeball: { rotate: 3.14 },
        topEyelid: {
          size: 0.3,
          rotate: 20,
          bottomArcRadiusSweep: 1,
          bottomArcRadius: 0
        },
        bottomEyelid: {
          size: 0.3,
          rotate: -20,
          topArcRadius: 0,
          topArcRadiusSweep: 0
        },
        eyebrow: {
          position: 0.8,
          rotate: 20
        }
      };
      this.animate(options, duration);
    } else if (type == 'suspecting') {
      var options = {
        eyeball: { rotate: 3.14 },
        topEyelid: {
          size: 0.4,
          rotate: 0,
          bottomArcRadiusSweep: 1,
          bottomArcRadius: 0
        },
        bottomEyelid: {
          size: 0.4,
          rotate: 0,
          topArcRadius: 0,
          topArcRadiusSweep: 0
        },
        eyebrow: {
          position: 0.9,
          rotate: 0
        }
      };
      this.animate(options, duration);
    } else if (type == 'happy') {
      var options = {
        eyeball: { rotate: 3.14 },
        topEyelid: {
          size: 0.4,
          rotate: 0,
          bottomArcRadiusSweep: 1,
          bottomArcRadius: 0.3
        },
        bottomEyelid: {
          size: 0.4,
          rotate: 0,
          topArcRadius: 0.3,
          topArcRadiusSweep: 0
        },
        eyebrow: {
          position: 0.5,
          rotate: 0
        }
      };
      this.animate(options, duration);
    } else if (type == 'tempting') {
      var options = {
        eyeball: { rotate: 3.14 },
        topEyelid: {
          size: 0.4,
          rotate: 0,
          bottomArcRadiusSweep: 1,
          bottomArcRadius: 0.3
        },
        bottomEyelid: {
          size: 0,
          rotate: 0,
          topArcRadius: 0,
          topArcRadiusSweep: 0
        },
        eyebrow: {
          position: 0.5,
          rotate: 0
        }
      };
      this.animate(options, duration);
    } else if (type == 'sad') {
      var options = {
        eyeball: { rotate: 1.7 },
        topEyelid: {
          size: 0.3,
          rotate: -20,
          bottomArcRadiusSweep: 1,
          bottomArcRadius: 0.5
        },
        bottomEyelid: {
          size: 0,
          rotate: 0
        },
        eyebrow: {
          position: 0.9,
          rotate: -20
        }
      };
      this.animate(options, duration);
    }
  };
  return EyesPair;
}(eye);
eyes = function (Eye, EyesPair) {
  var Eyes = function () {
    var self = this;
    var eyes = [];
    this.createEye = function (selector, options) {
      var eye = new Eye(selector, options);
      eyes.push(eye);
      return eye;
    };
    this.createEyesPair = function (selector, options, center, distance) {
      var eyesPair = new EyesPair(selector, options, center, distance);
      eyes.push(eyesPair);
      return eyesPair;
    };
    this._resize = function () {
      for (var idx in eyes) {
        eyes[idx].moveToPosition();
      }
    };
    window.addEventListener('resize', function (e) {
      self._resize();
    }, false);
  };
  return Eyes;
}(eye, eyesPair);
window.eyes = eyes;
}());