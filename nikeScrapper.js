const { chromium, webkit, firefox } = require('playwright');
const stealth = require('puppeteer-extra-plugin-stealth');
const fs = require('node:fs');
const path = require('path');

// chromium.use(stealth());


(async () => {
 // Configuración de proxy
 const proxyServer = 'us.922s5.net:6300'; // Proxy con autenticación
 const proxyUsername = '23991357-zone-custom-sessid-K7VtNkMb';
 const proxyPassword = 'rUNzyYraLl';
 const extensionPath = path.join(__dirname, 'CapSolver.Browser.Extension');

 // Configurar navegador con proxy y otras medidas de protección

const browser = await chromium.launchPersistentContext('', {
 headless: false,
 proxy: { server: proxyServer, username: proxyUsername, password: proxyPassword },
 args: [
   `--disable-extensions-except=${extensionPath}`,
   `--load-extension=${extensionPath}`
 ]
});

 // const context = await browser.newContext({
 //     viewport: { width: 1280, height: 720 }, // Tamaño típico de pantalla
 //     // geolocation: { longitude: -122.4194, latitude: 37.7749 }, // Simular geolocalización
 //     locale: 'en-US', // Idioma del navegador
 //     userAgent: randomUserAgent.getRandom(), // Rotación de User-Agent
 // });

 const page = await browser.newPage();

 // Simular movimientos del ratón y desplazamiento
 await page.mouse.move(100, 100);
 await page.mouse.move(200, 300);


    // URL de la página de producto específico en Nike (asegúrate de pegar la URL del producto exacto que deseas)
    const productUrl = 'https://www.nike.com/launch/t/nocta-hot-step-2-black'; // Cambia esto a la URL del producto
     await page.goto(productUrl);
   

        const sizeToSelect = '10'; // Cambia a la talla que desees
    const isAvailable = await page.waitForSelector(`button[id=size_item_radio${sizeToSelect}]`); // Selector del botón para agregar al carrito

    if (isAvailable) {
        console.log('El producto está disponible. Seleccionando talla...');

        // Selecciona la talla que deseas (ajusta el selector dependiendo de la estructura del HTML)
        page.waitForTimeout(1000)
        
        await page.click(`button[id=size_item_radio${sizeToSelect}]`);
        
        // Espera un poco para asegurarse de que el botón de compra esté habilitado
        
        // Añadir al carrito
        await page.waitForTimeout(1000)
        await page.click('.buying-tools-cta-button'); // Botón de añadir al carrito
        console.log('Producto añadido al carrito con éxito.');
        await page.waitForTimeout(5000)

        // Opcional: Navegar al carrito para verificar que el producto fue añadido
        await page.waitForSelector('.cart-item'); // Verifica que haya un ítem en el carrito
        const itemInCart = await page.$('.cart-item');
        if (itemInCart) {
            console.log('El producto está en el carrito.');
        } else {
            console.log('El producto no se añadió correctamente.');
        }
    } else {
        console.log('El producto no está disponible.');
    }

 // Cierra el navegador
 await browser.close();

})();
