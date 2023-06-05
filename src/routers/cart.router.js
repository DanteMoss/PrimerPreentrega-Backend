import express from 'express'
import fs from 'fs'

const app = express()


// Rutas para carritos
const cartsRouter = express.Router();

// Ruta POST /api/carts/
cartsRouter.post('/', (req, res) => {
    // Generar un ID único para el nuevo carrito
    const id = Date.now().toString();

    const newCart = {
        id,
        products: [],
    };

    // Guardar el nuevo carrito en el archivo "carrito.json"
    fs.writeFileSync('carrito.json', JSON.stringify(newCart));

    res.json(newCart);
});

// Ruta GET /api/carts/:cid
cartsRouter.get('/:cid', (req, res) => {
    const cid = req.params.cid;

    // Leer el carrito desde el archivo "carrito.json"
    const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));

    if (cart.id === cid) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    // Leer el carrito desde el archivo "carrito.json"
    const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));

    if (cart.id === cid) {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find((p) => p.product === pid);

        if (existingProduct) {
            // Si el producto ya existe, incrementar la cantidad
            existingProduct.quantity++;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        // Guardar el carrito actualizado en el archivo "carrito.json"
        fs.writeFileSync('carrito.json', JSON.stringify(cart));

        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

app.use('/api/carts', cartsRouter);

export default cartsRouter;