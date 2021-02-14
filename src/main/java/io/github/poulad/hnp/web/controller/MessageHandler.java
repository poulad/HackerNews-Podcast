package io.github.poulad.hnp.web.controller;

import com.rabbitmq.client.Channel;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class MessageHandler {
    @RabbitListener(ackMode = "MANUAL")
    @SuppressWarnings("unused")
    private void handleMessage(Object data) {
        String message;
        if (data instanceof byte[]) {
            message = new String((byte[]) data);
        } else {
            message = data.toString();
        }
        log.warn(String.format("Received a message on an unhandled queue with content %s.", message));
    }

    @RabbitListener(
            id = "rabbitmq.handlers.stories",
            queuesToDeclare = @Queue(value = "stories", durable = "true"),
            ackMode = "MANUAL"
    )
    @SuppressWarnings("unused")
    private void handleStoriesMessage(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        log.info(String.format("Reading stories msg: %s", message));
        try {
            channel.basicAck(tag, false);
        } catch (Exception exception) {
            log.fatal(exception);
        }
    }
}
