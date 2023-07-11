import stripeInit from 'stripe';
import User from '../model/User.js';

export async function checkoutController(req, res) {
  try {
    const { name, number, email, userId } = req.body;
    const { secretKey } = req.params;

    const stripe = stripeInit(secretKey);

    let customer;

    // Check if the customer exists
    // try {
    //   customer = await stripe.customers.retrieve(email, {
    //     expand: ['subscriptions'],
    //   });
    // } catch (error) {
    //   // If the customer doesn't exist, create a new customer
    //   customer = await stripe.customers.create({
    //     name: name,
    //     email: email,
    //     description: 'New Customer'
    //   });
    // }

 
  // Check if the customer exists
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if(customers.data.length>0){
    customer = customers.data[0]
    }else{
      customer = await stripe.customers.create({
        name: name,
        email: email,
        description: 'New Customer'
      });
    }
    console.log("Customers : "+JSON.stringify(customers.data))
    
    const lineItems = [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      },
    ];

  
    const protocol =
      process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
    const host = req.headers.host;

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'subscription',
      success_url: `https://64ad9357a3158a22fac9604c--celadon-frangipane-ac1979.netlify.app/success`,
    //   success_url: `${protocol}${host}/success`,
      cancel_url: `https://64ad9357a3158a22fac9604c--celadon-frangipane-ac1979.netlify.app/payment`,
      payment_method_types: ['card'],
      customer: customer.id,
      metadata: {
        sub: customer.id,
      },
    });

    //update based on customer id existing

    //  // Update user information
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: {  customerId: customer.id } },
      { returnOriginal: false }
    );
   

    console.log('user: ', customer.id);

    res.status(200).json({ session: checkoutSession, customer:customer });
  } catch (error) {
    console.error('Error in checkoutController:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}



