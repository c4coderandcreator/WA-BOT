const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
let qrCodeData = "";

// Initialize the WhatsApp client
const client = new Client();

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  // Generate the QR code as a data URL
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    qrCodeData = url;
  });
});

// Helper function to generate the main menu message
const getMainMenuMessage = (isInitial = false) => {
  if (isInitial) {
    return `
      Hello! Welcome to Teckube. How can we assist you today? Please choose an option:
      1. About Us
      2. Our Services
      3. Products and Solutions
      4. Contact and Support
      5. Request a Callback
    `;
  } else {
    return `
      What else can we help you with? Please choose from the options below:
      1. About Us
      2. Our Services
      3. Products and Solutions
      4. Contact and Support
      5. Request a Callback

      If you can't see what you're looking for, just ask!
    `;
  }
};

// Main menu message when user sends a greeting
const greetings = ["hi", "hello", "hey", "hey there", "hiii", "heya"];

client.on("message_create", (message) => {
  const chatId = message.from;
  const messageBody = message.body.toLowerCase();

  if (greetings.includes(messageBody)) {
    client.sendMessage(chatId, getMainMenuMessage(true));
  }

  // Handling main menu options
  if (messageBody === "1" || messageBody === "about us") {
    const aboutUsMessage = `
      About Us:
      a. About Us: http://teckube.io/about
      b. Careers: http://teckube.io/careers
      c. Blog: http://teckube.io/blog
      d. Privacy Policy: http://teckube.io/privacy
      e. Terms of Use: http://teckube.io/terms

      ${getMainMenuMessage()}
    `;
    client.sendMessage(chatId, aboutUsMessage);
  }

  if (messageBody === "2" || messageBody === "our services") {
    const servicesMessage = `
      Our Services:
      a. Multi-Cloud: http://teckube.io/multiCloud
      b. DevOps: http://teckube.io/devops
      c. Kubernetes: http://teckube.io/kubernetes
      d. Red Hat OpenShift: http://teckube.io/redHatOpenshift
      e. Web App Development: http://teckube.io/webApp
      f. Mobile App Development: http://teckube.io/mobileApp
      g. UX/UI Design: http://teckube.io/uiux
      h. Cyber Security: http://teckube.io/cyberSecurity

      ${getMainMenuMessage()}
    `;
    client.sendMessage(chatId, servicesMessage);
  }

  if (messageBody === "3" || messageBody === "products and solutions") {
    const productsMessage = `
      Products and Solutions:
      a. Managed Services for Kubernetes: http://teckube.io/managedKubernetes
      b. Migrate to the Cloud: http://teckube.io/migrateToCloud
      c. Custom API Development Services: http://teckube.io/customApi

      ${getMainMenuMessage()}
    `;
    client.sendMessage(chatId, productsMessage);
  }

  if (messageBody === "4" || messageBody === "contact and support") {
    const contactMessage = `
      Contact and Support:
      - Email: info@teckube.io
      - Phone: +18338325823
      - Twitter: https://x.com/TecKube_
      - LinkedIn: https://www.linkedin.com/company/teckube/
      - Working Days: Monday to Friday
      - Timings: 9 AM to 5 PM EST

      ${getMainMenuMessage()}
    `;
    client.sendMessage(chatId, contactMessage);
  }

  if (
    messageBody === "5" ||
    messageBody === "request a callback" ||
    messageBody === "callback"
  ) {
    const callbackMessage = `
      Thank you for your interest in Teckube! Please provide your name and phone number, and we will get back to you during our working hours (Monday to Friday, 9 AM to 5 PM EST).

      ${getMainMenuMessage()}
    `;
    client.sendMessage(chatId, callbackMessage);
  }
});

client.initialize();

// Serve the QR code on the webpage
app.get("/", (req, res) => {
  const html = `
    <html>
    <head>
      <title>WhatsApp QR Code</title>
    </head>
    <body>
      <h1>Scan the QR Code with WhatsApp</h1>
      <img src="${qrCodeData}" alt="WhatsApp QR Code" />
    </body>
    </html>
  `;
  res.send(html);
});

