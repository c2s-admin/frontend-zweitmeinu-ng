#!/usr/bin/env node

/**
 * Find Zweitmeinung Site and Data
 */

const baseUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || ''

async function findZweitmeinung() {
  console.log('🔍 Looking for Zweitmeinung Site and Data...\n')

  // Helper function to make API calls
  async function apiCall(endpoint, description) {
    try {
      console.log(`\n📡 ${description}`)
      console.log(`   URL: ${baseUrl}${endpoint}`)

      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()

      if (response.ok) {
        console.log(`   ✅ Status: ${response.status} OK`)
        return { success: true, data }
      } else {
        console.log(`   ❌ Status: ${response.status}`)
        return { success: false, data }
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  // 1. Get all site configurations
  const sitesResult = await apiCall('/site-configurations', 'Get All Site Configurations')

  let zweitmeinungSite = null

  if (sitesResult.success && sitesResult.data?.data) {
    console.log(`\n🏢 FOUND ${sitesResult.data.data.length} SITES:`)

    sitesResult.data.data.forEach((site, index) => {
      const siteId = site.siteIdentifier || site.id
      console.log(`   ${index + 1}. ID: ${site.id} | Identifier: ${site.siteIdentifier} | Name: ${site.siteName}`)

      // Check if this is the zweitmeinung site
      if (site.siteIdentifier && (
        site.siteIdentifier.includes('zweitmein') ||
        site.siteIdentifier.includes('zweitmeinu') ||
        site.siteIdentifier.includes('zweitmeinung')
      )) {
        zweitmeinungSite = site
        console.log(`   🎯 FOUND ZWEITMEINUNG SITE!`)
      }
    })
  }

  if (!zweitmeinungSite) {
    console.log(`\n❌ No Zweitmeinung site found in the configurations.`)
    return
  }

  console.log(`\n🎯 ZWEITMEINUNG SITE DETAILS:`)
  console.log(`   ID: ${zweitmeinungSite.id}`)
  console.log(`   Identifier: ${zweitmeinungSite.siteIdentifier}`)
  console.log(`   Name: ${zweitmeinungSite.siteName || 'N/A'}`)
  console.log(`   Domain: ${zweitmeinungSite.domain || 'N/A'}`)
  console.log(`   Brand: ${zweitmeinungSite.brand || 'N/A'}`)

  // 2. Now get pages for this site - try different approaches
  console.log(`\n🔍 Looking for pages for site: ${zweitmeinungSite.siteIdentifier}`)

  // Since the structure is different, let's try different filter approaches
  const pageAttempts = [
    `/pages?populate=*`,
    `/pages?filters[siteIdentifier][$eq]=${zweitmeinungSite.siteIdentifier}&populate=*`,
    `/pages?filters[site][$eq]=${zweitmeinungSite.id}&populate=*`,
    `/pages?filters[sites][$eq]=${zweitmeinungSite.id}&populate=*`
  ]

  let foundPages = []

  for (const attempt of pageAttempts) {
    const result = await apiCall(attempt, `Trying: ${attempt}`)

    if (result.success && result.data?.data && result.data.data.length > 0) {
      console.log(`   ✅ SUCCESS with this approach!`)

      // Filter pages for our site if we got all pages
      if (attempt.includes('populate=*') && !attempt.includes('filters')) {
        // We got all pages, need to filter for our site
        foundPages = result.data.data.filter(page => {
          // Check different possible relations
          return (
            page.siteIdentifier === zweitmeinungSite.siteIdentifier ||
            page.site === zweitmeinungSite.id ||
            (page.sites && (
              page.sites.includes(zweitmeinungSite.id) ||
              page.sites.some(s => s.id === zweitmeinungSite.id || s === zweitmeinungSite.id)
            ))
          )
        })
      } else {
        foundPages = result.data.data
      }

      break
    }
  }

  if (foundPages.length === 0) {
    console.log(`\n❌ No pages found for Zweitmeinung site`)

    // Let's see all pages and their structure
    const allPagesResult = await apiCall('/pages?populate=*', 'Get ALL pages to see structure')
    if (allPagesResult.success && allPagesResult.data?.data) {
      console.log(`\n📄 ALL PAGES (to understand structure):`)
      allPagesResult.data.data.forEach((page, index) => {
        console.log(`   ${index + 1}. "${page.title}" (slug: ${page.slug})`)
        console.log(`      Keys: ${Object.keys(page).join(', ')}`)
        if (page.site) console.log(`      Site: ${JSON.stringify(page.site)}`)
        if (page.sites) console.log(`      Sites: ${JSON.stringify(page.sites)}`)
        if (page.siteIdentifier) console.log(`      SiteIdentifier: ${page.siteIdentifier}`)
      })
    }
    return
  }

  // 3. Analyze found pages
  console.log(`\n📄 FOUND ${foundPages.length} PAGES FOR ZWEITMEINUNG:`)

  foundPages.forEach((page, index) => {
    console.log(`\n   ${index + 1}. "${page.title}" (slug: ${page.slug})`)
    console.log(`      ID: ${page.id}`)
    console.log(`      Sections: ${page.sections?.length || 0}`)

    // Look for hero carousel specifically
    if (page.sections && page.sections.length > 0) {
      const heroCarousel = page.sections.find(s => s.__component === 'sections.hero-carousel')

      if (heroCarousel) {
        console.log(`      🎠 HERO CAROUSEL FOUND!`)
        console.log(`         Slides: ${heroCarousel.slides?.length || 0}`)
        console.log(`         Autoplay: ${heroCarousel.autoplay}`)

        if (heroCarousel.slides && heroCarousel.slides.length > 0) {
          console.log(`         📸 SLIDE DETAILS:`)
          heroCarousel.slides.forEach((slide, slideIndex) => {
            console.log(`            Slide ${slideIndex + 1}:`)
            console.log(`               Title Lines: ${slide.titleLines?.length || 0}`)

            if (slide.titleLines && slide.titleLines.length > 0) {
              slide.titleLines.forEach((line, lineIndex) => {
                console.log(`                  ${lineIndex + 1}. "${line.text}"${line.highlight ? ' (highlighted)' : ''}`)
              })
            }

            console.log(`               Badge: ${slide.badge?.text || 'None'}`)
            console.log(`               Subtitle: ${slide.subtitle || 'None'}`)
            console.log(`               Description: ${slide.description ? 'Yes' : 'None'}`)
            console.log(`               Background: ${slide.backgroundImage ? 'Yes' : 'None'}`)
            console.log(`               CTA Buttons: ${slide.ctaButtons?.length || 0}`)
          })
        }
      }
    }
  })

  // Output the site identifier for use in our app
  console.log(`\n✅ RESULT FOR YOUR APP:`)
  console.log(`   Use Site Identifier: "${zweitmeinungSite.siteIdentifier}"`)
  console.log(`   Homepage slug: "${foundPages[0]?.slug || 'not-found'}"`)
  console.log(`   Hero Carousel: ${foundPages.some(p => p.sections?.some(s => s.__component === 'sections.hero-carousel')) ? 'YES' : 'NO'}`)
}

// Run the search
findZweitmeinung().catch(error => {
  console.error('💥 Search failed:', error)
  process.exit(1)
})
