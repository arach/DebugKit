# DebugKit

A minimal, reusable debug toolbar for macOS SwiftUI apps.

## Philosophy

DebugKit handles the **scaffolding** - the toggle button, panel animations, copy-to-clipboard, action buttons - so you can focus on **what data to show**, not how to show it.

The pattern is simple:
- **You provide**: Data sections and actions specific to your app
- **DebugKit provides**: The entire UI chrome, animations, and interactions

This keeps debug toolbars consistent across projects while letting each app surface its own relevant state.

## Setup

Add to your `Package.swift`:

```swift
dependencies: [
    .package(path: "../DebugKit")  // local
    // or
    .package(url: "https://github.com/youruser/DebugKit", from: "1.0.0")
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
                    ]),
                    DebugSection("PERFORMANCE", [
                        ("FPS", "\(fps)"),
                        ("Memory", "\(memoryMB) MB")
                    ])
                ],
                actions: [
                    DebugAction("Reset", icon: "arrow.counterclockwise") {
                        count = 0
                    },
                    DebugAction("Clear Cache", icon: "trash", destructive: true) {
                        cache.clear()
                    }
                ],
                onCopy: {
                    "Count: \(count)\nStatus: \(status)"
                }
            )
        }
    }
}
```

## API

### DebugToolbar

```swift
DebugToolbar(
    title: String = "DEV",           // Header text
    icon: String = "ant.fill",       // SF Symbol for toggle button
    sections: [DebugSection],        // Data to display
    actions: [DebugAction] = [],     // Action buttons
    onCopy: (() -> String)? = nil    // Copy-to-clipboard handler
)
```

### DebugSection

```swift
DebugSection("SECTION NAME", [
    ("Key", "Value"),
    ("Another Key", "Another Value")
])
```

### DebugAction

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
