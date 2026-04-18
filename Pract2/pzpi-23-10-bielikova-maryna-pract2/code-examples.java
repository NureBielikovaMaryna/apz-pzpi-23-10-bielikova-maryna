//В.1 Приклад програмного коду
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/requests")
public class TripRequestController {

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@RequestBody TripRequest request) {
        // Логіка створення поїздки
        System.out.println("Отримано запит на поїздку від координати: " + request.getStartLat());
        
        return ResponseEntity.accepted().body(new TripResponse("8a318182", "processing", 5));
    }
}



// В.2 Приклад програмного коду
import javax.websocket.*;

@ClientEndpoint
public class DriverLocationClient {

    @OnMessage
    public void onMessage(String message) {
        // Обробка отриманих координат водія
        System.out.println("Нові координати водія: " + message);
        updateMapPosition(message);
    }

    private void updateMapPosition(String data) {
        // Логіка оновлення іконки авто на карті
    }
}


//В.3 Приклад програмного коду
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;

public class TripEventService {

    // Продюсер: надсилає повідомлення, що поїздка завершена
    public void completeTrip(String tripId, double fare) {
        TripEvent event = new TripEvent(tripId, "TRIP_COMPLETED", fare);
        kafkaTemplate.send("trip-events-topic", event);
    }

    // Консьюмер: інший сервіс (наприклад, Чеки) ловить цю подію
    @KafkaListener(topics = "trip-events-topic")
    public void handleTripCompleted(TripEvent event) {
        if ("TRIP_COMPLETED".equals(event.getType())) {
            System.out.println("Генеруємо чек для поїздки: " + event.getTripId());
            sendEmailReceipt(event.getTripId());
        }
    }
}
