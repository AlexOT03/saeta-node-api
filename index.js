import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fs from "fs";
import cors from "cors"; // Importa la biblioteca CORS
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use(
  cors({
    origin: "*", // Permitir cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const withData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/routes", (req, res) => {
  const data = readData();
  res.send(data.routes);
});

app.get("/api/route/:id", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.id)
  );
  res.send(route);
});

app.get("/api/route/:routeId/goings", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");
  res.send(route.Going);
});

app.get("/api/route/:routeId/going/:goingId", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const going = route.Going.find(
    (going) => going.id === parseInt(req.params.goingId)
  );
  if (!going) return res.status(404).send("Going not found");

  res.send(going);
});

app.get("/api/route/:routeId/going/:goingId/stops", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const going = route.Going.find(
    (going) => going.id === parseInt(req.params.goingId)
  );
  if (!going) return res.status(404).send("Going not found");

  res.send(going.stops);
});

app.get("/api/route/:routeId/going/:goingId/stop/:stopId", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const going = route.Going.find(
    (going) => going.id === parseInt(req.params.goingId)
  );
  if (!going) return res.status(404).send("Going not found");

  const stop = going.stops.find(
    (stop) => stop.id === parseInt(req.params.stopId)
  );
  if (!stop) return res.status(404).send("Stop not found");

  res.send(stop);
});

app.get("/api/route/:routeId/returns", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");
  res.send(route.Return);
});

app.get("/api/route/:routeId/return/:returnId", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const returnRoute = route.Return.find(
    (returnRoute) => returnRoute.id === parseInt(req.params.returnId)
  );
  if (!returnRoute) return res.status(404).send("Return route not found");

  res.send(returnRoute);
});

app.get("/api/route/:routeId/return/:returnId/stops", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const returnRoute = route.Return.find(
    (returnRoute) => returnRoute.id === parseInt(req.params.returnId)
  );
  if (!returnRoute) return res.status(404).send("Return route not found");

  res.send(returnRoute.stops);
});

app.get("/api/route/:routeId/return/:returnId/stop/:stopId", (req, res) => {
  const data = readData();
  const route = data.routes.find(
    (route) => route.id === parseInt(req.params.routeId)
  );
  if (!route) return res.status(404).send("Route not found");

  const returnRoute = route.Return.find(
    (returnRoute) => returnRoute.id === parseInt(req.params.returnId)
  );
  if (!returnRoute) return res.status(404).send("Return route not found");

  const stop = returnRoute.stops.find(
    (stop) => stop.id === parseInt(req.params.stopId)
  );
  if (!stop) return res.status(404).send("Stop not found");

  res.send(stop);
});

app.get("/api/comments/routes/:routeId", (req, res) => {
  const data = readData();
  const allRouteComments = data.comments.flatMap(
    (comment) => comment.routes || []
  );
  const filteredComments = allRouteComments.filter(
    (comment) => comment.route_id === parseInt(req.params.routeId)
  );

  if (!filteredComments)
    return res.status(404).send("Route comments not found");

  res.send(filteredComments);
});

app.get("/api/comments/places/:placeId", (req, res) => {
  const data = readData();
  const allRouteComments = data.comments.flatMap(
    (comment) => comment.places || []
  );
  const filteredComments = allRouteComments.filter(
    (comment) => comment.place_id === parseInt(req.params.placeId)
  );

  if (!filteredComments)
    return res.status(404).send("Place comments not found");

  res.send(filteredComments);
});

// POST para rutas
app.post("/api/comments/routes", (req, res) => {
  const data = readData();
  const newComment = req.body;

  if (!newComment.route_id || !newComment.message || !newComment.user_name) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  if (!data.comments[0].routes) {
    data.comments[0].routes = [];
  }

  const commentWithId = {
    id: data.comments[0].routes.length + 1, // Generar un ID
    ...newComment,
  };
  data.comments[0].routes.push(commentWithId);

  withData(data);
  res.json(commentWithId);
});

// POST para lugares
app.post("/api/comments/places", (req, res) => {
  const data = readData();
  const newComment = req.body;

  if (!newComment.place_id || !newComment.message || !newComment.user_name) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  if (!data.comments[0].places) {
    data.comments[0].places = [];
  }

  const commentWithId = {
    id: data.comments[0].places.length + 1,
    ...newComment,
  };
  data.comments[0].places.push(commentWithId);

  withData(data);
  res.json(commentWithId);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
