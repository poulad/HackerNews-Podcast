package io.github.poulad.hackernews_podcast;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageReceiver {
    private RabbitTemplate rabbitTemplate;

    public MessageReceiver(
            @Autowired RabbitTemplate rabbitTemplate
    ) {
        this.rabbitTemplate = rabbitTemplate;
    }

    private void receiveMessage(Object message) {
        String text = new String((byte[]) message);
        System.out.println(text);

    }

    private void receiveStoriesMessage(Object message) {
        String text = new String((byte[]) message);
        System.out.println(text);
    }
}
