### Parte 3
##### Verificaci�n del funcionamiento de RabbitMQ
Conexiones:

![alt text](https://github.com/anamaria1299/balanceo-de-carga/blob/cloud-based-mom/img/connections.jpg "overview")

![alt text](https://github.com/anamaria1299/balanceo-de-carga/blob/cloud-based-mom/img/rabbitmq.PNG "overview")


##### RabbitMQ vs ActiveMQ
* Usando ActiveMQ la manipulaci�n de Message Broker no es tan personalizable.
* Otorgar orden y evitar la concurrencia no es posible con RabbitMQ.
* La distribuci�n a trav�s de las regiones no es una calidad de RabbitMQ. ActiveMQ admite oficialmente la distribuci�n a trav�s de las regiones . Puede configurar una red de corredores con conmutaci�n por error y tener temas y colas distribuidos. Tambi�n puede tener una red de corredores principal / esclavo cuando una regi�n asumir� cuando las otras regiones bajen. En realidad, RabbitMQ no tiene un soporte s�lido.
* RabbitMQ se escribi� enfocado en alto rendimiento cuando no le importa la consistencia, si configura RabbitMQ para que tenga la consistencia, tendr� un rendimiento muy similar al de ActiveMQ.
* RabbitMQ puede garantizar que no perder� mensajes, pero debe tener en cuenta que, de forma predeterminada, RabbitMQ est� configurado para un rendimiento no coherente. Por ejemplo:
	- Si publica un mensaje en un intercambio que no tiene colas enlazadas, no recibir� un error (perder� ese mensaje).
	- Si alguna cola enlazada a un intercambio est� inactiva (porque este nodo de cola est� inactivo, o algo as�) cuando publique el mensaje, se enviar� a todas las colas en l�nea y no obtendr� un error.
	- Cuando publique un mensaje, RabbitMQ no espere ni pregunte al servidor si se entreg� correctamente.
Para todos estos casos, es posible configurar RabbitMQ para otorgar la consistencia, solo tenga en cuenta que de forma predeterminada, a RabbitMQ no le importa la consistencia, ActiveMQ lo hace.
* ActiveMQ es bastante lento pero cuenta con la mayoria de funcionalidades. Se puede implementar tanto con el intermediario como con las topolog�as P2P. Al igual que RabbitMQ, es m�s f�cil implementar escenarios avanzados, pero generalmente a costa del rendimiento en bruto.  
* RabbitMQ falla constantemente con demasiados productores y pocos consumidores. Es de mejor rendimiento pero no tiene opciones de recuperaci�n de fallos. Es menos escalable y "m�s lento" porque el nodo central agrega latencia y los sobres de mensajes son bastante grandes.

    ##### Conclusi�n:
    Como opci�n m�s conveniente elegimos a ActiveMQ, ya que aunque sea m�s lento garantiza que no se perder�n los mensajes por lo que contamos con un manejador de errores, esto lo hace m�s confiable que RabbitMQ. Adem�s podemos configurar ActiveMQ para que su rendimiento sea parecido a el de RabbitMQ. Por tanto, en t�rminos de escalabilidad, consistencia y confiabilidad es mejor ActiveMQ.