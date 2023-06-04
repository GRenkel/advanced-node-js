const http = require("http");
const fs = require("fs/promises");

const PORT = 8000

const server = http.createServer(async (request, response) => {
    const contentBuffer = await fs.readFile(__dirname + "/command.txt")
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain")
    response.end(contentBuffer.toString("utf-8"));
})

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})