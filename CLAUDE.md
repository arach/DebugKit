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
        actions: buildActions(),
        onCopy: { buildCopyText() }
    )
}
#endif
```

3. **Sections show key-value pairs** - Group related state:

```swift
DebugSection("CANVAS", [
    ("Zoom", String(format: "%.0f%%", scale * 100)),
    ("Offset", "(\(Int(offset.x)), \(Int(offset.y)))"),
    ("Selected", "\(selectedIds.count)")
])
```

4. **Actions for common debug operations**:

```swift
DebugAction("Reset Zoom", icon: "arrow.up.left.and.arrow.down.right") {
    scale = 1.0
    offset = .zero
}
```

5. **onCopy for clipboard export** - Format as readable text:

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
- Include a "copy debug info" via onCopy for bug reports

## Don't

- Put business logic in actions - just state resets and debug helpers
- Over-engineer sections - simple key-value pairs are fine
- Forget destructive: true for destructive actions (shows red)

## Adding to a Project

```swift
// Package.swift
dependencies: [
    .package(path: "../DebugKit")
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
                ("Zoom", String(format: "%.0f%%", state.scale * 100)),
                ("Offset", "(\(Int(state.offset.width)), \(Int(state.offset.height)))"),
                ("Nodes", "\(state.nodes.count)"),
                ("Connections", "\(state.connections.count)")
            ])
        ],
        actions: [
            DebugAction("Reset Zoom", icon: "arrow.up.left.and.arrow.down.right") {
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
