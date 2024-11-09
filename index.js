import express from 'express';
import fs from 'fs';

const app = express();

const readData = () => {
    try {
        const data = fs.readFileSync('./db.js');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const withData = (data) => {
    try {
        fs.withFileSync('./db.js', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};
 
app.get('/', (req, res) => {
    res.send('Hola mundo esto es mi primer proyecto en Node.js');
});

app.get('/api/routes', (req, res) => {
    const data = readData();
    res.send(data.routes);
});

app.get('/api/route/:id', (req, res) => {
    const data = readData();
    const route = data.routes.find(route => route.id === parseInt(req.params.id));
    res.send(route);
});

app.get('/api/route/:id/going', (req, res) => {
    const data = readData();
    const route = data.routes.find(route => route.id === parseInt(req.params.id));
    res.send(route.Going);
});

app.get('/api/route/:id/return', (req, res) => {
    const data = readData();
    const route = data.routes.find(route => route.id === parseInt(req.params.id));
    res.send(route.Return);
});

app.post('/api/route', (req, res) => {
    const data = readData();
    const body = req.body;
    const newRoute = {
        id: data.routes.length + 1,
        ...body
    }
    data.routes.push(newRoute);
    withData(data);
});

app.put('/api/route/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const routeIndex = data.routes.findIndex(route => route.id === id);
    data.routes[routeIndex] = {
        ...data.routes[routeIndex],
        ...body
    }
    withData(data);
    res.JSON({message: 'Route updated'});
});

app.delete('/api/route/:id', (req, res) => {	
    const data = readData();
    const id = parseInt(req.params.id);
    const routeIndex = data.routes.findIndex(route => route.id === id);
    data.routes.splice(routeIndex, 1);
    withData(data);
    res.JSON({message: 'Route deleted'});
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});