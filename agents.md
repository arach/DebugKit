# agents.md

Guidance for AI coding assistants (Claude Code, Cursor, Copilot, etc.) working with DebugKit.

## Quick Reference

**What is DebugKit?** A Swift package providing a debug toolbar overlay for macOS SwiftUI apps.

**Platform:** macOS 13.0+ only (uses `NSPasteboard`, `nsColor`)

**Swift version:** 5.9+

## Core Types

| Type | Purpose | Key Properties |
|------|---------|----------------|
| `DebugToolbar` | Main view component | `title`, `icon`, `sections`, `controls`, `actions`, `onCopy` |
| `DebugSection` | Groups read-only key-value pairs | `title`, `rows: [(String, String)]` |
| `DebugControl` | Editable control (toggle, stepper, etc.) | varies by control type |
| `DebugAction` | Clickable action button | `label`, `icon`, `destructive`, `action` |

## When to Add DebugKit

Add a `DebugToolbar` when the app has:
- Complex mutable state (zoom, offset, selection, mode)
- State machines or multi-step workflows
- Canvas/editor views with transforms
- Network/cache state worth inspecting
- Any "what's the value of X right now?" debugging need

Do NOT add DebugKit for:
- Simple single-screen apps
- Apps with obvious/minimal state
- Production-only builds (no debug use case)

## Implementation Checklist

When adding DebugKit to an existing app:

1. **Add dependency** to Package.swift:
   ```swift
   dependencies: [
       .package(url: "https://github.com/arach/DebugKit", branch: "main")
   ]
   // In target:
   .target(name: "AppName", dependencies: ["DebugKit"])
   ```

2. **Import in view file**:
   ```swift
   import DebugKit
   ```

3. **Add to view's ZStack** (bottom layer):
   ```swift
   var body: some View {
       ZStack {
           MainContent()

           #if DEBUG
           debugToolbar
           #endif
       }
   }
   ```

4. **Create computed property** for toolbar:
   ```swift
   #if DEBUG
   private var debugToolbar: some View {
       DebugToolbar(
           sections: [...],
           controls: [...],
           actions: [...],
           onCopy: { ... }
       )
   }
   #endif
   ```

## Code Patterns

### Building Sections

Group related state together. Name sections with ALL CAPS:

```swift
DebugSection("CANVAS", [
    ("Zoom", String(format: "%.0f%%", scale * 100)),
    ("Offset", "(\(Int(offset.x)), \(Int(offset.y)))"),
    ("Selection", "\(selectedIds.count) items")
])

DebugSection("NETWORK", [
    ("Status", isConnected ? "Connected" : "Disconnected"),
    ("Requests", "\(pendingRequests)")
])
```

### Value Formatting

| Type | Format | Example |
|------|--------|---------|
| Percentages | `%.0f%%` or `%.1f%%` | `"75%"` |
| Coordinates | `"(\(Int(x)), \(Int(y)))"` | `"(120, -45)"` |
| Counts | `"\(count)"` or `"\(count) items"` | `"3 items"` |
| Booleans | Descriptive strings | `"Active"` / `"Idle"` |
| Optionals | Handle nil case | `value ?? "None"` |
| Decimals | `String(format: "%.2f", value)` | `"3.14"` |

### Building Controls

Use controls when you want to **edit** values at runtime, not just view them. Each control supports both bindings and closures:

```swift
controls: [
    // Boolean toggle
    .toggle("Grid", binding: $showGrid),

    // Integer stepper with +/- buttons
    .stepper("Count", binding: $count, range: 0...100, step: 1),

    // Double slider for continuous values
    .slider("Opacity", binding: $opacity, range: 0.0...1.0),

    // Text field (commits on Enter or blur)
    .text("Name", binding: $name, placeholder: "Enter name"),

    // Dropdown picker
    .picker("Mode", options: ["Edit", "Preview"], binding: $mode)
]
```

**Using closures** (for side effects beyond state updates):

```swift
.stepper("Zoom", value: zoomPercent, range: 25...400, step: 25) { newValue in
    withAnimation { scale = Double(newValue) / 100.0 }
}

.text("API Key", value: apiKey) { newValue in
    apiKey = newValue
    client.updateKey(newValue)
}
```

| Control | Use Case | Parameters |
|---------|----------|------------|
| `.toggle` | On/off settings | `label`, `value`/`binding` |
| `.stepper` | Discrete integers | `label`, `value`/`binding`, `range?`, `step` |
| `.slider` | Continuous doubles | `label`, `value`/`binding`, `range`, `step?` |
| `.text` | String input | `label`, `value`/`binding`, `placeholder` |
| `.picker` | Selection from options | `label`, `options`, `selected`/`binding` |

