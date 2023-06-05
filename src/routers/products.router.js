import express from 'express';
import fs from 'fs';

const productsRouter = express.Router();

// Ruta raíz GET /api/products/
productsRouter.get('/', (req, res) => {
    // Leer los productos desde el archivo "productos.json"
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
    res.json(products);
});

// Ruta GET /api/products/:pid
productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params;
    // Leer los productos desde el archivo "productos.json"
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
    // Buscar el producto por el id
    const product = products.find((p) => p.id === pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Ruta POST /api/products/
productsRouter.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    // Leer los productos desde el archivo "productos.json"
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
    // Generar un nuevo id para el producto
    const newId = generateNewProductId(products);
    // Crear el nuevo producto
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
    };
    // Agregar el nuevo producto al array de productos
    products.push(newProduct);
    // Guardar los productos actualizados en el archivo "productos.json"
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    // Leer los productos desde el archivo "productos.json"
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
    // Buscar el producto por el id
    const product = products.find((p) => p.id === pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Actualizar los campos del producto
    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.stock = stock;
    product.category = category;
    product.thumbnails = thumbnails;
    // Guardar los productos actualizados en el archivo "productos.json"
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(product);
});

// Ruta DELETE /api/products/:pid
productsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    // Leer los productos desde el archivo "productos.json"
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
    // Buscar el índice del producto por el id
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Eliminar el producto del array de productos
    const deletedProduct = products.splice(productIndex, 1)[0];
    // Guardar los productos actualizados en el archivo "productos.json"
    fs.writeFileSync('productos.json', JSON.stringify(products));
    res.json(deletedProduct);
});

// Función para generar un nuevo id para el producto
function generateNewProductId(products) {
    // Obtener los ids de los productos existentes
    const existingIds = products.map((p) => p.id);
    let newId;
    do {
        // Generar un nuevo id aleatorio
        newId = Math.floor(Math.random() * 1000).toString();
    } while (existingIds.includes(newId));
    return newId;
}

export default productsRouter;
