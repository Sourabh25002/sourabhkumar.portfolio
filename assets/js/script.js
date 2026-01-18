// Navbar active link highlighting on scroll
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Toggle menu on click
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Optional: Toggle between "bars" and "X" icon
    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close menu when a link is clicked (Better UX)
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      // Reset icon
      const icon = hamburger.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });
});

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section, header");
  const navLi = document.querySelectorAll(".nav-links li a");

  // Function to highlight the current section in the navbar on scroll
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // 150px offset to trigger the highlight a bit earlier before it hits top of screen
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach((a) => {
      a.classList.remove("active");
      if (a.classList.contains(current)) {
        a.classList.add("active");
      }
    });
  });
});
