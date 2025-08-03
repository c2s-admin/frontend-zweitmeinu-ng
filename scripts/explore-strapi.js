#!/usr/bin/env node

/**
 * Strapi Data Explorer Script
 * Explores the actual data structure without assumptions
 */

const baseUrl = 'https://st.zh3.de/api'

async function exploreStrapi() {
  console.log('🔍 Exploring Strapi Data Structure...\n')

  // Helper function to make API calls
  async function apiCall(endpoint, description) {
    try {
      console.log(`\n📡 ${description}`)
      console.log(`   URL: ${baseUrl}${endpoint}`)

      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()

      if (response.ok) {
        console.log(`   ✅ Status: ${response.status} OK`)
        console.log(`   📊 Data Length: ${JSON.stringify(data).length} characters`)
        return { success: true, data }
      } else {
        console.log(`   ❌ Status: ${response.status}`)
        console.log(`   📄 Error: ${JSON.stringify(data, null, 2)}`)
        return { success: false, data }
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  // 1. Get all site configurations
  const sitesResult = await apiCall('/site-configurations?populate=*', 'All Site Configurations')

  if (sitesResult.success && sitesResult.data.data) {
    console.log(`\n🏢 FOUND ${sitesResult.data.data.length} SITE CONFIGURATIONS:`)
    sitesResult.data.data.forEach((site, index) => {
      console.log(`\n   ${index + 1}. Site ID: ${site.id}`)
      console.log(`      Identifier: ${site.attributes.siteIdentifier || 'N/A'}`)
      console.log(`      Site Name: ${site.attributes.siteName || 'N/A'}`)
      console.log(`      Domain: ${site.attributes.domain || 'N/A'}`)
      console.log(`      Brand: ${site.attributes.brand || 'N/A'}`)

      // Show all available attributes
      console.log(`      Available Attributes:`, Object.keys(site.attributes))
    })
  }

  // 2. Get all pages without filtering
  const allPagesResult = await apiCall('/pages?populate=*', 'All Pages (No Filter)')

  if (allPagesResult.success && allPagesResult.data.data) {
    console.log(`\n📄 FOUND ${allPagesResult.data.data.length} PAGES:`)
    allPagesResult.data.data.forEach((page, index) => {
      console.log(`\n   ${index + 1}. Page ID: ${page.id}`)
      console.log(`      Title: ${page.attributes.title || 'N/A'}`)
      console.log(`      Slug: ${page.attributes.slug || 'N/A'}`)
      console.log(`      Sections: ${page.attributes.sections?.length || 0}`)

      // Check for site relations
      if (page.attributes.sites) {
        console.log(`      Sites Relation:`, page.attributes.sites)
      }
      if (page.attributes.site) {
        console.log(`      Site Relation:`, page.attributes.site)
      }

      // Show all available attributes
      console.log(`      Available Attributes:`, Object.keys(page.attributes))

      // Show sections if available
      if (page.attributes.sections && page.attributes.sections.length > 0) {
        console.log(`      Section Details:`)
        page.attributes.sections.forEach((section, sIndex) => {
          console.log(`         ${sIndex + 1}. ${section.__component} (ID: ${section.id})`)

          // Special handling for hero-carousel
          if (section.__component === 'sections.hero-carousel') {
            console.log(`            🎠 HERO CAROUSEL FOUND!`)
            console.log(`            Slides: ${section.slides?.length || 0}`)
            console.log(`            Autoplay: ${section.autoplay !== false}`)

            if (section.slides && section.slides.length > 0) {
              console.log(`            📸 SLIDES:`)
              section.slides.forEach((slide, slideIndex) => {
                console.log(`               Slide ${slideIndex + 1}:`)
                console.log(`                  Title Lines: ${slide.titleLines?.length || 0}`)
                console.log(`                  Badge: ${slide.badge?.text || 'None'}`)
                console.log(`                  Subtitle: ${slide.subtitle || 'None'}`)
                console.log(`                  Description: ${slide.description ? 'Yes' : 'None'}`)
                console.log(`                  Background Image: ${slide.backgroundImage ? 'Yes' : 'None'}`)
                console.log(`                  CTA Buttons: ${slide.ctaButtons?.length || 0}`)
              })
            }
          }
        })
      }
    })
  }

  // 3. Try to find the specific page mentioned by user
  const searchTerms = ['startseite', 'zweitmein', 'home']

  for (const term of searchTerms) {
    const searchResult = await apiCall(
      `/pages?filters[title][$containsi]=${term}&populate=*`,
      `Search Pages for "${term}"`
    )

    if (searchResult.success && searchResult.data.data && searchResult.data.data.length > 0) {
      console.log(`\n🎯 FOUND PAGES MATCHING "${term}":`)
      searchResult.data.data.forEach(page => {
        console.log(`   📄 "${page.attributes.title}" (slug: ${page.attributes.slug})`)
      })
    }
  }

  // 4. Try a different slug search
  const slugSearchResult = await apiCall(
    `/pages?filters[slug][$containsi]=start&populate=*`,
    `Search Pages with slug containing "start"`
  )

  if (slugSearchResult.success && slugSearchResult.data.data && slugSearchResult.data.data.length > 0) {
    console.log(`\n🎯 FOUND PAGES WITH SLUG CONTAINING "start":`)
    slugSearchResult.data.data.forEach(page => {
      console.log(`   📄 "${page.attributes.title}" (slug: ${page.attributes.slug})`)
    })
  }

  console.log(`\n🎯 EXPLORATION COMPLETE!`)
  console.log(`💡 Now we know the actual data structure and can update the code accordingly.`)
}

// Run the exploration
exploreStrapi().catch(error => {
  console.error('💥 Exploration failed:', error)
  process.exit(1)
})
