# Requirements: Atara Open Source Maturity

## Active
| ID | Title | Status | Owner | Source |
|---|---|---|---|---|
| **R007** | Democratize AI & Dashboard | Validated | M002/S01 | User |
| **R008** | Weight Tracking Integration | Validated | M002/S02 | User |
| **R009** | Weight Visualization | Active | M002/S03 | User |

## Validated
| ID | Title | Status | Owner | Source |
|---|---|---|---|---|
| **R001** | Fix: Fasting Duration | Validated | M001/S01 | User |
| **R002** | Fix: Notification Logic | Validated | M001/S02 | User |
| **R003** | Integration: Free AI Model | Validated | M001/S03 | User |
| **R004** | Architecture: Feature Flags | Validated | M001/S03 | User |
| **R005** | Security: Open Source Preparation | Validated | M001/S03 | User |

## Deferred
| ID | Title | Status | Owner | Source |
|---|---|---|---|---|
| **R006** | Server-side Push | Deferred | N/A | Inferred |

## Out of Scope
- Native iOS/Android Apps
- Cloud Sync (currently limited by privacy-first local storage model)

## Traceability
- **R007:** Replaces PremiumGate logic with usage quotas (1/day) and entry requirements (5 fasts).
- **R008:** Adds optional `weight` property to `FastingRecord` with +/- 1kg UI controls.
- **R009:** Visualizes weight over time in the Info tab using Recharts.
