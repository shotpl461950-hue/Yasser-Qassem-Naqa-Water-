/* ========================================= */
/*   مصنع مياه النقاء - ملف الجافاسكربت     */
/* ========================================= */

// ننتظر لما الصفحة تحمل
$(document).ready(function(){

  // 1. السلايدر
  var totalSlides = $('.carousel-slide').length;
  var currentSlide = 0;
  var autoPlayInterval;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    $('.carousel-track').css('transform', 'translateX(' + (currentSlide * 100) + '%)');
    $('.carousel-dot').each(function(i){
      $(this).toggleClass('active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  // تشغيل تلقائي كل 4 ثواني
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000);
  }
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // ازرار التنقل
  $('.carousel-arrow.prev').on('click', function(){
    stopAutoPlay(); prevSlide(); startAutoPlay();
  });
  $('.carousel-arrow.next').on('click', function(){
    stopAutoPlay(); nextSlide(); startAutoPlay();
  });

  // النقاط
  $('.carousel-dot').on('click', function(){
    stopAutoPlay();
    goToSlide($(this).index());
    startAutoPlay();
  });

  if (totalSlides > 0) startAutoPlay();

  // 2. زر العودة للاعلى
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) {
      $('.scroll-top').addClass('visible');
    } else {
      $('.scroll-top').removeClass('visible');
    }
  });

  $('.scroll-top').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // 3. تحديد الرابط النشط
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-links a, .nav-mobile a').each(function(){
    if ($(this).attr('href') === currentPage) {
      $(this).addClass('active');
    }
  });

  // 4. زر القائمة في الجوال
  $('#navToggle').on('click', function() {
    $('#navMobile').toggleClass('open');
    if ($('#navMobile').hasClass('open')) {
      $(this).text('✕');
    } else {
      $(this).text('☰');
    }
  });

  // اغلاق القائمة لما نضغط على رابط
  $('#navMobile a').on('click', function() {
    $('#navMobile').removeClass('open');
    $('#navToggle').text('☰');
  });

  // 5. التمرير السلس
  $('a[href^="#"]').on('click', function(e) {
    var target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 600);
    }
  });

  // 6. تأثير الظهور عند التمرير
  function animateOnScroll() {
    $('.feature-card, .product-card, .service-card, .vision-card, .offer-card').each(function(){
      var rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        $(this).addClass('fade-in-up');
      }
    });
  }
  animateOnScroll();
  $(window).on('scroll', animateOnScroll);

  // 7. زر إقرأ المزيد
  $('#loadMoreAbout').on('click', function(){
    $('#extraAboutText').toggleClass('d-none');
    if ($('#extraAboutText').hasClass('d-none')) {
      $(this).text('إقرأ المزيد');
    } else {
      $(this).text('إقرأ أقل');
    }
  });

  // 8. إشعارات Toast
  // عملتها عشان ما استخدم alert
  function showToast(message, type) {
    var toast = $('<div class="toast-notification ' + (type || 'success') + '"></div>').text(message);
    $('body').append(toast);
    
    setTimeout(function(){ toast.css({'opacity':'1','transform':'translateY(0)'}); }, 50);
    setTimeout(function(){
      toast.css({'opacity':'0','transform':'translateY(-20px)'});
      setTimeout(function(){ toast.remove(); }, 400);
    }, 3000);
  }

  // 9. التحقق من حقول النموذج
  function validateField(input) {
    var $input = $(input);
    var valid = true;
    var $error = $input.parent().find('.error-msg');
    
    if (input.required && !$.trim(input.value)) {
      valid = false;
    }
    
    if (input.type === 'email' && $.trim(input.value)) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailPattern.test($.trim(input.value));
    }
    
    if (input.pattern && $.trim(input.value)) {
      var regex = new RegExp(input.pattern);
      valid = regex.test($.trim(input.value));
    }
    
    if ($input.attr('minlength') && $.trim(input.value)) {
      valid = $.trim(input.value).length >= parseInt($input.attr('minlength'));
    }
    
    $input.toggleClass('invalid', !valid);
    $input.toggleClass('valid', valid);
    
    if ($error.length) {
      $error.toggle(!valid);
    }
    
    return valid;
  }

  // تحقق مباشر اثناء الكتابة
  $('.form-control').on('input', function(){
    validateField(this);
  }).on('blur', function(){
    if ($.trim(this.value)) validateField(this);
  });

  // 10. نموذج التواصل
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    var isValid = true;
    
    $(this).find('.form-control').each(function(){
      if (!validateField(this)) isValid = false;
    });
    
    if (isValid) {
      showToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
      this.reset();
      $(this).find('.form-control').removeClass('valid invalid');
      $(this).find('.error-msg').hide();
    } else {
      showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
    }
  });

  // 11. تبديل التبويبات (تسجيل دخول / إنشاء حساب)
  function switchAuthTab(tabName) {
    $('.auth-tab').removeClass('active');
    $('.auth-tab[data-tab="' + tabName + '"]').addClass('active');
    
    if (tabName === 'login') {
      $('#loginForm').removeClass('hidden');
      $('#registerForm').addClass('hidden');
    } else {
      $('#loginForm').addClass('hidden');
      $('#registerForm').removeClass('hidden');
    }
  }
  
  $('.auth-tab').on('click', function(){
    switchAuthTab($(this).data('tab'));
  });
  
  $('.switch-tab').on('click', function(e){
    e.preventDefault();
    switchAuthTab($(this).data('tab'));
  });

  // 12. نموذج تسجيل الدخول
  $('#loginFormEl').on('submit', function(e){
    e.preventDefault();
    var isValid = true;
    
    $(this).find('.form-control').each(function(){
      if (!validateField(this)) isValid = false;
    });
    
    if (isValid) {
      showToast('تم تسجيل الدخول بنجاح! مرحباً بك.', 'success');
      setTimeout(function(){ window.location.href = 'index.html'; }, 1500);
    }
  });

  // 13. إنشاء حساب + تطابق كلمة المرور
  $('#regConfirm').on('input', function(){
    if ($(this).val() !== $('#regPassword').val()) {
      $(this).addClass('invalid').removeClass('valid');
      $(this).parent().find('.error-msg').text('كلمتا المرور غير متطابقتين').show();
    } else {
      $(this).removeClass('invalid').addClass('valid');
      $(this).parent().find('.error-msg').hide();
    }
  });
  
  // كمان لما كلمة المرور تتغير
  $('#regPassword').on('input', function(){
    var confirm = $('#regConfirm').val();
    if (confirm && confirm !== $(this).val()) {
      $('#regConfirm').addClass('invalid').removeClass('valid');
      $('#regConfirm').parent().find('.error-msg').text('كلمتا المرور غير متطابقتين').show();
    }
  });
  
  $('#registerFormEl').on('submit', function(e){
    e.preventDefault();
    var isValid = true;
    
    $(this).find('.form-control').each(function(){
      if (!validateField(this)) isValid = false;
    });
    
    // تطابق كلمة المرور
    if ($('#regPassword').val() !== $('#regConfirm').val()) {
      isValid = false;
      $('#regConfirm').addClass('invalid');
      $('#regConfirm').parent().find('.error-msg').text('كلمتا المرور غير متطابقتين').show();
    }
    
    // الموافقة على الشروط
    if (!$('#regTerms').is(':checked')) {
      isValid = false;
      showToast('يجب الموافقة على الشروط والأحكام', 'error');
    }
    
    if (isValid) {
      showToast('تم إنشاء حسابك بنجاح! مرحباً بك.', 'success');
      setTimeout(function(){ window.location.href = 'index.html'; }, 1500);
    }
  });

  // 14. المودال مع AJAX
  // هذا الجزء يستخدم $.ajax عشان يجيب البيانات من ملف JSON
  function openModal() {
    $('#modalOverlay').addClass('show');
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {
    $('#modalOverlay').removeClass('show');
    $('body').css('overflow', '');
  }

  $('#closeModal').on('click', closeModal);
  $('#modalOverlay').on('click', function(e){
    if (e.target === this) closeModal();
  });

  // اغلاق بالكيبورد
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeOrderModal();
    }
  });

  // فتح مودال تفاصيل المنتج عبر AJAX
  $('.open-modal-btn').on('click', function(){
    var productId = $(this).data('id');
    
    $('#modalTitle').text('جاري التحميل...');
    $('#modalBody').html('<p style="text-align:center;padding:2rem">جاري تحميل البيانات...</p>');
    openModal();
    
    // هنا استخدمت ajax عشان اجيب البيانات من ملف json محلي
    $.ajax({
      url: 'modal-data.json',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        if (data[productId]) {
          var product = data[productId];
          $('#modalTitle').text(product.title);
          $('#modalBody').html(
            '<p style="margin-bottom:1rem;line-height:1.9">' + product.details + '</p>' +
            '<div class="detail-row"><span class="detail-label">السعر</span><span class="detail-value">' + product.price + '</span></div>'
          );
        } else {
          $('#modalTitle').text('تفاصيل المنتج');
          $('#modalBody').html('<p style="text-align:center;padding:2rem;color:#6c757d">لا توجد بيانات لهذا المنتج</p>');
        }
      },
      error: function() {
        $('#modalTitle').text('تفاصيل المنتج');
        $('#modalBody').html('<p style="text-align:center;padding:2rem;color:#dc3545">تعذر تحميل البيانات حالياً</p>');
      }
    });
  });

  // 15. مودال الطلب
  function openOrderModal() {
    $('#orderModalOverlay').addClass('show');
    $('body').css('overflow', 'hidden');
  }

  function closeOrderModal() {
    $('#orderModalOverlay').removeClass('show');
    $('body').css('overflow', '');
  }

  $('#closeOrderModal').on('click', closeOrderModal);
  $('#orderModalOverlay').on('click', function(e){
    if (e.target === this) closeOrderModal();
  });

  $('.btn-order-now').on('click', function(){
    $('#orderProductName').text($(this).data('product-name'));
    openOrderModal();
  });

  $('#orderForm').on('submit', function(e){
    e.preventDefault();
    var isValid = true;
    
    $(this).find('.form-control').each(function(){
      if (!validateField(this)) isValid = false;
    });
    
    if (isValid) {
      showToast('تم إرسال طلبك بنجاح! سنتواصل معك لتأكيد الطلب.', 'success');
      closeOrderModal();
      this.reset();
      $(this).find('.form-control').removeClass('valid invalid');
      $(this).find('.error-msg').hide();
    }
  });

}); // نهاية document.ready
