document.addEventListener('DOMContentLoaded', () => {
  // ========== ORDER FORM LOGIC ==========
  const orderItemCards = document.querySelectorAll('.order-item-card');
  const totalPriceDisplay = document.getElementById('total-price');
  const totalHiddenInput = document.getElementById('total-hidden');
  const orderForm = document.getElementById('orderForm');

  function updateTotal() {
    let newTotal = 0;
    orderItemCards.forEach(card => {
      const quantity = parseInt(card.querySelector('.quantity').textContent);
      const price = parseFloat(card.getAttribute('data-price'));
      newTotal += quantity * price;
    });
    totalPriceDisplay.textContent = newTotal.toFixed(2);
    totalHiddenInput.value = newTotal.toFixed(2);
  }

  if (orderItemCards.length > 0) {
    orderItemCards.forEach(card => {
      const minusBtn = card.querySelector('.minus-btn');
      const plusBtn = card.querySelector('.plus-btn');
      const quantitySpan = card.querySelector('.quantity');
      const hiddenInput = card.querySelector('.hidden-input');

      minusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 0) {
          quantity--;
          quantitySpan.textContent = quantity;
          hiddenInput.value = quantity;
          updateTotal();
        }
      });

      plusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        quantity++;
        quantitySpan.textContent = quantity;
        hiddenInput.value = quantity;
        updateTotal();
      });
    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      orderItemCards.forEach(card => {
        const itemName = card.querySelector('h3').textContent.trim(); 
        const quantity = card.querySelector('.quantity').textContent;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${itemName} Quantity`;
        input.value = quantity;

        const existing = orderForm.querySelector(`input[name="${itemName} Quantity"]`);
        if (existing) orderForm.removeChild(existing);

        orderForm.appendChild(input);
      });

      const formData = new FormData(orderForm);

      fetch(orderForm.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          document.getElementById("form-message").style.display = "block";
          orderForm.reset();
          orderItemCards.forEach(card => {
            card.querySelector('.quantity').textContent = '0';
            card.querySelector('.hidden-input').value = '0';
          });
          updateTotal();
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch(() => {
        alert("Error! Please check your connection.");
      });
    });
  }

  // ========== FEEDBACK FORM LOGIC ==========
  // FEEDBACK FORM LOGIC
  const feedbackForm = document.querySelector('.feedback-form');
  const messageBox = document.getElementById("form-message");

  if (feedbackForm && messageBox) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(feedbackForm);

      fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          messageBox.style.display = "block";
          feedbackForm.reset();
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch(() => {
        alert("Error! Please check your connection.");
      });
    });
  }
});