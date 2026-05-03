document.addEventListener('DOMContentLoaded', function() {
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  
    // Calculate total price dynamically on booking form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
      const checkInInput = document.getElementById('checkIn');
      const checkOutInput = document.getElementById('checkOut');
      const roomsInput = document.getElementById('rooms');
      const pricePerNight = document.getElementById('pricePerNight').value;
      const totalPriceElement = document.getElementById('totalPrice');
  
      const updateTotalPrice = function() {
        if (checkInInput.value && checkOutInput.value && roomsInput.value) {
          const checkIn = new Date(checkInInput.value);
          const checkOut = new Date(checkOutInput.value);
          const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
          if (diffDays > 0) {
            const totalPrice = pricePerNight * diffDays * roomsInput.value;
            totalPriceElement.textContent = totalPrice.toFixed(2);
          }
        }
      };
  
      checkInInput.addEventListener('change', updateTotalPrice);
      checkOutInput.addEventListener('change', updateTotalPrice);
      roomsInput.addEventListener('change', updateTotalPrice);
    }
  });