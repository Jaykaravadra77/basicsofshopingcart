// A reference to Stripe.js initialized with a fake API key.
// Sign in to see examples pre-filled with your key.
// var order = require('../../models/order');
var stripe = Stripe("pk_test_51JBXX2SFsk4nQIk5aoFUfL2FR1VoA2VbkgXo53lMr2SeyHBemi0xMpsuEKi4kH9pszp10yVu0rbBZVJLrBDseExE00fK84csu5");

// The items the customer wants to buy
var purchase = {
  items: [{ id: "xl-tshirt" }]
};

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;
fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
 
  body: JSON.stringify({
    _csrf:csrf,
    purchase
}),
  redirect:'follow',
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    
    var elements = stripe.elements();
 
    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);

    });
  });

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete(result.paymentIntent.id);
         
       
      }
    });
};
 
/* ------- UI helpers ------- */

// Shows a success message when the payment is complete
var orderComplete = function(paymentIntentId) {
  var name= document.getElementById("name").value;
  var address= document.getElementById("address").value;
  // console.log(address);
  var contact= document.getElementById("contact").value;
  // console.log(contact);
  var payment= paymentIntentId;
  // console.log(payment);
  fetch("/order-success", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
   
    body: JSON.stringify({
      _csrf:csrf,
       name:name,
       address:address,
       contact:contact,
       payment:payment,
  }),
    redirect:'follow',
  })
    
  
     
 

  loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
 
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
  swal("Good job!", "Your Order been Placed!", "success")
  .then((value) => {
    window.location.href ="/";
  });
 
// console.log(order);
};

// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

// console.log(User);
console.log("Client Is here");