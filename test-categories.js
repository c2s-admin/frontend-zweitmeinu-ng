// Test FAQ Category Relations
const BASE_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || ''

async function testFAQCategories() {
  console.log('🔍 Testing FAQ Category Relations...\n')

  try {
    // Test 1: Get FAQs with category population
    console.log('📋 Test 1: FAQs with populated categories')
    const faqResponse = await fetch(`${BASE_URL}/faqs?populate=category&pagination[limit]=10`, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!faqResponse.ok) {
      throw new Error(`FAQ API failed: ${faqResponse.statusText}`)
    }

    const faqData = await faqResponse.json()
    console.log(`✅ Found ${faqData.data?.length || 0} FAQs`)

    let withCategories = 0
    let withoutCategories = 0
    const categoryDistribution = {}

    faqData.data?.forEach((faq, index) => {
      const hasCategory = faq.category && faq.category.slug
      if (hasCategory) {
        withCategories++
        const categorySlug = faq.category.slug
        categoryDistribution[categorySlug] = (categoryDistribution[categorySlug] || 0) + 1
        console.log(`  FAQ ${index + 1}: "${faq.question.substring(0, 60)}..."`)
        console.log(`    ✅ Category: ${faq.category.name} (${faq.category.slug})`)
      } else {
        withoutCategories++
        console.log(`  FAQ ${index + 1}: "${faq.question.substring(0, 60)}..."`)
        console.log(`    ❌ NO CATEGORY`)
      }
    })

    console.log(`\n📊 Category Statistics:`)
    console.log(`  FAQs with categories: ${withCategories}`)
    console.log(`  FAQs without categories: ${withoutCategories}`)
    console.log(`  Category coverage: ${Math.round((withCategories / (withCategories + withoutCategories)) * 100)}%`)

    if (Object.keys(categoryDistribution).length > 0) {
      console.log(`\n📁 Category Distribution:`)
      Object.entries(categoryDistribution).forEach(([slug, count]) => {
        console.log(`  ${slug}: ${count} FAQs`)
      })
    }

    // Test 2: Get FAQ Categories
    console.log('\n📂 Test 2: FAQ Categories')
    const categoriesResponse = await fetch(`${BASE_URL}/faq-categories?sort=order:asc`, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!categoriesResponse.ok) {
      throw new Error(`Categories API failed: ${categoriesResponse.statusText}`)
    }

    const categoriesData = await categoriesResponse.json()
    console.log(`✅ Found ${categoriesData.data?.length || 0} categories`)

    categoriesData.data?.forEach((category, index) => {
      console.log(`  Category ${index + 1}: ${category.name} (${category.slug})`)
    })

    // Test 3: Test category filtering
    console.log('\n🔎 Test 3: Category filtering')
    const testCategorySlugs = ['zweitmeinung-kardiologie', 'zweitmeinung-onkologie', 'allgemeine-fragen-zur-zweitmeinung']

    for (const categorySlug of testCategorySlugs) {
      try {
        const filterResponse = await fetch(`${BASE_URL}/faqs?filters[category][slug][$eq]=${categorySlug}&populate=category&pagination[limit]=5`, {
          headers: { 'Content-Type': 'application/json' }
        })

        if (filterResponse.ok) {
          const filterData = await filterResponse.json()
          console.log(`  ${categorySlug}: ${filterData.data?.length || 0} FAQs found`)
        } else {
          console.log(`  ${categorySlug}: ❌ Filter failed (${filterResponse.status})`)
        }
      } catch (error) {
        console.log(`  ${categorySlug}: ❌ Error - ${error.message}`)
      }
    }

    console.log('\n✅ Category relation test completed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testFAQCategories()
