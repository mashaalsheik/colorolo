var DrawingApp = function(){  
    
    var canvas,
        context,
        canvasWidth,
        canvasHeight,
        padding,
        lineWidth,
        colorBlue,
        outlineImage,
        crayonImage,
        markerImage,
        eraserImage,
        crayonBackgroundImage,
        markerBackgroundImage,
        eraserBackgroundImage,
        crayonTextureImage,
        clickX,
        clickY,
        clickColor =[],
        clickTool,
        clickSize,
        clickDrag,
        paint,
        curColor,
        curTool,
        curSize,
        mediumStartX,
        mediumStartY,
        mediumImageWidth,
        mediumImageHeight,
        drawingAreaX,
        drawingAreaY,
        drawingAreaWidth,
        drawingAreaHeight,
        toolHotspotStartY,
        toolHotspotHeight,
        sizeHotspotStartY,
        sizeHotspotHeight,
        sizeHotspotWidthObject,
        totalLoadResources,
        curLoadResNum,
        elementSrcOnCanvas;

    initializeVariables = function(){
        canvasWidth = 900,
        canvasHeight = 595,
        padding = 25,
        lineWidth = 8,
        colorBlue = "#14AEA5",
        outlineImage = new Image(),
        crayonImage = new Image(),
        markerImage = new Image(),
        eraserImage = new Image(),
        crayonBackgroundImage = new Image(),
        markerBackgroundImage = new Image(),
        eraserBackgroundImage = new Image(),
        crayonTextureImage = new Image(),
        clickX = [],
        clickY = [],
        clickColor =[],
        clickTool = [],
        clickSize = [],
        clickDrag = [],
        paint = false,
        curColor = colorBlue,
        curTool = "marker",
        curSize = "normal",
        mediumStartX = 18,
        mediumStartY = 19,
        mediumImageWidth = 93,
        mediumImageHeight = 46,
        drawingAreaX = 111,
        drawingAreaY = 11,
        drawingAreaWidth = 900,
        drawingAreaHeight = 495,
        toolHotspotStartY = 23,
        toolHotspotHeight = 38,
        sizeHotspotStartY = 157,
        sizeHotspotHeight = 36,
        sizeHotspotWidthObject = {},
        sizeHotspotWidthObject.huge = 39,
        sizeHotspotWidthObject.large = 25,
        sizeHotspotWidthObject.normal = 18,
        sizeHotspotWidthObject.small = 16,
        totalLoadResources = 8,
        curLoadResNum = 0,
        elementSrcOnCanvas = null;
    
    },

    initializeCanvas = function(){

        var canvasDiv = document.getElementById('canvasDiv');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");
        //outlineImage.src = elementToDraw;
        
        bindCanvasEvents();
    },

    bindCanvasEvents = function() {
        
        // Add mouse events
        // ----------------
        //document.addEventListener("touchend", function(e) { e.preventDefault(); }, false);

        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mousemove", mouseMove, false);
        canvas.addEventListener("mouseup", mouseUp, false);
        canvas.addEventListener("mouseleave", mouseOut, false);

        canvas.addEventListener("touchstart", mouseDown, false);
        canvas.addEventListener("touchmove", mouseMove, true);
        canvas.addEventListener("touchend", mouseUp, false);
        canvas.addEventListener("touchcancel", mouseOut, true);


    },

    mouseDown =  function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        paint = true;
        addCanvasClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        canvasRedraw();

        // FIX: Cancel the event
        e.preventDefault();

    },

    mouseMove = function(e){
        if(paint){
        //subtracting 60 & 100 from X & Y to draw at the exact touched point
        addCanvasClick(e.pageX - this.offsetLeft-60, e.pageY - this.offsetTop-100, true); 
        canvasRedraw();
        }
        // FIX: Cancel the event
        e.preventDefault();
    },

    mouseUp = function(e){
        paint = false;
        canvasRedraw();
        // FIX: Cancel the event
        e.preventDefault();
    },

    mouseOut = function(e){
        paint = false;
        // FIX: Cancel the event
        e.preventDefault();
    },

    canvasRedraw = function(){

      canvas.width = canvas.width; // Clears the canvas
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;
      var radius;

      for(var i=0; i < clickX.length; i++)
      {
        if(clickSize[i] == "small"){
            radius = 2;
        }else if(clickSize[i] == "normal"){
            radius = 10;
        }else if(clickSize[i] == "large"){
            radius = 20;
        }else if(clickSize[i] == "huge"){
            radius = 40;
        }else{
            alert("Error: Radius is zero for click " + i);
            radius = 0;
        }

        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.strokeStyle = clickColor[i];
         context.lineWidth = radius;
         context.stroke();
      }
      // if(curTool == "crayon") {
      //   context.globalAlpha = 0.4;
      //   context.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight);
      // }
      context.globalAlpha = 1;

      context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);      
    },

    addCanvasClick = function(x, y, dragging){

        clickX.push(x);
        clickY.push(y);
        // clickTool.push(curTool); 
        //console.log('curColor - addclick: ' + curColor);
        if(curTool == "eraser"){
            clickColor.push("#EFEFEF");
        }else{
            clickColor.push(curColor);
        }
        //clickColor.push(curColor);
        clickSize.push(curSize);
        clickDrag.push(dragging);

    },
    /**
    * Calls the redraw function after all neccessary resources are loaded.
    */
    resourceLoaded = function (){
        if(++curLoadResNum >= totalLoadResources){
            redraw();
        }
    },

    changeImage = function (elementToDraw){
        //$("#canvasDiv canvas")

        outlineImage.src =  elementSrcOnCanvas = elementToDraw;
        canvasRedraw();
    }
    this.prepareCanvas = function(){
        // initialize drawing app
        initializeVariables();
        initializeCanvas();        

    },
    this.setColor = function(colorSelcted) {
            curColor = colorSelcted;
    },

    this.setSize = function(sizeSelected) {
            curSize = sizeSelected;
    },
    this.setTool = function(toolSelected) {

        if(toolSelected == 'clearCanvas'){

            this.clearCanvas();

            // elementSrcOnCanvas saved while setting the img src in changeImage        
            changeImage(elementSrcOnCanvas);
            return;
        }
            curTool = toolSelected;
    },
    this.clearCanvas = function(){
        clickX = [];
        clickY = [];
        clickDrag = [];

        context.fillStyle = '#ffffff'; // Work around for Chrome
        context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
        canvas.width = canvas.width; // clears the canvas 
        //FIX: to paint with only selected color after clearing all canvas. 
        // otherwise, no matter what color selected, all colors previously selected will appear
        // sequentially as you draw on the canvas.
        clickColor=[];
    }

};