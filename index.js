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

// Middleware para habilitar CORS
app.use(
  cors({
    origin: "*", // Permitir cualquier origen (ajustar en producción)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  })
);

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.js");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const withData = (data) => {
  try {
    fs.withFileSync("./db.js", JSON.stringify(data));
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
