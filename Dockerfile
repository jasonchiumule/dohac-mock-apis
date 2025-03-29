FROM golang:1.22 AS build

WORKDIR /go/src/app
COPY . .

RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /go/bin/app ./cmd/server

FROM gcr.io/distroless/static-debian12

COPY --from=build /go/bin/app /
COPY --from=build /go/src/app/llm-context/ /llm-context/
COPY --from=build /go/src/app/docs/ /docs/

ENV PORT=8080
EXPOSE 8080
CMD ["/app"]
