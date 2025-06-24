---

````md
# 🧙 Magic Runes Documentation

Welcome to the documentation for the **Rune-Based Magic System**. This system is functionally driven and centers around the manipulation of **casting** and **target** locations. Runes are categorized by their purpose:

- **Domain Runes** control _where_ and _what_ you are casting on.
- **Modifier Runes** adjust _how_ the magic manifests.
- **Augment Runes** affect _what happens_ after or in addition to the cast.

---

## 🌀 Domain Runes

Domain runes manipulate the **location context**—they control the source, target, and flow of casting logic.

```kotlin
data object Origin : DomainRune()
````

| Rune     | Description                                                |
| -------- | ---------------------------------------------------------- |
| `Origin` | Resets the cast location to the original point of casting. |
| `Kernel` | Core reference point for casting.                          |
| `Next`   | Moves the casting location to the current target.          |
| `Direct` | Immediately casts toward the target.                       |
| `Link`   | Binds the cast location with the target location.          |
| `Self`   | Refers to the caster themselves.                           |
| `Nearby` | Targets the nearest entity.                                |
| `Differ` | Ensures the target is different from the original.         |
| `Omni`   | Casts across all valid targets.                            |
| `Swap`   | Switches the casting and target locations/entities.        |

---

## 🛠️ Modifier Runes

Modifier runes adjust the **effect properties**—speed, strength, precision, etc.

```kotlin
class Amplify(value: Double) : ModifierRune()
```

| Rune          | Description                                      | Value (Default) |
| ------------- | ------------------------------------------------ | --------------- |
| `Wide`        | Expands the casting radius.                      | 0.0             |
| `Speed`       | Increases the casting speed.                     | 0.0             |
| `Delay`       | Delays the effect after casting.                 | 0.0             |
| `Source`      | Sets the damage type and visual particle effect. | 0.0             |
| `Amplify`     | Boosts the potency (e.g., damage).               | 0.0             |
| `Convergence` | Tightens the effect's precision.                 | 0.0             |
| `Range`       | Extends the reach of the spell.                  | 0.0             |

---

## ✴️ Augment Runes

Augment runes alter the **behavior** or introduce **secondary effects** to spells.

```kotlin
data object Repeat : AugmentRune()
```

| Rune            | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| `Repeat`        | Re-casts using the original context conditions.                   |
| `Coda`          | Jumps to the beginning of a spell sequence, ignoring other codas. |
| `PickUp`        | Grabs a state or context from a previous point.                   |
| `Vulnerability` | Adds a vulnerability effect to the target.                        |
| `Light`         | Creates a light source.                                           |
| `Heal`          | Heals the target for a specific amount.                           |
| `Break`         | Applies a breaking or shattering effect.                          |
| `Teleport`      | Instantly moves the target or caster to a different location.     |

---

## 🧩 Rune Interactions

This system is **functional**, meaning that each rune modifies or passes context to the next step in a pipeline. The interplay of `Domain`, `Modifier`, and `Augment` runes enables deep, composable spellcasting logic.

For example:

```text
Self + Nearby + Amplify(3.0) + Teleport
```

> The caster targets the nearest entity, amplifies the effect, and teleports them.

---