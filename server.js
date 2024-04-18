import { createServer } from "http";

// Define the port number for the server
const PORT = 8080;

// Array to store user data
const userData = [];

// Create the HTTP server
const server = createServer((req, res) => {
  const { url, method } = req;

  // Route handling based on the request method and URL
  switch (method) {
    case "POST":
      if (url === "/user") {
        handleCreateUser(req, res);
      }
      break;
    case "GET":
      if (url === "/user") {
        handleGetUsers(req, res);
      }
      break;
    case "PATCH":
      if (url === "/user") {
        handleUpdateUser(req, res);
      }
      break;
    case "DELETE":
      if (url === "/user") {
        handleDeleteUser(req, res);
      }
      break;
    default:
      sendResponse(res, 404, { message: "Endpoint not found" });
  }
});

// Handle user creation requests
function handleCreateUser(req, res) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const { username, password } = JSON.parse(body);
    if (userData.some(e => e.username === username)) {
      sendResponse(res, 409, { message: "User already exists" });
    } else if (username && password) {
      userData.push({ username, password });
      sendResponse(res, 200, { message: "User created successfully" });
    } else {
      sendResponse(res, 400, { message: "Invalid username or password" });
    }
  });
}

// Handle requests to retrieve all users
function handleGetUsers(req, res) {
  sendResponse(res, 200, userData);
}

// Handle user update requests
function handleUpdateUser(req, res) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const { username, newUsername } = JSON.parse(body);
    const userIndex = userData.findIndex(e => e.username === username);
    if (userIndex !== -1) {
      userData[userIndex].username = newUsername;
      sendResponse(res, 200, { message: "Username updated successfully" });
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  });
}

// Handle user deletion requests
function handleDeleteUser(req, res) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const { username } = JSON.parse(body);
    const userIndex = userData.findIndex(e => e.username === username);
    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      sendResponse(res, 200, { message: "User deleted successfully" });
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  });
}

// Utility function to send a JSON response
function sendResponse(res, statusCode, content) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(content));
}

// Start the server on the specified port
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
