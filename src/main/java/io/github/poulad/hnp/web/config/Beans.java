package io.github.poulad.hnp.web.config;

import io.github.poulad.hnp.web.service.DraftService;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({
        DraftService.class,
})
public class Beans {

}
