// Test FAQ Auto-Complete API - Medical Categories and Terms
const BASE_URL = 'http://localhost:3000'

async function testAutoCompleteCategories() {
  console.log('🔍 Testing FAQ Auto-Complete API - Medical Categories...\n')

  // Test cases for different medical categories and terms
  const testCases = [
    // Kardiologie
    { query: 'herz', category: 'Kardiologie', expectedTerms: ['herz', 'herzinfarkt', 'bypass', 'stent'] },
    { query: 'kardio', category: 'Kardiologie', expectedTerms: ['kardio', 'kardiologie'] },
    { query: 'bypass', category: 'Kardiologie', expectedTerms: ['bypass', 'herzbypass'] },
    { query: 'stent', category: 'Kardiologie', expectedTerms: ['stent', 'koronarstent'] },

    // Onkologie
    { query: 'krebs', category: 'Onkologie', expectedTerms: ['krebs', 'karzinom', 'tumor'] },
    { query: 'chemo', category: 'Onkologie', expectedTerms: ['chemo', 'chemotherapie'] },
    { query: 'tumor', category: 'Onkologie', expectedTerms: ['tumor', 'krebs'] },
    { query: 'onko', category: 'Onkologie', expectedTerms: ['onko', 'onkologie'] },

    // Gallenblase
    { query: 'gallen', category: 'Gallenblase', expectedTerms: ['gallenblase', 'gallenstein'] },
    { query: 'cholezyst', category: 'Gallenblase', expectedTerms: ['cholezystektomie'] },

    // Nephrologie
    { query: 'niere', category: 'Nephrologie', expectedTerms: ['niere', 'nieren', 'dialyse'] },
    { query: 'dialyse', category: 'Nephrologie', expectedTerms: ['dialyse', 'hämodialyse'] },

    // Schilddrüse
    { query: 'schild', category: 'Schilddrüse', expectedTerms: ['schilddrüse', 'struma'] },
    { query: 'thyroid', category: 'Schilddrüse', expectedTerms: ['thyroid', 'thyreoidektomie'] },

    // Intensivmedizin
    { query: 'intensiv', category: 'Intensivmedizin', expectedTerms: ['intensiv', 'intensivstation'] },
    { query: 'beatmung', category: 'Intensivmedizin', expectedTerms: ['beatmung', 'ventilation'] },

    // Allgemeine Begriffe
    { query: 'zweitmeinung', category: 'Allgemein', expectedTerms: ['zweitmeinung', 'gutachten'] },
    { query: 'operation', category: 'Allgemein', expectedTerms: ['operation', 'op', 'eingriff'] },
    { query: 'diagnose', category: 'Allgemein', expectedTerms: ['diagnose', 'befund'] },

    // Fuzzy Search Tests
    { query: 'herzi', category: 'Kardiologie', fuzzyTest: true },
    { query: 'kreb', category: 'Onkologie', fuzzyTest: true },
    { query: 'gall', category: 'Gallenblase', fuzzyTest: true },

    // Popular Search Tests
    { query: 'kosten', category: 'Popular', expectedTerms: ['kosten', 'preis'] },
    { query: 'notwendig', category: 'Popular', expectedTerms: ['notwendig', 'operation'] }
  ]

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

  console.log('🧪 Starting Auto-Complete API Tests...\n')

  for (const testCase of testCases) {
    totalTests++
    console.log(`📝 Test ${totalTests}: "${testCase.query}" (${testCase.category})`)

    try {
      // Make API request
      const response = await fetch(`${BASE_URL}/api/faq/autocomplete?q=${encodeURIComponent(testCase.query)}&limit=10`, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        console.log(`   ❌ API Error: ${response.status} ${response.statusText}`)
        failedTests++
        continue
      }

      const data = await response.json()
      console.log(`   ✅ API Response: ${data.totalSuggestions} suggestions (${data.processingTime}ms)`)

      // Analyze suggestions
      let medicalTerms = 0
      let popularSearches = 0
      let faqSuggestions = 0
      let expectedTermsFound = 0

      data.suggestions.forEach(suggestion => {
        console.log(`     - ${suggestion.text} (${suggestion.type}, score: ${suggestion.score.toFixed(2)})`)

        switch (suggestion.type) {
          case 'medical-term':
            medicalTerms++
            break
          case 'popular-search':
            popularSearches++
            break
          case 'faq':
            faqSuggestions++
            break
        }

        // Check if expected terms are found
        if (testCase.expectedTerms) {
          testCase.expectedTerms.forEach(expectedTerm => {
            if (suggestion.text.toLowerCase().includes(expectedTerm.toLowerCase())) {
              expectedTermsFound++
            }
          })
        }
      })

      // Test evaluation
      let testPassed = true
      const issues = []

      // Check if we got suggestions
      if (data.totalSuggestions === 0) {
        testPassed = false
        issues.push('No suggestions returned')
      }

      // Check response time
      if (data.processingTime > 200) {
        issues.push(`Slow response: ${data.processingTime}ms`)
      }

      // Check for medical terms (should be primary for medical queries)
      if (!testCase.fuzzyTest && medicalTerms === 0 && testCase.category !== 'Popular') {
        issues.push('No medical terms found')
      }

      // Check for expected terms (if specified)
      if (testCase.expectedTerms && expectedTermsFound === 0) {
        testPassed = false
        issues.push('Expected terms not found')
      }

      // Fuzzy search test evaluation
      if (testCase.fuzzyTest && data.totalSuggestions === 0) {
        testPassed = false
        issues.push('Fuzzy search failed')
      }

      console.log(`   📊 Analysis: ${medicalTerms} medical, ${popularSearches} popular, ${faqSuggestions} FAQ`)

      if (testPassed) {
        console.log(`   ✅ PASSED`)
        passedTests++
      } else {
        console.log(`   ❌ FAILED: ${issues.join(', ')}`)
        failedTests++
      }

      if (issues.length > 0 && testPassed) {
        console.log(`   ⚠️  Issues: ${issues.join(', ')}`)
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`)
      failedTests++
    }

    console.log('') // Empty line for readability
  }

  // Summary
  console.log('📊 TEST SUMMARY')
  console.log('================')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`)
  console.log(`Failed: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`)
  console.log('')

  // Additional API health tests
  console.log('🏥 ADDITIONAL API HEALTH TESTS')
  console.log('===============================')

  // Test rate limiting
  console.log('⚡ Testing rate limiting...')
  const rateLimitTests = []
  for (let i = 0; i < 55; i++) { // Try to exceed 50 req/10s limit
    rateLimitTests.push(
      fetch(`${BASE_URL}/api/faq/autocomplete?q=test${i}&limit=5`)
    )
  }

  try {
    const results = await Promise.all(rateLimitTests)
    const rateLimitHit = results.some(r => r.status === 429)
    console.log(`   ${rateLimitHit ? '✅' : '⚠️'} Rate limiting: ${rateLimitHit ? 'Working' : 'Not triggered'}`)
  } catch (error) {
    console.log(`   ❌ Rate limit test failed: ${error.message}`)
  }

  // Test caching
  console.log('💾 Testing caching...')
  const cacheTestQuery = 'herzinfarkt'

  const time1 = Date.now()
  await fetch(`${BASE_URL}/api/faq/autocomplete?q=${cacheTestQuery}`)
  const firstRequestTime = Date.now() - time1

  const time2 = Date.now()
  await fetch(`${BASE_URL}/api/faq/autocomplete?q=${cacheTestQuery}`)
  const secondRequestTime = Date.now() - time2

  const cacheWorking = secondRequestTime < firstRequestTime * 0.8
  console.log(`   ${cacheWorking ? '✅' : '⚠️'} Caching: ${cacheWorking ? 'Working' : 'Unclear'} (${firstRequestTime}ms → ${secondRequestTime}ms)`)

  // Test edge cases
  console.log('🔬 Testing edge cases...')
  const edgeCases = [
    { query: '', expectedSuggestions: 0, name: 'Empty query' },
    { query: 'x', expectedSuggestions: 0, name: 'Too short query' },
    { query: 'zzzzzzzzz', expectedSuggestions: 0, name: 'Non-existent term' },
    { query: '<script>alert("xss")</script>', expectedSuggestions: 0, name: 'XSS attempt' },
    { query: 'herzinfarkt '.repeat(50), name: 'Very long query' }
  ]

  for (const edgeCase of edgeCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/faq/autocomplete?q=${encodeURIComponent(edgeCase.query)}`)
      const data = await response.json()

      let result = '✅'
      if (edgeCase.expectedSuggestions !== undefined && data.totalSuggestions !== edgeCase.expectedSuggestions) {
        result = '⚠️'
      }

      console.log(`   ${result} ${edgeCase.name}: ${data.totalSuggestions} suggestions`)
    } catch (error) {
      console.log(`   ❌ ${edgeCase.name}: ${error.message}`)
    }
  }

  console.log('\n🎯 AUTO-COMPLETE CATEGORY TESTING COMPLETED!')
}

// Run the test
testAutoCompleteCategories().catch(console.error)
