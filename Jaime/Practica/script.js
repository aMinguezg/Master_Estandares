$(document).ready(function(){

    var FUNDING_SOURCES = [
        paypal.FUNDING.PAYPAL
    ];

    FUNDING_SOURCES.forEach(function (fundingSource) {

        // Initialize the buttons
        var button = paypal.Buttons({
            fundingSource: fundingSource,
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: document.getElementById("unidades").value * 35.99
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function (details) {
                    // This function shows a transaction success message to your buyer.
                    alert('Transaction completed by ' + details.payer.name.given_name);
                });
            }
        });

        // Check if the button is eligible
        if (button.isEligible()) {

            // Render the standalone button for that funding source
            button.render('#paypal-button-container');
        }
    });

    $("#precioUnidad").text("Va a comprar 1 unidad/es (35.99 euros/unidad) por 35.99 euros")

    $("#unidades").change(function() {
        var me = this;
        $("#precioUnidad").text(function(){
            return "Va a comprar " +$(me).val()+ " unidad/es (35.99 euros/unidad) por "+($(me).val()*35.99)+" euros";
        })
      });

    $(".miniatura").click(function(){
        $("#img0").attr("src",$(this).attr("src"));
    })
  
  });