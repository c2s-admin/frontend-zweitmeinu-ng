#!/usr/bin/env node

/**
 * Safe Strapi Data Explorer Script
 * Explores the actual data structure safely
 */

const baseUrl = 'https://st.zh3.de/api'

async function exploreStrapi() {
  console.log('🔍 Exploring Strapi Data Structure Safely...\n')

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

  // Helper function to safely access nested properties
  function safeGet(obj, path, defaultValue = 'N/A') {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue
    } catch {
      return defaultValue
    }
  }

  // 1. Get all site configurations
  const sitesResult = await apiCall('/site-configurations?populate=*', 'All Site Configurations')

  if (sitesResult.success && sitesResult.data?.data) {
    console.log(`\n🏢 FOUND ${sitesResult.data.data.length} SITE CONFIGURATIONS:`)
    sitesResult.data.data.forEach((site, index) => {
      console.log(`\n   ${index + 1}. Site ID: ${site.id}`)

      // First, let's see the complete structure
      console.log(`      Raw Structure Keys:`, Object.keys(site))

      if (site.attributes) {
        console.log(`      Attributes Keys:`, Object.keys(site.attributes))
        console.log(`      Identifier: ${safeGet(site, 'attributes.siteIdentifier')}`)
        console.log(`      Site Name: ${safeGet(site, 'attributes.siteName')}`)
        console.log(`      Domain: ${safeGet(site, 'attributes.domain')}`)
        console.log(`      Brand: ${safeGet(site, 'attributes.brand')}`)
      } else {
        console.log(`      Structure: ${JSON.stringify(site, null, 2)}`)
      }
    })
  }

  // 2. Get all pages without filtering
  const allPagesResult = await apiCall('/pages?populate=*', 'All Pages (No Filter)')

  if (allPagesResult.success && allPagesResult.data?.data) {
    console.log(`\n📄 FOUND ${allPagesResult.data.data.length} PAGES:`)
    allPagesResult.data.data.forEach((page, index) => {
      console.log(`\n   ${index + 1}. Page ID: ${page.id}`)
      console.log(`      Page Structure Keys:`, Object.keys(page))

      if (page.attributes) {
        console.log(`      Page Attributes Keys:`, Object.keys(page.attributes))
        console.log(`      Title: ${safeGet(page, 'attributes.title')}`)
        console.log(`      Slug: ${safeGet(page, 'attributes.slug')}`)
        console.log(`      Sections: ${page.attributes.sections?.length || 0}`)

        // Check for site relations in different possible ways
        if (page.attributes.sites) {
          console.log(`      Sites Relation Type:`, typeof page.attributes.sites)
          console.log(`      Sites Relation:`, page.attributes.sites)
        }
        if (page.attributes.site) {
          console.log(`      Site Relation Type:`, typeof page.attributes.site)
          console.log(`      Site Relation:`, page.attributes.site)
        }

        // Show sections if available
        if (page.attributes.sections && page.attributes.sections.length > 0) {
          console.log(`      📦 SECTIONS FOUND:`)
          page.attributes.sections.forEach((section, sIndex) => {
            console.log(`         ${sIndex + 1}. ${section.__component || 'unknown'} (ID: ${section.id})`)

            // Special handling for hero-carousel
            if (section.__component === 'sections.hero-carousel') {
              console.log(`            🎠 HERO CAROUSEL DETAILS:`)
              console.log(`            Section Keys:`, Object.keys(section))
              console.log(`            Slides: ${section.slides?.length || 0}`)
              console.log(`            Autoplay: ${section.autoplay}`)
              console.log(`            Autoplay Interval: ${section.autoplayInterval || 'default'}`)

              if (section.slides && section.slides.length > 0) {
                console.log(`            📸 SLIDES DETAILS:`)
                section.slides.forEach((slide, slideIndex) => {
                  console.log(`               Slide ${slideIndex + 1} Keys:`, Object.keys(slide))
                  console.log(`               Slide ${slideIndex + 1}:`)
                  console.log(`                  Title Lines: ${slide.titleLines?.length || 0}`)

                  if (slide.titleLines && slide.titleLines.length > 0) {
                    slide.titleLines.forEach((line, lineIndex) => {
                      console.log(`                     ${lineIndex + 1}. Text: "${line.text}" | Highlight: ${line.highlight} | Color: ${line.color || 'none'}`)
                    })
                  }

                  console.log(`                  Badge: ${slide.badge?.text || 'None'}`)
                  console.log(`                  Subtitle: ${slide.subtitle || 'None'}`)
                  console.log(`                  Description: ${slide.description ? 'Yes (' + slide.description.length + ' chars)' : 'None'}`)
                  console.log(`                  Background Image: ${slide.backgroundImage ? 'Yes' : 'None'}`)
                  console.log(`                  CTA Buttons: ${slide.ctaButtons?.length || 0}`)

                  if (slide.ctaButtons && slide.ctaButtons.length > 0) {
                    slide.ctaButtons.forEach((btn, btnIndex) => {
                      console.log(`                     Button ${btnIndex + 1}: "${btn.text}" → ${btn.href} (${btn.variant || 'default'})`)
                    })
                  }
                })
              }
            }
          })
        }
      } else {
        console.log(`      Page Structure: ${JSON.stringify(page, null, 2)}`)
      }
    })
  }

  console.log(`\n🎯 EXPLORATION COMPLETE!`)
  console.log(`💡 This shows us the exact data structure available in Strapi.`)
}

// Run the exploration
exploreStrapi().catch(error => {
  console.error('💥 Exploration failed:', error)
  process.exit(1)
})
