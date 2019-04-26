var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var idTopic = null;
    
    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    var addPolygonToCanvas = function(points){
    	var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        
        var polygon =  points[0];
        ctx.moveTo(polygon.x, polygon.y);
        for(var i = 1; i < points.length; i++){
        	
        	var pto=points[i];
    		ctx.lineTo(pto.x,pto.y);
        
        }
        
        ctx.lineTo(points[0].x,points[0].y);
    	ctx.fill();
		ctx.closePath();
    	ctx.stroke();
    };
    
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+idTopic, function (eventbody) {
            	
            	//alert(eventbody);
            	var theObject= JSON.parse(eventbody.body);
                //console.log(theObject);
            	

            	//Dibuja circulo
            	addPointToCanvas(theObject);
            });
           
        });
    };
	
	var connectAndSubscribeId = function (id) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+id, function (eventbody) { 
            	//alert(eventbody);
            	var theObject= JSON.parse(eventbody.body);
                //console.log(theObject);
            	

            	//Dibuja circulo
            	addPointToCanvas(theObject);
            });
            stompClient.subscribe('/topic/newpolygon.'+id, function(eventbody){
         	   console.log(eventbody);
         	   var polygonObject = JSON.parse(eventbody.body);
         	   addPolygonToCanvas(polygonObject);
            });
        });
    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectAndSubscribe();
        },
		
		initButton: function (id) {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectAndSubscribeId(id);
        },
     
        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            
            //publicar el evento
            stompClient.send("/topic/newpoint",{}, JSON.stringify(pt));
        },
        
        withclick: function(evn){
        	console.log(evn);
        	var pt=new Point(getMousePosition(evn).x,getMousePosition(evn).y);
        	console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            
            //publicar el evento
            stompClient.send("/topic/newpoint",{}, JSON.stringify(pt));
        }
        ,

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
		,
		
		//With different Ids
		publishPointId: function(px,py,id){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            
            //publicar el evento
            stompClient.send("/app/newpoint."+id,{}, JSON.stringify(pt));
        },
        
        withclickId: function(evn,id){
        	console.log(evn);
        	var pt=new Point(getMousePosition(evn).x,getMousePosition(evn).y);
        	console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            
            //publicar el evento
            stompClient.send("/app/newpoint."+id,{}, JSON.stringify(pt));
        }
    };

})();