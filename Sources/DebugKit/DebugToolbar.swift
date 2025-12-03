//
//  DebugToolbar.swift
//  DebugKit
//
//  A reusable debug toolbar for macOS SwiftUI apps
//

import SwiftUI
import AppKit

// MARK: - Data Types

public struct DebugSection: Identifiable {
    public let id = UUID()
    public let title: String
    public let rows: [(key: String, value: String)]

    public init(_ title: String, _ rows: [(String, String)]) {
        self.title = title
        self.rows = rows.map { (key: $0.0, value: $0.1) }
    }
}

public struct DebugAction: Identifiable {
    public let id = UUID()
    public let icon: String
    public let label: String
    public let destructive: Bool
    public let action: () -> Void

    public init(_ label: String, icon: String, destructive: Bool = false, action: @escaping () -> Void) {
        self.icon = icon
        self.label = label
        self.destructive = destructive
        self.action = action
    }
}

// MARK: - Debug Toolbar

public struct DebugToolbar: View {
    @State private var isExpanded = false
    @State private var showCopiedFeedback = false

    let title: String
    let icon: String
    let sections: [DebugSection]
    let actions: [DebugAction]
    let copyHandler: (() -> String)?

    public init(
        title: String = "DEV",
        icon: String = "ant.fill",
        sections: [DebugSection],
        actions: [DebugAction] = [],
        onCopy copyHandler: (() -> String)? = nil
    ) {
        self.title = title
        self.icon = icon
        self.sections = sections
        self.actions = actions
        self.copyHandler = copyHandler
    }

    public var body: some View {
        ZStack(alignment: .bottomTrailing) {
            if isExpanded {
                expandedPanel
                    .transition(.scale(scale: 0.9, anchor: .bottomTrailing).combined(with: .opacity))
            }

            toggleButton
        }
        .padding(.trailing, 16)
        .padding(.bottom, 16)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
    }

    // MARK: - Toggle Button

    private var toggleButton: some View {
        Button(action: {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                isExpanded.toggle()
            }
        }) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(isExpanded ? .orange : .secondary)
                .rotationEffect(.degrees(isExpanded ? 180 : 0))
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isExpanded)
                .frame(width: 32, height: 32)
                .background(
                    Circle()
                        .fill(Color(nsColor: .controlBackgroundColor))
                        .shadow(color: Color.black.opacity(0.2), radius: 4, x: 0, y: 2)
                )
                .overlay(
                    Circle()
                        .strokeBorder(Color(nsColor: .separatorColor), lineWidth: 1)
                )
        }
        .buttonStyle(.plain)
    }

    // MARK: - Expanded Panel

    private var expandedPanel: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Text(title)
                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                    .tracking(2)
                    .foregroundColor(.primary)

                Spacer()

                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        isExpanded = false
                    }
                }) {
                    Image(systemName: "xmark")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.secondary)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(nsColor: .controlBackgroundColor))

            Divider()

            // Content
            VStack(alignment: .leading, spacing: 10) {
                ForEach(sections) { section in
                    SectionView(section: section)
                }

                if !actions.isEmpty || copyHandler != nil {
                    ActionsView(
                        actions: actions,
                        copyHandler: copyHandler,
                        showCopiedFeedback: $showCopiedFeedback
                    )
                }
            }
            .padding(10)
            .padding(.bottom, 6)
        }
        .frame(width: 280)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(nsColor: .windowBackgroundColor))
                .shadow(color: Color.black.opacity(0.3), radius: 12, x: 0, y: 4)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .strokeBorder(Color(nsColor: .separatorColor), lineWidth: 0.5)
        )
    }
}

// MARK: - Section View

private struct SectionView: View {
    let section: DebugSection

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(section.title)
                .font(.system(size: 9, weight: .semibold, design: .monospaced))
                .tracking(1)
                .foregroundColor(.secondary)

            VStack(spacing: 0) {
                ForEach(Array(section.rows.enumerated()), id: \.offset) { index, row in
                    HStack {
                        Text(row.key)
                            .font(.system(size: 10, weight: .medium, design: .monospaced))
                            .foregroundColor(.secondary)

                        Spacer()

                        Text(row.value)
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(.primary)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 5)
                    .background(index % 2 == 0 ? Color(nsColor: .controlBackgroundColor).opacity(0.5) : Color.clear)
                }
            }
            .background(Color(nsColor: .controlBackgroundColor).opacity(0.3))
            .cornerRadius(4)
            .overlay(
                RoundedRectangle(cornerRadius: 4)
                    .strokeBorder(Color(nsColor: .separatorColor).opacity(0.5), lineWidth: 0.5)
            )
        }
    }
}

// MARK: - Actions View

private struct ActionsView: View {
    let actions: [DebugAction]
    let copyHandler: (() -> String)?
    @Binding var showCopiedFeedback: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("ACTIONS")
                .font(.system(size: 9, weight: .semibold, design: .monospaced))
                .tracking(1)
                .foregroundColor(.secondary)

            VStack(spacing: 4) {
                ForEach(actions) { action in
                    ActionButton(
                        icon: action.icon,
                        label: action.label,
                        destructive: action.destructive,
                        action: action.action
                    )
                }

                if let copyHandler = copyHandler {
                    ActionButton(
                        icon: showCopiedFeedback ? "checkmark" : "doc.on.clipboard",
                        label: showCopiedFeedback ? "Copied!" : "Copy Debug Info",
                        action: {
                            let text = copyHandler()
                            NSPasteboard.general.clearContents()
                            NSPasteboard.general.setString(text, forType: .string)

                            withAnimation {
                                showCopiedFeedback = true
                            }
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                                withAnimation {
                                    showCopiedFeedback = false
                                }
                            }
                        }
                    )
                }
            }
        }
    }
}

// MARK: - Action Button

private struct ActionButton: View {
    let icon: String
    let label: String
    var destructive: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(destructive ? .red : .accentColor)
                    .frame(width: 14)

                Text(label)
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundColor(destructive ? .red : .primary)

                Spacer()
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 6)
            .background(Color(nsColor: .controlBackgroundColor))
            .cornerRadius(4)
        }
        .buttonStyle(.plain)
    }
}
