window.onload = function () {
  var \
    dragger = function ()
    {
      curDrag = this;
      this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
      this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
    },
    move = function (dx, dy)
    {
      var att = this.type == "rect" ? { x: this.ox + dx, y: this.oy } : { cx: this.ox + dx, cy: this.oy };
      this.attr(att);
      r.safari();
    },
    collide = function (obj)
    {
      document.getElementById("debug").innerHTML = curDrag["id"] + " <-> " + obj["id"]
      if (curDrag["grid"] > obj["grid"]) {
        if (curDrag.getBBox().width < obj.getBBox().width &&
            curDrag.getBBox().x > (obj.getBBox().x+obj.getBBox().width/3)) {
          return;
        }
        att = { x: obj.attr("x")+curDrag.getBBox().width+margin };
        obj.attr(att);
      } else {
        if (curDrag.getBBox().width < obj.getBBox().width &&
            curDrag.getBBox().x < (obj.getBBox().x+obj.getBBox().width/3)) {
          return;
        }
        att = { x: obj.attr("x")-(curDrag.getBBox().width+margin) };
        obj.attr(att);
      }

      var tmp = curDrag["grid"];
      curDrag["grid"] = obj["grid"];
      obj["grid"] = tmp;
    },
    up = function ()
    {
      snapToGrid(this);
    },
    snapToGrid = function (obj)
    {
      // just x coord, y is fixed in drag
      var d = 0;
      for (var i = 0; i < 4; i++) {
        obj = null
        for (var j = 0; j < shapes.length; j++) {
          obj = shapesById[j];
          if (obj["grid"] == i)
            break;
        }
        att = {x:d};
        obj.animate(att,250);
        d += obj.getBBox().width+margin;
      }
    },
    widths = [ 10, 128, 30, 40 ],
    r = Raphael("holder", widths[0]+widths[1]+widths[2]+widths[3]+3*margin, 100),
    fix_y = 50,
    margin = 10,
    shapes = [
               r.rect(0,                                      fix_y, widths[0], 30, 0),
               r.rect(widths[0]+margin,                       fix_y, widths[1], 30, 0),
               r.rect(widths[0]+widths[1]+2*margin,           fix_y, widths[2], 30, 0),
               r.rect(widths[0]+widths[1]+widths[2]+3*margin, fix_y, widths[3], 30, 0),
             ],
    colors = [ "#000", "#ccc", "#0f0", "#00f" ],
    shapesById  = {},
    curDrag = null;
  for (var i = 0; i < shapes.length; i++) {
    shapes[i].attr({fill: colors[i], cursor: "move"});
    shapes[i].drag(move, dragger, up).onDragOver( function(a) { collide(a);});
    shapes[i]["id"] = i;
    shapes[i]["grid"] = i;
    shapesById[i] = shapes[i];
  }
};

