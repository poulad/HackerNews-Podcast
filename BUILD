load("@rules_java//java:defs.bzl", "java_binary")

# see an example for Spring Boot at https://github.com/bazelbuild/rules_jvm_external/tree/master/examples/spring_boot
java_binary(
    name = "web_api",
    srcs = glob(["src/main/java/**"]),
    main_class = "io.github.poulad.hackernews_podcast.Application",
    resources = glob(["src/main/resources/**"]),
    deps = [
        ":common_deps",
        "@maven//:org_springframework_boot_spring_boot",
        "@maven//:org_springframework_boot_spring_boot_starter_web",
        "@maven//:org_springframework_boot_spring_boot_starter_data_jpa",
        "@maven//:org_springframework_boot_spring_boot_starter_amqp",
        "@maven//:org_springframework_boot_spring_boot_starter_actuator",
        "@maven//:org_springframework_spring_context",
        "@maven//:org_hibernate_validator_hibernate_validator",
        "@maven//:com_internetitem_logback_elasticsearch_appender",

        # transitive dependencies:
        "@maven//:org_springframework_boot_spring_boot_autoconfigure",
        "@maven//:org_springframework_spring_web",
        "@maven//:org_springframework_spring_beans",
        "@maven//:org_springframework_spring_messaging",
        "@maven//:org_springframework_amqp_spring_amqp",
        "@maven//:org_springframework_amqp_spring_rabbit",
        "@maven//:com_rabbitmq_amqp_client",
        "@maven//:org_springframework_data_spring_data_commons",
        "@maven//:jakarta_persistence_jakarta_persistence_api",
        "@maven//:com_fasterxml_jackson_core_jackson_core",
        "@maven//:com_fasterxml_jackson_core_jackson_databind",
        "@maven//:org_apache_logging_log4j_log4j_api",
    ],
    runtime_deps = [
        "@maven//:org_postgresql_postgresql"
    ],
)

java_library(
    name = "lombok",
    exports = ["@maven//:org_projectlombok_lombok"],
    exported_plugins = [":lombok_plugin"],
)

java_plugin(
    name = "lombok_plugin",
    processor_class = "lombok.launch.AnnotationProcessorHider$AnnotationProcessor",
    deps = [
        "@maven//:org_projectlombok_lombok",
    ],
)

java_library(
    name = "common_deps",
    exports = [
        "@maven//:org_projectlombok_lombok",
        "@maven//:com_google_code_findbugs_jsr305",
        "@maven//:org_mapstruct_mapstruct",
    ]
)

####################################################################################################

####################################################################################################

java_library(
    name = "archunit",
    runtime_deps = [
        "@maven//:com_tngtech_archunit_archunit",
        "@maven//:com_tngtech_archunit_archunit_junit5",
        "@maven//:com_tngtech_archunit_archunit_junit5_api",
    ],
    exports = [
        "@maven//:com_tngtech_archunit_archunit",
        "@maven//:com_tngtech_archunit_archunit_junit5",
        "@maven//:com_tngtech_archunit_archunit_junit5_api",
    ],
    visibility = [
        "//visibility:public",
    ],
)

load("//:junit5.bzl", "java_junit5_test")
java_junit5_test(
    name = "hnp_arch_test",
    test_package = "io.github.poulad.test.hnp.architecture",
    srcs = glob(["src/test/java/io/github/poulad/test/hnp/architecture/**"]),
    deps = [
        ":common_deps",
        ":archunit",
    ]
)