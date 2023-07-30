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
  const subscriptionId = req.params.subscriptionId;

  try {
    // Fetch the subscription from Stripe using the subscriptionId
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the subscription.' });
  }
};



const updateSubscription = async (req, res) => {
 
};


const cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;

  try {
    // Fetch the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Check if the subscription is active before attempting to cancel
    if (subscription.status === 'active') {
      // Cancel the subscription in Stripe
      await stripe.subscriptions.cancel(subscriptionId)

      res.status(200).json({ message: 'Subscription canceled successfully.' });
    } else {
      res.status(400).json({ error: 'Subscription is not active.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the subscription.' });
  }
};

const checkSubscriptionStatus = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    // Fetch the subscription from Stripe using the subscriptionId
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    let status;
    if (subscription.status === 'active') {
      status = subscription.cancel_at_period_end ? 'Scheduled for Cancellation' : 'Active and Will Be Renewed';
    } else if (subscription.status === 'canceled') {
      status = 'Canceled';
    } else {
      status = 'Unknown';
    }

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while checking the subscription status.' });
  }
};

//not working
const checkSubscriptionStatusByCustOmerID = async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch the customer from Stripe using the customerId
    const customer = await stripe.customers.retrieve(customerId);

    if (!customer || !customer.subscriptions || customer.subscriptions.data.length === 0) {
      return res.status(400).json({ error: 'No active subscriptions found for the customer.' });
    }

    const subscription = customer.subscriptions.data[0];

    let status;
    if (subscription.status === 'active') {
      status = subscription.cancel_at_period_end ? 'Scheduled for Cancellation' : 'Active and Will Be Renewed';
    } else if (subscription.status === 'canceled') {
      status = 'Canceled';
    } else {
      status = 'Unknown';
    }

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while checking the subscription status.' });
  }
};

const getSubscriptionsByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Fetch the customer from Stripe using the customerId
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions'],
    });

    // Check if the customer exists
    if (!customer || customer.deleted) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Check if the customer has any subscriptions
    if (!customer.subscriptions || customer.subscriptions.data.length === 0) {
      return res.status(400).json({ error: 'No subscriptions found for the customer.' });
    }

    const subscriptionIds = customer.subscriptions.data.map(sub => sub.id);

    res.json({ subscriptionIds });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the subscription IDs.' });
  }
};

const cancelSubscriptionByCustomerId = async (req,res) => {
  const { customerId } = req.params;

  try {
    // Fetch all active subscriptions for the customer from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      // No active subscriptions found for the customer
      return res.status(400).json({ error: 'No active subscriptions found for the customer.' });
    }

    // Cancel the first active subscription (You can modify the logic as needed)
    const subscriptionToCancel = subscriptions.data[0];
    await stripe.subscriptions.update(subscriptionToCancel.id, {
      cancel_at_period_end: true,
    });

    res.json({ message: 'Subscription canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the subscription.' });
  }
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
  

export {getSubscriptionsByCustomerId,cancelSubscriptionByCustomerId,checkSubscriptionStatusByCustOmerID,checkSubscriptionStatus,getSubscriptions,getInvoicePreview,getSubscriptionById,updateSubscription,cancelSubscription,hasSubscription };
