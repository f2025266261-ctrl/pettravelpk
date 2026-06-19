document.addEventListener('DOMContentLoaded', () => {
	const siteHeader = document.querySelector('[data-site-header]');
	const navToggle = document.querySelector('[data-nav-toggle]');
	const mobileNav = document.querySelector('[data-mobile-nav]');
	const navLinks = document.querySelectorAll('.navbar__link, .mobile-nav__link');
	const heroSection = document.querySelector('.hero--media');
	const heroVideo = document.querySelector('.hero__video');
	const statsSection = document.querySelector('[data-stats-section]');
	const statNumbers = document.querySelectorAll('[data-count-to]');
	const faqItems = document.querySelectorAll('.faq-item');
	const revealElements = document.querySelectorAll('.reveal');
	const sections = document.querySelectorAll('section[id]');
	const pricingToggle = document.getElementById('pricing-toggle');
	const contactForm = document.getElementById('contact-form');
	const contactSuccess = document.getElementById('contact-success');

	const staggerContainers = [
		'.process__steps',
		'.services__grid',
		'.stats__inner',
		'.team__grid',
		'.testimonials__grid',
	];

	const setScrollState = () => {
		if (!siteHeader) {
			return;
		}

		siteHeader.classList.toggle('is-scrolled', window.scrollY > 80);
	};

	const closeMobileNav = () => {
		if (!navToggle || !mobileNav) {
			return;
		}

		mobileNav.classList.remove('is-open');
		mobileNav.hidden = true;
		navToggle.setAttribute('aria-expanded', 'false');
	};

	const openMobileNav = () => {
		if (!navToggle || !mobileNav) {
			return;
		}

		mobileNav.hidden = false;
		requestAnimationFrame(() => {
			mobileNav.classList.add('is-open');
		});
		navToggle.setAttribute('aria-expanded', 'true');
	};

	const setActiveNav = (sectionId) => {
		navLinks.forEach((link) => {
			const isMatch = link.getAttribute('href') === `#${sectionId}`;
			link.classList.toggle('active', isMatch);
			link.classList.toggle('is-active', isMatch);
		});
	};

	const setHeroVideoFallback = () => {
		if (heroSection) {
			heroSection.classList.add('hero--video-fallback');
		}
	};

	staggerContainers.forEach((selector) => {
		const container = document.querySelector(selector);

		if (!container) {
			return;
		}

		[...container.children].forEach((child, index) => {
			if (child.classList.contains('reveal')) {
				child.dataset.i = String(index);
				child.style.setProperty('--i', String(index));
			}
		});
	});

	if (revealElements.length && 'IntersectionObserver' in window) {
		const revealObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			});
		}, {
			threshold: 0.15,
			rootMargin: '0px 0px -40px 0px',
		});

		revealElements.forEach((element) => revealObserver.observe(element));
	} else {
		revealElements.forEach((element) => element.classList.add('visible'));
	}

	if (sections.length && 'IntersectionObserver' in window) {
		const sectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				entry.target.classList.toggle('is-in-view', entry.isIntersecting);
			});

			const visibleSections = [...sections].filter((section) => section.classList.contains('is-in-view'));
			const activeSection = visibleSections[visibleSections.length - 1];

			if (activeSection) {
				setActiveNav(activeSection.id);
			}
		}, {
			threshold: 0.5,
		});

		sections.forEach((section) => sectionObserver.observe(section));
	}

	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', (event) => {
			const targetId = anchor.getAttribute('href');

			if (!targetId || targetId === '#') {
				return;
			}

			const target = document.querySelector(targetId);

			if (!target) {
				return;
			}

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth' });
		});
	});

	if (pricingToggle) {
		pricingToggle.addEventListener('change', () => {
			document.querySelectorAll('.price-domestic').forEach((element) => element.classList.toggle('hidden'));
			document.querySelectorAll('.price-international').forEach((element) => element.classList.toggle('hidden'));
		});
	}

	if (contactForm && contactSuccess) {
		const phonePattern = /^03[0-9]{9}$/;

		const contactFields = [
			{
				input: document.getElementById('contact-name'),
				error: document.getElementById('contact-name-error'),
				message: 'Please enter your full name.',
			},
			{
				input: document.getElementById('contact-phone'),
				error: document.getElementById('contact-phone-error'),
				message: 'Please enter a valid phone number (03XXXXXXXXX).',
				validate: (value) => phonePattern.test(value.replace(/\s/g, '')),
			},
			{
				input: document.getElementById('contact-pet-type'),
				error: document.getElementById('contact-pet-type-error'),
				message: 'Please select a pet type.',
			},
			{
				input: document.getElementById('contact-service'),
				error: document.getElementById('contact-service-error'),
				message: 'Please select a service.',
			},
			{
				input: document.getElementById('contact-message'),
				error: document.getElementById('contact-message-error'),
				message: 'Please enter your message.',
			},
		].filter((field) => field.input && field.error);

		const clearFieldError = (field) => {
			field.input.classList.remove('is-error');
			field.error.textContent = '';
		};

		const setFieldError = (field, message) => {
			field.input.classList.add('is-error');
			field.error.textContent = message;
		};

		contactFields.forEach((field) => {
			const eventName = field.input.tagName === 'SELECT' ? 'change' : 'input';

			field.input.addEventListener(eventName, () => clearFieldError(field));
		});

		contactForm.addEventListener('submit', (event) => {
			event.preventDefault();

			let isValid = true;

			contactFields.forEach((field) => {
				clearFieldError(field);

				const value = field.input.value.trim();
				const passesCustomValidation = field.validate ? field.validate(value) : Boolean(value);

				if (!passesCustomValidation) {
					setFieldError(field, field.message);
					isValid = false;
				}
			});

			if (!isValid) {
				const firstInvalid = contactFields.find((field) => field.input.classList.contains('is-error'));

				firstInvalid?.input.focus();
				return;
			}

			contactForm.classList.add('hidden');
			contactForm.hidden = true;
			contactSuccess.classList.remove('hidden');
			contactSuccess.hidden = false;
		});
	}

	if (heroVideo) {
		heroVideo.addEventListener('error', setHeroVideoFallback);
		heroVideo.addEventListener('stalled', setHeroVideoFallback);
		heroVideo.addEventListener('loadeddata', () => {
			heroSection?.classList.remove('hero--video-fallback');
		});

		if (heroVideo.readyState === 0) {
			window.setTimeout(() => {
				if (heroVideo.readyState === 0) {
					setHeroVideoFallback();
				}
			}, 1200);
		}
	}

	if (navToggle && mobileNav) {
		navToggle.addEventListener('click', () => {
			const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

			if (isOpen) {
				closeMobileNav();
				return;
			}

			openMobileNav();
		});
	}

	const animateStat = (element, duration) => {
		const target = Number(element.dataset.countTo || '0');
		const suffix = element.dataset.suffix || '';
		const startTime = performance.now();

		const tick = (time) => {
			const elapsed = time - startTime;
			const t = Math.min(elapsed / duration, 1);
			const progress = 1 - Math.pow(1 - t, 3);
			const value = Math.floor(target * progress);

			element.textContent = `${value.toLocaleString()}${suffix}`;

			if (t < 1) {
				requestAnimationFrame(tick);
			}
		};

		requestAnimationFrame(tick);
	};

	if (statsSection && statNumbers.length && 'IntersectionObserver' in window) {
		const statsObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				statNumbers.forEach((number) => animateStat(number, 2000));
				observer.disconnect();
			});
		}, {
			threshold: 0.35,
			rootMargin: '0px 0px -60px 0px',
		});

		statsObserver.observe(statsSection);
	} else {
		statNumbers.forEach((number) => {
			const target = Number(number.dataset.countTo || '0');
			const suffix = number.dataset.suffix || '';
			number.textContent = `${target.toLocaleString()}${suffix}`;
		});
	}

	const closeFaqItem = (item) => {
		const trigger = item.querySelector('.faq-item__trigger');
		const panel = item.querySelector('.faq-item__panel');
		const hideTimer = item.dataset.hideTimer;

		if (hideTimer) {
			window.clearTimeout(Number(hideTimer));
			delete item.dataset.hideTimer;
		}

		item.classList.remove('is-open');
		trigger?.setAttribute('aria-expanded', 'false');

		if (panel) {
			panel.style.maxHeight = '0px';
			const timerId = window.setTimeout(() => {
				panel.hidden = true;
				delete item.dataset.hideTimer;
			}, 350);

			item.dataset.hideTimer = String(timerId);
		}
	};

	const openFaqItem = (item) => {
		const trigger = item.querySelector('.faq-item__trigger');
		const panel = item.querySelector('.faq-item__panel');

		if (!panel || !trigger) {
			return;
		}

		item.classList.add('is-open');
		trigger.setAttribute('aria-expanded', 'true');
		panel.hidden = false;
		panel.style.maxHeight = '500px';
	};

	faqItems.forEach((item) => {
		const trigger = item.querySelector('.faq-item__trigger');
		const panel = item.querySelector('.faq-item__panel');

		if (!trigger || !panel) {
			return;
		}

		panel.hidden = true;
		panel.style.maxHeight = '0px';

		trigger.addEventListener('click', () => {
			const isOpen = item.classList.contains('is-open');

			faqItems.forEach((otherItem) => {
				if (otherItem !== item && otherItem.classList.contains('is-open')) {
					closeFaqItem(otherItem);
				}
			});

			if (isOpen) {
				closeFaqItem(item);
				return;
			}

			openFaqItem(item);
		});
	});

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			const href = link.getAttribute('href');

			if (href?.startsWith('#') && href.length > 1) {
				setActiveNav(href.slice(1));
			}

			closeMobileNav();
		});
	});

	window.addEventListener('scroll', setScrollState, { passive: true });
	window.addEventListener('resize', () => {
		if (window.innerWidth > 768) {
			closeMobileNav();
		}
	});

	setScrollState();
});
