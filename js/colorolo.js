var Colorolo = function(){
    // private properties  
    var bgmusic,
        swoosh,
        tick,
        drawingApp;

    // public property      
    this.initialize = function(){

        bgmusic = $("#bgmusic")[0];
        swoosh = $("#swoosh")[0];
        tick = $("#tick")[0];

       // playBackgroungMusic();
        prepareCanvas();

    },
    // privileged function
    playBackgroungMusic = function(){
        bgmusic.play();
    },
    pauseBackgroungMusic = function(){
        bgmusic.pause();
    },
    playSwooshSound = function(){
        swoosh.play();
    },
    playClickSound = function(){
        tick.play();
    },
    bindEvents = function(){

        $('#categoryPicker').bind('touchstart click',function (e) {
                togglePictureSelectionPanel();
                e.stopPropagation();
         });

        $('.category').bind('touchstart click',function (e) {
                drawingApp.clearCanvas();
                window.localStorage.setItem('chosenCategory', $(this).attr("category"));
                loadImagesWithinCategory(window.localStorage.getItem('chosenCategory'));
                e.stopPropagation();
        });

        $("li.browseItem").bind('touchstart click',function (e) {
                togglePictureSelectionPanel();
                drawingApp.clearCanvas();
                var pageNumber = $(this).attr('pageNumber');
                loadImageOnPage(pageNumber);
                e.stopPropagation();
        });

        $('#backToCategories').bind('touchstart click',function (e){
                $('#allCategories').addClass('appear');
                $('#allColoringPages').removeClass('appear');
                $('#allColoringPages>ul').addClass('hide');
                e.stopPropagation();
        });

        $("#colorSelect>li").bind('touchstart click',function (e) {
               playClickSound();
                $("#colorSelect li").removeClass('selected');
                drawingApp.setColor($(this).addClass('selected').css("background-color"));
                /*  if eraser or refresh was selected then set tool to crayon as 
                otherwise after selecting color one may not be able to draw on canvas  */
                var toolSelected = $("#toolSelect li.selected").attr('data-tool');
                if(toolSelected=='eraser' || toolSelected=='clearCanvas'){
                    $('#toolSelect li').removeClass('selected');
                    drawingApp.setTool($('#toolSelect li.crayon').addClass('selected').attr("data-tool"));
                }

                e.stopPropagation();
        });

        $("#selectedSize").bind('touchstart click',function (e){
               playClickSound();
                $("#sizeSelector").toggleClass('openMenu');
                e.stopPropagation();
        });

        $("#sizeSelector li").bind('touchstart click',function (e) {
               playClickSound();
                $("#sizeSelector li").removeClass('selected');
                drawingApp.setSize($(this).addClass('selected').attr("data-size"));
                var previousSize = $("selectedSize").attr('class');
                $("#selectedSize").removeClass(previousSize);
                $("#selectedSize").addClass($(this).attr("class"));
                e.stopPropagation();
        });

        $("#toolSelect li").bind('touchstart click',function (e) {
               playClickSound();
                $("#toolSelect li").removeClass('selected');
                drawingApp.setTool($(this).addClass('selected').attr("data-tool"));
                 var toolSelected = $("#toolSelect li.selected").attr('data-tool');
                if(toolSelected=='clearCanvas'){
                    $('#toolSelect li').removeClass('selected');
                    drawingApp.setTool($('#toolSelect li.crayon').addClass('selected').attr("data-tool"));
                }
                e.stopPropagation();
        });

        $('#sound').bind('touchstart click',function (e){
                if($('#sound').hasClass('on')){
                    playBackgroungMusic();
                } else{
                    pauseBackgroungMusic();
                }
                $('#sound').toggleClass('on');
        });

        // $('body').bind('touchstart click',function () {
        //         $('#sizeSelector').removeClass('openMenu');
        // });

       // drawingApp.bindCanvasEvents();

    },

    loadImagesWithinCategory = function(category){

         //some JSON stuff here giving the list of all images url within a category folder
        $('#allCategories').removeClass('appear');
        $('#allColoringPages').addClass('appear');
        $('ul[category='+category+']>li').each( function(){
            $(this).css('background-image','url(img/'+category+'/'+ $(this).attr('pageNumber')+'.png)');
        });
        $('ul[category='+category+']').removeClass('hide');

    },
    loadImageOnPage = function(pageNumber) {
        /** changeImage(imageSRC) function is defined in js/drawing-app.js **/
        changeImage("img/" + localStorage.chosenCategory + "/"+pageNumber+".png");
    },
    togglePictureSelectionPanel = function(){
        playSwooshSound();
        $('#categoryPicker').toggleClass('left');
    },
    prepareCanvas = function(){
        drawingApp  = new DrawingApp();
        drawingApp.prepareCanvas();
        bindEvents();
    };

};