# Featured Banner Guide

## Overview

The Featured Banner is a flexible, eye-catching section that appears right after the hero image on the home page. It can display YouTube videos, featured articles, activities, recipes, or custom content.

## Location in Sanity Studio

1. Go to **Page Settings** (singleton document)
2. Open **Home Page** section
3. Find **Featured Banner (Section 2)** field

## Content Types

### 1. YouTube Video

**Use Case:** Promote your YouTube channel or specific videos

**Setup:**
1. Set **Content Type** to "YouTube Video"
2. Enter **YouTube Video ID** (e.g., from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`)
3. Optionally upload a **Custom Thumbnail** (otherwise YouTube's thumbnail is used)
4. Add **Title**, **Subtitle**, **Description**
5. Set **Primary CTA** text (e.g., "Watch on YouTube")
6. Set **Secondary CTA** if needed (e.g., "Subscribe")
7. Choose **Background Color** (default: Dark Blue)
8. Enable the banner

**Result:** Shows YouTube thumbnail with play button overlay. Clicking opens the video on YouTube.

### 2. Featured Article

**Use Case:** Highlight a specific article/blog post

**Setup:**
1. Set **Content Type** to "Featured Article"
2. Select an **Article** from the Content Reference dropdown
3. Add **Title**, **Subtitle**, **Description** (or use article's content)
4. Set **Primary CTA** text (e.g., "Read Article")
5. Choose **Background Color**
6. Enable the banner

**Result:** Shows article's cover image on the right, text on the left. Clicking image or CTA goes to the article.

### 3. Featured Activity

**Use Case:** Promote a specific activity

**Setup:**
1. Set **Content Type** to "Featured Activity"
2. Select an **Activity** from the Content Reference dropdown
3. Add **Title**, **Subtitle**, **Description**
4. Set **Primary CTA** text (e.g., "Try This Activity")
5. Choose **Background Color**
6. Enable the banner

**Result:** Shows activity's cover image, links to activity page.

### 4. Featured Recipe

**Use Case:** Highlight a recipe

**Setup:**
1. Set **Content Type** to "Featured Recipe"
2. Select a **Recipe** from the Content Reference dropdown
3. Add **Title**, **Subtitle**, **Description**
4. Set **Primary CTA** text (e.g., "View Recipe")
5. Choose **Background Color**
6. Enable the banner

**Result:** Shows recipe's cover image, links to recipe page.

### 5. Custom Content

**Use Case:** Promotional banners, announcements, seasonal content

**Setup:**
1. Set **Content Type** to "Custom Content"
2. Upload a **Custom Image**
3. Add **Title**, **Subtitle**, **Description**
4. Set **Primary CTA** text and link
5. Set **Secondary CTA** if needed
6. Choose **Background Color**
7. Enable the banner

**Result:** Shows your custom image with custom text and CTAs.

## Design Features

- **Two-Column Layout**: Text on left, image/video on right
- **Responsive**: Stacks on mobile, side-by-side on desktop
- **Customizable Colors**: Choose from preset colors or use custom hex
- **Play Button**: YouTube videos show a play button overlay
- **Hover Effects**: Images scale on hover, buttons have transitions
- **CTA Buttons**: Primary (white) and secondary (outlined) buttons

## Best Practices

1. **Images**: Use high-quality images (recommended: 1200x675px or 16:9 ratio)
2. **Text**: Keep title concise, subtitle descriptive, description detailed
3. **CTAs**: Use action-oriented text ("Watch Now", "Read More", "Try It")
4. **Colors**: Dark backgrounds work best with white text
5. **Content**: Update regularly to keep the page fresh

## Example Configurations

### Christmas Promotion
- **Type**: Custom Content
- **Title**: "Χριστουγεννιάτικες Δραστηριότητες"
- **Subtitle**: "Ειδικό περιεχόμενο για τις γιορτές"
- **Description**: "Ανακαλύψτε χριστουγεννιάτικες δραστηριότητες, συνταγές και ιδέες..."
- **Primary CTA**: "Δείτε τις δραστηριότητες" → `/drastiriotites`
- **Secondary CTA**: "Χριστουγεννιάτικες συνταγές" → `/gia-goneis`
- **Background**: Dark Blue

### YouTube Channel
- **Type**: YouTube Video
- **Video ID**: Your latest video ID
- **Title**: "Νέα βίντεο στο κανάλι μας"
- **Subtitle**: "Watch Together με τα παιδιά σας"
- **Primary CTA**: "Δείτε το κανάλι" → YouTube channel URL
- **Background**: Primary Pink

### Featured Article
- **Type**: Featured Article
- **Content Reference**: Select your best article
- **Title**: Use article title or custom
- **Primary CTA**: "Διαβάστε το άρθρο" → Auto-links to article
- **Background**: Secondary Blue

## Troubleshooting

### Banner Not Showing
- Check that **Enabled** is set to `true`
- Verify **Title** is filled (required)
- Make sure Page Settings document is published

### Image Not Showing
- For YouTube: Check video ID is correct
- For articles/activities: Ensure content has a cover image
- For custom: Upload an image

### Links Not Working
- Check CTA links are valid URLs or paths
- External links should start with `http://` or `https://`
- Internal links should start with `/` (e.g., `/gia-goneis`)

## Section Order

The home page sections are now:
1. **Hero Image** (Section 1)
2. **Featured Banner** (Section 2) ← NEW!
3. **Carousel** (Section 3) ← Moved from Section 2
4. **Featured Content Grid** (Section 4)
5. **Age Cards** (Section 5)
6. **Featured Articles** (Section 6)
7. **Activities & Printables** (Section 7)
8. **Newsletter** (Section 8)
9. **Community CTA** (Section 9)

