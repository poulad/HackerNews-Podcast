package io.github.poulad.hackernews_podcast;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Map;

@SpringBootApplication
public class Application {

    static final String topicExchangeName = "spring-boot-exchange";

    static final String queueName = "spring-boot";

    @Bean
    Queue queue() {
        return new Queue(queueName, false);
    }

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(topicExchangeName);
    }

    @Bean
    Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("");
    }

//    @Bean
//    SimpleMessageListenerContainer container(
//            ConnectionFactory connectionFactory,
//            MessageListenerAdapter listenerAdapter
//    ) {
//        var container = new SimpleMessageListenerContainer();
//        container.setConnectionFactory(connectionFactory);
//        container.setQueueNames(queueName);
//        container.setAcknowledgeMode(AcknowledgeMode.MANUAL);
//        container.setMessageListener(listenerAdapter);
//        return container;
//    }
//
//    @Bean
//    MessageListenerAdapter listenerAdapter(MessageReceiver receiver) {
//        var adapter = new MessageListenerAdapter(receiver, "receiveMessage");
//        adapter.setQueueOrTagToMethodName(Map.of(
//                Constants.Queues.STORIES.name(), "receiveStoriesMessage"
//        ));
//        return adapter;
//    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
