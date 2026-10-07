/**
 * Pixel Art Portfolio - Interactive Behaviors, Vertical Navbar & Theme Controller
 * Author: Namana Shankar - Software Engineer
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. NIGHT MODE THEME CONTROLLER (SYSTEM MEDIA QUERY & MANUAL TOGGLE)
  // -------------------------------------------------------------------------
  const themeToggleBtns = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-sidebar')
  ].filter(Boolean);

  const themeStatusTexts = document.querySelectorAll('#theme-status-text, #sidebar-theme-status');
  const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Determine initial saved theme or fallback to auto
  const savedTheme = localStorage.getItem('theme-preference');

  /**
   * Applies theme and syncs all toggle buttons and labels across the interface
   * @param {string} theme - 'dark' | 'light' | 'auto'
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeStatusTexts.forEach(el => el.textContent = 'NIGHT');
      themeToggleBtns.forEach(btn => btn.setAttribute('aria-label', 'Switch to day mode'));
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeStatusTexts.forEach(el => el.textContent = 'DAY');
      themeToggleBtns.forEach(btn => btn.setAttribute('aria-label', 'Switch to night mode'));
    } else {
      // Auto (CSS Media Query Engine)
      document.documentElement.removeAttribute('data-theme');
      const isSystemDark = colorSchemeMediaQuery.matches;
      themeStatusTexts.forEach(el => el.textContent = isSystemDark ? 'NIGHT (SYS)' : 'DAY (SYS)');
      themeToggleBtns.forEach(btn => btn.setAttribute('aria-label', `Toggle theme (current: system ${isSystemDark ? 'night' : 'day'})`));
    }
  }

  // Initial load
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('auto');
  }

  // Listen to OS / Browser media query changes
  colorSchemeMediaQuery.addEventListener('change', () => {
    if (!localStorage.getItem('theme-preference')) {
      applyTheme('auto');
    }
  });

  // Toggle handlers for all theme buttons
  function handleThemeToggle() {
    playPixelBeep(520, 880);

    const currentAttr = document.documentElement.getAttribute('data-theme');
    const systemIsDark = colorSchemeMediaQuery.matches;

    let nextTheme;
    if (!currentAttr) {
      nextTheme = systemIsDark ? 'light' : 'dark';
    } else if (currentAttr === 'dark') {
      nextTheme = 'light';
    } else {
      nextTheme = 'dark';
    }

    localStorage.setItem('theme-preference', nextTheme);
    applyTheme(nextTheme);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', handleThemeToggle);
  });

  // -------------------------------------------------------------------------
  // 2. VERTICAL SIDEBAR DRAWER CONTROLLER (MOBILE & ACCESSIBILITY)
  // -------------------------------------------------------------------------
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    playPixelBeep(440, 660);
    sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close with Escape key for keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Auto-close drawer on mobile when a link is clicked
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      playPixelBeep(600, 750);
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. SCROLLSPY (ACTIVE LINK HIGHLIGHTING AS USER SCROLLS)
  // -------------------------------------------------------------------------
  const sectionIds = ['hero', 'about', 'skills', 'timeline', 'projects', 'video-showcase', 'testimonials', 'chat', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 180;

    let currentSectionId = 'hero';
    for (const section of sections) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.id;
        break;
      }
    }

    sidebarLinks.forEach(link => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === currentSectionId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Run initially

  // -------------------------------------------------------------------------
  // 4. RETRO 8-BIT AUDIO SYNTHESIZER (SYNTHESIZED WEB AUDIO API)
  // -------------------------------------------------------------------------
  function playPixelBeep(freqStart = 440, freqEnd = 880) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // Classic retro square wave
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {
      // Browsers may block audio until first user interaction
    }
  }

  // -------------------------------------------------------------------------
  // 5. INTERACTIVE TERMINAL CHAT SIMULATOR (CHAT SECTION)
  // -------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const promptButtons = document.querySelectorAll('.btn-prompt');

  const botResponses = {
    skills: "Namana's core tech stack includes Python, Java, C, and HTML/CSS, with practical focus on Data Structures and problem-solving.",
    solar: "Her Street Light project uses a solar panel, LDR sensor, charge controller, and LED to intelligently automate power usage based on light intensity.",
    availability: "Namana is actively seeking opportunities as a fresher software engineer to apply algorithmic problem solving and practical engineering skills!",
    default: "Transmission received! Namana is happy to connect regarding engineering roles, projects, or collaborations. You can reach her directly via the Contact section below!"
  };

  function appendChatMessage(sender, text, isUser = false) {
    if (!chatMessages) return;
    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msgEl.innerHTML = `
      <span class="chat-sender">[${sender}]:</span>
      <span class="chat-body">${text}</span>
    `;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserQuery(query) {
    if (!query || !query.trim()) return;
    appendChatMessage('GUEST', query.trim(), true);
    playPixelBeep(330, 550);

    const lower = query.toLowerCase();
    let reply = botResponses.default;

    if (lower.includes('skill') || lower.includes('language') || lower.includes('python') || lower.includes('java')) {
      reply = botResponses.skills;
    } else if (lower.includes('solar') || lower.includes('project') || lower.includes('light')) {
      reply = botResponses.solar;
    } else if (lower.includes('availab') || lower.includes('hire') || lower.includes('opportunit') || lower.includes('job')) {
      reply = botResponses.availability;
    }

    setTimeout(() => {
      appendChatMessage('NAMANA_BOT', reply, false);
      playPixelBeep(550, 770);
    }, 450);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value;
      if (val) {
        handleUserQuery(val);
        chatInput.value = '';
      }
    });
  }

  promptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      handleUserQuery(query);
    });
  });

  // -------------------------------------------------------------------------
  // 6. ABOUT SECTION: INTERACTIVE AVATAR SWITCHER (PIXEL <-> PHOTO)
  // -------------------------------------------------------------------------
  const switchPixelBtn = document.getElementById('switch-pixel-btn');
  const switchPhotoBtn = document.getElementById('switch-photo-btn');
  const avatarPixelView = document.getElementById('avatar-pixel-view');
  const avatarPhotoView = document.getElementById('avatar-photo-view');

  if (switchPixelBtn && switchPhotoBtn && avatarPixelView && avatarPhotoView) {
    switchPixelBtn.addEventListener('click', () => {
      playPixelBeep(480, 640);
      avatarPixelView.classList.add('active');
      avatarPhotoView.classList.remove('active');
      switchPixelBtn.classList.add('active');
      switchPhotoBtn.classList.remove('active');
    });

    switchPhotoBtn.addEventListener('click', () => {
      playPixelBeep(640, 480);
      avatarPhotoView.classList.add('active');
      avatarPixelView.classList.remove('active');
      switchPhotoBtn.classList.add('active');
      switchPixelBtn.classList.remove('active');
    });
  }

  // -------------------------------------------------------------------------
  // 7. SKILLS SECTION: INTERACTIVE CATEGORY FILTERING & ANIMATION
  // -------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.btn-filter-pill');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterPills.length > 0 && skillCards.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        playPixelBeep(520, 680);
        const filterVal = pill.getAttribute('data-filter');

        // Update active filter pill states
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        // Filter skill cards
        skillCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterVal === 'all' || cardCategory === filterVal) {
            card.classList.remove('filtered-out');
            // Retrigger progress bar animations
            const fills = card.querySelectorAll('.pixel-progress-fill');
            fills.forEach(fill => {
              const target = fill.style.getPropertyValue('--target-width') || '80%';
              fill.style.width = '0%';
              requestAnimationFrame(() => {
                setTimeout(() => {
                  fill.style.width = target;
                }, 40);
              });
            });
          } else {
            card.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 8. TIMELINE SECTION: INTERACTIVE CATEGORY FILTERING
  // -------------------------------------------------------------------------
  const timelineFilters = document.querySelectorAll('.btn-timeline-filter');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineFilters.length > 0 && timelineItems.length > 0) {
    timelineFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        playPixelBeep(480, 680);
        const filterVal = btn.getAttribute('data-timeline-filter');

        timelineFilters.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        timelineItems.forEach(item => {
          const itemCategory = item.getAttribute('data-timeline-cat');
          if (filterVal === 'all' || itemCategory === filterVal) {
            item.classList.remove('filtered-out');
          } else {
            item.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 9. PROJECTS SECTION: MODAL DETAIL VIEW CONTROLLER
  // =========================================================================
  // HOW THUMBNAIL-TO-DETAIL CONNECTION WORKS:
  //   Each .project-thumbnail-wrapper has [data-project-target="project-id"].
  //   Clicking a thumbnail or the SPECS button reads that attribute,
  //   looks up the project's full spec in the `projectsData` dictionary below,
  //   populates the #project-modal DOM elements, and calls dialog.showModal().
  //   Closing is handled by the X button, 'Close Window' button, Escape key,
  //   or clicking outside the modal (on the ::backdrop).
  // =========================================================================

  /**
   * projectsData: central repository of all project specifications.
   * Key = data-project-target / data-project-id attribute value on cards.
   * Each value populates the corresponding modal fields when opened.
   */
  const projectsData = {

    // ------------------------------------------------------------------
    // PROJECT 1: Smart Solar Street Light System
    // thumbnail[data-project-target="project-solar"] → projectsData["project-solar"]
    // ------------------------------------------------------------------
    'project-solar': {
      windowId: 'SOLAR_STREET_LIGHT.EXE',
      questNum: 'QUEST #01',
      duration: '6-Month Research Project',
      title: 'Smart Solar Street Light System',
      tagline: 'Autonomous solar-powered municipal lighting with intelligent LDR-based energy management',
      category: 'IoT • HARDWARE',
      img: 'project-solar.jpg',
      description: 'Designed and implemented an autonomous street lighting system that combines photovoltaic solar panels with an LDR (Light Dependent Resistor) sensor circuit to dynamically control a high-lumen LED lamp. The system eliminates manual switching and optimizes energy draw from a rechargeable battery bank — delivering green, zero-grid municipal lighting suitable for rural deployment.',
      highlights: [
        'Solar PV panel charges a sealed lead-acid battery bank via a PWM charge controller, sustaining 8+ hours of nightly operation.',
        'LDR sensor circuit continuously measures ambient lux levels and triggers LED ON/OFF thresholds with a relay module.',
        'Designed complete circuit schematic with protection diodes to prevent reverse current discharge during daylight hours.',
        'Estimated 60% municipal energy cost reduction compared to conventional grid-connected street lights.',
        'Documented project report with performance metrics, wiring diagrams, and sustainability analysis.'
      ],
      tech: ['Solar PV Panel', 'LDR Sensor', 'PWM Charge Controller', 'Lead-Acid Battery', 'Relay Module', 'LED Lamp', 'Voltage Regulator', 'Proteus Simulation'],
      repoLink: 'https://github.com/namana-shankar'
    },

    // ------------------------------------------------------------------
    // PROJECT 2: Algorithm & Data Structures Visualizer
    // thumbnail[data-project-target="project-algo"] → projectsData["project-algo"]
    // ------------------------------------------------------------------
    'project-algo': {
      windowId: 'DSA_VISUALIZER.EXE',
      questNum: 'QUEST #02',
      duration: 'Academic Semester Project',
      title: 'Algorithm & DSA Visualizer',
      tagline: 'Step-by-step interactive simulation of classic algorithms and data structures with real-time complexity analysis',
      category: 'DSA • PYTHON',
      img: 'project-algo.jpg',
      description: 'Built an interactive step-by-step simulator that renders sorting algorithms, binary search trees, graph traversal, and stack/queue operations with animated visual frames. Each algorithm step is color-coded and timed to clarify Big-O complexity differences — a direct learning tool emerging from core Data Structures & Algorithms coursework.',
      highlights: [
        'Visualizes 8+ sorting algorithms (Bubble, Merge, Quick, Heap) with per-step bar chart animations and swap counters.',
        'Binary Search Tree insert/delete/search rendered with node-level highlighting and rotation diagrams.',
        'Graph traversal (BFS, DFS) shows frontier expansion level-by-level with adjacency matrix display.',
        'Real-time Big-O complexity meter updates alongside each algorithm step for comparative analysis.',
        'Stack and queue push/pop operations rendered with cell-level animation to reinforce memory concepts.'
      ],
      tech: ['Python', 'Data Structures', 'Sorting Algorithms', 'Graph Theory', 'Complexity Analysis', 'Matplotlib', 'OOP Design', 'Animation Timing'],
      repoLink: 'https://github.com/namana-shankar'
    },

    // ------------------------------------------------------------------
    // PROJECT 3: Unix Automated Log Monitor & CLI Pipeline
    // thumbnail[data-project-target="project-unix"] → projectsData["project-unix"]
    // ------------------------------------------------------------------
    'project-unix': {
      windowId: 'UNIX_LOG_MONITOR.SH',
      questNum: 'QUEST #03',
      duration: 'Systems Lab Project',
      title: 'Unix Automated Log Monitor',
      tagline: 'Bash automation pipeline for syslog parsing, disk/memory health checks, and automated diagnostic report generation',
      category: 'SYSTEMS • UNIX',
      img: 'project-unix.jpg',
      description: 'Engineered a comprehensive Bash shell scripting pipeline that monitors Unix server health in real time. The tool parses /var/log/syslog streams using grep, awk, and sed for critical error pattern detection, conducts disk I/O and memory utilization checks, and auto-generates timestamped diagnostic summary reports. Fully automated via cron job scheduling for zero-touch server monitoring.',
      highlights: [
        'Parses live syslog streams for ERROR, WARN, and CRITICAL patterns using multi-pattern grep pipelines.',
        'df and free command integrations generate threshold-based alerts when disk fills above 85% or RAM exceeds 90%.',
        'Automated diagnostic reports generated and archived with ISO 8601 timestamps for audit trails.',
        'Modular script design with reusable Bash functions for log rotation, alert dispatch, and HTML report formatting.',
        'Cron-scheduled to run hourly checks with configurable alert thresholds via a single config file.'
      ],
      tech: ['Bash / Shell Script', 'Unix / Linux', 'grep / awk / sed', 'Cron Jobs', 'Process Monitoring', 'Syslog Parsing', 'HTML Report Generation', 'File I/O'],
      repoLink: 'https://github.com/namana-shankar'
    },

    // ------------------------------------------------------------------
    // PROJECT 4: Cyber-Analytics Data Science Dashboard
    // thumbnail[data-project-target="project-data"] → projectsData["project-data"]
    // ------------------------------------------------------------------
    'project-data': {
      windowId: 'DATA_ANALYTICS.PY',
      questNum: 'QUEST #04',
      duration: 'Data Science Elective Project',
      title: 'Cyber-Analytics Data Suite',
      tagline: 'Statistical analysis, multi-variable correlation, outlier detection, and predictive modeling with Python data science stack',
      category: 'ANALYTICS • ML',
      img: 'project-data.jpg',
      description: 'Developed a comprehensive data science analysis suite using Python\'s scientific computing stack. The project covers the full data pipeline: ingestion and cleaning with Pandas, statistical distribution modeling, multi-variable Pearson/Spearman correlation matrices, IQR-based outlier detection, and linear regression predictive modeling — packaged with matplotlib/seaborn visualizations and actionable insights.',
      highlights: [
        'Full data preprocessing pipeline: null value imputation, categorical encoding, and feature normalization.',
        'Distribution analysis with histogram/KDE plots to identify skewness, kurtosis, and normality assumptions.',
        'Correlation heatmaps (Pearson & Spearman) revealing multi-variable relationships and feature dependencies.',
        'IQR and Z-score based outlier detection with visual box plots and flagged anomaly reports.',
        'Linear and polynomial regression models with R² and RMSE evaluation metrics for predictive performance.'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Statistical Modeling', 'Data Preprocessing'],
      repoLink: 'https://github.com/namana-shankar'
    }
  };

  // Grab modal dialog and its populated target elements
  const projectModal = document.getElementById('project-modal');
  const modalWindowId = document.getElementById('modal-window-id');
  const modalImg = document.getElementById('modal-project-img');
  const modalCategory = document.getElementById('modal-project-category');
  const modalQuestNum = document.getElementById('modal-project-quest');
  const modalDuration = document.getElementById('modal-project-duration');
  const modalTitle = document.getElementById('modal-project-title');
  const modalTagline = document.getElementById('modal-project-tagline');
  const modalDescription = document.getElementById('modal-project-description');
  const modalHighlights = document.getElementById('modal-project-highlights');
  const modalTech = document.getElementById('modal-project-tech');
  const modalRepoLink = document.getElementById('modal-repo-link');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');

  /**
   * Opens the project modal and populates it with the specified project's data.
   * This is the core connection between a thumbnail and its detail view.
   * @param {string} projectId - Matches a key in projectsData (e.g. "project-solar")
   */
  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    // Populate the modal fields from the project data dictionary
    if (modalWindowId)    modalWindowId.textContent    = data.windowId;
    if (modalImg)         { modalImg.src = data.img; modalImg.alt = data.title; }
    if (modalCategory)    modalCategory.textContent    = data.category;
    if (modalQuestNum)    modalQuestNum.textContent     = data.questNum;
    if (modalDuration)    modalDuration.textContent     = data.duration;
    if (modalTitle)       modalTitle.textContent        = data.title;
    if (modalTagline)     modalTagline.textContent      = data.tagline;
    if (modalDescription) modalDescription.textContent = data.description;
    if (modalRepoLink)    modalRepoLink.href            = data.repoLink;

    // Build highlights bullet list dynamically
    if (modalHighlights) {
      modalHighlights.innerHTML = data.highlights
        .map(h => `<li>${h}</li>`)
        .join('');
    }

    // Build tech chip tags dynamically
    if (modalTech) {
      modalTech.innerHTML = data.tech
        .map(t => `<span class="modal-tech-chip">${t}</span>`)
        .join('');
    }

    // Open the native <dialog> element — browser handles focus trap & Escape key
    projectModal.showModal();
    playPixelBeep(440, 880); // 8-bit open chime
  }

  /** Closes the modal dialog with a retro close blip */
  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.close();
    playPixelBeep(880, 440); // descending close blip
  }

  // Wire up thumbnail wrappers and title buttons: click → open matching modal
  // Connection: [data-project-target] value is used as the key into projectsData
  document.querySelectorAll('[data-project-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const projectId = trigger.getAttribute('data-project-target');
      openProjectModal(projectId);
    });
    // Keyboard accessibility: Enter / Space on focusable thumbnail divs
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = trigger.getAttribute('data-project-target');
        openProjectModal(projectId);
      }
    });
  });

  // Close button (X in titlebar)
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Dismiss button (CLOSE WINDOW in footer)
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeProjectModal);
  }

  // Click on backdrop (outside modal window) closes the modal
  if (projectModal) {
    projectModal.addEventListener('click', e => {
      const rect = projectModal.getBoundingClientRect();
      const clickedOutside = (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom
      );
      if (clickedOutside) closeProjectModal();
    });
  }

  // -------------------------------------------------------------------------
  // 10. VIDEO SHOWCASE SECTION: PLAY / PAUSE PIXEL BUTTON OVERLAY
  // -------------------------------------------------------------------------
  const videoEl = document.getElementById('showcase-video');
  const videoPlayBtn = document.getElementById('video-play-btn');
  const videoOverlay = document.getElementById('video-play-overlay');

  if (videoEl && videoPlayBtn && videoOverlay) {
    // Toggle play/pause via the custom pixel button
    videoPlayBtn.addEventListener('click', () => {
      if (videoEl.paused) {
        videoEl.play();
        videoPlayBtn.textContent = '⏸ PAUSE';
        videoOverlay.classList.add('hidden');
        playPixelBeep(440, 660);
      } else {
        videoEl.pause();
        videoPlayBtn.textContent = '▶ PLAY';
        videoOverlay.classList.remove('hidden');
        playPixelBeep(660, 440);
      }
    });

    // Click on the overlay itself also plays the video
    videoOverlay.addEventListener('click', () => {
      videoEl.play();
      videoPlayBtn.textContent = '⏸ PAUSE';
      videoOverlay.classList.add('hidden');
      playPixelBeep(440, 660);
    });

    // Restore overlay when video ends naturally
    videoEl.addEventListener('ended', () => {
      videoPlayBtn.textContent = '▶ PLAY';
      videoOverlay.classList.remove('hidden');
    });
  }

  // -------------------------------------------------------------------------
  // 11. CHAT SIMULATOR (AI INTERACTION)
  // -------------------------------------------------------------------------
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const promptButtons = document.querySelectorAll('.btn-prompt');

  // Dummy response logic (In a real app, replace with an API call like OpenAI)
  const generateResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('languages') || lowerMsg.includes('core')) {
      return "My core languages include Python, JavaScript/TypeScript, and C++. I also have experience with SQL for data management.";
    }
    if (lowerMsg.includes('solar')) {
      return "The Smart Solar Street Light System is an IoT project using ESP32 to optimize energy based on ambient light and motion. Check the Projects section for details!";
    }
    if (lowerMsg.includes('open') || lowerMsg.includes('availability') || lowerMsg.includes('full-time')) {
      return "I am currently looking for full-time engineering opportunities where I can apply my skills in software development and data science.";
    }
    return "That's an interesting question! While I am currently a simulated assistant, you can contact Namana directly via the links in the footer for more details.";
  };

  const appendMessage = (sender, text, isUser = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msgDiv.innerHTML = `
      <span class="chat-sender">[${sender}]:</span>
      <span class="chat-body">${text}</span>
    `;
    chatMessages.appendChild(msgDiv);
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if(!isUser) playPixelBeep(550, 400); // sound effect for bot reply
  };

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;
      
      // Append user message
      appendMessage('USER', userText, true);
      chatInput.value = '';
      playPixelBeep(700, 800); // sound effect for sending
      
      // Simulate network delay before AI response
      setTimeout(() => {
        // TODO: Integrate actual API (e.g., fetch request to a backend calling OpenAI) here
        const responseText = generateResponse(userText);
        appendMessage('NAMANA_BOT', responseText, false);
      }, 600);
    });

    promptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        chatInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      });
    });
  }

  // -------------------------------------------------------------------------
  // 12. CONTACT FORM — CLIENT-SIDE VALIDATION + SUBMIT HANDLER
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const cfStatus   = document.getElementById('cf-status');

  /**
   * Validates a single field. Sets .input-error and fills the error span.
   * Returns true if valid, false if not.
   */
  function validateField(input, errSpan, message) {
    if (!input) return true;
    if (!input.value.trim() || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))) {
      input.classList.add('input-error');
      if (errSpan) errSpan.textContent = message;
      return false;
    }
    input.classList.remove('input-error');
    if (errSpan) errSpan.textContent = '';
    return true;
  }

  if (contactForm && cfStatus) {
    // Live validation on blur (focus leaving a field)
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => {
        const errId = input.id + '-err';
        const errSpan = document.getElementById(errId);
        if (input.type === 'email') {
          validateField(input, errSpan, 'Please enter a valid email address.');
        } else {
          validateField(input, errSpan, 'This field is required.');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playPixelBeep(700, 850);

      const nameInput    = document.getElementById('cf-name');
      const emailInput   = document.getElementById('cf-email');
      const subjectInput = document.getElementById('cf-subject');
      const msgInput     = document.getElementById('cf-message');
      const submitBtn    = document.getElementById('cf-submit-btn');

      // Validate all fields
      const valid = [
        validateField(nameInput,    document.getElementById('cf-name-err'),    'Name is required.'),
        validateField(emailInput,   document.getElementById('cf-email-err'),   'Please enter a valid email address.'),
        validateField(subjectInput, document.getElementById('cf-subject-err'), 'Subject is required.'),
        validateField(msgInput,     document.getElementById('cf-message-err'), 'Message is required.'),
      ].every(Boolean);

      if (!valid) return;

      // ── API INTEGRATION POINT ────────────────────────────────────────────
      // Replace the simulated success below with a real fetch call, e.g.:
      //
      // Option A – Formspree (free tier, no backend needed):
      //   contactForm.setAttribute('action', 'https://formspree.io/f/YOUR_FORM_ID');
      //   contactForm.submit(); // let Formspree handle the POST
      //
      // Option B – EmailJS (client-side, no backend):
      //   emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm)
      //     .then(() => showStatus('success', '...'))
      //     .catch(() => showStatus('error', '...'));
      //
      // Option C – Custom backend / serverless function:
      //   fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
      //     .then(r => r.ok ? showStatus('success', ...) : showStatus('error', ...));
      // ────────────────────────────────────────────────────────────────────

      // Simulated loading state
      submitBtn.textContent = '⏳ TRANSMITTING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Simulated success response
        cfStatus.className = 'form-status success';
        cfStatus.textContent = '✓ Message transmitted successfully! Namana will respond within 24 hours.';
        playPixelBeep(440, 660);
        contactForm.reset();
        submitBtn.textContent = '▶ TRANSMIT MESSAGE';
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // -------------------------------------------------------------------------
  // 13. AUTO-UPDATE FOOTER COPYRIGHT YEAR
  // -------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

}); // End DOMContentLoaded
