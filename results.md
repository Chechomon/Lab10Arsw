### Parte 3
##### Verificación del funcionamiento de RabbitMQ
Conexiones:

![alt text](https://github.com/anamaria1299/balanceo-de-carga/blob/cloud-based-mom/img/connections.jpg "overview")

![alt text](https://github.com/anamaria1299/balanceo-de-carga/blob/cloud-based-mom/img/rabbitmq.PNG "overview")


##### RabbitMQ vs ActiveMQ
* Usando ActiveMQ la manipulación de Message Broker no es tan personalizable.
* Otorgar orden y evitar la concurrencia no es posible con RabbitMQ.
* La distribución a través de las regiones no es una calidad de RabbitMQ. ActiveMQ admite oficialmente la distribución a través de las regiones . Puede configurar una red de corredores con conmutación por error y tener temas y colas distribuidos. También puede tener una red de corredores principal / esclavo cuando una región asumirá cuando las otras regiones bajen. En realidad, RabbitMQ no tiene un soporte sólido.
* RabbitMQ se escribió enfocado en alto rendimiento cuando no le importa la consistencia, si configura RabbitMQ para que tenga la consistencia, tendrá un rendimiento muy similar al de ActiveMQ.
* RabbitMQ puede garantizar que no perderá mensajes, pero debe tener en cuenta que, de forma predeterminada, RabbitMQ está configurado para un rendimiento no coherente. Por ejemplo:
	- Si publica un mensaje en un intercambio que no tiene colas enlazadas, no recibirá un error (perderá ese mensaje).
	- Si alguna cola enlazada a un intercambio está inactiva (porque este nodo de cola está inactivo, o algo así) cuando publique el mensaje, se enviará a todas las colas en línea y no obtendrá un error.
	- Cuando publique un mensaje, RabbitMQ no espere ni pregunte al servidor si se entregó correctamente.
Para todos estos casos, es posible configurar RabbitMQ para otorgar la consistencia, solo tenga en cuenta que de forma predeterminada, a RabbitMQ no le importa la consistencia, ActiveMQ lo hace.
* ActiveMQ es bastante lento pero cuenta con la mayoria de funcionalidades. Se puede implementar tanto con el intermediario como con las topologías P2P. Al igual que RabbitMQ, es más fácil implementar escenarios avanzados, pero generalmente a costa del rendimiento en bruto.  
* RabbitMQ falla constantemente con demasiados productores y pocos consumidores. Es de mejor rendimiento pero no tiene opciones de recuperación de fallos. Es menos escalable y "más lento" porque el nodo central agrega latencia y los sobres de mensajes son bastante grandes.

    ##### Conclusión:
    Como opción más conveniente elegimos a ActiveMQ, ya que aunque sea más lento garantiza que no se perderán los mensajes por lo que contamos con un manejador de errores, esto lo hace más confiable que RabbitMQ. Además podemos configurar ActiveMQ para que su rendimiento sea parecido a el de RabbitMQ. Por tanto, en términos de escalabilidad, consistencia y confiabilidad es mejor ActiveMQ.