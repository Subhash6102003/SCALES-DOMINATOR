# Scales Dominator Website

A modern, dark-themed website for Scales Dominator with advanced animations and visual effects.

## Features

- **Dark Theme**: Black and white color scheme with various shades
- **Three.js Background**: Animated 3D particle background
- **Particle.js**: Interactive particle system
- **GSAP Animations**: Smooth scroll-triggered animations
- **Particle Effects on Headings**: Interactive particle effects when hovering over headings
- **Responsive Design**: Fully responsive for all devices
- **Custom Fonts**: Orbitron, Rajdhani, and Space Grotesk fonts

## Technologies Used

- HTML5
- CSS3
- JavaScript
- GSAP (GreenSock Animation Platform)
- Three.js
- Particle.js

## Setup

1. Open `index.html` in a modern web browser
2. No build process required - works directly in the browser

## Browser Requirements

- Modern browser with ES6+ support
- WebGL support (for Three.js)
- Canvas API support (for Particle.js)

## Features Breakdown

### Animations
- Three.js 3D particle system in the background
- Particle.js interactive particle network
- GSAP scroll-triggered animations for all sections
- Custom particle effects on heading hover

### Styling
- Dark theme with black (#000000) as primary color
- White and gray shades for contrast
- Custom fonts for headings (Orbitron) and body text (Rajdhani, Space Grotesk)
- Black and white icons only

### Interactive Elements
- Smooth scrolling navigation
- Hover effects on all interactive elements
- Particle effects on headings
- Responsive mobile menu

## File Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript for animations and interactions
└── README.md       # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-black: #000000;
    --primary-white: #ffffff;
    /* ... */
}
```

### Animations
Modify animation parameters in `script.js` for:
- Three.js particle count and behavior
- Particle.js configuration
- GSAP animation timings
- Heading particle effects

## Notes

- All icons are styled to be black and white only
- Headings use custom fonts that resemble logo styling
- Particle effects activate on hover over any heading with class `particle-heading`
- Background animations are optimized for performance

