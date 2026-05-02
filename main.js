const cards = document.querySelectorAll(".card");
      const next = document.querySelector(".arrow--next");
      const prev = document.querySelector(".arrow--prev");
      const close = document.querySelector(".close-modal");

      const wW = window.innerWidth;
      const wH = window.innerHeight;
      const pos = { x: wW / 2, y: wH / 2 };
      const mouse = { x: pos.x, y: pos.y };
      const speed = 0.125;

      let aC = 0;
      let iAC = 1;
      let currentThumb = 0;

      const xSet = gsap.utils.pipe(gsap.quickSetter(cards, "rotateY", "deg"));
      const ySet = gsap.utils.pipe(gsap.quickSetter(cards, "rotateX", "deg"));

      const moveMouse = (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
      };

      const setIncommingAttrs = (getter, setter) => {
        const themeColor = getter.dataset.color || "#fff";
        const titleText = getter.dataset.title;
        const descText = getter.dataset.desc;
        const numberText = "PROJ." + getter.dataset.number;
        const imgUrl = getter.dataset.img;

        setter.querySelector(".card-title").innerText = titleText;
        setter.querySelector(".card-desc").innerText = descText;
        setter.querySelector(".card-number").innerText = numberText;

        if (imgUrl) {
          setter.querySelector(".card-image").src = imgUrl;
        }

        setter.style.setProperty("--theme", themeColor);
        setter.style.setProperty("--theme-glow", themeColor);
      };

      const tiltSetter = () => {
        const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;

        xSet((gsap.utils.normalize(0, wW, pos.x) - 0.5) * 35);
        ySet((gsap.utils.normalize(0, wH, pos.y) - 0.5) * -35);
      };

      const thumbs = document.querySelectorAll(".thumb-module");

      const prevAnimation = () => {
        unTilt();
        let prevThumbIndex = currentThumb - 1;
        if (prevThumbIndex < 0) prevThumbIndex = thumbs.length - 1;
        const prevThumb = thumbs[prevThumbIndex];

        setIncommingAttrs(prevThumb, cards[iAC]);

        gsap
          .timeline({ onComplete: tilt })
          .set(cards[iAC], { autoAlpha: 1 })
          .to(
            cards[aC],
            {
              duration: 1,
              rotateY: -360,
              x: "50vw",
              xPercent: 100,
              ease: "power3.inOut",
            },
            "sync",
          )
          .fromTo(
            cards[iAC],
            { rotateY: 360, x: "-50vw", xPercent: -100 },
            {
              duration: 1,
              rotateY: -15,
              x: 0,
              xPercent: 0,
              ease: "power3.inOut",
            },
            "sync",
          );

        aC--;
        iAC--;
        currentThumb--;
        if (aC < 0) aC = 1;
        if (iAC < 0) iAC = 1;
        if (currentThumb < 0) currentThumb = thumbs.length - 1;
      };

      const nextAnimation = () => {
        unTilt();
        let nextThumbIndex = currentThumb + 1;
        if (nextThumbIndex > thumbs.length - 1) nextThumbIndex = 0;
        const nextThumb = thumbs[nextThumbIndex];

        setIncommingAttrs(nextThumb, cards[iAC]);

        gsap
          .timeline({ onComplete: tilt })
          .set(cards[iAC], { autoAlpha: 1 })
          .to(
            cards[aC],
            {
              duration: 1,
              rotateY: 360,
              x: "-50vw",
              xPercent: -100,
              ease: "power3.inOut",
            },
            "sync",
          )
          .fromTo(
            cards[iAC],
            { rotateY: -360, x: "50vw", xPercent: 100 },
            {
              duration: 1,
              rotateY: 15,
              x: 0,
              xPercent: 0,
              ease: "power3.inOut",
            },
            "sync",
          );

        aC++;
        iAC++;
        currentThumb++;
        if (aC > 1) aC = 0;
        if (iAC > 1) iAC = 0;
        if (currentThumb > thumbs.length - 1) currentThumb = 0;
      };

      const tilt = () => {
        next.addEventListener("click", nextAnimation);
        prev.addEventListener("click", prevAnimation);
        window.addEventListener("mousemove", moveMouse);
        gsap.ticker.add(tiltSetter);
      };

      const unTilt = () => {
        gsap.ticker.remove(tiltSetter);
        window.removeEventListener("mousemove", moveMouse);
        next.removeEventListener("click", nextAnimation);
        prev.removeEventListener("click", prevAnimation);
      };

      const closeModal = () => {
        unTilt();
        close.removeEventListener("click", closeModal);

        gsap
          .timeline()
          .to(cards[aC], {
            y: "50vh",
            yPercent: 50,
            rotateX: 0,
            rotateY: 0,
            ease: "back.in",
            duration: 0.6,
          })
          .to(
            ".modal",
            {
              autoAlpha: 0,
              duration: 0.4,
              backgroundColor: "rgba(5, 5, 5, 0)",
            },
            "-=0.2",
          )
          .set(cards[aC], { rotationY: 0 });
      };

      const openModel = (e, i) => {
        currentThumb = i;
        gsap.set(".modal", { autoAlpha: 1 });
        close.addEventListener("click", closeModal);
        gsap.to(".modal", {
          backgroundColor: "rgba(5, 5, 5, 0.9)",
          duration: 0.6,
        });

        cards.forEach((card) => gsap.set(card, { autoAlpha: 0 }));
        gsap.set(cards[aC], { autoAlpha: 1 });

        const clickedThumb = thumbs[i];
        setIncommingAttrs(clickedThumb, cards[aC]);

        gsap
          .timeline({ onComplete: tilt })
          .set(cards[aC], { rotationY: 180, x: 0, xPercent: 0 })
          .fromTo(
            cards[aC],
            { y: "50vh", yPercent: 50, rotateX: -60 },
            {
              y: 0,
              yPercent: 0,
              rotateX: 0,
              ease: "power3.out",
              duration: 0.8,
            },
          )
          .to(
            cards[aC],
            { rotationY: 740, duration: 1.4, ease: "power2.inOut" },
            "-=0.6",
          )
          .set(cards[aC], { rotationY: 20 })
          .to(cards[aC], { rotationY: 0, duration: 0.8, ease: "power2.out" });
      };

      thumbs.forEach((thumb, i) => {
        thumb.onclick = (e) => {
          openModel(e, i);
        };
      });

