import stripeInit from 'stripe';

import dotenv from "dotenv";
dotenv.config(); 

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

const getSubscriptions = async (req, res) => {
    // const customerId = req.cookies['customer'];

    // const {customerId} = req.params;

    const subscriptions = await stripe.subscriptions.list({
    //   customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });
  
    res.json({subscriptions});
};

const getSubscriptionById = async (req, res) => {
    const subscriptionId = req.params.subscriptionId; // Assuming the subscription ID is passed as a route parameter
  
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      res.status(200).json(subscription);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the subscription.' });
    }
  };


const updateSubscription = async (req, res) => {
 
};


const cancelSubscription = async (req, res) => {
 
};


const getInvoicePreview = async (req, res) => {
 
};

const hasSubscription = async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1, // Limit to 1 subscription
      });
  
      const hasSubscription = subscriptions.data.length > 0;
      
      res.json({ hasSubscription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while checking the subscription.' });
    }
  };
  

export {getSubscriptions,getInvoicePreview,getSubscriptionById,updateSubscription,cancelSubscription,hasSubscription };
