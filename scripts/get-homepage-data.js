#!/usr/bin/env node

/**
 * Get Homepage Data for Zweitmeinung
 */

const baseUrl = 'https://st.zh3.de/api'

async function getHomepageData() {
  console.log('🏠 Getting Homepage Data for Zweitmeinung...\n')

  try {
    // Get the specific homepage with full population
    const url = `${baseUrl}/pages?filters[slug][$eq]=home&populate[0]=sections&populate[1]=sections.slides&populate[2]=sections.slides.titleLines&populate[3]=sections.slides.ctaButtons&populate[4]=sections.slides.backgroundImage&populate[5]=sections.slides.badge&populate[6]=seo`

    console.log(`📡 Fetching: ${url}`)

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.log(`❌ Error: ${response.status}`)
      console.log(`Error Details: ${JSON.stringify(data, null, 2)}`)
      return
    }

    console.log(`✅ Success: ${response.status}`)
    console.log(`📊 Data Length: ${JSON.stringify(data).length} characters`)

    if (!data.data || data.data.length === 0) {
      console.log(`❌ No homepage found`)
      return
    }

    const homepage = data.data[0]

    console.log(`\n🏠 HOMEPAGE FOUND:`)
    console.log(`   ID: ${homepage.id}`)
    console.log(`   Title: ${homepage.title}`)
    console.log(`   Slug: ${homepage.slug}`)
    console.log(`   Sections: ${homepage.sections?.length || 0}`)

    if (homepage.sections && homepage.sections.length > 0) {
      console.log(`\n📦 SECTIONS:`)
      homepage.sections.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section.__component} (ID: ${section.id})`)

        if (section.__component === 'sections.hero-carousel') {
          console.log(`\n🎠 HERO CAROUSEL DETAILS:`)
          console.log(`      Slides: ${section.slides?.length || 0}`)
          console.log(`      Autoplay: ${section.autoplay}`)
          console.log(`      AutoplayInterval: ${section.autoplayInterval || 'default'}`)

          if (section.slides && section.slides.length > 0) {
            console.log(`\n📸 SLIDES:`)
            section.slides.forEach((slide, slideIndex) => {
              console.log(`\n      Slide ${slideIndex + 1}:`)
              console.log(`         ID: ${slide.id}`)

              // Title Lines
              if (slide.titleLines && slide.titleLines.length > 0) {
                console.log(`         Title Lines (${slide.titleLines.length}):`)
                slide.titleLines.forEach((line, lineIndex) => {
                  console.log(`            ${lineIndex + 1}. "${line.text}"`)
                  console.log(`               Highlight: ${line.highlight || false}`)
                  console.log(`               Color: ${line.color || 'default'}`)
                })
              }

              // Badge
              if (slide.badge) {
                console.log(`         Badge: "${slide.badge.text}"`)
                if (slide.badge.icon) console.log(`         Badge Icon: ${slide.badge.icon}`)
              }

              // Other fields
              console.log(`         Subtitle: ${slide.subtitle || 'None'}`)
              console.log(`         Description: ${slide.description ? 'Yes (' + slide.description.length + ' chars)' : 'None'}`)
              console.log(`         Background Image: ${slide.backgroundImage ? 'Yes' : 'None'}`)
              console.log(`         Overlay Opacity: ${slide.overlayOpacity || 'default'}`)

              // CTA Buttons
              if (slide.ctaButtons && slide.ctaButtons.length > 0) {
                console.log(`         CTA Buttons (${slide.ctaButtons.length}):`)
                slide.ctaButtons.forEach((btn, btnIndex) => {
                  console.log(`            ${btnIndex + 1}. "${btn.text}" → ${btn.href}`)
                  console.log(`               Variant: ${btn.variant || 'default'}`)
                  console.log(`               External: ${btn.isExternal || false}`)
                  if (btn.icon) console.log(`               Icon: ${btn.icon}`)
                })
              }
            })
          }

          // Output the complete hero carousel data for our app
          console.log(`\n📋 COMPLETE HERO CAROUSEL DATA FOR APP:`)
          console.log(JSON.stringify(section, null, 2))
        }
      })
    }

    console.log(`\n✅ READY TO UPDATE APP WITH REAL DATA!`)
    console.log(`💡 Site Identifier: zweitmeinu-ng`)
    console.log(`💡 Homepage Slug: home`)
    console.log(`💡 Hero Carousel: ${homepage.sections?.some(s => s.__component === 'sections.hero-carousel') ? 'Found with ' + homepage.sections.find(s => s.__component === 'sections.hero-carousel')?.slides?.length + ' slides' : 'Not found'}`)

  } catch (error) {
    console.error('💥 Failed to get homepage data:', error)
  }
}

// Run the function
getHomepageData()
