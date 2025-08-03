#!/usr/bin/env node

/**
 * Strapi API Test Script
 * Tests the connection to the Strapi backend and validates data structure
 */

const baseUrl = 'https://st.zh3.de/api'
const possibleSiteIds = ['zweitmeinung-ng', 'zweitmeinu-ng', 'zweitmein-ng']

async function testStrapiConnection() {
  console.log('🧪 Testing Strapi API Connection...\n')
  console.log(`📡 Base URL: ${baseUrl}`)
  console.log(`🏢 Testing Site IDs: ${possibleSiteIds.join(', ')}\n`)

  let totalTests = 0
  let passedTests = 0
  let foundSiteId = null

  // Helper function to make API calls
  async function apiCall(endpoint, description) {
    totalTests++
    try {
      console.log(`\n🔍 Testing: ${description}`)
      console.log(`   URL: ${baseUrl}${endpoint}`)

      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()

      if (response.ok) {
        console.log(`   ✅ Status: ${response.status} OK`)
        console.log(`   📊 Response: ${JSON.stringify(data).length} characters`)
        passedTests++
        return { success: true, data, status: response.status }
      } else {
        console.log(`   ❌ Status: ${response.status} ${response.statusText}`)
        console.log(`   📄 Error: ${JSON.stringify(data, null, 2)}`)
        return { success: false, data, status: response.status }
      }
    } catch (error) {
      console.log(`   💥 Network Error: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  // Test 1: Find the correct Site Configuration
  console.log(`\n🔍 Testing Site Configurations for all possible IDs...`)

  for (const siteId of possibleSiteIds) {
    const siteConfigResult = await apiCall(
      `/site-configurations?filters[siteIdentifier][$eq]=${siteId}&populate=*`,
      `Site Configuration API (${siteId})`
    )

    if (siteConfigResult.success && siteConfigResult.data.data && siteConfigResult.data.data.length > 0) {
      foundSiteId = siteId
      const siteConfig = siteConfigResult.data.data[0]
      console.log(`   🎯 FOUND SITE CONFIG: ${siteId}`)
      console.log(`   📋 Site Name: ${siteConfig.attributes?.siteName || 'N/A'}`)
      console.log(`   🏷️  Brand: ${siteConfig.attributes?.brand || 'N/A'}`)
      console.log(`   📞 Phone: ${siteConfig.attributes?.contact?.phone || 'N/A'}`)
      console.log(`   📧 Email: ${siteConfig.attributes?.contact?.email || 'N/A'}`)
      console.log(`   🧭 Navigation Items: ${siteConfig.attributes?.navigation?.main?.length || 0}`)
      break
    }
  }

  if (!foundSiteId) {
    console.log(`   ⚠️  No site configuration found for any of the tested IDs`)
    return
  }

  // Test 2: Pages API with correct site ID
  console.log(`\n🔍 Testing Pages with Site ID: ${foundSiteId}`)

  // Try different possible page slugs
  const possibleSlugs = ['home', 'startseite', 'homepage']
  let foundHomePage = null

  for (const slug of possibleSlugs) {
    const pagesResult = await apiCall(
      `/pages?filters[slug][$eq]=${slug}&filters[sites][siteIdentifier][$eq]=${foundSiteId}&populate[0]=sections&populate[1]=sections.slides&populate[2]=sections.slides.titleLines&populate[3]=sections.slides.ctaButtons&populate[4]=sections.slides.backgroundImage&populate[5]=sections.slides.badge&populate[6]=seo`,
      `Pages API (${slug})`
    )

    if (pagesResult.success && pagesResult.data.data && pagesResult.data.data.length > 0) {
      foundHomePage = pagesResult.data.data[0]
      console.log(`   🎯 FOUND HOMEPAGE: ${slug}`)
      console.log(`   📄 Page Title: ${foundHomePage.attributes?.title || 'N/A'}`)
      console.log(`   🔗 Page Slug: ${foundHomePage.attributes?.slug || 'N/A'}`)
      console.log(`   🧩 Sections: ${foundHomePage.attributes?.sections?.length || 0}`)
      break
    }
  }

  // Also try to list all pages for this site
  const allPagesResult = await apiCall(
    `/pages?filters[sites][siteIdentifier][$eq]=${foundSiteId}&populate[0]=sections&populate[1]=sections.slides`,
    `All Pages for Site (${foundSiteId})`
  )

  if (allPagesResult.success && allPagesResult.data.data) {
    console.log(`\n📚 All Pages found for ${foundSiteId}:`)
    allPagesResult.data.data.forEach((page, index) => {
      console.log(`   ${index + 1}. "${page.attributes.title}" (slug: ${page.attributes.slug})`)
      console.log(`      🧩 Sections: ${page.attributes?.sections?.length || 0}`)
    })

    // Use the first page if we haven't found a homepage
    if (!foundHomePage && allPagesResult.data.data.length > 0) {
      foundHomePage = allPagesResult.data.data[0]
      console.log(`\n🎯 Using first page as homepage: "${foundHomePage.attributes.title}"`)
    }
  }

  // Test 3: Detailed Hero Carousel Analysis
  if (foundHomePage && foundHomePage.attributes?.sections) {
    const sections = foundHomePage.attributes.sections
    const heroCarousel = sections.find(section => section.__component === 'sections.hero-carousel')

    if (heroCarousel) {
      console.log(`\n🎠 HERO CAROUSEL FOUND!`)
      console.log(`   🎫 Carousel ID: ${heroCarousel.id}`)
      console.log(`   🎬 Slides: ${heroCarousel.slides?.length || 0}`)
      console.log(`   ⏱️  Autoplay: ${heroCarousel.autoplay !== false ? 'Yes' : 'No'}`)
      console.log(`   ⏲️  Interval: ${heroCarousel.autoplayInterval || 'Default'}ms`)

      if (heroCarousel.slides?.length > 0) {
        console.log(`\n📸 SLIDE DETAILS:`)
        heroCarousel.slides.forEach((slide, index) => {
          console.log(`   Slide ${index + 1}:`)
          console.log(`      📝 Title Lines: ${slide.titleLines?.length || 0}`)
          if (slide.titleLines?.length > 0) {
            slide.titleLines.forEach((line, lineIndex) => {
              console.log(`         ${lineIndex + 1}. "${line.text}" ${line.highlight ? '(highlighted)' : ''}`)
            })
          }
          console.log(`      🏷️  Badge: ${slide.badge?.text || 'None'}`)
          console.log(`      📄 Subtitle: ${slide.subtitle || 'None'}`)
          console.log(`      📝 Description: ${slide.description ? slide.description.substring(0, 50) + '...' : 'None'}`)
          console.log(`      🖼️  Background: ${slide.backgroundImage ? 'Yes' : 'No'}`)
          console.log(`      🔘 CTA Buttons: ${slide.ctaButtons?.length || 0}`)
          if (slide.ctaButtons?.length > 0) {
            slide.ctaButtons.forEach((btn, btnIndex) => {
              console.log(`         ${btnIndex + 1}. "${btn.text}" → ${btn.href}`)
            })
          }
        })
      }
    } else {
      console.log(`\n🎠 Hero Carousel: Not found`)
      console.log(`📦 Available Section Types:`)
      sections.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section.__component || 'unknown'} (ID: ${section.id})`)
      })
    }
  }

  // Test Summary
  console.log(`\n📊 Test Summary:`)
  console.log(`   ✅ Passed: ${passedTests}/${totalTests}`)
  console.log(`   📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)
  console.log(`   🎯 Found Site ID: ${foundSiteId || 'None'}`)
  console.log(`   📄 Found Homepage: ${foundHomePage ? 'Yes' : 'No'}`)

  // Development recommendations
  console.log(`\n💡 Next Steps:`)

  if (foundSiteId && foundHomePage) {
    console.log(`   ✅ Update your .env.local with: SITE_IDENTIFIER=${foundSiteId}`)
    console.log(`   ✅ Update your code to use site ID: "${foundSiteId}"`)
    console.log(`   ✅ Homepage slug: "${foundHomePage.attributes.slug}"`)
    console.log(`   🚀 Ready to load real content!`)
  } else {
    console.log(`   🔧 Check Strapi server status at: ${baseUrl}`)
    console.log(`   🔍 Verify content exists in Strapi admin`)
    console.log(`   📋 Ensure content types are published`)
  }

  console.log(`\n📖 Strapi Admin: ${baseUrl.replace('/api', '/admin')}`)
  console.log(`🏗️  Next.js Dev: bun dev`)
  console.log(`🧪 Test Again: node scripts/test-strapi-api.js`)

  console.log(`\n🎯 Status: ${foundSiteId && foundHomePage ? 'READY FOR REAL CONTENT!' : 'NEEDS SETUP'}`)
}

// Run the test
testStrapiConnection().catch(error => {
  console.error('💥 Test script failed:', error)
  process.exit(1)
})
