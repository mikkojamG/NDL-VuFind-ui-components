#### Description

Tabs component with content loaded dynamically from feed.

#### Properties

| Prop         | Type       | Required |
| ------------ | ---------- | -------- |
| tablistId    | `String`   | Yes      |
| tablistLabel | `String`   | Yes      |
| tabs         | `Object[]` | Yes      |

#### Child components

- `01-molecules/01-navigation/_tabs.phtml`

#### Rendering

**Rendering with a helper function is supported:**

```
<?= $this->feedTabs(['title' => 'Tabs feed with heading', 'ids' => ['Feed tab 1' => 'tab1', 'Feed tab 2' => 'tab2', 'Feed tab 3' => 'tab3']]) ?>
```
