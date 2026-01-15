# WatchAnime

A modern, responsive anime discovery and streaming information platform built with Next.js 15, Tailwind CSS 4, and **shadcn/ui**. This application features a premium glassmorphic UI, real-time search capabilities, and deep integration with the Kitsu API to provide a comprehensive anime database experience.

## 🌟 Features

### 🎨 Modern UI/UX
- **Glassmorphic Aesthetic**: Sleek, dark-themed design focusing on depth, transparency, and smooth animations.
- **shadcn/ui Integration**: Built with robust, accessible components (Select, Skeleton, Cards, etc.).
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

### 🔍 Discovery & Content
- **Browse Categories**: Trending, Most Popular, Top Rated, and Upcoming anime series.
- **Advanced Search**: Real-time filtering by status, age rating, season, year, and sorting options.
- **Franchise Tracking**: Visualize the entire series timeline, including sequels, prequels, and spin-offs.

### 📄 Comprehensive Details
- **Deep Information**: Synopsis, ratings, rankings, and production studio highlights.
- **Character & Voice Actors**: Detailed character cards featuring Japanese voice actors (Seiyuu).
- **Community Reviews**: Read user reviews with spoiler protection and markdown formatting.
- **Memorable Quotes**: Curated list of iconic lines from the series.
- **Streaming Links**: Direct links to official streaming platforms (Crunchyroll, Netflix, Hulu, etc.).

### 📺 Watch Experience
- **Interactive Player**: A mock episode player interface with a responsive episode selector.
- **Mobile Optimized**: Enhanced controls and layout for viewing on smaller screens.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: JavaScript / React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: Native Fetch with deduplication and chunking strategies
- **API**: [Kitsu API](https://kitsu.docs.apiary.io/) & Jikan API (Fallback)
- **Utilities**: query-string, tailwind-merge, clsx

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/adam-ctrlc/watchanime-fullstack.git
    cd watchanime-fullstack
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  **Open locally**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # Internal API routes (proxy + logic)
│   │   └── v1/anime/       # Deep data routes (franchise, reviews, etc.)
│   ├── detail/             # Detailed info page before watching
│   ├── search/             # Search page with filters
│   ├── watch/              # Watch page with player and sidebars
│   ├── globals.css         # Global styles and tailwind directives
│   ├── layout.jsx          # Root layout
│   └── page.jsx            # Homepage (Hero + Categories)
├── components/             # Reusable React components
│   ├── features/           # Feature-specific components (AnimeCard, etc.)
│   ├── layout/             # Layout components (Navbar, Footer, Hero)
│   ├── status/             # Status indicators (Loading, Error)
│   └── ui/                 # shadcn/ui components (Button, Select, etc.)
└── lib/                    # Utility functions
```

## 🎨 Design System

The application uses a custom design system built on top of Tailwind CSS, featuring:

- **Colors**: A palette centered around rich purples (`purple-500`, `purple-600`) and deep blacks (`#121212`) for a cinematic feel.
- **Glassmorphism**: Extensive use of `backdrop-blur`, transparent backgrounds (`bg-white/5`, `bg-black/20`), and subtle borders (`border-white/10`) to create depth.
- **Typography**: Clean, sans-serif typography ensuring readability across all devices.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE.md).

## 🙏 Acknowledgements

- [Kitsu.io](https://kitsu.io/) for providing the extensive anime database API.
- [Jikan API](https://jikan.moe/) for supplemental character data (MyAnimeList).
- [Vercel](https://vercel.com/) for Next.js and hosting solutions.
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library.
