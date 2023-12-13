document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('navLinks');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    let menuData = [
        // Assuming you have access to the menu data. Replace this with actual data fetching logic.
        { identifier: 'events', name: 'Events', url: '/events/index.html', weight: 10 },
        { identifier: 'about', name: 'About', url: '/about/index.html', weight: 20 },
        // Add other menu items here...
    ];

    // Function to create a single navigation link
    function createNavLink(item) {
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.name;
        link.className = 'px-4 py-2 mt-2 text-sm font-semibold rounded-lg md:mt-0 md:ml-4 hover:text-spark focus:text-white hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:shadow-outline';
        return link;
    }

    // Populate the navigation container
    menuData.forEach(item => {
        navContainer.appendChild(createNavLink(item));
    });

    // Mobile Menu Toggle SVG
    mobileMenuToggle.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>';

    // Mobile Menu Toggle functionality
    mobileMenuToggle.addEventListener('click', function() {
        navContainer.classList.toggle('hidden');
    });

    // Additional logic for theme toggle and other interactive elements can be added here.
});
