document.addEventListener('DOMContentLoaded', function() {
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
                    portraitHtml = `<img src="${fields.Photo[0].url}" alt="${fields.Name || 'Community member'}">`;
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
                imageHtml = `<img src="${fields.Photo[0].url}" alt="${fields.Name || 'Storyteller'}">`;
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