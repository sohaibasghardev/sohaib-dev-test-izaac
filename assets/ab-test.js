window.abTests = window.abTests || {}
window.abTests.isTestReady = false;

// If you want to debug tests, you can set them in pendingTests
window.abTests.pendingTests = []

function setTestActive(testName) {

    // If setTestActive is fired before dom content loaded (or prepTestsInWindow runs)
    if (!window.abTests.isTestReady) {
        // Ignore duplicates
        if (!window.abTests.pendingTests.includes(testName)) {
            console.log('Added pending test: ' + testName)
            window.abTests.pendingTests.push(testName)
        }
        return;
    }

    try {
        // If test is already active - skip
        if (window.abTests.activeTests?.includes(testName)) return;

        // Does test exist?
        let testElement = window.abTests.testList[testName]

        // If yes, add active-test class and add to activeTests list
        if (testElement) {
            testElement.classList.add('ab__test--active-test');

            // Any elements which need additional styling when this test activates
            let affectedElements = document.querySelectorAll(`[data-test-name="${testName}"`)
            Array.from(affectedElements).forEach(function(n) {
                n.classList.add('ab__test--active-test');
                if (n.classList.contains('ab__test-hide')) {
                    n.classList.add('hidden')
                }
            })

            window.abTests.activeTests.push(testName)
            console.log(`Test ${testName} activated!`)
        } else {
            // If no - error
            console.error('Unable to find test: ' + testName)
        }
    } catch (e) {
        console.error('Unable to activate test: ' + testName)
        console.error(e)
    }
}

window.abTests = {
    ...window.abTests,
    setTestActive,
}

function prepTestsInWindow() {
    try {
        let allTests = document.querySelectorAll('.ab__test')
        let testList = Array.from(allTests).reduce((prev, n) => ({
            ...prev, [n.dataset.testName]: n
        }), {})

        window.abTests.isTestReady = true;
        window.abTests.testList = testList;
        window.abTests.activeTests = []

        // If any tests were attempted to be set before 
        if (window.abTests.pendingTests.length > 0) {
            window.abTests.pendingTests.forEach((n) => setTestActive(n))
        }
    
    } catch (e) {
        console.error(e)
    }
}

document.addEventListener('DOMContentLoaded', prepTestsInWindow)