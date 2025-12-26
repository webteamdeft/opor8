
import express from 'react-dom/server'; // Note: In this environment we use esm.sh imports usually but standard node style is fine for server.ts
import expressApp from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import cluster from 'cluster';
import os from 'os';
import * as dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

// -----------------------------------------------------------------------------
// BLOCK 1: ENVIRONMENT & CONFIGURATION
// -----------------------------------------------------------------------------
// Load variables from your .env file into process.env
dotenv.config();

/**
 * GUIDE FOR YOUR .env FILE:
 * 
 * # AI Engine (Gemini)
 * API_KEY=YOUR_GEMINI_API_KEY_HERE
 * 
 * # Payment Gateway (Stripe)
 * STRIPE_SECRET_KEY=sk_test_...
 * 
 * # Email Service (SMTP)
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * 
 * # Security
 * JWT_SECRET=your-random-long-secret-key
 * PORT=3001
 */

const CONFIG = {
  port: process.env.PORT || 3001,
  // The Google GenAI SDK strictly requires this to be process.env.API_KEY
  aiKey: process.env.API_KEY,
  
  // PLACEHOLDER: Payment Secret Key (Stripe/PayPal)
  stripeKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  
  // PLACEHOLDER: JWT Secret for secure user sessions
  jwtSecret: process.env.JWT_SECRET || 'OPOR8_SECURE_PROTO_V1',
  
  // PLACEHOLDER: SMTP Configuration for Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
};

