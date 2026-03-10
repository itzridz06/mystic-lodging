// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
const taxSwitch = document.querySelector("#taxSwitch");

if (taxSwitch) {
  taxSwitch.addEventListener("change", () => {

    const prices = document.querySelectorAll(".price");

    prices.forEach(priceTag => {

      const basePrice = parseFloat(priceTag.dataset.price);

      if (taxSwitch.checked) {
        const totalPrice = basePrice + basePrice * 0.18;
        priceTag.innerText = "₹" + totalPrice.toLocaleString("en-IN");
      } else {
        priceTag.innerText = "₹" + basePrice.toLocaleString("en-IN");
      }

    });

  });
}