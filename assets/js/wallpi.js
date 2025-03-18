(function ($) {
  "use strict";

  $(window).on("resize", function () {
    wallpi_stretch();
  });

  // FAQ js 
  if($('.section-faq-item').length) {
    $('.section-faq-title').each(function(index){
      let selfTitle = $(this);
      let selfParent =  selfTitle.parent();
      $(selfTitle).on("click",function(){
        if(!$(selfParent).hasClass('active')) {
          $(selfParent).siblings().removeClass('active');
          $(selfParent).addClass('active');
          $(selfParent).siblings().find('.section-faq-content').slideUp(300);
          $(selfParent).find('.section-faq-content').slideDown(300);
        }else {
          $(selfParent).removeClass('active');
          $(selfParent).find('.section-faq-content').slideUp(300);
        }
      });
      if (index === 0) {
        $(selfParent).find('.section-faq-content').slideDown(300);
        $(selfParent).addClass('active');
      }
    });
  }

  // Set background color of each color-box using data-color attribute
  $(".color-box").each(function () {
    var color = $(this).data("color");
    $(this).css("background-color", color);
});

// Load saved color from localStorage
var savedColor = localStorage.getItem("primaryColor");
if (savedColor) {
    setPrimaryColor(savedColor);
}

// Click event for color selection
$(".color-box").on("click", function () {
    var selectedColor = $(this).data("color"); // Get the color from data-color
    setPrimaryColor(selectedColor);
    localStorage.setItem("primaryColor", selectedColor);
});

function setPrimaryColor(color) {
    // Set the primary color to the root and apply it to the body
    document.documentElement.style.setProperty("--bs-body-color", color);
    // $("body").css("background-color", color);
}



// Load saved font size percentage from localStorage if available
var savedFontSize = localStorage.getItem("fontSizePercentage");
if (savedFontSize) {
    $("html").css("font-size", savedFontSize + "%");
    $("#fontSizeInput").val(savedFontSize); // Update input field
}

// Function to get the current font-size percentage
function getCurrentFontSize() {
    return parseFloat($('html').css('font-size')) / 16 * 100; // Convert px to percentage
}

// Increase font size by 10%
$("#increaseFont").click(function () {
    var currentSize = getCurrentFontSize();
    var newSize = currentSize * 1.1; // Increase by 10%
    $("html").css("font-size", newSize + "%");
    $("#fontSizeInput").val(newSize); // Update input field
    localStorage.setItem("fontSizePercentage", newSize); // Save to localStorage
});

// Decrease font size by 10%
$("#decreaseFont").click(function () {
    var currentSize = getCurrentFontSize();
    var newSize = currentSize / 1.1; // Decrease by 10%
    $("html").css("font-size", newSize + "%");
    $("#fontSizeInput").val(newSize); // Update input field
    localStorage.setItem("fontSizePercentage", newSize); // Save to localStorage
});

// Update font size directly from the input field
$("#fontSizeInput").on("input", function () {
    var newSize = parseInt($(this).val());
    if (!isNaN(newSize) && newSize >= 50 && newSize <= 200) {
        $("html").css("font-size", newSize + "%");
        localStorage.setItem("fontSizePercentage", newSize); // Save to localStorage
    }
});
})(jQuery);

document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  // swiper slider js
  function swiperSlider() {
    const swiperItems = document.querySelectorAll(".atoley-swiper-slider");
    swiperItems.forEach(function (swiperElm) {
      if (!swiperElm.dataset.swiperInitialized) {
        const swiperOptions = JSON.parse(swiperElm.dataset.swiperOptions);
        // Add additional callbacks here
        swiperOptions.on = {
          slideChange: function () {
            // updateClasses(this);
          }
        };
        let SwiperSlider = new Swiper(swiperElm, swiperOptions);
        swiperElm.dataset.swiperInitialized = true;
      }
    });
  }
  swiperSlider();

  // =============  Dynamic Year =====
  if ($('.dynamic-year').length > 0) {
    const yearElement = document.querySelector('.dynamic-year');
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = currentYear;
  }
});
