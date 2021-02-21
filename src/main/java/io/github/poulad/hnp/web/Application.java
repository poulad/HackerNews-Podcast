package io.github.poulad.hnp.web;

import io.github.poulad.hnp.story.StoryService;
import io.github.poulad.hnp.story.StoryServiceImpl;
import io.github.poulad.hnp.web.controller.MessageHandler;
import javax.annotation.Nonnull;
import lombok.val;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.net.http.HttpClient;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

@SpringBootApplication
public class Application {

  @Nonnull
  @Bean
  @SuppressWarnings("unused")
  SimpleMessageListenerContainer container(
      final ConnectionFactory connectionFactory,
      final MessageListenerAdapter listenerAdapter
  ) {
    val container = new SimpleMessageListenerContainer(connectionFactory);
    container.setMessageListener(listenerAdapter);
    return container;
  }

  @Nonnull
  @Bean
  @SuppressWarnings("unused")
  MessageListenerAdapter listenerAdapter(final MessageHandler receiver) {
    return new MessageListenerAdapter(receiver);
  }

  @Nonnull
  @Bean
  @SuppressWarnings("unused")
  HttpClient httpClient() {
    return HttpClient.newBuilder().build();
  }

  @Nonnull
  @Bean
  @SuppressWarnings("unused")
  public StoryService storyService() {
    return new StoryServiceImpl();
  }

  @Nonnull
  @Bean
  @SuppressWarnings("unused") // used by Spring for RESET request validations.
  public MethodValidationPostProcessor methodValidationPostProcessor() {
    return new MethodValidationPostProcessor();
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
