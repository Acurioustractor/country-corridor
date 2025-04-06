document.addEventListener('DOMContentLoaded', function() {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // YouTube Player
    let player;
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            videoId: 'mO7a6zXOjJQ', // The Country Corridor video
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'loop': 1,
                'playlist': 'mO7a6zXOjJQ', // Needed for looping
                'mute': 1,
                'playsinline': 1,
                'modestbranding': 1,
                'iv_load_policy': 3,
                'disablekb': 1,
                'origin': window.location.origin,
                'enablejsapi': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    };
    
    function onPlayerReady(event) {
        // Force play video
        event.target.playVideo();
        // Ensure the video is muted (required for autoplay)
        event.target.mute();
        
        // Attempt to play again if needed after a short delay
        setTimeout(function() {
            if (player && player.getPlayerState() !== YT.PlayerState.PLAYING) {
                player.playVideo();
            }
        }, 2000);
    }
    
    function onPlayerStateChange(event) {
        // If video ends, restart it
        if (event.data === YT.PlayerState.ENDED) {
            event.target.playVideo();
        } else if (event.data === YT.PlayerState.PAUSED) {
            // If somehow paused, resume playing
            setTimeout(function() {
                event.target.playVideo();
            }, 500);
        }
    }
    
    function onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        // Try to recover from error by recreating the player
        if (player) {
            setTimeout(function() {
                player.destroy();
                onYouTubeIframeAPIReady();
            }, 2000);
        }
    }

    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            
            // Burger animation
            burger.classList.toggle('toggle');
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = '#fff';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            }
        });
    }
    
    // Parallax effect on hero section
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.2;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
    
    // Waypoints navigation
    const waypoints = document.querySelectorAll('.waypoint');
    const sections = document.querySelectorAll('section, .hero-container');
    const progressBar = document.querySelector('.waypoints-progress:before');
    
    function updateWaypoints() {
        if (!sections.length) return;
        
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollPercentage = (window.scrollY / (documentHeight - viewportHeight)) * 100;
        
        if (progressBar) {
            progressBar.style.transform = `scaleY(${scrollPercentage / 100})`;
        }
        
        // Find the current section
        let currentSection = null;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
                break;
            }
        }
        
        // Update waypoints
        if (currentSection) {
            waypoints.forEach(waypoint => {
                if (waypoint.getAttribute('data-section') === currentSection) {
                    waypoint.classList.add('active');
                } else {
                    waypoint.classList.remove('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', updateWaypoints);
    updateWaypoints(); // Initialize waypoints
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const visionSection = document.getElementById('vision');
            if (visionSection) {
                window.scrollTo({
                    top: visionSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator when scrolling down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.visibility = 'hidden';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.visibility = 'visible';
            }
        });
    }
    
    // Scroll reveal animations
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
    
    function revealOnScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.85;
            
            if (elementTop < triggerPoint) {
                element.classList.add('visible');
            }
        });
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.75;
            
            if (sectionTop < triggerPoint) {
                section.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('resize', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Initialize interactive map
    initializeMap();
    
    // Function to initialize the map
    function initializeMap() {
        const mapContainer = document.getElementById('corridor-map');
        if (!mapContainer) return;
        
        // Load the Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        leafletCSS.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
        
        // Load the Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        leafletScript.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
        leafletScript.crossOrigin = '';
        
        leafletScript.onload = function() {
            // Create map
            const map = L.map('corridor-map').setView([-21.5, 134.5], 6); // Centered on Central Australia
            
            // Add tile layer (map background)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Define community locations
            const communities = [
                {
                    name: 'Alice Springs',
                    location: [-23.7, 133.88],
                    type: 'community',
                    description: 'Major town in the Northern Territory of Australia.',
                    details: 'Alice Springs serves as a hub for many Central Australian communities and is home to several important First Nations organizations.'
                },
                {
                    name: 'Tennant Creek',
                    location: [-19.65, 134.19],
                    type: 'community',
                    description: 'Town in the Northern Territory of Australia.',
                    details: 'Tennant Creek is a significant location along the Country Corridor, with many First Nations community members and initiatives.'
                },
                {
                    name: 'Ti Tree',
                    location: [-22.13, 133.42],
                    type: 'community',
                    description: 'Small community between Alice Springs and Tennant Creek.',
                    details: 'Ti Tree is an important stop along the corridor with a strong First Nations presence.'
                },
                {
                    name: 'Wilya Janta Housing',
                    location: [-19.8, 134.1],
                    type: 'project',
                    description: 'Innovative housing project led by Warumungu Elders.',
                    details: 'This project combines cultural knowledge with sustainable building practices to create housing that truly meets community needs.'
                },
                {
                    name: 'The Goods Project',
                    location: [-22.9, 133.7],
                    type: 'project',
                    description: 'Manufacturing high-quality bedding from recycled materials.',
                    details: 'Addressing waste challenges while creating essential items and local employment opportunities.'
                },
                {
                    name: 'Oonchiumpa',
                    location: [-23.6, 133.9],
                    type: 'project',
                    description: 'Aboriginal-owned youth support organization.',
                    details: 'Using a "Two Cultures, One World, Working Together" approach to support at-risk youth and improve outcomes.'
                }
            ];
            
            // Add markers for communities and projects
            communities.forEach(place => {
                const markerClass = place.type === 'community' ? 'community-marker' : 'project-marker';
                const markerIcon = L.divIcon({
                    className: `marker ${markerClass}`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                });
                
                const marker = L.marker(place.location, {
                    icon: markerIcon,
                    title: place.name
                }).addTo(map);
                
                // Create popup content
                const popupContent = `
                    <div class="map-popup">
                        <h3>${place.name}</h3>
                        <p>${place.description}</p>
                        <p>${place.details}</p>
                        <div class="map-popup-actions">
                            <a href="#stories" class="map-popup-action">Related Stories</a>
                            <a href="#storytellers" class="map-popup-action">Meet People</a>
                        </div>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // Add hover animation
                marker.on('mouseover', function() {
                    this._icon.style.transform = 'scale(1.2) translate3d(0,0,0)';
                    this._icon.style.transition = 'transform 0.3s';
                });
                
                marker.on('mouseout', function() {
                    this._icon.style.transform = 'scale(1) translate3d(0,0,0)';
                });
            });
            
            // Add the corridor line connecting communities
            const corridorPath = [
                [-23.7, 133.88], // Alice Springs
                [-22.13, 133.42], // Ti Tree
                [-19.65, 134.19]  // Tennant Creek
            ];
            
            const corridorLine = L.polyline(corridorPath, {
                color: '#d35400',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineJoin: 'round'
            }).addTo(map);
            
            // Animate the corridor line
            let offset = 0;
            setInterval(() => {
                offset = (offset + 1) % 20;
                corridorLine.setStyle({
                    dashOffset: -offset
                });
            }, 100);
        };
        
        document.head.appendChild(leafletScript);
    }

    // Carousel functionality
    const storyCards = document.querySelectorAll('.story-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (storyCards.length > 0 && dots.length > 0) {
        let currentIndex = 0;
        
        // Initialize display
        updateCarousel();
        
        // Event listeners for navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + storyCards.length) % storyCards.length;
                updateCarousel();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % storyCards.length;
                updateCarousel();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Function to update carousel display
        function updateCarousel() {
            storyCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Auto-advance carousel
        setInterval(() => {
            currentIndex = (currentIndex + 1) % storyCards.length;
            updateCarousel();
        }, 7000);
    }

    // Airtable API configuration
    const airtableBaseId = 'app7G3Ae65pBblJke';
    const airtableTableName = 'tbl9zxLsGOd3fjWXp';
    const airtableViewId = 'viw75xVMkQsZhXgzw';
    const airtableApiKey = 'patn343QLEgDnD033.1b9fa9553af0b4c039b648612b304b93f94830d8570dcf71df9d7e3b4bbd03b4';

    // Featured Voices (Community Voices section)
    const featuredVoicesContainer = document.getElementById('featured-voices');
    
    if (featuredVoicesContainer) {
        // Function to fetch featured storytellers
        async function fetchFeaturedStorytellers() {
            try {
                // Fetch all storytellers from the view
                const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?view=${airtableViewId}`, {
                    headers: {
                        'Authorization': `Bearer ${airtableApiKey}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Airtable');
                }
                
                const data = await response.json();
                
                // Filter for Kirsty, Norman, and Dianne
                const featuredNames = ['Kirsty', 'Norman', 'Dianne'];
                const featuredStorytellers = data.records.filter(record => 
                    record.fields.Name && featuredNames.some(name => 
                        record.fields.Name.includes(name)
                    )
                );
                
                if (featuredStorytellers.length > 0) {
                    renderFeaturedVoices(featuredStorytellers);
                } else {
                    // If specific storytellers aren't found, use the first three
                    const firstThree = data.records.slice(0, 3);
                    renderFeaturedVoices(firstThree);
                }
            } catch (error) {
                console.error('Error fetching featured storytellers:', error);
                featuredVoicesContainer.innerHTML = `
                    <div class="error-message">
                        <p>Couldn't load community voices. Please try again later.</p>
                    </div>
                `;
            }
        }
        
        // Function to render featured voices
        function renderFeaturedVoices(storytellers) {
            const voicesHtml = storytellers.map(storyteller => {
                const fields = storyteller.fields;
                const storytellerId = storyteller.id;
                
                // Handle image
                let portraitHtml = '';
                if (fields.Photo && fields.Photo.length > 0) {
                    // Access the URL directly and use HTTPS
                    const photoUrl = fields.Photo[0].url.replace('http://', 'https://');
                    portraitHtml = `<img src="${photoUrl}" alt="${fields.Name || 'Community member'}" loading="lazy">`;
                }
                
                // Use the first quote or default text
                let quoteText = "No quote available";
                if (fields.Quotes && fields.Quotes.length > 0) {
                    quoteText = fields.Quotes[0];
                } else if (fields.Summary) {
                    quoteText = fields.Summary;
                }
                
                return `
                    <div class="voice-card">
                        <a href="storyteller.html?id=${storytellerId}" class="voice-card-link">
                            <div class="portrait">
                                ${portraitHtml}
                            </div>
                            <div class="quote">
                                <p>"${quoteText}"</p>
                                <cite>— ${fields.Name || 'Anonymous'}, ${fields.Location || 'Community member'}</cite>
                            </div>
                        </a>
                    </div>
                `;
            }).join('');
            
            featuredVoicesContainer.innerHTML = voicesHtml;
        }
        
        // Initialize featured voices
        fetchFeaturedStorytellers();
    }

    // Storytellers Gallery
    const storytellersGrid = document.querySelector('.storytellers-grid');
    const locationFilter = document.getElementById('location-filter');
    
    if (storytellersGrid) {
        // Variables to store data
        let allStorytellers = [];
        let uniqueLocations = new Set();
        
        // Function to fetch storytellers from Airtable
        async function fetchStorytellers() {
            try {
                const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?view=${airtableViewId}`, {
                    headers: {
                        'Authorization': `Bearer ${airtableApiKey}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Airtable');
                }
                
                const data = await response.json();
                return data.records;
            } catch (error) {
                console.error('Error fetching data:', error);
                storytellersGrid.innerHTML = `
                    <div class="error-message">
                        <p>Oops! We couldn't load the storytellers. Please try again later.</p>
                    </div>
                `;
                return [];
            }
        }
        
        // Function to create HTML for a storyteller card
        function createStorytellerCard(storyteller) {
            const fields = storyteller.fields;
            const storytellerId = storyteller.id;
            
            // Handle image
            let imageHtml = '';
            if (fields.Photo && fields.Photo.length > 0) {
                // Access the URL directly and use HTTPS
                const photoUrl = fields.Photo[0].url.replace('http://', 'https://');
                imageHtml = `<img src="${photoUrl}" alt="${fields.Name || 'Storyteller'}" loading="lazy">`;
            }
            
            // Handle themes
            let themesHtml = '';
            if (fields.Themes) {
                const themes = Array.isArray(fields.Themes) ? fields.Themes : [fields.Themes];
                themesHtml = themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('');
            }
            
            return `
                <div class="storyteller-card" data-location="${fields.Location || ''}">
                    <a href="storyteller.html?id=${storytellerId}" class="storyteller-link">
                        <div class="storyteller-image">
                            ${imageHtml}
                        </div>
                        <div class="storyteller-info">
                            <h3 class="storyteller-name">${fields.Name || 'Anonymous'}</h3>
                            <p class="storyteller-location">${fields.Location || 'Unknown Location'}</p>
                            <p class="storyteller-summary">${fields.Summary || ''}</p>
                            <div class="storyteller-themes">
                                ${themesHtml}
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }
        
        // Function to populate location filter
        function populateLocationFilter() {
            if (uniqueLocations.size > 0) {
                const options = Array.from(uniqueLocations).map(location => 
                    `<option value="${location}">${location}</option>`
                ).join('');
                
                locationFilter.innerHTML = `<option value="all">All Locations</option>${options}`;
            }
        }
        
        // Function to render storytellers
        function renderStorytellers(storytellers) {
            if (!storytellers || storytellers.length === 0) {
                storytellersGrid.innerHTML = `
                    <div class="empty-message">
                        <p>No storytellers found. Check back soon!</p>
                    </div>
                `;
                return;
            }
            
            const cardsHtml = storytellers.map(createStorytellerCard).join('');
            storytellersGrid.innerHTML = cardsHtml;
        }
        
        // Function to filter storytellers
        function filterStorytellers() {
            const selectedLocation = locationFilter.value;
            
            if (selectedLocation === 'all') {
                renderStorytellers(allStorytellers);
            } else {
                const filtered = allStorytellers.filter(storyteller => 
                    storyteller.fields.Location === selectedLocation
                );
                renderStorytellers(filtered);
            }
        }
        
        // Add event listener to location filter
        if (locationFilter) {
            locationFilter.addEventListener('change', filterStorytellers);
        }
        
        // Initialize storytellers section
        async function initializeStorytellers() {
            const records = await fetchStorytellers();
            
            if (records.length > 0) {
                allStorytellers = records;
                
                // Extract unique locations
                records.forEach(record => {
                    if (record.fields.Location) {
                        uniqueLocations.add(record.fields.Location);
                    }
                });
                
                // Populate filter and render storytellers
                populateLocationFilter();
                renderStorytellers(records);
            }
        }
        
        // Initialize
        initializeStorytellers();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                }
            }
        });
    });

    // Add animation classes when elements come into view
    const animateOnScroll = function() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    };
    
    // Initial check on load
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Add CSS class for animation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .burger.toggle .line2 {
            opacity: 0;
        }
        
        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .error-message, .empty-message {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .error-message p {
            color: #e74c3c;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}); 