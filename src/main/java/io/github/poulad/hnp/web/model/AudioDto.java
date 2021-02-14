package io.github.poulad.hnp.web.model;

import lombok.Data;

@Data
public class AudioDto {
    private String url;
    private long size;
    private String format;
}
