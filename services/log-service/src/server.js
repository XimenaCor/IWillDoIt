const http = require("http");

const PORT = process.env.PORT || 4000;

function readBody(req) {
    return new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => resolve(body));
    });
}

const server = http.createServer(async (req, res) => {
    // Healthcheck endpoint for Docker Compose / CI
    if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "content-type": "text/plain" });
        return res.end("ok");
    }

    // Ingest logs from the API (simple for Hito 4)
    if (req.method === "POST" && req.url === "/logs") {
        const body = await readBody(req);
        console.log("LOG_EVENT", body);

        res.writeHead(201, { "content-type": "application/json" });
        return res.end(JSON.stringify({ status: "created" }));
    }

    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
});

server.listen(PORT, () => {
    console.log(`log-service listening on ${PORT}`);
});
