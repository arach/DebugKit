# DebugKit

A minimal, reusable debug toolbar for macOS SwiftUI apps.

## Philosophy

DebugKit handles the **scaffolding** - the toggle button, panel animations, copy-to-clipboard, action buttons, and editable controls - so you can focus on **what data to show**, not how to show it.

The pattern is simple:
- **You provide**: Data sections, editable controls, and actions specific to your app
- **DebugKit provides**: The entire UI chrome, animations, and interactions

This keeps debug toolbars consistent across projects while letting each app surface its own relevant state.

## Setup

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/arach/DebugKit", branch: "main")
]
```

Then add to your target:

```swift
.target(name: "YourApp", dependencies: ["DebugKit"])
```

## Usage

```swift
import DebugKit

struct ContentView: View {
    @State private var count = 0
    @State private var isActive = false
    @State private var scale = 1.0
    @State private var name = "Debug"

    var body: some View {
        ZStack {
            // Your main content
            MainContent()

            // Debug toolbar overlays in bottom-right
            DebugToolbar(
                sections: [
                    DebugSection("STATE", [
                        ("Count", "\(count)"),
                        ("Status", isActive ? "Active" : "Idle")
                    ])
                ],
                controls: [
                    // Toggle with binding
                    .toggle("Active", binding: $isActive),

                    // Stepper with range
                    .stepper("Count", binding: $count, range: 0...100),

                    // Slider for continuous values
                    .slider("Scale", binding: $scale, range: 0.5...2.0),

                    // Text field
                    .text("Name", binding: $name, placeholder: "Enter name"),

                    // Picker for options
                    .picker("Mode", options: ["Light", "Dark", "Auto"], binding: $mode)
                ],
                actions: [
                    DebugAction("Reset", icon: "arrow.counterclockwise") {
                        count = 0
                    }
                ],
                onCopy: {
                    "Count: \(count)\nActive: \(isActive)"
                }
            )
        }
    }
}
```

### Controls with Closures

If you prefer closures over bindings:

```swift
controls: [
    .toggle("Debug Mode", value: isDebug) { newValue in
        isDebug = newValue
        logger.setLevel(newValue ? .debug : .info)
    },
    .stepper("Zoom", value: zoomLevel, range: 1...10, step: 1) { newValue in
        zoomLevel = newValue
    },
    .text("API Key", value: apiKey) { newValue in
        apiKey = newValue
        client.updateKey(newValue)
    }
]
```

## API

### DebugToolbar

```swift
DebugToolbar(
    title: String = "DEV",              // Header text
    icon: String = "ant.fill",          // SF Symbol for toggle button
    sections: [DebugSection] = [],      // Read-only data to display
    controls: [DebugControl] = [],      // Editable controls
    actions: [DebugAction] = [],        // Action buttons
    onCopy: (() -> String)? = nil       // Copy-to-clipboard handler
)
```

### DebugSection

Read-only key-value pairs:

```swift
DebugSection("SECTION NAME", [
    ("Key", "Value"),
    ("Another Key", "Another Value")
])
```

### DebugControl

Editable controls for modifying state. Each supports both bindings and closures:

```swift
// Boolean toggle
.toggle("Label", binding: $bool)
.toggle("Label", value: bool) { newValue in ... }

// Integer stepper with +/- buttons
.stepper("Label", binding: $int, range: 0...100, step: 1)
.stepper("Label", value: int, range: 0...100, step: 1) { newValue in ... }

// Double slider
.slider("Label", binding: $double, range: 0.0...1.0, step: 0.1)
.slider("Label", value: double, range: 0.0...1.0) { newValue in ... }

// Text field (commits on Enter or focus loss)
.text("Label", binding: $string, placeholder: "hint")
.text("Label", value: string, placeholder: "hint") { newValue in ... }

// Dropdown picker
.picker("Label", options: ["A", "B", "C"], binding: $selection)
.picker("Label", options: ["A", "B", "C"], selected: selection) { newValue in ... }
```

### DebugAction

Buttons for triggering actions:

```swift
DebugAction("Label", icon: "sf.symbol.name", destructive: false) {
    // action
}
```

## Design Decisions

- **No `#if DEBUG` wrapper** - The library itself doesn't wrap in DEBUG flags. You decide where/when to show it. Wrap your usage in `#if DEBUG` if you want debug-only behavior.
- **Overlay pattern** - Designed to be placed in a ZStack overlay, positioned bottom-right
- **Minimal state** - Only tracks expanded/collapsed state internally
- **macOS only** - Uses `NSPasteboard` and `nsColor` for native look

## License

MIT
