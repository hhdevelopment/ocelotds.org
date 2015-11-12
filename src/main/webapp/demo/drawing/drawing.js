'use strict';
ocelotController.addOpenListener(function () {
   var subCanvasEvent, imageView, stage, pencil, drawingServices = new DrawingServices();
   // The drawing pencil.
   pencil = {
      mousedown: function (ev) {
         var ctx = this.drawingArea(ev.id).getContext('2d');
         ctx.beginPath();
         ctx.moveTo(ev.x, ev.y);
      },
      mousemove: function (ev) {
         var color, ctx = this.drawingArea(ev.id).getContext('2d');
         color = "#" + ev.id.substring(0, 6);
         ctx.strokeStyle = color;
         ctx.lineTo(ev.x, ev.y);
         ctx.stroke();
      },
      mouseup: function (ev) {
         this.endDrawing(ev);
      },
      mouseleave: function (ev) {
         this.endDrawing(ev);
      },
      mouseout: function (ev) {
         this.endDrawing(ev);
      },
      endDrawing: function (ev) {
         this.mousemove(ev);
         this.saveDrawing(ev.id);
      },
      drawingArea: function (id) {
         var canvas = document.getElementById(id);
         if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', "400px");
            canvas.setAttribute('height', "300px");
            canvas.setAttribute('id', id);
            stage.insertBefore(canvas, imageView);
         }
         return canvas;
      },
      saveDrawing: function (id) {
         var canvas = this.drawingArea(id);
         document.getElementById('imageView').getContext('2d').drawImage(canvas, 0, 0);
         stage.removeChild(canvas);
      }
   };
   stage = document.getElementById('stage');
   // Attach mouse event listeners for send to back-end
   imageView = document.getElementById('imageView');
   imageView.addEventListener('mousedown', function (event) {
      imageView.addEventListener('mousemove', sendMouseEvent, false);
      imageView.addEventListener('mouseup', endDrawing, false);
      imageView.addEventListener('mouseleave', endDrawing, false);
      imageView.addEventListener('mouseout', endDrawing, false);
      sendMouseEvent(event);
   }, false);
   // Subscribe Topic
   new Subscriber("subscribers:eventCanvas").message(function (nb) {
      document.getElementById("subscribersNumber").innerHTML = nb;
   });
   subCanvasEvent = new Subscriber("eventCanvas").message(function (evt) {
      pencil[evt.type](evt);
   });
   function endDrawing(event) {
      console.log("END DRAWING");
      sendMouseEvent(event);
      imageView.removeEventListener('mousemove', sendMouseEvent);
      imageView.removeEventListener('mouseup', sendMouseEvent);
      imageView.removeEventListener('mouseleave', sendMouseEvent);
      imageView.removeEventListener('mouseout', sendMouseEvent);
   }
   function sendMouseEvent(ev) {
      drawingServices.pushCanvasEvent({"x": ev.offsetX, "y": ev.offsetY, "type": ev.type});
   }
   ocelotController.addCloseListener(function () {
      subCanvasEvent.unsubscribe();
   });
});