const RANDOM = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
      const PARTICLES = document.querySelectorAll(".galaxy-star");
      PARTICLES.forEach((P) => {
        P.setAttribute(
          "style",
          `
    --angle: ${RANDOM(0, 360)};
    --duration: ${RANDOM(6, 20)};
    --delay: ${RANDOM(1, 10)};
    --alpha: ${RANDOM(40, 90) / 100};
    --size: ${RANDOM(2, 6)};
    --distance: ${RANDOM(40, 200)};
  `,
        );
      });

gsap.registerPlugin(ScrollTrigger);

      document.addEventListener("DOMContentLoaded", () => {
        // ================================================================
        // MANUAL SPLITTEXT UTILITY (no paid plugin needed)
        // ================================================================
        function splitTextIntoChars(selector) {
          const elements = document.querySelectorAll(selector);

          function processNode(node, inheritStyles) {
            // If it's a text node, split its content into char spans
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent;
              if (!text.trim()) return;
              const frag = document.createDocumentFragment();
              const words = text.split(/(\s+)/);
              words.forEach(word => {
                if (word.match(/^\s+$/)) {
                  frag.appendChild(document.createTextNode(word));
                } else {
                  const wordSpan = document.createElement('span');
                  wordSpan.className = 'word';
                  wordSpan.style.display = 'inline-block';
                  wordSpan.style.overflow = 'hidden';
                  for (const ch of word) {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'char';
                    charSpan.textContent = ch;
                    // If parent had gradient text styles, apply them per-char
                    if (inheritStyles) {
                      charSpan.style.backgroundImage = inheritStyles.backgroundImage;
                      charSpan.style.webkitBackgroundClip = 'text';
                      charSpan.style.backgroundClip = 'text';
                      charSpan.style.color = 'transparent';
                      charSpan.style.webkitTextFillColor = 'transparent';
                    }
                    wordSpan.appendChild(charSpan);
                  }
                  frag.appendChild(wordSpan);
                }
              });
              node.parentNode.replaceChild(frag, node);
            }
            // If it's an element, check for gradient styles then recurse
            else if (node.nodeType === Node.ELEMENT_NODE) {
              let gradientStyles = inheritStyles || null;

              // Detect gradient text elements (bg-clip-text + text-transparent)
              const computed = window.getComputedStyle(node);
              if (computed.webkitBackgroundClip === 'text' || computed.backgroundClip === 'text') {
                gradientStyles = {
                  backgroundImage: computed.backgroundImage,
                };
                // Remove gradient classes from parent — chars will carry them
                node.style.backgroundImage = 'none';
                node.style.webkitBackgroundClip = 'border-box';
                node.style.backgroundClip = 'border-box';
                node.style.color = 'inherit';
                node.style.webkitTextFillColor = 'inherit';
              }

              const children = Array.from(node.childNodes);
              children.forEach(child => processNode(child, gradientStyles));
            }
          }

          elements.forEach(el => processNode(el, null));
          return document.querySelectorAll(selector + ' .char');
        }

        // ================================================================
        // FEATURE 1: CINEMATIC PRELOADER
        // ================================================================
        const preloader = document.getElementById('preloader');
        const preloaderCounter = document.getElementById('preloader-counter');
        const preloaderBar = document.getElementById('preloader-bar');

        const counterObj = { val: 0 };
        const preloaderTl = gsap.timeline({
          onComplete: () => {
            // Preloader exit → Hero entrance
            runHeroEntrance();
          }
        });

        // Counter animation: 000 → 100
        preloaderTl.to(counterObj, {
          val: 100,
          duration: 2.2,
          ease: "power2.inOut",
          snap: { val: 1 },
          onUpdate: () => {
            preloaderCounter.textContent = String(Math.floor(counterObj.val)).padStart(3, '0');
          }
        }, 0);

        // Progress bar fills
        preloaderTl.to(preloaderBar, {
          width: "100%",
          duration: 2.2,
          ease: "power2.inOut"
        }, 0);

        // Counter zooms toward camera + blurs
        preloaderTl.to(preloaderCounter, {
          scale: 3,
          filter: "blur(30px)",
          opacity: 0,
          duration: 0.6,
          ease: "power3.in"
        }, 2.3);

        // Label fades
        preloaderTl.to('.preloader-label', {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in"
        }, 2.2);

        // Preloader curtain slides up
        preloaderTl.to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut"
        }, 2.6);

        // Remove preloader from DOM + unlock scroll
        preloaderTl.call(() => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
        }, null, 3.4);

        // ================================================================
        // FEATURE 3: ADVANCED SPLITTEXT HERO ENTRANCE
        // ================================================================
        function runHeroEntrance() {
          // First, make the line containers visible (they start with opacity-0 class)
          document.querySelectorAll('.hero-stagger-line').forEach(el => {
            el.style.opacity = '1';
          });

          // Split hero headlines into chars
          const chars = splitTextIntoChars('.hero-stagger-line');

          const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // Chars flip up from below with 3D rotation
          heroTl.fromTo(chars,
            { y: '110%', rotationX: -80, opacity: 0 },
            {
              y: '0%',
              rotationX: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.02,
            }
          );

          // Stagger other hero elements
          heroTl.fromTo(
            ".hero-stagger",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
            "-=0.5",
          );

          heroTl.fromTo(
            ".hero-skills",
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1 },
            "-=0.6",
          );
        }

        // Continuous organic float for hero skill cards
        gsap.to(".hero-skill-card", {
          y: "random(-20, 20)",
          x: "random(-10, 10)",
          rotation: "random(-3, 3)",
          duration: "random(4, 6)",
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: {
            each: 0.5,
            from: "random",
          },
        });

        // ================================================================
        // FEATURE 4: BRUTALIST KINETIC MARQUEE
        // ================================================================
        const marqueeRow1 = document.getElementById('marquee-row-1');
        const marqueeRow2 = document.getElementById('marquee-row-2');

        if (marqueeRow1 && marqueeRow2) {
          // Fade-in Cinematic Intro for the entire section
          gsap.from(".marquee-section", {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".marquee-section",
              start: "top 70%", // Start fading in as it comes into view
              toggleActions: "play none none reverse"
            }
          });

          // Pinned Scroll-Driven Horizontal Marquee
          const marqueeTl = gsap.timeline({
            scrollTrigger: {
              trigger: ".marquee-section",
              pin: true,
              scrub: 2.5, // High friction: Makes horizontal sliding feel slow and cinematic
              start: "top top", 
              end: "+=1000", // Gives it enough vertical space to not whip by
              invalidateOnRefresh: true 
            }
          });

          // Horizontal Translation for Rows - explicitly set to duration 1
          // Row 1 goes left: from 0 to full negative width difference
          marqueeTl.to(marqueeRow1, {
            x: () => -(marqueeRow1.scrollWidth - window.innerWidth),
            duration: 1,
            ease: "none"
          }, 0);

          // Row 2 goes right: must start offset to the left, then move to 0
          gsap.set(marqueeRow2, {
            x: () => -(marqueeRow2.scrollWidth - window.innerWidth)
          });
          
          marqueeTl.to(marqueeRow2, {
            x: 0,
            duration: 1,
            ease: "none"
          }, 0);

          // Dynamic Text Interaction (Fill & Opacity effect)
          // Run this infinitely as an independent background animation 
          // so it doesn't inflate the timeline duration and halt the scrolling!
          const words = gsap.utils.toArray(".marquee-section .marquee-text");
          
          gsap.fromTo(words, 
            { opacity: 0.3, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              stagger: {
                each: 0.2,
                yoyo: true,
                repeat: -1
              },
              ease: "sine.inOut"
            }
          );
        }

        // ================================================================
        // EXISTING: Intro Text fade and slide
        // ================================================================
        gsap.fromTo(
          ".intro-fade",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#personal-intro",
              start: "top 75%",
            },
          },
        );

        // Floating Background abstract shape
        gsap.to(".intro-floating-bg", {
          y: -25,
          rotation: 4,
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        const pills = document.querySelectorAll(".tech-pill");

        // Parallax effect on mousemove for pills
        window.addEventListener("mousemove", (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 50;
          const y = (e.clientY / window.innerHeight - 0.5) * 50;

          pills.forEach((pill) => {
            const speed = parseFloat(pill.dataset.speed || 1);
            gsap.to(pill, {
              x: x * speed,
              y: y * speed,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        });

        // Hover bouncy scale for pills
        pills.forEach((pill) => {
          pill.addEventListener("mouseenter", () => {
            gsap.to(pill, { scale: 1.1, duration: 0.4, ease: "back.out(1.7)" });
          });
          pill.addEventListener("mouseleave", () => {
            gsap.to(pill, { scale: 1, duration: 0.4, ease: "power2.out" });
          });
        });

        // Smart Navbar Scroll Logic
        const nav = document.getElementById("main-nav");
        let lastScrollY = window.scrollY;

        ScrollTrigger.create({
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const currentScroll = self.scroll();
            const scrollingDown = self.direction === 1;

            if (currentScroll < 100) {
              nav.style.transform = "translateX(-50%) translateY(0)";
              nav.style.opacity = "1";
            } else if (scrollingDown) {
              nav.style.transform = "translateX(-50%) translateY(-150%)";
              nav.style.opacity = "0";
            } else {
              nav.style.transform = "translateX(-50%) translateY(0)";
              nav.style.opacity = "1";
            }
          },
        });

        // Depth of Field Lens Pull Transition
        const lensTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hype-main",
            pin: true,
            pinSpacing: false,
            start: "top top", 
            end: "+=100%",      
            scrub: true,
          }
        });

        lensTl.to(".hype-main-section", {
          scale: 1.5,
          filter: "blur(24px)",
          opacity: 0,
          transformOrigin: "center center",
          ease: "power1.inOut"
        }, 0);

        lensTl.fromTo("#featured-works", {
          scale: 0.85,
          filter: "blur(24px)",
          opacity: 0
        }, {
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          ease: "power1.inOut"
        }, 0);

        // ================================================================
        // CASE STUDY CARDS — Scroll-driven reveal
        // ================================================================
        gsap.utils.toArray('.case-card').forEach((card, i) => {
          const image = card.querySelector('.case-image-wrapper');
          const info = card.querySelector('.case-info');

          gsap.fromTo(card, {
            opacity: 0,
            y: 80,
          }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            }
          });

          // Parallax on image
          if (image) {
            gsap.fromTo(image, {
              y: 40,
              scale: 0.95,
            }, {
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              }
            });
          }

          // Info slides in
          if (info) {
            gsap.fromTo(info, {
              opacity: 0,
              x: i % 2 === 0 ? 40 : -40,
            }, {
              opacity: 1,
              x: 0,
              duration: 1,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              }
            });
          }
        });

        // Case header animation
        gsap.fromTo('.case-header', {
          opacity: 0,
          y: 50,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.case-header',
            start: "top 85%",
          }
        });

        // ================================================================
        // TECH ARSENAL — Section animations
        // ================================================================
        gsap.fromTo('.tech-header', {
          opacity: 0,
          y: 50,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.tech-header',
            start: "top 85%",
          }
        });

        // Philosophy statement
        gsap.fromTo('.philosophy-statement', {
          opacity: 0,
          y: 50,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.philosophy-statement',
            start: "top 80%",
          }
        });

        // Philosophy cards stagger
        gsap.fromTo('.philosophy-card', {
          opacity: 0,
          x: 60,
        }, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.philosophy-cards',
            start: "top 80%",
          }
        });
      });

