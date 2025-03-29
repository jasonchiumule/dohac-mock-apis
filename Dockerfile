FROM oven/bun:latest AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
RUN bun run build

FROM golang:1.22 AS backend-build

WORKDIR /go/src/app
COPY . .
COPY --from=frontend-build /app/frontend/dist /go/src/app/cmd/server/spa

RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /go/bin/app ./cmd/server

FROM gcr.io/distroless/static-debian12

COPY --from=backend-build /go/bin/app /
COPY --from=backend-build /go/src/app/llm-context/ /llm-context/
COPY --from=backend-build /go/src/app/docs/ /docs/
COPY --from=backend-build /go/src/app/cmd/server/spa/ /cmd/server/spa/

ENV PORT=8080
EXPOSE 8080
CMD ["/app"]
