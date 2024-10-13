const { chromium } = require('playwright');
const stealth = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const prompt = require('prompt-sync')();

// Activar el plugin de Stealth para evitar la detección
// chromium.use(stealth());

(async function job() {
  const log = console.log

  // Datos del cliente (para el formulario de compra)
  // const email = await prompt('Email:   ');
  // const name = await prompt('Name:  ');
  // const lastName = await prompt('Last Name:  ');
  // const address = await prompt('Address:  ');
  // const city = await prompt('city:  ');
  // const state = await prompt('state:  ');
  // const zipCode = await prompt('zip code:  ');
  // const phone = await prompt('phone number:  ');
  // const ccNumber = await prompt('Card Number:  ');
  // const cardHolder = await prompt('Card Holder:  ');
  // const exp = await prompt('Expiration:  ');
  // const cvv = await prompt('Cvv:  ');
  // const sizeToSelect = await prompt('Size to Select:  ');
  // const quantityToSelect = await prompt('Quantity to Select:  ');
  // const colorToSelect = await prompt('Color to select:  ');
  // Datos del cliente (para el formulario de compra)




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
  
  
  // URL del producto en Supreme (cambiar según el producto)
  const productUrl = 'https://us.supreme.com/products/bez7h40z_99qly9f';
  await page.goto(productUrl);
  
    // Simular movimientos del ratón y desplazamiento
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 300);
    await page.evaluate(() => window.scrollBy(0, 300)); // Desplazar la página

  // Verificar si el producto está disponible
  const isAvailable = await page.$('button[data-testid="add-to-cart-button"]');
  if (isAvailable) {
    log('El producto está disponible. Seleccionando talla...');

    // Selección de talla y color
    log('Tipo de Producto: ', '[S=Medias] [C=Cloth] [A=Accesorio]',)
    const typeOfProduct = await prompt('Seleccionar: ')
    if (typeOfProduct == 'S') {
      const quantityToSelect = prompt('Cantidad: ')
      const quantity = await page.$('select[aria-label="quantity"]');
      await quantity.selectOption({ label: quantityToSelect });

    } else if (typeOfProduct == 'C') {
      log('Size a Seleccionar: ')
      log('Large, Medium, Small')
      const sizeToSelect = prompt('Seleccionar: ')
      const size = await page.$('select[aria-label="size"]');
      await size.selectOption({ label: sizeToSelect });
      const colorToSelect = prompt('Codigo de color: ')
      await page.click(`button[data-testid="thumbnail-button-${colorToSelect}"]`);
    } else if (typeOfProduct == 'A') {
      log('Cantidad: ')
      const quantityToSelect = prompt('Cantidad: ')
      const quantity = await page.$('select[aria-label="quantity"]');
      await quantity.selectOption({ label: quantityToSelect });
    }

    // Añadir al carrito
    await page.click('button[data-testid="add-to-cart-button"]');
    console.log('Producto añadido al carrito con éxito.');

    // Navegar al carrito para verificar
    await page.waitForSelector('a[data-testid="mini-cart-checkout-link"]');
    await page.click('a[data-testid="mini-cart-checkout-link"]');
    await page.waitForSelector('button[id="checkout-pay-button"]');
    const itemInCart = await page.$('#checkout-pay-button');

    if (itemInCart) {
      console.log('El producto está en el carrito.');
      await page.mouse.move(100, 100);
      await page.mouse.move(200, 300);
      await page.evaluate(() => window.scrollBy(0, 300)); // Desplazar la página
      // Completar formulario de pago
      await page.waitForSelector('input[name="email"]');
      await page.fill('#email', email);
      await page.fill('#TextField0', name);
      await page.fill('#TextField1', lastName);
      await page.fill('#shipping-address1', address);
      await page.waitForTimeout(3000)
      await page.click('li[id="shipping-address1-option-0"]')
      await page.fill('#TextField2', '');
      await page.fill('#TextField3', city);
      await page.waitForTimeout(3000)
      const state1 = await page.$('select[name="zone"]');
      await state1.selectOption(state);
      await page.fill('#TextField4', zipCode);
      await page.waitForTimeout(3000)
      await page.fill('#TextField5', phone);

      // Manejar el iframe del pago
      await page.waitForSelector('iframe');
      const frames = page.frames();
      const paymentFrame = frames.find(frame => frame.url().includes('shopifycs.com'));
      await paymentFrame.fill('input[name="number"]', ccNumber);
      await paymentFrame.fill('input[name="expiry"]', exp);
      await paymentFrame.fill('input[name="verification_value"]', cvv);
      await paymentFrame.fill('input[name="name"]', cardHolder);

      await page.click('button[id="checkout-pay-button"]');

      // await page.waitForSelector('iframe[src*="hcaptcha.com"]', { state: 'visible' });
      // await page.waitForTimeout(3000);
      // await page.click('iframe[src*="hcaptcha.com"]');
      // console.log('captcha clickeado')
      await page.waitForTimeout(9000);

      await page.screenshot({ path: './checkout.png' });
    } else {
      console.log('El producto no se añadió correctamente.');
    }
  } else {
    console.log('El producto no está disponible.');
    await page.screenshot({ path: './SoldOut.png' });

    await page.waitForTimeout(9000)
    job()
  }

  // Cierra el navegador
  await browser.close();
})();
