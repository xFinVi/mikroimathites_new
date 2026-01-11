# Lighthouse Performance Report

**Date:** January 11, 2026, 1:38 PM GMT  
**Device:** Emulated Moto G Power  
**Lighthouse Version:** 13.0.1  
**Chromium Version:** 143.0.0.0  
**Network:** Slow 4G throttling  
**Session Type:** Single page session (Initial page load)

---

## Overall Scores

| Category | Score |
|----------|-------|
| **Performance** | 52 |
| **Accessibility** | 96 |
| **Best Practices** | 100 |
| **SEO** | 92 |

---

## ⚠️ Important Note

Chrome extensions negatively affected this page's load performance. Try auditing the page in incognito mode or from a Chrome profile without extensions.

---

## Performance Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **First Contentful Paint (FCP)** | 0.9 s | ✅ Good (+10) |
| **Largest Contentful Paint (LCP)** | 8.6 s | ⚠️ Needs Improvement (+0) |
| **Total Blocking Time (TBT)** | 1,060 ms | ⚠️ Needs Improvement (+8) |
| **Cumulative Layout Shift (CLS)** | 0 | ✅ Good (+25) |
| **Speed Index (SI)** | 3.2 s | ⚠️ Needs Improvement (+9) |

### Performance Score Breakdown
- **0–49:** Poor
- **50–89:** Needs Improvement
- **90–100:** Good

**Current Score: 52** (Needs Improvement)

---

## Performance Insights

### Critical Issues

1. **Legacy JavaScript**
   - Estimated savings: 8 KiB

2. **Render Blocking Requests**
   - Estimated savings: 30 ms

3. **Image Delivery**
   - Estimated savings: 13 KiB

### Diagnostics

1. **Reduce JavaScript Execution Time**
   - Current: 2.4 s
   - Action: Optimize JavaScript execution

2. **Minimize Main-Thread Work**
   - Current: 3.2 s
   - Action: Reduce main-thread blocking operations

3. **Minify JavaScript**
   - Estimated savings: 238 KiB
   - Action: Minify JavaScript files

4. **Reduce Unused JavaScript**
   - Estimated savings: 961 KiB
   - Action: Remove or code-split unused JavaScript

5. **Reduce Unused CSS**
   - Estimated savings: 146 KiB
   - Action: Remove unused CSS rules

6. **Page Prevented Back/Forward Cache Restoration**
   - 5 failure reasons found
   - Action: Investigate and fix cache restoration issues

7. **Minify CSS**
   - Estimated savings: 18 KiB
   - Action: Minify CSS files

8. **Avoid Long Main-Thread Tasks**
   - 13 long tasks found
   - Action: Break up long-running tasks

9. **User Timing Marks and Measures**
   - 152 user timings found
   - Note: This is informational, not necessarily a problem

10. **Avoid Non-Composited Animations**
    - 6 animated elements found
    - Action: Optimize animations for better performance

### Passed Audits (12)
- Various performance optimizations are already in place

---

## Accessibility (96/100)

### Issues Found

1. **Contrast**
   - Background and foreground colors do not have a sufficient contrast ratio
   - **Action:** Improve color contrast for better legibility

### Additional Manual Checks Required (10 items)
These items require manual review as automated testing cannot cover them. See [Lighthouse accessibility guide](https://developer.chrome.com/docs/lighthouse/accessibility/) for more information.

### Passed Audits (22)
- Most accessibility checks passed

### Not Applicable (37)
- Various checks not applicable to this page

---

## Best Practices (100/100)

### Trust and Safety Recommendations

1. **Ensure CSP is effective against XSS attacks**
   - Action: Review and strengthen Content Security Policy

2. **Use a strong HSTS policy**
   - Action: Implement HTTP Strict Transport Security

3. **Ensure proper origin isolation with COOP**
   - Action: Configure Cross-Origin-Opener-Policy

4. **Mitigate clickjacking with XFO or CSP**
   - Action: Add X-Frame-Options or CSP frame-ancestors directive

5. **Mitigate DOM-based XSS with Trusted Types**
   - Action: Implement Trusted Types API

### General Recommendations

1. **Missing source maps for large first-party JavaScript**
   - Action: Add source maps for debugging

### Passed Audits (12)
- Most best practices are followed

### Not Applicable (2)
- Some checks not applicable

---

## SEO (92/100)

### Issues Found

1. **Document does not have a meta description**
   - **Action:** Add a meta description tag to improve search engine understanding

### Additional Manual Checks Required (1 item)
Run additional validators on your site to check additional SEO best practices.

### Passed Audits (8)
- Most SEO checks passed

### Not Applicable (1)
- Some checks not applicable

---

## Priority Action Items

### High Priority (Performance Impact)

1. ✅ **Reduce Unused JavaScript** (961 KiB savings)
   - Implement code splitting
   - Remove unused dependencies
   - Use dynamic imports

2. ✅ **Reduce JavaScript Execution Time** (2.4 s)
   - Optimize critical rendering path
   - Defer non-critical JavaScript

3. ✅ **Reduce Unused CSS** (146 KiB savings)
   - Remove unused CSS rules
   - Use CSS purging tools

4. ✅ **Minify JavaScript** (238 KiB savings)
   - Enable JavaScript minification in build process

5. ✅ **Fix Back/Forward Cache Issues** (5 failure reasons)
   - Investigate and resolve cache restoration blockers

### Medium Priority

6. ✅ **Improve LCP** (8.6 s - needs improvement)
   - Optimize largest contentful element
   - Preload critical resources
   - Optimize images

7. ✅ **Reduce Total Blocking Time** (1,060 ms)
   - Break up long tasks
   - Optimize main-thread work

8. ✅ **Add Meta Description** (SEO)
   - Add descriptive meta tags

9. ✅ **Fix Color Contrast Issues** (Accessibility)
   - Review and improve color contrast ratios

### Low Priority

10. ✅ **Minify CSS** (18 KiB savings)
11. ✅ **Optimize Image Delivery** (13 KiB savings)
12. ✅ **Remove Legacy JavaScript** (8 KiB savings)
13. ✅ **Optimize Animations** (6 non-composited animations)

---

## Next Steps

1. Run Lighthouse again in incognito mode to get accurate results without extension interference
2. Focus on JavaScript optimization (biggest impact - 961 KiB unused JS)
3. Implement code splitting and lazy loading
4. Add meta description for SEO
5. Fix color contrast issues for accessibility
6. Review and implement security headers (CSP, HSTS, COOP, etc.)

---

**Report Generated:** January 11, 2026, 1:38 PM GMT  
**Generated by:** Lighthouse 13.0.1 | [File an issue](https://github.com/GoogleChrome/lighthouse/issues)
