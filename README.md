# DebugKit

Debug toolbar for macOS SwiftUI apps.

## Install

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/arach/DebugKit", branch: "main")
]

// Target
.target(name: "YourApp", dependencies: ["DebugKit"])
```

## Usage

```swift
import DebugKit

struct ContentView: View {
    @State private var count = 0
    @State private var isActive = false
    @State private var scale = 1.0

    var body: some View {
        ZStack {
            MainContent()

            DebugToolbar(
                sections: [
                    DebugSection("STATE", [
                        ("Count", "\(count)"),
                        ("Status", isActive ? "Active" : "Idle")
                    ])
                ],
                controls: [
                    .toggle("Active", binding: $isActive),
                    .stepper("Count", binding: $count, range: 0...100),
                    .slider("Scale", binding: $scale, range: 0.5...2.0)
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

### Closures

```swift
.toggle("Debug", value: isDebug) { newValue in
    isDebug = newValue
    logger.setLevel(newValue ? .debug : .info)
}
```

## API

```swift
DebugToolbar(
    title: String = "DEV",
    icon: String = "ant.fill",
    sections: [DebugSection] = [],
    controls: [DebugControl] = [],
    actions: [DebugAction] = [],
    onCopy: (() -> String)? = nil
)
```

### DebugSection

```swift
DebugSection("NAME", [
    ("Key", "Value")
])
```

### DebugControl

```swift
.toggle("Label", binding: $bool)
.stepper("Label", binding: $int, range: 0...100)
.slider("Label", binding: $double, range: 0.0...1.0)
.text("Label", binding: $string)
.picker("Label", options: ["A", "B"], binding: $selection)
```

### DebugAction

```swift
DebugAction("Label", icon: "sf.symbol", destructive: false) {
    // do something
}
```

## Notes

- Doesn't wrap in `#if DEBUG` — do that yourself
- Positions bottom-right in a ZStack
- macOS only

## License

MIT
