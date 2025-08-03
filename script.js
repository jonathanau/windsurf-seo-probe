class SEOAnalyzer {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.loading = document.getElementById('loading');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeWebsite());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeWebsite();
            }
        });
    }

    async analyzeWebsite() {
        let url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }

        // Automatically add protocol if missing
        url = this.normalizeUrl(url);
        
        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid URL');
            return;
        }

        // Update the input field with the normalized URL
        this.urlInput.value = url;

        this.showLoading();
        this.hideError();

        try {
            const htmlContent = await this.fetchWebsiteContent(url);
            const metaTags = this.parseMetaTags(htmlContent);
            const analysis = this.analyzeSEO(metaTags, url);
            
            this.displayResults(metaTags, analysis, url);
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Unable to analyze the website. Please check the URL and try again.');
        } finally {
            this.hideLoading();
        }
    }

    normalizeUrl(url) {
        // Remove any leading/trailing whitespace
        url = url.trim();
        
        // If URL doesn't start with http:// or https://, add https://
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }
        
        return url;
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            // Ensure it's http or https protocol
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    async fetchWebsiteContent(url) {
        // Since we can't directly fetch cross-origin content in a browser,
        // we'll use a CORS proxy service for demonstration
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch website content');
        }
        
        const data = await response.json();
        return data.contents;
    }

    parseMetaTags(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const metaTags = {
            title: doc.querySelector('title')?.textContent || '',
            description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
            canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
            robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
            viewport: doc.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
            charset: doc.querySelector('meta[charset]')?.getAttribute('charset') || 
                    doc.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute('content') || '',
            
            // Open Graph tags
            ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
            ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
            ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
            ogUrl: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
            ogType: doc.querySelector('meta[property="og:type"]')?.getAttribute('content') || '',
            ogSiteName: doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '',
            
            // Twitter Card tags
            twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
            twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
            twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
            twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
            twitterSite: doc.querySelector('meta[name="twitter:site"]')?.getAttribute('content') || '',
            
            // Additional SEO tags
            author: doc.querySelector('meta[name="author"]')?.getAttribute('content') || '',
            language: doc.documentElement.getAttribute('lang') || '',
            
            // Schema.org structured data
            structuredData: this.extractStructuredData(doc)
        };

        return metaTags;
    }

    extractStructuredData(doc) {
        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        const structuredData = [];
        
        scripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                structuredData.push(data);
            } catch (e) {
                // Invalid JSON, skip
            }
        });
        
        return structuredData;
    }

    analyzeSEO(metaTags, url) {
        const analysis = [];
        let score = 0;
        let passed = 0;
        let warnings = 0;
        let errors = 0;

        // Title analysis
        if (metaTags.title) {
            if (metaTags.title.length >= 30 && metaTags.title.length <= 60) {
                analysis.push({
                    type: 'passed',
                    title: 'Title Tag Length',
                    description: `Perfect! Title is ${metaTags.title.length} characters (30-60 recommended).`
                });
                score += 15;
                passed++;
            } else if (metaTags.title.length > 0) {
                analysis.push({
                    type: 'warning',
                    title: 'Title Tag Length',
                    description: `Title is ${metaTags.title.length} characters. Recommended: 30-60 characters.`
                });
                score += 8;
                warnings++;
            }
        } else {
            analysis.push({
                type: 'error',
                title: 'Missing Title Tag',
                description: 'Title tag is missing. This is crucial for SEO.'
            });
            errors++;
        }

        // Meta description analysis
        if (metaTags.description) {
            if (metaTags.description.length >= 120 && metaTags.description.length <= 160) {
                analysis.push({
                    type: 'passed',
                    title: 'Meta Description Length',
                    description: `Perfect! Description is ${metaTags.description.length} characters (120-160 recommended).`
                });
                score += 15;
                passed++;
            } else if (metaTags.description.length > 0) {
                analysis.push({
                    type: 'warning',
                    title: 'Meta Description Length',
                    description: `Description is ${metaTags.description.length} characters. Recommended: 120-160 characters.`
                });
                score += 8;
                warnings++;
            }
        } else {
            analysis.push({
                type: 'error',
                title: 'Missing Meta Description',
                description: 'Meta description is missing. This affects click-through rates.'
            });
            errors++;
        }

        // Open Graph analysis
        if (metaTags.ogTitle && metaTags.ogDescription) {
            analysis.push({
                type: 'passed',
                title: 'Open Graph Tags',
                description: 'Open Graph title and description are present for social media sharing.'
            });
            score += 10;
            passed++;
        } else {
            analysis.push({
                type: 'warning',
                title: 'Open Graph Tags',
                description: 'Missing Open Graph tags. These improve social media sharing appearance.'
            });
            warnings++;
        }

        // Twitter Card analysis
        if (metaTags.twitterCard) {
            analysis.push({
                type: 'passed',
                title: 'Twitter Card',
                description: 'Twitter Card meta tag is present.'
            });
            score += 5;
            passed++;
        } else {
            analysis.push({
                type: 'warning',
                title: 'Twitter Card',
                description: 'Twitter Card meta tag is missing.'
            });
            warnings++;
        }

        // Canonical URL analysis
        if (metaTags.canonical) {
            analysis.push({
                type: 'passed',
                title: 'Canonical URL',
                description: 'Canonical URL is specified, helping prevent duplicate content issues.'
            });
            score += 10;
            passed++;
        } else {
            analysis.push({
                type: 'warning',
                title: 'Canonical URL',
                description: 'Canonical URL is missing. Consider adding it to prevent duplicate content issues.'
            });
            warnings++;
        }

        // Viewport meta tag analysis
        if (metaTags.viewport) {
            analysis.push({
                type: 'passed',
                title: 'Mobile Viewport',
                description: 'Viewport meta tag is present for mobile optimization.'
            });
            score += 5;
            passed++;
        } else {
            analysis.push({
                type: 'error',
                title: 'Missing Viewport Tag',
                description: 'Viewport meta tag is missing. This affects mobile usability.'
            });
            errors++;
        }

        // Language attribute analysis
        if (metaTags.language) {
            analysis.push({
                type: 'passed',
                title: 'Language Declaration',
                description: `Language is declared as "${metaTags.language}".`
            });
            score += 5;
            passed++;
        } else {
            analysis.push({
                type: 'warning',
                title: 'Language Declaration',
                description: 'HTML lang attribute is missing. This helps search engines understand content language.'
            });
            warnings++;
        }

        // Structured data analysis
        if (metaTags.structuredData.length > 0) {
            analysis.push({
                type: 'passed',
                title: 'Structured Data',
                description: `Found ${metaTags.structuredData.length} structured data block(s). Great for rich snippets!`
            });
            score += 10;
            passed++;
        } else {
            analysis.push({
                type: 'warning',
                title: 'Structured Data',
                description: 'No structured data found. Consider adding Schema.org markup for rich snippets.'
            });
            warnings++;
        }

        return {
            score: Math.min(100, score),
            passed,
            warnings,
            errors,
            items: analysis
        };
    }

    displayResults(metaTags, analysis, url) {
        // Update score overview
        document.getElementById('seoScore').textContent = analysis.score;
        document.getElementById('passedCount').textContent = analysis.passed;
        document.getElementById('warningCount').textContent = analysis.warnings;
        document.getElementById('errorCount').textContent = analysis.errors;

        // Update score circle
        const scoreCircle = document.querySelector('.score-circle');
        const scoreDeg = (analysis.score / 100) * 360;
        scoreCircle.style.setProperty('--score-deg', `${scoreDeg}deg`);

        // Update Google preview
        const domain = new URL(url).hostname;
        document.getElementById('googleUrl').textContent = url;
        document.getElementById('googleTitle').textContent = metaTags.title || 'No title';
        document.getElementById('googleDescription').textContent = metaTags.description || 'No description available';

        // Update Facebook preview
        document.getElementById('facebookTitle').textContent = metaTags.ogTitle || metaTags.title || 'No title';
        document.getElementById('facebookDescription').textContent = metaTags.ogDescription || metaTags.description || 'No description';
        document.getElementById('facebookUrl').textContent = domain;
        
        const facebookImage = document.getElementById('facebookImage');
        if (metaTags.ogImage) {
            facebookImage.innerHTML = `<img src="${metaTags.ogImage}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            facebookImage.innerHTML = '<i class="fas fa-image"></i>';
        }

        // Update Twitter preview
        document.getElementById('twitterTitle').textContent = metaTags.twitterTitle || metaTags.ogTitle || metaTags.title || 'No title';
        document.getElementById('twitterDescription').textContent = metaTags.twitterDescription || metaTags.ogDescription || metaTags.description || 'No description';
        document.getElementById('twitterUrl').textContent = domain;
        
        const twitterImage = document.getElementById('twitterImage');
        if (metaTags.twitterImage || metaTags.ogImage) {
            const imageUrl = metaTags.twitterImage || metaTags.ogImage;
            twitterImage.innerHTML = `<img src="${imageUrl}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            twitterImage.innerHTML = '<i class="fas fa-image"></i>';
        }

        // Update analysis results
        const analysisGrid = document.getElementById('analysisGrid');
        analysisGrid.innerHTML = '';
        
        analysis.items.forEach(item => {
            const analysisItem = document.createElement('div');
            analysisItem.className = `analysis-item ${item.type}`;
            
            let icon = '';
            switch (item.type) {
                case 'passed':
                    icon = 'fas fa-check-circle';
                    break;
                case 'warning':
                    icon = 'fas fa-exclamation-triangle';
                    break;
                case 'error':
                    icon = 'fas fa-times-circle';
                    break;
            }
            
            analysisItem.innerHTML = `
                <div class="analysis-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="analysis-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            `;
            
            analysisGrid.appendChild(analysisItem);
        });

        // Update meta tags details
        this.displayMetaTags(metaTags);

        // Show results
        this.resultsContainer.style.display = 'block';
    }

    displayMetaTags(metaTags) {
        const container = document.getElementById('metaTagsContainer');
        container.innerHTML = '';

        const tagGroups = [
            {
                title: 'Basic SEO Tags',
                tags: {
                    'Title': metaTags.title,
                    'Meta Description': metaTags.description,
                    'Meta Keywords': metaTags.keywords,
                    'Canonical URL': metaTags.canonical,
                    'Robots': metaTags.robots,
                    'Viewport': metaTags.viewport,
                    'Charset': metaTags.charset,
                    'Language': metaTags.language,
                    'Author': metaTags.author
                }
            },
            {
                title: 'Open Graph Tags',
                tags: {
                    'og:title': metaTags.ogTitle,
                    'og:description': metaTags.ogDescription,
                    'og:image': metaTags.ogImage,
                    'og:url': metaTags.ogUrl,
                    'og:type': metaTags.ogType,
                    'og:site_name': metaTags.ogSiteName
                }
            },
            {
                title: 'Twitter Card Tags',
                tags: {
                    'twitter:card': metaTags.twitterCard,
                    'twitter:title': metaTags.twitterTitle,
                    'twitter:description': metaTags.twitterDescription,
                    'twitter:image': metaTags.twitterImage,
                    'twitter:site': metaTags.twitterSite
                }
            }
        ];

        tagGroups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.innerHTML = `<h3 style="margin: 20px 0 15px 0; color: #333;">${group.title}</h3>`;
            
            Object.entries(group.tags).forEach(([name, content]) => {
                if (content) {
                    const tagElement = document.createElement('div');
                    tagElement.className = 'meta-tag';
                    tagElement.innerHTML = `
                        <div class="meta-tag-name">${name}</div>
                        <div class="meta-tag-content">${this.escapeHtml(content)}</div>
                    `;
                    groupElement.appendChild(tagElement);
                }
            });
            
            container.appendChild(groupElement);
        });

        // Add structured data if present
        if (metaTags.structuredData.length > 0) {
            const structuredDataElement = document.createElement('div');
            structuredDataElement.innerHTML = `<h3 style="margin: 20px 0 15px 0; color: #333;">Structured Data</h3>`;
            
            metaTags.structuredData.forEach((data, index) => {
                const dataElement = document.createElement('div');
                dataElement.className = 'meta-tag';
                dataElement.innerHTML = `
                    <div class="meta-tag-name">JSON-LD Schema ${index + 1}</div>
                    <div class="meta-tag-content">${this.escapeHtml(JSON.stringify(data, null, 2))}</div>
                `;
                structuredDataElement.appendChild(dataElement);
            });
            
            container.appendChild(structuredDataElement);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.resultsContainer.style.display = 'none';
        this.analyzeBtn.disabled = true;
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.analyzeBtn.disabled = false;
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        this.errorMessage.style.display = 'block';
        this.resultsContainer.style.display = 'none';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Initialize the SEO analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SEOAnalyzer();
});