(function() {
      const canvas = document.getElementById('orb-canvas');
      if (!canvas || !window.THREE) return;

      const container = canvas.parentElement;
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.z = 4;

      // Simplex-inspired noise for vertex displacement
      const vertexShader = `
        uniform float uTime;
        uniform float uDisplacement;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simple 3D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normal;
          vPosition = position;
          
          float noise = snoise(position * 1.5 + uTime * 0.3) * uDisplacement;
          vec3 newPosition = position + normal * noise;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          vNormal = normalize(normalMatrix * (normal + noise * 0.5));
        }
      `;

      const fragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
          // Fresnel effect for iridescent glass look
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
          
          // Iridescent color shifting
          vec3 color1 = vec3(0.0, 0.25, 0.88);  // Primary blue
          vec3 color2 = vec3(0.56, 0.15, 0.76);  // Secondary purple
          vec3 color3 = vec3(0.0, 0.37, 0.39);   // Tertiary teal
          
          float shift = sin(vNormal.x * 3.0 + uTime * 0.5) * 0.5 + 0.5;
          float shift2 = cos(vNormal.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
          
          vec3 baseColor = mix(color1, color2, shift);
          baseColor = mix(baseColor, color3, shift2 * 0.3);
          
          // Glass-like transparency with Fresnel
          float alpha = 0.15 + fresnel * 0.7;
          vec3 finalColor = baseColor + fresnel * vec3(0.8, 0.85, 1.0) * 0.5;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      const geometry = new THREE.IcosahedronGeometry(1.2, 4);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uDisplacement: { value: 0.3 },
        },
        transparent: true,
        wireframe: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Mouse tracking for reactivity
      const mouse = { x: 0, y: 0 };
      const targetRotation = { x: 0, y: 0 };

      window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      // Gentle idle pulse
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsed;

        // Gentle idle breathing
        const breathe = Math.sin(elapsed * 0.8) * 0.05;
        material.uniforms.uDisplacement.value = 0.3 + breathe;

        // Mouse-reactive rotation with lerp
        targetRotation.x = mouse.y * 0.5;
        targetRotation.y = mouse.x * 0.5;
        mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.05;

        // Slow idle rotation
        mesh.rotation.z += 0.002;

        renderer.render(scene, camera);
      }

      animate();

      // Responsive resize
      const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(container);
    })();

const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      // Synchronize Lenis scrolling with GSAP's ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);