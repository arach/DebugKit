# CLAUDE.md

Instructions for AI agents working with DebugKit.

## What This Is

DebugKit provides a reusable debug toolbar for macOS SwiftUI apps. It handles the UI chrome (toggle button, panel, animations, copy-to-clipboard) so apps just provide data.

## When To Use

Add a DebugToolbar when building macOS SwiftUI apps that need runtime state inspection. Good candidates:
- Canvas/editor apps with zoom, offset, selection state
- Apps with complex state machines
- Anything where "what's the current value of X?" comes up during development

## Implementation Pattern

1. **Place in ZStack overlay** - The toolbar positions itself bottom-right:

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

2. **Use computed property for the toolbar** - Keeps body clean:

```swift
#if DEBUG
private var debugToolbar: some View {
    DebugToolbar(
        sections: buildSections(),
        controls: buildControls(),
        actions: buildActions(),
        onCopy: { buildCopyText() }
    )
}
#endif
```

3. **Sections show key-value pairs** - Group related read-only state:

```swift
DebugSection("CANVAS", [
    ("Zoom", String(format: "%.0f%%", scale * 100)),
    ("Offset", "(\(Int(offset.x)), \(Int(offset.y)))"),
    ("Selected", "\(selectedIds.count)")
])
```

4. **Controls for editable state** - Use when you want to tweak values at runtime:

```swift
controls: [
    .toggle("Grid", binding: $showGrid),
    .stepper("Zoom %", binding: $zoomLevel, range: 10...200, step: 10),
    .slider("Opacity", binding: $opacity, range: 0...1),
    .text("Label", binding: $nodeLabel),
    .picker("Mode", options: ["Edit", "Preview", "Export"], binding: $mode)
]
```

5. **Actions for common debug operations**:

```swift
DebugAction("Reset Zoom", icon: "arrow.up.left.and.arrow.down.right") {
    scale = 1.0
    offset = .zero
}
```

6. **onCopy for clipboard export** - Format as readable text:

```swift
onCopy: {
    """
    Scale: \(scale)
    Offset: \(offset)
    Selected: \(selectedIds)
    """
}
```

## Do

- Wrap usage in `#if DEBUG` - the library doesn't do this for you
- Use SF Symbols for action icons
- Format numbers nicely (%.2f, Int(), etc.)
- Group related values into sections
- Use controls for values you frequently tweak during development
- Use bindings for simple state, closures when you need side effects
- Include a "copy debug info" via onCopy for bug reports

## Don't

- Put business logic in actions or control callbacks - just state updates and debug helpers
- Over-engineer sections - simple key-value pairs are fine
- Forget destructive: true for destructive actions (shows red)
- Use controls for values that should never be changed at runtime

## Adding to a Project

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/arach/DebugKit", branch: "main")
]

// Target
.target(name: "YourApp", dependencies: ["DebugKit"])

// Import
import DebugKit
```

## Example From WFKit

```swift
#if DEBUG
private var debugToolbar: some View {
    DebugToolbar(
        sections: [
            DebugSection("CANVAS", [
                ("Nodes", "\(state.nodes.count)"),
                ("Connections", "\(state.connections.count)")
            ])
        ],
        controls: [
            .toggle("Show Grid", binding: $state.showGrid),
            .stepper("Zoom %", value: Int(state.scale * 100), range: 25...400, step: 25) { newValue in
                withAnimation { state.scale = Double(newValue) / 100.0 }
            },
            .picker("Tool", options: ["Select", "Pan", "Connect"], binding: $state.currentTool)
        ],
        actions: [
            DebugAction("Reset View", icon: "arrow.up.left.and.arrow.down.right") {
                withAnimation { state.scale = 1.0; state.offset = .zero }
            },
            DebugAction("Clear All", icon: "trash", destructive: true) {
                state.nodes.removeAll()
                state.connections.removeAll()
            }
        ],
        onCopy: { buildDebugCopyText() }
    )
}
#endif
```
