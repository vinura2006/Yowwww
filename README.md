# 💍 Will You Be My Wife, Mindu? 💕

A romantic, interactive proposal website built with love 💖

## 🌟 Features

- **Emotional Journey**: From heartfelt intro to playful proposal
- **Mathematical Love Proof**: NO⁶ = YES (because math says so!)
- **Interactive Animations**: Floating hearts, confetti, ring sparkles
- **6-Attempt NO Button**: Evades your clicks until the math proof appears
- **Celebration Sequence**: Ring animation + typewriter text reveal
- **E-Card Generator**: Create and download personalized love notes
- **Fully Responsive**: Mobile-first, tested on all devices
- **Accessible**: WCAG 2.1 AA compliant, keyboard navigable
- **Easter Eggs**: Konami code, love calculator (always 100%!)

## 🚀 Quick Start

### Local Development

```bash
# Navigate to project
cd /home/vinura/Pictures/Mindulee2

# Option 1: Python server
python3 -m http.server 8000

# Option 2: Node serve
npx serve . -p 3000

# Option 3: Just open the file
# Double-click intro.html in your file manager

# Open browser
http://localhost:8000/intro.html
```

### Deploy to GitHub Pages

```bash
# Initialize git repo
git init
git add .
git commit -m "💍 Initial commit: Romantic proposal for Mindu"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/proposal-for-mindu.git
git branch -M main
git push -u origin main

# Enable GitHub Pages:
# 1. Go to repository Settings → Pages
# 2. Source: Deploy from branch
# 3. Branch: main / root
# 4. Save

# Your site will be at:
# https://YOUR_USERNAME.github.io/proposal-for-mindu/
```

## 📂 Project Structure

```
Mindulee2/
├── index.html          # Redirects to intro
├── intro.html          # Emotional landing page
├── proposal.html       # Main proposal with YES/NO buttons
├── gallery.html        # Photo gallery with lightbox
├── extras.html         # E-card generator & sharing
├── css/
│   └── style.css       # All styles (~950 lines)
├── js/
│   └── main.js         # All interactions (~700 lines)
├── assets/
│   └── images/         # Cat, ring, kissing cats, etc.
├── README.md           # This file
├── sitemap.xml         # SEO
└── robots.txt          # Search engines
```

## 🎮 How It Works

### The NO Button Journey

1. **Attempts 1-5**: Button evades your cursor/touch, moving to random positions
2. **Attempt 6**: Mathematical proof modal appears:
   - NO¹ = NO ✖️
   - NO² = NO × NO = YES ✅
   - NO³ = NO ✖️
   - NO⁴ = YES ✅
   - NO⁵ = NO ✖️
   - NO⁶ = YES ✅✅✅
3. **After proof**: Cute cat with water gun popup says "Just click YES!"
4. **NO button disappears**, leaving only YES

### Celebration Sequence

When YES is clicked:
1. Full-screen celebration background
2. Confetti and falling hearts
3. Animated ring with sparkles
4. Typewriter text: "I'm gonna marry you 💍"
5. Final confirmation buttons

## 🎨 Customization

### Change Name

Search and replace "Mindu" with your partner's name in all HTML files.

### Update Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --bg-primary: #ffd1dc;        /* Pale pink */
  --accent-primary: #ff4d6d;     /* Romantic red */
  --gold: #f6c65a;               /* Warm gold */
  /* ... more colors */
}
```

### Add Your Photos

Replace images in `assets/images/` with your own photos.

## 🧪 Testing Checklist

- [ ] Intro page loads with typewriter animation
- [ ] Click CTA → smooth transition to proposal
- [ ] NO button evades 6 times → math proof appears
- [ ] Cat popup appears after math proof
- [ ] YES button triggers celebration
- [ ] Ring animates with sparkles
- [ ] Gallery lightbox works (click images, ESC to close)
- [ ] E-card generator downloads PNG
- [ ] Social share buttons work
- [ ] Love calculator shows "100% + Infinity!"
- [ ] Mobile responsive (test at 375px width)
- [ ] Keyboard navigation works (Tab through elements)

## 🔐 Easter Eggs

- **Konami Code**: ↑↑↓↓←→←→BA → Secret message!
- **Love Calculator**: Always outputs "100% + Infinity! 💕♾️"
- **Type "I love you"**: In any input for a surprise

## 📄 License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

Personal use only. Made with ❤️ for Mindu.

---

## 💕 Credits

Built with love using:
- Vanilla HTML, CSS, JavaScript
- Google Fonts: Playfair Display, Great Vibes, Poppins
- AI-generated illustrations

---

*Made with 💖 for the most amazing person: Mindu*

**Happy Valentine's Day 2025! 💕**
