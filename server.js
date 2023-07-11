import express from "express";
const app = express();

import morgan from "morgan";
import cors from "cors";
app.use(cors());

import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

//db and authUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import gptRouter from "./routes/gptRoutes.js";
import brandEngagementRoutes from "./routes/brandEngagementRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import stripeInit from 'stripe';
//middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundModule from "./middleware/not-found.js";
import User from "./model/User.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
 // Webhook listener
  app.post('/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {

      let event;

      try {
        event = await stripe.webhooks.constructEvent(
          req.body,
          req.headers['stripe-signature'],
          process.env.STRIPE_WEBHOOK_SECRET
        );
        // Extract the object from the event.
        const dataObject = event.data.object;

        if (dataObject['billing_reason'] == 'subscription_create') {
          const subscription_id = dataObject['subscription']
          const payment_intent_id = dataObject['payment_intent']

          // Retrieve the payment intent used to pay the subscription
          const payment_intent = await stripe.paymentIntents.retrieve(
            payment_intent_id
          );

          await stripe.subscriptions.update(
            subscription_id,
            {
              default_payment_method: payment_intent.payment_method,
            },
          );

          await stripe.customers.update(
            payment_intent.customer,
            {
              invoice_settings: {
                default_payment_method: payment_intent.payment_method,
              },
            }
          );
        };

        switch (event.type) {
          case 'invoice.paid':
            /*
              Used to provision services after the trial has ended.
              The status of the invoice will show up as paid.
              Store the status in your database to reference
              when a user accesses your service to avoid hitting
              rate limits.
            */
            console.log("Payment invoice.paid"+`Invoice.paid: ${dataObject.status}`);
            break;
          case 'invoice.payment_succeeded':
            /*
              Insert payment succeeded into the database
              Allowed access to your service.
            */
              const customerId = dataObject.customer;
              console.log("customerId from WEBhook " + customerId)
              console.log(`payment_succeeded: ${dataObject.status}`);

            // Update user information
            await User.findOneAndUpdate(
              { customerId },
              { $inc: { availableTokens: 10 }, Plan: "basic" },
              { returnOriginal: false }
            );

            break;
          case 'invoice.payment_failed':
            /*
              If the payment fails or the customer does not have a
              valid payment method, an invoice.payment_failed event is sent,
              the subscription becomes past_due.
              Use this webhook to notify your user that their payment has
              failed and to retrieve new card details.
            */
            console.log(`invoice.payment_failed: ${dataObject.status}`);
            break;
          case 'customer.subscription.created':
            // Insert active into database and grant access to service
            console.log(`customer.subscription.created: ${dataObject.status}`);
            break;
          case 'customer.subscription.updated':
            // Insert active into database and grant access to service
            console.log(`customer.subscription.updated: ${dataObject.status}`);
          break;
          case 'customer.subscription.deleted':
            if (event.request != null) {
              /*
                handle a subscription cancelled by request
                from above.
              */
              console.log(`customer.subscription.deleted: ${dataObject.status}`);
            } else {
              /*
                handle subscription cancelled automatically based
                upon subscription settings.
              */
              console.log(`customer.subscription.deleted: ${dataObject.status}`);
            }
            break;
          default:
            // Unexpected event type
        }

        // Return a response to acknowledge receipt of the event
        res.sendStatus(200);

      } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  )
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome!" });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1",brandEngagementRoutes );
app.use("/api/v1",gptRouter );
app.use("/api/v1",checkoutRoutes );
app.use("/api/v1",stripeRouter );



app.use(notFoundModule);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server is listening on port ${port}...`));

const start = async () => {
  try {
    //The server will run if the connection succeeded
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
