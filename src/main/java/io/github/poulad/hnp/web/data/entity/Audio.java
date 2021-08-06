package io.github.poulad.hnp.web.data.entity;

import lombok.Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity(name = "audio")
public class Audio {

    @Id
    @Nonnull
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Nullable
    @Column(name = "url")
    private String url;

    @Nullable
    @Column(name = "content")
    private String content;

    @Nullable
    @Column(name = "type")
    private String type;

    @Nullable
    @Column(name = "size")
    private Long size;

    @Column(name = "duration")
    private Integer duration;
}
