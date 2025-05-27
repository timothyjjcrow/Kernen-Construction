document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  const header = document.querySelector("header");
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileDropdownToggles = document.querySelectorAll(
    ".mobile-dropdown-toggle"
  );
  const mobileMenuLinks = document.querySelectorAll(
    ".mobile-menu a:not(.mobile-dropdown > a)"
  );
  const slideshow = document.querySelector(".slideshow");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dots = document.querySelectorAll(".dot");
  const fadeElements = document.querySelectorAll(".fade-in");
  let lastScrollTop = 0;

  // Header scroll effect
  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
      // Scrolling down
      header.classList.add("header-hidden");
    } else {
      // Scrolling up
      header.classList.remove("header-hidden");
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });

  // Mobile menu toggle
  mobileMenuIcon.addEventListener("click", function () {
    this.classList.toggle("active");
    mobileMenu.classList.toggle("active");

    if (this.classList.contains("active")) {
      this.querySelector("span:nth-child(1)").style.transform =
        "rotate(45deg) translate(5px, 5px)";
      this.querySelector("span:nth-child(2)").style.opacity = "0";
      this.querySelector("span:nth-child(2)").style.transform = "scaleX(0)";
      this.querySelector("span:nth-child(3)").style.transform =
        "rotate(-45deg) translate(7px, -6px)";
    } else {
      this.querySelector("span:nth-child(1)").style.transform = "none";
      this.querySelector("span:nth-child(2)").style.opacity = "1";
      this.querySelector("span:nth-child(2)").style.transform = "scaleX(1)";
      this.querySelector("span:nth-child(3)").style.transform = "none";
    }
  });

  // Mobile dropdown toggles
  mobileDropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = this.closest(".mobile-dropdown");
      const dropdownMenu = dropdown.querySelector(".mobile-dropdown-menu");

      dropdownMenu.classList.toggle("active");

      // Toggle plus/minus icon
      if (dropdownMenu.classList.contains("active")) {
        this.innerHTML = '<i class="fas fa-minus"></i>';
      } else {
        this.innerHTML = '<i class="fas fa-plus"></i>';
      }
    });
  });

  // Close mobile menu when clicking on a link
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
      mobileMenuIcon.classList.remove("active");

      // Reset hamburger icon
      mobileMenuIcon.querySelector("span:nth-child(1)").style.transform =
        "none";
      mobileMenuIcon.querySelector("span:nth-child(2)").style.opacity = "1";
      mobileMenuIcon.querySelector("span:nth-child(2)").style.transform =
        "scaleX(1)";
      mobileMenuIcon.querySelector("span:nth-child(3)").style.transform =
        "none";
    });
  });

  // Prevent menu closing when clicking dropdown parent links
  const mobileDropdownParentLinks = document.querySelectorAll(
    ".mobile-dropdown > a"
  );
  mobileDropdownParentLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdown = this.closest(".mobile-dropdown");
      const toggle = dropdown.querySelector(".mobile-dropdown-toggle");
      if (toggle) {
        toggle.click();
      }
    });
  });

  // Slideshow functionality
  if (slideshow) {
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    // Touch/swipe variables
    let startX = 0;
    let endX = 0;
    let isDragging = false;

    // Initialize the slideshow
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 6000);
    }

    // Show a specific slide
    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      // Add active class to current slide and dot
      slides[index].classList.add("active");
      dots[index].classList.add("active");

      // Update current slide index
      currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= slideCount) next = 0;
      showSlide(next);
    }

    // Previous slide function
    function prevSlide() {
      let prev = currentSlide - 1;
      if (prev < 0) prev = slideCount - 1;
      showSlide(prev);
    }

    // Event listeners for slide controls
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", function () {
        clearInterval(slideInterval);
        prevSlide();
        startSlideshow();
      });

      nextBtn.addEventListener("click", function () {
        clearInterval(slideInterval);
        nextSlide();
        startSlideshow();
      });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        clearInterval(slideInterval);
        showSlide(index);
        startSlideshow();
      });
    });

    // Touch events for mobile swiping
    let startY = 0;

    slideshow.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      clearInterval(slideInterval); // Pause autoplay when touching
    });

    slideshow.addEventListener("touchmove", function (e) {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      // Only prevent default if horizontal movement is greater than vertical
      // This allows vertical scrolling while enabling horizontal swiping
      if (diffX > diffY && diffX > 10) {
        e.preventDefault(); // Prevent scrolling only for horizontal swipes
      }
    });

    slideshow.addEventListener("touchend", function (e) {
      if (!isDragging) return;

      endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      isDragging = false;

      const threshold = 50; // Minimum distance for a swipe
      const diffX = startX - endX;
      const diffY = Math.abs(startY - endY);

      // Only trigger slide change if horizontal movement is greater than vertical
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          // Swiped left - go to next slide
          nextSlide();
        } else {
          // Swiped right - go to previous slide
          prevSlide();
        }
      }

      startSlideshow(); // Resume autoplay
    });

    // Prevent accidental swipes when user is just trying to scroll
    slideshow.addEventListener("touchcancel", function () {
      isDragging = false;
      startSlideshow();
    });

    // Start the slideshow
    startSlideshow();
  }

  // Testimonial Carousel Functionality
  const testimonialCarousel = document.querySelector(".testimonial-carousel");
  if (testimonialCarousel) {
    const carouselTrack = testimonialCarousel.querySelector(".carousel-track");
    const carouselSlides =
      testimonialCarousel.querySelectorAll(".carousel-slide");
    const prevButton = testimonialCarousel.querySelector(".carousel-prev");
    const nextButton = testimonialCarousel.querySelector(".carousel-next");
    const dots = testimonialCarousel.querySelectorAll(".carousel-dot");

    let currentIndex = 0;
    const slideCount = carouselSlides.length;
    let autoplayInterval;

    // Initialize carousel
    function initCarousel() {
      // Set initial active slide
      updateCarousel();

      // Start autoplay
      startAutoplay();

      // Add event listeners
      prevButton.addEventListener("click", goToPrevSlide);
      nextButton.addEventListener("click", goToNextSlide);

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          goToSlide(index);
        });
      });

      // Pause autoplay on hover
      testimonialCarousel.addEventListener("mouseenter", stopAutoplay);
      testimonialCarousel.addEventListener("mouseleave", startAutoplay);

      // Touch events for mobile swiping
      let startX, moveX, currentTranslate;

      carouselTrack.addEventListener("touchstart", (e) => {
        stopAutoplay();
        startX = e.touches[0].clientX;
        currentTranslate = -currentIndex * 100;
      });

      carouselTrack.addEventListener("touchmove", (e) => {
        moveX = e.touches[0].clientX;
        const diff = ((moveX - startX) / carouselTrack.offsetWidth) * 100;
        const translate = currentTranslate + diff;
        carouselTrack.style.transform = `translateX(${translate}%)`;
      });

      carouselTrack.addEventListener("touchend", (e) => {
        const movedBy = moveX - startX;

        if (Math.abs(movedBy) > 50) {
          if (movedBy > 0) {
            goToPrevSlide();
          } else {
            goToNextSlide();
          }
        } else {
          // Return to current slide if swipe was too small
          updateCarousel();
        }

        startAutoplay();
      });
    }

    // Update carousel display
    function updateCarousel() {
      // Update slide positions
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active classes
      carouselSlides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    // Go to next slide
    function goToNextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    }

    // Go to previous slide
    function goToPrevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateCarousel();
    }

    // Start autoplay
    function startAutoplay() {
      stopAutoplay(); // Clear any existing interval
      autoplayInterval = setInterval(goToNextSlide, 5000);
    }

    // Stop autoplay
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Initialize
    initCarousel();
  }

  // Fade-in effect on scroll with improved performance and timing
  let ticking = false;

  function checkFade() {
    fadeElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      // More responsive threshold based on screen size
      const threshold = windowHeight * 0.15; // 15% of viewport height
      const triggerPoint = windowHeight - threshold;

      // Check if element is in viewport and not already animated
      if (
        elementTop < triggerPoint &&
        elementBottom > 0 &&
        !element.classList.contains("appear")
      ) {
        // Add a small random delay to prevent all elements from animating at exactly the same time
        const randomDelay = Math.random() * 100;

        setTimeout(() => {
          element.classList.add("appear");
        }, randomDelay);
      }
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(checkFade);
      ticking = true;
    }
  }

  // Throttled scroll event for better performance
  function handleScroll() {
    requestTick();
  }

  // Check fade elements on initial load with a slight delay
  window.addEventListener("load", function () {
    setTimeout(checkFade, 100);
  });

  // Use throttled scroll handler
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Parallax effect for sections with parallax-section class
  const parallaxSections = document.querySelectorAll(".parallax-section");

  function parallaxEffect() {
    parallaxSections.forEach((section) => {
      const distance = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // Only apply effect when section is in view
      if (
        distance > sectionTop - window.innerHeight &&
        distance < sectionTop + sectionHeight
      ) {
        // Get background image from computed style if it exists
        const computedStyle = window.getComputedStyle(section);
        if (computedStyle.backgroundImage !== "none") {
          // Move the background image at a different rate than the scroll
          const yPos = (distance - sectionTop) * 0.5;
          section.style.backgroundPosition = `center ${yPos}px`;
        }
      }
    });
  }

  // Set up parallax effect if sections exist
  if (parallaxSections.length > 0) {
    window.addEventListener("scroll", parallaxEffect);
    // Initialize positions
    parallaxEffect();
  }

  // Service card hover animation enhancement
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".service-icon img");
      if (icon) {
        icon.style.transform = "scale(1.1)";
        icon.style.transition = "transform 0.3s ease-in-out";
      }
    });

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".service-icon img");
      if (icon) {
        icon.style.transform = "scale(1)";
      }
    });
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: "smooth",
        });
      }
    });
  });

  // Initialize AOS animation library if loaded
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }
});
