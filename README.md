# Country Corridor Website

A simple but impactful website for the Country Corridor initiative, which connects and amplifies the work of First Nations leaders across communities between Alice Springs and Tennant Creek.

## Overview

This website showcases the Country Corridor initiative, highlighting:
- The vision for connected First Nations communities
- Voices and stories from community members
- The initiative's approach and core components
- Success stories from existing projects
- The network effect of connecting communities
- A gallery of storytellers from the community
- Ways to get involved

## Structure

The website consists of:
- **index.html**: Main content and structure
- **styles.css**: Styling and responsive design
- **script.js**: Interactive elements (navigation, carousel, animations)

## Features

- Responsive design that works across all devices
- Interactive carousel for success stories
- Smooth scroll navigation
- Animated sections on scroll
- Mobile-friendly navigation
- Dynamic storytellers gallery integrated with Airtable

## Getting Started

To view the website locally:

1. Clone or download this repository
2. Open `index.html` in your web browser

## Customization

### Adding Real Images

Replace the placeholder elements with actual images:
- For the hero section, add a video file to `/videos/country-corridor-aerial.mp4`
- For community portraits, replace the `.portrait` divs with actual images
- For success story images, replace the `.story-image` divs with actual images
- Add partner logos to the footer section

### Airtable Integration

The website connects to an Airtable database to display the Storytellers gallery:

1. **Table Structure**: The integration expects a table called "Storytellers" with the following fields:
   - `Name`: The storyteller's name
   - `Location`: Where they're from
   - `Description`: A brief description or quote
   - `Themes`: Key themes from their conversation (can be multiple values)
   - `Photo`: Image attachments

2. **Updating Data**: To add or update storytellers, simply modify the data in your Airtable:
   - Add new rows to include more storytellers
   - Update existing rows to modify content
   - The website will automatically reflect the changes when refreshed

3. **Configuration**: The Airtable API key is included in the JavaScript file. For security in a production environment, consider:
   - Moving the API key to environment variables
   - Setting up a backend proxy to handle the Airtable requests

### Adding Content

The website structure is designed to be easily updated with new content:
- Add new community voices by duplicating the `.voice-card` elements
- Add new success stories by duplicating the `.story-card` elements
- Update contact information in the contact section

## Future Enhancements

Potential improvements for the future:
- Add a blog/news section for regular updates
- Implement a contact form for inquiries
- Create a gallery of community activities
- Add interactive map functionality
- Add pagination for the storytellers gallery for improved performance with large datasets
- Implement a caching mechanism for Airtable data

## Credits

This website was created for the Country Corridor initiative, bringing together the work of:
- A Curious Tractor
- The Snow Foundation
- Wilya Janta
- Other community partners 