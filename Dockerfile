FROM oven/bun:latest AS frontend-build

WORKDIR /app/frontend2
COPY frontend2/package.json frontend2/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend2/ ./
RUN bun run build

FROM golang:1.22 AS backend-build

WORKDIR /go/src/app
COPY . .
COPY --from=frontend-build /app/frontend2/dist /go/src/app/cmd/server/spa

RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /go/bin/app ./cmd/server

FROM gcr.io/distroless/static-debian12

COPY --from=backend-build /go/bin/app /

ENV PORT=8080
EXPOSE 8080
CMD ["/app"]
