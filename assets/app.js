(() => {
  const root = document.documentElement;
  const page = location.pathname.split("/").pop() || "index.html";

  // Dashboard is directly accessible in this front-end demo; production auth belongs on the server.

  // Restore theme and text direction on every page.
  try {
    const savedTheme = localStorage.getItem("fh-theme");
    const savedDir = localStorage.getItem("fh-dir");
    if (savedTheme) root.dataset.theme = savedTheme;
    if (savedDir) root.dir = savedDir;
  } catch (e) {}

  document.querySelectorAll(".theme-toggle").forEach(button => {
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("fh-theme", root.dataset.theme); } catch (e) {}
    });
  });

  document.querySelectorAll(".dir-toggle").forEach(button => {
    button.addEventListener("click", () => {
      root.dir = root.dir === "rtl" ? "ltr" : "rtl";
      try { localStorage.setItem("fh-dir", root.dir); } catch (e) {}
    });
  });

  // Main-site mobile navigation.
  const currentFileName = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href) {
      const cleanHref = href.split("?")[0].split("#")[0];
      if (cleanHref === currentFileName || (currentFileName === "" && cleanHref === "index.html")) {
        link.classList.add("active");
      }
    }
  });

  const menu = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".nav-panel");
  if (menu && panel) {
    menu.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    panel.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      panel.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }));
  }

  // Scroll reveal.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Demo sign-in. Replace with a real authentication API before production use.
  const signInForm = document.getElementById("signinForm");
  if (signInForm) {
    signInForm.addEventListener("submit", event => {
      event.preventDefault();
      const email = signInForm.elements.email.value.trim();
      const password = signInForm.elements.password.value;
      const feedback = signInForm.querySelector(".form-feedback");
      if (!email || !signInForm.elements.email.checkValidity() || password.length < 4) {
        feedback.textContent = "Enter a valid email address and a password with at least 4 characters.";
        return;
      }
      try {
        const remember = !!signInForm.elements.remember.checked;
        localStorage.removeItem("fh-authenticated");
        localStorage.removeItem("fh-client-email");
        localStorage.removeItem("fh-client-name");
        sessionStorage.removeItem("fh-authenticated");
        sessionStorage.removeItem("fh-client-email");
        sessionStorage.removeItem("fh-client-name");
        const store = remember ? localStorage : sessionStorage;
        store.setItem("fh-authenticated", "true");
        store.setItem("fh-client-email", email);
        let resolvedName = localStorage.getItem("fh-client-name");
        if (!resolvedName || resolvedName.toLowerCase() === "client" || resolvedName.toLowerCase() === "demo") {
          const rawPrefix = email.split("@")[0] || "";
          const pretty = rawPrefix.replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          resolvedName = (pretty && pretty.toLowerCase() !== "demo" && pretty.toLowerCase() !== "client") ? pretty : "Alex Morgan";
        }
        store.setItem("fh-client-name", resolvedName);
      } catch (e) {}
      feedback.textContent = "Login successful. Opening your client dashboard…";
      const submit = signInForm.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Opening dashboard…";
      }
      window.setTimeout(() => { location.href = "dashboard.html"; }, 350);
    });
  }

  const googleDemo = document.getElementById("googleDemoBtn");
  if (googleDemo) {
    googleDemo.addEventListener("click", () => {
      window.alert("Google sign-in is a design/demo button. Connect Google OAuth to enable real social login. Use the email and password demo instead.");
    });
  }
  const appleDemo = document.getElementById("appleDemoBtn");
  if (appleDemo) {
    appleDemo.addEventListener("click", () => {
      window.alert("Apple sign-in is a design/demo button. Configure Sign in with Apple to enable real social login. Use the email and password demo instead.");
    });
  }

  // Demo account creation with required-field, terms and password-match validation.
  const signUpForm = document.getElementById("signupForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = signUpForm.elements.name.value.trim();
      const email = signUpForm.elements.email.value.trim();
      const password = signUpForm.elements.password.value;
      const confirmPassword = signUpForm.elements.confirmPassword.value;
      const termsAccepted = signUpForm.elements.terms.checked;
      const feedback = signUpForm.querySelector(".form-feedback");

      if (name.length < 2 || !signUpForm.elements.email.checkValidity()) {
        feedback.textContent = "Please enter your name and a valid email address.";
        return;
      }
      if (password.length < 8) {
        feedback.textContent = "Use a password with at least 8 characters.";
        return;
      }
      if (password !== confirmPassword) {
        feedback.textContent = "Your passwords do not match. Please check both fields.";
        signUpForm.elements.confirmPassword.focus();
        return;
      }
      if (!termsAccepted) {
        feedback.textContent = "Please agree to the Terms & Conditions to continue.";
        return;
      }
      try {
        sessionStorage.removeItem("fh-authenticated");
        sessionStorage.removeItem("fh-client-name");
        sessionStorage.removeItem("fh-client-email");
        localStorage.setItem("fh-authenticated", "true");
        localStorage.setItem("fh-client-name", name);
        localStorage.setItem("fh-client-email", email);
      } catch (e) {}
      feedback.textContent = "Account created in this demo. Opening your dashboard…";
      const submit = signUpForm.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Opening dashboard…";
      }
      window.setTimeout(() => { location.href = "dashboard.html"; }, 400);
    });
  }

  // Password visibility toggle (eye button).
  document.querySelectorAll(".password-toggle-btn").forEach(button => {
    button.addEventListener("click", () => {
      const wrap = button.closest(".password-field-wrap");
      const input = wrap ? wrap.querySelector("input") : null;
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      button.setAttribute("title", isPassword ? "Hide password" : "Show password");
      const eyeOpen = button.querySelector(".eye-open");
      const eyeClosed = button.querySelector(".eye-closed");
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? "none" : "block";
        eyeClosed.style.display = isPassword ? "block" : "none";
      }
    });
  });

  // Dashboard tablet/mobile hamburger navigation.
  const dashboardMenuToggle = document.getElementById("dashboardMenuToggle");
  const dashboardMobileMenu = document.getElementById("dashboardMobileMenu");
  if (dashboardMenuToggle && dashboardMobileMenu) {
    const closeDashboardMenu = () => {
      dashboardMobileMenu.classList.remove("open");
      dashboardMenuToggle.setAttribute("aria-expanded", "false");
      dashboardMenuToggle.setAttribute("aria-label", "Open dashboard menu");
    };
    dashboardMenuToggle.addEventListener("click", () => {
      const open = dashboardMobileMenu.classList.toggle("open");
      dashboardMenuToggle.setAttribute("aria-expanded", String(open));
      dashboardMenuToggle.setAttribute("aria-label", open ? "Close dashboard menu" : "Open dashboard menu");
    });
    dashboardMobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeDashboardMenu));
    document.addEventListener("click", event => {
      if (!dashboardMobileMenu.contains(event.target) && !dashboardMenuToggle.contains(event.target)) closeDashboardMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeDashboardMenu();
    });
  }

  // Dashboard greeting and logout.
  const clientName = document.getElementById("dashboardClientName");
  const welcomeName = document.getElementById("dashboardWelcomeName");
  let storedName = "Alex Morgan";
  try {
    const raw = localStorage.getItem("fh-client-name") || sessionStorage.getItem("fh-client-name");
    if (raw && raw.trim() && raw.toLowerCase() !== "client" && raw.toLowerCase() !== "client account" && raw.toLowerCase() !== "demo") {
      storedName = raw.trim();
    }
  } catch (e) {}
  if (clientName) clientName.textContent = storedName;
  if (welcomeName) welcomeName.textContent = storedName;
  const mobileClientName = document.getElementById("dashboardMobileClientName");
  if (mobileClientName) mobileClientName.textContent = storedName;
  const logout = document.getElementById("logoutBtn");
  const mobileLogout = document.getElementById("mobileLogoutBtn");
  const performLogout = () => {
      try {
        localStorage.removeItem("fh-authenticated");
        localStorage.removeItem("fh-client-email");
        localStorage.removeItem("fh-client-name");
        sessionStorage.removeItem("fh-authenticated");
        sessionStorage.removeItem("fh-client-email");
        sessionStorage.removeItem("fh-client-name");
      } catch (e) {}
      location.href = "login.html";
  };
  if (logout) logout.addEventListener("click", performLogout);
  if (mobileLogout) mobileLogout.addEventListener("click", performLogout);

  // Existing demo contact form.
  document.querySelectorAll(".demo-form:not(#signinForm):not(#signupForm)").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent = "Thank you. Your enquiry has been prepared for the FrameHouse studio team.";
        form.reset();
      }
    });
  });

  const saveAddons = document.getElementById("saveAddons");
  if (saveAddons) {
    saveAddons.addEventListener("click", () => {
      const count = document.querySelectorAll(".addon input:checked").length;
      const feedback = document.getElementById("addonFeedback");
      if (feedback) feedback.textContent = `${count} add-on selection(s) saved in this demo workspace.`;
    });
  }

  document.querySelectorAll(".invoice-view").forEach(button => {
    button.addEventListener("click", () => {
      const feedback = document.getElementById("invoiceFeedback");
      if (feedback) feedback.textContent = "Demo invoice preview: invoice details are illustrative and are not connected to billing.";
    });
  });

  // Floating "Back to top" action button visible across all sections when scrolling
  let backTopBtn = document.getElementById("backToTopBtn");
  if (!backTopBtn) {
    backTopBtn = document.createElement("button");
    backTopBtn.className = "back-to-top-btn";
    backTopBtn.id = "backToTopBtn";
    backTopBtn.type = "button";
    backTopBtn.setAttribute("aria-label", "Back to top");
    backTopBtn.setAttribute("title", "Back to top");
    backTopBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(backTopBtn);
  }

  const toggleBackTop = () => {
    if (window.scrollY > 280) {
      backTopBtn.classList.add("visible");
    } else {
      backTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

  backTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // If a third-party photo host fails, hide the broken image element rather than showing a broken-image icon.
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      const parent = img.parentElement;
      if (parent) {
        parent.classList.add("image-fallback");
        parent.setAttribute("aria-label", img.alt || "Studio photograph unavailable");
      }
    }, { once: true });
  });
})();
