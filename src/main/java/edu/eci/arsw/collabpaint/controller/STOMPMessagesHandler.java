package edu.eci.arsw.collabpaint.controller;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;

@Controller
public class STOMPMessagesHandler {
	
	@Autowired
	SimpMessagingTemplate msgt;
	
	ConcurrentHashMap<String, ArrayList<Point>> points= new ConcurrentHashMap<String, ArrayList<Point>>();
    
	@MessageMapping("/newpoint.{numdibujo}")    
	public void handlePointEvent(@DestinationVariable String numdibujo,Point pt) throws Exception {
		System.out.println("Nuevo punto recibido en el servidor!:"+pt);
		msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
		
		if (points.get(numdibujo)==null){
			points.put(numdibujo, new ArrayList<Point>());
		}
		synchronized(points.get(numdibujo)) {
			if(points.get(numdibujo).size() < 3) {
				msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
				points.get(numdibujo).add(pt);
			}
			else {
				msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
				points.get(numdibujo).add(pt);
				msgt.convertAndSend("/topic/newpolygon."+numdibujo,points.get(numdibujo));
				points.get(numdibujo).clear();
			}
		}
	}
}