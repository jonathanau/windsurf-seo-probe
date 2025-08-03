# SEO Meta Tags Analyzer

An interactive web application that analyzes and visualizes SEO meta tags for any website, providing comprehensive feedback on SEO implementation with Google and social media previews.

## Features

### 🔍 Comprehensive SEO Analysis
- **Title Tag Analysis**: Checks length and presence (30-60 characters recommended)
- **Meta Description Analysis**: Validates length and content (120-160 characters recommended)
- **Open Graph Tags**: Analyzes Facebook/social media meta tags
- **Twitter Card Tags**: Checks Twitter-specific meta tags
- **Technical SEO**: Validates canonical URLs, viewport, language, and more
- **Structured Data**: Detects JSON-LD Schema.org markup

### 📊 Visual SEO Score
- Real-time SEO score calculation (0-100)
- Color-coded feedback system (Passed/Warnings/Errors)
- Interactive score circle with progress visualization

### 👀 Social Media Previews
- **Google Search Preview**: Shows how your page appears in search results
- **Facebook Preview**: Displays Open Graph social media card
- **Twitter Preview**: Shows Twitter Card appearance

### 📱 Modern UI/UX
- Responsive design that works on all devices
- Clean, professional interface
- Real-time analysis with loading states
- Detailed meta tags breakdown

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Enter URL**: Input any website URL (must include http:// or https://)
3. **Analyze**: Click the "Analyze" button or press Enter
4. **Review Results**: 
   - Check your SEO score and breakdown
   - Review Google and social media previews
   - Examine detailed SEO analysis recommendations
   - View all detected meta tags

## Technical Details

### SEO Checks Performed

| Check | Description | Points |
|-------|-------------|---------|
| Title Tag | Length validation (30-60 chars) | 15 points |
| Meta Description | Length validation (120-160 chars) | 15 points |
| Open Graph Tags | Social media optimization | 10 points |
| Canonical URL | Duplicate content prevention | 10 points |
| Structured Data | Schema.org markup detection | 10 points |
| Viewport Tag | Mobile optimization | 5 points |
| Twitter Card | Twitter sharing optimization | 5 points |
| Language Declaration | Content language specification | 5 points |

### Meta Tags Analyzed

#### Basic SEO Tags
- `<title>` - Page title
- `<meta name="description">` - Page description
- `<meta name="keywords">` - Page keywords
- `<link rel="canonical">` - Canonical URL
- `<meta name="robots">` - Robot instructions
- `<meta name="viewport">` - Mobile viewport
- `<meta charset>` - Character encoding
- `<html lang>` - Language declaration
- `<meta name="author">` - Content author

#### Open Graph Tags
- `og:title` - Social media title
- `og:description` - Social media description
- `og:image` - Social media image
- `og:url` - Canonical social URL
- `og:type` - Content type
- `og:site_name` - Site name

#### Twitter Card Tags
- `twitter:card` - Card type
- `twitter:title` - Twitter title
- `twitter:description` - Twitter description
- `twitter:image` - Twitter image
- `twitter:site` - Twitter handle

#### Advanced Features
- **Structured Data Detection**: Automatically finds and parses JSON-LD Schema.org markup
- **Cross-Origin Support**: Uses CORS proxy to analyze any website
- **Real-time Validation**: Instant feedback on SEO best practices

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Limitations

- Uses a CORS proxy service for cross-origin requests
- Some websites may block automated access
- Analysis is based on HTML meta tags only (doesn't include server-side factors)

## Development

The application is built with vanilla HTML, CSS, and JavaScript:

- `index.html` - Main application structure
- `styles.css` - Modern, responsive styling
- `script.js` - SEO analysis logic and UI interactions

## Future Enhancements

- [ ] Page speed analysis
- [ ] Image optimization checks
- [ ] Internal/external link analysis
- [ ] Mobile-friendliness testing
- [ ] Accessibility (a11y) checks
- [ ] Competitor comparison
- [ ] Export reports functionality
- [ ] Batch URL analysis

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
