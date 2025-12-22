# WatchAnime

A modern, responsive anime discovery and streaming information platform built with Next.js 15 and Tailwind CSS 4. This application features a premium glassmorphic UI, real-time search capabilities, and integration with the Kitsu API.

## 🌟 Features

- **Modern UI/UX**: Designed with a sleek, dark-themed glassmorphic aesthetic focusing on depth, transparency, and smooth animations.
- **Discover Anime**: Browse Trending, Most Popular, Top Rated, and Upcoming anime series.
- **Detailed Information**: View comprehensive details including synopsis, ratings, episodes, characters, and related anime.
- **Advanced Search**: Robust search functionality with real-time filtering by status, age rating, season, year, and sorting options.
- **Watch Experience**: A mock episode player interface with a highly interactive episode selector.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Accessibility**: Built with accessibility in mind, including proper ARIA attributes and keyboard navigation.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: JavaScript / React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/)
- **Data Fetching**: [SWR](https://swr.vercel.app/) & Native Fetch
- **API**: [Kitsu API](https://kitsu.docs.apiary.io/)
- **Utilities**: query-string, axios

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
│   ├── api/                # Internal API routes acting as proxy
│   ├── search/             # Search page with filters
│   ├── watch/              # Watch page with player and details
│   ├── globals.css         # Global styles and tailwind directives
│   ├── layout.jsx          # Root layout
│   └── page.jsx            # Homepage (Hero + Categories)
├── components/             # Reusable React components
│   ├── features/           # Feature-specific components (AnimeCard, etc.)
│   ├── layout/             # Layout components (Navbar, Footer, Hero)
│   ├── status/             # Status indicators (Loading, Error)
│   └── ui/                 # Generic UI components (Select, Buttons)
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
- [Vercel](https://vercel.com/) for Next.js and hosting solutions.
