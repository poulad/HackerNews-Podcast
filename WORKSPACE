workspace(name = "hacker_news_podcast")

####################################################################################################
# maven install
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
RULES_JVM_EXTERNAL_TAG = "2.8"
RULES_JVM_EXTERNAL_SHA = "79c9850690d7614ecdb72d68394f994fef7534b292c4867ce5e7dec0aa7bdfad"
http_archive(
    name = "rules_jvm_external",
    strip_prefix = "rules_jvm_external-%s" % RULES_JVM_EXTERNAL_TAG,
    sha256 = RULES_JVM_EXTERNAL_SHA,
    url = "https://github.com/bazelbuild/rules_jvm_external/archive/%s.zip" % RULES_JVM_EXTERNAL_TAG,
)
load("@rules_jvm_external//:defs.bzl", "maven_install")
####################################################################################################

####################################################################################################
# see Sprint Boot example at https://github.com/bazelbuild/rules_jvm_external/blob/master/examples/spring_boot/WORKSPACE
SPRING_BOOT_VERSION = "2.4.2"
SPRING_VERSION = "5.3.3"
ARCH_UNIT_VERSION = "0.16.0"
maven_install(
    artifacts = [
        "org.springframework.boot:spring-boot:" + SPRING_BOOT_VERSION,
        "org.springframework.boot:spring-boot-starter-web:" + SPRING_BOOT_VERSION,
        "org.springframework.boot:spring-boot-starter-data-jpa:" + SPRING_BOOT_VERSION,
        "org.springframework.boot:spring-boot-starter-amqp:" + SPRING_BOOT_VERSION,
        "org.springframework.boot:spring-boot-starter-actuator:" + SPRING_BOOT_VERSION,
        "org.springframework:spring-context:" + SPRING_VERSION,
        "org.hibernate.validator:hibernate-validator:7.0.1.Final",
        "org.postgresql:postgresql:42.2.18.jre7",
        "com.internetitem:logback-elasticsearch-appender:1.6",
        "org.mapstruct:mapstruct:1.4.2.Final",
        "org.projectlombok:lombok:1.18.18",
        "com.google.code.findbugs:jsr305:3.0.2",

        # Unit tests:
        "org.junit.jupiter:junit-jupiter-api:5.8.0-M1",
        "com.tngtech.archunit:archunit:" + ARCH_UNIT_VERSION,
        "com.tngtech.archunit:archunit-junit5:" + ARCH_UNIT_VERSION,
    ],
    fetch_sources = True,
    repositories = [
        "https://repo1.maven.org/maven2",
    ],
)

# TODO what is this for?
load("@maven//:defs.bzl", "pinned_maven_install")
pinned_maven_install()
####################################################################################################

####################################################################################################
# see https://github.com/junit-team/junit5-samples/tree/main/junit5-jupiter-starter-bazel
load(":junit5.bzl", "junit_jupiter_java_repositories", "junit_platform_java_repositories")
JUNIT_JUPITER_VERSION = "5.7.1"
JUNIT_PLATFORM_VERSION = "1.7.1"
junit_jupiter_java_repositories(
    version = JUNIT_JUPITER_VERSION,
)
junit_platform_java_repositories(
    version = JUNIT_PLATFORM_VERSION,
)
####################################################################################################