// Serve the user manual on the /manual route
app.get("/manual", (req, res) => {
  const manual = `
    <html>
    <head>
      <title>Teckube WhatsApp Bot User Manual</title>
    </head>
    <body>
      <h1>Teckube WhatsApp Bot User Manual</h1>
      <h2>Overview</h2>
      <p>The Teckube WhatsApp Bot is designed to provide users with information about our company, services, products, and support options. Users can interact with the bot by sending specific keywords or phrases, and the bot will respond with relevant information or options.</p>

      <h2>How to Use the Bot</h2>
      <h3>Initial Greeting</h3>
      <p>When users first message the bot, they can greet it using various phrases such as "hi", "hello", "hey", "hey there", "hiii", or "heya". The bot will respond with a polite greeting and present an option list.</p>

      <h3>Main Menu</h3>
      <p>The main menu provides the following options:</p>
      <ol>
        <li><b>About Us</b></li>
        <li><b>Our Services</b></li>
        <li><b>Products and Solutions</b></li>
        <li><b>Contact and Support</b></li>
        <li><b>Request a Callback</b></li>
      </ol>
      <p>Users can reply with the corresponding number or the option name to receive more detailed information.</p>

      <h3>Detailed Interaction Flow</h3>

      <h4>About Us</h4>
      <p>When the user selects "1" or "About Us", the bot responds with links to:</p>
      <ul>
        <li>a. About Us: <a href="http://teckube.io/about">http://teckube.io/about</a></li>
        <li>b. Careers: <a href="http://teckube.io/careers">http://teckube.io/careers</a></li>
        <li>c. Blog: <a href="http://teckube.io/blog">http://teckube.io/blog</a></li>
        <li>d. Privacy Policy: <a href="http://teckube.io/privacy">http://teckube.io/privacy</a></li>
        <li>e. Terms of Use: <a href="http://teckube.io/terms">http://teckube.io/terms</a></li>
      </ul>
      <p>The main menu is also appended for further navigation.</p>

      <h4>Our Services</h4>
      <p>When the user selects "2" or "Our Services", the bot responds with a list of services:</p>
      <ul>
        <li>a. Multi-Cloud: <a href="http://teckube.io/multiCloud">http://teckube.io/multiCloud</a></li>
        <li>b. DevOps: <a href="http://teckube.io/devops">http://teckube.io/devops</a></li>
        <li>c. Kubernetes: <a href="http://teckube.io/kubernetes">http://teckube.io/kubernetes</a></li>
        <li>d. Red Hat OpenShift: <a href="http://teckube.io/redHatOpenshift">http://teckube.io/redHatOpenshift</a></li>
        <li>e. Web App Development: <a href="http://teckube.io/webApp">http://teckube.io/webApp</a></li>
        <li>f. Mobile App Development: <a href="http://teckube.io/mobileApp">http://teckube.io/mobileApp</a></li>
        <li>g. UX/UI Design: <a href="http://teckube.io/uiux">http://teckube.io/uiux</a></li>
        <li>h. Cyber Security: <a href="http://teckube.io/cyberSecurity">http://teckube.io/cyberSecurity</a></li>
      </ul>
      <p>The main menu is also appended for further navigation.</p>

      <h4>Products and Solutions</h4>
      <p>When the user selects "3" or "Products and Solutions", the bot responds with:</p>
      <ul>
        <li>a. Managed Services for Kubernetes: <a href="http://teckube.io/managedKubernetes">http://teckube.io/managedKubernetes</a></li>
        <li>b. Migrate to the Cloud: <a href="http://teckube.io/migrateToCloud">http://teckube.io/migrateToCloud</a></li>
        <li>c. Custom API Development Services: <a href="http://teckube.io/customApi">http://teckube.io/customApi</a></li>
      </ul>
      <p>The main menu is also appended for further navigation.</p>

      <h4>Contact and Support</h4>
      <p>When the user selects "4" or "Contact and Support", the bot responds with contact details and support options:</p>
      <ul>
        <li>Email: info@teckube.io</li>
        <li>Phone: +18338325823</li>
        <li>Twitter: <a href="https://x.com/TecKube_">https://x.com/TecKube_</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/company/teckube/">https://www.linkedin.com/company/teckube/</a></li>
        <li>Working Days: Monday to Friday</li>
        <li>Timings: 9 AM to 5 PM EST</li>
      </ul>
      <p>The main menu is also appended for further navigation.</p>

      <h4>Request a Callback</h4>
      <p>When the user selects "5" or "Request a Callback", the bot responds with:</p>
      <p>Thank you for your interest in Teckube! Please provide your name and phone number, and we will get back to you during our working hours (Monday to Friday, 9 AM to 5 PM EST).</p>
      <p>The main menu is also appended for further navigation.</p>
    </body>
    </html>
  `;
  res.send(manual);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
