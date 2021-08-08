package io.github.poulad.hnp.web.config;

import io.github.poulad.hnp.web.service.DraftService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.net.http.HttpClient;

@Configuration
@Import({
        DraftService.class,
})
public class Beans {

    @Bean
    protected HttpClient httpClient() {
        return HttpClient.newBuilder().build();
    }

}