// -----------------------------------------------------------------------------
// BLOCK 2: CLUSTERING (High Concurrency Management)
// -----------------------------------------------------------------------------
/**
 * Master Process: Monitors the system and forks workers for each CPU core.
 * This allows your app to handle thousands of requests simultaneously.
 */
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`[OPOR8 MASTER] System check passed. Orchestrating ${numCPUs} CPU cores...`);

  // Create one worker per CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker crashes, the master automatically respawns it
  cluster.on('exit', (worker) => {
    console.warn(`[OPOR8 MASTER] Worker ${worker.process.pid} failed. Rebooting instance...`);
    cluster.fork();
  });
} else {
  // ---------------------------------------------------------------------------
  // BLOCK 3: WORKER PROCESS (The actual Server)
  // ---------------------------------------------------------------------------
  const app = expressApp();

  // --- MIDDLEWARE: Production Security & Optimization ---
  app.use(helmet());            // Protects against common web vulnerabilities
  app.use(compression());       // Compresses responses for faster loading
  app.use(cors());              // Allows your frontend to talk to this backend
  app.use(morgan('combined'));  // Standard industry logging
  app.use(bodyParser.json({ limit: '50mb' })); // Handles large SOP payloads

  // --- RATE LIMITING: Prevent abuse & protect AI costs ---
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // Limit each IP to 100 requests per window
    message: { error: 'Maximum procedural synthesis requests reached. Please wait.' }
  });
  app.use('/api/', globalLimiter);

  // --- SERVICE INITIALIZERS ---
  
  /**
   * 1. GOOGLE AI ENGINE
   * Initializing the Gemini 3 Pro/Flash engine.
   * This uses your API_KEY from .env
   */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  /**
   * 2. PAYMENT SERVICE (Stripe)
   * UNCOMMENT BELOW once you have your Stripe key ready.
   */
  // const stripe = require('stripe')(CONFIG.stripeKey);

  /**
   * 3. EMAIL SERVICE (Nodemailer)
   * UNCOMMENT BELOW once you have your SMTP credentials ready.
   */
  // const nodemailer = require('nodemailer');
  // const mailer = nodemailer.createTransport({
  //   host: CONFIG.smtp.host,
  //   port: CONFIG.smtp.port,
  //   secure: false, // true for 465, false for other ports
  //   auth: { 
  //     user: CONFIG.smtp.user, 
  //     pass: CONFIG.smtp.pass 
  //   }
  // });

  // ---------------------------------------------------------------------------
  // BLOCK 4: API ENDPOINTS (The Logic)
  // ---------------------------------------------------------------------------

  /**
   * [AUTH] Send Magic Link / Email Verification
   * @placeholder Add your database lookup and email sending here
   */
  app.post('/api/auth/magic-link', async (req, res) => {
    const { email } = req.body;
    try {
      console.log(`[Auth] Attempting login for: ${email}`);
      
      // STEP 1: Check if user exists in your database (e.g. MongoDB/Postgres)
      // STEP 2: Generate a secure JWT token
      // STEP 3: Send the email using the 'mailer' transport initialized above
      
      res.json({ success: true, message: 'Encryption key sent to email.' });
    } catch (err) {
      res.status(500).json({ error: 'Auth subsystem error.' });
    }
  });

  /**
   * [BILLING] Create Payment Session
   * @placeholder Integrate Stripe Checkout or PayPal here
   */
  app.post('/api/billing/checkout', async (req, res) => {
    try {
      /**
       * EXAMPLE STRIPE INTEGRATION:
       * const session = await stripe.checkout.sessions.create({
       *   payment_method_types: ['card'],
       *   line_items: [{ price: 'price_id_from_stripe', quantity: 1 }],
       *   mode: 'payment',
       *   success_url: 'http://localhost:3000/success',
       *   cancel_url: 'http://localhost:3000/cancel',
       * });
       * res.json({ url: session.url });
       */
      res.json({ url: '#' });
    } catch (err) {
      res.status(500).json({ error: 'Payment gateway offline.' });
    }
  });

  /**
   * [AI] SOP Title Generator
   * Uses Gemini to suggest professional SOP names for selected departments.
   */
  app.post('/api/sop-titles', async (req, res) => {
    const { departments } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Optimized for speed & JSON tasks
        contents: `Generate a JSON array of 5 unique, enterprise-grade SOP titles for these departments: ${departments.join(", ")}. Each object should have keys: "title" and "department".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                department: { type: Type.STRING }
              },
              required: ["title", "department"]
            }
          }
        }
      });
      // Correct usage: .text is a property, not a function
      res.json(JSON.parse(response.text || '[]'));
    } catch (err) {
      console.error("[AI Error]", err);
      res.status(500).json({ error: 'Synthesis engine failed to generate titles.' });
    }
  });

  /**
   * [AI] Deep Document Synthesis
   * Generates the actual Markdown content for the SOP.
   */
  app.post('/api/generate-sop', async (req, res) => {
    const { profile, answers, docTitle, department } = req.body;

    try {
      const prompt = `
        Create a high-fidelity, industrial-standard Standard Operating Procedure (SOP).
        BUSINESS PROFILE: ${profile.name} in the ${profile.industry} sector.
        DEPARTMENT: ${department}
        DOCUMENT TITLE: ${docTitle}
        STYLE GUIDE: ${profile.tone} tone.
        CONTEXTUAL DETAILS: ${answers.specifics || 'Standard industry best practices.'}
        TECH STACK: Uses ${answers.tools?.join(", ") || 'General office software'}.
        COMPLIANCE: Must adhere to ${answers.compliance?.join(", ") || 'General business laws'}.

        Structure the document with:
        1. Purpose
        2. Scope
        3. Definitions
        4. Responsibilities
        5. Detailed Step-by-Step Procedure
        6. Review Cycle: ${answers.cycle}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          thinkingConfig: { thinkingBudget: 0 } // No reasoning budget needed for standard SOP tasks
        }
      });
      
      // Correct usage: .text is a property
      res.json({ content: response.text });
    } catch (err) {
      console.error("[AI Generation Error]", err);
      res.status(503).json({ error: 'AI processing failed. Synthesis engine is overloaded.' });
    }
  });

  // --- HEALTH CHECK ---
  app.get('/health', (req, res) => res.status(200).send('OPOR8_ACTIVE'));

  // --- SERVER START ---
  app.listen(CONFIG.port, () => {
    console.log(`[Worker ${(process as any).pid}] Operational on Port ${CONFIG.port}`);
  });
}
