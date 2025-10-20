FROM alpine:latest
RUN apk add stress
CMD ["stress", "--cpu", "2", "--timeout", "30s"]
