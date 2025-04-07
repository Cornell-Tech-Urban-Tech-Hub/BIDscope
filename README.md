# Dense Street Imagery (DSI) Project Website

This is the official website for the Dense Street Imagery (DSI) academic project from Cornell Tech. Built with [Astro](https://astro.build/), the site showcases our research on visual data collection from "digital eyes on the street" including dashcams and autonomous vehicle systems.

## About Dense Street Imagery

Dense Street Imagery (DSI) represents a breakthrough in visual urban data collection, combining advanced vehicle hardware, imaging technology, and networking capabilities to create dynamic, real-time depictions of city environments. Unlike traditional static snapshots from services like Google Street View, DSI leverages temporal density through networked dashcams and driver-assist systems to deliver fresh, continuous imagery at unprecedented frequency.

This project is under review for FAccT '25: ACM Conference on Fairness, Accountability, and Transparency.

## Development

### Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                             |
| :-------------------- | :------------------------------------------------- |
| `pnpm install`        | Installs dependencies                              |
| `pnpm dev`            | Starts local dev server at `localhost:4321`        |
| `pnpm build`          | Build your production site to `./dist/`            |
| `pnpm preview`        | Preview your build locally, before deploying       |
| `pnpm astro ...`      | Run CLI commands like `astro add`, `astro preview` |
| `pnpm astro --help`   | Get help using the Astro CLI                       |

## Technical Overview

### Built with Astro

This website is built using Astro, a modern static site generator that delivers excellent performance by shipping minimal JavaScript.

### TailwindCSS

The site uses TailwindCSS for styling, a utility-first CSS framework that enables rapid UI development.

### Components

The website features several custom components:
- Stats highlight section showing the scale of digital eyes data
- Application cards for DSI use cases
- Comparison section between DSI and traditional street imagery
- Team member display grid with responsive layout

## Project Structure

- `/src/pages/` - Page templates including the main index
- `/src/components/` - UI components organized by function
- `/src/layouts/` - Layout templates for consistent page structure
- `/public/` - Static assets like team member images and logos

## Resources

- [Paper Link](https://doi.org/10.1145/3706598.3714009)

## Team

- Matt Franchi - Computer Science PhD Candidate
- Hauke Sandhaus - Information Science PhD Candidate
- Madiha Zahrah Choksi - Information Science PhD Candidate
- Severin Engelmann - Digital Life Initiative Postdoctoral Associate
- Wendy Ju - Associate Professor
- Helen Nissenbaum - Professor / Director of Digital Life Initiative