### Building Actions

Use SF Symbols for icons. Common patterns:

```swift
// Reset action
DebugAction("Reset View", icon: "arrow.counterclockwise") {
    withAnimation {
        scale = 1.0
        offset = .zero
    }
}

// Destructive action (shows red)
DebugAction("Clear All", icon: "trash", destructive: true) {
    items.removeAll()
}

// Toggle action
DebugAction("Toggle Debug Mode", icon: "ladybug") {
    debugMode.toggle()
}
```

### Copy Handler

Format as human-readable text for bug reports:

```swift
onCopy: {
    """
    === App Debug Info ===
    Scale: \(scale)
    Offset: (\(offset.x), \(offset.y))
    Selected: \(selectedIds.joined(separator: ", "))
    Timestamp: \(Date())
    """
}
```

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|------------------|
| Forgetting `#if DEBUG` wrapper | Always wrap usage in `#if DEBUG` |
| Putting toolbar in VStack | Use ZStack - toolbar positions itself |
| Adding business logic to actions/controls | Actions and controls are for state updates only |
| Hardcoding values | Use live state bindings |
| Skipping `onCopy` | Always include for easy bug report sharing |
| Using text icons | Use SF Symbols (`Image(systemName:)`) |
| Complex section structures | Keep it simple: key-value pairs only |
| Using sections for editable state | Use controls for values you want to tweak |
| Using controls for read-only state | Use sections for display-only values |

## SF Symbol Suggestions

| Action Type | Symbol |
|-------------|--------|
| Reset/Refresh | `arrow.counterclockwise` |
| Zoom reset | `arrow.up.left.and.arrow.down.right` |
| Delete/Clear | `trash` |
| Toggle | `switch.2`, `ladybug` |
| Export/Share | `square.and.arrow.up` |
| Settings | `gear` |
| Copy | `doc.on.clipboard` |
| Info | `info.circle` |

## Full Example

```swift
import SwiftUI
import DebugKit

struct CanvasView: View {
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @State private var nodes: [Node] = []
    @State private var selectedIds: Set<UUID> = []
    @State private var showGrid = true
    @State private var snapToGrid = false

    var body: some View {
        ZStack {
            Canvas(nodes: nodes, scale: scale, offset: offset, showGrid: showGrid)

            #if DEBUG
            debugToolbar
            #endif
        }
    }

    #if DEBUG
    private var debugToolbar: some View {
        DebugToolbar(
            sections: [
                DebugSection("DATA", [
                    ("Nodes", "\(nodes.count)"),
                    ("Selected", "\(selectedIds.count)")
                ])
            ],
            controls: [
                .toggle("Show Grid", binding: $showGrid),
                .toggle("Snap to Grid", binding: $snapToGrid),
                .stepper("Zoom %", value: Int(scale * 100), range: 25...400, step: 25) { newValue in
                    withAnimation { scale = CGFloat(newValue) / 100.0 }
                }
            ],
            actions: [
                DebugAction("Reset View", icon: "arrow.up.left.and.arrow.down.right") {
                    withAnimation(.spring()) {
                        scale = 1.0
                        offset = .zero
                    }
                },
                DebugAction("Deselect All", icon: "xmark.circle") {
                    selectedIds.removeAll()
                },
                DebugAction("Clear Canvas", icon: "trash", destructive: true) {
                    nodes.removeAll()
                    selectedIds.removeAll()
                }
            ],
            onCopy: {
                """
                Canvas Debug Info
                -----------------
                Scale: \(scale)
                Offset: \(offset)
                Nodes: \(nodes.count)
                Selected IDs: \(selectedIds.map(\.uuidString).joined(separator: ", "))
                """
            }
        )
    }
    #endif
}
```

## Customization Options

The toolbar accepts optional customization:

```swift
DebugToolbar(
    title: "CANVAS",        // Default: "DEV"
    icon: "paintbrush",     // Default: "ant.fill"
    sections: [...],        // Read-only key-value pairs
    controls: [...],        // Editable controls
    actions: [...],         // Action buttons
    onCopy: { ... }
)
```

## File Locations

```
DebugKit/
├── Package.swift                        # SPM manifest
├── Sources/DebugKit/
│   └── DebugToolbar.swift              # All types in single file
├── README.md                            # User documentation
├── CLAUDE.md                            # Claude Code instructions
└── agents.md                            # This file
```

## Testing DebugToolbar Integration

After adding DebugToolbar:
1. Build the app (`swift build` or Cmd+B in Xcode)
2. Run in debug configuration
3. Verify the toggle button appears bottom-right (ant icon by default)
4. Click to expand and verify sections display correctly
5. Test each action
6. Test copy-to-clipboard functionality
