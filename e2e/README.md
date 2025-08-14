# End-to-End Tests

This directory contains comprehensive e2e tests for the Audio2Relations web client application using Playwright.

## Test Structure

### Feature Tests
- **`navigation.spec.ts`** - Tests navigation between all features
- **`record.spec.ts`** - Tests audio recording functionality
- **`dashboard.spec.ts`** - Tests dashboard statistics and charts
- **`calendar.spec.ts`** - Tests calendar navigation and event display
- **`timeline.spec.ts`** - Tests timeline event display and ordering
- **`auth.spec.ts`** - Tests authentication flow and form validation

### Integration Tests
- **`integration.spec.ts`** - Tests complete workflows and data consistency across features

## Running Tests

### All Tests
```bash
npm run e2e
```

### Interactive Mode (UI)
```bash
npm run e2e:ui
```

### Headed Mode (Visible Browser)
```bash
npm run e2e:headed
```

### Debug Mode
```bash
npm run e2e:debug
```

### Specific Test File
```bash
npx playwright test e2e/record.spec.ts
```

### Specific Test
```bash
npx playwright test -g "should display record page with controls"
```

## Test Features

### Cross-Browser Testing
Tests run on:
- Chromium
- Firefox
- WebKit (Safari)

### Responsive Testing
Tests include mobile (375x667) and desktop (1920x1080) viewports.

### Mocking
Tests use mock services to simulate:
- Audio recording functionality
- Timeline data
- Authentication services

### Screenshots & Videos
- Screenshots on test failure
- Trace files for debugging
- HTML reports for test results

## Test Coverage

### Record Feature
- ✅ Recording controls state management
- ✅ Start/Stop recording workflow
- ✅ Audio playback functionality
- ✅ Save to timeline integration

### Dashboard Feature
- ✅ Statistics display
- ✅ Chart component rendering
- ✅ Data updates and calculations

### Calendar Feature
- ✅ Date navigation (Prev/Next)
- ✅ Event filtering by date
- ✅ Current date display

### Timeline Feature
- ✅ Event display and ordering
- ✅ Timestamp formatting
- ✅ Empty state handling

### Authentication Feature
- ✅ Login form validation
- ✅ Success/failure scenarios
- ✅ Form state preservation

### Integration Features
- ✅ Complete recording workflow
- ✅ Cross-feature navigation
- ✅ Data consistency
- ✅ Responsive design

## Configuration

The tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:4200`
- Automatic server startup
- Parallel test execution
- Retry logic for CI environments
- Multiple browser support

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are mocked for reliable testing
3. **Assertions**: Clear, specific assertions for each test scenario
4. **Error Handling**: Tests handle both success and failure scenarios
5. **Performance**: Tests are optimized for speed while maintaining reliability
